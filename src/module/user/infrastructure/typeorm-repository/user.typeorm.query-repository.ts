import { IUserQueryRepository } from '../interfaces/user.query-repository.interface';
import { Injectable } from '@nestjs/common';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { UserDto } from '../../dto/user.dto';
import { UserQueryPaginationDto } from '../../dto/user.query.pagination.dto';
import { UserViewModel } from '../../model/user.view.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserTypeormQueryRepository implements IUserQueryRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  finUserByNewPasswordRecoveryCode(code: string) {}


  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return  this.userRepo.findOneBy({ login: email });

  }

  findUserByEmailRecoveryCode(code: string): Promise<{
    id: string;
    isConfirmed: string;
    confirmationCode: string;
  } | null> {
    return Promise.resolve(null);
  }

  async findUserByLogin(login: string): Promise<UserEntity| null> {
    return  this.userRepo.findOneBy({ login: login });
  }

  findUserLoginOrEmail(loginOrEmail: string): Promise<UserDto | null> {
    return Promise.resolve(null);
  }

  getAllUsers(
    query: UserQueryPaginationDto,
  ): Promise<PaginationViewModel<UserViewModel[]>> {
    return Promise.resolve(
      new PaginationViewModel<UserViewModel[]>(1, 1, 1, []),
    );
  }

  getUserByID(userId: string): Promise<UserViewModel | null> {
    return Promise.resolve(null);
  }
}