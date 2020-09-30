import { BaseModel } from './base.model';


export interface SubmissionListModel extends BaseModel { 
    Name?: string,
    UserName?: string,
    CompanyName?:string
}

export class SurveyModel  { 
    Name?: string;
    Id: string;
    constructor(Id: string, Name: string){
        this.Id = Id;
        this.Name = Name;
    }
}