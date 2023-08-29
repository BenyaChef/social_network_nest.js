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

  async deleteAllUserSessionExceptCurrent(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `DELETE FROM public."Sessions"
          WHERE "UserId" = $1 AND "DeviceId" <> $2`,
      [userId, deviceId],
    );
    return result[1] > 0;
  }

  async deleteSessionBanUser(userId: string) {}

  async deleteSessionByDeviceIdAndUserId(deviceId: string, userId: string): Promise<boolean> {
    const deleteResult = await this.dataSource.query(`
        DELETE 
            FROM public."Sessions"
            WHERE "DeviceId" = $1 AND "UserId" = $2;`,
      [deviceId, userId]);
    return deleteResult[1]  > 0
  }

  async getSessionByDeviceId(deviceId: string) {
    const result = await this.dataSource.query(
      `SELECT "UserId" AS "userId"
        FROM public."Sessions"
        WHERE "DeviceId" = $1`,
      [deviceId],
    );
    return result[0];
  }

  async logout(
    lastActiveDate: string,
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `
        DELETE FROM public."Sessions"
        WHERE "LastActiveDate" = $1 AND "UserId" = $2 AND "DeviceId" = $3`,
      [lastActiveDate, userId, deviceId],
    );
    return result[1] > 0;
  }

  async updateLastActiveDate(
    userId: string,
    deviceId: string,
    newLastActiveDate: string,
  ) {
    return this.dataSource.query(
      `
        UPDATE public."Sessions" 
        SET "LastActiveDate" = $3
        WHERE "UserId" = $1 AND "DeviceId" = $2`,
      [userId, deviceId, newLastActiveDate],
    );
  }
}
