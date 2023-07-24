import { BadRequestException } from "@nestjs/common";
import { ErrorMessageType } from "./exception.type/error.message.type";

export const customExceptionFactory = (errors) => {
  const errorsForResponse: ErrorMessageType[] = [];

  errors.forEach((e) => {
    const constraintKeys = Object.keys(e.constraints);

    constraintKeys.forEach((ckey) => {
      errorsForResponse.push({
        message: e.constraints[ckey],
        field: e.property,
      });
    });
  });

  throw new BadRequestException(errorsForResponse);
};