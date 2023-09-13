import { Injectable } from "@nestjs/common";
import { IBlogQueryRepository } from "../interfaces/blog.query-repository.interface";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BlogQueryPaginationDto } from "../../dto/blog.query.pagination.dto";
import { PaginationViewModel } from "../../../../helpers/pagination.view.mapper";
import { BlogSaViewModel } from "../../model/blog-sa.view.model";
import { BlogViewModel } from "../../model/blog.view.model";

@Injectable()
export class BlogTypeormQueryRepository implements IBlogQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  }

  findAllBlogsOfOwner(query: BlogQueryPaginationDto): Promise<PaginationViewModel<BlogSaViewModel[]> | null> {
    return Promise.resolve(null);
  }

  findBanUserForBlog(blogId: string, userId: string) {
  }

  findBannedBlogUsers(query: BlogQueryPaginationDto, blogId: string) {
  }

  getAllBlogs(query: BlogQueryPaginationDto): Promise<PaginationViewModel<BlogViewModel[]>> {
    return Promise.resolve(new PaginationViewModel(1, 1, 1, []));
  }

  getAllBlogsForCurrentUser(query: BlogQueryPaginationDto, userId: string): Promise<PaginationViewModel<BlogViewModel[]>> {
    return Promise.resolve(new PaginationViewModel(1, 1, 1, []));
  }

  getBlogById(blogId: string): Promise<BlogViewModel | null> {
    return Promise.resolve(null);
  }
}