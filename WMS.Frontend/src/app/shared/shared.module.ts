import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatModule } from '../mat/mat.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
  exports: [
    ConfirmDialogComponent,
    MatModule,
    ReactiveFormsModule,
    CommonModule,
    ScrollingModule,
  ],
})
export class SharedModule { }
