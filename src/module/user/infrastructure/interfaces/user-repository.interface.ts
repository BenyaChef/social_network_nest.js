import { BanInfo } from "../../schema/user.schema";
import { NewUserData } from "../../dto/user.new-data.dto";

export abstract class IUserRepository {
  abstract getUserById(userId: string): Promise<{id: string, login: string} | null>
  abstract createUser(newUser: NewUserData): Promise<boolean>
  abstract deleteUser(userId: string): Promise<boolean>
  abstract updateEmailConfirmationCode(userId: string, newConfirmationCode: string)
  abstract updateConfirmationStatus(userId: string)
  abstract assignNewPassword(userId: string, newPasswordHash: string)
  abstract recoveryPassword(userId: string, newRecoveryPassword: string)
  abstract banOrUnbanUser(userId: string, updateBanInfoDto: BanInfo)
}