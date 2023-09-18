import { Injectable } from '@nestjs/common';
import { ICommentQueryRepository } from '../interfaces/comment.query-repository.interface';
import { CommentQueryPaginationDto } from '../../dto/comment.query.pagination.dto';
import { CommentViewModel } from '../../model/comment.view.model';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../../entities/comment.entity';
import { Repository } from 'typeorm';
import { ReactionsComments } from '../../../reaction/entities/reactions-comments.entity';
import { ReactionStatusEnum } from '../../../../enum/reaction.status.enum';
import { ColumnsAliases } from '../../../../enum/columns-alias.enum';

@Injectable()
export class CommentTypeormQueryRepository implements ICommentQueryRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(ReactionsComments)
    private reactionsRepository: Repository<ReactionsComments>,
  ) {}

  async getAllCommentsForAllPostsCurrentUser(
    query: CommentQueryPaginationDto,
    userId: string,
  ) {}

  async getCommentById(
    commentId: string,
    userId?: string | null,
  ): Promise<CommentViewModel | null> {
    const findComment = await this.commentRepository
      .createQueryBuilder('c')
      .addSelect(
        (qb) =>
          qb
            .select(`count(*)`)
            .from(ReactionsComments, 'rc')
            .leftJoin(`rc.user`, `u`)
            .where(`rc.parentId = c.id`)
            .andWhere(`rc.reactionStatus = 'Like'`),
        `like_count`,
      )
      .addSelect(
        (qb) =>
          qb
            .select(`count(*)`)
            .from(ReactionsComments, 'rc')
            .leftJoin(`rc.user`, `u`)
            .where(`rc.parentId = c.id`)
            .andWhere(`rc.reactionStatus = 'Dislike'`),
        `dislike_count`,
      )
      .addSelect(
        (qb) =>
          qb
            .select(`rc.reactionStatus`)
            .from(ReactionsComments, 'rc')
            .leftJoin(`rc.user`, `u`)
            .where(`rc.parentId = c.id`)
            .andWhere(`rc.userId = :userId`, { userId }),
        `my_status`,
      )
      .leftJoinAndSelect('c.user', 'u')
      .getRawMany();

    if (findComment.length === 0) return null;

    const mapComment = await this.commentMapper(findComment);
    return mapComment[0];
  }

  async getCommentByParentId(
    postId: string,
    query: CommentQueryPaginationDto,
    userId?: string | null,
  ): Promise<PaginationViewModel<CommentViewModel[]> | null> {
    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';

    const posts = await this.commentRepository
      .createQueryBuilder('c')
      .addSelect(
        (qb) =>
          qb
            .select(`count(*)`)
            .from(ReactionsComments, 'rc')
            .leftJoin(`rc.user`, `u`)
            .where(`rc.parentId = c.id`)
            .andWhere(`rc.reactionStatus = 'Like'`),
        `like_count`,
      )
      .addSelect(
        (qb) =>
          qb
            .select(`count(*)`)
            .from(ReactionsComments, 'rc')
            .leftJoin(`rc.user`, `u`)
            .where(`rc.parentId = c.id`)
            .andWhere(`rc.reactionStatus = 'Dislike'`),
        `dislike_count`,
      )
      .addSelect(
        (qb) =>
          qb
            .select(`rc.reactionStatus`)
            .from(ReactionsComments, 'rc')
            .leftJoin(`rc.user`, `u`)
            .where(`rc.parentId = c.id`)
            .andWhere(`rc.userId = :userId`, { userId }),
        `my_status`,
      )
      .leftJoinAndSelect('c.user', 'u')
      .where(`c.postId = :postId`, { postId })
      .orderBy(`c.${ColumnsAliases[query.sortBy]}`, sortDirectionFilter)
      .offset(offset)
      .limit(query.pageSize)
      .getRawMany()

    const totalCount = await this.commentRepository
      .createQueryBuilder('c')
      .where(`c.postId = :postId`, {postId} )
      .getCount()

    if(posts.length === 0) return null

    return new PaginationViewModel<CommentViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      await this.commentMapper(posts),
    );
  }

  async getCommentReactions(userId: string, commentId: string) {
    return this.reactionsRepository.findOneBy({
      parentId: commentId,
      userId: userId,
    });
  }

  private async commentMapper(comments: any[]): Promise<CommentViewModel[]> {
    return comments.map((c) => {
      return {
        id: c.c_id,
        content: c.c_content,
        commentatorInfo: {
          userId: c.u_id,
          userLogin: c.u_login,
        },
        createdAt: c.c_created_at,
        likesInfo: {
          likesCount: Number(c.like_count),
          dislikesCount: Number(c.dislike_count),
          myStatus: c.my_status || ReactionStatusEnum.None,
        },
      };
    });
  }
}
