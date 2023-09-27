import { QuestionViewDto } from "../../dto/question.view.dto";
import { QuestionQueryDto } from "../../dto/question.query.dto";

export abstract class IQuizQueryRepository {
  abstract getQuestionById(questionId: string): Promise<QuestionViewDto | null>
  abstract getAllQuestions(query: QuestionQueryDto)
}