
import { Injectable } from '@angular/core';
import { OdataService } from './odata.service';
import { OdataQuery } from 'odata';
import { SubmissionListModel } from '../../models/submission-list.model';
import { MapperService } from '../common_services/mapper.service';
import { Check } from '../../utils/check.utility';

@Injectable({providedIn:'root'})
export class OdataSubmissionListService {
  private readonly Model_Resource_Name: string = "SurveyResponse";
  private readonly Model_Schema_Name: string = "form";
  private readonly Model_Schema_Type: string = "extended";


  private submissionslist: SubmissionListModel[]
  constructor(
    protected odataProvider: OdataService,
    protected mapperService: MapperService) {
  }

  async getSubmissions(): Promise<SubmissionListModel[]> {

    return new Promise(async (resolve, reject) => {
      if (!Check.isNullOrEmpty(this.submissionslist)) {
        return resolve(this.submissionslist);
      }
      let _query: OdataQuery = {
        // $filter: `IsActive eq true`,
        $expand: this.Model_Schema_Name,
        $orderby: "CreatedDate desc",
      }
      await this.odataProvider.get(this.Model_Resource_Name, _query).then((response) => {
        if (Check.isNull(response)) {
          return resolve([]);
        }
        this.submissionslist = this.mapperService.mapEntitiesToModels<SubmissionListModel>(
          this.Model_Schema_Name,
          this.Model_Schema_Type,
          response
        );
        resolve(this.submissionslist);
      })
        .catch(reason => {
          reject(reason);
        });
    });
  }
}


