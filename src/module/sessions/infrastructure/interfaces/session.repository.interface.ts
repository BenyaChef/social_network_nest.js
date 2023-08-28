import { Session } from "../../schema/session.schema";

export abstract class ISessionRepository {

  abstract getSessionByDeviceId(deviceId: string)

  abstract createSession(newSession: Session)

  abstract logout(lastActiveDate: string, userId: string, deviceId: string)

  abstract updateLastActiveDate(userId: string, deviceId: string, newLastActiveDate: string)

  abstract deleteAllUserSessionExceptCurrent(userId: string, deviceId: string)

  abstract deleteSessionByDeviceIdAndUserId(deviceId: string, userId: string)

  abstract deleteSessionBanUser(userId: string)
}