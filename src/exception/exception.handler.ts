import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { ResultCode } from "../enum/result-code.enum";

export const exceptionHandler = (code: ResultCode) => {

  switch (code) {
    case ResultCode.BadRequest: {
      throw new BadRequestException();
    }
    case ResultCode.NotFound: {
      throw new NotFoundException();
    }
    case ResultCode.Forbidden: {
      throw new ForbiddenException();
    }
    case ResultCode.Success: {
      return true
    }
  }
};