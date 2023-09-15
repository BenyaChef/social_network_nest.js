import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";
import { PostEntity } from "../../post/entities/post.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { ReactionsComments } from "../../reaction/entities/reactions.entity";


@Entity({ name: 'comments' })
export class CommentEntity extends ParentEntity {
  @Column()
  content: string

  @Column({name: 'user_id'})
  userId: string;

  @Column({name: 'post_id'})
  postId: string

  @ManyToOne(() => PostEntity, (post) => post.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'post_id'})
  post: PostEntity

  @ManyToOne(() => UserEntity, (user) => user.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'user_id'})
  user: UserEntity

  // @OneToMany(() => ReactionsComments, (reactions) => reactions.comment, {onDelete: "CASCADE"})
  // @JoinColumn({name: 'id'})
  // reactions: ReactionsComments[]
}