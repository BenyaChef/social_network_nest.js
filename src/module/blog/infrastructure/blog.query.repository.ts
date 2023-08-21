import { Injectable } from '@nestjs/common';
import { BlogQueryPaginationDto } from '../dto/blog.query.pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../schema/blog.schema';
import { FilterQuery, Model } from 'mongoose';
import { BlogViewModel } from '../model/blog.view.model';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { BlogSaViewModel } from '../model/blog-sa.view.model';
import { User, UserDocument } from '../../user/schema/user.schema';
import {
  BlogBanUsers,
  BlogBanUsersDocument,
} from '../schema/blog.ban-users.schema';
import { BlogBannedUserViewModel } from '../model/blog.banned-user.view-model';
import { ResultCode } from '../../../enum/result-code.enum';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(BlogBanUsers.name)
    private blogBanModel: Model<BlogBanUsersDocument>,
  ) {}

  async getAllBlogsForCurrentUser(
    query: BlogQueryPaginationDto,
    userId: string,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    const filter = {
      name: { $regex: query.searchNameTerm ?? '', $options: 'ix' },
      ownerId: userId,
    };
    return await this.findBlogsByFilterAndPagination(filter, query);
  }

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    const findBlog = await this.blogModel.findOne({ id: blogId });
    if (!findBlog) return null;
    return new BlogViewModel(findBlog);
  }

  async getAllBlogs(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    const filter = {
      name: { $regex: query.searchNameTerm ?? '', $options: 'ix' },
    };
    return await this.findBlogsByFilterAndPagination(filter, query);
  }

  async findAllBlogsOfOwner(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogViewModel[]> | null> {
    const filter = {
      name: { $regex: query.searchNameTerm ?? '', $options: 'ix' },
    };
    const blogs = await this.blogModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean();

    if (blogs.length === 0) return null;

    const totalCount = await this.blogModel.countDocuments(filter);
    return new PaginationViewModel<BlogViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      blogs.map((b) => new BlogSaViewModel(b)),
    );
  }

  async findBannedBlogUsers(query: BlogQueryPaginationDto, blogId: string, userId: string) {

    const blog = await this.blogModel.findOne({ id: blogId });

    if (!blog) return {data: null, code: ResultCode.NotFound}  ;
    if (blog.ownerId !== userId) return {data: null, code: ResultCode.Forbidden} ;

    const filter = {
      blogId: blogId,
      isBanned: true,
      login: { $regex: query.searchNameTerm ?? '', $options: 'ix' },
    };


    const findBanInfo = await this.blogBanModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean();

    console.log(findBanInfo);
    const totalCount = await this.blogBanModel.countDocuments(filter);
    const paginationViewModel = await new PaginationViewModel<BlogBannedUserViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      findBanInfo.map((banInfo) => new BlogBannedUserViewModel(banInfo)),
    );
    console.log(paginationViewModel);
    return { data: paginationViewModel, code: ResultCode.Success}
  }

  async findBanUserForBlog(blogId: string, userId: string) {
    return this.blogBanModel.findOne({ blogId: blogId, userId: userId });
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
