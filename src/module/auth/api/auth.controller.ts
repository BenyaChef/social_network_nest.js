import {
  Body, Controller, Get, HttpCode, HttpStatus, Ip, Post, Res, UnauthorizedException, UseGuards
} from "@nestjs/common";
import { PasswordRecoveryDto } from "../dto/password.recovery.dto";
import { LoginDto } from "../dto/login.dto";
import {  Response } from "express";
import { UserAgent } from "../../../decorators/user.agent.decorator";
import { RegistrationDto } from "../dto/registration.dto";
import { RegistrationEmailResendingDto } from "../dto/registration.email.resending.dto";
import { ConfirmationCodeDto } from "../dto/confirmation.code.dto";
import { Throttle } from "@nestjs/throttler";
import { LocalAuthGuard } from "../../../guards/auth-local.guard";
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { AuthAccessJwtGuard } from "../../../guards/auth-access.jwt.guard";
import { exceptionHandler } from "../../../exception/exception.handler";
import { NewPasswordDto } from "../dto/new-password.dto";
import { AuthRefreshJwtGuard } from "../../../guards/auth-refresh.jwt.guard";
import { RefreshToken } from "../../../decorators/refresh-token.decorator";
import { CommandBus } from "@nestjs/cqrs";
import { RegistrationUserCommand } from "../application/use-cases/registration-user.use-case";
import { IUserQueryRepository } from "../../user/infrastructure/interfaces/user.query-repository.interface";
import { LoginUserCommand } from "../application/use-cases/login-user.use-case";
import { RegistrationEmailResendingCommand } from "../application/use-cases/registration-email-resending.use-case";
import { RegistrationConfirmationCommand } from "../application/use-cases/registration-confirmation.use-case";
import { PasswordRecoveryCommand } from "../application/use-cases/password-recovery.use-case";
import { ResultCode } from "../../../enum/result-code.enum";
import { PasswordAssignCommand } from "../application/use-cases/password-assign.use-case";
import { LogoutCommand } from "../../sessions/application/use-cases/logout.use-case";
import { TokensUpdateCommand } from "../application/use-cases/tokens-update.use-case";


@Controller('auth')
export class AuthController {
  constructor(protected userQueryRepository: IUserQueryRepository,
              protected commandBus: CommandBus) {}

  @UseGuards(LocalAuthGuard)
  @Throttle(5, 10)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() userId: string
  ) {

    const user = await this.userQueryRepository.getUserByID(userId)
    if(user!.banInfo.isBanned) throw new UnauthorizedException();

    const result = await this.commandBus.execute(new LoginUserCommand(ip, userAgent, userId))
    if (!result) throw new UnauthorizedException();

    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, });
    return { accessToken: result.accessToken };
  }

  @Throttle(5, 10)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationDto) {
    return this.commandBus.execute(new RegistrationUserCommand(registrationDto))
  }

  @Throttle(5, 10)
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() resendingEmailDto: RegistrationEmailResendingDto) {
  return this.commandBus.execute(new RegistrationEmailResendingCommand(resendingEmailDto))
  }

  @Throttle(5, 10)
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmationRegistration(@Body() confirmationCodeDto: ConfirmationCodeDto) {
    return this.commandBus.execute(new RegistrationConfirmationCommand(confirmationCodeDto))
  }

  @Throttle(5, 10)
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() recoveryDto: PasswordRecoveryDto) {
    const resultRecovery: ResultCode = await this.commandBus.execute(new PasswordRecoveryCommand(recoveryDto))
    return exceptionHandler(resultRecovery)
  }

  @Throttle(5, 10)
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignNewPassword(@Body() newPasswordDto: NewPasswordDto) {
    const result = await this.commandBus.execute(new PasswordAssignCommand(newPasswordDto))
    return exceptionHandler(result)
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response) {

    const resultUpdateTokens = await this.commandBus.execute(new TokensUpdateCommand(refreshToken))
    if(!resultUpdateTokens) throw new UnauthorizedException()
    res.cookie('refreshToken', resultUpdateTokens.refreshToken, { httpOnly: true, secure: true, });
    return { accessToken: resultUpdateTokens.accessToken };
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@RefreshToken() refreshToken: string) {
    const resultLogout = await this.commandBus.execute(new LogoutCommand(refreshToken))
    if (!resultLogout) throw new UnauthorizedException()
    return resultLogout
  }

  @UseGuards(AuthAccessJwtGuard)
  @Get('me')
  async getProfile(@CurrentUser() userId: string){
    const user = await this.userQueryRepository.getUserByID(userId)
    if(!user) throw new UnauthorizedException()
    return {
      email: user.email,
      login: user.login,
      userId: user.id
    }
  }
}
