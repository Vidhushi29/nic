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
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

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
  fileImage;
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
  userType: any;
  designation: any;
  category_agency_data: any;
  category_agency_datasecond: any;
  category_agency: any;
  editdata=false;
  contactPersonDesignation: boolean;
  showMobileNumber: boolean;
  currLat: number;
  currLng: number;
  selectedFiles: any;
  file_name;
  Imagename: any;
  pathmulti: any;
  // fileImage: any;
  FileData: any;
  file: any;
  fileInput: any;
  image_name: any;
  ImgError: string;
  url: any;
  imageIconName: any;
  downloadUrl: any;
  fileName: any;
  fileData = new FormData();
  imgSrc;
  imgBaseUrl: any;
  responseDataValue: any;
  get enrollFormControls() {
    return this.enrollFormGroup.controls;
  }
  todaysDate: Date = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  dropdownSettings: {
    idField: string;
    textField: string;
    enableCheckAll: boolean;
    // itemsShowLimit: 2,
    limitSelection: number;
    allowSearchFilter: true
    // allowSearchFilter: true,
  };
  crop_datas
  yearofIntroduction!: Boolean;
  get generateDefaultMonth(): string {
    return (this.todaysDate.getMonth() > 9 ? "" : "0") + (this.todaysDate.getMonth() + 1) + '/' + (this.todaysDate.getFullYear() - 18)
  }
  public isDropdownDisabled = false;
  cropNameDataList: any;
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
      agency_name: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      category_agency: ['', [Validators.required]],
      state: ['', [Validators.required, Validators.required]],
      district: ['', [Validators.required]],
      display_name: ['', [Validators.required,
      Validators.compose([
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        Validators.pattern('^[a-zA-Z]{1,5}$')])
      ]],
      address: ['', [Validators.required,]],
      pincode: ['', Validators.required],//, Validators.pattern("^[0-9]{12}$")
      contact_person_name: ['', [Validators.required,
      Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[A-Za-z ]{0,50}$')])
        // ^[A-Za-z]{0,50}$
      ]],
      contact_person_designation: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],//, Validators.pattern("^[0-9]{12}$")
      // mobile_ext:['1',],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$")]],//
      phone: ['', [Validators.pattern('^[6-9][0-9]{9}$')]],//, []Validators.pattern("^[0-9]{12}$")
      fax_number: ['',],//[,]
      latitude: [''],
      longitude: [''],
      crop_data: [''],
      // phone_ext:['1', Validators.required],
      status_toggle: [''],
      code:['']
      // created_by: this.userId.id,
    });

    this.ngForm.controls['state'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getDistrictList((newValue).toString());
        this.ngForm.controls["district"].setValue('');
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
    // if (this.LongituteError != '') {
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

    if (this.router.url.includes('view')) {
      this.title = "View User's Profile";
      this.ngForm.disable();
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.isEdit = false;
      
    }

    if (this.router.url.includes('edit')) {
      this.title = "Update User's Profile ";
      this.disabledfield = false;
      this.cancelbtn = false;
      this.isEdit = true;
      this.isView = false;
      // this.getListData();
    }

  }
  ngOnInit(): void {
    this.ngForm.controls['display_name'].disable();
    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user)
    console.log(this.userId, 'userId')
    this.userType = this.userId.user_type
    this.dropdownSettings = {
      idField: 'crop_code',
      textField: 'crop_name',
      allowSearchFilter: true,
      enableCheckAll: false,
      // itemsShowLimit: 2,
      limitSelection: -1,

    };
    // console.log('userDatat',this.userId);
    this.submissionid = this.route.snapshot.paramMap.get('submissionId');
    console.log('submission id', this.submissionid);
    // this.getPageData();
    this.getCatetory(null);
    this.getStateList();
    this.getDesignation();
    this.getCropDataList()
    this.getUserData();
    this.getIPAddress();
   
    this.getListData();
    // this.getCurrentLocation()
  } 

  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;
      console.log('ip=======address', this.ipAddres);
    });
  }
  getCurrentLocation() {
    console.log(this.responseDataValue,'responseresponseresponseresponse')
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
  
        // this.currLat = position.coords.latitude;
        // this.currLng = position.coords.longitude;
        console.log(this.currLat  ,this.currLng )
        this.ngForm.controls['latitude'].setValue(this.currLat ? this.currLat.toFixed(2) :'');
        this.ngForm.controls['longitude'].setValue(this.currLng ? this.currLng.toFixed(2) :'')
      });
    }
    else {
      this.ngForm.controls['latitude'].setValue('');
        this.ngForm.controls['longitude'].setValue('')
      // alert("Geolocation is not supported by this browser.");
    }
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
        }
      });

  }
  async getDesignation() {
    let user = localStorage.getItem('BHTCurrentUser')
    let userData = JSON.parse(user);
    const param ={
      search:{
        type:userData && userData.user_type && (userData.user_type=='BPC') ?'BSPC' :userData && userData.user_type ?userData.user_type :''
      }
    }
    
    this.masterService
      .postRequestCreator("get-all-designation-profile",null,param)
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
        }
      });

  }


  onSubmit(formData: any) {
    let user = localStorage.getItem('BHTCurrentUser')
    let user_id = JSON.parse(user);
    let created_by = user_id.id;
    formData.created_by = user_id.id;
    formData.id = user_id.agency_id
    formData.user_id = user_id.id;
    console.log(formData, 'formData')

    this.submitted = true;
    if (this.shortNameShowErrMsg == true) {
      return;
    }
    // if(this.ngForm.invalid){
    //   return ;
    // }
    if (this.userType == 'BPC' || this.userType == 'BR') {
      if (!this.ngForm.controls["agency_name"].value
        || this.ngForm.controls["agency_name"].errors
        || !this.ngForm.controls["address"].value || this.ngForm.controls["address"].errors
        || !this.ngForm.controls["display_name"].value || this.ngForm.controls["display_name"].errors

        || !this.ngForm.controls["state"].value || !this.ngForm.controls["district"].value

        || !this.ngForm.controls["contact_person_name"].value || this.ngForm.controls["contact_person_name"].errors
        || !this.ngForm.controls["contact_person_designation"].value
        || !this.ngForm.controls["mobile"].value
        || !this.ngForm.controls["email"].value
        // || !this.ngForm.controls["latitude"].value
        // || !this.ngForm.controls["longitude"].value
        || this.ngForm.controls["mobile"].errors
        || this.ngForm.controls["phone"].errors
        || this.ngForm.controls["email"].errors) {
        return;
      }
    }
    else {
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
        // || !this.ngForm.controls["latitude"].value
        // || !this.ngForm.controls["longitude"].value
        || this.ngForm.controls["mobile"].errors
        || this.ngForm.controls["phone"].errors
        || this.ngForm.controls["email"].errors) {
        return;
      }
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
    console.log('')
    this.service.postRequestCreator('edit-profile/' + user_id.agency_id, null, formData).subscribe(apiResponse => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          if (formData) {
            this.redirect();
          }
          // this.router.navigate(['/bsp-dashboard']);
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
    })


  }
  redirect() {
    let user = localStorage.getItem('BHTCurrentUser')
    let user_id = JSON.parse(user)
    if ((user_id.user_type.toUpperCase()) == 'SD') {
      this.router.navigate(['/dashboardSeedSecond'])
      // location.reload()
    }

    if ((user_id.user_type.toUpperCase()) == 'BPC') {
      this.router.navigate(['/bsp-dashboard-second'])
    }
    if ((user_id.user_type.toUpperCase()) == 'BR') {
      this.router.navigate(['/breeder-dashboard'])
    }
    if ((user_id.user_type.toUpperCase()) == 'nodal-dashboard') {
      this.router.navigate(['/breeder-dashboard'])
    }
    // IN
    if ((user_id.user_type.toUpperCase()) == 'IN') {
      this.router.navigate(['/indentor-seed-dashboard'])
    }
    if ((user_id.user_type.toUpperCase()) == 'ICAR') {
      this.router.navigate(['/nodal-dasboard-seconds'])
    }
    if ((user_id.user_type.toUpperCase()) == 'HICAR') {
      this.router.navigate(['/nodal-dasboard-seconds'])
    }
    if ((user_id.user_type.toUpperCase()) == 'SPP') {
      this.router.navigate(['/spp-dashboard'])
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

        agency_id: user_id.agency_id,
        created_by: user_id.id
      }
      // created_by:this.userId.id
    }

    const route = "get-profile-data";
    const result = this.service.postRequestCreator('get-profile-data', null, param).subscribe((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.rows ? data['EncryptedResponse'].data.rows : '';
      console.log('responseresponseresponseresponse', data);
      this.responseDataValue=response
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
        console.log('response[0].category',response[0].category)
        this.ngForm.controls["category_agency"].patchValue(response[0].category);
        if(this.userType!='SPP'){
          this.ngForm.controls["display_name"].patchValue(response[0].short_name);
        }else{
          this.ngForm.controls["display_name"].patchValue(response && response[0] && response[0].contact_person_name ? response[0].contact_person_name :'');
        }
        // this.ngForm.controls["unitKgQ"].patchValue(data[0].unit.value);
        this.ngForm.controls["address"].patchValue(response[0].address);
        this.ngForm.controls["pincode"].patchValue(response[0].pincode);
        this.ngForm.controls["contact_person_name"].patchValue(response[0].contact_person_name);
        if (response[0].crop_data) {
          this.ngForm.controls["crop_data"].patchValue(response[0].crop_data);
        }
    
          if(response && response[0] && response[0].contact_person_designation
            && response[0].contact_person_designation){
            this.contactPersonDesignation=true
            }else{
              this.contactPersonDesignation=false
            }
      
        this.ngForm.controls["contact_person_designation"].patchValue(response && response[0] && response[0].contact_person_designation_id
          ? response[0].contact_person_designation_id : response && response[0] && response[0].contact_person_designation
            ? response[0].contact_person_designation : '');

        // }
        if(response && response[0] && response[0].mobile_number){
          this.showMobileNumber=true;
        }else{
          this.showMobileNumber=false;

        }
        console.log('response[0].contact_person_designation_id', response[0].contact_person_designation_id)

        this.ngForm.controls["mobile"].patchValue(response && response[0] && response[0].mobile_number ? response[0].mobile_number : response && response[0] && response[0].contact_person_mobile ? response[0].contact_person_mobile : "");
        this.ngForm.controls["email"].patchValue(response[0].email);
        this.response_phone_number = response[0].phone_number
        this.ngForm.controls["phone"].patchValue(response[0].phone_number);
        this.ngForm.controls["fax_number"].patchValue(response[0].fax_no);
        this.response_fax_number = response[0].fax_no;
        console.log('response_fax_number===>', this.response_fax_number);
        if(response && response[0] && response[0].latitude){
          this.currLat=response[0].latitude
        }
        if(response && response[0] && response[0].longitude){
          this.currLng=response[0].longitude
        }
         if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
    
            this.currLat = position.coords.latitude;
            this.currLng = position.coords.longitude;
            
            console.log(this.currLng,'this.currLngsss')
            if(response && response[0] && !response[0].latitude){
            this.ngForm.controls['latitude'].setValue( this.currLat ? this.currLat:'' );
            }
            if(response && response[0] && !response[0].longitude){
            this.ngForm.controls['longitude'].setValue(this.currLng ? this.currLng:'')
            }
          });
        }
        
      
        this.ngForm.controls['latitude'].setValue( this.currLat);
        this.ngForm.controls['longitude'].setValue(this.currLng)
        // this.getCurrentLocation()
   
        // this.ngForm.controls["latitude"].patchValue(response[0].latitude);
        // this.ngForm.controls["longitude"].patchValue(response[0].longitude);
        this.ngForm.controls["state"].patchValue(response[0].state_id);
        this.stateApidisable = false

        // this.getDistrictList((response[0].state_id).toString());
        this.ngForm.controls["district"].patchValue(response[0].district_id);
        this.ngForm.controls["code"].patchValue(user_id && user_id.code ? user_id.code :'');
        // this.ngForm.controls["category_agency"].patchValue(response[0].category);
      }

    });
  }



  getMinManLongLang() {
    this.submitted = true;

    console.log('district=====>', this.districtList);
    if (this.userType == 'BPC' || this.userType == 'BR') {
      if (!this.ngForm.controls["agency_name"].value
        || !this.ngForm.controls["address"].value || !this.ngForm.controls["display_name"].value
        || !this.ngForm.controls["state"].value || !this.ngForm.controls["district"].value || !this.ngForm.controls["contact_person_name"].value || !this.ngForm.controls["contact_person_designation"].value || !this.ngForm.controls["mobile"].value || !this.ngForm.controls["email"].value
        // || !this.ngForm.controls["latitude"].value || !this.ngForm.controls["longitude"].value 
        || this.ngForm.controls["mobile"].errors || this.ngForm.controls["email"].errors) {
        return;
      }
    } else {
      if (!this.ngForm.controls["agency_name"].value || !this.ngForm.controls["address"].value || !this.ngForm.controls["display_name"].value || !this.ngForm.controls["category_agency"].value || !this.ngForm.controls["state"].value || !this.ngForm.controls["district"].value || !this.ngForm.controls["pincode"].value || !this.ngForm.controls["contact_person_name"].value || !this.ngForm.controls["contact_person_designation"].value || !this.ngForm.controls["mobile"].value || !this.ngForm.controls["email"].value
        // || !this.ngForm.controls["latitude"].value || !this.ngForm.controls["longitude"].value 
        || this.ngForm.controls["mobile"].errors || this.ngForm.controls["email"].errors) {
        return;
      }
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
            if ((this.max_long) != null && (this.max_long) != "NULL" && this.max_long != '' && this.min_long != '' && (this.min_long) != "NULL" && (this.min_long) != null) {
              if (this.ngForm.controls['longitude'].value && ((this.ngForm.controls['longitude'].value) < (this.min_long) || (this.ngForm.controls['longitude'].value) > (this.max_long))) {
                this.LongituteError = 'Please Enter Valid Longitute';
              }
            }
            if (this.max_lat != "NULL" && this.max_lat != '' && this.max_lat != null && this.min_lat != '' && this.min_lat != null && this.min_lat != "NULL") {
              if (this.ngForm.controls['latitude'].value && ((this.ngForm.controls['latitude'].value) < (this.min_lat) || (this.ngForm.controls['latitude'].value) > (this.max_lat))) {
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
  getCatetory(id) {
    console.log("cate===id", id);
    let user = localStorage.getItem('BHTCurrentUser')
    let user_id = JSON.parse(user)
    this.masterService
      .postRequestCreator("get-all-categories", null, {
        search: {
          type: user_id && user_id.user_type && (user_id.user_type=='BPC') ? 'BSPC':user_id && user_id.user_type ? user_id.user_type :''
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.category_agency_data = apiResponse.EncryptedResponse.data;
          this.category_agency_datasecond = this.category_agency_data;

          console.log('categories_id==', this.category_agency_data);
          let data = this.category_agency_data.filter(item => item.id == id)
          this.category_agency = data && data[0] && data[0].category_name;
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
      let fieldName = this.pastedText.replace(/[^a-zA-Z ]/g, "").replace(/^\s+|\s+$/g, '');
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
        fieldName = this.ngForm.get(field).value + fieldName;
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


  }
  enableEdit(){ 
    this.ngForm.controls['pincode'].enable();
    this.ngForm.controls['contact_person_designation'].enable();
    this.ngForm.controls['fax_number'].enable();
    this.ngForm.controls['mobile'].enable();
    this.ngForm.controls['email'].enable();
    this.ngForm.controls['fax_number'].enable();
    this.ngForm.controls['longitude'].enable();
    this.ngForm.controls['latitude'].enable();
    this.ngForm.controls['contact_person_name'].enable();
    this.ngForm.controls['phone'].enable();
    this.ngForm.controls['latitude'].enable();
    this.ngForm.controls['crop_data'].enable();
    this.editdata=true
  }
  updateProfile(){
    let user = localStorage.getItem('BHTCurrentUser')
    let user_id = JSON.parse(user);
    let param=this.ngForm.value
    param.agency_id= user_id.agency_id,
    param.image_url= this.downloadUrl ? this.downloadUrl : '',
    param.user_id=user_id.id
    param.showMobileNumber=this.showMobileNumber ? this.showMobileNumber :"";
    param.contactPersonDesignation=this.contactPersonDesignation
    this.service.postRequestCreator('update-profile-data',null,param).subscribe(data=>{
      if(data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code==200){
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
            showCancelButton: false,
            confirmButtonColor: '#E97E15'
        }).then(x=>{
          let user = localStorage.getItem('BHTCurrentUser')
          let user_id = JSON.parse(user)
          if ((user_id.user_type.toUpperCase()) == 'SD') {
            this.router.navigate(['/dashboardSeedSecond'])
            // location.reload()
          }
      
          if ((user_id.user_type.toUpperCase()) == 'BPC') {
            this.router.navigate(['/bsp-dashboard-second'])
          }
          if ((user_id.user_type.toUpperCase()) == 'BR') {
            this.router.navigate(['/breeder-dashboard'])
          }
          if ((user_id.user_type.toUpperCase()) == 'nodal-dashboard') {
            this.router.navigate(['/breeder-dashboard'])
          }
          // IN
          if ((user_id.user_type.toUpperCase()) == 'IN') {
            this.router.navigate(['/indentor-seed-dashboard'])
          }
          if ((user_id.user_type.toUpperCase()) == 'ICAR') {
            this.router.navigate(['/nodal-dasboard-seconds'])
          }
          if ((user_id.user_type.toUpperCase()) == 'HICAR') {
            this.router.navigate(['/nodal-dasboard-seconds'])
          }
        })
      }else{
        Swal.fire({
          title: '<p style="font-size:25px;">Something went wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
            showCancelButton: false,
            confirmButtonColor: '#E97E15'
        })
      }

    })

  }
  getCropDataList() {
    const route = "distinct-crop-name-add-breder";
    let search = {};
  

    this.service
      .postRequestCreator(route, null, search)
      .subscribe((apiResponse: any) => {
        console.log(apiResponse);

        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this.isCropName = true;
          this.cropNameDataList = apiResponse.EncryptedResponse.data;
          // console.log('this.cropNameDataList=========',this.cropNameDataList);
        }
      });
  }
  uploadImage() {
    if(this.editdata){
      (document.getElementById('fileInput') as HTMLInputElement).click();
    }
  }
  onSelectFileUpload(event: any) {
    // this.uploadImage();
    (document.getElementById('fileInput') as HTMLInputElement).click();
    this.file = (document.getElementById('fileInput') as HTMLInputElement).value;
    let files = event.target.files[0]
    var allowedExtensions =
      /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    this.ImgError = '';
    // Image preview
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => {
        this.imgSrc = event.target?.result;
        this.imgBaseUrl = this.imgSrc.split(",")
        // const reader = new FileReader();

        reader.readAsDataURL(this.file);

      };
    }
  }
  onSelect(event) {
    this.file = this.FileData;
    let pdf = this.fileImage;
    this.pathmulti = event.target.files[0];

    this.Imagename = pdf.slice(12);

    console.log("------------00000000000---------")

    this.selectedFiles = event.target.files[0];
    const file = this.selectedFiles;
    this.file_name = null
   
    if (this.Imagename) {
      if (this.Imagename.length > 40) {
        this.Imagename = this.Imagename.split('.');
        let part_one = this.Imagename[0];
        let part_two = this.Imagename[1];

        part_one = part_one.substring(0, 39);
        this.Imagename = part_one + '.' + part_two;


        // this.Imagename=this.Imagename.slice(0,30)
      }
      else {
        this.Imagename = pdf.slice(12);
      }
    }

    let fileType = event.target.files[0].type;
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      const ImageBlob = this.fileInput.nativeElement.files[0];


      const formData = new FormData();
      let fileData = (document.getElementById('fileInput') as HTMLInputElement).value;
      formData.append('name', ImageBlob, ImageBlob.name);


      // const route = 'upload-image';
      const route = 'utils/upload';
      const data = this.ngForm.controls['']


      this.service.postRequestCreator(route, null, this.pathmulti).subscribe(data => {
        this.image_name = data && data.results && data.results.name ? data.results.name : '';


      })
      reader.onload = (event: any) => {
        this.ImgError = '';
        this.url = event.target.result;
      };
    } else {
      this.ImgError = 'Please Select Image File';
      this.url = '';
      this.Imagename = '';
      // window.alert('Please select correct image format');
    }
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file_name = null
      
      this.imageIconName = ''
      this.downloadUrl = '';
      this.selectedFiles = event.target.files[0];
      const file = this.selectedFiles;
      this.file = (document.getElementById('fileInput') as HTMLInputElement).value;

      this.fileName = file.name
      this.fileData["name"] = file.name;
      this.fileData["extension"] = file.type.split("/")[1];
      this.fileData['file'] = file;
      // let filenameext = event.target.files[0]
      // png,jpeg,jpg,gif,doc,
      // pdf,ppt,xlsx,


    this.imageIconName =  '';
    this.downloadUrl = '';
    this.imageIconName = '';
    this.selectedFiles = event.target.files[0];
    this.fileName = file.name
    var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!allowedExtensions.exec(file.name)) {
      this.ImgError = 'Please select Valid File.'
      // fileInput.value = '';
      return;
    }

    if (file.size > 2000000) {
      this.ImgError = 'Image Size too Big.'
      return;
    }

    this.file_name = this.fileName;


      var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

      if (!allowedExtensions.exec(this.file)) {
        this.ImgError = 'Please select Valid File'
        // fileInput.value = '';
        return;
      }
      else {

        Swal.fire({
          title: 'Uploading File...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null)
          }
        });
        this.service.upload(this.selectedFiles).subscribe(
          (res: any) => {
            if (typeof (res) === 'object' && res.status == 'success' && res.results) {
              console.log("resresres", res)
              const baseImage = res.results.name;
              this.imageIconName = environment.awsUrl + baseImage
              this.downloadUrl = res.results.name;
              this.ImgError = '';
              this.file_name = baseImage;
              
              // if(res.results.$metadata.httpStatusCode == 200 ){
              if (res.status == "success") {
                Swal.fire({
                  title: '<p style="font-size:25px;">Document Successfully Uploaded.</p>',
                  icon: 'success',
                  confirmButtonText:
                    'OK',
                confirmButtonColor: '#E97E15'
                })
              } else if (res.status_code && parseInt(res.status_code) == 404) {
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'File Size Exceed.',
                  showConfirmButton: false,
                  timer: 1000
                })
              } else {
                Swal.fire({
                  title: 'Oops',
                  text: '<p style="font-size:25px;">Something Went Wrong.</p>',
                  icon: 'error',
                  confirmButtonText:
                    'OK',
                confirmButtonColor: '#E97E15'
                })
              }

            } else if (res.status == "success") {

              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'File Size Exceed.',
                showConfirmButton: false,
                timer: 1000
              })
            } else if (res && parseInt(res.status_code) == 404) {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'File Size Exceed.',
                showConfirmButton: false,
                timer: 1000
              })
            } else {
              Swal.fire({
                title: 'Oops',
                text: '<p style="font-size:25px;">Something Went Wrong.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
            }

          }
        );
      }

    }
  }
}

