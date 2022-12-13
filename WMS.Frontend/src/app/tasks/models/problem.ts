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
}