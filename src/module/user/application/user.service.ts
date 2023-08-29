import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create.user.dto';
import bcrypt from 'bcrypt';
import { User } from '../schema/user.schema';
import { randomUUID } from 'crypto';
import { IUserRepository } from "../infrastructure/interfaces/user-repository.interface";

@Injectable()
export class UserService {
  constructor(
    protected userRepository: IUserRepository,
  ) {}

  async createUser(createDto: CreateUserDto): Promise<User> {
    const passwordHash = await this.generatorHash(createDto.password);
    const newUser: User = {
      id: randomUUID(),
      accountData: {
        login: createDto.login,
        email: createDto.email,
        createdAt: new Date().toISOString(),
        passwordHash: passwordHash
      },
      emailInfo: {
        isConfirmed: false,
        confirmationCode: randomUUID()
      },
      passwordRecoveryInfo: {
        isConfirmed: true,
        recoveryCode: null
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null
      }
    };
    return newUser;
  }

  async assignNewPassword(newPassword: string, userId: string) {
    const newPasswordHash = await this.generatorHash(newPassword);
    return this.userRepository.assignNewPassword(userId, newPasswordHash);
  }

  async generatorHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
