import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, UseGuards
} from "@nestjs/common";
import { BasicAuth } from "../../../guards/basic.auth.guard";
import { CreateBlogDto } from "../../blog/dto/create.blog.dto";
import { BlogViewModel } from "../../blog/model/blog.view.model";
import { CreatePostDto } from "../../post/dto/create.post.dto";
import { PostViewModel } from "../../post/model/post.view.model";
import { UpdateBlogDto } from "../../blog/dto/update.blog.dto";
import { PostService } from "../../post/application/post.service";
import { BlogQueryRepository } from "../../blog/infrastructure/blog.query.repository";
import { PostQueryRepository } from "../../post/infrastructure/post.query.repository";
import { AuthAccessJwtGuard } from "../../../guards/auth-access.jwt.guard";
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { CommandBus } from "@nestjs/cqrs";
import { BlogCreateCommand } from "../../blog/application/blog-create.use-case";
import { BlogDeleteCommand } from "../../blog/application/blog-delete.use-case";
import { exceptionHandler } from "../../../exception/exception.handler";
import { BlogUpdateCommand } from "../../blog/application/blog-update.use-case";
import { BlogQueryPaginationDto } from "../../blog/dto/blog.query.pagination.dto";

@Controller('blogger')
export class BloggerController {
  constructor(private commandBus: CommandBus,
              protected readonly postService: PostService,
              protected readonly blogQueryRepository: BlogQueryRepository,
              protected readonly postQueryRepository: PostQueryRepository
              ) {
  }

  @UseGuards(AuthAccessJwtGuard)
  @Get('blogs')
  async getAllBlogsForCurrentUser(@Query() query: BlogQueryPaginationDto, @CurrentUser() userId: string)  {
      return this.blogQueryRepository.getAllBlogsForCurrentUser(query, userId)
  }

  @UseGuards(AuthAccessJwtGuard)
  @Post('blogs')
  async createBlog(
    @Body() createDto: CreateBlogDto,
    @CurrentUser() userId: string
  ): Promise<BlogViewModel | null> {
    const blogId: string = await this.commandBus.execute(new BlogCreateCommand(createDto, userId))
    return this.blogQueryRepository.getBlogById(blogId);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Put('blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Body() updateDto: UpdateBlogDto,
    @Param('blogId') blogId: string,
    @CurrentUser() userId: string
  ) {
    const resultUpdate = await this.commandBus.execute(new BlogUpdateCommand(updateDto, userId, blogId))
    return exceptionHandler(resultUpdate)
  }

  @UseGuards(AuthAccessJwtGuard)
  @Delete('blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('blogId') blogId: string, @CurrentUser() userId: string) {
    const resultDelete = await this.commandBus.execute(new BlogDeleteCommand(blogId, userId))
    return exceptionHandler(resultDelete)
  }

  @Post(':blogId/posts')
  @UseGuards(BasicAuth)
  async createNewPostForBlog(@Body() createDto: CreatePostDto, @Param('blogId') blogId: string): Promise<PostViewModel | null> {
    const newBlogId: string | null = await this.postService.createPost(createDto, blogId)
    if (!newBlogId) throw new NotFoundException()
    return this.postQueryRepository.getPostById(newBlogId)
  }
}