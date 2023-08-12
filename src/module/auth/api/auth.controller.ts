import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post, Req,
  Res,
  UnauthorizedException, UseGuards
} from "@nestjs/common";
import { PasswordRecoveryDto } from "../dto/password.recovery.dto";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../application/auth.service";
import {  Response } from "express";
import { UserAgent } from "../../../decorators/user.agent.decorator";
import { RegistrationDto } from "../dto/registration.dto";
import { RegistrationEmailResendingDto } from "../dto/registration.email.resending.dto";
import { ConfirmationCodeDto } from "../dto/confirmation.code.dto";
import { ThrottlerGuard } from "@nestjs/throttler";
import { LocalAuthGuard } from "../../../guards/auth-local.guard";

import { CurrentUser } from "../../../decorators/current-user.decorator";
import { AuthAccessJwtGuard } from "../../../guards/auth-access.jwt.guard";
import { UserQueryRepository } from "../../user/infrastructure/user.query.repository";
import { exceptionHandler } from "../../../exception/exception.handler";
import { NewPasswordDto } from "../dto/new-password.dto";
import { AuthRefreshJwtGuard } from "../../../guards/auth-refresh.jwt.guard";
import { RefreshToken } from "../../../decorators/refresh-token.decorator";
import { SessionService } from "../../sessions/application/session.service";


@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService,
              protected userQueryRepository: UserQueryRepository,
              protected sessionService: SessionService) {}

  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() userId: string
  ) {

    const result = await this.authService.loginUser(ip, userAgent, userId);
    if (!result) throw new UnauthorizedException();

    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, });
    return { accessToken: result.accessToken };
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationDto) {
    return await this.authService.registrationUser(registrationDto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() resendingEmailDto: RegistrationEmailResendingDto) {
   return this.authService.registrationResendingEmail(resendingEmailDto.email);
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmationRegistration(@Body() confirmationCodeDto: ConfirmationCodeDto) {
    return this.authService.confirmationRegistration(confirmationCodeDto.code)
  }

  @UseGuards(ThrottlerGuard)
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() recoveryDto: PasswordRecoveryDto) {
    const resultRecovery = await this.authService.passwordRecovery(recoveryDto.email)
    return exceptionHandler(resultRecovery)
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Post('refresh-token')
  async refreshToken(@RefreshToken() token: string, @Res({ passthrough: true }) res: Response) {
      const resultUpdateTokens = await this.authService.refreshToken(token)
  }

  @UseGuards(ThrottlerGuard)
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignNewPassword(@Body() newPasswordDto: NewPasswordDto) {
    const result = await this.authService.assignNewPassword(newPasswordDto)
    return exceptionHandler(result)
  }

  @UseGuards(AuthRefreshJwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@RefreshToken() refreshToken: string) {
    const resultLogout = await this.sessionService.logout(refreshToken)
    return exceptionHandler(resultLogout)
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
