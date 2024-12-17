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
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-lifting-of-breeder-seed',
  templateUrl: './lifting-of-breeder-seed.component.html',
  styleUrls: ['./lifting-of-breeder-seed.component.css']
})
export class LiftingOfBreederSeedComponent implements OnInit {
  
    ngForm!: FormGroup
    filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
    inventoryData = []
    allData: any;
    yearOfIndent: any;
    seasonlist: any;
    bagMarkDataofInvest;
    typeofSeed;
    dropdownSettings: IDropdownSettings = {};
    Variety: any
    varietyListofBsp2list;
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
    userId: any;
    seedProcessingPlantList
    selected_plot = "2023-24/K/0000/A0101/1";
    selectCrop: any;
    croplistSecond;
    varietyListSecond;
    selectVariety: any;
    submitted = false;
    unit = 'kg';
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
    cropNameSecond: any;
    varietyNameSecond: any;
    varietyName: any;
    cropName: any;
    responseValue: any;
    responseValueMax: any;
    bspProforma3DataseedData: any;
    seedClassId: any;
    StageId: any;
    actualRefNO: any;
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
  selectCrop_crop_code: any;
  crop_name_data: any;
  selectCrop_group: string;
  crop_text_check: string;
  unit2: string;
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
    constructor(private service: SeedServiceService,private _productionCenter:ProductioncenterService, private fb: FormBuilder, private productionService: ProductioncenterService) {
      this.createForm();
    }
  
    createForm() {
      this.ngForm = this.fb.group({
        year: ['', [Validators.required]],
        season: ['', [Validators.required]],
        crop: ['', [Validators.required]],
        crop_text: [''],
        cropName: [''],
        variety: [''],
        variety_text: [''],
        lot_no: [''],
        getRadio:['1'],
        bspc: this.fb.array([
        ]),
        spp:this.fb.array([
  
        ]),
        stack:this.fb.array([
  
        ])
      });
      this.ngForm.controls['season'].disable();
      this.ngForm.controls['crop_text'].disable(); 
  
  
      this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
        if (newvalue) {
          this.ngForm.controls['season'].enable();
          this.selectVariety = '';
          this.selectCrop = '';
          this.ngForm.controls['crop_text'].disable();
          // this.getSeasonData()
          this.selectParentalLine = '';
          this.editData = false;
          this.selectPlot = '';
          this.isParentalLine = false;
  
          this.ngForm.controls['season'].markAsUntouched();
          this.selectParentalLine = '';
          this.getSeason();
          this.isSearchClicked = false;
  
        }
      });
  
      this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
        if (newvalue) {
          this.selectVariety = '';
          this.selectCrop = '';
          this.selectParentalLine = '';
          this.selectPlot = '';
          this.ngForm.controls['crop_text'].enable();
          this.isParentalLine = false;
          this.editData = false;
          this.selectParentalLine = '';
          // this.getCropData()
          this.isSearchClicked = false;
          this.getCrop();
        }
      });
  
      this.ngForm.controls['crop_text'].valueChanges.subscribe(newvalue => {
        if (newvalue) {
        let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newvalue.toLowerCase()))
        this.cropName = response
          this.selectVariety = '';
          this.selectParentalLine = '';
          this.selectPlot = '';
          this.editData = false;
          this.selectParentalLine = '';
          this.isSearchClicked = false; 
          this.isParentalLine = false;
          // this.getVarietyData()
          this.getVariety();
        }
      });
  
      this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
        if (newvalue) {
          if (newvalue && newvalue[0] && newvalue[0].variety_code.slice(0, 1) == "A") {
            this.unit = "Qt";
          } else {
            this.unit = "Kg";
          }
          this.isParentalLine = false;
        }
      });
    }
  
    ngOnInit(): void {
      const userData = localStorage.getItem('BHTCurrentUser');
      const data = JSON.parse(userData);
      this.userId = data.id;
  
      if (this.tagsDetails && this.tagsDetails.length > 0) {
        let sum = 0
        this.tagsDetails.forEach((el) => {
          sum += el && el.no_of_bags ? el.no_of_bags : 0,
            this.totalNoofBags = sum
        })
      }
      this.getYear();
      this.dropdownSettings = {
        idField: 'variety_code',
        textField: 'variety_name',
        enableCheckAll: true,
        singleSelection: false,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        allowSearchFilter: true,
        itemsShowLimit: 1,
  
        limitSelection: -1,
      };
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
      console.log("console.log(this.ngForm.controls['crop'].value)",this.ngForm.controls['crop'].value)
      if (this.ngForm.controls['crop'].value[0] === 'H') {
        this.unit2 ="Kg";
      } else {
        this.unit2 ="Qt";
        
      }
      this.showGrid = true;
      this.getVariety();
     this.getListData()
  
    }
    variety(item) {
      this.selectVariety = item && item.variety_name ? item.variety_name : ''
      this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
      this.cropData = this.croplistSecond;
      this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    }
    vClick() {
      document.getElementById('Variety').click()
    }
    showLotPage() {
      this.showLotPageData = true;
      this.showGrid=false;
      this.spp.push(this.sppCreateForm())
      this.stack.push(this.stackData())
      
    }
    submit() {
  
    }
    cancel() {
      this.showLotPageData = false;
    }
   
    download() {
      // this.getQr()
      const name = 'Generating Tag Numbe';
      const element = document.getElementById('pdf-tables');
      const options = {
        filename: `${name}.pdf`,
        margin: [30, 0],
        image: {
          type: 'jpeg',
          quality: 1
        },
        // html2canvas: {
        //   dpi: 192,
        //   scale: 4,
        //   letterRendering: true,
        //   useCORS: true
        // },
        jsPDF: {
          unit: 'mm',
          format: 'a3',
          orientation: 'landscape'
        },
        html2canvas: {
          dpi: 300,
          scale: 1,
          letterRendering: true,
          logging: true,
          useCORS: true,
  
        },
        // pagebreak: { avoid: "tr", mode: "css", before: "#nextpage1", after: "1cm" },
        pagebreak: { after: ['#page-break1'], avoid: 'img' },
      };
      // const pdf = new html2PDF(element, options);
  
      // pdf.addPage();
      html2PDF().set(options).from(element).toPdf().save();
  
    }
    getYear() {
      let route = "get-lifting-breeder-seeds-year";
      let param = {
      }
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        }
      });
    }
    getSeason() {
      let route = "get-lifting-breeder-seeds-season";
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

    getCrop() {
      let route = "get-lifting-breeder-seeds-crop-data";
      let param = {
        "search": {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
        }
      }
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          this.cropName = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
          this.cropNameSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
  
        }
      });
    }

    getVariety() {
      let route = "get-lifting-breeder-seeds-variety-data";
      let param = {
        "search": {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
          "crop_code": this.ngForm.controls['crop'].value,
        }
      }
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          this.varietyName = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
          this.Variety = res.EncryptedResponse.data;
          this.varietyListofBsp2list= this.Variety
          this.varietyNameSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        }
      });
    }

    getListData() {
      const route = "get-seed-processing-reg-data";
      const param = {
          "year": this.ngForm.controls["year"].value,
          "season": this.ngForm.controls["season"].value,
          "crop_code":this.ngForm.controls["crop"].value,
          "variety_code":this.ngForm.controls["variety"].value && this.ngForm.controls["variety"].value[0].variety_code | this.ngForm.controls["variety"].value && this.ngForm.controls["variety"].value.variety_code,
           "user_id": this.userId
            // "year": "2026",
            // "season": "R",
            // "crop_code": "A0104",
            // "variety_code": ["A0104654"],
            // "user_id": 10827
      }
      const result = this.productionService.postRequestCreator(route, param).subscribe((data: any) => {
        if(data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
        this.tableData = data.EncryptedResponse.data;  
        // this.generateExcel(this.tableData);
        if(this.tableData  && this.tableData.length>0){
          this.tableData.forEach(el=>{
            el.spa2=[]
            el.indentor_details.forEach((item)=>{
              item.spa.forEach((val)=>{
                el.spa2.push(val)
              })
            })
          })
        }
      } else {
        this.tableData = []
      }
      });
    }
    // this.generateExcel(this.tableData);
    changeRadio(item){
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
        stack_com:[''],
        new_stack: ['',],
        type_of_seed: ['',],
        bag_marka: ['',],
        showstackNo: ['',],
        godown_no: ['',],
        
    
      });
      return temp;
    }
    cgClick() {
      document.getElementById('crop_group').click();
    }
  
    cropNameValue(item: any) {
      this.selectCrop = item.crop_name;
      this.ngForm.controls["crop_text"].setValue("");
      this.ngForm.controls['crop'].setValue(item && item.crop_code);
      this.selectCrop_crop_code = item.crop_code;
      this.crop_name_data = item.crop_name;
      this.selectCrop_group = "";
      // this.ngForm.controls['crop_name'].setValue('')
      this.crop_text_check = 'crop_group'
    }
    cropdatatext() {
      this.cropNameSecond;
      console.log(' this.cropNameSecond;', this.cropNameSecond);
    }
    varietydatatext() {
      this.varietyNameSecond;
      console.log(' this.varietyNameSecond;', this.varietyNameSecond);
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
      this.stackComposition().push(this.stackData());
    }
  
    remove(rowIndex: number) {
      this.sppData().removeAt(rowIndex);
      // if (this.sppData().controls.length > 1) {
      // } else {
      //   this.removeData()
      // }
    }
    remove2(rowIndex: number) {
      this.stackComposition().removeAt(rowIndex);
      // if (this.sppData().controls.length > 1) {
      // } else {
      //   this.removeData()
      // }
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
    showLotPageSecond(){
      this.showLotPage()
      this.showLotPageDataSecond=true;
    }
    addMoreSeedDetails(i, index) {
    
      this.getNestedFormArray(i).push(this.stackData())
  
    }
    removeEmployeeSkill(empIndex: number, skillIndex: number) {
  
      this.getNestedFormArray(empIndex).removeAt(skillIndex);
    }
    formatValue(val: any) {
      if (this.unit === 'Qt' && val) {
        return val/100 ;
      }
      return val ? val : 'NA';
    }
    
    getNotLiftedValue(indent_qty: any, qty_lifted : any ) {
      if(indent_qty == '' || qty_lifted == '')
        return 'NA'
      if (this.unit === 'Qt' ) {
        indent_qty = indent_qty / 100;
        qty_lifted = qty_lifted / 100;
      }
      return indent_qty - qty_lifted;
    }

    async generateExcel(data: any) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Seed Processing Data');
    
      worksheet.columns = [
          { header: 'S.No.', key: 'sno', width: 10 },
          { header: 'Variety', key: 'variety', width: 20 },
          { header: 'Indentor', key: 'indentor', width: 20 },
          { header: 'SPA', key: 'spa', width: 10 },
          { header: 'Indentor Qty (Qt)', key: 'indent_qty', width: 20 },
          { header: 'Quantity of Breeder Seed Allocated (Qt)', key: 'qty_breeder_seed', width: 20 },
          { header: 'Date of Lifting', key: 'date_lifting', width: 20 },
          { header: 'Quantity Lifted (Qt)', key: 'qty_lifted', width: 20 },
          { header: 'Quantity Not Lifted (Balance Qt)', key: 'qty_not_lifted', width: 20 },
          { header: 'Reason for Short/Excess Supply (if any)', key: 'reason', width: 30 }
      ];
    
      // Style headers
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFA07A' } // Light salmon color
      };
      headerRow.eachCell((cell) => {
          cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
          };
      });
    
      let rowIndex = 2; // Start after header row
      let serialNumber = 1;
    
      data.forEach((item) => {
          const varietyStartRow = rowIndex;
        
          item.indentor_details.forEach((indenter) => {
              const indentorStartRow = rowIndex;
          
              indenter.spa.forEach((spa) => {
                  const row = worksheet.addRow({
                      sno: serialNumber,
                      variety: item.variety_name,
                      indentor: indenter.indentor_name,
                      spa: spa.spa_name,
                      indent_qty: spa.indent_qty / 100, // Divide by 100 if unit is Qt
                      qty_breeder_seed: spa.qty_of_breeder_seed / 100, // Divide by 100 if unit is Qt
                      date_lifting: spa.date_of_lifting,
                      qty_lifted: spa.qty_lifted / 100, // Divide by 100 if unit is Qt
                      qty_not_lifted: (spa.indent_qty / 100) - (spa.qty_lifted / 100), // Calculate balance
                      reason: spa.reason
                  });
                  row.eachCell({ includeEmpty: true }, (cell) => {
                      cell.alignment = { vertical: 'middle', horizontal: 'center' };
                      cell.border = {
                          top: { style: 'thin' },
                          left: { style: 'thin' },
                          bottom: { style: 'thin' },
                          right: { style: 'thin' }
                      };
                  });
                  rowIndex++;
                  serialNumber++;
              });
          
              if (rowIndex > indentorStartRow + 1) {
                  worksheet.mergeCells(`C${indentorStartRow}:C${rowIndex - 1}`);
              }
          });
        
          if (rowIndex > varietyStartRow + 1) {
              worksheet.mergeCells(`B${varietyStartRow}:B${rowIndex - 1}`);
              worksheet.mergeCells(`A${varietyStartRow}:A${rowIndex - 1}`);
          }
      });
    
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Seed_Processing_Data.xlsx');
  }
    
      
  }