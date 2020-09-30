
import { Injectable } from '@angular/core';
import { OdataService } from './odata.service';
import { OdataQuery } from 'odata';
import { FormListModel, FormModel } from '../../models/form.model';
import { MapperService } from '../common_services/mapper.service';
import { Check } from '../../utils/check.utility';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class OdataFormService {
  private readonly Model_Resource_Name: string = "Form";
  private readonly Model_Schema_Name: string = "Form";
  private readonly Model_Schema_Type: string = "extended";


  private forms: FormModel[]
  constructor(
    protected odataProvider: OdataService,
    protected mapperService: MapperService) {
  }

  async addNewForm(form: FormModel): Promise<FormModel> {
    form.StartDate.toJSON = function() { return moment(this).format(); }
    form.EndDate.toJSON = function() { return moment(this).format(); }
    let response = await this.odataProvider.postRest(this.Model_Resource_Name, form);
    let _item: FormModel = this.mapperService.mapEntitiesToModels<FormModel>(
      this.Model_Schema_Name,
      this.Model_Schema_Type,
      response)[0];

    this.forms.push(_item);
    return _item;
  }

  async updateForm(form: FormModel): Promise<FormModel> {
    form.StartDate.toJSON = function() { return moment(this).format(); }
    form.EndDate.toJSON = function() { return moment(this).format(); }
    let response = await this.odataProvider.putRest(this.Model_Resource_Name, form);
    let _item: FormModel = this.mapperService.mapEntitiesToModels<FormModel>(
      this.Model_Schema_Name,
      this.Model_Schema_Type,
      response)[0];
    _item.StartDate = new Date(_item.StartDate);
    _item.EndDate = new Date(_item.EndDate);
    return _item;
  }

  async getFormList(): Promise<FormListModel[]> {
    let formList: FormListModel[] = [];
    try {
      let _query: OdataQuery = {
        $select: 'Name,Type,Id,IsActive,CreatedDate,StartDate,EndDate,Description',
        $orderby: 'CreatedDate desc',
        //$filter:IsActive+eq+true
        $expand: 'SurveyResponses($count=true;$top=0)'
      }
      let response = await this.odataProvider.get(this.Model_Resource_Name, _query);
      if (Check.isNull(response)) {
        return formList;
      }
      formList = this.mapperService.fromJsonToFormListModel(response);
      return formList;
    } catch (error) {
      return formList;
    }
  }

  async getForms(): Promise<FormModel[]> {
    try {
      let _query: OdataQuery = {
        // $filter: `IsActive eq true`,
        $orderby: "CreatedDate desc",
        $expand: "ValidationSchema"
      }
      let response = await this.odataProvider.get(this.Model_Resource_Name, _query);
      if (Check.isNull(response)) {
        this.forms = [];
        return this.forms;
      }
      this.forms = this.mapperService.mapEntitiesToModels<FormModel>(
        this.Model_Schema_Name,
        this.Model_Schema_Type,
        response
      );
      this.forms.forEach(item => {
        item.StartDate = new Date(item.StartDate);
        item.EndDate = new Date(item.EndDate);
      });
      return this.forms;
    } catch (error) {
      return this.forms;
    }
  }

  async getFormById(id: any): Promise<FormModel> {
    let FormModelData: FormModel;
    //make filter query
    let query: OdataQuery = {
      $filter: `Id eq '${id}'`,
      $expand: "ValidationSchema"
    };

    let response = await this.odataProvider.get(this.Model_Resource_Name, query);
    if (Check.isNull(response)) {
      return FormModelData;
    }
    let _forms = this.mapperService.mapEntitiesToModels<FormModel>(
      this.Model_Schema_Name,
      this.Model_Schema_Type,
      response
    );
    _forms.forEach(item => {
      item.StartDate = new Date(item.StartDate);
      item.EndDate = new Date(item.EndDate);
    });
    return _forms[0];
  }

  //resource is coming from form dynamically
  async submitForm(resourceName: string, data: any): Promise<FormModel> {
    return new Promise(async (resolve, reject) => {
      await this.odataProvider.postRest(resourceName, data).then((response) => {
        let _models = this.mapperService.mapEntitiesToModels<FormModel>(
          this.Model_Schema_Name,
          this.Model_Schema_Type,
          response
        );
        resolve(_models[0]);
      })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  async deleteForm(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.odataProvider.delete(this.Model_Resource_Name, id).then((response) => {
        let _foundIndex = this.forms.findIndex(f => f.Id === id);
        this.forms.splice(_foundIndex, 1);
        resolve(response);
      })
        .catch((reason) => {
          reject(reason);
        });
    });
  }
}


