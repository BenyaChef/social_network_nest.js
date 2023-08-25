import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CreateUserDto } from '../dto/create.user.dto';
import { randomUUID } from "crypto";

@Schema({ _id: false, id: false, versionKey: false })
class AccountData {
  @Prop({ required: true, unique: true, type: String })
  login: string;
  @Prop({ required: true, unique: true, type: String })
  email: string;
  @Prop({ required: true, type: String  })
  passwordHash: string;
  @Prop({ required: true, type: String })
  createdAt: string;
}

const AccountDataSchema = SchemaFactory.createForClass(AccountData);

@Schema({ _id: false, id: false, versionKey: false })
class EmailInfo {
  @Prop({ required: true, type: Boolean, default: false })
  isConfirmed: boolean;
  @Prop({ required: false, type: String })
  confirmationCode: string | null;
}

const EmailInfoSchema = SchemaFactory.createForClass(EmailInfo);

@Schema({ _id: false, id: false, versionKey: false })
class PasswordRecoveryInfo {
  @Prop({ required: true, type: Boolean, default: true })
  isConfirmed: boolean;
  @Prop({ required: false, type: String  })
  recoveryCode: string | null;
}

const PasswordRecoveryInfoSchema =
  SchemaFactory.createForClass(PasswordRecoveryInfo);

@Schema({ _id: false, versionKey: false })
export class BanInfo {
  @Prop({ required: true, type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String })
  banDate: string | null;
  @Prop({ type: String })
  banReason: string | null;
}

const BanInfoSchema = SchemaFactory.createForClass(BanInfo);

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, type: String, unique: true })
  id: string;

  @Prop({ required: true, type: AccountDataSchema })
  accountData: AccountData;

  @Prop({ required: true, type: EmailInfoSchema })
  emailInfo: EmailInfo;

  @Prop({ required: true, type: PasswordRecoveryInfoSchema })
  passwordRecoveryInfo: PasswordRecoveryInfo;

  @Prop({ required: true, type:  BanInfoSchema})
  banInfo: BanInfo

  static async createUser(createDto: CreateUserDto, hash: string): Promise<User> {
    const newUser: User = {
      id: randomUUID(),
      accountData: new AccountData(),
      emailInfo: new EmailInfo(),
      passwordRecoveryInfo: new PasswordRecoveryInfo(),
      banInfo: new BanInfo()
    };
    newUser.accountData.login = createDto.login;
    newUser.accountData.passwordHash = hash;
    newUser.accountData.email = createDto.email;
    newUser.accountData.createdAt = new Date().toISOString();
    newUser.emailInfo.isConfirmed = false;
    newUser.emailInfo.confirmationCode = randomUUID();
    newUser.passwordRecoveryInfo.isConfirmed = true;
    newUser.passwordRecoveryInfo.recoveryCode = null;
    newUser.banInfo.isBanned = false;
    newUser.banInfo.banDate = null;
    newUser.banInfo.banReason = null;
    return newUser;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

UserSchema.statics.createUser = User.createUser;