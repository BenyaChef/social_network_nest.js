import { Column, Entity } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";

@Entity({name: 'question'})
export class QuestionEntity extends ParentEntity{
    @Column({type: 'varchar'})
    body: string

    @Column({type: 'jsonb', name: 'correct_answer'})
    correctAnswers

    @Column({type: 'varchar', nullable: true, name: 'updated_at'})
    updatedAt: string

    @Column({type: 'boolean', default: false})
    published: boolean
}
