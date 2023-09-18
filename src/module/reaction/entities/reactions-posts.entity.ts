import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";
import { ReactionStatusEnum } from "../../../enum/reaction.status.enum";
import { UserEntity } from "../../user/entities/user.entity";
import { PostEntity } from "../../post/entities/post.entity";

@Entity({name: 'reactions_posts'})
export class ReactionsPosts extends ParentEntity {
  @Column({name: 'user_id', unique: true})
  userId: string

  @Column({name: 'parent_id', unique: true})
  parentId: string

  @Column({name: 'reaction_status'})
  reactionStatus: ReactionStatusEnum

  @ManyToOne(() => UserEntity, (user) => user.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'user_id'})
  user: UserEntity

  @ManyToOne(() => PostEntity, (post) => post.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'parent_id'})
  post: PostEntity
}
