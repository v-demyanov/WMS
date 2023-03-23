import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { AreasService } from 'src/app/dictionaries/addresses/areas/services/areas.service';
import { IAddress } from 'src/app/dictionaries/addresses/models/address';
import { IArea } from 'src/app/dictionaries/addresses/models/area';
import { IRack } from 'src/app/dictionaries/addresses/models/rack';
import { IShelf } from 'src/app/dictionaries/addresses/models/shelf';
import { IVerticalSection } from 'src/app/dictionaries/addresses/models/vertical-section';
import { RacksService } from 'src/app/dictionaries/addresses/racks/services/racks.service';
import { ShelfsService } from 'src/app/dictionaries/addresses/racks/services/shelfs.service';
import { VerticalSectionsService } from 'src/app/dictionaries/addresses/racks/services/vertical-sections.service';
import { AddressPickerDialogData } from '../models/address-picker-dialog-data';

@Component({
  selector: 'app-address-picker-dialog',
  templateUrl: './address-picker-dialog.component.html',
  styleUrls: ['./address-picker-dialog.component.scss']
})
export class AddressPickerDialogComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;

  public address: IAddress | undefined;

  public areas: IArea[] = [];

  public racks: IRack[] = [];

  public verticalSections: IVerticalSection[] = [];

  public shelfs: IShelf[] = [];

  public addressForm: FormGroup = new FormGroup({});

  private componentSubscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: AddressPickerDialogData,
    private dialogRef: MatDialogRef<AddressPickerDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly areasService: AreasService,
    private readonly racksService: RacksService,
    private readonly verticalSectionsService: VerticalSectionsService,
    private readonly shelfsService: ShelfsService,
  ) { }

  public ngOnInit(): void {
    this.addressForm = this.createAddressForm();
    this.address = this.dialogData.address;
    if (this.address) {
      this.initializeAddressForm();
    }

    this.componentSubscriptions = [
      this.loadAreas(),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public closeDialog(isSaving: boolean): void {
    if (isSaving) {
      this.dialogRef.close(<IAddress> {
        AreaId: this.addressForm.value.AreaId,
        ShelfId: this.addressForm.value.ShelfId,
      });
      return;
    }

    this.dialogRef.close();
  }

  public onAreaSelected(areaId: number): void {
    this.racks = [];
    this.verticalSections = [];
    this.shelfs = [];
    const subscription: Subscription = this.loadRacks(areaId);
    this.componentSubscriptions.push(subscription);
  }

  public onRackSelected(rackId: number): void {
    this.verticalSections = [];
    this.shelfs = [];
    const subscription: Subscription = this.loadVerticalSections(rackId);
    this.componentSubscriptions.push(subscription);
  }

  public onSectionSelected(sectionId: number): void {
    this.shelfs = [];
    const subscription: Subscription = this.loadShelfs(sectionId);
    this.componentSubscriptions.push(subscription);
  }

  public onShelfSelected(): void {
  }

  private loadAreas(): Subscription {
    this.isLoading = true;
    return this.areasService.getAll()
      .subscribe({
        next: (areas: IArea[]) => {
          this.isLoading = false;
          this.areas = areas;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при загрузке зон', 'Закрыть', {
            duration: 3000,
          });
        },
      });
  }

  private loadRacks(areaId: number): Subscription {
    this.isLoading = true;
    return this.racksService.getAllByAreaId(areaId)
      .subscribe({
        next: (racks: IRack[]) => {
          this.isLoading = false;
          this.racks = racks;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при загрузке стелажей', 'Закрыть', {
            duration: 3000,
          });
        },
      });
  }

  private loadVerticalSections(rackId: number): Subscription {
    this.isLoading = true;
    return this.verticalSectionsService.getAllByRackId(rackId)
      .subscribe({
        next: (verticalSections: IVerticalSection[]) => {
          this.isLoading = false;
          this.verticalSections = verticalSections;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при загрузке секций', 'Закрыть', {
            duration: 3000,
          });
        },
      });
  }

  private loadShelfs(verticalSectionId: number): Subscription {
    this.isLoading = true;
    return this.shelfsService.getAllByVerticalSectionId(verticalSectionId)
      .subscribe({
        next: (shelfs: IShelf[]) => {
          this.isLoading = false;
          this.shelfs = shelfs;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при загрузке полок', 'Закрыть', {
            duration: 3000,
          });
        },
      });
  }

  private createAddressForm(): FormGroup {
    return new FormGroup({
      AreaId: new FormControl(undefined, Validators.required),
      RackId: new FormControl(undefined),
      VerticalSectionId: new FormControl(undefined),
      ShelfId: new FormControl(undefined),
    });
  }

  private initializeAddressForm(): void {
    const areaId: number | undefined = this.address?.AreaId;
    const rackId: number | undefined = this.address?.Shelf?.VerticalSection?.RackId;
    const verticalSectionId: number | undefined = this.address?.Shelf?.VerticalSectionId;
    const shelfId: number | undefined | null = this.address?.ShelfId;


    this.addressForm.setValue({
      AreaId: areaId ?? null,
      RackId: rackId ?? null,
      VerticalSectionId: verticalSectionId ?? null,
      ShelfId: shelfId ?? null,
    });

    if (areaId && rackId) {
      const subscription: Subscription = this.loadRacks(areaId);
      this.componentSubscriptions.push(subscription);
    }

    if (areaId && rackId && verticalSectionId) {
      const subscription: Subscription = this.loadVerticalSections(rackId);
      this.componentSubscriptions.push(subscription);
    }

    if (areaId && rackId && verticalSectionId && shelfId) {
      const subscription: Subscription = this.loadShelfs(verticalSectionId);
      this.componentSubscriptions.push(subscription);
    }
  }
}
