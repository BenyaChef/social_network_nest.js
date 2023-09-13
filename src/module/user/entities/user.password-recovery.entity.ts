import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: 'password_recovery_info'})
export class PasswordRecoveryInfo {
  @PrimaryColumn('uuid')
  userId: string

  @Column({name: 'recovery_code', type: 'character varying', nullable: true})
  recoveryCode: string | null

  @Column({name: 'is_confirmed'})
  isConfirmed: boolean

  @OneToOne(() => UserEntity, (user) => user.id, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: UserEntity;
}