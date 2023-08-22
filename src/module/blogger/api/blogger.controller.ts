import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from '../../blog/dto/create.blog.dto';
import { BlogViewModel } from '../../blog/model/blog.view.model';
import { PostViewModel } from '../../post/model/post.view.model';
import { UpdateBlogDto } from '../../blog/dto/update.blog.dto';
import { BlogQueryRepository } from '../../blog/infrastructure/blog.query.repository';
import { PostQueryRepository } from '../../post/infrastructure/post.query.repository';
import { AuthAccessJwtGuard } from '../../../guards/auth-access.jwt.guard';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { BlogCreateCommand } from '../../blog/application/blog-create.use-case';
import { BlogDeleteCommand } from '../../blog/application/blog-delete.use-case';
import { exceptionHandler } from '../../../exception/exception.handler';
import { BlogUpdateCommand } from '../../blog/application/blog-update.use-case';
import { BlogQueryPaginationDto } from '../../blog/dto/blog.query.pagination.dto';
import { PostCreateDto } from '../../post/dto/create.post.dto';
import { PostCreateCommand } from '../../post/application/post-create.use-case';
import { PostQueryPaginationDto } from '../../post/dto/post.query.pagination.dto';
import { BlogRepository } from '../../blog/infrastructure/blog.repository';
import { UpdatePostDto } from '../../post/dto/update.post.dto';
import { PostUpdateCommand } from '../../post/application/post-update.use-case';
import { PostDeleteCommand } from '../../post/application/post-delete.use-case';
import { BlogBanDto } from '../../blog/dto/blog.ban.dto';
import { BlogBanUnbanUserCommand } from '../../blog/application/blog.ban-user.use-case';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { CommentQueryRepository } from '../../comment/infrastructure/comment.query.repository';
import { CommentQueryPaginationDto } from '../../comment/dto/comment.query.pagination.dto';

@Controller('blogger')
export class BloggerController {
  constructor(
    private commandBus: CommandBus,
    protected readonly blogRepository: BlogRepository,
    protected readonly blogQueryRepository: BlogQueryRepository,
    protected readonly postQueryRepository: PostQueryRepository,
    protected readonly commentQueryRepository: CommentQueryRepository,
  ) {}

  @UseGuards(AuthAccessJwtGuard)
  @Get('blogs')
  async getAllBlogsForCurrentUser(
    @Query() query: BlogQueryPaginationDto,
    @CurrentUser() userId: string,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    return this.blogQueryRepository.getAllBlogsForCurrentUser(query, userId);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Get('blogs/comments')
  async getAllCommentsForAllPostsCurrentUser(
    @Query() query: CommentQueryPaginationDto,
    @CurrentUser() userId: string,
  ) {
    return this.commentQueryRepository.getAllCommentsForAllPostsCurrentUser(query, userId);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Post('blogs')
  async createBlog(
    @Body() createDto: CreateBlogDto,
    @CurrentUser() userId: string,
  ): Promise<BlogViewModel | null> {
    const blogId: string = await this.commandBus.execute(
      new BlogCreateCommand(createDto, userId),
    );
    return this.blogQueryRepository.getBlogById(blogId);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Put('blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Body() updateDto: UpdateBlogDto,
    @Param('blogId') blogId: string,
    @CurrentUser() userId: string,
  ) {
    const resultUpdate = await this.commandBus.execute(
      new BlogUpdateCommand(updateDto, userId, blogId),
    );
    return exceptionHandler(resultUpdate);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Delete('blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(
    @Param('blogId') blogId: string,
    @CurrentUser() userId: string,
  ) {
    const resultDelete = await this.commandBus.execute(
      new BlogDeleteCommand(blogId, userId),
    );
    return exceptionHandler(resultDelete);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Get('blogs/:blogId/posts')
  async getPostCurrentUser(
    @Param('blogId') blogId: string,
    @Query() query: PostQueryPaginationDto,
    @CurrentUser() userId: string,
  ) {
    const blog = await this.blogRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    if (blog.ownerId) throw new ForbiddenException();
    return this.postQueryRepository.getAllPostsForBlogId(query, blogId, userId);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Post('blogs/:blogId/posts')
  async createNewPostForBlog(
    @Body() createDto: PostCreateDto,
    @Param('blogId') blogId: string,
    @CurrentUser() userId: string,
  ): Promise<PostViewModel | boolean> {
    const resultCreatePost = await this.commandBus.execute(
      new PostCreateCommand(blogId, userId, createDto),
    );
    if (typeof resultCreatePost !== 'string')
      return exceptionHandler(resultCreatePost);
    const newPost = await this.postQueryRepository.getPostById(
      resultCreatePost,
    );
    if (!newPost) throw new NotFoundException();
    return newPost;
  }

  @UseGuards(AuthAccessJwtGuard)
  @Put('blogs/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Body() updateDto: UpdatePostDto,
    @Param() params,
    @CurrentUser() userId: string,
  ) {
    const resultUpdatePost = await this.commandBus.execute(
      new PostUpdateCommand(updateDto, userId, params.blogId, params.postId),
    );
    return exceptionHandler(resultUpdatePost);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Delete('blogs/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() params, @CurrentUser() userId: string) {
    const resultDelete = await this.commandBus.execute(
      new PostDeleteCommand(userId, params.postId, params.blogId),
    );
    return exceptionHandler(resultDelete);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Get('users/blog/:blogId')
  async findBannedBlogUsers(
    @Query() query: BlogQueryPaginationDto,
    @Param('blogId') blogId: string,
    @CurrentUser() userId: string,
  ) {
    const resultFind = await this.blogQueryRepository.findBannedBlogUsers(
      query,
      blogId,
      userId,
    );
    if (!resultFind.data) return exceptionHandler(resultFind.code);
    return resultFind.data;
  }

  @UseGuards(AuthAccessJwtGuard)
  @Put('users/:userId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUnbanUserForBlog(
    @Body() banDto: BlogBanDto,
    @Param('userId') userId: string,
    @CurrentUser() ownerId: string,
  ) {
    const banResult = await this.commandBus.execute(
      new BlogBanUnbanUserCommand(banDto, userId, ownerId),
    );
    return exceptionHandler(banResult);
  }
}
