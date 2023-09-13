import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EmailConfirmationInfo } from "./user.email-confirmation.entity";


@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  email: string;

  @Column({nullable: false})
  login: string;

  @Column({name: 'is_confirmed', type: 'boolean'})
  isConfirmed: boolean

  @Column({name: 'createdat', nullable: false})
  createdAt: string

  @Column({ name: 'password_hash', nullable: false })
  passwordHash: string;

  @OneToOne(() => EmailConfirmationInfo, (emailInfo) => emailInfo.user)
  @JoinColumn()
  emailInfo: EmailConfirmationInfo
}