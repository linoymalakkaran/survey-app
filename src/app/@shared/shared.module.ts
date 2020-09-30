import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForRolesDirective } from './directives/for-roles.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { LoaderComponent } from './modules/loader/loader.component';
import { BootstrapAlertModule } from './modules/ng-bootstrap-alert/ng-bootstrap-alert';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  schemas: [
  ],
  imports: [
    CommonModule,
    BootstrapAlertModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    CommonModule,
    ForRolesDirective,
    LoadingSpinnerComponent,
    LoaderComponent,
    BootstrapAlertModule
  ],
  declarations: [
    ForRolesDirective,
    LoadingSpinnerComponent,
    LoaderComponent,
  ],
  providers: [
  ]
})
export class SharedModule { }
