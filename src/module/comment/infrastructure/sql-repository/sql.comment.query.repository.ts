import { ICommentQueryRepository } from '../interfaces/comment.query-repository.interface';
import { Injectable } from '@nestjs/common';
import { CommentQueryPaginationDto } from '../../dto/comment.query.pagination.dto';
import { CommentViewModel } from '../../model/comment.view.model';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReactionStatusEnum } from "../../../../enum/reaction.status.enum";

@Injectable()
export class SqlCommentQueryRepository implements ICommentQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  getAllCommentsForAllPostsCurrentUser(
    query: CommentQueryPaginationDto,
    userId: string,
  ) {}

  async getCommentById(
    commentId: string,
    userId?: string | null,
  ): Promise<CommentViewModel | null> {
    const findComment = await this.dataSource.query(`
    SELECT
    "Id", "PostId", "Content", "UserId", "CreatedAt",
    (SELECT "Login" FROM  public."Users" WHERE "Id" = "Comments"."UserId") AS "UserLogin",
    (SELECT COUNT(*) FROM public."Reactions" WHERE "ParentId" = "Comments"."Id" AND "Status" = 'Like') AS "LikeCount",
    (SELECT COUNT(*) FROM public."Reactions" WHERE "ParentId" = "Comments"."Id" AND "Status" = 'Dislike') AS "DislikeCount",
    (SELECT "Status" FROM public."Reactions" WHERE "ParentId" = "Comments"."Id" AND "UserId" = $1) AS "MyStatus"
    FROM public."Comments"
    WHERE "Id" = $2;`, [userId, commentId]
    );

    if(findComment.length === 0) return null

    return {
      id: findComment[0].Id,
      content: findComment[0].Content,
      commentatorInfo: {
        userId: findComment[0].UserId,
        userLogin: findComment[0].UserLogin,
      },
      createdAt: findComment[0].CreatedAt,
      likesInfo: {
        likesCount: +findComment[0].LikeCount,
        dislikesCount: +findComment[0].DislikeCount,
        myStatus: findComment[0].MyStatus || ReactionStatusEnum.None ,
      },
    };
  }

  getCommentByParentId(
    postId: string,
    query: CommentQueryPaginationDto,
    userId?: string | null,
  ): Promise<PaginationViewModel<CommentViewModel[]> | null> {
    return Promise.resolve(null);
  }
}