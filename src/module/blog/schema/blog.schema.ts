import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateBlogDto } from '../dto/update.blog.dto';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { randomUUID } from "crypto";
import { UserDocument } from "../../user/schema/user.schema";

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


  // update(updateDto: UpdateBlogDto) {
  //   this.name = updateDto.name;
  //   this.description = updateDto.description;
  //   this.websiteUrl = updateDto.websiteUrl;
  // }

  static createBlog(createDto: CreateBlogDto, user: UserDocument): Blog {
    const newBlog = new Blog();
    newBlog.id = randomUUID();
    newBlog.name = createDto.name;
    newBlog.description = createDto.description;
    newBlog.websiteUrl = createDto.websiteUrl;
    newBlog.isMembership = false;
    newBlog.createdAt = new Date().toISOString();
    return newBlog;
  }
}

// interface BlogStatic {
//   createBlog(blogModel: BlogModel, createDto: CreateBlogDto): BlogDocument;
// }

export const BlogSchema = SchemaFactory.createForClass(Blog);
// BlogSchema.methods.update = Blog.prototype.update;
BlogSchema.statics.createBlog = Blog.createBlog;

export type BlogDocument = HydratedDocument<Blog>;
// export type BlogModel = Model<BlogDocument> & BlogStatic;


