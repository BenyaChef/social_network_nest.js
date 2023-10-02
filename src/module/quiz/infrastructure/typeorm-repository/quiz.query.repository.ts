import { IQuizQueryRepository } from '../interface/quiz.query-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from '../../entities/game.entity';
import { Repository } from 'typeorm';
import { GameStatus } from "../../../../enum/game-status.enum";

export class QuizQueryRepository implements IQuizQueryRepository {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
  ) {}

  getGameById(gameId: string) {}

  async getGameByUserId(userId: string): Promise<GameEntity | null> {
    return this.gameRepository.createQueryBuilder().where(`status = :status`, {status: GameStatus.PendingSecondPlayer}).getOne()
  }
}
