import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserBanDto } from '../dto/user-ban.dto';
import { ResultCode } from "../../../enum/result-code.enum";
import { IUserRepository } from "../infrastructure/interfaces/user-repository.interface";
import { ISessionRepository } from "../../sessions/infrastructure/interfaces/session.repository.interface";
import { ICommentRepository } from "../../comment/infrastructure/interfaces/comment.repository.interface";
import { IReactionRepository } from "../../reaction/infrastructure/interfaces/reaction.repository.interface";

export class UserBanCommand {
  constructor(public userId: string, public banDto: UserBanDto) {}
}

@CommandHandler(UserBanCommand)
export class UserBanUseCase implements ICommandHandler<UserBanCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly commentRepository: ICommentRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly reactionRepository: IReactionRepository,
  ) {}

  async execute(command: UserBanCommand): Promise<ResultCode> {
    const user = await this.userRepository.getUserById(command.userId);
    if (!user) return ResultCode.NotFound;
    const updateBanInfoDto = command.banDto.isBanned ? {
         isBanned: command.banDto.isBanned,
          banDate: new Date().toISOString(),
          banReason: command.banDto.banReason,
        }
      : { isBanned: command.banDto.isBanned, banDate: null, banReason: null };

    await this.userRepository.banOrUnbanUser(command.userId, updateBanInfoDto)
    await this.commentRepository.updateBanStatus(command.userId, command.banDto.isBanned)
    await this.reactionRepository.updateBanStatus(command.userId, command.banDto.isBanned)
    if(command.banDto.isBanned) {
      await this.sessionRepository.deleteSessionBanUser(command.userId)
    }
    return ResultCode.Success
  }
}
