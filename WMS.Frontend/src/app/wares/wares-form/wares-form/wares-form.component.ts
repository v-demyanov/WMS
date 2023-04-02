import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { Subscription, take, firstValueFrom } from 'rxjs';

import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { IUnitOfMeasurements } from 'src/app/dictionaries/unit-of-measurements/models/unit-of-measurements';
import { UnitOfMeasurementsService } from 'src/app/dictionaries/unit-of-measurements/services/unit-of-measurements.service';
import { IWare } from '../../models/ware';
import { WaresService } from '../../services/wares.service';
import { WaresRoute } from '../../wares-routing.constants';
import { LegalEntitiesService } from 'src/app/admin-panel/tenants/legal-entities/services/legal-entities.service';
import { ILegalEntity } from 'src/app/admin-panel/tenants/legal-entities/models/legal-entity';
import { IVerticalSection } from 'src/app/dictionaries/addresses/models/vertical-section';
import { VerticalSectionsService } from 'src/app/dictionaries/addresses/racks/services/vertical-sections.service';
import { WaresEventBusService } from '../../services/wares-event-bus.service';
import { AuthenticationService, UserRole } from 'src/app/core/authentication';

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

  public unitsOfMeasurements: IUnitOfMeasurements[] = [];

  public legalEntities: ILegalEntity[] = [];

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly waresService: WaresService,
    private readonly snackBar: MatSnackBar,
    private readonly unitOfMeasurementsService: UnitOfMeasurementsService,
    private readonly legalEntitiesService: LegalEntitiesService,
    private readonly verticalSectionsService: VerticalSectionsService,
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
    return currentUserRole === UserRole.Administrator;
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
        const verticalSectionId: number | undefined = ware?.Address?.Shelf?.VerticalSectionId;
        if (verticalSectionId) {
          const verticalSection: IVerticalSection = await firstValueFrom(this.verticalSectionsService.get(verticalSectionId));
          ware!.Address!.Shelf!.VerticalSection = verticalSection;
        }
        
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

  private createWare(): void {
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

    const wareUpdateData: IWare = this.wareForm.value;
    this.isLoading = true;
    const subscription: Subscription = this.waresService.update(this.selectedWareId ?? 1, wareUpdateData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.isEditing = false;
          this.selectedWare = {
            Id: this.selectedWareId,
            ...wareUpdateData
          };
          this.snackBar.open('Товар обновлён', 'Закрыть', {
            duration: 3000,
          });
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
      this.selectedWareId = params['id'];
      if (this.selectedWareId) {
        this.isEditing = false;
        this.loadWare(this.selectedWareId);
      }
    })
  }

  private createWareForm(): FormGroup {
    return new FormGroup({
      Name: new FormControl(undefined, Validators.required),
      Description: new FormControl(undefined, []),
      TechnicalParameterValue: new FormControl(undefined, Validators.required),
      UnitOfMeasurementId: new FormControl(undefined, Validators.required),
      LegalEntityId: new FormControl(undefined, []),
      Address: new FormControl(undefined, [Validators.required]),
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
    });
  }

  private loadUnitsOfMeasurements(): Subscription {
    this.isLoading = true;
    return this.unitOfMeasurementsService.getAll()
      .subscribe({
        next: (unitsOfMeasurements: IUnitOfMeasurements[]) => {
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
