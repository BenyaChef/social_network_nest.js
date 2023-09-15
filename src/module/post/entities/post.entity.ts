import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BlogEntity } from "../../blog/entities/blog.entity";
import { ParentEntity } from "../../auth/entities/parent.entity";
import { CommentEntity } from "../../comment/entities/comment.entity";

@Entity({name: 'posts'})
export class PostEntity extends ParentEntity {

  @Column({nullable: false})
  title: string;

  @Column({name: 'short_description'})
  shortDescription: string;

  @Column()
  content: string;

  @ManyToOne(()=> BlogEntity, (blog) => blog.id, {onDelete: "CASCADE", nullable: false})
  @JoinColumn({name: 'blog_id'})
  blog: BlogEntity;

  @Column({name: 'blog_id'})
  blogId: string

  @OneToMany(() => CommentEntity, (comments) => comments.id, {onDelete: "CASCADE"})
  @JoinColumn()
  comments: CommentEntity[]
}

