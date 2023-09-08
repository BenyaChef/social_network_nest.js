import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  email: string;

  @Column({nullable: false})
  login: string;

  @Column({ name: 'password_hash', nullable: false })
  passwordHash: string;

}