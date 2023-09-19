import { Injectable } from '@nestjs/common';
import { IPostQueryRepository } from '../interfaces/post.query-repository.interface';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostQueryPaginationDto } from '../../dto/post.query.pagination.dto';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { PostViewModel } from '../../model/post.view.model';
import { ReactionStatusEnum } from '../../../../enum/reaction.status.enum';
import { PostEntity } from '../../entities/post.entity';
import { ColumnsAliases } from '../../../../enum/columns-alias.enum';
import { ReactionsPosts } from '../../../reaction/entities/reactions-posts.entity';


@Injectable()
export class PostTypeormQueryRepository implements IPostQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource, @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,) {
  }

  async getAllPosts(query: PostQueryPaginationDto, userId: string | null,): Promise<PaginationViewModel<PostViewModel[]>> {
    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';
    console.log(query.sortBy);
    const posts = await this.dataSource
      .createQueryBuilder(PostEntity, 'p')
      .addSelect((qb) => qb
        .select(`count(*)`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.reactionStatus = 'Like'`), `like_count`,)
      .addSelect((qb) => qb
        .select(`count(*)`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.reactionStatus = 'Dislike'`), `dislike_count`,)
      .addSelect((qb) => qb
        .select(`rc.reactionStatus`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.userId = :userId`, { userId }), `my_status`,)
      .addSelect((qb) => qb
        .select(`jsonb_agg(json_build_object('addedAt', agg.created_at, 'userId', cast(agg.user_id as varchar), 'login', agg.login))`,)
        .from((qb) => {
          return qb
            .select(`rp.created_at, rp.user_id, u.login`)
            .from(ReactionsPosts, 'rp')
            .leftJoin('rp.user', 'u')
            .where('rp.parentId = p.id')
            .andWhere(`rp.reaction_status = 'Like'`)
            .orderBy('rp.created_at', 'DESC')
            .limit(3);
        }, 'agg'), 'newest_likes')
      .leftJoinAndSelect(`p.blog`, 'b')
      .orderBy(`${ColumnsAliases[query.sortBy] === 'blogName' ? 'b.name' : `p.${ColumnsAliases[query.sortBy]}`}`, sortDirectionFilter)
      .offset(offset)
      .limit(query.pageSize)
      .getRawMany()



    const totalCount = await this.dataSource.createQueryBuilder(PostEntity, 'p').getCount()


    return new PaginationViewModel<PostViewModel[]>(totalCount, query.pageNumber, query.pageSize, await this.mapperPosts(posts))
  }

  async getAllPostsForBlogId(query: PostQueryPaginationDto, blogId: string, userId?: string,): Promise<PaginationViewModel<PostViewModel[]>> {
    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';
    const posts = await this.dataSource
      .createQueryBuilder(PostEntity, 'p')
      .addSelect((qb) => qb
        .select(`count(*)`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.reactionStatus = 'Like'`), `like_count`,)
      .addSelect((qb) => qb
        .select(`count(*)`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.reactionStatus = 'Dislike'`), `dislike_count`,)
      .addSelect((qb) => qb
        .select(`rc.reactionStatus`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.userId = :userId`, { userId }), `my_status`,)
      .addSelect((qb) => qb
        .select(`jsonb_agg(json_build_object('addedAt', agg.created_at, 'userId', cast(agg.user_id as varchar), 'login', agg.login))`,)
        .from((qb) => {
          return qb
            .select(`rp.created_at, rp.user_id, u.login`)
            .from(ReactionsPosts, 'rp')
            .leftJoin('rp.user', 'u')
            .where('rp.parentId = p.id')
            .andWhere(`rp.reaction_status = 'Like'`)
            .orderBy('rp.created_at', 'DESC')
            .limit(3);
        }, 'agg'), 'newest_likes')
      .leftJoinAndSelect(`p.blog`, 'b')
      .where(`p.blogId = :blogId`, {blogId})
      .orderBy(`p.${ColumnsAliases[query.sortBy]}`, sortDirectionFilter)
      .offset(offset)
      .limit(query.pageSize)
      .getRawMany()


    const totalCount = await this.dataSource.createQueryBuilder(PostEntity, 'p').where(`p.blogId = :blogId`, {blogId}).getCount()


    return new PaginationViewModel<PostViewModel[]>(totalCount, query.pageNumber, query.pageSize, await this.mapperPosts(posts))
  }

  async getPostById(postId: string, userId?: string): Promise<PostViewModel | null> {
    const findPost = await this.dataSource
      .createQueryBuilder(PostEntity, 'p')
      .addSelect((qb) => qb
        .select(`count(*)`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.reactionStatus = 'Like'`), `like_count`,)
      .addSelect((qb) => qb
        .select(`count(*)`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.reactionStatus = 'Dislike'`), `dislike_count`,)
      .addSelect((qb) => qb
        .select(`rc.reactionStatus`)
        .from(ReactionsPosts, 'rc')
        .leftJoin(`rc.user`, `u`)
        .where(`rc.parentId = p.id`)
        .andWhere(`rc.userId = :userId`, { userId }), `my_status`,)
      .addSelect((qb) => qb
        .select(`jsonb_agg(json_build_object('addedAt', agg.created_at, 'userId', cast(agg.user_id as varchar), 'login', agg.login))`,)
        .from((qb) => {
          return qb
            .select(`rp.created_at, rp.user_id, u.login`)
            .from(ReactionsPosts, 'rp')
            .leftJoin('rp.user', 'u')
            .where('rp.parentId = p.id')
            .andWhere(`rp.reaction_status = 'Like'`)
            .orderBy('rp.created_at', 'DESC')
            .limit(3);
        }, 'agg'), 'newest_likes')
      .leftJoinAndSelect(`p.blog`, 'b')
      .where(`p.id = :postId`, { postId })
      .getRawMany();

    if (!findPost) return null;
    const post = await this.mapperPosts(findPost)
    return post[0]

  }

  private async mapperPosts(posts: any[]): Promise<PostViewModel[]> {
    return posts.map((p) => {
      return {
        id: p.p_id.toString(),
        title: p.p_title,
        shortDescription: p.p_short_description,
        content: p.p_content,
        blogId: p.p_blog_id.toString(),
        blogName: p.b_name,
        createdAt: p.p_created_at,
        extendedLikesInfo: {
          likesCount: Number(p.like_count),
          dislikesCount: Number(p.dislike_count),
          myStatus: p.my_status || ReactionStatusEnum.None,
          newestLikes: p.newest_likes || []
        }
      }
    })
  }
}
