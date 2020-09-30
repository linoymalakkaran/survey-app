import { Injectable } from '@angular/core';
import { AlertModel } from '../../models/alert.model';

@Injectable({providedIn: 'root'})
export class AlertService {

  raiseSuccess(message: string): AlertModel {
    let _alert: AlertModel = {
      Message: message,
      AlertStatus: "success",
      ShowAlert: true
    };
    return _alert;
  }

  raiseError(message: string): AlertModel {
    let _alert: AlertModel = {
      Message: message,
      AlertStatus: "danger",
      ShowAlert: true
    };
    return _alert;
  }

  raiseWarning(message: string): AlertModel {
    let _alert: AlertModel = {
      Message: message,
      AlertStatus: "warning",
      ShowAlert: true
    };
    return _alert;
  }

  raiseErrors(message: string, errors: any): AlertModel {
    let _errors = [];
    if (!Array.isArray(errors)) {
      if (typeof(errors) === 'string') {
        _errors.push(errors);
      }else if(typeof(errors) === 'object'  && errors && errors.message){
        _errors.push(errors.message);
      }
    } else {
      _errors = errors;
    }
    let _alert: AlertModel = {
      Message: message,
      AlertStatus: "danger",
      ShowAlert: true,
      Errors: _errors
    };

    return _alert;
  }

  close(): AlertModel {
    let _alert: AlertModel = {
      ShowAlert: false
    };
    return _alert;
  }
}
