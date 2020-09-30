import { NgModule } from '@angular/core';
import { NbMenuModule, NbWindowModule, NbAlertModule } from '@nebular/theme';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ServiceFormBuilderModule } from './forms/formbuilder/formbuilder.module';
import { FormSubmissionModule } from './submissions/submission.list.module';


import { AgGridModule } from "@ag-grid-community/angular";
import { FormBuilderAgGridActionComponent } from './forms/formbuilder/forbuilder_grid_custom_components/formbuilder.grid.custom.component';
import { PartialMatchFilter } from './forms/formbuilder/forbuilder_grid_custom_components/partial-match-filter-component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../@shared/shared.module';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';

@NgModule({
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbAlertModule,
    NbWindowModule.forChild(),
    ServiceFormBuilderModule,
    FormSubmissionModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    // NgxMatDatetimePickerModule,
    // NgxMatTimepickerModule,
    // NgxMatNativeDateModule,
    NgxMatMomentModule,
    AgGridModule.withComponents([
      FormBuilderAgGridActionComponent,
      PartialMatchFilter,
    ]),
  ],
  declarations: [
    PagesComponent,
    FormBuilderAgGridActionComponent
  ],
  entryComponents: [PartialMatchFilter],
  schemas: [
  ],
})
export class PagesModule {
}
