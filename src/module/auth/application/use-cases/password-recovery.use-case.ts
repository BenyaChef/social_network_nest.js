import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PasswordRecoveryDto } from "../../dto/password.recovery.dto";
import { IUserRepository } from "../../../user/infrastructure/interfaces/user-repository.interface";
import { IUserQueryRepository } from "../../../user/infrastructure/interfaces/user.query-repository.interface";
import { MailAdapter } from "../../../email/mail.adapter";
import { ResultCode } from "../../../../enum/result-code.enum";
import { randomUUID } from "crypto";
import { UserDto } from "../../../user/dto/user.dto";
import { UserEntity } from "../../../user/entities/user.entity";

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
   const user: UserEntity | null = await this.userQueryRepository.findUserByEmail(command.recoveryDto.email);
   if (!user) return ResultCode.Success;
   const newRecoveryPassword = randomUUID()
   await this.userRepository.recoveryPassword(user.id, newRecoveryPassword)
   await this.mailAdapter.sendUserRecoveryPassword(user.email, user.login, newRecoveryPassword);
   return ResultCode.Success
 }
}