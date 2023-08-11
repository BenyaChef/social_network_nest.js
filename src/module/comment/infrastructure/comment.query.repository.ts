import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Comment, CommentDocument } from '../schema/comment.schema';
import { CommentViewModel } from '../model/comment.view.model';
import {
  Reaction,
  ReactionDocument,
} from '../../reaction/schema/reaction.schema';
import { ReactionStatusEnum } from '../../../enum/reaction.status.enum';
import { CommentQueryPaginationDto } from "../dto/comment.query.pagination.dto";
import { PaginationViewModel } from "../../../helpers/pagination.view.mapper";

@Injectable()
export class CommentQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
  ) {}

  async getCommentByParentId(postId: string, query: CommentQueryPaginationDto, userId?: string | null): Promise<PaginationViewModel<CommentViewModel[]> | null> {
    const comments: CommentDocument[] | null = await this.findCommentsByFilterAndPagination(postId, query);
    if (comments.length === 0) return null;

    const commentsItems: any = []
    for(const comment of comments) {
      const likeCountAndStatus = await this.likesDataProcessing(comment._id.toString(), userId);
      commentsItems.push(new CommentViewModel(comment, likeCountAndStatus))
    }

    const totalCount = await this.commentModel.countDocuments({ parentId: postId })
    return new PaginationViewModel<CommentViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      commentsItems,
    );
  }

  async getCommentById(commentId: string, userId?: string | null,): Promise<CommentViewModel | null> {
    const comment: CommentDocument | null = await this.commentModel.findOne({ _id: commentId, });
    if (!comment) return null;
    const likeCountAndStatus = await this.likesDataProcessing(commentId, userId);
    return new CommentViewModel(comment, likeCountAndStatus);
  }

  private async likesDataProcessing(commentId: string, userId?: string | null) {
    const totalLike = await this.reactionModel.countDocuments({ parentId: commentId, reactionStatus: 'Like', });
    const totalDisLike = await this.reactionModel.countDocuments({ parentId: commentId, reactionStatus: 'Dislike', });
    if (!userId) {
      return {
        dislikesCount: +totalDisLike,
        likesCount: +totalLike,
        myStatus: ReactionStatusEnum.None,
      };
    }
    const likeStatusUser = await this.reactionModel.findOne({ userId: userId, parentId: commentId, });
    return {
      dislikesCount: totalDisLike,
      likesCount: totalLike,
      myStatus: likeStatusUser !== null ? likeStatusUser.reactionStatus : ReactionStatusEnum.None,
    };
  }

  private async findCommentsByFilterAndPagination(
    postId: string ,
    query: CommentQueryPaginationDto,
  ): Promise<CommentDocument[]> {
    return this.commentModel
      .find({parentId: postId})
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean();
  }
}
