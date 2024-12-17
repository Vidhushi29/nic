import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { MasterService } from '../../services/master/master.service';
// import { T } from 'node_mod/@angular/cdk/keycodes';
@Component({
  selector: 'app-bill-payment-certificate-report',
  templateUrl: './bill-payment-certificate-report.component.html',
  styleUrls: ['./bill-payment-certificate-report.component.css']
})
export class BillPaymentCertificateReportComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  fileName = 'Bill/Payment/Certificate-report.xlsx';
  socials = [
    {
      name: 'Github',
      icon: 'fa fa-github fa-2x',
      link: 'https://www.github.com/..'
    },
    {
      name: 'Twitter',
      icon: 'fa fa-twitter fa-2x',
      link: 'https://www.twitter.com/..'
    },
    {
      name: 'Keybase',
      icon: '',
      link: 'https://keybase.io/..'
    }
  ];

  yearsData: any;
  seasonData: any;
  cropGroupData: any;
  cropData: any;
  crop_groups;
  dropdownSettings: IDropdownSettings = {};
  varietyData: any;
  totalIndentedQuantity: any;
  totalProduction: any;
  totalSurplus: any;

  selectedYear: any;
  selectedCropGroup: any;
  selectedCropName: any;
  today = new Date();

  indentData: any;
  cropGroupDataSecond: any;
  selectCrop_name: any;
  isCropName = false;
  cropDataSecond: any;
  yearOfIndent: any;
  seasonList: any;
  cropGroupList: any;
  cropTypeList: any;
  cropVarietList: any;
  state_cultivation
  cropGroupListArr = [];
  dataArr = [];
  finalData: any[];
  selectCrop_variety: any;
  outerArray: any[] = [
    { group: 'Group 1', items: ['Item 1', 'Item 2', 'Item 3'] },
    { group: 'Group 2', items: ['Item 4', 'Item 5'] },
    { group: 'Group 3', items: ['Item 6', 'Item 7', 'Item 8'] }
  ];
  variety_names: any;
  enableTable = false;
  cropNameArrData = [];
  cropname;
  cropVarietListsecond: any;
  spaName: any;
  dataList = [
    {
      pname: 'abc',
      numbers: [
        {
          arr: 125,
          key: 237,
        },
      ],
    },
    {
      pname: 'mno',
      numbers: [
        {
          arr: 125,
          key: 237,
        },
      ],
    },
  ];

  reportData: any[];
  dummyData;
  
  tableData;
  dropdownSettings1: {
    idField: string;
    // idField: 'item_id',
    textField: string; enableCheckAll: boolean; allowSearchFilter: boolean;
    // itemsShowLimit: 2,
    limitSelection: number;
  };
  grandTotal;
  constructor(private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private master: MasterService,
    private router: Router,
    private indentorService: IndenterService
  ) {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_group: [''],
      crop_name: [''],
      crop_type: [''],
      crop_text: [''],
      name_text: [''],
      variety_name_text: [''],
      variety_name: [''],


    });


  
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorSpaSeason(newValue)
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.cropVarietListsecond=[];
        this.cropGroupList=[];
        this.cropTypeList=[]
      }

    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropType(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.cropVarietListsecond=[];
        this.cropGroupList=[];
      }

    });
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropGroup(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.cropVarietListsecond=[];

      }

    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorVariety(newValue)
        this.ngForm.controls['variety_name'].setValue('');
        this.variety_names = ''
      }

    });

  }

  ngOnInit(): void {
    this.yearsData = [];
    this.getIndentorSpaYear()
    this.dropdownSettings = {
      idField: 'crop_code',
      // idField: 'item_id',
      textField: 'crop_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'variety_id',
      // idField: 'item_id',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
  }
  getCropGroupList(newValue) {
    let object = {
      "year": Number(this.ngForm.controls['year_of_indent'].value),
      "season": newValue
    }

    this.cropGroupData = []
    this.breederService.postRequestCreator("getCropGroupDataForProducedBreederSeedDetails", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        data.EncryptedResponse.data.forEach(element => {
          this.cropGroupData.push({
            value: element['group_code'],
            name: element['m_crop_group.group_name']
          })
        });
        this.cropGroupDataSecond = this.cropGroupData
      }
    })
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }


  onSearch() {

    this.tableData = [
      [
        { content: 'Row 1, Column 1', colspan: 2, rowspan: 2 },
        { content: 'Row 1, Column 3' },
        { content: 'Row 1, Column 4' }
      ],
      [
        { content: 'Row 2, Column 3', colspan: 2 },
        { content: 'Row 2, Column 4' }
      ],
      [
        { content: 'Row 3, Column 1', rowspan: 2 },
        { content: 'Row 3, Column 2' },
        { content: 'Row 4, Column 2' }
      ],
      [
        { content: 'Row 4, Column 1' },
        { content: 'Row 5, Column 1' },
        { content: 'Row 6, Column 1' }
      ]
    ];
  

    
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Season And Crop Type",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,

        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
      })

      return;
    }
    if ((!this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Crop Type",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,

        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
      })

      return;
    }
    else {
      let searchObject = {};
      this.selectedYear = 'NA';
      this.selectedCropGroup = 'NA';
      this.selectedCropName = 'NA';
      let cropName = this.ngForm.controls['crop_name'].value;
      let varietyDataName = this.ngForm.controls['variety_name'].value
      let cropNameArr = [];
      this.enableTable = true;
      let varietyNameArr = [];
      for (let i in cropName) {
        cropNameArr.push(cropName && cropName[i] && cropName[i].crop_code ? cropName[i].crop_code : '')
      }
      for (let i in cropName) {
        this.cropNameArrData.push(cropName && cropName[i] && cropName[i].crop_name ? cropName[i].crop_name : '')
      }
      for (let i in varietyDataName) {
        varietyNameArr.push(varietyDataName && varietyDataName[i] && varietyDataName[i].variety_id ? varietyDataName[i].variety_id : '')
      }
      this.cropname = this.cropNameArrData.toString();
      const param = {
        search: {

          crop_type_bill: this.ngForm.controls['crop_type'].value && (this.ngForm.controls['crop_type'].value.substring(0,1)=="A" ? 'A' : 'H'),
          year: this.ngForm.controls['year_of_indent'].value,
          season: this.ngForm.controls['season'].value,
          crop_code:  cropNameArr && (cropNameArr.length > 0) ? cropNameArr : '',
          variety_id: varietyNameArr && (varietyNameArr.length>0) ? varietyNameArr :'', 

          // year: this.ngForm.controls["year_of_indent"].value,
          // season: this.ngForm.controls["season"].value,
          // crop_type: this.ngForm.controls['crop_type'].value,
          // variety_id:varietyNameArr,
          // crop_code: cropNameArr,
        }
      }

      this.breederService.postRequestCreator('getBillGenerateCertificateapiSecond', null, param).subscribe(data => {
        let cropNameArr = []
        let arr = [];
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
        // 0000000

        console.log('dataaa',data)
        let allocationdData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.allocationdData ? data.EncryptedResponse.data.allocationdData :""
        let genenatebilldata = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data :""
        const summedScores = {};
        
        if(allocationdData && allocationdData.length>0){
        const resultMap = new Map(); // Use a Map to store summed values for each unique ID
        let sum =0;
        let arr=[]
        allocationdData.forEach(obj => {


          //   const id = obj.id;
        const value = obj && obj.allocation_to_spa_for_lifting_seed_production_cnter && obj.allocation_to_spa_for_lifting_seed_production_cnter && obj.allocation_to_spa_for_lifting_seed_production_cnter.qty ? obj.allocation_to_spa_for_lifting_seed_production_cnter.qty :0;
         arr.push({id:obj.id,allocated_qty:value,spa_code:obj.allocation_to_spa_for_lifting_seed_production_cnter.spa_code , 
        variety_id:obj.variety_id,
        crop_code:obj.m_crop.crop_code,
        spa_id:obj.user.id
        })
   
        });

        const summedScores = {};

        // Iterate through the JSON array and calculate the sums
        arr.forEach(obj => {
            const key = obj.id;
            const allocated_qty = obj.allocated_qty;

            if (summedScores.hasOwnProperty(key)) {
                summedScores[key].allocated_qty += allocated_qty;
            } else {
                summedScores[key] = {...obj};
            }
        });

        const summedObjectsArray = Object.values(summedScores);
        let summedObjectsArrays=[]
        summedObjectsArrays.push(summedObjectsArray)

        if(summedObjectsArrays && summedObjectsArrays.length>0){
          for(let item of summedObjectsArrays){
            for(let cropArr of item){

              for(let data of genenatebilldata){
                for(let val of data.variety){
                  for(let values of val.spas){
                    if( data.crop_code == cropArr.crop_code && cropArr.variety_id== val.variety_id && cropArr.spa_id== values.spa_id){
                      values.allocated_qty= cropArr.allocated_qty              
                    }           
                  }
                }
              }
            }
          }

        }

        }    
       
        
        
        
        this.dummyData = genenatebilldata;
        for(let data of this.dummyData){
          let sum =0 ;
          for(let item of data.variety){
            sum += item.spas.length;
            data.variety_count = sum
            let spaCount =0
            for(let val of item.spas){
              spaCount += val.amount.length;
              item.spa_count =  item.spas.length
            }
    
          }
        }
        for(let data of this.dummyData){
          for(let item of data.variety){
            let sum =0 ;
            
            for(let val of item.spas){
              sum+=val.amount.length;
              data.variety_count = sum ;
              item.spa_count = sum;
              val.SPAs_count= val.amount.length

            }
    
          }
        }
        for(let data of this.dummyData){
          let sum =0 ;
          for(let item of data.variety){            
            sum+=item.spa_count ;
            data.varietyCount = sum           
    
          }
        }
        let varietyNameArr = [];
        console.log("Real API Data", this.dummyData)
       
      this.reportData=res
        this.finalData = res;
            
      })


      this.varietyData = [];
      const pageData = []
    }
  }

  sumArray(a, b) {
    var c = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      c.push((a[i] || 0) + (b[i] || 0));
    }
    return c;
  }
  cropNameList(newValue) {
    let object = {
      "year": Number(this.ngForm.controls['year_of_indent'].value),
      "season": this.ngForm.controls['season'].value,
      "group_code": newValue
    }

    this.cropData = []
    this.breederService.postRequestCreator("getCropDataForProducedBreederSeedDetails", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        data.EncryptedResponse.data.forEach(element => {
          this.cropData.push({
            value: element['crop_code'],
            name: element['m_crop.crop_name']
          })
          this.cropDataSecond = this.cropData
        });
      }
    })
  }

  clear() {
    this.ngForm.controls['year_of_indent'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_group'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['crop_type'].setValue('');
    this.cropNameArrData = []
    this.variety_names = '';
    this.enableTable = false;
    this.seasonList = [];
    this.cropGroupList = [];
    this.cropTypeList = [];

    this.isCropName = false;

    this.varietyData = []
    this.selectedYear = '';
    this.selectedCropGroup = '';
    this.selectedCropName = '';
    this.finalData = []
  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  exportexcel(): void {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'Bill/Payment/Certificate-report';
    const element = document.getElementById('pdf-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      margin:[10,5,5,5],
      html2canvas: {
        dpi: 192,
        scale: 4,
        // width:288,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropGroup(item: any) {
    this.ngForm.controls['crop_text'].setValue('')
    this.crop_groups = item && item.name ? item.name : '';

    this.ngForm.controls['crop_group'].setValue(item && item.value ? item.value : '');

  }
  cnclick() {
    document.getElementById('crop_name').click();
  }
  crop_name(item: any) {
    this.selectCrop_name = item && item.name ? item.name : '';
    this.ngForm.controls["name_text"].setValue("");
    this.ngForm.controls['crop_name'].setValue(item && item.value ? item.value : '')
  }
  getIndentorSpaYear() {
    const data = localStorage.getItem('BHTCurrentUser');
    const userData = JSON.parse(data)
    const param ={
      user_id:userData.id,
      search:{

      }
    }
    this.master.postRequestCreator('getBillGenerateCertificateapiSecondyear', null, param).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorSpaSeason(newValue) {
    const param = {
      search: {
        year: newValue,
      }
    }
    this.master.postRequestCreator('getBillGenerateCertificateapiSecondSeason', null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorCropType(newValue) {
    const param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: newValue,
        
      }
    }
    this.master.postRequestCreator('getBillGenerateCertificateapiSecondCropType', null, param).subscribe(data => {
      this.cropTypeList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorCropGroup(newValue) {
    const param = {
      // search:{
      //   season:newValue,
      //   year:this.ngForm.controls['year_of_indent'].value
      // }
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: newValue && (newValue.substring(0,1)=="A" ? 'A' : 'H'),
      }
    }
    this.master.postRequestCreator('getBillGenerateCertificateapiSecondCropName', null, param).subscribe(data => {
      this.cropGroupList = data && data.EncryptedResponse && data.EncryptedResponse.data;



    })
  }
 
  getIndentorVariety(newValue) {
    let crop_codeArr = []
    for (let i in newValue) {
      crop_codeArr.push(newValue[i].crop_code)
    }
    const param = {
      search: {
        crop_type: this.ngForm.controls['crop_type'].value && (this.ngForm.controls['crop_type'].value.substring(0,1)=="A" ? 'A' : 'H'),
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code:  crop_codeArr && (crop_codeArr.length > 0) ? crop_codeArr : '',
      }
    } 
    this.master.postRequestCreator('getBillGenerateCertificateapiSecondVarietyName', null, param).subscribe(data => {
      this.cropVarietList = data && data.EncryptedResponse && data.EncryptedResponse.data;
      this.cropVarietListsecond = this.cropVarietList;
    })
  }

  varietyNames(data) {
    this.variety_names = data  && data.variety_name ? data.variety_name : '';
    this.ngForm.controls['variety_name'].setValue(data && data.variety_code ? data.variety_code : '')
  }sss
  cvClick() {
    document.getElementById('variety_name').click();
  }

  mergeJsonDataByIdAndName(jsonArray1, jsonArray2) {
    const mergedData = {};
    let results = []

    jsonArray1.forEach(obj => {
      const id = obj.crop_name;
      const name = obj.variety_name;

      if (!mergedData[id]) {
        mergedData[id] = {};
      }

      if (!mergedData[id][name]) {
        mergedData[id][name] = obj;
      }
    });

    jsonArray2.forEach(obj => {
      const id = obj.crop_name;
      const name = obj.variety_name;

      if (!mergedData[id]) {
        mergedData[id] = {};
      }

      if (!mergedData[id][name]) {
        mergedData[id][name] = obj;
      }
    });

    return Object.values(mergedData).reduce((result, obj) => {
      results.push(...Object.values(obj));
      return results;
    }, []);
  }

  mapDuplicateData(jsonArray, uniqueKey) {
    const duplicateDataMap = new Map();

    jsonArray.forEach(obj => {
      const key = obj[uniqueKey];

      if (duplicateDataMap.has(key)) {
        duplicateDataMap.get(key).push(obj);
      } else {
        duplicateDataMap.set(key, [obj]);
      }
    });

    return Array.from(duplicateDataMap.values()).filter(data => data.length > 0);
  }
  mapArraysById(array1, array2) {
    const mappedArray = array1.reduce((result, item) => {
      result[item.crop_name] = {
        ...result[item.crop_name],
        ...item,
      };
      return result;
    }, {});
  
    return array2.map(item => ({
      ...item,
      ...mappedArray[item.crop_name],
    }));
  }

   mapArraysByIdAndKey(array1, array2,) {
    const mappedArray = array1.reduce((result, item) => {
      result[item] = {
        ...result[item],
        ...item,
      };
      return result;
    }, {});
  
    return array2.map(item => ({
      ...item,
      ...mappedArray[item.variety_name],
    }));
  }
  createNestedJSONById(mainArray, nestedArray, idKey, nestedKey) {
    return mainArray.varities.reduce((result, item) => {
      const nestedItems = nestedArray.varities.spaname.filter(nestedItem => nestedItem[idKey] === item[idKey] );
      if (nestedItems.length > 0) {
        item[nestedKey] = nestedItems;
      }
      result.push(item);
      return result;
    }, []);
  }
  getVariety(data){
    let cropName=[]
    for(let i in data){
      cropName.push(data[i].name)
    }
    console.log('da',cropName)
    return cropName
  }
  getRowspan(dataArray: any[], index: number) {
    // let rowspan = 1;
    // const currentItem = dataArray[index].item;
  
    // for (let i = index - 1; i >= 0; i--) {
    //   if (dataArray[i].item === currentItem) {
    //     rowspan++;
    //   } else {
    //     break;
    //   }
    // }
  
    // return rowspan;
  }
  
  getUniqueData(item){
    let arr =[]
    for(let itemi in item){
      arr.push(item[itemi])
    }
    let newData = [...new Set(arr)];
    return item;
  }
  getCropType(crop_type){    
    let unit = crop_type.toLowerCase()==='agriculture' ? 'Quintal':'Kg';
    return unit;
  }
  getCropNamefrommlist(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name)
      }
    })
    return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();  
  }
  getVarietyfrommlist(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.variety_name){
        temp.push(obj.variety_name)
      }
    })
    return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();  
  }
  }



