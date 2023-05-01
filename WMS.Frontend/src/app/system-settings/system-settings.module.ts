import { NgModule } from '@angular/core';

import { SystemSettingBottomSheetComponent } from './system-setting-bottom-sheet/system-setting-bottom-sheet.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SystemSettingBottomSheetComponent],
  imports: [
    SharedModule,
  ],
})
export class SystemSettingsModule { }
