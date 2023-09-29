import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";
import { AnswerStatus } from "../../../enum/answer-status.enum";
import { UserEntity } from "../../user/entities/user.entity";
import { QuestionEntity } from "./question.entity";

@Entity({name: 'answer'})
export class AnswerEntity extends ParentEntity {

  @Column({name: 'answer_status', type: 'varchar'})
  answerStatus: AnswerStatus

  @ManyToOne(() => UserEntity, (player) => player.id)
  @JoinColumn({name: 'user_id'})
  player: UserEntity

  @Column({name: 'user_id'})
  userId: string

  @OneToOne(() => QuestionEntity, (question) => question.id)
  @JoinColumn({name: 'question_id'})
  question: QuestionEntity

  @Column({name: 'question_id'})
  questionId: string
}