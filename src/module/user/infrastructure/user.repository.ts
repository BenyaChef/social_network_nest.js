import {Injectable} from "@nestjs/common";
import {User, UserDocument} from "../schema/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async createUser(newUser: User): Promise<string> {
        const result = await this.userModel.create(newUser);
        return result.id
    }

    async deleteUser(userId: string): Promise<boolean> {
        const resultDelete = await this.userModel.findOneAndDelete({_id: userId})
        return resultDelete !== null
    }
}