import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/iam/constants';
import { ActiveUserData } from 'src/iam/interfaces/jwt.dto';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData = request[REQUEST_USER_KEY];
    // If we have something to retturn eg user.id , return id if not return everything else
    return field ? user?.[field] : user;
  },
);
