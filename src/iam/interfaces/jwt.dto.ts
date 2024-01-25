import { Role } from 'src/users/enums/role.enum';

export interface ActiveUserData {
  // sub -> user id
  sub: string;
  email: string;
  refreshUserID?: string;
  role: Role;
  permission: string;
}
