import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name: 'email_confirmation_info'})
export class EmailConfirmationInfo {

  @PrimaryColumn({name: 'user_id'})
  userId: string

  @Column({name: 'confirmation_code', type: 'uuid', nullable: true})
  confirmationCode: string | null

  @OneToOne(() => UserEntity, (user) => user.id, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: UserEntity;
}