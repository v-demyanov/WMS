import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IComment } from '../models/comment';
import { Subscription } from 'rxjs';
import { formatDate } from 'src/app/core/helpers/date.helper';
import * as commonConstants from 'src/app/core/constants/common.constants';
import { CommentsService } from '../services/comments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IComments } from '../models/comments';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/authentication';
import { IUserClaims } from 'src/app/core/authentication/models/user-claims';

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

  public commentForm: FormGroup = new FormGroup({});

  private userClaims?: IUserClaims | null;

  public constructor(
    private readonly commentsService: CommentsService,
    private readonly snackBar: MatSnackBar,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public ngOnInit(): void {
    this.commentForm = this.createCommentForm();
    this.userClaims = this.authenticationService.getUserClaims();

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

  public onSubmitComment() {
    if (this.commentForm.invalid || !this.problemId || !this.userClaims?.Id) {
      return;
    }

    this.isLoading = true;
    const comment: IComment = {
      Id: 0,
      Message: this.commentForm.value.Message,
      OwnerId: this.userClaims.Id,
      CreatedDate: new Date(),
      ProblemId: this.problemId,
    };
    
    const subscription: Subscription = this.commentsService
      .create(comment)
      .subscribe({
        next: (comment: IComment) => {
          this.comments.unshift(comment);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка добавлении комментария',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });

    this.componentSubscriptions.push(subscription);
  }

  private createCommentForm(): FormGroup {
    return new FormGroup({
      Message: new FormControl(undefined, Validators.required),
    });
  }
}
