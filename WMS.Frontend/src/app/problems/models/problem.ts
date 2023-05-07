import { ProblemStatus } from '../enums/problem-status.enum';
import { IEmployee } from 'src/app/admin-panel/employees/models/employee';
import { IShelf } from 'src/app/dictionaries/addresses/models/shelf';
import { IWare } from 'src/app/wares/models/ware';

export interface IProblem {
  Id: number;
  Title: string;
  Description?: string;
  Status: ProblemStatus;
  CreatedDate: Date;
  LastUpdateDate?: Date | null;
  DeadlineDate?: Date | null;
  PerformerId?: number | null;
  ParentProblemId?: number;
  AuthorId: number;
  AuditorId?: number;
  WareId?: number;
  TargetShelfId?: number;

  TargetShelf?: IShelf;
  Performer?: IEmployee;
  Author?: IEmployee;
  Auditor?: IEmployee;
  Ware?: IWare;
  ChildrenProblems?: IProblem[];
}