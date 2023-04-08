import { IAddress } from 'src/app/dictionaries/addresses/models/address';
import { ProblemStatus } from '../enums/problem-status.enum';
import { IEmployee } from 'src/app/admin-panel/employees/models/employee';

export interface IProblem {
  Id: number;
  Title: string;
  Description?: string;
  Status: ProblemStatus;
  CreatedDate: Date;
  LastUpdateDate?: Date | null;
  PerformerId?: number;
  ParentProblemId?: number;
  AuthorId: number;
  AuditorId?: number;
  WareId?: number;
  TargetAddressId?: number;

  TargetAddress?: IAddress;
  Performer?: IEmployee;
  ChildrenProblems?: IProblem[];
}