
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth, } from 'angular-mydatepicker';
import { MasterService } from 'src/app/services/master/master.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { AlphaNumeric, checkAlpha, checkAlphabet, checkDecimal, checkLength, checkNumber, convertDates, convertDatetoDDMMYYYY, subtractFromDate, } from 'src/app/_helpers/utility';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { HttpClient } from '@angular/common/http';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import Swal from 'sweetalert2';
import { FilterPipe } from '../pipe/filter.pipe';
// import { VarietyService } from './varietyservice';
// import { CropVarietyService } from './crop-variety-service';

@Component({
  selector: 'app-add-crop-notified',
  templateUrl: './add-crop-notified.component.html',
  styleUrls: ['./add-crop-notified.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddCropNotifiedComponent
  extends ngbDropdownEvents
  implements OnInit {
  showNgContainer: boolean = false;
  varietyList = [];
  otherVarietyData = [];
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  enrollFormGroup!: FormGroup;
  submitted = false;
  ngForm!: FormGroup;
  crop_group: any;
  crop_name: any;
  cropGroupData: any;
  cropNameData: any;
  verietyData: any;
  UserId: any;
  group_code: any;
  todayDate = new Date();
  cropCode: any;
  disabledfield = false;
  cancelbtn: boolean;
  isView: boolean;
  isEdit: boolean;
  submitHide: boolean = true;
  crop_groups: any;
  filtercrop_group;
  crop_names: any;
  date: any;
  data: any;
  cropGroupCodeval: any;
  varietyCode: any;
  cropCodeval: any;
  alreadyExistsMsg: string;
  errorMsg: boolean = false;
  developedBy_error: string;
  disabled = false;
  yearofIntroduction: Boolean;
  notified_code: any;
  yearOfIndent = [];
  userFilter: any = { name: '' };
  variety_name_value = '';
  enable: boolean = true;
  new_not_date: string;
  listData: any;
  value: any;
  cropVarietyNameShowErrMsg: boolean = false;
  cropVarietyNameErrMsg: string;
  isShowDiv: any;
  isActive: any;
  year_of_introduction_variet: any;
  ipAddres: any;
  userId: any;
  submissionid: any;
  historyData = {
    action: '',
    comment: '',
    formType: '',
  };
  pastedText: string;
  addMoreCount = true
  pastedNumber: string;
  cropGropDataSecond: any;
  cropNameDataSecond: any;
  suggestedName: any[];
  crop_NameData: any;
  showOtherInput = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  varietyCategories: any[];
  addVarietySubmission: any[];
  todaysDate: Date = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  selectState: any;
  selectMultileVarityData: any;
  varietyListSecond: any;
  dropdownOpen: boolean =false;
  get enrollFormControls() {
    return this.enrollFormGroup.controls;
  }
  varNameData = [
    { id: 1, name: 'KHR-1' },
    { id: 2, name: 'WH-001' },
    { id: 3, name: 'HD-009' },
  ];
  // otherVarietyData = [
  // { id: 1, name: 'D-147' },
  // { id: 2, name: 'A-567' },
  // { id: 3, name: 'WH-89' },
  // { id: 4, name: 'Other' }
  // ];

  constructor(
    private fb: FormBuilder,
    private service: SeedServiceService,
    private _service: SeedDivisionService,
    private route: Router,
    private _masterService: MasterService,
    private router: ActivatedRoute,
    public datepipe: DatePipe,
    private http: HttpClient,
    // private varietyService: VarietyService,
    // private cropVarietyService: CropVarietyService
  ) {
    super();
    this.createEnrollForm();
    this.selectedItems = [];
  }

  parentaldata(data, i) {
    console.log(data)
    data.line_variety_name = data && data.variety_name ? data.variety_name : ''
    this.ngForm.controls['perental_line_array']['controls'][i].controls['other_option'].setValue(data);
    // this.ngForm.controls['perental_line_array']['controls'][i].controls['other_option'].setValue('other');
    this.onOtherValueChange(i)
    // this.ngForm.controls[''].
  }

  cpClick(i) {
    document.getElementById('states' + i).click()
  }

  loadVarietyList(cropCode: string, index) {
    const route = 'get-variety-list';
    const param = {
      crop_code: this.cropCode ? this.cropCode :this.ngForm.controls['crop_name'].value.value,
    };
    this.service
      .postRequestCreator(route, null, param).subscribe((data: any) => {
        if (data.EncryptedResponse.status_code === 200) {
          this.varietyList = data.EncryptedResponse.data;
          let varietyList = data.EncryptedResponse.data;
          this.varietyListSecond=data.EncryptedResponse.data
          const formArray = this.ngForm.get('perental_line_array') as FormArray;
          // console.log('djfkdjkfd', formArray);
          // console.log(index);
          // this.ngForm.controls["bsp2Arr"]['controls'][index]["controls"]['other_option'].varietyList = this.varietyList
          // console.log(this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].value);
          if (formArray.controls && formArray.controls[index] && formArray.controls[index]['controls'] && formArray.controls[index]['controls']['other_option']) {
            formArray.controls[index]['controls']['other_option'].varietyList = this.varietyList;
            formArray.controls[index]['controls']['other_option'].varietyListSecond=formArray.controls[index]['controls']['other_option'].varietyList
            //  formArray.controls[index]['controls']['other_option'].varietyList.push({
            //  'variety_name':'other',
            //  'variety_code':'other'
            //  })
          }

          let bsp = this.ngForm.value && this.ngForm.value.perental_line_array ? this.ngForm.value.perental_line_array : '';
          let bspVariety = [];
          bsp.forEach((el, i) => {
            bspVariety.push(el && el.other_option ? el.other_option : '');
          });

          let filteredArray = bspVariety.filter((value) => {
            return value !== '' && value !== null && value !== undefined;
          });
          let filteredArrayData=[]
         filteredArray.forEach((el,i)=>{
          filteredArrayData.push(el && el.variety_code ? el.variety_code :'')
          })
          filteredArrayData = filteredArrayData.filter((value) => {
            return value !== '' && value !== null && value !== undefined;
          });
          // console.log(bspVariety);
          if (!this.isView && !this.isEdit) {

            formArray.controls[index]['controls']['other_option'].varietyList =
              formArray.controls[index]['controls']['other_option'].varietyList.filter(obj =>
                !filteredArrayData.includes(obj.variety_code));
                formArray.controls[index]['controls']['other_option'].varietyListSecond.filter(obj =>
                  !filteredArrayData.includes(obj.variety_code));
                // formArray.controls[index]['controls']['other_option'].varietyListSecond = formArray.controls[index]['controls']['other_option'].varietyListSecond.filter(item => !filteredArrayData.includes(item.variety_code));
                if(formArray.controls[index]['controls']['other_option'] && formArray.controls[index]['controls']['other_option'].varietyList){
                  formArray.controls[index]['controls']['other_option'].varietyList.unshift({'variety_name':'other','variety_code':'other'})
                  formArray.controls[index]['controls']['other_option'].varietyListSecond.unshift({'variety_name':'other','variety_code':'other'})
                }      
              }
          if (this.isEdit) {
            let bsp = this.ngForm.value && this.ngForm.value.perental_line_array ? this.ngForm.value.perental_line_array : '';
            let bspVariety = [];
            bsp.forEach((el, i) => {
              bspVariety.push(el && el.other_option ? el.other_option : '');
            });

            let filteredArray = bspVariety.filter((value) => {
              return value !== '' && value !== null && value !== undefined;
            });
           
            
            let arr
            let filteredArrayData =[];
            
              arr = filteredArray
              
              
              if (arr && arr.length > 0) {

                if (arr.includes(this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].value)) {
                  arr = arr.filter(item => item !== this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].value);
                }
                else {
                  arr = arr
                  // console.log(arr); // Otherwise, display all values in the array
                }
                // If a exists in the array, display filtered array
              } else {
                arr = arr
                // console.log(arr); // Otherwise, display all values in the array
              }
             
              if(arr && arr.length>0){

                arr.forEach((el,i)=>{
                  filteredArrayData.push(el && el.line_variety_code ? el.line_variety_code :'');
                })
              }
          if(formArray.controls[index]['controls'] && formArray.controls[index]['controls']['other_option'] && formArray.controls[index]['controls']['other_option'].varietyList && filteredArrayData && filteredArrayData.length > 0 ){ 
            formArray.controls[index]['controls']['other_option'].varietyList = formArray.controls[index]['controls']['other_option'].varietyList.filter(item => !filteredArrayData.includes(item.variety_code));
            formArray.controls[index]['controls']['other_option'].varietyListSecond = formArray.controls[index]['controls']['other_option'].varietyListSecond.filter(item => !filteredArrayData.includes(item.variety_code));
            
          }
          if(formArray.controls[index]['controls']['other_option'] && formArray.controls[index]['controls']['other_option'].varietyList){
            formArray.controls[index]['controls']['other_option'].varietyList.unshift({'variety_name':'other','variety_code':'other'})
            formArray.controls[index]['controls']['other_option'].varietyListSecond.unshift({'variety_name':'other','variety_code':'other'})
          }
        }
        }
      });
  }

  filterVariety(index) {
    console.log(index)
    let bsp = this.ngForm.value && this.ngForm.value.perental_line_array ? this.ngForm.value.perental_line_array : '';
    let bspVariety = [];
    bsp.forEach((el, i) => {
      bspVariety.push(el && el.other_option ? el.other_option : '');
    });
    const formArray = this.ngForm.get('perental_line_array') as FormArray;
    let filteredArray = bspVariety.filter((value) => {
      return value !== '' && value !== null && value !== undefined;
    });
    // if(filterVariety)
    let filteredArray2 = []
    let parts;
    let items: any[] = filteredArray;
    // filteredArray2.push(filteredArray)
    //  let filteredArrays= filteredArray ? filteredArray.flat():''
    // if(filteredArray.length == index+1){
    if (formArray.controls && formArray.controls[index] && formArray.controls[index]['controls'] && formArray.controls[index]['controls']['other_option'] && formArray.controls[index]['controls']['other_option'].varietyList && formArray.controls[index]['controls']['other_option'].varietyList.length > 0) {
      console.log(filteredArray, formArray.controls[index]['controls']['other_option'].varietyList, 'varietyList');
      formArray.controls[index]['controls']['other_option'].varietyList =
        formArray.controls[index]['controls']['other_option'].varietyList.filter(obj =>
          !filteredArray.includes(obj.variety_code));
    }
    // }
    // console.log()
    // filteredArray=
  }

  loadCategory() {
    const route = 'getVarietyCategoryList';
    const category = 'YOUR_CROP_CODE';
    // const param = {
    // category: category,
    // };
    this.service.getRequestCreatorNew(route).subscribe((data: any) => {
      if (data.EncryptedResponse.status_code === 200) {
        this.varietyCategories = data.EncryptedResponse.data;
        console.log("categortData A;lllll====", this.varietyCategories);
      }
    })
  }

  varietySubmission() {
    console.log('addVariety============', this.ngForm.value);
    const route = 'add-crop-veriety-submission';
    const param = {
    };
    this.service.postRequestCreator(route, null, param).subscribe((data: any) => {
      if (data.EncryptedResponse.status_code === 200) {
        // this.varietyCategories = data.EncryptedResponse.data;
        // this.varietyList = data.EncryptedResponse.data;
        this.addVarietySubmission = data.EncryptedResponse.data;
      }
      console.log('addSubmission=======', this.addVarietySubmission);
    })
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: ['', [Validators.required]],
      crop_name: ['', [Validators.required]],
      crop_code: [''],
      variety_code: ['', [Validators.required]],
      variety_name: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      notification_date: [''],
      notification_number: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      meeting_number: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      notified: [''],
      year_release: [''],
      select_type: ['', [Validators.required]],
      developed_by: ['', [Validators.required]],
      year_of_introduction: [''],
      status_toggle: [''],
      crop_text: [''],
      crop_name_text: [''],
      variety_name_suggestion: [''],
      var_name: [''],
      line_variety_name: [''],
      category: [''],
      perental_line_array: this.fb.array([this.bsp2arr()]),
      // perental_line_array
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe((newValue) => {
      // console.log(response)
      let data = this.cropGropDataSecond;
      console.log(data, 'data');

      if (newValue) {
        // this.getCropData()
        this.cropGroupData = this.cropGropDataSecond;
        let response = this.cropGroupData.filter((x) =>
          x.group_name.toLowerCase().startsWith(newValue.toLowerCase())
        );
        this.cropGroupData = response;
      } else {
        // this.getCropData()
      }
    });
    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          console.log(newValue);
          this.crop_NameData = this.cropNameDataSecond;
          let response = this.crop_NameData.filter((x) =>
            x.crop_name.toLowerCase().startsWith(newValue.toLowerCase())
          );
          this.crop_NameData = response;
        } else {
          this.getCroupNameList(this.group_code);
        }
      }
    );
    this.ngForm.controls['crop_name'].valueChanges.subscribe(
      newValue => {
        if (!this.isEdit && !this.isView)
          this.getDynamicVarietyCode(newValue)
      }
    )
    //formcontroll implemetation

    if (this.route.url.includes('view')) {
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.submitHide = false;
      this.ngForm.controls['crop_group'].disable();
      this.ngForm.controls['crop_name'].disable();
      this.ngForm.controls['select_type'].disable();
      this.ngForm.controls['developed_by'].disable();
      this.ngForm.controls['variety_name'].disable();
      this.ngForm.controls['variety_code'].disable();
      this.ngForm.controls['notification_number'].disable();
      this.ngForm.controls['meeting_number'].disable();
      this.ngForm.controls['year_release'].disable();
      this.ngForm.controls['status_toggle'].disable();
      this.ngForm.controls['notified'].disable();
      // this.ngForm.disable();
      this.disabled = true;
      // ( document.getElementById("specifyColorNotidied")as HTMLInputElement).disabled = true
    }

    if (this.route.url.includes('edit')) {
      this.disabledfield = false;
      this.cancelbtn = true;
      this.isEdit = true;
      this.disabled = false;
      this.ngForm.controls['variety_code'].disable();
      // this.enable = false;
    }

    this.ngForm.controls['crop_group'].valueChanges.subscribe((newValue) => {
      // this.getCropCode(newValue);
      if (this.ngForm.controls['crop_name'].value) {
        this.ngForm.controls['crop_name'].setValue('');
        this.crop_names = '';
        this.ngForm.controls['crop_code'].setValue('');
        this.cropCode = '';
        this.getCropNameData();
      }
    });
    this.ngForm.controls['notification_date'].valueChanges.subscribe(
      (newValue) => {
        // this.getCropCode(newValue);
      }
    );
    if (!this.route.url.includes('view')) {
      this.ngForm.controls['crop_name'].valueChanges.subscribe((newValue) => {
        this.getCropCode(newValue);
        this.loadVarietyList(newValue, 0);
      });
    }
    this.ngForm.controls['year_release'].valueChanges.subscribe((newValue) => {
      // this.getCropCode(newValue);
      if (newValue) {
      }
    });

    if (!this.route.url.includes('view')) {
      this.ngForm.controls['variety_name'].valueChanges.subscribe(
        (newValue) => {
          if (newValue) {
            this.alreadyExistsMsg = '';
            this.searchVarietyName(newValue);
          }
          // // this.onBlurCropName(newValue)
          // }
        }
      );
    }
    if (!this.route.url.includes('edit') && !this.route.url.includes('view')) {
      this.notified_code = 1;
    }
  }

  ngOnInit(): void {
    this.varietyCategories = [];
    this.addVarietySubmission = [
      this.varietyCategories = this.varietyCategories,
      this.varietyList = this.varietyList,
    ];
    // console.log('bsp2arr========',this.ngForm.get('bsp2Arr') as FormArray);
    // console.log('kfjdfjsdfkd=====',this.ngForm.get('bsp2Arr'));
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'category',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };
    this.loadCategory();
    console.log('categoryData=======', this.loadCategory)
    this.varietySubmission();
    this.createEnrollForm();
    this.apiCall();
    this.createYearRange(1950, this.todayDate.getFullYear());
    this.ngForm.controls['variety_code'].disable();
    this.submissionid = this.router.snapshot.paramMap.get('submissionId');
    //get user id from localstorage
    let user = localStorage.getItem('BHTCurrentUser');
    this.ngForm.controls['variety_name_suggestion'].disable();
    this.userId = JSON.parse(user);
    this.showNgContainer = false;
  }

  // defaultMonth: IMyDefaultMonth = {
  // defMonth: this.generateDefaultMonth,
  // overrideSelection: false
  // };

  // get generateDefaultMonth(): string {
  // let date = subtractFromDate(this.todaysDate, 18, 0);

  // return date.year + '-'
  // + (date.month > 9 ? "" : "0") + date.month + '-'
  // + (date.day > 9 ? "" : "0") + date.day;
  // }

  async apiCall() {
    await this.getCropData();
    // await this.getCropNameData();
    this.UserId = this.router.snapshot.paramMap.get('submissionid');
    this.ngForm.controls['notified'].setValue(1);
  }

  notified(item: any) {
    this.ngForm.controls['notified'].setValue(item);

    if (parseInt(item) === 0) {
      this.yearofIntroduction = true;
      this.ngForm.controls['year_of_introduction'].setValidators(
        Validators.required
      );
      this.ngForm.controls['notification_date'].setValue('');
      this.ngForm.controls['notification_number'].setValue('');
      this.ngForm.controls['meeting_number'].setValue('');
      this.ngForm.controls['year_release'].setValue('');
    }
    if (parseInt(item) === 1) {
      this.yearofIntroduction = false;
      this.ngForm.controls['notification_date'].setValidators(
        Validators.required
      );
      this.ngForm.controls['notification_number'].setValidators(
        Validators.required
      );
      this.ngForm.controls['meeting_number'].setValidators(Validators.required);
      this.ngForm.controls['year_release'].setValidators(Validators.required);
      this.ngForm.controls['year_of_introduction'].setValue('');
    }
  }

  // cropGroup(item:any){
  // this.ngForm.controls['crop_group'].setValue(item);
  // }

  cropName(item: any) {
    this.crop_names = item.crop_name;
    this.cropCode = item.crop_code;
    this.ngForm.controls['crop_name_text'].setValue('');
    this.ngForm.controls['crop_name'].setValue(this.cropCode);
  }

  getIPAddress() {
    this.http
      .get('https://api.ipify.org/?format=json')
      .subscribe((res: any) => {
        this.ipAddres = res.ip;
        console.log('ip=======address', this.ipAddres);
      });
  }

  audtiTrailsHistory(historyData) {
    this._service
      .postRequestCreator('audit-trail-history', null, {
        action_at: historyData.action,
        action_by: this.userId.name,
        application_id: '1234',
        column_id: this.submissionid ? this.submissionid : '',
        comment: historyData.comment,
        form_type: historyData.formType,
        ip: this.ipAddres,
        mac_number: '12345678',
        table_id: this.submissionid ? this.submissionid : '',
      })
      .subscribe((res) => { });
  }

  selectType(value: any) {
    this.ngForm.controls['select_type'].setValue(value);
    if(!this.route.url.includes('edit')){

      while (this.employees().controls.length !== 1) {
        this.employees().removeAt(0);
      }
      this.ngForm.controls['perental_line_array']['controls'][0].controls['other_option'].setValue('',{eventEmit :false})
    }
    // else if(this.route.url.includes('edit')){
    //  if(value=='Variety'){
    //   while (this.employees().controls.length !== 1) {
    //     this.employees().removeAt(0);
    //   }
    //   this.ngForm.controls['perental_line_array']['controls'][0].controls['other_option'].setValue('',{eventEmit :false})
    //  }
    // }
    // const itemsArray = this.ngForm.get('perental_line_array') as FormArray;
    // itemsArray.clear();
  }

  developedBy(item: any) {
    if (!item) {
      this.developedBy_error = 'Please Select Developed By';
    }
    this.ngForm.controls['developed_by'].setValue(item);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.enrollFormGroup.controls;
  }

  // get enrollFormControl(): { [key: string]: AbstractControl } {
  // return this.enrollFormGroup.controls;
  // }

  cropGroup(item: any) {
    this.ngForm.controls['crop_text'].setValue('');
    this.crop_groups = item.group_name;
    this.group_code = item.group_code;
    this.ngForm.controls['crop_group'].setValue(this.crop_groups);
    this.getCroupNameList(item.group_code);
  }

  getCroupNameList(newValue: any) {
    // this.selectCrop_group = "";
    const route = 'getdistinctCropNameInVariety';
    const search = {
      search: {
        group_code: newValue,
        view: this.isView ? this.isView : '',
      },
    };
    this._service
      .postRequestCreator(route, search)
      .subscribe((apiResponse: any) => {
        if (
          apiResponse &&
          apiResponse.EncryptedResponse &&
          apiResponse.EncryptedResponse.status_code &&
          apiResponse.EncryptedResponse.status_code == 200
        ) {
          // this.isCropName = true;
          // this.crop_name_list = apiResponse.EncryptedResponse.data;
          this.crop_NameData = apiResponse.EncryptedResponse.data;
          this.cropNameDataSecond = apiResponse.EncryptedResponse.data;
          //

          // this.cropNameData = resultData;
        }
      });
  }

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  enrollFormSave() {
    this.submitted = true;
    if (
      !this.ngForm.controls['crop_group'].value ||
      !this.ngForm.controls['crop_name'].value ||
      !this.ngForm.controls['variety_name'].value ||
      !this.ngForm.controls['variety_code'].value ||
      this.errorMsg == true ||
      this.ngForm.controls['variety_name'].value.split(' ').join('').length <=
      0 ||
      this.ngForm.controls['select_type'].status == 'INVALID' ||
      this.ngForm.controls['developed_by'].status == 'INVALID' 
    || !this.ngForm.controls['category'].value ||
    this.ngForm.controls['category'].value.length<1
    ) {
      return;
    }

    if (!this.ngForm.controls['developed_by'].value || !this.ngForm.controls['select_type'].value) {
      return;
    }

    if (parseInt(this.ngForm.controls['notified'].value) === 0) {
      this.year_of_introduction_variet =
        this.ngForm.controls['year_of_introduction'].value.singleDate.jsDate;
      if (!this.ngForm.controls['year_of_introduction'].value.singleDate.jsDate) {
        return;
      }
      // const year_of_introduction = this.ngForm.controls["year_of_introduction"].value.singleDate.formatted;
    }
    if (parseInt(this.ngForm.controls['notified'].value) === 1) {
      const Notdate =
        this.ngForm.controls['notification_date'].value.singleDate.jsDate;
      this.new_not_date = convertDates(Notdate);
      if (!this.new_not_date ||
        !this.ngForm.controls['notification_number'].value ||
        this.ngForm.controls['notification_number'].errors
      ) {
        return;
      }
    }

    const route = 'add-crop-veriety-submission';
    let paramparantelLine = this.ngForm.value && this.ngForm.value.perental_line_array ? this.ngForm.value.perental_line_array : '';
    if (this.ngForm.controls['select_type'].value == 'Variety') {
      paramparantelLine = [];
    }
    let datas= this.ngForm.value && this.ngForm.value.perental_line_array ?this.ngForm.value.perental_line_array :'';
      if(datas && datas.length > 0 && this.ngForm.controls['select_type'].value == 'Hybrid'){
        datas.forEach((el,i)=>{
          el.other_option.line_variety_name= el && el.line_variety_name ? el.line_variety_name :''
        })
      }
    // console.log("itemss-----", paramparantelLine);
    if(paramparantelLine && paramparantelLine.length > 0 && this.ngForm.controls['select_type'].value == 'Hybrid'){
    paramparantelLine.forEach((items, i) => {

      if (items.other_option.variety_code == "other") {
        
        items.line_variety_code = "";
        items.other = true;
        items.line_variety_name = items && items.line_variety_name ? items.line_variety_name : '';
      }
      else {
        items.other = false;
        items.other_option = items.other_option;
        //  items.line_variety_code=items.other_option;
        items.line_variety_code = items && items.other_option && items.other_option.variety_code ? items.other_option.variety_code: '';
        //  items.line_variety_name= items.other_option.line_variety_name
        items.line_variety_name = items && items.other_option && items.other_option.variety_name ? items.other_option.variety_name: '';
        // items.variety_code = this.ngForm.controls['variety_code'].value.toString(); 
      }
      items.line = i + 1
      items.variety_code = this.ngForm.controls['variety_code'].value.toString();
    })
  }
    const params = {
      crop_name: this.cropCode ? this.cropCode : '',
      crop_group_code: this.group_code ? this.group_code : '',
      variety_code: this.ngForm.controls['variety_code'].value.toString(),
      variety_name: this.ngForm.controls['variety_name'].value,
      // line_variety_code: this.ngForm.controls['other_option'].value.toString(),
      // line_variety_name: this.ngForm.controls['variety_name'].value 
      // .replace(/\s+/g, ' ')
      // .trim(),
      notified: this.ngForm.controls['notified'].value,
      notification_date:
        parseInt(this.ngForm.controls['notified'].value) === 1
          ? convertDates(this.ngForm.controls['notification_date'].value.singleDate.jsDate
          ) : '', notified_number: this.ngForm.controls['notification_number'].value.toString(),
      meeting_number: this.ngForm.controls['meeting_number'].value,
      year_of_release: this.ngForm.controls['year_release'].value,
      select_type: this.ngForm.controls['select_type'].value,
      developed_by: this.ngForm.controls['developed_by'].value,
      // 'is_notified'
      year_of_introduction: this.year_of_introduction_variet,
      active: 1,
      perental_line_array: paramparantelLine,
      category_array: this.ngForm.value.category,
      loginedUserid: {
        id: this.userId.id
      }
    };
    console.log(params,'leins')
    this._service.postRequestCreator(route, params).subscribe((result) => {
      if (result.EncryptedResponse.status_code === 200) {
        this.historyData.action = 'Add';
        this.historyData.comment = 'Add Form successfully';
        this.historyData.formType = 'Crop-Variety';
        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title:
            '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15',
        }).then((x) => {
          this.route.navigate(['/add-crop-notified-list']);
        });
      } else if (result.EncryptedResponse.status_code === 409) {
        Swal.fire({
          title: '<p style="font-size:25px;">Variety Name Already Exists.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15',
        });
      }
    });
  }

  async getCropData() {
    const route = 'crop-group';
    const params = {};
    this._service.postRequestCreator(route, params).subscribe((result) => {
      if (result.EncryptedResponse.status_code === 200) {
        this.cropGroupData =
          result && result.EncryptedResponse && result.EncryptedResponse.data
            ? result.EncryptedResponse.data
            : '';
        this.cropGropDataSecond = this.cropGroupData;
        if (this.isEdit || this.isView) {
          this.getCropNameData();
        }
      }
    });
  }

  async getCropNameData() {
    const route = 'get-crop-list';
    const params = {};
    this._service.postRequestCreator(route, params).subscribe((result) => {
      if (result.EncryptedResponse.status_code === 200) {
        this.cropNameData =
          result &&
            result.EncryptedResponse &&
            result.EncryptedResponse.data &&
            result.EncryptedResponse.data
            ? result.EncryptedResponse.data.rows
            : '';
        if (this.UserId) {
          this.getVerietyNameData();
        }
        this.ngForm.controls['variety_code'].disable();
      }
    });
  }

  async getVerietyNameData() {
    const route = 'get-crop-veriety-data';
    const params = {
      search: {
        id: this.UserId ? this.UserId : '',
        view: this.isView ? this.isView : this.isEdit,
      },
    };
    this._service.postRequestCreator(route, params).subscribe((result) => {
      if (result.EncryptedResponse.status_code === 200) {
        this.verietyData =
          result && result.EncryptedResponse && result.EncryptedResponse.data
            ? result.EncryptedResponse.data
            : '';
        console.log("Variety DATA (---->>>><<<<<)", this.verietyData)
        if (this.verietyData && this.verietyData.rows[0]) {
          let datas = this.cropGroupData.filter(
            (x) => x.group_code == this.verietyData.crop_group_code
          );

          // crop_group_code
          this.crop_groups =
            this.verietyData &&
              this.verietyData.rows[0].m_crop &&
              this.verietyData.rows[0].m_crop.m_crop_group &&
              this.verietyData.rows[0].m_crop.m_crop_group.group_name
              ? this.verietyData.rows[0].m_crop.m_crop_group.group_name
              : this.verietyData &&
                this.verietyData.rows[0] &&
                this.verietyData.rows[0].m_crop &&
                this.verietyData.rows[0].m_crop.m_crop_group &&
                this.verietyData.rows[0].m_crop.m_crop_group.group_name
                ? this.verietyData.rows[0].m_crop.m_crop_group.group_name
                : '';
          //date transform
          this.date = this.verietyData.rows[0].release_date;
          let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
          let date1 = this.verietyData.rows[0].not_date;
          let convert_new_notDate = convertDatetoDDMMYYYY(date1);
          // convertDatetoDDMMYYYY
          // let latest_date1 = this.datepipe.transform(date1, 'yyyy-MM-dd');
          let crpName = this.cropNameData.filter(
            (x: { crop_code: any }) =>
              x.crop_code == this.verietyData.rows[0].crop_code
          );
          this.crop_names =
            crpName[0] && crpName[0].crop_name ? crpName[0].crop_name : '';
          this.crop_names =
            this.verietyData &&
              this.verietyData.rows[0] &&
              this.verietyData.rows[0].m_crop &&
              this.verietyData.rows[0].m_crop.crop_name
              ? this.verietyData.rows[0].m_crop.crop_name
              : '';
          console.log(this.crop_names);
          this.ngForm.controls['crop_group'].patchValue(
            this.verietyData &&
              this.verietyData.rows[0] &&
              this.verietyData.rows[0].m_crop &&
              this.verietyData.rows[0].m_crop.m_crop_group &&
              this.verietyData.rows[0].m_crop.m_crop_group.group_code
              ? this.verietyData.rows[0].m_crop.m_crop_group.group_code
              : ''
          );
          this.getCroupNameList(
            this.verietyData &&
              this.verietyData.rows[0] &&
              this.verietyData.rows[0].m_crop &&
              this.verietyData.rows[0].m_crop.m_crop_group &&
              this.verietyData.rows[0].m_crop.m_crop_group.group_code
              ? this.verietyData.rows[0].m_crop.m_crop_group.group_code
              : ''
          );
          this.ngForm.controls['crop_code'].patchValue(
            this.verietyData.rows[0].crop_code
          );
          this.ngForm.controls['meeting_number'].patchValue(
            this.verietyData.rows[0].meeting_number
          );

          this.ngForm.controls['notification_number'].patchValue(
            this.verietyData &&
              this.verietyData.rows[0] &&
              this.verietyData.rows[0].not_number
              ? this.verietyData.rows[0].not_number
              : ''
          );
          // this.ngForm.controls['notification_date'].patchValue(this.verietyData.rows[0].not_date);

          this.ngForm.controls['notification_date'].patchValue({
            dateRange: null,
            isRange: false,
            singleDate: {
              formatted: this.verietyData.rows[0].not_date,
              jsDate: new Date(this.verietyData.rows[0].not_date),
            },
          });
          //consolelog('this.ngForm.controls',this.ngForm.controls['notification_date'].value);

          this.ngForm.controls['year_release'].patchValue(
            this.verietyData.rows[0].release_date
          );
          this.ngForm.controls['year_of_introduction'].patchValue({
            dateRange: null,
            isRange: false,
            singleDate: {
              formatted: this.verietyData.rows[0].introduce_year,
              jsDate: new Date(this.verietyData.rows[0].introduce_year),
            },
          });
          // this.ngForm.controls['year_of_introduction'].patchValue(this.verietyData.rows[0].introduce_year);
          this.ngForm.controls['select_type'].setValue(
            this.verietyData.rows[0].type
          );
          this.ngForm.controls['notified'].setValue(
            this.verietyData.rows[0].is_notified
          );
          //pathvalue implementation
          if (this.verietyData.rows[0].is_active == 0) {
            this.ngForm.controls['status_toggle'].patchValue(false);
            this.isShowDiv = true;
            this.isActive = 0;
          }
          if (this.verietyData.rows[0].is_active == 1) {
            this.isShowDiv = false;
            this.ngForm.controls['status_toggle'].patchValue(true);
            this.isActive = 1;
          }
          //finish isActive toggle
          if (parseInt(this.verietyData.rows[0].is_notified) === 1) {
            this.yearofIntroduction = false;
          }
          if (parseInt(this.verietyData.rows[0].is_notified) === 0) {
            this.yearofIntroduction = true;
          }

          this.notified_code = parseInt(this.verietyData.rows[0].is_notified);
          // notified
          this.ngForm.controls['developed_by'].setValue(
            this.verietyData.rows[0].developed_by
          );
          this.group_code = this.verietyData.rows[0].crop_group_code;

          this.ngForm.controls['crop_name'].patchValue({
            name:
              this.verietyData &&
                this.verietyData.rows[0] &&
                this.verietyData.rows[0].m_crop &&
                this.verietyData.rows[0].m_crop.crop_name
                ? this.verietyData.rows[0].m_crop.crop_name
                : '',
            value:
              this.verietyData &&
                this.verietyData.rows[0] &&
                this.verietyData.rows[0].crop_code
                ? this.verietyData.rows[0].crop_code
                : '',
          });
          this.cropCode = this.verietyData.rows[0].crop_code;
          this.ngForm.controls['variety_code'].patchValue(
            this.verietyData.rows[0].variety_code
          );

          this.ngForm.controls['variety_name'].setValue(
            this.verietyData.rows[0].variety_name
          );
          this.variety_name_value = this.verietyData.rows[0].variety_name;
          let notified = this.verietyData.rows[0].is_notified;
          let const_array = [];
          this.verietyData.rows[0].category.forEach((items) => {
            items["id"] = items["m_variety_category_id"]
            items["category"] = items["m_variety_category"].category
            const_array.push(items)
            console.log(" items[id]", items["id"])
            // return items
          })
          if (const_array && const_array.length > 0) {

            const_array = const_array.filter((arr, index, self) =>
              index === self.findIndex((t) => (t.m_variety_category_id === arr.m_variety_category_id && t.category === arr.category)))
          }

          this.ngForm.controls['category'].patchValue(const_array);
          // this.loadVarietyList(this.ngForm.controls['crop_name'].value.value, 0 );
          let varietyLines = this.verietyData.rows[0].m_variety_lines;
          // let varietyLines2 = this.verietyData.rows[0].result;
          // varietyLines2= varietyLines2 ? varietyLines2.flat():''
          // console.log("this.verietyData.rows[0]",varietyLines2)
          console.log("varietyLines", varietyLines)
          // varietyLines = varietyLines.map(obj => {
          //  const match = varietyLines2.find(obj2 => obj2.line_variety_code === obj.line_variety_code);
          //  // console.log("match match", match)
          //  if (match && match != undefined && match != '') {
          //    // console.log("match match111", match)
          //    return {
          //      ...obj,
          //      line_variety_name: match.line_variety_name
          //    };
          //  }
          //  return obj;
          //  });
          //  console.log('varietyLines===========>',varietyLines)
          const formArray2 = this.ngForm.get('perental_line_array') as FormArray;
          if (varietyLines && varietyLines.length > 0) {
            for (let i = 1; i <= varietyLines.length - 1; i++) {
              this.addMore2(i)
              // this.ngForm.controls['perental_line_array']['controls'][i].controls['other_option'].setValue(line.line_variety_code)
            }
          }
          const formArray = this.ngForm.get('perental_line_array') as FormArray;
          if (varietyLines && varietyLines.length > 0) {
            varietyLines.forEach((line, i) => {
              // if(i>1){
              // if(i<(varietyLines.length-1)){
              this.loadVarietyList(this.ngForm.controls['crop_name'].value.value, i);
              // this.ngForm.controls['perental_line_array']['controls'][i].controls['other_option'].patchValue(line && line.line_variety_code ? line.line_variety_code:'');
              // }
              // }
            })
            varietyLines.forEach((el,i)=>{
              el.variety_name = el && el.line_variety_name ? el.line_variety_name :'';
            })
          }
          // Iterate over varietyLines and add form groups to the form array
          varietyLines.forEach((line, i) => {
            // this.filterVariety(i)
            this.ngForm.controls['perental_line_array']['controls'][i].controls['other_option'].patchValue(line);
            // if(formArray.controls && formArray.controls[i-1] && formArray.controls[i-1]['controls'] && formArray.controls[i-1]['controls']['other_option'] && formArray.controls[i-1]['controls']['other_option'].varietyList && formArray.controls[i-1]['controls']['other_option'].varietyList.length>0)
            // {
            //  formArray.controls[i-1]['controls']['other_option'].varietyList = 
            //  formArray.controls[i-1]['controls']['other_option'].varietyList.filter(obj =>
            // obj.variety_code!= line.line_variety_code)
            // console.log(line.line_variety_code,'line.line_variety_code')
            // console.log(  formArray.controls[i-1]['controls']['other_option'].varietyList)
            //   }

            this.ngForm.controls['perental_line_array']['controls'][i]['controls']['line_variety_name'].setValue(line && line.line_variety_name ? line.line_variety_name : '')

            if (line && !line.line_variety_name && line.line_variety_name == "") {
              // this.ngForm.controls['perental_line_array']['controls'][i].controls['other_option'].patchValue(line && line.line_variety_code ? line.line_variety_code :'');
            }
            else {
              // this.ngForm.controls['perental_line_array']['controls'][i].controls['other_option'].patchValue("other");
              // this.ngForm.controls['perental_line_array']['controls'][i].controls['line_variety_name'].patchValue(line.line_variety_name);
            }
            // console.log("3333--->>>>>>>><<<",this.ngForm.controls['perental_line_array']['controls'][0]['controls']['other_option'].varietyList);
          });
        }
      }
    });
  }

  updateForm() {
    this.submitted = true;
    if (
      !this.ngForm.controls['crop_group'].value ||
      !this.ngForm.controls['crop_name'].value ||
      !this.ngForm.controls['variety_name'].value ||
      !this.ngForm.controls['variety_code'].value ||
      this.errorMsg == true
    ) {
      return;
    }
    // if (this.ngForm.invalid) {
    // return;
    // }
    if (parseInt(this.ngForm.controls['notified'].value) === 0) {
      this.year_of_introduction_variet =
        this.ngForm.controls['year_of_introduction'].value.singleDate.jsDate;
      if (
        !this.ngForm.controls['year_of_introduction'].value.singleDate.jsDate
      ) {
        return;
      }
    }
    if (parseInt(this.ngForm.controls['notified'].value) === 1) {
      const convert_date = convertDates(
        this.ngForm.controls['notification_date'].value.singleDate.jsDate
      );
      //consolelog('convert_date',convert_date);
      if (
        !this.ngForm.controls['notification_date'].value.singleDate.jsDate ||
        !this.ngForm.controls['notification_number'].value
      ) {
        return;
      }
    }
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    } else {
      this.isActive = 0;
    }

    const route = 'update-crop-veriety-submission';
    let paramparantelLine = this.ngForm.value && this.ngForm.value.perental_line_array ? this.ngForm.value.perental_line_array : '';
    if (this.ngForm.controls['select_type'].value == 'Variety') {
      paramparantelLine = [];
    }
    //  paramparantelLine.forEach((items, i) => { 
    //  if(items.other_option == "other")
    //  {
    //  items.line_variety_code = "";
    //  items.other = true; 
    //  }
    //  else
    //  {
    //  items.other = false;
    //  items.other_option = items.other_option ;
    //  items.line_variety_code = items.other_option; 
    //  // items.variety_code = this.ngForm.controls['variety_code'].value.toString(); 
    //  }
    // paramparantelLine.forEach((items, i) => { 
    //   if(items.other_option.line_variety_name == "other")
    //   {
    //   items.line_variety_code = "";
    //   items.other = true; 
    //   items.line_variety_name= items && items.line_variety_name ? items.line_variety_name :'';
    //   }
    //   else
    //   {
    //   items.other = false;
    //   items.other_option = items.other_option ;
    //   items.line_variety_code = items.other_option.variety_code; 
    //  //  items.line_variety_name= items.other_option.line_variety_name
    //   // items.variety_code = this.ngForm.controls['variety_code'].value.toString(); 
    //   }
    // paramparantelLine.forEach((items, i) => {
    //   if (items.other_option == "other") {
    //     items.line_variety_code = "";
    //     items.other = true;
    //     items.line_variety_name = items && items.line_variety_name ? items.line_variety_name : '';
    //   }
    //   else {
    //     items.other = false;
    //     items.other_option = items.other_option;
    //     //  items.line_variety_code=items.other_option;
    //     console.log("items.line_variety_name===", items.line_variety_name);
    //     items.line_variety_code = items.other_option;
    //     // items.line_variety_name=  items && items.line_variety_name ? items.line_variety_name :'';
    //     //  items.line_variety_name= items.other_option.line_variety_name
    //     // items.variety_code = this.ngForm.controls['variety_code'].value.toString(); 
    //   }
    //   items.line = i + 1
    //   items.variety_code = this.ngForm.controls['variety_code'].value.toString();
    // })
        // datas.forEach((el,i)=>{
        //   el.other_option.line_variety_name= el && el.line_variety_name ? el.line_variety_name :''
        //   el.other_option.line_variety_code= el && el.other_option.line_variety_code ?el && el.other_option && el.other_option.variety_code :el && el.other_option.variety_code ? el.other_option.variety_code :'' 
        // })
    if(paramparantelLine && paramparantelLine.length > 0 && this.ngForm.controls['select_type'].value == 'Hybrid'){

    paramparantelLine.forEach((items, i) => {

      if (items.other_option.variety_code == "other") {
        
        items.line_variety_code = "";
        items.other = true;
        items.line_variety_name = items && items.line_variety_name ? items.line_variety_name : '';
      }
      else {
        items.other = false;
        items.other_option = items.other_option;
        //  items.line_variety_code=items.other_option;
        items.line_variety_code = items && items.other_option && items.other_option.line_variety_code ? items.other_option.line_variety_code: items && items.other_option && items.other_option.variety_code ? items.other_option.variety_code:'';
        //  items.line_variety_name= items.other_option.line_variety_name
        items.line_variety_name = items && items.other_option && items.other_option.variety_name ? items.other_option.variety_name: '';
        // items.variety_code = this.ngForm.controls['variety_code'].value.toString(); 
      }
      items.line = i + 1
      items.variety_code = this.ngForm.controls['variety_code'].value.toString();
    })
  }
    const params = {
      id: this.UserId ? this.UserId : '',
      crop_group: this.group_code ? this.group_code : '',
      crop_name: this.cropCode ? this.cropCode : '',
      variety_code: this.ngForm.controls['variety_code'].value.toString(),
      variety_name: this.ngForm.controls['variety_name'].value
        .replace(/\s+/g, ' ')
        .trim(),
      notified: this.ngForm.controls['notified'].value,
      notification_date:
        parseInt(this.ngForm.controls['notified'].value) === 1
          ? convertDates(
            this.ngForm.controls['notification_date'].value.singleDate.jsDate
          )
          : '',
      notified_number:
        this.ngForm.controls['notification_number'].value.toString(),
      meeting_number: this.ngForm.controls['meeting_number'].value.toString(),
      year_of_release: this.ngForm.controls['year_release'].value,
      introduce_year:
        parseInt(this.ngForm.controls['notified'].value) === 0
          ? convertDates(
            this.ngForm.controls['year_of_introduction'].value.singleDate
              .jsDate
          )
          : '',
      select_type: this.ngForm.controls['select_type'].value,
      developed_by: this.ngForm.controls['developed_by'].value,
      active: this.isActive,
      // 'submission_id':this.submiss
      perental_line_array: paramparantelLine,
      category_array: this.ngForm.value.category,
      loginedUserid: {
        id: this.userId.id
      }
    };
    console.log("PAram Update", params)
    this._service.postRequestCreator(route, params).subscribe((result) => {
      console.log(result.EncryptedResponse.status_code);
      if (result.EncryptedResponse.status_code === 200) {
        // alert("hiii");
        this.historyData.action = 'Updated';
        this.historyData.comment = 'Update Form successfully';
        this.historyData.formType = 'Crop-Variety';
        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title:
            '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15',
        }).then((x) => {
          this.route.navigate(['/add-crop-notified-list']);
        });

        // this.route.navigate('add-crop-notified-list')
      } else if (parseInt(result.EncryptedResponse.status_code) == 409) {
        Swal.fire({
          title: '<p style="font-size:25px;">Variety Name Already Exists.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15',
        });
      } else {
        Swal.fire({
          title: 'Oops',
          text: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15',
        });
      }
    });
  }

  getCropData1() {
    const route = 'get-crop-group';
    const params = {};
    this._service.postRequestCreator(route, params).subscribe((result) => {
      if (result.EncryptedResponse.status_code === 200) {
        this.cropGroupData =
          result && result.EncryptedResponse && result.EncryptedResponse.data
            ? result.EncryptedResponse.data : '';
      }
    });
  }

  getVerietyNameData1() {
    const route = 'get-crop-veriety-data';
    const params = {
      search: {
        id: this.UserId ? this.UserId : '',
      },
    };
    this._service.postRequestCreator(route, params).subscribe((result) => {
      if (result.EncryptedResponse.status_code === 200) {
        this.verietyData =
          result && result.EncryptedResponse && result.EncryptedResponse.data
            ? result.EncryptedResponse.data : '';
        if (
          this.verietyData &&
          this.verietyData.rows &&
          this.verietyData.rows[0]
        ) {
          let datas = this.cropGroupData.filter(
            (x) => x.group_code == this.verietyData.rows[0].crop_group_code
          );

          this.crop_groups =
            datas && datas[0] && datas[0].group_name ? datas[0].group_name : '';
          this.crop_names =
            this.verietyData &&
              this.verietyData.rows &&
              this.verietyData.rows[0] &&
              this.verietyData.rows[0].crop_code
              ? this.verietyData.rows[0].crop_code
              : '';
          let crpName = this.cropNameData.filter(
            (x: { crop_code: any }) =>
              x.crop_code == this.verietyData.rows[0].crop_code
          );

          this.ngForm.controls['crop_group'].setValue(
            this.verietyData.rows[0].crop_group_code
          );
          // this.ngForm.controls['crop_name'].setValue(crpName[0].crop_name);
          this.ngForm.controls['variety_code'].patchValue(
            this.verietyData.rows[0].variety_code
          );
          this.ngForm.controls['variety_name'].patchValue(
            this.verietyData.rows[0].variety_name
          );
          let notified = this.verietyData.rows[0].is_notified;
          // this.ngForm.controls['notification_date'].setValue(this.verietyData.rows[0].not_date);
          this.ngForm.controls['notification_number'].patchValue(
            this.verietyData.rows[0].not_number
          );
          this.ngForm.controls['meeting_number'].patchValue(
            this.verietyData.rows[0].meeting_number
          );
          this.ngForm.controls['year_release'].patchValue(
            this.verietyData.rows[0].release_date
          );
          this.ngForm.controls['select_type'].setValue(
            this.verietyData.rows[0].type
          );
          this.ngForm.controls['developed_by'].setValue(
            this.verietyData.rows[0].developed_by
          );
        }
      }
    });
  }

  async getDynamicVarietyCode(newValue: any) {
    const searchFilters = {
      search: {
        crop_code: this.ngForm.controls['crop_name'].value,
      },
    };
    this._service
      .postRequestCreator('get-dynamic-variety-code', searchFilters, null)
      .subscribe((apiResponse: any) => {
        if (
          apiResponse &&
          apiResponse.EncryptedResponse &&
          apiResponse.EncryptedResponse.status_code &&
          apiResponse.EncryptedResponse.status_code == 200
        ) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.data = apiResponse.EncryptedResponse.data[0];
            // if (this.data.variety_code) {
            //   if (this.data.crop_code[1] == 0) {
            //     this.varietyCode = this.data.variety_code.replace(
            //       /(\d+)$/,
            //       function (match, n) {
            //         return ++n;
            //       }
            //     );
            //     this.varietyCode =
            //       this.varietyCode.substring(0, 1) +
            //       '0' +
            //       this.varietyCode.substring(1, this.varietyCode.length);
            //     this.ngForm.controls['variety_code'].patchValue(
            //       this.varietyCode
            //     );
            //   } else {
            //     this.varietyCode = this.data.variety_code.replace(
            //       /(\d+)$/,
            //       function (match, n) {
            //         return ++n;
            //       }
            //     );
            //     this.ngForm.controls['variety_code'].patchValue(
            //       this.varietyCode
            //     );
            //   }
            // }
            if (this.data.variety_code) {
              const varietyCode = this.data.variety_code;
              const cropCode = varietyCode.substring(0, 5);
              let remainingDigits = varietyCode.substring(5);
              let remainingDigitsNumber = parseInt(remainingDigits, 10);
              remainingDigitsNumber = remainingDigitsNumber + 1;
              const paddedRemainingDigits = remainingDigitsNumber.toString().padStart(3,'0');
              this.varietyCode = `${cropCode}${paddedRemainingDigits}`;
              this.ngForm.controls['variety_code'].patchValue(this.varietyCode);
            }
          } else {
            this.varietyCode = newValue + '001';
            this.ngForm.controls['variety_code'].patchValue(this.varietyCode);
          }
        }
      });
  }

  async getCropCode(newValue: any) {
    const searchFilters = {
      search: {
        crop_name: newValue,
      },
    };
    this._service
      .postRequestCreator('get-crop-code', searchFilters, null)
      .subscribe((apiResponse: any) => {
        if (
          apiResponse &&
          apiResponse.EncryptedResponse &&
          apiResponse.EncryptedResponse.status_code &&
          apiResponse.EncryptedResponse.status_code == 200
        ) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.data = apiResponse.EncryptedResponse.data[0];
            //  if (this.data) {
            //    console.log(this.data,'getDynamicVarietyCode')
            //    console.log(this.data.crop_code,'crop_code')
            //  this.cropCodeval = this.data.crop_code;
            //  this.getDynamicVarietyCode(this.cropCodeval);
            //  }
          }
        }
      });
  }

  // onBlurCropName(newValue: any) {
  //   if (newValue) {
  //     const searchFilters = {
  //       "search": {
  //         "variety_name": newValue
  //       }
  //     };
  //     this.service
  //       .postRequestCreator("check-already-exists-variety-name", null, searchFilters)
  //       .subscribe((apiResponse: any) => {
  //         if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
  //           if (apiResponse.EncryptedResponse.data.length > 0) {
  //             this.errorMsg = true;
  //             if (this.enable) {

  //               this.alreadyExistsMsg = "Variety Name Already Exists";
  //             }
  //           } else {
  //             this.errorMsg = false;
  //             this.alreadyExistsMsg = " ";
  //           }

  //         }
  //       });
  //   }
  // }

  cgClick() {
    document.getElementById('crop_group').click();
  }

  cnClick() {
    document.getElementById('crop_name').click();
  }

  year_of_release() {
    // $(document).ready(function() {
    // $('#dates').datepicker();
    // });
  }

  checkAlpha(event) {
    // if(0){
    // }
    checkAlpha(event);
  }

  checkAlphabet(event) {
    // if(0){
    // }
    checkAlphabet(event);
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  checkNumber($e) {
    checkNumber($e);
  }

  // getValue(val) {

  //   if (val) {
  //     const searchFilters = {
  //       "search": {
  //         "variety_name": val
  //       }
  //     };
  //     this.service
  //       .postRequestCreator("check-already-exists-variety-name", null, searchFilters)
  //       .subscribe((apiResponse: any) => {
  //         if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
  //           if (apiResponse.EncryptedResponse.data.length > 0) {
  //             this.errorMsg = true;
  //             if (this.enable) {
  //               this.alreadyExistsMsg = "Variety Name Already Exists";
  //             }
  //           } else {
  //             this.errorMsg = false;
  //             this.alreadyExistsMsg = " ";
  //           }

  //         }
  //       });
  //   }
  // }

  createYearRange(start: number, end: number): void {
    if (start <= end) {
      this.yearOfIndent.push({ name: start + '', value: start });
      this.yearOfIndent.sort((a, b) => b.value - a.value);
      this.createYearRange(start + 1, end);
    }
  }

  checkVarietyname() {
    this.submitted = true;
    // console.log("Dynamic Form Contrils", this.fb.array([this.bsp2arr()])) // if (this.ngForm.invalid) {
    // return;
    // }

    if (this.ngForm.controls['variety_name'].value == this.variety_name_value) {
      this.enable = false;
    }
    const param = {
      search: {
        variety_name: this.ngForm.controls['variety_name'].value,
      },
    };
    if (this.enable) {
      this._service
        .postRequestCreator('check-variety-name-already', param)
        .subscribe((apiResponse) => {
          if (
            apiResponse &&
            apiResponse.EncryptedResponse &&
            apiResponse.EncryptedResponse.data &&
            apiResponse.EncryptedResponse.data.inValid
          ) {
            // this.var = 'Crop Name Already Exists '
            this.errorMsg = true;
            // this.alreadyExistsMsg = "Variety Name Already Exists";
            Swal.fire({
              title:
                '<p style="font-size:25px;">Variety Name Already Exists.</p>',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#E97E15',
            });
          } else {
            this.errorMsg = false;
            if (this.route.url.includes('edit')) {
              this.updateForm();
            } else {
              this.enrollFormSave();
            }
          }
        });
    } else {
      this.errorMsg = false;
      if (this.route.url.includes('edit')) {
        this.updateForm();
      } else {
        this.enrollFormSave();
      }
    }
  }

  checkAlphaNumeric($event) {
    AlphaNumeric($event);
  }

  blockSpecialCharacters(e) {
    let key = e.key;
    let keyCharCode = key.charCodeAt(0);
    // 0-9
    if (keyCharCode >= 48 && keyCharCode <= 57) {
      return key;
    }
    // A-Z
    if (keyCharCode >= 65 && keyCharCode <= 90) {
      return key;
    }
    // a-z
    if (keyCharCode >= 97 && keyCharCode <= 122) {
      return key;
    }
    return false;
  }

  // todaysDate: Date = new Date();
  // parsedDate = Date.parse(this.todaysDate.toString());
  defaultMonth: IMyDefaultMonth = {
    defMonth: '',
    overrideSelection: false,
  };

  // this.generateDefaultMonth
  get generateDefaultMonth(): string {
    let date = {
      year: this.todaysDate.getFullYear(),
      month: this.todaysDate.getMonth() + 1,
      day: this.todaysDate.getDate() + 1,
    };
    //consolelog(date);
    return (
      date.year +
      '-' +
      (date.month > 9 ? '' : '0') +
      date.month +
      '-' +
      (date.day > 9 ? '' : '0') +
      date.day
    );
  }

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    disableUntil: { year: 1930, month: 1, day: null },
    disableSince: {
      year: this.todaysDate.getFullYear(),
      month: this.todaysDate.getMonth() + 1,
      day: this.todaysDate.getDate() + 1,
    },
  };

  onDateChanged(event: IMyDateModel): void {
    // date selected
  }

  preventKeyPress(event) {
    event.preventDefault();
  }

  // onPaste(event: ClipboardEvent) {
  //   if (this.ngForm.controls['variety_name'].value.length > 50) {
  //     const result = this.ngForm.controls['variety_name'].value;
  //     this.ngForm.controls['variety_name'].setValue(result.substring(0, 50))
  //   }
  // }

  onPaste(event: ClipboardEvent) {
    var alphaExp = /^[a-zA-Z]+$/;
    let clipboardData = event.clipboardData;
    this.pastedText = clipboardData.getData('text');
    console.log(this.pastedText, 'his.pastedText');

    if (this.pastedText.match(alphaExp)) {
      if (this.pastedText.length > 50) {
        this.ngForm.controls['variety_name'].setValue(
          this.pastedText.substring(0, 50).replace(/\s+/g, ' ').trim()
        );
      } else {
        this.ngForm.controls['variety_name'].setValue(
          this.pastedText.replace(/\s+/g, ' ').trim()
        );
      }
      // return true
    } else {
      // .replace(/\s+/g,'')
      event.preventDefault();
      let spouse_name = this.pastedText;
      spouse_name = this.ngForm.controls['variety_name'].value + spouse_name;
      spouse_name = spouse_name.replace(/\s+/g, ' ').trim();

      if (spouse_name.length > 50) {
        spouse_name = spouse_name.substring(0, 50);
        this.ngForm.controls['variety_name'].setValue(
          spouse_name.replace(/\s+/g, ' ').trim()
        );
      } else {
        this.ngForm.controls['variety_name'].setValue(
          spouse_name.replace(/\s+/g, ' ').trim()
        );
      }
      // return false
    }
  }
  // pasteNumber(event: ClipboardEvent, field) {
  //   var alphaExp = /^[0-9]*$/;
  //   let clipboardData = event.clipboardData
  //   this.pastedText = clipboardData.getData('text');
  //   if (this.pastedText.match(alphaExp)) {
  //     return true
  //   }
  //   else {
  //     event.preventDefault();
  //     let pastedNumber = this.pastedText.replace(/[^0-9]/g, "");
  //     pastedNumber = this.ngForm.controls[field].value + pastedNumber;
  //     pastedNumber = pastedNumber.trimStart();
  //     if (pastedNumber.length > 12) {
  //       this.ngForm.controls[field].setValue(pastedNumber.substring(0, 12))
  //     }
  //     else {
  //       this.ngForm.controls[field].setValue(pastedNumber)
  //     }
  //     return false
  //   }
  // }

  myFunction(event: ClipboardEvent) {
    this.ngForm.controls['notification_number'].value;
    if (
      this.ngForm.controls['notification_number'].value.match(/^[0-9]+$/) !=
      null
    ) {
      // return true;
    }
  }

  pasteNumber(event: ClipboardEvent) {
    var alphaExp = /^[0-9]*$/;
    let clipboardData = event.clipboardData;
    this.pastedText = clipboardData.getData('text');
    // this.ngForm.controls['notification_number'].setValue(this.pastedText.substring(0,12))
    if (this.pastedText.match(alphaExp)) {
      console.log(
        this.pastedText.length,
        'hii',
        this.ngForm.controls['notification_number'].value
      );
      if (this.pastedText.length > 12) {
        this.ngForm.controls['notification_number'].setValue(
          this.pastedText.substring(0, 12)
        );
      }
    }
  }

  pasteNumberMeetingNumber(event: ClipboardEvent) {
    var alphaExp = /^[0-9]*$/;
    let clipboardData = event.clipboardData;
    this.pastedText = clipboardData.getData('text');
    // this.ngForm.controls['notification_number'].setValue(this.pastedText.substring(0,12))
    if (this.pastedText.match(alphaExp)) {
      console.log(
        this.pastedText.length,
        'hii',
        this.ngForm.controls['meeting_number'].value
      );
      if (this.pastedText.length > 12) {
        this.ngForm.controls['meeting_number'].setValue(
          this.pastedText.substring(0, 12)
        );
      }
    }
    // else {
    // event.preventDefault();
    // let mobile = this.pastedText.replace(/[^0-9]/g, "");
    // mobile = this.ngForm.controls['notification_number'].value + mobile;
    // mobile = mobile.trimStart();
    // if(this.ngForm.controls['notification_number'].value.length>12){
    // this.ngForm.controls['notification_number'].setValue(mobile.substring(0,12))
    // }
    // // this.ngForm.controls['notification_number'].setValue(mobile)
    // return false
    // }
  }

  onPasteNumber(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = '^[0-9]$';
    let len = parseInt(length);
    let clipboardData = event.clipboardData;
    this.pastedNumber = clipboardData.getData('text');
    if (this.ngForm.get(field).value.match(alphaExp)) {
      if (this.ngForm.get(field).value.length > len) {
        const value = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(value.substring(0, len));
      } else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value);
      }
      // return true
    } else {
      event.preventDefault();

      let fieldName = this.pastedNumber
        .replace(/[^0-9\.]+/g, '')
        .replace(/^\s+|\s+$/g, '');
      let value = parseInt(length);
      fieldName = this.ngForm.get(field).value + fieldName;
      this.ngForm.get(field).setValue(fieldName.substring(0, value));

      // return false
    }
  }

  isAlfa(evt) {
    evt = evt || window.event;
    var charCode = evt.which || evt.keyCode;
    if (evt.target.selectionStart == 0 && evt.code == 'Space') {
      evt.preventDefault();
      return false;
    }
    const numCharacters = /[0-9]+/g;

    return (charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122) &&
      evt.which != 17 &&
      evt.which != 86 &&
      evt.which != 8 &&
      evt.which != 9 &&
      evt.which != 37 &&
      evt.which != 39 &&
      evt.which != 46 &&
      numCharacters.test(evt.key) == false) ||
      this.willCreateWhitespaceSequence(evt)
      ? false
      : true;
  }

  willCreateWhitespaceSequence(evt) {
    var willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {
      var elmInput = evt.currentTarget;
      var content = elmInput.value;

      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;

      willCreateWSS =
        this.isWhiteSpace(content[posStart - 1] || '') ||
        this.isWhiteSpace(content[posEnd] || '');
    }
    return willCreateWSS;
  }

  isWhiteSpace(char) {
    return /\s/.test(char);
  }

  cropFilter($event) {
    console.log($event.target.value, 'cropGroupData', this.cropGroupData);
    let value = $event.target.value;
    this.cropGroupData = this.cropGroupData.filter((item) =>
      item.group_name.toLowerCase().indexOf(value.toLowerCase())
    );
    console.log('this.cropGroupData', this.cropGroupData);
  }

  searchVarietyName(newValue) {
    if (newValue && newValue.toString().length > 2) {
      const param = {
        variety_name: newValue.toLowerCase(),
      };
      this.service
        .postRequestCreator('getVarietyNameData', null, param)
        .subscribe((data) => {
          let res =
            data && data.EncryptedResponse && data.EncryptedResponse.data
              ? data.EncryptedResponse.data
              : '';

          this.suggestedName = [];
          for (let index in res[0]) {
            this.suggestedName.push(res[0][index].variety_name);
          }
          this.ngForm.controls['variety_name_suggestion'].setValue(
            this.suggestedName
          );
        });
    } else {
      this.ngForm.controls['variety_name_suggestion'].setValue('');
    }
  }

  filterUsers(text: any) {
    text = text.target.value;
    console.log(text);
    if (text) {
      return (this.cropGroupData = this.cropGroupData.filter(function (search) {
        // console.log('searchTerm',this.cropGroupData)
        return search.group_name.startsWith(text);
      }));
    } else {
      return (this.cropGroupData = this.cropGroupData.filter(function (search) {
        // console.log('searchTerm',this.cropGroupData)
        return search.group_name != '';
      }));
    }
    // if(text){
    // let items = this.cropGroupData.filter(item => {
    // let name = item.group_name.toLocaleLowerCase();
    // text = text.toLocaleLowerCase();

    // let flag = name.startsWith(text);
    // return flag;
    // });
    // console.log(items,'item')
    // this.cropGroupData =items
    // // return (items = items.slice(0, 4));
    // }
    // else{
    // this.getCropData()
    // }
  }

  // onOtherValueChange() {
  // const selectedValue = this.ngForm.get('other_value')?.value;
  // this.ngForm.get('other_input')?.reset(); // Reset the other input when the selection changes
  // // Toggle the visibility of the input box based on the selected value
  // if (selectedValue === 'Other') {
  // this.ngForm.get('other_input')?.enable();
  // } else {
  // this.ngForm.get('other_input')?.disable();
  // }
  // }

  get otherRows() {
    return this.ngForm.get('otherRows') as FormArray;
  }

  // get otherRows2() {
  // return this.ngForm.get('otherRows2') as FormArray;
  // }

  onOtherValueChange(index: number) {
    // const selectedValue = this.otherRows.at(index).get('other_option')?.value;
    // const otherValueControl = this.otherRows.at(index).get('other_value');
    // if (selectedValue === 'Other') {
    // otherValueControl?.enable();
    // } else {
    // otherValueControl?.disable();
    // }
    // const selectedValue = this.ngForm.get('other_value')?.value;
    // if (selectedValue === 'Other') {
    // this.addNewRow();
    // } else {
    // this.clearRows();
    // }
  }

  onOtherOptionChange(index: number) {
    // this.submitForm();
    //  this.loadVarietyList(this.cropCode, index + 1);
    // console.log("!!!!!!11110000--->>>",this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].varietyList)
    if (this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].varietyList && this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].varietyList.length > 0) {
     
      let arr = this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].varietyList.filter(x => x.variety_code == this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].value)
      this.ngForm.controls['perental_line_array']['controls'][index]['controls']['line_variety_name'].setValue(arr && arr[0] && arr[0].variety_name ? arr[0].variety_name : '')
    }
    // const selectedValue = this.otherRows.at(index).get('other_option')?.value;
    // const otherValueControl = this.otherRows.at(index).get('other_value');
    // if (selectedValue === 'Other') {
    // otherValueControl?.enable();
    // } else {
    // otherValueControl?.disable();
    // }
    // if(this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].value == "other")
    // {
    // this.ngForm.controls['perental_line_array']['controls'][index]['controls']['other_option'].setValue('')
    // }

    const selectedOption = this.ngForm.get('other_option')?.value;
    // console.log(selectedOption);
    // console.log(this.ngForm.controls['bsp2Arr']['controls'][index]['controls']['other_option'].value);
  }

  showVariety() {
    // this.submitForm();
  }

  // submitForm() {
  // const requestData = this.ngForm.value;
  // const route = 'add-crop-veriety-submission';
  // this.service.postRequestCreator(route, null).subscribe((response) => {
  // // Handle the API response as need
  // console.log(response);
  // });
  // }
  // onOtherValueChange2() {
  // const selectedValue = this.ngForm.get('other_option')?.value;
  // if (selectedValue === 'other') {
  // this.addNewRow2();
  // } else {
  // this.clearRows2();
  // }
  // }

  employees() {
    return this.ngForm.get('perental_line_array') as FormArray;
  }

  addNewRow(i) {
    // this.showNgContainer = true;
    // this.showNgContainer = true;
    const newRow = this.fb.group({
      other_option: [''],
      line_variety_name: [''],
    });
    this.otherRows.push(newRow);
    // this.employees().push(this.bsp2arr());
  }

  addMore(i) {
    if(i == 2) {
      this.addMoreCount = false;
    }
    if (i < 3) {
      console.log(this.employees());
      this.showNgContainer = true;
      this.loadVarietyList(this.cropCode, i + 1);
      return this.employees().push(this.bsp2arr());
    }
  }

  addMore2(index) {
    console.log(this.employees());
    this.showNgContainer = true;
    const formArray = this.ngForm.get('perental_line_array') as FormArray;
    //  this.loadVarietyList(this.cropCode, i + 1);
    return this.employees().push(this.bsp2arr());
  }

  remove(rowIndex: number) {
    if(rowIndex < 4){
      this.addMoreCount = true;
    }
    this.employees().removeAt(rowIndex);
  }

  bsp2arr() {
    let temp = this.fb.group({
      other_option: [''],
      line_variety_name: [{ value: '', disabled: false }],
      variety_text_parental:['']
    });

    // {
    // "other": false,
    // "variety_code": "V111",
    // "line": 2,
    // "line_variety_name": "other",
    // "line_variety_code": "V123"
    // }
    return temp;
  }

  // addNewRow2() {
  // const newRow2 = this.fb.group({
  // other_option:[''],
  // });
  // this.otherRows2.push(newRow2);
  // }

  removeRow(index: number) {
    this.otherRows.removeAt(index);
  }

  // removeRow2(index: number) {
  // this.otherRows2.removeAt(index);
  // }

  clearRows() {
    while (this.otherRows.length !== 0) {
      this.otherRows.removeAt(0);
    }
  }
  cvpClick(i) {
    document.getElementById('varietyIdofparental' + i).click();
  }
  varietyParental(data, index) {  
   
    if(data && data.variety_code=='other'){
    
    }  
    console.log(data,'datas')
    this.ngForm.controls['perental_line_array']['controls'][index].controls['other_option'].setValue(data);
    this.ngForm.controls['perental_line_array']['controls'][index].controls['variety_text_parental'].setValue('');
    this.onOtherOptionChange(index)
    // this.ngForm.controls['perental_line_array']['controls'][index]['controls'].other_option.varietyList = this.varietyListSecond
    // this.ngForm.controls['bsp2Arr']['controls'][index].controls['other_option'].setValue('');
   
    // this.varietyId = data && data.id ? data.id : ''
  }
  filterVarietyName($event, i) {
    // console.log('hiii')
    if (this.ngForm.controls['perental_line_array']['controls'][i]['controls']['variety_text_parental'].value) {
      this.ngForm.controls['perental_line_array']['controls'][i]['controls'].other_option.varietyList = this.ngForm.controls['perental_line_array']['controls'][i]['controls'].other_option.varietyListSecond
      this.ngForm.controls['perental_line_array']['controls'][i]['controls'].other_option.varietyList = this.ngForm.controls['perental_line_array']['controls'][i]['controls'].other_option.varietyList.filter(x => x.variety_name.toLowerCase().includes(this.ngForm.controls['perental_line_array']['controls'][i]['controls']['variety_text_parental'].value.toLowerCase()))
    } else {
      this.loadVarietyList(this.cropCode,i)
      // this.ngForm.controls['perental_line_array']['controls'][i]['controls'].other_option.varietyList = this.ngForm.controls['perental_line_array']['controls'][i]['controls'].other_option.varietyListSecond
    }


  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  // clearRows2() {
  // while (this.otherRows2.length !== 0) {
  // this.otherRows2.removeAt(0);
  // }
  // }
}

