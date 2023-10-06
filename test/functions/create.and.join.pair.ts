import { SuperAgentTest } from "supertest";
import { HttpStatus } from "@nestjs/common";

export const createAndJoinPair = async (quantityConnect: number, agent: SuperAgentTest, tokens: string[]) => {
  for (let i = 1; i <= quantityConnect; i++) {
    await agent
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${tokens[i-1]}`)
      .expect(HttpStatus.CREATED);

  }
}