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
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-allocated-quantity-seed-division-lifting',
  templateUrl: './allocated-quantity-seed-division-lifting.component.html',
  styleUrls: ['./allocated-quantity-seed-division-lifting.component.css']
})
export class AllocatedQuantitySeedDivisionLiftingComponent implements OnInit {
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
  cropName: string;
  dummyData: any;
  newResponse: any;


  constructor(private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private masterService: MasterService,
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
        this.spa_names = ''
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
        this.spa_names = ''
      }

    });
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropGroup(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['spa_name'].setValue('');
        this.spa_names = ''

      }

    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorVariety(newValue)


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
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }


    else {
      let searchObject = {};
      this.selectedYear = 'NA';
      this.selectedCropGroup = 'NA';
      this.selectedCropName = 'NA';
      let cropName = this.ngForm.controls['crop_name'].value;
      let cropNameArr = [];
      let cropNameArrSecond = [];
      this.enableTable = true;
      for (let i in cropName) {
        cropNameArr.push(cropName && cropName[i] && cropName[i].crop_code ? cropName[i].crop_code : '')
      }
      for (let i in cropName) {
        cropNameArrSecond.push(cropName && cropName[i] && cropName[i].crop_name ? cropName[i].crop_name : '')
      }
      this.cropName = cropNameArrSecond.toString()
      const param = {
        search: {
          year: this.ngForm.controls["year_of_indent"].value,
          season: this.ngForm.controls["season"].value,
          crop_type: this.ngForm.controls['crop_type'].value,
          crop_name: cropNameArr && cropNameArr.length > 0 ? cropNameArr : '',
          variety_id: this.ngForm.controls['variety_name'].value


        }
      }
      this.masterService.postRequestCreator('getAllocatedbySeedDivisionforlifting', null, param).subscribe(data => {
        let agencyArr = [];
        let cropName = [];
        let arr = [];
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.finalData = res;
        this.dummyData = res;
        let sumofallocated = 0
        let nameId = []
        for (let i in res) {
          cropName.push({ crop_name: res[i].cropName })
        }
        cropName = [...new Set(cropName)]
        // const crop_name = this.finalData.reduce((a, { crop_name, indent_qunatity }) => (a[crop_name] = (a[crop_name] || 0) + +indent_qunatity, a), {});
        this.finalData = this.finalData.flat()

       
        this.dummyData = this.dummyData.flat()
        let summedData
        for (let val of this.finalData) {

          for (let secondval of val.variety) {

            for (let third of secondval.spas) {
              // Calculate sum of values for each ID
              const aggregatedData = secondval.spas.reduce((result, item) => {
                const { id, allocated_quantitys,state_name ,districtName,agencyname,indent_quantity                } = item;
                if (result[id]) {
                  result[id].indent_quantity += indent_quantity;  // Add value to existing sum
                  result[id].allocated_quantitys += allocated_quantitys;  // Add value to existing sum
                } else {
                  result[id] = { id, allocated_quantitys, state_name,districtName,agencyname,indent_quantity
                  };  // Initialize sum for new ID
                }
                return result;
              }, {});

              // Convert the object back to an array
               summedData = Object.values(aggregatedData);
               console.log(summedData)
               secondval.spas=summedData
            }


          }
          // continue
        }
        for (let val of this.finalData) {
          let cropAllocatedQty = 0
          let sum = 0;
          let total_spa_count = 0;
          for (let secondval of val.variety) {
            let allocatedQtytotal = 0;
           
            let arr =secondval.spas[secondval.spas.length - 1]
            secondval.total_indent=arr.indent_quantity
            total_spa_count=total_spa_count+secondval.spas.length
            val.total_spa_count=total_spa_count
            sum += secondval.total_indent
            for (let third of secondval.spas) {
              secondval.spa_count = secondval.spas.length
              allocatedQtytotal += third && third.allocated_quantitys ? parseFloat(third.allocated_quantitys):0
              cropAllocatedQty += third && third.allocated_quantitys ? parseFloat(third.allocated_quantitys):0
              
              secondval.totalSPAqty = sum;
              secondval.totalofAllocatedQty = allocatedQtytotal ? (allocatedQtytotal):0,
                nameId.push(third && third.id ? third.id : '')
              // sum+= secondval.spas[third].indent_qunatity
            }
          
            // secondval.total_allocatedqty =result
            val.tolatindentQty = sum;
            val.cropAllocatedQty = cropAllocatedQty
          }
          // continue
        }
        for (let val of this.finalData) {
       
          let sum =0;
          for (let secondval of val.variety) {
            sum+=secondval.totalofAllocatedQty
            val.croptotalData = sum
            for (let third of secondval.spas) {
           
              // sum+= secondval.spas[third].indent_qunatity
            }
          
          }
          // continue
        }
        console.log(summedData,'summedData',this.finalData)
        // con/






        // this.dummyData =  this.dummyData.filter((arr, index, self) =>
        // index === self.findIndex((t) => (t.crop_name === arr.crop_name )))



        console.log('dummy ', this.finalData)
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


  clear() {
    this.ngForm.controls['year_of_indent'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_group'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['crop_type'].setValue('');
    this.ngForm.controls['spa_name'].setValue('');
    this.seasonList = [];
    this.cropTypeList = [];
    this.cropVarietList = []



    this.spa_names = ''
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
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'Submitted-Indents-of-Breeder-Seed-(SPA Wise)-report';
    const element = document.getElementById('pdf-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 300,
        scale: 1,
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
    const param = {
      user_id: userData.id
    }
    this.masterService.postRequestCreator('get-indentor-year-list-second', null, param).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorSpaSeason(newValue) {
    const data = localStorage.getItem('BHTCurrentUser');
    const userData = JSON.parse(data)
    const param = {
      user_id: userData.id,
      search: {
        year: newValue,
      }
    }
    this.masterService.postRequestCreator('get-indentor-season-list-second', null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorCropGroup(newValue) {
    const data = localStorage.getItem('BHTCurrentUser');
    const userData = JSON.parse(data)
    const param = {
      user_id: userData.id,
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
    const data = localStorage.getItem('BHTCurrentUser');
    const userData = JSON.parse(data)
    const param = {
      user_id: userData.id,
      search: {
        season: newValue,
        year: this.ngForm.controls['year_of_indent'].value
      }
    }
    this.masterService.postRequestCreator('getindentorCropTypelistSecond', null, param).subscribe(data => {
      this.cropTypeList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorVariety(newValue) {
    console.log('new', newValue);
    let cropName = [];
    for (let value of newValue) {
      cropName.push(value.crop_code)
    }

    const param = {
      search: {
        crop_type: this.ngForm.controls['crop_type'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: cropName && cropName.length > 0 ? cropName : '',
        type: 'indenter'

      }
    }
    this.indentorService.postRequestCreator('getindentorVarietylistNew', null, param).subscribe(data => {
      this.cropVarietList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  varietyNames(data) {
    this.variety_names = data && data.variety_name ? data.variety_name : ''
    this.ngForm.controls['variety_name'].setValue(data && data.id ? data.id : '')
  }
  cvClick() {
    document.getElementById('variety_name').click();
  }
  getSubstring(item) {
    return item && (item.length > 30) ? (item.substring(0, 30) + '...') : ''

  }
  getCropUnit(item) {
    let unit = item && (item.substring(0, 1) == 'a') ? 'Quintal' : 'Kg'
    return unit
  }
  createNestedJSONById(mainArray, nestedArray, idKey, nestedKey) {
    return mainArray.variety.reduce((result, item) => {
      const nestedItems = nestedArray.filter(nestedItem => nestedItem[idKey] === item[idKey]);
      if (nestedItems.length > 0) {
        item[nestedKey] = nestedItems;
      }
      result.push(item);
      return result;
    }, []);
  }
  calculateSum(...numbers) {
    return numbers.reduce((sum, current) => sum + current, 0);
  }
  getCropNamefrommlist(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name)
      }
    })
    return temp;  
  }
}