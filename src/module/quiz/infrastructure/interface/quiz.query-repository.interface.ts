import { GameEntity } from "../../entities/game.entity";

export abstract class IQuizQueryRepository {
  abstract getGameById(gameId: string)
  abstract getGameByUserId(userId: string)
  abstract getPendingGame(): Promise<GameEntity | null>
}