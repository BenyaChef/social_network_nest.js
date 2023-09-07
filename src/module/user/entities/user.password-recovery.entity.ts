import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: 'password_recovery_info'})
export class PasswordRecoveryInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Column({name: 'recovery_code'})
  recoveryCode: string
  @Column({name: 'is_confirmed'})
  isConfirmed: boolean
  @OneToOne(() => UserEntity, (user) => user.passwordRecoveryInfo)
  @JoinColumn()
  user: UserEntity;
}