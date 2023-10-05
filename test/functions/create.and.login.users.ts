import { SuperAgentTest } from "supertest";

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
      .expect(201);


    const response = await agent
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('User-agent', `Chrome${i*33}`)
      .expect(200);

    tokens.push(response.body.accessToken);
  }

  return tokens;
}