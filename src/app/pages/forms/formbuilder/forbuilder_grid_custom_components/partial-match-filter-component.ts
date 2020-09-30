import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import {
  IAfterGuiAttachedParams,
  IDoesFilterPassParams,
  IFilterParams,
  RowNode,
} from '@ag-grid-community/all-modules';
import { IFilterAngularComp } from '@ag-grid-community/angular';
import * as moment from 'moment';

@Component({
  selector: 'filter-cell',
  template: `
    <div class="container">
      Survey status filter:
      <input
        #input
        (ngModelChange)="onChange($event)"
        [ngModel]="text"
        class="form-control"
      />
    </div>
  `,
  styles: [
    `
      .container {
        border: 2px solid #ffffff;
        border-radius: 5px;
        background-color: #edf1f7;
        width: 200px;
        height: 50px;
      }

      input {
        height: 20px;
      }
    `,
  ],
})
export class PartialMatchFilter implements IFilterAngularComp {
  private params: IFilterParams;
  private valueGetter: (rowNode: RowNode) => any;
  public text: string = '';

  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
  }

  isFilterActive(): boolean {
    return this.text != null && this.text !== '';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    let textToSearch: string = "";
    if (params.data.IsActive == false) {
      textToSearch = 'unpublished';
    }
    else if (params.data.IsActive == true) {
      var startdate = moment(params.data.StartDate);
      var enddate = moment(params.data.EndDate);
      var now = moment();
      if (now > startdate && now <= enddate) {
        textToSearch = 'active';
      }
      else if (now > enddate) {
        textToSearch = 'expired';
      }
      else if (now < startdate) {
        textToSearch = 'not started';
      }
    }
    return this.text
      .toLowerCase()
      .split(' ')
      .every(
        filterWord =>
             textToSearch
            .toString()
            .toLowerCase()
            .indexOf(filterWord) >= 0
      );
  }

  getModel(): any {
    return { value: this.text };
  }

  setModel(model: any): void {
    this.text = model ? model.value : '';
  }

  afterGuiAttached(params: IAfterGuiAttachedParams): void {
    window.setTimeout(() => this.input.element.nativeElement.focus());
  }

  // noinspection JSMethodCanBeStatic
  componentMethod(message: string): void {
    alert(`Alert from PartialMatchFilterComponent: ${message}`);
  }

  onChange(newValue): void {
    if (this.text !== newValue) {
      this.text = newValue;
      this.params.filterChangedCallback();
    }
  }
}
