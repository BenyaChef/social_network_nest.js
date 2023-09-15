import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { PostEntity } from "../../post/entities/post.entity";
import { ParentEntity } from "../../auth/entities/parent.entity";

@Entity({name: 'blogs'})
export class BlogEntity extends ParentEntity {

  @Column({type: 'character varying', nullable: false})
  name: string

  @Column({type: 'character varying'})
  description: string

  @Column({type: 'character varying', name: 'website_url'})
  websiteUrl: string

  @Column({type: 'boolean', nullable: false, name: 'is_membership'})
  isMembership: boolean

  @OneToMany(()=> PostEntity, (posts) => posts.blog, {onDelete: "CASCADE"})
  @JoinColumn()
  posts: PostEntity[]
}