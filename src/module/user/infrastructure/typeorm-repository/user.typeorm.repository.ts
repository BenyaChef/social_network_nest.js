import { IUserRepository } from '../interfaces/user-repository.interface';
import { BanInfo, User } from '../../schema/user.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { randomUUID } from 'crypto';
import { PasswordRecoveryInfo } from '../../entities/user.password-recovery.entity';
import { EmailConfirmationInfo } from '../../entities/user.email-confirmation.entity';

export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) readonly userRepo: Repository<UserEntity>,
  ) {}

  assignNewPassword(userId: string, newPasswordHash: string) {}

  banOrUnbanUser(userId: string, updateBanInfoDto: BanInfo) {}

  async createUser(newUser: User): Promise<boolean> {
    const user = new UserEntity();
    user.id = randomUUID()
    user.email = 'asd';
    user.login = 'asd';
    user.passwordHash = 'asd';
    const emailInfo = new EmailConfirmationInfo();
    emailInfo.confirmationCode = randomUUID();
    emailInfo.isConfirmed = false;
    const resulCreate = await this.userRepo.manager.transaction<UserEntity>(
      async (transactionalEntityManager: EntityManager): Promise<UserEntity> => {
        await transactionalEntityManager.save(user);
        await transactionalEntityManager.save(emailInfo);
        return user
      },
    );
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
