import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSelectionList } from '@angular/material/list';

import { WaresService } from '../../services/wares.service';
import { IWare } from '../../models/ware';
import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { WaresEventBusService } from '../../services/wares-event-bus.service';
import { IWareNavItem } from '../../models/ware-nav-item';
import { WareStatus } from '../../enums/ware-status.enum';
import { WareFilterDescriptor } from '../../models/ware-filter-descriptor';

@Component({
  selector: 'app-wares-navigation',
  templateUrl: './wares-navigation.component.html',
  styleUrls: ['./wares-navigation.component.scss']
})
export class WaresNavigationComponent implements OnInit, OnDestroy {

  @ViewChild('waresSelectionsList')
  waresSelectionsList?: MatSelectionList;

  public isLoading: boolean = true;

  public wares: IWareNavItem[] = [];

  public WareStatus = WareStatus;

  public selectedWare?: IWareNavItem;

  private selectedWareId?: number;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly waresService: WaresService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly waresEventBusService: WaresEventBusService,
    private readonly elementRef: ElementRef,
  ) {}

  public ngOnInit(): void {
    this.loadWares();
    this.componentSubscriptions = [
      this.waresEventBusService.itemWasCreated$
        .subscribe(async (ware: IWare) => {
          this.wares.unshift(ware);
          await this.router.navigate(
            [`${NavigationUrls.Wares}/${ware.Id}`],
            {relativeTo: this.route},
          );
        }),
      this.waresEventBusService.itemWasSoftDeleted$
        .subscribe((wareId: number) => {
          this.setWareStatus(wareId, WareStatus.ToBeDeleted);
        }),
      this.waresEventBusService.itemWasRestored$
        .subscribe((wareId: number) => {
          this.setWareStatus(wareId, WareStatus.Active);
        }),
      this.waresEventBusService.itemWasUpdated$
        .subscribe((ware: IWare) => {
          const wareIndex: number = this.wares.findIndex(x => x.Id === ware.Id);
          this.wares.splice(wareIndex, 1, ware);
          this.setSelectedWare();
        }),
      this.waresEventBusService.filterDescriptorWasChanged$
        .subscribe((filterDescriptor?: WareFilterDescriptor) => {
          this.loadWares(filterDescriptor);
        }),
      this.subscribeOnRouteParamsChanges(),
    ];
  }

  public ngOnDestroy(): void {
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.elementRef.nativeElement.remove();
  }

  public async onSelectWare(selectedWare: IWareNavItem): Promise<void> {
    this.selectedWare = selectedWare;
    await this.router.navigate(
      [`${NavigationUrls.Wares}/${selectedWare.Id}`],
      {relativeTo: this.route},
    );
  }

  private subscribeOnRouteParamsChanges(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      this.selectedWareId = Number(params['id']);
    })
  }

  private loadWares(filterDescriptor?: WareFilterDescriptor): void {
    this.isLoading = true;
    const subscription = this.waresService.getAllForNavigation(filterDescriptor)
      .subscribe({
        next: (wares: IWareNavItem[]) => {
          this.wares = wares;
          this.isLoading = false;
          
          this.setSelectedWare();
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Ошибка при загрузке товаров',
            'Закрыть',
            { duration: 3000 },
          );
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private setSelectedWare(): void {
    if (this.selectedWareId) {
      const selectedWareIndex = this.wares.findIndex(x => x?.Id === this.selectedWareId);
      this.selectedWare = this.wares[selectedWareIndex];
      const selectedItem: any = [this.selectedWare];
      this.waresSelectionsList?.writeValue(selectedItem);
    }
  }

  private setWareStatus(wareId: number, wareStatus: WareStatus): void {
    const wareIndex: number = this.wares.findIndex(x => x.Id === wareId);
    const wareNavItem: IWareNavItem = this.wares[wareIndex];
    wareNavItem.Status = wareStatus;

    this.wares.splice(wareIndex, 1, wareNavItem);
    this.setSelectedWare();
  }
}
