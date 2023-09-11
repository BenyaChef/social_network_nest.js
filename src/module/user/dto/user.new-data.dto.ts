import { UserEntity } from "../entities/user.entity";
import { EmailConfirmationInfo } from "../entities/user.email-confirmation.entity";
import { PasswordRecoveryInfo } from "../entities/user.password-recovery.entity";

export class NewUserData {
  user: UserEntity
  emailInfo: EmailConfirmationInfo
  recoveryInfo: PasswordRecoveryInfo
}