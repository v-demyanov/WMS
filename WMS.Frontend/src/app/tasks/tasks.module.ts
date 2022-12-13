import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TasksComponent, TaskDialogComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule,
  ],
})
export class TasksModule {}
