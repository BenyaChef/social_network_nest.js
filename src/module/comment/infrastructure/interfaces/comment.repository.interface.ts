
import { CommentEntity } from "../../entities/comment.entity";

export abstract class ICommentRepository {
  abstract getCommentById(commentId: string, userId?: string): Promise<CommentEntity | null>

  abstract create(newComment: CommentEntity): Promise<CommentEntity>

  abstract update(comment: CommentEntity): Promise<boolean>

  abstract delete(commentId: string): Promise<boolean>

  abstract updateBanStatus(userId: string, banStatus: boolean)
}