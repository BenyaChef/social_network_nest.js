import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { UserDocument } from "../../user/schema/user.schema";
import { randomUUID } from "crypto";
import { BlogDocument } from "../../blog/schema/blog.schema";
import { PostDocument } from "../../post/schema/post.schema";

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
  @Prop({ required: true, type: String, unique: true })
  id: string

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

  @Prop({ required: true, type: String })
  titlePost: string

  @Prop({ required: true, type: String })
  blogId: string

  @Prop({ required: true, type: String })
  blogOwnerId: string

  @Prop({ required: true, type: String })
  blogName: string

  @Prop({ required: true, type: LikesInfoSchema })
  likesInfo: LikesInfo;

  update(content: string) {
    this.content = content;
  }

  static createComment(content: string, post: PostDocument, user: UserDocument, blog: BlogDocument): Comment {
    const newComment = new Comment();
    newComment.id = randomUUID()
    newComment.parentId = post.id;
    newComment.titlePost = post.title
    newComment.content = content;
    newComment.userId = user.id;
    newComment.userLogin = user.accountData.login;
    newComment.createdAt = new Date().toISOString();
    newComment.blogId = blog.id
    newComment.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: ReactionStatusEnum.None,
    };
    return newComment;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.statics.createComment = Comment.createComment
CommentSchema.methods.update = Comment.prototype.update