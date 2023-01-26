import { KeyValue } from '@angular/common';
import { ProblemStatus } from '../problem-status.enum';

export const ProblemStatusTitles: KeyValue<ProblemStatus, string>[] =
[
  {
    key: ProblemStatus.ToDo,
    value: 'TO DO',
  },
  {
    key: ProblemStatus.InProgress,
    value: 'IN PROGRESS',
  },
  {
    key: ProblemStatus.AwaitingForApproval,
    value: 'AWAITING FOR APPROVAL',
  },
  {
    key: ProblemStatus.Done,
    value: 'DONE',
  },
];