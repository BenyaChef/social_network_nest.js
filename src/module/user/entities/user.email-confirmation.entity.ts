import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: 'email_confirmation_info'})
export class EmailConfirmationInfo {

  @PrimaryColumn({name: 'user_id', type: 'uuid'})
  userId: string

  @Column({name: 'is_confirmed', type: 'boolean'})
  isConfirmed: boolean

  @Column({name: 'confirmation_code', type: 'uuid', nullable: true})
  confirmationCode: string | null


  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({name: 'user_id'})
  user: UserEntity;
}