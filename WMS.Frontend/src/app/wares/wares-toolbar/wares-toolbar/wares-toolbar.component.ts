import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { AuthenticationService, UserRole } from 'src/app/core/authentication';

import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { WaresEventBusService } from '../../services/wares-event-bus.service';
import { WaresService } from '../../services/wares.service';
import { WaresRoute } from '../../wares-routing.constants';

@Component({
  selector: 'app-wares-toolbar',
  templateUrl: './wares-toolbar.component.html',
  styleUrls: ['./wares-toolbar.component.scss']
})
export class WaresToolbarComponent implements OnInit, OnDestroy {

  @Input()
  public wareCount: number = 0;

  public selectedWareId?: number;

  public isCreating: boolean = false;

  public isLoading: boolean = false;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly waresService: WaresService,
    private readonly snackBar: MatSnackBar,
    private readonly waresEventBusService: WaresEventBusService,
    private readonly authenticationService: AuthenticationService,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.componentSubscriptions = [
      this.route.url
        .pipe(take(1))
        .subscribe((routes: UrlSegment[]) => {
          this.isCreating = routes[0]?.path === WaresRoute.Create;
        }),
      this.route.params.subscribe((params: Params) => {
        this.selectedWareId = params['id'];
      }),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public async onAddBtnClick(): Promise<void> {
    await this.router.navigate(
      [`${NavigationUrls.Wares}/${WaresRoute.Create}`],
      {relativeTo: this.route},
    );
  }

  public get areActionsVisible(): boolean {
    const currentUserRole = this.authenticationService.getUserClaims()?.Role;
    return currentUserRole === UserRole.Administrator;
  }

  public async onDeleteBtnClick(): Promise<void> {
    if (!this.selectedWareId) {
      return;
    }
    const id: number = this.selectedWareId;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20rem',
      data: {
        dialogName: 'Удаление товара',
        message: 'Вы действительно хотите удалить товар?',
      },
    });

    const isConfirmed: boolean = await firstValueFrom(dialogRef.afterClosed());
    if (!isConfirmed) {
      return;
    }

    this.isLoading = true;
    this.waresService.delete(id)
      .subscribe({
        next: async () => {
          this.isLoading = false;
          await this.router.navigate(
            [`${NavigationUrls.Wares}`],
            {relativeTo: this.route},
          );
          this.waresEventBusService.delete(id);
          this.snackBar.open('Товар удалён', 'Закрыть', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при удалении товара', 'Закрыть', {
            duration: 3000,
          });
        },
        complete: () => this.isLoading = false,
      });
  }
}
