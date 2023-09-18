import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReactionStatusEnum } from '../../../enum/reaction.status.enum';
import { ReactionService } from '../../reaction/application/reaction.service';
import { ICommentQueryRepository } from '../infrastructure/interfaces/comment.query-repository.interface';
import { IUserRepository } from '../../user/infrastructure/interfaces/user-repository.interface';
import { ResultCode } from '../../../enum/result-code.enum';
import { ReactionsComments } from '../../reaction/entities/reactions-comments.entity';
import { IReactionRepository } from '../../reaction/infrastructure/interfaces/reaction.repository.interface';
import { getManager } from 'typeorm';

export class CommentUpdateReactionCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public reaction: ReactionStatusEnum,
  ) {}
}

@CommandHandler(CommentUpdateReactionCommand)
export class CommentUpdateReactionUseCase
  implements ICommandHandler<CommentUpdateReactionCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly commentQueryRepository: ICommentQueryRepository,
    private readonly reactionRepository: IReactionRepository,
  ) {}

  async execute(command: CommentUpdateReactionCommand): Promise<ResultCode> {
    const comment = await this.commentQueryRepository.getCommentById(
      command.commentId,
    );
    if (!comment) return ResultCode.NotFound;

    const user = await this.userRepository.getUserById(command.userId);
    if (!user) return ResultCode.NotFound;

    const reactions: ReactionsComments | null = await this.commentQueryRepository.getCommentReactions(command.userId, command.commentId)

    let newReaction
    if(!reactions) {
      newReaction = new ReactionsComments();
    } else {
      newReaction = reactions
    }
    newReaction.userId = command.userId;
    newReaction.parentId = command.commentId;
    newReaction.reactionStatus = command.reaction;

    await this.reactionRepository.updateReaction(newReaction);

    return ResultCode.Success;
  }
}
