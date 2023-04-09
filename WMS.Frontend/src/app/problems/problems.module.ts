import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemsComponent } from './problems.component';
import { ProblemsRoutingModule } from './problems-routing.module';
import { ProblemDialogComponent } from './problem-dialog/problem-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { ProblemInfoComponent } from './problem-info/problem-info.component';
import { ProblemCardComponent } from './problem-card/problem-card.component';
import { ProblemCommentsComponent } from './problem-comments/problem-comments.component';
import { ProblemChildrenComponent } from './problem-children/problem-children.component';
import { ProblemAssignDialogComponent } from './problem-assign-dialog/problem-assign-dialog.component';

@NgModule({
  declarations: [
    ProblemsComponent,
    ProblemDialogComponent,
    ProblemInfoComponent,
    ProblemCardComponent,
    ProblemCommentsComponent,
    ProblemChildrenComponent,
    ProblemAssignDialogComponent,
  ],
  imports: [
    CommonModule,
    ProblemsRoutingModule,
    SharedModule,
  ],
})
export class ProblemsModule {}
