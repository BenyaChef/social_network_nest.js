import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { PostEntity } from "../../post/entities/post.entity";

@Entity({name: 'blogs'})
export class BlogEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column({type: 'character varying', nullable: false})
  name: string

  @Column({type: 'character varying'})
  description: string

  @Column({type: 'character varying', name: 'website_url'})
  websiteUrl: string

  @Column({type: 'character varying', nullable: false, name: 'createdat'})
  createdAt: string

  @Column({type: 'boolean', nullable: false, name: 'is_membership'})
  isMembership: boolean

  @OneToMany(()=> PostEntity, (posts) => posts.blog, {onDelete: "CASCADE"})
  @JoinColumn()
  posts: PostEntity[]
}