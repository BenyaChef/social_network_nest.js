

export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: any;
  constructor(comment: any, likesInfoCount: any) {
    this.id = comment.id;
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    this.createdAt = comment.createdAt;
    this.likesInfo = {
      likesCount: likesInfoCount.likesCount,
      dislikesCount: likesInfoCount.dislikesCount,
      myStatus: likesInfoCount.myStatus
    };
  }
}