import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatModule } from '../mat/mat.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AddressPickerComponent } from './custom-controls/address-picker/address-picker.component';
import { AddressPickerDialogComponent } from './custom-controls/address-picker/address-picker-dialog/address-picker-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    AddressPickerComponent,
    AddressPickerDialogComponent,
  ],
  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
  exports: [
    ConfirmDialogComponent,
    AddressPickerComponent,
    MatModule,
    ReactiveFormsModule,
    CommonModule,
    ScrollingModule,
  ],
})
export class SharedModule { }
