// import { Post } from '../../post/schema/post.schema';
// import { Comment, LikesInfo } from "../schema/comment.schema";
// import { ReactionStatusEnum } from '../../../enum/reaction.status.enum';
// import { CommentEntity } from "../entities/comment.entity";
//
// export class CommentPostInfoViewModel {
//   id: string;
//   content: string;
//   commentatorInfo: {
//     userId: string;
//     userLogin: string;
//   };
//   createdAt: Date;
//   likesInfo: LikesInfo;
//   postInfo: {
//     id: string;
//     title: string;
//     blogId: string;
//     blogName: string;
//   };
//   constructor(comment: CommentEntity) {
//     this.id = comment.id;
//     this.content = comment.content;
//     this.createdAt = comment.createdAt;
//     this.commentatorInfo = {
//       userId: comment.userId,
//       userLogin: comment.userLogin,
//     };
//     this.likesInfo = {
//       likesCount: 0,
//       dislikesCount: 0,
//       myStatus: ReactionStatusEnum.None,
//     };
//     this.postInfo = {
//       id: comment.parentId,
//       title: comment.titlePost,
//       blogId: comment.blogId,
//       blogName: comment.blogName,
//     };
//   }
// }