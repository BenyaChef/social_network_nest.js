import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException, HttpStatus
} from "@nestjs/common";
import { Request, Response } from 'express';
import { ExceptionsResponseMessageType } from "./exception.type/error.message.type";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    //
    // if(status === 500) {
    //   return  response.status(400).json('Something went wrong')
    // }

    if (status === HttpStatus.BAD_REQUEST) {
      const errorResponse: ExceptionsResponseMessageType = {
        errorsMessages: [],
      };
      const resBody: any = exception.getResponse();
     try {
       resBody.message.forEach((m) => errorResponse.errorsMessages.push(m));

       return response.status(status).json(errorResponse);
      } catch (e) {
       switch (resBody.message) {
         case 'codeIsNotExists':
           return response.status(400).send({
             errorsMessages: [{ message: 'invalid code', field: 'code' }],
           });
         case 'codeAlreadyIsConfirm':
           return response.status(400).send({
             errorsMessages: [{ message: 'code is confirm', field: 'code' }],
           });
         case 'emailIsNotExists':
           return response.status(400).send({
             errorsMessages: [{ message: 'user is not exists', field: 'email' }],
           });
         case 'emailAlreadyIsConfirm':
           return response.status(400).send({
             errorsMessages: [{ message: 'email is confirm', field: 'email' }],
           });
       }
     }

    } else {
      response.sendStatus(status)
    }
  }
}

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
//
//   catch(exception: unknown, host: ArgumentsHost): void {
//     const { httpAdapter } = this.httpAdapterHost;
//
//     const ctx = host.switchToHttp();
//
//     const httpStatus =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//
//     const responseBody = {
//       statusCode: httpStatus,
//       timestamp: new Date().toISOString(),
//       path: httpAdapter.getRequestUrl(ctx.getRequest()),
//     };
//
//     httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
//   }
// }
