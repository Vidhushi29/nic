import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SectionFieldType } from '../types/sectionFieldType';

@Component({
  selector: 'app-indentor-dynamic-field',
  templateUrl: './indentor-dynamic-field.component.html',
  styleUrls: ['./indentor-dynamic-field.component.css']
})
export class IndentorDynamicFieldComponent implements OnInit {


  @Input() fieldsList: Array<SectionFieldType> = [];
  @Input() formGroup: FormGroup = new FormGroup([]);
  @Input() isLabelControlParallel: boolean = true;
  @Input() isView: boolean = false

  showError: boolean = false;

  get formGroupControls() {
    return this.formGroup.controls;
  }

  constructor() { }

  ngOnInit(): void {
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
