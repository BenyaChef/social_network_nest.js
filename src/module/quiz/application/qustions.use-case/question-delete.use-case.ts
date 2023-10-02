import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IQuestionRepository } from "../../infrastructure/interface/question.repository.interface";

export class QuestionDeleteCommand {
  constructor(public questionId: string) {
  }
}

@CommandHandler(QuestionDeleteCommand)
export class QuestionDeleteUseCase
  implements ICommandHandler<QuestionDeleteCommand>
{
  constructor(private quizRepository: IQuestionRepository) {}
  async execute(command: QuestionDeleteCommand): Promise<boolean> {
    return this.quizRepository.delete(command.questionId)
  }
}