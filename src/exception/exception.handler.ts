import { ErrorMessageType } from "./exception.type/error.message.type";

export const exceptionHandler = (message: string, field: string) => {
    return {
      errorsMessages: [{
        message: message,
        field: field
      }]
    }
}