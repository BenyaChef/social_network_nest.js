import {PostQueryPaginationDto} from '../dto/post.query.pagination.dto';
import {InjectModel} from '@nestjs/mongoose';
import {FilterQuery, Model, Query} from 'mongoose';
import {Post, PostDocument} from '../schema/post.schema';
import {PaginationViewModel} from '../../../helpers/pagination.view.mapper';
import {PostViewModel} from '../model/post.view.model';
import {Injectable} from "@nestjs/common";
import {Blog} from "../../blog/schema/blog.schema";

@Injectable()
export class PostQueryRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    }

    async getPostById(postId: string): Promise<PostViewModel | null> {
        const findPost: PostDocument | null = await this.postModel.findById(postId);
        if (!findPost) return null;
        return new PostViewModel(findPost);
    }

    async getAllPosts(query: PostQueryPaginationDto, blogId: string | null = null): Promise<PaginationViewModel<PostViewModel[]>> {
        const filter = blogId !== null ? {blogId: blogId} : {}


        return this.findPostsByFilterAndPagination(filter, query);
    }

    private async findPostsByFilterAndPagination(filter: FilterQuery<Post>, query: PostQueryPaginationDto): Promise<PaginationViewModel<PostViewModel[]>> {
        const posts: PostDocument[] = await this.postModel
            .find(filter)
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();
        const totalCount = await this.postModel.countDocuments(filter);
        return new PaginationViewModel<PostViewModel[]>(
            totalCount,
            query.pageNumber,
            query.pageSize,
            posts.map((post: PostDocument) => new PostViewModel(post))
        );
    }
}
