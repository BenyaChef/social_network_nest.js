import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UpdatePostDto } from "../dto/update.post.dto";
import { BlogDocument } from "../../blog/schema/blog.schema";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { randomUUID } from "crypto";
import { PostCreateDto } from "../dto/create.post.dto";

@Schema({ _id: false, versionKey: false })
class NewestLikes {
  @Prop({ required: true, type: String })
  addedAt: string;
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  login: string;
}

export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);

@Schema({ _id: false, versionKey: false})
export class ExtendedLikesInfo {
    @Prop({ required: true, type: Number })
    likesCount: number;
    @Prop({ required: true, type: Number })
    dislikesCount: number;
    @Prop({ required: true, type: String, enum: ReactionStatusEnum })
    myStatus: ReactionStatusEnum;
    @Prop({ required: true, type: [NewestLikesSchema] })
    newestLikes: NewestLikes[];
}

export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);

@Schema({versionKey: false })
export class Post {

  @Prop({ required: true, type: String, unique: true})
  id: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  shortDescription: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: String })
  blogId: string;

  @Prop({ required: true, type: String })
  blogName: string;

  @Prop({ required: true, type: String })
  createdAt: string;

  @Prop({ required: true, type: ExtendedLikesInfoSchema })
  extendedLikesInfo: ExtendedLikesInfo;

  update(updateDto: UpdatePostDto, blog: BlogDocument) {
    this.title = updateDto.title;
    this.shortDescription = updateDto.shortDescription;
    this.content = updateDto.content;
    this.blogId = blog.id;
    this.blogName = blog.name;
  }

  static createPost(createDto: PostCreateDto, blog: BlogDocument): Post {
    const newPost = new Post();
    newPost.id = randomUUID()
    newPost.blogName = blog.name;
    newPost.blogId = blog.id;
    newPost.title = createDto.title;
    newPost.content = createDto.content;
    newPost.shortDescription = createDto.shortDescription;
    newPost.createdAt = new Date().toISOString();
    newPost.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: ReactionStatusEnum.None,
      newestLikes: [],
    };
    return newPost;
  }

}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.methods.update = Post.prototype.update
PostSchema.statics.createPost = Post.createPost

export type PostDocument = HydratedDocument<Post>;
