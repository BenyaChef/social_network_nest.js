import { Injectable } from "@nestjs/common";
import { IQuizRepository } from "../interface/quiz.repository.interface";
import { GameEntity } from "../../entities/game.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class QuizRepository implements IQuizRepository {
  constructor(@InjectRepository(GameEntity) private gameRepository: Repository<GameEntity>) {
  }
  createPair(newGame: GameEntity) {
    return this.gameRepository.save(newGame)
  }

  joinPair(userId: string) {
  }
}