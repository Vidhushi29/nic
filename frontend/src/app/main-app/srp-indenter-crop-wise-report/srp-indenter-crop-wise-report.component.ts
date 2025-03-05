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
  selector: 'app-srp-indenter-crop-wise-report',
  templateUrl: './srp-indenter-crop-wise-report.component.html',
  styleUrls: ['./srp-indenter-crop-wise-report.component.css']
})
export class SrpIndenterCropWiseReportComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
    filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  
    ngForm!: FormGroup;
    fileName = 'Crop-wise-srp-report.xlsx';
  
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
    sumData: any[];
    selectCrop_variety: any;
    variety_names: any;
    enableTable = false;
    spaName: any;
    cropList = [];
    cropDataList: any[];
    cropVarietListSecond: any;
    cropNameArr: any;
    spa_namesArr: any;
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
          this.ngForm.controls['season'].patchValue('');
          this.ngForm.controls['crop_group'].patchValue("");
          this.ngForm.controls['crop_name'].patchValue("");
          this.ngForm.controls['variety_name'].setValue('');
          this.ngForm.controls['crop_type'].setValue('');
          this.ngForm.controls['spa_name'].setValue('');
          this.spa_names = ''
          this.seasonList = [];
          this.cropTypeList = [];
          this.cropNameArr = '';
          this.spa_namesArr = []
          this.selectCrop_group = '';
          this.cropVarietList = []

          this.spa_names = ''
          this.variety_names = '';
          this.enableTable = false;
      
          this.isCropName = false;
      
          this.varietyData = []
          this.selectedYear = '';
          this.selectedCropGroup = '';
          this.selectedCropName = '';
          this.finalData = [];
          this.totalData = []
        }
  
      });
      this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.getIndentorCrop(newValue)
       
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
         this.getIndentorCrop(newValue)
       
          this.ngForm.controls['crop_group'].patchValue("");
          this.ngForm.controls['crop_name'].patchValue("");
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
        textField: 'crop_name',
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
          title: '<p style="font-size:25px;">Please Select Something.</p>',
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
        let crop_name = this.ngForm.controls['crop_name'].value;
       //  console.log(crop_name)
        let cropNameArr = [];
        this.enableTable = true;
        for (let i in crop_name) {
          cropNameArr.push(crop_name && crop_name[i] && crop_name[i].id ? crop_name[i].id : '')
        }
        const param = {
          search: {
            year: this.ngForm.controls["year_of_indent"].value,
            season: this.ngForm.controls["season"].value,
            crop_code: cropNameArr && (cropNameArr.length > 0) ? cropNameArr : '',
          }
        }
        this.zsrmServiceService.postRequestCreator('view-srp-crop-wise', null, param).subscribe(data => {
 
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
            BSRequiredBSRequiredtomeettargetsofFS: 0,
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
            totals.BSRequiredBSRequiredtomeettargetsofFS += parseFloat(item.BSRequiredBSRequiredtomeettargetsofFS) || 0;
            totals.FSRequiredtomeettargetsofCS += parseFloat(item.FSRequiredtomeettargetsofCS) || 0;
          });


           this.finalData = res;
           this.totalData = totals;
           console.log(this.totalData,"response total");
         } 
     
             
        })
        this.varietyData = [];
        const pageData = []
      }
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
      this.cropNameArr = '';
      this.spa_namesArr = []
      this.selectCrop_group = '';
      this.cropVarietList = []
  
  
  
      this.spa_names = ''
      this.variety_names = '';
      this.enableTable = false;
  
      this.isCropName = false;
  
      this.varietyData = []
      this.selectedYear = '';
      this.selectedCropGroup = '';
      this.selectedCropName = '';
      this.finalData = [];
      this.totalData = []
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
      const name = 'Crop-wise-srp-report';
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
     const route = "get-srp-year";
      this.zsrmServiceService.getRequestCreator(route, null, null).subscribe(data => {
       if (data.Response.status_code === 200) {
         this.yearOfIndent =data && data.Response && data.Response.data ? data.Response.data : '';
       } 
      })
    }
    getIndentorSpaSeason(newValue) {
     const queryParams = [];
     if (newValue) queryParams.push(`year=${encodeURIComponent(newValue)}`);
     const apiUrl = `get-srp-season?${queryParams.join('&')}`;
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
     const apiUrl = `get-srp-croptype?${queryParams.join('&')}`;
      this.zsrmServiceService.getRequestCreator(apiUrl).subscribe(data => {
       console.log(data)
        this.cropTypeList = data && data.Response && data.Response.data ? data.Response.data : '';
      })
    }
  
  
    getIndentorCrop(newValue) {
     this.cropList=[]
      this.cropVarietList = [];
      const queryParams = [];
     const year = this.ngForm.controls['year_of_indent'].value;
     const season = this.ngForm.controls['season'].value;
     if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
     if(season) queryParams.push(`season=${encodeURIComponent(season)}`);
     if (newValue) queryParams.push(`crop_type=${encodeURIComponent(newValue.toLowerCase())}`);
 
     const apiUrl = `get-srp-crop?${queryParams.join('&')}`;
     console.log(apiUrl);
      this.zsrmServiceService.getRequestCreator(apiUrl).subscribe(data => {
       let res = data && data.Response && data.Response.data ? data.Response.data : '';
       res.forEach(element => {
         const temp = {
           crop_name: element.crop_name,
           id: element.crop_code,
         }
         this.cropList.push(temp)
       });
       this.cropVarietList = this.cropList
 
       console.log("this.cropVarietList", this.cropList);
      })
    }

}
