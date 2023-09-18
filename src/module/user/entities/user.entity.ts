import { Column, Entity, OneToMany } from "typeorm";

import { ParentEntity } from "../../auth/entities/parent.entity";
import { CommentEntity } from "../../comment/entities/comment.entity";
import { ReactionsComments } from "../../reaction/entities/reactions-comments.entity";


@Entity({ name: 'users' })
export class UserEntity extends ParentEntity {

  @Column({nullable: false})
  email: string;

  @Column({nullable: false})
  login: string;

  @Column({name: 'is_confirmed', type: 'boolean'})
  isConfirmed: boolean

  @Column({ name: 'password_hash', nullable: false })
  passwordHash: string;

  @OneToMany(() => CommentEntity, (comments) => comments.user, {onDelete: "CASCADE"})
  comments: CommentEntity[]

  @OneToMany(() => ReactionsComments, (reactions) => reactions.user, {onDelete: "CASCADE"})
  reactions: ReactionsComments[]
}