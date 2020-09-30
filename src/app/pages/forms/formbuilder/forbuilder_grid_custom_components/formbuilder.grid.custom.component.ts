import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../../@core/services/common_services/alert.service';
import { OdataFormService } from '../../../../@core/services/odata_services/odata.service.form';
import { AlertModel } from '../../../../@core/models/alert.model';
import { Check } from '../../../../@core/utils/check.utility';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../../../@core/services/common_services/confirm.modal.service';
import * as moment from 'moment';
import { FormListModel } from '../../../../@core/models/form.model';

@Component({
  selector: 'formbuilder-grid-action-component',
  templateUrl: './formbuilder.grid.custom.component.html'
})
export class FormBuilderAgGridActionComponent implements OnInit {
  data: any;
  params: any;
  canEdit: boolean;
  canUnpublish: boolean;
  canDownloadSurveyResponse: boolean;
  form: FormListModel;
  public alert: AlertModel;
  modalRef: BsModalRef;

  constructor(private http: HttpClient, private router: Router,
    private alertService: AlertService,
    private modalService: BsModalService,
    private odataFormService: OdataFormService) { }

  agInit(params) {
    this.params = params;
    this.data = params.value;

    //action button conditions
    var startdate = moment(params.data.StartDate);
    var enddate = moment(params.data.EndDate);
    var now = moment();
    this.canEdit = params.data.IsActive && (now < startdate) ? true : false;
    this.canUnpublish = params.data.IsActive && (now < enddate) ? true : false;
    this.canDownloadSurveyResponse = params.data.SurveyResponsesCount > 0  ? true : false;
    
    if (Check.isNull(params.DownloadAttachmentParentAction)) {
      throw new Error('Missing action parameter for ActionCellRendererComponent');
    }
  }

  ngOnInit() { }

  private async openDetails(id: string) {
    if (id) {
      this.router.navigate(['/survey/survey-detail', id]);
    }
  }

  clone() {
    let rowData = this.params;
    this.params.CloneFormParentAction(rowData.value, rowData);
  }

  async suspendForm(formId: any) {
    if (this.form) {
      this.form.IsActive = false;
    }
    let _formDataById = await this.odataFormService.getFormById(formId);
    _formDataById.IsActive = false;
    this.odataFormService.updateForm(_formDataById).then((result: any) => {
      this.canUnpublish = false;
      this.params.SuspendFormParentAction(formId, this.form, true);
    })
      .catch(err => {
        this.params.SuspendFormParentAction(null, null, false);
      });
  }

  downloadReport() {
    this.params.DownloadAttachmentParentAction(this.params);
  }

  editForm() {
    this.form = this.params.data;
    let rowData = this.params;
    let i = rowData.rowIndex;
    if (this.form.IsActive) {
      var startDate = moment(rowData.data.StartDate);
      var endDate = moment(rowData.data.EndDate);
      var now = moment();
      let isActive: Boolean = false;
      if (now > startDate && now <= endDate) {
        isActive = true;
      }
      else if (now > endDate) {
        isActive = true; //'expired but not allowed to edit'
      }
      else if (now < startDate) {
        isActive = false; //'survey not started yet -- so it is editable'
      }
      if (isActive) {
        this.params.EditFormParentAction();
        return;
      }
    }
    this.openDetails(rowData ? rowData.value : '');
  }

  suspendFormClick() {
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: {
        prompt: 'Are you sure you want to unpublish this survey?',
        callback: (result) => {
          if (result == 'yes') {
            let rowData = this.params;
            this.form = this.params.data;
            console.log(rowData);
            this.suspendForm(rowData ? rowData.value : '');
          }
        }
      }
    });
  }

}