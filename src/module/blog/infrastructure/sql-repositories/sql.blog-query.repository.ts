import { IBlogQueryRepository } from '../interfaces/blog.query-repository.interface';
import { BlogQueryPaginationDto } from '../../dto/blog.query.pagination.dto';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { BlogSaViewModel } from '../../model/blog-sa.view.model';
import { BlogViewModel } from '../../model/blog.view.model';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlBlogQueryRepository implements IBlogQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAllBlogsOfOwner(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogSaViewModel[]> | null> {

    const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = query
    const nameFilter = searchNameTerm !== null ? `%${searchNameTerm}%` : `%`;
    const sortDirectionFilter = sortDirection === -1 ? 'DESC' : 'ASC';
    const offset = (pageNumber - 1) * pageSize;

    const findBlogs = await this.dataSource.query(`
    SELECT b.*, u."Login"
    FROM public."Blogs" AS b
    LEFT JOIN  public."Users" AS u
    ON b."OwnerId" = u."Id"
    WHERE b."Name" ILIKE $1 
    ORDER BY b."${sortBy}" COLLATE "C" ${sortDirectionFilter}
    OFFSET $2
    LIMIT $3
    `, [nameFilter, offset, pageSize])

    const totalCount = await this.dataSource.query(`
    SELECT COUNT(*)
    FROM public."Blogs"
    WHERE "Name" ILIKE $1 
    `, [nameFilter])

    return new PaginationViewModel(
      +totalCount[0].count,
      pageNumber,
      pageSize,
      findBlogs.map((b) => {
        return {
          id: b.Id,
          name: b.Name,
          description: b.Description,
          websiteUrl: b.WebsiteUrl,
          createdAt: b.CreatedAt,
          isMembership: b.IsMembership,
          blogOwnerInfo: {
            userId: b.OwnerId,
            userLogin: b.Login
          },
          banInfo: {
            isBanned: b.IsBanned,
            banDate: b.BanDate
          }
        };
      }),
    );
  }

  async findBanUserForBlog(blogId: string, userId: string) {}

  async findBannedBlogUsers(
    query: BlogQueryPaginationDto,
    blogId: string
  ) {
    const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = query
    const loginFilter = searchNameTerm !== null ? `%${searchNameTerm}%` : `%`;
    const sortDirectionFilter = sortDirection === -1 ? 'DESC' : 'ASC';
    const offset = (pageNumber - 1) * pageSize;

    const bannedUsersFound = await this.dataSource.query(`
    SELECT *
    FROM public."UsersBanList" 
    WHERE "IsBanned" = true AND "BlogId" = $1 AND "Login" ILIKE $2
    ORDER BY "${sortBy}" COLLATE "C" ${sortDirectionFilter}
    OFFSET $3
    LIMIT $4
    `, [blogId, loginFilter, offset, pageSize])

    const totalCount = await this.dataSource.query(
      `
    SELECT COUNT(*)
    FROM public."UsersBanList"
    WHERE  "IsBanned" = true AND "BlogId" = $1 AND "Login" ILIKE $2`,
      [blogId, loginFilter]
    );

    return new PaginationViewModel(
      +totalCount[0].count,
      pageNumber,
      pageSize,
      bannedUsersFound.map((u) => {
        return {
          id: u.UserId,
          login: u.Login,
          banInfo: {
            isBanned: u.IsBanned,
            banDate: u.CreatedAt,
            banReason: u.BanReason
          }
        };
      }),
    );

  }

  async getAllBlogs(
    query: BlogQueryPaginationDto,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;
    const nameFilter = searchNameTerm !== null ? `%${searchNameTerm}%` : `%`;
    const sortDirectionFilter = sortDirection === -1 ? 'DESC' : 'ASC';
    const offset = (pageNumber - 1) * pageSize;

    const totalCount = await this.dataSource.query(
      `
    SELECT COUNT(*)
    FROM public."Blogs" b
    WHERE b."IsBanned" = false AND b."Name" ILIKE $1`,
      [nameFilter],
    );

    const findBlogs = await this.dataSource.query(
      `
    SELECT b.*
    FROM public."Blogs" b
    WHERE b."Name" ILIKE $1 AND b."IsBanned" = false
    ORDER BY b."${sortBy}" COLLATE "C" ${sortDirectionFilter}
    OFFSET $2
    LIMIT $3`,
      [nameFilter, offset, pageSize],
    );

    return new PaginationViewModel(
      +totalCount[0].count,
      pageNumber,
      pageSize,
      findBlogs.map((b) => {
        return {
          id: b.Id,
          name: b.Name,
          description: b.Description,
          websiteUrl: b.WebsiteUrl,
          createdAt: b.CreatedAt,
          isMembership: b.IsMembership,
        };
      }),
    );
  }

  async getAllBlogsForCurrentUser(
    query: BlogQueryPaginationDto,
    userId: string,
  ): Promise<PaginationViewModel<BlogViewModel[]>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      query;
    const nameFilter = searchNameTerm !== null ? `%${searchNameTerm}%` : `%`;
    const sortDirectionFilter = sortDirection === -1 ? 'DESC' : 'ASC';
    const offset = (pageNumber - 1) * pageSize;

    const blogs = await this.dataSource.query(`
    SELECT *
    FROM public."Blogs" b
    WHERE "OwnerId" = $1 AND b."Name" ILIKE $2
    ORDER BY b."${sortBy}" COLLATE "C" ${sortDirectionFilter}
    OFFSET $3
    LIMIT $4

    `, [userId, nameFilter, offset, pageSize])
    const totalCount = await this.dataSource.query(
      `
    SELECT COUNT(*)
    FROM public."Blogs" b
    WHERE  "OwnerId" = $1 AND b."Name" ILIKE $2`,
      [userId, nameFilter],
    );

    return new PaginationViewModel(
      +totalCount[0].count,
      pageNumber,
      pageSize,
      blogs.map((b) => {
        return {
          id: b.Id,
          name: b.Name,
          description: b.Description,
          websiteUrl: b.WebsiteUrl,
          createdAt: b.CreatedAt,
          isMembership: b.IsMembership,
        };
      }),
    );

  }

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    const blog = await this.dataSource.query(
      `
    SELECT 
    "Id" AS "id", 
    "Name" AS "name", 
    "Description" AS "description", 
    "WebsiteUrl" AS "websiteUrl", 
    "CreatedAt" AS "createdAt", 
    "IsMembership" AS "isMembership"
    FROM public."Blogs"
    WHERE "Id" = $1 AND "IsBanned" = false`,
      [blogId],
    );
    if (blog.length === 0) return null;
    return blog[0];
  }
}
