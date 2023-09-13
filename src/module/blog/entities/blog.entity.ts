import { Column, Entity, PrimaryColumn } from "typeorm";

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

  @Column({type: 'character varying', nullable: false, name: 'created_ad'})
  createdAt: string

  @Column({type: 'boolean', nullable: false, name: 'is_membership'})
  isMembership: boolean
}