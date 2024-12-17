import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions, IMyDate, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { checkDecimal } from 'src/app/_helpers/utility';
import * as html2PDF from 'html2pdf.js';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { MasterService } from '../services/master/master.service';
// import { MasterService } from '../services/master.service';e

@Component({
  selector: 'app-processed-register-old-stock',
  templateUrl: './processed-register-old-stock.component.html',
  styleUrls: ['./processed-register-old-stock.component.css']
})
export class ProcessedRegisterOldStockComponent implements OnInit {


  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData = []

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  yearData;
  seasonlist;
  bagMarkDataofInvest;
  typeofSeed = [
    {
      name: 'Processed Seed (PS)',
      id: 1
    }
  ];
  showparental = false;
  disableUpperSection = false;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  Variety = [
    {
      'variety_code': 'A0120',
      'variety_name': 'Variety 1'
    },
    {
      'variety_code': 'A0121',
      'variety_name': 'Variety 2'
    },
  ]
  BagMarka = [
    {
      'id': 1,
      'bags': 'Bag 1'
    },
    {
      'id': 2,
      'bags': 'Bag 2'
    },
  ]
  carddata = [
    {
      purt_seed: 22,
      crop_name: "Wheat",
      id: 1,
      inert_matter: 23,
      varietyName: "PUSA",
      germination: '23',
      Label_Number: 23,
      lot_number: 23,
      date_of_test: 23

    },
    {
      purt_seed: 22,
      crop_name: "Wheat",
      id: 1,
      inert_matter: 23,
      varietyName: "PUSA",
      germination: '23',
      Label_Number: 23,
      lot_number: 23,
      date_of_test: 23

    },

  ];
  productiuon_name;
  breederaddress;
  productiuon_short_name;
  contactPersonName;
  designationname;

  cropData = [
    {
      crop_code: 'A0120',
      crop_name: 'Pusa'
    },
    {
      season: 'A0121',
      crop_name: 'Wheat'
    },
  ];
  tagsDetails = [
    {
      no_of_bags: 50,
      bag_weigth: 20,
      qty: 40
    },
    {
      no_of_bags: 40,
      bag_weigth: 10,
      qty: 50
    },
  ]

  todayDate = new Date();
  parsedDate = Date.parse(this.todayDate.toString());
  varietyData
  tableData;
  plotList
  seedProcessingPlantList
  selected_plot = "2023-24/K/0000/A0101/1";
  selectCrop: any;
  croplistSecond;
  varietyListSecond;
  selectVariety: any;
  submitted = false;
  unit: string;
  selectedSeason: string = '';
  isSearchClicked = false;
  isParentalLine = false;
  parentalDataList: any;
  parentalDataListSecond: any;
  // todayDate=new Date()
  plotListSecond: any;
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  showGrid: boolean;
  selectParentalLine: any;
  selectPlot: any;
  selectSpp: any;
  seedProcessingPlantListSecond: any;
  selectSeedProcessingPlant: any;
  rangeNumber: number;
  ref_number: number;
  editId: any;
  editData: boolean;
  showPlot: boolean;
  markBagArr;
  maximumRange: number;
  investingBagData: any;
  investingBagDataofId: any;
  bag_marka: any;
  bag_no: any;
  responseValue: any;
  responseValueMax: any;
  bspProforma3DataseedData: any;
  seedClassId: any;
  StageId: any;
  actualRefNO: any;
  lotNoList;
  LotData = [
    {
      id: 1,
      lot_name: 'Lot 1'
    },
    {
      id: 2,
      lot_name: 'Lot 2'
    },
  ]
  showLotPageData: boolean;
  totalNoofBags: number;
  cropDataSecond: any;
  showLotPageDataSecond: boolean;
  selectBspc: any;
  bspcList: any;
  bspcListSecond: any;
  cropList: any;
  varietyList: any;
  parentalList: any;
  classofSeedHarvested: string;
  investVerifyStackComposition: any;
  provision_lot: any;
  variety_name: any;
  variety_code: any;
  LotPageDetails: any;
  carry_over_seed_details_id: any;
  carry_id: any;
  raw_seed_produced: any;
  raw_seed_produced_data: any;
  no_of_bags: any;
  line_variety_code: any;
  classofSeedHarvestedData: any;
  lot_id: any;
  stackDatas: any;
  godown_no: any;
  totalQty: string;
  highestNumber: number;
  under_sizepercent: any;
  disableField: boolean;
  totalQtyErr: boolean;
  stackNo: any;
  year: any;
  season: any;
  under_size: any;
  processing_loss;
  total_rejected: number;
  totalStack: any;
  parentalListSecond: any;
  get generateDefaultMonth(): string {
    let date = { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }

    //consolelog(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    // disableSince: {}
    // disableUntil: { year: parseInt(this.y), month: parseInt(this.m)+1, day: this.todayDate.getDate() -1 },
    // disableSince: { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
  };
  constructor(private service: SeedServiceService, private fb: FormBuilder, private productionService: ProductioncenterService, private masterService: MasterService) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      BSPC: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: [''],
      variety_text: [''],
      parental_data:[''],
      crop_text: [''],
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      // crop: ['', [Validators.required]],
      lot_no: [''],
      getRadio: ['1'],
      bspc_text: [''],
      variety_filter: [''],
      total_breeder_qty: [''],
      under_size: [''],
      processing_loss: [''],
      total_rejected: [''],
      recovery_qty: [''],
      tentative_recovery: [''],
      variety_level_2: [''],
      lot_list:[''],
      spp: this.fb.array([
        this.sppCreateForm()
      ]),
      stack: this.fb.array([
        this.stackData()
      ])
    });
    this.ngForm.controls['season'].disable();


    this.ngForm.controls['BSPC'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.selectVariety = '';
        this.selectCrop = '';
        this.ngForm.controls['crop'].reset('');
        // this.getSeasonData()
        this.selectParentalLine = '';
        this.editData = false;
        this.selectPlot = '';
        this.isParentalLine = false;

        this.ngForm.controls['season'].markAsUntouched();
        this.selectParentalLine = '';

        this.isSearchClicked = false;

      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.selectVariety = '';
        this.selectCrop = '';
        this.selectParentalLine = '';
        this.selectPlot = '';
        this.ngForm.controls['crop'].reset('');
        this.isParentalLine = false;
        this.editData = false;
        this.selectParentalLine = '';
        // this.getCropData()
        this.isSearchClicked = false;
        this.getCrop()
        // getCrop();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {

        this.selectVariety = '';
        this.selectParentalLine = '';
        if (newvalue.slice(0, 1) == "A") {
          this.unit = "Qt";
        } else {
          this.unit = "Kg";
        }
        this.selectPlot = '';
        this.editData = false;
        this.selectParentalLine = '';
        this.isSearchClicked = false;
        this.isParentalLine = false;
        // this.getVarietyData()
        // getVariety();
        this.getVariety(newvalue)
      }
    });
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
    this.ngForm.controls['lot_list'].valueChanges.subscribe(item => {
      if (item) {
       this.getListData()
      }
      
    })

  }

  ngOnInit(): void {
    if (this.tagsDetails && this.tagsDetails.length > 0) {
      let sum = 0
      this.tagsDetails.forEach((el) => {
        sum += el && el.no_of_bags ? el.no_of_bags : 0,
          this.totalNoofBags = sum
      })
    }
    this.dropdownSettings = {
      idField: 'lot_id',
      textField: 'lot_number',
      enableCheckAll: true,
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      itemsShowLimit: 1,

      limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'id',
      textField: 'bags',
      enableCheckAll: true,
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      itemsShowLimit: 1,

      limitSelection: -1,
    };
    this.getBspc();
    this.getCrop();
  }
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  get spp(): FormArray {
    return this.ngForm.get('spp') as FormArray;
  }
  get stack(): FormArray {
    return this.ngForm.get('stack') as FormArray;
  }
  crop(item: any) {
    this.selectCrop = item && item.crop_name ? item.crop_name : ''
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.cropData = this.croplistSecond;
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
  }
  cClick() {
    document.getElementById('crop').click()
  }

  searchData(data) {
    this.showGrid = true;
    this.getStackDataLot()
    this.getListData()

  }
  variety(item) {
    this.selectVariety = item && item.variety_name ? item.variety_name : ''
    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.varietyList = this.varietyListSecond;
    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
  }
  vClick() {
    document.getElementById('Variety').click()
  }
  showLotPage(data, lot_data, actionValue, lot) {
    console.log(data)
    this.showLotPageData = true;
    this.showLotPageDataSecond = false;
    this.showGrid = false;
    this.LotPageDetails = actionValue;
    this.provision_lot = data && data.lot_number ? data.lot_number : "";
    this.no_of_bags = data && data.bag_size ? data.bag_size : "";
    this.raw_seed_produced = data && data.quantity_remaining ? data.quantity_remaining : "";
    this.year = data && data.year ? data.year : '';
    this.season = data && data.season ? data.season : '';
    this.lot_id = data && data.lot_id ? data.lot_id : "";
    if (this.unit == 'Qt') {
      this.raw_seed_produced_data = data && data.quantity_remaining ? (data.quantity_remaining / 100) : "";
    } else {
      this.raw_seed_produced_data = data && data.quantity_remaining ? data.quantity_remaining : "";
    }
    this.classofSeedHarvestedData = 'Breeder' + data && data.stage_field ? data.stage_field : ''
  }

  cancel() {
    this.showLotPageData = false;
    this.showGrid = true;
    while (this.spp.controls.length != 0) {
      this.remove(0)
    }
    while (this.stackComposition().controls.length != 0) {
      this.remove2(0)
    }
    this.addMore(0)
    this.addMore2(0)
    this.ngForm.controls['total_breeder_qty'].setValue('');
    this.ngForm.controls['under_size'].setValue('')
    this.ngForm.controls['processing_loss'].setValue('')
    this.ngForm.controls['total_rejected'].setValue('')
    this.ngForm.controls['recovery_qty'].setValue('')
    this.ngForm.controls['tentative_recovery'].setValue('')
    this.ngForm.controls['variety_level_2'].setValue('')
    this.ngForm.controls['lot_no'].setValue('');
    this.under_sizepercent = '';

  }


  getListData() {
    const route = "get-seed-inventory-old-stock";
    let lot_list = this.ngForm.controls['lot_list'].value;
    let lotData= [];
    if(lot_list && lot_list.length>0){
      lot_list.forEach((el)=>{
        lotData.push(el && el.lot_id ? el.lot_id:'')
      })
    }

    const param = {
      "search": {
        bspc_id: this.ngForm.controls['BSPC'].value,
        crop_code: this.ngForm.controls['crop'].value,
        variety_code: this.ngForm.controls['variety'].value,
        parental_data: this.ngForm.controls["parental_data"].value ,
        lot_id : lotData && (lotData.length>0) ? lotData :'',
        showparental: this.showparental ? this.showparental : ''
      }
    }
    const result = this.productionService.postRequestCreator(route, param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.stackData ? data.EncryptedResponse.data.stackData : '';
      response= response.flat();
      console.log(response,'response')
      if(res && res.length>0){
        res.forEach(el=>{
          el.stack=[]
        })
      }
      if(response && response.length>0){
        if(res && res.length>0){
          for (let register of response) {
            for (let lot of res) {
                if (lot.old_id === register.seed_processing_register_old_stock_id) {
                    lot.stack.push(register);
                }
            }
        }
        
        
        }
        if(res && res.length>0){
              res.forEach((el)=>{              
                if(el && el.stack && el.stack.length>0){
                  el.noOfbags=[];
                  el.godownNo=[];
                  el.stackNo=[]
                  el.stack.forEach((item)=>{
                    el.noOfbags.push(item && item.no_of_bag ? item.no_of_bag :'');
                    el.godownNo.push(item && item.godown_no ? item.godown_no :'');
                    el.stackNo.push(item && item.stack_no ? item.stack_no :'')
                  })
                }
              })
        }
        
      }

      // if(response && response.length>0){
      //   if(res && res.length>0){
      //     res =res.map(item => {
      //       response.forEach(val=>{
      //         if(val.seed_processing_register_old_stock_id == item.id){
      //           item.push(response)
      //         }
      //       })

      //       // item.seed_class_details.forEach(detail => {
      //       // })
      //     })

      //   }
      // }
      this.tableData = res ? res : '';
      console.log('res', res)

    });
  }
  changeRadio(item) {
    this.ngForm.controls['getRadio'].setValue(item)
  }
  sppCreateForm(): FormGroup {
    return this.fb.group({
      no_of_bags: [''],
      bags: [''],
      qty: [''],
      // stack_data: new FormArray([
      //   this.stackData(),
      // ]),
    })
  }
  stackData() {
    let temp = this.fb.group({
      stack_com: [''],
      new_stack: ['',],
      type_of_seed: ['',],
      bag_marka: ['',],
      showstackNo: ['',],
      godown_no: ['',],


    });
    return temp;
  }

  sppData() {
    return this.ngForm.get('spp') as FormArray;
  }
  stackComposition() {
    return this.ngForm.get('stack') as FormArray;
  }
  addMore(i) {
    this.sppData().push(this.sppCreateForm());
  }

  addMore2(i) {
    this.stackNo = this.stackNo + 1;
    this.stackComposition().push(this.stackData());
  }

  remove(rowIndex: number) {
    this.sppData().removeAt(rowIndex);

  }
  remove2(rowIndex: number) {
    // this.stackNo= this.stackNo-1;
    this.stackComposition().removeAt(rowIndex);

  }
  employees() {
    return this.ngForm.get('spp') as FormArray;
  }
  get nestedArrays() {
    return this.ngForm.get('spp') as FormArray;
  }
  getNestedFormArray(index: number): FormArray {
    return this.nestedArrays.at(index).get('stack_data') as FormArray;
  }

  addMoreSeedDetails(i, index) {

    this.getNestedFormArray(i).push(this.stackData())

  }
  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.getNestedFormArray(empIndex).removeAt(skillIndex);
  }
  cropGroup(item: any) {
    this.selectBspc = item && item.agency_name ? item.agency_name : '';
    this.ngForm.controls['bspc_text'].setValue('', { emitEvent: false })
    this.bspcList = this.bspcListSecond;
    this.ngForm.controls['BSPC'].setValue(item && item.id ? item.id : '')
  }
  getBspc() {
    this.masterService.postRequestCreator('getBspcforseedInventory', null).subscribe(value => {
      this.bspcList = value && value.EncryptedResponse && value.EncryptedResponse.data ? value.EncryptedResponse.data : ''
      this.bspcListSecond = this.bspcList;
    })
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cdClick() {
    document.getElementById('bspcdeveloping').click();
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
        this.parentalListSecond= this.parentalList
        // if (this.is_update) {
        //   if (this.parentalList && this.parentalList.length > 0) {
        //     let res = this.parentalList.filter(x => x.line_variety_code == this.ngForm.controls['parental_data'].value)
        //     this.selectParentalLine = (res && res[0] && res[0].line_variety_name ? res[0].line_variety_name : '')
        //   }

        // }

      }
    })
  }
  pClick() {
    document.getElementById('parental').click();
  }
  parent(item) {
    this.selectParentalLine = item && item.line_variety_name ? item.line_variety_name : '';
    this.parentalList= this.parentalListSecond
    this.ngForm.controls['parental_data'].setValue(item && item.line_variety_code ? item.line_variety_code : '')
    // parental_data

  }
  getLotNoData(item) {
    if (item) {
      return item
    } else {
      return 'NA'
    }
  }
  getBreederData(id, stageId) {
    if (id) {
      let name = 'Breeder Seed';
      let stageIds;
      if (stageId) {
        stageIds = id == 6 ? this.convertToRoman(1) : this.convertToRoman(stageId + 1);
      }
      let className = name ? name : 'NA';
      let stageName = stageIds ? stageIds : 'NA'
      this.classofSeedHarvested = className + ' ' + stageName;
      return className + ' ' + stageName
    }
  }
  convertToRoman(num) {
    const romanNumerals = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };

    let result = '';

    for (let key in romanNumerals) {
      while (num >= romanNumerals[key]) {
        result += key;
        num -= romanNumerals[key];
      }
    }

    return result;
  }
  convertToQty(item) {
    if (this.unit == 'Qt') {
      if (item) {
        return item ? item / 100 : 0
      } else {
        return 'NA'
      }
    } else {
      return item
    }
  }
  getStackRang(id) {
    let stack = []
    if (this.investVerifyStackComposition && this.investVerifyStackComposition.length > 0) {
      let item = this.investVerifyStackComposition.filter(x => x.invest_verify_id == id);
      if (item && item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          stack.push(item && item[i] ? item[i].stack : 'NA')
        }
      }
    }
    return (stack && stack.length > 0 ? stack.toString() : '')
  }
  getUndersize(item, val) {
    if (item && val) {
      if (this.unit == 'Qt' ) {
        item = parseFloat(item) / 100
      }
      let value = (val / item) * 100;
      let percentValue = value ? value.toFixed(2) : '';
      return percentValue ? percentValue : 'NA'
    } else {
      return 'NA'
    }

  }
  getUndersizeQty(item, val,qty) {
    if (item && val&& qty) {
      item= parseFloat(item) - parseFloat(qty)
      if (this.unit == 'Qt' ) {
        item = parseFloat(item) / 100
      }
      let value = (val / item) * 100;
      let percentValue = value ? value.toFixed(2) : '';
      return percentValue ? percentValue : 'NA'
    } else {
      return 'NA'
    }

  }
  convertArrayToRange(arr) {
    //  arr = arr.map(Number);q
    let ranges = [];
    let start = arr[0];
    if (arr && arr.length > 0) {
      arr = arr.flat();
      // arr= arr.split(',')
      var splitArray = arr.map(function (item) {
        return item.split(",");
      });
      let flattenedArray = [].concat(...splitArray);
      return flattenedArray && flattenedArray.length > 0 ? flattenedArray.length : 0
    } else {
      return 'Na'
    }


  }
  convertToString(item) {
    if (item && item.length > 0) {
      return item ? item.toString() : ''
    } else {
      return 'NA'
    }
  }
  submit() {

    let sppData = this.ngForm.value ? this.ngForm.value.spp : '';
    let stackData = this.ngForm.value ? this.ngForm.value.stack : '';
    if (sppData && sppData.length > 0) {
      for (let key in sppData) {
        if (sppData[key].no_of_bags == '' || sppData[key].bags == ''
          || sppData[key].bags == '' || sppData[key].type_of_seed == ''
          || sppData[key].qty == '' || !this.ngForm.controls['under_size'].value
        ) {
          Swal.fire({
            title: '<p style="font-size:25px;">Please Fill The Form Properly.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          })
          return;

        }
      }
    }
    if (parseFloat(this.raw_seed_produced_data) < this.ngForm.controls['total_breeder_qty'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fill The Form Properly.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }

    if (stackData && stackData.length > 0) {
      for (let key in stackData) {
        if (stackData[key].stack_com == '' || stackData[key].type_of_seed == ''
          || stackData[key].bags == '' || stackData[key].type_of_seed == ''
          || stackData[key].bag_marka == '' || stackData[key].bag_marka.length < 1
          || stackData[key].showstackNo == '' || stackData[key].godown_no == ''
        ) {
          Swal.fire({
            title: '<p style="font-size:25px;">Please Fill The Form Properly.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          })
          return;

        }
      }
    }

    let data = this.ngForm.value;
    this.classofSeedHarvestedData = data && data.stage_field ? data.stage_field : ''
    data.provision_lot = this.provision_lot;
    data.no_of_bags = this.no_of_bags;
    data.raw_seed_produced = this.raw_seed_produced;
    data.classofSeedHarvestedData = 'Breeder' + this.classofSeedHarvestedData;
     data.totalQty = this.totalQty;
     data.processing_lossqty = this.processing_loss;
     data.total_rejected= this.total_rejected;
     data.under_size =this.under_size;
     data.lot_id= this.lot_id;
    
    // data.stackDatas = this.stackDatas;
    // data.variety = this.variety_code;
    // data.godown_no = this.godown_no;
    // data.total_bags = this.no_of_bags;
    // data.raw_seed_produced = this.raw_seed_produced;    
    // data.lot_id = this.lot_id;
    // data.provision_lot = this.provision_lot;
    // data.carry_over_seed_details_id = this.carry_over_seed_details_id;
    // data.carry_id = this.carry_id;
    // data.line_variety_code = this.line_variety_code;

    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let datas = JSON.parse(getLocalData);
    let UserId = datas.id;
    data.user_id = UserId;

    if (data) {
      let stack = data && data.stack ? data.stack : '';
      if (this.LotPageDetails != 1) {
        data.stack = [];
        data.spp = []
      }
      if (stack && stack.length > 0 && this.LotPageDetails == 1) {
        stack.forEach((el) => {
          el.noofBags = []
          el.bag_marka.forEach((item, i) => {
            el.noofBags.push(item && item.bags ? item.bags : "");
          })
        })

      }

    }
    console.log('data=====>', data)
    // parae
    const result = this.productionService.postRequestCreator('add-seed-processing-reg-old-stock', data).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data saved Successfully.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        }).then(x => {
          this.showLotPageData = false;
          this.showGrid = true;
          while (this.spp.controls.length != 0) {
            this.remove(0)
          }
          while (this.stackComposition().controls.length != 0) {
            this.remove2(0)
          }
          this.addMore(0)
          this.addMore2(0)
          this.getListData();
          this.ngForm.controls['total_breeder_qty'].setValue('');
          this.ngForm.controls['under_size'].setValue('')
          this.ngForm.controls['processing_loss'].setValue('')
          this.ngForm.controls['total_rejected'].setValue('')
          this.ngForm.controls['recovery_qty'].setValue('')
          this.ngForm.controls['tentative_recovery'].setValue('')
          this.ngForm.controls['variety_level_2'].setValue('')
          this.ngForm.controls['lot_no'].setValue('');
          this.under_sizepercent = ''
        })
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
      }
    });


  }
  getQuantity(i) {
    let noOfBags = this.ngForm.controls['spp']['controls'][i].controls['no_of_bags'].value;
    let bags = this.ngForm.controls['spp']['controls'][i].controls['bags'].value;
    if (noOfBags && bags) {
      let totalQty = parseFloat(noOfBags) * parseFloat(bags);
      let crop_code = this.ngForm.controls['crop'].value;
      // this.totalQty=totalQty
      let unit;
      if (crop_code) {
        unit = (crop_code.substring(0, 1) == 'A') ? 'Qt' : 'Kg'
      }
      if (unit && unit == 'Qt') {
        totalQty = (totalQty / 100)
      }
      this.ngForm.controls['spp']['controls'][i].controls['qty'].setValue(totalQty ? totalQty.toFixed(2) : '0')
      //  let sum=0;
      let data = this.ngForm.value;
      if (data && data.spp && data.spp.length > 0) {
        let bag_marka = [];
        let sum = 0;
        data.spp.forEach((el) => {
          sum += el && el.qty ? parseFloat(el.qty) : 0;
          let totalQty = sum ? sum.toFixed(2) : "";
          this.totalQty = sum ? sum.toFixed(2) : "";
          let percentQty = (Number(totalQty) / this.raw_seed_produced_data) * 100;
          // this.total_breeder_qty= 
          this.ngForm.controls['total_breeder_qty'].setValue(`${totalQty} (${percentQty ? percentQty.toFixed(2) : ''} %)`)
          if (el && el.no_of_bags) {
            bag_marka.push(el && el.no_of_bags ? el.no_of_bags : '')

          }

          if (parseFloat(this.raw_seed_produced_data) < parseFloat(this.ngForm.controls['spp']['controls'][i].controls['qty'].value)) {
            Swal.fire({
              title: '<p style="font-size:25px;">Quantity can not be greater than Lot quantity.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#B64B1D'
            })
            this.totalQtyErr = true;
          } else {
            this.totalQtyErr = false;
          }

        })
        this.highestNumber = Math.max(...bag_marka);
        this.callFunctionAfterDelay()
      }
    }
  }
  callFunctionAfterDelay(): void {
    setTimeout(() => {
      this.getBagMarkaData();
    }, 5000); // 5000 milliseconds = 5 seconds
  } getBagMarkaData() {
    let bag_markaData = []


    if (this.highestNumber) {
      for (let index = 1; index <= Number(this.highestNumber); index++) {
        bag_markaData.push(
          {
            id: index,
            bags: index
          }
        )
      }
    }
    this.BagMarka = bag_markaData;
  }
  getLossQty() {

    let total_breeder_qty = this.ngForm.controls['total_breeder_qty'].value;
    let under_size = this.ngForm.controls['under_size'].value;
    this.under_size=under_size;

    let totalQty = parseFloat(this.raw_seed_produced_data) - parseFloat(this.totalQty);
    if (under_size) {
      let under_sizepercent = (under_size / this.raw_seed_produced_data) * 100;
      // this.alreadyCalled = false;
      this.under_sizepercent = under_sizepercent;

    }
    // let processing_loss= this.ngForm.controls['processing_loss'].value;
    // let total_rejected= this.ngForm.controls['total_rejected'].value;
    let processing_loss = (Number(totalQty)) - (Number(under_size));
  
    let total_rejected = totalQty;
    if (parseFloat(under_size) > Number(totalQty)) {
      Swal.fire({
        title: '<p style="font-size:25px;">UnderSize Quantity .</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      }).then(x => {
        // this.totalQtyErr = true;
      })
    } else {
      // this.totalQtyErr = false;
    }
    let processing_lossqty = processing_loss ? processing_loss.toFixed(2) : '';
    let percentQty = (Number(processing_lossqty) / this.raw_seed_produced_data) * 100;
    let percentTotalRejected = (Number(totalQty) / this.raw_seed_produced_data) * 100;
    // this.processing_loss = processing_lossqty;
    // this.total_rejected = total_rejected;
    this.processing_loss= processing_lossqty;
    this.total_rejected = total_rejected;
    if (parseFloat(processing_lossqty) > 0) {
      this.ngForm.controls['processing_loss'].setValue(`${processing_lossqty ? (parseFloat(processing_lossqty).toFixed(2)) : ''} (${percentQty ? (percentQty.toFixed(2)) : ''} %)`);
    }
    if (Number(total_rejected) > 0) {
      this.ngForm.controls['total_rejected'].setValue(`${total_rejected ? (total_rejected.toFixed(2)) : ''} (${percentTotalRejected ? (percentTotalRejected.toFixed(2)) : ''} %)`);
    }
  }
  getStackDataValue2(i) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        bsp_id: this.ngForm.controls['BSPC'].value,
        crop_code: this.ngForm.controls['crop'].value,
        stack_id: this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value
      }
    }

    if (this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value != 'new_stack') {

      this.productionService.postRequestCreator('get-seed-processing-reg-stack-old-stock', param).subscribe(data => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data[0] ? data.EncryptedResponse.data[0] : 0;
          this.ngForm.controls['stack']['controls'][i].controls['type_of_seed'].setValue(response && response.type_of_seed ? response.type_of_seed : '');
          this.ngForm.controls['stack']['controls'][i].controls['showstackNo'].setValue(response && response.stack_no ? response.stack_no : '');
          this.ngForm.controls['stack']['controls'][i].controls['godown_no'].setValue(response && response.godown_no ? response.godown_no : '')
          this.ngForm.controls['stack']['controls'][i].controls['showfieldDisable'].setValue(true)
          this.disableField = true;
        } else {
          this.disableField = false;
          this.ngForm.controls['stack']['controls'][i].controls['showfieldDisable'].setValue(false)
        }
      })
    }
    //  }

  }
  getStackDataValue(i) {
    const getLocalData = localStorage.getItem('BHTCurrentUser');
    let data = JSON.parse(getLocalData)
    let UserId = data.id
    const param = {
      search: {
        user_id: UserId,
        bsp_id: this.ngForm.controls['BSPC'].value,
        crop_code: this.ngForm.controls['crop'].value,
        // stack_id:this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value
      }
    }

    this.productionService.postRequestCreator('get-seed-processing-reg-stack-old-stock', param).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : 0;

        if (this.ngForm.controls['stack']['controls'][i].controls['stack_com'].value == 'new_stack') {
          let season = this.ngForm.controls['season'].value;
          let year = this.year;
          let seedtype = this.ngForm.controls['stack']['controls'][i].controls['type_of_seed'].value;
          let typeofSeed;
          let typeSeedName;
          if (this.typeofSeed && this.typeofSeed.length > 0) {
            typeofSeed = this.typeofSeed.filter(x => x.id == this.ngForm.controls['stack']['controls'][i].controls['type_of_seed'].value)
            typeSeedName = typeofSeed && typeofSeed[0] && typeofSeed[0].name ? typeofSeed[0].name : '';
          }
          let lastTwoDigits = year % 100;
          let yearRange = `${lastTwoDigits}-${lastTwoDigits + 1}`;
          // if(!this.editData  !this.stackexist){
          this.stackNo = response ? (response.length) : 0;
          let stackNo = `${this.season ? this.season.toUpperCase() : 'NA'}/${yearRange}/${seedtype = 'PS'}/${Number(this.stackNo) + (parseInt(i) + 1)}`
          this.ngForm.controls['stack']['controls'][i].controls['showstackNo'].setValue(stackNo ? stackNo : '');
        }
      }
    })
  }
  toUpperRoman(roman) {
   if(roman){
    const romanNumerals = {
      'i': 'I',
      'v': 'V',
      'x': 'X',
      'l': 'L',
      'c': 'C',
      'd': 'D',
      'm': 'M'
  };
  return roman.toLowerCase().split('').map(char => romanNumerals[char] || char).join('');
   }
   else{
     return 'NA'
   }
}

getStackData() {
  const getLocalData = localStorage.getItem('BHTCurrentUser');
  let datas = JSON.parse(getLocalData);
  let UserId = datas.id;
  const param = {
    search: {
      bspc_id: this.ngForm.controls['BSPC'].value,
      crop_code: this.ngForm.controls['crop'].value,
      variety_code: this.ngForm.controls['variety'].value,
      parental_data:  this.ngForm.controls["parental_data"].value,
      user_id: UserId

    }
  }
  this.productionService.postRequestCreator('get-seed-processing-reg-stack-old-stock', param).subscribe(data => {
    if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.totalStack = response.length + 1;
      this.bagMarkDataofInvest = response;

    }
  })
}
getStackDataLot() {
  const getLocalData = localStorage.getItem('BHTCurrentUser');
  let datas = JSON.parse(getLocalData);
  let UserId = datas.id;
  const param = {
    search: {
      bspc_id: this.ngForm.controls['BSPC'].value,
      crop_code: this.ngForm.controls['crop'].value,
      variety_code: this.ngForm.controls['variety'].value,
      parental_data:  this.ngForm.controls["parental_data"].value,
      user_id: UserId

    }
  }
  this.productionService.postRequestCreator('get-seed-processing-reg-stack-old-stock-lot', param).subscribe(data => {
    if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
       this.lotNoList= response ? response :'';
    }
  })
}
}
