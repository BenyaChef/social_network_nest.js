import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import {CreateUserDto} from "../dto/create.user.dto";

@Schema()
export class User {
    @Prop()
    login: string;

    @Prop()
    passwordHash: string

    @Prop()
    email: string

    @Prop()
    createdAt: string

    static createUser(createDto: CreateUserDto, hash: string): User {
        const newUser = new User()
        newUser.passwordHash = hash
        newUser.login = createDto.login
        newUser.email = createDto.email
        newUser.createdAt = new Date().toISOString()
        return newUser
    }
}

export const UserSchema = SchemaFactory.createForClass(User)
export type UserDocument = HydratedDocument<User>

UserSchema.statics.createUser = User.createUser