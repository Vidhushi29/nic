import { AfterViewInit, Component, Input, OnInit, Output, EventEmitter, TemplateRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { checkLength, checkNumber, checkAlpha } from 'src/app/_helpers/utility';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


// import { checkLength, checkNumber } from 'src/app/_helpers/utility';
import { SectionFieldType } from '../types/sectionFieldType';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { environment } from 'src/environments/environment';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
// import moment from 'moment'
// import { Moment } from 'moment/moment';
// import * as moment from 'moment'

@Component({
  selector: 'app-dynamic-fields[fieldsList][formGroup]',
  templateUrl: './dynamic-fields.component.html',
  styleUrls: ['./dynamic-fields.component.css']
})
export class DynamicFieldsComponent extends ngbDropdownEvents implements OnInit, AfterViewInit {

  @Input() fieldsList: Array<SectionFieldType> = [];
  @Input() formGroup: FormGroup = new FormGroup([]);
  @Input() allocation;
  @Input() allocationQtyUnit;
  @Input() allocaltedQty;
  @Input() totalProductionQty;
  @Input() totalProductionUnit;
  @Input() totalProductionTitle;
  @Input() isLabelControlParallel: boolean = true;
  @Input() isView: boolean = false
  @Input() isEdit: boolean = false
  @Input() item = ''; // decorate the property with @Input()
  @Input() id: number = Date.now();
  @Output() fileData = new FormData();
  @Output() inputSearch;
  @Output() selectedFiles: File;
  @Output() downloadUrl: any;
  modalRef: BsModalRef;
  todaysDate: Date = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  pdfSrc;
  item_url;
  crop_group_smr;
  image_url;
  imgSrc;
  showError: boolean = false;
  errorMessageForIndentor = false;
  expected_harvest_from: Date;
  formatDate: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  day = this.now.getDay();
  minDatse = '2023-12-23';
  validHarvestFromDate: string;
  validHarvestDate: string;
  validDateOfAvailability: string;
  expected_harvest_to: any;
  expected_inspection_period_from_date;
  expected_period_to: any;
  validPeriod: string;
  expecpeted_period_to: any;
  expecpeted_period_from: any;
  pastedNumber: string;
  searchInput: any;
  routeBSP4 = this.router.url.includes('/breeder/bsp-proformas/proformas-4s/new');

  get formGroupControls() {
    return this.formGroup.controls;
  }
  fileName: any;
  test: any
  dte = new Date();

  


  minDate = this.dte.setDate(this.dte.getDate() - 1);

  constructor(private fb: FormBuilder,
    private breederService: BreederService,
    private productionservice: ProductioncenterService,
    private modalService: BsModalService,
    private prodservice: ProductioncenterService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.router.url.includes('/indent-breeder-seed-allocation-list/submission')) {
      this.errorMessageForIndentor = true
    }
    console.log("URLllllllllllllllllllllllllll",this.router.url);
  }

  ngAfterViewInit(): void {
    this.attachEventToFields();


  }

  attachEventToFields() {
    this.fieldsList.forEach(element => {
      // if(element.inputSearch){
      //   this.searchInput = element.inputSearch;
      // }

      if (element.fieldType == "number") {
        var el = document.getElementById(element.formControlName + this.id);
        if (el) {
          el.addEventListener('keydown', this.checkNumberInputValidations.bind(this, element));
        }
      }
    });
  }


  showPdf(template: TemplateRef<any>, imgModal: TemplateRef<any>, pdfUrl) {

    let a = pdfUrl.split('.')
    let fileType = a[a.length - 1]
    if (fileType == 'pdf') {
      this.modalRef = this.modalService.show(template, {
        class: 'modal-dialog-centered modal-lg'
      });

      // this.pdfSrc = environment.awsUrl + pdfUrl
    } else {
      this.modalRef = this.modalService.show(imgModal, {
        class: 'modal-dialog-centered modal-lg'
      });
      // this.imgSrc = environment.awsUrl + pdfUrl
    }

    // this.pdfViewerAutoLoad.pdfSrc = encodeURIComponent(url);
    // this.pdfSrc = "https://frs.dbtfert.nic.in/api/uploads/1672378247371-AGRONMIC%20EFFICACY.pdf";
  }
  showImage(template: TemplateRef<any>, imgUrl) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg'
    });
    this.imgSrc = imgUrl;
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.selectedFiles = event.target.files[0];
      const file = this.selectedFiles
      var fileSize = file.size / 1024;
      if (fileSize > 2000) {
        Swal.fire({

          title: '<p style="font-size:25px;">File should not be greater than 2MB.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
        Swal.hideLoading();
        return;
      }
      this.fileName = file.name
      this.fileData["name"] = file.name;
      this.fileData["extension"] = file.type.split("/")[1];
      this.fileData['file'] = file;
      Swal.fire({
        title: 'Uploading File...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null)
        }
      });
      this.breederService.upload(this.selectedFiles).subscribe(
        (res: any) => {
          if (typeof (res) === 'object' && res.status == 'success' && res.results) {
            this.downloadUrl = res.results.name;
            Swal.fire({
              title: '<p style="font-size:25px;">Document successfully uploaded.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
          }
          Swal.fire({
            title: '<p style="font-size:25px;">Document successfully uploaded.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'
          })
        }
      );
    }
  }

  downloadFile(e, text) {
    if (text != undefined || text != '') {
      this.breederService.download(text).subscribe(
        (data: any) => {
          if (typeof (data) === 'object' && data.EncryptedResponse && data.EncryptedResponse.data) {
            let dowbloadLink = data.EncryptedResponse.data
            window.open(dowbloadLink, "_blank");
          }
        }
      );
    }
  }
  updateCalcs() {

  }

  onChangeDate(event, fieldName) {
    this.expected_harvest_from = (event.singleDate.jsDate);
    var tempDate = new Date(event.singleDate.formatted);

    console.log(fieldName)

    if (fieldName == 'expected_harvest_from') {

      let expected_inspection_period_to = this.formGroup.controls['expected_inspection_period_to'].value['singleDate']['jsDate'];
      let expected_harvest_from = event['singleDate']['jsDate'];

      if (Date.parse(expected_harvest_from) >= Date.parse(expected_inspection_period_to)) {
        this.validHarvestFromDate = ''

      } else {
        this.validHarvestFromDate = 'Expected Harvest Date is not less than Expected Inspection To Date'
      }

      if (this.formGroup.controls['expected_harvest_to'].value.singleDate.jsDate) {

        if (this.expected_harvest_from > this.formGroup.controls['expected_harvest_to'].value.singleDate.jsDate) {

          this.validHarvestDate = 'Expected Valid Harvest Date'

        }
        else {
          this.validHarvestDate = ''
        }
        this.productionservice.expected_investion_to(this.validDateOfAvailability)
      }
    }
  }

  onChangeAvailabilityDate(event, fieldName) {
    if (fieldName == 'availability_expected_date') {

      let expected_harvest_to = this.formGroup.controls['expected_harvest_to'].value['singleDate']['jsDate']
      let availability_expected_date = event['singleDate']['jsDate'];

      if (Date.parse(availability_expected_date) >= Date.parse(expected_harvest_to)) {
        this.validDateOfAvailability = ''

      } else {
        this.validDateOfAvailability = 'Expected Date of Availability is not less than Expected Harvest To Date'
      }
      this.productionservice.expected_harvest_to(this.validDateOfAvailability)
    }

  }

  onChangeDates(event, fieldName) {
    this.expected_harvest_to = event.singleDate.jsDate;
    var tempDate = event.singleDate.jsDate
    if (fieldName == 'expected_harvest_to') {
      if (tempDate < this.formGroup.controls['expected_harvest_from'].value.singleDate.jsDate) {
        this.validHarvestDate = 'Please Select Valid Harvest Date'
      }
      else {
        this.validHarvestDate = ''
      }
      // this.productionservice.expected_harvest_to(this.validDateOfAvailability)
    }
  }

  onChangeDatesofPeriodFrom(event, fieldName) {
    var tempDate = event.singleDate.jsDate;
    this.expecpeted_period_from = event.singleDate.jsDate
    if (fieldName == 'expected_inspection_period_from') {
      if (this.formGroup.controls['expected_inspection_period_to'].value.singleDate.jsDate) {
        if (tempDate > this.formGroup.controls['expected_inspection_period_to'].value.singleDate.jsDate) {
          this.validPeriod = 'Expected inspection Period date is not less than Expected inspection Period from'
        }
        else {
          this.validPeriod = ''
        }
      }
      // this.productionservice.expected_harvest_to(this.validDateOfAvailability)
    }
  }

  onChangeDatesofPeriod(event, fieldName) {

    var tempDate = event.singleDate.jsDate;
    this.expecpeted_period_to = event.singleDate.jsDate
    if (fieldName == 'expected_inspection_period_to') {
      if (tempDate < this.formGroup.controls['expected_inspection_period_from'].value.singleDate.jsDate) {
        this.validPeriod = 'Expected inspection Period date is not less than Expected inspection Period from'
      }
      else {
        this.validPeriod = ''
        // this.validHarvestDate = ''
      }
    }
  }

  checkNumberInputValidations(fieldData: any, $event: any) {
    checkNumber($event);
    if (fieldData.maxLength !== undefined && fieldData.maxLength > 0) {
      checkLength($event, fieldData.maxLength);
    }
  }

  patchRadioValue(controlName: string, value: any): void {
   console.log('vvvvvvv',value,this.formGroupControls)
    this.formGroupControls[controlName].patchValue(value);

    if (controlName === "not_being_produced") {

      if (value['value'] == false) {
        this.formGroup.enable()
        this.formGroupControls['targeted_quantity'].disable();
        this.formGroupControls['upload'].disable();

        this.formGroupControls['sown_area'].patchValue("");
        this.formGroupControls['expected_production'].patchValue("");
        this.formGroupControls['field_location'].patchValue("");
        this.formGroupControls['latitude'].patchValue("");
        this.formGroupControls['longitude'].patchValue("");
        this.formGroupControls['expected_inspection_period_from'].patchValue("");
        this.formGroupControls['expected_inspection_period_to'].patchValue("");
        this.formGroupControls['sowing_date'].patchValue("");
        this.formGroupControls['expected_harvest_from'].patchValue("");
        this.formGroupControls['expected_harvest_to'].patchValue("");
        this.formGroupControls['availability_seed_loaction'].patchValue("");
        this.formGroupControls['availability_expected_date'].patchValue("");
      } else {
        // this.formGroup.disable()
        this.formGroupControls['not_being_produced'].enable();
        this.formGroupControls['upload'].enable();
        
        // this.formGroup.removeControl('sown_area')
        // this.formGroupControls['expected_production'].patchValue("0");
        // this.formGroupControls['field_location'].patchValue("NA");
        // this.formGroupControls['latitude'].patchValue("NA");
        // this.formGroupControls['longitude'].patchValue("NA");
        // this.formGroupControls['expected_inspection_period_from'].patchValue("");
        // this.formGroupControls['expected_inspection_period_to'].patchValue("undefined");
        // this.formGroupControls['sowing_date'].patchValue("undefined");
        // this.formGroupControls['expected_harvest_from'].patchValue("undefined");
        // this.formGroupControls['expected_harvest_to'].patchValue("undefined");
        // this.formGroupControls['availability_seed_loaction'].patchValue("NA");
        // this.formGroupControls['availability_expected_date'].patchValue("undefined");
      }
    }
  }

  patchButtonValue(controlName: string, value: any): void {
    let val = parseInt(value) + 1
    console.log(val,'valll')
    this.formGroupControls[controlName].patchValue(val);
  }

  patchRemoveButtonValue(controlName: string, value: any): void {
    let val = parseInt(value) + 1
    this.formGroupControls[controlName].patchValue(val);
  }

  onKeyPress(e) {
    // if(fieldName == 'carry_over_seed_previous_year_germination' || fieldName == 'carry_over_seed_current_year_germination'){
    //   if (e.target.value > 100) {
    //     e.target.value = 100
    //   } else if (e.target.length && e.target.value < 0) {
    //     e.target.value = 0
    //   }
    // }
  }

  isNumberKey(evt, fieldName) {
    var input = <HTMLInputElement>evt.srcElement;
    let value = input.value
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if ((value.indexOf('.') != -1) && (value.substring(value.indexOf('.')).length > 2)) {
      evt.preventDefault();
    }
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (charCode == 46 && value.indexOf('.') != -1) {
      return false;
    }
    else {
      if (fieldName == 'carry_over_seed_previous_year_germination' || fieldName == 'carry_over_seed_current_year_germination') {
        var number = Number(input.value + '' + evt.key);
        if (number > 100) {
          return false;
        } else {
          return true;
        }
      }
      else {
        return true;

      }
    }
  }

  checkValidations(eachField: any, validatorType: any): boolean {

    if (validatorType == 'required')
      return eachField.validations && eachField.validations.length > 0 && eachField.validations.indexOf(Validators.required) > -1;
    else
      return false;
  }

  getViewData(data: any) {
    if (data !== undefined && data.hasOwnProperty("name")) {
      return data.name;
    }

    return data;
  }
  checkLength(e, length, field?: any) {

    if (field == "monitoring_team_memebers_count") {
      if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 45 && e.keyCode < 58) || e.keyCode == 8)) {
        return false;
      }

      const reg = /^-?\d*(\.\d{0,2})?$/;
      let input = e.target.value + String.fromCharCode(e.charCode);

      if (!reg.test(input)) {
        e.preventDefault();
      }
    } else {
      checkLength(e, length);
    }

  }
  checkNumber($e) {
    checkNumber($e);

  }
  checkAplha($event) {
    checkAlpha($event)

  }

  checkfertilizerphosphorus(evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode
    var leng = (document.getElementById("phosphorus") as HTMLInputElement).value;
    let res = leng.indexOf(".") == -1;
    let result = leng.toString();
    let num = result.split('.');
    if (!num[0].length) {
      if (parseInt(charCode) == 190) {
        evt.preventDefault();
        return false;
      }
    }

    let results = parseInt(result[0]);
    if (leng) {
      if (res) {
        if (result.length > 0 && result.length <= 0) {
          if (charCode == 190 || charCode == 8) {
            return true;
          }
        }
        let val = this.formGroup.controls['nucleus_breader'].value;

        val = val.toString();

        // if (val.length > 2) {

        //   if (parseInt(charCode) == 190 || parseInt(charCode) == 8) {
        //     // alert('190')
        //     if (this.phosphorusvalidation == '') {

        //       return true;
        //     }
        //     else {
        //       if (parseInt(charCode) == 8) {
        //         return true;
        //       }
        //       else {
        //         return false;
        //       }


        //     }

        //   }
        //   else {

        //     return false;
        //   }
        // }
      }
      var isDotPresent = (document.getElementById("phosphorus") as HTMLInputElement).value.indexOf('.') > -1;
      var isDotInput = evt.key === '.';
      let firstdigit = evt.key === '.'
      // I have to avoid the dot:
      if (isDotPresent && isDotInput) {
        // avoid the effect of the event (so the injection of dot into the text)
        evt.preventDefault();

      }

    }



    if (leng) {

      if (charCode == 190 || charCode == 8) {

        return true;
      }
      // }
    }
    var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;


    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 190) {
      var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;



      return false;
    }
    else {
      var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;
      var index = (document.getElementById("phosphorus") as HTMLInputElement).value.indexOf('.');

      if (index > 0 && charCode == 46) {

        return false;
      }
      if (index > 0) {
        var CharAfterdot = (len + 1) - index;
        if (CharAfterdot > 3) {
          return false;
        }
      }

    }
    return true;
  }
  checkDecimal(evt, controlName, id) {

    var charCode = (evt.which) ? evt.which : evt.keyCode
    var leng = (document.getElementById(id) as HTMLInputElement).value;
    let res = leng.indexOf(".") == -1;
    let result = leng.toString();
    let num = result.split('.');
    if (!num[0].length) {
      if (parseInt(charCode) == 190) {
        evt.preventDefault();
        return false;
      }
    }

    let results = parseInt(result[0]);
    if (leng) {
      if (res) {
        if (result.length > 0 && result.length <= 0) {
          if (charCode == 190 || charCode == 8) {
            return true;
          }
        }
        let val = this.formGroup.controls[controlName].value;

        val = val.toString();
        // if (val.length > 2) {

        //   if (parseInt(charCode) == 190 || parseInt(charCode) == 8) {
        //     // alert('190')
        //     if (this.phosphorusvalidation == '') {

        //       return true;
        //     }
        //     else {
        //       if (parseInt(charCode) == 8) {
        //         return true;
        //       }
        //       else {
        //         return false;
        //       }


        //     }

        //   }
        //   else {

        //     return false;
        //   }
        // }
      }
      var isDotPresent = (document.getElementById("phosphorus") as HTMLInputElement).value.indexOf('.') > -1;
      var isDotInput = evt.key === '.';
      let firstdigit = evt.key === '.'
      // I have to avoid the dot:
      if (isDotPresent && isDotInput) {
        // avoid the effect of the event (so the injection of dot into the text)
        evt.preventDefault();

      }

    }



    if (leng) {

      if (charCode == 190 || charCode == 8) {

        return true;
      }
      // }
    }
    var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;


    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46 && charCode != 190) {
      var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;



      return false;
    }
    else {
      var len = (document.getElementById("phosphorus") as HTMLInputElement).value.length;
      var index = (document.getElementById("phosphorus") as HTMLInputElement).value.indexOf('.');

      if (index > 0 && charCode == 46) {

        return false;
      }
      if (index > 0) {
        var CharAfterdot = (len + 1) - index;
        if (CharAfterdot > 3) {
          return false;
        }
      }

    }
    return true;
  }
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };

  get generateDefaultMonth(): string {
    let date = { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }

    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }


  myDpOptions: IAngularMyDpOptions = {
    //  condition

    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    // disableUntil: {year: 1930, month: 1, day: null},
    disableSince: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
  };
  myDpOption1: IAngularMyDpOptions = {
    //  condition

    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    disableUntil: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() - 1 },
    // disableSince: { year: this.todaysDate.getFullYear() , month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
  };
  myDpOptionSowing: IAngularMyDpOptions = {
    //  condition

    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    disableSince: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 },
    // disableSince: { year: this.todaysDate.getFullYear() , month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
  };
  myDpOptionexpected_harvest_to: IAngularMyDpOptions = {
    //  condition


    dateRange: false,
    // markDates:[1-2],

    dateFormat: 'dd-mm-yyyy',
    // maxYear:1970,
    disableUntil: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() },

  };
  myDpOptionexpected_harvest_from: IAngularMyDpOptions = {
    //  condition


    dateRange: false,
    // markDates:[1-2],

    dateFormat: 'dd-mm-yyyy',
    // maxYear:1970,
    // disableDates:[21-01-2018]:['2-01-2018']
    // disableUntil: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() },
    // 
  };
  bsp4: IAngularMyDpOptions = {
    //  condition
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // maxYear:1970,
  };
  expected_inspection_period_to: IAngularMyDpOptions = {
    //  condition


    dateRange: false,
    // markDates:[1-2],

    dateFormat: 'dd-mm-yyyy',
    // maxYear:1970,
    // disableDates:[21-01-2018]:['2-01-2018']
    // disableUntil: { year: this.expected_harvest_from[0], month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() },
    // 
  };
  expected_inspection_period_from: IAngularMyDpOptions = {
    //  condition


    dateRange: false,
    // markDates:[1-2],

    dateFormat: 'dd-mm-yyyy',

  };
  onDateChanged(event: IMyDateModel): void {
    this.formGroup.controls['expected_harvest_from'].value
    // date selected
  }
  onDateChangeds(event: IMyDateModel, id): void {
    // document.getElementById(id)['min'] = new Date();
    // date selected
  }
  preventKeyPress(event) {
    console.log("working")
    event.preventDefault();
  }
  onPasteNumber(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = '^[0-9]$';
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    if (this.formGroup.get(field).value.match(alphaExp)) {

      if (this.formGroup.get(field).value.length > len) {
        const value = this.formGroup.get(field).value;
        this.formGroup.get(field).setValue(value.substring(0, len))
      }
      else {
        this.formGroup.get(field).setValue(this.formGroup.get(field).value)
      }
      // return true
    }
    else {
      if (field == 'latitude' || field == 'longitude') {
        let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.formGroup.get(field).value;
        this.formGroup.get(field).setValue(fieldName.substring(0, value))
      }
      else {
        event.preventDefault();
        let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.formGroup.get(field).value + fieldName;
        this.formGroup.get(field).setValue(fieldName.substring(0, value))
      }
      // return false
    }

  }
  inputChange(e) {
    this.productionservice.data = e.target.value ? e.target.value : ''

  }
  cnClick() {
    document.getElementById('group_code').click();
  }
}
