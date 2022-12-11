import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { IWare } from '../../models/ware';

import { WaresService } from '../../services/wares.service';

@Component({
  selector: 'app-wares-toolbar',
  templateUrl: './wares-toolbar.component.html',
  styleUrls: ['./wares-toolbar.component.scss']
})
export class WaresToolbarComponent {

  @Input()
  public wareCount: number = 0;
}
