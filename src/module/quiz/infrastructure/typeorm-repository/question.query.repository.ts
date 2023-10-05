import { Injectable } from '@nestjs/common';
import { IQuestionQueryRepository } from '../interface/question.query-repository.interface';
import { QuestionViewDto } from '../../dto/questions-dto/question.view.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QuestionEntity } from '../../entities/question.entity';
import { QuestionQueryDto } from '../../dto/questions-dto/question.query.dto';
import { ColumnsAliases } from '../../../../enum/columns-alias.enum';
import { PaginationViewModel } from '../../../../helpers/pagination.view.mapper';
import { PublishedStatusEnum } from '../../../../enum/published-status.enum';

@Injectable()
export class QuestionQueryRepository implements IQuestionQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getQuestionById(questionId: string): Promise<QuestionViewDto | null> {
    const findQuestion = await this.dataSource.manager.findOneBy(
      QuestionEntity,
      { id: questionId },
    );
    if (!findQuestion) return null;
    return {
      id: findQuestion.id,
      body: findQuestion.body,
      correctAnswers: findQuestion.correctAnswers,
      published: findQuestion.published,
      createdAt: findQuestion.createdAt,
      updatedAt: findQuestion.updatedAt,
    };
  }

  async getAllQuestions(query: QuestionQueryDto) {
    const offset = (query.pageNumber - 1) * query.pageSize;
    const sortDirectionFilter = query.sortDirection === -1 ? 'DESC' : 'ASC';
    const bodyFilter =
      query.bodySearchTerm !== null ? `%${query.bodySearchTerm}%` : `%`;
    const publishedStatus = this.publishedStatusCheck(query.publishedStatus);

    const queryBuilder = await this.dataSource
      .createQueryBuilder(QuestionEntity, 'q')
      .where(
        `q.body ILIKE :bodyFilter and q.published IN (:...publishedStatus)`,
        { bodyFilter, publishedStatus },
      )
      .orderBy(`q.${ColumnsAliases[query.sortBy]}`, sortDirectionFilter);

    const [questions, totalCount] = await queryBuilder
      .offset(offset)
      .limit(query.pageSize)
      .getManyAndCount();

    return new PaginationViewModel<QuestionViewDto[]>(
      totalCount,
      query.pageNumber,
      query.pageSize,
      questions.map((q) => {
        return {
          id: q.id,
          body: q.body,
          correctAnswers: q.correctAnswers,
          published: q.published,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
        };
      }),
    );
  }

  async getRandomFiveQuestions() {
    const questions = await this.dataSource
      .createQueryBuilder(QuestionEntity, 'qa')
      .select('qa.id')
      .where('qa.published = true')
      .orderBy(`random()`)
      .limit(5)
      .getMany();
    return questions.map(o => o.id)
  }

 async getQuestionsForGame(questionsId: string[]): Promise<QuestionEntity[]> {
    return this.dataSource.createQueryBuilder(QuestionEntity, 'qe').select('qe.correctAnswers').where('id in (:...questionsId)', { questionsId }).getMany()
  }

  private publishedStatusCheck(value: PublishedStatusEnum) {
    switch (value) {
      case PublishedStatusEnum.all: {
        return [true, false];
      }
      case PublishedStatusEnum.published: {
        return [true];
      }
      case PublishedStatusEnum.notPublished: {
        return [false];
      }
      default: {
        return [true, false];
      }
    }
  }


}
