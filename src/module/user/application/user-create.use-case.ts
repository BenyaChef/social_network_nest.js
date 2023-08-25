import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from "../dto/create.user.dto";
import { UserService } from "./user.service";
import { UserRepositorySql } from "../infrastructure/raw-sql.repositoryes/user.repository.sql";

export class UserCreateCommand {
  constructor(public createDto: CreateUserDto) {}
}

@CommandHandler(UserCreateCommand)
export class UserCreateUseCase implements ICommandHandler<UserCreateCommand> {
  constructor(private readonly userRepository: UserRepositorySql,
              private readonly userService: UserService) {}

  async execute(command: UserCreateCommand): Promise<string> {
    const newUser = await this.userService.createUser(command.createDto)
    newUser.emailInfo.isConfirmed = true
    newUser.emailInfo.confirmationCode = null
    await this.userRepository.createUser(newUser)
    return newUser.id
  }
}
