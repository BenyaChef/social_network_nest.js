import { PostQueryPaginationDto } from '../dto/post.query.pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { Post, PostDocument } from '../schema/post.schema';
import { PaginationViewModel } from '../../../helpers/pagination.view.mapper';
import { PostViewModel } from '../model/post.view.model';
import { Injectable } from '@nestjs/common';
import {
  Reaction,
  ReactionDocument,
} from '../../reaction/schema/reaction.schema';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
  ) {}

  async getPostById(
    postId: string,
    userId?: string,
  ): Promise<PostViewModel | null> {
    const findPost = await this.postModel.aggregate([
      { $match: { id: postId } },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Like',
                isUserBanned: false,
              },
            },
            { $count: 'count' },
          ],
          as: 'likesCount',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Dislike',
                isUserBanned: false,
              },
            },
            { $count: 'count' },
          ],
          as: 'dislikesCount',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: { userId: userId ?? '' },
            },
            {
              $project: { _id: 0, reactionStatus: 1 },
            },
          ],
          as: 'myStatus',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Like',
                isUserBanned: false,
              },
            },
            { $sort: { addedAt: -1 } },
            { $limit: 3 },
            {
              $project: { _id: 0, addedAt: 1, userId: 1, login: '$userLogin' },
            },
          ],
          as: 'newestLikes',
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          title: 1,
          shortDescription: 1,
          content: 1,
          blogId: 1,
          blogName: 1,
          createdAt: 1,
          'extendedLikesInfo.likesCount': {
            $cond: {
              if: { $eq: [{ $size: '$likesCount' }, 0] },
              then: 0,
              else: '$likesCount.count',
            },
          },
          'extendedLikesInfo.dislikesCount': {
            $cond: {
              if: { $eq: [{ $size: '$dislikesCount' }, 0] },
              then: 0,
              else: '$dislikesCount.count',
            },
          },
          'extendedLikesInfo.myStatus': {
            $cond: {
              if: { $eq: [{ $size: '$myStatus' }, 0] },
              then: 'None',
              else: '$myStatus.reactionStatus',
            },
          },
          'extendedLikesInfo.newestLikes': '$newestLikes',
        },
      },
      { $unwind: '$extendedLikesInfo.likesCount' },
      { $unwind: '$extendedLikesInfo.dislikesCount' },
      { $unwind: '$extendedLikesInfo.myStatus' },
    ]);
    return findPost[0];
  }

  async getAllPostsForBlogId(
    query: PostQueryPaginationDto,
    blogId: string,
    userId?: string,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    const posts = await this.postModel.aggregate([
      { $match: { blogId } },
      { $sort: { [query.sortBy]: query.sortDirection } },
      { $skip: (query.pageNumber - 1) * query.pageSize },
      { $limit: query.pageSize },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Like',
              },
            },
            { $count: 'count' },
          ],
          as: 'likesCount',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Dislike',
              },
            },
            { $count: 'count' },
          ],
          as: 'dislikesCount',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: { userId: userId ?? '' },
            },
            {
              $project: { _id: 0, reactionStatus: 1 },
            },
          ],
          as: 'myStatus',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Like',
              },
            },
            { $sort: { addedAt: -1 } },
            { $limit: 3 },
            {
              $project: { _id: 0, addedAt: 1, userId: 1, login: '$userLogin' },
            },
          ],
          as: 'newestLikes',
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          title: 1,
          shortDescription: 1,
          content: 1,
          blogId: 1,
          blogName: 1,
          createdAt: 1,
          'extendedLikesInfo.likesCount': {
            $cond: {
              if: { $eq: [{ $size: '$likesCount' }, 0] },
              then: 0,
              else: '$likesCount.count',
            },
          },
          'extendedLikesInfo.dislikesCount': {
            $cond: {
              if: { $eq: [{ $size: '$dislikesCount' }, 0] },
              then: 0,
              else: '$dislikesCount.count',
            },
          },
          'extendedLikesInfo.myStatus': {
            $cond: {
              if: { $eq: [{ $size: '$myStatus' }, 0] },
              then: 'None',
              else: '$myStatus.reactionStatus',
            },
          },
          'extendedLikesInfo.newestLikes': '$newestLikes',
        },
      },
      { $unwind: '$extendedLikesInfo.likesCount' },
      { $unwind: '$extendedLikesInfo.dislikesCount' },
      { $unwind: '$extendedLikesInfo.myStatus' },
    ]);

    const totalCount = await this.postModel.countDocuments({ blogId: blogId });
    return new PaginationViewModel<PostViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      posts.map((post: PostDocument) => new PostViewModel(post)),
    );
  }

  async getAllPosts(
    query: PostQueryPaginationDto,
    userId: string | null = null,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    const posts = await this.postModel.aggregate([
      {
        $sort: {
          [query.sortBy]: query.sortDirection,
        },
      },
      {
        $skip: (query.pageNumber - 1) * query.pageSize,
      },
      { $limit: query.pageSize },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Like',
              },
            },
            { $count: 'count' },
          ],
          as: 'likesCount',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Dislike',
              },
            },
            { $count: 'count' },
          ],
          as: 'dislikesCount',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: { userId: userId ?? '' },
            },
            {
              $project: { _id: 0, reactionStatus: 1 },
            },
          ],
          as: 'myStatus',
        },
      },
      {
        $lookup: {
          from: 'reactions',
          localField: 'id',
          foreignField: 'parentId',
          pipeline: [
            {
              $match: {
                reactionStatus: 'Like',
              },
            },
            { $sort: { addedAt: -1 } },
            { $limit: 3 },
            {
              $project: { _id: 0, addedAt: 1, userId: 1, login: '$userLogin' },
            },
          ],
          as: 'newestLikes',
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          title: 1,
          shortDescription: 1,
          content: 1,
          blogId: 1,
          blogName: 1,
          createdAt: 1,
          'extendedLikesInfo.likesCount': {
            $cond: {
              if: { $eq: [{ $size: '$likesCount' }, 0] },
              then: 0,
              else: '$likesCount.count',
            },
          },
          'extendedLikesInfo.dislikesCount': {
            $cond: {
              if: { $eq: [{ $size: '$dislikesCount' }, 0] },
              then: 0,
              else: '$dislikesCount.count',
            },
          },
          'extendedLikesInfo.myStatus': {
            $cond: {
              if: { $eq: [{ $size: '$myStatus' }, 0] },
              then: 'None',
              else: '$myStatus.reactionStatus',
            },
          },
          'extendedLikesInfo.newestLikes': '$newestLikes',
        },
      },
      { $unwind: '$extendedLikesInfo.likesCount' },
      { $unwind: '$extendedLikesInfo.dislikesCount' },
      { $unwind: '$extendedLikesInfo.myStatus' },
    ]);
    const totalCount = await this.postModel.countDocuments({});
    return new PaginationViewModel<PostViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      posts.map((post: PostDocument) => new PostViewModel(post)),
    );
  }

  private async findPostsByFilterAndPagination(
    filter: FilterQuery<Post>,
    query: PostQueryPaginationDto,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    const posts: PostDocument[] = await this.postModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean();
    const totalCount = await this.postModel.countDocuments(filter);
    return new PaginationViewModel<PostViewModel[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      posts.map((post: PostDocument) => new PostViewModel(post)),
    );
  }
}
