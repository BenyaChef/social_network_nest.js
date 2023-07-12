import { PostDocument } from '../schema/post.schema';

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  constructor(postModel: PostDocument) {
    this.id = postModel.id;
    this.title = postModel.title;
    this.shortDescription = postModel.shortDescription;
    this.content = postModel.content;
    this.blogId = postModel.blogId;
    this.blogName = postModel.blogName;
    this.createdAt = postModel.createdAt;
  }
}
