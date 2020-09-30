/**
 * This file shows how to create a custom component.
 *
 * Get the base component class by referencing Formio.Components.components map.
 */
import { Components } from 'formiojs';
const FieldComponent = (Components as any).components.field;
import editForm from './HappinessSurvey.form';

/**
 * Here we will derive from the base component which all Form.io form components derive from.
 *
 * @param component
 * @param options
 * @param data
 * @constructor
 */
export default class HappinessSurvey extends (FieldComponent as any) {
  public checks: Array<Array<any>>;
  public componentId: string;
  public componentData: any;
  private static numRows: Number = 1;
  private static numCols: Number = 4;
  public labelTitles: string[] = [
    "Extremely Satisfied", "Satisfied", "Neutral", "Unsatisfied"
  ];

  constructor(component, options, data) {
    super(component, options, data);
    this.checks = [];
    this.component.validate.required = this.component.validate.required;
    //this.validators = this.validators.concat('minSelectedCount');
  }

  init() {
    super.init();
    this.component.validate.required = this.component.validate.required;
    this.component.inputType = 'happinesssurvey';
  }

  static schema() {
    return FieldComponent.schema({
      type: 'happinesssurvey',
      numRows: this.numRows,
      numCols: this.numCols,
      label: "Happiness Index"
    });
  }

  public static editForm = editForm;

  static builderInfo = {
    title: 'Happiness Survey',
    group: 'basic',
    icon: 'fa fa-smile-o',
    weight: 70,
    documentation: 'http://help.form.io/userguide/#table',
    schema: HappinessSurvey.schema()
  }

  get tableClass() {
    let tableClass = 'table borderless';
    return tableClass;
  }

  renderCell(row, col, componentId) {
    return this.renderTemplate('input', {
      input: {
        type: 'input',
        ref: `${componentId}-${row}`,
        attr: {
          id: `happiness-input-${row}-${col}-${componentId}`,
          class: `happiness-input-${componentId}`,
          name: `happiness-input-1-${componentId}`,
          type: 'radio',
        }
      }
    });
  }

  renderTextBoxCell(idName, componentId) {
    return this.renderTemplate('input', {
      input: {
        type: 'input',
        ref: `${componentId}-${idName}`,
        attr: {
          id: `${componentId}-${idName}`,
          class: `${componentId}-${idName}`,
          name: `${componentId}-${idName}`,
          type: 'text',
          style: `color: #f3bf04;
          width: 275px;
          padding: 11px;
          background-color: #FFFF;
          border: 0px none;
          font-size: 1.3em;`,
          disabled: true,
        }
      }
    });
  }

  setComponentUniqueId(componentId: string) {
    this.componentId = componentId;
  }

  renderCellLabel(row, col, componentId) {
    return `<label 
              id="label-happiness-input-${row}-${col}-${componentId}" 
              for="happiness-input-${row}-${col}-${componentId}" 
              class="happiness-emoji-${componentId} 
              happiness-emoji-common-${componentId} 
              happiness-emoji-${row}-${col}-${componentId}"
              title="${this.labelTitles[col]}" >
            </label>`;
  }

  public render(children) {
    return super.render(this.renderTemplate('happinesssurvey', {
      tableClass: this.tableClass,
      renderCell: this.renderCell.bind(this),
      renderTextBoxCell: this.renderTextBoxCell.bind(this),
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
    this.getSelectedHappiness(this.componentData);

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


  // checkComponentValidity(data, dirty, rowData) {
  //   const minCount = 1;//this.validator.validators.minSelectedCount; //this.component.validate.minSelectedCount;

  //   if (minCount && !this.isValid(data, dirty)) {
  //     const count = Object.keys(this.componentData[0]).reduce((total, key) => {
  //       if (this.validationValue[0][key]) {
  //         total++;
  //       }
  //       return total;
  //     }, 0);

  //     if (minCount && count < minCount) {
  //       const message = `Please select at least ${minCount} Happiness Icon.`;

  //       this.setCustomValidity(message, dirty);
  //       return false;
  //     }
  //   }

  //   return super.checkComponentValidity(data, dirty, rowData);
  // }
  /**
   * Get the value of the component from the dom elements.
   *
   * @returns {Array}
   */
  getValue() {
    var value = [];
    let selectedHappinessVal = null;
    for (var rowIndex in this.checks) {
      var row = this.checks[rowIndex];
      value[rowIndex] = [];
      for (var colIndex in row) {
        var col = row[colIndex];
        value[rowIndex][colIndex] = !!col.checked;
        if (value[rowIndex][colIndex]) {
          selectedHappinessVal = this.labelTitles[colIndex];
        }
      }
    }
    this.getSelectedHappiness(value);
    let transformedVal = {
      arrval: value,
      selectedHappinessVal: selectedHappinessVal
    };
    return transformedVal;
  }

  getSelectedHappiness(value) {
    if (value) {
      document.querySelectorAll(`.happiness-input-${this.componentId}`).forEach((elem) => {
        (<HTMLInputElement>elem).checked = false;
      });
      let idName: string = '';
      for (var i = 0; i < HappinessSurvey.numRows; i++) {
        for (var j = 0; j < HappinessSurvey.numCols; j++) {
          if (value[i][j]) {
            idName = `happiness-input-${i}-${j}-${this.componentId}`;
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
      setTimeout(() => {
        const happinessIndexDivs = document.getElementById(`happiness-index-wrapper-id-${this.componentId}`);
        happinessIndexDivs.style.pointerEvents = 'none';
      }, 1000);
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
      document.querySelectorAll(`.happiness-input-${this.componentId}`).forEach((elem) => {
        (<HTMLInputElement>elem).checked = false;
      });
      return;
    }
    let value = transValue.arrval;
    this.componentData = value;
    this.getSelectedHappiness(value);

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
