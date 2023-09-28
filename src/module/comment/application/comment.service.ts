// import { Injectable } from '@nestjs/common';
// import { UserRepository } from '../../user/infrastructure/user.repository';
// import { ResultCode } from '../../../enum/result-code.enum';
// import { ICommentRepository } from "../infrastructure/interfaces/comment.repository.interface";
//
// @Injectable()
// export class CommentService {
//   constructor(
//     protected commentRepository: ICommentRepository,
//     protected userRepository: UserRepository,
//   ) {}
//
//   async deleteComment(userId: string, commentId: string): Promise<ResultCode> {
//     const comment = await this.commentRepository.getCommentById(commentId);
//     if (!comment) return ResultCode.NotFound;
//     if (userId !== comment.userId) return ResultCode.Forbidden;
//     await this.commentRepository.delete(commentId);
//     return ResultCode.Success;
//   }
//
// }
