import { CommentDbModel } from "../../model/comment-db.model";
import { CommentEntity } from "../../entities/comment.entity";

export abstract class ICommentRepository {
  abstract getCommentById(commentId: string, userId?: string): Promise<CommentDbModel | null>

  abstract create(newComment: CommentEntity): Promise<CommentEntity>

  abstract update(comment: CommentDbModel): Promise<boolean>

  abstract delete(commentId: string): Promise<boolean>

  abstract updateBanStatus(userId: string, banStatus: boolean)
}