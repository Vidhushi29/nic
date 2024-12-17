import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { checkAlpha, checkAlphaforShortname, checkDecimal, checkLength, checkNumber, ConfirmAccountNumberValidator, errorValidate, } from 'src/app/_helpers/utility';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { UserCreateApi } from 'src/app/_serverApis/api';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-breeder',
  templateUrl: './add-breeder.component.html',
  styleUrls: ['./add-breeder.component.css']
})
export class AddBreederComponent extends ngbDropdownEvents implements OnInit {
  @ViewChild('myInput', { static: true }) myInput: ElementRef<HTMLInputElement>;
  isShowDiv: boolean = true;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  enrollFormGroup!: FormGroup;
  submitted = false;
  ngForm!: FormGroup;
  stateList: any = [];
  modalRef: any;
  districtList: any = [];
  designationList: any;
  agency_name: any;
  disabledfield: boolean = false;
  cancelbtn!: boolean;
  fileImage;
  isView: boolean = false;
  indentorData: any;
  selectDistricts;
  breederCategory;
  bank_name;
  select_state;
  updateBtn = false;
  acError: string;
  acDiv: boolean = false;
  max_long: any;
  min_long: any;
  LongituteError = '';
  LatituteError = '';
  min_lat: any;
  max_lat;
  isActive = 1;
  crop_datas
  submissionid = this.route.snapshot.paramMap['params'].submissionId; response: any;
  bankNameList: any = [];
  phoneList = [
    {
      id: 1,
      name: "91",
    },

  ]
  cropNameDataList: any;

  branchNameList = []
  // get enrollFormControls() {
  //   return this.enrollFormGroup.controls;
  // }
  breederCategoryList = [
  ]
  selectstate: any;
  title: string;
  alreadyExistsMsg = '';
  errorMsg: boolean;
  responseData: any;
  contactPersonName: any;
  contactPersonDesignation: any;
  isEdit: boolean = false;
  response_phone_number: any;
  user_id: any;
  User_id: any;
  selectedFiles: File;
  fileName: any;
  fileData: any;
  downloadUrl = '';
  imageIconName;
  imgSrc: string;
  imgModal;
  // dropdownSettings: IDropdownSettings = {};
  dropdownSettings: {
    idField: string;
    textField: string;
    enableCheckAll: boolean;
    // itemsShowLimit: 2,
    limitSelection: number;
    allowSearchFilter: true
    // allowSearchFilter: true,
  };

  // dropdownSettings : {
  //   singleSelection: false,
  //   idField: string,
  //   textField: string,
  //   enableCheckAll: boolean,
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'Unselect All',
  //   allowSearchFilter: true,
  //   limitSelection: number,
  //   clearSearchFilter: true,
  //   maxHeight: 197,
  //   itemsShowLimit: 3,
  //   searchPlaceholderText: '',
  //   noDataAvailablePlaceholderText: 'no item found',
  //   closeDropDownOnSelection: false,
  //   showSelectedItemsAtTop: false,
  //   defaultOpen: false
  // };

  userId: any;
  file_name: any;
  pastedText: string;
  pastedNumber: string;
  ImgError: string;
  longitutepatchValue: any;
  latitutedpatchValue: any;
  breederCategoryListSecond: any[];
  stateListSecond: any;
  districtListSecond: any;
  shortNameValidation: string;
  get enrollFormControls() {
    return this.enrollFormGroup.controls;
  }
  todaysDate: Date = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  category_agency;
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
  crop_data: any;
  hideUploadBtn: boolean = false;
  public isDropdownDisabled = false;
  state_name;
  district_name;
  selected_state;
  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private service: SeedServiceService,
    private breederService: BreederService,
    private userCreateApi: UserCreateApi,
    private _service: ProductioncenterService,
    private modalService: BsModalService
  ) {
    super();
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      breeder_name: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          Validators.pattern('^[A-Za-z ]{0,50}$')
        ])

      ],
      // Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.pattern('^[A-Za-z ]{0,50}$')])
      category_breeder: ['', Validators.required],
      display_name: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          Validators.minLength(3),
          Validators.maxLength(10)
        ])
      ],
      // Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.pattern('^[A-Za-z]{0,5}$')])
      state: ['', Validators.required],
      district: ['', Validators.required],
      address: ['', Validators.compose([
        Validators.required
        // Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        //Validators.pattern('^([A-Za-z-, ]|[0-9]{0,150})+$')

      ])],
      // Validators.compose([Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.pattern('^[A-Za-z]{0,50}$')])
      nodal_officer_name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        Validators.pattern('^[A-Za-z.() ]{0,50}$')
      ])
      ],
      nodal_officer_designation: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      mobile: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],//, Validators.pattern("^[0-9]{12}$")
      // mobile_ext: ['91',],
      email: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$'),

        ])
      ],

      phone: [''],//, [Validators.required,Validators.pattern('^[6-9][0-9]{9}$')], Validators.pattern("^[0-9]{12}$")

      // fax_number: ['', [Validators.required,]],
      latitude: ['', [Validators.pattern('^(.{1,10})$')]],
      longitude: ['', [Validators.pattern('^(.{1,10})$')]],
      crop_data: ['', [Validators.required]],
      file: [''],
      status_toggle: [''],
      category_text: [''],
      state_text: [''],
      district_text: ['']
      // 
      // phone_ext: ['91', Validators.required],
    },

      // {
      //   validator: ConfirmAccountNumberValidator("bank_account_number", "confirm_bank_account_number")
      // }


    );

    this.ngForm.controls['state'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getDistrictList(newValue);
        this.ngForm.controls["district"].setValue('');
        this.LongituteError = '';
        this.LatituteError = ''
        this.district_name = ''
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
        console.log(newValue)
        this.breederCategoryList = this.breederCategoryListSecond
        let response = this.breederCategoryList.filter(x => x.category.toLowerCase().includes(newValue.toLowerCase()))

        this.breederCategoryList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getCatetoryList()
        // this.getCroupNameList(this.group_code)
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

    this.ngForm.controls['display_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (newValue === this.responseData) {
          this.alreadyExistsMsg = '';
        }
        else {
          this.onBlurCropName(newValue)
        }
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
        console.log(newValue)
        this.districtList = this.districtListSecond
        let response = this.districtList.filter(x => x.district_name.toLowerCase().includes(newValue.toLowerCase()))

        this.districtList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getDistrictList(this.ngForm.controls['state'].value)

      }
    });

    if (this.router.url.includes('view')) {
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.updateBtn = false;
      this.ngForm.disable();
      this.isEdit = false;
      // this.getListData();
      // this.ngForm.disable()
      this.title = "View Project Co-ordinator";
      // : A Project Co-ordinator Into The System
    }

    if (this.router.url.includes('edit')) {
      this.updateBtn = true;
      // this.getListData();
      this.disabledfield = false;
      this.isEdit = true;
      // this.ngForm.controls['display_name'].disable();
      this.title = 'Update Project Co-ordinator';
    }
    if (!this.router.url.includes('view') && !this.router.url.includes('edit')) {
      this.title = "Add New Project Co-ordinator";
    }

  }

  ngOnInit(): void {
    if (this.isView) {
      this.isDropdownDisabled = true;
      this.hideUploadBtn = true
    }

    this.submissionid = this.route.snapshot.paramMap.get('submissionid');
    // this.getPageData();
    this.dropdownSettings = {
      idField: 'crop_code',
      textField: 'crop_name',
      allowSearchFilter: true,
      enableCheckAll: false,
      // itemsShowLimit: 2,
      limitSelection: -1,

    };
    this.getStateList();
    this.getDesignation();

    // this.getBankDetails();
    // this.getUserData();s
    this.getUserDataId();
    if (!this.isEdit && !this.isView) {
      this.getCropDataList()
    }

    if (this.isView) {
      this.ngForm.disable();
    }
    const BHTCurrentUser = localStorage.getItem("BHTCurrentUser");

    const data = JSON.parse(BHTCurrentUser);

    this.User_id = data.id
    this.getCatetoryList()
    if(this.isView || this.isEdit){
      this.getListData();
    }
  }

  checkShortName(event) {
    let route = "check-short-name-data-for-all"
    let param = {
      sort_name: (this.ngForm.controls['display_name'].value ? this.ngForm.controls['display_name'].value : ''),
      id: parseInt(this.route.snapshot.paramMap['params'].submissionId) ? parseInt(this.route.snapshot.paramMap['params'].submissionId) : null,
      type: "PC"
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

  async getStateList() {
    this.service
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


  bankName(item) {

  }

  // getUserData() {
  //   let route = "get-user-data"
  //   this._service.postRequestCreator(route, null, null).subscribe((data: any) => {
  //     this.contactPersonName = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.agency_detail && data.EncryptedResponse.data.agency_detail.contact_person_name ? data.EncryptedResponse.data.agency_detail.contact_person_name : '';
  //     this.contactPersonDesignation = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.agency_detail && data.EncryptedResponse.data.agency_detail.contact_person_designation && data.EncryptedResponse.data.agency_detail.contact_person_designation ? data.EncryptedResponse.data.agency_detail.contact_person_designation : '';
  //     // this.ngForm.controls["breader_production_name"].setValue(this.contactPersonName ? this.contactPersonName : 'Breeder Production Centre');
  //     let userData1 = localStorage.getItem('loginInfo');
  //     let userData = JSON.parse(userData1)
  //     // this.userId = data.EncryptedResponse.data.rows ;
  //     // console.log('this.userID',this.userId);
  //     // console.log('userData', userData['designation']);
  //     // this.ngForm.controls["nodal_officer_designation"].setValue((this.contactPersonDesignation ? this.contactPersonDesignation : (userData && userData['designation'] ? userData['designation'] :'nodal designation')));
  //     // this.ngForm.controls["nodal_officer_designation"].disable();
  //   });
  // }

  getCropDataList() {
    const route = "distinct-crop-name-add-breder";
    let search = {};
    if (this.isView || this.isEdit) {
      let data = this.ngForm.controls['crop_data'].value
      let crop_code_Arr = [];
      for (let i = 0; i < data.length; i++) {

        crop_code_Arr.push(data[i].crop_code)
        // console.log(data[i].crop_code,'crop_code')
      }
      search = {
        'search': crop_code_Arr,
        view: this.isEdit || this.isView ? true : ''
      }
    }
    else {
      search = {

      }
    }

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

  async getDesignation() {
    this.masterService
      .postRequestCreator("get-all-designation", null, {
        search: {
          type: "BR"
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

  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state_code": (newValue).toString()
      }
    };
    this.service
      .postRequestCreator("get-district-list", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data;
          this.districtListSecond = this.districtList
        }
      });

  }

  breeder(data) {
    this.breederCategory = data.category;
    // this.ngForm.controls["category_breeder"].setValue(data.category);
  }
  onSubmit(formData: any) {
    this.submitted = true;
    // if (!this.isEdit) {
      this.checkShortName(null);
    // }
    // if (!this.ngForm.controls["breeder_name"].value
    //   || !this.ngForm.controls["display_name"].value
    //   || !this.ngForm.controls["category_breeder"].value
    //   || !this.ngForm.controls["state"].value
    //   || !this.ngForm.controls["district"].value
    //   || !this.ngForm.controls["address"].value
    //   || !this.ngForm.controls["nodal_officer_name"].value
    //   || !this.ngForm.controls["nodal_officer_designation"].value
    //   || !this.ngForm.controls["mobile"].value
    //   || !this.ngForm.controls["email"].value
    //   || !this.ngForm.controls["bank_branch_name"].value
    //   || !this.ngForm.controls["bank_name"].value
    //   || !this.ngForm.controls["ifsc"].value
    //   || !this.ngForm.controls["bank_account_number"].value
    //   || !this.ngForm.controls["confirm_bank_account_number"].value
    //   || !this.ngForm.controls["latitude"].value
    //   || !this.ngForm.controls["longitude"].value
    //   || this.ngForm.controls["mobile"].errors
    //   || this.ngForm.controls["email"].errors
    //   || this.ngForm.controls["confirm_bank_account_number"].errors
    //   || this.ngForm.controls["crop_data"].errors
    //   || !this.downloadUrl

    // ) {
    //   return;
    // }
    if (this.ngForm.invalid) {
      return;
    }
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    }
    if (this.ngForm.controls['status_toggle'].value === false) {
      this.isActive = 0;
    }

    if (this.alreadyExistsMsg != '') {
      return;
    }
    if (this.LatituteError != '' || this.LongituteError != '') {
      return;
    }
    // if (this.ngForm.controls["confirm_bank_account_number"].value != this.ngForm.controls["bank_account_number"].value) {
    //   this.acDiv = true;
    //   this.acError = 'Please enter valid account number';
    // } else {
    //   this.acDiv = false;
    //   this.acError = ' ';
    // }


    const param = {
      agency_name: (this.ngForm.controls["breeder_name"].value.replace(/\s+/g, ' ').trim()).toUpperCase(),
      category: this.ngForm.controls["category_breeder"].value,
      state_id: this.ngForm.controls["state"].value,
      district_id: this.ngForm.controls["district"].value,
      address: (this.ngForm.controls["address"].value.replace(/\s+/g, ' ').trim()),
      display_name: (this.ngForm.controls["display_name"].value).toUpperCase(),
      contact_person_name: (this.ngForm.controls["nodal_officer_name"].value.replace(/\s+/g, ' ').trim()),
      contact_person_designation_id: this.ngForm.controls["nodal_officer_designation"].value,
      phone_number: this.ngForm.controls["phone"].value,
      longitude: this.ngForm.controls["longitude"].value,
      latitude: this.ngForm.controls["latitude"].value,
      email: this.ngForm.controls["email"].value,
      mobile_number: this.ngForm.controls["mobile"].value,

      createdby: this.User_id,
      updatedBy: this.User_id,
      image_url: this.downloadUrl ? this.downloadUrl : "",
      crop_data: this.ngForm.controls["crop_data"].value,
      is_active: this.isActive
    }


    this.breederService
      .postRequestCreator('add-breeder', null, param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          let resp = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data :'';
          // if (resp) {
          //   const request = {
          //     "search": {
          //       "id": resp.id,
          //     }
          //   }
          //   this.breederService.postRequestCreator('get-data', null, request).subscribe((apiResponse: any) => {
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
            title: `<p style="font-size:25px;">Data Has Been Successfully Saved.<br> Username for this PDPC is ${resp &&resp.username ? resp.username:"NA"} and password is seeds#234</p>`,
            icon: 'success',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'
          }).then(x => {

            this.router.navigate(['/add-breeder-list']);
          })
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
  checkLengths(event, length) {
    const inputField = document.getElementById('myInput');


    const inputValue = event.target.value;
    const selectionStart = event.target.selectionStart;

    // Check if the user pasted something
    if (event.inputType === 'insertFromPaste') {
      // Find the index of the start of the previous word
      const previousWordStart = inputValue.lastIndexOf(' ', selectionStart - 2) + 1;

      // Remove the previous word
      const newValue = inputValue.slice(0, previousWordStart) + inputValue.slice(selectionStart);

      // Set the new value of the input field
      event.target.value = newValue;

      // Move the cursor to the end of the new value
      event.target.selectionStart = event.target.selectionEnd = previousWordStart;
    }

  }

  checkNumber($e) {
    checkNumber($e);
  }



  getListData() {

    const param = {
      search: {

        id: this.route.snapshot.paramMap['params'].submissionId
      }
    }

    const route = "get-breeder-data-by-id";
    const result = this.breederService.postRequestCreator(route, null, param).subscribe((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.rows ? data['EncryptedResponse'].data.rows : '';
      if (response && response.length > 0) {
        this.breederCategory = response[0].category;
        this.responseData = response[0].short_name;
        this.indentorData = response[0];
        this.downloadUrl = environment.awsUrl + response && response[0] && response[0].image_url ? response[0].image_url : ''
        console.log('this.downloadUrl', this.downloadUrl)
        if (response && response[0] && response[0].image_url) {

          // this.imageIconName = "https://seeds-documents.s3.ap-south-1.amazonaws.com/" + response[0].image_url;
          this.imageIconName = environment.awsUrl + response[0].image_url;

        }
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

        if (response && response[0] && response[0].crop_data) {
          let cropData = response && response[0] && response[0].crop_data ? response[0].crop_data : ""
          // let cropData = response && response[0] && response[0].crop_data ? JSON.parse(response[0].crop_data) :""
          //console.log("response[0].crop_data", response[0].crop_data)
          // let cropData = response[0].crop_data
          this.crop_datas = cropData
        }
        console.log('this.', response[0].crop_data)
        if (response[0].agency_name)
          this.ngForm.controls["breeder_name"].setValue(response[0].agency_name);
        if (response[0].short_name)
          this.ngForm.controls["display_name"].patchValue(response[0].short_name);
        if (response[0].address)
          this.ngForm.controls["address"].patchValue(response[0].address);
        // if (response[0].category){
        //   let category;
        //   if(this.breederCategoryList && this.breederCategoryList.length>0){
        //     category =this.breederCategoryList.filter(x=>x.id== response[0].category)
        //   }
        //      console.log(category,'category',this.breederCategoryList)
        //     }

            this.ngForm.controls["category_breeder"].patchValue(response && response[0] && response[0].category ? response[0].category :'' );
        // if (response[0].bank_ifsc_code)
        //   this.ngForm.controls["ifsc"].patchValue(response[0].bank_ifsc_code);
        // if (response[0].bank_account_number)
        //   this.ngForm.controls["bank_account_number"].patchValue(response[0].bank_account_number);
        // if (response[0].bank_account_number)
        //   this.ngForm.controls["confirm_bank_account_number"].patchValue(response[0].bank_account_number);
        if (response[0].mobile_number)
          this.ngForm.controls["mobile"].patchValue(response[0].mobile_number);
        if (response[0].email)
          this.ngForm.controls["email"].patchValue(response[0].email);
        if (response[0].phone_number) {
          this.response_phone_number = response[0].phone_number
          this.ngForm.controls["phone"].patchValue(response[0].phone_number);
        }
        this.latitutedpatchValue = response && response[0] && response[0].latitude ? response[0].latitude : ''
        this.longitutepatchValue = response && response[0] && response[0].longitude ? response[0].longitude : ''
        if (response[0].latitude)
          this.ngForm.controls["latitude"].patchValue(response[0].latitude);
        if (response[0].longitude)
          this.ngForm.controls["longitude"].patchValue(response[0].longitude);
        // if (response[0].contact_person_designation){
        //   let designation;
        //  if(this.designationList && this.designationList.length>0){
        //   designation= this.designationList.filter(x=>x.id == response[0].contact_person_designation)
        //  }
        // }
        this.ngForm.controls["nodal_officer_designation"].patchValue(response && response[0] && response[0].contact_person_designation_id ? response[0].contact_person_designation_id : '');
        if (response[0].state_id)
          this.ngForm.controls["state"].patchValue(response[0].state_id);

        // this.ngForm.controls["state"].setValue(datas[0].id);
        // this.getDistrictList((response[0].state_id).toString());
        this.ngForm.controls["district"].patchValue(response[0].district_id);
        if (response[0].contact_person_name)
          this.ngForm.controls["nodal_officer_name"].patchValue(response[0].contact_person_name);


        if (response[0].crop_data) {
          this.ngForm.controls["crop_data"].patchValue(response[0].crop_data);
        }

        if (this.response && this.response[0] && this.response[0].image_url) {
          // this.imageIconName = "https://seeds-documents.s3.ap-south-1.amazonaws.com/" + this.response[0].image_url;

          this.imageIconName = environment.awsUrl + response[0].image_url;

        }
        if (this.isView || this.isEdit) {

          this.getCropDataList();
        }

        let filename = response && response[0] && response[0].image_url ? response[0].image_url : ''
        let name1 = filename.split('.')[0]
        let name2 = filename.split('.')[1]
        if (name1.length > 30) {
          name1 = name1.substring(0, 30)
          this.file_name = name1 + '.' + name2;


        }
        else {
          this.file_name = filename;

        }

      }
      this.state_name = response && response[0] && response[0].m_state && response[0].m_state.state_name ? response[0].m_state.state_name : '';
      this.district_name = response && response[0] && response[0].m_district && response[0].m_district.district_name ? response[0].m_district.district_name : '';


    });
  }

  getUserDataId() {
    const param = {
      search: {
        "agency_id": this.route.snapshot.paramMap.get('submissionId')

      }
    }
    const res = this.masterService.postRequestCreator('get-user-data', null, param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : ""
      this.user_id = response && response[0].id ? response[0].id : '';
      console.log('user===id', this.user_id);
    })
  }
  editData() {

    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    }
    if (this.ngForm.controls['status_toggle'].value == false) {
      this.isActive = 0;
    }
    if(this.ngForm.invalid){

      return ;
    }
    const param = {
      id: parseInt(this.route.snapshot.paramMap['params'].submissionId),
      agency_name: (this.ngForm.controls["breeder_name"].value.replace(/\s+/g, ' ').trim()).toUpperCase(),
      category: this.ngForm.controls["category_breeder"].value,
      state_id: this.ngForm.controls["state"].value,
      district_id: this.ngForm.controls["district"].value,
      address: (this.ngForm.controls["address"].value.replace(/\s+/g, ' ').trim()),
      display_name: (this.ngForm.controls["display_name"].value.replace(/\s+/g, ' ').trim()).toUpperCase(),
      contact_person_name: (this.ngForm.controls["nodal_officer_name"].value.replace(/\s+/g, ' ').trim()),
      contact_person_designation_id: this.ngForm.controls["nodal_officer_designation"].value,
      phone_number: this.ngForm.controls["phone"].value,
      // fax_no: this.ngForm.controls["fax_number"].value,
      longitude: this.ngForm.controls["longitude"].value,
      latitude: this.ngForm.controls["latitude"].value,
      email: (this.ngForm.controls["email"].value.replace(/\s+/g, ' ').trim()),
      mobile_number: this.ngForm.controls["mobile"].value,

      created_by: this.User_id,
      image_url: this.downloadUrl ? this.downloadUrl : "",
      crop_data: this.ngForm.controls["crop_data"].value,
      user_id: this.user_id,
      is_active: this.isActive
    }
    this.submitted = true;
    // if (!this.ngForm.controls["breeder_name"].value
    //   || !this.ngForm.controls["display_name"].value
    //   || !this.ngForm.controls["category_breeder"].value
    //   || !this.ngForm.controls["state"].value
    //   || !this.ngForm.controls["district"].value
    //   || !this.ngForm.controls["address"].value
    //   || !this.ngForm.controls["nodal_officer_name"].value
    //   || !this.ngForm.controls["nodal_officer_designation"].value
    //   || !this.ngForm.controls["mobile"].value
    //   || !this.ngForm.controls["email"].value
    //   || !this.ngForm.controls["bank_branch_name"].value
    //   || !this.ngForm.controls["bank_name"].value
    //   || !this.ngForm.controls["ifsc"].value
    //   || !this.ngForm.controls["bank_account_number"].value
    //   || !this.ngForm.controls["confirm_bank_account_number"].value
    //   || !this.ngForm.controls["latitude"].value
    //   || !this.ngForm.controls["longitude"].value
    //   || this.ngForm.controls["mobile"].errors
    //   || this.ngForm.controls["email"].errors
    //   || this.ngForm.controls["confirm_bank_account_number"].errors
    //   || this.ngForm.controls["crop_data"].errors
    //   || !this.downloadUrl
    // ) {
    //   return;
    // }
    if (this.ngForm.invalid) {
      return
    }
    if (this.LatituteError != '' || this.LongituteError != '') {
      return;
    }
    if (this.alreadyExistsMsg != '') {
      return;
    }

    this.breederService.postRequestCreator("update-breeder-seed-list", null, param).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {
          this.router.navigate(['/add-breeder-list']);
        })
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

  isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {

      return false;
    }
    else {

      return true;
    }

  }
  checkDecimal(e) {
    checkDecimal(e)
  }

  // async getBankDetails() {
  //   const route = "get-bank-details";
  //   const result = await this.service.postRequestCreator(route, null, null).subscribe((data: any) => {
  //     this.bankNameList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.rows ? data['EncryptedResponse'].data.rows : '';
  //   })
  // }

  // async getBankBranchName(newValue: any) {
  //   const searchFilters = {
  //     "search": {
  //       "bank_name": newValue
  //     }
  //   };
  //   this.service
  //     .postRequestCreator("get-branch-details-details", null, searchFilters)
  //     .subscribe((apiResponse: any) => {
  //       if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
  //         if (apiResponse.EncryptedResponse.data.length > 0) {
  //           this.branchNameList = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : '';
  //         }
  //       }
  //     });

  // }


  getMinManLongLang() {
    this.submitted = true;
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
              if (this.router.url.includes('edit')) {
                this.editData()
                // this.updateUserData();
              }
              else {
                this.onSubmit(this.ngForm.value)
              }
            }
            else {
              if (this.router.url.includes('edit')) {
                this.editData()
                // this.updateUserData();
              }
              else {
                this.onSubmit(this.ngForm.value)
              }
            }
          }
        }
      });

  }
  onBlurCropName(newValue) {
    if (newValue) {
      const searchFilters = {
        "search": {
          "short_name": newValue
        }
      };
      this.breederService
        .postRequestCreator("check-already-exists-short-name", null, searchFilters)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
            if (apiResponse.EncryptedResponse.data.length > 0) {
              this.errorMsg = true;
              this.alreadyExistsMsg = "Short Name Already Exists.";
            } else {
              this.errorMsg = false;
              this.alreadyExistsMsg = "";
            }

          }
        });
    }
  }
  updateUserData() {
    //   if(!this.router.url.includes('edit')){
    //     return ;

    //   }
    //   else{
    //     const id = this.route.snapshot.paramMap['params'].submissionId

    //     const param={
    //       "id":id,
    //       "agency_name": this.ngForm.controls["breeder_name"].value,
    //       "display_name":this.ngForm.controls["display_name"].value ,
    //       "agency_id":this.user_id,

    //       "mobile_number":this.ngForm.controls["mobile"].value,
    //       "email":this.ngForm.controls["email"].value ,

    // }
    //     this.breederService.postRequestCreator('edit-user-data',null,param).subscribe(data=>{

    //     })
    //   }
  }

  checkAlphaforShortname(event) {
    checkAlphaforShortname(event)
  }
   capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
  // onFileChange(event) {
  //   if (event.target.files.length > 0) {
  //     this.selectedFiles = event.target.files[0];
  //     const file = this.selectedFiles;

  //     console.log(file.name, 'fille');
  //     // this.fileName = file.name
  //     // this.fileData["name"] = file.name;
  //     // this.fileData["extension"] = file.type.split("/")[1];
  //     // this.fileData['file'] = file;
  //     Swal.fire({
  //       title: 'Uploading File...',
  //       allowEscapeKey: false,
  //       allowOutsideClick: false,
  //       didOpen: () => {
  //         Swal.showLoading(null)
  //       }
  //     });
  //     this.service.upload(this.selectedFiles).subscribe(
  //       (res: any) => {
  //         if (typeof (res) === 'object' && res.status == 'success' && res.results) {
  //           console.log(res.results.name);
  //           const baseImage = res.results.name;
  //           this.imageIconName = environment.awsUrl + baseImage
  //           console.log('this.imageIconName=======>',this.imageIconName)
  //           this.downloadUrl = res.results.name;
  //           let filename =   res &&  res.results &&  res.results.name  ? res.results.name :''
  //           let name1= filename.split('.')[0]
  //           let name2= filename.split('.')[1]
  //           if(name1.length>30){
  //             name1 = name1.substring(0,30)
  //             this.file_name = name1 + '.' + name2;


  //           }
  //           else{
  //             this.file_name = filename;

  //           }
  //           console.log(res, 'res')
  //           if (parseInt(res.results.$metadata.httpStatusCode) == 200) {
  //             Swal.fire({
  //               position: 'center',
  //               icon: 'success',
  //               title: 'Document successfully uploaded!',
  //               showConfirmButton: false,
  //               timer: 1000
  //             })
  //           }
  //         }
  //        if (parseInt(res.results.$metadata.httpStatusCode)== 404) {
  //           Swal.fire({
  //             position: 'center',
  //             icon: 'error',
  //             title: 'File Size Exceed',
  //             showConfirmButton: false,
  //             timer: 1000
  //           })
  //         }
  //         else {
  //           Swal.fire({
  //             position: 'center',
  //             icon: 'error',
  //             title: 'File Size Exceedssssssss',
  //             showConfirmButton: false,
  //             timer: 1000
  //           })
  //         }

  //       }
  //     );
  //   }
  // }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.selectedFiles = event.target.files[0];
      const file = this.selectedFiles;
      this.file_name = null
      console.log("file----------------", file)
      console.log("file----------------", file.name)
      console.log("file----------------", file.size)
      if (file.size > 2000000) {
        this.ImgError = 'Image Size too Big'
        return;
      }
      // if (file.name ) {
      //   this.ImgError = 'Image size too big'
      //   return;
      // }
      this.imageIconName = '';
      this.downloadUrl = '';
      this.imageIconName = '';
      this.selectedFiles = event.target.files[0];
      // const file = this.selectedFiles;
      // this.file = (document.getElementById('fileInput') as HTMLInputElement).value;

      this.fileName = file.name
      // this.fileData["name"] = file.name;
      // this.fileData["extension"] = file.type.split("/")[1];
      // this.fileData['file'] = file;
      // png,jpeg,jpg,gif,doc,
      // pdf,ppt,xlsx,
      var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

      if (!allowedExtensions.exec(file.name)) {
        this.ImgError = 'Please Select Valid File.'
        // fileInput.value = '';
        return;
      }
      this.file_name = file.name
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
            const baseImage = res.results.name;
            this.imageIconName = environment.awsUrl + baseImage
            this.downloadUrl = res.results.name;
            this.ImgError = '';


            if (res.results && res.results.$metadata && res.results.$metadata.httpStatusCode == 200) {
              Swal.fire({
                title: '<p style="font-size:25px;">Document Successfully Uploaded.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
            }



          }
          if ((res.status_code && parseInt(res.status_code) == 404) || (res.EncryptedResponse && res.EncryptedResponse.status_code && res.EncryptedResponse.status_code == 404)) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'File Size Exceed.',
              showConfirmButton: false,
              timer: 1000
            })
          } else if (res.status && res.status == "success") {
            Swal.fire({
              title: '<p style="font-size:25px;">Document Successfully Uploaded.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
          }
          else {
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
  uploadImage() {
    (document.getElementById('fileInput') as HTMLInputElement).click();
  }
  showImage(template: TemplateRef<any>, imgUrl) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg'
    });
    // this.imgSrc= imgUrl;
    this.imgSrc = environment.awsUrl + imgUrl;
  }
  downloadFile(e, text) {
    console.log('text', text)
    // this.imgSrc="https://seeds-documents.s3.ap-south-1.amazonaws.com/"+ text;

    if (text != undefined || text != '') {
      this.service.download(text).subscribe(
        (data: any) => {
          if (typeof (data) === 'object' && data.EncryptedResponse && data.EncryptedResponse.data) {
            let dowbloadLink = data.EncryptedResponse.data
            window.open(dowbloadLink, "_blank");
          }
        }
      );
    }
  }
  onPaste(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = /^[a-zA-Z]+$/;
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    if (this.ngForm.get(field).value.match(alphaExp)) {

      if (this.ngForm.get(field).value.length > len) {
        const value = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(value.slice(0, len).replace(/\s+/g, ' ').trim())
      }
      else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value.replace(/\s+/g, ' ').trim())
      }
      // return true
    }
    else {
      event.preventDefault();
      let fieldName = (this.pastedText.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, ' ').trim());
      console.log(event, 'eeve')
      let value = parseInt(length)
      // fieldName = this.ngForm.get(field).value + fieldName;
      this.ngForm.get(field).setValue(fieldName.slice(0, value).replace(/\s+/g, ' ').trim())
      // return false
    }

  }
  onPastes(event: ClipboardEvent,) {
    var alphaExp = /^[a-zA-Z]+$/;
    // let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    if (this.ngForm.get('breeder_name').value.match(alphaExp)) {

      if (this.pastedText.length > 50) {
        const value = this.ngForm.get('breeder_name').value;
        this.ngForm.get('breeder_name').setValue(value.substring(0, 50))
      }
      else {
        this.ngForm.get('breeder_name').setValue(this.ngForm.get('breeder_name').value)
      }
      // return true
    }
    else {
      event.preventDefault();
      let fieldName = this.pastedText.replace(/[^a-zA-Z ]/g, "").replace(/^\s+|\s+$/g, '');
      let value = 50
      fieldName = this.ngForm.get('breeder_name').value + fieldName;
      this.ngForm.get('breeder_name').setValue(fieldName.substring(0, value))
      // return false
    }

  }
  //  onPasteNumber(event: ClipboardEvent,field:string,length:string){
  //   var alphaExp = '^[0-9]$';
  //   let len = parseInt(length)
  //   let clipboardData = event.clipboardData
  //   this.pastedNumber = clipboardData.getData('text');
  //   if (this.ngForm.get(field).value.match(alphaExp)) {

  //     if(this.ngForm.get(field).value.length>len){
  //       const value = this.ngForm.get(field).value;
  //       this.ngForm.get(field).setValue(value.substring(0,len))
  //     }
  //     else{
  //       this.ngForm.get(field).setValue(this.ngForm.get(field).value)
  //     }
  //     // return true
  //   }
  //   else {
  //     if(field=='latitude' || field=='longitude' ){
  //       let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g,"").replace(/^\s+|\s+$/g, '');
  //       let value = parseInt(length)
  //       // fieldName =  fieldName.t;
  //       fieldName = this.ngForm.get(field).value + fieldName;
  //       this.ngForm.get(field).setValue(fieldName.substring(0,value))
  //     }
  //     else{
  //       event.preventDefault();
  //       let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
  //       let value = parseInt(length)
  //       fieldName = this.ngForm.get(field).value + fieldName;
  //       this.ngForm.get(field).setValue(fieldName.substring(0,value))
  //     }
  //     // return false
  //   }

  // }
  onPasteNumber(event, field: string, length: string) {
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
  isAlfa(evt) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    if (evt.target.selectionStart == 0 && evt.code == 'Space'  || charCode==45 || charCode==44 ) {
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
      let fieldName = this.pastedText.replace("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$", '').replace(/^\s+|\s+$/g, '');
      let value = parseInt(length)
      fieldName = this.ngForm.controls[field].value + fieldName.trimStart();
      this.ngForm.get(field).setValue(fieldName.substring(0, value))
      // return false
    }

  }
  selectAll(): void {
    this.myInput.nativeElement.select();
  }

  removePreviousWord(event): void {
    if (event.ctrlKey && event.key === "a") {
      const inputElement = this.myInput.nativeElement;

      // Get the current selection and its start index
      const selectionStart = inputElement.selectionStart || 0;

      // Get the pasted text and remove the previous word
      const pastedText = event.clipboardData?.getData("text") || "";
      const previousWordStart = inputElement.value.lastIndexOf(" ", selectionStart - 2) + 1;
      const newValue = inputElement.value.slice(0, previousWordStart) + pastedText + inputElement.value.slice(inputElement.selectionEnd);

      // Set the new value of the input field
      inputElement.value = newValue;

      // Move the cursor to the end of the pasted text
      const newSelectionStart = previousWordStart + pastedText.length;
      inputElement.setSelectionRange(newSelectionStart, newSelectionStart);

      // Prevent the default paste behavior
      event.preventDefault();
    }
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
  category(data) {
    console.log(data)
    this.category_agency = data && data.category ? data.category : '';
    // this.category_agency_id = data.value
    this.ngForm.controls['category_breeder'].setValue(data && data.id ? data.id : '')
  }
  cnClick() {
    document.getElementById('category_breeder').click();
  }
  getCatetoryList() {
    this.masterService
      .postRequestCreator("get-all-categories", null, {
        search: {
          type: "BR"
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.breederCategoryList = apiResponse.EncryptedResponse.data;
          console.log('categories_id==', this.breederCategoryList);
          this.breederCategoryListSecond = this.breederCategoryList
        }
      });
    // this.breederCategoryList = [
    //   {
    //     id: 1,
    //     category: 'ICAR',
    //   },
    //   {
    //     id: 2,
    //     category: 'SAU',
    //   },
    //   {
    //     id: 3,
    //     category: 'KVK',
    //   },
    //   {
    //     id: 4,
    //     category: 'Private Company',
    //   },

    // ]

  }

  state_select(data) {
    console.log('da', data)
    this.state_name = data && data.state_name ? data.state_name : ''
    this.ngForm.controls['state'].setValue(data.state_code)
    this.ngForm.controls['state_text'].setValue('')
  }
  cgClick() {
    document.getElementById('district').click();
  }
  csClick() {
    document.getElementById('state').click();
  }
  district_select(data) {
    this.district_name = data && data.district_name ? data.district_name : '';
    this.ngForm.controls['district'].setValue(data && data.district_code ? data.district_code : '');
    this.ngForm.controls['district_text'].setValue('')
  }
}

