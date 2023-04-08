import { IProblem } from './problem';

export interface ProblemDialogData {
  isCreating: boolean;
  isEditing: boolean;
  problem?: IProblem,
  initialProblemId?: number;
  parentProblemId?: number;
}