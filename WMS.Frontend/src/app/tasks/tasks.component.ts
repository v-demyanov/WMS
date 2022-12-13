import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ProblemStatusTitles } from './enums/enum-titles/problem-status-titles';
import { ProblemStatus } from './enums/problem-status.enum';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  public toDo: { val: string }[] = [{ val: 'f' }, { val: 'b' }, { val: 'v' }];

  public inProgress: { val: string }[] = [
    { val: 'dfg' },
    { val: 's' },
    { val: 'sdf' },
    { val: 'vcb' },
  ];

  public awaitingForApproval: { val: string }[] = [
    { val: '1' },
    { val: '2' },
    { val: '3' },
    { val: '4' },
    { val: '5' },
  ];

  public done: { val: string }[] = [{ val: 'a' }];

  public problemStatus: typeof ProblemStatus = ProblemStatus;

  constructor(private readonly dialog: MatDialog) {}

  public drop(event: CdkDragDrop<{ val: string }[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  public getColumnTitle = (problemStatus: ProblemStatus): string =>
    ProblemStatusTitles[problemStatus].value;

  public openTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: 'auto',
    });
  }
}
