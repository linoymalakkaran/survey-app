import {  NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ExtraOptions, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../@shared/shared.module';
import { BootstrapAlertModule } from '../@shared/modules/ng-bootstrap-alert/ng-bootstrap-alert';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];


@NgModule({
  schemas: [
  ],
  declarations: [
    LoginComponent,
  ],
  exports: [
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    BootstrapAlertModule
  ]
})
export class AuthModule { }


