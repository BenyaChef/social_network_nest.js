import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IQuestionRepository } from '../../infrastructure/interface/question.repository.interface';
import { PublishStatusUpdateDto } from '../../dto/questions-dto/question.publish-status.update.dto';

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
  constructor(private quizRepository: IQuestionRepository) {}

  async execute(
    command: QuestionUpdatePublishedStatusCommand,
  ): Promise<boolean | null> {
    const questions = await this.quizRepository.getQuestion(command.questionId);
    if (!questions) return null;

    questions.published = command.statusUpdateDto.published;
    questions.updatedAt = new Date()
    return this.quizRepository.save(questions);
  }
}
