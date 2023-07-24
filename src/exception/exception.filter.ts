import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException, HttpStatus
} from "@nestjs/common";
import { Request, Response } from 'express';
import { ExceptionsResponseMessageType } from "./exception.type/error.message.type";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const errorResponse: ExceptionsResponseMessageType = {
        errorsMessages: []
      }
      const resBody: any = exception.getResponse()

      resBody.message.forEach((m) => errorResponse.errorsMessages.push(m))
      response.status(status).json(errorResponse)

    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
