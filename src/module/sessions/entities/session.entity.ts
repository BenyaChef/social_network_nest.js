
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name:'sessions'})
export class SessionUser {

  @PrimaryColumn('uuid')
  id: string

  @Column({nullable: false})
  ip: string;

  @Column({ name: 'user_id', nullable: false})
  userId: string;

  @Column({ name: 'device_id', nullable: false })
  deviceId: string;

  @Column({ name: 'last_active_date', nullable: false})
  lastActiveDate: string;

  @Column({ nullable: false })
  title: string;
}