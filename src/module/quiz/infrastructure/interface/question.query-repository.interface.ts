import { QuestionViewDto } from "../../dto/questions-dto/question.view.dto";
import { QuestionQueryDto } from "../../dto/questions-dto/question.query.dto";
import { PublishedStatusEnum } from "../../../../enum/published-status.enum";

export abstract class IQuestionQueryRepository {
  abstract getQuestionById(questionId: string): Promise<QuestionViewDto | null>
  abstract getAllQuestions(query: QuestionQueryDto)
  abstract getQuestionsForGame(questions: string[])
  abstract getRandomFiveQuestions()

}