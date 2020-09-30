import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertModel } from '../../../@core/models/alert.model';
import { AlertService } from '../../../@core/services/common_services/alert.service';
import { OdataFormService } from '../../../@core/services/odata_services/odata.service.form';
import { Check } from '../../../@core/utils/check.utility';

import { GridOptions, Module, ClientSideRowModelModule } from "@ag-grid-community/all-modules";
import * as XLSX from 'xlsx';

import { ThemePalette } from '@angular/material/core';
import { FormBuilderAgGridActionComponent } from './forbuilder_grid_custom_components/formbuilder.grid.custom.component';
import * as moment from 'moment';
import { OdataAndRestCommonService } from '../../../@core/services/common_services/odata.service.common';
import { PartialMatchFilter } from './forbuilder_grid_custom_components/partial-match-filter-component';
import { GridUtils } from '../../../@core/utils/grid-utils';
import { FormListModel } from '../../../@core/models/form.model';
import { BootstrapAlert, BootstrapAlertService } from '../../../@shared/modules/ng-bootstrap-alert/ng-bootstrap-alert';
import $ from "jquery";

@Component({
  selector: 'survey-formbuilder',
  templateUrl: './formbuilder.component.html',
  styleUrls: ['./formbuilder.component.scss'],
})
export class ServiceFormBuilderComponent implements AfterViewInit {
  public forms: FormListModel[] = [];
  public searchTerm: string;
  public alert: AlertModel;
  public color: ThemePalette = 'primary';
  public surveyList: any[];
  public surveyGridOptions: GridOptions;
  surveyModules: Module[] = [ClientSideRowModelModule];//AllCommunityModules; //[ClientSideRowModelModule];;
  public surveyColDef;
  surveyReport: SurveyResponseModule.SurveyResponse[];
  fileName: string;
  surveyName: string;
  private gridApi;
  public newSurveyLabel: string = 'Create New Survey';
  public gridColMapping: {};

  constructor(
    private route: Router,
    private alertService: AlertService,
    private odataFormService: OdataFormService,
    private OdataAndRestCommonService: OdataAndRestCommonService,
    private bootstrapAlertService: BootstrapAlertService,
  ) {
    this.SetSurveyGridSettings();
    this.LoadForms();
  }

  SetSurveyGridSettings() {
    this.surveyGridOptions = <GridOptions>{
      pagination: true,
      paginationPageSize: 7,
      columnDefs: this.createColumnDefs(),
      onGridReady: (params) => {
        this.gridApi = params.api;
        //this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
        //this.surveyGridOptions.api.sizeColumnsToFit();
      },
      rowHeight: 48, // recommended row height for material design data grids,
      frameworkComponents: {
        PartialMatchFilter: PartialMatchFilter,
      },
      components: {
      },
      getRowNodeId: function(data) {
        return data.Id;
      }
    };
    this.surveyColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let $this = this;
      function tog(v) { return v ? 'addClass' : 'removeClass'; }
      $(".ag-header-row-floating-filter input").each(function() {
        $(this).addClass("clearable");
      });
      $(document).on('.ag-header-row-floating-filter input', '.clearable', function() {
        $(this)[tog(this.value)]('x');
      }).on('mousemove', '.x', function(e) {
        $(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
      }).on('touchstart click', '.onX', function(ev) {
        ev.preventDefault();
        $(this).removeClass('x onX').val('').change();
        let fieldNameFull = $(this).attr('aria-label');
        if (fieldNameFull) {
          let fieldNameArray = fieldNameFull.split(' ');
          fieldNameArray.splice(-2, 2);
          let fieldNameJoined = fieldNameArray.join(' ');
          let fieldName = $this.gridColMapping[fieldNameJoined];
          // Get a reference to the 'name' filter instance
          let filterInstance = $this.gridApi.getFilterInstance(fieldName);
          if (filterInstance) {
            // Set the model for the filter
            filterInstance.setModel({
              type: 'endsWith',
              filter: ''
            });
            // Tell grid to run filter operation again
            $this.gridApi.onFilterChanged();
          } else {
            $this.gridApi.setFilterModel(null);
          }
        } else {
          $this.gridApi.setFilterModel(null);
        }
      });
    }, 2000);
  }

  ResetAllGridFilters(){
    this.gridApi.setFilterModel(null);
  }

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SurveyReport');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  async DownloadAttachmentParentAction(params) {
    let $this = this;
    let response = await this.OdataAndRestCommonService.getSurveyReport(params.data.Id);
    if (!Check.isNull(response)) {
      this.surveyReport = response;
      if (this.surveyReport && Check.isArray(this.surveyReport)) {
        let currentDate = new Date();
        this.surveyName = this.surveyReport[0].SurveyName;
        this.fileName = this.surveyName + "_SurveyReport_" + currentDate + "_.XLSX";
        setTimeout(() => this.exportexcel(), 500);
      } else {
        $this.bootstrapAlertService.alert(new BootstrapAlert("Error while downloading the report!", "alert-danger"));
      }
    } else {
      $this.bootstrapAlertService.alert(new BootstrapAlert("Error while downloading the report!", "alert-danger"));
    }
  }

  private createColumnDefs() {
    this.gridColMapping = {
      "Survey Application": "Type",
      "Survey": "Name",
      "Created Date": "CreatedDate",
      "Start Date": "StartDate",
      "End Date": "EndDate",
    };
    return [
      {
        headerName: "Survey Application",
        field: 'Type',
        filter: 'agTextColumnFilter',
        comparator: GridUtils.customTextComparator.bind(this),
        filterParams: {
          filterOptions: ['contains', 'notContains'],
          textFormatter: GridUtils.textFormatter.bind(this),
          debounceMs: 0,
          suppressAndOrCondition: true,
        }
      },
      {
        headerName: "Survey",
        field: 'Name',
        filter: 'agTextColumnFilter',
        comparator: GridUtils.customTextComparator.bind(this),
        filterParams: {
          filterOptions: ['contains', 'notContains'],
          textFormatter: GridUtils.textFormatter.bind(this),
          debounceMs: 0,
          suppressAndOrCondition: true,
        }
      },
      {
        headerName: "Created Date",
        field: "CreatedDate",
        cellRenderer: (data) => {
          return moment(data.value).format('DD/MM/YYYY HH:mm')
        },
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: GridUtils.dateComparator.bind(this)
        }
      },
      {
        headerName: "Start Date",
        field: "StartDate",
        cellRenderer: (data) => {
          return moment(data.value).format('DD/MM/YYYY HH:mm')
        },
        // specify we want to use the date filter
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: GridUtils.dateComparator.bind(this)
        }
      },
      {
        headerName: "End Date",
        field: "EndDate",
        cellRenderer: (data) => {
          return moment(data.value).format('DD/MM/YYYY HH:mm')
        },
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: GridUtils.dateComparator.bind(this)
        }
      },
      {
        headerName: "Status",
        field: "IsActive",
        cellRenderer: function(params) {
          if (params.value == false) {
            return `<span title="Unpublished"><i class="fa fa-ban" style="color:red;"></i> UnPublished</span>`
          }
          else if (params.value == true) {
            var startdate = moment(params.data.StartDate);
            params.data.EndDate.setDate(params.data.EndDate.getDate() + 1);
            var enddate = moment(params.data.EndDate);
            var now = moment();
            if (now > startdate && now <= enddate) {
              return '<span title="Active"><i class="fa fa-check" style="color:green;"></i> Active</span>'
            }
            else if (now > enddate) {
              return '<span title="Expired"><i class="fa fa-flag-checkered" style="color:grey;"></i> Expired</span>'
            }
            else if (now < startdate) {
              return '<span title="Not Started"><i class="fa fa-clock-o" style="color:black;"></i> Not Started</span>'
            }
          }
        },
        filter: 'PartialMatchFilter',
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
          let nodeAVal = this.GetNodeStatusValue(nodeA.data);
          let nodeBVal = this.GetNodeStatusValue(nodeB.data);
          return +nodeAVal - +nodeBVal;
        }
        //menuTabs: ['filterMenuTab'],
      },
      {
        headerName: "Actions",
        field: "Id",
        cellRendererFramework: FormBuilderAgGridActionComponent,
        cellRendererParams: {
          downloadicon: 'fa fa-download',
          DownloadAttachmentParentAction: this.DownloadAttachmentParentAction.bind(this),
          suspendIcon: 'fa fa-power-off',
          SuspendFormParentAction: this.SuspendFormParentAction.bind(this),
          editFormIcon: 'fa fa-edit',
          EditFormParentAction: this.EditFormParentAction.bind(this),
          cloneIcon: 'fa fa-clone',
          CloneFormParentAction: this.CloneFormParentAction.bind(this)
        },
        width: 150,
        filter: false
      }
    ];
  }

  GetNodeStatusValue(params: any): Number {
    if (!params.IsActive) {
      return 3; //'Unpublished';
    }
    else if (params.IsActive) {
      var startdate = moment(params.StartDate);
      var enddate = moment(params.EndDate);
      var now = moment();
      if (now > startdate && now <= enddate) {
        return 0;//'Active';
      }
      else if (now > enddate) {
        return 1;//'Expired';
      }
      else if (now < startdate) {
        return 2;//'Not Started';
      }
    }
    return 0;//'Active';
  }

  CloneFormParentAction(id, rowData) {
    console.log(rowData);
    this.route.navigate(['/survey/survey-detail', { id: id, isclone: true }]);
  }

  EditFormParentAction() {
    this.bootstrapAlertService.alert(new BootstrapAlert("Active survey can't be edited!", "alert-warning"));
  }

  SuspendFormParentAction(formId: string, formObj: any, isSuccess: boolean) {
    if (isSuccess) {
      let rowNode = this.gridApi.getRowNode(formId);
      rowNode.setData(formObj);
      this.alert = this.alertService.raiseSuccess("Survey has been unpublished successfully");
    } else {
      this.alert = this.alertService.raiseErrors("There is an error occured while unpublishing the survey", null);
    }
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

  public addnewform() {
    this.route.navigate(['/survey/survey-detail']);
  }

  public filter() {
    if (this.searchTerm.length > 0) {
      this.LoadForms();
      this.forms = this.forms.filter(x =>
        x.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
        || x.Description.toLowerCase().includes(this.searchTerm));
    }
    else {
      this.LoadForms();
    }
  }

  private async openDetails(id: string) {
    this.route.navigate(['/survey/survey-detail', { id: id }]);
  }

  onCloseAlert() {
    this.alert = this.alertService.close();
  }

  private async LoadForms() {
    let _forms: FormListModel[] = await this.odataFormService.getFormList();
    if (!Check.isNull(_forms) && _forms.length > 0) {
      this.forms = [..._forms];
    } else {
      this.alert = this.alertService.raiseWarning("No data found from server.");
    }
  }
}





