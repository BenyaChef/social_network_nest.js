import { IUserRepository } from '../interfaces/user-repository.interface';
import { BanInfo } from '../../schema/user.schema';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { EmailConfirmationInfo } from '../../entities/user.email-confirmation.entity';
import { NewUserData } from '../../dto/user.new-data.dto';
import { PasswordRecoveryInfo } from '../../entities/user.password-recovery.entity';

export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) readonly userRepo: Repository<UserEntity>,
    @InjectDataSource() readonly dataSource: DataSource,
  ) {}

  assignNewPassword(userId: string, newPasswordHash: string) {}

  banOrUnbanUser(userId: string, updateBanInfoDto: BanInfo) {}

  async createUser(newUserData: NewUserData): Promise<boolean> {
    try {
      await this.dataSource.manager.transaction(async (manger) => {
        await manger.save<UserEntity>(newUserData.user);
        await manger.save<EmailConfirmationInfo>(newUserData.emailInfo);
        await manger.save<PasswordRecoveryInfo>(newUserData.recoveryInfo);
      });
      return true;
    } catch (e) {
      console.log('create user transaction error: ' + e);
      return false;
    }
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

  async updateConfirmationStatus(userId: string) {
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .update(UserEntity)
          .set({ isConfirmed: true })
          .where('id = :userId', { userId })
          .execute();
        await manager
          .createQueryBuilder()
          .update(EmailConfirmationInfo)
          .set({ confirmationCode: null })
          .where('userId = :userId', { userId })
          .execute();
        return true;
      });
    } catch (e) {
      console.log('failed confirm user: ' + e);
      return null;
    }
  }

  async updateEmailConfirmationCode(
    userId: string,
    newConfirmationCode: string,
  ) {
    const updateResult = await this.dataSource
      .createQueryBuilder()
      .update(EmailConfirmationInfo)
      .set({confirmationCode: newConfirmationCode})
      .where('userId = :userId', {userId})
      .execute()
    if(!updateResult.affected) return null
    return updateResult.affected > 0;

  }
}
