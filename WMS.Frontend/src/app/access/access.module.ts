import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatModule } from '../mat/mat.module';
import { AccessRoutingModule } from './access-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    MatModule,
    AccessRoutingModule,
    ReactiveFormsModule,
  ],
})
export class AccessModule { }
