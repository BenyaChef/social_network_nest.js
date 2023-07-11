import { PostDocument } from "../schema/post.schema";

export class PostRepository {
  constructor() {
  }

  async save(newPost: PostDocument) {
    const result = await newPost.save()
    return result.id
  }
}