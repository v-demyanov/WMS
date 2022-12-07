import { NgModule } from '@angular/core';
import { AuthModule } from 'ngx-auth';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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
    AuthModule,
  ],
})
export class AccessModule {
}
