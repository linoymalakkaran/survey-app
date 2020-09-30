
import { Injectable } from '@angular/core';
import { OdataService } from '../odata_services/odata.service';
import { ApplicationTypesModel } from '../../models/application.types.model';
import { MapperService } from './mapper.service';
import { OdataQuery } from 'odata';
import { RestProvider } from '../rest_services/rest.service';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class OdataAndRestCommonService {
  private readonly application_type_resource_name: string = "form/GetApplicationTypes";
  private readonly survey_resource_url: string = "SurveyResponse/GetSurveyReport";

  private applicationTypes: ApplicationTypesModel[] = [];
  constructor(
    protected odataProvider: OdataService,
    protected mapperService: MapperService,
    protected restProvider: RestProvider) {
  }

  async getapplicationTypes(): Promise<ApplicationTypesModel[]> {
    let _query: OdataQuery = {
      $filter: `IsActive eq true`,
    }
    let result: ApplicationTypesModel[] = await this.odataProvider
      .get(this.application_type_resource_name, _query);
    if (result && result.length > 0) {
      this.applicationTypes = result.map((item) => {
        return new ApplicationTypesModel(item.Id, item.Name, item.IsActive, item.SecretKey);
      });
    }
    return this.applicationTypes;
  }

  async getSurveyReport(surveyId: string):Promise<SurveyResponseModule.SurveyResponse[]> {
    let params = {
      surveyId: surveyId,
    }
   return await this.restProvider.get(this.survey_resource_url, params);
  }

}


