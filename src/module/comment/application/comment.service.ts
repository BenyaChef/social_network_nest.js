import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/comment.repository';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { Comment } from '../schema/comment.schema';
import { ResultCode } from '../../../enum/result-code.enum';
import { CommentQueryRepository } from "../infrastructure/comment.query.repository";
import { ReactionService } from "../../reaction/application/reaction.service";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";

@Injectable()
export class CommentService {
  constructor(
    protected commentRepository: CommentRepository,
    protected userRepository: UserRepository,
    protected commentQueryRepository: CommentQueryRepository,
    protected reactionService: ReactionService
  ) {}

  async update(
    content: string,
    userId: string,
    commentId: string,
  ): Promise<ResultCode> {
    const comment = await this.commentRepository.getCommentById(commentId);
    if (!comment) return ResultCode.NotFound;
    if (userId !== comment.userId) return ResultCode.Forbidden;
    comment.update(content);
    await this.commentRepository.update(comment);
    return ResultCode.Success;
  }

  async deleteComment(userId: string, commentId: string): Promise<ResultCode> {
    const comment = await this.commentRepository.getCommentById(commentId);
    if (!comment) return ResultCode.NotFound;
    if (userId !== comment.userId) return ResultCode.Forbidden;
    await this.commentRepository.delete(commentId);
    return ResultCode.Success;
  }

  async changeReactionForComment(commentId: string, userId: string, reaction: ReactionStatusEnum) {
    const comment = await this.commentQueryRepository.getCommentById(commentId, userId)
    if(!comment) return ResultCode.NotFound
    const user = await this.userRepository.getUserById(userId)
    if(!user) return ResultCode.NotFound
    await this.reactionService.updateReactionByParentId(commentId, reaction, user.id)
    return ResultCode.Success
  }
}
