import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSelectionList } from '@angular/material/list';

import { WaresService } from '../../services/wares.service';
import { IWare } from '../../models/ware';
import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { WaresEventBusService } from '../../services/wares-event-bus.service';

@Component({
  selector: 'app-wares-navigation',
  templateUrl: './wares-navigation.component.html',
  styleUrls: ['./wares-navigation.component.scss']
})
export class WaresNavigationComponent implements OnInit, OnDestroy {

  @ViewChild('waresSelectionsList')
  waresSelectionsList?: MatSelectionList;

  public isLoading: boolean = false;

  public wares: IWare[] = [];

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
    this.componentSubscriptions = [
      this.loadWares(),
      this.waresEventBusService.itemWasCreated$
        .subscribe(async (ware: IWare) => {
          this.wares.push(ware);
          await this.router.navigate(
            [`${NavigationUrls.Wares}/${ware.Id}`],
            {relativeTo: this.route},
          );
        }),
      this.waresEventBusService.itemWasDeleted$
        .subscribe((wareId: number) => {
          const wareIndex: number = this.wares.findIndex(x => x.Id === wareId);
          this.wares.splice(wareIndex, 1);
        }),
      this.waresEventBusService.itemWasUpdated$
        .subscribe((ware: IWare) => {
          const wareIndex: number = this.wares.findIndex(x => x.Id === ware.Id);
          this.wares.splice(wareIndex, 1, ware);
          this.setSelectedWare();
        }),
      this.subscribeOnRouteParamsChanges(),
    ];
  }

  public ngOnDestroy(): void {
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.elementRef.nativeElement.remove();
  }

  public async onSelectWare(selectedWare: IWare): Promise<void> {
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

  private loadWares(): Subscription {
    this.isLoading = true;
    return this.waresService.getAllForNavigation()
      .subscribe({
        next: (wares: IWare[]) => {
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
  }

  private setSelectedWare(): void {
    if (this.selectedWareId) {
      const selectedWareIndex = this.wares.findIndex(x => x?.Id === this.selectedWareId)
      const selectedItem: any = [this.wares[selectedWareIndex]];
      this.waresSelectionsList?.writeValue(selectedItem);
    }
  }
}
