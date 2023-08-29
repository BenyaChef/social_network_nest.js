export abstract class ISessionQueryRepository {

  abstract getDeviceByDateUserIdAndDeviceId(lastActiveDate: string, userId: string, deviceId: string)

  abstract getAllDeviceCurrentUser(userId: string)
}