import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { MasterService } from 'src/app/services/master/master.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import { checkAlpha, checkLength, checkNumber, checkDecimal, errorValidate, checkAlphaforShortname } from 'src/app/_helpers/utility';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-seed-testing-laboratory',
  templateUrl: './add-seed-testing-laboratory.component.html',
  styleUrls: ['./add-seed-testing-laboratory.component.css']
})
export class AddSeedTestingLaboratoryComponent implements OnInit {
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  public ngForm: FormGroup;
  submitted = false;
  formData;
  submissionId: any;
  isEdit: boolean;
  isView: boolean;
  districtList: any;
  stateList: any;
  district_code: any;
  max_long = '';
  min_long = '';
  LongituteError = '';
  LatituteError = '';
  min_lat = '';
  max_lat = '';
  userId: any;
  phone_no = "";
  fax_no = "";
  isActive: number;
  isShowDiv: boolean;
  listData: any;
  selected_state;
  historyData =
    {
      action: '',
      comment: '',
      formType: ''
    }
  pastedText: any;
  pastedNumber: string;
  longitutepatchValue: any;
  latitutedpatchValue: any;
  stateListSecond: any;
  disabledfield = false;
  districtListSecond: any;
  selected_district: any;
  shortNameValidation: string;
  designationList: any;
  designationListSecond: any;
  designation_ids: any;
  designation_name: any;
  stateCode: any;
  index: number;
  stateCod: number;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private http: HttpClient,
    private _serviceSeed: SeedDivisionService,
    activatedRoute: ActivatedRoute,
    private masterService: MasterService,
  ) {
    this.createForm();
    const params: any = activatedRoute.snapshot.params;

    // this.index = Number( activatedRoute.snapshot.paramMap.get('index'));
    // this.stateCode =  activatedRoute.snapshot.paramMap.get('stateCode');
    if (params["id"]) {
      // console.log(params["id"]);
      // console.log(params["stateCod"]);
      
      this.submissionId = parseInt(params["id"]);
      this.stateCod = parseInt(params["stateCod"]);

      console.log("this.submissionId",this.submissionId);
      console.log("this.statecode",this.stateCod);
    }
    this.isEdit = route.url.indexOf("edit") > 0;
    this.isView = route.url.indexOf("view") > 0;
  }

  createForm() {
    this.ngForm = this.fb.group({
      lab_name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        // Validators.pattern('^[a-zA-Z \/,\s-]+$')
        // Validators.pattern('^[a-zA-Z \/,\s-]+$')
        // Validators.pattern('^[a-zA-Z0-9._%+-] [a-zA-Z ]$')
      ])],
      // Validators.compose([ Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/) , Validators.pattern('^[A-Za-z]{0,50}$')])]
      address: ['',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          // Validators.pattern('^[A-Za-z0-9 ]{0,100}$')
        ])
      ],
      state_id: ['', [Validators.required]],
      district_id: ['', [Validators.required]],
      short_name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        Validators.pattern('^[a-zA-Z \s-]+$'),
        Validators.minLength(3),
        Validators.maxLength(10)
      ])],
      contact_person_name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        Validators.pattern('^[A-Za-z, ]{0,30}$')])
      ],
      mobile_no: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[6-9][0-9]{9}$')
      ])],
      email_id: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$'),
        Validators.pattern('^.{0,100}$')
      ])],
      phone_fax_no: ['',Validators.compose([
       
        Validators.minLength(10),
        Validators.maxLength(10)
      ])],
      fax_no: [''],//, [Validators.required,]
      latitude: [''],
      longitude: [''],
      status_toggle: [''],
      state_text: [''],
      district_text: [''],
      contact_person_designation: ['', [Validators.required]],
      designation_text: ['']

    });
    this.ngForm.controls['state_id'].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.getDistrictList((newValue).toString());
        this.ngForm.controls["district_id"].setValue('');
        this.LongituteError = '';
        this.LatituteError = ''
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
        this.districtList = this.districtListSecond
        let response = this.districtList.filter(x => x.district_name.toLowerCase().includes(newValue.toLowerCase()))

        this.districtList = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getDistrictList(this.ngForm.controls['state_id'].value)

      }
    });
  }

  ngOnInit(): void {
    if (this.isEdit) {
      // this.ngForm.controls['short_name'].disable();
    }
    

   
    this.getStateList();
    this.getIPAddress();
    this.getDesignation();
    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user)

    if (this.isEdit || this.isView) {
      this._serviceSeed.postRequestCreator("get-lab-test-data", {
        search: { state_code: this.stateCod }
      }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code === 200) {
          let allData = data.EncryptedResponse.data.rows;
          let matchedIndex = this.submissionId; // Use submissionId as the index
    
          // Validate index and fetch matched object
          if (matchedIndex >= 0 && matchedIndex < allData.length) {
            const matchedObject = allData[matchedIndex]; // Corrected here
            console.log("Matched Object:", matchedObject);
    
            // Patch the form with the matched object
            this.patchForm(matchedObject);
          } else {
            console.error("Invalid index or index out of range.");
          }
        } else {
          console.error("Invalid response or no data found.");
        }
      });
    }
    
  }

  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;
      console.log('ip=======address', this.ipAddres);
    });
  }
  ipAddres(arg0: string, ipAddres: any) {
    throw new Error('Method not implemented.');
  }
  audtiTrailsHistory(historyData) {

    this._serviceSeed.postRequestCreator('audit-trail-history', {
      "action_at": historyData.action,
      "action_by": this.userId.name,
      "application_id": "1234",
      "column_id": this.submissionId ? this.submissionId : '',
      "comment": historyData.comment,
      "form_type": historyData.formType,
      "ip": this.ipAddres,
      "mac_number": "12345678",
      "table_id": this.submissionId ? this.submissionId : ''
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
          this.stateListSecond = this.stateList;
        }
      });

  }

  patchFormold(data: any) {
    console.log(data)

    if (data && data.length > 0) {
      if (this.isView) {
        this.district_code = data[0].district_id;
      }
      if (this.isView) {
        this.ngForm.disable();
      }
      this.ngForm.controls["email_id"].disable();
      //implement isActive toggle
      if (data[0].is_active == 0) {
        this.ngForm.controls['status_toggle'].patchValue(false);
        this.isShowDiv = true;
        this.isActive = 0;
      }
      if (data[0].is_active == 1) {
        this.isShowDiv = false;
        this.ngForm.controls['status_toggle'].patchValue(true);
        this.isActive = 1;
      }
      //finish isActive toggle
      this.ngForm.controls["lab_name"].patchValue(data[0].lab_name);
      // this.ngForm.controls["address"].patchValue(data[0].address);
      this.ngForm.controls["state_id"].patchValue((data[0].state_id));
      this.ngForm.controls["district_id"].patchValue((data[0].district_id));
      this.ngForm.controls["short_name"].patchValue(data[0].short_name);
      this.ngForm.controls["mobile_no"].patchValue(data[0].mobile_number);
      this.ngForm.controls["email_id"].patchValue(data[0].email);
      this.ngForm.controls["phone_fax_no"].patchValue(data[0].phone_number);
      this.phone_no = data[0].phone_number
      this.ngForm.controls["fax_no"].patchValue(data[0].fax_number);
      this.fax_no = data[0].fax_number
      this.ngForm.controls["latitude"].patchValue(data[0].latitude);
      this.ngForm.controls["longitude"].patchValue(data[0].longitude);
      this.ngForm.controls["contact_person_name"].patchValue(data[0].contact_person_name);
      this.ngForm.controls["address"].patchValue(data[0].address);
      this.latitutedpatchValue = data && data[0] && data[0].latitude ? data[0].latitude : '';
      this.longitutepatchValue = data && data[0] && data[0].longitude ? data[0].longitude : '';
      this.designation_name = data && data[0] && data[0].m_designation && data[0].m_designation.name ? data[0].m_designation.name : '';
      this.ngForm.controls['contact_person_designation'].setValue(data && data[0] && data[0].m_designation && data[0].m_designation.id ? data[0].m_designation.id : '')
      this.selected_state = data && data[0] && data[0].m_state && data[0].m_state.state_name ? data[0].m_state.state_name : '';
      this.selected_district = data && data[0] && data[0].m_district && data[0].m_district.district_name ? data[0].m_district.district_name : '';


    }

  }
  
  patchForm(data: any) {
    console.log("patcheddata",data);
    console.log("hgjjhkj",data.labFullName);
    console.log("labName",data.labName);
  
      if (this.isView) {
        this.ngForm.disable();
      }
      // this.ngForm.controls["email_id"].disable();
     
      //finish isActive toggle
console.log("jnjhn");
     console.log(this.ngForm.controls["lab_name"].patchValue(data.labFullName),"hfiurhui");

      this.ngForm.controls["short_name"].patchValue(data.labName);
    

  

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
  checkDecimal($e) {
    checkDecimal($e);
  }

  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state_code": newValue,
        "district_code": this.district_code ? this.district_code : ''
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
  checkShortName(event) {
    let route = "check-short-name-data-for-all";
    let param = {
      sort_name: (this.ngForm.controls['short_name'].value ? this.ngForm.controls['short_name'].value : ''),
      id: this.submissionId ? this.submissionId : '',
      type: "LAB"
    };
    this.masterService.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.shortNameValidation = "Short Name Already Exist.";
        return;
      } else {
        this.shortNameValidation = ""
      }
    })
  }

  enrollFormSave() {
    this.submitted = true;

    if (this.LatituteError != '' || this.LongituteError != '') {
      return;
    }
    if (this.ngForm.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.checkShortName(null);
    }
    let route = "add-lab-test-data";
    const data = {
      user_id: this.userId.id ? this.userId.id : '',
      lab_name: (this.ngForm.controls['lab_name'].value).replace(/\s+/g, ' ').trim().toUpperCase(),
      address: this.ngForm.controls['address'].value,
      state_id: this.ngForm.controls['state_id'].value,
      district_id: this.ngForm.controls['district_id'].value,
      short_name: (this.ngForm.controls['short_name'].value).replace(/\s+/g, ' ').trim().toUpperCase(),
      mobile_number: (this.ngForm.controls['mobile_no'].value).toString(),
      phone_number: (this.ngForm.controls['phone_fax_no'].value).toString(),
      fax_number: (this.ngForm.controls['fax_no'].value).toString(),
      email: this.ngForm.controls['email_id'].value,
      lattiude: this.ngForm.controls['latitude'].value,
      longitude: this.ngForm.controls['longitude'].value,
      contact_person_designation: this.ngForm.controls['contact_person_designation'].value,
      contact_person_name: this.ngForm.controls['contact_person_name'].value.replace(/\s+/g, ' ').trim(),
    };
    this._serviceSeed.postRequestCreator(route, data).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.historyData.action = "add";
        this.historyData.comment = "add form";
        this.historyData.formType = "seed testing laboratory";

        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
            showCancelButton: false,
           confirmButtonColor: '#E97E15'
        }).then(x => {

          this.route.navigateByUrl('/add-seed-testing-laboratory-list');
        })
      } else if (res.EncryptedResponse.status_code == 402) {
        Swal.fire({
          title: '<p style="font-size:25px;">Laboratory Name Already Exists.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
            showCancelButton: false,
           confirmButtonColor: '#E97E15'
        })
      }
      else if (res.EncryptedResponse.status_code == 401) {
        Swal.fire({
          toast: false,
          icon: "error",
          title: "Short Name Already Exists.",
          position: "center",
          showConfirmButton: false,
          showCancelButton: false,
          timer: 2000,
        })
      }
      else if (res && res.EncryptedResponse && res.EncryptedResponse.status_code
        && res.EncryptedResponse.status_code == 403) {
        console.log(res.EncryptedResponse.data.error);
        Swal.fire({
          toast: true,
          icon: "error",
          title: res.EncryptedResponse.data.error,
          position: "center",
          showConfirmButton: false,
          showCancelButton: false,
          timer: 2000
        })
      }
    });

  }
  submitForm(formData) {

  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }



  updateFormSave() {
    this.submitted = true;
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    } else {
      this.isActive = 0;
    }
    if (this.LatituteError != '' || this.LongituteError != '') {
      return;
    }
    if (this.ngForm.invalid) {
      return;
    }
    let route = "update-lab-test-data";
    const data = {
      id: this.submissionId ? this.submissionId : '',
      user_id: this.userId.id ? this.userId.id : '',
      lab_name: (this.ngForm.controls['lab_name'].value).replace(/\s+/g, ' ').trim().toUpperCase(),
      address: this.ngForm.controls['address'].value,
      state_id: this.ngForm.controls['state_id'].value,
      district_id: this.ngForm.controls['district_id'].value,
      short_name: (this.ngForm.controls['short_name'].value).replace(/\s+/g, ' ').trim().toUpperCase(),
      mobile_number: (this.ngForm.controls['mobile_no'].value).toString(),
      phone_number: (this.ngForm.controls['phone_fax_no'].value ? (this.ngForm.controls['phone_fax_no'].value).toString() : ''),
      fax_number: (this.ngForm.controls['fax_no'].value ? (this.ngForm.controls['fax_no'].value).toString() : ''),
      email: (this.ngForm.controls['email_id'].value),
      lattiude: this.ngForm.controls['latitude'].value,
      longitude: this.ngForm.controls['longitude'].value,
      contact_person_name: this.ngForm.controls['contact_person_name'].value,
      contact_person_designation: this.ngForm.controls['contact_person_designation'].value,
      active: this.isActive
    };
    this._serviceSeed.postRequestCreator(route, data).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.historyData.action = "Updated";
        this.historyData.comment = "update form";
        this.historyData.formType = "seed testing laboratory";

        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {

          this.route.navigateByUrl('/add-seed-testing-laboratory-list');
        })
      }
      else if (res && res.EncryptedResponse && res.EncryptedResponse.status_code
        && res.EncryptedResponse.status_code == 403) {
        console.log(res.EncryptedResponse.data.error);
        Swal.fire({
          toast: true,
          icon: "error",
          title: res.EncryptedResponse.data.error,
          position: "center",
          showConfirmButton: false,
          showCancelButton: false,
          timer: 2000
        })
      }
      else if (res && res.EncryptedResponse && res.EncryptedResponse.status_code
        && res.EncryptedResponse.status_code == 401) {
        console.log(res.EncryptedResponse.data.error);
        Swal.fire({
          title: '<p style="font-size:25px;">Labortary Name is  Registered.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
      else if (res && res.EncryptedResponse && res.EncryptedResponse.status_code
        && res.EncryptedResponse.status_code == 402) {
        console.log(res.EncryptedResponse.data.error);
        Swal.fire({
          title: '<p style="font-size:25px;">Short Name is Already Registered.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
      else if (res && res.EncryptedResponse && res.EncryptedResponse.status_code
        && res.EncryptedResponse.status_code == 403) {
        console.log(res.EncryptedResponse.data.error);
        Swal.fire({
          toast: true,
          icon: "error",
          title: res.EncryptedResponse.data.error,
          position: "center",
          showConfirmButton: false,
          showCancelButton: false,
          timer: 2000
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
    });
  }
  getMinManLongLang() {
    this.submitted = true;

    if (this.ngForm.invalid) {
      return;
    }
    const searchFilters = {
      "search": {
        "district_id": (this.ngForm.controls["district_id"].value).toString(),
        // "min_longitude":(this.ngForm.controls["longitude"].value),
      }
    };
    this._serviceSeed
      .postRequestCreator("get-district-minmax-latitute", searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.max_long = apiResponse.EncryptedResponse.data[0].max_longitude;
            this.min_long = apiResponse.EncryptedResponse.data[0].min_longitude;
            this.max_lat = apiResponse.EncryptedResponse.data[0].max_latitude;
            this.min_lat = apiResponse.EncryptedResponse.data[0].min_latitude;
            // if ((this.max_long) != null && (this.max_long) != "NULL" && this.max_long != '' && this.min_long != '' && (this.min_long) != "NULL" && (this.min_long) != null) {
            //   if ((this.ngForm.controls['longitude'].value) < (this.min_long) || (this.ngForm.controls['longitude'].value) > (this.max_long)) {
            //     this.LongituteError = 'Please Enter Valid Longitute.';
            //   }
            // }
            // if (this.max_lat != "NULL" && this.max_lat != '' && this.max_lat != null && this.min_lat != '' && this.min_lat != null && this.min_lat != "NULL") {
            //   if ((this.ngForm.controls['latitude'].value) < (this.min_lat) || (this.ngForm.controls['latitude'].value) > (this.max_lat)) {
            //     this.LatituteError = 'Please Enter Valid Latitude.'
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
            if ((this.LatituteError == '') && (this.LatituteError == '')) {
              if (this.route.url.includes('edit')) {
                this.updateFormSave()
              }
              else {
                this.enrollFormSave()
              }
            }
            else {
              return;
            }

            // this.errorMsg = true;
            // this.alreadyExistsMsg = "Short Name Already Exists";
          }

        }
      });

  }
  checkAlphaforShortname($event) {
    checkAlphaforShortname($event)
  }
  // onPaste(event: ClipboardEvent,field:string,length:string) {
  //   var alphaExp = /^[a-zA-Z]+$/;
  //   let len = parseInt(length)
  //   let clipboardData = event.clipboardData
  //   this.pastedText = clipboardData.getData('text');
  //   if (this.ngForm.get(field).value.match(alphaExp)) {

  //     if(this.ngForm.get(field).value.length>len){
  //       const value = this.ngForm.get(field).value;
  //       this.ngForm.get(field).setValue(value.substring(0,len))
  //     }
  //     return true
  //   }
  //   else {
  //     event.preventDefault();
  //     let fieldName = this.pastedText.replace(/[^a-zA-Z ]/g, "").replace(/^\s+|\s+$/g, '');;
  //     fieldName = this.ngForm.get(field).value + fieldName;
  //     this.ngForm.get(field).setValue(fieldName.substring(0,len))
  //     return false
  //   }

  //  }
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
        // fieldName = fieldName;
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

  onPasteShortName(event: ClipboardEvent) {
    var alphaExp = /^[a-zA-Z]+$/;
    let clipboardData = event.clipboardData
    let pastedShortName = clipboardData.getData('text');
    console.log(this.pastedText, 'his.pastedText')
    pastedShortName = pastedShortName && (pastedShortName.length > 5) ? (pastedShortName.substring(0, 5)) : pastedShortName;
    this.ngForm.controls['short_name'].patchValue(pastedShortName)
    // if (this.pastedText.match(alphaExp)) {
    //   if(this.pastedText.length>5){

    //   }
    //   else{
    //     this.ngForm.controls['short_name'].setValue(this.pastedText)
    //   }
    //   // return true
    // }
    // else {
    //   // .replace(/\s+/g,'')
    //   event.preventDefault();
    //   let spouse_name = this.pastedText.replace(/[^a-zA-Z ]/g, "");
    //   spouse_name = this.ngForm.controls['short_name'].value + spouse_name;
    //   spouse_name = spouse_name.trimStart();

    //   if(spouse_name.length>5){
    //     spouse_name= spouse_name.substring(0,5)
    //     this.ngForm.controls['short_name'].setValue(spouse_name)
    //   }
    //   else{
    //     this.ngForm.controls['short_name'].setValue(spouse_name)
    //   }
    //   // return false
    // }

  }
  onPaste(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = /^[a-zA-Z]+$/;
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    if (this.ngForm.get(field).value.match(alphaExp)) {

      if (this.ngForm.get(field).value.length > len) {
        const value = this.ngForm.get(field).value;
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
        fieldName = this.ngForm.get(field).value + fieldName;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      
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
  
  isAlfas(evt) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    if (evt.target.selectionStart == 0 && evt.code == 'Space' || charCode==45  || charCode==44 || evt.target.selectionStart == 0 && evt.code == 'Minus' ) {
      evt.preventDefault();
      return false;
    }
    console.log(charCode,evt,'charCode')
    if (charCode == 45 || charCode == 44) {
      return true;
    }
    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122)

    ) || this.willCreateWhitespaceSequences(evt)) ? false : true;
  }
  willCreateWhitespaceSequences(evt) {
    var willCreateWSS = false;
    if (this.isWhiteSpaces(evt.key)) {

      var elmInput = evt.currentTarget;
      var content = elmInput.value;

      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;

      willCreateWSS = (
        this.isWhiteSpaces(content[posStart - 1] || '')
        || this.isWhiteSpaces(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }
  isWhiteSpaces(char) {
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
      let fieldName = this.pastedText.replace("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$", '').replace(/\s+/g, ' ').trim();
      let value = parseInt(length)
      fieldName = this.ngForm.controls[field].value + fieldName.trimStart();
      this.ngForm.get(field).setValue(fieldName.substring(0, value))
      // return false
    }

  }
  state_select(data) {
    console.log('da', data)
    this.selected_state = data && data.state_name ? data.state_name : '';
    this.ngForm.controls['state_id'].setValue(data && data.state_code ? data.state_code : '')

    this.ngForm.controls['state_text'].setValue('')
  }
  csClick() {
    document.getElementById('state_id').click();
  }
  district_select(data) {

    this.ngForm.controls['district_text'].setValue('')
    this.selected_district = data && data.district_name ? data.district_name : '';
    this.ngForm.controls['district_id'].setValue(data && data.district_code ? data.district_code : '')
  }
  cdClick() {
    document.getElementById('district').click();
  }

  async getDesignation() {
    this.masterService
      .postRequestCreator("get-all-designation", null, {
        search: {
          type: "TESTING_LAB"
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.designationList = apiResponse.EncryptedResponse.data;
          this.designationListSecond = this.designationList
          // if(this.isEdit || this.isView){
          //   if(this.designation_id && this.designationList.length){
          //     console.log('thisdesignation_id',this.designation_id)
          //     let resp = this.designationList.filter(item=>item.id==this.designation_id);
          //     this.designation_name =resp && resp[0] && resp[0].name ? resp[0].name :''
          //     console.log(this.designation_name,'this.designation_name')

          //   }

          // }
        }
      });

  }
  designation(data) {
    this.designation_ids = data && data.id ? data.id : '';
    this.designation_name = data.name;
    this.ngForm.controls['designation_text'].setValue('')
    this.ngForm.controls['contact_person_designation'].setValue(this.designation_ids ? this.designation_ids : '')
  }
  cdiClick() {
    document.getElementById('contact_person_designation').click();
  }
}
