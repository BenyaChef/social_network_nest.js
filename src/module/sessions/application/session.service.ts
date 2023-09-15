import { Injectable } from '@nestjs/common';
import { Session } from '../schema/session.schema';
import { TokenService } from '../../auth/application/jwt.service';
import { ISessionRepository } from '../infrastructure/interfaces/session.repository.interface';
import { randomUUID } from 'crypto';
import { SessionUser } from '../entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    protected sessionRepository: ISessionRepository,
    protected tokenService: TokenService,
  ) {}

  async createSession(
    ip: string,
    userAgent: string,
    userId: string,
    refreshToken: string,
  ) {
    const decodeToken = await this.tokenService.decode(refreshToken);
    const lastActiveDate = await this.tokenService.getLastActiveDate(
      refreshToken,
    );
    const newSession: SessionUser = new SessionUser();
    newSession.ip = ip
    newSession.title = userAgent;
    newSession.lastActiveDate = lastActiveDate;
    newSession.deviceId = decodeToken!.deviceId;
    newSession.userId = userId;

    return this.sessionRepository.createSession(newSession);
  }
}
