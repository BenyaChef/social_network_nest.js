export enum ResultCode {
  Success,
  BadRequest,
  NotFound,
  Forbidden,
}

export type ResultCodeType = {
  data: string | null
  code: ResultCode
}