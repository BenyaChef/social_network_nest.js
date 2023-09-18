import { Injectable } from '@nestjs/common';
import { IBlogQueryRepository } from '../interfaces/blog.query-repository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogQueryPaginationDto } from '../../dto/blog.query.pagination.dto';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { BlogSaViewModel } from '../../model/blog-sa.view.model';
import { BlogViewModel } from '../../model/blog.view.model';
import { BlogEntity } from '../../entities/blog.entity';

@Injectable()
export class BlogTypeormQueryRepository implements IBlogQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  findAllBlogsOfOwner(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogSaViewModel[]> | null> {
    return Promise.resolve(null);
  }

  findBanUserForBlog(blogId: string, userId: string) {}

  findBannedBlogUsers(query: BlogQueryPaginationDto, blogId: string) {}

  async getAllBlogs(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';
    const nameFilter =
      query.searchNameTerm !== null ? `%${query.searchNameTerm}%` : `%`;

    const queryBuilder = await this.dataSource
      .createQueryBuilder(BlogEntity, 'b')
      .where('b.name ILIKE :nameFilter', { nameFilter })
      .addOrderBy(`b.${query.sortBy}`, sortDirectionFilter);

    const [blogs, totalCount] = await queryBuilder
      .offset(offset)
      .limit(query.pageSize)
      .getManyAndCount();

    return new PaginationViewModel<BlogViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      blogs.map((b) => {
        return {
          id: b.id,
          name: b.name,
          description: b.description,
          websiteUrl: b.websiteUrl,
          createdAt: b.createdAt,
          isMembership: b.isMembership,
        };
      }),
    );
  }

 async getAllBlogsForCurrentUser(
    query: BlogQueryPaginationDto,
    userId: string,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {

    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';
    const nameFilter =
      query.searchNameTerm !== null ? `%${query.searchNameTerm}%` : `%`;

    const queryBuilder = await this.dataSource
      .createQueryBuilder(BlogEntity, 'b')
      .where('b.name ILIKE :nameFilter', { nameFilter })
      .addOrderBy(`b.${query.sortBy}`, sortDirectionFilter);

    const [blogs, totalCount] = await queryBuilder
      .skip(offset)
      .take(query.pageSize)
      .getManyAndCount();

    return new PaginationViewModel<BlogViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      blogs.map((b) => {
        return {
          id: b.id,
          name: b.name,
          description: b.description,
          websiteUrl: b.websiteUrl,
          createdAt: b.createdAt,
          isMembership: b.isMembership,
        };
      }),
    );
  }

  getBlogById(blogId: string): Promise<BlogViewModel | null> {
    return this.dataSource
      .createQueryBuilder(BlogEntity, 'b')
      .select()
      .where('id = :blogId', {blogId})
      .getOne()
  }
}
