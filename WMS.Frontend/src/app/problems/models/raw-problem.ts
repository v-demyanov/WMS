import { IAddress } from 'src/app/dictionaries/addresses/models/address';
import { ProblemStatus } from '../enums/problem-status.enum';
import { IEmployee } from 'src/app/admin-panel/employees/models/employee';

export interface IRawProblem {
  Id: number;
  Title: string;
  Description?: string;
  Status: keyof typeof ProblemStatus;
  CreatedDate: string;
  LastUpdateDate?: string | null;
  DeadlineDate?: string | null;
  PerformerId?: number;
  ParentProblemId?: number;
  AuthorId: number;
  AuditorId?: number;
  TargetAddressId?: number;

  TargetAddress?: IAddress;
  Performer?: IEmployee;
  ChildrenProblems?: IRawProblem[];
}