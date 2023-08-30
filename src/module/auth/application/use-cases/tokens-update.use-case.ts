import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtPayload } from "jsonwebtoken";
import { IUserQueryRepository } from "../../../user/infrastructure/interfaces/user.query-repository.interface";
import {
  ISessionQueryRepository
} from "../../../sessions/infrastructure/interfaces/session.query-repository.interface";
import { TokenService } from "../jwt.service";
import { ISessionRepository } from "../../../sessions/infrastructure/interfaces/session.repository.interface";
import { randomUUID } from "crypto";

export class TokensUpdateCommand {
  constructor(public refreshToke: string) {
  }
}

@CommandHandler(TokensUpdateCommand)
export class TokensUpdateUseCase implements ICommandHandler<TokensUpdateCommand> {
  constructor(private readonly userQueryRepository: IUserQueryRepository,
              private readonly sessionQueryRepository: ISessionQueryRepository,
              private readonly tokenService: TokenService,
              private readonly sessionRepository: ISessionRepository) {
  }
 async execute(command: TokensUpdateCommand): Promise<{accessToken: string , refreshToken: string} | null> {
   const jwtPayload: JwtPayload | null = await this.tokenService.decode(command.refreshToke)
   if(!jwtPayload) return null

   const userId = jwtPayload.sub!
   const deviceId = jwtPayload.deviceId
   const lastActiveDate = new Date(jwtPayload.iat! * 1000).toISOString()

   const user = await this.userQueryRepository.getUserByID(userId)
   if(!user) return null

   const device = await this.sessionQueryRepository.getDeviceByDateUserIdAndDeviceId(lastActiveDate, userId, deviceId)
   if(!device) return null

   const newDeviceId = randomUUID()
   const newTokens = await this.tokenService.createJwt(userId, newDeviceId)
   const newLastActiveDate = await this.tokenService.getLastActiveDate(newTokens.refreshToken)
   await this.sessionRepository.updateLastActiveDate(user.id, deviceId, newLastActiveDate)
   return newTokens
  }
}