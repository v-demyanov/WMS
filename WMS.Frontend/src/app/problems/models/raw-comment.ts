import { IEmployee } from 'src/app/admin-panel/employees/models/employee';

export interface IRawComment {
  Id: number;
  Message: string;
  CreatedDate: string;
  OwnerId: number;
  ProblemId: number;
  Owner?: IEmployee,
}