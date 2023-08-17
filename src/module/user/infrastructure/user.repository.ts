import { Injectable } from '@nestjs/common';
import { BanInfo, User, UserDocument } from "../schema/user.schema";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async getUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ id: userId });
  }

  async createUser(newUser: User): Promise<UserDocument> {
    const result = await this.userModel.create(newUser);
    return result;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const resultDelete = await this.userModel.findOneAndDelete({ id: userId });
    return resultDelete !== null;
  }

  async updateEmailConfirmationCode(userId: string, newConfirmationCode: string,) {
    return this.userModel.updateOne({ id: userId }, { $set: { 'emailInfo.confirmationCode': newConfirmationCode } },);
  }

  async updateConfirmationStatus(userId: string) {
    return this.userModel.updateOne({ id: userId }, {
      $set: {
        'emailInfo.isConfirmed': true, 'emailInfo.confirmationCode': null,
      }
    });
  }

  async assignNewPassword(userId: string, newPasswordHash: string) {
    return this.userModel.updateOne({ id: userId }, {
      $set: {
        'passwordRecoveryInfo.recoveryCode': null,
        'passwordRecoveryInfo.isConfirmed': true,
        'accountData.passwordHash': newPasswordHash,
      }
    });
  }

  async recoveryPassword(userId: string, newRecoveryPassword: string) {
    await this.userModel.updateOne({ id: userId }, {
      $set: {
        'passwordRecoveryInfo.recoveryCode': newRecoveryPassword, 'passwordRecoveryInfo.isConfirmed': false,
      }
    });
    return newRecoveryPassword;
  }

  async banOrUnbanUser(userId: string, updateBanInfoDto: BanInfo) {
    return this.userModel.updateOne({ id: userId }, { $set: { banInfo: updateBanInfoDto } },);
  }
}
