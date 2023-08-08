import { CommentDocument, LikesInfo } from '../schema/comment.schema';
import { ReactionStatusEnum } from '../../../enum/reaction.status.enum';

export class CommentViewModel {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: LikesInfo;
  constructor(comment: CommentDocument) {
    this.id = comment.id;
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    this.createdAt = comment.createdAt;
    this.likesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: ReactionStatusEnum.None || comment.likesInfo.myStatus,
    };
  }
}