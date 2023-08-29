import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { DataSource } from 'typeorm';
import { BanInfo, User } from '../../schema/user.schema';

@Injectable()
export class UserRepositorySql implements IUserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getUserById(userId: string): Promise<User | null> {
    return new User();
  }

  async createUser(newUser: User): Promise<boolean> {
    try {
      await this.dataSource.query(`BEGIN`);
      await this.dataSource.query(
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
      "UserId", "IsConfirmed", "ConfirmationCode")
VALUES ($1, $2, $3)`,
        [
          newUser.id,
          newUser.emailInfo.isConfirmed,
          newUser.emailInfo.confirmationCode,
        ],
      );
      await this.dataSource.query(
        `INSERT INTO public."PasswordRecoveryInfo"("UserId", "IsConfirmed" ,"RecoveryCode")
VALUES($1, $2, $3)`,
        [
          newUser.id,
          newUser.passwordRecoveryInfo.isConfirmed,
          newUser.passwordRecoveryInfo.recoveryCode,
        ],
      );
      await this.dataSource.query(
        `INSERT INTO public."BanInfo"("UserId", "IsBanned", "BanDate", "BanReason")
VALUES($1, $2, $3, $4)`,
        [
          newUser.id,
          newUser.banInfo.isBanned,
          newUser.banInfo.banDate,
          newUser.banInfo.banReason,
        ],
      );
      await this.dataSource.query('COMMIT');
      return true;
    } catch (e) {
      console.log(`create User: ${e}`);
      await this.dataSource.query('ROLLBACK');
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.dataSource.query(`BEGIN`);
      await this.dataSource.query(
        `DELETE FROM public."BanInfo" WHERE "UserId" = $1`,
        [userId],
      );
      await this.dataSource.query(
        `DELETE FROM public."PasswordRecoveryInfo" WHERE "UserId" = $1`,
        [userId],
      );
      await this.dataSource.query(
        `DELETE FROM public."EmailInfo" WHERE "UserId" = $1`,
        [userId],
      );
      await this.dataSource.query(
        `DELETE FROM public."Users" WHERE "Id" = $1`,
        [userId],
      );
      await this.dataSource.query(`COMMIT`);
      return true;
    } catch (e) {
      console.log(`delete User: ${e}`);
      await this.dataSource.query('ROLLBACK');
      return false;
    }
  }

  async updateEmailConfirmationCode(userId: string, newConfirmationCode: string) {
    await this.dataSource.query(
      `UPDATE public."EmailInfo"
     SET "ConfirmationCode" = $1
     WHERE "UserId" = $2`,
      [newConfirmationCode, userId],
    );
    return true
  }

  async updateConfirmationStatus(userId: string) {
    await this.dataSource.query(`UPDATE public."EmailInfo"
     SET "ConfirmationCode" = null,
         "IsConfirmed" = true
     WHERE "UserId" = $1`,
     [userId])
    return true
  }

  async assignNewPassword(userId: string, newPasswordHash: string) {
    try {
      await this.dataSource.query('BEGIN')
      await this.dataSource.query(
        `UPDATE public."Users"
       SET "PasswordHash" = $1
       WHERE "Id" = $2`,
        [newPasswordHash, userId]
      );
      await this.dataSource.query(
        `UPDATE public."PasswordRecoveryInfo"
       SET "RecoveryCode" = null, "IsConfirmed" = true
       WHERE "UserId" = $1`,
        [userId]
      );

      await this.dataSource.query('COMMIT');
      return true
    } catch (e) {
      console.log(`assign new password: ${e}`);
      return null
    }
  }

  async recoveryPassword(userId: string, newRecoveryPassword: string) {
    await this.dataSource.query(`UPDATE public."PasswordRecoveryInfo"
       SET "IsConfirmed" = false, "RecoveryCode" = $1
       WHERE "UserId" = $2;`, [newRecoveryPassword, userId])
  }

  async banOrUnbanUser(userId: string, updateBanInfoDto: BanInfo) {
    return;
  }
}
