import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUserQueryRepository } from '../interfaces/user.query-repository.interface';
import { UserViewModel } from '../../model/user.view.model';
import { UserQueryPaginationDto } from '../../dto/user.query.pagination.dto';
import { User } from '../../schema/user.schema';
import { BanStatusEnum } from '../../../../enum/ban-status.enum';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';

@Injectable()
export class UserQueryRepositorySql implements IUserQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getUserByID(userId: string): Promise<UserViewModel | null> {
    const result = await this.dataSource.query(
      `
      SELECT u.*, b.*
            FROM public."Users" u
            JOIN public."BanInfo" b ON u."Id" = b."UserId"
            WHERE u."Id" = $1;`,
      [userId],
    );
    if(result.length === 0) return null
    return {
      id: result[0].Id,
      login: result[0].Login,
      email: result[0].Email,
      createdAt: result[0].CreatedAt,
      banInfo: {
        isBanned: result[0].IsBanned,
        banReason: result[0].BanReason,
        banDate: result[0].BanDate,
      },
    };
  }

  async finUserByNewPasswordRecoveryCode(code: string) {
    const result = await this.dataSource.query(
      `
    SELECT u.*
    FROM public."Users" u
    WHERE u."Id" = (
      SELECT "UserId"
      FROM public."PasswordRecoveryInfo"
      WHERE "RecoveryCode" = $1
      LIMIT 1
    )
  `,
      [code],
    );
    if (result.length === 0) return null;
    return result[0].Id;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.dataSource.query(
      `SELECT u.*, e.*
       FROM public."Users" u
       JOIN public."EmailInfo" e ON u."Id" = e."UserId" 
       WHERE "Email" = $1`,
      [email],
    );

    if (result.length === 0) return null;

    const findUser = result[0];
    return {
      id: findUser.Id,
      accountData: {
        email: findUser.Email,
        login: findUser.Login,
        createdAt: findUser.CreatedAt,
        passwordHash: findUser.PasswordHash,
      },
      emailInfo: {
        isConfirmed: findUser.IsConfirmed,
        confirmationCode: findUser.ConfirmationCode,
      },
      passwordRecoveryInfo: {
        recoveryCode: null,
        isConfirmed: true,
      },
      banInfo: {
        isBanned: false,
        banReason: null,
        banDate: null,
      },
    };
  }

  async findUserByEmailRecoveryCode(code: string): Promise<any | null> {
    const result = await this.dataSource.query(
      `SELECT *
        FROM "EmailInfo"
        WHERE "ConfirmationCode" = $1`,
      [code],
    );
    if (result.length === 0) return null;
    return {
      id: result[0].UserId,
      isConfirmed: result[0].IsConfirmed,
      confirmationCode: result[0].ConfirmationCode,
    };
  }

  async findUserByLogin(login: string): Promise<string | null> {
    const result = await this.dataSource.query(
      `SELECT * FROM public."Users" WHERE "Login" = $1`,
      [login],
    );
    if (result.length === 0) return null;
    return result[0].Login;
  }

  async findUserLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    const result = await this.dataSource.query(
      `SELECT * FROM public."Users"
    WHERE "Login" = $1 OR "Email" = $1`,
      [loginOrEmail],
    );
    if (result.length === 0) return null;

    return {
      id: result[0].Id,
      accountData: {
        email: result[0].Email,
        login: result[0].Login,
        createdAt: result[0].CreatedAt,
        passwordHash: result[0].PasswordHash,
      },
      emailInfo: {
        isConfirmed: false,
        confirmationCode: null,
      },
      passwordRecoveryInfo: {
        recoveryCode: null,
        isConfirmed: true,
      },
      banInfo: {
        isBanned: false,
        banReason: null,
        banDate: null,
      },
    };
  }

  async getAllUsers(query: UserQueryPaginationDto) {
    const {
      banStatus,
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = query;
    const offset = (pageNumber - 1) * pageSize;

    const bannedStatus = this.getBanStatusFilter(banStatus);

    const sortDirectionFilter = sortDirection === -1 ? 'DESC' : 'ASC';
    const loginFilter = searchLoginTerm !== null ? `%${searchLoginTerm}%` : `%`;
    const emailFilter = searchEmailTerm !== null ? `%${searchEmailTerm}%` : `%`;
    const totalCount = await this.dataSource.query(
      `
    SELECT COUNT(*)
    FROM public."Users" u
    LEFT JOIN public."BanInfo" b ON u."Id" = b."UserId"
    WHERE (u."Login" ILIKE $1 OR u."Email" ILIKE $2) AND (b."IsBanned" = ANY ($3))`,
      [loginFilter, emailFilter, bannedStatus],
    );

    const users = await this.dataSource.query(
      `
    SELECT u.*, b.*
    FROM public."Users" u
    LEFT JOIN public."BanInfo" b ON u."Id" = b."UserId"
    WHERE (u."Login" ILIKE $1 OR u."Email" ILIKE $2)  AND  (b."IsBanned" = ANY ($3))
    ORDER BY u."${sortBy}" COLLATE "C" ${sortDirectionFilter}
    OFFSET $4
    LIMIT $5
    `,
      [loginFilter, emailFilter, bannedStatus, offset, pageSize],
    );

    const viewUsers = users.map((u) => {
      return {
        id: u.Id,
        login: u.Login,
        email: u.Email,
        createdAt: u.CreatedAt,
        banInfo: {
          isBanned: u.IsBanned,
          banDate: u.BanDate,
          banReason: u.BanReason,
        },
      };
    });
    return new PaginationViewModel(
      +totalCount[0].count,
      pageNumber,
      pageSize,
      viewUsers
    );
  }

  private getBanStatusFilter(banStatus: BanStatusEnum) {
    switch (banStatus) {
      case BanStatusEnum.banned:
        return [true];
      case BanStatusEnum.notBanned:
        return [false] ;
      default:
        return [true, false];
    }
  }
}
