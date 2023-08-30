import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../../../auth/application/jwt.service';
import { ISessionRepository } from '../../infrastructure/interfaces/session.repository.interface';
import { JwtPayload } from "jsonwebtoken";

export class DeleteAllSessionsExceptCurrentCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(DeleteAllSessionsExceptCurrentCommand)
export class DeleteAllSessionsExceptCurrentUserUseCase
  implements ICommandHandler<DeleteAllSessionsExceptCurrentCommand>
{
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(command: DeleteAllSessionsExceptCurrentCommand): Promise<boolean | null> {
    const jwtPayload: JwtPayload | null = await this.tokenService.decode(command.refreshToken)
    if(!jwtPayload) return null
    return this.sessionRepository.deleteAllUserSessionExceptCurrent(jwtPayload.sub!, jwtPayload.deviceId!)
  }
}
