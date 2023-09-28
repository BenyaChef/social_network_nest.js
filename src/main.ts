import { NestFactory } from "@nestjs/core";
import {AppModule} from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from "@nestjs/common";
import {  HttpExceptionFilter } from "./exception/exception.filter";
import { customExceptionFactory } from "./exception/exception.factory";
import { useContainer } from "class-validator";

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // const adapterHost = app.get(HttpAdapterHost);

    app.enableCors()
    app.use(cookieParser())
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
        exceptionFactory: customExceptionFactory,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter())
    useContainer(app.select(AppModule), {fallbackOnErrors: true})
    await app.listen(3003);
}
bootstrap();
