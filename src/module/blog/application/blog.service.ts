import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../infrastructure/blog.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../schema/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { UpdateBlogDto } from "../dto/update.blog.dto";

@Injectable()
export class BlogService {
  constructor(
    protected readonly blogRepository: BlogRepository,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async createBlog(body: CreateBlogDto) {
    const newBlog: BlogDocument = new this.blogModel(body);
    return this.blogRepository.save(newBlog);
  }

  async updateBlog(body: UpdateBlogDto, blogId: string) {
    const blog = await this.blogRepository.getBlogById(blogId)
    if(!blog) return null
    blog.name = body.name
    blog.description = body.description
    blog.websiteUrl = body.websiteUrl
    await this.blogRepository.save(blog)
  }

  async deleteBlog(blogId: string) {
    return this.blogRepository.delete(blogId)
  }
}
