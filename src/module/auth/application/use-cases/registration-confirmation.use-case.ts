import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmationCodeDto } from '../../dto/confirmation.code.dto';
import { IUserRepository } from '../../../user/infrastructure/interfaces/user-repository.interface';
import { IUserQueryRepository } from '../../../user/infrastructure/interfaces/user.query-repository.interface';
import { BadRequestException } from '@nestjs/common';

export class RegistrationConfirmationCommand {
  constructor(public confirmationCode: ConfirmationCodeDto) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase
  implements ICommandHandler<RegistrationConfirmationCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userQueryRepository: IUserQueryRepository,
  ) {}

  async execute(command: RegistrationConfirmationCommand): Promise<boolean> {
    const user = await this.userQueryRepository.findUserByEmailRecoveryCode(
      command.confirmationCode.code,
    );
    if (!user) throw new BadRequestException('codeIsNotExists');
    if (user.isConfirmed) throw new BadRequestException('codeAlreadyIsConfirm');
    return this.userRepository.updateConfirmationStatus(user.id)
  }
}
