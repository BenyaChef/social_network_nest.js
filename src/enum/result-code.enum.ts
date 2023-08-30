export enum ResultCode {
  Success,
  BadRequest,
  NotFound,
  Unauthorized,
  Forbidden,
}

export type ResultCodeType = {
  data: string | null
  code: ResultCode
}