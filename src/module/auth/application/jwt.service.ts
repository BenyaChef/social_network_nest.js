import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";
import { randomUUID } from "crypto";


@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService,
              private readonly jwtService: JwtService) {}

  private secretKey = this.configService.get<string>('SECRET_KEY')
  private expireAccessToken = this.configService.get<string>('EXPIRATION_ACCESS')
  private expireRefreshToken = this.configService.get<string>('EXPIRATION_REFRESH')
  private deviceId = randomUUID()


  async createJwt(userId: string) {
    const accessToken = this.jwtService.sign({ sub: userId }, {secret: this.secretKey, expiresIn: this.expireAccessToken})
    const refreshToken = this.jwtService.sign({ sub: userId, deviceId: this.deviceId }, {secret: this.secretKey, expiresIn: this.expireRefreshToken})
    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  async getLastActiveDate(token: string): Promise<string> {
    const payload: any = await this.jwtService.decode(token);
    return new Date(payload.iat * 1000).toISOString();
  }

  async decode(token: string) {
    try {
     return this.jwtService.verify(token, { secret: this.secretKey }) as JwtPayload
    }catch (e) {
      return null
    }
  }
}
