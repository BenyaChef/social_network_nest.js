import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserQueryPaginationDto } from '../../dto/user.query.pagination.dto';

@Injectable()
export class UserQueryRepositorySql {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllUsers(query: UserQueryPaginationDto) {
    const users = await this.dataSource.query(
      `SELECT "Id", "Login", "Email", "PasswordHash", "createdAt"
      FROM public."Users";`
    )
    return users.map(user => user = {
      id: user.Id,
      login: user.Login,
      email: user.Email
    })
  }
}

