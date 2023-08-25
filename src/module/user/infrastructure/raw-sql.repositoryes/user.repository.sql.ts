import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { DataSource } from 'typeorm';
import { BanInfo, User } from '../../schema/user.schema';
import { randomUUID } from "crypto";

@Injectable()
export class UserRepositorySql implements IUserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getUserById(userId: string): Promise<User | null> {
    return new User();
  }

  async createUser(newUser: User): Promise<string> {
    const result = await this.dataSource.query(
      `INSERT INTO public."Users"(
       "Id", "Email", "Login", "CreatedAt", "PasswordHash")
    VALUES ($1, $2, $3, $4, $5);`,
      [
        newUser.id,
        newUser.accountData.email,
        newUser.accountData.login,
        newUser.accountData.createdAt,
        newUser.accountData.passwordHash,
      ],
    );
    await this.dataSource.query(
      `INSERT INTO public."EmailInfo"(
      "Id", "UserId", "IsConfirmed", "ConfirmationCode")
VALUES ($1, $2, $3, $4)`,
      [ randomUUID(),
        newUser.id,
        newUser.emailInfo.isConfirmed,
        newUser.emailInfo.confirmationCode,
      ],
    );
    return 'true';
  }

  async deleteUser(userId: string): Promise<boolean> {
    return true;
  }

  async updateEmailConfirmationCode(
    userId: string,
    newConfirmationCode: string,
  ) {}

  async updateConfirmationStatus(userId: string) {}

  async assignNewPassword(userId: string, newPasswordHash: string) {}

  async recoveryPassword(userId: string, newRecoveryPassword: string) {}

  async banOrUnbanUser(userId: string, updateBanInfoDto: BanInfo) {
    return;
  }
}
