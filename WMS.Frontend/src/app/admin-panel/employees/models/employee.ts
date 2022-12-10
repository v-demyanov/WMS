import { UserRole } from 'src/app/core/authentication/enums/user-role.enum';

export interface IEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}