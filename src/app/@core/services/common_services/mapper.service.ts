import { Injectable } from '@angular/core';
import { Check } from '../../utils/check.utility';
import { BaseModel } from '../../models/base.model';
import { ValidationSchema } from '../../models/schema.model';
import { OdataSchemaService } from '../odata_services/odata.service.schema';
import { FormListModel } from '../../models/form.model';

@Injectable({providedIn: 'root'})
export class MapperService {
  private readonly Extended_Schema_Type: string = "extended";
  private readonly Dynamic_Field_Name: string = "EntityData";
  private readonly Model_Default_Top_Level_Fields: string[] = [
    'Id', 'IsActive', 'CreatedBy', 'CreatedDate', 'UpdatedBy', 'UpdatedDate', 'EntityData'
  ];
  protected schemas: ValidationSchema[];
  protected stringConstructor: any = "text".constructor;
  protected arrayConstructor: any = [].constructor;
  protected objectConstructor: any = ({}).constructor;
  constructor(
    private odataSchemaService: OdataSchemaService,
    loadAllSchemas: boolean = true) {
    if (loadAllSchemas) {
      this.loadSchemas();
    }
  }

  public mapForGrid(data: any): any[] {
    let _records = [];
    if (Array.isArray(data)) {
      _records = data;
    } else {
      _records.push(data);
    }

    let _modelItem = _records[0];
    let _keys = Object.keys(_modelItem);
    let _items = _records.map(row => {
      let _item: any = {};
      _keys.forEach(key => {
        let _value = row[key];
        if (!Array.isArray(_value) &&
          !(_value instanceof Object)) {
          _item[key] = _value;
        }
      });
      return _item;
    });
    return _items;
  }

  public mapForNbGrid(data: any): any[] {
    let _records = this.mapForGrid(data);
    let _nbGridRecords = _records.map(row => {
      return {
        data: row
      };
    });
    return _nbGridRecords;
  }

  public getGridColumns(model: any): any[] {
    let _item = {};
    let _columns = [];
    if (Array.isArray(model)) {
      _item = model[0];
    } else {
      _item = model;
    }

    let _keys = Object.keys(_item);
    _keys.forEach(key => {
      let _value = _item[key];
      if (!Array.isArray(_value) &&
        !(_value instanceof Object)) {
        _columns.push(key);
      }
    });
    return _columns;
  }

  public mapModelToEntity(
    schemaName: string,
    model: any): any {

    //check model
    if (model === undefined ||
      model === null) {
      return null;
    }

    //get entity schema
    let _entitySchema: ValidationSchema = this.getEntitySchema(schemaName);
    if (_entitySchema === undefined ||
      _entitySchema === null) {
      console.log(`there is no schema available to validate entity (${schemaName})`);
      return model;
    }

    //get entity schema fields
    let _schemaFields = _entitySchema.Schema.Fields;
    //get model keys
    let _dynamicFieldName = this.Dynamic_Field_Name;
    var _modelKeys = Object.keys(model);
    //validate model keys
    if (_modelKeys === undefined ||
      _modelKeys === null ||
      _modelKeys.length === 0) {
      //model is empty object
      return null;
    }

    //create entity object
    let _entity = {};
    //initialize entity dynamic property
    _entity[_dynamicFieldName] = {};

    //map top level model properties to entity properties
    _modelKeys.forEach(mKey => {
      if (mKey !== _dynamicFieldName && mKey !== "submit") {
        let _field = _schemaFields.find(k => k.Name === mKey &&
          (k.Path === null ||
            k.Path === "" ||
            k.Path === mKey));
        let _fieldValue = model[mKey];

        //incase of known schema field
        let _isSchemaField = _field !== undefined && _field !== null;
        if (_isSchemaField) {
          _entity[mKey] = _fieldValue;
        }

        //add additional property to dynamic list
        else if (_entitySchema.Type === this.Extended_Schema_Type &&
          !Array.isArray(_fieldValue) &&
          !(_fieldValue instanceof Object)) {
          _entity[_dynamicFieldName][mKey] = _fieldValue;
        }
      }
    });

    //validate model dynamic property
    if (_modelKeys.indexOf(_dynamicFieldName) < 0) {
      //dynamic property not found
      return _entity;
    }

    //get model dynamic property keys
    let _modelDynamicKeys = Object.keys(model[_dynamicFieldName]);
    //validate model dynamic keys
    if (_modelDynamicKeys === undefined ||
      _modelDynamicKeys === null ||
      _modelDynamicKeys.length === 0) {
      //empty dynammic model object
      //return entity with top level properties
      return _entity;
    }

    //map model dynamic properties to entity dynamic properties
    _modelDynamicKeys.forEach(mKey => {
      let _field = _schemaFields.find(k => k.Path !== "" &&
        k.Path !== null &&
        k.Name === mKey);
      let _fieldValue = model[_dynamicFieldName][mKey];
      //incase of known schema field
      let _isSchemaField = _field !== undefined && _field !== null;
      if (_isSchemaField) {
        _entity[_dynamicFieldName][mKey] = _fieldValue;
      }

      //if extended mode enabled
      else if (_entitySchema.Type === this.Extended_Schema_Type) {
        _entity[_dynamicFieldName][mKey] = _fieldValue;
      }
    });

    //return mapped entity object
    return _entity;
  }

  public fromJsonToFormListModel(formListObj): FormListModel[] {
    const formListModelClass: FormListModel[] = [];
    formListObj.forEach(obj => {
      formListModelClass.push({
        Name: obj.Name,
        Type: obj.Type,
        Id: obj.Id,
        IsActive: obj.IsActive,
        CreatedDate: new Date(obj.CreatedDate),
        StartDate: new Date(obj.StartDate),
        EndDate: new Date(obj.EndDate),
        Description: obj.Description,
        SurveyResponsesCount: obj['SurveyResponses@odata.count'],
      });
    });

    return formListModelClass;
  }

  public mapEntitiesToModels<T extends BaseModel>(schemaName: string, schemaTpe: string, data: any): T[] {
    let _records = [];
    let _results = [];
    if (Check.isNull(data)) {
      return data;
    }
    if (Check.isArray(data)) {
      _records = data;
    } else {
      _records.push(data);
    }
    //odata based  entites
    if (!this.hasDynamicField(_records)) {
      return _records;
    }
    // map rest to odata entity
    let _keys = Object.keys(_records[0]);
    _records.forEach(entity => {
      let _model = {};
      //map root fields
      _keys.forEach(eKey => {
        if (eKey !== this.Dynamic_Field_Name) {
          _model[eKey] = entity[eKey];
        }
      });

      //map dynamic fields
      let _dynamicFieldValue = entity[this.Dynamic_Field_Name];
      if (!Check.isNull(_dynamicFieldValue)) {
        let _dKeys = Object.keys(_dynamicFieldValue);
        if (!Check.isNull(_dKeys)) {
          _dKeys.forEach(eKey => {
            _model[eKey] = _dynamicFieldValue[eKey];
          });
        }
      }
      _results.push(_model as T);
    });

    return _results;
  }



  private hasDynamicField(item: any): boolean {

    if (Check.isNull(item)) {
      return false;
    }

    if (Check.isArray(item) &&
      item.length > 0) {
      return Object.keys(item[0]).indexOf(this.Dynamic_Field_Name) >= 0;
    }
    return Object.keys(item).indexOf(this.Dynamic_Field_Name) >= 0;
  }

  private getEntitySchema(schemaName: string): ValidationSchema {
    //get entity schema
    if (this.schemas === undefined ||
      this.schemas === null) {
      this.loadSchemas();
    }
    return this.schemas.find(e => e.Name === schemaName || e.Code === schemaName);
  }

  private loadSchemas() {
    this.odataSchemaService.getSchemas().then(result => {
      this.schemas = result;
    });
  }

}
