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

  @Column({name: 'user_id', unique: false})
  userId: string

  @Column({name: 'question_id', unique: false})
  questionId: string

  @Column({name: 'game_id', unique: false})
  gameId: string

  // @ManyToOne(() => QuestionEntity, (question) => question.id, {onDelete: "CASCADE", onUpdate: "CASCADE"})
  // @JoinColumn({name: 'question_id'})
  // question: QuestionEntity

  @ManyToOne(() => UserEntity, (user) => user.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'user_id'})
  player: UserEntity

  @ManyToOne(() => GameEntity, (game) => game.id, {onDelete: "CASCADE"})
  @JoinColumn({name: 'game_id'})
  game: GameEntity
}