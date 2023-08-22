import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "../schema/comment.schema";
import { Model } from "mongoose";

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async getCommentById(commentId: string, userId?: string): Promise<CommentDocument | null> {
    return this.commentModel.findOne({ id: commentId})
  }

  async create(newComment: Comment): Promise<CommentDocument> {
    return this.commentModel.create(newComment)

  }

  async update(comment: CommentDocument) {
    return await comment.save()
  }

  async delete(commentId: string): Promise<boolean | null> {
    return this.commentModel.findOneAndDelete({ id: commentId})
  }

  async updateBanStatus(userId: string, banStatus: boolean) {
    return this.commentModel.updateOne({userId: userId} , {$set: {isUserBanned: banStatus}})
  }
}