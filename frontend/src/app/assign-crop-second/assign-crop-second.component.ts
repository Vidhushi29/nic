import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { BreederService } from '../services/breeder/breeder.service';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { MasterService } from '../services/master/master.service';
import { NONE_TYPE } from '@angular/compiler';
@Component({
  selector: 'app-assign-crop-second',
  templateUrl: './assign-crop-second.component.html',
  styleUrls: ['./assign-crop-second.component.css'],
  encapsulation: ViewEncapsulation.None
  // encapsulation: ViewEncapsulation.None
})
export class AssignCropSecondComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsBspc: IDropdownSettings = {};
  disabledVariety = true;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  varietyList = []
  bspcList = [];
  allDataSecond = []
  yearOfIndent: any;
  seasonList: any;
  editedMode: boolean = false;
  showsecondportion = false;
  cropList: any;
  submited = false;
  showsecondtext: boolean;
  paramId: any;
  cropBasicDetails: any;
  isvariety: boolean = false;
  isSearch: boolean = true;
  userId: any;
  varietyFilterList: any;
  isFinalSubmit: boolean = true;
  isSubmit: any = false;
  unitValue: string;
  varietyCodeArr: any[] = [];
  parentalLineVariety: any;
  isPrentalLine: boolean = false;
  cropBasicDetailsSecond: any;
  varietyCode: any;
  varietyName: any;
  varietyNameLine: any;
  varietyTempValue: any;
  parentalLineVarietyLength: any;
  reasonData: any;
  selectCrop: any;
  cropListSecond: any;
  selectVariety: any;
  varietyListSecond: any[];
  varietyListData: any;
  isCropDisbled: boolean = true;
  // reasonData: any = [
  //   { id: 1011, comment: "Non availability of Nucleus Seeds", type: "ASSING_CROP" },
  //   { id: 1012, comment: "Variety Not Notified", type: "ASSING_CROP" },
  //   { id: 1013, comment: "Hybrid Not Notified", type: "ASSING_CROP" },
  //   { id: 1014, comment: "Hybrid variety-parental information missing", type: "ASSING_CROP" },
  //   { id: 1015, comment: "Seed Production Discontinued", type: "ASSING_CROP" }
  // ]

  constructor(private service: SeedServiceService, private fb: FormBuilder, private breederService: BreederService, private _masterService: MasterService) {
    this.createForm();
  }
  createForm() {
    this.ngForm = this.fb.group({
      id: new FormControl(''),
      year_of_indent: new FormControl('', [Validators.required]),
      season: new FormControl('', [Validators.required]),
      crop_name: new FormControl('', [Validators.required]),
      variety: new FormControl('', [Validators.required]),
      bspc: new FormControl(''),
      willing_to_produce: new FormControl('', [Validators.required]),
      reason: new FormControl(''),
      variety_filter: new FormControl(''),
      variety_line: new FormControl(''),
      crop_text: new FormControl(''),
      variety_text: new FormControl('')
    });

    // this.ngForm.disable();
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['variety'].disable();
    this.ngForm.controls['year_of_indent'].enable();
    this.ngForm.controls['reason'].enable();
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.showsecondportion = false
        this.varietyList = [];
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['variety_filter'].patchValue('');
        this.ngForm.controls['variety'].setValue('');
        this.varietyTempValue = "";
        this.parentalLineVarietyLength = [];
        this.selectCrop = ""
        this.selectVariety = ""
        this.getSeasonData(newValue)
        this.editedMode = false;
        this.showsecondportion = false;
        this.isSearch = true;
        this.ngForm.controls['willing_to_produce'].reset();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isCropDisbled = false;
        this.showsecondportion = false
        this.ngForm.controls['variety_filter'].patchValue('');
        this.ngForm.controls['crop_name'].enable();
        this.varietyTempValue = "";
        this.parentalLineVarietyLength = [];
        this.varietyName = ""
        this.ngForm.controls['variety'].setValue('');
        this.varietyList = [];
        this.getCropData(newValue)
        this.editedMode = false;
        this.showsecondportion = false;
        this.isSearch = true;
        this.selectCrop = ""
        this.selectVariety = ""
        this.ngForm.controls['willing_to_produce'].reset();
      }
    });

    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.showsecondportion = true;
        this.showsecondportion = false;
        // this.getVarietyData(newValue);
        // this.checkIsFinalSubmit();
        this.varietyTempValue = "";
        this.parentalLineVarietyLength = [];
        this.varietyList = [];
        this.ngForm.controls['variety_filter'].patchValue('');
        this.ngForm.controls['variety'].enable();
        this.editedMode = false;
        // this.showsecondportion = true;
        this.isSearch = true;
        this.ngForm.controls['willing_to_produce'].reset();
        if (newValue.slice(0, 1) == "A") {
          this.unitValue = "Qt";
        } else {
          this.unitValue = "Kg";
        }
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropBasicDetails = [];
        this.cropBasicDetailsSecond = [];
        if (this.varietyList) {
          let varietyStatus = this.varietyList.filter(ele => ele.variety_code == newValue)
          if (varietyStatus && varietyStatus[0] && varietyStatus[0].status == 'hybrid') {
            this.isvariety = true;
            this.cropBasicDetails = [];
            this.cropBasicDetailsSecond = [];
            this.showsecondportion = true;
            this.showsecondtext = true;

            this.varietyTempValue = newValue;
            this.isPrentalLine = true;
            this.ngForm.controls['variety_line'].enable({ emitEvent: false });
            // this.ngForm.controls['variety_line'].setValidators(Validators.required);
            this.checkParentalLineVariety(newValue);
          } else {
            // this.varietyTempValue = "";
            // this.parentalLineVarietyLength = [];
            // this.varietyList=[];
            this.isvariety = true;
            this.cropBasicDetails = [];
            this.cropBasicDetailsSecond = [];
            this.showsecondportion = true;
            this.showsecondtext = true;
            // this.ngForm.controls['variety_line'].setValidators(null);
            // this.cropBasicDetails = [];
            // this.cropBasicDetailsSecond = []
            // this.showsecondportion = true;
            // this.showsecondtext = true;
            this.isPrentalLine = false;
            this.getCropBasicDetails(newValue)
          }
        }
      }
    });

    this.ngForm.controls['variety_line'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // alert("hiii");
        this.cropBasicDetails = [];
        this.cropBasicDetailsSecond = []
        this.getCropBasicDetailsSecond(newValue);
        // this.getPageData();
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropList = this.cropListSecond
        let response = this.cropList.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))

        this.cropList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getCropData(this.ngForm.controls['season'].value)
      }
    });
    this.ngForm.controls['variety_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.varietyList = this.varietyListSecond
        let response = this.varietyList.filter(x => x.variety_name.toLowerCase().includes(newValue.toLowerCase()))

        this.varietyList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getVarietyData(this.ngForm.controls['crop_name'].value)
      }
    });

  }
  ngOnInit(): void {
    this.fetchData();
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.userId = data.id;
  }

  checkIsFinalSubmit() {
    let param = {
      year: (this.ngForm.controls["year_of_indent"].value),
      crop_code: this.ngForm.controls["crop_name"].value,
      season: this.ngForm.controls["season"].value,
      user_id: this.userId
    }
    this.breederService.postRequestCreator("check-assign-crop-variety-availability", null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        if (res.EncryptedResponse.data && res.EncryptedResponse.data[0]) {
          // this.isSubmit = res.EncryptedResponse.data.isDisable; 
          if (res.EncryptedResponse.data[0].isDisable == "true") {
            this.isSubmit = true;
            this.isFinalSubmit = true;
          } else {
            this.isSubmit = false;
            this.isFinalSubmit = false;
          }
          console.log("is final submit1 ", this.isSubmit);
        }
      }
    })
  }

  fetchData() {
    this.getBspcData();
    this.getCommentData();
    this.dropdownSettings = {
      idField: 'variety_code',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      // limitSelection: -1,
    };
    this.dropdownSettingsBspc = {
      idField: 'id',
      textField: 'agency_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      // limitSelection: -1,
    };
    this.getYearOfIndentData();
  }

  checkParentalLineVariety(newData) {
    console.log(newData);
    let route = "get-bsp-proforma-one-variety-line-data";
    let param = {
      search: {
        year: (this.ngForm.controls["year_of_indent"].value),
        crop_code: this.ngForm.controls["crop_name"].value,
        season: this.ngForm.controls["season"].value,
        // user_id: this.userId,
        variety_code: newData ? newData : ''
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.parentalLineVariety = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.parentalLineVarietyLength = this.parentalLineVariety;
    })
  }

  checkParentalLineVarietySecond(newData,line_code) {
    console.log('newData=======',newData)
    let route = "get-bsp-proforma-one-variety-line-data-second";
    let param = {
      variety_code: newData ? newData : ''
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      console.log('data.EncryptedResponse.data',data.EncryptedResponse.data);
      this.parentalLineVariety = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let varietyLineArray = this.parentalLineVariety.filter(ele => ele.line_variety_code == line_code)
      this.varietyNameLine = varietyLineArray && varietyLineArray[0] && varietyLineArray[0].line_variety_name ? varietyLineArray[0].line_variety_name : '';
      console.log('this.varietyNameLine=========0',this.varietyNameLine)
    })
  }

  getCropBasicDetails(value) {
    const param = {
      search: {
        "year": this.ngForm.controls['year_of_indent'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_name'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "variety_line": this.ngForm.controls['variety_line'].value ? this.ngForm.controls['variety_line'].value : '',
        "user_type": "pdpc"
      }
    }
    const route = "get-crop-basic-details";
    const result = this._masterService.postRequestCreator(route, null, param).subscribe(data => {
      this.cropBasicDetails = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      console.log('cropBasicDetails===', this.cropBasicDetails);
    })
  }

  getCropBasicDetailsSecond(value) {
    const param = {
      search: {
        "year": this.ngForm.controls['year_of_indent'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_name'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "variety_line": this.ngForm.controls['variety_line'].value ? this.ngForm.controls['variety_line'].value : '',
        "user_type": "pdpc"
      }
    }
    const route = "get-crop-basic-details-second";
    const result = this._masterService.postRequestCreator(route, null, param).subscribe(data => {
      this.cropBasicDetails = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      console.log('cropBasicDetails===', this.cropBasicDetails);
    })
  }
  getCommentData() {
    const route = "get-commnets-list?type=ASSING_CROP";
    this._masterService.getRequestCreatorNew(route).subscribe(data => {
      if (data['EncryptedResponse'].status_code === 200) {
        console.log('EncryptedResponse===', data['EncryptedResponse'].data);
        this.reasonData = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
      }
    })
  }
  resetForm() {
    // this.ngForm.controls['variety'].setValue('');
    // this.ngForm.controls['bspc'].setValue('');
    // if(!this.isPrentalLine){
    //   this.ngForm.controls['variety'].enable();
    //   this.ngForm.controls['variety'].setValue('');
    //   this.ngForm.controls['variety_line'].patchValue('');
    // }else{
    // }
    // this.ngForm.controls['variety'].enable();
    this.cropBasicDetails = [];
    if (this.varietyTempValue && this.parentalLineVarietyLength && this.parentalLineVarietyLength.length > 1) {
      this.isPrentalLine = true;
      this.ngForm.controls['variety'].setValue(this.varietyTempValue)
    } else {
      this.varietyTempValue = "";
      this.ngForm.controls['variety'].setValue('');
      // this.selectCrop =""
      this.selectVariety = ""
      this.isPrentalLine = false;
    }
    this.ngForm.controls['variety_line'].patchValue('');

    this.cropBasicDetailsSecond = [];
    this.editedMode = false;
    this.showsecondportion = true;

    this.ngForm.controls['reason'].setValue('');
    this.ngForm.controls['id'].setValue('');
    // this.ngForm.controls['variety_line'].setValidators(Validators.nullValidator);


    this.ngForm.controls['willing_to_produce'].setValue('');
    this.ngForm.controls['variety_filter'].patchValue('');
    this.ngForm.controls['bspc'].setValue('');
  }

  notifiedvalue(value) {
    this.ngForm.controls['willing_to_produce'].setValue(value)
    if (value == "no") {
      this.ngForm.controls['reason'].setValue('');
      this.ngForm.controls['bspc'].setValue('');
      // if (this.ngForm.controls['id'].value) {
      //   this.ngForm.controls['bspc'].setValue('');
      // }
    } else {
      // if (this.ngForm.controls['id'].value) {
      //   this.ngForm.controls['reason'].setValue('');
      // }
      this.ngForm.controls['reason'].setValue('');
      this.ngForm.controls['bspc'].setValue('');
    }
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  getYearOfIndentData() {
    const route = "get-year-assign-indenter-data";
    const result = this.breederService.postRequestCreator(route, null).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  getSeasonData(value) {
    const param = {
      year: value
    }
    const route = "get-season-assign-indenter-data";
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  getCropData(value) {
    const param = {
      "search": {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
      }
      // season: value
    }
    const route = "cropAssignIndentingDataSecond";
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.cropList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.cropListSecond = this.cropList
    })
  }

  getVarietyData(value) {
    const param = {
      search: {
        "year": this.ngForm.controls['year_of_indent'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_name'].value,
        "user_type": "pdpc",
      }
    }
    const route = "get-assign-indenter-variety-all-data";
    // const route = "get-assign-indenter-variety-data";
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 200) {
        this.varietyList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.varietyListSecond = this.varietyList
        this.varietyListData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        if (this.varietyList.length < 1 || this.varietyList === undefined || this.varietyList === null) {
          this.isFinalSubmit = false;
          this.checkIsFinalSubmit();
        } else {
          this.isFinalSubmit = true;
          // this.checkIsFinalSubmit();
        }
        console.log("this.isFinalSubmit 2", this.isFinalSubmit)
      } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 201) {
        if (this.ngForm.invalid) {
          if (this.varietyList && this.varietyList.length < 1) {
            this.isFinalSubmit = true;
          }
          Swal.fire({
            title: '<p style="font-size:25px;">No existing data found.</p>',
            icon: 'warning',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
          return;
        }
      } else {
        if (this.ngForm.invalid) {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
          return;
        }
      }
    })
  }

  getVarietyData2(value) {
    const param = {
      search: {
        "year": this.ngForm.controls['year_of_indent'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_name'].value,
        "user_type": "pdpc",
      }
    }
    const route = "get-assign-indenter-variety-all-data-second";
    // const route = "get-assign-indenter-variety-data";
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 200) {
        this.varietyList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        let varietyCodeArray = this.varietyList.filter(ele => ele.variety_code == value);
        this.varietyName = varietyCodeArray && varietyCodeArray[0] && varietyCodeArray[0].variety_name ? varietyCodeArray[0].variety_name : '';
      }
    })
  }

  getVarietyFilterData(value) {
    // Cannot GET /ms-nb-003-breeder/api/get-assign-indenter-variety-data
    const param = {
      search: {
        "year": this.ngForm.controls['year_of_indent'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_name'].value,
        "user_type": "pdpc",
        "user_id": this.userId
      }
    }
    const route = "get-assign-indenter-variety-filter-data";
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 200) {
        this.varietyFilterList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 201) {
        if (this.ngForm.invalid) {
          // Swal.fire({
          //   title: '<p style="font-size:25px;">No existing data found.</p>',
          //   icon: 'warning',
          //   confirmButtonText:
          //     'OK',
          //   confirmButtonColor: '#E97E15'
          // })
          return;
        }
      } else {
        if (this.ngForm.invalid) {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
          return;
        }
      }
    })
  }

  getWillingPrduceValue(value) {
    console.log("value", value);
  }

  getBspcData() {
    const param = {
      search: {
        // "year": this.ngForm.controls['year_of_indent'].value,
        // "season": this.ngForm.controls['year_of_indent'].value,
        // "crop_code": this.ngForm.controls['year_of_indent'].value,
        // "user_type": "pdpc"
      }
    }
    const route = "get-assign-indenter-bspc-data-willing-produce";
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.bspcList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  onSelectAll($event: any) {
    console.log('All items selected:', $event);

    if (Array.isArray($event)) {
      this.varietyCodeArr = $event.map(item => item.variety_code);
    } else if (typeof $event === 'object' && $event.variety_code) {
      this.varietyCodeArr = [$event.variety_code];
    } else if (typeof $event === 'object' && !$event.variety_code) {
      this.varietyCodeArr = $event.map(item => item.variety_code);
    } else {
      console.error('Invalid event format.');
      return;
    }
    this.getPageData();
  }

  selcetAll(event) {
    // console.log("variety",event);
    if (event && event.length > 0) {
      this.ngForm.controls["variety_filter"].patchValue(event);
      this.getPageData();
    }
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if (!this.ngForm.controls['year_of_indent'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_name'].value) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      return;
    } else {
      this.showsecondportion = true;
      this.isSearch = false;
      this.getVarietyFilterData(null);
      if (!this.varietyTempValue) {
        this.getVarietyData(null);
      }

      this.ngForm.controls['variety_filter'].enable();
      let varietyCodeArr = [];
      if (this.ngForm.controls["variety_filter"].value && this.ngForm.controls["variety_filter"].value !== undefined || this.ngForm.controls["variety_filter"].value.length > 0) {
        this.ngForm.controls["variety_filter"].value.forEach(ele => {
          varietyCodeArr.push(ele.variety_code);
        })
      }
      // this.varietyCodeArr.forEach((ele: any) => {
      //   varietyCodeArr.push(ele.variety_code);
      // });

      // console.log("varietyCodeArr",varietyCodeArr);
      this._masterService.postRequestCreator("get-assign-crop-all-data", null, {
        page: loadPageNumberData,
        // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        pageSize: 10,
        search: {
          year: (this.ngForm.controls["year_of_indent"].value),
          crop_code: this.ngForm.controls["crop_name"].value,
          variety_code_array: varietyCodeArr && (varietyCodeArr.length > 0) ? varietyCodeArr : null,
          season: this.ngForm.controls["season"].value,
          // user_id: this.userId.id
        }
      }).subscribe((apiResponse: any) => {
        console.log(apiResponse);
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 10;
          this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
          if (this.allData === undefined) {
            this.allData = [];
          }
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
    }

  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  cancelbtn() {
    // this.varietyList = [];
    this.editedMode = false;
    this.showsecondportion = false;
    this.isPrentalLine = false;
    // this.selectCrop =""
    this.selectVariety = ""
    // this.ngForm.controls['year_of_indent'].setValue('');
    // this.ngForm.controls['season'].setValue('');
    // this.ngForm.controls['crop_name'].setValue({emitEvent:true});
    // this.ngForm.controls['crop_name'].setValue('')
    this.ngForm.controls['variety'].enable();
    this.ngForm.controls['variety'].setValue('', { emitEvent: false });
    this.ngForm.controls['variety_line'].setValue('');
    this.ngForm.controls['willing_to_produce'].setValue('');
    this.ngForm.controls['bspc'].setValue('');
    this.isPrentalLine = false;
    this.cropBasicDetails = [];
    this.cropBasicDetailsSecond = [];
    this.ngForm.controls['variety'].enable();
    // if (this.varietyTempValue &&  this.parentalLineVarietyLength && this.parentalLineVarietyLength.length >1) {
    //   this.isPrentalLine = true;
    //   this.ngForm.controls['variety'].setValue(this.varietyTempValue)
    // } else {
    //   this.varietyTempValue="";
    //   this.ngForm.controls['variety'].setValue('');
    //   this.isPrentalLine = false;
    // }

    // this.ngForm.reset();
  }

  patchData(filterData) {

    this.editedMode = true;
    this.showsecondportion = true;
    this.ngForm.controls['variety'].disable();
    this.getVarietyData2(filterData.variety_code);
    this.checkParentalLineVarietySecond((filterData && filterData.variety_code ? filterData.variety_code : null),(filterData && filterData.line_variety_code ? filterData.line_variety_code:null))
    this.ngForm.controls['id'].patchValue(filterData && filterData.id ? filterData.id : '');
    this.ngForm.controls['year_of_indent'].patchValue(filterData && filterData.year ? filterData.year : '', { emitEvent: false });
    this.ngForm.controls['season'].patchValue(filterData && filterData.season_code ? filterData.season_code : '', { emitEvent: false });
    this.ngForm.controls['crop_name'].patchValue(filterData && filterData.crop_code ? filterData.crop_code : '', { emitEvent: false });
    // if (filterData && filterData.variety_code) {
    //   this.varietyCode = filterData.variety_code;
    // }
    if (filterData.willing_to_praduced == 1) {
      this.ngForm.controls['willing_to_produce'].setValue("yes")
      this.ngForm.controls['bspc'].patchValue(filterData && filterData.bspc_data ? filterData.bspc_data : []);
    } else {
      this.ngForm.controls['willing_to_produce'].setValue("no")
      this.ngForm.controls['reason'].patchValue(filterData && filterData.reason ? filterData.reason : '')
      this.ngForm.controls['bspc'].setValue('');
    }

    if (filterData.variety_code) {
      let varietyCodeArray = this.varietyList.filter(ele => ele.variety_code == filterData.variety_code);
      this.varietyName = varietyCodeArray && varietyCodeArray[0] && varietyCodeArray[0].variety_name ? varietyCodeArray[0].variety_name : '';
    } else {

    }
    // if(filterData.line_variety_code){
    //   let varietyLineArray = this.parentalLineVariety.filter(ele=>ele.line_variety_code == filterData.line_variety_code )
    //   this.varietyNameLine = varietyLineArray && varietyLineArray[0] && varietyLineArray[0].line_variety_name ? varietyLineArray[0].line_variety_name:'';
    // }
    console.log('filterData.line_variety_code==1', filterData && filterData.line_variety_code);
    if (filterData && filterData.variety_status === "hybrid") {
      this.ngForm.controls['variety'].patchValue(filterData && filterData.variety_code ? filterData.variety_code : '',
        { emitEvent: false });
      console.log('filterData.line_variety_code==2', filterData && filterData.line_variety_code);
      this.ngForm.controls['variety_line'].patchValue(filterData && filterData.line_variety_code ? filterData.line_variety_code : '', { emitEvent: false });
      this.ngForm.controls['variety_line'].disable();
      this.isPrentalLine = true;
    } else {
      this.ngForm.controls['variety'].patchValue(filterData && filterData.variety_code ? filterData.variety_code : '');
      this.ngForm.controls['variety_line'].setValidators(null);
      this.isPrentalLine = false;
    }
  }

  submit() {
    if (this.ngForm.invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }

    this.submited = true;
    let willing_to_praduced;
    if (this.ngForm.controls['willing_to_produce'].value === "yes") {
      willing_to_praduced = 1;
      if (!this.ngForm.controls['bspc'].value || (this.ngForm.controls['bspc'].value.length === 0)) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select All Required Field.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        return;
      }
    } else {
      willing_to_praduced = 0
      if (!this.ngForm.controls['reason'].value) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select All Required Field.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        return;
      }
    };
    if (this.isPrentalLine) {
      if (!this.ngForm.controls['variety_line'].value) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select All Required Field.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        return;
      }
    }
    let route = "add-assign-crop-all-data";
    let data = {
      "crop_code": this.ngForm.controls['crop_name'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "year": this.ngForm.controls['year_of_indent'].value,
      "season": this.ngForm.controls['season'].value,
      "comment_id": this.ngForm.controls['reason'].value,
      "is_active": 1,
      "willing_to_praduced": willing_to_praduced,
      "bspc_array": this.ngForm.controls['bspc'].value,
      "variety_parental_line": this.ngForm.controls['variety_line'].value ? this.ngForm.controls['variety_line'].value : null
    };

    if (!this.ngForm.controls['id'].value) {
      this._masterService.postRequestCreator(route, null, data).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Saved Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });

          this.resetForm();
          this.getPageData();
          this.showsecondportion = true;

          this.ngForm.controls['willing_to_produce'].setValue('');
        } else if (res.EncryptedResponse.status_code === 201) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Already Exits.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        }
        else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      })
    } else {
      data['id'] = this.ngForm.controls['id'].value;
      this._masterService.postRequestCreator(route, null, data).subscribe(res => {
        if (res.EncryptedResponse.status_code === 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Updated Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
          this.ngForm.controls['variety'].enable();
          this.resetForm();
          this.getPageData();
          this.showsecondportion = true;

          this.ngForm.controls['willing_to_produce'].setValue('');
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      })
    }
  }

  finalSubmit() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Edit this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Submit it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let param = {
          year: (this.ngForm.controls["year_of_indent"].value),
          crop_code: this.ngForm.controls["crop_name"].value,
          season: this.ngForm.controls["season"].value,
          user_id: this.userId
        }
        this.breederService.postRequestCreator("assign-crop-final-submit", null, param).subscribe(res => {
          if (res.EncryptedResponse.status_code === 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Submitted Successfully.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            });
            this.getPageData();
          } else {
            Swal.fire({
              title: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            });
          }
        })
      }
      // let param = {
      //   year: (this.ngForm.controls["year_of_indent"].value),
      //   crop_code: this.ngForm.controls["crop_name"].value,
      //   season: this.ngForm.controls["season"].value,
      //   user_id: this.userId
      // }
      // this.breederService.postRequestCreator("assign-crop-final-submit", null, param).subscribe(res => {
      //   if (res.EncryptedResponse.status_code === 200) {
      //     Swal.fire({
      //       title: '<p style="font-size:25px;">Data Saved Successfully.</p>',
      //       icon: 'success',
      //       confirmButtonText:
      //         'OK',
      //       confirmButtonColor: '#E97E15'
      //     });
      //     this.getPageData();
      //   } else {
      //     Swal.fire({
      //       title: '<p style="font-size:25px;">Something Went Wrong.</p>',
      //       icon: 'error',
      //       confirmButtonText:
      //         'OK',
      //       confirmButtonColor: '#E97E15'
      //     });
    });

  }

  sumIndentQnt(value) {
    console.log("value===", value)
    let indentQnt;
    value.forEach(ele => {
      indentQnt += parseInt(ele.indent_quantity);
    });
    console.log("indentQnt====", indentQnt)
    return indentQnt;
  }

  deleteData(value) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let route = "delete-assign-crop-all-data";
        this._masterService.postRequestCreator(route, null, { id: value }).subscribe(res => {
          Swal.fire({
            title: "Deleted!",
            text: "Your data has been deleted.",
            icon: "success"
          });
          this.checkParentalLineVariety(null)
          this.getPageData();
        });
      }
    });
  }
  getReasonName(data) {
    let resonName = this.reasonData.filter(item => item.id == data);
    let resonNameData = resonName && resonName[0] && resonName[0].comment;
    return resonNameData;
  }
  crop(item) {
    this.selectCrop = item && item.crop_name ? item.crop_name : '';
    this.ngForm.controls['crop_name'].setValue(item && item.crop_code ? item.crop_code : '')
    this.cropList = this.cropListSecond;
    this.ngForm.controls['crop_text'].setValue('')
  }
  cClick() {
    document.getElementById('crop').click()
  }
  variety(item) {
    this.selectVariety = item && item.variety_name ? item.variety_name : '';
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    this.ngForm.controls['variety_text'].setValue('')

    this.varietyList = this.varietyListSecond
  }
  vClick() {
    document.getElementById('varietyid').click()
  }
}