import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';

import { ProblemStatusTitles } from '../enums/enum-titles/problem-status-titles';
import { ProblemStatus } from '../enums/problem-status.enum';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {

  public problemStatusTitles: KeyValue<ProblemStatus, string>[] = ProblemStatusTitles;
}
