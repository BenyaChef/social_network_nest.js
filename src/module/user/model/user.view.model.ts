import {UserDocument} from "../schema/user.schema";

export class UserViewModel {
    id: string
    login: string
    email: string
    createdAt: string
    constructor(user: UserDocument) {
        this.id = user._id.toString()
        this.login = user.login
        this.email =user.email
        this.createdAt = user.createdAt
    }
}