import { GameEntity } from "../../entities/game.entity";

export abstract class IQuizRepository {
  abstract createPair(newGame: GameEntity)
  abstract joinPair(userId: string)
}