import { Component, OnInit } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
// import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
// import { BreederSeedSubmissionUIFields } from 'src/app/common/data/ui-field-data/breeder-seed-submission-ui-fields';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import { checkLength, checkNumber, convertDates, onlyNumberKey, checkDecimal, random } from 'src/app/_helpers/utility';
import { MasterService } from 'src/app/services/master/master.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
// import { IConfig } from 'ngx-dropdown-menu-search';

@Component({
  selector: 'app-spa-lifting',
  templateUrl: './spa-lifting.component.html',
  styleUrls: ['./spa-lifting.component.css']
})
export class SpaLiftingComponent implements OnInit {
  i: any;
  type: any;
  distinctCrop: any;
  cropnametext() {
    throw new Error('Method not implemented.');
  }
  cnclick() {
    throw new Error('Method not implemented.');
  }
  crop_name_check: any;
  selectCrop_group: any;
  isCropName: any;
  crop_name_list: any;
  croupGroup: any;
  dropdownToggled($event: boolean, arg1: any) {
    throw new Error('Method not implemented.');
  }
  keyPressesonDropdown($event: KeyboardEvent, arg1: any) {
    throw new Error('Method not implemented.');
  }
  csClick() {
    throw new Error('Method not implemented.');
  }
  stateList: any;
  selected_state: any;
  disabledfield: any;
  ngForm: any;
  state_select(_t85: any) {
    throw new Error('Method not implemented.');
  }

  fieldsList: Array<SectionFieldType> = [];
  subFieldsList: Array<Array<SectionFieldType>> = [];
  formGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  varietyNames
  isView: boolean;
  seasonList: any;
  cName: any;
  name: any;
  title: string;
  contactPersonName: any;
  crop_names;
  contactPersonDesignation: any;
  currentUser: any = { id: 10, name: "Hello User" };
  disabled = false
  param: { search: { group_code: any; }; };
  cropDataList: any;
  disabledRadio = true

  // public config: IConfig;
  public options: any[];
  public selectedOption: any;
  variety_names;
  // breederForm: FormGroup;
  yearofIndent = [
    // { name: "2026-27", "value": "2026" },
    // { name: "2025-26", "value": "2025" },
    // { name: "2024-25", "value": "2024" },
    { name: "2023-24", "value": "2023-24" },
    // { name: "2022-23", "value": "2022" },
    // { name: "2021-22", "value": "2021" },
    // { name: "2020-21", "value": "2020" },
    // { name: "2019-20", "value": "2019" },
    // { name: "2018-19", "value": "2018" },
  ];
  cropGroupData: any;
  varietyList: any;
  group_name: any;
  crop_name: any;
  updatedCropCode: any;
  titleKey: string;
  notificationYearMissing = false;
  pastedNumber: any;
  verietyArray = []

  selectedLangs = new Set<string>();
  langSelects: any;
  indentQntMissing: boolean = false;
  varietyNameMissing: boolean = false;
  indentQntzero = false;
  selected_group: any;
  cropGroupDatasecond: any;
  cropDataListsecond: any;
  varietyId: any;
  verietyArraySecond: any[];

  stateData: any;
  cropData: any;
  spaData: any;
  varietyData: any;



  get formGroupControls() {
    return this.formGroup.controls;
  }
  constructor(activatedRoute: ActivatedRoute, private router: Router,
    // breederSeedSubmissionUIFields: BreederSeedSubmissionUIFields,
    private masterService: MasterService,
    private breederService: BreederService,
    private indenterService: IndenterService, private service: SeedServiceService,
    private _service: ProductioncenterService,
    private fb: FormBuilder
  ) {
    this.createEnrollForm();
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    this.currentUser.id = userData.id
    this.currentUser.name = userData.name
    this.currentUser.agency_id = userData.agency_id
    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }
    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;
    if (this.isView) {
      this.disabled = true
    }

  }
  createEnrollForm() {
    this.formGroup = this.fb.group({
      yearofIndent: ['', Validators.required],
      season: ['', Validators.required],
      state_code: ['', Validators.required],
      spa_name: ['', Validators.required],

      variety_items: this.fb.array([
        this.varietyItem(),
      ]),
    });
  }

  varietyItem() {
    let temp = this.fb.group({
      crop_code: ['', Validators.required],
      variety_id: ['', Validators.required],
      lot_number: [''],
      bag_size: [''],
      tag_range: [''],
      unitkgQ: [''],

    });

    return temp;

  }



  ngOnInit(): void {
    this.getStateData();
    this.getCropData();
    this.getSeasonData();


    this.spaData = [];
    
    this.formGroup.controls['state_code'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.spaData = [];

        this.breederService.postRequestCreator("getSPADataForSPALifting?state_id=" + newValue).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            this.spaData = data.EncryptedResponse.data
          }

          console.log(this.spaData)
        })
      }
    });
    this.formGroup.controls['variety_items']['controls'][0].controls['crop_code'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getQuantityMeasure(newValue,0);
      }
    });
  }

  getStateData() {
    this.stateData = [];

    this.breederService.postRequestCreator("getStateDataForSPALifting").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.stateData = data.EncryptedResponse.data
      }
    })
  }

  getCropData() {
    this.cropData = [];
    this.breederService.postRequestCreator('getCropDataForSPALifting').subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.cropData = data.EncryptedResponse.data;
      }
    })
  }

  onChangeCrop(event: any, i: any) {

  }

  getItems(form) {
    return form.controls.variety_items.controls;
  }


  get itemsArray() {
    return <FormArray>this.formGroup.get('variety_items');
  }

  getSeasonData() {
    const route = "get-season-details";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

    })
  }

  varietyYears: any;

  getYear(i, event) {


    this.getNoticeYear(event.target.value, i);
    this.varietyItemUnique(event.target.value, i);
    // this.removeSelectedVariety(event.target.value);
  }




  getVarietyList(cropCode, index) {

    const param = {

      crop_id: cropCode,
      season: this.formGroup.controls['season'].value,
      crop_group: this.formGroup.controls['cropGroup'].value,
      year_of_indent: this.formGroup.controls['yearofIndent'].value

    }
    this.masterService.postRequestCreator("get-variety-name-list", null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let variety = data.EncryptedResponse.data;
        if (variety.length > 0) {
          this.varietyList = variety;
          this.verietyArray = this.varietyList;
          this.verietyArraySecond = this.verietyArray
          this.verietyArray.forEach(ele => {
            ele.is_selected = false;
          });
        }
      }
    });
  }

  varietyItemUnique(value, i) {
    let array = [];
  }

  submit() {
    const user = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    if (this.formGroup.invalid) {
      Swal.fire({
        toast: true,
        icon: "error",
        title: "All Maindatory ('*') Field is Required",
        position: "center",
        showConfirmButton: false,
        showCancelButton: false,
        timer: 2000
      });

      return;
    }

    let formObject = {
      "state": this.formGroup.value['state_code'],
      "tagList": []
    }

    this.formGroup.value.variety_items.forEach((element: any, i: any) => {
      console.log(element,'crop_code')
      if (!element.crop_code || !element.variety_id || !element.lot_number || !element.bag_size || !element.tag_range) {
        Swal.fire({
          toast: true,
          icon: "error",
          title: "All Maindatory ('*') Field is Required",
          position: "center",
          showConfirmButton: false,
          showCancelButton: false,
          timer: 2000
        });
        return;
      }

      let spa = this.spaData.find(x => x['user.spa_code'] == this.formGroup.value['spa_name'])

      let taglist = {
        "year": this.formGroup.value['yearofIndent'],
        "season": this.formGroup.value['season'],
        "spaName": spa['user.name'],
        "spaCode": this.formGroup.value['spa_name'],
        "sourceOfSeed": user.name,
        "sourceOfSeedId": user.code,
        "varietyName": element.variety_id['variety_name'],
        "varietyCode": element.variety_id['variety_code'],
        "cropName": element.crop_code['crop_name'],
        "cropCode": element.crop_code['crop_code'],
        "bagSize": element.bag_size,
        "tagSeries": element.tag_range,
        "lotNo": element.lot_number
      }

      formObject['tagList'].push(taglist)

    });


    this.breederService.postRequestCreator('createSPALiftingForm', null, formObject).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data created successfully.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })

        this.router.navigate(['spa-lifting-list']);

      } else {
        Swal.fire({
          icon: "error",
          title: 'Opps..',
          text: data.EncryptedResponse.message,
          timer: 2000
        })
      }

    })

  }

  addMore(i) {
    i = this.itemsArray.length - 1;
    this.itemsArray.insert(0, this.varietyItem());
    for (let index = 0; index < this.verietyArray.length; index++) {
      if (this.verietyArray[index].id === parseInt(this.formGroup.value.variety_items[i].varietyName)) {
        this.verietyArray[index].is_selected = true;
        break;
      }

    }

  }

  remove(rowIndex: number) {
    if (this.itemsArray.length <= 1)
      return;
    else
      this.itemsArray.removeAt(rowIndex);
    this.verietyArray[rowIndex].is_selected = false;

  }

  getNoticeYear(varietyId, i) {
    if (varietyId) {
      this.masterService.postRequestCreator("get-crop-variety-year", null, {
        search: {
          variety_id: varietyId
        }
      }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
          let varietyYear = data.EncryptedResponse.data;
          if (varietyYear.length > 0) {
            const notification_date = data && data.EncryptedResponse && data.EncryptedResponse.data[0] && data.EncryptedResponse.data[0].not_date ? data.EncryptedResponse.data[0].not_date : ''
            if (notification_date != '') {
              let not_date = new Date(notification_date)
              let convertNotificationDate = convertDates(not_date)
              let convertNotificationDateSplit = convertNotificationDate.split('-');
            }
          }
        }
      });
    }

  }

  removeSelectedVariety(id) {
    this.varietyList.forEach((ele, index) => {
      if (ele.id == id) {
        delete this.varietyList[index];
      }
    })
  }

  isEditOrView() {
    if (this.isEdit || this.isView) {
      this.indenterService
        .postRequestCreator("get-breeder-seeds-submission/" + this.submissionId, null, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
            let data = apiResponse.EncryptedResponse.data;
            this.formGroup.controls['yearofIndent'].patchValue(data.year);
            this.formGroup.controls['season'].patchValue(data.season);
            this.formGroup.controls['cropGroup'].patchValue(data.group_code);
            this.crop_names = data && data.crop_name ? data.crop_name : '';
            this.selected_group = data && data.group_name ? data.group_name : '';
            this.varietyNames = data && data.m_crop_variety && data.m_crop_variety.variety_name ? data.m_crop_variety.variety_name : ''
            // this.indentCropName(data.group_code)

            this.formGroup.controls['cropName'].patchValue(data.crop_code);
            this.formGroup.controls['cropType'].patchValue(data.crop_type);
            this.formGroup.controls['unitKgQ'].patchValue(data.unit);
            this.formGroup.controls['variety_items']['controls'][0].controls['varietyNotificationYear'].patchValue(data.variety_notification_year);
            this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].patchValue(data.m_crop_variety);
            this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].patchValue(data.indent_quantity);
            // this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].value.variety_name =data.variety_id
          }
        });
      if (this.isView) {
        this.formGroup.controls['yearofIndent'].disable();
        this.formGroup.controls['season'].disable();
        this.formGroup.controls['cropGroup'].disable();
        this.formGroup.controls['cropName'].disable();
        this.formGroup.controls['cropType'].disable();
        // this.formGroup.controls['unitKgQ'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['varietyNotificationYear'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].disable();
        // this.formGroup.controls['variety_items']['controls'][0].controls['unitkgQ'].disable();
      }
    }
  }

  checkNumber($e) {
    checkNumber($e);
  }
  onlyNumberKey($e) {
    onlyNumberKey($e);
  }
  checkDecimal($e) {
    checkDecimal($e);
  }
  checkLength($e, length) {
    checkLength($e, length);
  }
  onPasteNumber(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = '^[0-9]$';
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    for (let i = 0; i < this.itemsArray.value.length; i++) {

      if (this.pastedNumber.length > 8) {
        this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].patchValue(this.pastedNumber.slice(0, 8));
      }
    }
  }
  checkValue(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    let decimalValues = (event.target.value.toString()).split('.')[0];
    let decimalAfterValues = (event.target.value.toString()).split('.')[1];
    if (parseInt(charCode) == 17 || parseInt(charCode) == 8) {
      return true;
    }
    if (decimalValues && decimalValues.length > 7) {

      if (parseInt(charCode) == 17 || parseInt(charCode) == 8) {
        return true;
      }
      else {

        event.preventDefault();
        return false;
      }

    }
    if (decimalValues && decimalValues.length < 7) {
      let decimalValue = (event.target.value.toString()).split('.')[1];

      if (decimalValue && decimalValue.length > 1) {
        event.preventDefault();
        return false;
      }
      else {
        // return true
      }
      let res = event.target.value.indexOf(".") == -1;
      let result = event.target.value.toString();
      // return true;
    }

  }
  group_select(data) {
    this.selected_group = data.group_name;
    this.formGroup.controls['cropGroup'].setValue(data.group_code)
    this.formGroup.controls['group_text'].setValue('')
  }
  cnClick() {
    document.getElementById('group_code').click();
  }

  cropName(item: any, index) {
    this.formGroup.controls['variety_items']['controls'][index].controls['crop_code'].setValue(item);
    this.getQuantityMeasure(item,index)
    this.varietyData = [];

    this.breederService.postRequestCreator("getVarietyDataForSPALifting?crop_code=" + item.crop_code).subscribe((data: any) => {

      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.varietyData = data.EncryptedResponse.data
      }

    })


  }

  VarieyName(data, index, $event) {
    this.formGroup.controls['variety_items']['controls'][index].controls['variety_id'].setValue(data);
    this.varietyId = data && data.id ? data.id : ''

    this.getNoticeYear(data.id, index);
  }
  cvClick() {
    document.getElementById('variety_name').click();
  }
  public onDropdownOptionSelect(option) {
    this.selectedOption = option.variety_name;
  }
  filterVarietyName(e, i) {

    this.formGroup.controls['variety_items']['controls'][i].controls['variety_name_text'].value;
    if (e.target.value) {

      this.verietyArray = this.verietyArraySecond
      let response = this.verietyArray.filter(x => x.variety_name.toLowerCase().startsWith(e.target.value.toLowerCase()))

      this.verietyArray = response

    }
    else {

    }

  }
  getQuantityMeasure(crop_code,i) {

    // this.quantity=crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg' 
    console.log(crop_code,'unitkgQ')
    let crop =crop_code.crop_name.split('')[i] == 'A' ? 'Quintal' : 'Kg'
    this.formGroup.controls['variety_items']['controls'][i].controls['unitkgQ'].setValue(crop)
  }
  getselectCrop(newValue,i){

  }
}
