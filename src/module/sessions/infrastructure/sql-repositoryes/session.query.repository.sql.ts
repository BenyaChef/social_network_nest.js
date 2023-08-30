import { ISessionQueryRepository } from '../interfaces/session.query-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceViewModel } from "../../model/device.view.model";

@Injectable()
export class SessionQueryRepositorySql implements ISessionQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllDeviceCurrentUser(userId: string): Promise<DeviceViewModel> {
    const resultFindDevices = await this.dataSource.query(
      `SELECT "Ip" AS "ip", "Title" AS "title", "DeviceId" AS "deviceId", "LastActiveDate" AS "lastActiveDate"
    FROM public."Sessions"
    WHERE "UserId" = $1`,
      [userId],
    );
    return resultFindDevices.map(d => {
      return {
        ip: d.ip,
        title: d.title,
        lastActiveDate: d.lastActiveDate,
        deviceId: d.deviceId
      }
    })
  }

  async getDeviceByDateUserIdAndDeviceId(
    lastActiveDate: string,
    userId: string,
    deviceId: string,
  ) {
    const result = await this.dataSource.query(
      `
           SELECT * 
           FROM public."Sessions"
           WHERE "LastActiveDate"=$1 AND "UserId"=$2 AND "DeviceId"=$3`,
      [lastActiveDate, userId, deviceId],
    );
    return result[0];
  }
}
