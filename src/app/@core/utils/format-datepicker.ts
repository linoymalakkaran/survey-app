import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  constructor(matDateLocale: string, platform: Platform) {
    super(matDateLocale, platform);
  }
  format(date: Date, displayFormat: Object): string {
    //console.log(displayFormat);
    if (displayFormat == "input") {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let h = date.getHours(), m = date.getMinutes();
      let _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year + ' ' + _time;
      //return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    } else {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let h = date.getHours(), m = date.getMinutes();
      let _time = (h > 12) ? (this._to2digit(h - 12) + ':' + this._to2digit(m) + ' PM') : (this._to2digit(h) + ':' + this._to2digit(m) + ' AM');
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year + ' ' + _time;
      //return date.toDateString();
    }
  }

  private _to2digit(n: number): string {
    return ('00' + n).slice(-2);
  }
}

@Injectable()
export class AppMatDateAdapter extends NativeDateAdapter {
  constructor(matDateLocale: string, platform: Platform) {
    super(matDateLocale, platform);
  }
  format(date: Date, displayFormat: Object): string {
    //console.log(displayFormat);
    if (displayFormat == "input") {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    } else {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    }
  }

  private _to2digit(n: number): string {
    return ('00' + n).slice(-2);
  }
}

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
