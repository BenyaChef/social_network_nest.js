import { Injectable } from '@nestjs/common';
import { Session } from "../schema/session.schema";
import { TokenService } from "../../auth/application/jwt.service";
import { ISessionRepository } from "../infrastructure/interfaces/session.repository.interface";
import { randomUUID } from "crypto";

@Injectable()
export class SessionService {
  constructor(protected sessionRepository: ISessionRepository,
              protected tokenService: TokenService,) {}

  async createSession(ip: string, userAgent: string, userId: string, refreshToken: string) {
    const decodeToken = await this.tokenService.decode(refreshToken)
    const lastActiveDate = await this.tokenService.getLastActiveDate(refreshToken)
    const newSession: Session = {
      id: randomUUID(),
      ip,
      title: userAgent,
      lastActiveDate,
      deviceId: decodeToken!.deviceId,
      userId: userId,
    };
    return this.sessionRepository.createSession(newSession)
  }

}