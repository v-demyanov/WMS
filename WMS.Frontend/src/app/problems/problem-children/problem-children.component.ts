import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProblem } from '../models/problem';
import { ProblemsService } from '../services/problems.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly problemsService: ProblemsService,
    private readonly snackBar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this.loadProblems();
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

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
