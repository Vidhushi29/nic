import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions, IMyDate, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { checkDecimal, checkDecimalValue, convertDate, convertDatetoDDMMYYYYwithdash } from 'src/app/_helpers/utility';
import Swal from 'sweetalert2';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import * as html2PDF from 'html2pdf.js';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.css']
})
export class PrintBillComponent implements OnInit {
  responseofLotData: any;
  freezeData: boolean;
  aggregatedJSON: any;
  totalQty: any[];
  quantityError: boolean;
  editDataValue: boolean;
  is_update: boolean;
  bsp2Arrlist: any[];
  showparental: boolean;
  todayData = new Date();
  parentalList: any[];
  editId: any; t
  bsp2Arrlists: any;
  lineparetal: any;
  lineparetals: any;
  selectParental: any;
  showAddMoreInthisVariety: boolean;
  submitted: boolean;
  backbtn: boolean;
  failedSubmit: boolean;
  quantitySownValue: any;
  showparentalList: boolean;
  bspProforma2SeedData: any;
  units: string;
  showDateValidation: boolean;
  agencyName: any;
  bspcAddress: any;
  contact_person_name: any;
  data1: any;
  // cropNameValue: any;
  varietyName: any;
  runningNumber: any;
  runningNumber2: number;
  designation: any;
  cropNameofReport: any;
  encryptedData: any;
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  referenceNumber: any;
  parentalListSecond: any;
  donotShowtable: boolean;
  editShowData: boolean;
  validationErr: boolean;
  stateName: any;
  districtName: any;
  VarietySecond: any;
  VarietyList: any;
  parentalListData: any;
  cropName: any;
  cropNameSecond: any;
  crop_name_data: any;
  selectCrop_crop_code: any;
  selectCrop_group: string;
  crop_text_check: string;
  dataToDisplay: any;
   reasonData: any;
  dropdownSettings: IDropdownSettings = {};
dropdownList3;
dropdownLists;
dropdownList2;
BillNo;
AESKey:string = environment.AESKey;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    // This function will be called when a scroll event occurs on the window

    // Perform actions based on window scroll
  }

  // @ViewChild('datePicker') datePicker: MyDatePicker;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData = []
  selectCrop;
  showlot = true;
  start;
  selectVarietyofbsp1;
  bsp2Data;
  end;
  ngForm!: FormGroup;
  todayDate = new Date();
  parsedDate = Date.parse(this.todayDate.toString());
  selectVariety;
  Dayjs;
  // selected: {start: Dayjs, end: Dayjs};
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []

  stateSelect;
  tittle = 'Production Schedule and Availability of Breeder Seed (BSP-II)'
  allData: any;
  yearOfIndent;
  // dropdownSettings: IDropdownSettings = {};
  seasonlist;
  typeOfSeedList;
  stage;
  year = [
    {
      year: '2023'
    },
    {
      year: '2022'
    },
    {
      year: '2021'
    },
  ]
  cropList;
  LotNo;
  tagNo;

  season = [
    {
      season: 'K'
    },
    {
      season: 'R'
    },
  ];
  Variety;
  croplistSecond: any;
  stateList: any;
  selectState;
  stateListSecond: any;
  districtList: any;
  varietyNames
  districtListsecond: any;
  district_id: any;
  changeposition = false;
  showDetsail: boolean;
  disableFieldQty: boolean;
  isSearch: boolean;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  selected;
  showSecondCard = false;
  response: any;
  showDetsails = false;
  showVarietyDetails = false;
  varietyListDetails: any;
  disableField: boolean;
  showetailsPage = false;
  employeeIndex: number = 0;
  responseData: any;
  showLot: boolean;
  lotDatalength;
  changepositions = false;
  count = 0;
  lotNolist = [];
  nestedForm: FormGroup<{ nestedArrays: FormArray<FormArray<FormControl<string>>>; }>;
  showlotpage: boolean;
  showPageDeatails = false;
  responseList: any;
  varietyListofBsp2: any;
  varietyListofBsp2list: any;
  unit: string;
  showFirstDetailsPage: boolean;
  constructor(private service: SeedServiceService, private fb: FormBuilder, private master: MasterService, private elementRef: ElementRef,
    private productionService: ProductioncenterService,
    private breeder: BreederService,
    private router: Router,
  ) {
    this.createForm();

  }
  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      crop: [''],
      crop_text:[''],
      variety_code:[''],
      indentor:[''],
      spa:[''],
      bill:['']
    
    })
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
            this.getSeason()
          })
          this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
            this.getCrop()
          })
          this.ngForm.controls['variety_code'].valueChanges.subscribe(newValue => {
            this.getGridData()
          })
          this.ngForm.controls['indentor'].valueChanges.subscribe(newValue => {
            this.getGridData()
          })
          this.ngForm.controls['spa'].valueChanges.subscribe(newValue => {
            this.getGridData()
          })
          this.ngForm.controls['bill'].valueChanges.subscribe(newValue => {
            this.getGridData()
          })
  }
  ngOnInit(): void {
    
this.getYear();
this.dropdownSettings = {
  singleSelection: false,
  idField: 'item_id',
  textField: 'item_text',
  selectAllText: 'Select All',
  unSelectAllText: 'Unselect All',
  itemsShowLimit: 2,
  allowSearchFilter: true,
  maxHeight: 70,
};
  }

getGridData(){
  let varity= this.ngForm.controls['variety_code'].value;
  let varityCode=[]
  if(varity && varity.length>0 ){
    varity.forEach(el=>{
      varityCode.push(el && el.item_id ? el.item_id:"")
    })
  }
  let indentor= this.ngForm.controls['indentor'].value;
  let indentorCode=[]
  if(indentor && indentor.length>0 ){
    indentor.forEach(el=>{
      indentorCode.push(el && el.item_id ? el.item_id:"")
    })
  }
  let spa= this.ngForm.controls['spa'].value;
  let spaCode=[]
  if(spa && spa.length>0 ){
    spa.forEach(el=>{
      spaCode.push(el && el.item_id ? el.item_id:"")
    })
  }
  const param = {
    search: {
      year: this.ngForm.controls["year"].value,
      season: this.ngForm.controls["season"].value,
      crop_code:this.ngForm.controls["crop"].value,
      variety_code:varityCode && varityCode.length>0 ? varityCode:"",
      indentor:indentorCode && indentorCode.length>0 ? indentorCode:'',
      spa:spaCode && spaCode.length>0 ? spaCode:'',
      bill:this.ngForm.controls["bill"].value,
    }
  }
  this.productionService.postRequestCreator('get-lifting-data-print',  param).subscribe(data => {
    let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.filterData ? data.EncryptedResponse.data.filterData : '';
    let res2 = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data && data.EncryptedResponse.data.liftingData ? data.EncryptedResponse.data.liftingData : '';
   
    this.dataToDisplay=res;
    if(this.dataToDisplay && this.dataToDisplay.length>0){
      this.dataToDisplay.forEach(el=>{
        el.spaData=[]
       el.toatalBags=[]
      })
    }
    if(this.dataToDisplay && this.dataToDisplay.length>0){
      if(res2 && res2.length>0){
        res2.forEach(values=>{
          
          this.dataToDisplay.forEach(el=>{
            el.indentor.forEach(val=>{
              val.spa.forEach(item=>{

                if(item.id == values.litting_seed_details_id){
                  el.toatalBags.push(values)
                }

              })
            })
          })
        })
      }
      this.dataToDisplay.forEach(el=>{
        // el.spaData=[]
        el.indentor.forEach(val=>{
          val.spa.forEach(item=>{
            item.spaBags=[]
            el.spaData.push(val)
          })
        })
       
      })
    }
    this.dataToDisplay.forEach(variety => {
      variety.indentor.forEach(indentor => {
        indentor.spa.forEach(spaObj => {
          spaObj.spas=[]
          const matchingBags = res2.filter(bagObj => bagObj.litting_seed_details_id === spaObj.id);
          spaObj.spaBags=matchingBags;
        });
      });
    });
    this.dataToDisplay.forEach(variety => {
      variety.indentor.forEach(indentor => {
        indentor.spa.forEach(spaObj => {
          spaObj.spaBags.forEach((val=>{
            spaObj.spas.push({tag_size:val.tag_size,no_of_bags:val.no_of_bags})
          }))
        });
      });
    });
    console.log('res=================>',this.dataToDisplay)
    // this.cropName=res ? res :'';
    // this.cropNameSecond = this.cropName
  })
}

    onSearchClick() {
     this.getGridData()
      this.getVariety();
      this.getIndentor();
      this.getSpaName();
      this.getBillNo();
  }
   cgClick() {
    document.getElementById('crop_group').click();
  }
    getSeason() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value
      }
    }
    console.log(this.ngForm.controls,'this.ngForm.controls["year"].value')
    this.productionService.postRequestCreator('get-lifting-data-season',param).subscribe(data => {
      this.seasonlist = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }
  getCrop() {
    const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value
      }
    }
    this.productionService.postRequestCreator('get-lifting-data-crop',  param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.cropName=res ? res :'';
      this.cropNameSecond = this.cropName
    })
  }
  getYear() {
    this.productionService.postRequestCreator('get-lifting-data-year', null).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }
    cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    // this.ngForm.controls["crop_text"].setValue("");
    // this.ngForm.controls['crop_group'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code:'')
    this.crop_text_check = 'crop_group'
  }
           
  onItemSelect(item: any) {
    console.log(item);
  }
      onSelectAll(items: any) {
        console.log(items);
      }
      getFinancialYear(year) {
        let arr = []
        arr.push(String(parseInt(year)))
        let last2Str = String(parseInt(year)).slice(-2)
        let last2StrNew = String(Number(last2Str) + 1);
        arr.push(last2StrNew)
        return arr.join("-");
      }
      openBillReceiptDialog(id,val): void {
        console.log(val,'valval')
        let year=this.ngForm.controls['year'].value;
        let season=this.ngForm.controls['season'].value;
        let crop_code=this.ngForm.controls['crop'].value;
        let user = localStorage.getItem('BHTCurrentUser');
        let userData=  JSON.parse(user);
        let user_id = userData.id
        // this.userId = JSON.parse(user);
        const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id:id}), this.AESKey).toString();
    const encryptedData = encodeURIComponent(encryptedForm);
  
            this.router.navigate(['/Bill-Receipt/'+encryptedData]);
          }
   getVariety() {
      const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value
              }
            }
     this.productionService.postRequestCreator('get-lifting-data-variety',  param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.dropdownLists=res
      })
     }
     getIndentor() {
      const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value
              }
            }
     this.productionService.postRequestCreator('get-lifting-data-indentor',  param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.dropdownList2=res
      })
     }
     getSpaName() {
      const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value
              }
            }
     this.productionService.postRequestCreator('get-lifting-data-spa',  param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.dropdownList3=res
      })
     }
     
    
     getBillNo() {
      const param = {
      search: {
        year: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value
              }
            }
     this.productionService.postRequestCreator('get-lifting-data-bill-number',  param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.BillNo=res
      })
     }
}




 
 
  

// export class PrintBillComponent implements OnInit {
//   @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
//   ngForm: FormGroup = new FormGroup([]);
//   // ngForm!: FormGroup;
//   inventoryYearData: any;
//   inventorySeasonData: any;
//   inventoryVarietyData: any;
//   datatodisplay = [];
//   isSearch: boolean;
//   isCrop: boolean;
//   showTab: boolean;
//   private _productionCenter: any;
//   filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
//   inventoryData = []
//   allData: any;
//   dropdownSettings: IDropdownSettings;
//   dropdownList1 = [];
//   dropdownList2 = [];
//   dropdownList3 = [];
//   dropdownList4 = [];
//   selectedItems = [];
//   isDisabled: boolean = true;
//   selectedYear: any = 'null';
//   selectedSeason: any = 'null';
//   selectedCrop: any = 'null';
//   yearOfIndent;
//   seasonlist;
//   Amount 
//   Bags
//   Quantity
//   Billno 
//   BillNo;
//   SPAlist;
//   Indenterlist;
//   Varietylist
//   cropName ;
//   cropNameSecond ;
//   varietyCategories: any[];
//   addVarietySubmission: any[];
//   varietyList: any;
//   dummyData: { variety_id: string; variety_name: string; indent_quantity: number; bsp2Arr: any[]; }[];
//   selectCrop: any;
//   selectCrop_group_code: any;
//   selectlab_group_code: any;
//   selectlab1_group_code: any;
//   crop_name_data: any;
//   lab_data: any;
//   treat_data: any;
//   selectCrop_group: string;
//   crop_text_check: string;
//   lab_text_check: string;
//   lab1_text_check: string;
//   treat_text_check: string;
//   treat1_text_check: string;
//   croupGroup: any;
//   selectCrop_crop_code: any;
//   selectedTable: string;

//   selectTable(table: string) {
//     this.selectedTable = table;
//   }
//   constructor(private service: SeedServiceService, private fb: FormBuilder, private router: Router, private productionCenter: ProductioncenterService) {
//     this.createForm();
//   }
//   // createForm() {
//   //   this.ngForm = this.fb.group({
//   //     year: [''],
//   //     season: [''],
//   //     crop: [''],
//   //     crop_text: [''],
//   //     variety: [''],
//   //     vaiety_text: [''],
//   //     type_of_class: [''],
//   //     total_necluesseed: [''],
//   //     total_breederseed: [''],
//   //     variety_level_2: [''],
//   //     parental_text: [''],
//   //     line_variety_code: [''],
//   //     variety_line_code: [''],
//   //     vaiety_text_level_2: [''],
//   //     permission_of_production: [''],
//   //     StageFix: [false],
   



//   //   })
    


//   // }
//   openBillReceiptDialog(): void {
//     this.router.navigate(['/Bill-Receipt']);
//   }
//   onSearchClick() {
//     console.log('Selected Year:', this.inventoryYearData);
//     console.log('Selected Season:', this.inventorySeasonData);
//     console.log('Selected Crop:', this.crop_name_data);
//   }

//   placeholderText: string = '';
//   createForm() {
//     this.ngForm = this.fb.group({
//       year: [''],
//       season: [''],
//       Bill: [''],
//       SPA: [''],
//       Indenter: [''],
//       Variety: [''],
//       BSPC: [''],
//       cropName: [''],
//       crop_name: [''],
//       crop_text: [''],
//       variety: [''],
      
      
//     })
//     // this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
//     //   if (newValue) {
//     //     this.cropName = this.cropNameSecond
//     //     let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
//     //     this.cropName = response
//     //   }
//     //   else {
//     //     this.cropName = this.cropNameSecond
//     //   }
//     // });
//     this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
//       this.getSeason()
//     })
//     this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
//       this.getCrop()
//     })
//   }

//   ngOnInit(): void {
//     this.getYear();
//     this.fetchData();
//     this.dropdownList1 = [
//       { item_id: 1, item_text: 'DW-147' },
//       { item_id: 1, item_text: 'PBW-119 Parent Line: H456' },
//     ]
//     this.dropdownList2 = [
//       { item_id: 1, item_text: 'Madhya Pradesh' },
//       { item_id: 1, item_text: 'Gujrat' },
//     ]
//     this.dropdownList3 = [
//       { item_id: 1, item_text: 'SPA 1' },
//       { item_id: 1, item_text: 'SPA 2' },
//     ]
//     this.selectedItems = [
//       { item_id: 3, item_text: ' ' },
//       { item_id: 4, item_text: ' ' }
//     ];
//     this.dropdownSettings = {
//       singleSelection: false,
//       idField: 'item_id',
//       textField: 'item_text',
//       selectAllText: 'Select All',
//       unSelectAllText: 'Unselect All',
//       itemsShowLimit: 2,
//       allowSearchFilter: true,
//       maxHeight: 70,
//     };

//   }
//   onItemSelect(item: any) {
//     console.log(item);
//   }
//   onSelectAll(items: any) {
//     console.log(items);
//   }
//   fetchData() {
  

//   }
//   getCropData() {
//     this.cropNameSecond
//   }
 
  

//   save(data) {
//     console.log(data)

//   }
//   // get items(): FormArray {
//   //   return this.ngForm.get('bsp2Arr') as FormArray;
//   // }
//   cgClick() {
//     document.getElementById('crop_group').click();
//   }
//   cropNameValue(item: any) {
//     this.selectCrop = item.crop_name;
//     // this.ngForm.controls["crop_text"].setValue("");
//     // this.ngForm.controls['crop_group'].setValue(item.crop_code);
//     this.selectCrop_crop_code = item.crop_code;
//     this.crop_name_data = item.crop_name;
//     this.selectCrop_group = "";
//     // this.ngForm.controls['crop_name'].setValue('')
//     this.crop_text_check = 'crop_group'
//   }
//   cropdatatext() {
//     this.cropNameSecond;
//     console.log(' this.cropNameSecond;', this.cropNameSecond);
//   }
//   getYear() {
//     this.productionCenter.postRequestCreator('get-lifting-data-year', null).subscribe(data => {
//       this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
//     })
//   }
//   getSeason() {
//     const param = {
//       search: {
//         year: this.ngForm.controls["year"].value
//       }
//     }
//     console.log(this.ngForm.controls,'this.ngForm.controls["year"].value')
//     this.productionCenter.postRequestCreator('get-lifting-data-season',).subscribe(data => {
//       this.seasonlist = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
//     })
//   }
//   getCrop() {
//     const param = {
//       search: {
//         year: this.ngForm.controls["year"].value,
//         season: this.ngForm.controls["season"].value
//       }
//     }
//     this.productionCenter.postRequestCreator('get-lifting-data-season',  param).subscribe(data => {
//       let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
//       this.cropName=res ? res :'';
//       this.cropNameSecond = this.cropName
//     })
//   }
// }
