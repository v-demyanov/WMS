import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { MatModule } from '../mat/mat.module';
import { AccessRoutingModule } from './access-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    MatModule,
    AccessRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class AccessModule {
}
