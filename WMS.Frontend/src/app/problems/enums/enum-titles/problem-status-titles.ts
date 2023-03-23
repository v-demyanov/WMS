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

export const ProblemStatusColors: KeyValue<ProblemStatus, string>[] =
[
  {
    key: ProblemStatus.ToDo,
    value: 'red',
  },
  {
    key: ProblemStatus.InProgress,
    value: 'blue',
  },
  {
    key: ProblemStatus.AwaitingForApproval,
    value: 'orange',
  },
  {
    key: ProblemStatus.Done,
    value: 'green',
  },
];