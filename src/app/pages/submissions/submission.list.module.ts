import {  NgModule } from '@angular/core';
import {  FormioModule } from 'angular-formio'; 
import { SubmissionListComponent } from './submission.list.component'; 
import { FormsModule } from '@angular/forms';
import { SurveyAlertModule } from '../alert.module';
import { ThemeModule } from '../../@theme/theme.module'; 
import { AgGridModule } from 'ag-grid-angular';

import { 
  NbTabsetModule, 
  NbCardModule, 
  NbButtonModule, 
  NbCheckboxModule, 
  NbInputModule, 
  NbSelectModule, 
  NbActionsModule,  
  NbTreeGridModule
} from '@nebular/theme'; 
import { SharedModule } from '../../@shared/shared.module';
import { FormSubmissionRoutingModule } from './submission.list.route';


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
    NbTabsetModule,
    FormioModule,
    SurveyAlertModule,
    NbActionsModule,
    NbTreeGridModule,
    FormSubmissionRoutingModule,
    AgGridModule.withComponents([
    ]),
  ],
  declarations: [ 
    SubmissionListComponent,
  ],
  providers: [  
  ]
})
export class FormSubmissionModule { }
