import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegistrationEmailResendingDto } from "../../dto/registration.email.resending.dto";
import { IUserRepository } from "../../../user/infrastructure/interfaces/user-repository.interface";
import { IUserQueryRepository } from "../../../user/infrastructure/interfaces/user.query-repository.interface";
import { MailAdapter } from "../../../email/mail.adapter";
import { BadRequestException } from "@nestjs/common";

export class RegistrationEmailResendingCommand {
  constructor(public resendingDto: RegistrationEmailResendingDto) {
  }
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand> {
  constructor(private readonly userRepository: IUserRepository,
              private readonly userQueryRepository: IUserQueryRepository,
              private readonly mailAdapter: MailAdapter) {}
  async execute(command: RegistrationEmailResendingCommand): Promise<any> {
    const user = await this.userQueryRepository.findUserByEmail(command.resendingDto.email)
    if(!user) throw new BadRequestException('emailIsNotExists')

  }
}
