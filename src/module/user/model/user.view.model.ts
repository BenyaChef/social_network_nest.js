import { BanInfo, UserDocument } from "../schema/user.schema";

export class UserViewModel {
    id: string
    login: string
    email: string
    createdAt: string
    banInfo: BanInfo
    constructor(user: UserDocument) {
        this.id = user.id
        this.login = user.accountData.login
        this.email = user.accountData.email
        this.createdAt = user.accountData.createdAt
        this.banInfo = {
            isBanned: user.banInfo.isBanned,
            banReason: user.banInfo.banReason,
            banDate: user.banInfo.banDate
        }
    }
}