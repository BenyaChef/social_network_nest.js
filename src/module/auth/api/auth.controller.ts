import {
  Body,
  Controller,
  Ip,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordRecoveryDto } from '../dto/password.recovery.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../application/auth.service';
import { Response } from 'express';
import { UserAgent } from '../../../decorators/user.agent.decorator';
import { SkipThrottle } from "@nestjs/throttler";

@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('login')
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

  @Post('password-recovery')
  async passwordRecovery(@Body() recoveryDto: PasswordRecoveryDto) {}
}
