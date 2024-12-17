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
  selector: 'app-add-indentor',
  templateUrl: './add-indentor.component.html',
  styleUrls: ['./add-indentor.component.css']
})
export class AddIndentorComponent implements OnInit {

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  enrollFormGroup!: FormGroup;
  submitted = false;
  ngForm!: FormGroup;
  stateList: any;
  districtList: any;
  designationList: any;
  agency_name: any;
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
  category_agency_data: any;
  designation_name;
  category_agency;

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
  pastedNumber: string;
  latitutedpatchValue: any;
  longitutepatchValue: any;
  category_agency_id: any;
  selected_state;
  selected_district
  state_id: any;
  designation_id: any;
  designation_ids: any;
  category_agency_datasecond: { value: number; name: string; }[];
  stateListSecond: any;
  districtListSecond: any;
  designationListSecond: any;
  shortNameValidation: string;
  stateChange = false;
  newCategoryData: any;
  categoryNameId: any;
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
      agency_name: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ])
      ],
      // Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)
      category_agency: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: ['', [Validators.required]],
      display_name: ['', [Validators.required,
      Validators.compose([
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        // Validators.pattern('^[a-zA-Z]{1,5}$')]),
        Validators.minLength(3),
        Validators.maxLength(10)])
      ]],
      address: ['', [Validators.required, Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^([A-Za-z-()/, ]|[0-9]{0,100})+$')])]],
      pincode: ['', Validators.required],//, Validators.pattern("^[0-9]{12}$")
      contact_person_name: ['', [Validators.required,
      Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[A-Za-z(). ]{0,50}$')])
        // ^[A-Za-z]{0,50}$
      ]],
      contact_person_designation: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],//, Validators.pattern("^[0-9]{12}$")
      // mobile_ext:['1',],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$")]],//
      phone: ['', [Validators.pattern('^[0-9][0-9]{9,15}$')]],//, []Validators.pattern("^[0-9]{12}$")
      fax_number: ['',],//[,]
      // latitude: ['', [Validators.required,Validators.pattern('^(.{1,10})$')]],
      // longitude: ['', [Validators.required,Validators.pattern('^(.{1,10})$')]],
      latitude: ['', [Validators.pattern('^(.{1,10})$')]],
      longitude: ['', [Validators.pattern('^(.{1,10})$')]],
      // phone_ext:['1', Validators.required],
      status_toggle: [''],
      category_text: [''],
      state_text: [''],
      district_text: [''],
      designation_text: ['']
      // created_by: this.userId.id,
    });

    this.ngForm.controls['state'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (!this.isEdit || !this.isView) {
          this.stateChange = true

        }
        this.selected_district = ''
        this.getDistrictList((newValue).toString());
        this.ngForm.controls["district"].setValue('',);
        this.LongituteError = '';
        this.LatituteError = ''

      }
    });
    this.ngForm.controls['district'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.LongituteError = '';
        this.LatituteError = ''
      }
    });

    this.ngForm.controls['category_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.category_agency_data = this.category_agency_datasecond
        let response = this.category_agency_data.filter(x => x.category.toLowerCase().includes(newValue.toLowerCase()))

        this.category_agency_data = response

      }
      else {
        this.getCatetory(null)
        // this.getCroupNameList(this.group_code)
      }
    });
    this.ngForm.controls['display_name'].valueChanges.subscribe(newValue => {
      if(newValue.length<3){
        this.shortNameValidation = "Please Enter More Than 3 Charater Short Name/Display Name";
        
      }else{
        this.shortNameValidation =''
      }
    });
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateList = this.stateListSecond
        this.stateList = this.stateList.filter(x => x.state_name != null)
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()))
        this.stateList = response;

      }
      else {
        this.getStateList()

      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.districtList = this.districtListSecond
        let response = this.districtList.filter(x => x.district_name.toLowerCase().includes(newValue.toLowerCase()))

        this.districtList = response

      }
      else {
        this.getDistrictList(this.ngForm.controls['state'].value)

      }
    });
    this.ngForm.controls['designation_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.designationList = this.designationListSecond
        let response = this.designationList.filter(x => x.name.toLowerCase().includes(newValue.toLowerCase()))

        this.designationList = response

      }
      else {

        // this.getDesignation()

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
    this.ngForm.controls['longitude'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (this.LongituteError != '') {

          this.LongituteError = ''
        }
      }
    });

    if (this.router.url.includes('view')) {
      this.title = "View Indenter";
      this.ngForm.disable();
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.isEdit = false;

    }
    if (this.router.url.includes('edit')) {
      this.title = "Update Indenter";
      this.disabledfield = false;
      this.cancelbtn = false;
      this.isEdit = true;
      this.isView = false;

    }

    if (!this.router.url.includes('view') && !this.router.url.includes('edit')) {
      this.title = "Add Indenter";
    }

    // if(!this.router.url.includes('view') && !this.router.url.includes('edit')){
    this.ngForm.controls['display_name'].valueChanges.subscribe(newValue => {

    });
    // }
  }
  ngOnInit(): void {
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    //get user id from localstorage
    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user)


    this.submissionid = this.route.snapshot.paramMap.get('submissionId');
    // this.getPageData();
    this.initProcess()

  }
  initProcess() {
    if (!this.isEdit && !this.isView) {

      this.getDesignation();

    }
    if (this.isView || this.isEdit) {
      this.getListData();
      // if(!this.isEdit){
      this.getCatetory(null);
      // }
    } else {
      this.getCatetory(null);
    }
    // this.getCatetory();

    this.getStateList();
    this.getUserData();
    this.getIPAddress();

    // this.category_agency_datasecond=this.category_agency_data
  }


  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;
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
  checkShortName(event) {
    let route = "check-short-name-data-for-all"
    let param = {
      sort_name: (this.ngForm.controls['display_name'].value ? this.ngForm.controls['display_name'].value : ''),
      id: parseInt(this.route.snapshot.paramMap['params'].submissionId) ? parseInt(this.route.snapshot.paramMap['params'].submissionId) : null,
      type: "IN"
    };
    this.masterService.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        if(this.ngForm.controls['display_name'].value.length<3){
          this.shortNameValidation = "Please Enter More Than 3 Charater Short Name/Display Name";
        }
        else{

          this.shortNameValidation = "Short Name Already Exist";
        }
        return;
      } else {
        this.shortNameValidation = ""
      }
    })


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
          this.stateListSecond = this.stateList;

        }


      });

  }
  async getDesignation() {
    this.masterService
      .postRequestCreator("get-all-designation", null, {
        search: {
          type: "IN"
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.designationList = apiResponse.EncryptedResponse.data;
          this.designationListSecond = this.designationList
          if (this.isEdit || this.isView) {
            if (this.designation_id && this.designationList.length) {
              let resp = this.designationList.filter(item => item.id == this.designation_id);
              this.designation_name = resp && resp[0] && resp[0].name ? resp[0].name : ''

            }

          }
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
          this.districtListSecond = this.districtList
          // if(this.isEdit || this.isView){
          //   if(newValue){
          //     console.log('newValue',newValue)

          //     let resp = this.districtList.filter(item=>item.state_code==newValue)
          //     this.selected_district =resp && resp[0] && resp[0].district_name ? resp[0].district_name :''
          //     console.log(resp)
          //   }

          // }

        }

      });

  }


  onSubmit(formData: any) {
    this.submitted = true;
    if (this.shortNameShowErrMsg == true) {
      return;
    }
    if (!this.isEdit) {
      this.checkShortName(null);
    }

    // if(this.ngForm.invalid){
    //   return ;
    // }
    if (!this.ngForm.controls["agency_name"].value
      || this.ngForm.controls["agency_name"].errors
      || !this.ngForm.controls["address"].value || this.ngForm.controls["address"].errors
      || !this.ngForm.controls["display_name"].value || this.ngForm.controls["display_name"].errors
      || !this.ngForm.controls["category_agency"].value
      || !this.ngForm.controls["state"].value || !this.ngForm.controls["district"].value
      || !this.ngForm.controls["pincode"].value
      || !this.ngForm.controls["contact_person_name"].value || this.ngForm.controls["contact_person_name"].errors
      || !this.ngForm.controls["contact_person_designation"].value
      || !this.ngForm.controls["mobile"].value
      || !this.ngForm.controls["email"].value
      // || this.ngForm.controls["latitude"].errors
      // || this.ngForm.controls["longitude"].errors
      || this.ngForm.controls["mobile"].errors
      || this.ngForm.controls["email"].errors) {
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
    if (this.router.url.includes('edit')) {
      let editDataId = this.route.snapshot.paramMap['params'].submissionId;
      formData.updated_by = this.userId.id;
      formData.id = editDataId;
      this.masterService
        .postRequestCreator('edit-indentor/' + editDataId, null, formData)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.historyData.action = "Updated";
            this.historyData.comment = "Updated Form successfully";
            this.historyData.formType = "Indentor";

            this.audtiTrailsHistory(this.historyData);

            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
            }).then(x => {
              if (formData)
                this.router.navigate(['/add-indentor-list']);
              // this.updateUserData(formData);
            })
          }
          else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 402) {

            Swal.fire({
              title: '<p style="font-size:25px;">Agency Name Already Exists.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
          }

          else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 401) {

            Swal.fire({
              toast: true,
              icon: "error",
              title: apiResponse.EncryptedResponse.data.error,
              position: "center",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000
            })
          } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 403) {
            Swal.fire({
              toast: true,
              icon: "error",
              title: apiResponse.EncryptedResponse.data.error,
              position: "center",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000
            })
          }

          else {
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
        .postRequestCreator('add-indentor', null, formData)
        .subscribe((apiResponse: any) => {

          this.historyData.action = "Add";
          this.historyData.comment = "Add Form successfully";
          this.historyData.formType = "Indentor";



          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.audtiTrailsHistory(this.historyData);
            let resp = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data :'';
            // if (resp) {
            //   const request = {
            //     "search": {
            //       "id": resp.id,
            //     }
            //   }
            //   this.masterService.postRequestCreator('get-data', null, request).subscribe((apiResponse: any) => {
            //     if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
            //       let getData = apiResponse.EncryptedResponse.data.rows[0];
            //       const data = {
            //         "stateCode": getData.state_id,
            //         "name": (getData.user && getData.user.name ? getData.user.name : ''),
            //         "username": (getData.user && getData.user.username ? getData.user.username : ''),
            //         "password": (getData.user && getData.user.password ? getData.user.password : ''),
            //         "role": 'XYZ'
            //       }
            //       this.userCreateApi.createUserRequest(data);
            //     } else {
            //       Swal.fire({
            //         toast: true,
            //         icon: "error",
            //         title: "An error occured",
            //         position: "center",
            //         showConfirmButton: false,
            //         showCancelButton: false,
            //         timer: 2000
            //       })
            //     }
            //   })
            // }
            Swal.fire({
              title: `<p style="font-size:25px;">Data Has Been Successfully Saved.<br> Username for this Indentor is ${resp &&resp.username ? resp.username:"NA"} and password is seeds#234.</p>`,
              icon: 'success',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            }).then(x => {
              if (formData)
                this.router.navigate(['/add-indentor-list']);
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
          } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 403) {
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
          }
          else {
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

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.masterService
      .postRequestCreator("indentor-list", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 5,
        search: {
          "created_by": this.userId.id
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          let allData = apiResponse.EncryptedResponse.data;
          this.dataResponse = allData.rows;
          // console.log(allData);

          if (allData === undefined) {
            allData = [];
          }

        }
      });
  }

  getListData() {
    this.ngForm.controls["email"].disable();
    let user = localStorage.getItem('BHTCurrentUser')
    let user_id = JSON.parse(user);

    const param = {
      search: {

        agency_id: this.submissionid,
        created_by: user_id.id
      }
      // created_by:this.userId.id
    }

    const route = "indentor-list";
    const result = this.masterService.getPlansInfo(route, param).then((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.rows ? data['EncryptedResponse'].data.rows : '';
      console.log('responseresponseresponseresponse', data);
      // this.responseData = response[0].short_name;

      if (response && response.length > 0) {
        if (response[0].is_active == 0) {
          this.ngForm.controls['status_toggle'].patchValue(false);
          this.isShowDiv = true;
          this.isActive = 0;
        }
        if (response[0].is_active == 1) {
          this.isShowDiv = false;
          this.ngForm.controls['status_toggle'].patchValue(true);
          this.isActive = 1;
        }
        this.indentorData = response[0];
        this.ngForm.controls["agency_name"].setValue(response[0].agency_name);
        this.ngForm.controls["category_agency"].patchValue(response[0].category);
        this.ngForm.controls["display_name"].patchValue(response[0].short_name);
        // this.ngForm.controls["unitKgQ"].patchValue(data[0].unit.value);
        this.ngForm.controls["address"].patchValue(response[0].address);
        this.ngForm.controls["pincode"].patchValue(response[0].pincode);
        this.ngForm.controls["contact_person_name"].patchValue(response[0].contact_person_name);
        this.getDesignation();

        this.designation_id = response && response[0] && response[0].contact_person_designation ? response[0].contact_person_designation : ''
        this.ngForm.controls["contact_person_designation"].patchValue(response[0].contact_person_designation);
        this.ngForm.controls["mobile"].patchValue(response[0].mobile_number);
        this.ngForm.controls["email"].patchValue(response[0].email);
        this.response_phone_number = response[0].phone_number
        this.ngForm.controls["phone"].patchValue(response[0].phone_number);
        this.ngForm.controls["fax_number"].patchValue(response[0].fax_no);
        this.response_fax_number = response[0].fax_no;
        this.latitutedpatchValue = response && response[0] && response[0].latitude ? response[0].latitude : ''
        this.longitutepatchValue = response && response[0] && response[0].longitude ? response[0].longitude : ''
        this.ngForm.controls["latitude"].patchValue(response[0].latitude);
        this.ngForm.controls["longitude"].patchValue(response[0].longitude);
        // this.getStateList()


        // this.getStateList()

        this.state_id = response && response[0] && response[0].state_id ? response[0].state_id : '';
        this.stateApidisable = false;
        console.log('this.category_agency_d ata===', this.newCategoryData);
        this.categoryNameId = response[0].category;
        this.getCatetory(this.categoryNameId);
        if (this.category_agency_data && this.category_agency_data.length) {

          let resp = this.category_agency_data.filter(item => item.id == response[0].category);
          this.category_agency = resp && resp[0] && resp[0].category_name ? resp[0].category_name : ''
          console.log('this.category_agency==============', this.category_agency);
        }
        this.ngForm.controls["district"].patchValue(response[0].district_id, { emitEvent: false });
        this.ngForm.controls['state'].patchValue(response && response[0] && response[0].state_id ? response[0].state_id : '', { emitEvent: false });
        this.selected_state = response && response[0] && response[0].m_state && response[0].m_state && response[0].m_state.state_name ? response[0].m_state.state_name : '',
          this.getDistrictList(response[0].state_id)
        this.selected_district = response && response[0] && response[0].m_district && response[0].m_district.district_name ? response[0].m_district.district_name : ''
        // console.log(response[0].m_district.district_name,'response[0].m_district.district_name')
        // response && response[0] && response[0].m_district && response[0].m_district.district_name  ? response[0].district_name.district_name :''

      }

    });
  }
  getCatetory(id) {
    console.log("cate===id", id);
    this.masterService
      .postRequestCreator("get-all-categories", null, {
        search: {
          type: "IN"
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.category_agency_data = apiResponse.EncryptedResponse.data;
          this.category_agency_datasecond = this.category_agency_data;
          this.newCategoryData = this.category_agency_data;
          console.log('categories_id==', this.category_agency_data);
          let data = this.category_agency_data.filter(item => item.id == id)
          this.category_agency = data && data[0] && data[0].category_name;
        }
      });
    // this.category_agency_data.push(   
    // // {
    // //   value: 2,
    // //   name: 'National Research Centre'
    // // },
    // // {
    // //   value: 3,
    // //   name: 'Project Directorates'
    // // },
    // // {
    // //   value: 4,
    // //   name: 'State Seed Corporations'
    // // },
    // // {
    // //   value: 5,
    // //   name: 'State Agriculture University'
    // // },
    // // {
    // //   value: 6,
    // //   name: 'State Department of Agriculture'
    // // },
    // // {
    // //   value: 7,
    // //   name: 'National Seed Coorporation (NSC)'
    // // },
    // // {
    // //   value: 8,
    // //   name: 'Private Company'
    // // },

    // {
    //   value: 1,
    //   name: 'State Agriculture Department'
    // },
    // {
    //   value: 2,
    //   name: 'State Seed Corporation'
    // },
    // {
    //   value: 3,
    //   name: 'National Level Seed Producing Agency'
    // },
    // {
    //   value: 4,
    //   name: 'Seed Association'
    // }

    // )
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }


  getMinManLongLang() {
    this.submitted = true;
    if(this.ngForm.controls['display_name'].value.length<3){
      this.shortNameValidation = "Please Enter More Than 3 Charater Short Name/Display Name";
      
    }else{
      this.shortNameValidation =''
    }
    if (!this.ngForm.controls["agency_name"].value
      || this.ngForm.controls["agency_name"].errors
      || !this.ngForm.controls["address"].value || this.ngForm.controls["address"].errors
      || !this.ngForm.controls["display_name"].value || this.ngForm.controls["display_name"].errors
      || !this.ngForm.controls["category_agency"].value
      || !this.ngForm.controls["state"].value || !this.ngForm.controls["district"].value
      || !this.ngForm.controls["pincode"].value
      || !this.ngForm.controls["contact_person_name"].value || this.ngForm.controls["contact_person_name"].errors
      || !this.ngForm.controls["contact_person_designation"].value
      || !this.ngForm.controls["mobile"].value
      || !this.ngForm.controls["email"].value
      //  || !this.ngForm.controls["latitude"].value 
      //  || !this.ngForm.controls["longitude"].value 
      || this.ngForm.controls["mobile"].errors
      || this.ngForm.controls["email"].errors) {
      return;
    }

    const searchFilters = {
      "search": {
        "district_id": (this.ngForm.controls["district"].value).toString(),
        // "min_longitude":(this.ngForm.controls["longitude"].value),
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
              if ((this.ngForm.controls['longitude'].value && this.ngForm.controls['longitude'].value) && ((this.ngForm.controls['longitude'].value) < (this.min_long) || (this.ngForm.controls['longitude'].value) > (this.max_long))) {
                this.LongituteError = 'Please Enter Valid Longitute';
              }
            }

            if (this.max_lat != "NULL" && this.max_lat != '' && this.max_lat != null && this.min_lat != '' && this.min_lat != null && this.min_lat != "NULL") {
              if ((this.ngForm.controls['latitude'].value && this.ngForm.controls['latitude'].value) && ((this.ngForm.controls['latitude'].value) < (this.min_lat) || (this.ngForm.controls['latitude'].value) > (this.max_lat))) {
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

            // this.errorMsg = true;
            // this.alreadyExistsMsg = "Short Name Already Exists";
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
    // else {
    //   const id = this.route.snapshot.paramMap['params'].submissionId

    //   const param = {
    //     "id": id,
    //     "agency_name": this.ngForm.controls["agency_name"].value,
    //     "display_name": this.ngForm.controls["display_name"].value.trim(),
    //     "agency_id": this.user_id ? this.user_id : "",
    //     // "category_agency":this.ngForm.controls["category_agency"].value,

    //     "mobile_number": this.ngForm.controls["mobile"].value,
    //     "email": this.ngForm.controls["email"].value,
    //     'active': this.isActive

    //   }
    //   // this.masterService.postRequestCreator('edit-user-data', null, param).subscribe(data => {

    //   // })
    // }
  }

  getUserData() {
    // const param = {
    //   search: {
    //     "agency_id": this.route.snapshot.paramMap.get('submissionId')

    //   }
    // }
    // const res = this.masterService.postRequestCreator('get-user-data', null, param).subscribe(data => {
    //   let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : ""
    //   this.user_id = response && response[0].id ? response[0].id : '';
    //   // console.log('user===>',this.user_id);
    //   // console.log('response',response[0].id);


    // })
  }


  onPaste(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = /^[a-zA-Z]+$/;
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    if (this.pastedText.match(alphaExp)) {

      if (this.pastedText.length > len) {
        const value = this.pastedText;
        this.ngForm.get(field).setValue(value.substring(0, len).replace(/\s+/g, ' ').trim())
      }
      else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value.replace(/\s+/g, ' ').trim())
      }
      // return true
    }
    else {
      event.preventDefault();
      let fieldName = this.pastedText.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, ' ').trim();
      let value = parseInt(length)
      fieldName = this.ngForm.controls[field].value + fieldName.trimStart();
      this.ngForm.get(field).setValue(fieldName.substring(0, value))
      // return false
    }

  }
  onPasteEmail(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$";
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    if (this.pastedText.match(alphaExp)) {

      if (this.pastedText.length > len) {
        const value = this.pastedText;
        this.ngForm.get(field).setValue(value.substring(0, len))
      }
      else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value)
      }
      // return true
    }
    else {
      event.preventDefault();
      let fieldName = this.pastedText.replace("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$", '').replace(/\s+/g, ' ').trim();
      let value = parseInt(length)
      fieldName = this.ngForm.controls[field].value + fieldName.trimStart();
      this.ngForm.get(field).setValue(fieldName.substring(0, value))
      // return false
    }

  }

  onPasteNumber(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = '^[0-9]$';
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    if (this.ngForm.get(field).value.match(alphaExp)) {

      if (this.ngForm.get(field).value.length > len) {
        const value = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(value.substring(0, len))
      }
      else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value)
      }
      // return true
    }
    else {
      event.preventDefault()
      if (field == 'latitude' || field == 'longitude') {
        let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        if (this.ngForm.get(field).value.length > 10) {
          event.preventDefault();
          return false
        }
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      else {
        event.preventDefault();
        let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.ngForm.get(field).value + fieldName;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      // return false
    }

  }

  pasteNumber(event: ClipboardEvent, field, length) {
    const value = this.ngForm.controls['fax_number'].value
    this.ngForm.controls['fax_number'].setValue(value.substring(0, 12))
    // var alphaExp = /^[0-9]*$/;
    // let clipboardData = event.clipboardData
    // this.pastedText = clipboardData.getData('text');
    // if (this.pastedText.match(alphaExp)) {
    //   return true
    // }
    // else {
    //   event.preventDefault();
    //   let pastedNumber = this.pastedText.replace(/[^0-9]/g, "");
    //   pastedNumber = this.ngForm.controls[field].value + pastedNumber;
    //   pastedNumber = pastedNumber.trimStart();
    //   if(pastedNumber.length>12){
    //     this.ngForm.controls[field].setValue(pastedNumber.substring(0,12))
    //   }
    //   else{

    //     this.ngForm.controls[field].setValue(pastedNumber)
    //   }
    //   return false
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
      (charCode > 32 || charCode > 46)
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
  cnClick() {
    document.getElementById('category_agency').click();
  }
  csClick() {
    document.getElementById('state').click();
  }
  cdClick() {
    document.getElementById('district').click();
  }
  cdiClick() {
    document.getElementById('contact_person_designation').click();
  }


  category(data) {
    this.category_agency = data.category_name;
    this.category_agency_id = data.id
    this.ngForm.controls['category_agency'].setValue(this.category_agency_id)
  }
  state_select(data) {
    this.selected_state = data.state_name;
    this.ngForm.controls['state'].setValue(data.state_code)
    this.stateList = this.stateListSecond
    this.ngForm.controls['state_text'].setValue('',{emitEvent:false})
  }
  district_select(data) {
    this.selected_district = data.district_name;
    this.ngForm.controls['district'].setValue(data.district_code)
    this.districtList = this.districtListSecond
    this.ngForm.controls['district_text'].setValue('',{emitEvent:false})
  }
  designation(data) {
    this.designation_ids = data.id;
    this.designation_name = data.name;
    this.designationList = this.designationListSecond
    this.ngForm.controls['designation_text'].setValue('',{emitEvent:false})
    this.ngForm.controls['contact_person_designation'].setValue(this.designation_ids)
  }
}
