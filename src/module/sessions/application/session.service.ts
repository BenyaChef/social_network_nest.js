import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../infrastructure/session.repository';
import { Session } from "../schema/session.schema";

@Injectable()
export class SessionService {
  constructor(protected sessionRepository: SessionRepository) {}

  async createSession(newSession: Session) {
    return this.sessionRepository.createSession(newSession)
  }
}