import { SessionUser } from "../../entities/session.entity";


export abstract class ISessionRepository {

  abstract getSessionByDeviceId(deviceId: string)

  abstract createSession(newSession: SessionUser)

  abstract logout(lastActiveDate: string, userId: string, deviceId: string): Promise<boolean>

  abstract updateLastActiveDate(userId: string, deviceId: string, newLastActiveDate: string)

  abstract deleteAllUserSessionExceptCurrent(userId: string, deviceId: string): Promise<boolean>

  abstract deleteSessionByDeviceIdAndUserId(deviceId: string, userId: string): Promise<boolean>

  abstract deleteSessionBanUser(userId: string)
}