import { KeyValue, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { UI_ERROR_LABEL } from 'src/app/core/constants/common.constants';
import { formatDate } from 'src/app/core/helpers/date.helper';
import { ProblemStatusColors, ProblemStatusTitles } from '../enums/enum-titles/problem-status-titles';
import { ProblemStatus } from '../enums/problem-status.enum';
import { IProblem } from '../models/problem';
import { ProblemsService } from '../services/problems.service';

@Component({
  selector: 'app-problem-info',
  templateUrl: './problem-info.component.html',
  styleUrls: ['./problem-info.component.scss']
})
export class ProblemInfoComponent implements OnInit, OnDestroy {

  private componentSubscriptions: Subscription[] = [];

  public problem?: IProblem;

  public problemId?: number;

  public isLoading: boolean = false;

  public problemStatusTitles: KeyValue<ProblemStatus, string>[] = ProblemStatusTitles;

  public problemStatusColors: KeyValue<ProblemStatus, string>[] = ProblemStatusColors;

  public isCommentFormVisible: boolean = false;

  public isActivitiesPanelExpanded: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly problemsService: ProblemsService,
    private readonly snackBar: MatSnackBar,
    private readonly scroller: ViewportScroller,
  ) {}

  public ngOnInit(): void {
    this.componentSubscriptions = [
      this.subscribeOnRouteParamsChanges(),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public getProblemStatusTitle(): string {
    if (this.problem?.Status === undefined) {
      return UI_ERROR_LABEL;
    }
    
    return this.problemStatusTitles[this.problem.Status].value;
  }

  public getProblemStatusColor(): string {
    if (this.problem?.Status === undefined) {
      return UI_ERROR_LABEL;
    }
    
    return this.problemStatusColors[this.problem.Status].value;
  }

  public scrollToCommentForm(): void {
    this.isActivitiesPanelExpanded = true;
    this.isCommentFormVisible = true;
    setTimeout(() => this.scroller.scrollToAnchor('commentForm'), 100);
  }

  public formatDate(undefinedLabel: string, date?: Date | null): string {
    if (date) {
      return formatDate(date);
    }
    return undefinedLabel;
  }

  private subscribeOnRouteParamsChanges(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      this.problemId = params['id'];
      if (this.problemId) {
        this.loadProblem(this.problemId);
      }
    });
  }

  private loadProblem(problemId: number): void {
    this.isLoading = true;
    const subscription: Subscription = this.problemsService.get(problemId)
      .subscribe({
        next: (problem: IProblem) => {
          this.problem = problem;
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Ошибка при загрузке задачи', 'Закрыть', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
