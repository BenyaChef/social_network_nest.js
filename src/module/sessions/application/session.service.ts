import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../infrastructure/session.repository';
import { Session } from "../schema/session.schema";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../../auth/application/jwt.service";
import { ResultCode } from "../../../enum/result-code.enum";

@Injectable()
export class SessionService {
  constructor(protected sessionRepository: SessionRepository,
              protected tokenService: TokenService,) {}

  async createSession(newSession: Session) {
    return this.sessionRepository.createSession(newSession)
  }

  async logout(refreshToke: string) {
    const jwtPayload: JwtPayload | null = await this.tokenService.decode(refreshToke)
    if(!jwtPayload) return
    const userId = jwtPayload.sub
    const deviceId = jwtPayload.deviceId
    const lastActiveDate = new Date(jwtPayload.iat! * 1000).toISOString()
    return this.sessionRepository.logout(lastActiveDate, userId!, deviceId)
  }

  async updateLastActiveDate(userId: string, deviceId: string, newLastActiveDate: string) {
    return this.sessionRepository.updateLastActiveDate(userId, deviceId, newLastActiveDate)
  }

  async deleteAllUserSessionExceptCurrent(refreshToken: string) {
  const jwtPayload: JwtPayload | null = await this.tokenService.decode(refreshToken)
    if(!jwtPayload) return null
    return this.sessionRepository.deleteAllUserSessionExceptCurrent(jwtPayload.sub!, jwtPayload.deviceId!)
  }

  async deleteSessionsByDeviceId(refreshToke: string, deviceId: string) {
    const jwtPayload = await this.tokenService.decode(refreshToke)
    if(!jwtPayload) return ResultCode.NotFound
    const session = await this.sessionRepository.getSessionByDeviceId(deviceId)
    if(!session) return ResultCode.NotFound
    if(session.userId !== jwtPayload.sub) return ResultCode.Forbidden
     const deleteResult = await this.sessionRepository.deleteSessionByDeviceIdAndUserId(deviceId, jwtPayload.sub)
    if(!deleteResult) return ResultCode.NotFound
    return ResultCode.Success
  }
}