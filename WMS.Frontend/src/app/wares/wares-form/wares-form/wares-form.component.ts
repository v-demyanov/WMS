import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { Subscription, take } from 'rxjs';

import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { IWare } from '../../models/ware';
import { WaresService } from '../../services/wares.service';
import { WaresRoute } from '../../wares-routing.constants';
import { LegalEntitiesService } from 'src/app/admin-panel/tenants/legal-entities/services/legal-entities.service';
import { ILegalEntity } from 'src/app/admin-panel/tenants/legal-entities/models/legal-entity';
import { WaresEventBusService } from '../../services/wares-event-bus.service';
import { AuthenticationService, UserRole } from 'src/app/core/authentication';
import { DictionariesService } from 'src/app/dictionaries/services/dictionaries.service';
import { DictinaryItem } from 'src/app/dictionaries/models/dictionary-item';
import { unitOfMeasurements } from 'src/app/dictionaries/constants/dictionaries.constants';
import { WareStatus } from '../../enums/ware-status.enum';

@Component({
  selector: 'app-wares-form',
  templateUrl: './wares-form.component.html',
  styleUrls: ['./wares-form.component.scss'],
})
export class WaresFormComponent implements OnInit, OnDestroy {

  public selectedWareId?: number;

  public selectedWare?: IWare;

  public isLoading: boolean = false;

  public isEditing: boolean = false;

  public isCreating: boolean = false;

  public wareForm: FormGroup = new FormGroup({});

  public unitsOfMeasurements: DictinaryItem[] = [];

  public legalEntities: ILegalEntity[] = [];

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly waresService: WaresService,
    private readonly snackBar: MatSnackBar,
    private readonly dictionariesService: DictionariesService,
    private readonly legalEntitiesService: LegalEntitiesService,
    private readonly waresEventBusService: WaresEventBusService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  public ngOnInit(): void {
    this.wareForm = this.createWareForm();

    this.componentSubscriptions = [
      this.route.url
        .pipe(take(1))
        .subscribe((routes: UrlSegment[]) => {
          this.isCreating = routes[0]?.path === WaresRoute.Create;
        }),
      this.waresEventBusService.itemWasSoftDeleted$
        .subscribe((wareId: number) => {
          if (this.selectedWareId === wareId) {
            this.loadWare(this.selectedWareId);
          }
        }),
      this.waresEventBusService.itemWasRestored$
        .subscribe((wareId: number) => {
          if (this.selectedWareId === wareId) {
            this.loadWare(this.selectedWareId);
          }
        }),
      this.subscribeOnRouteParamsChanges(),
      this.loadUnitsOfMeasurements(),
      this.loadLegalEntities(),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public get areActionsVisible(): boolean {
    const currentUserRole = this.authenticationService.getUserClaims()?.Role;
    return currentUserRole === UserRole.Administrator && this.selectedWare?.Status !== WareStatus.ToBeDeleted;
  }
  
  public get isReadonly(): boolean {
    return !this.isEditing && !this.isCreating;
  }

  public get isWareSelectedOrCreating(): boolean {
    return !!(this.selectedWareId);
  }

  public loadWare(id: number): Subscription {
    this.isLoading = true;
    return this.waresService.get(id).subscribe({
      next: async (ware: IWare | undefined) => {
        this.selectedWare = ware;
        this.initializeWareForm();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Ошибка при загрузке товара', 'Закрыть', {
          duration: 3000,
        });
      },
    });
  }

  public onEditBtnClick(): void {
    this.isEditing = true;
  }

  public async onResetBtnClick(): Promise<void> {
    if (this.isEditing) {
      this.isEditing = false;
      this.initializeWareForm();

      return;
    }

    if (this.isCreating) {
      this.isCreating = false;

      await this.router.navigate(
        [`${NavigationUrls.Wares}/`],
        {relativeTo: this.route},
      );
    }
  }

  public onSaveBtnClick(): void {
    if (this.isCreating) {
      this.createWare();
    }
    else if (this.isEditing) {
      this.updateWare();
    }
  }

  public getFormTitle(): string {
    if (this.isCreating) {
      return 'Создание товара';
    }

    if (this.isEditing) {
      return 'Редактирование товара';
    }

    return 'Просмотр товара';
  }

  private createWare(): void {
    this.isLoading = true;
    const wareCreateData: IWare = this.wareForm.value;

    const subscription: Subscription = this.waresService.create(wareCreateData)
      .subscribe({
        next: (ware: IWare) => {
          this.isLoading = false;
          this.waresEventBusService.create(ware);
          this.snackBar.open('Товар добавлен на склад', 'Закрыть', {
            duration: 3000,
          });
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при добавлении товара', 'Закрыть', {
            duration: 3000,
          });
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private updateWare(): void {
    if (!this.selectedWareId) {
      return;
    }

    const wareUpdateData: IWare = {
      ...this.wareForm.value,
      AddressId: this.wareForm.value.Address.Id,
      Status: String(this.wareForm.value.Status),
    };
    this.isLoading = true;
    const subscription: Subscription = this.waresService.update(this.selectedWareId, wareUpdateData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.isEditing = false;

          if (this.selectedWareId) {
            this.waresEventBusService.update({
              ...wareUpdateData,
              Id: this.selectedWareId,
              Status: Number(wareUpdateData.Status),
            });
          }

          this.snackBar.open('Товар обновлён', 'Закрыть', {
            duration: 3000,
          });

          if (this.selectedWareId) {
            const subscription: Subscription = this.loadWare(this.selectedWareId);
            this.componentSubscriptions.push(subscription);
          }
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при обновлении товара', 'Закрыть', {
            duration: 3000,
          });
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private subscribeOnRouteParamsChanges(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      this.selectedWareId = Number(params['id']);
      if (this.selectedWareId) {
        this.isEditing = false;
        this.loadWare(this.selectedWareId);
      } else {
        this.initializeWareForm();
      }
    })
  }

  private createWareForm(): FormGroup {
    return new FormGroup({
      Name: new FormControl(undefined, Validators.required),
      Description: new FormControl(undefined),
      TechnicalParameterValue: new FormControl(undefined, Validators.required),
      UnitOfMeasurementId: new FormControl(undefined, Validators.required),
      LegalEntityId: new FormControl(undefined),
      Address: new FormControl(undefined),
      ReceivingDate: new FormControl(undefined, [Validators.required]),
      ShippingDate: new FormControl(undefined),
      Status: new FormControl(undefined),
    });
  }

  private initializeWareForm(): void {
    this.wareForm.setValue({
      Name: this.selectedWare?.Name ?? null,
      Description: this.selectedWare?.Description ?? null,
      TechnicalParameterValue: this.selectedWare?.TechnicalParameterValue ?? null,
      UnitOfMeasurementId: this.selectedWare?.UnitOfMeasurementId ?? null,
      LegalEntityId: this.selectedWare?.LegalEntityId ?? null,
      Address: this.selectedWare?.Address ?? null,
      ReceivingDate: this.selectedWare?.ReceivingDate ?? null,
      ShippingDate: this.selectedWare?.ShippingDate ?? null,
      Status: this.selectedWare?.Status ?? null,
    });

    if (this.isCreating) {
      this.wareForm.controls['ReceivingDate'].setValue(new Date());
    }
  }

  private loadUnitsOfMeasurements(): Subscription {
    this.isLoading = true;
    return this.dictionariesService.getAll(unitOfMeasurements.name)
      .subscribe({
        next: (unitsOfMeasurements: DictinaryItem[]) => {
          this.isLoading = false;
          this.unitsOfMeasurements = unitsOfMeasurements;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при загрузке единиц измерения', 'Закрыть', {
            duration: 3000,
          });
        },
      });
  }

  private loadLegalEntities(): Subscription {
    this.isLoading = true;
    return this.legalEntitiesService.getAllForSelectionList()
      .subscribe({
        next: (legalEntities: ILegalEntity[]) => {
          this.legalEntities = legalEntities;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при загрузке юридических лиц', 'Закрыть', {
            duration: 3000,
          });
        },
      });
  }
}
