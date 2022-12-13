import { ProblemStatus } from '../enums/problem-status.enum';

export interface IRawProblem {
  Id: number;
  Title: string;
  Description?: string;
  Status: keyof typeof ProblemStatus;
  CreatedDate: string;
  LastUpdateDate?: string | null;
  PerformerId?: number;
  ParentProblemId?: number;
  AuthorId: number;
  AuditorId?: number;
}