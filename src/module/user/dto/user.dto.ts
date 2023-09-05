export class UserDto {
  id:string
  accountData: {
    email: string
    login: string
    createdAt: string
    passwordHash: string
  }
  emailInfo: {
    isConfirmed: boolean
    confirmationCode: null | string,
  }
  passwordRecoveryInfo: {
    recoveryCode: null | string,
    isConfirmed: boolean,
  }
}