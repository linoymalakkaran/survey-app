import { Injectable } from '@angular/core';

export interface FormApp
{
    _id?:string;
    name?:string;
    description?:string;
    listform?:ListForm;
    serviceform?:ServiceForm;
}

export interface ServiceForm 
{
    schema?:any;
}

export interface ListForm extends ServiceForm
{
    searchfields?:searchfield[];
    enablepaging?:boolean
    pagesize?:number
}

export interface searchfield{
    filename:string;
    displayname:string;
    datatype:string;
}

export abstract class ServiceFormData
{
    protected abstract addNewForm(form:FormApp) : Promise<FormApp>;
    protected abstract updateForm(form:FormApp) : Promise<FormApp>;
    protected abstract getForms(fields?:any,query?:any) : Promise<FormApp[]>;
    protected abstract getFormById(id:string) : Promise<FormApp>; 
}