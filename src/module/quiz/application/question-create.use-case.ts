import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionCreateDto } from "../dto/question.create.dto";
import { IQuizRepository } from "../infrastructure/interface/quiz.repository.interface";
import { QuestionEntity } from "../entities/question.entity";

export class QuestionCreateCommand {
  constructor(public createDto: QuestionCreateDto) {
  }
}

@CommandHandler(QuestionCreateCommand)
export class QuestionCreateUseCase
  implements ICommandHandler<QuestionCreateCommand>
{
  constructor(private quizRepository: IQuizRepository) {}
  async execute(command: QuestionCreateCommand): Promise<string> {

    const newQuestion = new QuestionEntity()
    newQuestion.body = command.createDto.body
    newQuestion.correctAnswers = command.createDto.correctAnswers

    await this.quizRepository.save(newQuestion)
    return newQuestion.id
  }
}