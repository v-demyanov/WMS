import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SystemSettingsService } from '../services/system-settings.service';
import { SystemSettings } from '../models/system-settings';

@Component({
  selector: 'app-system-setting-bottom-sheet',
  templateUrl: './system-setting-bottom-sheet.component.html',
  styleUrls: ['./system-setting-bottom-sheet.component.scss']
})
export class SystemSettingBottomSheetComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;

  public systemSettingsForm: FormGroup = new FormGroup({});

  public systemSettings?: SystemSettings;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<SystemSettingBottomSheetComponent>,
    private readonly systemSettingsService: SystemSettingsService,
    private readonly snackBar: MatSnackBar,
  ) {}

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) => subscription.unsubscribe());

  public ngOnInit(): void {
    this.systemSettingsForm = this.createSystemSettingsForm();
    this.loadSystemSettings();
  }

  public onCloseClick(): void {
    this.bottomSheetRef.dismiss();
  }

  public onUpdateClick(): void {
    this.systemSettingsService
      .update(this.systemSettingsForm.value)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Системные настройки обновлены', 'Закрыть', {
            duration: 3000,
          });
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при обновлении системных настроек', 'Закрыть', {
            duration: 3000,
          });
        },
      });
  }

  private loadSystemSettings(): void {
    this.isLoading = true;
    const subscription = this.systemSettingsService
      .getAll()
      .subscribe({
        next: (systemSettings: SystemSettings) => {
          this.systemSettings = systemSettings;
          this.initializeWareForm();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при системных настроек', 'Закрыть', {
            duration: 3000,
          });
        },
      });
    this.componentSubscriptions.push(subscription);
  }

  private createSystemSettingsForm(): FormGroup {
    return new FormGroup({
      ProblemExpirationNotificationDays: new FormControl(undefined, Validators.required),
      ShippedWaresStorageDays: new FormControl(undefined, Validators.required),
    });
  }

  private initializeWareForm(): void {
    this.systemSettingsForm.setValue({
      ProblemExpirationNotificationDays: this.systemSettings?.ProblemExpirationNotificationDays ?? null,
      ShippedWaresStorageDays: this.systemSettings?.ShippedWaresStorageDays ?? null,
    });
  }
}
