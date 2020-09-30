import { Moment } from 'moment';
import { BaseModel } from './base.model';
import { ValidationSchema } from './schema.model';

export interface FormModel extends BaseModel {
  Name?: string,
  Description: string,
  Type?: string,
  StartDate: Date,
  EndDate: Date,
  Schema: any,
  ValidationSchema?: ValidationSchema,
}

export interface FormListModel {
  Name: string;
  Type: string;
  Id: string;
  IsActive: boolean;
  CreatedDate: Date;
  StartDate: Date;
  EndDate: Date;
  Description: string;
  SurveyResponsesCount: Number;
}
