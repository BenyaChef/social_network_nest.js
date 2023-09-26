  import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogQueryPaginationDto } from '../dto/blog.query.pagination.dto';
import { BlogViewModel } from '../model/blog.view.model';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { PostQueryPaginationDto } from '../../post/dto/post.query.pagination.dto';
import { NonBlockingAuthGuard } from '../../../guards/non-blocking.auth.guard';
import { CurrentUserId } from '../../../decorators/current-user-id.decorator';
import { IBlogQueryRepository } from "../infrastructure/interfaces/blog.query-repository.interface";
import { IPostQueryRepository } from "../../post/infrastructure/interfaces/post.query-repository.interface";

@Controller('blogs')
export class BlogController {
  constructor(
    protected readonly blogQueryRepository: IBlogQueryRepository,
    protected readonly postQueryRepository: IPostQueryRepository,
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
