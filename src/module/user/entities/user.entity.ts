import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PasswordRecoveryInfo } from "./user.password-recovery.entity";
import { EmailConfirmationInfo } from "./user.email-confirmation.entity";

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

  @OneToOne(() => PasswordRecoveryInfo, (passwordRecoveryInfo) => passwordRecoveryInfo.user)
  @JoinColumn()
  passwordRecoveryInfo: PasswordRecoveryInfo;

  @OneToOne(() => EmailConfirmationInfo, (emailConfirmationInfo) => emailConfirmationInfo.user, {eager: true})
  @JoinColumn()
  emailConfirmationInfo: EmailConfirmationInfo;

}