import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Item } from '@syncfusion/ej2-angular-pdfviewer';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { sample } from 'rxjs';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
interface InventoryItem {
  lotNo: string;
  tagNo: string;
  weight: number;
}
@Component({
  selector: 'app-lifting',
  templateUrl: './lifting.component.html',
  styleUrls: ['./lifting.component.css']
})

export class LiftingComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  isSearch: boolean;
  visibleTable: boolean = false;
  isCrop: boolean;
  showTab: boolean;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings2: IDropdownSettings = {};
  dropdownSettings3: IDropdownSettings = {};
  dropdownSettings4: IDropdownSettings = {}
  dropdownSettingsVariety: IDropdownSettings = {};
  // allData: any;

  dropdownSettings1 = {
    singleSelection: false,
    idField: 'id',
    textField: 'charges',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 2,
    allowSearchFilter: true,
    maxHeight: 70,
  };
  dropdownTagSettings2: IDropdownSettings = {};
  dropdownSettingsTests: IDropdownSettings = {};
  dropdownSettingsTag: IDropdownSettings = {};
  selectedItems: any;
  dropdownList = [];
  dropdownList1: any;

  additionalCharges = [
    { id: 1, charges: "Mou charges" },
    { id: 2, charges: "License fee" },
    { id: 3, charges: "PPV fee" },
    { id: 4, charges: "Royalty" },
    // { id: 5, charges: "Other" },
  ];
  dropdownList2 = [];
  dropdownList3 = [];
  dropdownList4 = [];
  isDisabled: boolean = true;
  searchClicked = false;
  searchClicked1 = false;
  yearOfIndent: any;
  seasonlist: any;
  cropName: any;
  cropNameSecond: any;
  visibleMouCharges: boolean = false;
  visibleOtherCharges: boolean = false;
  visibleLicenceCharges: boolean = false;
  visibleppvCharges: boolean = false;
  visiblerltCharges: boolean = false;
  selectedOption;
  allData: any;
  // dropdownSettings: IDropdownSettings = {};
  // cropName = [
  //   {
  //     crop_name: 'Wheat',
  //     crop_code: 'A01012'
  //   },
  //   {
  //     crop_name: 'Paddy (Dhan)',
  //     crop_code: 'A01012'
  //   },
  // ];
  // cropNameSecond = [
  //   {
  //     crop_name: 'Wheat',
  //     crop_code: 'A01012'
  //   },
  //   {
  //     crop_name: 'PADDY (Dhan)',
  //     crop_code: 'A01012'
  //   },
  // ];


  // yearOfIndent = [
  //   {
  //     'year': '2024-25',
  //     'value': '2024'
  //   },
  //   {
  //     'year': '2023-24',
  //     'value': '2023'
  //   },
  //   {
  //     'year': '2022-23',
  //     'value': '2022'
  //   },
  //   {
  //     'year': '2021-22',
  //     'value': '2021'
  //   }
  // ]
  // seasonlist = [
  //   {
  //     season: 'Kharif',
  //     season_code: 'K'
  //   },
  //   {
  //     season: 'Rabi',
  //     season_code: 'R'
  //   },
  // ];


  Statuslist = [
    {
      Status: 'All'
    },
    {
      Status: 'Generated'
    },
    {
      Status: 'Not Generated'
    }
  ]

  // lotNoDetailsData: any = [
  //   { lot_id: 810, lot_no: "SEP23-0001-001-2 (i)" },
  //   { lot_id: 811, lot_no: "SEP23-0001-001-2 (ii)" },
  //   { lot_id: 812, lot_no: "SEP23-0001-001-2 (iii)" },
  //   { lot_id: 813, lot_no: "SEP23-0001-001-2 (iv)" },
  //   { lot_id: 814, lot_no: "SEP23-0001-001-2 (v)" },
  //   { lot_id: 815, lot_no: "SEP23-0001-001-2 (vi)" },
  // ];


  showTable = false;
  showTable1 = false;
  showTable2 = false;
  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
  dummyData: { variety_id: string; variety_name: string; indent_quantity: number; bsp2Arr: any[]; }[];
  selectCrop: any;
  selectlab: any;
  selectlab1: any;
  selecttreat: any;
  selecttreat1: any;
  selectCrop_group_code: any;
  selectlab_group_code: any;
  selectlab1_group_code: any;
  crop_name_data: any;
  lab_data: any;
  treat_data: any;
  selectCrop_group: string;
  selectlab_group: string;
  selectlab1_group: string;
  selecttreat_group: string;
  selecttreat1_group: string;
  crop_text_check: string;
  lab_text_check: string;
  lab1_text_check: string;
  treat_text_check: string;
  treat1_text_check: string;
  croupGroup: any;
  selectCrop_crop_code: any;
  selectlab_lab_code: any;
  selectlab1_lab_code: any;
  selecttreat_treat_code: any;
  selecttreat1_treat_code: any;
  labs_data: any;
  treats_data: any;
  selectedTable: string;
  formGroup: FormGroup;
  checkboxChecked: boolean = false;
  seedProcessRegisterDta: any;
  carry_over_status: any;
  seedProcessRegisterDataList: any;
  runningNo: any;
  sppCode: any;
  AESKey:string = environment.AESKey;

  // new variable created may 30
  lotDetailsArray: any = [];
  cropDataList: any;
  lotNoDetailsData: any;
  liftingDetails: any;
  tagNoDetailsData: any;
  variety_code: any;
  state_code: any;
  indentorId: any;
  spaId: any;
  variety_line_code: any;
  varietyData;
  bagData = [];
  varietyPricelist = [];
  perUnitPrice: number;
  unit: string;
  reasonData: any;
  variety_name: any;
  indentor_name: any;
  spaName: any;
  allocated_quantity: any;
  breederStack: any;
  totalAmount: any;
  payment_method: any;
  amount: any;
  // Method to handle file input change event
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csv = e.target.result;
        this.parseCSV(csv);
      };
      reader.readAsText(file);
    }
  }

  // Method to parse CSV data
  parseCSV(csv: string) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
  }
  selectTable(table: string) {
    this.selectedTable = table;
  }
  constructor(private service: SeedServiceService, private fb: FormBuilder, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService, private route: Router,
    private renderer: Renderer2
  ) {
    this.createForm();
    this.formGroup = this.formBuilder.group({
      checkboxOption: [false]
    });

  }
  onCheckboxChange(event: any) {
    this.checkboxChecked = event.target.checked;
  }

  selectedTreatment: string = '';
  selectedTreatment1: string = '';
  selectedTreatment2: string = '';
  selectedTreatment3: string = '';
  selectedTreatment4: string = '';
  selectedTreatment5: string = '';
  selectedTreatment6: string = '';

  selectedTreatment7: string = '';
  selectedTreatment8: string = '';
  chemicalName: string = '';
  placeholderText: string = '';

  updatePlaceholder() {
    this.placeholderText = this.chemicalName ? `Chemical Name: ${this.chemicalName}` : 'Enter chemical name';
  }
  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      Status: [],
      cropName: [''],
      crop_text: [''],
      search_click: [''],
      testing_lab_id: [''],
      variety: [''],
      variety_code: [''],
      reason_id: [''],
      dd_no: [''],
      variety_line_code: [''],
      crop_code: [''],
      variety_array: [''],
      indenter_array: [''],
      spa_array: [''],
      mou_amt: [''],
      mougst_amt: [''],
      mougst_amt_total: [''],
      totalgst_per: [''],
      totalgst_amt: [''],
      ppvgst_amt: [''],
      rltgst_amt: [''],
      rltgst_amt_total: [''],
      licence_amt: [''],
      licencegst_amt: [],
      licencegst_amt_total: [],
      ppv_amt: [],
      rlt_amt: [],
      other_charge: [],
      oth_amt: [],
      othgst_amt: [],
      othgst_amt_total: [],
      total_amt: [],
      grand_total_amt: [],
      final_grand_total_amt: [],
      ppvgst_amt_total: [],
      draft: [],
      total_final_amount:[],
      inventoryItems: this.fb.array([
        // this.inventoryItemsForms()
      ]),
      inventory_item_array: this.fb.array([
        // this.inventoryItemsArrayForms(),
      ]),
      selectedCharges: [],
    })
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_text'].disable();
    this.ngForm.controls['search_click'].disable();
    this.ngForm.controls['totalgst_amt'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop_text'].disable();
        this.ngForm.controls['search_click'].disable();
        this.variety_code=''
        this.selectCrop = "";
        // this.generateSampleSlipData.clear();
        this.liftingSeasonData();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_text'].enable();
        this.ngForm.controls['search_click'].disable();
        // this.generateSampleSlipData.clear();
        this.selectCrop = "";
        this.variety_code='';
        this.liftingCropData();
      }
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.ngForm.controls['search_click'].enable();
        this.cropName = this.cropNameSecond
        let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropName = response
      }
    });
    this.ngForm.controls['variety_array'].valueChanges.subscribe(newValue => {
      this.variety_code='';
      this.liftingTableData()
    });
    this.ngForm.controls['indenter_array'].valueChanges.subscribe(newValue => {
      this.liftingTableData()
    });
    this.ngForm.controls['spa_array'].valueChanges.subscribe(newValue => {
      this.liftingTableData()
    });
  }
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  get inventoryItems(): FormArray {
    return this.ngForm.get('inventoryItems') as FormArray;
  }
  get inventory_item_array(): FormArray {
    return this.ngForm.get('inventory_item_array') as FormArray;
  }


  ngOnInit(): void {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.sppCode = data.code;
    this.liftingYearData();
    this.liftingTableData(null);
    // this.lotNoData();
    this.fetchData();
    this.calculateGrandTotal();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'tag_no',
      textField: 'tag_no',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    // this.dropdownSettings2 = {
    //   singleSelection: false,
    //   idField: 'variety_id',
    //   textField: 'variety_name',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
    this.dropdownSettingsVariety = {
      singleSelection: false,
      idField: 'variety_id',
      textField: 'variety_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true

      // singleSelection: false,
      // idField: 'variety_id',
      // textField: 'variety_name',
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      // allowSearchFilter: true
    };
    this.dropdownSettings3 = {
      singleSelection: false,
      idField: 'indent_of_breeder_id',
      textField: 'state_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownSettings4 = {
      singleSelection: false,
      idField: 'spa_code',
      textField: 'agency_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getReason()
  }
  liftingTableData(data = null): void {
    const route = "get-lifting-table-data";
    let variety = this.ngForm.controls['variety_array'].value;
    let indentor = this.ngForm.controls['indenter_array'].value;
    let spaArray = this.ngForm.controls['spa_array'].value;
    let varietyData = [];
    let indentorData = [];
    let spaData = []
    if (variety && variety.length > 0) {
      variety.forEach((el => {
        varietyData.push(el && el.variety_id ? el.variety_id : '')
      }))
    }
    if (indentor && indentor.length > 0) {
      indentor.forEach((el => {
        indentorData.push(el && el.indent_of_breeder_id ? el.indent_of_breeder_id : '')
      }))
    }
    if (spaArray && spaArray.length > 0) {
      spaArray.forEach((el => {
        spaData.push(el && el.spa_code ? el.spa_code : '')
      }))
    }
    const matchedSPAs = [];
    if (spaData && spaData.length > 0) {
      // this.allData.forEach(el=>)    
      this.allData.forEach(variety => {
        variety.allocation_to_indentor_for_lifting_seed_production_cnter.forEach(indentor => {
          indentor.spas.forEach(spa => {
            if (spaData.includes(spa.spa_code)) {
              matchedSPAs.push(indentor.indent);
            }
          });
        });
      });
    }

    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        variety_id: varietyData && varietyData.length > 0 ? varietyData : '',
        indenter_id: indentorData && indentorData.length > 0 ? indentorData : "",
        spa_code: spaData && spaData.length ? spaData : '',
        indenter: matchedSPAs && matchedSPAs.length > 0 ? matchedSPAs : ''

      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        let response = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : "";
        const outputArray = response.map(item => ({
          variety_id: item.variety_id,
          variety_name: item.variety_name,
          variety_code: item.variety_code,
          variety_line_code: item.variety_line_code,
          m_crop_variety: item.m_crop_variety,
          allocation_to_indentor_for_lifting_seed_production_cnter: {
            id: item.allocation_to_indentor_for_lifting_seed_production_cnter.id,
            spas: item.spas,
            indent: item.allocation_to_indentor_for_lifting_seed_production_cnter.indent,
            user: item.allocation_to_indentor_for_lifting_seed_production_cnter.user
          }
        }));
        let transformedData = {};

        // Iterate through each object in the original data
        outputArray.forEach(item => {
          // Extract variety_id to use as key
          let varietyId = item.variety_id;

          // Check if this variety_id already exists in transformedData
          if (!transformedData[varietyId]) {
            // If not, initialize it with an array containing the first item
            transformedData[varietyId] = {
              ...item,
              allocation_to_indentor_for_lifting_seed_production_cnter: [item.allocation_to_indentor_for_lifting_seed_production_cnter]
            };
          } else {
            // If exists, push the allocation_to_indentor_for_lifting_seed_production_cnter to the array
            transformedData[varietyId].allocation_to_indentor_for_lifting_seed_production_cnter.push(item.allocation_to_indentor_for_lifting_seed_production_cnter);
          }
        });

        // Convert transformedData object back to array format
        let result = Object.values(transformedData);
        if (result && result.length > 0) {
          result.forEach(el => {
            el['allocation_to_indentor_for_lifting_seed_production_cnter'] = el['allocation_to_indentor_for_lifting_seed_production_cnter'].filter((arr, index, self) =>
              index === self.findIndex((t) => (t.indent === arr.indent)))

          })
        }

        if (result && result.length > 0) {
          result.forEach(el => {
            el['totoalSpas'] = []
          })
          result.forEach(el => {
            el['allocation_to_indentor_for_lifting_seed_production_cnter'].forEach((val => {
              el['totoalSpas'].push(...val.spas)
            }))
          })
        }
        // if(result && result.length>0){
        //   result.forEach(el=>{
        //         el['allocation_to_indentor_for_lifting_seed_production_cnter'] = el['allocation_to_indentor_for_lifting_seed_production_cnter'].filter((arr, index, self) =>
        //     index === self.findIndex((t) => (t.indent === arr.indent )))

        //   })
        // }
        console.log('result',result)
        this.allData = result;
        let filerData = []

        // if(data){
        //   this.liftingDetails =  res.EncryptedResponse.data.filter(ele=>ele.Variety===data.Variety) || [];
        //   this.ngForm.controls['variety_code'].setValue(this.liftingDetails && this.liftingDetails[0] && this.liftingDetails[0].variety_code)       
        //   this.allData = res.EncryptedResponse.data || [];       
        // }else{
        //   this.allData = res.EncryptedResponse.data || [];
        //  
        // }

      } else {
        this.allData = [];
      }
    }, error => {
      console.error('API Error:', error);
      this.allData = [];
    });
  }
  // lotNoData()
  liftingVarietyData(): void {
    const route = "get-lifting-variety";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.varietyData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
      }
    })
  }

  onVarietySelect(item: any) {
    console.log('Variety selected:', item);
  }

  onVarietySelectAll(items: any) {
    console.log('All varieties selected:', items);
  }

  liftingIndenterData(): void {
    const route = "get-lifting-indenter";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList2 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : ''
      } else {
        this.dropdownList2 = [];
      }
    }, error => {
      this.dropdownList2 = [];
    });
  }

  onIndenterSelect(item: any) {
    console.log('Indenter selected:', item);
  }

  onIndenterSelectAll(items: any) {
    console.log('All indenters selected:', items);
  }

  liftingSPAData(): void {
    const route = "get-lifting-spa";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList3 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
      }
    })
  }

  onSPASelect(item: any) {
    console.log('SPA selected:', item);
  }

  onSPASelectAll(items: any) {
    console.log('All SPAs selected:', items);
  }
  liftingTagNoData(): void {
    const route = "get-lifting-tag-no";
    const param = {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop_code'].value,
        variety_code: this.variety_code ?   this.variety_code : this.ngForm.controls['variety_code'].value,
        parental_line:this.variety_line_code ? this.variety_line_code:''
      }
    };

    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.dropdownList4 = (res.EncryptedResponse.data || []).map(item => {
          return { id: item.tag_no, tag_no: item.tag_no, lot_id: item.lot_id, lot_no: item.lot_no, no_of_bags: item.no_of_bags, bag_size: item.bag_size, tag_id: item.tag_id };
        });
      } else {
        this.dropdownList4 = [];
      }
    }, error => {
      this.dropdownList4 = [];
    });
    console.log(this.dropdownList4,'this.dropdownList4')
    if(this.dropdownList4 &&this.dropdownList4.length>0){
      this.dropdownList4= this.dropdownList4.sort((a, b) => b.tag_id - a.tag_id)
    }
  }


  onTagNoSelect(item: any) {
    console.log('Tag No selected:', item);
  }

  onTagNoSelectAll(items: any) {
    console.log('All Tag Nos selected:', items);
  }

  liftingYearData() {
    let route = "get-lifting-year";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
  // generateSampleSlipVarietyData() {
  //   let route = "get-generate-sample-slip-variety-data";
  //   let param = {
  //     "year": this.ngForm.controls['year'].value,
  //     "season": this.ngForm.controls['season'].value,
  //     "crop_code": this.ngForm.controls['crop_code'].value,
  //   }
  //   this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
  //     if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
  //       this.dropdownList1 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
  //     }
  //   });
  // }

  liftingSeasonData() {
    let route = "get-lifting-season";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  liftingCropData() {
    let route = "get-lifting-crop-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        // "crop_code": "A0120"
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.cropName = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        this.cropNameSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];

      }
    });
  }
  liftingLotNoData() {
    let route = "get-lifting-lot-no-data-v1";
    let param = {

      year: this.ngForm.controls['year'].value,
      season: this.ngForm.controls['season'].value,
      crop_code: this.ngForm.controls['crop_code'].value,
      variety_code:   this.variety_code ?   this.variety_code : this.ngForm.controls['variety_code'].value,
      veriety_array: this.ngForm.controls['variety_array'].value
      

    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.lotNoDetailsData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  selcetAll(event) {
    if (event && event.length > 0) {
      this.ngForm.controls["variety_array"].patchValue(event);
      this.seedProcessRegisterData(null)
    }
  }
  seedProcessRegisterData(item) {
    let varietyCodeValue = [];
    if (this.ngForm.controls['variety_array'].value && this.ngForm.controls['variety_array'].value.length) {
      this.ngForm.controls['variety_array'].value.forEach(ele => {
        varietyCodeValue.push(ele.variety_code);
      })
    }
    let route = "get-seed-processing-register-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
        "variety_code_array": varietyCodeValue && varietyCodeValue.length ? varietyCodeValue : []
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seedProcessRegisterDataList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        // this.generateSampleSlipData.clear();
        // this.fetchDataValue(null);
      }
    });
  }

  // generateSampleSlipVarietyData() {
  //   let route = "get-generate-sample-slip-variety-data";
  //   let param = {
  //     "year": this.ngForm.controls['year'].value,
  //     "season": this.ngForm.controls['season'].value,
  //     "crop_code": this.ngForm.controls['crop_code'].value,
  //   }
  //   this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
  //     if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
  //       this.dropdownList1 = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
  //     }
  //   });
  // }
  inventoryItemsArrayForms() {
    let temp = this.fb.group({
      tag_no: ['',],
      lot_no: ['',],
      lot_id: [''],
      // bag_weight: ['100',],
      // no_of_bags: ['50',],
      bag_weight: ['120'],
      no_of_bags:['30'],
      qnt_of_lifting: [''],
      mrp_per_unit: [''],
      total_amt: [''],
      tag_data: [''],
      // tag_data:['']
    });
    return temp;
  }

  inventoryItemsForms() {
    let temp = this.fb.group({
      tag_no: ['',],
      lot_no: ['',],
      bag_weight: ['150',],
      no_of_bags: ['25',],
      qnt_of_lifting: [''],
      mrp_per_unit: [''],
      total_amt: [''],
      lot_id: [''],
      tag_no_details_data: [''],
      bag_size: [''],
      tag_data: ['']
    });
    return temp;
  }
  // tag_no_details_data
  selectTagDetails(event, i) {
    let lotDetails = this.lotNoDetailsData.filter(item => item.lot_no == event.target.value)
    console.log(lotDetails,'lotDetails')
    if (lotDetails && lotDetails.length) {
      // this.ngForm.controls['inventory_item_array']['controls'][i].controls['lot_id'].setValue(lotDetails && lotDetails[0] && lotDetails[0].lot_no ? lotDetails[0].lot_no:'' )    
      this.ngForm.controls['inventoryItems']['controls'][i].controls['lot_id'].setValue(lotDetails && lotDetails[0] && lotDetails[0].lot_id ? lotDetails[0].lot_id : '')
      let tagNoDetailsData = this.dropdownList4.filter(item => item.lot_no == this.ngForm.controls['inventoryItems']['controls'][i].controls['lot_no'].value);
      this.ngForm.controls['inventoryItems']['controls'][i].controls['tag_no_details_data'].setValue(tagNoDetailsData)
      this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size'].setValue(lotDetails && lotDetails[0] && lotDetails[0].bag_weight ? lotDetails[0].bag_weight : '')
    }
  }
  selectNoOfBag(event, i) {
    let bagSize = this.dropdownList4.filter(item => item.tag_no == event.tag_no);
    let datas;
    if (bagSize && bagSize.length > 0) {
      bagSize.forEach((el => {
        el['key'] = i
      }))
    }
    this.bagData.push(bagSize)
    if (this.bagData && this.bagData.length > 0) {
      datas = this.bagData ? this.bagData.flat() : '';
    }
    if (datas && datas.length > 0) {
      let sum = 0
      datas.forEach((val => {
        if (val.key == i) {
          sum += val.bag_size;
          // this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_size'].setValue(sum)
        }
      }))

    }
    // this.ngForm.controls['inventory_item_array']['controls'][i].controls['tag_data'].setValue(bagSize)
    this.ngForm.controls['inventoryItems']['controls'][i].controls['tag_data'].setValue(bagSize)
    this.ngForm.controls['inventoryItems']['controls'][i].controls['no_of_bags'].setValue(bagSize[0].no_of_bags)
    this.ngForm.controls['inventoryItems']['controls'][i].controls['bag_weight'].setValue(bagSize[0].bag_size)
  }

  addItem() {
    this.inventoryItems.push(this.inventoryItemsForms());
  }


  deleteItem(index: number) {
    this.inventoryItems.removeAt(index);
  }
  addToTable(inventoryItems) {
    this.visibleTable = true;
    this.fetchInviceData();
  }
  grandTotal = 0;
  
  calculateCharges() {
    this.ngForm.controls['final_grand_total_amt'].setValue(
      parseFloat(this.ngForm.controls['licence_amt'].value ? this.ngForm.controls['licence_amt'].value : 0) +
      parseFloat(this.ngForm.controls['mou_amt'].value ? this.ngForm.controls['mou_amt'].value : 0) +
    parseFloat(this.ngForm.controls['ppv_amt'].value ? this.ngForm.controls['ppv_amt'].value : 0) +
    parseFloat(this.ngForm.controls['rlt_amt'].value ? this.ngForm.controls['rlt_amt'].value : 0) +
      parseFloat(this.grandTotal ? this.grandTotal : this.ngForm.controls['grand_total_amt'].value ? this.ngForm.controls['grand_total_amt'].value : 0));
  }
  calculategstCharges(event) {
    this.ngForm.controls['final_grand_total_amt'].setValue(
      parseFloat(((this.ngForm.controls['licence_amt'].value) + (this.ngForm.controls['licence_amt'].value * this.ngForm.controls['licencegst_amt'].value) / 100)) +
      parseFloat(((this.ngForm.controls['mou_amt'].value) + (this.ngForm.controls['mou_amt'].value * this.ngForm.controls['mougst_amt'].value) / 100)) +
    // parseFloat(((this.ngForm.controls['ppv_amt'].value) + (this.ngForm.controls['ppv_amt'].value * this.ngForm.controls['ppvgst_amt'].value) / 100)) +
    // parseFloat(((this.ngForm.controls['rlt_amt'].value) + (this.ngForm.controls['rlt_amt'].value * this.ngForm.controls['rltgst_amt'].value) / 100)) +
      parseFloat(this.grandTotal ? this.grandTotal : this.ngForm.controls['grand_total_amt'].value ? this.ngForm.controls['grand_total_amt'].value : 0));
  }
  onDeSelectAll(event) {

  }
  onItemSelect(item: any) {
    switch (item.id) {
      case 1:
        this.visibleMouCharges = true
        break;
      case 2:
        this.visibleLicenceCharges = true;
        break;
      case 3:
        this.visibleppvCharges = true;
        break;
      case 4:
        this.visiblerltCharges = true;
        break;
      case 5:
        this.visibleOtherCharges = true;
        break;
      default:
        this.visibleMouCharges = false
        this.visibleLicenceCharges = false;
        this.visibleppvCharges = false;
        this.visiblerltCharges = false;
        this.visibleOtherCharges = true;
    }
  }
  // Method to handle item deselection from the dropdown
  onItemDeSelect(item: any) {
    switch (item.id) {
      case 1:
        this.visibleMouCharges = false;
        this.removeChargeRow('mou_amt', 'mougst_amt', 'mougst_amt_total');
        break;
      case 2:
        this.visibleLicenceCharges = false;
        this.removeChargeRow('licence_amt', 'licencegst_amt', 'licencegst_amt_total');
        break;
      case 3:
        this.visibleppvCharges = false;
        this.removeChargeRow('ppv_amt', 'ppvgst_amt', 'ppvgst_amt_total');
        break;
      case 4:
        this.visiblerltCharges = false;
        this.removeChargeRow('rlt_amt', 'rltgst_amt', 'rltgst_amt_total');
        break;
    }
  }
  removeChargeRow(arg0: string, arg1: string, arg2: string) {
    throw new Error('Method not implemented.');
  }
  onDeSelect(item) {
    // this.selectedItems = [];
    switch (item) {
      case 1:
        this.visibleMouCharges = false
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        break;
      case 2:
        this.visibleLicenceCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        break;
      case 3:
        this.visibleppvCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        break;
      case 4:
        this.visiblerltCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        break;
      case 5:
        this.visibleOtherCharges = false;
        this.selectedItems = this.selectedItems.filter(ele => ele.id !== item);
        break;
      default:
      // this.visibleMouCharges = false
      // this.visibleLicenceCharges = false;
      // this.visibleppvCharges = false;
      // this.visiblerltCharges = false;
      // this.visibleOtherCharges = true;
    }
  }
  // Method to handle radio button change
  toggleTableDisplay() {
    this.showTable = true;
  }
  toggleTableDisplay1() {
    this.showTable1 = true;
  }
  toggleTableDisplay2() {
    this.showTable2 = true;
  }

  onSelectAll(items: any) {
    this.visibleMouCharges = true
    this.visibleLicenceCharges = true;
    this.visibleppvCharges = true;
    this.visiblerltCharges = true;
    // this.visibleOtherCharges = true;
    // this.visibleOtherCharges = true;
  }





  fetchData() {
    // this.getPageData();e

  }

  // getCropData() {
  //   this.cropNameSecond
  // }



  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  save(data) {
    console.log(data)

  }
  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }

  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    this.getUnit(item.crop_code)
    // this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check = 'crop_group'
  }
  cropdatatext() {
    this.cropNameSecond;
  }
  onScanSuccess(data: any) {
    console.log('Scanned data:', data);
  }
  startScan() {
    console.log('Starting scan...');
  }
  addTagNoItem() {
    // this.inventoryItems.clear();
    this.addItem();
  }
  fetchInviceData() {
    if (this.ngForm.controls['inventoryItems'].value) {
      this.ngForm.controls['inventoryItems'].value.forEach(ele => {
        this.lotDetailsArray.push(ele);
      })
      let finalArray = [];
      if (this.lotDetailsArray && this.lotDetailsArray.length) {
        finalArray = this.lotDetailsArray;
      }
      console.log('finalArray=====', finalArray);
      for (let i = 0; i < finalArray.length; i++) {
        if (finalArray.length > 1) {
          this.remove(i);
        }
        this.addMore();
        // Filter array1 to include only objects that are in array2 based on 'id' property
        const filteredArray = this.dropdownList4.filter(obj1 =>
          finalArray[i].tag_no.some(obj2 => obj2.tag_no === obj1.tag_no)
        );
        // let bagSize = this.dropdownList4.filter(item => item.tag_no == event.tag_no);
        this.ngForm.controls['inventory_item_array']['controls'][i].controls['tag_data'].setValue(filteredArray)
        // let lotDetails = this.lotNoDetailsData.filter(item => item.lot_id == this.ngForm.controls['inventoryItems']['controls'][i].controls['lot_id'].value)
        console.log('lotDetails===', filteredArray)
        // if (lotDetails && lotDetails.length) {
        // this.ngForm.controls['inventory_item_array']['controls'][i].controls['lot_id'].setValue(lotDetails && lotDetails[0] && lotDetails[0].lot_id ? lotDetails[0].lot_id : '')
        let sum = 0
        if (filteredArray && filteredArray.length > 0) {
          filteredArray.forEach(el => {
            sum += el.bag_size;
            this.ngForm.controls['inventory_item_array']['controls'][i].controls['bag_weight'].setValue(el.bag_size)
            // this.ngForm.controls['inventory_item_array']['controls'][i].controls['qnt_of_lifting'].setValue(el.tag_no.length *sum )
          })

        }
        this.ngForm.controls['inventory_item_array']['controls'][i].patchValue({
          lot_no: [finalArray[i].lot_no ? finalArray[i].lot_no : 0],
          lot_id: [finalArray[i].lot_id ? finalArray[i].lot_id : 0],
          tag_no: [finalArray[i].tag_no ? finalArray[i].tag_no : 0],
          // bag_weight: [finalArray[i].bag_weight ? finalArray[i].bag_weight : 0],
          no_of_bags: [finalArray[i].tag_no ? finalArray[i].tag_no.length : 0],
          qnt_of_lifting: [finalArray[i].bag_weight ? (finalArray[i].tag_no.length * finalArray[i].bag_weight) : 0],
          mrp_per_unit: [this.perUnitPrice ? this.perUnitPrice : 0],
          total_amt: [finalArray[i].tag_no ? (finalArray[i].tag_no.length * this.perUnitPrice) : 0],

        });

      }
      let inventory_item_arrayData = this.ngForm.value && this.ngForm.value.inventory_item_array ? this.ngForm.value.inventory_item_array : ''
      console.log(inventory_item_arrayData,'inventory_item_arrayDatainventory_item_arrayData')
      let sum=0
      if(inventory_item_arrayData && inventory_item_arrayData.length>0){
        inventory_item_arrayData.forEach((el=>{
          sum+=el['mrp_per_unit'][0]
        }))
      }
      this.ngForm.controls['grand_total_amt'].setValue(sum)

      this.inventoryItems.clear();
      this.addItem();
    }
  }
  getTagNo(data, i) {
    let tagNo = []
    if (data && data[i] && data[i].length) {
      data[i].forEach(ele => {
        tagNo.push(ele.tag_no);
      })
    }
    let tagNoArray = tagNo.toString();

    return tagNoArray;
  }
  selectOption(option: string) {
    this.selectedOption = option;
  }
  addMore() {
    this.inventory_item_array.push(this.inventoryItemsArrayForms());
  }

  remove(index: number) {
    this.inventory_item_array.removeAt(index);
  }
  calculateGrandTotal() {
    const controls = this.ngForm.get('bspc') as FormArray;
    if (controls) {
      const sumOfTotal = controls.controls.reduce((sum, control) => {
        return sum + control.get('total_amount_for_each_bag_weight').value;
      }, 0);
      this.ngForm.get('grand_total_amt').setValue(sumOfTotal);
    }
  }

  sumValue(event, i) {
    // alert('h111')
    this.ngForm.controls['inventory_item_array']['controls'][i].controls['total_amt'].setValue((event.target.value) * (this.ngForm.controls['inventory_item_array']['controls'][i].controls['no_of_bags'].value));
    let sumOfTotal = 0;
    this.ngForm.controls['inventory_item_array'].value.forEach((ele, i) => {
      sumOfTotal += parseInt(this.ngForm.controls['inventory_item_array']['controls'][i].controls['total_amt'].value);
    });
    this.ngForm.controls['grand_total_amt'].setValue(sumOfTotal);
  }
  gstCalculateValue(event,key=null) {
    console.log(event,'event')

    if (event == "sum") {
      this.ngForm.controls['totalgst_amt'].setValue((this.ngForm.controls['grand_total_amt'].value * this.ngForm.controls['totalgst_per'].value) / 100);
      this.grandTotal = this.ngForm.controls['totalgst_amt'].value + this.ngForm.controls['grand_total_amt'].value;
      // alert('hii')

    } else {
      // alert('hii2')
      // licencegst_amt
      let data = this.ngForm.value.inventory_item_array;
      let sum=0;
      if(data && data.length>0){
        data.forEach(el=>{
          sum+=Number(el.total_amt)
        })
      }
      if(key==null){
        this.ngForm.controls['totalgst_amt'].setValue((sum * event.target.value) / 100);
      }
      this.grandTotal =Number(sum) + parseFloat(this.ngForm.controls['totalgst_amt'].value);
      let amount = this.amount ? this.amount:0;
      if(this.ngForm.controls['final_grand_total_amt'].value){

        let totalAmount=Number(this.ngForm.controls['final_grand_total_amt'].value) - Number(amount);
        console.log(totalAmount,'totalAmounttotalAmount')
        this.ngForm.controls['total_final_amount'].setValue(totalAmount? totalAmount:0)
        console.log( this.ngForm.controls['total_final_amount'].value,'vvv')
      }

    }
  }


  toggleSearch() {
    this.searchClicked = true;
    this.liftingTableData(null);
    this.liftingVarietyData();
    this.liftingIndenterData();
    this.liftingSPAData();
  }
  toggleSearchFirst(data, item, val) {
    // this.renderer.setProperty(window, 'scrollTo', { top: 0, behavior: 'smooth' });
    this.liftingTagNoData();
    this.liftingLotNoData();

    this.variety_code = data && data.variety_code ? data.variety_code : '';
    this.variety_name = data && data.variety_name ? data.variety_name : '';
    this.indentorId = item && item.indent ? item.indent : '';
    this.spaId  = val && val.spa_code ? val.spa_code : '';
    this.state_code = val && val.state_code ? val.state_code : '';
    this.variety_line_code = data && data.variety_line_code ? data.variety_line_code : '';
    this.indentor_name=item && item.user && item.user.n ? item.user.n:'NA';
    this.spaName = val && val.name  ? val.name:"NA"
    this.allocated_quantity=val && val.allocated_quantity  ? val.allocated_quantity:"NA";
    this.liftingTableData(data);
    this.getVarietyData()
    this.getInvoiceData()
    this.searchClicked1 = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }
  getVarietyData() {
    const param = {
      search: {
        variety_code: this.variety_code,
        variety_line_code: this.variety_line_code,
        crop: this.ngForm.controls['crop_code'].value,
        year:this.ngForm.controls['year'].value,
        season:this.ngForm.controls['season'].value,
        // crop:this.ngForm.controls['crop_code'].value,
      }
    }
    this._productionCenter.postRequestCreator('get-variety-price-data', param).subscribe(apiResponse => {
      let result = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : '';
      // let datas=result && result.package_data ? result.package_data:'';
      // let datas = []
      // if (result && result.length > 0) {
      //   result.forEach((el => {
      //     datas.push(el.package_data)
      //   }))
      // }
      // console.log(datas, 'datas')
      // let res;
      // if (datas && datas.length > 0) {
      //   res = datas ? datas.flat() : ''
      // }
      // this.varietyPricelist=[]
      // this.varietyPricelist.push(datas)
      if (result && result.length > 0) {
        let sum = 0;
        result.forEach(el => {
          sum += el.per_qnt_mrp;
        })
        this.perUnitPrice = sum
        // this.ngForm.controls['totalgst_per'].setValue(sum)
        console.log(result, 'resultresult')
      }
    })
  }
  saveFormData() {
    if (this.ngForm.invalid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    let route = "add-lifting-data";
    let data = []
    let additionCharges = [];
    if (this.ngForm.controls['selectedCharges'].value) {
      this.ngForm.controls['selectedCharges'].value.forEach(ele => {
        if (ele && ele.charges === "Mou charges") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['mougst_amt'].value,
              additional_charges_id: ele.id,
              total_amount: this.ngForm.controls['mou_amt'].value,
              after_apply_gst: ((this.ngForm.controls['mou_amt'].value) + (this.ngForm.controls['mou_amt'].value * this.ngForm.controls['mougst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "License fee") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['licencegst_amt'].value,
              additional_charges_id: ele.id,
              total_amount: this.ngForm.controls['licence_amt'].value,
              after_apply_gst: ((this.ngForm.controls['licence_amt'].value) + (this.ngForm.controls['licence_amt'].value * this.ngForm.controls['licencegst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "PPV fee") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['ppvgst_amt'].value,
              additional_charges_id: ele.id,
              total_amount: this.ngForm.controls['ppv_amt'].value,
              after_apply_gst: ((this.ngForm.controls['ppv_amt'].value) + (this.ngForm.controls['ppv_amt'].value * this.ngForm.controls['ppvgst_amt'].value) / 100)
            }
          );
        }
        if (ele && ele.charges === "Royalty") {
          additionCharges.push(
            {
              gst: this.ngForm.controls['rltgst_amt'].value,
              additional_charges_id: ele.id,
              total_amount: this.ngForm.controls['rlt_amt'].value,
              after_apply_gst: ((this.ngForm.controls['rlt_amt'].value) + (this.ngForm.controls['rlt_amt'].value * this.ngForm.controls['rltgst_amt'].value) / 100)
            }
          );
        }
      })
    }
    for (let key of this.ngForm.controls['inventory_item_array'].value) {
      let tagNoArray = [];
      if (key.tag_no && key.tag_no.length) {
        key.tag_no.forEach((element, i) => {
          if (element) {
            element.forEach(ele => {
              tagNoArray.push({ "tag_no": ele.tag_no, "tag_size": parseFloat(key.bag_weight) })
            })
          }
        });
      }
      // this.variety_code = data && data.variety_code ? data.variety_code:'';
      // this.indentorId = item && item.indent ? item.indent:'';
      // this.spaId = val && val.spa_code ? val.spa_code:'';
      // this.state_code = val && val.state_code ? val.state_code:'';
      console.log('tres',key)
      data.push({
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
        "variety_code": this.variety_code,
        "variety_line_code": this.variety_line_code ? this.variety_line_code : null,
        "indentor_id": this.indentorId ? this.indentorId : null,
        "spa_state_code": this.state_code ? this.state_code : null,
        "spa_code": this.spaId ? this.spaId : null,
        "reason_id": this.ngForm.controls['reason_id'].value,
        "paid_by": this.ngForm.controls['draft'].value,
        "payment_method_no": this.ngForm.controls['dd_no'].value,
        "per_unit_price": key.mrp_per_unit,
        "breeder_class": key.breeder_class ? key.breeder_class : 'Breeder I',
        "bag_weight": key.bag_weight ? key.bag_weight : '',
        "no_of_bag": key.no_of_bags ? key.no_of_bags : '',
        "total_price": key.total_amt ? key.total_amt : '',
        "tag_data": key.tag_data ? key.tag_data : '',
        "final_amt":this.ngForm.controls['final_grand_total_amt'].value-this.amount,
        "total_lifting_price":this.ngForm.controls['final_grand_total_amt'].value ? this.ngForm.controls['final_grand_total_amt'].value:this.ngForm.controls['grand_total_amt'].value,
        "lifting_lots": [
          {
            "lot_no": key && key.lot_no ? key.lot_no.toString() : '',
            "lot_id": key && key.lot_id ? key.lot_id.toString() : '',

          }
        ],
        "lifting_tags": tagNoArray ? tagNoArray : [],

        "lifting_charges": additionCharges ? additionCharges : []
      });
    }
    const lifting_lots = data.flatMap(item => item.lifting_lots);

    // 2. Combine all tag_data
    const tag_data = data.flatMap(item => item.tag_data);

    // 3. Use the first item as the base and extend it
    const result =

    {
      ...data[0],
      lifting_lots,
      tag_data
    };

    // 4. Remove duplicated lifting_tags
    result.lifting_tags = data.flatMap(item => item.lifting_tags);
    console.log('tres',result)
   

    this._productionCenter.postRequestCreator(route, { "data": result }, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        let liftingData=res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data:'';
         let liftingId =liftingData && liftingData.id ? liftingData.id :''
        // Swal.fire({
        //   title: '<p style="font-size:25px;">View Bill Receipt</p>',
        //   icon: 'success',
        //   confirmButtonText:
        //     'OK',
        //   confirmButtonColor: '#E97E15'
        // }.then(is));
        Swal.fire({
          title: '<p style="font-size:25px;">Lifting Data Saved Successfully </p>',
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "View Bill Receipt",
          // denyButtonText: `Don't save`,
          confirmButtonColor: '#E97E15'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            let data = {
              year: this.ngForm.controls["year"].value ? this.ngForm.controls["year"].value : "",
              season: this.ngForm.controls["season"].value ? this.ngForm.controls["season"].value : "",
              crop_code: this.ngForm.controls['crop_code'].value ? this.ngForm.controls['crop_code'].value : "",
              variety_code: this.ngForm.controls['variety_code'].value ? this.ngForm.controls['variety_code'].value : "",
            };
            this._productionCenter.liftingData = data ? data : [];
            console.log(this.AESKey,'this.AESKey')
            const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id:liftingId}), this.AESKey).toString();
            let encryptedData = encodeURIComponent(encryptedForm);
            console.log('encryptedData=================>',encryptedData)
            const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), this.AESKey);
            let decryptedId = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;
            console.log('decryptedId=================>',decryptedId)
            encryptedData= encryptedData ? encryptedData.trim():'';
          // this.route.navigate(['Bill-Receipt/'+encryptedData]);
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
          }
        });
        // this.checkRunningNumber();

      } else if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 400) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Fill All Mandatory Field And Lot Details.</p>',
          icon: 'warning',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    })
  }
  getUnit(item) {
    let value = this.ngForm.controls['crop_code'].value && (this.ngForm.controls['crop_code'].value.slice(0, 1)) == 'A' ? 'Qt' : 'Kg';
    this.unit = value
    return value

  }
  getReason() {
    this._productionCenter.postRequestCreator('get-commnets-list',null).subscribe(apiresponse=>{
      let res =apiresponse && apiresponse.EncryptedResponse && apiresponse.EncryptedResponse.data ? apiresponse.EncryptedResponse.data:'';
      this.reasonData= res ;
    })
  }
  getInvoiceData(){
    const param = {
      search: {
        variety_code: this.variety_code,
        variety_line_code: this.variety_line_code,
        crop_code: this.ngForm.controls['crop_code'].value,
        year:this.ngForm.controls['year'].value,
        season:this.ngForm.controls['season'].value,
        indenter_id:this.indentorId ? this.indentorId:'',
        spa_code:this.spaId ? this.spaId :'',
        state_code:this.state_code ? this.state_code:''
        // crop:this.ngForm.controls['crop_code'].value,
      }
    }
    this._productionCenter.postRequestCreator('get-generate-invoice-data',param).subscribe(apiResponse=>{
      let data = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data:'';
      this.breederStack=data;
     let res = data.filter((arr, index, self) =>
    index === self.findIndex((t) => (t.receipt_requestsid === arr.receipt_requestsid)))
    this.totalAmount= res && res[0] && res[0].grand_total ? res[0].grand_total:'';
     this.payment_method= res && res[0] && res[0].payment_method ? res[0].payment_method:'';
     this.amount= res && res[0] && res[0].amount ? res[0].amount:0
      console.log(data,'datadatadata') 
    })

  }
}

