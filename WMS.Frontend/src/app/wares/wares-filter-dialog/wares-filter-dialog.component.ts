import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IArea } from 'src/app/dictionaries/addresses/models/area';
import { IRack } from 'src/app/dictionaries/addresses/models/rack';
import { IVerticalSection } from 'src/app/dictionaries/addresses/models/vertical-section';
import { IShelf } from 'src/app/dictionaries/addresses/models/shelf';
import { AreasService } from 'src/app/dictionaries/addresses/areas/services/areas.service';
import { RacksService } from 'src/app/dictionaries/addresses/racks/services/racks.service';
import { VerticalSectionsService } from 'src/app/dictionaries/addresses/racks/services/vertical-sections.service';
import { ShelfsService } from 'src/app/dictionaries/addresses/racks/services/shelfs.service';
import { FormControl, FormGroup } from '@angular/forms';
import { WareAdvancedFilterDescriptor } from '../models/ware-advanced-filter-descriptor';

@Component({
  selector: 'app-wares-filter-dialog',
  templateUrl: './wares-filter-dialog.component.html',
  styleUrls: ['./wares-filter-dialog.component.scss']
})
export class WaresFilterDialogComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;

  public areas: IArea[] = [];

  public racks: IRack[] = [];

  public verticalSections: IVerticalSection[] = [];

  public shelfs: IShelf[] = [];

  public filterForm: FormGroup = new FormGroup({});

  private componentSubscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public dialogData: WareAdvancedFilterDescriptor,
    private dialogRef: MatDialogRef<WaresFilterDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly areasService: AreasService,
    private readonly racksService: RacksService,
    private readonly verticalSectionsService: VerticalSectionsService,
    private readonly shelfsService: ShelfsService,
  ) {}

  public ngOnInit(): void {
    this.filterForm = this.createFilterForm();

    if (this.dialogData) {
      this.initializeFilterForm();
    }

    this.componentSubscriptions = [
      this.loadAreas(),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public onCancelBtnClick(): void {
    this.dialogRef.close();
  }

  public onApplyBtnClick(): void {
    this.dialogRef.close(<WareAdvancedFilterDescriptor>{
      AreaId: this.filterForm.value.AreaId,
      RackId: this.filterForm.value.RackId,
      VerticalSectionId: this.filterForm.value.VerticalSectionId,
      ShelfId: this.filterForm.value.ShelfId,
    });
  }

  public onAreaSelected(areaId: number): void {
    this.filterForm.controls['RackId'].setValue(null);
    this.filterForm.controls['VerticalSectionId'].setValue(null);
    this.filterForm.controls['ShelfId'].setValue(null);

    this.racks = [];
    this.verticalSections = [];
    this.shelfs = [];

    const subscription: Subscription = this.loadRacks(areaId);
    this.componentSubscriptions.push(subscription);
  }

  public onRackSelected(rackId: number): void {
    this.filterForm.controls['VerticalSectionId'].setValue(null);
    this.filterForm.controls['ShelfId'].setValue(null);

    this.verticalSections = [];
    this.shelfs = [];

    const subscription: Subscription = this.loadVerticalSections(rackId);
    this.componentSubscriptions.push(subscription);
  }

  public onSectionSelected(sectionId: number): void {
    this.filterForm.controls['ShelfId'].setValue(null);
    this.shelfs = [];

    const subscription: Subscription = this.loadShelfs(sectionId);
    this.componentSubscriptions.push(subscription);
  }

  public onShelfSelected(shelfId: number): void {
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
        error: () => {
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
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при загрузке полок', 'Закрыть', {
            duration: 3000,
          });
        },
      });
  }

  private createFilterForm(): FormGroup {
    return new FormGroup({
      AreaId: new FormControl(undefined),
      RackId: new FormControl(undefined),
      VerticalSectionId: new FormControl(undefined),
      ShelfId: new FormControl(undefined),
    });
  }

  private initializeFilterForm(): void {
    this.filterForm.setValue({
      AreaId: this.dialogData.AreaId ?? null,
      RackId: this.dialogData.RackId ?? null,
      VerticalSectionId: this.dialogData.VerticalSectionId ?? null,
      ShelfId: this.dialogData.ShelfId ?? null,
    });

    if (this.dialogData.AreaId) {
      const subscription: Subscription = this.loadRacks(this.dialogData.AreaId);
      this.componentSubscriptions.push(subscription);
    }

    if (this.dialogData.AreaId && this.dialogData.RackId) {
      const subscription: Subscription = this.loadVerticalSections(this.dialogData.RackId);
      this.componentSubscriptions.push(subscription);
    }

    if (this.dialogData.AreaId && this.dialogData.RackId && this.dialogData.VerticalSectionId) {
      const subscription: Subscription = this.loadShelfs(this.dialogData.VerticalSectionId);
      this.componentSubscriptions.push(subscription);
    }
  }
}
