import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { IQuestionRepository } from '../interface/question.repository.interface';
import { QuestionEntity } from '../../entities/question.entity';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(@InjectDataSource() private dataSource: DataSource,
              @InjectRepository(QuestionEntity) private questionRepository: Repository<QuestionEntity>) {}

  async save(question: QuestionEntity) {
    return this.questionRepository.save(question);
  }

  async getQuestion(questionId: string): Promise<QuestionEntity | null> {
    return this.dataSource.manager.findOneBy(QuestionEntity, {
      id: questionId,
    });
  }

  async delete(questionId: string): Promise<boolean> {
    const deleteResult = await this.dataSource.manager.delete(QuestionEntity, {
      id: questionId,
    });
    return deleteResult.affected === 1;
  }

  // async updateQuestion(updateDto: QuestionUpdateDto, questionId: string) {
  //   const updateResult = await this.dataSource
  //     .getRepository(QuestionEntity)
  //     .update(questionId, {
  //       body: updateDto.body,
  //       correctAnswers: updateDto.correctAnswers,
  //     });
  // }
}