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
import { IndenterService } from '../services/indenter/indenter.service';

@Component({
  selector: 'app-indentor-spa',
  templateUrl: './indentor-spa.component.html',
  styleUrls: ['./indentor-spa.component.css']
})
export class IndentorSpaComponent implements OnInit {
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
  submissionid = this.route.snapshot.paramMap['params'].submissionId;
  response: any;
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
  Sector_name;
  category_agency_data = [
  ]
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
  selected_block;
  blockList;
  blockListsecond: any;
  sectorList: any;
  sectorListsecond: any;
  stateCode: string;
  cancelbtnEnable: boolean = false;
  shortNameValidation: string;
  disableOrganisation: boolean;
  agencyName: any;
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
    private indentorService: IndenterService,
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
          Validators.maxLength(50)
        ])
      ],
      // Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)
      category_agency: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: ['', [Validators.required]],
      display_name: ['', [Validators.required,
      Validators.compose([
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        Validators.minLength(3),Validators.maxLength(10)])
      ]],
      address: ['', [Validators.required, Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
    ,Validators.maxLength(200)
    ])]],
      pincode: ['', Validators.required],//, Validators.pattern("^[0-9]{12}$")
      contact_person_name: ['', [Validators.required,
      Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), 
      Validators.maxLength(50)
    ])
        // ^[A-Za-z]{0,50}$
      ]],
      contact_person_designation: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],//, Validators.pattern("^[0-9]{12}$")
      // mobile_ext:['1',],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$")]],//

      // latitude: ['', [Validators.required,Validators.pattern('^(.{1,10})$')]],
      // longitude: ['', [Validators.required,Validators.pattern('^(.{1,10})$')]],
      latitude: ['', [Validators.pattern('^(.{1,10})$')]],
      longitude: ['', [Validators.pattern('^(.{1,10})$')]],
      // phone_ext:['1', Validators.required],
      status_toggle: [''],
      category_text: [''],
      state_text: [''],
      district_text: [''],
      designation_text: [''],
      block_text: [''],
      central_text: [''],
      sector: ['', [Validators.required,]],
      block: ['', [Validators.required,]]
      // created_by: this.userId.id,
    });

    this.ngForm.controls['state'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (!this.isEdit || !this.isView) {

        }
        this.getDistrictList((newValue).toString());
        this.ngForm.controls["district"].setValue('');
        this.selected_district = ''
        this.LongituteError = '';
        this.LatituteError = ''

      }
    });
    this.ngForm.controls['district'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.LongituteError = '';
        this.LatituteError = '';
        this.selected_block = ''
        this.ngForm.controls['block'].setValue('')
        this.getBlockList(newValue)
      }
    });


    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))

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
        this.districtList = this.districtListSecond
        let response = this.districtList.filter(x => x.district_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.districtList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getDistrictList(this.ngForm.controls['state'].value)

      }
    });
    this.ngForm.controls['block_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.blockList = this.blockListsecond
        let response = this.blockList.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.blockList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getBlockList(this.ngForm.controls['district'].value)

      }
    });
    this.ngForm.controls['central_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.sectorList = this.sectorListsecond
        let response = this.sectorList.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.sectorList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getCentralData()

      }
    });
    this.ngForm.controls['designation_text'].valueChanges.subscribe(newValue => {
      if (newValue && this.designationList.length) {
        console.log(newValue)
        this.designationList = this.designationListSecond
        let response = this.designationList.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.designationList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getDesignation()

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
      this.title = "View Seed Producing Agency (SPA) to Raise the Indent";
      this.ngForm.disable();
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.isEdit = false;
      this.getListData();
    }
    if (this.router.url.includes('edit')) {
      this.title = "Update Seed Producing Agency (SPA) to Raise the Indent";
      this.disabledfield = false;
      this.cancelbtn = false;
      this.isEdit = true;
      this.isView = false;
      this.getListData();
    }

    if (!this.router.url.includes('view') && !this.router.url.includes('edit')) {
      this.title = "Add Seed Producing Agency (SPA) to Raise the Indent";
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
    console.log('submission id', this.submissionid);

    this.stateCode = this.route.snapshot.paramMap.get('stateCode');
    if(this.stateCode){
      // this.Sector_name = "Private Company";
      this.Sector_name = "PRIVATE";
      this.ngForm.controls['sector'].setValue(20);
    }else{

    }
    // this.getPageData();
    this.initProcess()
    

  }
  initProcess() {
    if (!this.isView || !this.isEdit) {
      if(!this.stateCode){

        this.getStateList();
      }

      this.getDesignation();
    }
    this.getAgencyData();
    this.category_agency_datasecond = this.category_agency_data
    this.getUserData();
    this.getIPAddress();
    this.getCentralData();
  }

  checkShortName(event) {
    let route = "check-short-name-data-for-all"
    let param = {
      sort_name: (this.ngForm.controls['display_name'].value ? this.ngForm.controls['display_name'].value : ''),
      id: parseInt(this.route.snapshot.paramMap['params'].submissionId) ? parseInt(this.route.snapshot.paramMap['params'].submissionId) : null,
      type: "SPA"
    };
    this.masterService.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.shortNameValidation = "Short Name Already Exists.";
        return;
      } else {
        this.shortNameValidation = ""
      }
    })
  }
  
  getBlockList(newValue) {
    // this.blockList=[
    //   {
    //     id:1,
    //     name:'Tilak Nagar'
    //   },
    //   {
    //     id:2,
    //     name:'Vikas Puri'
    //   },
    //   {
    //     id:3,
    //     name:'kashmir'
    //   }
    // ]
    const param = {
      search: {
        district_code: newValue
      }
    }
    this.masterService.postRequestCreator('getBlockData', null, param).subscribe(data => {
      console.log(data)
      this.blockList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : ''
    })

    this.blockListsecond = this.blockList
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
          this.stateList = apiResponse.EncryptedResponse.data;
          this.stateListSecond = this.stateList;
          if(this.stateCode){
            
            let data =  this.stateList.filter(item=>item.state_code == this.stateCode);
              this.selected_state = data && data[0] && data[0].state_name ? data[0].state_name :'';
              console.log('selected_state',this.selected_state);
              this.ngForm.controls['state'].setValue(this.stateCode);
              this.ngForm.controls['state_text'].setValue('',{ emitEvent: false });
          }
            
          // if(this.isEdit || this.isView){
          //   if(this.state_id && this.stateList.length){

          //     let resp = this.stateList.filter(item=>item.state_code==this.state_id)
          //     this.selected_state =resp && resp[0] && resp[0].state_name ? resp[0].state_name :''
          //     console.log(resp)
          //   }

          // }
        }
      });

  }
  async getDesignation() {
    this.masterService
      .postRequestCreator("get-all-designation", null, {
        search: {
          type: "SPA"
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.designationList = apiResponse.EncryptedResponse.data;
          this.designationListSecond = this.designationList
          if (this.isEdit || this.isView) {
            if (this.designation_id && this.designationList.length) {
              console.log('thisdesignation_id', this.designation_id)
              let resp = this.designationList.filter(item => item.id == this.designation_id);
              this.designation_name = resp && resp[0] && resp[0].name ? resp[0].name : ''
              console.log(this.designation_name, 'this.designation_name')

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
    // formData.
    this.checkShortName(null);
    let name;
    console.log(this.sectorList)
    formData.spa_name = this.Sector_name ? this.Sector_name :''
    if (this.blockList) {
      name = this.blockList.filter(x => x.block_code == this.ngForm.controls['block'].value)
      formData.blockName = name && name[0] && name[0].block_name ? name[0].block_name : ''
    }
    console.log(formData)
    let districtname
    if (this.districtList) {
      districtname = this.districtList.filter(x => x.district_code == this.ngForm.controls['district'].value)
      formData.districtName = districtname && districtname[0] && districtname[0].district_name ? districtname[0].district_name : ''
    }

    if (this.shortNameShowErrMsg == true) {
      return;
    }
    // if(this.ngForm.invalid){
    //   return ;
    // }
    if (!this.ngForm.controls["agency_name"].value
      || this.ngForm.controls["agency_name"].errors
      || !this.ngForm.controls["address"].value || this.ngForm.controls["address"].errors
      || !this.ngForm.controls["display_name"].value || this.ngForm.controls["display_name"].errors
      || !this.ngForm.controls["state"].value || !this.ngForm.controls["district"].value
      || !this.ngForm.controls["pincode"].value
      || !this.ngForm.controls["contact_person_name"].value || this.ngForm.controls["contact_person_name"].errors
      || !this.ngForm.controls["contact_person_designation"].value
      || !this.ngForm.controls["mobile"].value
      || !this.ngForm.controls["block"].value
      || !this.ngForm.controls["email"].value
      || !this.ngForm.controls["sector"].value
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
        .postRequestCreator('editIndentorSppData/' + editDataId, null, formData)
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
              
              this.router.navigate(['/add-seed-producing-agency-spa-indentor-list']);
              // this.updateUserData(formData);
            })
          }
          else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 402) {
            console.log(apiResponse.EncryptedResponse);

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
    } else {
      formData.created_by = this.userId.id;
      formData.active = 1;
      this.masterService
        .postRequestCreator('addSpaIndentor', null, formData)
        .subscribe((apiResponse: any) => {
          console.log(apiResponse);

          this.historyData.action = "Add";
          this.historyData.comment = "Add Form successfully";
          this.historyData.formType = "Indentor";



          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.audtiTrailsHistory(this.historyData);
            let resp = apiResponse.EncryptedResponse.data;
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
            let password = 'Test@1234'
            // .SPA Has Been Successfully Added With SPA Code (spacode) And Password  

            Swal.fire({
              icon: "success",
              title: `SPA Has Been Successfully Added With SPA Code ${resp.spa_code} And Password ${password}`,
              position: "center",
              showConfirmButton: true,
              showCancelButton: false,
              customClass: {
                confirmButton: 'centered-btn'
              }

            }).then(x => {
              if (formData)
              if(this.stateCode){
                this.router.navigate(['/selection-of-spa-for-submission-indent']);

              }else{
                this.router.navigate(['/add-seed-producing-agency-spa-indentor-list']);
              }
                // this.router.navigate(['/add-seed-producing-agency-spa-indentor-list']);
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
        pageSize: this.filterPaginateSearch.itemListPageSize || 10,
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
          console.log('this.dataResponsethis.dataResponsethis.dataResponse', this.dataResponse);
          // console.log(allData);

          if (allData === undefined) {
            allData = [];
          }

        }
      });
  }

  getListData() {
    let user = localStorage.getItem('BHTCurrentUser')
    let user_id = JSON.parse(user);

    const param = {
      search: {

        agency_id: this.submissionid,
        created_by: user_id.id
      }
      // created_by:this.userId.id
    }

    const route = "addSpaIndentorList";
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
        this.getDesignation()

        this.designation_id = response && response[0] && response[0].contact_person_designation ? response[0].contact_person_designation : ''
        this.ngForm.controls["contact_person_designation"].patchValue(response[0].contact_person_designation);
        this.ngForm.controls["mobile"].patchValue(response[0].mobile_number);
        this.ngForm.controls["email"].patchValue(response[0].email);
        // // this.selected_block = 
        this.getBlockList(response[0].district_id);

        // let block = this.blockList.filter(item=>item.block_code == response[0].block_id)

        this.selected_block = response && response[0] && response[0].block && response[0].block.block_name ? response[0].block.block_name : '';
        // console
        this.ngForm.controls['block'].patchValue(response && response[0] && response[0].block_id ? response[0].block_id : '')
        this.ngForm.controls['sector'].patchValue(response && response[0] && response[0].sector && response[0].sector.id ? response[0].sector.id : '')
        this.Sector_name = response && response[0] && response[0].sector && response[0].sector.name ? response[0].sector.name : ''
        this.latitutedpatchValue = response && response[0] && response[0].latitude ? response[0].latitude : ''
        this.longitutepatchValue = response && response[0] && response[0].longitude ? response[0].longitude : ''

        this.ngForm.controls["latitude"].patchValue(response[0].latitude);
        this.ngForm.controls["longitude"].patchValue(response[0].longitude);
        this.getStateList()
        // this.ngForm.controls["state"].patchValue(response[0].state_id,{ emitEvent: false });
        this.state_id = response && response[0] && response[0].state_id ? response[0].state_id : '';
        this.stateApidisable = false
        if (this.category_agency_data && this.category_agency_data.length) {

          let resp = this.category_agency_data.filter(item => item.value == response[0].category);
          this.category_agency = resp && resp[0] && resp[0].name ? resp[0].name : ''
        }
        this.ngForm.controls["district"].patchValue(response[0].district_id, { emitEvent: false });        
        this.getDistrictList(response[0].state_id)
        this.selected_district = response && response[0] && response[0].m_district && response[0].m_district.district_name ? response[0].m_district.district_name : ''
        // console.log(response[0].m_district.district_name,'response[0].m_district.district_name')
        // response && response[0] && response[0].m_district && response[0].m_district.district_name  ? response[0].district_name.district_name :''

      }

    });
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }


  getMinManLongLang() {
    this.submitted = true;

    console.log('district=====>', this.districtList);
    if (!this.ngForm.controls["agency_name"].value
      || this.ngForm.controls["agency_name"].errors
      || !this.ngForm.controls["address"].value || this.ngForm.controls["address"].errors
      || !this.ngForm.controls["display_name"].value || this.ngForm.controls["display_name"].errors
      || !this.ngForm.controls["state"].value || !this.ngForm.controls["district"].value
      || !this.ngForm.controls["pincode"].value
      || !this.ngForm.controls["contact_person_name"].value || this.ngForm.controls["contact_person_name"].errors
      || !this.ngForm.controls["contact_person_designation"].value
      || !this.ngForm.controls["mobile"].value
      || !this.ngForm.controls["email"].value
      || !this.ngForm.controls["sector"].value
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
      if(field=='agency_name'){
        event.preventDefault();
      let fieldName = this.pastedText.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, ' ').trim();
      let value = parseInt(length)
      fieldName = this.ngForm.controls[field].value + fieldName.trimStart();
      this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }


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
        console.log('this.ngForm.get(field).value.length', this.ngForm.get(field).value.length)
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
  cnClick() {
    document.getElementById('category_agency').click();
  }
  csClick() {
    document.getElementById('state').click();
  }
  cdClick() {
    document.getElementById('district').click();
  }
  cbClick() {
    document.getElementById('block').click();
  }
  cdiClick() {
    document.getElementById('contact_person_designation').click();
  }
  cdsectorlick() {
    document.getElementById('sector').click();
  }


  category(data) {
    this.category_agency = data.name;
    this.category_agency_id = data.value
    this.ngForm.controls['category_agency'].setValue(this.category_agency_id)
  }
  state_select(data) {
      console.log('da', data)
      this.selected_state = data.state_name;
      this.ngForm.controls['state'].setValue(data.state_code)

      this.ngForm.controls['state_text'].setValue('')

  }
  district_select(data) {
    this.selected_district = data.district_name;
    this.ngForm.controls['district'].setValue(data.district_code)

    this.ngForm.controls['district_text'].setValue('')
  }
  designation(data) {
    this.designation_ids = data.id;
    this.designation_name = data.name


    this.ngForm.controls['designation_text'].setValue('')
    this.ngForm.controls['contact_person_designation'].setValue(this.designation_ids)
  }
  block_select(data) {
    console.log(data, 'data')
    this.ngForm.controls['block'].setValue(data && data.block_code ? data.block_code : '');
    this.selected_block = data && data.block_name ? data.block_name : '';
  }
  getAgencyData() {
    const userData = localStorage.getItem('BHTCurrentUser')
    const data = JSON.parse(userData)
    console.log(data, '<=========data')

    const param = {
      search: {
        agency_id: data.agency_id

      }
    }
    this.masterService.postRequestCreator('getAgencyUserIndentorDataById/' + data.agency_id, null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''      
       this.agencyName = res  && res.agency_name ? res.agency_name : '';
       console.log(this.agencyName,'agencyNameagencyName')
      if(this.agencyName.toLowerCase()=='nsai'){
        
        // this.Sector_name = 'Private Company';
        // this.ngForm.controls['sector'].setValue('Private Company');
        this.disableOrganisation = true
      }else{
        this.disableOrganisation = false;
      }
      if (!this.stateCode) {
        this.selected_state = res && res.m_state && res.m_state.state_name ? res.m_state.state_name : '';
        this.ngForm.controls['state'].setValue(res && res.m_state && res.m_state.state_code ? res.m_state.state_code : '',{ emitEvent: false })
        this.getDistrictList(res && res.m_state && res.m_state.state_code ? res.m_state.state_code : '')      
      }else{
            this.cancelbtnEnable = true;
            this.getStateList()
            
            
      }
      if (this.isEdit || this.isView) {
      }
      // if(!this.stateCode){

      
      // }
    })
  }
  getCentralData() {
    this.masterService.postRequestCreator('getCentralData', null, {
      search:{
        type:"SPA"
      }
    }).subscribe(data => {
      let sectorData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : ''
      this.getSelectedSector()
      let sectorDataValue = []
     if(!this.stateCode)
      {
        sectorData.forEach(item=>{
          if(item.name == "Private Company" || item.name =="private company" || item.name =="privatecompany"){
          }else{
            sectorDataValue.push(item);
          }
        })
      }
      this.sectorList = sectorDataValue;
      this.sectorListsecond = this.sectorList
    })
  }
  SectorName(data) {
    this.Sector_name = data && data.name ? data.name : '';
    this.ngForm.controls['sector'].setValue(data && data.central_id ? data.central_id : '');

  }
  getSelectedSector(){
    console.log(this.sectorList)
    if(this.agencyName.toLowerCase()=='nsai'){
      if(this.sectorList){

        this.sectorList.forEach(element => {
          if(element.name.replace(/ /g,'').toLowerCase() =='privatecompany'){
            this.Sector_name = element && element.name ? element.name : '';
            this.ngForm.controls['sector'].setValue(element && element.central_id ? element.central_id : '')
          }
          
        });
      }
    }
  }
}
