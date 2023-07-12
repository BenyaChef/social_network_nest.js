import { Post, PostDocument } from "../schema/post.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getPostById(postId: string): Promise<PostDocument | null> {
    return this.postModel.findById(postId)
  }

  async save(newPost: PostDocument) {
    const result = await newPost.save();
    return result.id;
  }
}
