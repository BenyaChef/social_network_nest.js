import { Injectable } from '@nestjs/common';
import { IPostRepository } from '../interfaces/post.repository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post } from '../../schema/post.schema';
import { UpdatePostDto } from '../../dto/update.post.dto';
import { ReactionStatusEnum } from '../../../../enum/reaction.status.enum';
import { ReactionsPosts } from "../../../reaction/entities/reactions-posts.entity";

@Injectable()
export class PostSqlRepository implements IPostRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createPost(newPost: any): Promise<string> {
    return this.dataSource.query(
      `
      INSERT INTO public."Posts"(
       "Id", "Title", "ShortDescription", "Content", "BlogId", "BlogName", "CreatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        newPost.id,
        newPost.title,
        newPost.shortDescription,
        newPost.content,
        newPost.blogId,
        newPost.blogName,
        newPost.createdAt,
      ],
    );
  }

  async deletePost(postId: string): Promise<boolean> {
    const deleteResult = await this.dataSource.query(
      `
    DELETE 
    FROM public."Posts"
      WHERE "Id" = $1;
    `,
      [postId],
    );
    return deleteResult[1] > 0;
  }

  async getPostById(postId: string): Promise<any | null> {
    const post = await this.dataSource.query(
      `
    SELECT *
    FROM public."Posts" 
    WHERE "Id" = $1
    `,
      [postId],
    );
    if (post.length === 0) return null;

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
        myStatus: ReactionStatusEnum.None,
        newestLikes: [],
      },
    };
  }

  async update(updateDto: UpdatePostDto, postId: string) {
    return this.dataSource.query(
      `
    UPDATE public."Posts"
        SET "Title" = $1, 
            "ShortDescription" = $2, 
            "Content" = $3
        WHERE "Id" = $4;
    `,
      [updateDto.title, updateDto.shortDescription, updateDto.content, postId],
    );
  }

  getPostReactions(
    userId: string,
    postId: string,
  ): Promise<ReactionsPosts | null> {
    return Promise.resolve(null);
  }
}
