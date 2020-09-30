import { Injectable } from '@angular/core';
import { o, OHandler, OdataQuery } from 'odata';  
import { ValidationSchema } from '../../models/schema.model'; 
import { Check } from '../../utils/check.utility';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class OdataSchemaService { 
    private readonly Model_Resource_Name: string = "ValidationSchema";
    private readonly rootOdataUri: string = environment.rootOdataUrl;
    private readonly odataRoute: string = "odata";
    private readonly oHandler: OHandler; 

    schemas: ValidationSchema[]
    constructor() {
        this.oHandler = o(this.rootOdataUri);
    }

    async loadSchemas(): Promise<ValidationSchema[]> {
        return new Promise(async(resolve,reject)=>{
            await this.oHandler.get(`${this.odataRoute}/${this.Model_Resource_Name}`).query().then((response) => {
                if(Check.isNull(response)){
                    return resolve([]);
               }
                this.schemas = response.map(entity => {
                    let _item: ValidationSchema = {
                         Code: entity.Code,
                         Name: entity.Name,
                         CreatedBy: entity.CreatedBy,
                         CreatedDate: entity.CreateDate,
                         Id: entity.Id,
                         IsActive: entity.IsActive,
                         UpdatedBy: entity.UpdatedBy,
                         UpdatedDate: entity.UpdateDate,
                         Type:  entity.Type,                      
                         Schema: entity.Schema
                     };
                     return _item;
                });
                return resolve(this.schemas);
            })
            .catch(reason=>{
                reject(reason);
            });
        });
        
    }

    async getSchemaById(id: string): Promise<ValidationSchema> {
        if (this.schemas == undefined){
            await this.loadSchemas();
        }

        return this.schemas.find(c => c.Id == id);
    }

    async getSchemaByCode(code: string): Promise<ValidationSchema> {
        if (this.schemas == undefined){
            await this.loadSchemas();
        }

        return this.schemas.find(c => c.Code == code);
    }

    async getSchemaByName(name: string): Promise<ValidationSchema> {
        if (this.schemas == undefined){
            await this.loadSchemas();
        }

        return this.schemas.find(c => c.Name == name);
    }

    async getSchemas(): Promise<ValidationSchema[]> {
        if (this.schemas == undefined){
            await this.loadSchemas();
        }

        return this.schemas;
    }
}