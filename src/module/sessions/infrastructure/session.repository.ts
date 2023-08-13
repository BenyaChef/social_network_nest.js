import { Injectable } from '@nestjs/common';
import { Session, SessionDocument } from '../schema/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async getSessionByDeviceId(deviceId: string) {
    return this.sessionModel.findOne({deviceId: deviceId})
  }

  async createSession(newSession: Session) {
    return this.sessionModel.create(newSession)
  }

  async logout(lastActiveDate: string, userId: string, deviceId: string) {
      return this.sessionModel.findOneAndDelete({lastActiveDate: lastActiveDate, deviceId: deviceId, userId: userId})
  }

  async updateLastActiveDate(userId: string, deviceId: string, newLastActiveDate: string) {
    return this.sessionModel.findOneAndUpdate({deviceId: deviceId, userId: userId}, {$set: {lastActiveDate: newLastActiveDate}})
  }

  async deleteAllUserSessionExceptCurrent(userId: string, deviceId: string) {
    const deleteResult = await this.sessionModel.deleteOne({userId: userId, deviceId: {$ne: deviceId}})
    return deleteResult.deletedCount === 1
  }

  async deleteSessionByDeviceIdAndUserId(deviceId: string, userId: string) {
    const deleteResult = await this.sessionModel.deleteOne({userId: userId, deviceId: deviceId})
    return deleteResult.deletedCount === 1
  }
}