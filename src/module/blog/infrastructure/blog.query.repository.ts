import { Injectable } from '@nestjs/common';
import { BlogQueryPaginationDto } from '../dto/blog.query.pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../schema/blog.schema';
import { FilterQuery, Model } from 'mongoose';
import { BlogViewModel } from '../model/blog.view.model';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';

@Injectable()
export class BlogQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    const findBlog = await this.blogModel.findOne({ _id: blogId });
    if (!findBlog) return null;
    return new BlogViewModel(findBlog);
  }

  async getAllBlogs(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    const pagination = new BlogQueryPaginationDto(query);
    const filter = {
      name: { $regex: pagination.searchNameTerm ?? '', $options: 'ix' },
    };
    return await this.findBlogsByFilterAndPagination(filter, pagination);
  }

  private async findBlogsByFilterAndPagination(
    filter: FilterQuery<Blog>,
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    const blogs = await this.blogModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean();
    const totalCount = await this.blogModel.countDocuments(filter);
    return new PaginationViewModel<BlogViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      blogs.map((blog) => new BlogViewModel(blog)),
    );
  }
}
