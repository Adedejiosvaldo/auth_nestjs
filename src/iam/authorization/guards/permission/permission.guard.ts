import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionType } from '../../permission.type';
import { Permission_Key } from '../../decorators/permission.decorator';
import { ActiveUserData } from 'src/iam/interfaces/jwt.dto';

@Injectable()
export class PermsissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermission = this.reflector.getAllAndOverride<
      PermissionType[]
    >(Permission_Key, [context.getClass(), context.getHandler()]);

    if (!contextPermission) {
      return true;
    }

    const user: ActiveUserData = context.switchToHttp().getRequest();

    return contextPermission.every((permission) =>
      user.permission?.includes(permission),
    );
    return true;
  }
}
