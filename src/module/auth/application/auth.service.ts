import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/application/user.service';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from './jwt.service';
import { randomUUID } from 'crypto';
import {  UserDocument } from "../../user/schema/user.schema";
import { SessionService } from "../../sessions/application/session.service";
import { Session } from "../../sessions/schema/session.schema";
import { RegistrationDto } from "../dto/registration.dto";

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService,
    protected sessionService: SessionService
  ) {}

  async loginUser(loginDto: LoginDto, ip: string, userAgent: string) {
    const user: UserDocument | null = await this.userService.checkCredentials(loginDto)
    if(!user) return null

    const deviceId = randomUUID()
    const {accessToken, refreshToken} = await this.jwtService.createJwt(user.id, deviceId)
    const lastActiveDate = await this.jwtService.getIssuedAtFromRefreshToken(refreshToken)

    const newSession: Session = {
      ip,
      title: userAgent,
      lastActiveDate,
      deviceId,
      userId: user.id
    }
    await this.sessionService.createSession(newSession)
    return {accessToken, refreshToken}

  }

  async registrationUser(registrationDto: RegistrationDto) {
    const newUser = await this.userService.registrationUser(registrationDto)
  }
}