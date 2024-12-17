import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { convertDate, convertDates, checkNumber, checkLength, checkAlpha, convertDatetoDDMMYYYY, convertDatetoDDMMYYYYwithdash } from 'src/app/_helpers/utility';

import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-performa-of-breeder-seed-tag-form',
  templateUrl: './performa-of-breeder-seed-tag-form.component.html',
  styleUrls: ['./performa-of-breeder-seed-tag-form.component.css']
})
export class PerformaOfBreederSeedTagFormComponent implements OnInit {

  form!: FormGroup;
  submitted = false;
  ngForm!: FormGroup;
  crop_name_list: any;
  cropVarietyData: any;
  submissionid = this.route.snapshot.paramMap.get('submissionId');
  response: any;
  disabledfield: boolean = false;
  cancelbtn!: boolean;
  isEdit!: boolean;

  isView: boolean = false;
  submitHide: boolean = true;
  lotNumberData: any;
  labelNumberData: any;
  labelNumberAllData: any;
  labelArr: any = [];
  forLabelYear: any;
  crop_group_list: any;
  todaysDate: Date = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  date_of_test = Date.parse(this.todaysDate.toString());;
  Indetyear: any;
  seasonList: any;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _service: ProductioncenterService,
    private route: ActivatedRoute
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));

    this.createEnrollForm();
    if (this.router.url.includes('view')) {

      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.submitHide = false;
     
      this.getListData();
    }
    if (this.router.url.includes('edit')) {
      // this.title = 'Update Crop : To Update Crop';
      this.disabledfield = false;
      this.cancelbtn = true;
      this.isEdit = true;
      this.getListData();

    }

  }

  // }


  createEnrollForm() {
    this.ngForm = this.fb.group({
      
      year_of_indent: new FormControl('', [Validators.required]),         
      season: new FormControl('', [Validators.required]),         
      crop_group: new FormControl('', [Validators.required]),
      crop_name: new FormControl('', [Validators.required]),
      variety_name: new FormControl('', Validators.required),
      pure_seed: new FormControl('', Validators.required),
      lot_number: new FormControl('', Validators.required),
      label_number: new FormControl('', Validators.required),
      net_weight: new FormControl('', Validators.required),
      inert_matter: new FormControl('', Validators.required),
      germination: new FormControl('', Validators.required),
      date_of_test: new FormControl('', Validators.required),
      valid_upto: new FormControl('', Validators.required),
    });
    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getCroupNameList(newValue);
        this.ngForm.controls['crop_name'].setValue('')
      }

    })
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if(newValue){
        this.getCroupGroupList(newValue);
       
      }

    })
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if(newValue){
        this.getPerformaIndentOfSeason(newValue);
        this.ngForm.controls['season'].setValue('')
      }

    })
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['variety_name'].setValue('')
        this.getCropVarietyData(newValue);
        this.ngForm.controls['variety_name'].valueChanges.subscribe(newValue2 => {
          if (newValue2) {
            this.getLotNumber(newValue, newValue2);
            this.ngForm.controls['lot_number'].valueChanges.subscribe(newValue3 => {
              if (newValue3) {
                this.getLabelNumber(newValue, newValue2, newValue3);
                this.ngForm.controls['label_number'].valueChanges.subscribe(newValue4 => {
                  if (newValue4) {
                    this.getLabelNumberAllDetails(newValue, newValue2, newValue3, newValue4);
                  }
                });
              }
            });
          }
        });
      }
    });

  }

  ngOnInit(): void {
    // localStorage.setItem('logined_user', "productionCenter");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.initProcess();
    this.ngForm.controls['pure_seed'].disable();
    this.ngForm.controls['net_weight'].disable();
    this.ngForm.controls['inert_matter'].disable();
    this.ngForm.controls['germination'].disable();
   
  }
  initProcess() {
  
    this.getPerformaIndentOfyear();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.ngForm.invalid) {
      return;
    }
    const data = {
      year:parseInt(this.ngForm.controls['year_of_indent'].value),
      season:this.ngForm.controls['season'].value,
      group_code:this.ngForm.controls['crop_group'].value,
      crop_code: this.ngForm.controls['crop_name'].value,
      variety_id: parseInt(this.ngForm.controls['variety_name'].value),
      pure_seed: parseInt(this.ngForm.controls['pure_seed'].value),
      lot_number: this.ngForm.controls['lot_number'].value,
      label_number: (this.ngForm.controls['label_number'].value).toString(),
      net_weight: parseInt(this.ngForm.controls['net_weight'].value),
      inert_matter: (this.ngForm.controls['inert_matter'].value).toString(),

      germination: (this.ngForm.controls['germination'].value).toString(),
      test_date: this.converDateTimstamp(this.ngForm.controls['date_of_test'].value.singleDate.jsDate),
      valid_upto: convertDates(this.ngForm.controls['valid_upto'].value.singleDate.jsDate),
      user_id: this.currentUser.id
    }
    if (this.router.url.includes('edit')) {
      this._service
        .postRequestCreator('perform-submission/' + this.submissionid, data, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
            }).then(x => {
              this.router.navigate(['/performa-Of-breeder-seed-tag-list']);
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
    } else {
      this._service
        .postRequestCreator('perform-submission', data, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
            }).then(x => {
              this.router.navigate(['/performa-Of-breeder-seed-tag-list']);
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
  }

  getCroupNameList(newValue) {
    const route = "get-performa-breeder-seed-crop-name";
    const param = {
      'search':{
        'group_code':this.ngForm.controls["crop_group"].value,
        'season':this.ngForm.controls["season"].value,
        'year':this.ngForm.controls["year_of_indent"].value
        // 'production_type':true,
      }
    }
    this._service
      .postRequestCreator(route, param)
      .subscribe((apiResponse: any) => {

        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.crop_name_list = apiResponse.EncryptedResponse.data.rows;
        }
      });
  }
  getCroupGroupList(newValue) {
    // this.selectCrop_group = "";
    const route = "get-performa-breeder-seed-crop-group";
    const search = {
      'search':{
        'season':newValue,
        'year':this.ngForm.controls["year_of_indent"].value
        
      }
    }
    this._service
      .postRequestCreator(route, search, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.crop_group_list = apiResponse.EncryptedResponse.data.rows;
          this.crop_group_list = this.crop_group_list.sort((a, b) => a['m_crop.m_crop_group.group_name'].localeCompare(b['m_crop.m_crop_group.group_name']))
        }
      });
  }
  async getCropVarietyData(newValue) {

    if (newValue) {
      const searchFilters = {
        "search": {
          "crop_code": newValue,
          "group_code":this.ngForm.controls["crop_group"].value,
         
          'season':this.ngForm.controls["season"].value,
          'year':this.ngForm.controls["year_of_indent"].value
        }
      };
      this._service
        .postRequestCreator("get-performa-breeder-seed-variety-name", searchFilters, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
          }
        });
    }

  }
  converDateTimstamp(dateString) {
    var date = new Date(dateString);
    var yr = date.getFullYear();
    var mo = date.getMonth() + 1;
    var day = date.getDate();

    var hours = date.getHours();
    var hr = hours < 10 ? '0' + hours : hours;

    var minutes = date.getMinutes();
    var min = (minutes < 10) ? '0' + minutes : minutes;

    var seconds = date.getSeconds();
    var sec = (seconds < 10) ? '0' + seconds : seconds;

    var newDateString = yr + '-' + mo + '-' + day;
    var newTimeString = hr + ':' + min + ':' + sec;

    var excelDateString = newDateString + ' ' + newTimeString;

    return excelDateString;
  }

  getListData() {
    // this.getSeasonData();
    const result = this._service.postRequestCreator("get-performa-breeder-seed-data/" + this.submissionid, null, null).subscribe((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';

      if (response) {

        this.ngForm.controls["year_of_indent"].patchValue(response.year_of_indent);
        this.ngForm.controls["season"].patchValue(response.season);
        this.ngForm.controls["crop_group"].patchValue(response.group_code);
        // this.ngForm.control
        // this.getCroupNameList()

        this.ngForm.controls["crop_name"].patchValue(response.crop_code);
        this.ngForm.controls["variety_name"].patchValue(response.variety_id);
        this.ngForm.controls["pure_seed"].patchValue(response.pure_seed);
        this.ngForm.controls["lot_number"].patchValue(response.lot_number);
        this.ngForm.controls["label_number"].patchValue(response.label_number);
        this.ngForm.controls["net_weight"].patchValue(response.net_weight);
        this.ngForm.controls["inert_matter"].patchValue(response.inert_matter);
        this.ngForm.controls["germination"].patchValue(response.germination);
        this.ngForm.controls["germination"].patchValue(response.germination);
        console.log('response.pure_seed=========>', response.test_date);
        // if(response.test_date){
        let testDate = convertDates(response.test_date);
        let date1 = response.valid_upto;
        let convert_new_notDate = convertDatetoDDMMYYYY(date1);
        this.ngForm.controls['valid_upto'].patchValue(
          {
            dateRange: null,
            isRange: false,
            singleDate: {
              formatted: convertDatetoDDMMYYYY(response.valid_upto),
              jsDate: new Date(response.valid_upto)
            }
          }
        );
        let dateOfTest = response.test_date
        let dateOfTestValue = convertDatetoDDMMYYYY(dateOfTest);
        this.ngForm.controls['date_of_test'].patchValue(
          {
            dateRange: null,
            isRange: false,
            singleDate: {
              formatted: convertDatetoDDMMYYYY(response.test_date),
              jsDate: new Date(response.test_date)
            }
          }
        );
        if (this.router.url.includes('view')) {

        
          this.ngForm.disable();
        }
        // this.ngForm.controls["valid_upto"].setValue(response.valid_upto);

        // this.ngForm.controls["date_of_test"].setValue(testDate);


        //       }

        //       this.ngForm.controls["crop_name"].patchValue(response.pure_seed);
        //       //
        // //       this.crop_code_value=response.crop_code;
        // // this.changeDyanmicValue=true;


        //       // this.ngForm.controls["unitKgQ"].patchValue(data[0].unit.value);
        //       this.ngForm.controls['group_code'].patchValue(response.group_code)
        //       this.ngForm.controls["botanical_name"].patchValue(response.botanic_name);
        //       this.ngForm.controls["seed_ratio"].patchValue(parseInt(response.srr));
      }
    });
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

  getLotNumber(cropCode, varietyId) {
    if (cropCode && varietyId) {
      const searchFilters = {
        "search": {
          "crop_code": cropCode,
          "variety_id": varietyId
        }
      };
      this._service
        .postRequestCreator("get-lot-numbers", searchFilters, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.lotNumberData = apiResponse.EncryptedResponse.data.rows;
            this.lotNumberData.filter(x => {
              this.forLabelYear = x.year;
            })
          }
        });
    }
  }

  getLabelNumber(cropCode, varietyId, lotNumber) {
    if (cropCode && varietyId && lotNumber) {
      const searchFilters = {
        "search": {
          "crop_code": cropCode,
          "variety_id": varietyId,
          "lot_number": lotNumber,
          "year": this.forLabelYear
        }
      };
      this._service
        .postRequestCreator("get-label-number", searchFilters, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.labelNumberData = apiResponse.EncryptedResponse.data.rows;
            this.labelNumberData.forEach(element => {
              // this.labelArr = {...this.labelArr,...element.generated_label_numbers}
              this.labelArr.push(...element.generated_label_numbers);
            });
          }
        });
    }
  }

  getLabelNumberAllDetails(cropCode, varietyId, lotNumber, labelNumber) {
    if ((cropCode && varietyId && lotNumber && labelNumber) && (!this.isView && !this.isEdit)) {
      const searchFilters = {
        "search": {
          "crop_code": cropCode,
          "variety_id": varietyId,
          "lot_number": lotNumber,
          "year": this.forLabelYear,
          "id": labelNumber,
        }
      };
      this._service
        .postRequestCreator("get-label-number-all-details", searchFilters, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.labelNumberAllData = apiResponse.EncryptedResponse.data.rows;
            if (this.labelNumberAllData) {
              this.ngForm.controls['pure_seed'].patchValue(this.labelNumberAllData[0].pure_seed);
              this.ngForm.controls['net_weight'].patchValue(this.labelNumberAllData[0].weight);
              this.ngForm.controls['inert_matter'].patchValue(this.labelNumberAllData[0].inert_matter);
              this.ngForm.controls['germination'].patchValue(this.labelNumberAllData[0].germination);
              this.ngForm.controls['date_of_test'].patchValue(
                {
                  dateRange: null,
                  isRange: false,
                  singleDate: {
                    formatted: convertDatetoDDMMYYYYwithdash(this.labelNumberAllData && this.labelNumberAllData[0] && this.labelNumberAllData[0].date_of_test ? this.labelNumberAllData[0].date_of_test :''),
                    jsDate: new Date(this.labelNumberAllData && this.labelNumberAllData[0]  && this.labelNumberAllData[0].date_of_test ? this.labelNumberAllData[0].date_of_test :"")
                  }
                })
                this.ngForm.controls['valid_upto'].patchValue(
                  {
                    dateRange: null,
                    isRange: false,
                    singleDate: {
                      formatted: convertDatetoDDMMYYYYwithdash(this.labelNumberAllData && this.labelNumberAllData[0] && this.labelNumberAllData[0].valid_upto ? this.labelNumberAllData[0].valid_upto :''),
                      jsDate: new Date(this.labelNumberAllData && this.labelNumberAllData[0]  && this.labelNumberAllData[0].valid_upto ? this.labelNumberAllData[0].valid_upto :"")
                    }
                  })
                
             
            }
          }
        });
    }
  }
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };

  get generateDefaultMonth(): string {
    let date = { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    disableUntil: { year: 1930, month: 1, day: null },
    // disableSince: { year: this.todaysDate.getFullYear() , month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
  };
  onDateChanged(event: IMyDateModel): void {
    // date selected
  }
  preventKeyPress(event) {
    event.preventDefault();
  }
  

  // get-performa-breeder-seed-year
  getPerformaIndentOfyear() {
    const route = "get-performa-breeder-seed-year"; 
    this._service
      .postRequestCreator(route)
      .subscribe((apiResponse: any) => {
        console.log(apiResponse);

        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this.isCropName = true;
          this.Indetyear = apiResponse.EncryptedResponse.data.rows;
        }
      });
  
  }
  getFinancialYear(year){
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  // Performa seedTag Season data//
  getPerformaIndentOfSeason(newValue) {
    const route = "get-performa-breeder-seed-season"; 
    const param={
      search:{
        year:newValue
      }
    }
    this._service
      .postRequestCreator(route,param)
      .subscribe((apiResponse: any) => {
        console.log(apiResponse);

        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this.isCropName = true;
          this.seasonList = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows:'';
        }
      });
  
  }

}

