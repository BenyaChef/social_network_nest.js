import {Post, PostDocument} from "../schema/post.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Query} from "mongoose";
import {Injectable} from "@nestjs/common";

@Injectable()
export class PostRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    }

    async getPostById(postId: string): Promise<PostDocument | null> {
        return this.postModel.findOne({id: postId})
    }

    async createPost(newPost: Post): Promise<string> {
        const result = await this.postModel.create(newPost)
        return result.id
    }

    async save(updatePost: PostDocument): Promise<string> {
        const result: PostDocument = await updatePost.save();
        return result.id;
    }

    async deletePost(postId: string): Promise<boolean> {
        const result: PostDocument | null = await this.postModel.findOneAndDelete({ id: postId})
        return result !== null
    }
}
