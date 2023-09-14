import { Injectable } from '@nestjs/common';
import { IPostQueryRepository } from '../interfaces/post.query-repository.interface';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostQueryPaginationDto } from '../../dto/post.query.pagination.dto';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { PostViewModel } from '../../model/post.view.model';
import { PostColumnsAliases, PostEntity } from "../../entities/post.entity";
import { ReactionStatusEnum } from '../../../../enum/reaction.status.enum';

@Injectable()
export class PostTypeormQueryRepository implements IPostQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async getAllPosts(
    query: PostQueryPaginationDto,
    userId: string | null,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';
    console.log(query.sortBy);
    const queryBuilder = this.dataSource
      .createQueryBuilder(PostEntity, 'p')
      // .leftJoinAndSelect('p.blog', 'b')
      .orderBy(`p.${PostColumnsAliases[query.sortBy]}`, sortDirectionFilter)
      .skip(offset)
      .take(query.pageSize)

    const [posts, totalCount] = await Promise.all([
      await queryBuilder.getRawMany(),
      await queryBuilder.getCount(),
    ]);

    return new PaginationViewModel<PostViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      posts.map((p) => {
        return {
          id: p.p_id,
          title: p.p_title,
          shortDescription: p.p_shortdescription,
          content: p.p_content,
          blogId: p.p_blogId,
          blogName: p.p_blogname,
          createdAt: p.p_createdat,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: ReactionStatusEnum.None,
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
    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';
    const queryBuilder = await this.dataSource
      .createQueryBuilder(PostEntity, 'p')
      // .leftJoinAndSelect('p.blog', 'b')
      .andWhere('p.blogId = :blogId', { blogId })
      .orderBy(`p.${query.sortBy}`, sortDirectionFilter)

    const [posts, totalCount] = await Promise.all([
      await queryBuilder.skip(offset).take(query.pageSize).getRawMany(),
      await queryBuilder.getCount(),
    ]);
    return new PaginationViewModel<PostViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      posts.map((p) => {
        return {
          id: p.p_id,
          title: p.p_title,
          shortDescription: p.p_shortdescription,
          content: p.p_content,
          blogId: p.p_blogId,
          blogName: p.p_blogname,
          createdAt: p.p_createdat,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: ReactionStatusEnum.None,
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
    const findPost = await this.dataSource
      .createQueryBuilder(PostEntity, 'p')
      .leftJoinAndSelect('p.blog', 'b')
      .select()
      .where('p.id = :postId', { postId })
      .getOne();
    if (!findPost) return null;
    return {
      id: findPost.id,
      title: findPost.title,
      shortDescription: findPost.shortDescription,
      content: findPost.content,
      blogId: findPost.blog.id,
      blogName: findPost.blogName,
      createdAt: findPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: ReactionStatusEnum.None,
        newestLikes: [],
      },
    };
  }
}
