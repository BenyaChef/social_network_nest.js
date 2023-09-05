import { UserViewModel } from "../../model/user.view.model";
import { UserQueryPaginationDto } from "../../dto/user.query.pagination.dto";
import { User } from "../../schema/user.schema";
import { UserDto } from "../../dto/user.dto";
import { PaginationViewModel } from "../../../../helpers/pagination.view.mapper";

export abstract class IUserQueryRepository {
  abstract findUserByEmailRecoveryCode(code: string): Promise<{ id: string, isConfirmed: string, confirmationCode: string } | null>

  abstract finUserByNewPasswordRecoveryCode(code: string)

  abstract findUserByLogin(login: string): Promise<string| null>

  abstract findUserByEmail(email: string): Promise<UserDto | null>

  abstract findUserLoginOrEmail(loginOrEmail: string): Promise<UserDto | null>

  abstract getUserByID(userId: string): Promise<UserViewModel | null>

  abstract getAllUsers(query: UserQueryPaginationDto): Promise<PaginationViewModel<UserViewModel[]>>
}