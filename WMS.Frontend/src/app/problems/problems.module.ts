import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemsComponent } from './problems.component';
import { ProblemsRoutingModule } from './problems-routing.module';
import { ProblemDialogComponent } from './problem-dialog/problem-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { ProblemDialogCommentsComponent } from './problem-dialog/problem-dialog-comments/problem-dialog-comments.component';
import { ProblemInfoComponent } from './problem-info/problem-info.component';
import { ProblemCardComponent } from './problem-card/problem-card.component';

@NgModule({
  declarations: [
    ProblemsComponent,
    ProblemDialogComponent,
    ProblemDialogCommentsComponent,
    ProblemInfoComponent,
    ProblemCardComponent,
  ],
  imports: [
    CommonModule,
    ProblemsRoutingModule,
    SharedModule,
  ],
})
export class ProblemsModule {}
