import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ISessionRepository } from '../interfaces/session.repository.interface';
import { Session } from '../../schema/session.schema';

@Injectable()
export class SessionRepositorySql implements ISessionRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createSession(newSession: Session) {
    await this.dataSource.query(
      `INSERT INTO public."Sessions"(
"Id", "Ip", "Title", "UserId", "DeviceId", "LastActiveDate"
)
VALUES($1, $2, $3, $4, $5, $6)`,
      [
        newSession.id,
        newSession.ip,
        newSession.title,
        newSession.userId,
        newSession.deviceId,
        newSession.lastActiveDate,
      ],
    );
  }

  async deleteAllUserSessionExceptCurrent(userId: string, deviceId: string) {}

  async deleteSessionBanUser(userId: string) {}

  async deleteSessionByDeviceIdAndUserId(deviceId: string, userId: string) {}

  async getSessionByDeviceId(deviceId: string) {}

  async logout(lastActiveDate: string, userId: string, deviceId: string) {}

  async updateLastActiveDate(
    userId: string,
    deviceId: string,
    newLastActiveDate: string,
  ) {}
}