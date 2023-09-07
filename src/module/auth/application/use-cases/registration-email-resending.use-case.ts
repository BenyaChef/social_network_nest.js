import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegistrationEmailResendingDto } from "../../dto/registration.email.resending.dto";
import { IUserRepository } from "../../../user/infrastructure/interfaces/user-repository.interface";
import { IUserQueryRepository } from "../../../user/infrastructure/interfaces/user.query-repository.interface";
import { MailAdapter } from "../../../email/mail.adapter";
import { BadRequestException } from "@nestjs/common";
import { User } from "../../../user/schema/user.schema";
import { randomUUID } from "crypto";
import { UserDto } from "../../../user/dto/user.dto";
import { UserEntity } from "../../../user/entities/user.entity";

export class RegistrationEmailResendingCommand {
  constructor(public resendingDto: RegistrationEmailResendingDto) {
  }
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand> {
  constructor(private readonly userRepository: IUserRepository,
              private readonly userQueryRepository: IUserQueryRepository,
              private readonly mailAdapter: MailAdapter) {}
  async execute(command: RegistrationEmailResendingCommand): Promise<boolean> {
    const user: any | null = await this.userQueryRepository.findUserByEmail(command.resendingDto.email)
    if(!user) throw new BadRequestException('emailIsNotExists')
    if(user.emailInfo.isConfirmed) throw new BadRequestException('emailAlreadyIsConfirm')

    const newConfirmedCode = randomUUID();
    this.mailAdapter.sendUserConfirmation(user.accountData.email, user.accountData.login, newConfirmedCode)
    return this.userRepository.updateEmailConfirmationCode(user.id, newConfirmedCode)
  }
}
