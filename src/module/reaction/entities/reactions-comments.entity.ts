import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { UserEntity } from "../../user/entities/user.entity";
import { CommentEntity } from "../../comment/entities/comment.entity";

@Entity({name: 'reactions_comment'})
export class ReactionsComments extends ParentEntity {
  @Column({name: 'user_id'})
  userId: string

  @Column({name: 'parent_id'})
  parentId: string

  @Column({name: 'reaction_status'})
  reactionStatus: ReactionStatusEnum

  @ManyToOne(() => UserEntity, (user) => user.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'user_id'})
  user: UserEntity

  @ManyToOne(() => CommentEntity, (comment) => comment.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'parent_id'})
  comment: CommentEntity
}