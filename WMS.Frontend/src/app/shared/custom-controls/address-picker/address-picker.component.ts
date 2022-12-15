import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { IAddress } from 'src/app/dictionaries/addresses/models/address';
import { AddressPickerDialogComponent } from './address-picker-dialog/address-picker-dialog.component';
import { AddressPickerDialogData } from './models/address-picker-dialog-data';

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

  public address: IAddress | undefined;

  public touched: boolean = false;

  @Input()
  public readonly: boolean = true;

  constructor(private readonly dialog: MatDialog) {}

  public writeValue(address: IAddress): void {
    this.address = address;
  }

  public registerOnChange(onChange: (address?: IAddress) => {}): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => {}): void {
    this.onTouched = onTouched;
  }

  public get displayValue(): string {
    if (!this.address) {
      return '';
    }

    const name: string | undefined = this.address?.Area?.Name;
    const rackIndex: number | undefined = this.address?.Shelf?.VerticalSection?.Rack?.Index;
    const sectionIndex: number | undefined = this.address?.Shelf?.VerticalSection?.Index;
    const shelfIndex: number | undefined = this.address?.Shelf?.Index;

    const areaDisplayName: string | undefined = name !== undefined ? `Зона '${name}'` : undefined;
    const rackDisplayName: string | undefined = rackIndex !== undefined ? `стелаж №${rackIndex}` : undefined;
    const sectionDisplayName: string | undefined = sectionIndex !== undefined ? `секция №${sectionIndex}` : undefined;
    const shelfDisplayName: string | undefined = shelfIndex !== undefined ? `полка №${shelfIndex}` : undefined;

    const displayName: (string | undefined | number)[] = [areaDisplayName, rackDisplayName, sectionDisplayName, shelfDisplayName];
    return displayName.filter(x => x !== undefined).map(x => x?.toString()).join(', ');
  }

  public async openAddressPickerDialog(): Promise<void> {
    const dialogRef = this.dialog.open(
      AddressPickerDialogComponent, {
        width: '33.5rem',
        data: <AddressPickerDialogData> {
          address: this.address,
        },
      },
    );

    // TODO: Fix setting Address field after updating or creating
    const result = await firstValueFrom(dialogRef.afterClosed());
    console.log(result);

    if (result) {
      this.address = result;
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
