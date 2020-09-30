import { Injectable } from '@angular/core';
import { BootstrapAlert } from './bootstrap-alert';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from "rxjs/Rx";
import { AlertType } from "./ng-bootstrap-alert";

@Injectable({providedIn: 'root'})
export class BootstrapAlertService {

    public _bootstrapAlert: BehaviorSubject<BootstrapAlert>;

    constructor() {
        this._bootstrapAlert = new BehaviorSubject<BootstrapAlert>( null );
    }

    public alert(alert: BootstrapAlert) {
        this._bootstrapAlert.next(alert);
    }

}