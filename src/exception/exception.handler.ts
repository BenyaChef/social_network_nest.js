import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { ResultCode } from "../enum/result-code.enum";


// export type ResponseResult<T> = {
//   data: T
//   code: ResultCode
// }
//
// export const createResponse = <T>(code: ResultCode, data: T): ResponseResult<T> => {
//   return {
//     data: data,
//     code: code
//   }
// }

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