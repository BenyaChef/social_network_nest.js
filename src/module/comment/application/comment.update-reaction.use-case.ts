import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReactionStatusEnum } from '../../../enum/reaction.status.enum';
import { ReactionService } from '../../reaction/application/reaction.service';
import { ICommentQueryRepository } from "../infrastructure/interfaces/comment.query-repository.interface";
import { IUserRepository } from "../../user/infrastructure/interfaces/user-repository.interface";
import { ResultCode } from "../../../enum/result-code.enum";

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
    private readonly reactionService: ReactionService,
  ) {}

  async execute(command: CommentUpdateReactionCommand): Promise<ResultCode> {
   const comment = await this.commentQueryRepository.getCommentById(command.commentId)
   if(!comment) return ResultCode.NotFound
   const user = await this.userRepository.getUserById(command.userId)
   if(!user) return ResultCode.NotFound
   await this.reactionService.updateReactionByParentId(command.commentId, command.reaction, user.id)
   return ResultCode.Success
 }
}
