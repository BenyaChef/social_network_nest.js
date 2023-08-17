import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserBanDto } from '../dto/user-ban.dto';
import { UserRepository } from '../infrastructure/user.repository';
import { CommentRepository } from "../../comment/infrastructure/comment.repository";
import { SessionRepository } from "../../sessions/infrastructure/session.repository";
import { ReactionRepository } from "../../reaction/infrastructure/reaction.repository";
import { ResultCode } from "../../../enum/result-code.enum";

export class UserBanCommand {
  constructor(public userId: string, public banDto: UserBanDto) {}
}

@CommandHandler(UserBanCommand)
export class UserBanUseCase implements ICommandHandler<UserBanCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly reactionRepository: ReactionRepository,
  ) {}

  async execute(command: UserBanCommand): Promise<ResultCode> {
    const user = await this.userRepository.getUserById(command.userId);
    if (!user) return ResultCode.NotFound;
    const updateBanInfoDto = command.banDto.isBanned
      ? {
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
