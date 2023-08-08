import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../application/comment.service';
import { CommentQueryRepository } from '../infrastructure/comment.query.repository';
import { CurrentUserId } from '../../../decorators/current-user-id.decorator';
import { NonBlockingAuthGuard } from '../../../guards/non-blocking.auth.guard';
import { ObjectIdGuard } from '../../../guards/objectid.validation.guard';
import { AuthAccessJwtGuard } from '../../../guards/auth-access.jwt.guard';
import { UpdateCommentDto } from '../dto/update.comment.dto';
import { CurrentUser } from "../../../decorators/current-user.decorator";

@Controller('comments')
export class CommentController {
  constructor(
    protected commentService: CommentService,
    protected commentQueryRepository: CommentQueryRepository,
  ) {}

  @UseGuards(NonBlockingAuthGuard)
  @UseGuards(ObjectIdGuard)
  @Get(':commentId')
  async getCommentById(
    @Param('commentId') commentId: string,
    @CurrentUserId() userId: string,
  ) {
    const comment = await this.commentQueryRepository.getCommentById(
      commentId,
      userId,
    );
    if (!comment) throw new NotFoundException();
    return comment;
  }

  @UseGuards(AuthAccessJwtGuard)
  @Put(':commentId')
  @UseGuards(ObjectIdGuard)
  async updateComment(
    @Param('commentId') commentId: string,
    @CurrentUser() userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    console.log(userId);
    const resultUpdate = await this.commentService.update(updateCommentDto.content, userId, commentId)
    return resultUpdate
  }
}
