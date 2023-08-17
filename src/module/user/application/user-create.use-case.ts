import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from "../dto/create.user.dto";
import { UserRepository } from "../infrastructure/user.repository";
import { User } from "../schema/user.schema";
import bcrypt from 'bcrypt';

export class UserCreateCommand {
  constructor(public createDto: CreateUserDto) {}
}

@CommandHandler(UserCreateCommand)
export class UserCreateUseCase implements ICommandHandler<UserCreateCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UserCreateCommand): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(command.createDto.password, salt);

    const newUser = await User.createUser(command.createDto, hashPassword)
    newUser.emailInfo.isConfirmed = true
    newUser.emailInfo.confirmationCode = null
    const newUserDocument = await this.userRepository.createUser(newUser)
    return newUserDocument.id
  }
}
