import { IQuizQueryRepository } from '../interface/quiz.query-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from '../../entities/game.entity';
import { Repository } from 'typeorm';
import { GameStatus } from '../../../../enum/game-status.enum';

export class QuizQueryRepository implements IQuizQueryRepository {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
  ) {}

  getGameById(gameId: string) {
    return this.gameRepository.findOneBy({id: gameId})
  }

  async getPendingGame(): Promise<GameEntity | null> {
    return this.gameRepository.findOneBy({
      status: GameStatus.PendingSecondPlayer,
    });
  }

  async getGameByUserId(userId: string) {
    const gameStatus = [GameStatus.Active, GameStatus.PendingSecondPlayer];
    return this.gameRepository
      .createQueryBuilder()
      .select()
      .where(
        `first_player_id = :userId or second_player_id = :userId and status in (:...gameStatus)`,
        { userId, gameStatus },
      )
      .getOne();
  }
}
