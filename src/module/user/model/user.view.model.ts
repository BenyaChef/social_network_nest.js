import { User } from "../schema/user.schema";

export class UserViewModel {
    id: string
    login: string
    email: string
    createdAt: Date
    constructor(user: User) {
        this.id = user.id
        this.login = user.accountData.login
        this.email = user.accountData.email
        // this.createdAt = user.accountData.createdAt

    }
}