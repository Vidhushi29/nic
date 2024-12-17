// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-view-selection-of-spa-for-submission-indent',
//   templateUrl: './view-selection-of-spa-for-submission-indent.component.html',
//   styleUrls: ['./view-selection-of-spa-for-submission-indent.component.css']
// })
// export class ViewSelectionOfSpaForSubmissionIndentComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { checkAlpha, checkLength, checkNumber, errorValidate } from 'src/app/_helpers/utility';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-view-selection-of-spa-for-submission-indent',
  templateUrl: './view-selection-of-spa-for-submission-indent.component.html',
  styleUrls: ['./view-selection-of-spa-for-submission-indent.component.css']
})
export class ViewSelectionOfSpaForSubmissionIndentComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  ngForm!: FormGroup;
  selectCrop: any;
  seasontype: any;
  allData: any;
  submissionid = this.route.snapshot.paramMap.get('submissionid'); response: any;
  respose: any;
  groupCode: any;
  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  croupGroup: any;
  croupGroupList: any = [];
  datas: any = [];
  result: any = [];
  seasonList: any = [];
  pastedText: string;
  disabledfield: boolean = false;
  cancelbtn!: boolean;
  isEdit!: boolean;
  data: any = [];
  isView: boolean = false;
  submitHide: boolean = true;
  cropCode: any;
  cropGroupCodeval: any;
  alreadyExistsMsg: string;
  errorMsg: boolean = false;
  rateError: boolean = false;
  setError: string;
  title: string;
  gpName: any;
  crop_code_value = '';
  changeDyanmicValue = false;
  cropNamevalue: any;
  enable: boolean = true;
  cropNameError = '';
  crop_name: any;
  group_code_value: any;
  isActive = 1;
  isShowDiv: boolean = true;
  listData: any;
  cropNameErrMsg: string;
  cropNameShowErrMsg: boolean = false;
  value: any;
  submissionId: any;
  userId: any;
  ipAddres: any;
  historyData =
    {
      action: '',
      comment: '',
      formType: ''
    }
  constructor(private http: HttpClient, private fb: FormBuilder, private route: ActivatedRoute, private restService: RestService, private router: Router, private service: SeedServiceService) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      season: ['', [Validators.required]],
      crop_name: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      botanical_name: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      seed_ratio: ['', [Validators.required]],
      group_code: ['', [Validators.required]],
      crop_code: ['', [Validators.required]],
      group_name: [''],
      status_toggle: ['']
    });

    if (this.router.url.includes('view')) {
      this.title = 'View : Selection of SPAs for Submission of Indent';
      this.getListData();
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.submitHide = false;
      this.ngForm.disable();
    }

    // if (this.router.url.includes('edit')) {
    //   this.title = 'Update : Selection of SPAs for Submission of Indent';
    //   this.disabledfield = false;
    //   this.cancelbtn = true;
    //   this.isEdit = true;
    //   this.getListData();
     
    //   this.enable = false;

    // }

    // if (!this.router.url.includes('view') && !this.router.url.includes('edit')) {
    //   this.title = 'Add : Selection of SPAs for Submission of Indent';
    // }
    if (!this.router.url.includes('view')) {
      this.ngForm.controls['group_code'].valueChanges.subscribe(newValue => {
        // if(ne)
        this.getCropData(newValue)

        this.getGroupName(newValue);
        //   if(this.changeDyanmicValue && this.router.url.includes('edit')){
        //     this.changeDyanmicValue=false
        // }

        //   if(this.crop_code_value!=''&& !this.changeDyanmicValue){


        //   }
      });
    }
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.checkcropname()
        if (this.router.url.includes('edit')) {
          if (newValue == this.crop_name) {
            this.enable = false;
          }
          else {
            this.enable = true;
          }
        }
        this.cropNameError = '';
      }

    });
    this.ngForm.controls['group_code'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (this.router.url.includes('edit')) {
          if (newValue == this.group_code_value) {
            this.enable = false;
          }
          else {
            this.enable = true;
          }
        }
        // group_code_value
        //  this.ngForm.controls['crop_name'].setValue('')

      }

      this.cropNameError = '';
    });


  }

  ngOnInit(): void {
    this.getIPAddress();
    this.ngForm.controls['crop_code'].disable();
    this.list(1, undefined);
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.submissionid = this.route.snapshot.paramMap.get('submissionid');
    this.initProcess()
    this.isActive = 1;
    this.userId = localStorage.getItem('BHTCurrentUser');
  }

  initProcess() {
    this.getSeasonData();
    this.getPageData();
  }
  notified(item: any) {

  }
  selectType(value: any) {

  }
  developedBy(item: any) {

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getPageData() {
    const route = "crop-group";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.croupGroupList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })

  }
  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;
      console.log('ip=======address', this.ipAddres);
    });
  }


  getSeasonData() {

    const route = "get-season-details";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      delete this.seasonList[2]
      delete this.seasonList[3]
      const results = this.seasonList.filter(element => {
        if (Object.keys(element).length !== 0) {
          return true;
        }
        return false;
      });
      this.seasonList = results
    })
  }

  enrollFormSave(formData) {
    this.submitted = true;
    // if(this.cropNameShowErrMsg == true){
    //   return;
    // }
    // console.log('console.log',this.ngForm.controls['crop_name'].value.replace(/^\s+/g, ''));
    // return;
    if (this.ngForm.controls['seed_ratio'].value >= 101) {
      return;
    }
    if ((this.errorMsg == true) || (formData.crop_name.split(" ").join("").length <= 0) || (formData.botanical_name.split(" ").join("").length <= 0)) {
      return;
    }
    if (this.isEdit || this.isView) {
      this.restService.getAddCropList().subscribe(dataList => {
        if (dataList && dataList.length > 0) {
          const foundData = dataList.filter((x: any) => x.id == this.submissionid);
          this.patchForm(foundData);
        }
      }
      );
    }
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    }
    if (this.ngForm.controls['status_toggle'].value === false) {
      this.isActive = 0;
    }
    const data = {
      botanic_name: (this.ngForm.controls['botanical_name'].value).toUpperCase(),
      crop_name: (this.ngForm.controls['crop_name'].value.trim()).toUpperCase(),
      group_code: this.ngForm.controls['group_code'].value,
      season: this.ngForm.controls['season'].value,
      srr: (this.ngForm.controls['seed_ratio'].value).toString(),
      crop_code: this.cropCode,
      crop_group: this.gpName,
      active: this.isActive,
    }

    if (this.router.url.includes('edit')) {
      this.service
        .postRequestCreator('get-add-crop-details/' + this.submissionid, null, data)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
            this.historyData.action = "Updated";
            this.historyData.comment = "Updated Form successfully";
            this.historyData.formType = "add crop";

            this.audtiTrailsHistory(this.historyData);
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            }).then(x => {

              this.router.navigate(['/add-crop-list']);

            })
          } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 404) {
            Swal.fire({
              title: '<p style="font-size:25px;">Crop Name already exists.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
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

      this.service
        .postRequestCreator('get-add-crop-details', null, data)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.historyData.action = "Add";
            this.historyData.comment = "Add Form successfully";
            this.historyData.formType = "add crop";

            this.audtiTrailsHistory(this.historyData);
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
            }).then(x => {
              if (formData)
                this.router.navigate(['/add-crop-list']);
            })
          } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 404) {
            Swal.fire({
              title: '<p style="font-size:25px;">Crop Name already exists.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
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

  audtiTrailsHistory(historyData) {
    console.log(this.userId);
    let userdata = JSON.parse(this.userId);
    this.service.postRequestCreator('audit-trail-history', null, {
      "action_at": historyData.action,
      "action_by": userdata.name,
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

  cropGroup(item: any) {
    this.selectCrop = item.group_name;
    this.groupCode = item.group_code
    this.ngForm.controls['crop_group'].setValue(this.selectCrop)
  }
  season(item: any) {
    this.seasontype = item.season;
    this.ngForm.controls['season'].setValue(item.season_code)
  }
  cultivation(item: any) {
    this.croupGroup = item;
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

  patchForm(data: any) {

    //implement isActive toggle
    if (data && data[0].is_active == 0) {
      this.ngForm.controls['status_toggle'].patchValue(false);
      this.isShowDiv = true;
      this.isActive = 0;
    }
    if (data && data[0].is_active == 1) {
      this.ngForm.controls['status_toggle'].patchValue(true);
      this.isShowDiv = false;
      this.isActive = 1;
    }
    //finish isActive toggle
    if (data && data.length > 0) {
      this.ngForm.controls["crop_group"].patchValue(data[0].crop_group.name);
      this.ngForm.controls["season"].patchValue(data[0].season.name);
      this.ngForm.controls["crop_name"].patchValue(data[0].crop.name);
      // this.ngForm.controls["unitKgQ"].patchValue(data[0].unit.value);
      this.ngForm.controls["botanical_name"].patchValue(data[0].botatincal_name.name);
      this.ngForm.controls["seed_ratio"].patchValue(data[0].seed_rate.seed_rate.name);
    }
    // this.router.navigateByUrl('/add-crop-list')
  }
  getListData() {
    // this.getSeasonData();
    const result = this.service.postRequestCreator("get-breeder-seeds-submission/" + this.submissionid, null, null).subscribe((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      let datas = this.seasonList.filter((x: { season_code: any; }) => (x.season_code) == response.season);
      this.crop_code_value = response.crop_code;
      if (response) {
        this.selectCrop = response.crop_group;
        this.seasontype = datas[0] && datas[0].season ? datas[0].season.trim() : '';
        // this.ngForm.controls["group_code"].patchValue(response.group_code);
        //implement isActive toggle

        if (response.is_active == 0) {
          this.ngForm.controls['status_toggle'].patchValue(false);
          this.isShowDiv = true;
          this.isActive = 0;
        }
        if (response.is_active == 1) {
          this.isShowDiv = false;
          this.ngForm.controls['status_toggle'].patchValue(true);
          this.isActive = 1;
        }
        //finish isActive toggle
        this.ngForm.controls["season"].patchValue(response.season);
        this.ngForm.controls["crop_name"].patchValue(response.crop_name);
        this.ngForm.controls["crop_code"].patchValue(response.crop_code);
        this.crop_code_value = response.crop_code;
        this.crop_name = response.crop_name;
        this.group_code_value = response.group_code

        this.changeDyanmicValue = true;


        // this.ngForm.controls["unitKgQ"].patchValue(data[0].unit.value);
        this.ngForm.controls['group_code'].patchValue(response.group_code)
        this.ngForm.controls["botanical_name"].patchValue(response.botanic_name);
        this.ngForm.controls["seed_ratio"].patchValue(parseInt(response.srr));
      }
    });
  }

  getCropData(newValue) {

    if ((newValue) == this.crop_code_value.substring(0, 3)) {
      return;
    }
    else {

      this.getDynamicCropCode(newValue);
    }
    // this.ngForm.controls["group_code"].valueChanges.subscribe(newValue=>{
    //   if(newValue==this.crop_code_value){
    //     return ;
    //   }
    //   else{
    //   }
    //       })
  }

  updateForm() {
    this.submitted = true;
    // if(this.cropNameShowErrMsg == true){
    //   return;
    // }
    if (this.ngForm.invalid || (this.errorMsg == true)) {
      return;
    }
    if (this.ngForm.controls['seed_ratio'].value >= 100) {
      return;
    }
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    }
    if (this.ngForm.controls['status_toggle'].value == false) {
      this.isActive = 0;
    }

    const route = "get-add-crop-details";
    const data = {
      id: this.submissionid?.toString(),
      group_code: this.ngForm.controls['group_code'].value,
      botanic_name: (this.ngForm.controls['botanical_name'].value).toUpperCase(),
      crop_name: ((this.ngForm.controls['crop_name'].value).trim()).toUpperCase(),
      crop_group: this.ngForm.controls['crop_group'].value,
      season: this.ngForm.controls['season'].value,
      crop_code: this.cropCode,
      srr: this.ngForm.controls['seed_ratio'].value,
      active: this.isActive
    }

    this.service.postRequestCreator(route + "/" + this.submissionid, null, data).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.historyData.action = "Update";
        this.historyData.comment = "Form updated";
        this.historyData.formType = "add crop";

        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {})
        this.router.navigateByUrl('/add-crop-list');
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
    // this.router.navigateByUrl('/add-crop-list')
  }

  async getDynamicCropCode(newValue: any) {
    const searchFilters = {
      "search": {
        "group_code": newValue
      }
    };

    this.service
      .postRequestCreator("get-dynamic-crop-code", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.data = apiResponse.EncryptedResponse.data[0];


            if (this.data.crop_code) {
              if (this.data.crop_code[1] == 0) {
                this.cropCode = (this.data.crop_code).replace(/(\d+)$/, function (match, n: number) {
                  return ++n;
                });
                this.cropCode = this.cropCode.substring(0, 1) + "0" + this.cropCode.substring(1, this.cropCode.length);
                this.ngForm.controls['crop_code'].setValue(this.cropCode);
              } else {
                this.cropCode = (this.data.crop_code).replace(/(\d+)$/, function (match, n: number) {
                  return ++n;
                });
                this.ngForm.controls['crop_code'].setValue(this.cropCode);
              }
            }
          } else {
            this.cropCode = ((newValue) + '001');
            this.ngForm.controls['crop_code'].setValue(this.cropCode);
            // this.ngForm.controls['crop_code'].patchValue(this.cropCode);
          }
        }
      });

  }

  async getGroupName(newValue: any) {
    const searchFilters = {
      "search": {
        "group_code": newValue
      }
    };
    this.service
      .postRequestCreator("crop-group", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.data = apiResponse.EncryptedResponse.data[0];
            if (this.data) {
              this.gpName = (this.data.group_name);
            }
          }

        }
      });

  }
  // async getCropGroupCode(newValue: any) {
  //   const searchFilters = {
  //     "search": {
  //       "group_name": newValue
  //     }
  //   };
  //   this.service
  //   .postRequestCreator("get-crop-group-code", null,searchFilters)
  //   .subscribe((apiResponse: any) => {
  //     if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
  //       if(apiResponse.EncryptedResponse.data.length > 0){
  //         this.data = apiResponse.EncryptedResponse.data[0];
  //         if(this.data){
  //           this.cropGroupCodeval = (this.data.group_code);
  //           this.getDynamicCropCode(this.cropGroupCodeval);
  //         }
  //       }

  //     }
  //   });

  // }

  onBlurCropName(newValue) {
    if (newValue) {
      const searchFilters = {
        search: {
          "crop_name": this.ngForm.controls['crop_name'].value
        }
      };

      this.service
        .postRequestCreator("check-already-exists-crop-code", null, searchFilters)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
            if (apiResponse.EncryptedResponse.data.length > 0) {

              this.cropNamevalue = apiResponse.EncryptedResponse.data.crop_name;


              this.errorMsg = true;
              this.alreadyExistsMsg = "Crop Name Already Exists";
            } else {
              this.errorMsg = false;
              this.alreadyExistsMsg = " ";
            }

          }
        });
    }
  }

  checkSeedPercent(event: any) {
    if (parseInt(event.target.value) >= 101) {
      this.rateError = true;
      this.setError = "Minimum Seed Replacement Rate should be less than 100 %";
    } else {
      this.rateError = false;
      this.setError = "";
    }
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  checkNumber($e) {
    checkNumber($e);
  }

  checkAlpha(event) {
    checkAlpha(event)
  }

  cgClick() {
    document.getElementById('crop_group').click();
  }
  SeasonClick() {
    document.getElementById('season').click();
  }
  checkcropname() {
    this.submitted = true;
    if (!this.ngForm.controls['crop_name'].value
      || !this.ngForm.controls['season'].value
      || !this.ngForm.controls['botanical_name'].value
      || !this.ngForm.controls['seed_ratio'].value
      || !this.ngForm.controls['crop_code'].value
      || !this.ngForm.controls['group_code'].value) {

      return;
    }
    // if (this.enable) {
    // console.log((this.ngForm.controls['crop_name'].value).replace(/^[\w/-]+(?: [\w/-]+)*$/, ''),'this.ngForm.controls');
    let param;
    if (this.isEdit) {
      param = {
        search: {
          crop_name: this.ngForm.controls['crop_name'].value,
          crop_group: this.gpName,
          id: this.submissionid
        }
      }
    } else {
      param = {
        search: {
          crop_name: this.ngForm.controls['crop_name'].value,
          crop_group: this.gpName
        }
      }
    }
    if (this.enable) {
      this.service.postRequestCreator('check-crop-name-already', null, param).subscribe(apiResponse => {


        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data
          && apiResponse.EncryptedResponse.data.inValid) {
          this.cropNameError = 'Crop Name Already Exists '

          // return;
        }
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 404) {
          Swal.fire({
            title: '<p style="font-size:25px;">Crop Name already exists.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'
          })
        }
        else {
          // this.cropNameError=' ';
          this.enrollFormSave(this.ngForm.value)
        }

      });
    }


    // }
    else {
      this.enrollFormSave(this.ngForm.value)
    }
  }

  list(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service
      .postRequestCreator("get-crop-list", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        search: searchData
      }).subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 10;
          this.listData = apiResponse.EncryptedResponse.data.rows;
          if (this.listData === undefined) {
            this.listData = [];
          }
        }
      });
  }

  checkexists(key: any) {
    if (key == 'cropName') {
      this.value = this.ngForm.controls['crop_name'].value.trim();
      const lowerData = this.listData.filter(x => {
        return x.crop_name == this.value.toLowerCase();
      });
      const upperData = this.listData.filter(x => {
        return x.crop_name == this.value.toUpperCase();
      });
      if ((lowerData.length > 0) || (upperData.length > 0)) {
        this.cropNameErrMsg = "Crop Name Already Exists";
        this.cropNameShowErrMsg = true;
      } else {
        // this.shortNameErrMsg = "";
        this.cropNameShowErrMsg = false;
      }
    }
  }
  onPaste(event: ClipboardEvent) {
    var alphaExp = /^[a-zA-Z]+$/;
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');
    console.log(this.pastedText ,'his.pastedText')

    if (this.pastedText.match(alphaExp)) {
      if(this.pastedText.length>50){
        this.ngForm.controls['crop_name'].setValue(this.pastedText.substring(0,50))
      }
      else{
        this.ngForm.controls['crop_name'].setValue(this.pastedText)
      }
      return true
    }
    else {
      // .replace(/\s+/g,'')
      event.preventDefault();
      let spouse_name = this.pastedText.replace(/[^a-zA-Z ]/g, "");
      spouse_name = this.ngForm.controls['crop_name'].value + spouse_name;
      spouse_name = spouse_name.trimStart();
      this.ngForm.controls['crop_name'].setValue(spouse_name)
      if(spouse_name.length>50){
        
        this.ngForm.controls['crop_name'].setValue(spouse_name.substring(0,50))
      }
      else{
        this.ngForm.controls['crop_name'].setValue(spouse_name)
      }
      return false
    }

  }
  onPasteBontantical(event: ClipboardEvent) {
    var alphaExp = /^[a-zA-Z]+$/;
    let clipboardData = event.clipboardData
    this.pastedText = clipboardData.getData('text');

    if (this.pastedText.match(alphaExp)) {
      if(this.pastedText.length>50){
        this.ngForm.controls['botanical_name'].setValue(this.pastedText.substring(0,50))
      }
      else{
        this.ngForm.controls['botanical_name'].setValue(this.pastedText)
      }
      return true
    }
    else {
      // .replace(/\s+/g,'')
      event.preventDefault();
      let spouse_name = this.pastedText.replace(/[^a-zA-Z ]/g, "");
      spouse_name = this.ngForm.controls['botanical_name'].value + spouse_name;
      spouse_name = spouse_name.trimStart();
      if(spouse_name.length>50){
        
        this.ngForm.controls['botanical_name'].setValue(spouse_name.substring(0,50))
      }
      else{
        this.ngForm.controls['botanical_name'].setValue(spouse_name)
      }
      return false
    }

  }


}

