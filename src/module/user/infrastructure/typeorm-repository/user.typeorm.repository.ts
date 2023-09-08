import { IUserRepository } from '../interfaces/user-repository.interface';
import { BanInfo, User } from '../../schema/user.schema';
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource,  Repository } from "typeorm";
import { UserEntity } from '../../entities/user.entity';
import { randomUUID } from 'crypto';

import { EmailConfirmationInfo } from '../../entities/user.email-confirmation.entity';

export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) readonly userRepo: Repository<UserEntity>,
    @InjectDataSource() readonly dataSource: DataSource
  ) {}

  assignNewPassword(userId: string, newPasswordHash: string) {}

  banOrUnbanUser(userId: string, updateBanInfoDto: BanInfo) {}

  async createUser(newUser: User): Promise<boolean> {
    const user = new UserEntity();
    user.id = randomUUID()
    user.email = 'asd';
    user.login = 'asd';
    user.passwordHash = 'asd';

    this.dataSource.getRepository<UserEntity>(UserEntity)
    const resulCreate = await this.userRepo.createQueryBuilder().insert().into(UserEntity).values({
      id: user.id,
      login: user.login,
      email: user.email,
      passwordHash: user.passwordHash
    })
      .execute()

    return true;
  }

  deleteUser(userId: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  async getUserById(
    userId: string,
  ): Promise<{ id: string; login: string } | null> {
    return await this.userRepo.findOneBy({ id: userId });
  }

  recoveryPassword(userId: string, newRecoveryPassword: string) {}

  updateConfirmationStatus(userId: string) {}

  updateEmailConfirmationCode(userId: string, newConfirmationCode: string) {}
}
