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

@Injectable()
export class UserTypeormQueryRepository implements IUserQueryRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  finUserByNewPasswordRecoveryCode(code: string) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOneBy({ email: email });
  }

  async findUserByEmailRecoveryCode(code: string): Promise<{id, isConfirmed} | null> {
    const findUser = await this.dataSource
      .getRepository(EmailConfirmationInfo)
      .createQueryBuilder('eci')
      .where('eci.confirmationCode = :code', { code })
      .leftJoinAndSelect('eci.user', 'user')
      .getOne();

    if(!findUser) return null
    return {
      id: findUser.userId,
      isConfirmed: findUser.user.isConfirmed,
    }
  }

  async findUserByLogin(login: string): Promise<UserEntity | null> {
    return this.userRepo.findOneBy({ login: login });
  }

  findUserLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null> {
    return this.userRepo
      .createQueryBuilder('u')
      .where('u.login = :loginOrEmail OR u.email = :loginOrEmail', {
        loginOrEmail,
      })
      .getOne();
  }

  getAllUsers(
    query: UserQueryPaginationDto,
  ): Promise<PaginationViewModel<UserViewModel[]>> {
    return Promise.resolve(
      new PaginationViewModel<UserViewModel[]>(1, 1, 1, []),
    );
  }

 async getUserByID(userId: string): Promise<UserViewModel | null> {
    const user = await this.userRepo.findOneBy({id: userId})
   if(!user) return null
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt
   }
  }
}