import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { Request } from "express";


@Injectable()
export class ObjectIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const id = request.params.id
    console.log(id);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException()
    }
    return true
  }
}