import { Component, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, firstValueFrom } from 'rxjs';

import { AddressPickerDialogComponent } from './address-picker-dialog/address-picker-dialog.component';
import { AddressPickerDialogData } from './models/address-picker-dialog-data';
import { IArea } from 'src/app/dictionaries/addresses/models/area';
import { IRack } from 'src/app/dictionaries/addresses/models/rack';
import { IVerticalSection } from 'src/app/dictionaries/addresses/models/vertical-section';
import { IShelf } from 'src/app/dictionaries/addresses/models/shelf';
import { ShelfsService } from 'src/app/dictionaries/addresses/racks/services/shelfs.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-address-picker',
  templateUrl: './address-picker.component.html',
  styleUrls: ['./address-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AddressPickerComponent,
    multi: true,
  }],
})
export class AddressPickerComponent implements ControlValueAccessor, OnDestroy {

  @Input()
  public readonly: boolean = true;

  @Input()
  public controlLabel: string = 'Адрес';
  
  public shelfId?: number | null;

  public touched: boolean = false;

  private componentSubscriptions: Subscription[] = [];

  private selectedArea?: IArea;

  private selectedRack?: IRack;

  private selectedVerticalSection?: IVerticalSection;

  private selectedShelf?: IShelf;

  constructor(
    private readonly dialog: MatDialog,
    private readonly shelfsService: ShelfsService,
    private readonly snackBar: MatSnackBar,  
  ) {}

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public writeValue(shelfId?: number | null): void {
    this.shelfId = shelfId;
    if (shelfId) {
      this.loadShelf(shelfId);
    } else {
      this.selectedArea = undefined;
      this.selectedRack = undefined;
      this.selectedVerticalSection = undefined;
      this.selectedShelf = undefined;
    }
  }

  public registerOnChange(onChange: (shelfId?: number | null) => {}): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => {}): void {
    this.onTouched = onTouched;
  }

  public getDisplayValues(): string[] {
    const name: string | undefined = this.selectedArea?.Name;
    const rackIndex: number | undefined = this.selectedRack?.Index;
    const sectionIndex: number | undefined = this.selectedVerticalSection?.Index;
    const shelfIndex: number | undefined = this.selectedShelf?.Index;

    const areaDisplayName: string = name ? `Зона: ${name}` : '';
    const rackDisplayName: string = rackIndex ? `Стелаж: №${rackIndex}` : '';
    const sectionDisplayName: string = sectionIndex ? `Секция: №${sectionIndex}` : '';
    const shelfDisplayName: string = shelfIndex ? `Полка: №${shelfIndex}` : '';

    return [areaDisplayName, rackDisplayName, sectionDisplayName, shelfDisplayName].filter(x => x);
  }

  public async openAddressPickerDialog(): Promise<void> {
    const dialogRef = this.dialog.open(
      AddressPickerDialogComponent, {
        ariaModal: true,
        disableClose: true,
        width: '33.5rem',
        data: <AddressPickerDialogData> {
          Area: this.selectedArea,
          Rack: this.selectedRack,
          VerticalSection: this.selectedVerticalSection,
          Shelf: this.selectedShelf,
        },
      },
    );

    const result: AddressPickerDialogData = await firstValueFrom(dialogRef.afterClosed());
    this.markAsTouched();

    if (result) {
      this.selectedArea = result.Area;
      this.selectedRack = result.Rack;
      this.selectedVerticalSection = result.VerticalSection;
      this.selectedShelf = result.Shelf;
      this.shelfId = result.Shelf?.Id;

      this.onChange(this.shelfId);
    }
  }

  public resetControl(): void {
    this.shelfId = undefined;
    this.selectedArea = undefined;
    this.selectedRack = undefined;
    this.selectedVerticalSection = undefined;
    this.selectedShelf = undefined;

    this.markAsTouched();
    this.onChange(null);
  }

  private onChange = (shelfId?: number | null): void => {};

  private onTouched = (): void => {};

  private markAsTouched(): void {
    this.onTouched();
    this.touched = true;
  }

  private loadShelf(shelfId: number): void {
    const subscription = this.shelfsService
      .getById(shelfId)
      .subscribe({
        next: (shelf: IShelf) => {
          this.selectedArea = shelf?.VerticalSection?.Rack?.Area;
          this.selectedRack = shelf?.VerticalSection?.Rack;
          this.selectedVerticalSection = shelf?.VerticalSection;
          this.selectedShelf = shelf;
        },
        error: () => {
          this.snackBar.open('Ошибка при загрузке полки', 'Закрыть', {
            duration: 3000,
          });
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
