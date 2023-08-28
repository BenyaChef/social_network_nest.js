import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IUserRepository } from "../infrastructure/interfaces/user-repository.interface";

export class UserDeleteCommand {
  constructor(public userId: string) {
  }
}

@CommandHandler(UserDeleteCommand)
export class UserDeleteUseCase implements ICommandHandler<UserDeleteCommand> {
  constructor(private readonly userRepository: IUserRepository) {
  }
  execute(command: UserDeleteCommand): Promise<boolean> {
    return this.userRepository.deleteUser(command.userId)
  }
}