import { NestFactory } from "@nestjs/core";
import {AppModule} from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from "@nestjs/common";
import {  HttpExceptionFilter } from "./exception/exception.filter";
import { customExceptionFactory } from "./exception/exception.factory";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // const adapterHost = app.get(HttpAdapterHost);

    app.enableCors()
    app.use(cookieParser())
    app.useGlobalFilters()
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        stopAtFirstError: false,
        exceptionFactory: customExceptionFactory
    }))
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.listen(3003);
}
bootstrap();
