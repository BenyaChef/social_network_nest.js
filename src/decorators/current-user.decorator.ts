import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from "../module/user/schema/user.schema";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserDocument | null => {
    const request = context.switchToHttp().getRequest();
    return request.user.id
  },
);