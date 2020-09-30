import { Component,  Input, NgModule } from '@angular/core';
import { AlertModel } from '../@core/models/alert.model';
import { NbAlertModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'survey-alert',
  template: `<nb-alert [status]="alert?.AlertStatus" closable (close)="onCloseAlert()" *ngIf="alert?.ShowAlert">
                <span>{{alert?.Message}}</span>
                <ul class="errorUl" *ngIf="hasErrors">
                    <li *ngFor="let err of alert.Errors">{{displayError(err)}}</li>
                </ul>
              </nb-alert>`,
  styleUrls: []
})
export class AlertComponent {
  @Input() alert: AlertModel;
  @Input() alertTimeOutInSec: AlertModel;

  constructor() {
    this.alert = {
      AlertStatus: null,
      Errors: null,
      Message: null,
      ShowAlert: false
    };
  }

  onCloseAlert() {
    this.alert.ShowAlert = false;
  }

  hasErrors(): boolean {
    if (this.alert.Errors !== undefined &&
      this.alert.Errors !== null &&
      Array.isArray(this.alert.Errors) &&
      this.alert.Errors.length > 0) {
      return true;
    }
    return false;
  }

  displayError(err: any) {
    if (err === undefined ||
      err === null) {
      return "";
    }
    if (typeof (err) === "string") {
      return err;
    }
    if (err instanceof Object) {
      let _keys = Object.keys(err);
      _keys.forEach(eKey => {
        let _message = `${eKey}: ${err[eKey]}`;
        return _message;
      });
    }
  }

}

@NgModule({
  imports: [
    CommonModule,
    NbAlertModule
  ],
  declarations: [
    AlertComponent
  ],
  exports: [
    AlertComponent,
    NbAlertModule],
  schemas: [
  ]
})
export class SurveyAlertModule {
}

