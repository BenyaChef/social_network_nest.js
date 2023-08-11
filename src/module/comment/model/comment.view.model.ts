import { CommentDocument, LikesInfo } from '../schema/comment.schema';

export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: LikesInfo;
  constructor(comment: CommentDocument, likesInfoCount: LikesInfo) {
    this.id = comment._id.toString();
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