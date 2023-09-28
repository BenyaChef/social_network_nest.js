import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IQuizRepository } from '../infrastructure/interface/quiz.repository.interface';
import { PublishStatusUpdateDto } from '../dto/question.publish-status.update.dto';

export class QuestionUpdatePublishedStatusCommand {
  constructor(
    public questionId: string,
    public statusUpdateDto: PublishStatusUpdateDto,
  ) {}
}

@CommandHandler(QuestionUpdatePublishedStatusCommand)
export class QuestionUpdatePublishedStatusUseCase
  implements ICommandHandler<QuestionUpdatePublishedStatusCommand>
{
  constructor(private quizRepository: IQuizRepository) {}

  async execute(
    command: QuestionUpdatePublishedStatusCommand,
  ): Promise<boolean | null> {
    const questions = await this.quizRepository.getQuestion(command.questionId);
    if (!questions) return null;
    if(questions.correctAnswers.length === 0) return null

    questions.published = command.statusUpdateDto.published;

    return this.quizRepository.save(questions);
  }
}
