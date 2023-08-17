import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { UserDocument } from "../../user/schema/user.schema";

@Schema({ _id: false, versionKey: false })
export class LikesInfo {
  @Prop({ required: true, type: Number })
  likesCount: number;

  @Prop({ required: true, type: Number })
  dislikesCount: number;

  @Prop({ required: true, type: String, enum: ReactionStatusEnum })
  myStatus: ReactionStatusEnum;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {

  @Prop({ required: true, type: String })
  parentId: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  userLogin: string;

  @Prop({ required: true, type: Boolean, default: false })
  isUserBanned: boolean;

  @Prop({ required: true, type: String })
  createdAt: string;

  @Prop({ required: true, type: LikesInfoSchema })
  likesInfo: LikesInfo;

  update(content: string) {
    this.content = content
  }

  static createComment(content: string, postId: string, user: UserDocument): Comment {
    const newComment = new Comment()
    newComment.parentId = postId
    newComment.content = content
    newComment.userId = user.id
    newComment.userLogin = user.accountData.login
    newComment.createdAt = new Date().toISOString()
    newComment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: ReactionStatusEnum.None
    }
    return newComment
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.statics.createComment = Comment.createComment
CommentSchema.methods.update = Comment.prototype.update