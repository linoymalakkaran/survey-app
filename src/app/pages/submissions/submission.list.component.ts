import { Component, ViewChild, TemplateRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AlertModel } from '../../@core/models/alert.model';
import { AlertService } from '../../@core/services/common_services/alert.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { GridOptions } from "@ag-grid-community/all-modules";
import { OdataSubmissionListService } from '../../@core/services/odata_services/odata.service.submission-list';
import { GridUtils } from '../../@core/utils/grid-utils';
import { OdataAndRestCommonService } from '../../@core/services/common_services/odata.service.common';
import { ApplicationTypesModel } from '../../@core/models/application.types.model';
import { KeyValuePairModel } from '../../@core/models/key-value-pair.model';
import $ from "jquery";

@Component({
  selector: 'survey-submissions',
  templateUrl: './submission.list.component.html',
  styleUrls: ['./submission.list.component.scss'],
  //encapsulation: ViewEncapsulation.ShadowDom
})

export class SubmissionListComponent implements AfterViewInit {
  searchModel: any = {
    surveyName: '',
    applicationType: ''
  };
  submissionList: any;
  submissionOrginalList: any;
  SubmissionResult: any;
  alert: AlertModel;
  SearchValue: string = "";
  formId: string;
  schemaFields = [];
  error = [];
  surveyTemplate: any;
  surveyData: any;
  closeResult = '';
  public defaultColDef;
  public gridOptions: GridOptions;
  public applicationTypes: ApplicationTypesModel[] = [];
  public surveyNames: KeyValuePairModel[] = [];
  private gridApi;
  private gridColumnApi;

  @ViewChild("content") modalContent: TemplateRef<any>;
  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private odataSubmissionListService: OdataSubmissionListService,
    private OdataAndRestCommonService: OdataAndRestCommonService,
  ) {

    this.gridOptions = <GridOptions>{
      rowHeight: 48,
      pagination: true,
      paginationPageSize: 7,
      frameworkComponents: {
      },
      onGridReady: (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
        //this.surveyGridOptions.api.sizeColumnsToFit();
      },
    };

    this.loadSurvey();
    this.defaultColDef = {
      flex: 1,
      sortable: true,
      filter: true,
      floatingFilter: true,
      pagination: true,
      resize: true
    };

    this.searchModel.applicationType = '-1';
    this.searchModel.surveyName = '-1';
  }

  resetFilter() {
    this.searchModel.applicationType = '-1';
    this.surveyNames = [];
    this.surveyNames.push(new KeyValuePairModel('-1', '--- Please select survey name ---'));
    this.searchModel.surveyName = '-1';
    this.gridApi.setRowData([...this.submissionOrginalList]);
  }

  filterGrid() {
    let newData = [...this.submissionOrginalList];
    if (this.searchModel.applicationType != '-1') {
      newData = newData.filter(item => {
        return item.Form.Type.toLowerCase() === this.searchModel.applicationType.toLowerCase();
      });
    }
    if (this.searchModel.surveyName != '-1' && this.searchModel.surveyName != '-2' ) {
      newData = newData.filter(item => {
        return item.Form.Name.toLowerCase() === this.searchModel.surveyName.toLowerCase();
      });
    }
    this.gridApi.setRowData(newData);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let $this = this;
      function tog(v) { return v ? 'addClass' : 'removeClass'; }
      $(".ag-header-row-floating-filter input").each(function () {
        $(this).addClass("clearable");
      });
      $(document).on('.ag-header-row-floating-filter input', '.clearable', function () {
        $(this)[tog(this.value)]('x');
      }).on('mousemove', '.x', function (e) {
        $(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
      }).on('touchstart click', '.onX', function (ev) {
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

  gridColMapping = {
    "Application Name": "Form.Type",
    "Survey Name": "Form.Name",
    "Company Name": "CompanyName",
    "User Name": "UserName",
    "Submitted Date": "CreatedDate",
  };

  columnDefs = [
    {
      headerName: 'Application Name',
      field: 'Form.Type',
      comparator: GridUtils.customTextComparator.bind(this),
      filter: true
    },
    {
      headerName: 'Survey Name',
      field: 'Form.Name',
      comparator: GridUtils.customTextComparator.bind(this),
      filter: true
    },
    {
      headerName: 'Company Name',
      field: 'CompanyName',
      comparator: GridUtils.customTextComparator.bind(this),
      filter: true
    },
    {
      headerName: 'User Name',
      field: 'UserName',
      comparator: GridUtils.customTextComparator.bind(this),
      filter: true
    },
    {
      headerName: 'Submitted Date',
      field: 'CreatedDate',
      sortable: true,
      cellRenderer: (data) => {
        return moment(data.value).format('DD/MM/YYYY HH:mm')
      },
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: GridUtils.dateComparator.bind(this)
      }
    },
    {
      headerName: 'Action',
      field: 'Form.FormId',
      filter: false,
      cellRenderer: (params) => {
        var eDiv = document.createElement('div');
        eDiv.classList.add('div-center');
        eDiv.innerHTML = '<span><a title="View Details" class="inlineBtn"><i class="fa fa-eye"></i> View</a></span>';
        var eButton = eDiv.querySelectorAll('.inlineBtn')[0];
        eButton.addEventListener('click', this.showSubmissionList.bind(this, params));
        return eDiv;
      }
    }
  ];

  showSubmissionList(args: any) {
    if (args && args.data) {
      this.surveyTemplate = args.data.Form ? args.data.Form.Schema : {};
      this.surveyData = args.data;
      debugger;
      if (this.surveyTemplate && this.surveyData)
        this.modalService.open(this.modalContent, { size: 'lg', backdrop: 'static' }).result.then((result) => {
        });
    }
  }

  async loadSurvey() {
    await this.odataSubmissionListService.getSubmissions().then((result) => {
      if (result.length > 0) {
        this.submissionList = result;
        this.submissionOrginalList = [...result];
        this.setPageDropDown();
      }
      else {
        this.alert = this.alertService.raiseWarning("No data found from server.");
      }
    })
      .catch(err => {
        this.alert = this.alertService.raiseErrors("There is an error occured while getting data.", err);
      });
  }

  async setPageDropDown() {
    this.applicationTypes.push(new ApplicationTypesModel('-1', '--- Please select application name ---', true, ""));
    let applicationTypes = await this.OdataAndRestCommonService.getapplicationTypes();
    applicationTypes.map((item) => item.Id = item.Name);
    this.applicationTypes = this.applicationTypes.concat(applicationTypes);
    this.searchModel.applicationType = '-1';
    this.surveyNames.push(new KeyValuePairModel('-1', '--- Please select survey name ---'));
    this.searchModel.surveyName = '-1';
    //this.onSelectApplicationTypeFilter('-1');
  }

  onSelectApplicationTypeFilter(selectedValue) {
    if (this.submissionOrginalList && this.submissionOrginalList.length > 0) {
      this.SubmissionResult = this.submissionOrginalList.filter((item) => item.Form.Type == selectedValue);
      const surveyNames = [...new Set(this.SubmissionResult.map(item => item.Form.Name))];
      this.surveyNames = [];
      if (this.SubmissionResult.length > 0) {
        this.surveyNames.push(new KeyValuePairModel('-1', '--- Please select survey name ---'));
        surveyNames.forEach(item => {
          this.surveyNames.push(new KeyValuePairModel(item.toString(), item.toString()));
        });
        this.searchModel.surveyName = '-1';
        //this.surveyNames.splice(0, 1);
      } else {
        this.surveyNames.push(new KeyValuePairModel('-2', 'No records found.'));
        this.searchModel.surveyName = '-2';
      }
    }
  }

  /////// Modal
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
