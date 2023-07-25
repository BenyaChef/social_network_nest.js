import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from 'rxjs';
import { Request } from "express";


@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const basic64 = Buffer.from('admin:qwerty').toString('base64')
    const loginData = `Basic ${basic64}`

    if (req.headers.authorization !== loginData) {
      throw new UnauthorizedException()
    } else
      return true
  }
}