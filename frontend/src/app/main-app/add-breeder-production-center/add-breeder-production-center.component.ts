import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { checkAlpha, checkAlphaforShortname, checkDecimal, checkLength, checkNumber, ConfirmAccountNumberValidator, errorValidate } from 'src/app/_helpers/utility';
import { UserCreateApi } from 'src/app/_serverApis/api';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-breeder-production-center',
  templateUrl: './add-breeder-production-center.component.html',
  styleUrls: ['./add-breeder-production-center.component.css']
})
export class AddBreederProductionCenterComponent implements OnInit {
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();  
  enrollFormGroup!: FormGroup;
  submitted = false;
  public ngForm: FormGroup;
  stateList: any = [];
  districtList: any = [];
  designationList = [];
  agency_name: any;
  disabledfield: boolean = false;
  cancelbtn!: boolean;
  isView: boolean = false;
  indentorData: any;
  selectDistricts;
  breederCategory;
  bank_name;
  select_state;
  updateBtn = false;
  max_long = '';
  min_long = '';
  LongituteError = '';
  LatituteError = '';
  min_lat = '';
  max_lat = '';
  submissionid = this.route.snapshot.paramMap['params'].submissionId; response: any;
  isActive = 1;
  isShowDiv = true;
  disablesearchBtn=true;
  bankNameList = [

  ]
  phoneList = [
    {
      id: 1,
      name: "91",
    },

  ]


  branchNameList = [

  ]
  // get enrollFormControls() {
  //   return this.enrollFormGroup.controls;
  // }
  breederCategoryList = [
    {
      id: 1,
      category: 'ICAR',
    },
    {
      id: 2,
      category: 'SAU',
    },
    {
      id: 3,
      category: 'KVK',
    },
    // {
    //   id: 4,
    //   category: 'Private Company',
    // },
    {
      id: 4,
      category: 'PRIVATE',
    },

  ]
  selectstate: any;
  response_phone_number: any;
  isEdit: boolean = false;
  response_fax_number: any;
  user_id: any;
  listData: any;
  User_id;
  value: any;
  prodShortNameErrMsg: string;
  prodShortNameShowErrMsg: boolean = false;
  pastedText: any;
  pastedNumber: any;
  selected_bankname;

  plantsData: any;
  public isDropdownDisabled = false;
  dropdownSettings: IDropdownSettings = {};
  cropNameDataList: any;
  ssp_data: any;
  currentFormData: any;
  bspccode: any;
  longitutepatchValue: any;
  latitutedpatchValue: any;
  plantViewData: any[];
  selected_state;
  selected_district: any;
  stateListSecond: any;
  districtListSecond: any;
  selected_branchname: any;
  bankNameListsecond: any[];
  branchNameListsecond: any[];
  shortNameValidation: string;
  stateCode: any;
  bankCode: any;
  ifscError='';
  disablesubmitbtn: boolean=false;
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
  bankChecks: any = "";
  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private service: SeedServiceService,
    private breederService: BreederService,
    private userCreateApi: UserCreateApi
  ) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      centre_name: ['', [Validators.required,
      Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[A-Za-z ]{0,50}$')])
      ]],
      // category_breeder: ['', Validators.required],
      display_name: ['', [Validators.required,
      Validators.compose([Validators.pattern(/^\S*$/), Validators.minLength(3),Validators.maxLength(10)])
      ]],
      state: ['', Validators.required],
      district: ['', Validators.required],
      address: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        Validators.pattern('^([A-Za-z-(), ]|[0-9]{0,150})+$')

      ])],
      nodal_officer_name: ['', [Validators.required,
      Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.pattern('^[A-Za-z.() ]{0,50}$')])
      ]],//, Validators.pattern("^[0-9]{12}$")
      // contact_person_name: ['', [Validators.required, Validators.pattern("^[a-zA-Z_ ]{1,50}$")]],
      nodal_officer_designation: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      mobile: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],//, Validators.pattern("^[0-9]{12}$")
      // mobile_ext: ['91',],
      email: ['', [Validators.required, Validators.compose([Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$'), Validators.pattern('^.{0,100}$')])]],//,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$")
      phone: ['', [Validators.pattern('^\s*-?[0-9]{1,15}\s*$')]],//, [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]
      bank_branch_name: ['',],
      bank_name: ['', ],//,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$")
      ifsc: ['', [Validators.required,Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],//, Validators.pattern("^[0-9]{12}$")
      bank_account_number: ['', [Validators.required, Validators.pattern('^\s*-?[0-9]{9,16}\s*$')]],
      confirm_bank_account_number: ['', [Validators.required, Validators.pattern('^\s*-?[0-9]{9,16}\s*$')]],
      fax_number: ['', [Validators.pattern('^\s*-?[0-9]{1,15}\s*$')]],//, [Validators.required,]
      latitude: [''],
      longitude: [''],
      ssp_data: ['',[Validators.required]],
      bspcCode:[''],
      status_toggle:[''],
      state_text:[''],
      district_text:[''],
      bank_name_text:[''],
      branch_name_text:[''],
      name_of_institute:['',[Validators.required]]
      // [Validators.required]
      // [Validators.required]
      // phone_ext: ['91', Validators.required],
    },

      {
        validator: ConfirmAccountNumberValidator("bank_account_number", "confirm_bank_account_number")
      }
    );

    this.ngForm.controls['state'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getDistrictList(newValue);
        this.stateCode = newValue;
        // this.getBankDetails(newValue);
        this.ngForm.controls["district"].setValue('');
        this.selected_district=''
        this.LongituteError = '';
        this.LatituteError = '';
        this.selected_district =''
      }
    });

    this.ngForm.controls['district'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.LongituteError = '';
        this.LatituteError = ''
      }
    });

    // this.ngForm.controls["bank_branch_name"].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.getifscCode(newValue)
    //   }
    // })
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
    this.ngForm.controls['ifsc'].valueChanges.subscribe(newValue => {
      if (newValue) {
      this.ifscError='Click on search to get branch details.'
      if(!this.ngForm.controls['ifsc'].errors?.['required'] && !this.ngForm.controls['ifsc'].errors?.['pattern']){

        this.disablesearchBtn=false;
      }
      }
    });
    // this.ngForm.controls["bank_name"].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     console.log('newValuebankname',newValue)
    //     this.bankCode = newValue;
    //     this.getBankBranchName(this.stateCode);
    //     this.selected_branchname=''
    //   }
    //   if (this.ngForm.controls["bank_branch_name"].value) {
    //     this.ngForm.controls["bank_branch_name"].setValue("");
    //     this.ngForm.controls["ifsc"].setValue("");
    //   }
    // })
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateList =this.stateListSecond;
        this.stateList=this.stateList.filter(x=>x.state_name!=null)
        let response= this.stateList.filter(x=>x.state_name.toLowerCase().includes(newValue.toLowerCase()))      
        this.stateList=response;       
      }
      else{
        if(!this.isView){
          this.getStateList()
        }       
      }
    });
    // this.ngForm.controls['bank_name_text'].valueChanges.subscribe(newValue => {
    //   if (newValue ) {
    //     console.log(newValue)
    //     this.bankNameList =this.bankNameListsecond
    //     let response= this.bankNameList.filter(x=>x.bank_name.toLowerCase().includes(newValue.toLowerCase()))
      
    //     this.bankNameList=response
    //     // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
    //   }
    //   else{
    //     if(!this.isView){

    //       // this.getBankDetails(this.stateCode)
    //     }
       
    //   }
    // });
    
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue &&  this.districtList.length) {
        console.log(newValue)
        this.districtList =this.districtListSecond
        let response= this.districtList.filter(x=>x.district_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.districtList=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        if(!this.isView){

        this.getDistrictList(this.ngForm.controls['state'].value)
        }
      }
    }); 
    // this.ngForm.controls['branch_name_text'].valueChanges.subscribe(newValue => {
    //   if (newValue ) {
       
    //     this.branchNameList =this.branchNameListsecond
    //     let response= this.branchNameList.filter(x=>x.branch_name.toLowerCase().includes(newValue.toLowerCase()))
      
    //     this.branchNameList=response
    //     // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
    //   }
    //   else{
    //     if(!this.isView){

    //       this.getBankBranchName(this.ngForm.controls['bank_name'].value)
    //     }
       
    //   }
    // });

    if (this.router.url.includes('view')) {
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.updateBtn = false;
      this.isEdit = false;
      this.ifscError=''
      this.isDropdownDisabled = true;
      this.getBspcCode()

      this.getListData();
    }
    if (this.router.url.includes('edit')) {
      this.ngForm.controls["email"].disable();
      this.isView = false;
      this.updateBtn = true;
      this.isEdit = true;
      this.ifscError=''
      this.getListData();
      this.getBspcCode()
    }
  }

  ngOnInit(): void {
   
    this.dropdownSettings = {
      idField: 'id',
      textField: 'plant_name',
      enableCheckAll: false,
      allowSearchFilter: true,
      // limitSelection: -1,
      itemsShowLimit: 2,
      // singleSelection: false,
      // selectAllText: 'Select All',
      // unSelectAllText: 'Unselect All '
    };
    if (this.isView) {
      this.isDropdownDisabled = true;
    }
    this.submissionid = this.route.snapshot.paramMap.get('submissionid');

    const BHTCurrentUser = localStorage.getItem("BHTCurrentUser");

    const data = JSON.parse(BHTCurrentUser);

    this.User_id = data.id
    this.ngForm.controls['bspcCode'].disable()

    // this.getPageData();
    this.getStateList();
    // this.getUserDataId();

    this.getDesignation();

   
    this.getPlantsDetails() 
    

  }
  checkShortName(event){
    let route =  "check-short-name-data-for-all"
    let param ={
     sort_name :(this.ngForm.controls['display_name'].value ? this.ngForm.controls['display_name'].value:''),
     id:parseInt(this.route.snapshot.paramMap['params'].submissionId) ? parseInt(this.route.snapshot.paramMap['params'].submissionId) :null,
     type:"BSPC"
    };
    this.masterService.postRequestCreator(route,null,param).subscribe(res=>{
     if(res.EncryptedResponse.status_code === 200){
       this.shortNameValidation = "Short Name Already Exist.";
       return;
     }else{
       this.shortNameValidation = ""
     }
    }) 
  }
  async getPlantsDetails() {
    console.log(this.plantViewData,'plantViewData')
   if(!this.isView){
    let plantcode =[]
    
    this.plantsData = [];
   
    this.masterService.postRequestCreator("getAllPlantsForBSPC", null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code == 200) {
          this.plantsData = apiResponse.EncryptedResponse.data;
        }
      });
   }
  }


  async getStateList() {
    this.masterService
      .getRequestCreatorNew("get-state-list")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data;
          // this.stateList= this.stateList.filter(x=>x.state_name!=nuul)
          this.stateListSecond = this.stateList
        }
      });

  }
  selectState(item: any) {
    this.selectstate = item.state_name;
    this.select_state = item.id;
    this.ngForm.controls["state"].setValue(item.state_code);

  }
  bankName(item) {

  }
  selectDistrict(data) {
    this.selectDistricts = data.district_name;
    this.ngForm.controls["district"].setValue(data.id);
  }


  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state_code": (newValue).toString()
      }
    };
    this.masterService
      .postRequestCreator("get-district-list", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data;
          this.districtListSecond = this.districtList
        }
      });

  }


  onSubmit(formData: any) {

    console.log(formData)
    if ((this.isEdit || this.isView) && this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    }
    if ((this.isEdit || this.isView) && this.ngForm.controls['status_toggle'].value === false) {
      this.isActive = 0;
    }
   
    this.checkShortName(null);
    const param = {
      agency_name: (this.ngForm.controls["centre_name"].value.trim()).toUpperCase(),
      state_code: this.ngForm.controls["state"].value,
      district_code: this.ngForm.controls["district"].value,
      address: this.ngForm.controls["address"].value,
      display_name: (this.ngForm.controls["display_name"].value.trim()).toUpperCase(),
      contact_person_name: this.ngForm.controls["nodal_officer_name"].value,
      contact_person_designation: parseInt(this.ngForm.controls["nodal_officer_designation"].value),
      phone_number: this.ngForm.controls["phone"].value,
      fax_no: this.ngForm.controls["fax_number"].value,
      longitude: this.ngForm.controls["longitude"].value,
      latitude: this.ngForm.controls["latitude"].value,
      email: this.ngForm.controls["email"].value,
      mobile_number: this.ngForm.controls["mobile"].value,
      bank_name: this.ngForm.controls["bank_name"].value,
      bank_branch_name: this.ngForm.controls["bank_branch_name"].value,
      bank_ifsc_code: this.ngForm.controls["ifsc"].value,
      bank_account_number: this.ngForm.controls["bank_account_number"].value,
      confirm_bank_account_number: this.ngForm.controls["confirm_bank_account_number"].value,
      name_of_institute: this.ngForm.controls["name_of_institute"].value,
      
      createdby: this.User_id,
      updatedBy: this.User_id,
      active: this.isActive,
    }


    this.submitted = true;
    if (this.ngForm.invalid) {
      return;
    }

    if (!this.ngForm.controls["centre_name"].value 
    || !this.ngForm.controls["display_name"].value 
    || !this.ngForm.controls["state"].value 
    || !this.ngForm.controls["district"].value 
    || !this.ngForm.controls["bank_account_number"].value 
    || !this.ngForm.controls["mobile"].value 
    || !this.ngForm.controls["email"].value 
    || !this.ngForm.controls["name_of_institute"].value 
    // || !this.ngForm.controls["latitude"].value 
    // || !this.ngForm.controls["longitude"].value 
    || this.ngForm.controls["mobile"].errors 
    || this.ngForm.controls["confirm_bank_account_number"].errors 
    || this.ngForm.controls["email"].errors 
    || this.LatituteError
    || this.LongituteError 
    || this.ifscError
    || this.ngForm.controls["phone"].errors) {
      return;
    }
    this.breederService
      .postRequestCreator('add-breeder-production', null, param)
      .subscribe(async (apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          let resp = apiResponse.EncryptedResponse.data;
          let user = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data['user'] ? apiResponse.EncryptedResponse.data['user']:''
          if (formData.ssp_data) {
            let ssp_data = [];
            formData.ssp_data.forEach(data => {
              let object = {
                user_id: user.id,
                agency_id: user.agency_id,
                plant_id: data.id
              }

              ssp_data.push(object);
            });
            console.log('ssp===data==create',ssp_data);
            this.breederService.postRequestCreator('create_bspc_to_plants', null, ssp_data).subscribe((data: any) => {
              if (data && data.EncryptedResponse.status_code == 200) {
                Swal.fire({
                  title: `<p style="font-size:25px;">Data Has Been Successfully Saved.<br> Username for this BSPC is ${user &&user.username ? user.username:"NA"} and password is seeds#234.</p>`,
                  icon: 'success',
                  confirmButtonText:
                    'OK',
                confirmButtonColor: '#E97E15'
                }).then(x => {

                  this.router.navigate(['/add-breeder-production-center-list']);
                })
              }
              
              else {
                Swal.fire({
                  toast: true,
                  icon: "error",
                  title: data.EncryptedResponse.message,
                  position: "center",
                  showConfirmButton: false,
                  showCancelButton: false,
                  timer: 2000
                })
              }
            },
             
            
            (error: any) => {
              console.log(error)
              Swal.fire({
                title: 'Oops',
                text: '<p style="font-size:25px;">Something Went Wrong.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
            })
          } else {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            }).then(x => {

              // this.router.navigate(['/add-breeder-production-center-list']sssss);
            })
          }



        } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 401) {
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
        else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
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



  checkAlpha(event) {
    checkAlpha(event)
  }


  checkLength($e, length) {
    checkLength($e, length);
  }

  checkNumber($e) {
    checkNumber($e);
  }


  getListData() {
    if (this.isView) {
      this.ngForm.disable();
    }
    const param = {
      id: this.submissionid
    }
    
    const route = "breeder-list";
    const result = this.breederService.postRequestCreator(route, null, param).subscribe((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      console.log('response=================',response);
      if (response && response.length > 0) {
        console.log(response)

        this.currentFormData = response[0];

        this.breederCategory = response[0].category;
        this.indentorData = response[0];
        if (response[0].agency_name)
          this.ngForm.controls["centre_name"].setValue(response[0].agency_name);
        if (response[0].short_name)
          this.ngForm.controls["display_name"].patchValue(response[0].short_name);
        if (response[0].address)
          this.ngForm.controls["address"].patchValue(response[0].address);
        // this.ngForm.controls["category_breeder"].patchValue(response[0].category);
        if (response[0].bank_name)
          this.ngForm.controls["bank_name"].patchValue(response[0].bank_name);
        if (response[0].bank_ifsc_code)
          this.ngForm.controls["ifsc"].patchValue(response[0].bank_ifsc_code,{ emitEvent: false });
        if (response[0].bank_branch_name)
          this.ngForm.controls["bank_branch_name"].patchValue(response[0].bank_branch_name);
        if (response[0].bank_account_number)
          this.ngForm.controls["bank_account_number"].patchValue(response[0].bank_account_number);
        if (response[0].bank_account_number)
          this.ngForm.controls["confirm_bank_account_number"].patchValue(response[0].bank_account_number);
        if (response[0].contact_person_mobile)
          this.ngForm.controls["mobile"].patchValue(response[0].contact_person_mobile);
        if (response[0].email)
          this.ngForm.controls["email"].patchValue(response[0].email);
        if (response[0].phone_number) {

          this.ngForm.controls["phone"].patchValue(response[0].phone_number);

          this.response_phone_number = response[0].phone_number
        }
        if (response[0].fax_no) {

          this.ngForm.controls["fax_number"].patchValue(response[0].fax_no);
          this.response_fax_number = response[0].fax_no;
        }
       
        if (response[0].latitude)
          this.ngForm.controls["latitude"].patchValue(response[0].latitude);
        if (response[0].longitude)
          this.ngForm.controls["longitude"].patchValue(response[0].longitude);
        if (response[0].state_id)
          this.ngForm.controls["state"].patchValue(response[0].state_id);
          this.stateCode = response[0].state_id;
        // this.getDistrictList((response[0].state_id).toString());
        this.ngForm.controls["district"].patchValue(response[0].district_id);
        if (response[0].contact_person_designation_id)
          this.ngForm.controls["nodal_officer_designation"].patchValue(response[0].contact_person_designation_id);
        if (response[0].contact_person_name)
          this.ngForm.controls["nodal_officer_name"].patchValue(response[0].contact_person_name);

        if (response && response[0].is_active == 0) {
            this.ngForm.controls['status_toggle'].patchValue(false);
            this.isShowDiv = true;
            this.isActive = 0;
          }
        if (response && response[0].is_active == 1) {
            this.ngForm.controls['status_toggle'].patchValue(true);
            this.isShowDiv = false;
            this.isActive = 1;
          }
          this.ngForm.controls['name_of_institute'].setValue(response && response[0] && response[0].name_of_insitution ? response[0].name_of_insitution:'')
          this.latitutedpatchValue=response && response[0] && response[0].latitude ? response[0].latitude:''
          this.longitutepatchValue= response && response[0] && response[0].longitude ? response[0].longitude :''
          this.selected_bankname = response && response[0] && response[0].bank_name ? response[0].bank_name :''
          this.selected_branchname = response && response[0] && response[0].bank_branch_name ? response[0].bank_branch_name    :''
          this.selected_state = response && response[0] && response[0].m_state &&  response[0].m_state.state_name ? response[0].m_state.state_name   :''
          this.selected_district = response && response[0] && response[0].m_district &&  response[0].m_district.district_name ? response[0].m_district.district_name   :''
         
        let plantsData = []
        // response[0].bspc_to_plant.plant_detail.forEach(data => {
        response.forEach(data => {
          data.bspc_to_plants.forEach(ele=>{
            let object = {
              id: ele.user.id,
              plant_name: ele.user.plant_name,
            }
            plantsData.push(object)
          })
        });
         
        this.ngForm.controls["ssp_data"].patchValue(plantsData);
        this.plantViewData=(plantsData); 
      }
    });
   
  }

  editData() {
    console.log(this.ngForm.value)
    console.log(this.currentFormData)
    this.checkShortName(null);
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    }
    if (this.ngForm.controls['status_toggle'].value === false) {
      this.isActive = 0;
    }
    const param = {
      id: parseInt(this.route.snapshot.paramMap['params'].submissionId),
      agency_name: (this.ngForm.controls["centre_name"].value.trim()).toUpperCase(),
      state_code: this.ngForm.controls["state"].value,
      district_code: this.ngForm.controls["district"].value,
      address: this.ngForm.controls["address"].value,
      display_name: (this.ngForm.controls["display_name"].value.trim()).toUpperCase(),
      contact_person_name: this.ngForm.controls["nodal_officer_name"].value,
      contact_person_designation_id: parseInt(this.ngForm.controls["nodal_officer_designation"].value),
      phone_number: this.ngForm.controls["phone"].value,
      fax_no: this.ngForm.controls["fax_number"].value,
      longitude: this.ngForm.controls["longitude"].value,
      latitude: this.ngForm.controls["latitude"].value,
      email: this.ngForm.controls["email"].value,
      mobile_number: this.ngForm.controls["mobile"].value,
      bank_name: this.ngForm.controls["bank_name"].value,
      bank_branch_name: this.ngForm.controls["bank_branch_name"].value,
      bank_ifsc_code: this.ngForm.controls["ifsc"].value,
      bank_account_number: this.ngForm.controls["bank_account_number"].value,
      confirm_bank_account_number: this.ngForm.controls["confirm_bank_account_number"].value,
      created_by: this.User_id,
      active: this.isActive,
      name_of_institute:this.ngForm.controls["name_of_institute"].value
    }
    this.submitted = true;
    if (this.ngForm.invalid || this.LatituteError || this.LongituteError || this.ifscError ) {
      return;
    }

    this.breederService.postRequestCreator("update-indentor", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {

          let data = [];
          if(this.ngForm.value.ssp_data && this.ngForm.value.ssp_data.length > 0) {
            this.ngForm.value.ssp_data.forEach(ssp_data => {
              let object = {
                user_id: this.currentFormData.user_id,
                agency_id: this.currentFormData.id,
                plant_id: ssp_data.id
              }

              data.push(object);
            });
          }
          let object = {
            user_id: this.currentFormData.user_id,
            ssp_data: data
          }

          this.breederService.postRequestCreator('update_bspc_to_plants', null, object).subscribe((data: any) => {
            console.log(data)
            if (data && data.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              }).then(x => {

                this.router.navigate(['/add-breeder-production-center-list']);
              })
            }
            else {
              Swal.fire({
                toast: true,
                icon: "error",
                title: data.EncryptedResponse.message,
                position: "center",
                showConfirmButton: false,
                showCancelButton: false,
                timer: 2000
              })
            }
          }, (error: any) => {
            console.log(error)
            Swal.fire({
              title: 'Oops',
              text: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
          })

        // Swal.fire({
        //   toast: true,
        //   icon: "success",
        //   title: "Data Has Been Successfully Updated",
        //   position: "center",
        //   showConfirmButton: false,
        //   showCancelButton: false,
        //   timer: 2000
        // }).then(x => {
        //   this.router.navigate(['/add-breeder-production-center-list']);
        // })
      }
      else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 401) {
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
      else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 403) {
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

  checkDecimal(e) {
    checkDecimal(e)
  }

  async getBankDetails(newValue) {
    const route = "get-bank-details";
    const result = await this.service.postRequestCreator(route, null, {
      search:{
        state_code:this.stateCode
      }
    }).subscribe((data: any) => {
      this.bankNameList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.rows ? data['EncryptedResponse'].data.rows : '';
    this.bankNameListsecond = this.bankNameList
    if(this.isEdit || this.isView){
      // this.getBankBranchName(this.stateCode);
    }
     
  })
  }

  async getBankBranchName(newValue: any) {
    const searchFilters = {
      search: {
        bank_name: this.bankCode,
        state_code:newValue ? newValue :''
      }
    };
    this.service
      .postRequestCreator("get-branch-details-details", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.branchNameList = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : '';
            this.branchNameListsecond = this.branchNameList
          }

        }
      });
  }

  async getifscCode(nrwValue) {
    const searchFilters = {
      "search": {
        bank_name: this.ngForm.controls["bank_name"].value,
        branch_name: nrwValue
      }
    };

    this.service
      .postRequestCreator("get-ifsc-code-details", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            let response = apiResponse.EncryptedResponse.data;
            if (response && response[0].ifsc_code) {
              this.ngForm.controls["ifsc"].setValue(response[0].ifsc_code)
            }





            // this.branchNameList = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data  ? apiResponse['EncryptedResponse'].data : '';

          }

        }
      });

  }
  getMinManLongLang() {
    this.submitted = true;

    if (!this.ngForm.controls["centre_name"].value || !this.ngForm.controls["display_name"].value
     || !this.ngForm.controls["state"].value || !this.ngForm.controls["district"].value || !this.ngForm.controls["bank_account_number"].value || !this.ngForm.controls["mobile"].value || !this.ngForm.controls["email"].value ||
      // !this.ngForm.controls["latitude"].value || !this.ngForm.controls["longitude"].value ||
     this.ngForm.controls["mobile"].errors || this.ngForm.controls["email"].errors || !this.ngForm.controls["confirm_bank_account_number"].value || this.ngForm.controls["confirm_bank_account_number"].errors) {
      return;
    }

    const searchFilters = {
      "search": {
        "district_id": (this.ngForm.controls["district"].value).toString(),
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
              if (( this.ngForm.controls['longitude'].value) && ((this.ngForm.controls['longitude'].value) < (this.min_long) || (this.ngForm.controls['longitude'].value) > (this.max_long))) {
                this.LongituteError = 'Please Enter Valid Longitute';
              }
            }
            if (this.max_lat != "NULL" && this.max_lat != '' && this.max_lat != null && this.min_lat != '' && this.min_lat != null && this.min_lat != "NULL") {
              if (( this.ngForm.controls['latitude'].value) && ((this.ngForm.controls['latitude'].value) < (this.min_lat) || (this.ngForm.controls['latitude'].value) > (this.max_lat))) {
                this.LatituteError = 'Please Enter Valid Latitude'
              }
            }

            if (this.LatituteError == '' && this.LatituteError == '') {
              console.log("edit balnk")
              if (this.router.url.includes('edit')) {
                console.log("edit balnk if")

                this.editData();
              }
              else {

                this.onSubmit(this.ngForm.value)
              }
            }
            else {
              console.log(" not null")
              if (this.router.url.includes('edit')) {
                console.log(" not null if")

                this.editData();
              }
              else {

                this.onSubmit(this.ngForm.value)
              }
            }
          }

        }
      });

  }
  async getDesignation() {
    this.masterService
      .postRequestCreator("get-all-designation",null,{
        search:{
          type:"BSPC"
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.designationList = apiResponse.EncryptedResponse.data;
          this.designationList =
            this.designationList.sort((a, b) => {
              // data.m_crop_variety.variety_name
              return a.name.localeCompare(b.name);
            }
            );
        }
      });
  }

  updateUserData() {
    //   if(!this.router.url.includes('edit')){
    //     return ;

    //   }
    //   else{
    //     const id = this.route.snapshot.paramMap['params'].submissionId

    //     const param={
    //       "id":parseInt(id),
    //       "agency_name": this.ngForm.controls["centre_name"].value,
    //       "display_name":this.ngForm.controls["display_name"].value.trim() ,
    //       "agency_id":this.user_id,
    //       "mobile_number":this.ngForm.controls["mobile"].value,
    //       "email":this.ngForm.controls["email"].value ,

    // }
    //     this.breederService.postRequestCreator('edit-user-data-production',null,param).subscribe(data=>{

    //     })
    //   }
  }
  // getUserDataId() {
  //   const param = {
  //     search: {
  //       "agency_id": this.route.snapshot.paramMap.get('submissionId')

  //     }
  //   }
  //   const res = this.masterService.postRequestCreator('get-user-data', null, param).subscribe(data => {
  //     let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : ""
  //     this.user_id = response && response[0].id ? response[0].id : '';
  //   })
  // }
  checkAlphaforShortname(event) {
    checkAlphaforShortname(event)
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
      event.preventDefault();
      if (field == 'latitude' || field == 'longitude') {
        let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.ngForm.get(field).value + fieldName;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      else {

        let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.ngForm.get(field).value + fieldName;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      // return false
    }

  }
  onPasteEmail(event: ClipboardEvent,field:string,length:string) {
    var alphaExp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$";
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    if ( this.pastedText.match(alphaExp)) {

      if( this.pastedText.length>len){
        const value =  this.pastedText;
        this.ngForm.get(field).setValue(value.substring(0,len))
      }
      else{
        this.ngForm.get(field).setValue(this.ngForm.get(field).value)
      }
      // return true
    }
    else {
      event.preventDefault();
      let fieldName = this.pastedText.replace("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$",'').replace(/^\s+|\s+$/g, '');
      let value = parseInt(length)
      fieldName =  this.ngForm.controls[field].value + fieldName.trimStart();
      this.ngForm.get(field).setValue(fieldName.substring(0,value))
      // return false
    }
 
   }
   isAlfa(evt) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    if (evt.target.selectionStart == 0 && evt.code == 'Space') {
      evt.preventDefault();
      return false;
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

  getBspcCode(){
    const param = {
      search: {
        "agency_id": this.route.snapshot.paramMap.get('submissionId')

      }
    }
    const res = this.service.postRequestCreator('getBspcCode', null, param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : ""
      this.bspccode = response && response[0].code ? response[0].code : '';
      this.ngForm.controls['bspcCode'].setValue(this.bspccode ? this.bspccode :'')
    })

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
  state_select(data){
    console.log('da',data)
    this.selected_state=data && data.state_name ? data.state_name :'';
    this.ngForm.controls['state'].setValue(data && data.state_code? data.state_code :'');
    this.ngForm.controls['state_text'].setValue('')
  }
  csClick() {
    document.getElementById('state').click();
  }
  cdClick() {
    document.getElementById('district').click();
  }
  district_select(data){
    this.selected_district=data && data.district_name ? data.district_name :'';
    this.districtList =this.districtListSecond
    this.ngForm.controls['district'].setValue(data && data.district_code ? data.district_code:'');
    this.ngForm.controls['district_text'].setValue('',{emitEvent:false})
  }
  bank_names(data){
    
    console.log("datadatadatadatadata",data)
    this.selected_bankname = data && data.bank_name ? data.bank_name :'';
    this.ngForm.controls['bank_name'].setValue(data && data.bank_name ? data.bank_name :'' ) 
  }
  cbClick(){
    document.getElementById('bank_name').click();
  }
  cbrClick(){
    document.getElementById('branch_name').click();
  }
  branch_names(data){
    console.log(data)
    this.selected_branchname = data && data.branch_name ? data.branch_name :'';
    this.ngForm.controls['bank_branch_name'].setValue(data && data.branch_name ? data.branch_name :'' ) 
    this.ngForm.controls['branch_name_text'].setValue('')
  }
  getBankDetailsData(){
    if(this.ngForm.controls['ifsc'].invalid){
      return;
    }
    this.ifscError='';
    this.service.postRequestCreator('getBankdetailsData',null,{
      search:{
        ifsc_code:this.ngForm.controls['ifsc'].value
      }
    }).subscribe(data=>{
      if(data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.count && data.EncryptedResponse.data.count!=0){
        this.disablesubmitbtn= false;
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows:'';
        // this.selected_bankname =response && response[0] && response[0].bank_name ? response[0].bank_name :'';
        this.ngForm.controls['bank_name'].setValue(response && response[0] && response[0].bank_name ? response[0].bank_name :'')
        // this.selected_branchname =response && response[0] && response[0].branch_name ? response[0].branch_name :'';
        this.ngForm.controls['bank_branch_name'].setValue(response && response[0] && response[0].branch_name ? response[0].branch_name :'')     
      }else{
        this.ngForm.controls['bank_name'].setValue('');
        this.ngForm.controls['bank_branch_name'].setValue('');
        this.disablesubmitbtn= true
        Swal.fire({ 
          title: '<p style="font-size:25px;">IFSC Code Not Found, Please Contact to Seed Division.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
    })
  }
}
