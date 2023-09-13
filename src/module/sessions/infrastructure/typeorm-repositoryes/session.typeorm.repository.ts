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

  async createSession(newSession: Session) {
    return this.sessionRepository.save(newSession);
  }

  async deleteAllUserSessionExceptCurrent(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const deleteResult = await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .from(SessionUser)
      .where('userId = :userId AND deviceId != :deviceId', { userId, deviceId })
      .execute();
    return deleteResult.affected! > 0;
  }

  deleteSessionBanUser(userId: string) {}

  async deleteSessionByDeviceIdAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const deleteResult = await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where(`userId = :userId AND deviceId = :deviceId`,
        { userId, deviceId })
      .execute()
    return deleteResult.affected! > 0
  }

  async getSessionByDeviceId(deviceId: string) {
    return this.sessionRepository.findOneBy({ deviceId: deviceId });
  }

  async logout(
    lastActiveDate: string,
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const logoutResult = await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where(
        `lastActiveDate = :lastActiveDate 
              AND userId = :userId 
              AND deviceId = :deviceId`,
        { lastActiveDate, userId, deviceId },
      )
      .execute();
    return logoutResult.affected! > 0;
  }

  updateLastActiveDate(
    userId: string,
    deviceId: string,
    newLastActiveDate: string,
  ) {
    return this.sessionRepository
      .createQueryBuilder()
      .where('userId = :userId AND deviceId = :deviceId', { userId, deviceId })
      .update()
      .set({ lastActiveDate: newLastActiveDate })
      .execute();
  }
}
