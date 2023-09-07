import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: 'email_confirmation_info'})
export class EmailConfirmationInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({name: 'is_confirmed', type: 'boolean'})
  isConfirmed: boolean

  @Column({name: 'confirmation_code', type: 'uuid', nullable: true})
  confirmationCode: string | null

  @OneToOne(() => UserEntity, (user) => user.emailConfirmationInfo)
  @JoinColumn()
  user: UserEntity;
}