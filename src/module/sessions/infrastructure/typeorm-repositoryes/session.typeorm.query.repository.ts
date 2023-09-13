import { ISessionQueryRepository } from '../interfaces/session.query-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionUser } from '../../entities/session.entity';

@Injectable()
export class SessionTypeormQueryRepository implements ISessionQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllDeviceCurrentUser(userId: string) {
    return this.dataSource
      .createQueryBuilder(SessionUser, 'su')
      .select([`su.ip as "ip"`,
        `su.title as "title"`,
        `su.lastActiveDate as "lastActiveDate"`,
        `su.deviceId as "deviceId"`])
      .where('su.userId = :userId', { userId })
      .getRawMany()

  }

  getDeviceByDateUserIdAndDeviceId(
    lastActiveDate: string,
    userId: string,
    deviceId: string,
  ) {
    return this.dataSource
      .getRepository(SessionUser)
      .createQueryBuilder('su')
      .where(
        'su.lastActiveDate = :lastActiveDate AND su.userId = :userId AND su.deviceId = :deviceId',
        {
          lastActiveDate,
          userId,
          deviceId,
        },
      )
      .getOne();
  }
}
