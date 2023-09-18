import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ICommentRepository } from "../infrastructure/interfaces/comment.repository.interface";
import { ResultCode } from "../../../enum/result-code.enum";
import { CommentEntity } from "../entities/comment.entity";

export class CommentUpdateCommand {
  constructor(public content: string,
              public userId: string,
              public commentId: string,) {
  }
}

@CommandHandler(CommentUpdateCommand)
export class CommentUpdateUseCase
  implements ICommandHandler<CommentUpdateCommand>
{
  constructor(private readonly commentRepository: ICommentRepository) {}

 async execute(command: CommentUpdateCommand): Promise<ResultCode> {
   const comment: CommentEntity | null = await this.commentRepository.getCommentById(command.commentId);
   if (!comment) return ResultCode.NotFound;

   if (command.userId !== comment.userId) return ResultCode.Forbidden;

   comment.content = command.content

   await this.commentRepository.update(comment);
   return ResultCode.Success;
 }
}