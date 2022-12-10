import { KeyValue } from '@angular/common';
import { UserRole } from '../user-role.enum';

export const UserRoleTitles: KeyValue<UserRole, string>[] =
[
  {
    key: UserRole.Administrator,
    value: 'Администратор',
  },
  {
    key: UserRole.Auditor,
    value: 'Аудитор',
  },
  {
    key: UserRole.Worker,
    value: 'Рабочий',
  },
]