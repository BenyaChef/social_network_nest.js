import { TypeOrmModule } from "@nestjs/typeorm";
import { Test } from "@nestjs/testing";
import { AppModule, options } from "../../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import supertest, { SuperAgentTest } from "supertest";
import { useContainer } from "class-validator";
import cookieParser from "cookie-parser";
import { customExceptionFactory } from "../../src/exception/exception.factory";
import { HttpExceptionFilter } from "../../src/exception/exception.filter";

export const getAppAndClearDb = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  const agent: SuperAgentTest = supertest.agent(app.getHttpServer());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: customExceptionFactory,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();
  await agent.delete('/testing/all-data');

  return {
    app: app,
    agent: agent,
  };
};