import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogQueryRepository } from '../infrastructure/blog.query.repository';
import { BlogQueryPaginationDto } from '../dto/blog.query.pagination.dto';
import { BlogViewModel } from '../model/blog.view.model';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { PostQueryRepository } from '../../post/infrastructure/post.query.repository';
import { PostQueryPaginationDto } from '../../post/dto/post.query.pagination.dto';
import { NonBlockingAuthGuard } from '../../../guards/non-blocking.auth.guard';
import { CurrentUserId } from '../../../decorators/current-user-id.decorator';

@Controller('blogs')
export class BlogController {
  constructor(
    protected readonly blogQueryRepository: BlogQueryRepository,
    protected readonly postQueryRepository: PostQueryRepository,
  ) {}

  @Get(':blogId')
  async getBlogById(@Param('blogId') blogId: string): Promise<BlogViewModel> {
    const blog: BlogViewModel | null =
      await this.blogQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @UseGuards(NonBlockingAuthGuard)
  @Get(':blogId/posts')
  async getAllPostByBlogID(
    @Param('blogId') blogId: string,
    @Query() query: PostQueryPaginationDto,
    @CurrentUserId() userId: string,
  ) {
    const findPosts = await this.postQueryRepository.getAllPostsForBlogId(
      query,
      blogId,
      userId,
    );
    if (findPosts.items.length <= 0) throw new NotFoundException();
    return findPosts;
  }

  @Get()
  async getAllBlogs(
    @Query() paginationQueryParam: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    return this.blogQueryRepository.getAllBlogs(paginationQueryParam);
  }
}
