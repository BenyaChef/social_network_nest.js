import { CommentDbModel } from "../../model/comment-db.model";

export abstract class ICommentRepository {
  abstract getCommentById(commentId: string, userId?: string): Promise<CommentDbModel | null>

  abstract create(newComment: CommentDbModel): Promise<string>

  abstract update(comment: CommentDbModel): Promise<boolean>

  abstract delete(commentId: string): Promise<boolean | null>

  abstract updateBanStatus(userId: string, banStatus: boolean)
}