import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ICommentRepository } from "../infrastructure/interfaces/comment.repository.interface";
import { ResultCode } from "../../../enum/result-code.enum";

export class CommentDeleteCommand {
  constructor(public userId: string, public commentId: string) {
  }
}

@CommandHandler(CommentDeleteCommand)
export class CommentDeleteUseCase
  implements ICommandHandler<CommentDeleteCommand>
{
  constructor(private readonly commentRepository: ICommentRepository,) {}

 async execute(command: CommentDeleteCommand): Promise<ResultCode> {
   const comment = await this.commentRepository.getCommentById(command.commentId);
   if (!comment) return ResultCode.NotFound;
   if (command.userId !== comment.userId) return ResultCode.Forbidden;
   await this.commentRepository.delete(command.commentId);
   return ResultCode.Success;
 }
}