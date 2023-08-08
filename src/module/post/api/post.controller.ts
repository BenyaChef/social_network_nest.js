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
import { PostService } from '../application/post.service';
import { PostQueryRepository } from '../infrastructure/post.query.repository';
import { PostQueryPaginationDto } from '../dto/post.query.pagination.dto';
import { PostViewModel } from '../model/post.view.model';
import { CreatePostDto } from '../dto/create.post.dto';
import { UpdatePostDto } from '../dto/update.post.dto';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { CreateCommentDto } from '../../comment/dto/create.comment.dto';
import { AuthAccessJwtGuard } from '../../../guards/auth-access.jwt.guard';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { CommentService } from '../../comment/application/comment.service';
import { CommentQueryRepository } from "../../comment/infrastructure/comment.query.repository";

@Controller('posts')
export class PostController {
  constructor(
    protected postService: PostService,
    protected postQueryRepository: PostQueryRepository,
    protected commentService: CommentService,
    protected commentQueryRepository: CommentQueryRepository
  ) {}

  @Get()
  async getAllPosts(
    @Query() query: PostQueryPaginationDto,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    return this.postQueryRepository.getAllPosts(query);
  }

  @Get(':postId')
  async getPostById(@Param('postId') postId: string): Promise<PostViewModel> {
    const post: PostViewModel | null =
      await this.postQueryRepository.getPostById(postId);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Post()
  async createPost(
    @Body() inputCreateDto: CreatePostDto,
  ): Promise<PostViewModel | null> {
    const blogId = inputCreateDto.blogId;
    const postId: string | null = await this.postService.createPost(
      inputCreateDto,
      blogId,
    );
    if (!postId) throw new NotFoundException();
    return this.postQueryRepository.getPostById(postId);
  }

  @UseGuards(AuthAccessJwtGuard)
  @Post(':postId/comments')
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @CurrentUser() userId: string,
  ) {
    const commentId = await this.commentService.createComment(createCommentDto.content, postId, userId);
    if (!commentId) throw new NotFoundException();
    return this.commentQueryRepository.getCommentById(commentId)
  }

  @Put(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Body() inputUpdateDto: UpdatePostDto,
    @Param('postId') postId: string,
  ) {
    const resultUpdate: string | null = await this.postService.postUpdate(
      inputUpdateDto,
      postId,
    );
    if (!resultUpdate) throw new NotFoundException();
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('postId') postId: string) {
    const isDeleted: boolean = await this.postService.deletePost(postId);
    if (!isDeleted) throw new NotFoundException();
  }
}
