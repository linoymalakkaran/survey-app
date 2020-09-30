import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioUtils, FormBuilderComponent } from 'angular-formio';

import { NbWindowService } from '@nebular/theme';
import { OdataFormService } from '../../../@core/services/odata_services/odata.service.form';
import { FormModel } from '../../../@core/models/form.model';
import { AlertModel } from '../../../@core/models/alert.model';
import { AlertService } from '../../../@core/services/common_services/alert.service';
import { Check } from '../../../@core/utils/check.utility';
import { DateUtil } from '../../../@core/utils/date-util';
import { OdataAndRestCommonService } from '../../../@core/services/common_services/odata.service.common';
import { ApplicationTypesModel } from '../../../@core/models/application.types.model';
import { ThemePalette } from '@angular/material/core';

import { BootstrapAlert, BootstrapAlertService } from '../../../@shared/modules/ng-bootstrap-alert/ng-bootstrap-alert';
import $ from "jquery";

@Component({
  selector: 'survey-formbuilder',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class ServiceFormComponent implements OnInit {

  // @ViewChild('startDatePicker', { static: true }) startDatePicker: any;
  // @ViewChild('endDatePicker', { static: true }) endDatePicker: any;

  // public date: moment.Moment;
  // public disabled = false;
  // public showSpinners = true;
  // public showSeconds = false;
  // public touchUi = false;
  // public enableMeridian = false;
  public minDate: Date = new Date(); //moment.Moment;
  public maxDate: Date = new Date(new Date().getFullYear() + 50, 1, 30); //moment.Moment;
  public minSurveyEndDate: Date = new Date();
  // public minDate: moment.Moment =  moment(new Date()); //moment.Moment;
  // public maxDate:  moment.Moment = moment(new Date()); //moment.Moment;
  // public stepHour = 1;
  // public stepMinute = 1;
  // public stepSecond = 1;
  public color: ThemePalette = 'primary'; //accent

  public isActiveSurvey: boolean;
  public isClone: boolean = false;

  public forms: FormModel[];
  form: FormModel;
  schemaFields: any[];
  alert: AlertModel;
  formId: string;
  flaten: any;
  resourceName: string = "";
  formInstance: any;
  validForm: boolean = true;
  applicationTypes: ApplicationTypesModel[] = [];
  currentSurvey: ApplicationTypesModel = new ApplicationTypesModel("", "", false, "");
  @ViewChild('formbuilder', { static: true }) formBuilder: FormBuilderComponent;
  @ViewChild('previewTemplate', { static: true }) previewTemplate: TemplateRef<any>;
  @ViewChild('fullScreenTemplate', { static: true }) fullScreenTemplate: TemplateRef<any>;

  ngOnInit() {

  }

  constructor(
    private router: Router,
    private bootstrapAlertService: BootstrapAlertService,
    private alertService: AlertService,
    private odataFormService: OdataFormService,
    private OdataAndRestCommonService: OdataAndRestCommonService,
    private windowService: NbWindowService,
    private route: ActivatedRoute) {
    this.formId = this.route.snapshot.params.id;
    this.isClone = (this.route.snapshot.params.isclone == 'true');
    this.schemaFields = [];
    this.resourceName = "";
    this.form = {
      Name: "",
      ValidationSchema: {
        Name: "",
        Code: "",
        Type: "extended",
        Schema: {
          Fields: []
        }
      },
      Schema: {
        display: "form",
        components: []
      },
      StartDate: null,
      EndDate: null,
      Description: ''
    };
    this.LoadForm(this.formId);
    this.LoadForms();
    this.GetApplicationTypes();
  }

  async GetApplicationTypes() {
    this.applicationTypes = await this.OdataAndRestCommonService.getapplicationTypes();
    if (!this.isClone) {
      if (this.formId) {
        if (this.isClone) {
        } else {
          this.minSurveyEndDate = this.form.StartDate;
          let _currentFilteredSurvey = this.applicationTypes.filter((item) => item.Name == this.form.Type);
          if (_currentFilteredSurvey && _currentFilteredSurvey[0]) {
            this.currentSurvey = _currentFilteredSurvey[0];
          }
        }
      } else {
        this.form.Type = this.applicationTypes[0].Name;
      }
    }
  }

  showPreview() {
    this.windowService.open(this.previewTemplate,
      { title: this.form.Name + ' Preview', windowClass: 'window-height' });
    $("button.btn-wizard-nav-cancel").parent().css("display", "none");
  }

  onChangeTab(event) {
    if (event.tabTitle === "Form Schema") {
      let _formComponents = FormioUtils.flattenComponents(this.form.Schema.components, false);
      this.mapComponentsToFields(_formComponents);
    }
  }

  //on form change
  onChange(event) {
    if (event.type === "addComponent" ||
      event.type === "updateComponent" ||
      event.type === "deleteComponent") {
      this.form.Schema.components.forEach(element => {
        element.breadcrumb = "none"
      });
      let _formComponents = FormioUtils.flattenComponents(this.form.Schema.components, false);
      this.mapComponentsToFields(_formComponents);
    }
  }

  //popout form designer
  fullScreenEditor() {
    this.windowService.open(
      this.fullScreenTemplate,
      { title: 'Edit in full screen', windowClass: 'window-height' }
    )
      .onClose.subscribe((name: any) => {
        this.formBuilder.setDisplay(this.form.Schema.display);
      });
  }

  //for display mode
  setFormDisplay(event) {
    this.formBuilder.setDisplay(event);
  }

  checkAnyActiveSurveyOfSameTypeInBetweenScheduledInterval(errors: string[]): boolean {
    let isValid = true;
    //if (Check.isNull(this.formId) || this.isClone) {
    if (!Check.isNull(this.form.Type)) {
      let surveyFormsWithSameTypes = this.forms
        .filter(x => x.Type.toLocaleLowerCase() === this.form.Type.toLocaleLowerCase()
          && x.IsActive);

      if (this.form.Id)//edit mode
      {
        surveyFormsWithSameTypes = surveyFormsWithSameTypes
          .filter(({ Id }) => Id !== this.form.Id);
      }

      if (surveyFormsWithSameTypes && surveyFormsWithSameTypes.length > 0) {
        surveyFormsWithSameTypes.forEach(row => {
          isValid = isValid && !DateUtil.CheckIfDateRangeOverlaps(row.StartDate, row.EndDate, this.form.StartDate, this.form.EndDate);
          //isValid = isValid && !DateUtil.CheckIfOneDateIsBetweenTwoDates(this.form.StartDate, this.form.EndDate, row.StartDate);
          //isValid = isValid && !DateUtil.CheckIfOneDateIsBetweenTwoDates(this.form.StartDate, this.form.EndDate, row.EndDate);
        });
      }
    }
    //}
    if (!isValid) {
      errors.push("Survey's with same type can not be active on same time period, Please change the survey start and end date before saving the survey.");
    }
    return isValid;
  }

  GetCoutOfComponentsAndSubmitButton(childComponent, countObj) {
    if (childComponent.components === undefined) {
      if (childComponent.action === 'submit') {
        countObj.submitButtonCount += 1;
      } else if (childComponent.id) {
        countObj.componentsCount += 1;
      }
      return countObj;
    }
    childComponent.components.forEach(child => {
      return this.GetCoutOfComponentsAndSubmitButton(child, countObj);
    });
  }

  validateSurveyForm(errors) {
    this.validForm = (this.form && this.form.Name && this.form.Type && this.form.StartDate && this.form.EndDate) && this.form.Description ? true : false;
    this.validForm = (this.validForm && this.form && this.form.Schema && this.form.Schema.components) ? true : false;
    this.validForm = (this.validForm && this.checkAnyActiveSurveyOfSameTypeInBetweenScheduledInterval(errors));
    let countObj = {
      submitButtonCount: 0,
      componentsCount: 0
    };
    this.GetCoutOfComponentsAndSubmitButton(this.form.Schema, countObj);
    if (this.form.Schema.display === 'wizard' && countObj.submitButtonCount === 0) {
      countObj.submitButtonCount += 1;
    }
    console.log(countObj);
    if (countObj.submitButtonCount === 0) {
      errors.push(`Please configure submit button before saving the form.`);
      this.validForm = false;
    }
    if (countObj.componentsCount === 0) {
      this.validForm = false;
      errors.push(`Survey form is empty. Please configure atleast one survey question before saving the form.`);
    }
    this.getFormValidationErrorMsges(errors);
  }

  getFormValidationErrorMsges(errors) {
    let validationFields = ['Name', 'Type', 'StartDate', 'EndDate', 'Description'];
    validationFields.forEach(field => {
      if (Check.isNullOrEmpty(this.form[field])) {
        let fieldName = field;
        if (field === 'StartDate') {
          fieldName = 'Start Date';
        } else if (field === 'EndDate') {
          fieldName = 'End Date';
        }
        errors.push(`${fieldName} is Required.`);
      }
    });

    if (this.form.StartDate && this.form.EndDate) {
      //|| this.form.StartDate.valueOf() == this.form.EndDate.valueOf()
      if (this.form.StartDate > this.form.EndDate) {
        this.validForm = false;
        errors.push(`Survey Start date should be less than Survey End date.`);
      }
    }
  }

  surveyStartDateChange() {
    this.minSurveyEndDate = this.form.StartDate;
    if (this.form.StartDate > this.form.EndDate) {
      this.form.EndDate = null;
    }
  }

  async submit() {
    let errors: string[] = [];
    this.validForm = true;
    if (Check.isNull(this.formId)) {
      this.validateSurveyForm(errors);
      if (this.validForm) {
        await this.odataFormService.addNewForm(this.form).then((result) => {
          this.formId = result.Id;
          this.bootstrapAlertService.alert(new BootstrapAlert("Survey submitted successfully.", "alert-success"));
          // this.alert = this.alertService.raiseSuccess("Survey submitted successfully");
          this.router.navigate(['/survey/list']);
        })
          .catch(err => {
            this.alert = this.alertService.raiseErrors("There is an error occured while submitting the survey", err);
          });
      }
      else {
        this.alert = this.alertService.raiseErrors("Please enter all required fields", errors);
      }
    }
    else {
      this.validateSurveyForm(errors);
      if (this.validForm) {
        this.odataFormService.updateForm(this.form).then((result) => {
          this.bootstrapAlertService.alert(new BootstrapAlert("Survey edited successfully!", "alert-success"));
          //   this.alert = this.alertService.raiseSuccess("Survey edited successfully");
          this.router.navigate(['/survey/list']);
          //this.LoadForms();
        })
          .catch(err => {
            this.alert = this.alertService.raiseErrors("There is an error occured while updating the survey", err);
          });
      }
      else {
        this.alert = this.alertService.raiseErrors("Please enter all required fields", errors);
      }
    }
  }

  cancel() {
    this.router.navigate(['/survey/list']);
  }

  //submit form data from preview mode
  onSubmit(submission: any) {
    console.log(submission);
    if (!Check.isNull(this.formInstance)) {
      this.formInstance.emit('');
      this.formInstance.emit('submitDone')
    }
  }

  publishAndUnPublishForm() {
    this.form.IsActive = false;
    this.odataFormService.updateForm(this.form).then((result: any) => {
      this.alert = this.alertService.raiseSuccess("Form suspended successfully");
      this.router.navigate(['/survey/list']);
    })
      .catch(err => {
        this.alert = this.alertService.raiseErrors("There is an error occured while suspending the form", err);
      });
  }

  //get form instance
  onReady(event) {
    this.formInstance = event.formio;
  }

  private async LoadForms() {
    let _forms = await this.odataFormService.getForms();
    if (!Check.isNull(_forms)) {
      this.forms = [..._forms];
    }
  }

  private getClrType(type: string) {
    switch (type) {
      case "text":
        return "string";
      case "number":
        return "int";
      case "checkbox":
        return "boolean";
      case "radio":
        return "boolean";
      case "select":
        return "string";
      case "date":
        return "datetime";
      default:
        return "string";

    }
  }

  private async LoadForm(id: string) {
    if (this.formId != undefined) {
      this.form = await this.odataFormService.getFormById(id);
      if (this.isClone) {
        this.form.Id = null;
        this.formId = null;
        this.form.StartDate = null;
        this.form.EndDate = null;
      }

      this.isActiveSurvey = this.form.IsActive;
      if (Check.isNull(this.form.ValidationSchema)) {
        this.form.ValidationSchema = {
          Schema: {
            Fields: []
          }
        };
      }
      if (this.form.ValidationSchema.Schema && this.form.ValidationSchema.Schema.Fields) {
        this.schemaFields = this.form.ValidationSchema.Schema.Fields;
      }
    }
  }

  private mapComponentsToFields(components: any[]) {
    //map components to validation schema fileds
    if (!Check.isNull(components)) {
      let _keys = Object.keys(components);
      this.schemaFields = [];
      _keys.forEach(mKey => {
        let _field = components[mKey];
        if (_field.inputType !== "submit" &&
          _field.inputType !== "button") {
          this.schemaFields.push({
            inputType: _field.type,
            Label: _field.label,
            Name: _field.key,
            ClrType: this.getClrType(_field.inputType),
            Path: _field.key,
            MaxLength: _field.validate.maxLength,
            Required: _field.validate.required,
            ValidationRegx: _field.validate.pattern
          });
        }
      });
    }
    if (this.form.ValidationSchema.Schema) {
      this.form.ValidationSchema.Schema.Fields = this.schemaFields;
    }
    return this.schemaFields;
  }

}

