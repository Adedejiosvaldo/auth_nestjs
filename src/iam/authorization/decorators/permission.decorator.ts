import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../permission.type';

export const Permission_Key = 'permission';
export const Permission = (...permissions: PermissionType[]) => {
  SetMetadata(Permission_Key, permissions);
};
