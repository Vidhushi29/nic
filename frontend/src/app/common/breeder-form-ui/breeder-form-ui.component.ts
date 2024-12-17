import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { checkLength, checkNumber } from 'src/app/_helpers/utility';
import { SectionFieldType } from '../types/sectionFieldType';
@Component({
  selector: 'app-breeder-form-ui',
  templateUrl: './breeder-form-ui.component.html',
  styleUrls: ['./breeder-form-ui.component.css']
})
export class BreederFormUiComponent implements OnInit {
  
  @Input() fieldsList: Array<SectionFieldType> = [];
  @Input() formGroup: FormGroup = new FormGroup([]);
  @Input() isLabelControlParallel: boolean = true;
  @Input() isView: boolean = false
  @Input() id: number = Date.now();

  showError: boolean = false;

  get formGroupControls() {
    return this.formGroup.controls;
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.attachEventToFields();
  }

  attachEventToFields() {
    this.fieldsList.forEach(element => {
      if (element.fieldType == "number") {
        var el = document.getElementById(element.id);
        if (el) {
          el.addEventListener('keydown', this.checkNumberInputValidations.bind(this, element));
        }
      }
    });
  }

  checkNumberInputValidations(fieldData: any, $event: any) {
    checkNumber($event);
    if (fieldData.maxLength !== undefined && fieldData.maxLength > 0) {
      checkLength($event, fieldData.maxLength);
    }
  }

  patchRadioValue(controlName: string, value: any): void {
    this.formGroupControls[controlName].patchValue(value);
  }

  checkValidations(eachField: any, validatorType: any): boolean {
    if (validatorType == 'required')
      return eachField.validations && eachField.validations.length > 0 && eachField.validations.indexOf(Validators.required) > -1;
    else
      return false;
  }

  getViewData(data: any) {
    if (data.hasOwnProperty("name")) {
      return data.name;
    }

    return data;
  }
}
