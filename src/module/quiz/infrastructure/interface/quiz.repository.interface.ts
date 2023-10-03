import { GameEntity } from "../../entities/game.entity";
import { AnswerEntity } from "../../entities/answer.entity";

export abstract class IQuizRepository {
  abstract save(newGame: GameEntity)
  abstract getPairByUserId(userId: string)
  abstract saveAnswer(answer: AnswerEntity)
}