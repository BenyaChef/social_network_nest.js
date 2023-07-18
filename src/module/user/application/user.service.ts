import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "../dto/create.user.dto";
import bcrypt from "bcrypt";
import {User} from "../schema/user.schema";
import {UserRepository} from "../infrastructure/user.repository";

@Injectable()
export class UserService {
    constructor(protected userRepository: UserRepository) {
    }

    async createUser(createDto: CreateUserDto) {
        const passwordHash = await this.generatorHash(createDto.password)
        const newUser = User.createUser(createDto, passwordHash)
        return this.userRepository.createUser(newUser)

    }

    async deleteUser(userId: string): Promise<boolean> {
        return this.userRepository.deleteUser(userId)
    }

    private async generatorHash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }
}