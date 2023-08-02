import { CommentDocument, LikesInfo } from "../schema/comment.schema";
import { UserDocument } from "../../user/schema/user.schema";

export class CommentViewModel {
  id: string
  content: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  createdAt: string
  likesInfo: LikesInfo
  constructor(comment: CommentDocument, user: UserDocument, likesInfo: LikesInfo) {
    this.id = comment.id
    this.content = comment.content
    this.commentatorInfo.userId = user.id
    this.commentatorInfo.userLogin = user.accountData.login
    this.createdAt = comment.createdAt
    this.likesInfo.likesCount = likesInfo.likesCount
    this.likesInfo.dislikesCount = likesInfo.dislikesCount
    this.likesInfo.myStatus = likesInfo.myStatus
  }
}