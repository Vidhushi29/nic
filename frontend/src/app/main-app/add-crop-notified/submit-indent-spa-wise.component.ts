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

@Component({
  selector: 'app-submit-indent-spa-wise',
  templateUrl: './submit-indent-spa-wise.component.html',
  styleUrls: ['./submit-indent-spa-wise.component.css']
})
export class SubmitIndentSpaWiseComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  fileName = 'Submitted-Indents-of-Breeder-Seed-spa-wise.xlsx';

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
  spa_names

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
  variety_names: any;
  enableTable = false;
  spaName: any;
  

  constructor(private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
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
      spa_name: [''],


    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropGroupData = this.cropGroupDataSecond
        let response = this.cropGroupData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropGroupData = response
      }
      else {
        // this.getCropGroupList(this.ngForm.controls['season'].value)
      }
    });

    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropData = this.cropDataSecond;
        let response = this.cropData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropData = response
      }
      else {

      }
    });
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorSpaSeason(newValue)
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.ngForm.controls['spa_name'].setValue('');
        this.spa_names=''
      }

    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropType(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.ngForm.controls['spa_name'].setValue('');
        this.spa_names=''
      }

    });
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorVariety(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['spa_name'].setValue('');
        this.spa_names=''

      }

    });
 

  }

  ngOnInit(): void {
    this.yearsData = [];
    this.getIndentorSpaYear()
    this.dropdownSettings = {
      idField: 'id',
      // idField: 'item_id',
      textField: 'agency_name',
      enableCheckAll: false,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
  


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
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Something ",
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
    if ((!this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Something ",
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
      let spa_name = this.ngForm.controls['spa_name'].value;
      let cropNameArr = [];      
      this.enableTable = true;
      for (let i in spa_name) {
        cropNameArr.push(spa_name && spa_name[i] && spa_name[i].id ? spa_name[i].id : '')
      }
      const param = {
        search: {
          year: this.ngForm.controls["year_of_indent"].value,
          season: this.ngForm.controls["season"].value,
          crop_type: this.ngForm.controls['crop_type'].value,
          spa_name: cropNameArr && (cropNameArr.length>0)? cropNameArr :'',
         
        }
      }
      
      this.indentorService.postRequestCreator('getAllocatedSpanNameforSpawiseReportc', null, param).subscribe(data => {
        this.spaName = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      })
      this.indentorService.postRequestCreator('getIndentorSpaWiseBreederSeed', null, param).subscribe(data => {
        let agencyArr = [];
        let cropName = [];
        let arr = [];
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        for (let i in res) {
          agencyArr.push(res && res[i] && res[i].agency_name ? res[i].agency_name : '')
          agencyArr = [...new Set(agencyArr)]
        }
        for (let i in res) {
          cropName.push(res && res[i] && res[i].crop_name ? res[i].crop_name : '')
          cropName = [...new Set(cropName)]
        }


        const toal_weight = res.reduce((a, {agency_name, indent_quantity}) => (a[agency_name] = (a[agency_name] || 0) + +indent_quantity, a), {});
        let weight = Object.values(toal_weight);

        const sums = {};

        res.forEach(item => {
          if (sums[item.indent_quantity]) {
            sums[item.indent_quantity] += item.value;
          } else {
            sums[item.indent_quantity] = item.value;
          }
        });
        
        const crop_name = res.reduce((a, { crop_name, indent_quantity }) => (a[crop_name] = (a[crop_name] || 0) + +indent_quantity, a), {});
        let crop_nameArr = Object.values(crop_name);

        var sum = 0;

        // Running the for loop
        crop_nameArr.forEach((element: any) => {
          sum = sum + element;


        });

        let totalWeightArr = [];
        for (let i in weight) {
          totalWeightArr.push({
            'total_weight': weight[i]

          })
        }
        let i = 0;
        let newObj = [];

        for (let value of agencyArr) {
          let keyArr = [];
          let unit = [];
          for (let val of res) {
            if (val.agency_name == value) {
              let crop_name = val.crop_name;
              keyArr.push({
                "crop_name": crop_name, 'value': parseFloat(val.indent_quantity).toFixed(2), 
                'agency_name': val.agency_name, 'indent_quantity': val.indent_quantity, 
                'variety_name': val.variety_name,
              });
            }
          }
          const uniqueObjectsMap = new Map();
          // const result = this.sumAndRemoveDuplicates(keyArr, 'variety_name');
          keyArr.forEach((obj) => {
            const key = obj['agency_name'];

            if (uniqueObjectsMap.has(key)) {
              // Sum values if the object is already in the map
              const existingObj = uniqueObjectsMap.get(key);
              existingObj.indent_quantity += obj.indent_quantity;
            } else {
              // Add the object to the map if it's not already present
              uniqueObjectsMap.set(key, obj);
            }
          })
          keyArr = keyArr.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.crop_name === arr.crop_name)))
          let variety_id = (value).toString();
          console.log(keyArr,this.spaName)
          const nestedJSON = this.createNestedJSONById(keyArr, this.spaName, 'agency_name', 'spa_name');

          // let variety_id = (value).toString();
          newObj.push({ "agency_name": value, 'data': keyArr, ...totalWeightArr[i], 'cropName': cropName, cropNameWeight: crop_nameArr,arr:nestedJSON });
          i++;


        }
        this.finalData = res;
      })
      for(let index of this.finalData){
        for(let j of index){

          console.log(' this.finalData', j.varieties )
        }
        // this.finalData[index]

      }


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


  clear() {
    this.ngForm.controls['year_of_indent'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_group'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['crop_type'].setValue('');
    this.ngForm.controls['spa_name'].setValue('');
    this.seasonList=[];
    this.cropTypeList=[];
    this.cropVarietList=[]



    this.spa_names=''
    this.variety_names = '';
    this.enableTable = false;

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
    const name = 'Submitted-Indents-of-Breeder-Seed-(SPA Wise)-report';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 300,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
    this.indentorService.postRequestCreator('get-indentor-year-list', null, null).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorSpaSeason(newValue) {
    const param = {
      search: {
        year: newValue
      }
    }
    this.indentorService.postRequestCreator('get-indentor-season-list', null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorCropGroup(newValue) {
    const param = {
      // search:{
      //   season:newValue,
      //   year:this.ngForm.controls['year_of_indent'].value
      // }
      search: {
        crop_type: newValue,
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year_of_indent'].value
      }
    }
    this.indentorService.postRequestCreator('get-indentor-cropGroup-list', null, param).subscribe(data => {
      this.cropGroupList = data && data.EncryptedResponse && data.EncryptedResponse.data;



    })
  }
  getIndentorCropType(newValue) {
    const param = {
      search: {
        season: newValue,
        year: this.ngForm.controls['year_of_indent'].value
      }
    }
    this.indentorService.postRequestCreator('getindentorCropTypelist', null, param).subscribe(data => {
      this.cropTypeList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorVariety(newValue) {
    console.log('new', newValue)
  
    const param = {
      search: {
        crop_type: this.ngForm.controls['crop_type'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
       
      }
    }
    this.indentorService.postRequestCreator('getIndentorSpaNameBreederSeed', null, param).subscribe(data => {
      this.cropVarietList = data && data.EncryptedResponse && data.EncryptedResponse.data;
      
      this.cropVarietList = this.cropVarietList.filter((arr, index, self) =>
    index === self.findIndex((t) => (t.agency_name === arr.agency_name )))
    })
    let spaNameList=[]
   

  }
  varietyNames(data) {
    this.spa_names =data && data.agency_detail && data.agency_detail.agency_name ? data.agency_detail.agency_name :'';
    this.ngForm.controls['spa_name'].setValue(data && data.agency_detail && data.agency_detail.user_id ? data.agency_detail.user_id :'')
  }
  cvClick() {
    document.getElementById('spa_name').click();
  }
  createNestedJSONById(mainArray, nestedArray, idKey, nestedKey) {
    return mainArray.reduce((result, item) => {
      const nestedItems = nestedArray.filter(nestedItem => nestedItem[idKey] === item[idKey] && nestedItem['variety_name'] === item['variety_name']);
      if (nestedItems.length > 0) {
        item[nestedKey] = nestedItems;
      }
      result.push(item);
      return result;
    }, []);
  }
}