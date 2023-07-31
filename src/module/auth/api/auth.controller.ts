import {
  Body,
  Controller, HttpCode, HttpStatus,
  Ip,
  Post,
  Res,
  UnauthorizedException
} from "@nestjs/common";
import { PasswordRecoveryDto } from '../dto/password.recovery.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../application/auth.service';
import { Response } from 'express';
import { UserAgent } from '../../../decorators/user.agent.decorator';
import { SkipThrottle } from "@nestjs/throttler";
import { CreateUserDto } from "../../user/dto/create.user.dto";
import { RegistrationDto } from "../dto/registration.dto";

// @SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginUser(loginDto, ip, userAgent);
    if (!result) throw new UnauthorizedException();

    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, });
    return { accessToken: result.accessToken };
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationDto) {
    const resultRegistration = await this.authService.registrationUser(registrationDto)
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() recoveryDto: PasswordRecoveryDto) {}
}
