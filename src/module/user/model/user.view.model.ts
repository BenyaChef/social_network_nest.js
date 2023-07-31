import {UserDocument} from "../schema/user.schema";

export class UserViewModel {
    id: string
    login: string
    email: string
    createdAt: string
    constructor(user: UserDocument) {
        this.id = user._id.toString()
        this.login = user.accountData.login
        this.email = user.accountData.email
        this.createdAt = user.accountData.createdAt
    }
}