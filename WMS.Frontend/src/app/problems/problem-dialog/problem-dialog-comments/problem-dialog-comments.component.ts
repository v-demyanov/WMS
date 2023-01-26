import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication';
import { IComment } from '../../models/comment';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-problem-dialog-comments',
  templateUrl: './problem-dialog-comments.component.html',
  styleUrls: ['./problem-dialog-comments.component.scss']
})
export class ProblemDialogCommentsComponent implements OnInit, OnDestroy {

  @Input('problemId')
  public problemId?: number;

  public comments: IComment[] = [];

  public isLoading: boolean = false;

  public messageForm: FormGroup = new FormGroup({});

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly commentsService: CommentsService,
    private readonly snackBar: MatSnackBar,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public ngOnInit(): void {
    this.messageForm = this.createMessageForm();
    this.loadComments();
  }

  public onSendBtnClick(): void {
    const currentUserId: number | undefined = this.authenticationService.getUserClaims()?.Id;

    const commentCreateData: IComment = {
      ...this.messageForm.value,
      CreatedDate: new Date(),
      ProblemId: this.problemId,
      OwnerId: currentUserId,
    }

    this.isLoading = true;
    const subscription: Subscription = this.commentsService.create(commentCreateData)
      .subscribe({
        next: (comment: IComment) => {
          this.comments.unshift(comment);
          this.snackBar.open(
            'Спасибо за ваш комментарий!',
            'Закрыть',
            { duration: 3000 },
          );
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при отправке комментария',
            'Закрыть',
            { duration: 3000 },
          );
        },
        complete: () => this.isLoading = false,
      });
    this.componentSubscriptions.push(subscription);
  }

  private loadComments(): void {
    if (!this.problemId) {
      return;
    }

    this.isLoading = true;
    const subscription: Subscription = this.commentsService.getAllByProblemId(this.problemId)
      .subscribe({
        next: (comments: IComment[]) => {
          this.comments = comments;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке комментариев',
            'Закрыть',
            { duration: 3000 },
          );
        },
        complete: () => this.isLoading = false,
      });
    this.componentSubscriptions.push(subscription);
  }

  private createMessageForm(): FormGroup {
    return new FormGroup({
      Message: new FormControl(undefined, [Validators.required]),
    });
  }
}
