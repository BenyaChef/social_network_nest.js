import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { ParentEntity } from "../../auth/entities/parent.entity";
import { AnswerStatus } from "../../../enum/answer-status.enum";
import { UserEntity } from "../../user/entities/user.entity";
import { QuestionEntity } from "./question.entity";
import { GameEntity } from "./game.entity";

@Entity({name: 'answer'})
export class AnswerEntity extends ParentEntity {

  @Column({name: 'answer_status', type: 'varchar'})
  answerStatus: AnswerStatus

  @Column({name: 'user_id'})
  userId: string

  @Column({name: 'question_id'})
  questionId: string

  @Column({name: 'game_id'})
  gameId: string

  @OneToOne(() => QuestionEntity, (question) => question.id)
  @JoinColumn({name: 'question_id'})
  question: QuestionEntity

  @OneToOne(() => UserEntity, (player) => player.id)
  @JoinColumn({name: 'user_id'})
  player: UserEntity

  @ManyToOne(() => GameEntity, (game) => game.id)
  @JoinColumn({name: 'game_id'})
  game: GameEntity
}