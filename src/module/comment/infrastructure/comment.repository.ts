import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "../schema/comment.schema";
import { Model } from "mongoose";

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async getCommentById(commentId: string): Promise<CommentDocument | null> {
    return this.commentModel.findOne({_id: commentId})
  }

  async save(newComment: Comment): Promise<string> {
    const result = await this.commentModel.create(newComment)
    return result.id
  }

  async update(comment: CommentDocument) {
    console.log(comment);
    return await comment.save()
  }

}