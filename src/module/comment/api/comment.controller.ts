import {
  Body,
  Controller, Delete,
  Get, HttpCode, HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards
} from "@nestjs/common";
import { CommentService } from '../application/comment.service';
import { CommentQueryRepository } from '../infrastructure/comment.query.repository';
import { CurrentUserId } from '../../../decorators/current-user-id.decorator';
import { NonBlockingAuthGuard } from '../../../guards/non-blocking.auth.guard';
import { AuthAccessJwtGuard } from '../../../guards/auth-access.jwt.guard';
import { UpdateCommentDto } from '../dto/update.comment.dto';
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { exceptionHandler } from "../../../exception/exception.handler";
import { ReactionStatusDto } from "../dto/reaction.status.dto";

@Controller('comments')
export class CommentController {
  constructor(
    protected commentService: CommentService,
    protected commentQueryRepository: CommentQueryRepository,
  ) {}

  @UseGuards(NonBlockingAuthGuard)
  @Get(':commentId')
  async getCommentById(
    @Param('commentId') commentId: string,
    @CurrentUserId() userId: string,
  ) {
    const comment = await this.commentQueryRepository.getCommentById(commentId, userId,);
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @UseGuards(AuthAccessJwtGuard)
  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param('commentId') commentId: string,
    @CurrentUser() userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const resultUpdate = await this.commentService.update(updateCommentDto.content, userId, commentId)
    return exceptionHandler(resultUpdate)
  }

  @UseGuards(AuthAccessJwtGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUser() userId: string
  ) {
    const resultDelete = await this.commentService.deleteComment(userId, commentId)
    return exceptionHandler(resultDelete)
  }

  @UseGuards(AuthAccessJwtGuard)
  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeReactionForComment(
    @Param('commentId') commentId: string,
    @CurrentUser() userId: string,
    @Body() reactionDto: ReactionStatusDto
  ) {
    const result = await this.commentService.changeReactionForComment(commentId, userId, reactionDto.likeStatus)

    return exceptionHandler(result)
  }
}
