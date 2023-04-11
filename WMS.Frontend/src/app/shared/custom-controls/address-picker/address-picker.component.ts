import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { IAddress } from 'src/app/dictionaries/addresses/models/address';
import { AddressPickerDialogComponent } from './address-picker-dialog/address-picker-dialog.component';
import { AddressPickerDialogData } from './models/address-picker-dialog-data';
import { IArea } from 'src/app/dictionaries/addresses/models/area';
import { IRack } from 'src/app/dictionaries/addresses/models/rack';
import { IVerticalSection } from 'src/app/dictionaries/addresses/models/vertical-section';
import { IShelf } from 'src/app/dictionaries/addresses/models/shelf';

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
export class AddressPickerComponent implements ControlValueAccessor {

  @Input()
  public readonly: boolean = true;
  
  public address?: IAddress | null;

  public touched: boolean = false;

  private selectedArea?: IArea;

  private selectedRack?: IRack;

  private selectedVerticalSection?: IVerticalSection;

  private selectedShelf?: IShelf;

  constructor(private readonly dialog: MatDialog) {}

  public writeValue(address: IAddress): void {
    this.address = address;
    if (address !== null) {
      this.selectedArea = this.address?.Area;
      this.selectedRack = this.address.Shelf?.VerticalSection?.Rack;
      this.selectedVerticalSection = this.address.Shelf?.VerticalSection;
      this.selectedShelf = this.address.Shelf;
    }
  }

  public registerOnChange(onChange: (address?: IAddress) => {}): void {
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
          Address: this.address,
          Area: this.selectedArea,
          Rack: this.selectedRack,
          VerticalSection: this.selectedVerticalSection,
          Shelf: this.selectedShelf,
        },
      },
    );

    // TODO: Fix setting Address field after updating or creating
    const result: AddressPickerDialogData = await firstValueFrom(dialogRef.afterClosed());

    if (result) {
      this.address = result.Address;
      this.selectedArea = result.Area;
      this.selectedRack = result.Rack;
      this.selectedVerticalSection = result.VerticalSection;
      this.selectedShelf = result.Shelf;

      this.markAsTouched();
      this.onChange(this.address);
    }
  }

  private onChange = (address?: IAddress): void => {};

  private onTouched = (): void => {};

  private markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
