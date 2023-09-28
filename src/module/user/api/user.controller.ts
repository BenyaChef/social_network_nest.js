import {
  Body,
  Controller,
  Delete,
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
import { UserQueryPaginationDto } from '../dto/user.query.pagination.dto';
import { CreateUserDto } from '../dto/create.user.dto';
import { UserViewModel } from '../model/user.view.model';
import { BasicAuth } from '../../../guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UserCreateCommand } from '../application/user-create.use-case';
import { UserDeleteCommand } from '../application/user-delete.use-case';
import { exceptionHandler } from '../../../exception/exception.handler';
import { BlogQueryPaginationDto } from '../../blog/dto/blog.query.pagination.dto';
import { IUserQueryRepository } from '../infrastructure/interfaces/user.query-repository.interface';
import { IBlogQueryRepository } from '../../blog/infrastructure/interfaces/blog.query-repository.interface';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { BlogViewModel } from '../../blog/model/blog.view.model';
import { CreateBlogDto } from '../../blog/dto/create.blog.dto';
import { BlogCreateCommand } from '../../blog/application/blog-create.use-case';
import { UpdateBlogDto } from '../../blog/dto/update.blog.dto';
import { BlogUpdateCommand } from '../../blog/application/blog-update.use-case';
import { BlogDeleteCommand } from '../../blog/application/blog-delete.use-case';
import { PostQueryPaginationDto } from '../../post/dto/post.query.pagination.dto';
import { PostCreateDto } from '../../post/dto/create.post.dto';
import { PostCreateCommand } from '../../post/application/post-create.use-case';
import { UpdatePostDto } from '../../post/dto/update.post.dto';
import { PostUpdateCommand } from '../../post/application/post-update.use-case';
import { PostDeleteCommand } from '../../post/application/post-delete.use-case';
import { IBlogRepository } from '../../blog/infrastructure/interfaces/blog-repository.interface';
import { IPostQueryRepository } from '../../post/infrastructure/interfaces/post.query-repository.interface';
import { QuestionCreateDto } from '../../quiz/dto/question.create.dto';
import { QuestionUpdateDto } from '../../quiz/dto/question.update.dto';
import { PublishStatusUpdateDto } from "../../quiz/dto/question.publish-status.update.dto";
import { QuestionCreateCommand } from "../../quiz/application/question-create.use-case";
import { IQuizQueryRepository } from "../../quiz/infrastructure/interface/quiz.query-repository.interface";
import { QuestionQueryDto } from "../../quiz/dto/question.query.dto";
import { QuestionUpdateCommand } from "../../quiz/application/question-update.use-case";
import { QuestionUpdatePublishedStatusCommand } from "../../quiz/application/question-update.published-status.use-case";
import { QuestionDeleteCommand } from "../../quiz/application/question-delete.use-case";

@Controller('sa')
export class UserController {
  constructor(
    protected blogQueryRepository: IBlogQueryRepository,
    protected blogRepository: IBlogRepository,
    protected postQueryRepository: IPostQueryRepository,
    protected commandBus: CommandBus,
    protected userQueryRepository: IUserQueryRepository,
    protected quizQueryRepository: IQuizQueryRepository
  ) {}

  @UseGuards(BasicAuth)
  @Get('blogs')
  async getAllBlogsForCurrentUser(
    @Query() query: BlogQueryPaginationDto,
    @CurrentUser() userId: string,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    return this.blogQueryRepository.getAllBlogsForCurrentUser(query, userId);
  }

  @UseGuards(BasicAuth)
  @Post('blogs')
  async createBlog(
    @Body() createDto: CreateBlogDto,
  ): Promise<BlogViewModel | null> {
    const blogId: string = await this.commandBus.execute(
      new BlogCreateCommand(createDto),
    );
    return this.blogQueryRepository.getBlogById(blogId);
  }

  @UseGuards(BasicAuth)
  @Put('blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Body() updateDto: UpdateBlogDto,
    @Param('blogId') blogId: string,
  ) {
    const resultUpdate = await this.commandBus.execute(
      new BlogUpdateCommand(updateDto, blogId),
    );
    return exceptionHandler(resultUpdate);
  }

  @UseGuards(BasicAuth)
  @Delete('blogs/:blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('blogId') blogId: string) {
    const resultDelete = await this.commandBus.execute(
      new BlogDeleteCommand(blogId),
    );
    return exceptionHandler(resultDelete);
  }

  @UseGuards(BasicAuth)
  @Get('blogs/:blogId/posts')
  async getPostCurrentUser(
    @Param('blogId') blogId: string,
    @Query() query: PostQueryPaginationDto,
  ) {
    const blog = await this.blogRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return this.postQueryRepository.getAllPostsForBlogId(query, blogId);
  }

  @UseGuards(BasicAuth)
  @Post('blogs/:blogId/posts')
  async createNewPostForBlog(
    @Body() createDto: PostCreateDto,
    @Param('blogId') blogId: string,
  ) {
    const postId: string | null = await this.commandBus.execute(
      new PostCreateCommand(blogId, createDto),
    );
    if (!postId) throw new NotFoundException();
    return this.postQueryRepository.getPostById(postId);
  }

  @UseGuards(BasicAuth)
  @Put('blogs/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Body() updateDto: UpdatePostDto, @Param() params) {
    const resultUpdatePost = await this.commandBus.execute(
      new PostUpdateCommand(updateDto, params.blogId, params.postId),
    );
    return exceptionHandler(resultUpdatePost);
  }

  @UseGuards(BasicAuth)
  @Delete('blogs/:blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param() params) {
    const resultDelete = await this.commandBus.execute(
      new PostDeleteCommand(params.postId, params.blogId),
    );
    return exceptionHandler(resultDelete);
  }

  @Get('users')
  async getAllUsers(@Query() query: UserQueryPaginationDto) {
    const result = await this.userQueryRepository.getAllUsers(query);
    return result;
  }

  @Post('users')
  @UseGuards(BasicAuth)
  async createUser(
    @Body() createDto: CreateUserDto,
  ): Promise<UserViewModel | null> {
    const newUserId: string = await this.commandBus.execute(
      new UserCreateCommand(createDto),
    );
    return this.userQueryRepository.getUserByID(newUserId);
  }

  @Delete('users/:userId')
  @UseGuards(BasicAuth)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('userId') userId: string) {
    const isDeleted = await this.commandBus.execute(
      new UserDeleteCommand(userId),
    );
    if (!isDeleted) throw new NotFoundException();
    return isDeleted;
  }

  @Get('quiz/questions')
  @UseGuards(BasicAuth)
  async getAllQuestions(@Query() query: QuestionQueryDto) {
    return this.quizQueryRepository.getAllQuestions(query)
  }

  @Post('quiz/questions')
  @UseGuards(BasicAuth)
  async createQuestions(@Body() createQuestionDto: QuestionCreateDto) {
    const questionId = await this.commandBus.execute(new QuestionCreateCommand(createQuestionDto))
    return this.quizQueryRepository.getQuestionById(questionId)
  }

  @Put('quiz/questions/:questionId')
  @UseGuards(BasicAuth)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestions(
    @Body() createQuestionDto: QuestionUpdateDto,
    @Param('questionId') questionId: string,
  ) {
    const resultUpdate = await this.commandBus.execute(new QuestionUpdateCommand(questionId, createQuestionDto))
    if(!resultUpdate) throw new NotFoundException()
    return resultUpdate
  }


  @Put('quiz/questions/:questionId/publish')
  @UseGuards(BasicAuth)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestionsPublishStatus(
    @Body() updatePublishDto: PublishStatusUpdateDto,
    @Param('questionId') questionId: string,
  ) {
    const resultUpdate = await this.commandBus.execute(new QuestionUpdatePublishedStatusCommand(questionId, updatePublishDto))
    if(!resultUpdate) throw new NotFoundException()
    return resultUpdate
  }

  @Delete('quiz/questions/:questionId')
  @UseGuards(BasicAuth)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestions(
    @Param('questionId') questionId: string,
  ) {
    const deleteResult = await this.commandBus.execute(new QuestionDeleteCommand(questionId))
    if(!deleteResult) throw new NotFoundException()
    return deleteResult
  }

  // @Get('blogs')
  // @UseGuards(BasicAuth)
  // async findAllBlogsOfOwner(@Query() query: BlogQueryPaginationDto) {
  //     const blogs = await this.blogQueryRepository.findAllBlogsOfOwner(query)
  //     if(!blogs) throw new NotFoundException()
  //     return blogs
  // }

  // @Put('blogs/:blogId/ban')
  // @UseGuards(BasicAuth)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async banBlog(@Param('blogId') blogId: string, @Body() banDto: SaBlogBanDto) {
  //     return this.commandBus.execute(new SaBlogBanCommand(blogId, banDto.isBanned))
  // }

  // @Put('blogs/:blogId/bind-with-user/:userId')
  // @UseGuards(BasicAuth)
  // async bindBlog(@Param() params) {
  //     const resultBind = await this.commandBus.execute(new UserBindCommand(params.userId, params.blogId))
  //     return exceptionHandler(resultBind)
  // }

  // @Put('users/:userId/ban')
  // @UseGuards(BasicAuth)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async banUnbanUser(@Body() banDto: UserBanDto, @Param('userId') userId: string) {
  //     const banResult = await this.commandBus.execute(new UserBanCommand(userId, banDto))
  //     return exceptionHandler(banResult)
  // }
}