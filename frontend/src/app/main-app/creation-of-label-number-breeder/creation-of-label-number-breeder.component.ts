import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { D, DISABLED, IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { checkDecimal, checkLength, ConfirmAccountNumberValidator, convertDate, convertDates, convertDatetoDDMMYYYYwithdash, errorValidate, } from 'src/app/_helpers/utility';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import Swal from 'sweetalert2';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { DatePipe } from '@angular/common'
import * as html2PDF from 'html2pdf.js';

// import {IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth} from 'angular-mydatepicker';

@Component({
  selector: 'app-creation-of-label-number-breeder',
  templateUrl: './creation-of-label-number-breeder.component.html',
  styleUrls: ['./creation-of-label-number-breeder.component.css']
})
export class CreationOfLabelNumberBreederComponent implements OnInit {

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  enrollFormGroup!: FormGroup;
  submitted = false;
  ngForm!: FormGroup;
  isInvalidForm: boolean = false;
  stateList: any = [];
  districtList: any = [];
  designationList: any;
  todayDate = new Date();
  agency_name: any;
  yearOfIndent: any = [];
  lot_numbers: any;
  selected_lot_number: any;
  quantity_for_labels_generated: any;

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
  crop_name_list: any;
  seedTestingLabData: any;
  generatedLabelNumber: any;
  allGeneratedLabelNumber: any;
  allLabelNumbers: Array<any> = [];
  isHorticulture: boolean = true;
  actualLotSize: any;
  season_list: any;
  minDate = new Date().toISOString().slice(0, 10);

  remainingProdutionQuantity = 0;
  totalFullBags = 0;
  isLabelGenerate: boolean = false;
  labelNumbArr: string[];
  carddata: any;
  productiuon_name: any;
  contactPersonName: any;
  designationname: any;
  breederaddress: any;
  productiuon_short_name: any;

  dataload: boolean = false;

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
  temp: any;
  newBagGenerated: boolean = false;
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
    // disableUntil: { year: 1930, month: 1, day: null },
    disableUntil: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() - 1 }
  };
  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private _serviceSeed: SeedServiceService,
    private breederService: BreederService,
    private service: ProductioncenterService,
    private datePipe: DatePipe,
  ) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      year_of_indent: ['', Validators.required],
      crop_code: ['', Validators.required],
      variety_id: ['', Validators.required],
      lot_number: ['', Validators.required],
      pure_seed: ['', Validators.required],
      inert_matter: ['', Validators.required],
      germination: ['', Validators.required],
      total_production: ['', Validators.required],
      quantity_for_labels_generated: ['', Validators.required],
      date_of_test: ['', Validators.required],
      weight: ['', Validators.required],
      number_of_bags: ['', Validators.required],
      // generated_label_number: ['', Validators.required],
      valid_upto: ['', Validators.required],
      season: ['', Validators.required],
    });

    this.ngForm.controls['pure_seed'].disable();
    this.ngForm.controls['inert_matter'].disable();
    this.ngForm.controls['germination'].disable();
    this.ngForm.controls['total_production'].disable();
    this.ngForm.controls['quantity_for_labels_generated'].disable();
    this.ngForm.controls['date_of_test'].disable();
    this.ngForm.controls['number_of_bags'].disable();
    this.ngForm.controls['valid_upto'].disable();

    if (this.router.url.includes('view')) {
      this.viewMode = true;
      this.editMode = false;
      this.createMode = false;
      this.ngForm.disable();
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
  }

  ngOnInit(): void {
    this.submissionid = this.route.snapshot.paramMap['params'].id;
    this.isHorticulture = true;
    this.newBagGenerated = false;
    this.getSeedTestingLaboratory();
    this.createYearRange();
    this.getAgencyData();

    var temp = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    if(!this.createMode) {
      this.dataload = false;
    } else {
      this.dataload = true;
    }

    if (!this.createMode) {
      this.breederService.getRequestCreator("getLabelNumberForBreederSeedById/" + this.submissionid).subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.response = apiResponse.EncryptedResponse.data;

          if (this.response) {
            this.ngForm.controls["year_of_indent"].patchValue(this.response.year_of_indent);

            this.onChangeYear(this.response.year_of_indent);
            this.ngForm.controls["season"].patchValue(this.response.season);

            this.onChangeSeason(this.response.season, false)
            this.ngForm.controls["crop_code"].patchValue(this.response.crop_code);

            let varietyObject = {
              year_of_indent: this.response.year_of_indent,
              season: this.response.season,
              crop_code: this.response.crop_code
            }

            this.getCropVarietyData(varietyObject, false);
            var lotObject = {
              year_of_indent: this.response.year_of_indent,
              crop_code: this.response.crop_code,
              variety_id: this.response.variety_id
            }
            this.onVarietyChange(lotObject, false)
            


            this.ngForm.controls["variety_id"].setValue(this.response.variety_id);
            this.ngForm.controls["lot_number"].patchValue(this.response.lot_number_creation_id);
            this.ngForm.controls["pure_seed"].patchValue(this.response.pure_seed);
            this.ngForm.controls["inert_matter"].patchValue(this.response.inert_matter);
            this.ngForm.controls["germination"].patchValue(this.response.germination);
            this.ngForm.controls["total_production"].patchValue(this.response.lot_number_creation.lot_number_size);
            this.ngForm.controls["quantity_for_labels_generated"].patchValue(this.response.quantity);
            this.ngForm.controls["date_of_test"].patchValue(convertDatetoDDMMYYYYwithdash(new Date(this.response.date_of_test)));
            this.ngForm.controls["weight"].patchValue(this.response.weight);
            this.ngForm.controls["number_of_bags"].patchValue(this.response.number_of_bags);
            this.ngForm.controls['valid_upto'].patchValue(this.dateFormat(new Date(this.response.valid_upto)));

            this.generatedLabelNumber = [];
            this.allGeneratedLabelNumber = [];
            this.breederService.getRequestCreator("getGeneratedLabelNumberByLabelNumberForBreederseedId?label_number_for_breeder_seeds=" + this.response.id).subscribe((data: any) => {
              if (data.EncryptedResponse.status_code == 200) {
                var string = '';
                this.allGeneratedLabelNumber = data.EncryptedResponse.data;
               
                data.EncryptedResponse.data.forEach(element => {
                  this.generatedLabelNumber.push(element.generated_label_name)
                });
              }

              const tempLength = this.allGeneratedLabelNumber.length;

              if (tempLength <= 0) {
                this.temp = "";
              } else if (tempLength == 1) {
                this.temp = this.allGeneratedLabelNumber[0].generated_label_name
              } else {
                this.temp = this.allGeneratedLabelNumber[0].generated_label_name + "-" + this.allGeneratedLabelNumber[tempLength - 1].unique_label_number;
              }
             
              this.getLabelnumber( tempLength,this.allGeneratedLabelNumber[tempLength - 1].unique_label_number, this.temp)
            })
            
          }
          
          // this.getLabelnumber( this.createRunningNumber(number), this.allLabelNumbers[0].generated_label_name)

          this.dataload = true;
        }
      });

    }

  }

  taskDate(dateMilli) {
    var d = (new Date(dateMilli) + '').split(' ');
    d[2] = d[2] + ',';

    return [d[0], d[1], d[2], d[3]].join(' ');
  }

  getLotSize(lotNumberId) {
    this.service.postRequestCreator("get-lot-size", {
      search: {
        lot_number_id: lotNumberId
      }
    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.actualLotSize = data.EncryptedResponse.data.lot_number_size;
        this.ngForm.controls["total_production"].patchValue(this.actualLotSize);
      }
    })
  }

  getSeedTestingLaboratory() {
    var data = {}
    this._serviceSeed.postRequestCreator('get-lab-test-data', null, data).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
        this.seedTestingLabData = data.EncryptedResponse.data['rows'];
      }
    });
  }

  createYearRange() {
    var temp = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.breederService.getRequestCreator("getYearDataForSeedTestingReports?user_id=" + temp.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.yearOfIndent = data.EncryptedResponse.data.sort((a, b) => b.year_of_indent - a.year_of_indent);
      }
    })
  }

  onChangeYear(year) {
    var temp = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    if (this.createMode) {
      this.ngForm.controls['season'].patchValue("");
      this.ngForm.controls['crop_code'].patchValue("");

    }

    if (year && year !== undefined && year !== null) {
      this.breederService.getRequestCreator("getSeasonDataForSeedTestingReports?year_of_indent=" + year + "&user_id=" + temp.id).subscribe((data: any) => {
        this.season_list = [];
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          data.EncryptedResponse.data.forEach(x => {
            var object = {
              season_name: x['m_season.season'],
              season_code: x['season']
            }
            this.season_list.push(object);
          });
        }
      })
    }
  }

  onChangeSeason(season, change) {
    let year = this.ngForm.value.year_of_indent;
    let temp = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    if (this.createMode) {
      this.ngForm.controls['crop_code'].patchValue("");
    }

    if (season && season !== undefined && season !== null) {
      this.breederService.getRequestCreator("getCropsDataForSeedTestingReports?year_of_indent=" + year + "&season=" + season + "&user_id=" + temp.id).subscribe((data: any) => {
        this.crop_name_list = [];
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

      if (change) {
        this.ngForm.controls["crop_code"].patchValue('');
        this.ngForm.controls["variety_id"].patchValue('');
        this.ngForm.controls["lot_number"].patchValue('');
        this.ngForm.controls["pure_seed"].patchValue(undefined);
        this.ngForm.controls["inert_matter"].patchValue(undefined);
        this.ngForm.controls["germination"].patchValue(undefined);
        this.ngForm.controls["total_production"].patchValue(undefined);
        this.ngForm.controls["quantity_for_labels_generated"].patchValue(undefined);
        this.ngForm.controls["date_of_test"].patchValue(undefined);
        this.ngForm.controls["weight"].patchValue(undefined);
        this.ngForm.controls["valid_upto"].patchValue(undefined);
        this.ngForm.controls["number_of_bags"].patchValue(undefined);

        this.temp = '';
      }
    }
  }

  getCropVarietyData(paramsData, change = false) {
    let temp = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    if (paramsData) {
      this.isHorticulture = (paramsData.crop_code[0] == 'H') ? true : false;


      let year = paramsData.year_of_indent;
      let season = paramsData.season;
      let crop_code = paramsData.crop_code;

      this.breederService.getRequestCreator("getVarietiesDataForLabelNumberSecond?year_of_indent=" + year + "&season=" + season + "&crop_code=" + crop_code + "&user_id=" + temp.id).subscribe((apiResponse: any) => {
       if(apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code==200 ){
        if(apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data  && apiResponse.EncryptedResponse.data.length>0 ){
          const result = apiResponse.EncryptedResponse.data;          
          let cropVarietData=[]
          if(result && result.length>0){

            for(let data of result){
  
              cropVarietData.push(data && data['m_crop_variety.id'] ? data['m_crop_variety.id'] :'')
  
            }
          }
      const param={
        year: paramsData.year_of_indent,
    season : paramsData.season,
    crop_code : paramsData.crop_code,
    cropVarietData:cropVarietData,
    user_id:temp.id,
    type:!this.viewMode && !this.editMode ? 'ADD':''
     }
     if (this.createMode) {
      param['is_occupied'] = false;
    }

       
          this.breederService.postRequestCreator("getVarietiesDataForSeedTestingReportsSecond",null,param).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
              this.cropVarietyData = data && data.EncryptedResponse && data.EncryptedResponse.data ?  data.EncryptedResponse.data:"";
    
              if (change) {
                this.ngForm.controls["variety_id"].patchValue('');
                this.ngForm.controls["lot_number"].patchValue('');
                this.ngForm.controls["pure_seed"].patchValue(undefined);
                this.ngForm.controls["inert_matter"].patchValue(undefined);
                this.ngForm.controls["germination"].patchValue(undefined);
                this.ngForm.controls["total_production"].patchValue(undefined);
                this.ngForm.controls["quantity_for_labels_generated"].patchValue(undefined);
                this.ngForm.controls["date_of_test"].patchValue(undefined);
                this.ngForm.controls["weight"].patchValue(undefined);
                this.ngForm.controls["number_of_bags"].patchValue(undefined);
    
                this.temp = '';
                // this.ngForm.controls["valid_upto"].patchValue(undefined);
    
              }
    
            }
    
          })
        }
        else{
          this.breederService.getRequestCreator("getVarietiesDataForSeedTestingReports?year_of_indent=" + year + "&season=" + season + "&crop_code=" + crop_code + "&user_id=" + temp.id).subscribe((data: any) => {
            if (data.EncryptedResponse.status_code == 200) {
              this.cropVarietyData = data.EncryptedResponse.data;
    
              if (change) {
                this.ngForm.controls["variety_id"].patchValue('');
                this.ngForm.controls["lot_number"].patchValue('');
                this.ngForm.controls["pure_seed"].patchValue(undefined);
                this.ngForm.controls["inert_matter"].patchValue(undefined);
                this.ngForm.controls["germination"].patchValue(undefined);
                this.ngForm.controls["total_production"].patchValue(undefined);
                this.ngForm.controls["quantity_for_labels_generated"].patchValue(undefined);
                this.ngForm.controls["date_of_test"].patchValue(undefined);
                this.ngForm.controls["weight"].patchValue(undefined);
                this.ngForm.controls["number_of_bags"].patchValue(undefined);
    
                this.temp = '';
                // this.ngForm.controls["valid_upto"].patchValue(undefined);
    
              }
    
            }
    
          })
        }
       }
       else{
        this.breederService.getRequestCreator("getVarietiesDataForSeedTestingReports?year_of_indent=" + year + "&season=" + season + "&crop_code=" + crop_code + "&user_id=" + temp.id).subscribe((data: any) => {
          if (data.EncryptedResponse.status_code == 200) {
            this.cropVarietyData = data.EncryptedResponse.data;
  
            if (change) {
              this.ngForm.controls["variety_id"].patchValue('');
              this.ngForm.controls["lot_number"].patchValue('');
              this.ngForm.controls["pure_seed"].patchValue(undefined);
              this.ngForm.controls["inert_matter"].patchValue(undefined);
              this.ngForm.controls["germination"].patchValue(undefined);
              this.ngForm.controls["total_production"].patchValue(undefined);
              this.ngForm.controls["quantity_for_labels_generated"].patchValue(undefined);
              this.ngForm.controls["date_of_test"].patchValue(undefined);
              this.ngForm.controls["weight"].patchValue(undefined);
              this.ngForm.controls["number_of_bags"].patchValue(undefined);
  
              this.temp = '';
              // this.ngForm.controls["valid_upto"].patchValue(undefined);
  
            }
  
          }
  
        })
       }
      })

    }
  }

  onChangeLotNumber(value, change = null) {
    let currentUser = JSON.parse(localStorage.getItem("BHTCurrentUser"));

    if (this.lot_numbers) {
      this.selected_lot_number = {};
      this.lot_numbers.forEach(data => {
        if (data.lot_number == value.lot_number) this.selected_lot_number = data;
      });

      if (this.selected_lot_number && this.selected_lot_number !== undefined && this.selected_lot_number !== null) {

        this.ngForm.controls["pure_seed"].patchValue(this.selected_lot_number.pure_seed);
        this.ngForm.controls["inert_matter"].patchValue(this.selected_lot_number.inert_matter);
        this.ngForm.controls["germination"].patchValue(this.selected_lot_number.seed_class_normal);
        this.ngForm.controls["total_production"].patchValue(this.selected_lot_number.lot_number_creation.lot_number_size);
        this.ngForm.controls["quantity_for_labels_generated"].patchValue(this.selected_lot_number.lot_number_creation.lot_number_size);

        let date_of_test = new Date(this.selected_lot_number.date)
        this.ngForm.controls["date_of_test"].patchValue(this.dateFormat(date_of_test));

        if (date_of_test && date_of_test.toString() && date_of_test.toString() !== 'Invalid Date') {
          let tempDate = new Date(date_of_test.setMonth(date_of_test.getMonth() + 9));
          let valid_upto = new Date(tempDate.setDate(tempDate.getDate() - 1));
          this.ngForm.controls['valid_upto'].patchValue(this.dateFormat(valid_upto))

        } else {
          let today = new Date();
          let tempDate = new Date(today.setMonth(today.getMonth() + 9));
          let valid_upto = new Date(tempDate.setDate(tempDate.getDate() - 1));

          this.ngForm.controls['valid_upto'].patchValue(this.dateFormat(valid_upto))
        }


        if (change) {
          this.ngForm.controls["weight"].patchValue(undefined);
          this.ngForm.controls["number_of_bags"].patchValue(undefined);
          this.temp = '';
        }

      }
    }

    // if (this.lot_numbers !== undefined) {
    //   this.lot_numbers.forEach(data => {
    //     if (data.lot_number == value.lot_number) this.selected_lot_number = data;
    //   });

    //   if (this.selected_lot_number && this.selected_lot_number !== undefined && this.selected_lot_number !== null) {
    //     this.ngForm.controls["pure_seed"].patchValue(this.selected_lot_number.pure_seed);
    //     this.ngForm.controls["inert_matter"].patchValue(this.selected_lot_number.inert_matter);
    //     this.ngForm.controls["date_of_test"].patchValue(convertDatetoDDMMYYYYwithdash(new Date(this.selected_lot_number.date)));
    //     this.ngForm.controls["quantity_for_labels_generated"].patchValue(this.selected_lot_number.lot_number_creation.lot_number_size);
    //     this.ngForm.controls["total_production"].patchValue(this.selected_lot_number.lot_number_creation.lot_number_size);
    //     this.ngForm.controls["germination"].patchValue(this.selected_lot_number.seed_class_normal);
    //     if (change) {
    //       this.ngForm.controls["weight"].patchValue(undefined);
    //       this.ngForm.controls["number_of_bags"].patchValue(undefined);
    //       this.ngForm.controls["quantity_for_labels_generated"].patchValue(undefined);
    //     }


    //   }
    //   else {
    //     this.ngForm.controls["pure_seed"].patchValue(undefined);
    //     this.ngForm.controls["inert_matter"].patchValue(undefined);
    //     this.ngForm.controls["date_of_test"].patchValue(undefined);
    //     this.ngForm.controls["total_production"].patchValue(undefined);
    //     this.ngForm.controls["quantity_for_labels_generated"].patchValue(undefined);
    //     this.ngForm.controls["germination"].patchValue(undefined);
    // }

    //   this.breederService.getRequestCreator('getAllLabelNumberForBreederSeedbyLotNumber?year_of_indent=' + value.year_of_indent + '&&crop_code=' + value.crop_code + '&&variety_id=' + value.variety_id + '&&lot_number=' + value.lot_number + '&&user_id=' + currentUser.id).subscribe((data: any) => {
    //     this.quantity_for_labels_generated = 0;

    //     if (data && data.EncryptedResponse && data.EncryptedResponse.data.length > 0) {

    //       var produced_quantity = 0;
    //       if (this.isHorticulture) {
    //         produced_quantity = 0;
    //         data.EncryptedResponse.data.forEach(element => {
    //           produced_quantity = produced_quantity + (Number(element.weight) * element.number_of_bags);
    //         });
    //       }
    //       else {
    //         produced_quantity = 0;
    //         data.EncryptedResponse.data.forEach(element => {
    //           produced_quantity = produced_quantity + ((Number(element.weight) * element.number_of_bags) / 100);
    //         });
    //       }


    //       this.quantity_for_labels_generated = this.selected_lot_number.lot_number_creation.lot_number_size - produced_quantity;
    //       this.ngForm.controls["quantity_for_labels_generated"].patchValue((this.quantity_for_labels_generated));

    //     }
    //     else {
    //       this.quantity_for_labels_generated = this.selected_lot_number.lot_number_creation.lot_number_size ? this.selected_lot_number.lot_number_creation.lot_number_size : 0;
    //       this.ngForm.controls["quantity_for_labels_generated"].patchValue(this.quantity_for_labels_generated);
    //     }
    //   })
    // }
  }

  createRunningNumber(number) {
    if (number <= 9) {
      return '00000' + (number).toString()
    } else if (number <= 99) {
      return '0000' + (number).toString()
    } else if (number <= 999) {
      return '000' + (number).toString()
    } else if (number <= 9999) {
      return '00' + (number).toString()
    } else if (number <= 99999) {
      return '0' + (number).toString()
    }
    return number
  }

  onGenerateBags(val, change = null) {
    this.isLabelGenerate = true;
    const weight = this.ngForm.controls['weight'].value;

    if (weight && weight > 0) {
      this.newBagGenerated = true;

      let currentUser = JSON.parse(localStorage.getItem("BHTCurrentUser"))
      let total_production;
      const value = val;

      this.remainingProdutionQuantity = 0;
      this.totalFullBags = 0

      if (change) {
        total_production = (this.selected_lot_number['crop_code'][0] == 'H') ? (this.selected_lot_number.lot_number_creation.lot_number_size) : (this.selected_lot_number.lot_number_creation.lot_number_size * 100);
      } else {
        total_production = 0
      }

      this.remainingProdutionQuantity = total_production % val;
      let bags = Math.floor(total_production / val);

      if (this.remainingProdutionQuantity > 0) {
        this.totalFullBags = bags + 1;
      }
      else {
        this.totalFullBags = bags
      }

      this.ngForm.controls['number_of_bags'].patchValue(this.totalFullBags)

      // this.masterService.getRequestCreatorNew("getAgencyUserById/" + currentUser.agency_id).subscribe((data: any) => {
      // let bspcCode = data.EncryptedResponse.data.short_name;
      this.masterService.getRequestCreatorNew("get-user-code-by-id/" + currentUser.id).subscribe((data: any) => {

        let bspcCode = data.EncryptedResponse.data.code;

        this.breederService.getRequestCreator("getAllGeneratedLabelNumberByUserId?user_id=" + currentUser.id).subscribe((apiResponse: any) => {

          var labelData = []

          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            labelData = apiResponse.EncryptedResponse.data;
          }

          var length = 0;
          if (this.remainingProdutionQuantity == 0) {
            length = this.totalFullBags;
          } else {
            length = this.totalFullBags - 1;
          }

          this.allLabelNumbers = [];

          var number = (labelData && labelData[0]) ? Number(labelData[0].unique_label_number) : 0;
          var tempString = "";

          for (let i = 0; i < length; i++) {
            number = number + 1;
            let runningNumber = this.createRunningNumber(number)

            let object = {};

            object['weight'] = value;
            object['generated_label_name'] = bspcCode + "/" + new Date().getFullYear().toString().substr(-2) + "/B/" + runningNumber.toString();
            object['user_id'] = currentUser.id;
            object['unique_label_number'] = runningNumber.toString();

            this.allLabelNumbers.push(object)

            let gString = bspcCode + "/" + new Date().getFullYear().toString().substr(-2) + "/B/" + runningNumber;

            tempString += ((length - 1) == i ? gString : gString + ", ")
          }

          if (this.remainingProdutionQuantity !== 0) {
            number = number + 1;
            let runningNumber = this.createRunningNumber(number)

            let temp = {
              weight: this.remainingProdutionQuantity,
              generated_label_name: bspcCode + "/" + new Date().getFullYear().toString().substr(-2) + "/B/" + runningNumber.toString(),
              user_id: currentUser.id,
              unique_label_number: runningNumber.toString()
            }
            this.allLabelNumbers.push(temp);

            tempString = tempString + ", " + temp['generated_label_name'];
          }

          const tempLength = this.allLabelNumbers.length;

          if (tempLength <= 0) {
            this.temp = "";
          } else if (tempLength == 1) {
            this.temp = this.allLabelNumbers[0].generated_label_name
          } else {
            this.temp = this.allLabelNumbers[0].generated_label_name + "-" + this.allLabelNumbers[tempLength - 1].unique_label_number;
          }
          this.getLabelnumber( tempLength,this.createRunningNumber(number), this.allLabelNumbers[0].generated_label_name)

        })
      })
    }
    else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Enter the Weight.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }

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

  submitForm(formData) {
   
    if (!this.isLabelGenerate) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Generate Label Number.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }
    if (formData.valid && !this.isInvalidForm) {
      var object = formData.value;
      let currentUser = JSON.parse(localStorage.getItem("BHTCurrentUser"));

      object['date_of_test'] = new Date(this.selected_lot_number.date);
      const date_of_test = new Date(this.selected_lot_number.date);

      if (date_of_test && date_of_test.toString() && date_of_test.toString() !== 'Invalid Date') {
        let tempDate = new Date(date_of_test.setMonth(date_of_test.getMonth() + 9));
        let valid_upto = new Date(tempDate.setDate(tempDate.getDate() - 1));
        object['valid_upto'] = valid_upto;

      } else {
        let today = new Date();
        let tempDate = new Date(today.setMonth(today.getMonth() + 9));
        let valid_upto = new Date(tempDate.setDate(tempDate.getDate() - 1));
        object['valid_upto'] = valid_upto
      }

      object['weight'] = this.ngForm.controls['weight'].value
      object['is_active'] = 1;
      object['user_id'] = currentUser ? currentUser.id : 0;
      object['lot_number_creation_id'] = this.selected_lot_number.lot_number;
      object['pure_seed'] = this.selected_lot_number.pure_seed;
      object['inert_matter'] = this.selected_lot_number.inert_matter;
      object['total_production'] = this.selected_lot_number.lot_number_creation.lot_number_size;
      object['quantity_for_labels_generated'] = this.selected_lot_number.lot_number_creation.lot_number_size;
      object["germination"] = this.selected_lot_number.seed_class_normal ? this.selected_lot_number.seed_class_normal : 0;
      object['number_of_bags'] = this.totalFullBags ? this.totalFullBags : 0;
      object['seed_testing_reports_id'] = this.selected_lot_number.id;

      this.breederService.postRequestCreator('createLabelNumberForBreederSeed', '', object).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

          var genratedLabelData = [];
          this.allLabelNumbers.forEach(labelNumber => {
            var object = labelNumber;
            object['label_number_for_breeder_seeds'] = data.EncryptedResponse.data.id;

            genratedLabelData.push(object)
          });

          this.breederService.postRequestCreator('createGeneratedLabelNumber', '', genratedLabelData).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
              this.router.navigate(['creation-of-label-number-for-seeds-list']);
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
        icon: "error",
        title: "Opps",
        text: "Please Enter Valid Input.",
        timer: 2000
      })
    }

  }

  updateForm(formData) {
    if (formData.valid && !this.isInvalidForm) {
      var object = formData.value;
      let currentUser = JSON.parse(localStorage.getItem("BHTCurrentUser"));

      object['date_of_test'] = new Date(this.selected_lot_number.date);
      const date_of_test = new Date(this.selected_lot_number.date);

      if (date_of_test && date_of_test.toString() && date_of_test.toString() !== 'Invalid Date') {
        let tempDate = new Date(date_of_test.setMonth(date_of_test.getMonth() + 9));
        let valid_upto = new Date(tempDate.setDate(tempDate.getDate() - 1));
        object['valid_upto'] = valid_upto;

      } else {
        let today = new Date();
        let tempDate = new Date(today.setMonth(today.getMonth() + 9));
        let valid_upto = new Date(tempDate.setDate(tempDate.getDate() - 1));
        object['valid_upto'] = valid_upto
      }

      object['id'] = this.response.id;
      object['createdAt'] = this.response.createdAt;
      object['created_at'] = this.response.created_at;

      object['weight'] = this.ngForm.controls['weight'].value;
      object['is_active'] = 1;
      object['user_id'] = currentUser ? currentUser.id : 0;
      object['lot_number_creation_id'] = this.selected_lot_number.lot_number;
      object['pure_seed'] = this.selected_lot_number.pure_seed;
      object['inert_matter'] = this.selected_lot_number.inert_matter;
      object['total_production'] = this.selected_lot_number.lot_number_creation.lot_number_size;
      object['quantity_for_labels_generated'] = this.selected_lot_number.lot_number_creation.lot_number_size;
      object["germination"] = this.response.germination;
      object['seed_testing_reports_id'] = this.selected_lot_number.id;

      if (this.newBagGenerated) {
        object["removePreviousLabelData"] = true;
        object['number_of_bags'] = this.totalFullBags ? this.totalFullBags : 0;
      } else {
        object["removePreviousLabelData"] = false;
        object['number_of_bags'] = this.response.number_of_bags;
      }



      if (this.selected_lot_number.id !== this.response.seed_testing_reports_id) {
        object['is_lot_changed'] = true;
        object['previous_seed_testing_reports_id'] = this.response.seed_testing_reports_id;
      }

      this.breederService.postRequestCreator('updateLabelNumberForBreederSeed', '', object).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

          var genratedLabelData = [];
          this.allLabelNumbers.forEach(labelNumber => {
            var object = labelNumber;
            object['label_number_for_breeder_seeds'] = this.response.id;

            genratedLabelData.push(object)
          });

          this.breederService.postRequestCreator('createGeneratedLabelNumber', '', genratedLabelData).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
              })
              this.router.navigate(['creation-of-label-number-for-seeds-list']);
            }
            else {
              Swal.fire({
                icon: "error",
                title: "Opps",
                text: data.EncryptedResponse.message,
                timer: 2000
              })
            }
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
      })
    }
    else {
      Swal.fire({
        title: 'Oops',
          text: '<p style="font-size:25px;">Please Enter Valid Input.</p>',
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
    if(charCode == 46){
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  isOnlyNumberKey(evt) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
    return true;
  }

  checkDecimal(e) {
    checkDecimal(e)
  }

  getCroupNameList() {
    this.breederService.getRequestCreatorNew("get-breeder-crop-list").subscribe((data: any) => {
      this.crop_name_list = [];
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach(x => {
          var object = {
            crop_name: x['m_crop.crop_name'],
            crop_code: x['crop_code']
          }
          this.crop_name_list.push(object);
        });
      }
    });
  }

  onVarietyChange(value: any, change = null) {

    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    var object = {
      year_of_indent: value.year_of_indent,
      crop_code: value.crop_code,
      variety_id: value.variety_id,
      user_id: currentUser.id
    }

    if (this.createMode) {
      object['is_occupied'] = false;
    }

    this.breederService.postRequestCreator("getDataforlabelNumberforBreederSeed", '', object).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {     
        this.lot_numbers = apiResponse.EncryptedResponse.data;
        if (change) {
          this.ngForm.controls["lot_number"].patchValue('');
          this.ngForm.controls["pure_seed"].patchValue(undefined);
          this.ngForm.controls["inert_matter"].patchValue(undefined);
          this.ngForm.controls["date_of_test"].patchValue(undefined);
          this.ngForm.controls["total_production"].patchValue(undefined);
          this.ngForm.controls["quantity_for_labels_generated"].patchValue(undefined);
          this.ngForm.controls["germination"].patchValue(undefined);
          this.ngForm.controls["weight"].patchValue(undefined);
          this.ngForm.controls["number_of_bags"].patchValue(undefined);

          this.temp = '';
        }

        if (this.editMode) {
          var object = {
            lot_number: this.response.lot_number_creation_id,
            year_of_indent: this.response.year_of_indent,
            crop_code: this.response.crop_code,
            variety_id: this.response.variety_id
          }
          this.onChangeLotNumber(object, false);
        }

      }
    });
  }

  // onGenerateLabelNumber(value) {
  //   if (!this.viewMode) {
  //     if (value.number_of_bags && value.number_of_bags !== undefined && value.number_of_bags !== null && value.number_of_bags > 0) {

  //       var object = {
  //         weight: value.weight,
  //         number_of_bags: value.number_of_bags
  //       }

  //       let tempQuality = this.isHorticulture ? this.quantity_for_labels_generated : (this.quantity_for_labels_generated * 100);

  //       if (tempQuality >= (Number(object.weight) * object.number_of_bags)) {
  //         this.breederService.getRequestCreator("getAllGeneratedLabelNumber").subscribe((apiResponse: any) => {
  //           if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
  //             && apiResponse.EncryptedResponse.status_code == 200) {
  //             let allData = apiResponse.EncryptedResponse.data;

  //             var lastNumber;
  //             var number_of_bags = value.number_of_bags;
  //             var gString;
  //             this.generatedLabelNumber = [];

  //             if (allData.length > 0) {
  //               allData = allData.sort((a, b) => b.id - a.id);
  //               lastNumber = allData[0].id;
  //             }
  //             else {
  //               lastNumber = 0;
  //             }

  //             let currentUser = JSON.parse(localStorage.getItem("BHTCurrentUser"))

  //             this.masterService.getRequestCreatorNew("get-user-by-id/" + currentUser.created_by).subscribe((data: any) => {
  //               var breedString = '';
  //               if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
  //                 && data.EncryptedResponse.status_code == 200) {
  //                 if (data.EncryptedResponse.data.agency_detail && data.EncryptedResponse.data.agency_detail.short_name && data.EncryptedResponse.data.agency_detail.short_name.length > 4) {
  //                   breedString = data.EncryptedResponse.data.agency_detail.short_name.slice(0, 5);
  //                 }
  //                 else {
  //                   breedString = data.EncryptedResponse.data.agency_detail.short_name;
  //                 }
  //               }
  //               else {
  //                 breedString = "BREED";
  //               }

  //               var tempString = "";
  //               for (let i = 1; i <= number_of_bags; i++) {
  //                 gString = breedString + "/" + (lastNumber + i);
  //                 this.generatedLabelNumber.push(gString)
  //                 tempString += (number_of_bags == i ? gString : gString + ", ")
  //               }
  //               this.temp = tempString
  //             })
  //           }
  //         })
  //       }
  //       else {
  //         Swal.fire({
  //           toast: true,
  //           icon: "error",
  //           title: "Generated quantity more the remaining quantity!",
  //           position: "top",
  //           showConfirmButton: false,
  //           showCloseButton: true,
  //           showCancelButton: false,
  //           timer: 2000
  //         })
  //       }
  //     }
  //     else {
  //       Swal.fire({
  //         toast: true,
  //         icon: "error",
  //         title: "Please enter valid number",
  //         position: "top",
  //         showConfirmButton: false,
  //         showCloseButton: true,
  //         showCancelButton: false,
  //         timer: 2000
  //       })
  //     }
  //   }

  // }

  onDateChanged(event: IMyDateModel): void {
    // date selected
  }
  preventKeyPress(event) {
    event.preventDefault();
  }

  onChangeValidUptoDate(val) {
    const validUptoDate = convertDates(this.ngForm.controls['valid_upto'].value.singleDate.jsDate)
    let selectedDate = new Date(validUptoDate);
    let currentDate = new Date(new Date().toISOString().slice(0, 10));

    let selectedDateInMS = selectedDate.getTime();
    let currentDateInMS = currentDate.getTime();

    if (selectedDateInMS >= currentDateInMS) {
      this.isInvalidForm = false;
    }
    else {
      this.isInvalidForm = true;
    }
  }

  dateFormat(inputDate) {
    let date, month, year;

    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

    date = date
      .toString()
      .padStart(2, '0');

    month = month
      .toString()
      .padStart(2, '0');

    return `${date}-${month}-${year}`;
  }
  getLabelnumber( itemVal,temp, val) {
    
    let labelNumbers;
    let item;
    let  labelNumber;
    let  label;
    if(itemVal>1){

      const item = val ? val.split('/') : '';
      
      if(this.viewMode){
         labelNumbers = item ? item[3] : '';
         label = labelNumbers  ? labelNumbers.split('-') :''
         labelNumber = label ? label[0] :''
  
  
      }
      else{
        labelNumber =  item ? item[3] : '';
      }
    
  //  else{
  //    item = val ? val.split('/') : '';
  //    labelNumber =  item ? item[3] : '';
  //  }

    const array = []
    for (let index = parseInt(labelNumber); index <= parseInt(temp); index++) {
      array.push(index)
    }

    const dividedArray = [];
    const length = array.length;

    for (let i = 0; i < length; i += 20) {
      const chunk = array.slice(i, i + 20);
      dividedArray.push(chunk);
    }
    let labelNumberPrefix = item[0] + '/' + item[1] + '/' + item[2] + '/';
    const maxNumbers = dividedArray.map(arr => Math.max(...arr));
    const minNuber = dividedArray.map(arr => Math.min(...arr));
   
    let labelNumberArr = []
    for (let index in minNuber) {
      // for (let val in maxNumbers) {
        labelNumberArr.push({
          key: labelNumberPrefix + (minNuber[index]) && (minNuber[index].toString().length == 1)
            ? '00000' + minNuber[index] : (minNuber[index].toString().length == 2) ? ('0000' + (minNuber[index]))
              : (minNuber[index].toString().length == 3) ? (('000' + minNuber[index]) ) : (minNuber[index].toString().length == 4) ? ('00' + minNuber[index]) :
                (minNuber[index].toString().length == 5) ? ('0' + minNuber[index]) : minNuber[index] 


        })
      // }
    }
    const mappedArray = labelNumberArr.map((value, index) => (labelNumberPrefix + value.key) + '-' + ('000' +  maxNumbers[index]));
    
    this.labelNumbArr =mappedArray
  }
  else{
    let labelNumberArr = []
    labelNumberArr.push(val)
    this.labelNumbArr =labelNumberArr
  }
    // for()
    // console.log('temp',tempvalue,temp,'this.allLabelNumbers[0].generated_label_name',val
    // this.allGeneratedLabelNumber[0].generated_label_name ,
    //  this.allGeneratedLabelNumber[tempLength - 1].unique_label_number
    // )
  }
  download(data,formValue) {



    let cardData = [];
    let datas
  
    if(this.lot_numbers){
       datas= this.lot_numbers.filter(item=>item.lot_number_creation.id == this.ngForm.controls['lot_number'].value)
    }
    let crop_name_list;
    if(this.crop_name_list){

       crop_name_list= this.crop_name_list.filter(item=>item.crop_code==this.ngForm.controls['crop_code'].value) 
    }
    let cropVarietyData;
    if(this.cropVarietyData){

      cropVarietyData= this.cropVarietyData.filter(item=>item['m_crop_variety.id']==this.ngForm.controls['variety_id'].value) 
   }
  
    let value = data ? data.split('-'):'' ;

   
    let item =value ? value[0]:''; 
    let value3 =item ? item.split('/'):'' ;
    let startingVal = value3 ? value3.slice(-1).pop() :'';
    let endingval = value ? value.slice(-1).pop() :'';
    let labelNumberPrefix = value3[0] + '/' + value3[1] + '/' + value3[2] + '/';
    var str = "00000000002346301625363";
    startingVal = (startingVal * 1).toString();
    startingVal=Number(startingVal)
    endingval = (endingval * 1).toString();
    endingval=Number(endingval)
 console.log(endingval,'endingval')
 console.log(startingVal,'startingVal')
    // let labelNumber = data && data.generated_label_number ? data.generated_label_number.split(' ') : ''

    // cardData.push()
    let labelNumbercard = []
    for(let index=startingVal;index<=endingval;index++){
      labelNumbercard.push({
        crop_name:crop_name_list && crop_name_list[0] && crop_name_list[0].crop_name ? crop_name_list[0].crop_name :'',
        varietyName:cropVarietyData && cropVarietyData[0] && cropVarietyData[0] && cropVarietyData[0]['m_crop_variety.variety_name'] ? cropVarietyData[0]['m_crop_variety.variety_name'] :'NA' ,
        Label_Number: labelNumberPrefix +  ((index) && ([index].toString().length == 1)
        ? '00000' + index : ([index].toString().length == 2) ? ('0000' + ([index]))
          : ([index].toString().length == 3) ? (('000' + [index]) ) : ([index].toString().length == 4) ? ('00' + [index]) :
            ([index].toString().length == 5) ? ('0' + [index]) : [index]) ,
        germination: this.ngForm.controls['germination'].value ? this.ngForm.controls['germination'].value :'',
        inert_matter: this.ngForm.controls['inert_matter'].value ? this.ngForm.controls['inert_matter'].value :'',
        date_of_test: this.ngForm.controls['date_of_test'].value ? (this.ngForm.controls['date_of_test'].value) :'',
        // id:index % 2 == 0 ? "page-break0" : "page-break1",
        purt_seed: this.ngForm.controls['pure_seed'].value ? this.ngForm.controls['pure_seed'].value:'',
        lot_number:datas && datas[0] && datas[0].lot_number_creation && datas[0].lot_number_creation.lot_number ? datas[0].lot_number_creation.lot_number :''
        // germination
        // pure_seed
      })

    }
    labelNumbercard.forEach((item,index)=>{
      item.id=index % 2 == 0 ? "page-break0" : "page-break1"
    })
    // for(let index in labelNumbercard){
    //   labelNumbercard[index].id =  index % 2 == 0 ? "page-break0" : "page-break1"
    // }
    // labelNumbercard.map(ele)
    // const values = labelNumbercard.map((ele,index)=>{...ele,'id':index}) 
    console.log('labelNumbercard=======>',labelNumbercard)
    // this.carddata = cardData[0]
    // let labelNumbercard = []
    // for (let index = 0; index < data.length; index++) {

    //   labelNumbercard.push({
    //     Label_Number: this.carddata[index],
    //      crop_name: data && data.m_crop && data.m_crop.crop_name ? data.m_crop.crop_name : ''
    //     , germination: data && data.germination ? data.germination : '',
    //      inert_matter: data && data.inert_matter ? data.inert_matter : '',
    //     varietyName: data && data.m_crop_variety && data.m_crop_variety.variety_name ? data.m_crop_variety.variety_name : '',
    //     date_of_test: data && data.date_of_test ? convertDatetoDDMMYYYYwithdash(data.date_of_test) : '',
    //     purt_seed: data && data.pure_seed ? (data.pure_seed) : '', id: index % 2 == 0 ? "page-break0" : "page-break1",
    //     lot_number: data && data.lot_number_creation && data.lot_number_creation.lot_number ? data.lot_number_creation.lot_number : '',


    //   })





    // }

    this.carddata = labelNumbercard
    const element = document.getElementById('content_card');
    
    const name = 'report';
    const options = {
      filename: `${name}.pdf`,
      margin: [0, 0, 0, 0],
      image: { type: 'jpeg', quality: 0.98, crossorigin: "*", },

      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', pagesplit: true },
      letterRendering: true,
      pagebreak: { after: ['#page-break1'], avoid: 'img' },
      // pagebreak: {after: '.test-item--page-break'},
      html2canvas: {
        dpi: 300,
        scale: 2,
        letterRendering: true,
        logging: true
        // useCORS: true,

      },
    };





    html2PDF().set(options).from(element).toPdf().save();
  }
  getAgencyData() {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.productiuon_short_name = data && data.name ? data.name : ''
    
    const param = {
      search: {
        id: data.agency_id
      }
    }
    this.service.postRequestCreator('getAgencyDetailLabelData', param).subscribe(data => {
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.contactPersonName = apiResponse && apiResponse[0] && apiResponse[0].contact_person_name ? apiResponse[0].contact_person_name : '';
      this.designationname = apiResponse && apiResponse[0] && apiResponse[0].m_designation && apiResponse[0].m_designation.name ? apiResponse[0].m_designation.name : ""
      this.breederaddress = apiResponse && apiResponse[0] && apiResponse[0].address ? apiResponse[0].address : '';
      this.productiuon_name = apiResponse && apiResponse[0] && apiResponse[0].agency_name ? apiResponse[0].agency_name : '';
    })
  }
}
