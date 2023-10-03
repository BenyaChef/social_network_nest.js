import { Injectable } from '@nestjs/common';
import { IQuizRepository } from '../interface/quiz.repository.interface';
import { GameEntity } from '../../entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerEntity } from "../../entities/answer.entity";
import { AnswerCommand } from "../../application/game.use-case/answer.use-case";

@Injectable()
export class QuizRepository implements IQuizRepository {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
    @InjectRepository(AnswerEntity)
    private answerRepository: Repository<AnswerEntity>
  ) {}

  save(newGame: GameEntity) {
    return this.gameRepository.save(newGame);
  }



  getPairByUserId(userId: string): Promise<GameEntity | null> {
    return this.gameRepository
      .createQueryBuilder()
      .where(
        'first_player_id = :userId or second_player_id = :userId and status = :active',
        { userId, active: 'Active' },
      ).getOne()
  }

 async saveAnswer(answer: AnswerEntity) {
    return this.answerRepository.save(answer)
  }
}