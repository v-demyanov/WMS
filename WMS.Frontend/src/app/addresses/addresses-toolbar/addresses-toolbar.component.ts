import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { ShelfsService } from '../services/shelfs.service';
import { PermissionsService } from 'src/app/core/authentication';

@Component({
  selector: 'app-addresses-toolbar',
  templateUrl: './addresses-toolbar.component.html',
  styleUrls: ['./addresses-toolbar.component.scss']
})
export class AddressesToolbarComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;

  public numberOfOccupiedShelves: number = 0;

  public numberOfFreeShelves: number = 0;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly shelfService: ShelfsService,
    private readonly snackBar: MatSnackBar,
    public readonly permissionsService: PermissionsService,
  ) {}

  public ngOnInit(): void {
    this.loadNumberOfOccupiedShelves();
    this.loadNumberOfFreeShelves();
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  private loadNumberOfOccupiedShelves(): void {
    this.isLoading = true;
    const subscription = this.shelfService.getNumberOfOccupiedShelves()
      .subscribe({
        next: (numberOfOccupiedShelves?: number) => {
          this.numberOfOccupiedShelves = numberOfOccupiedShelves ?? 0;
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Ошибка при загрузке статистики', 'Закрыть', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private loadNumberOfFreeShelves(): void {
    this.isLoading = true;
    const subscription = this.shelfService.getNumberOfFreeShelves()
      .subscribe({
        next: (numberOfFreeShelves?: number) => {
          this.numberOfFreeShelves = numberOfFreeShelves ?? 0;
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Ошибка при загрузке статистики', 'Закрыть', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
