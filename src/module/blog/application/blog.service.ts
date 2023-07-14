import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../infrastructure/blog.repository';
import { InjectModel } from '@nestjs/mongoose';
import {Blog, BlogDocument, BlogModel,} from '../schema/blog.schema';
import { CreateBlogDto } from '../dto/create.blog.dto';
import { UpdateBlogDto } from '../dto/update.blog.dto';

@Injectable()
export class BlogService {
  constructor(
    protected readonly blogRepository: BlogRepository,
    @InjectModel(Blog.name) private BlogsModel: BlogModel,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto): Promise<string> {
    const newBlog: BlogDocument = this.BlogsModel.createBlog(this.BlogsModel, createBlogDto)
    return this.blogRepository.save(newBlog);
  }

  async updateBlog(updateBlogDto: UpdateBlogDto, blogId: string) {
    const blog: BlogDocument | null = await this.blogRepository.getBlogById(blogId);
    if (!blog) return null;
    blog.update(updateBlogDto)
    await this.blogRepository.save(blog);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return this.blogRepository.delete(blogId);
  }
}
