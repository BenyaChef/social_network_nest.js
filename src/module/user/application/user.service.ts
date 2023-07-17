import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "../dto/create.user.dto";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {

    async createUser(createDto: CreateUserDto) {

    }

    private async generatorHash(password: string) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }
}``