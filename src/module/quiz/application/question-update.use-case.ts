import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionUpdateDto } from '../dto/question.update.dto';
import { IQuizRepository } from '../infrastructure/interface/quiz.repository.interface';

export class QuestionUpdateCommand {
  constructor(public questionId: string, public updateDto: QuestionUpdateDto) {}
}

@CommandHandler(QuestionUpdateCommand)
export class QuestionUpdateUseCase
  implements ICommandHandler<QuestionUpdateCommand>
{
  constructor(
    private quizRepository: IQuizRepository,
  ) {}

  async execute(command: QuestionUpdateCommand): Promise<boolean | null> {
    const questions = await this.quizRepository.getQuestion(command.questionId)
    if(!questions) return null

    questions.body = command.updateDto.body
    questions.correctAnswers = command.updateDto.correctAnswers
    questions.updatedAt = new Date().toISOString()

    return this.quizRepository.save(questions)

  }
}
