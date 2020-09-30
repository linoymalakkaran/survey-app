/**
 * This file shows how to create a custom component.
 *
 * Get the base component class by referencing Formio.Components.components map.
 */
import { Components } from 'formiojs';
const FieldComponent = (Components as any).components.field;
import editForm from './StarRating.form';

/**
 * Here we will derive from the base component which all Form.io form components derive from.
 *
 * @param component
 * @param options
 * @param data
 * @constructor
 */
export default class StarRating extends (FieldComponent as any) {
  public checks: Array<Array<any>>;
  public componentId: string;
  public componentData: any;
  private static numRows: Number = 1;
  private static numCols: Number = 10;

  public labelTitles: string[] = [
    '5 stars',
    '4.5 stars',
    '4 stars',
    '3.5 stars',
    '3 stars',
    '2.5 stars',
    '2 stars',
    '1.5 stars',
    '1 star',
    '0.5 stars'];

  public textVal: string[] = ['5', '4 and a half', '4', '3 and a half', '3',
    '2 and a half', '2', '1 and a half', '1', 'half'];

  constructor(component, options, data) {
    super(component, options, data);
    this.checks = [];
    this.component.validate.required = this.component.validate.required;
  }


  init() {
    super.init();
    this.component.validate.required = this.component.validate.required;
    this.component.inputType = 'starrating';
  }

  static schema() {
    return FieldComponent.schema({
      type: 'starrating',
      label: 'Star Rating',
      numRows: this.numRows,
      numCols: this.numCols
    });
  }

  public static editForm = editForm;

  static builderInfo = {
    title: 'Star Rating',
    group: 'basic',
    icon: 'fa fa-star',
    weight: 70,
    documentation: 'http://help.form.io/userguide/#table',
    schema: StarRating.schema()
  }

  tableClass(componentId: string) {
    let tableClass = `rating-wrapper-${componentId}`;
    return tableClass;
  }

  renderCell(row, col, componentId, val) {
    return this.renderTemplate('input', {
      input: {
        type: 'input',
        ref: `${this.componentId}-${row}`,
        attr: {
          id: `star-${row}-${col}-${componentId}`,
          class: `star-radio-${componentId}`,
          name: `rating-${componentId}`,
          type: 'radio',
          value: `${this.textVal[col]}`
        }
      }
    });
  }

  renderCellLabel(row, col, componentId) {
    let className = (col % 2 == 0) ? 'full' : 'half';
    return `<label 
              for="star-${row}-${col}-${componentId}"
              class="${className}-${componentId}"
              title="${this.labelTitles[col]}"
              ></label>`;
  }

  setComponentUniqueId(componentId: string) {
    this.componentId = componentId;
  }

  public render(children) {
    return super.render(this.renderTemplate('starrating', {
      tableClass: this.tableClass.bind(this),
      renderCell: this.renderCell.bind(this),
      renderCellLabel: this.renderCellLabel.bind(this),
      setComponentUniqueId: this.setComponentUniqueId.bind(this),
    }));
  }

  /**
   * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
   * elements to attach functionality to.
   *
   * @param element
   * @returns {Promise}
   */
  attach(element) {
    const refs = {};

    for (let i = 0; i < this.component.numRows; i++) {
      refs[`${this.componentId}-${i}`] = 'multiple';
    }
    this.loadRefs(element, refs);

    // to pre populate star rating value on multi page forms
    if (this.componentData) {
      this.getSelectedStarRating(this.componentData);
    }

    this.checks = [];
    for (let i = 0; i < this.component.numRows; i++) {
      this.checks[i] = Array.prototype.slice.call(this.refs[`${this.componentId}-${i}`], 0);

      // Attach click events to each input in the row
      this.checks[i].forEach(input => {
        this.addEventListener(input, 'click', () => this.updateValue())
      });
    }

    // Allow basic component functionality to attach like field logic and tooltips.
    return super.attach(element);
  }

  /**
 * Only empty if the values are all false.
 *
 * @param value
 * @return {boolean}
 */
  isEmpty(value = this.dataValue) {
    let empty = true;
    let count = 0;
    if (this.componentData) {
      count = Object.keys(this.componentData[0]).reduce((total, key) => {
        if (this.validationValue.arrval[0][key]) {
          total++;
        }
        return total;
      }, 0);
    }

    return count == 0 ? empty : false;
  }


  /**
   * Get the value of the component from the dom elements.
   *
   * @returns {Array}
   */
  getValue() {
    var value = [];
    let selectedStarRatingVal = null;
    for (var rowIndex in this.checks) {
      var row = this.checks[rowIndex];
      value[rowIndex] = [];
      for (var colIndex in row) {
        var col = row[colIndex];
        value[rowIndex][colIndex] = !!col.checked;
        if (value[rowIndex][colIndex]) {
          selectedStarRatingVal = this.labelTitles[colIndex];
        }
      }
    }
    this.getSelectedStarRating(value);
    let transformedVal = {
      arrval: value,
      selectedStarRatingVal: selectedStarRatingVal
    };
    return transformedVal;
  }

  getSelectedStarRating(value) {
    if (value) {
      document.querySelectorAll(`.star-radio-${this.componentId}`).forEach((elem) => {
        (<HTMLInputElement>elem).checked = false;
      });
      let idName: string = '';
      for (var i = 0; i < StarRating.numRows; i++) {
        for (var j = 0; j < StarRating.numCols; j++) {
          if (value[i][j]) {
            idName = `star-${i}-${j}-${this.componentId}`;
          }
        }
      }
      let electedElem = document.getElementById(idName);
      this.componentData = value;
      if (electedElem) {
        (<HTMLInputElement>electedElem).checked = true;
      }
    }
    if (this.options.readOnly) {
      setTimeout(()=>{
        const starRatingDivs = document.getElementById(`star-rating-wrapper-id-${this.componentId}`);
        starRatingDivs.style.pointerEvents = 'none';
      },1000);
    }
  }

  /**
   * Set the value of the component into the dom elements.
   *
   * @param value
   * @returns {boolean}
   */
  setValue(transValue) {
    if (!transValue) {
      this.componentData = null;
      document.querySelectorAll(`.star-radio-${this.componentId}`).forEach((elem) => {
        (<HTMLInputElement>elem).checked = false;
      });
      return;
    }

    let value = transValue.arrval;
    this.componentData = value;
    this.getSelectedStarRating(value);
    for (var rowIndex in this.checks) {
      var row = this.checks[rowIndex];
      if (!value[rowIndex]) {
        break;
      }
      for (var colIndex in row) {
        var col = row[colIndex];
        if (!value[rowIndex][colIndex]) {
          return false;
        }
        let checked = value[rowIndex][colIndex] ? 1 : 0;
        col.value = checked;
        col.checked = checked;
      }
    }
  }

}
