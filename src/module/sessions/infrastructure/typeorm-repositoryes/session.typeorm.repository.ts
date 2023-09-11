import { ISessionRepository } from '../interfaces/session.repository.interface';
import { Injectable } from '@nestjs/common';
import { Session } from '../../schema/session.schema';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SessionUser } from '../../entities/session.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SessionTypeormRepository implements ISessionRepository {
  constructor(
    @InjectRepository(SessionUser)
    private sessionRepository: Repository<SessionUser>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  createSession(newSession: Session) {
    return this.sessionRepository.save(newSession);
  }

  deleteAllUserSessionExceptCurrent(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    return Promise.resolve(false);
  }

  deleteSessionBanUser(userId: string) {}

  deleteSessionByDeviceIdAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    return Promise.resolve(false);
  }

  getSessionByDeviceId(deviceId: string) {}

  logout(
    lastActiveDate: string,
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    return Promise.resolve(false);
  }

  updateLastActiveDate(
    userId: string,
    deviceId: string,
    newLastActiveDate: string,
  ) {
    return this.sessionRepository
      .createQueryBuilder()
      .where('userId = :userId AND deviceId = :deviceId', {userId, deviceId})
      .update()
      .set({lastActiveDate: newLastActiveDate})
      .execute()
  }
}