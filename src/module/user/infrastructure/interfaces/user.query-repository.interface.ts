import { UserViewModel } from "../../model/user.view.model";
import { UserQueryPaginationDto } from "../../dto/user.query.pagination.dto";
import { User } from "../../schema/user.schema";

export abstract class IUserQueryRepository {
  abstract findUserByEmailRecoveryCode(code: string): Promise<any | null>

  abstract finUserByNewPasswordRecoveryCode(code: string)

  abstract findUserByLogin(login: string): Promise<string| null>

  abstract findUserByEmail(email: string): Promise<User | null>

  abstract findUserLoginOrEmail(loginOrEmail: string): Promise<User | null>

  abstract getUserByID(userId: string): Promise<UserViewModel | null>

  abstract getAllUsers(query: UserQueryPaginationDto)
}