import { Injectable } from '@nestjs/common';
import { IPostQueryRepository } from '../interfaces/post.query-repository.interface';
import { PostViewModel } from '../../model/post.view.model';
import { PostQueryPaginationDto } from '../../dto/post.query.pagination.dto';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReactionStatusEnum } from "../../../../enum/reaction.status.enum";

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

    const posts = await this.dataSource.query(`
     SELECT p.*,
    (SELECT COUNT(*) FROM public."Reactions" WHERE "ParentId" = p."Id" AND "Status" = 'Like') AS "LikeCount",
    (SELECT COUNT(*) FROM public."Reactions" WHERE "ParentId" = p."Id" AND "Status" = 'Dislike') AS "DislikeCount",
    (SELECT "Status" FROM public."Reactions" WHERE "ParentId" = p."Id" AND "UserId" = $1) AS "MyStatus",
    ARRAY(
      SELECT json_build_object(
        'addedAt', r."AddedAt",
        'userId', r."UserId",
        'login', u."Login"
      )
      FROM public."Reactions" r
      LEFT JOIN public."Users" u ON r."UserId" = u."Id"
      WHERE r."ParentId" = p."Id" AND r."Status" = 'Like'
      ORDER BY r."AddedAt" DESC
      LIMIT 3
    ) AS "NewestLikes"
  FROM public."Posts" p
  ORDER BY p."${sortBy}" COLLATE "C" ${sortDirectionFilter}
  OFFSET $2
  LIMIT $3`,
      [userId, offset, pageSize]
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
            likesCount: +p.LikeCount,
            dislikesCount: +p.DislikeCount,
            myStatus: p.MyStatus || ReactionStatusEnum.None,
            newestLikes: p.NewestLikes,
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

    const posts = await this.dataSource.query(`
     SELECT p.*,
    (SELECT COUNT(*) FROM public."Reactions" WHERE "ParentId" = p."Id" AND "Status" = 'Like') AS "LikeCount",
    (SELECT COUNT(*) FROM public."Reactions" WHERE "ParentId" = p."Id" AND "Status" = 'Dislike') AS "DislikeCount",
    (SELECT "Status" FROM public."Reactions" WHERE "ParentId" = p."Id" AND "UserId" = $1) AS "MyStatus",
    ARRAY(
      SELECT json_build_object(
        'addedAt', r."AddedAt",
        'userId', r."UserId",
        'login', u."Login"
      )
      FROM public."Reactions" r
      LEFT JOIN public."Users" u ON r."UserId" = u."Id"
      WHERE r."ParentId" = p."Id" AND r."Status" = 'Like'
      ORDER BY r."AddedAt" DESC
      LIMIT 3
    ) AS "NewestLikes"
  FROM public."Posts" p
  WHERE p."BlogId" = $2
  ORDER BY p."${sortBy}" COLLATE "C" ${sortDirectionFilter}
  OFFSET $3
  LIMIT $4`,
      [userId ,blogId, offset, pageSize],
    );

    console.log(posts);
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
            likesCount: +p.LikeCount,
            dislikesCount: +p.DislikeCount,
            myStatus: p.MyStatus || ReactionStatusEnum.None,
            newestLikes: p.NewestLikes,
          },
        };
      }),
    );
  }

  async getPostById(
    postId: string,
    userId?: string,
  ): Promise<PostViewModel | null> {

    const post = await this.dataSource.query(`
    SELECT *,
        (SELECT COUNT(*) FROM public."Reactions" WHERE "ParentId" = $2 AND "Status" = 'Like') AS "LikeCount",
        (SELECT COUNT(*) FROM public."Reactions" WHERE "ParentId" = $2 AND "Status" = 'Dislike') AS "DislikeCount",
        (SELECT "Status" FROM public."Reactions" WHERE "ParentId" = $2 AND "UserId" = $1) AS "MyStatus"
        FROM public."Posts"
        WHERE "Id" = $2`,
        [userId, postId],
    );

    if(post.length === 0) return null

    const lastLikes = await this.dataSource.query(`
    SELECT "AddedAt"  AS "addedAt", "UserId" AS "userId",
        (SELECT "Login" AS "login" FROM public."Users"  WHERE "Id" = "Reactions"."UserId") AS login
         FROM public."Reactions" 
         WHERE "ParentId" = $1 AND "Status" = 'Like'
         ORDER BY "Reactions"."AddedAt" COLLATE "C" DESC 
         LIMIT 3`,
         [postId])


    return {
      id: post[0].Id,
      title: post[0].Title,
      shortDescription: post[0].ShortDescription,
      content: post[0].Content,
      blogId: post[0].BlogId,
      blogName: post[0].BlogName,
      createdAt: post[0].CreatedAt,
      extendedLikesInfo: {
        likesCount: +post[0].LikeCount,
        dislikesCount: +post[0].DislikeCount,
        myStatus: post[0].MyStatus || ReactionStatusEnum.None,
        newestLikes: lastLikes,
      },
    };
  }
}
