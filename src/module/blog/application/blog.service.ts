// import { Injectable } from '@nestjs/common';
// import { BlogRepository } from '../infrastructure/blog.repository';
// import { InjectModel } from '@nestjs/mongoose';
// import {Blog, BlogDocument, BlogModel,} from '../schema/blog.schema';
// import { CreateBlogDto } from '../dto/create.blog.dto';
// import { UpdateBlogDto } from '../dto/update.blog.dto';
//
// @Injectable()
// export class BlogService {
//   constructor(
//     protected readonly blogRepository: BlogRepository,
//     @InjectModel(Blog.name) private BlogsModel: BlogModel,
//   ) {}
//
//   async createBlog(createBlogDto: CreateBlogDto, userId: string): Promise<string> {
//     const newBlog: Blog = Blog.createBlog(createBlogDto, userId)
//     return this.blogRepository.create(newBlog);
//   }
//
//   async updateBlog(updateBlogDto: UpdateBlogDto, blogId: string) {
//     const blog: BlogDocument | null = await this.blogRepository.getBlogById(blogId);
//     if (!blog) return null;
//     blog.update(updateBlogDto)
//     await this.blogRepository.save(blog);
//   }
//
//   async deleteBlog(blogId: string, userId: string): Promise<boolean> {
//     const blog = await this.blogRepository.getBlogById(blogId)
//
//     return this.blogRepository.delete(blogId);
//   }
// }
