import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from "../dto/create.user.dto";
import { UserService } from "./user.service";
import { IUserRepository } from "../infrastructure/interfaces/user-repository.interface";

export class UserCreateCommand {
  constructor(public createDto: CreateUserDto) {}
}

@CommandHandler(UserCreateCommand)
export class UserCreateUseCase implements ICommandHandler<UserCreateCommand> {
  constructor(private readonly userRepository: IUserRepository,
              private readonly userService: UserService) {}

  async execute(command: UserCreateCommand): Promise<string> {
    const newUser = await this.userService.createUser(command.createDto)
    newUser.user.isConfirmed = true
    newUser.emailInfo.confirmationCode = null
    await this.userRepository.createUser(newUser)
    return newUser.user.id
  }
}
