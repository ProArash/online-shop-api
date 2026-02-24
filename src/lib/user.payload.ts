import { UserRole } from '@/lib/user.role';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: UserPayload;
}

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (data) {
      return user[data];
    }

    return user;
  },
);
export interface UserPayload {
  sub: number;
  mobile: string;
  name: string;
  role: UserRole;
}
