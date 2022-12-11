import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserRole } from 'src/app/core/authentication';
import { UserRoleTitles } from 'src/app/core/authentication/enums/enum-titles/user-role-titles';
import { IWare } from '../../models/ware';
import { WaresService } from '../../services/wares.service';

@Component({
  selector: 'app-wares-form',
  templateUrl: './wares-form.component.html',
  styleUrls: ['./wares-form.component.scss'],
})
export class WaresFormComponent implements OnInit, OnDestroy {

  public selectedWareId?: number;

  public selectedWare?: IWare;

  public isLoading: boolean = false;

  public isEditing: boolean = false;

  public isAdding: boolean = false;

  public wareForm: FormGroup = new FormGroup({});

  // TODO: Remove
  public userRoleTitles: KeyValue<UserRole, string>[] = UserRoleTitles;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly waresService: WaresService,
    private readonly snackBar: MatSnackBar,
  ) {}

  public ngOnInit(): void {
    this.wareForm = this.createWareForm();

    this.componentSubscriptions = [
      this.route.params.subscribe((params: Params) => {
        this.selectedWareId = params['id'];
        if (this.selectedWareId) {
          this.loadWare(this.selectedWareId);
        }
      }),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
  
  public get isReadonly(): boolean {
    return !this.isEditing;
  }

  public loadWare(id: number): Subscription {
    this.isLoading = true;
    return this.waresService.get(id).subscribe({
      next: (ware: IWare | undefined) => {
        this.selectedWare = ware;
        this.initializeWareForm();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.error.errorMessage, 'Закрыть', {
          duration: 3000,
        });
      },
      complete: () => (this.isLoading = false),
    });
  }

  public onEditBtnClick(): void {
    this.isEditing = true;
  }

  private createWareForm(): FormGroup {
    return new FormGroup({
      Name: new FormControl(undefined, Validators.required),
      Description: new FormControl(undefined, []),
      TechnicalParameterValue: new FormControl(undefined, Validators.required),
      UnitOfMeasurementId: new FormControl(undefined, Validators.required),
      TenantId: new FormControl(undefined, []),
    });
  }

  private initializeWareForm(): void {
    this.wareForm.setValue({
      Name: this.selectedWare?.Name ?? null,
      Description: this.selectedWare?.Description ?? null,
      TechnicalParameterValue: this.selectedWare?.TechnicalParameterValue ?? null,
      UnitOfMeasurementId: this.selectedWare?.UnitOfMeasurementId ?? null,
      TenantId: this.selectedWare?.LegalEntityId ?? null,
    });
  }
}
