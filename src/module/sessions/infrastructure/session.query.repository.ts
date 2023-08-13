import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from '../schema/session.schema';
import { Model } from 'mongoose';

@Injectable()
export class SessionQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async getDeviceByDateUserIdAndDeviceId(
    lastActiveDate: string,
    userId: string,
    deviceId: string,
  ) {
    return this.sessionModel
      .findOne({
        lastActiveDate: lastActiveDate,
        userId: userId,
        deviceId: deviceId,
      })
      .exec();
  }

  async getAllDeviceCurrentUser(userId: string) {
    return this.sessionModel
      .find(
        { userId },
        { _id: 0, ip: 1, title: 1, lastActiveDate: 1, deviceId: 1 },
      )
  }
}