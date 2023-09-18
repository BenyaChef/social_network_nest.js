import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class ParentEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}