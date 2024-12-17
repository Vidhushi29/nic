import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { D, IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { checkDecimal, checkLength, ConfirmAccountNumberValidator, convertDates, convertDatetoDDMMYYYY, convertDatetoDDMMYYYYwithdash, errorValidate, } from 'src/app/_helpers/utility';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import Swal from 'sweetalert2';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-seed-testing-labaratory-form',
  templateUrl: './seed-testing-labaratory-form.component.html',
  styleUrls: ['./seed-testing-labaratory-form.component.css']
})
export class SeedTestingLabaratoryFormComponent implements OnInit {

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  enrollFormGroup!: FormGroup;

  currentUser: any;
  submitted = false;
  ngForm!: FormGroup;
  stateList: any = [];
  districtList: any = [];
  designationList: any;
  todayDate = new Date();
  agency_name: any;
  yearOfIndent: any = [];

  viewMode: boolean = false;
  editMode: boolean = false;
  createMode: boolean = true;

  disabledfield: boolean = false;
  cancelbtn!: boolean;
  isView: boolean = false;
  indentorData: any;
  selectDistricts;
  breederCategory;
  bank_name;
  select_state;
  updateBtn = false;
  acError: string;
  acDiv: boolean = false;

  submissionid: any;
  response: any;


  title: string;
  cropVarietyData: any;
  lotNumberData: any;
  crop_name_list: any;
  season_list: any;
  seedTestingLabData: any;
  actualQuantityForBreederSeed: any;
  actualLotSize: any;
  stateId: any;
  minDate = new Date().toISOString().slice(0, 10);
  showDefaultError: boolean = false;

  dataload: boolean = false;

  get enrollFormControls() {
    return this.enrollFormGroup.controls;
  }
  todaysDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private _serviceSeed: SeedServiceService,
    private breederService: BreederService,
    private service: ProductioncenterService,
  ) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      reference_number: ['', [Validators.required]],
      date: ['', [Validators.required]],
      report_recieving_date: ['', [Validators.required]],
      year_of_indent: ['', [Validators.required]],
      crop_code: ['', [Validators.required]],
      variety_id: ['', [Validators.required]],
      seed_test_lab_id: ['', [Validators.required]],
      quantity_of_seed_produced: ['', [Validators.required]],
      lot_number: ['', [Validators.required]],
      sample_number: ['', [Validators.required]],
      seed_class_normal: ['', [Validators.required]],
      seed_class_abnormal: ['', [Validators.required]],
      seed_class_hard: ['', [Validators.required]],
      fresh_ungerminated: ['', [Validators.required]],
      dead: ['', [Validators.required]],
      pure_seed: ['', [Validators.required]],
      other_crop_seed: ['', [Validators.required]],
      weed_seed: ['', [Validators.required]],
      inert_matter: ['', [Validators.required]],
      moisture: ['', [Validators.required]],
      season: ['', [Validators.required]],
      is_report_pass: ['', [Validators.required]]
    });

    this.ngForm.controls["quantity_of_seed_produced"].disable();



    if (this.router.url.includes('view')) {
      this.viewMode = true;
      this.editMode = false;
      this.createMode = false;


    }
    else if (this.router.url.includes('edit')) {
      this.viewMode = false;
      this.editMode = true;
      this.createMode = false;
    }
    else {
      this.viewMode = false;
      this.editMode = false;
      this.createMode = true;
    }

    this.ngForm.controls['lot_number'].valueChanges.subscribe(newValue => {
      if(newValue) {
        this.getLotSize(newValue);
      }
      
    })

  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.submissionid = this.route.snapshot.paramMap['params'].submissionId;
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.stateId = data['agency_detail.m_state.id']

    this.getSeedTestingLaboratory();
    this.createYearRange();

    if(!this.createMode) {
      this.dataload = false
    } else {
      this.dataload = true
    }


    if (!this.createMode) {
      this.breederService.getRequestCreator("getSeedTestingReportsById/" + this.submissionid).subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.response = apiResponse.EncryptedResponse.data;
          console.log(this.response)
          if (this.response) {
            this.ngForm.controls["reference_number"].patchValue(this.response.reference_number);
            this.ngForm.controls["date"].patchValue(
              {
                dateRange: null,
                isRange: false,
                singleDate: {
                  formatted: this.response.date,
                  jsDate: new Date(this.response.date)
                }
              }
            );
            this.ngForm.controls["report_recieving_date"].patchValue(

              {
                dateRange: null,
                isRange: false,
                singleDate: {
                  formatted: this.response.report_recieving_date,
                  jsDate: new Date(this.response.report_recieving_date)
                }
              }
            );
            this.ngForm.controls["seed_test_lab_id"].patchValue(this.response.seed_test_lab_id);
            this.ngForm.controls["year_of_indent"].patchValue(this.response.year_of_indent);

            this.onChangeYearOfIndent(this.response.year_of_indent);
            this.ngForm.controls["season"].patchValue(this.response.season);

            this.onChangeSeason(this.response.season);
            this.ngForm.controls["crop_code"].patchValue(this.response.crop_code);

            this.onChangeCrop(this.response.crop_code);
            this.ngForm.controls["variety_id"].setValue(this.response.variety_id);

            this.onChangeVariety(this.response);
            this.ngForm.controls["lot_number"].patchValue(this.response.lot_number);
            this.ngForm.controls["quantity_of_seed_produced"].patchValue(this.response.quantity_of_seed_produced);
            this.ngForm.controls["sample_number"].patchValue(this.response.sample_number);
            this.ngForm.controls["seed_class_normal"].patchValue(this.response.seed_class_normal);
            this.ngForm.controls["seed_class_abnormal"].patchValue(this.response.seed_class_abnormal);
            this.ngForm.controls["seed_class_hard"].patchValue(this.response.seed_class_hard);
            this.ngForm.controls["fresh_ungerminated"].patchValue(this.response.fresh_ungerminated);
            this.ngForm.controls["dead"].patchValue(this.response.dead);
            this.ngForm.controls["pure_seed"].patchValue(this.response.pure_seed);

            this.ngForm.controls["other_crop_seed"].patchValue(this.response.other_crop_seed);
            this.ngForm.controls["weed_seed"].patchValue(this.response.weed_seed);
            this.ngForm.controls["inert_matter"].patchValue(this.response.inert_matter);
            this.ngForm.controls["moisture"].patchValue(this.response.moisture);
            this.ngForm.controls["is_report_pass"].patchValue(this.response.is_report_pass);
            if (this.router.url.includes('view')) {
              this.ngForm.disable();
            }

            this.dataload = true;
          }

        }
      });

    }

  }

  getLotSize(lotNumberId) {
    this.service.postRequestCreator("get-lot-size", {
      search: {
        lot_number_id: lotNumberId
      }
    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.actualLotSize = data.EncryptedResponse.data.lot_number_size;
        if(this.actualLotSize) {
          this.ngForm.controls["quantity_of_seed_produced"].patchValue(this.actualLotSize);
        }
      }
    })
  }

  createYearRange() {
    this.service.getRequestCreatorNew("getLotNumberYears?user_id=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.yearOfIndent = data.EncryptedResponse.data.sort((a, b) => b.year - a.year);
      }
    })
  }

  onChangeYearOfIndent(year: any) {
    if (this.createMode) {
      this.ngForm.controls['season'].patchValue("");
      this.ngForm.controls['crop_code'].patchValue("");

    }

    if (year && year !== undefined && year !== null) {
      this.service.getRequestCreatorNew("getLotNumberSeasons?year=" + year + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
        this.season_list = [];
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          data.EncryptedResponse.data.forEach(x => {
            if (x['season'] && x['m_season.season']) {
              var object = {
                season_name: x['m_season.season'],
                season_code: x['season']
              }
              this.season_list.push(object);
            }

          });
        }
      })
    }
  }
  onDateChanged(event: IMyDateModel): void {
    // date selected
  }
  preventKeyPress(event) {
    event.preventDefault();
  }
  onChangeSeason(season: any) {
    let year = this.ngForm.value.year_of_indent;

    if (this.createMode) {
      this.ngForm.controls['crop_code'].patchValue("");
    }

    if (season && season !== undefined && season !== null) {
      this.service.getRequestCreatorNew("getLotNumberCrops?year=" + year + "&season=" + season + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
        this.crop_name_list = [];
        console.log(data)
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          data.EncryptedResponse.data.forEach(x => {
            var object = {
              crop_name: x['m_crop.crop_name'],
              crop_code: x['crop_code']
            }
            this.crop_name_list.push(object);
          });
        }
      })
    }
  }


  onChangeCrop(paramsData) {
    let year = this.ngForm.value.year_of_indent;
    let season = this.ngForm.value.season;
    let crop_code = this.ngForm.value.crop_code;
    let type = !this.viewMode &&  !this.editMode ? 'Add':''

    this.service.getRequestCreatorNew("getLotNumberVarieties?year=" + year + "&season=" + season + "&crop_code=" + crop_code + "&user_id=" + this.currentUser.id + "&type=" + type).subscribe((data: any) => {
      if (data.EncryptedResponse.status_code == 200) {
        this.cropVarietyData = data.EncryptedResponse.data;
      }
    })

    this._serviceSeed.getRequestCreator("get-crop-max-lot-size-data-by-crop-code/" + paramsData).subscribe((data: any) => {
      if (data.EncryptedResponse.status_code == 200) {
        if (data.EncryptedResponse.data) {
          this.actualQuantityForBreederSeed = data.EncryptedResponse.data;
        }
        else {
          this.ngForm.controls["quantity_of_seed_produced"].patchValue("Undefined");
        }
      }
      else {
        this.ngForm.controls["quantity_of_seed_produced"].patchValue("No Data Found");
      }
    })
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }

  onChangeVariety(value) {
    let currentUser = JSON.parse(localStorage.getItem("BHTCurrentUser"))
    this.service.postRequestCreator("get-lot-numbers", {
      search: {
        year: value.year_of_indent,
        crop_code: value.crop_code,
        variety_id: value.variety_id,
        user_id: currentUser.id,
        type:!this.viewMode && !this.editMode ?'Add':''
      }
    })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.lotNumberData = [];

          if (this.createMode) {
            apiResponse.EncryptedResponse.data.rows.forEach(row => {
              if (row.reserved_lot_number !== true) {
                this.lotNumberData.push(row)
              }
            });
          }
          else if (this.editMode) {
            apiResponse.EncryptedResponse.data.rows.forEach(row => {
              if (row.id == this.response.lot_number || row.reserved_lot_number !== true) {
                this.lotNumberData.push(row)
              }
            });
          }
          else {
            this.lotNumberData = apiResponse.EncryptedResponse.data.rows;
          }

        }
      });
     
  }

  submitForm(formData) {
    console.log(this.ngForm.controls['date'].value, 'formdatr ')
    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.submitted = false;
    if (formData.valid) {
      let seedingData = Number(formData.value.seed_class_normal) + Number(formData.value.seed_class_abnormal) + Number(formData.value.seed_class_hard) + Number(formData.value.fresh_ungerminated) + Number(formData.value.dead);
      let physicalPurityData = Number(formData.value.pure_seed) + Number(formData.value.other_crop_seed) + Number(formData.value.weed_seed) + Number(formData.value.inert_matter);

      if (Number(formData.value.pure_seed) >= 50) {
        if (seedingData == 100) {
          if (physicalPurityData == 100) {
            var object = formData.value;
            object['date'] = this.ngForm.controls['date'].value && this.ngForm.controls['date'].value.singleDate && this.ngForm.controls['date'].value.singleDate.jsDate ? convertDates(this.ngForm.controls['date'].value.singleDate.jsDate) : '';
            object['report_recieving_date'] = this.ngForm.controls['report_recieving_date'].value && this.ngForm.controls['report_recieving_date'].value.singleDate && this.ngForm.controls['report_recieving_date'].value.singleDate.jsDate ? convertDates(this.ngForm.controls['report_recieving_date'].value.singleDate.jsDate) : '';
            object['is_active'] = 1;
            object['user_id'] = currentUser.id;
            object['seed_test_lab_id'] = Number(formData.value.seed_test_lab_id);
            object['year_of_indent'] = Number(formData.value.year_of_indent);
            object['quantity_of_seed_produced'] = (this.ngForm.controls['quantity_of_seed_produced'].value).toString() ?? '0';
            object['is_report_pass'] = (object['is_report_pass'] == 'true') ? true : false;
            object['is_occupied'] = false;

            var lot_number = formData.value.lot_number;
            var lot_data;

            this.lotNumberData.forEach(row => {
              if (row.id == lot_number) {
                lot_data = row;
              }
            });

            lot_data.reserved_lot_number = true;

            this.breederService.postRequestCreator('createSeedTestingReports', '', object).subscribe((data: any) => {
              if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                this.service.postRequestCreator("update-lot-number", lot_data).subscribe((apiResponse: any) => {
                  if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
                    Swal.fire({
                      title: '<p style="font-size:25px;">Data Created Successfully.</p>',
                      
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
                    })
                    this.router.navigate(['seed-testing-labortary-breeder-list']);
                  }
                  else {
                    Swal.fire({
                      icon: "error",
                      title: 'Opps..',
                      text: data.EncryptedResponse.message,
                      timer: 2000
                    })
                  }
                });
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
            })
          }
          else {
            Swal.fire({
              title: '<p style="font-size:25px;">Net % of Physical Purity should be 100.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
          }
        }
        else {
          Swal.fire({
            title: '<p style="font-size:25px;">Net % of Different Seeding Classes should be 100.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'
          })
        }
      }
      else {
        Swal.fire({
          title: '<p style="font-size:25px;">Pure Seed % Should be 50 or More.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }


    }
    else {
      this.submitted = true;
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fill out all Required Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }

  }

  updateForm(formData) {
    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.submitted = false;
    // formData={      
    formData.date = convertDates(formData.value.date.singleDate.jsDate),
      formData.report_recieving_date = convertDates(formData.value.report_recieving_date.singleDate.jsDate)

    if (formData.valid) {
      let seedingData = Number(formData.value.seed_class_normal) + Number(formData.value.seed_class_abnormal) + Number(formData.value.seed_class_hard) + Number(formData.value.fresh_ungerminated) + Number(formData.value.dead);
      let physicalPurityData = Number(formData.value.pure_seed) + Number(formData.value.other_crop_seed) + Number(formData.value.weed_seed) + Number(formData.value.inert_matter);

      if (Number(formData.value.pure_seed) >= 50) {
        if (seedingData == 100) {
          if (physicalPurityData == 100) {
            var object = formData.value;
            object['date'] = this.ngForm.controls['date'].value && this.ngForm.controls['date'].value.singleDate && this.ngForm.controls['date'].value.singleDate.jsDate ? convertDates(this.ngForm.controls['date'].value.singleDate.jsDate) : '';
            object['report_recieving_date'] = this.ngForm.controls['report_recieving_date'].value && this.ngForm.controls['report_recieving_date'].value.singleDate && this.ngForm.controls['report_recieving_date'].value.singleDate.jsDate ? convertDates(this.ngForm.controls['report_recieving_date'].value.singleDate.jsDate) : '';
            object['is_active'] = 1;
            object['user_id'] = currentUser.id;
            object['seed_test_lab_id'] = Number(formData.value.seed_test_lab_id);
            object['year_of_indent'] = Number(formData.value.year_of_indent);
            object['createdAt'] = this.response.createdAt;
            object['created_at'] = this.response.created_at;
            object['id'] = this.response.id;
            object['quantity_of_seed_produced'] = (this.ngForm.controls['quantity_of_seed_produced'].value).toString() ?? '0';
            object['is_report_pass'] = (object['is_report_pass'] == 'true' || object['is_report_pass'] == true) ? true : false;
            object['is_occupied'] = false;
            object['moisture'] = this.ngForm.controls['moisture'].value.toString();

            this.breederService.postRequestCreator('updateSeedTestingReports', null, object).subscribe((data: any) => {
              console.log(data)
              if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
                })
                this.router.navigate(['seed-testing-labortary-breeder-list']);
              }
              else {
                Swal.fire({
                  icon: "error",
                  title: 'Opps..',
                  text: data.EncryptedResponse.message,
                  timer: 2000
                })
                // this.router.navigate(['seed-testing-labortary-breeder-list']);
              }
            })
          }
          else {
            Swal.fire({
              title: '<p style="font-size:25px;">Net % of Physical Purity should be 100.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
          }
        }
        else {
          Swal.fire({
            title: '<p style="font-size:25px;">Net % of Different Seeding Classes should be 100.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'

          })
        }
      }
      else {
        Swal.fire({
          title: '<p style="font-size:25px;">Pure Seed % Should be 50 or More.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
    }
    else {
      this.submitted = true;
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fill out all Required fields..</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;

    } else {
      const reg = /^-?\d*(\.\d{0,2})?$/;
      let input = evt.target.value + String.fromCharCode(evt.charCode);

      if (!reg.test(input)) {
        evt.preventDefault();
      }
    }
  }
  
  checkDecimal(e) {
    checkDecimal(e)
  }

  getSeedTestingLaboratory() {
    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    // let user_id =  

    this._serviceSeed.postRequestCreator('getLabTestDataforSeedTesting', null, null).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
        this.seedTestingLabData = data.EncryptedResponse.data.rows;
      }
    });
  }

  onChangeReportRecievingDate(val) {
    console.log(val)
    let selectedDate = new Date(val);
    let currentDate = new Date(new Date().toISOString().slice(0, 10));

    let selectedDateInMS = selectedDate.getTime();
    let currentDateInMS = currentDate.getTime();

    if (selectedDateInMS >= currentDateInMS) {
      this.showDefaultError = false;
    }
    else {
      this.showDefaultError = true;
    }
  }
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };

  get generateDefaultMonth(): string {
    let date = { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }

    //consolelog(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    // disableUntil: { year: 1930, month: 1, day: null },
    disableUntil: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth()), day: this.todaysDate.getDate()  }
  };
  myDpOptionsreportrecieving: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    // disableUntil: { year: 1930, month: 1, day: null },
    disableSince: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: (this.todaysDate.getDate() + 1) }
  };

  myDpOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    // disableUntil: { year: 1930, month: 1, day: null },
    // disableUntil: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() - 1 }
  };
}
