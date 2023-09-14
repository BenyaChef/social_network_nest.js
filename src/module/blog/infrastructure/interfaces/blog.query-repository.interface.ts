import { BlogQueryPaginationDto } from '../../dto/blog.query.pagination.dto';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { BlogViewModel } from '../../model/blog.view.model';
import { BlogSaViewModel } from '../../model/blog-sa.view.model';

export abstract class IBlogQueryRepository {

  abstract getAllBlogsForCurrentUser(
    query: BlogQueryPaginationDto,
    userId: string,
  ): Promise<PaginationViewModel<BlogViewModel[]>>;

  abstract getBlogById(blogId: string): Promise<BlogViewModel | null>;

  abstract getAllBlogs(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>>;

  abstract findAllBlogsOfOwner(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogSaViewModel[]> | null>;

  abstract findBannedBlogUsers(
    query: BlogQueryPaginationDto,
    blogId: string,
  );

  abstract findBanUserForBlog(blogId: string, userId: string);
}