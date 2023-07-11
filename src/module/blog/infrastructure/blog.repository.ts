import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from "../schema/blog.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
  }
  async getBlogById(blogId: string) {
      return this.blogModel.findOne({_id: blogId})
  }

  async save(newBlog: BlogDocument) {
    const result = await newBlog.save();
    return result.id
  }

  async delete(blogId: string) {
    const resultDelete = await this.blogModel.deleteOne({_id: blogId})
    return resultDelete.deletedCount === 1
  }
}
