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

  async delete(commentId: string): Promise<boolean | null> {
    return Promise.resolve(null);
  }

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentDbModel | null> {
    return Promise.resolve(null);
  }

  async update(comment: CommentDbModel) {
    return true;
  }

  async updateBanStatus(userId: string, banStatus: boolean) {}
}
