import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResultCode } from "../../../../enum/result-code.enum";
import { TokenService } from "../../../auth/application/jwt.service";
import { ISessionRepository } from "../../infrastructure/interfaces/session.repository.interface";

export class DeleteSessionByDeviceIdCommand {
  constructor(public refreshToken: string ,public deviceId: string) {}
}

@CommandHandler(DeleteSessionByDeviceIdCommand)
export class DeleteSessionByDeviceIdUseCase
  implements ICommandHandler<DeleteSessionByDeviceIdCommand>
{
  constructor(private readonly tokenService: TokenService,
              private readonly sessionRepository: ISessionRepository) {}

  async execute(command: DeleteSessionByDeviceIdCommand): Promise<ResultCode> {
    const jwtPayload = await this.tokenService.decode(command.refreshToken)
    if(!jwtPayload) return ResultCode.NotFound

    const session = await this.sessionRepository.getSessionByDeviceId(command.deviceId)
    if(!session) return ResultCode.NotFound
    if(session.userId !== jwtPayload.sub) return ResultCode.Forbidden

    const deleteResult = await this.sessionRepository.deleteSessionByDeviceIdAndUserId(command.deviceId, jwtPayload.sub!)
    if(!deleteResult) return ResultCode.NotFound
    return ResultCode.Success
  }
}
