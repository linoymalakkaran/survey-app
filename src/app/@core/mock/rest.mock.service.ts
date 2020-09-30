import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class RestMockProvider 
{
    apiUrl: string;
    apiKey: string;
        
    constructor(public httpClient:HttpClient ) {
        this.apiUrl = "https://demosree-90a5.restdb.io/rest/";;
        this.apiKey = "5ec0a893ce64705c9963fbc6"
    
    };
    async get (method:string,fields?:any,query?:any) : Promise<any>
    { 
        let header = new HttpHeaders({'x-apikey': this.apiKey});
        header.append("content-type","application/json")
        return new Promise((resolve,reject) => {
            var url = this.apiUrl + method + '?';
            if (query != undefined)
                url += 'q=' + JSON.stringify( query );
            if (fields != undefined)
                url += 'h=' + JSON.stringify( {$fields: fields} );
            
            this.httpClient.get(url, {headers: header}).subscribe(data => {
              resolve(data);
            }, err => {
                if (err.status == 401)
                {
                    resolve(err); 
                } else {  resolve(err); }
            });
          });
    }

    async post (method:string, data:any)
    {
        let header = new HttpHeaders({'x-apikey': this.apiKey});
        header.append("content-type","application/json")
        return new Promise((resolve,reject) => {
            this.httpClient.post(this.apiUrl + method,data, {headers: header} ).subscribe(data => {
               resolve(data);
            }, err => {
                if (err.status == 401)
                {
                } else {  reject(err); }
            });
          });
    }

    put (method:string, data:any)
    {       
        let header = new HttpHeaders({'x-apikey': this.apiKey});
        header.append("content-type","application/json")   
        return new Promise((resolve,reject) => {
            this.httpClient.put(this.apiUrl + method,data, {headers: header} ).subscribe(data => {
               resolve(data);
            }, err => {
                if (err.status == 401)
                {
                } else {  reject(err); }
            });
          });
    }

    delete (method:string)
    {
            
        let header = new HttpHeaders({'x-apikey': this.apiKey});
        
        return new Promise((resolve,reject) => {
            this.httpClient.delete(this.apiUrl + method, {headers:header} ).subscribe(data => {
               resolve(data);
            }, err => {
                if (err.status == 401)
                {
                } else {  reject(err); }
            });
          });
    }

}