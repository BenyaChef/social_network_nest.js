import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserRepository } from "../infrastructure/user.repository";

export class UserDeleteCommand {
  constructor(public userId: string) {
  }
}

@CommandHandler(UserDeleteCommand)
export class UserDeleteUseCase implements ICommandHandler<UserDeleteCommand> {
  constructor(private readonly userRepository: UserRepository) {
  }
  execute(command: UserDeleteCommand): Promise<boolean> {
    return this.userRepository.deleteUser(command.userId)
  }
}