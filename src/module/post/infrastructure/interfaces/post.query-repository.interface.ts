import { PostViewModel } from "../../model/post.view.model";
import { PostQueryPaginationDto } from "../../dto/post.query.pagination.dto";
import { PaginationViewModel } from "../../../../helpers/pagination.view.mapper";

export abstract class IPostQueryRepository {

  abstract getPostById(
    postId: string,
    userId?: string,
  ): Promise<PostViewModel | null>

  abstract getAllPostsForBlogId(
    query: PostQueryPaginationDto,
    blogId: string,
    userId?: string,
  ): Promise<PaginationViewModel<PostViewModel[]>>

  abstract getAllPosts(
    query: PostQueryPaginationDto,
    userId: string | null ,
  ): Promise<PaginationViewModel<PostViewModel[]>>
}