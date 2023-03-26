import { UserRole } from 'src/app/core/authentication/enums/user-role.enum';

export interface IEmployee {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: UserRole;
  AvatarUrl?: string;
}