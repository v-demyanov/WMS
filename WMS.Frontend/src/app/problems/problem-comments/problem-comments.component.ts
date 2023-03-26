import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IComment } from '../models/comment';
import { Subscription } from 'rxjs';
import { formatDate } from 'src/app/core/helpers/date.helper';
import * as commonConstants from 'src/app/core/constants/common.constants';
import { CommentsService } from '../services/comments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IComments } from '../models/comments';

@Component({
  selector: 'app-problem-comments',
  templateUrl: './problem-comments.component.html',
  styleUrls: ['./problem-comments.component.scss'],
})
export class ProblemCommentsComponent implements OnInit {

  @Input()
  public problemId?: number;

  @Output()
  public problemIdChange: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();

  @Input()
  public isCommentFormVisible: boolean = false;

  @Output()
  public isCommentFormVisibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public commonConstants = commonConstants;

  public isLoading: boolean = false;

  private componentSubscriptions: Subscription[] = [];

  public comments: IComment[] = [];

  public isLoadMoreBtnVisible = true;

  public constructor(
    private readonly commentsService: CommentsService,
    private readonly snackBar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this.loadComments(this.commonConstants.DEFAULT_PAGING_COUNT, 0);
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public formatDate = formatDate;

  public toggleCommentFormVisibility(): void {
    this.isCommentFormVisible = this.isCommentFormVisible ? false : true;
    this.isCommentFormVisibleChange.next(this.isCommentFormVisible);
  }

  public onLoadMoreBtnClick(): void {
    const top: number = this.comments.length + this.commonConstants.DEFAULT_PAGING_COUNT - 1;
    const skip: number = this.comments.length;

    this.loadComments(top, skip);
  }

  public loadComments(top: number, skip: number): void {
    if (!this.problemId) {
      return;
    }

    this.isLoading = true;

    const subscription: Subscription = this.commentsService
      .getByProblemId(this.problemId, top, skip)
      .subscribe({
        next: (comments: IComments) => {
          this.comments.push(...comments.Comments);
          this.isLoadMoreBtnVisible = comments.AllCount != this.comments.length;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке комментариев',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
