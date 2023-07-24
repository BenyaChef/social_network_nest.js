export type ErrorMessageType = {
  message: string;
  field: string;
}

export type ExceptionsResponseMessageType = {
  errorsMessages: ErrorMessageType[]
}