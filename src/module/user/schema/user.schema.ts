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

@Schema({id: true})
export class User {
  @Prop({ required: true, type: AccountDataSchema })
  accountData: AccountData;

  @Prop({ required: true, type: EmailInfoSchema })
  emailInfo: EmailInfo;

  @Prop({ required: true, type: PasswordRecoveryInfoSchema })
  passwordRecoveryInfo: PasswordRecoveryInfo;

  static async createUser(createDto: CreateUserDto, hash: string): Promise<User> {
  const newUser: User = {
      accountData: new AccountData(),
      emailInfo: new EmailInfo(),
      passwordRecoveryInfo: new PasswordRecoveryInfo()
    }
    newUser.accountData.login = createDto.login
    newUser.accountData.passwordHash = hash
    newUser.accountData.email = createDto.email
    newUser.accountData.createdAt = new Date().toISOString()
    newUser.emailInfo.isConfirmed = false
    newUser.emailInfo.confirmationCode = randomUUID()
    newUser.passwordRecoveryInfo.isConfirmed = true
    newUser.passwordRecoveryInfo.recoveryCode = null
    return newUser;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

UserSchema.statics.createUser = User.createUser;