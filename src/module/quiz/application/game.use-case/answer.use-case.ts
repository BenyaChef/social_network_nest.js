import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IQuizRepository } from '../../infrastructure/interface/quiz.repository.interface';
import { GameEntity } from '../../entities/game.entity';
import { AnswerEntity } from '../../entities/answer.entity';
import { AnswerStatus } from '../../../../enum/answer-status.enum';
import { IQuizQueryRepository } from '../../infrastructure/interface/quiz.query-repository.interface';
import { IQuestionQueryRepository } from '../../infrastructure/interface/question.query-repository.interface';

export class AnswerCommand {
  constructor(public answer: string, public userId: string) {}
}

@CommandHandler(AnswerCommand)
export class AnswerUseCase implements ICommandHandler<AnswerCommand> {
  constructor(private quizRepository: IQuizRepository,
              private quizQueryRepository: IQuizQueryRepository,
              private questionQueryRepository: IQuestionQueryRepository) {}

  async execute(command: AnswerCommand): Promise<string | null> {
    const game: GameEntity | null = await this.quizRepository.getPairByUserId(command.userId);

    if (!game) return null;
    if(!game.questions) return null

    const newAnswer = new AnswerEntity()
    newAnswer.gameId = game.id
    newAnswer.userId = command.userId
    
    
    const questions = await this.questionQueryRepository.getQuestionsForGame(game.questions)
    console.log(questions);
    if(game.firstPlayerId === command.userId) {
      newAnswer.questionId = questions[game.answers.length].id
      if(questions[game.answers.length].correctAnswers.includes(command.answer)) {
        newAnswer.answerStatus = AnswerStatus.Correct
        game.firstPlayerScore++
      } else {
        newAnswer.answerStatus = AnswerStatus.Incorrect
      }

    }

    if(game.secondPlayerId === command.userId) {

    }


    await this.quizRepository.save(game)
    await this.quizRepository.saveAnswer(newAnswer)


    

    const game1: GameEntity | null = await this.quizRepository.getPairByUserId(command.userId);
    console.log(game1);

    // if(game.firstPlayerId === command.userId) {
    //   game.answersFirstPlayer!.push(command.userId)
    //   await this.quizRepository.save(game)
    // }
    //
    // if(game.secondPlayerId === command.userId) {
    //   game.answersSecondPlayer!.push(command.userId)
    //   await this.quizRepository.save(game)
    // }

    return null
  }
}
