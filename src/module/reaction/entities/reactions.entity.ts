import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { UserEntity } from "../../user/entities/user.entity";
import { CommentEntity } from "../../comment/entities/comment.entity";

@Entity({name: 'reactions_comment'})
export class ReactionsComments extends ParentEntity {
  @Column({name: 'user_id', unique: true})
  userId: string

  @Column({name: 'comment_id', unique: true})
  commentId: string

  @Column({name: 'reaction_status'})
  reactionStatus: ReactionStatusEnum

  @ManyToOne(() => UserEntity, (user) => user.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'user_id'})
  user: UserEntity

  @ManyToOne(() => CommentEntity, (comment) => comment.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'comment_id'})
  comment: CommentEntity
}