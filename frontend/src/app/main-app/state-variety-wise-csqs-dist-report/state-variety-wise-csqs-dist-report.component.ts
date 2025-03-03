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
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';

@Component({
  selector: 'app-state-variety-wise-csqs-dist-report',
  templateUrl: './state-variety-wise-csqs-dist-report.component.html',
  styleUrls: ['./state-variety-wise-csqs-dist-report.component.css']
})
export class StateVarietyWiseCsqsDistReportComponent implements OnInit {

   @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
     filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
   
     ngForm!: FormGroup;
     fileName = 'State-wise-cs-qs-distribution.xlsx';
   
     yearsData: any;
     seasonData: any;
     cropGroupData: any;
     cropData: any;
     crop_groups;
     cropListData
     selectCrop_group;
     crop_name_list = []
     dropdownSettings: IDropdownSettings = {};
     dropdownSettings1: IDropdownSettings = {};
     dropdownSettingsCrop: IDropdownSettings = {};
     dropdownSettingsCrop1: IDropdownSettings = {};
     varietyData: any;
     cropsData: any;
     totalIndentedQuantity: any;
     totalProduction: any;
     totalSurplus: any;
     spa_names: any;
   
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
     cropList = [];
     cropDataList: any[];
     cropVarietListSecond: any;
     cropNameArr: any;
     spa_namesArr: any;
  stateList: any;
  stateIndenterList: any;
     constructor(
       private fb: FormBuilder,
       private router: Router,
       private zsrmServiceService: ZsrmServiceService
     ) {
       this.ngForm = this.fb.group({
         year_of_indent: [''],
         season: [''],
         crop_group: [''],
         state_name: [''],
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
           this.ngForm.controls['state_name'].patchValue("");
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
           this.ngForm.controls['state_name'].patchValue("");
           this.ngForm.controls['variety_name'].setValue('');
           this.ngForm.controls['crop_type'].setValue('');
           this.ngForm.controls['spa_name'].setValue('');
           this.spa_names = ''
         }
       });
   
       this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
         if (newValue) {
          this.getIndentorCrop(newValue)
        
           this.ngForm.controls['crop_group'].patchValue("");
           this.ngForm.controls['state_name'].patchValue("");
           this.ngForm.controls['variety_name'].setValue('');
           this.ngForm.controls['spa_name'].setValue('');
           this.spa_names = ''
         }
       });
   
       this.ngForm.controls['spa_name'].valueChanges.subscribe(newValue => {
         if (newValue) {
           this.getIndentorCrop(newValue)
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
         enableCheckAll: true,
         allowSearchFilter: true,
         // itemsShowLimit: 2,
         limitSelection: -1,
         selectAllText: 'Select All',
         unSelectAllText: 'UnSelect All', 
         itemsShowLimit: 1,
   
       };
       this.dropdownSettings1 = {
         idField: 'id',
         // idField: 'item_id',
         textField: 'state_name',
         enableCheckAll: true,
         allowSearchFilter: true,
         // itemsShowLimit: 2,
         limitSelection: -1,
         selectAllText: 'Select All',
         unSelectAllText: 'UnSelect All', 
         itemsShowLimit: 1,
       };
   
       this.dropdownSettingsCrop = {
         idField: 'id',
         // idField: 'item_id',
         textField: 'agency_name',
         enableCheckAll: true,
         allowSearchFilter: true,
         // itemsShowLimit: 2,
         limitSelection: -1,
         selectAllText: 'Select All',
         unSelectAllText: 'UnSelect All', 
         itemsShowLimit: 1,
       };
   
   
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
           title: '<p style="font-size:25px;">Please Select Season And Crop Type.</p>',
           icon: 'error',
           confirmButtonText:
             'OK',
           confirmButtonColor: '#E97E15'
         })
   
         return;
       }
       if ((!this.ngForm.controls["crop_type"].value)) {
         Swal.fire({
           title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
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
         let state_name = this.ngForm.controls['state_name'].value;
        //  console.log(crop_name)
         let stateNameArr = [];
         this.enableTable = true;
         for (let i in state_name) {
          stateNameArr.push(state_name && state_name[i] && state_name[i].id ? state_name[i].id : '')
         }
         const param = {
           search: {
             year: this.ngForm.controls["year_of_indent"].value,
             season: this.ngForm.controls["season"].value,
             crop_type: this.ngForm.controls['crop_type'].value,
             userid: stateNameArr && (stateNameArr.length > 0) ? stateNameArr : '',
           }
         }
         this.zsrmServiceService.postRequestCreator('get-zsrm-cs-qs-dist-data-sd', null, param).subscribe(data => {
  
          if (data.Response.status_code === 200) {
            
            let res =data && data.Response && data.Response.data ? data.Response.data : '';
            this.finalData = res;
            console.log(this.finalData)
          } 
      
              
         })
  
   
         this.cropsData = []
         this.varietyData = [];
         const pageData = []
       }
     }
   
   
     clear() {
       this.ngForm.controls['year_of_indent'].patchValue("");
       this.ngForm.controls['season'].patchValue("");
       this.ngForm.controls['crop_group'].patchValue("");
       this.ngForm.controls['state_name'].patchValue("");
       this.ngForm.controls['variety_name'].setValue('');
       this.ngForm.controls['crop_type'].setValue('');
       this.ngForm.controls['spa_name'].setValue('');
       this.seasonList = [];
       this.cropTypeList = [];  
       this.cropNameArr = '';
       this.spa_namesArr = []
       this.selectCrop_group = '';
       this.stateIndenterList = []
   
   
   
       this.spa_names = ''
       this.variety_names = '';
       this.enableTable = false;
   
       this.isCropName = false;
      this.cropsData =[]
       this.varietyData = []
       this.selectedYear = '';
       this.selectedCropGroup = '';
       this.selectedCropName = '';
       this.finalData = []
     }
   
     myFunction() {
       document.getElementById("myDropdown").classList.toggle("show");
     }
   
     exportexcel(): void {
       let element = document.getElementById('excel-tables');
       const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
   
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   
       XLSX.writeFile(wb, this.fileName);
   
     }
   
     download() {
       const name = 'State-wise-cs-qs-distribution';
       const element = document.getElementById('excel-table');
       const options = {
         filename: `${name}.pdf`,
         margin: [10, 3, 3, 3],
   
         image: { type: 'jpeg', quality: 1 },
         html2canvas: {
           dpi: 300,
           scale: 2,
           // width:50px,
           letterRendering: true,
           useCORS: true
         },
         jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
       };
       html2PDF().set(options).from(element).toPdf().save();
     }
  
     cnclick() {
       document.getElementById('crop_name').click();
     }
     crop_name(item: any) {
       this.selectCrop_group = item && item.crop_name ? item.crop_name : '';
       this.ngForm.controls['crop_name'].setValue(item && item.id ? item.id : '')
       console.log(this.ngForm.controls['crop_name'].value, 'item', item)
     }
     getIndentorSpaYear() {
      const route = "get-zsrm-cs-qs-dist-year-sd";
       this.zsrmServiceService.getRequestCreator(route, null, null).subscribe(data => {
        if (data.Response.status_code === 200) {
          this.yearOfIndent =data && data.Response && data.Response.data ? data.Response.data : '';
        } 
       })
     }
     getIndentorSpaSeason(newValue) {
      const queryParams = [];
      if (newValue) queryParams.push(`year=${encodeURIComponent(newValue)}`);
      const apiUrl = `get-zsrm-cs-qs-dist-season-sd?${queryParams.join('&')}`;
       this.zsrmServiceService.getRequestCreator(apiUrl).subscribe(data => {
        console.log(data)
         this.seasonList = data && data.Response && data.Response.data ? data.Response.data : '';
       })
     }
    
     getIndentorCropType(newValue) {
      const queryParams = [];
      const year = this.ngForm.controls['year_of_indent'].value;
      if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
      if (newValue) queryParams.push(`season=${encodeURIComponent(newValue)}`);
      const apiUrl = `get-zsrm-cs-qs-dist-croptype-sd?${queryParams.join('&')}`;
       this.zsrmServiceService.getRequestCreator(apiUrl).subscribe(data => {
        console.log(data)
         this.cropTypeList = data && data.Response && data.Response.data ? data.Response.data : '';
       })
     }
   
   
     getIndentorCrop(newValue) {
      this.stateList=[]
       this.stateIndenterList = [];
       const queryParams = [];
      const year = this.ngForm.controls['year_of_indent'].value;
      const season = this.ngForm.controls['season'].value;
      if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
      if(season) queryParams.push(`season=${encodeURIComponent(season)}`);
      if (newValue) queryParams.push(`crop_type=${encodeURIComponent(newValue.toLowerCase())}`);
  
      const apiUrl = `get-zsrm-cs-qs-dist-state?${queryParams.join('&')}`;
      console.log(apiUrl);
       this.zsrmServiceService.getRequestCreator(apiUrl).subscribe(data => {
        let res = data && data.Response && data.Response.data ? data.Response.data : '';
        res.forEach(element => {
          const temp = {
            state_name: element.name,
            id: element.user_id,
          }
          this.stateList.push(temp)
        });
        this.stateIndenterList = this.stateList
  
        console.log("this.cropVarietList", this.stateList);
       })
     }
  

}
