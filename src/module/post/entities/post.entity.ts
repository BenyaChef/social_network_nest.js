import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BlogEntity } from "../../blog/entities/blog.entity";

@Entity({name: 'posts'})
export class PostEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column({nullable: false})
  title: string;

  @Column({name: 'shortdescription'})
  shortDescription: string;

  @Column()
  content: string;

  @Column({name: 'blogname'})
  blogName: string

  @ManyToOne(()=> BlogEntity, (blog) => blog.id, {onDelete: "CASCADE", nullable: false})
  @JoinColumn()
  blog: BlogEntity;
  // @Column()
  // blog_id: string

  @Column({name: 'created_at'})
  createdAt: string;
}

export enum PostColumnsAliases {
  CreatedAt = 'created_at',
  blogName = 'blog_name'
}