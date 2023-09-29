import { Column, Entity } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";

@Entity({name: 'question'})
export class QuestionEntity extends ParentEntity{
    @Column({type: 'varchar'})
    body: string

    @Column({type: 'jsonb', name: 'correct_answer'})
    correctAnswers

    @Column({type: 'timestamp with time zone', nullable: true, name: 'updated_at'})
    updatedAt: Date

    @Column({type: 'boolean', default: false})
    published: boolean
}
