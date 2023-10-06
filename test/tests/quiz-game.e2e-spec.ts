import { HttpStatus, INestApplication } from "@nestjs/common";
import { getAppAndClearDb } from "../options/app.test";
import { SuperAgentTest } from "supertest";
import { createAndLoginUsers } from "../functions/create.and.login.users";
import { createAndActiveQuestions } from "../functions/create.and.active.questions";
import { createAndJoinPair } from "../functions/create.and.join.pair";

describe('Test quiz game (e2e_test)', () => {
  let app: INestApplication;
  let agent: SuperAgentTest
  let tokens: string[]

  beforeAll(async () => {
    const data = await getAppAndClearDb()
    app = data.app
    agent = data.agent
  });

  describe('Create users and questions', () => {

    it('should created and login user', async () => {
      tokens = await createAndLoginUsers(3, agent)
    });
    it('should created and active questions', async () => {
      await createAndActiveQuestions(5, agent)
    })
    it('create and connect pair', async () => {
      await createAndJoinPair(3, agent, tokens)
    })
    it('should send correct answer', async () => {
      await agent
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${tokens[0]}`)
        .send({answer: 'correct answer'})
        .expect(HttpStatus.CREATED)
    });
  })

  afterAll(async () => {
    await app.close();
  });
});
