import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PasswordRecoveryDto } from "../../dto/password.recovery.dto";
import { IUserRepository } from "../../../user/infrastructure/interfaces/user-repository.interface";
import { IUserQueryRepository } from "../../../user/infrastructure/interfaces/user.query-repository.interface";
import { MailAdapter } from "../../../email/mail.adapter";
import { User } from "../../../user/schema/user.schema";
import { ResultCode } from "../../../../enum/result-code.enum";
import { randomUUID } from "crypto";

export class PasswordRecoveryCommand {
  constructor(public recoveryDto: PasswordRecoveryDto) {
  }
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userQueryRepository: IUserQueryRepository,
    private readonly mailAdapter: MailAdapter,
  ) {}

 async execute(command: PasswordRecoveryCommand): Promise<ResultCode> {
   const user: User | null = await this.userQueryRepository.findUserByEmail(command.recoveryDto.email);
   if (!user) return ResultCode.Success;
   const newRecoveryPassword = randomUUID()
   await this.userRepository.recoveryPassword(user.id, newRecoveryPassword)
   await this.mailAdapter.sendUserRecoveryPassword(user.accountData.email, user.accountData.login, newRecoveryPassword);
   return ResultCode.Success
 }
}