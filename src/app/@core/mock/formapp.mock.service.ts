
import { Injectable } from '@angular/core';
import { ServiceFormData, ServiceForm, FormApp } from '../data/formapp';
import { RestMockProvider } from './rest.mock.service';

@Injectable({providedIn: 'root'})
export class ServiceMockFormService extends ServiceFormData {

    forms: FormApp[]
    constructor(private RestMockProvider: RestMockProvider) {
        super();
    }

    async addNewForm(form: FormApp): Promise<FormApp> {
        return new Promise((resolve, reject) => {
            this.RestMockProvider.post("form", form).then((data: FormApp) => {
                this.forms.push(data);
                resolve(data);
            }).catch(err => {
                reject(err);
            })

        });
    }
    async updateForm(form: FormApp): Promise<FormApp> {
        return new Promise((resolve, reject) => {
            this.RestMockProvider.put("form/" + form._id, form).then((data: FormApp) => {
                var foundIndex = this.forms.findIndex(x => x._id == data._id);
                this.forms[foundIndex] = data;
                resolve(data);
            }).catch(err => { 
                reject(err) ;
            })
        });
    }

    async getForms(fields?: any, query?: any): Promise<FormApp[]> {
        if (this.forms == undefined) {
            this.forms = await this.RestMockProvider.get("form", fields, query);
            return this.forms;
        }
        return this.forms;
    }
    async getFormById(id: any): Promise<FormApp> {
        var form: FormApp = await this.RestMockProvider.get("form/" + id);
        return form;
    }
}


