import { SuperAgentTest } from "supertest";
import { HttpStatus } from "@nestjs/common";

export const createAndLoginUsers = async (quantityUsers: number, agent: SuperAgentTest) => {
  const tokens: any = [];

  for (let i = 1; i <= quantityUsers; i++) {
    const user = {
      login: `user${i}`,
      password: `password${i}`,
      email: `user${i}@example.com`,
    };


    await agent
      .post('/sa/users')
      .auth('admin', 'qwerty')
      .send(user)
      .expect(HttpStatus.CREATED);


    const response = await agent
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('User-agent', `Chrome${i*33}`)
      .expect(HttpStatus.OK);

    tokens.push(response.body.accessToken);
  }

  return tokens;
}