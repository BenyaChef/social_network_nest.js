import { Injectable } from '@nestjs/common';
import { Session, SessionDocument } from '../schema/session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async createSession(newSession: Session) {
    return this.sessionModel.create(newSession)
  }
}