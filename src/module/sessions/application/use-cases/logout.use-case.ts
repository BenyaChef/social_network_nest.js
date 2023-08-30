import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../../../auth/application/jwt.service';
import { ISessionRepository } from '../../infrastructure/interfaces/session.repository.interface';
import { JwtPayload } from 'jsonwebtoken';
import {isBefore} from "date-fns";

export class LogoutCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionRepository: ISessionRepository,
  ) {}
    async execute(command: LogoutCommand): Promise<null | boolean> {
      const jwtPayload: JwtPayload | null = await this.tokenService.decode(command.refreshToken)
      if(!jwtPayload) return null
      // if(isBefore(Date.now(), jwtPayload.exp!)) return null
      const userId = jwtPayload.sub
      const deviceId = jwtPayload.deviceId
      const lastActiveDate = new Date(jwtPayload.iat! * 1000).toISOString()
      return  this.sessionRepository.logout(lastActiveDate, userId!, deviceId)
  }
}