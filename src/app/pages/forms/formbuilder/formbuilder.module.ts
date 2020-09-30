import {  NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormioModule } from 'angular-formio';
import { FormsModule } from '@angular/forms';

import {
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbActionsModule,
  NbSelectModule,
  NbTabsetModule,
  NbCheckboxModule
} from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { SurveyAlertModule } from '../../alert.module';
import { ServiceFormComponent } from '../form/form.component';
import { ServiceFormPreviewComponent } from '../formpreview/form.preview.component';
import { ServiceFormBuilderComponent } from '../formbuilder/formbuilder.component';
import { OdataService } from '../../../@core/services/odata_services/odata.service';
import { PartialMatchFilter } from '../formbuilder/forbuilder_grid_custom_components/partial-match-filter-component';
import { SharedModule } from '../../../@shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { AppMatDateAdapter } from '../../../@core/utils/format-datepicker';

@NgModule({
  schemas: [
  ],
  imports: [
    SharedModule,
    FormsModule,
    NbTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    NbSelectModule,
    ThemeModule,
    FormioModule,
    SurveyAlertModule,
    NbActionsModule,
    AgGridModule.withComponents(
      [
        PartialMatchFilter
      ]
    ),
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatInputModule,
    // NgxMatDatetimePickerModule,
    // NgxMatTimepickerModule,
    // NgxMatNativeDateModule,
    // NgxMatMomentModule,
  ],
  declarations: [
    ServiceFormComponent,
    ServiceFormBuilderComponent,
    ServiceFormPreviewComponent,
    PartialMatchFilter,
  ],
  exports:[
  ],
  providers: [
    OdataService,
    // {
    //   provide: NgxMatDateAdapter,
    //   useClass: AppDateAdapter,
    //   deps: [
    //     MAT_DATE_LOCALE,
    //     NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS
    //   ]
    // },
     {
      provide: DateAdapter,
      useClass: AppMatDateAdapter,
      deps: [
        MAT_DATE_LOCALE,
        MAT_MOMENT_DATE_ADAPTER_OPTIONS
      ]
    },
  ]
})
export class ServiceFormBuilderModule { }
