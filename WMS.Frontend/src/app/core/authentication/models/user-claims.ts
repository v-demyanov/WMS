import { UserRole } from '../enums/user-role.enum';

export interface IUserClaims {
  Id: number;
  FirstName: string;
  LastName: string;
  Role: UserRole;
  Email: string;
  Exp: number;
  AvatarUrl?: string;
}
