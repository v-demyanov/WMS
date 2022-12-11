import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { WaresService } from '../../services/wares.service';
import { IWare } from '../../models/ware';
import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';

@Component({
  selector: 'app-wares-navigation',
  templateUrl: './wares-navigation.component.html',
  styleUrls: ['./wares-navigation.component.scss']
})
export class WaresNavigationComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;

  public wares: IWare[] = [];

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly waresService: WaresService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.componentSubscriptions = [
      this.loadWares(),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach(subscription => subscription.unsubscribe());

  public async onSelectWare(selectedWare: IWare): Promise<void> {
    await this.router.navigate(
      [`${NavigationUrls.Wares}${selectedWare.Id}`],
      {relativeTo: this.route},
    );
  }

  private loadWares(): Subscription {
    this.isLoading = true;
    return this.waresService.getAllForNavigation()
      .subscribe({
        next: (wares: IWare[]) => {
          this.wares = wares;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error.errorMessage,
            'Закрыть',
            { duration: 3000 },
          );
        },
        complete: () => this.isLoading = false,
      });
  }
}
