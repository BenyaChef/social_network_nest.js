import {
  Body,
  Controller,
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
import { PostQueryPaginationDto } from '../dto/post.query.pagination.dto';
import { PostViewModel } from '../model/post.view.model';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { CreateCommentDto } from '../../comment/dto/create.comment.dto';
import { AuthAccessJwtGuard } from '../../../guards/auth-access.jwt.guard';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { CommentQueryRepository } from '../../comment/infrastructure/comment.query.repository';
import { ReactionStatusDto } from "../../comment/dto/reaction.status.dto";
import { exceptionHandler } from "../../../exception/exception.handler";
import { NonBlockingAuthGuard } from "../../../guards/non-blocking.auth.guard";
import { CurrentUserId } from "../../../decorators/current-user-id.decorator";
import { CommentViewModel } from "../../comment/model/comment.view.model";
import { CommentQueryPaginationDto } from "../../comment/dto/comment.query.pagination.dto";
import { CommandBus } from "@nestjs/cqrs";
import { PostUpdateReactionCommand } from "../application/post-update-reaction.use-case";
import { CommentCreateCommand } from "../../comment/application/comment-create.use-case";
import { ResultCodeType } from "../../../enum/result-code.enum";
import { IPostQueryRepository } from "../infrastructure/interfaces/post.query-repository.interface";

@Controller('posts')
export class PostController {
  constructor(
    protected postQueryRepository: IPostQueryRepository,
    protected commentQueryRepository: CommentQueryRepository,
    protected commandBus: CommandBus
  ) {}

  @UseGuards(NonBlockingAuthGuard)
  @Get()
  async getAllPosts(
    @Query() query: PostQueryPaginationDto, @CurrentUserId() userId: string
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    return this.postQueryRepository.getAllPosts(query, userId);
  }

  @UseGuards(NonBlockingAuthGuard)
  @Get(':postId')
  async getPostById(@Param('postId') postId: string, @CurrentUserId() userId: string): Promise<PostViewModel> {
    const post: PostViewModel | null =
      await this.postQueryRepository.getPostById(postId, userId);
      if (!post) throw new NotFoundException();
      return post;
  }

  @UseGuards(NonBlockingAuthGuard)
  @Get(':postId/comments')
  async getCommentByPostId(@Param('postId') postId: string, @CurrentUserId() userId: string, @Query() query: CommentQueryPaginationDto): Promise<PaginationViewModel<CommentViewModel[]>> {
    const comments = await this.commentQueryRepository.getCommentByParentId(postId, query, userId)
    if (!comments) throw new NotFoundException();
    return comments;
  }

  @UseGuards(AuthAccessJwtGuard)
  @Post(':postId/comments')
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @CurrentUser() userId: string,
  ) {
    const resultCommand: ResultCodeType = await this.commandBus.execute(new CommentCreateCommand(userId, postId, createCommentDto))
    if(!resultCommand.data) return exceptionHandler(resultCommand.code)
    return this.commentQueryRepository.getCommentById(resultCommand.data);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeReactionForPost(
    @Param('postId') postId: string,
    @Body() reactionStatus: ReactionStatusDto,
    @CurrentUser() userId: string
  ) {
    const result = await this.commandBus.execute(new PostUpdateReactionCommand(postId, userId, reactionStatus.likeStatus))
    return exceptionHandler(result)
  }

}
