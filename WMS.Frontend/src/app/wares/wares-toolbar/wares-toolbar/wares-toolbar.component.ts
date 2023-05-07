import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { firstValueFrom, Subscription, take } from 'rxjs';

import { AuthenticationService, UserRole } from 'src/app/core/authentication';
import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { WaresService } from '../../services/wares.service';
import { WaresRoute } from '../../wares-routing.constants';
import { IWareNavItem } from '../../models/ware-nav-item';
import { WareStatus } from '../../enums/ware-status.enum';
import { WaresEventBusService } from '../../services/wares-event-bus.service';
import { WareRestoreDialogComponent } from '../../ware-restore-dialog/ware-restore-dialog.component';
import { WareFilterDescriptor } from '../../models/ware-filter-descriptor';
import { WaresFilterDialogComponent } from '../../wares-filter-dialog/wares-filter-dialog.component';
import { WareAdvancedFilterDescriptor } from '../../models/ware-advanced-filter-descriptor';

@Component({
  selector: 'app-wares-toolbar',
  templateUrl: './wares-toolbar.component.html',
  styleUrls: ['./wares-toolbar.component.scss']
})
export class WaresToolbarComponent implements OnInit, OnDestroy {

  @Input()
  public wareCount: number = 0;

  @Input()
  public selectedWare?: IWareNavItem;

  public selectedWareId?: number;

  public isCreating: boolean = false;

  public isLoading: boolean = false;

  public WareStatus = WareStatus;

  public wareFilterDescriptor?: WareFilterDescriptor;

  private componentSubscriptions: Subscription[] = [];

  @ViewChild('searchInput')
  private searchInput?: ElementRef;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly waresService: WaresService,
    private readonly snackBar: MatSnackBar,
    private readonly authenticationService: AuthenticationService,
    private readonly dialog: MatDialog,
    private readonly waresEventBusService: WaresEventBusService,
  ) {}

  public ngOnInit(): void {
    this.componentSubscriptions = [
      this.route.url
        .pipe(take(1))
        .subscribe((routes: UrlSegment[]) => {
          this.isCreating = routes[0]?.path === WaresRoute.Create;
        }),
      this.route.params.subscribe((params: Params) => {
        this.selectedWareId = Number(params['id']);
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
    if (!this.selectedWareId || !this.selectedWare) {
      return;
    }

    if (this.selectedWare.Status === WareStatus.ToBeDeleted) {
      await this.restore(this.selectedWareId);
    } else {
      await this.softDelete(this.selectedWareId);
    }
  }

  public onSearch(searchValue: string): void {
    if (!this.wareFilterDescriptor) {
      this.wareFilterDescriptor = <WareFilterDescriptor>{};
    }
    this.wareFilterDescriptor.SearchValue = searchValue;

    this.waresEventBusService.updateFilterDescriptor(this.wareFilterDescriptor);
  }

  public async openFilterDialog(): Promise<void> {
    const dialogRef = this.dialog.open(WaresFilterDialogComponent, {
      width: '33.5rem',
      ariaModal: true,
      disableClose: true,
      data: this.wareFilterDescriptor?.AdvancedFilterDescriptor,
    });
    const advancedFilterDescriptor: WareAdvancedFilterDescriptor | undefined = await firstValueFrom(dialogRef.afterClosed());

    if (!advancedFilterDescriptor) {
      return;
    }

    if (!this.wareFilterDescriptor) {
      this.wareFilterDescriptor = <WareFilterDescriptor>{};
    }
    this.wareFilterDescriptor.AdvancedFilterDescriptor = advancedFilterDescriptor;

    this.waresEventBusService.updateFilterDescriptor(this.wareFilterDescriptor);
  }

  public resetFilters(): void {
    this.wareFilterDescriptor = undefined;
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    
    this.waresEventBusService.updateFilterDescriptor(undefined);
  }

  private async softDelete(id: number): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20rem',
      ariaModal: true,
      disableClose: true,
      data: {
        dialogName: 'Отгрузка товара',
        message: 'Вы действительно хотите отгрузить товар?',
      },
    });

    const isConfirmed: boolean = await firstValueFrom(dialogRef.afterClosed());
    if (!isConfirmed) {
      return;
    }

    this.isLoading = true;
    const subscription = this.waresService.softDelete(id)
      .subscribe({
        next: async () => {
          this.isLoading = false;
          this.waresEventBusService.softDelete(id);
          this.snackBar.open('Товар отгружен', 'Закрыть', {
            duration: 3000,
          });
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при отгрузке товара', 'Закрыть', {
            duration: 3000,
          });
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private async restore(id: number): Promise<void> {
    const dialogRef = this.dialog.open(WareRestoreDialogComponent, {
      width: '40rem',
      ariaModal: true,
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (!result) {
      return;
    }

    this.isLoading = true;
    const subscription = this.waresService.restore(id, result)
      .subscribe({
        next: async () => {
          this.isLoading = false;
          this.waresEventBusService.restore(id);
          this.snackBar.open('Товар восстановлен', 'Закрыть', {
            duration: 3000,
          });
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка восстановлении товара', 'Закрыть', {
            duration: 3000,
          });
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
