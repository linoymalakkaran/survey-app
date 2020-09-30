import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class RestProvider {
  apiUrl: string;
  apiKey: string;

  constructor(public httpClient: HttpClient) {
    this.apiUrl = environment.odataApiUrl;
  };

  async get(method: string, params?: any):Promise<any> {
    try {
      let url = this.GetUrlWithParams(method, params);
      return await this.httpClient.get(url).toPromise();
    } catch (error) {
      console.log(`method = ${method} : error = ${error}`);
      return of(error);
    }
  }

  private GetUrlWithParams(method: string, params: any) {
    let url = this.apiUrl + method + '?';
    if (params) {
      let queryString = Object.keys(params)
        .map(key => key + '=' + params[key]).join('&');
      url += queryString;
    }
    return url;
  }

  async post(method: string, data: any) {
    return new Promise((resolve, reject) => {
      this.httpClient.post(this.apiUrl + method, data).subscribe(data => {
        resolve(data);
      }, err => {
        if (err.status == 401) {
        } else { reject(err); }
      });
    });
  }

  put(method: string, data: any) {
    return new Promise((resolve, reject) => {
      this.httpClient.put(this.apiUrl + method, data).subscribe(data => {
        resolve(data);
      }, err => {
        if (err.status == 401) {
        } else { reject(err); }
      });
    });
  }

  delete(method: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.delete(this.apiUrl + method).subscribe(data => {
        resolve(data);
      }, err => {
        if (err.status == 401) {
        } else { reject(err); }
      });
    });
  }

}
