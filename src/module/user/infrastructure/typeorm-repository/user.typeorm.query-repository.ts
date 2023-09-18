import { IUserQueryRepository } from '../interfaces/user.query-repository.interface';
import { Injectable } from '@nestjs/common';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { UserDto } from '../../dto/user.dto';
import { UserQueryPaginationDto } from '../../dto/user.query.pagination.dto';
import { UserViewModel } from '../../model/user.view.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { EmailConfirmationInfo } from '../../entities/user.email-confirmation.entity';
import { PasswordRecoveryInfo } from '../../entities/user.password-recovery.entity';
import { ColumnsAliases } from "../../../../enum/columns-alias.enum";

@Injectable()
export class UserTypeormQueryRepository implements IUserQueryRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async finUserByNewPasswordRecoveryCode(code: string) {
    return this.dataSource
      .createQueryBuilder(PasswordRecoveryInfo, 'pr')
      .select('pr.userId')
      .where(`pr.recoveryCode = :code`, { code });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOneBy({ email: email });
  }

  async findUserByEmailRecoveryCode(
    code: string,
  ): Promise<{ id; isConfirmed } | null> {
    const findUser = await this.dataSource
      .getRepository(EmailConfirmationInfo)
      .createQueryBuilder('eci')
      .where('eci.confirmationCode = :code', { code })
      .leftJoinAndSelect('eci.user', 'user')
      .getOne();

    if (!findUser) return null;
    return {
      id: findUser.userId,
      isConfirmed: findUser.user.isConfirmed,
    };
  }

  async findUserByLogin(login: string): Promise<UserEntity | null> {
    return this.userRepo.findOneBy({ login: login });
  }

  async findUserLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null> {
    return this.userRepo
      .createQueryBuilder('u')
      .where('u.login = :loginOrEmail OR u.email = :loginOrEmail', {
        loginOrEmail,
      })
      .getOne();
  }

  async getAllUsers(
    query: UserQueryPaginationDto,
  ): Promise<PaginationViewModel<UserViewModel[]>> {

    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';
    const loginFilter = query.searchLoginTerm !== null ? `%${query.searchLoginTerm}%` : `%`;
    const emailFilter = query.searchEmailTerm !== null ? `%${query.searchEmailTerm}%` : `%`;

    const queryBuilder = await this.dataSource
      .createQueryBuilder(UserEntity, 'u')
      .where('u.Login ILIKE :loginFilter OR u.Email ILIKE :emailFilter', { loginFilter, emailFilter })
      .orderBy(`u.${ColumnsAliases[query.sortBy]}`, sortDirectionFilter)

    const totalCount = await queryBuilder.getCount();
    const users = await queryBuilder
      .skip(offset)
      .take(query.pageSize)
      .getMany();

    return new PaginationViewModel<UserViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      users.map(u => {
        return {
          id: u.id.toString(),
          login: u.login,
          email: u.email,
          createdAt: u.createdAt
        }
      })
    );
  }

  async getUserByID(userId: string): Promise<UserViewModel | null> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return null;
    return {
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
