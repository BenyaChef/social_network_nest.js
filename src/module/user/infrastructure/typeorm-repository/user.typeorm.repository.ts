import { IUserRepository } from "../interfaces/user-repository.interface";
import { BanInfo, User } from "../../schema/user.schema";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { randomUUID } from "crypto";
import { EmailConfirmationInfo } from "../../entities/user.email-confirmation.entity";


export class UserTypeormRepository implements IUserRepository {
  constructor(@InjectRepository(UserEntity) readonly userRepo: Repository<UserEntity>, @InjectDataSource() readonly dataSource: DataSource) {
  }

  assignNewPassword(userId: string, newPasswordHash: string) {
  }

  banOrUnbanUser(userId: string, updateBanInfoDto: BanInfo) {
  }

  async createUser(newUser: User): Promise<boolean> {
    const user: UserEntity = new UserEntity();
    user.id = randomUUID()
    user.passwordHash = "asd";
    user.email = "asd";
    user.login = 'asd';
    const emailInfo = new EmailConfirmationInfo()
    emailInfo.user = user
    emailInfo.isConfirmed = true
    emailInfo.confirmationCode= randomUUID()


    await this.dataSource.manager.transaction(async (manger) => {
      await manger.save<UserEntity>(user);
      await manger.save<EmailConfirmationInfo>(emailInfo)
    });
    const usee = await this.dataSource.getRepository(UserEntity).findOneBy({id: user.id})
    console.log(usee);
    return true;
  }

  deleteUser(userId: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  async getUserById(userId: string): Promise<{ id: string; login: string } | null> {
    return await this.userRepo.findOneBy({ id: userId });
  }

  recoveryPassword(userId: string, newRecoveryPassword: string) {
  }

  updateConfirmationStatus(userId: string) {
  }

  updateEmailConfirmationCode(userId: string, newConfirmationCode: string) {
  }
}
