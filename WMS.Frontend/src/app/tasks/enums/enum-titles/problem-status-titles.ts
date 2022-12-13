import { KeyValue } from '@angular/common';
import { ProblemStatus } from '../problem-status.enum';

export const ProblemStatusTitles: KeyValue<ProblemStatus, string>[] =
[
  {
    key: ProblemStatus.ToDo,
    value: 'Выполнить',
  },
  {
    key: ProblemStatus.InProgress,
    value: 'В прогрессе',
  },
  {
    key: ProblemStatus.AwaitingForApproval,
    value: 'Ожидает подтверждения',
  },
  {
    key: ProblemStatus.Done,
    value: 'Готово',
  },
];