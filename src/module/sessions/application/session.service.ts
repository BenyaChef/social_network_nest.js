import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../infrastructure/session.repository';
import { Session } from "../schema/session.schema";
import { JwtPayload } from "jsonwebtoken";
import { ResultCode } from "../../../enum/result-code.enum";
import { TokenService } from "../../auth/application/jwt.service";

@Injectable()
export class SessionService {
  constructor(protected sessionRepository: SessionRepository,
              protected tokenService: TokenService,) {}

  async createSession(newSession: Session) {
    return this.sessionRepository.createSession(newSession)
  }

  async logout(refreshToke: string) {
    const jwtPayload: JwtPayload | null = await this.tokenService.decode(refreshToke)
    if(!jwtPayload) return ResultCode.NotFound
    const userId = jwtPayload.sub
    const deviceId = jwtPayload.deviceId
    const lastActiveDate = new Date(jwtPayload.iat! * 1000).toISOString()
    await this.sessionRepository.logout(lastActiveDate, userId!, deviceId)
    return ResultCode.Success
  }
}