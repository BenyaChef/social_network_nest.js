import { CommentQueryPaginationDto } from "../../dto/comment.query.pagination.dto";
import { PaginationViewModel } from "../../../../helpers/pagination.view.mapper";
import { CommentViewModel } from "../../model/comment.view.model";


export abstract class ICommentQueryRepository {

  abstract getAllCommentsForAllPostsCurrentUser(query: CommentQueryPaginationDto, userId: string)

  abstract getCommentByParentId(
    postId: string,
    query: CommentQueryPaginationDto,
    userId?: string | null,
  ): Promise<PaginationViewModel<CommentViewModel[]> | null>

  abstract getCommentById(
    commentId: string,
    userId?: string | null): Promise<CommentViewModel | null>

  abstract getCommentReactions(userId: string, commentId: string)
}