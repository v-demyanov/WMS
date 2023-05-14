import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';

import { ShelfsService } from '../services/shelfs.service';
import { IShelf } from '../models/shelf';
import { HomeRoute } from 'src/app/home/home-routing.constants';

@Component({
  selector: 'app-address-form-shelf',
  templateUrl: './address-form-shelf.component.html',
  styleUrls: ['./address-form-shelf.component.scss']
})
export class AddressFormShelfComponent implements OnInit, OnDestroy {

  public sheldId?: number;

  public shelf?: IShelf;

  public isLoading: boolean = false;

  public shelfForm: FormGroup = new FormGroup({});

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly shelfService: ShelfsService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.shelfForm = this.createShelfForm();
    this.subscribeOnRouteParamsChanges();
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public async navigateToProblem(): Promise<void> {
    await this.router.navigate(
      [`${HomeRoute.Home}/${HomeRoute.Tasks}/${this.shelf?.Problem?.Id}`],
    );
  }

  public async navigateToWare(): Promise<void> {
    await this.router.navigate(
      [`${HomeRoute.Home}/${HomeRoute.Wares}/${this.shelf?.Ware?.Id}`],
    );
  }

  private subscribeOnRouteParamsChanges(): void {
    const subscription = this.route.params.subscribe((params: Params) => {
      this.sheldId = Number(params['shelfId']);
      this.loadShelf();
    });
    this.componentSubscriptions.push(subscription);
  }

  private loadShelf(): void {
    if (!this.sheldId) {
      return;
    }

    this.isLoading = true;
    const subscription = this.shelfService
      .getById(this.sheldId)
      .subscribe({
        next: (shelf: IShelf) => {
          this.shelf = shelf;
          this.initializeShelfForm();
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Ошибка при загрузке полки', 'Закрыть', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private createShelfForm(): FormGroup {
    return new FormGroup({
      Id: new FormControl(undefined),
      Index: new FormControl(undefined),
      Status: new FormControl(undefined),
      Problem: new FormControl(undefined),
      Ware: new FormControl(undefined),
    });
  }

  private initializeShelfForm(): void {
    this.shelfForm.setValue({
      Id: this.shelf?.Id ?? null,
      Index: this.shelf?.Index ?? null,
      Status: this.shelf ? this.getShelfStatus() : null,
      Problem: `${this.shelf?.Problem?.Title}` ?? null,
      Ware: `${this.shelf?.Ware?.Name} (${this.shelf?.Ware?.Id})` ?? null,
    });
  }

  private getShelfStatus(): string {
    if (this.shelf?.Problem) {
      return 'Полка зарезервирована';
    } else if (this.shelf?.Ware) {
      return 'Полка занята';
    }

    return 'Полка свободна';
  }
}
