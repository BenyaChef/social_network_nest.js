import { Injectable } from '@nestjs/common';
import { IPostQueryRepository } from '../interfaces/post.query-repository.interface';
import { PostViewModel } from '../../model/post.view.model';
import { PostQueryPaginationDto } from '../../dto/post.query.pagination.dto';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostSqlQueryRepository implements IPostQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllPosts(
    query: PostQueryPaginationDto,
    userId: string | null,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;
    const sortDirectionFilter = sortDirection === -1 ? 'DESC' : 'ASC';
    const offset = (pageNumber - 1) * pageSize;

    const posts = await this.dataSource.query(
      `
    SELECT p.* 
    FROM public."Posts" p
    ORDER BY p."${sortBy}" COLLATE "C" ${sortDirectionFilter}
    OFFSET $1
    LIMIT $2`,
      [offset, pageSize],
    );

    const totalCount = await this.dataSource.query(`
    SELECT COUNT(*)
    FROM public."Posts"
    `);
    return new PaginationViewModel<PostViewModel[]>(
      +totalCount[0].count,
      pageNumber,
      pageSize,
      posts.map((p) => {
        return {
          id: p.Id,
          title: p.Title,
          shortDescription: p.ShortDescription,
          content: p.Content,
          blogId: p.BlogId,
          blogName: p.BlogName,
          createdAt: p.CreatedAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        };
      }),
    );
  }

  async getAllPostsForBlogId(
    query: PostQueryPaginationDto,
    blogId: string,
    userId?: string,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;
    const sortDirectionFilter = sortDirection === -1 ? 'DESC' : 'ASC';
    const offset = (pageNumber - 1) * pageSize;

    const posts = await this.dataSource.query(
      `
    SELECT p.* 
    FROM public."Posts" p
    WHERE "BlogId" = $1
    ORDER BY p."${sortBy}" COLLATE "C" ${sortDirectionFilter}
    OFFSET $2
    LIMIT $3`,
      [blogId, offset, pageSize],
    );

    const totalCount = await this.dataSource.query(
      `
    SELECT COUNT(*)
    FROM public."Posts"
    WHERE "BlogId" = $1`,
      [blogId],
    );
    return new PaginationViewModel<PostViewModel[]>(
      +totalCount[0].count,
      pageNumber,
      pageSize,
      posts.map((p) => {
        return {
          id: p.Id,
          title: p.Title,
          shortDescription: p.ShortDescription,
          content: p.Content,
          blogId: p.BlogId,
          blogName: p.BlogName,
          createdAt: p.CreatedAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        };
      }),
    );
  }

  async getPostById(
    postId: string,
    userId?: string,
  ): Promise<PostViewModel | null> {
    const post = await this.dataSource.query(
      `
    SELECT *
    FROM public."Posts"
    WHERE "Id" = $1`,
      [postId],
    );

    return {
      id: post[0].Id,
      title: post[0].Title,
      shortDescription: post[0].ShortDescription,
      content: post[0].Content,
      blogId: post[0].BlogId,
      blogName: post[0].BlogName,
      createdAt: post[0].CreatedAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
}
