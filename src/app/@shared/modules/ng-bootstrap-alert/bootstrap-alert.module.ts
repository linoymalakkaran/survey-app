import { NgModule } from '@angular/core';
import { BootstrapAlertComponent } from './bootstrap-alert.component';
import { CommonModule } from '@angular/common';

@NgModule( {
    imports: [
         CommonModule,
    ],
    declarations: [
        BootstrapAlertComponent,
    ],
    exports: [
        BootstrapAlertComponent
    ],
    providers: [
    ]
} )

export class BootstrapAlertModule {}