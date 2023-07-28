import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  private secretKey = this.configService.get<string>('SECRET_KEY')
  private expireAccessToken = this.configService.get<string>('EXPIRATION_ACCESS')
  private expireRefreshToken = this.configService.get<string>('EXPIRATION_REFRESH')

  async createJwt(userId: string, deviceId: string) {
    const accessToken = await jwt.sign({ userId: userId }, this.secretKey, {expiresIn: this.expireAccessToken});
    const refreshToken = await jwt.sign({ userId: userId, deviceId: deviceId }, this.secretKey, {expiresIn: this.expireRefreshToken});
    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  async decodeToken(token: string): Promise<string> {
    const result = jwt.verify(token, this.secretKey)
    return result
  }

  async getIssuedAtFromRefreshToken(token: string): Promise<string> {
    const payload: any = await jwt.decode(token);
    return new Date(payload.iat * 1000).toISOString();
  }
}
