import { BaseModel } from './base.model';

export interface ValidationSchema extends BaseModel {
    Code?: string,
    Name?: string,
    Type?: string,
    Schema?: any 
}