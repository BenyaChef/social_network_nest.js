

export class PostViewModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: any
  constructor(postModel: any) {
    this.id = postModel.id;
    this.title = postModel.title;
    this.shortDescription = postModel.shortDescription;
    this.content = postModel.content;
    this.blogId = postModel.blogId;
    this.blogName = postModel.blogName;
    // this.createdAt = postModel.createdAt;
    this.extendedLikesInfo = {
      likesCount: postModel.extendedLikesInfo.likesCount,
      dislikesCount: postModel.extendedLikesInfo.dislikesCount,
      myStatus: postModel.extendedLikesInfo.myStatus,
      newestLikes: postModel.extendedLikesInfo.newestLikes
    }
  }
}
