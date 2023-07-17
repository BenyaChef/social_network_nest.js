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

    @Prop({default: () => new Date().toISOString()})
    createAt: string

    static createUser(createDto: CreateUserDto, hash: string): User {
        const newUser = new User()
        newUser.passwordHash = hash
        newUser.login = createDto.login
        newUser.email = createDto.email
        newUser.createAt = new Date().toISOString()
        return newUser
    }
}

export const UserSchema = SchemaFactory.createForClass(User)

export type UserDocument = HydratedDocument<User>