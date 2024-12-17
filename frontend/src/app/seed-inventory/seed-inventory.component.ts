import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from '../services/master/master.service';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { checkDecimal, checkNumber, convertDates } from '../_helpers/utility';
@Component({
  selector: 'app-seed-inventory',
  templateUrl: './seed-inventory.component.html',
  styleUrls: ['./seed-inventory.component.css']
})
export class SeedInventoryComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  is_developed: boolean = true;
  is_update: boolean = false;
  isCrop: boolean = false;

  classOfSeed = [

  ]
  inventorySeasonData = [
    {
      'season': 'Kharif',
      'season_code': 'K'
    },
    {
      'season': 'Rabi',
      'season_code': 'R'
    },
  ];
  showVariety = false;
  isSearch: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  varietyList = [];
  varietyDisbled: boolean = true;
  isDeveloped: boolean = false;
  inventoryData = [
    { "id": 1, "year": "b", "season": "a", "crop": "b", "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 2, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 3, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 4, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 5, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 6, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 7, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 8, "variety_name": "PW-248", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" }
  ];
  inventoryYearData = [];
  inventoryCropData: any;
  inventoryVarietyData: any;
  bspcList: any;
  selectBspc;
  cropList: any;
  showThirdPortion = true;
  selectCrop: any;
  selectVariety: any;
  showwillingToProduce = false;
  showthirdPortionData = true;
  selectBspcDeveloping;
  showSecondPortion = false;
  croplistSecond: any;
  varietyListSecond: any[];
  bspcListSecond: any;
  stagelist: any;
  getIdofrecord: any;
  saveVarietyList: any;
  todayDate = new Date();

  parsedDate = Date.parse(this.todayDate.toString());
  date;
  endDate = new Date();
  classSeedlist: any;
  selectedVariety: boolean = false;
  showLotPage = false;
  disableQuantity: boolean;
  disableUpperSection: boolean;
  setid: any;
  isShowTable: boolean;
  ids: any = [];
  unit: string;
  tagId: any;
  seedTagDetailsId: any[];
  seed_inventry_id: any;
  selectParentalLine: any;
  parentalList: any;
  showparental: boolean;
  responseData: any;


  constructor(private service: SeedServiceService, private breeder: BreederService, private fb: FormBuilder, private masterService: MasterService) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      BSPC: ['', [Validators.required]],
      bspc_text: [''],
      crop: ['', [Validators.required]],
      variety_filter: [''],
      crop_text: [''],
      variety_text: [''],
      variety: ['', [Validators.required]],
      class_of_Seed: ['',[Validators.required]],
      year: ['',[Validators.required]],
      bspc_developing: [''],
      bspc_developing_text: [''],
      season: ['',[Validators.required]],
      quantity: [''],
      reference_of_moa: [''],
      date_of_moa: [''],
      reference_of_office: [''],
      is_developed: [1],
      date_of_office: [''],
      stage: ['',[Validators.required]],
      parentline_text: [''],
      parental_data: [''],
      total_quantity: [''],
      employees: this.fb.array([
        this.newEmployee()

      ])
    });
    this.ngForm.controls['class_of_Seed'].valueChanges.subscribe(item => {
      if (item) {
        if (!this.is_update) {
          const myFormArray = this.ngForm.get('employees') as FormArray;
          myFormArray.clear()
          this.ngForm.controls['quantity'].setValue('');
          this.employees().push(this.newEmployee());
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].quantity_available.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].lot_range.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].bag_size.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].no_of_bags.setValue('');
          this.ngForm.controls['employees']['controls'][0].controls['lot_name'].setValue('')
        }
        if (item == 6) {

          this.showwillingToProduce = true;
          this.disableQuantity = true;

          if (this.ngForm.controls['is_developed'].value == 1) {

            this.is_developed = false;
          } else {
            this.is_developed = true;
          }
        } else {
          this.showwillingToProduce = false;
          this.disableQuantity = false;
          // this.isShowTable = false;
          this.is_developed = false;
        }


        this.ngForm.controls['reference_of_moa'].setValue('');
        this.ngForm.controls['date_of_moa'].setValue('');
        this.ngForm.controls['stage'].setValue('');
        this.ngForm.controls['date_of_office'].setValue('');
        this.ngForm.controls['bspc_developing'].setValue('');
        this.ngForm.controls['reference_of_office'].setValue('');
      }
    })


    this.ngForm.controls['crop'].valueChanges.subscribe(item => {
      if (item) {
        this.getUnit(null);
        this.showSecondPortion = false;
        this.isSearch = false;
        this.ngForm.controls['variety'].setValue('')
        this.ngForm.controls['season'].setValue('');
        this.ngForm.controls['quantity'].setValue('');
        this.ngForm.controls['reference_of_moa'].setValue('');
        this.ngForm.controls['date_of_moa'].setValue('');
        this.ngForm.controls['date_of_office'].setValue('');
        this.ngForm.controls['bspc_developing'].setValue('');
        this.ngForm.controls['class_of_Seed'].setValue('');
        this.ngForm.controls['year'].setValue('');
        this.isShowTable = false;
        this.ngForm.controls['stage'].setValue('');
        this.ngForm.controls['is_developed'].setValue('');
        this.ngForm.controls['reference_of_office'].setValue('');
        this.ngForm.controls['parental_data'].setValue('');
        this.selectParentalLine='';
        this.showparental=false;
        this.saveVarietyList = []
        // reference_of_office
        if (!this.is_update) {

          this.is_developed = false;
          this.showSecondPortion = false;
          this.selectBspcDeveloping = false;
          this.ngForm.controls['quantity'].setValue('');
          this.showwillingToProduce = false;
          const myFormArray = this.ngForm.get('employees') as FormArray;
          myFormArray.clear()

          this.employees().push(this.newEmployee());
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].quantity_available.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].lot_range.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].bag_size.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].no_of_bags.setValue('');
          this.ngForm.controls['employees']['controls'][0].controls['lot_name'].setValue('')
        }


        this.selectVariety = ''

        this.getVariety(item)
      }
    })
    this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
      if (item) {
        this.cropList = this.croplistSecond
        let response = this.cropList.filter(x => x.crop_name.toLowerCase().includes(item.toLowerCase()))
        this.cropList = response
      }
      else {
        this.getCrop()
      }
    })
    this.ngForm.controls['bspc_text'].valueChanges.subscribe(item => {
      if (item) {
        this.bspcList = this.bspcListSecond
        let response = this.bspcList.filter(x => x.agency_name.toLowerCase().includes(item.toLowerCase()))
        this.bspcList = response;

      }
      else {
        this.getBspc()
      }
    })
    this.ngForm.controls['BSPC'].valueChanges.subscribe(item => {
      if (item) {
        this.showSecondPortion = false;
        this.isSearch = false;
        if (!this.is_update) {

          this.isShowTable = false;
          const myFormArray = this.ngForm.get('employees') as FormArray;

          this.ngForm.controls['quantity'].setValue('');
          myFormArray.clear()

          this.employees().push(this.newEmployee());
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].quantity_available.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].lot_range.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].bag_size.setValue('');
          this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].no_of_bags.setValue('');
          this.ngForm.controls['employees']['controls'][0].controls['lot_name'].setValue('');
        }

      }

    })
    this.ngForm.controls['bspc_developing_text'].valueChanges.subscribe(item => {
      if (item) {
        this.bspcList = this.bspcListSecond
        let response = this.bspcList.filter(x => x.agency_name.toLowerCase().includes(item.toLowerCase()))
        this.bspcList = response
      }
      else {
        this.getBspc()
      }
    })
    this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
      if (item) {
        this.varietyList = this.varietyListSecond
        let response = this.varietyList.filter(x => x.variety_name.toLowerCase().includes(item.toLowerCase()))
        this.varietyList = response
      }
      else {
        this.getVariety(this.ngForm.controls['crop'].value)
      }
    })
    this.ngForm.controls['variety'].valueChanges.subscribe(item => {
      if (item) {
        // if (!this.is_update) {

        // this.showSecondPortion = false;
        // this.is_developed = false;
        // this.showwillingToProduce = false;
        // this.isShowTable = false;
        const myFormArray = this.ngForm.get('employees') as FormArray;
        myFormArray.clear()
        this.ngForm.controls['quantity'].setValue('');
        this.employees().push(this.newEmployee());
        this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].quantity_available.setValue('');
        this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].lot_range.setValue('');
        this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].bag_size.setValue('');
        this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].no_of_bags.setValue('');
        this.ngForm.controls['employees']['controls'][0].controls['lot_name'].setValue('')
        // }
        this.ngForm.controls['stage'].setValue('');
        this.ngForm.controls['season'].setValue('');
        this.ngForm.controls['quantity'].setValue('');
        this.selectBspcDeveloping = '';
        this.ngForm.controls['reference_of_moa'].setValue('');
        this.ngForm.controls['date_of_moa'].setValue('');
        this.ngForm.controls['date_of_office'].setValue('');
        this.ngForm.controls['bspc_developing'].setValue('');
        this.ngForm.controls['class_of_Seed'].setValue('');
        this.ngForm.controls['year'].setValue('');
        this.ngForm.controls['stage'].setValue('');
        this.ngForm.controls['is_developed'].setValue(1);

        this.ngForm.controls['reference_of_office'].setValue('');
        this.saveVarietyList = [];
        this.is_update = false;


      }
    })



    // this.ngForm.disable();

  }

  ngOnInit(): void {
    this.fetchData();
    this.isDeveloped = true;
    this.isSearch = false;
    this.ngForm.controls['is_developed'].enable();
    // this.showValue()
    // this.showData()
    // this.employeeSkills(1).push(this.newSkill());
    // this.checkLotValueData();
    //   function extractRangeFromMultipleStrings(stringsArray) {
    //     let extractedValues = [];

    //     stringsArray.forEach(inputString => {
    //         let range = inputString.split("~");
    //         if (range.length === 2) {
    //             let prefix = range[0].replace(/[0-9]+$/, ''); // Extract prefix before numbers
    //             let start = parseInt(range[0].match(/\d+/)[0]);
    //             let end = parseInt(range[1]);

    //             if (!isNaN(start) && !isNaN(end)) {
    //                 for (let i = start; i <= end; i++) {
    //                     extractedValues.push(`${prefix}${i}`);
    //                 }
    //             }
    //         } else {
    //             extractedValues.push(inputString); // Push the original string if no '~' found
    //         }
    //     });

    //     return extractedValues;
    // }

    // let inputStrings = ["T001-A-1~100"," T001-B-01~100", "T001-C-5", "T001-C-15", "T001-C-52","aba/12-d.P:200~210"];
    // let extractedValues = extractRangeFromMultipleStrings(inputStrings);
    // console.log("Extracted Values:", extractedValues);

    //   function extractValuesFromStrings(stringsArray) {
    //     let extractedValues = [];

    //     stringsArray.forEach(inputString => {
    //         let range = inputString.split("~");
    //         if (range.length === 2) {
    //             let prefix = range[0].replace(/[0-9]+$/, ''); // Extract prefix before numbers
    //             let start = parseInt(range[0].match(/\d+/)[0]);
    //             let end = parseInt(range[1]);

    //             if (!isNaN(start) && !isNaN(end)) {
    //                 for (let i = start; i <= end; i++) {
    //                     extractedValues.push(`${prefix}${i}`);
    //                 }
    //             }
    //         } else {
    //             let singleValue = inputString.match(/[^\d]+/); // Extract non-numeric characters
    //             if (singleValue) {
    //                 extractedValues.push(singleValue[0].trim());
    //             }
    //         }
    //     });

    //     return extractedValues;
    // }

    // let inputStrings = ["T001-A-1~100"," T001-B-01~100", "T001-C-5", "T001-C-15", "T001-C-52"];
    // let extractedValues = extractValuesFromStrings(inputStrings);
    // console.log("Extracted Values:", extractedValues);


    // function extractValuesFromStrings(stringsArray) {
    //   let extractedValues = [];

    //   stringsArray.forEach(inputString => {
    //       let range = inputString.split("~");
    //       if (range.length === 2) {
    //           let prefix = range[0].replace(/~\d+$/, ''); // Extract prefix before numbers
    //           let start = parseInt(range[0].match(/\d+/)[0]);
    //           let end = parseInt(range[1]);

    //           if (!isNaN(start) && !isNaN(end)) {
    //               for (let i = start; i <= end; i++) {
    //                   extractedValues.push(`${prefix}${i}`);
    //               }
    //           }
    //       } else {
    //           let singleValue = inputString.match(/[^\d]+/); // Extract non-numeric characters
    //           if (singleValue) {
    //               extractedValues.push(singleValue[0].trim());
    //           }
    //       }
    //   });

    //   return extractedValues;
    // }

    // let inputStrings = [
    //   "T001-A-1~100",
    //   "T001-B-01~100",
    //   "T001-C-5",
    //   "T001-C-15",
    //   "T001-C-52",
    // ];

    // let extractedValues = extractValuesFromStrings(inputStrings);
    // console.log("Extracted Values:", extractedValues);

    // function extractValuesFromStrings(stringsArray) {
    //   let extractedValues = [];
    //   let stringsArraySecond = []
    //   if (stringsArray.includes(',')) {
    //     let split = stringsArray.split(',');
    //     stringsArraySecond = (split);
    //   }
    //   else {
    //     stringsArraySecond.push(stringsArray)
    //   }
    //   stringsArraySecond.forEach((inputString, i) => {

    //     if (inputString.includes("~")) {
    //       let rangeParts = inputString.split("~");
    //       let prefix = rangeParts[0].replace(/~\d+$/, ''); // Extract prefix before numbers
    //       let start = parseInt(rangeParts[0].match(/\d+/)[0]);
    //       let end = parseInt(rangeParts[1]);
    //       let starting = start.toString().length
    //       prefix = prefix.slice(0, -starting)
    //       if (!isNaN(start) && !isNaN(end)) {
    //         for (let i = start; i <= end; i++) {
    //           extractedValues.push(`${prefix}${i}`);
    //         }
    //       }
    //     } else {
    //       extractedValues.push(inputString); // Push the original value if no '~' found
    //     }
    //   });

    //   return extractedValues;
    // }

    // let inputStrings =
    //   "T001-A-1~100,mkn90~99,dff"


    // let extractedValues = extractValuesFromStrings(inputStrings);
    // // console.log("Extracted Values:", extractedValues);


  }
  // checkLotValueData(input) {
  calculateBag(e, emplIndex, skillIndex) {
    // if (this.ngForm.controls['employees']['controls'][emplIndex]['controls'].skills['controls'][skillIndex]['controls'].bag_size.value) {
    this.showData(e, emplIndex, skillIndex);
    // }
  }
  showData(value, emplIndex, skillIndex) {


    if (this.ngForm.controls['employees']['controls'][emplIndex]['controls'].skills['controls'][skillIndex]['controls'].lot_range.value) {
      function processString(stringsArray) {
        let extractedValues = [];
        let stringsArraySecond = []
        if (stringsArray.includes(',')) {
          let split = stringsArray.split(',');
          stringsArraySecond = (split);
          stringsArraySecond = stringsArraySecond.filter(Boolean);

        }
        else {
          stringsArraySecond.push(stringsArray)
        }
        stringsArraySecond = stringsArraySecond.filter(item => item.trim() !== '');
        stringsArraySecond.forEach((inputString, i) => {

          if (inputString.includes("~")) {
            let rangeParts = inputString.split("~");
            let prefix = rangeParts[0].replace(/~\d+$/, ''); // Extract prefix before numbers
            let start = parseInt(rangeParts[0].match(/\d+/)[0]);
            let end = parseInt(rangeParts[1]);
            // let startRange=
            let parts = rangeParts[0].split(/\D+/);

            // Get the last element which should be the number
            let first = parts[parts.length - 1];
            start = parseInt(first)
            let starting = start.toString().length
            let len = end - start
            prefix = prefix.slice(0, -starting)
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                extractedValues.push({ 'tag': prefix + i, 'total_bag': len });
              }
            }
          } else {
            extractedValues.push({ tag: inputString, total_bag: 1 }); // Push the original value if no '~' found
          }
        });

        return extractedValues;
      }
      this.ngForm.value.employees.forEach((el, h) => {
        el.skills.forEach((items, index) => {
          // this.ngForm.controls
          let res = processString(items.lot_range);
          this.ngForm.controls['employees']['controls'][h]['controls'].skills['controls'][index]['controls'].tag_details.setValue(res);
          items.tag_details = res

          // item.tag_details= res
        })
      });
      // emplIndex,skillIndex
      // if (emplIndex && skillIndex) {
      let tagValue = this.ngForm.controls['employees']['controls'][emplIndex]['controls'].skills['controls'][skillIndex]['controls'].tag_details && this.ngForm.controls['employees']['controls'][emplIndex]['controls'].skills['controls'][skillIndex]['controls'].tag_details.value ? this.ngForm.controls['employees']['controls'][emplIndex]['controls'].skills['controls'][skillIndex]['controls'].tag_details.value : '';
      this.ngForm.controls['employees']['controls'][emplIndex]['controls'].skills['controls'][skillIndex]['controls'].no_of_bags.setValue(tagValue ? tagValue.length : 0);
      // }
    }

  }

  formatQuantity(value: number): string {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return 'NA';
  }

  // Example usage:
  // let result1 = processString('T001-A-12');
  // let result2 = processString('T001-A-11~100');
  // let result2 = processString("aba/12-d.P:200~210");

  //, aba/12-d.P:200~210 
  // let result3 = processString('T001-A-1~100, T001-B-01~100, T001-C-5, T001-C-15, T001-C-52,aba/12-d.P:200~210');

  // console.log(result1);
  // console.log(result2);
  // console.log(result3);
  // }

  showValue() {
    function processCode(code) {
      if (code.includes('~')) {
        for (let i = 0; i < code.length; i++) {
          if (code.includes('~')) {
            let output = []
            let split = code.split('~');
            let lastNum = split ? split[1] : '';
            let firstSplit = split ? split[0] : '';
            let parts = firstSplit.split(/\D+/);

            // Get the last element which should be the number
            let first = parts[parts.length - 1];
            let prefix = firstSplit.slice(0, -first.toString().length)
            let totalBag = parseInt(lastNum) - parseInt(first)
            let startRange = first ? parseInt(first) : '';
            let endrange = lastNum ? parseInt(lastNum) : '';
            if (startRange && endrange) {

              for (let i = parseInt(first); i <= parseInt(lastNum); i++) {
                output.push({ tag: prefix + i, total_bag: totalBag })
              }
            } else {
              output.push({ tag: code, total_bag: 1 })
            }

            return output

          }
          else {
            let output = [];
            output.push({ tag: code, total_bag: 1 })
            return output
          }
        }
      }
      else {
        let output = []
        output.push({ tag: code, total_bag: 1 })
        return output
      }


    }
    let result3 = processCode('T001-A-1~100, T001-B-01~100, T001-C-5, T001-C-15, T001-C-52,aba/12-d.P:200~210');

  }





  updateFormTag(outPut, i, index) {
    let arr = []
    arr.push(outPut)

  }




  fetchData() {
    // this.getYearData();
    // this.getPageData();
    this.getBspc();
    this.getCrop();
    this.getStageData();
    this.getSeedClassData()
    let date = new Date();
    let currentYear = date.getFullYear();
    console.log(currentYear, 'currentYear')
    for (let i = 0; i < 5; i++) {
      this.inventoryYearData.push({ year: currentYear - i });
    }
    // this.inventoryYearData ;
    // this.getVariety();
    this.dropdownSettings = {
      idField: 'variety_id',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      itemsShowLimit: 2,
      limitSelection: -1,
    };

  }





  getCropData() {
    const route = "get-crop-assign-indenter-data";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryCropData = data.EncryptedResponse.data
      }
    })
  }

  getVarietyData() {
    const route = "get-assign-indenter-variety-data";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = data.EncryptedResponse.data
      }
    })
  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    this.isSearch = false;
    this.varietyDisbled = false;
    let varietyCodeArr = [];

    this.masterService.postRequestCreator("getseedInventory", null, {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      // pageSize: 50,
      search: {
        bspc_id: this.ngForm.controls['BSPC'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        parental_data: this.showparental ? this.ngForm.controls["parental_data"].value : '',
        showparental: this.showparental ? this.showparental : ''
        // idARR:this.ids ?this.ids:''
        // user_id: this.userId.id
      }
    }).subscribe((apiResponse: any) => {

      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        // this.filterPaginateSearch.itemListPageSize = 4;
        this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data ? apiResponse.EncryptedResponse.data.data : '';
        let queryData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.queryData ? apiResponse.EncryptedResponse.data.queryData : '';
        if (queryData) {
          if (queryData.length > 0) {
            queryData = queryData.filter(item => item.length > 0);
            queryData= queryData ? queryData.flat():''
          }
        }
        if (this.allData && this.allData.length > 0) {
          if (queryData && queryData) {
            this.allData.forEach(obj1 => {
              queryData.forEach(obj2 => {
                if (obj1.line_variety_code) {
                  if (obj1.variety_code === obj2.variety_code && obj1.line_variety_code === obj2.line_variety_code) {
                    obj1.line_variety_name = obj2.line_variety_name;
                  }
                }
              });
            });
          }
        }

        if(this.allData && this.allData.length>0){
          if(queryData && queryData){
            this.allData.forEach(obj1 => {
              queryData.forEach(obj2 => {
                if(obj1.line_variety_code){
                  if (obj1.variety_code === obj2.variety_code && obj1.line_variety_code === obj2.line_variety_code) {
                      obj1.line_variety_name = obj2.line_variety_name;
                  }
                }
              });
          });
          }
        }
        this.is_update = false;
        if (this.allData === undefined) {
          this.allData = [];
        }
        if (this.allData && this.allData.length > 0) {
          this.allData.forEach((el, i) => {
            let sum = 0;
            el.allDataArr = []
            // el.tag_detail_data_length= el.tag_detail_data.length
          })
          this.allData.forEach((el, i) => {
            el.seedDetails.forEach((item, index) => {
              el.allDataArr.push(...item.tag_detail_data)
            })
            // el.tag_detail_data_length= el.tag_detail_data.length
          })
          let singleArray
          this.allData.forEach((el, i) => {
            el.totalArrlength = el.allDataArr.length
            el.seedDetails.forEach((item, index) => {
              item.tagdetaildatatotal = item.tag_detail_data.length;
              let sum = 0
              item.tag_detail_data.forEach((els, j) => {
                sum += els && els.quantity ? els.quantity : 0,
                  item.totalQty = sum
              })
            })

          })
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);
        if(this.allData && this.allData.length>0){
          this.allData.forEach((el)=>{
            el.seedDetails.forEach((item)=>{
              let sum =0
              item.tag_detail_data.forEach((val)=>{
                sum+=Number(val.quantity_remaining);
                item.totalQuantityLeft= sum;
              })
            })
          })
        }

        // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });
    // }
  }

  notifiedvalue(value) {
    let item = 0
    this.ngForm.controls['bspc_developing'].setValue('', { emitEvent: false })
    this.ngForm.controls['reference_of_moa'].setValue('');
    this.ngForm.controls['date_of_moa'].setValue('');
    this.ngForm.controls['reference_of_office'].setValue('');
    this.ngForm.controls['date_of_office'].setValue('');

    if (value == "yes") {
      this.is_developed = false;
      item = 1
    } else {
      this.is_developed = true;
      item = 0
    }
    this.ngForm.controls['is_developed'].setValue(value == "yes" ? 1 : 0)
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }





  saveForm() {

    if ((!this.ngForm.controls["crop"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["variety"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Variety.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["BSPC"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["quantity"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Quantity Can not be blank.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    const param = this.ngForm.value;
    param.is_hybrid = this.showparental ? 1 : 0;
    let lot_details = []
    let data;
    if (param && param.employees && param.employees.length > 0) {
      param.employees.forEach((el, i) => {
        el.skills.forEach((item, x) => {
          lot_details.push({ ...item.tag_details, 'lot_range': item.lot_range, 'lot_name': el.lot_name, 'bag_size': item.bag_size })
          data = lot_details ? lot_details.flat() : ''

          // this.ngForm.value['lot_details'] = lot_deteails ? lot_details.flat() : ''
        })
      })
    }
    // lot_name':el.lot_name;
    let transformedArray
    if (data && data.length > 0) {
      transformedArray = data.map((element) => {
        const newObj = {};
        Object.keys(element).forEach((key) => {
          if (key !== "lot_range" && key !== "lot_name" && key !== 'bag_size') {
            newObj[key] = {
              ...element[key],
              "lot_range": element["lot_range"],
              "lot_name": element['lot_name'],
              "bag_size": element['bag_size']
            };
          }
        });
        return newObj;
      });
    }
    const transformedArrays = transformedArray.flatMap((element) => {
      const newArray = Object.values(element);
      return newArray;
    });
    this.ngForm.value['lot_details'] = transformedArrays ? transformedArrays : ''

    function calculateSumByIdAndCondition(items) {
      const sumByIdAndCondition = [];

      items.forEach(item => {
        const key = `${item.lot_name}-${item.lot_range}`;

        if (!sumByIdAndCondition[key]) {
          sumByIdAndCondition[key] = { lot_name: item.lot_name, lot_range: item.lot_range, sum: 0 };
        }

        sumByIdAndCondition[key].sum += item.bag_size;
      });

      return Object.values(sumByIdAndCondition);
    }
    const sumByIdAndConditionJSON = calculateSumByIdAndCondition(transformedArrays);
    if (transformedArrays && transformedArrays.length > 0) {
    }
    let datas = param && param.employees ? param.employees : '';
    if (datas && datas.length > 0) {

      datas.forEach((el, index) => {

        el.skills = el.skills.map(item1 => {
          const matchingItem = sumByIdAndConditionJSON.find(item2 => item2.lot_name === el.lot_name && item2.lot_range == item1.lot_range);
          return { ...item1, ...matchingItem };
        })
      })
    }

    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let localdatas = JSON.parse(getLocalData)
    let UserId = localdatas.id
    param.year = this.ngForm.controls['year'].value ? this.ngForm.controls['year'].value : null;
    this.ngForm.controls['bspc_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['parentline_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false });
    this.isShowTable = true;
    param.user_id = UserId
    param.showHybrid = this.showparental ? this.showparental : ''
    param.date_of_moa = this.ngForm.controls['date_of_moa'].value && this.ngForm.controls['date_of_moa'].value.singleDate && this.ngForm.controls['date_of_moa'].value.singleDate.formatted ? this.convertDates(this.ngForm.controls['date_of_moa'].value.singleDate.formatted) : '';
    param.date_of_office = this.ngForm.controls['date_of_office'].value && this.ngForm.controls['date_of_office'].value.singleDate && this.ngForm.controls['date_of_office'].value.singleDate.formatted ? this.convertDates(this.ngForm.controls['date_of_office'].value.singleDate.formatted) : ''
    this.masterService.postRequestCreator('addSeedInventory', null, param).subscribe(data => {
      // console.log(data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire(
          {
            icon: 'success',
            title: 'Data Saved Successfully',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonColor: '#B64B1D'
          }
        ).then(x => {
          if (x.isConfirmed) {
            this.is_developed = false;
            // this.showSecondPortion = false;

            // this.ngForm.controls['season'].setValue('');
            // this.ngForm.controls['variety'].setValue('')
            // this.selectVariety='';
            this.ngForm.controls['season'].setValue('');
            this.ngForm.controls['quantity'].setValue('');
            this.ngForm.controls['reference_of_moa'].setValue('');
            this.ngForm.controls['date_of_moa'].setValue('');
            this.ngForm.controls['date_of_office'].setValue('');
            this.ngForm.controls['bspc_developing'].setValue('');
            this.ngForm.controls['class_of_Seed'].setValue('');
            this.ngForm.controls['year'].setValue('');
            this.ngForm.controls['is_developed'].setValue(1);

            // this.allData.push(data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '')
            // this.allData = this.allData ? this.allData.flat() :''
            // this.allData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
            this.ngForm.controls['reference_of_office'].setValue('');
            this.showwillingToProduce = false
            this.ngForm.controls['stage'].setValue('');

            this.getData()

          }

        })
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 400) {
        Swal.fire(
          {
            icon: 'error',
            title: 'Data Already Filled',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonColor: '#B64B1D'
          }
        )
      }
      else {
        Swal.fire(
          {
            icon: 'error',
            title: 'Something Went Wrong',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonColor: '#B64B1D'
          }
        )
      }
    })
  }

  updateForm() {

    let param = this.ngForm.value;

    param.bspId = this.getIdofrecord
    // param.tag_id=
    let lot_details = []
    // if (param && param.employees && param.employees.length > 0) {
    //   param.employees.forEach((el, i) => {
    //     el.skills.forEach((item, x) => {
    //       lot_details.push(item.tag_details)
    //       this.ngForm.value['lot_details'] = lot_details ? lot_details.flat() : ''
    //       param.lot_details = lot_details ? lot_details.flat() : '';
    //     })
    //   })
    // }
    function processString(stringsArray) {
      let extractedValues = [];
      let stringsArraySecond = []
      if (stringsArray.includes(',')) {
        let split = stringsArray.split(',');
        stringsArraySecond = (split);
      }
      else {
        stringsArraySecond.push(stringsArray)
      }
      stringsArraySecond.forEach((inputString, i) => {

        if (inputString.includes("~")) {
          let rangeParts = inputString.split("~");
          let prefix = rangeParts[0].replace(/~\d+$/, ''); // Extract prefix before numbers
          let start = parseInt(rangeParts[0].match(/\d+/)[0]);
          let end = parseInt(rangeParts[1]);
          // let startRange=
          let parts = rangeParts[0].split(/\D+/);

          // Get the last element which should be the number
          let first = parts[parts.length - 1];
          start = parseInt(first)
          let starting = start.toString().length
          let len = end - start
          prefix = prefix.slice(0, -starting)
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              extractedValues.push({ 'tag': prefix + i, 'total_bag': len });
            }
          }
        } else {
          extractedValues.push({ tag: inputString, total_bag: 1 }); // Push the original value if no '~' found
        }
      });

      return extractedValues;
    }
    this.ngForm.value.employees.forEach((el, h) => {
      el.skills.forEach((items, index) => {
        // this.ngForm.controls
        let res = processString(items.lot_range);
        this.ngForm.controls['employees']['controls'][h]['controls'].skills['controls'][index]['controls'].tag_details.setValue(res);
        items.tag_details = res

        // item.tag_details= res
      })
    });
    let data;
    if (param && param.employees && param.employees.length > 0) {
      param.employees.forEach((el, i) => {
        el.skills.forEach((item, x) => {
          lot_details.push({ ...item.tag_details, 'lot_range': item.lot_range, 'lot_name': el.lot_name, 'bag_size': item.bag_size })
          data = lot_details ? lot_details.flat() : ''

          // this.ngForm.value['lot_details'] = lot_deteails ? lot_details.flat() : ''
        })
      })
    }
    let transformedArray
    if (data && data.length > 0) {
      transformedArray = data.map((element) => {
        const newObj = {};
        Object.keys(element).forEach((key) => {
          if (key !== "lot_range" && key !== "lot_name" && key !== 'bag_size') {
            newObj[key] = {
              ...element[key],
              "lot_range": element["lot_range"],
              "lot_name": element['lot_name'],
              "bag_size": element['bag_size']

            };
          }
        });
        return newObj;
      });
    }
    const transformedArrays = transformedArray.flatMap((element) => {
      const newArray = Object.values(element);
      return newArray;
    });
    param['lot_details'] = transformedArrays ? transformedArrays : '';

    param['seedTagDetailsId'] = this.seedTagDetailsId;

    function calculateSumByIdAndCondition(items) {
      const sumByIdAndCondition = [];

      items.forEach(item => {
        const key = `${item.lot_name}-${item.lot_range}`;

        if (!sumByIdAndCondition[key]) {
          sumByIdAndCondition[key] = { lot_name: item.lot_name, lot_range: item.lot_range, sum: 0 };
        }

        sumByIdAndCondition[key].sum += item.bag_size;
      });

      return Object.values(sumByIdAndCondition);
    }
    const sumByIdAndConditionJSON = calculateSumByIdAndCondition(transformedArrays);
    if (transformedArrays && transformedArrays.length > 0) {
    }
    let datas = param && param.employees ? param.employees : '';
    if (datas && datas.length > 0) {

      datas.forEach((el, index) => {

        el.skills = el.skills.map(item1 => {
          const matchingItem = sumByIdAndConditionJSON.find(item2 => item2.lot_name === el.lot_name && item2.lot_range == item1.lot_range);
          return { ...item1, ...matchingItem };
        })
      })
    }

    param.quantity = this.ngForm.controls['quantity'].value ? this.ngForm.controls['quantity'].value : 0;
    param.parental_data = this.ngForm.controls['parental_data'].value ? this.ngForm.controls['parental_data'].value : '';
    param.is_hybrid = this.showparental ? 1 : 0;
    this.ngForm.controls['bspc_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['parentline_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false });
    param.date_of_moa = this.ngForm.controls['date_of_moa'].value && this.ngForm.controls['date_of_moa'].value.singleDate && this.ngForm.controls['date_of_moa'].value.singleDate.formatted && (this.ngForm.controls['date_of_moa'].value.singleDate.formatted != '') && this.ngForm.controls['date_of_moa'].value.singleDate.jsDate && (this.ngForm.controls['date_of_moa'].value.singleDate.jsDate != '') ? (this.ngForm.controls['date_of_moa'].value.singleDate.jsDate).toISOString().slice(0, 10) : '';
    param.date_of_office = this.ngForm.controls['date_of_office'].value && this.ngForm.controls['date_of_office'].value.singleDate && this.ngForm.controls['date_of_office'].value.formatted && (this.ngForm.controls['date_of_office'].value.formatted != '') && this.ngForm.controls['date_of_office'].value.singleDate.jsDate && (this.ngForm.controls['date_of_office'].value.singleDate.jsDate != '') ? (this.ngForm.controls['date_of_office'].value.singleDate.jsDate).toISOString().slice(0, 10) : ''
    param.tag_id = this.tagId;
    this.showLotPage = false;
    this.is_developed = false
    this.isShowTable = true;
    this.disableUpperSection = false;
    this.masterService.postRequestCreator('UpdateSeedInventory', null, param).subscribe(data => {
      // console.log(data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire(
          {
            icon: 'success',
            title: 'Data Updated Successfully',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonColor: '#B64B1D'
          }
        ).then(x => {
          if (x.isConfirmed) {

            // this.is_developed = false;
            this.showSecondPortion = true;
            this.is_update = false;
            // this.selectVariety = '';

            // this.ngForm.controls['variety'].setValue('')
            this.ngForm.controls['season'].setValue('');
            this.ngForm.controls['quantity'].setValue('');
            this.ngForm.controls['reference_of_moa'].setValue('');
            this.ngForm.controls['date_of_moa'].setValue('');
            this.ngForm.controls['date_of_office'].setValue('');
            this.ngForm.controls['bspc_developing'].setValue('');
            this.ngForm.controls['class_of_Seed'].setValue('');
            this.ngForm.controls['year'].setValue('');
            this.ngForm.controls['total_quantity'].setValue('')
            // this.ngForm.controls['is_developed'].setValue(1);
            this.ngForm.controls['stage'].setValue('');
            this.ngForm.controls['total_quantity'].setValue('')
            this.ngForm.controls['reference_of_office'].setValue('');
            this.showwillingToProduce = false;
            this.getData()


          }

        })
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 400) {
        Swal.fire(
          {
            icon: 'error',
            title: 'Data Already Filled',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonColor: '#B64B1D'
          }
        )
      }
      else {
        Swal.fire(
          {
            icon: 'error',
            title: 'Something Went Wrong',
            showConfirmButton: true,
            confirmButtonColor: '#B64B1D',
            showCancelButton: false,
          }
        )
      }
    })
  }

  finalSubmit() {
  }
  getBspc() {
    this.masterService.postRequestCreator('getBspcforseedInventory', null).subscribe(value => {
      this.bspcList = value && value.EncryptedResponse && value.EncryptedResponse.data ? value.EncryptedResponse.data : ''
      this.bspcListSecond = this.bspcList;
    })
  }
  getCrop() {
    this.masterService.postRequestCreator('getCropforseedInventory', null).subscribe(value => {
      this.cropList = value && value.EncryptedResponse && value.EncryptedResponse.data ? value.EncryptedResponse.data : ''
      this.croplistSecond = this.cropList
    })
  }
  getVariety(newValue) {
    const param = {
      search: {
        crop_code: newValue
      }
    }
    this.masterService.postRequestCreator('getVarietyforseedInventory', null, param).subscribe(value => {
      this.varietyList = value && value.EncryptedResponse && value.EncryptedResponse.data ? value.EncryptedResponse.data : ''
      this.varietyListSecond = this.varietyList
    })
  }

  cropGroup(item: any) {
    this.selectBspc = item && item.agency_name ? item.agency_name : '';
    this.ngForm.controls['bspc_text'].setValue('', { emitEvent: false })
    this.bspcList = this.bspcListSecond;
    this.ngForm.controls['BSPC'].setValue(item && item.id ? item.id : '')
  }

  cgClick() {
    document.getElementById('crop_group').click();
  }
  cdClick() {
    document.getElementById('bspcdeveloping').click();
  }

  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropList = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }
  cClick() {
    document.getElementById('crop').click();
  }
  variety(item: any) {
    this.selectedVariety = true;
    this.selectVariety = item && item.variety_name ? item.variety_name : '',
      this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.selectParentalLine = '';
    this.ngForm.controls['parental_data'].setValue('')
    this.varietyList = this.varietyListSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    if (item && item.status && item.status == 'hybrid') {
      this.showparental = true;
      this.getparentalData()
    }
    else {
      this.showparental = false;
      this.parentalList = []

    }

  }
  getparentalData() {
    const param = {
      search: {
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,


      }
    }
    this.masterService.postRequestCreator('get-parental-data', null, param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.parentalList = response ? response : '';
        if (this.is_update) {
          if (this.parentalList && this.parentalList.length > 0) {
            let res = this.parentalList.filter(x => x.line_variety_code == this.ngForm.controls['parental_data'].value)
            this.selectParentalLine = (res && res[0] && res[0].line_variety_name ? res[0].line_variety_name : '')
          }

        }

      }
    })
  }
  parent(item) {
    this.selectParentalLine = item && item.line_variety_name ? item.line_variety_name : '';
    this.ngForm.controls['parental_data'].setValue(item && item.line_variety_code ? item.line_variety_code : '')
    // parental_data

  }

  developing(item: any) {
    this.selectBspcDeveloping = item && item.agency_name ? item.agency_name : '',
      this.ngForm.controls['bspc_developing_text'].setValue('', { emitEvent: false })
    this.ngForm.controls['bspc_developing'].setValue(item && item.id ? item.id : '')
  }
  vClick() {
    document.getElementById('variety_name').click();
  }
  pClick() {
    document.getElementById('parental').click();
  }
  dClick() {
    document.getElementById('bspcdeveloping').click();
  }

  getData() {

    if ((!this.ngForm.controls["BSPC"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select BSPC.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["crop"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if (this.showparental) {
      if ((!this.ngForm.controls["parental_data"].value
      )) {

        Swal.fire({
          title: '<p style="font-size:25px;">Please Select Parental Line.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        return;
      }
    }

    //  this.showData(null)
    const param = {
      search: {
        bspc_id: this.ngForm.controls['BSPC'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        parental_data: this.showparental ? this.ngForm.controls["parental_data"].value : ''
      }
    }
    this.showSecondPortion = true;
    this.isShowTable = true
    this.ngForm.controls['season'].setValue('');
    this.ngForm.controls['quantity'].setValue('');
    this.ngForm.controls['reference_of_moa'].setValue('');
    this.ngForm.controls['date_of_moa'].setValue('');
    this.ngForm.controls['date_of_office'].setValue('');
    this.ngForm.controls['bspc_developing'].setValue('');
    this.ngForm.controls['class_of_Seed'].setValue('');
    this.ngForm.controls['year'].setValue('');
    this.ngForm.controls['total_quantity'].setValue('')

    // this.ngForm.controls['is_developed'].setValue(1);


    this.ngForm.controls['stage'].setValue('');
    this.ngForm.controls['total_quantity'].setValue('')
    this.ngForm.controls['reference_of_office'].setValue('');
    this.isSearch = true;
    this.is_update = false;
    let ids = []
    this.getparentalData();
    this.getPageData()

  }
  editData(id,getresponseData) {
    console.log(id,'tagdetaildatatotal')
    this.responseData=getresponseData
    this.is_update = true;
    // this.showSecondPortion = true;
    // this.showThirdPortion = true;
    // this.showLotPage = true
    const param = {
      search: {
        id: id
        // user_id: this.userId.id
      }
    }
    this.setid = id;
    this.getLotPage(id);
    this.masterService.postRequestCreator("getseedInventorybyid", null, param).subscribe(item => {
      let value = item && item.EncryptedResponse && item.EncryptedResponse.data ? item.EncryptedResponse.data : '';
      let data = value && value[0] ? value[0] : ''
      this.getIdofrecord = data && data.id ? data.id : ''
      this.ngForm.controls['BSPC'].setValue(data && data.bspc_id ? data.bspc_id : '');
      this.ngForm.controls['crop'].setValue(data && data.crop_code ? data.crop_code : '');
      this.ngForm.controls['variety'].setValue(data && data.variety_code ? data.variety_code : '', { emitEvent: false });
      this.ngForm.controls['year'].setValue(data && data.year ? data.year : '');
      this.ngForm.controls['quantity'].setValue(data && data.quantity ? parseFloat(data.quantity) : '');
      this.ngForm.controls['bspc_developing'].setValue(data && data.developed_bspc_id ? item.developed_bspc_id : '')
      this.ngForm.controls['parental_data'].setValue(data && data.line_variety_code ? data.line_variety_code : '');
      this.ngForm.controls['bspc_text'].setValue('', { emitEvent: false });
      this.ngForm.controls['parentline_text'].setValue('', { emitEvent: false });
      this.ngForm.controls['crop_text'].setValue('', { emitEvent: false });
      this.ngForm.controls['variety_text'].setValue('', { emitEvent: false });
      if (data && data.is_hybrid && data.is_hybrid == 1) {
        this.showparental = true;
        this.getparentalData()
      } else {
        this.showparental = false
      }
      this.getbspcDeveloping(data && data.developed_bspc_id ? data.developed_bspc_id : '')

      this.ngForm.controls['season'].setValue(data && data.season ? data.season : '');
      this.ngForm.controls['class_of_Seed'].setValue(data && data.seed_class_id ? data.seed_class_id : '');
      this.ngForm.controls['stage'].setValue(data && data.stage_id ? data.stage_id : '');
      this.ngForm.controls['reference_of_moa'].setValue(data && data.moa_number ? data.moa_number : '');
      this.ngForm.controls['is_developed'].setValue(data && data.developed_by_bspc ? data.developed_by_bspc : '');
      // this.ngForm.controls['date_of_moa'].setValue(data && data.moa_date ? data.moa_date :'');
      if (this.ngForm.controls['class_of_Seed'].value == 6) {
        this.showwillingToProduce = true
        if (this.ngForm.controls['is_developed'].value == 1) {
          this.is_developed = false;
        } else {
          this.is_developed = true;
        }

      } else {
        this.showwillingToProduce = false;
      }
      this.ngForm.controls['date_of_moa'].patchValue({
        dateRange: null,
        isRange: false,
        singleDate: {
          formatted: data && data.moa_date ? data.moa_date : '',
          jsDate: new Date(data && data.moa_date ? data.moa_date : '')
        }
      });
      this.ngForm.controls['date_of_office'].patchValue({
        dateRange: null,
        isRange: false,
        singleDate: {
          formatted: data && data.officer_order_date ? data.officer_order_date : '',
          jsDate: new Date(data && data.officer_order_date ? data.officer_order_date : '')
        }
      });
      this.ngForm.controls['reference_of_office'].setValue(data && data.reference_number ? data.reference_number : '');
      // this.ngForm.controls['date_of_office'].setValue(data && data.officer_order_date ? data.officer_order_date :'');
      this.showThirdPortion = true;
      this.showthirdPortionData = true
      this.showSecondPortion = true
      // if (data && data.seed_class_id && data.seed_class_id == 6) {
      //   this.showwillingToProduce = true;
      // } else {
      //   this.showwillingToProduce = false;
      // }
      // // this.is_developed = true
      // if (data && data.developed_by_bspc && data.developed_by_bspc == 1) {
      //   this.is_developed = false;

      // } else {
      //   if (!this.is_update) {

      //     this.is_developed = true;
      //   }
      // }
      this.isShowTable = true;
      // showthirdPortionData
      this.selectBspc = data && data.agency_detail && data.agency_detail.agency_name ? data.agency_detail.agency_name : 'NA'
      this.selectCrop = data && data.m_crop && data.m_crop.crop_name ? data.m_crop.crop_name : 'NA'
      this.selectVariety = data && data.m_crop_variety && data.m_crop_variety.variety_name ? data.m_crop_variety.variety_name : 'NA'
    })
    // this.getLotPage(id)
  }

  getClassofSeed(item) {
    let data = this.classSeedlist.filter(x => x.id == item)
    return data && data[0] && data[0].type ? data[0].type : 'NA'
  }
  getbspcDeveloping(item) {
    let data = this.bspcList.filter(x => x.id == item)
    this.selectBspcDeveloping = data && data[0] && data[0].agency_name ? data[0].agency_name : '';
    return data && data[0] && data[0].agency_name ? data[0].agency_name : 'NA';
  }
  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  revertDataCancelation() {
    this.is_developed = false;
    // this.showSecondPortion = false;
    this.is_update = false
    // this.selectVariety = '';
    // this.selectCrop = '';
    this.showwillingToProduce = false
    // this.selectBspc = ''
    // this.varietyList = []
    // if(this.edit)
    this.isShowTable = true;
    // this.ngForm.controls['variety'].setValue('')
    // this.selectVariety = ''
    this.ngForm.controls['season'].setValue('');
    this.ngForm.controls['quantity'].setValue('');
    this.ngForm.controls['total_quantity'].setValue('');
    this.ngForm.controls['reference_of_moa'].setValue('');
    this.ngForm.controls['date_of_moa'].setValue('');
    this.ngForm.controls['date_of_office'].setValue('');
    this.ngForm.controls['bspc_developing'].setValue('');
    this.ngForm.controls['class_of_Seed'].setValue('');
    this.ngForm.controls['year'].setValue('');
    this.ngForm.controls['is_developed'].setValue(1);
    this.ngForm.controls['reference_of_office'].setValue('');
    this.ngForm.controls['stage'].setValue('');
    // this.ngForm.controls['crop'].setValue('');
    // this.ngForm.controls['BSPC'].setValue('');

  }
  delete(id) {
    this.ngForm.controls['bspc_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['parentline_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false });
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false });
    const param = {
      'search': {
        id: id
      }
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {

        this.masterService
          .postRequestCreator("deleteseedInventorybyid", null, param)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your data has been deleted.",
                icon: "success"
              }).then(x => {
                this.showwillingToProduce = false
                this.getData()
                // location.reload()
              })
              // this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });

      }
    })
  }
  getVarietyListofSaved() {
    const param = {
      search: {
        bspc_id: this.ngForm.controls['BSPC'].value,
        crop_code: this.ngForm.controls['crop'].value,
        year: this.ngForm.controls['year'].value,
        variety_code: this.ngForm.controls['variety'].value,
        season: this.ngForm.controls['season'].value
      }
    }
    this.masterService.postRequestCreator('getVarietyDataOfSeedInventory', null, null).subscribe(data => {
      this.saveVarietyList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''

    })
  }
  getStageData() {
    this.masterService.postRequestCreator('getStageData', null).subscribe(item => {
      this.stagelist = item && item.EncryptedResponse && item.EncryptedResponse.data ? item.EncryptedResponse.data : 'Na'
    })
  }

  showSeason(item) {
    return item && (item == 'R') ? 'Rabi' : (item == 'K') ? 'Kharif' : 'NA'

  }
  getAllData(id) {
    const param = {
      bspId: id
    }
    this.masterService.postRequestCreator('get-indventory-data', null, param).subscribe(data => {
      this.allData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })

  }
  preventKeyPress(event) {
    event.preventDefault();
  }
  onDateChanged(event: any): void {

  }
  myDpOptions1: IAngularMyDpOptions = {

    dateRange: false,
    dateFormat: 'dd-mm-yyyy',

  };
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  get generateDefaultMonth(): string {
    let date = { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }

    //consolelog(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }
  convertDate(item) {
    const date = new Date(item);
    // let year =
    let split = item ? item.split('-') : ''

    // Get the individual parts of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Format the date in yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }
  convertDates(item) {
    const date = new Date(item);
    // let year =
    let split = item ? item.split('-') : ''
    let year = split && split[2] ? split[2] : ''
    let month = split && split[1] ? split[1] : ''
    let day = split && split[0] ? split[0] : ''
    // Get the individual parts of the date
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    // const day = String(date.getDate()).padStart(2, '0');

    // Format the date in yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }
  getSeedClassData() {
    this.masterService.postRequestCreator('get-seed-class', null).subscribe(data => {
      this.classSeedlist = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
    })
  }
  togenerateValue() {
    if ((!this.ngForm.controls["class_of_Seed"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Class of Seed.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["stage"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Stage.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
   
    if ((!this.ngForm.controls["year"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Year of Production.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
  
    if ((!this.ngForm.controls["season"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    this.showLotPage = true;
    this.showSecondPortion = false;
    this.disableUpperSection = true
    // if(this.sh)
    if (this.is_update) {

      // this.getLotPage(this.setid)
    }
  

  }

  newEmployee(): FormGroup {
    return this.fb.group({
      lot_name: ['', [Validators.required]],
      showstatus: [false],
      // lot_range:[''],
      // bag_size:[''],
      // no_of_bags:[''],
      // quantity_available:[''],
      skills: this.fb.array([
        // this.newSkill()
        this.newSkill()
      ])
    });
  }


  employees() {
    return this.ngForm.get('employees') as FormArray;
  }
  get itemsArray() {
    return <FormArray>this.ngForm.get('employees');
  }
  get itemsArrays() {
    return <FormArray>this.ngForm.controls['employees']['controls'][0].controls.skills;
  }
  employeeSkills(empIndex) {
    empIndex = empIndex ? empIndex : 0
    return this.employees()
      .at(empIndex)
      .get('skills') as FormArray;

  }


  newSkill() {
    return this.fb.group({
      // lot_name: [''],
      lot_range: ['', [Validators.required]],
      bag_size: ['', [Validators.required]],
      no_of_bags: ['', [Validators.required]],
      quantity_available: ['', [Validators.required]],
      tag_details: [],
      showStatus: [true]
    });
  }
  addEmployee() {
    this.employees().push(this.newEmployee());
  }

  removeEmployee(empIndex: number) {
    this.employees().removeAt(empIndex);
    let data = this.ngForm.value && this.ngForm.value.employees ? this.ngForm.value.employees : '';

    let totalQty;
    let sum = 0;
    if (data && data.length > 0) {
      data.forEach(el => {
        el.skills.forEach(item => {
          sum += item && item.quantity_available ? parseFloat(item.quantity_available) : 0;

          totalQty = sum;
        })
      })
    }
    totalQty = totalQty ? parseFloat(totalQty) : 0
    this.ngForm.controls['total_quantity'].setValue((totalQty > 0) ? ((parseFloat(totalQty)).toFixed(2)) : 0)

    this.ngForm.controls['quantity'].setValue((totalQty > 0) ? (((parseFloat(totalQty)) / 100).toFixed(2)) : 0)
  }
  addEmployeeSkill(empIndex: number) {
    let data = this.ngForm.value && this.ngForm.value.employees ? this.ngForm.value.employees : '';
    if (data && data.length > 0) {

    }
    this.employeeSkills(empIndex).push(this.newSkill());
  }
  addEmployeeSkills(empIndex: number, skillIndex) {


    // this.ngForm.controls['employees']['controls'][empIndex]['controls'].skills['controls'][skillIndex]['controls'].showStatus.setValue(true)
    this.employeeSkills(empIndex).push(this.newSkill());
  }
  removeEmployeeSkill(empIndex: number, skillIndex: number) {

    if (this.employeeSkills(empIndex).controls.length - 1 == 0) {

    }
    let data = this.ngForm.value && this.ngForm.value.employees ? this.ngForm.value.employees : '';
    let totalQty;
    let sum = 0;
    if (data && data.length > 0) {
      data.forEach((el, i) => {
        el.skills.forEach((item, index) => {

          sum += item && item.quantity_available ? parseFloat(item.quantity_available) : 0;

          totalQty = sum;
        })
      })
    }
    if (this.ngForm.controls['employees']['controls'][empIndex]['controls'].skills['controls'].length - 1 == 0) {
      this.employees().removeAt(empIndex);

    } else {

      this.employeeSkills(empIndex).removeAt(skillIndex);
    }
    totalQty = totalQty ? parseFloat(totalQty) : 0;

    this.ngForm.controls['total_quantity'].setValue((totalQty > 0) ? (((parseFloat(totalQty))).toFixed(2)) : 0)
    this.ngForm.controls['quantity'].setValue((totalQty > 0) ? (((parseFloat(totalQty)) / 100).toFixed(2)) : 0)
  }

  calculatebagsAndQuantity($event, index, empIndex) {
    let result2;
    if (this.ngForm.controls['employees']['controls'][empIndex]['controls'].skills['controls'][index]['controls'].lot_range.value) {
      // this.ngForm.controls['employees']['controls'][empIndex]['controls'].skills['controls'][index]['controls'].no_of_bags.disable();

      if (this.is_update) {
        function processString(stringsArray) {
          let extractedValues = [];
          let stringsArraySecond = []
          if (stringsArray.includes(',')) {
            let split = stringsArray.split(',');
            stringsArraySecond = (split);

          }
          else {
            stringsArraySecond.push(stringsArray)
          }
          stringsArraySecond = stringsArraySecond.filter(item => item.trim() !== '');
          stringsArraySecond.forEach((inputString, i) => {

            if (inputString.includes("~")) {
              let rangeParts = inputString.split("~");
              let prefix = rangeParts[0].replace(/~\d+$/, ''); // Extract prefix before numbers
              let start = parseInt(rangeParts[0].match(/\d+/)[0]);
              let end = parseInt(rangeParts[1]);
              // let startRange=
              let parts = rangeParts[0].split(/\D+/);

              // Get the last element which should be the number
              let first = parts[parts.length - 1];
              start = parseInt(first)
              let starting = start.toString().length
              let len = end - start
              prefix = prefix.slice(0, -starting)
              if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                  extractedValues.push({ 'tag': prefix + i, 'total_bag': len });
                }
              }
            } else {
              extractedValues.push({ tag: inputString, total_bag: 1 }); // Push the original value if no '~' found
            }
          });

          return extractedValues;
        }
        this.ngForm.value.employees.forEach((el, h) => {
          el.skills.forEach((items, index) => {
            // this.ngForm.controls
            let res = processString(items.lot_range);
            this.ngForm.controls['employees']['controls'][h]['controls'].skills['controls'][index]['controls'].tag_details.setValue(res);
            items.tag_details = res

            // item.tag_details= res
          })
        });

      }

      let value = (this.ngForm.controls['employees']['controls'][empIndex]['controls'].skills['controls'][index]['controls'].bag_size.value * this.ngForm.controls['employees']['controls'][empIndex]['controls'].skills['controls'][index]['controls'].no_of_bags.value)
      if (this.unit != 'Kg') {

        value = value && (value > 0) ? (value / 100) : 0
      }
      const isIntegerValue = Number.isInteger(value);
      const formattedValuee = isIntegerValue ? value.toFixed(2) : parseFloat(value.toFixed(2)).toString();
      this.ngForm.controls['employees']['controls'][empIndex]['controls'].skills['controls'][index]['controls'].quantity_available.setValue(formattedValuee)

      let data = this.ngForm.value && this.ngForm.value.employees ? this.ngForm.value.employees : '';

      let totalQty;
      let sum = 0;
      if (data && data.length > 0) {
        data.forEach(el => {
          el.skills.forEach(item => {
            sum += item && item.quantity_available ? parseFloat(item.quantity_available) : 0;
            totalQty = sum;
          })
        })
      }


      // totalQty = totalQty ? parseFloat(totalQty) : 0
      const isInteger = Number.isInteger(totalQty);
      const formattedValue = isInteger ? totalQty.toFixed(2) : parseFloat(totalQty.toFixed(2)).toString();
      this.ngForm.controls['total_quantity'].setValue((formattedValue) ? (((parseFloat(formattedValue))).toFixed(2)) : 0)
      this.ngForm.controls['quantity'].setValue((formattedValue > 0) ? (((parseFloat(formattedValue))).toFixed(2)) : 0)

    }

  }
  submit() {

    let data = this.ngForm.value && this.ngForm.value.employees ? this.ngForm.value.employees : '';
    if (data && data.length > 0) {
      for (let key in data) {
        if (data[key].lot_name == '' || data[key].lot_name == null) {
          Swal.fire({
            title: '<p style="font-size:25px;">Please Fill the Form Properly.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          })
          return;
        }
        if (data[key].skills && data[key].skills.length > 0) {
          for (let index in data[key].skills) {
            if (data[key].skills[index].lot_range == null || data[key].skills[index].lot_range == ''
              || data[key].skills[index].bag_size == null || data[key].skills[index].bag_size == ''
              || data[key].skills[index].no_of_bags == null || data[key].skills[index].no_of_bags == ''
              || data[key].skills[index].quantity_available == null || data[key].skills[index].quantity_available == ''
            ) {
              Swal.fire({
                title: '<p style="font-size:25px;">Please Fill the Form Properly.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#B64B1D'
              })
              return;

            }
          }
        }
      }

    }
    const param = this.ngForm.value;
    let lot_details = []
    let dataVal;
    if (param && param.employees && param.employees.length > 0) {
      param.employees.forEach((el, i) => {
        el.skills.forEach((item, x) => {
          lot_details.push({ ...item.tag_details, 'lot_range': item.lot_range, 'lot_name': el.lot_name, 'bag_size': item.bag_size })
          dataVal = lot_details ? lot_details.flat() : ''

          // this.ngForm.value['lot_details'] = lot_deteails ? lot_details.flat() : ''
        })
      })
    }
    // lot_name':el.lot_name;
    let transformedArray
    if (dataVal && dataVal.length > 0) {
      transformedArray = dataVal.map((element) => {
        const newObj = {};
        Object.keys(element).forEach((key) => {
          if (key !== "lot_range" && key !== "lot_name" && key !== 'bag_size') {
            newObj[key] = {
              ...element[key],
              "lot_range": element["lot_range"],
              "lot_name": element['lot_name'],
              "bag_size": element['bag_size']
            };
          }
        });
        return newObj;
      });
    }


    let datas = param && param.employees ? param.employees : '';
    const transformedArrays = transformedArray.flatMap((element) => {
      const newArray = Object.values(element);
      return newArray;
    });
    this.ngForm.value['lot_details'] = transformedArrays ? transformedArrays : ''

    function calculateSumByIdAndCondition(items) {
      const sumByIdAndCondition = [];

      items.forEach(item => {
        const key = `${item.lot_name}-${item.lot_range}`;

        if (!sumByIdAndCondition[key]) {
          sumByIdAndCondition[key] = { lot_name: item.lot_name, lot_range: item.lot_range, sum: 0 };
        }

        sumByIdAndCondition[key].sum += item.bag_size;
      });

      return Object.values(sumByIdAndCondition);
    }
    const sumByIdAndConditionJSON = calculateSumByIdAndCondition(transformedArrays);
    if (transformedArrays && transformedArrays.length > 0) {
    }
    if (datas && datas.length > 0) {

      datas.forEach((el, index) => {

        el.skills = el.skills.map(item1 => {
          const matchingItem = sumByIdAndConditionJSON.find(item2 => item2.lot_name === el.lot_name && item2.lot_range == item1.lot_range);
          return { ...item1, ...matchingItem };
        })
      })
    }




    const data2 = param && param.lot_details ? param.lot_details : '';
    const lotData = param && param.employees ? param.employees : '';
    const hasDuplicateslotData = () => {
      const seen = {};
      for (const item of lotData) {
        const key = (item.lot_name.toLowerCase());
        if (seen[key]) {
          return true; // Duplicates found
        }
        seen[key] = true;
      }
      return false; // No duplicates found
    };
    if (hasDuplicateslotData()) {
      Swal.fire({
        title: '<p style="font-size:25px;">Lot Number  Can not be Duplicate.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
      // alert("Duplicates found based on lot_name and tag!");
    } else {
      // alert("No duplicates based on lot_name and tag.");
      const hasDuplicates = () => {
        const seen = {};
        for (const item of data2) {
          const key = item.tag;
          if (seen[key]) {
            return true; // Duplicates found
          }
          seen[key] = true;
        }
        return false; // No duplicates found
      };

      // Check for duplicates and show alert if found
      if (hasDuplicates()) {
        Swal.fire({
          title: '<p style="font-size:25px;">Tag Range Can not be Duplicate.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        return;
        // alert("Duplicates found based on lot_name and tag!");
      }
      else {
        let lotName = [];
        let tag = []
        if (data2 && data2.length > 0) {
          data2.forEach((el, i) => {
            lotName.push(el && el.lot_name ? el.lot_name : '');
            tag.push(el && el.tag ? el.tag : '')
          })
        }
        lotName = [...new Set(lotName)];

        const getLocalData = localStorage.getItem('BHTCurrentUser');
        let localdatas = JSON.parse(getLocalData)
        let UserId = localdatas.id
        const params = {
          search: {
            lot_name: lotName && (lotName.length > 0) ? lotName : '',
            bsp_id: this.ngForm.controls['BSPC'].value,
            tag: tag && (tag.length > 0) ? tag : '',
            user_id :UserId,
            year:this.ngForm.controls['year'].value,
            season:this.ngForm.controls['season'].value,
          }
        }
        //  this.showLotPage = false;
        //   this.disableUpperSection = false;
        //   this.showSecondPortion = true;
        this.masterService.postRequestCreator('check-lot-name', null, params).subscribe(data => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
            if (response && response.length < 1) {
              this.showLotPage = false;
              this.disableUpperSection = false;
              this.showSecondPortion = true;
            }
          }
          else if(data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 201) {
            let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
            if (response && response.length < 1) {
              this.showLotPage = false;
              this.disableUpperSection = false;
              this.showSecondPortion = true;
            }else{

              Swal.fire({
             title: `<p style="font-size:25px;">Lot Number already exists.</p>`,
             icon: 'error',
             confirmButtonText:
               'OK',
             confirmButtonColor: '#B64B1D'
           })
            }
        }
        else if(data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 202) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
          if (response && response.length<1) {
            this.showLotPage = false;
            this.disableUpperSection = false;
            this.showSecondPortion = true;
          }else{
            Swal.fire({
           title: `<p style="font-size:25px;">Tag Number already exists.</p>`,
           icon: 'error',
           confirmButtonText:
             'OK',
           confirmButtonColor: '#B64B1D'
         })
          }
      }
      else{
        Swal.fire({
          title: `<p style="font-size:25px;">Something Went Wrong.</p>`,
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
      }
          })
      

        // alert("No duplicates based on lot_name and tag.");
      }
    }

    // Function to check for duplicates based on lot_name and tag

    this.ngForm.controls['quantity'].setValue(this.ngForm.controls['total_quantity'].value ? (parseFloat(this.ngForm.controls['total_quantity'].value).toFixed(2)) : '0')

  }
  cancel() {
    this.showLotPage = false;
    this.disableUpperSection = false;
    this.showSecondPortion = true;
    if (this.ngForm.controls['class_of_Seed'].value == 6) {
      this.showwillingToProduce = true
      if (this.ngForm.controls['is_developed'].value == 1) {
        this.is_developed = false;
      } else {
        this.is_developed = true;
      }
    }
    if (!this.is_update) {
      const myFormArray = this.ngForm.get('employees') as FormArray;

      myFormArray.clear();

      // this.showwillingToProduce=false

      this.employees().push(this.newEmployee());
      this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].quantity_available.setValue('');
      this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].lot_range.setValue('');
      this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].bag_size.setValue('');
      this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].no_of_bags.setValue('');
      this.ngForm.controls['employees']['controls'][0].controls['lot_name'].setValue('')
      // this.isShowTable=true;

      this.ngForm.controls['quantity'].setValue('');

      this.ngForm.controls['total_quantity'].setValue('')
    } else {
      if (this.setid) {
        this.editData(this.setid ? this.setid : '',null)
      }
    }


  }
  getLotPage(id) {
    const param = {
      search: {
        id: id
      }
    }

    // this.showLotPage=true

    this.masterService.postRequestCreator('get-lot-number-by-seed-inventory', null, param).subscribe(data => {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let reseponseData = [];
      if (response && response.length > 0) {

        response.forEach((el, i) => {
          el.tag_details.forEach((item, j) => {
            reseponseData.push(item && item.id ? item.id : '')
          })
        })
      }
      // reseponseData= [...new Set(reseponseData)];
      this.seedTagDetailsId = reseponseData
      this.seed_inventry_id = response && response[0].seed_inventry_id ? response[0].seed_inventry_id : ""
      this.tagId = response && response[0].tag_id ? response[0].tag_id : ""
      const myFormArray = this.ngForm.get('employees') as FormArray;

      myFormArray.clear()
      this.employees().push(this.newEmployee());
      this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].quantity_available.setValue('');
      this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].lot_range.setValue('', { emitEvent: false });
      this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].bag_size.setValue('', { emitEvent: false });
      this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].no_of_bags.setValue('');
      this.ngForm.controls['employees']['controls'][0].controls['lot_name'].setValue('')
      if (response && response.length > 1) {

        for (let i = 1; i <= response.length - 1; ++i) {
          this.itemsArray.push(this.newEmployee())
        }
        for (let i = 0; i < response.length; i++) {

          this.ngForm.controls['employees']['controls'][i].controls.lot_name.patchValue(response && response[i] && response[i].lot_number ? response[i].lot_number : 0)
          response[i].lot_details.forEach((el, index) => {
            if (index != 0) {
              this.addEmployeeSkill(i)
            }
            this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].lot_range.setValue(el && el.tag_range ? el.tag_range : 0);
            this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].bag_size.setValue(el && el.bag_size ? el.bag_size : 0);
            this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].no_of_bags.setValue(el && el.number_of_tag ? el.number_of_tag : 0);
            if (this.unit == 'Qt') {
              this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].quantity_available.setValue(el && el.quantity ? (el.quantity / 100) : 0);
            } else {
              this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].quantity_available.setValue(el && el.quantity ? el.quantity : 0);
            }
            // this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].tag_details.setValue(response && response.tag_details ? response.tag_details : 0);

          })
        }

      }
      else if (response && (response.length == 1)) {
        for (let i = 0; i < response.length; i++) {

          this.ngForm.controls['employees']['controls'][i].controls.lot_name.patchValue(response && response[i] && response[i].lot_number ? response[i].lot_number : 0)
          response[i].lot_details.forEach((el, index) => {
            if (index != 0) {
              this.addEmployeeSkill(i)
            }
            this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].lot_range.setValue(el && el.tag_range ? el.tag_range : 0);
            this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].bag_size.setValue(el && el.bag_size ? el.bag_size : 0);
            this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].no_of_bags.setValue(el && el.number_of_tag ? el.number_of_tag : 0);
            // this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].tag_details.setValue(response && response.tag_details ? response.tag_details : 0);
            // this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].quantity_available.setValue(el && el.quantity ? el.quantity : 0);
            if (this.unit == 'Qt') {
              this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].quantity_available.setValue(el && el.quantity ? (el.quantity / 100) : 0);
            } else {
              this.ngForm.controls['employees']['controls'][i]['controls'].skills['controls'][index]['controls'].quantity_available.setValue(el && el.quantity ? el.quantity : 0);
            }
          })
        }

      }
      else {
        const myFormArray = this.ngForm.get('employees') as FormArray;

        myFormArray.clear()
        this.employees().push(this.newEmployee());
        this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].quantity_available.setValue('');
        this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].lot_range.setValue('');
        this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].bag_size.setValue('');
        this.ngForm.controls['employees']['controls'][0]['controls'].skills['controls'][0]['controls'].no_of_bags.setValue('');
        this.ngForm.controls['employees']['controls'][0].controls['lot_name'].setValue('')

      }

      let totalQty;
      let sum = 0;
      let datas = this.ngForm.value && this.ngForm.value.employees ? this.ngForm.value.employees : '';
      if (datas && datas.length > 0) {
        datas.forEach(el => {
          el.skills.forEach(item => {
            sum += item && item.quantity_available ? parseFloat(item.quantity_available) : 0;

            totalQty = sum;
          })
        })
      }
      this.ngForm.controls['total_quantity'].setValue(totalQty ? (parseFloat(totalQty).toFixed(2)) : 0)

      this.ngForm.controls['quantity'].setValue(totalQty ? (parseFloat(totalQty).toFixed(2)) : 0)


    })
  }
  update(index) {
    function processString(stringsArray) {
      let extractedValues = [];
      let stringsArraySecond = []
      if (stringsArray.includes(',')) {
        let split = stringsArray.split(',');
        stringsArraySecond = (split);
        stringsArraySecond = stringsArraySecond.filter(Boolean);

      }
      else {
        stringsArraySecond.push(stringsArray)
      }
      stringsArraySecond = stringsArraySecond.filter(item => item.trim() !== '');

      stringsArraySecond.forEach((inputString, i) => {

        if (inputString.includes("~")) {
          let rangeParts = inputString.split("~");
          let prefix = rangeParts[0].replace(/~\d+$/, ''); // Extract prefix before numbers
          let start = parseInt(rangeParts[0].match(/\d+/)[0]);
          let end = parseInt(rangeParts[1]);
          // let startRange=
          let parts = rangeParts[0].split(/\D+/);

          // Get the last element which should be the number
          let first = parts[parts.length - 1];
          start = parseInt(first)
          let starting = start.toString().length
          let len = end - start
          prefix = prefix.slice(0, -starting)
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              extractedValues.push({ 'tag': prefix + i, 'total_bag': len });
            }
          }
        } else {
          extractedValues.push({ tag: inputString, total_bag: 1 }); // Push the original value if no '~' found
        }
      });

      return extractedValues;
    }
    this.ngForm.value.employees.forEach((el, h) => {
      el.skills.forEach((items, index) => {
        // this.ngForm.controls
        let res = processString(items.lot_range);
        this.ngForm.controls['employees']['controls'][h]['controls'].skills['controls'][index]['controls'].tag_details.setValue(res);
        items.tag_details = res

        // item.tag_details= res
      })
    });
    let data = this.ngForm.value && this.ngForm.value.employees ? this.ngForm.value.employees : '';
    if (data && data.length > 0) {
      for (let key in data) {
        if (data[key].lot_name == '' || data[key].lot_name == null) {
          Swal.fire({
            title: '<p style="font-size:25px;">Please Fill the Form Properly.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          })
          return;
        }
        if (data[key].skills && data[key].skills.length > 0) {
          for (let index in data[key].skills) {
            if (data[key].skills[index].lot_range == null || data[key].skills[index].lot_range == ''
              || data[key].skills[index].bag_size == null || data[key].skills[index].bag_size == ''
              || data[key].skills[index].no_of_bags == null || data[key].skills[index].no_of_bags == ''
              || data[key].skills[index].quantity_available == null || data[key].skills[index].quantity_available == ''
            ) {
              Swal.fire({
                title: '<p style="font-size:25px;">Please Fill the Form Properly.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#B64B1D'
              })
              return;

            }
          }
        }
      }

    }
    const param = this.ngForm.value;
    let lot_details = []
    let dataVal;
    if (param && param.employees && param.employees.length > 0) {
      param.employees.forEach((el, i) => {
        el.skills.forEach((item, x) => {
          lot_details.push({ ...item.tag_details, 'lot_range': item.lot_range, 'lot_name': el.lot_name, 'bag_size': item.bag_size })
          dataVal = lot_details ? lot_details.flat() : ''

          // this.ngForm.value['lot_details'] = lot_deteails ? lot_details.flat() : ''
        })
      })
    }
    // lot_name':el.lot_name;
    let transformedArray
    if (dataVal && dataVal.length > 0) {
      transformedArray = dataVal.map((element) => {
        const newObj = {};
        Object.keys(element).forEach((key) => {
          if (key !== "lot_range" && key !== "lot_name" && key !== 'bag_size') {
            newObj[key] = {
              ...element[key],
              "lot_range": element["lot_range"],
              "lot_name": element['lot_name'],
              "bag_size": element['bag_size']
            };
          }
        });
        return newObj;
      });
    }


    let datas = param && param.employees ? param.employees : '';
    const transformedArrays = transformedArray.flatMap((element) => {
      const newArray = Object.values(element);
      return newArray;
    });
    this.ngForm.value['lot_details'] = transformedArrays ? transformedArrays : ''

    function calculateSumByIdAndCondition(items) {
      const sumByIdAndCondition = [];

      items.forEach(item => {
        const key = `${item.lot_name}-${item.lot_range}`;

        if (!sumByIdAndCondition[key]) {
          sumByIdAndCondition[key] = { lot_name: item.lot_name, lot_range: item.lot_range, sum: 0 };
        }

        sumByIdAndCondition[key].sum += item.bag_size;
      });

      return Object.values(sumByIdAndCondition);
    }
    const sumByIdAndConditionJSON = calculateSumByIdAndCondition(transformedArrays);
    if (transformedArrays && transformedArrays.length > 0) {
    }
    if (datas && datas.length > 0) {

      datas.forEach((el, index) => {

        el.skills = el.skills.map(item1 => {
          const matchingItem = sumByIdAndConditionJSON.find(item2 => item2.lot_name === el.lot_name && item2.lot_range == item1.lot_range);
          return { ...item1, ...matchingItem };
        })
      })
    }




    const data2 = param && param.lot_details ? param.lot_details : '';

    const lotData = param && param.employees ? param.employees : '';
    const hasDuplicateslotData = () => {
      const seen = {};
      for (const item of lotData) {
        const key = item.lot_name;
        if (seen[key]) {
          return true; // Duplicates found
        }
        seen[key] = true;
      }
      return false; // No duplicates found
    };
    if (hasDuplicateslotData()) {
      Swal.fire({
        title: '<p style="font-size:25px;">Lot Number  Can not be Duplicate.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
      // alert("Duplicates found based on lot_name and tag!");
    } else {
      const data2 = param && param.lot_details ? param.lot_details : '';
      const lotData = param && param.employees ? param.employees : '';
      // alert("No duplicates based on lot_name and tag.");
      const hasDuplicates = () => {
        const seen = {};
        for (const item of data2) {
          const key =  item.tag;
          if (seen[key]) {
            return true; // Duplicates found
          }
          seen[key] = true;
        }
        return false; // No duplicates found
      };

      // Check for duplicates and show alert if found
      if (hasDuplicates()) {
        Swal.fire({
          title: '<p style="font-size:25px;">Lot Number And Tag Range Can not be Duplicate.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
        return;
        // alert("Duplicates found based on lot_name and tag!");
      }
      else {
        let lotName = [];
        let tag = [];
        if (data2 && data2.length > 0) {
          data2.forEach((el, i) => {
            lotName.push(el && el.lot_name ? el.lot_name : '');
            tag.push(el && el.tag ? el.tag : '')
          })
        }
        lotName = [...new Set(lotName)];
        const getLocalData = localStorage.getItem('BHTCurrentUser');
        let localdatas = JSON.parse(getLocalData)
        let UserId = localdatas.id
        let tagId=[]
        if(this.responseData){
          if(this.responseData && this.responseData.tag_detail_data && this.responseData.tag_detail_data.length>0){
            this.responseData.tag_detail_data.forEach((elm,i)=>{
              tagId.push(elm && elm.seed_tag_id? elm.seed_tag_id:'')
            })
          }
          console.log(this.responseData)

        }
        const params = {
          search: {
            lot_name: lotName && (lotName.length > 0) ? lotName : '',
            bsp_id: this.ngForm.controls['BSPC'].value,
            tag: tag && (tag.length > 0) ? tag : '',
            is_update: this.is_update ? this.is_update : '',
            seed_inventry_id: this.seed_inventry_id ? this.seed_inventry_id : '',
            user_id :UserId,
            year:this.ngForm.controls['year'].value,
            season:this.ngForm.controls['season'].value,
            seedtagId:tagId && tagId.length>0? tagId :''
          }
         
        }

        //  this.showLotPage = false;
        //   this.disableUpperSection = false;
        //   this.showSecondPortion = true;
        // this.masterService.postRequestCreator('check-lot-name', null, params).subscribe(data => {
        //   if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        //     let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        //     if (response && response.length < 1) {
        //       this.showLotPage = false;
        //       this.disableUpperSection = false;
        //       this.showSecondPortion = true;
        //     }
        //     else {
        //       let lotname = [];
        //       response.forEach((el, i) => {
        //         lotname.push(el && el.lot_number ? el.lot_number : '')
        //       })
        //       lotname = [...new Set(lotname)];
        //       if (lotname && lotname.length > 0) {
        //         let usersString = lotname.join(' and ');
        //         Swal.fire({
        //           title: `<p style="font-size:25px;">In this Tag Range Lot Number ${usersString} Already Exist.</p>`,
        //           icon: 'error',
        //           confirmButtonText:
        //             'OK',
        //           confirmButtonColor: '#B64B1D'
        //         })
        //       }
        //     }

        //   }
        //   else {
        //     Swal.fire({
        //       title: `<p style="font-size:25px;">Something Went Wrong.</p>`,
        //       icon: 'error',
        //       confirmButtonText:
        //         'OK',
        //       confirmButtonColor: '#B64B1D'
        //     })
        //   }

        // })

        this.masterService.postRequestCreator('check-lot-name', null, params).subscribe(data => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
            if (response && response.length < 1) {
              this.showLotPage = false;
              this.disableUpperSection = false;
              this.showSecondPortion = true;
            }
          }
          else if(data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 201) {
            let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
            if (response && response.length < 1) {
              this.showLotPage = false;
              this.disableUpperSection = false;
              this.showSecondPortion = true;
            }else{

              Swal.fire({
             title: `<p style="font-size:25px;">Lot Number already exists.</p>`,
             icon: 'error',
             confirmButtonText:
               'OK',
             confirmButtonColor: '#B64B1D'
           })
            }
        }
        else if(data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 202) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
          if (response && response.length <1) {
            this.showLotPage = false;
            this.disableUpperSection = false;
            this.showSecondPortion = true;
          }else{
            Swal.fire({
           title: `<p style="font-size:25px;">Tag Number already exists.</p>`,
           icon: 'error',
           confirmButtonText:
             'OK',
           confirmButtonColor: '#B64B1D'
         })
          }
      }
      else{
        Swal.fire({
          title: `<p style="font-size:25px;">Something Went Wrong.</p>`,
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
      }
          })
        // alert("No duplicates based on lot_name and tag.");
      }
    }

    this.ngForm.controls['quantity'].setValue(this.ngForm.controls['total_quantity'].value ? (this.ngForm.controls['total_quantity'].value.toFixed(2)) : '')
    //  this.ngForm.


  }
  updateSecond(index) {
  }
  getUnit(item) {
    let value = this.ngForm.controls['crop'].value && (this.ngForm.controls['crop'].value.slice(0, 1)) == 'A' ? 'Qt' : 'Kg';
    this.unit = value
    return value
  }

  CheckDuplicateLot($event) {
    const param = this.ngForm.value;
    const lotData = param && param.employees ? param.employees : '';
    const hasDuplicateslotData = () => {
      const seen = {};
      for (const item of lotData) {
        const key = (item.lot_name.toLowerCase());
        if (seen[key]) {
          return true; // Duplicates found
        }
        seen[key] = true;
      }
      return false; // No duplicates found
    };
    if (hasDuplicateslotData()) {
      Swal.fire({
        title: '<p style="font-size:25px;">Lot Number  Can not be Duplicate.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })

    } else {

    }
  }
  getUnitDataValue(item) {
    if (this.unit == 'Qt') {
      return ((parseFloat(item)) / 100).toFixed(2)
    } else {
      return item ? (parseFloat(item)).toFixed(2) : ''
    }
  }
  getTotalData(item) {
   let sum=0;
   sum+=item;
   let totalQty;
   if(this.unit=='Qt'){
    totalQty=((Number(sum)) / 100).toFixed(2)
   }else{
    totalQty=sum
   }
   return totalQty;
  }
  getParental(data) {
    if (this.parentalList && this.parentalList.length > 0) {
      let list = this.parentalList.filter(x => x.line_variety_code == data)
      return list && list[0] && list[0].line_variety_name ? list[0].line_variety_name : 'NA';

    }

  }
  romanToCapital(roman) {
    // Define the mapping of Roman numerals to their corresponding values
    const romanNumerals = {
        'I': 'I',
        'V': 'V',
        'X': 'X',
        'L': 'L',
        'C': 'C',
        'D': 'D',
        'M': 'M'
    };

    // Convert the Roman numeral to capital letters
    let capitalRoman = '';
    for (let i = 0; i < roman.length; i++) {
        let currentChar = roman[i].toUpperCase(); // Convert to uppercase to handle lowercase input
        if (romanNumerals[currentChar]) {
            capitalRoman += romanNumerals[currentChar];
        } else {
            return "Invalid Roman numeral";
        }
    }

    return capitalRoman;
}
capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// checkDecimal(event){
//   // checkNumber(event)
//   console.lo
//   const numCharacters = /[0-9.]+/g;
//   if (event.which == 190 ||event.which != 17  && event.which != 86 && event.which != 8 && event.which != 9 && event.which != 37 && event.which != 39 && event.which != 46 && numCharacters.test(event.key) == false) {
//     event.preventDefault();
//   }
  
// }
checkDecimal($e) {
  checkDecimal($e);
}

}