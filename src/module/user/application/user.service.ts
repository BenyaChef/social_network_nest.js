import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create.user.dto';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { IUserRepository } from '../infrastructure/interfaces/user-repository.interface';
import { UserEntity } from '../entities/user.entity';
import { EmailConfirmationInfo } from '../entities/user.email-confirmation.entity';
import { PasswordRecoveryInfo } from '../entities/user.password-recovery.entity';
import { NewUserData } from '../dto/user.new-data.dto';

@Injectable()
export class UserService {
  constructor(protected userRepository: IUserRepository) {}

  async createUser(createDto: CreateUserDto): Promise<NewUserData> {
    const passwordHash = await this.generatorHash(createDto.password);
    const newUser: UserEntity = new UserEntity();
    newUser.id = randomUUID();
    newUser.login = createDto.login;
    newUser.email = createDto.email;
    newUser.passwordHash = passwordHash;
    newUser.isConfirmed = false;
    newUser.createdAt = new Date().toISOString()

    const userEmailInfo: EmailConfirmationInfo = new EmailConfirmationInfo();
    userEmailInfo.user = newUser;
    userEmailInfo.confirmationCode = randomUUID();

    const passwordRecoveryInfo: PasswordRecoveryInfo =
      new PasswordRecoveryInfo();
    passwordRecoveryInfo.user = newUser;
    passwordRecoveryInfo.isConfirmed = true;
    passwordRecoveryInfo.recoveryCode = null;

    return {
      user: newUser,
      emailInfo: userEmailInfo,
      recoveryInfo: passwordRecoveryInfo,
    };
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
