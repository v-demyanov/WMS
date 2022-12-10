import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatModule } from '../mat/mat.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
  ],
  exports: [
    ConfirmDialogComponent,
    MatModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class SharedModule { }
