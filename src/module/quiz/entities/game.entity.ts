import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { ParentEntity } from '../../auth/entities/parent.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { AnswerEntity } from "./answer.entity";
import { GameStatus } from "../../../enum/game-status.enum";

@Entity({ name: 'games' })
export class GameEntity extends ParentEntity {

  @Column({ name: 'first_player_id', type: 'uuid', nullable: false })
  firstPlayerId: string;

  @Column({ name: 'second_player_id', type: 'uuid', nullable: true })
  secondPlayerId: string | null;

  @Column({name: 'first_player_score', type: "int", default: 0})
  firstPlayerScore: number

  @Column({name: 'second_player_score', type: "int", default: 0})
  secondPlayerScore: number

  @Column({type: 'jsonb', nullable: true})
  questions: string[] | null

  @Column({type: 'enum', enum: GameStatus ,default: GameStatus.PendingSecondPlayer})
  status: GameStatus

  @Column({name: 'start_game_date', type: 'timestamp with time zone', nullable: true})
  startGameDate: Date | null

  @Column({name: 'finish_game_date', type: 'timestamp with time zone', nullable: true})
  finishGameDate: Date | null

  @OneToMany(() => AnswerEntity, (answer) => answer.game, {cascade: true})
  @JoinColumn({referencedColumnName: 'userId'})
  answers: AnswerEntity[]

  @OneToOne(() => UserEntity, (user) => user.id, {onDelete: "CASCADE"})
  @JoinColumn({ name: 'first_player_id' })
  player: UserEntity;
}