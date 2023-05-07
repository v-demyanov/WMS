import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { WareRestoreDialogData } from '../models/ware-restore-dialog-data';

@Component({
  selector: 'app-ware-restore-dialog',
  templateUrl: './ware-restore-dialog.component.html',
  styleUrls: ['./ware-restore-dialog.component.scss']
})
export class WareRestoreDialogComponent implements OnInit {

  public addressForm: FormGroup = new FormGroup({});

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: WareRestoreDialogData,
    private dialogRef: MatDialogRef<WareRestoreDialogComponent>,
  ) {}

  public ngOnInit(): void {
    this.addressForm = this.createAddressForm();
  }

  public createAddressForm(): FormGroup {
    return new FormGroup({
      ShelfId: new FormControl(null, [Validators.required]),
    });
  }

  public onCancelBtnClick(): void {
    this.dialogRef.close(false);
  }

  public onRestoreBtnClick(): void {
    this.dialogRef.close(this.addressForm.value.ShelfId);
  }
}
