import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@NgModule({
  declarations: [TasksComponent, TaskDialogComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
  ],
})
export class TasksModule {}
