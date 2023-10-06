import { SuperAgentTest } from 'supertest';
import { HttpStatus } from "@nestjs/common";

export const createAndActiveQuestions = async (
  quantityQuestions: number,
  agent: SuperAgentTest,
) => {
  for (let i = 1; i <= quantityQuestions; i++) {

    const questions = {
      body: `questions 0${i} new`,
      correctAnswers: ['correct answer'],
    };


    const response = await agent
      .post('/sa/quiz/questions')
      .auth('admin', 'qwerty')
      .send(questions)
      .expect(HttpStatus.CREATED);

    await agent
      .put(`/sa/quiz/questions/${response.body.id}/publish`)
      .auth('admin', 'qwerty')
      .send({
        published: true,
      })
      .expect(HttpStatus.NO_CONTENT);
  }
};