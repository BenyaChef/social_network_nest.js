import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IQuizRepository } from "../infrastructure/interface/quiz.repository.interface";

export class QuestionDeleteCommand {
  constructor(public questionId: string) {
  }
}

@CommandHandler(QuestionDeleteCommand)
export class QuestionDeleteUseCase
  implements ICommandHandler<QuestionDeleteCommand>
{
  constructor(private quizRepository: IQuizRepository) {}
  async execute(command: QuestionDeleteCommand): Promise<boolean> {
    return this.quizRepository.delete(command.questionId)
  }
}