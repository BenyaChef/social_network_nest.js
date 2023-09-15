import { Injectable } from '@nestjs/common';
import { IPostQueryRepository } from '../interfaces/post.query-repository.interface';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostQueryPaginationDto } from '../../dto/post.query.pagination.dto';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { PostViewModel } from '../../model/post.view.model';
import { ReactionStatusEnum } from '../../../../enum/reaction.status.enum';
import { PostEntity } from "../../entities/post.entity";
import { ColumnsAliases } from "../../../../enum/columns-alias.enum";

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
    const queryBuilder = this.dataSource
      .createQueryBuilder(PostEntity, 'p')
      .leftJoinAndSelect('p.blog', 'b')
      .select([
        'p.id',
        'p.title',
        'p.shortDescription',
        'p.content',
        'p.blogId',
        'b.name',
        'p.createdAt',
      ])

    const [posts, totalCount] = await queryBuilder
      .orderBy(`${ColumnsAliases[query.sortBy]}`, sortDirectionFilter)
      .offset(offset)
      .limit(query.pageSize)
      .getManyAndCount()

    console.log(posts);
    return new PaginationViewModel<PostViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      posts.map((p) => {
        return {
          id: p.id,
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          blogId: p.blogId,
          blogName: p.blog.name,
          createdAt: p.createdAt,
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
      .leftJoinAndSelect('p.blog', 'b')
      .where('p.blogId = :blogId', { blogId })

    const [posts, totalCount] = await queryBuilder
      .orderBy(`${ColumnsAliases[query.sortBy]}`, sortDirectionFilter)
      .offset(offset)
      .limit(query.pageSize)
      .getManyAndCount()


    return new PaginationViewModel<PostViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      posts.map((p) => {
        return {
          id: p.id,
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          blogId: p.blogId,
          blogName: p.blog.name,
          createdAt: p.createdAt,
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
      .select([
        'p.id',
        'p.title',
        'p.shortDescription',
        'p.content',
        'p.blogId',
        'b.name',
        'p.createdAt',
      ])
      .where('p.id = :postId', { postId })
      .getOne();

    if (!findPost) return null;

    return {
      id: findPost.id,
      title: findPost.title,
      shortDescription: findPost.shortDescription,
      content: findPost.content,
      blogId: findPost.blogId,
      blogName: findPost.blog.name,
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
