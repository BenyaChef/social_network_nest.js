import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionUpdateDto } from '../../dto/questions-dto/question.update.dto';
import { IQuestionRepository } from '../../infrastructure/interface/question.repository.interface';

export class QuestionUpdateCommand {
  constructor(public questionId: string, public updateDto: QuestionUpdateDto) {}
}

@CommandHandler(QuestionUpdateCommand)
export class QuestionUpdateUseCase
  implements ICommandHandler<QuestionUpdateCommand>
{
  constructor(
    private quizRepository: IQuestionRepository,
  ) {}

  async execute(command: QuestionUpdateCommand): Promise<boolean | null> {
    const questions = await this.quizRepository.getQuestion(command.questionId)
    if(!questions) return null

    questions.body = command.updateDto.body
    questions.correctAnswers = command.updateDto.correctAnswers
    questions.updatedAt = new Date()

    return this.quizRepository.save(questions)

  }
}
