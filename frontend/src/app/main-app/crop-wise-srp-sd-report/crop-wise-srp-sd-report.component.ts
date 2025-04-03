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
  selector: 'app-crop-wise-srp-sd-report',
  templateUrl: './crop-wise-srp-sd-report.component.html',
  styleUrls: ['./crop-wise-srp-sd-report.component.css']
})
export class CropWiseSrpSdReportComponent implements OnInit {

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
  totalData: any;
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
             this.finalData = [];
          this.totalData = []
           }
     
         });
         this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
           if (newValue) {
            this.getIndentorCrop(newValue)
             this.ngForm.controls['crop_group'].patchValue("");
             this.ngForm.controls['state_name'].patchValue("");
             this.ngForm.controls['variety_name'].setValue('');
             this.ngForm.controls['crop_type'].setValue('');
             this.ngForm.controls['spa_name'].setValue('');
             this.spa_names = ''
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
         if ((!this.ngForm.controls["year_of_indent"].value)) {
           Swal.fire({
             title: '<p style="font-size:25px;">Please Select Year.</p>',
             icon: 'error',
             confirmButtonText:
               'OK',
             confirmButtonColor: '#E97E15'
           })
     
           return;
         }
         if ((!this.ngForm.controls["season"].value)) {
           Swal.fire({
             title: '<p style="font-size:25px;">Please Select Season.</p>',
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
               userid: stateNameArr && (stateNameArr.length > 0) ? stateNameArr : '',
             }
           }
           this.zsrmServiceService.postRequestCreator('view-srp-crop-wise-seed-division', null, param).subscribe(data => {
    
            if (data.Response.status_code === 200) {
              let res =data && data.Response && data.Response.data && data.Response.data ? data.Response.data : '';
              console.log(res,"response");
              let totals = {
               AreaUnderVariety: 0,
               SeedRequired: 0,
               doa: 0,
               ssfs: 0,
               ssc: 0,
               nsc: 0,
               saus: 0,
               othergovpsu: 0,
               coop: 0,
               pvt: 0,
               seedhub: 0,
               others: 0,
               total: 0,
               shtorsur: 0,
               BSRequiredtomeettargetsofFS: 0,
               FSRequiredtomeettargetsofCS: 0,
             };
             
             // Iterate through the data and sum up all the fields
             res.forEach(item => {
               console.log(item.AreaUnderVariety);
               totals.AreaUnderVariety += parseFloat(item.AreaUnderVariety) || 0;
               totals.SeedRequired += parseFloat(item.SeedRequired) || 0;
               totals.doa += parseFloat(item.doa) || 0;
               totals.ssfs += parseFloat(item.ssfs) || 0;
               totals.ssc += parseFloat(item.ssc) || 0;
               totals.nsc += parseFloat(item.nsc) || 0;
               totals.saus += parseFloat(item.saus) || 0;
               totals.othergovpsu += parseFloat(item.othergovpsu) || 0;
               totals.coop += parseFloat(item.coop) || 0;
               totals.pvt += parseFloat(item.pvt) || 0;
               totals.seedhub += parseFloat(item.seedhub) || 0;
               totals.others += parseFloat(item.others) || 0;
               totals.total += parseFloat(item.total) || 0;
               totals.shtorsur += parseFloat(item.shtorsur) || 0;
               totals.BSRequiredtomeettargetsofFS += parseFloat(item.BSRequiredtomeettargetsofFS) || 0;
               totals.FSRequiredtomeettargetsofCS += parseFloat(item.FSRequiredtomeettargetsofCS) || 0;
             });
   
             let filteredData = [];
             res.forEach((el) => {
            const userIndex = filteredData.findIndex(
              (item) => item.user_id === el.user_id
            );
            if (userIndex === -1) {
              filteredData.push({
                user_name: el.name,
                user_id: el.user_id,
                crop_count: 1,
                user_area: parseFloat(el.AreaUnderVariety).toFixed(2),
                user_seed_req: parseFloat(el.SeedRequired).toFixed(2),
                user_doa: parseFloat(el.doa).toFixed(2),
                user_ssfs: parseFloat(el.ssfs).toFixed(2),
                user_ssc: parseFloat(el.ssc).toFixed(2),
                user_nsc: parseFloat(el.nsc).toFixed(2),
                user_saus: parseFloat(el.saus).toFixed(2),
                user_othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                user_coop: parseFloat(el.coop).toFixed(2),
                user_pvt: parseFloat(el.pvt).toFixed(2),
                user_seedhub: parseFloat(el.seedhub).toFixed(2),
                user_others: parseFloat(el.others).toFixed(2),
                user_total: parseFloat(el.total).toFixed(2),
                user_shtorsur: parseFloat(el.shtorsur).toFixed(2),
                user_BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                user_FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                crop: [
                  {
                    crop_code: el.crop_code,
                    crop_name: el.crop_name,              
                    proposedAreaUnderVariety: parseFloat(el.AreaUnderVariety).toFixed(2),
                    seedRequired: parseFloat(el.SeedRequired).toFixed(2),
                    doa: parseFloat(el.doa).toFixed(2),
                    ssfs: parseFloat(el.ssfs).toFixed(2),
                    saus: parseFloat(el.saus).toFixed(2),
                    ssc: parseFloat(el.ssc).toFixed(2),
                    nsc: parseFloat(el.nsc).toFixed(2),
                    othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                    coop: parseFloat(el.coop).toFixed(2),
                    seedhub: parseFloat(el.seedhub).toFixed(2),
                    pvt: parseFloat(el.pvt).toFixed(2),
                    others: parseFloat(el.others).toFixed(2),
                    total: parseFloat(el.total).toFixed(2),
                    shtorsur: parseFloat(el.shtorsur).toFixed(2),
                    FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                    BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                  },
                ],
              });
            } else {
              filteredData[userIndex].crop_count += 1;
              filteredData[userIndex].user_area = (
                parseFloat(filteredData[userIndex].user_area) +
                parseFloat(el.AreaUnderVariety)
              ).toFixed(2);
              filteredData[userIndex].user_seed_req = (
                parseFloat(filteredData[userIndex].user_seed_req) +
                parseFloat(el.SeedRequired)
              ).toFixed(2);
              filteredData[userIndex].user_doa = (
                parseFloat(filteredData[userIndex].user_doa) +
                parseFloat(el.doa)
              ).toFixed(2);
              filteredData[userIndex].user_ssfs = (
                parseFloat(filteredData[userIndex].user_ssfs) +
                parseFloat(el.ssfs)
              ).toFixed(2);
              filteredData[userIndex].user_ssc = (
                parseFloat(filteredData[userIndex].user_ssc) +
                parseFloat(el.ssc)
              ).toFixed(2);
              filteredData[userIndex].user_nsc = (
                parseFloat(filteredData[userIndex].user_nsc) +
                parseFloat(el.nsc)
              ).toFixed(2);
              filteredData[userIndex].user_saus = (
                parseFloat(filteredData[userIndex].user_saus) +
                parseFloat(el.saus)
              ).toFixed(2);
              filteredData[userIndex].user_othergovpsu = (
                parseFloat(filteredData[userIndex].user_othergovpsu) +
                parseFloat(el.othergovpsu)
              ).toFixed(2);
              filteredData[userIndex].user_coop = (
                parseFloat(filteredData[userIndex].user_coop) +
                parseFloat(el.coop)
              ).toFixed(2);
              filteredData[userIndex].user_pvt = (
                parseFloat(filteredData[userIndex].user_pvt) +
                parseFloat(el.pvt)
              ).toFixed(2);
              filteredData[userIndex].user_seedhub = (
                parseFloat(filteredData[userIndex].user_seedhub) +
                parseFloat(el.seedhub)
              ).toFixed(2);
              filteredData[userIndex].user_others = (
                parseFloat(filteredData[userIndex].user_others) +
                parseFloat(el.others)
              ).toFixed(2);
              filteredData[userIndex].user_total = (
                parseFloat(filteredData[userIndex].user_total) +
                parseFloat(el.total)
              ).toFixed(2);
              filteredData[userIndex].user_shtorsur = (
                parseFloat(filteredData[userIndex].user_shtorsur) +
                parseFloat(el.shtorsur)
              ).toFixed(2);
              filteredData[userIndex].user_BSRequiredtomeettargetsofFS = (
                parseFloat(filteredData[userIndex].user_BSRequiredtomeettargetsofFS) +
                parseFloat(el.BSRequiredtomeettargetsofFS)
              ).toFixed(2);
              filteredData[userIndex].user_FSRequiredtomeettargetsofCS = (
                parseFloat(filteredData[userIndex].user_FSRequiredtomeettargetsofCS) +
                parseFloat(el.FSRequiredtomeettargetsofCS)
              ).toFixed(2);

              filteredData[userIndex].crop.push({
                crop_name: el.crop_name,              
                proposedAreaUnderVariety: parseFloat(el.AreaUnderVariety).toFixed(2),
                seedRequired: parseFloat(el.SeedRequired).toFixed(2),
                doa: parseFloat(el.doa).toFixed(2),
                ssfs: parseFloat(el.ssfs).toFixed(2),
                saus: parseFloat(el.saus).toFixed(2),
                ssc: parseFloat(el.ssc).toFixed(2),
                nsc: parseFloat(el.nsc).toFixed(2),
                othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                coop: parseFloat(el.coop).toFixed(2),
                seedhub: parseFloat(el.seedhub).toFixed(2),
                pvt: parseFloat(el.pvt).toFixed(2),
                others: parseFloat(el.others).toFixed(2),
                total: parseFloat(el.total).toFixed(2),
                shtorsur: parseFloat(el.shtorsur).toFixed(2),
                FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
          }); }


      })


          this.finalData = filteredData;
          this.totalData = totals;
          console.log(this.finalData, "response final");
          console.log(this.totalData, "response total");
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
         this.totalData=[]
         
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
        const route = "get-srp-year-sd";
         this.zsrmServiceService.getRequestCreator(route, null, null).subscribe(data => {
          if (data.Response.status_code === 200) {
            this.yearOfIndent =data && data.Response && data.Response.data ? data.Response.data : '';
          } 
         })
       }
       getIndentorSpaSeason(newValue) {
        const queryParams = [];
        if (newValue) queryParams.push(`year=${encodeURIComponent(newValue)}`);
        const apiUrl = `get-srp-season-sd?${queryParams.join('&')}`;
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
      
        if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
        if (newValue) queryParams.push(`season=${encodeURIComponent(newValue)}`);
    
        const apiUrl = `get-srp-state?${queryParams.join('&')}`;
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
