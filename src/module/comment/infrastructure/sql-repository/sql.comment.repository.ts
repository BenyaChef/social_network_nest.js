import { ICommentRepository } from '../interfaces/comment.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentDbModel } from '../../model/comment-db.model';
import { ReactionStatusEnum } from '../../../../enum/reaction.status.enum';

@Injectable()
export class SqlCommentRepository implements ICommentRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(newComment: CommentDbModel): Promise<any> {
    const resultInsertComment = await this.dataSource.query(
      `
        INSERT INTO public."Comments"(
        "Id", "PostId", "Content", "UserId", "CreatedAt")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
      [
        newComment.id,
        newComment.postId,
        newComment.content,
        newComment.userId,
        newComment.createdAt,
      ],
    );
    const findUser = await this.dataSource.query(
      `
   SELECT "Login"
   From public."Users"
   WHERE "Id" = $1`,
      [resultInsertComment[0].UserId],
    );

    return {
      id: resultInsertComment[0].Id,
      content: resultInsertComment[0].Content,
      commentatorInfo: {
        userId: resultInsertComment[0].UserId,
        userLogin: findUser[0].Login,
      },
      createdAt: resultInsertComment[0].CreatedAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: ReactionStatusEnum.None,
      },
    };
  }

  async delete(commentId: string): Promise<boolean> {
    const deleteResult = await this.dataSource.query(`
    DELETE 
        FROM public."Comments"
        WHERE "Id" = $1;
    `, [commentId])

    return deleteResult[1] > 0
  }

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentDbModel | null> {
    const findComment = await this.dataSource.query(`
    SELECT "Id", "PostId", "Content", "UserId", "CreatedAt"
    FROM public."Comments"
    WHERE "Id" = $1`, [commentId])

    if (findComment.length === 0) return null

    return {
      id: findComment[0].Id,
      content: findComment[0].Content,
      postId: findComment[0].PostId,
      userId: findComment[0].UserId,
      createdAt: findComment[0].CreatedAt,
    }
  }

  async update(comment: CommentDbModel) {
    const updateResult = await this.dataSource.query(`
    UPDATE public."Comments"
        SET "Content" = $1
        WHERE "Id" = $2;
    `, [comment.content, comment.id])

    return updateResult[1] > 0
  }

  async updateBanStatus(userId: string, banStatus: boolean) {}
}
