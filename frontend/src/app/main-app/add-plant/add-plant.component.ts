import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { checkAlpha, checkLength, checkNumber, checkDecimal, errorValidate, capitalizeFirstLetter, checkAlphaforShortname } from 'src/app/_helpers/utility';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { UserCreateApi } from 'src/app/_serverApis/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.css']
})
export class AddPlantComponent implements OnInit {


  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  enrollFormGroup!: FormGroup;
  submitted = false;
  ngForm!: FormGroup;
  stateList: any;
  districtList: any;
  designationList: any;
  plant_name: any;
  disabledfield: boolean = false;
  cancelbtn!: boolean;
  isView: boolean = false;
  indentorData: any;
  submissionid = this.route.snapshot.paramMap['params'].submissionId; response: any;
  isEdit: boolean = false;
  alreadyExistsMsg = '';
  errorMsg: boolean = false;
  title: string;
  responseData: any;
  selected_state
  max_long = '';
  min_long = '';
  LongituteError = '';
  LatituteError = '';
  min_lat = '';
  max_lat = '';
  stateApidisable = true;
  response_phone_number = '';
  response_fax_number = ''
  agency_id_value: any;
  user_id: any;
  userId: any;
  dataResponse: any;
  shortNameErrMsg: string;
  shortNameShowErrMsg: boolean;
  isShowDiv: any;
  isActive: number;
  value: any;
  ipAddres: any;
  selected_district
  // get enrollFormControls() {
  //   return this.enrollFormGroup.controls;
  // }
  historyData =
    {
      action: '',
      comment: '',
      formType: ''
    }
  pastedText: string;
  code: any;
  pastedNumber: any;
  pastedTextLatitute: any;
  stateListSecond: any;
  districtListsecond: any;
  get enrollFormControls() {
    return this.enrollFormGroup.controls;
  }
  todaysDate: Date = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  yearofIntroduction!: Boolean;
  get generateDefaultMonth(): string {
    return (this.todaysDate.getMonth() > 9 ? "" : "0") + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getFullYear() - 18)
  }
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'yyyy-mm-dd',
    disableSince: { year: this.todaysDate.getFullYear() - 18, month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 },
    disableUntil: { year: this.todaysDate.getFullYear() - 40, month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
  };
  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private service: SeedServiceService,
    private userCreateApi: UserCreateApi
  ) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      plant_name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]{0,50}$')]],
      category: [''],
      state_id: ['', [Validators.required, Validators.required]],
      district_id: ['', [Validators.required]],
      short_name: [''],
      address: ['', [Validators.required]],
      pincode: [''],//, Validators.pattern("^[0-9]{12}$")
      contact_person_name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]{0,50}$')]],
      contact_person_designation_id: ['', [Validators.required]],
      mobile_number: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],//, Validators.pattern("^[0-9]{12}$")
      // mobile_ext:['1',],
      // email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$")]],//
      phone_no: ['', Validators.pattern('^[6-9][0-9]{9}$')],//, []Validators.pattern("^[0-9]{12}$")
      fax_no: ['',],//[,]
      latitude: ['', [Validators.pattern('^(.{1,10})$')]],
      longitude: ['', [Validators.pattern('^(.{1,10})$')]],
      // phone_ext:['1', Validators.required],
      status_toggle: [''],
      code: [''],
      state_text: [''],
      district_text: [''],
      name_of_spa: ['', [Validators.required]],
      email:['']
      // created_by: this.userId.id,
    });

    this.ngForm.controls['state_id'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getDistrictList((newValue).toString());
        this.ngForm.controls["district_id"].setValue('');
        this.LongituteError = '';
        this.LatituteError = '';
        this.selected_district = ''
      }
    });
    this.ngForm.controls['district_id'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.LongituteError = '';
        this.LatituteError = ''
      }
    });
    this.ngForm.controls['longitude'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (this.LongituteError != '') {

          this.LongituteError = ''
        }
      }
    });
    // }

    this.ngForm.controls['latitude'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (this.LatituteError != '') {

          this.LatituteError = ''
        }
      }
    });
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()))

        this.stateList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getStateList()

      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.districtList = this.districtListsecond
        let response = this.districtList.filter(x => x.district_name.toLowerCase().includes(newValue.toLowerCase()))

        this.districtList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getDistrictList(this.ngForm.controls['state_id'].value)

      }
    });

    if (this.router.url.includes('view')) {
      this.title = "View Seed Processing Plant (SPP)";
      this.ngForm.disable();
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.isEdit = false;
      // this.getListData();
    }
    if (this.router.url.includes('edit')) {
      // this.ngForm.controls['email'].disable();
      this.title = "Update Seed Processing Plant (SPP)";
      this.disabledfield = false;
      this.cancelbtn = false;
      this.isEdit = true;
      this.isView = false;
      // this.getListData();
    }

    if (!this.router.url.includes('view') && !this.router.url.includes('edit')) {
      this.title = "Add Seed Processing Plant (SSP)";
    }
  }
  ngOnInit(): void {
    //get user id from localstorage
    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user)

    // console.log('userDatat',this.userId);
    this.submissionid = this.route.snapshot.paramMap.get('submissionId');
    // this.getPageData();
    this.getStateList();
    this.getDesignation();
    this.getUserData();
    this.getIPAddress();
    if(this.isView || this.isEdit){
      this.getListData()
    }
    this.ngForm.controls['code'].disable()
  }

  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;
      console.log('ip=======address', this.ipAddres);
    });
  }

  audtiTrailsHistory(historyData) {
    this.service.postRequestCreator('audit-trail-history', null, {
      "action_at": historyData.action,
      "action_by": this.userId.name,
      "application_id": "1234",
      "column_id": this.submissionid ? this.submissionid : '',
      "comment": historyData.comment,
      "form_type": historyData.formType,
      "ip": this.ipAddres,
      "mac_number": "12345678",
      "table_id": this.submissionid ? this.submissionid : ''
    }).subscribe(res => {

    });
  }
  async getStateList() {
    this.masterService
      .getRequestCreatorNew("get-state-list")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          let stateListData = [];
          apiResponse.EncryptedResponse.data.forEach(ele => {
            if (ele.state_name != null && ele.state_name != '' && ele.state_name != undefined) {
              stateListData.push(ele);
            }
          })
          this.stateList = stateListData;
          // this.stateList = apiResponse.EncryptedResponse.data;
          this.stateListSecond = this.stateList
        }
      });

  }
  async getDesignation() {
    this.masterService
      .postRequestCreator("get-all-designation",null,{
        search:{
          type:"SPP"
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.designationList = apiResponse.EncryptedResponse.data;
        }
      });

  }

  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state_code": newValue
      }
    };
    this.masterService
      .postRequestCreator("get-district-list", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data;
          this.districtListsecond = this.districtList
        }
      });
  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.masterService
      .postRequestCreator("plant-list", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 5,
        search: {
          "id": this.submissionid
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          let allData = apiResponse.EncryptedResponse.data;
          this.dataResponse = allData.rows;
          console.log('this.dataResponsethis.dataResponsethis.dataResponse', this.dataResponse);
          if (allData === undefined) {
            allData = [];
          }

        }
      });
  }

  onSubmit(formData: any) {
    this.submitted = true;
    if (this.shortNameShowErrMsg == true) {
      return;
    }
    if (!this.ngForm.controls["plant_name"].value || !this.ngForm.controls["state_id"].value
      || this.ngForm.controls["plant_name"].errors
      || !this.ngForm.controls["district_id"].value
      || !this.ngForm.controls["name_of_spa"].value
      || !this.ngForm.controls["contact_person_name"].value
      || this.ngForm.controls["contact_person_name"].errors
      || !this.ngForm.controls["contact_person_designation_id"].value
      || !this.ngForm.controls["mobile_number"].value
      || this.ngForm.controls["mobile_number"].errors
      || this.ngForm.controls["phone_no"].errors
      || this.ngForm.controls["latitude"].errors || this.ngForm.controls["longitude"].errors
    ) {
      return;
    }
    if (this.alreadyExistsMsg != "") {
      return;
    }
    if (this.LatituteError != '' || this.LongituteError != '') {
      return;
    }

    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    } else {
      this.isActive = 0;
    }
    formData.active = this.isActive;
    console.log('this.isActive', this.isActive)
    if (this.router.url.includes('edit')) {
      let editDataId = this.route.snapshot.paramMap['params'].submissionId;
      formData.updated_by = this.userId.id;
      formData.id = editDataId;
      this.masterService
        .postRequestCreator('add-plant-details/', null, formData)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.historyData.action = "Updated";
            this.historyData.comment = "Updated Form successfully";
            this.historyData.formType = "plant-details";

            this.audtiTrailsHistory(this.historyData);

            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
             confirmButtonColor: '#E97E15'
            }).then(x => {
              if (formData)
                this.router.navigate(['/add-plant-list']);
              // this.updateUserData(formData);
            })
          }
          else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 402) {
            console.log(apiResponse.EncryptedResponse);

            Swal.fire({
              title: '<p style="font-size:25px;">Seed Processing Plant Already Exists.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
             confirmButtonColor: '#E97E15'
            
            })
          }

          else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 401) {
            console.log(apiResponse.EncryptedResponse.data.error);

            Swal.fire({
              toast: true,
              icon: "error",
              title: apiResponse.EncryptedResponse.data.error,
              position: "center",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000
            })
          } else {
            if (!formData)
              Swal.fire({
                title: '<p style="font-size:25px;">An Error Occured.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
          }
        });
    } else {
      formData.created_by = this.userId.id;
      formData.active = 1;
      this.masterService
        .postRequestCreator('add-plant-details', null, formData)
        .subscribe((apiResponse: any) => {
          console.log(apiResponse);

          this.historyData.action = "Add";
          this.historyData.comment = "Add Form Successfully";
          this.historyData.formType = "plant-details  ";

          this.audtiTrailsHistory(this.historyData);

          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            let resp = apiResponse &&  apiResponse.EncryptedResponse &&  apiResponse.EncryptedResponse.data ?  apiResponse.EncryptedResponse.data:'';
            Swal.fire({
              title:  `<p style="font-size:25px;">Data Has Been Successfully Saved.<br> Username for this Plant is ${resp &&resp.username ? resp.username:"NA"} and password is seeds#234</p>`,
              icon: 'success',
              confirmButtonText:
                'OK',
                showCancelButton: false,
              confirmButtonColor: '#E97E15'
            }).then(x => {
              if (formData)
                this.router.navigate(['/add-plant-list']);
            })
          }

          else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 401) {
            console.log(apiResponse.EncryptedResponse.data.error);
            Swal.fire({
              toast: true,
              icon: "error",
              title: apiResponse.EncryptedResponse.data.error,
              position: "center",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000
            })
          } else {
            if (!formData)
              Swal.fire({
                title: '<p style="font-size:25px;">An Error Occured.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
              })
          }
        });
    }

  }

  checkAlpha(event) {
    checkAlpha(event)
  }
  checkAlphaforShortname($event) {
    checkAlphaforShortname($event)
  }
  checkLength($e, length) {
    checkLength($e, length);
  }

  checkNumber($e) {
    checkNumber($e);
  }
  checkDecimal($e) {
    checkDecimal($e);
  }



  getListData() {
    let user = localStorage.getItem('BHTCurrentUser')
    let user_id = JSON.parse(user);
    const param = {
      search: {
        id: this.submissionid
      }
      // created_by:this.userId.id
    }

    const route = "plant-list";
    const result = this.masterService.getPlansInfo(route, param).then((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.rows ? data['EncryptedResponse'].data.rows : '';
      this.code = response[0]
      if (response && response.length > 0) {
        if (parseInt(response[0].is_active) == 0) {
          this.ngForm.controls['status_toggle'].patchValue(false);
          this.isShowDiv = true;
          this.isActive = 0;
        }
        if (parseInt(response[0].is_active) == 1) {
          this.isShowDiv = false;
          this.ngForm.controls['status_toggle'].patchValue(true);
          this.isActive = 1;
        }
        this.indentorData = response[0];
        console.log('plant data', response[0]);
        this.ngForm.controls["plant_name"].setValue(response && response[0] && response[0].agency_name ? response[0].agency_name:'');
        this.ngForm.controls["code"].setValue(response && response[0] && response[0].user && response[0].user.code ? response[0].user.code:'');
        this.ngForm.controls["category"].patchValue(response[0].category);
        this.ngForm.controls["short_name"].patchValue(response[0].short_name);
        this.ngForm.controls["address"].patchValue(response[0].address);
        this.ngForm.controls["pincode"].patchValue(response[0].pincode);
        this.ngForm.controls["contact_person_name"].patchValue(response[0].contact_person_name);
        // if(this.designationList && this.designationList.length>0){
        //   let designation;
        //   if(response && response[0] && response[0].contact_person_designation_id){
        //     designation= this.designationList.filter(x=>x.id == response[0].contact_person_designation_id)
        //   }
        // }
        this.ngForm.controls["contact_person_designation_id"].patchValue(response && response[0] && response[0].contact_person_designation_id ? response[0].contact_person_designation_id :'' );
        this.ngForm.controls["mobile_number"].patchValue(response[0].mobile_number);
        // this.ngForm.controls["email"].patchValue(response[0].email);
        this.response_phone_number = response[0].phone_number;
        this.ngForm.controls["phone_no"].patchValue(response[0].phone_number);
        this.ngForm.controls["fax_no"].patchValue(response[0].fax_no);
        this.response_fax_number = response[0].fax_no;
        this.ngForm.controls["latitude"].patchValue(response[0].latitude);
        this.ngForm.controls["longitude"].patchValue(response[0].longitude);
        this.ngForm.controls["state_id"].patchValue(response[0].state_id);
        this.stateApidisable = false
        this.ngForm.controls["district_id"].patchValue(response[0].district_id);
        this.ngForm.controls["name_of_spa"].patchValue(response && response[0] && response[0].user && response[0].user.name ? response[0].user.name : '');
        this.selected_district = response && response[0] && response[0].m_district && response[0].m_district.district_name ? response[0].m_district.district_name : '';
        this.selected_state = response && response[0] && response[0].m_state && response[0].m_state.state_name ? response[0].m_state.state_name : '';
      }
    });
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
    if (this.isShowDiv) {
      this.isActive = 1
    }
    else {
      this.isActive = 0
    }
  }


  getMinManLongLang() {
    this.submitted = true;

    console.log('district=====>', this.districtList);

    if (!this.ngForm.controls["plant_name"].value || !this.ngForm.controls["address"].value
      || !this.ngForm.controls["name_of_spa"].value
      || !this.ngForm.controls["state_id"].value || !this.ngForm.controls["district_id"].value || !this.ngForm.controls["contact_person_name"].value || !this.ngForm.controls["contact_person_designation_id"].value || !this.ngForm.controls["mobile_number"].value       
      // !this.ngForm.controls["latitude"].value || !this.ngForm.controls["longitude"].value ||
      // this.ngForm.controls["email"].errors
      ) {
      return;
    }

    const searchFilters = {
      "search": {
        "district_id": (this.ngForm.controls["district_id"].value).toString(),
      }
    };
    this.service
      .postRequestCreator("get-district-minmax-latitute", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.max_long = apiResponse.EncryptedResponse.data[0].max_longitude;
            this.min_long = apiResponse.EncryptedResponse.data[0].min_longitude;
            this.max_lat = apiResponse.EncryptedResponse.data[0].max_latitude;
            this.min_lat = apiResponse.EncryptedResponse.data[0].min_latitude;
            console.log('(this.ngForm.controls)', (this.ngForm.controls['longitude'].value) >= this.max_long, 'this.max_long ==>', this.max_long);
            // if ((this.max_long) != null && (this.max_long) != "NULL" && this.max_long != '' && this.min_long != '' && (this.min_long) != "NULL" && (this.min_long) != null) {
            //   if ((this.ngForm.controls['longitude'].value) < (this.min_long) || (this.ngForm.controls['longitude'].value) > (this.max_long)) {
            //     this.LongituteError = 'Please Enter Valid Longitute';
            //   }
            // }
            // if (this.max_lat != "NULL" && this.max_lat != '' && this.max_lat != null && this.min_lat != '' && this.min_lat != null && this.min_lat != "NULL") {
            //   if ((this.ngForm.controls['latitude'].value) < (this.min_lat) || (this.ngForm.controls['latitude'].value) > (this.max_lat)) {
            //     this.LatituteError = 'Please Enter Valid Latitude'
            //   }
            // }
            if ((this.max_long) != null && (this.max_long) != "NULL" && this.max_long != '' && this.min_long != '' && (this.min_long) != "NULL" && (this.min_long) != null) {
              if ((this.ngForm.controls['longitude'].value) && ((this.ngForm.controls['longitude'].value) < (this.min_long) || (this.ngForm.controls['longitude'].value) > (this.max_long))) {
                this.LongituteError = 'Please Enter Valid Longitute';
              }
            }
            if (this.max_lat != "NULL" && this.max_lat != '' && this.max_lat != null && this.min_lat != '' && this.min_lat != null && this.min_lat != "NULL") {
              if ((this.ngForm.controls['latitude'].value) && ((this.ngForm.controls['latitude'].value) < (this.min_lat) || (this.ngForm.controls['latitude'].value) > (this.max_lat))) {
                this.LatituteError = 'Please Enter Valid Latitude'
              }
            }
            if (this.LatituteError == '' && this.LatituteError == '') {
              this.onSubmit(this.ngForm.value);
              this.updateUserData();
            }
            else {
              this.onSubmit(this.ngForm.value);
              this.updateUserData();
              // return;
            }
          }
          else {
            this.onSubmit(this.ngForm.value);
            this.updateUserData();
            // return;
          }
        }
      });
  }

  updateUserData() {
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    } else {
      this.isActive = 0;
    }
    if (this.shortNameShowErrMsg == true) {
      return;
    }
    if (!this.router.url.includes('edit')) {
      return;
    }
  }

  getUserData() {
  }

  onPaste(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = /^[a-zA-Z]+$/;
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    if (this.ngForm.get(field).value.match(alphaExp)) {
      if (this.ngForm.get(field).value.length > len) {
        const value = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(value.substring(0, len))
      }
      return true
    }
    else {
      event.preventDefault();
      let fieldName = this.pastedText.replace(/[^a-zA-Z ]/g, "").replace(/^\s+|\s+$/g, '');;
      fieldName = this.ngForm.get(field).value + fieldName;
      this.ngForm.get(field).setValue(fieldName.substring(0, len))
      return false
    }
  }



  pasteNumber(event: ClipboardEvent, field, length) {
    const value = this.ngForm.controls['fax_number'].value
    this.ngForm.controls['fax_number'].setValue(value.substring(0, 12))
  }
  onPasteNumber(event, field: string, length: string) {

    var alphaExp = '^[0-9]$';
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    console.log((<HTMLInputElement>document.getElementById("latitudeplant")).value, 'val')
    if (this.pastedNumber.length > 10) {
      this.ngForm.get(field).setValue(this.pastedNumber.substring(0, len))
      event.preventDefault()
      return false
    } else {
      return true
    }
    // if (this.ngForm.get(field).value.match(alphaExp)) {

    //   if(this.ngForm.get(field).value.length>len){
    //     const value = this.ngForm.get(field).value;
    //     this.ngForm.get(field).setValue(value.substring(0,len))
    //   }
    //   else{
    //     this.ngForm.get(field).setValue(this.ngForm.get(field).value)
    //   }
    //   // return true
    // }
    // else {
    //   event.preventDefault()
    //   if(field=='latitude' || field=='longitude' ){
    //     let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g,"").replace(/^\s+|\s+$/g, '');
    //     let value = parseInt(length)
    //     fieldName = this.ngForm.get(field).value + fieldName;
    //     this.ngForm.get(field).setValue(fieldName.substring(0,value))
    //   }
    //   else{
    //     event.preventDefault();
    //     let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
    //     let value = parseInt(length)
    //     fieldName = this.ngForm.get(field).value + fieldName;
    //     this.ngForm.get(field).setValue(fieldName.substring(0,value))
    //   }
    //   // return false
    // }

  }

  isAlfa(evt) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    if (evt.target.selectionStart == 0 && evt.code == 'Space') {
      evt.preventDefault();
      return false;
    }
    if (charCode == 45) {
      return true;
    }
    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122)

    ) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }
  willCreateWhitespaceSequence(evt) {
    var willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {

      var elmInput = evt.currentTarget;
      var content = elmInput.value;

      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;

      willCreateWSS = (
        this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }
  isWhiteSpace(char) {
    return (/\s/).test(char);
  }
  state_select(data) {
    console.log('da', data)
    this.selected_state = data && data.state_name ? data.state_name : '';
    this.ngForm.controls['state_id'].setValue(data && data.state_code ? data.state_code : '')
    this.ngForm.controls['state_text'].setValue('')

  }
  csClick() {
    document.getElementById('state').click();
  }
  cdClick() {
    document.getElementById('district').click();
  }
  district_select(data) {
    this.selected_district = data && data.district_name ? data.district_name : '';
    this.ngForm.controls['district_id'].setValue(data && data.district_code ? data.district_code : '')
    this.ngForm.controls['district_text'].setValue('')
  }
}
