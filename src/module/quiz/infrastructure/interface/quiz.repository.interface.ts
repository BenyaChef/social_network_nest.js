import { QuestionEntity } from "../../entities/question.entity";

export abstract class IQuizRepository {
  abstract save(question: QuestionEntity)
  abstract getQuestion(questionId: string): Promise<QuestionEntity | null>
  abstract delete(questionId: string): Promise<boolean>
  // abstract updateQuestion(updateDto: QuestionUpdateDto, questionId: string)
}