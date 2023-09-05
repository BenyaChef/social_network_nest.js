import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../infrastructure/comment.repository';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { ResultCode } from '../../../enum/result-code.enum';

@Injectable()
export class CommentService {
  constructor(
    protected commentRepository: CommentRepository,
    protected userRepository: UserRepository,
  ) {}



  async deleteComment(userId: string, commentId: string): Promise<ResultCode> {
    const comment = await this.commentRepository.getCommentById(commentId);
    if (!comment) return ResultCode.NotFound;
    if (userId !== comment.userId) return ResultCode.Forbidden;
    await this.commentRepository.delete(commentId);
    return ResultCode.Success;
  }

}
