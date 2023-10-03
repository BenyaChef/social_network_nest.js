import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IQuizRepository } from '../../infrastructure/interface/quiz.repository.interface';
import { IQuizQueryRepository } from '../../infrastructure/interface/quiz.query-repository.interface';
import { GameEntity } from '../../entities/game.entity';
import { GameStatus } from '../../../../enum/game-status.enum';
import { IQuestionQueryRepository } from '../../infrastructure/interface/question.query-repository.interface';


export class CreatePairCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreatePairCommand)
export class CreatePairUseCase implements ICommandHandler<CreatePairCommand> {
  constructor(
    private quizRepository: IQuizRepository,
    private quizQueryRepository: IQuizQueryRepository,
    private questionsQueryRepository: IQuestionQueryRepository,
  ) {}

  async execute(command: CreatePairCommand): Promise<string | null> {

    const userInPair = await this.quizQueryRepository.getGameByUserId(command.userId)
    if (userInPair) return null

    const game: GameEntity | null = await this.quizQueryRepository.getPendingGame();
    if (!game) {
      const newGame = new GameEntity()
      newGame.firstPlayerId = command.userId;
      newGame.firstPlayerScore = 0;
      newGame.secondPlayerScore = 0;
      newGame.status = GameStatus.PendingSecondPlayer;
      newGame.secondPlayerId = null;
      newGame.answersFirstPlayer = [];
      newGame.answersSecondPlayer = [];
      newGame.finishGameDate = null;
      newGame.startGameDate = null;
      newGame.questions = null;

      await this.quizRepository.save(newGame);
      return newGame.id;
    }

    const questions = await this.questionsQueryRepository.getRandomFiveQuestions();
    game.secondPlayerId = command.userId;
    game.startGameDate = new Date();
    game.status = GameStatus.Active;
    game.questions = questions

    await this.quizRepository.save(game);
    return game.id;
  }
}
