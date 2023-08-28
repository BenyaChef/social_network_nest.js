import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegistrationDto } from "../../dto/registration.dto";
import { UserService } from "../../../user/application/user.service";
import { MailAdapter } from "../../../email/mail.adapter";
import { IUserRepository } from "../../../user/infrastructure/interfaces/user-repository.interface";

export class RegistrationUserCommand {
  constructor(public registrationDto: RegistrationDto) {
  }
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(private readonly userService: UserService,
              private readonly mailAdapter: MailAdapter,
              private readonly userRepository: IUserRepository) {}

 async execute(command: RegistrationUserCommand): Promise<boolean> {
    const newUser = await this.userService.createUser(command.registrationDto)
    this.mailAdapter.sendUserConfirmation(newUser.accountData.email, newUser.accountData.login, newUser.emailInfo.confirmationCode!)
    return await this.userRepository.createUser(newUser)
 }
}