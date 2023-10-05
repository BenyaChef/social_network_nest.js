import { INestApplication } from "@nestjs/common";
import { getAppAndClearDb } from "./options/app.test";
import { SuperAgentTest } from "supertest";
import { createAndLoginUsers } from "./functions/create.and.login.users";

describe('User (e2e_test)', () => {
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
    it('should create five questions', async () => {

    })
  })

  afterAll(async () => {
    await app.close();
  });
});
