import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateBlogDto } from '../dto/update.blog.dto';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { randomUUID } from "crypto";
import { UserDocument } from "../../user/schema/user.schema";
import e from "express";

@Schema({ versionKey: false })
export class Blog {
  @Prop({ required: true, type: String })
  id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  websiteUrl: string;

  @Prop({ required: true, type: String })
  createdAt: string;

  @Prop({ required: true, type: Boolean })
  isMembership: boolean;

  @Prop({ required: true, type: String })
  ownerId: string;

  @Prop({ required: true, type: String })
  ownerLogin: string;

  @Prop({ required: true, type: Boolean })
  isBanned: boolean;

  @Prop({ type: String, default: null})
  banDate: string | null;

  @Prop({ type: String, default: null})
  bannedUsers: string[]

  update(updateDto: UpdateBlogDto) {
    this.name = updateDto.name;
    this.description = updateDto.description;
    this.websiteUrl = updateDto.websiteUrl;
  }

  static createBlog(createDto: CreateBlogDto, user: UserDocument): Blog {
    const newBlog = new Blog();
    newBlog.id = randomUUID();
    newBlog.name = createDto.name;
    newBlog.description = createDto.description;
    newBlog.websiteUrl = createDto.websiteUrl;
    newBlog.ownerId = user.id;
    newBlog.ownerLogin = user.accountData.login;
    newBlog.isMembership = false;
    newBlog.isBanned = false
    newBlog.createdAt = new Date().toISOString();
    return newBlog;
  }
}

// interface BlogStatic {
//   createBlog(blogModel: BlogModel, createDto: CreateBlogDto): BlogDocument;
// }

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.methods.update = Blog.prototype.update;
BlogSchema.statics.createBlog = Blog.createBlog;

export type BlogDocument = HydratedDocument<Blog>;
// export type BlogModel = Model<BlogDocument> & BlogStatic;


