import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordDto } from '../../dto/new-password.dto';
import { IUserQueryRepository } from '../../../user/infrastructure/interfaces/user.query-repository.interface';
import { ResultCode } from '../../../../enum/result-code.enum';
import { UserService } from '../../../user/application/user.service';

export class PasswordAssignCommand {
  constructor(public newPasswordDto: NewPasswordDto) {}
}

@CommandHandler(PasswordAssignCommand)
export class PasswordAssignUseCase
  implements ICommandHandler<PasswordAssignCommand>
{
  constructor(private readonly userService: UserService,
              private readonly userQueryRepository: IUserQueryRepository) {}
  async execute(command: PasswordAssignCommand): Promise<ResultCode> {
    const userId = await this.userQueryRepository.finUserByNewPasswordRecoveryCode(command.newPasswordDto.recoveryCode)
    if(!userId) return ResultCode.BadRequest
    const updatePasswordResult = await this.userService.assignNewPassword(command.newPasswordDto.newPassword, userId)
    if(!updatePasswordResult) return ResultCode.BadRequest
    return ResultCode.Success
  }
}