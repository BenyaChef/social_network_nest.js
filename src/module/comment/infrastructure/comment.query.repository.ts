import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../schema/comment.schema";
import { CommentViewModel } from "../model/comment.view.model";

@Injectable()
export class CommentQueryRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}
  
  async getCommentById(commentId: string, userId?: string | null): Promise<CommentViewModel | null> {
    const comment: CommentDocument | null = await this.commentModel.findOne({_id: commentId})
    if(!comment) return null
    return new CommentViewModel(comment)
  }
}