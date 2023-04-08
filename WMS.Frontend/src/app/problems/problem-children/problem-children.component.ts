import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeyValue } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { ActivatedRoute, Router } from '@angular/router';

import { IProblem } from '../models/problem';
import { ProblemsService } from '../services/problems.service';
import { ProblemStatusColors, ProblemStatusTitles } from '../enums/enum-titles/problem-status-titles';
import { ProblemStatus } from '../enums/problem-status.enum';
import * as commonConstants from 'src/app/core/constants/common.constants';
import { ProblemDialogComponent } from '../problem-dialog/problem-dialog.component';
import { ProblemDialogData } from '../models/problem-dialog-data';

@Component({
  selector: 'app-problem-children',
  templateUrl: './problem-children.component.html',
  styleUrls: ['./problem-children.component.scss']
})
export class ProblemChildrenComponent implements OnInit {

  @Input()
  public problemId?: number;

  @Output()
  public problemIdChange: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();

  public problems: IProblem[] = [];

  public isLoading: boolean = false;

  public problemStatusTitles: KeyValue<ProblemStatus, string>[] = ProblemStatusTitles;

  public problemStatusColors: KeyValue<ProblemStatus, string>[] = ProblemStatusColors;

  public commonConstants = commonConstants;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly problemsService: ProblemsService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['problemId']) {
      this.loadProblems();
    }
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public getProblemStatusColor(problemStatus: ProblemStatus): string {
    return this.problemStatusColors[problemStatus].value;
  }

  public getProblemStatusTitle(problemStatus: ProblemStatus): string {
    return this.problemStatusTitles[problemStatus].value;
  }

  public openProblemDialog(): void {
    this.dialog.open(ProblemDialogComponent, <MatDialogConfig> {
      ariaModal: true,
      disableClose: true,
      width: 'auto',
      data: <ProblemDialogData>{
        isCreating: true,
        parentProblemId: this.problemId,
      },
    });
  }

  public async openSubProblem(subProblemId: number): Promise<void> {
    await this.router.navigate(
      [`${NavigationUrls.Tasks}/${subProblemId}`],
      {relativeTo: this.route},
    );
  }

  private loadProblems(): void {
    if (!this.problemId) {
      return;
    }

    this.isLoading = true;
    const subscription: Subscription = this.problemsService.getChildren(this.problemId)
      .subscribe({
        next: (problems: IProblem[]) => {
          this.problems = problems;
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Ошибка при загрузке дочерних задач', 'Закрыть', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
