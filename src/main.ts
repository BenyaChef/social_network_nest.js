import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import cookieParser from 'cookie-parser';
import {ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./ exception-filter/exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors()
    app.use(cookieParser())
    app.useGlobalFilters()
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
    }))
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.listen(3003);
}
bootstrap();
