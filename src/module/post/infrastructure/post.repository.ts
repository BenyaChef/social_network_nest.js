import {Post, PostDocument} from "../schema/post.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Query} from "mongoose";
import {Injectable} from "@nestjs/common";

@Injectable()
export class PostRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    }

    async getPostById(postId: string): Promise<PostDocument | null> {
        return this.postModel.findById(postId)
    }

    async save(newPost: PostDocument): Promise<string> {
        const result: PostDocument = await newPost.save();
        return result.id;
    }

    async deletePost(postId: string): Promise<boolean> {
        const result: PostDocument | null = await this.postModel.findOneAndDelete({_id: postId})
        return result !== null
    }
}
