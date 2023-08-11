import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: userId });
  }

  async createUser(newUser: User): Promise<UserDocument> {
    const result = await this.userModel.create(newUser);
    return result;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const resultDelete = await this.userModel.findOneAndDelete({ _id: userId });
    return resultDelete !== null;
  }

  async updateEmailConfirmationCode(
    userId: string,
    newConfirmationCode: string,
  ) {
    return this.userModel.updateOne(
      { _id: userId },
      { $set: { 'emailInfo.confirmationCode': newConfirmationCode } },
    );
  }

  async updateConfirmationStatus(userId: string) {
    return this.userModel.updateOne(
      { _id: userId },
      { $set: {
          'emailInfo.isConfirmed': true,
          'emailInfo.confirmationCode': null,
        }});
  }

  async assignNewPassword(userId: string, newPasswordHash: string) {
    return this.userModel.updateOne(
      { _id: userId },
      { $set: {
          'passwordRecoveryInfo.recoveryCode': null,
          'passwordRecoveryInfo.isConfirmed': true,
          'accountData.passwordHash': newPasswordHash,
        }});
  }

  async recoveryPassword(userId: string, newRecoveryPassword: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: {
          'passwordRecoveryInfo.recoveryCode': newRecoveryPassword,
          'passwordRecoveryInfo.isConfirmed': false,
        }});
    return newRecoveryPassword;
  }
}
