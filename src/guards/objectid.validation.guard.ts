import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";


@Injectable()
export class ObjectIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const id  = request.params.id;

    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException()
    }
    return true
  }
}