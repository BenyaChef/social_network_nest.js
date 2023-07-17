import { PostDocument } from '../schema/post.schema';

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: any
  constructor(postModel: PostDocument) {
    this.id = postModel._id.toString();
    this.title = postModel.title;
    this.shortDescription = postModel.shortDescription;
    this.content = postModel.content;
    this.blogId = postModel.blogId;
    this.blogName = postModel.blogName;
    this.createdAt = postModel.createdAt;
    this.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [{
        addedAt: 'string',
        userId: 'string',
        login: 'string'
      }]
    }
  }
}
