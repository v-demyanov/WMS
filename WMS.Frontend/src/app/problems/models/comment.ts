import { IEmployee } from 'src/app/admin-panel/employees/models/employee';

export interface IComment {
  Id: number;
  Message: string;
  CreatedDate: Date;
  OwnerId: number;
  ProblemId: number;
  Owner?: IEmployee;
}