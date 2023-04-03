import { IAddress } from 'src/app/dictionaries/addresses/models/address';
import { ProblemStatus } from '../enums/problem-status.enum';

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
  ChildrenProblems?: IProblem[];
}