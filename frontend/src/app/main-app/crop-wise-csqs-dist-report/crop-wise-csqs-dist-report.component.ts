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
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';

@Component({
  selector: 'app-crop-wise-csqs-dist-report',
  templateUrl: './crop-wise-csqs-dist-report.component.html',
  styleUrls: ['./crop-wise-csqs-dist-report.component.css'],
})
export class CropWiseCsqsDistReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent:
    | PaginationUiComponent
    | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  fileName = 'Crop-wise-cs-qs-distribution.xlsx';

  yearsData: any;
  seasonData: any;
  cropGroupData: any;
  cropData: any;
  crop_groups;
  cropListData;
  selectCrop_group;
  crop_name_list = [];
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
  state_cultivation;
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

    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          this.getIndentorCropType(newValue);
          this.ngForm.controls['season'].patchValue('');
          this.ngForm.controls['crop_group'].patchValue('');
          this.ngForm.controls['state_name'].patchValue('');
          this.ngForm.controls['variety_name'].setValue('');
          this.ngForm.controls['crop_type'].setValue('');
          this.ngForm.controls['spa_name'].setValue('');
          this.spa_names = '';
        }
      }
    );
  }

  ngOnInit(): void {
    this.yearsData = [];
    this.getIndentorSpaYear();
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
    if (
      !this.ngForm.controls['year_of_indent'].value &&
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });

      return;
    }
    if (!this.ngForm.controls['crop_type'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });

      return;
    } else {
      let searchObject = {};
      this.selectedYear = 'NA';
      this.selectedCropGroup = 'NA';
      this.selectedCropName = 'NA';
      this.enableTable = true;
      const param = {
        search: {
          year: this.ngForm.controls['year_of_indent'].value,
          crop_type: this.ngForm.controls['crop_type'].value,
        },
      };
      this.zsrmServiceService
        .postRequestCreator('get-zsrm-cs-qs-dist-data-cropwise-sd', null, param)
        .subscribe((data) => {
          if (data.Response.status_code === 200) {
            let res =
              data && data.Response && data.Response.data
                ? data.Response.data
                : '';
            console.log(res, 'resonse');
            let filteredData = [];
            res.forEach((el) => {
              const cropGroupIndex = filteredData.findIndex(
                (item) => item.crop_group_code === el.crop_group_code
              );        
              if (cropGroupIndex === -1) {
                filteredData.push({
                  crop_group_code: el.crop_group_code,
                  group_name: el.group_name,
                  crop_count: 1,
                  crop_cert_k: parseFloat(el.cert_total_k).toFixed(2),
                  crop_qua_k: parseFloat(el.qua_total_k).toFixed(2),
                  crop_cert_r: parseFloat(el.cert_total_r).toFixed(2),
                  crop_qua_r: parseFloat(el.qua_total_r).toFixed(2),
                  crop_group_total: (
                    parseFloat(el.cert_total_k) +
                    parseFloat(el.qua_total_k) +
                    parseFloat(el.cert_total_r) +
                    parseFloat(el.qua_total_r)
                  ).toFixed(2),                 
                  crops: [
                    {
                      crop_name: el.crop_name,
                      crop_code: el.crop_code,
                      cert_total_k: parseFloat(el.cert_total_k).toFixed(2),
                      qua_total_k: parseFloat(el.qua_total_k).toFixed(2),
                      cert_total_r: parseFloat(el.cert_total_r).toFixed(2),
                      qua_total_r: parseFloat(el.qua_total_r).toFixed(2),
                      total_k: (
                        parseFloat(el.cert_total_k) +
                        parseFloat(el.qua_total_k) 
                      ).toFixed(2),
                      total_r: (
                        parseFloat(el.cert_total_r) +
                        parseFloat(el.qua_total_r) 
                      ).toFixed(2),
                      total: (
                        parseFloat(el.cert_total_k) +
                        parseFloat(el.qua_total_k) +
                        parseFloat(el.cert_total_r) +
                        parseFloat(el.qua_total_r)
                      ).toFixed(2),
                    },
                  ],
                });
              } else {
                filteredData[cropGroupIndex].crop_count += 1;
                filteredData[cropGroupIndex].crop_cert_k = (
                  parseFloat(filteredData[cropGroupIndex].crop_cert_k) +
                  parseFloat(el.cert_total_k)
                ).toFixed(2);
                filteredData[cropGroupIndex].crop_qua_k = (
                  parseFloat(filteredData[cropGroupIndex].crop_qua_k) +
                  parseFloat(el.qua_total_k)
                ).toFixed(2);
                filteredData[cropGroupIndex].crop_cert_r = (
                  parseFloat(filteredData[cropGroupIndex].crop_cert_r) +
                  parseFloat(el.cert_total_r)
                ).toFixed(2);
                filteredData[cropGroupIndex].crop_qua_r = (
                  parseFloat(filteredData[cropGroupIndex].crop_qua_r) +
                  parseFloat(el.qua_total_r)
                ).toFixed(2);
                filteredData[cropGroupIndex].crop_group_total = (
                  parseFloat(filteredData[cropGroupIndex].crop_group_total) +
                  parseFloat(el.cert_total_k) +
                  parseFloat(el.qua_total_k) +
                  parseFloat(el.cert_total_r) +
                  parseFloat(el.qua_total_r)
                ).toFixed(2);
                filteredData[cropGroupIndex].crops.push({
                  crop_name: el.crop_name,
                  crop_code: el.crop_code,
                  crop_cert_k: parseFloat(el.cert_total_k).toFixed(2),
                  crop_qua_k: parseFloat(el.qua_total_k).toFixed(2),
                  crop_cert_r: parseFloat(el.cert_total_r).toFixed(2),
                  crop_qua_r: parseFloat(el.qua_total_r).toFixed(2),
                  total_k: (
                    parseFloat(el.cert_total_k) +
                    parseFloat(el.qua_total_k) 
                  ).toFixed(2),
                  total_r: (
                    parseFloat(el.cert_total_r) +
                    parseFloat(el.qua_total_r) 
                  ).toFixed(2),
                  total: (
                    parseFloat(el.cert_total_k) +
                    parseFloat(el.qua_total_k) +
                    parseFloat(el.cert_total_r) +
                    parseFloat(el.qua_total_r)
                  ).toFixed(2),
                });
              }
            });
            this.finalData = filteredData;
            console.log(this.finalData);
          }
        });

      this.cropsData = [];
      this.varietyData = [];
      const pageData = [];
    }
  }

  clear() {
    this.ngForm.controls['year_of_indent'].patchValue('');
    this.ngForm.controls['season'].patchValue('');
    this.ngForm.controls['crop_group'].patchValue('');
    this.ngForm.controls['state_name'].patchValue('');
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['crop_type'].setValue('');
    this.ngForm.controls['spa_name'].setValue('');
    this.seasonList = [];
    this.cropTypeList = [];
    this.cropNameArr = '';
    this.spa_namesArr = [];
    this.selectCrop_group = '';
    this.stateIndenterList = [];

    this.spa_names = '';
    this.variety_names = '';
    this.enableTable = false;

    this.isCropName = false;
    this.cropsData = [];
    this.varietyData = [];
    this.selectedYear = '';
    this.selectedCropGroup = '';
    this.selectedCropName = '';
    this.finalData = [];
  }

  myFunction() {
    document.getElementById('myDropdown').classList.toggle('show');
  }

  exportexcel(): void {
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  download() {
    const name = 'Crop-wise-cs-qs-distribution';
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
        useCORS: true,
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  cnclick() {
    document.getElementById('crop_name').click();
  }
  crop_name(item: any) {
    this.selectCrop_group = item && item.crop_name ? item.crop_name : '';
    this.ngForm.controls['crop_name'].setValue(item && item.id ? item.id : '');
    console.log(this.ngForm.controls['crop_name'].value, 'item', item);
  }
  getIndentorSpaYear() {
    const route = 'get-zsrm-cs-qs-dist-year-sd';
    this.zsrmServiceService
      .getRequestCreator(route, null, null)
      .subscribe((data) => {
        if (data.Response.status_code === 200) {
          this.yearOfIndent =
            data && data.Response && data.Response.data
              ? data.Response.data
              : '';
        }
      });
  }
  getIndentorSpaSeason(newValue) {
    const queryParams = [];
    if (newValue) queryParams.push(`year=${encodeURIComponent(newValue)}`);
    const apiUrl = `get-zsrm-cs-qs-dist-season-sd?${queryParams.join('&')}`;
    this.zsrmServiceService.getRequestCreator(apiUrl).subscribe((data) => {
      console.log(data);
      this.seasonList =
        data && data.Response && data.Response.data ? data.Response.data : '';
    });
  }

  getIndentorCropType(newValue) {
    const queryParams = [];
    const year = this.ngForm.controls['year_of_indent'].value;
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (newValue) queryParams.push(`season=${encodeURIComponent(newValue)}`);
    const apiUrl = `get-zsrm-cs-qs-dist-croptype-sd-year-based?${queryParams.join(
      '&'
    )}`;
    this.zsrmServiceService.getRequestCreator(apiUrl).subscribe((data) => {
      console.log(data);
      this.cropTypeList =
        data && data.Response && data.Response.data ? data.Response.data : '';
    });
  }

  getIndentorCrop(newValue) {
    this.stateList = [];
    this.stateIndenterList = [];
    const queryParams = [];
    const year = this.ngForm.controls['year_of_indent'].value;
    const season = this.ngForm.controls['season'].value;
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
    if (newValue)
      queryParams.push(
        `crop_type=${encodeURIComponent(newValue.toLowerCase())}`
      );

    const apiUrl = `get-zsrm-cs-qs-dist-state?${queryParams.join('&')}`;
    console.log(apiUrl);
    this.zsrmServiceService.getRequestCreator(apiUrl).subscribe((data) => {
      let res =
        data && data.Response && data.Response.data ? data.Response.data : '';
      res.forEach((element) => {
        const temp = {
          state_name: element.name,
          id: element.user_id,
        };
        this.stateList.push(temp);
      });
      this.stateIndenterList = this.stateList;

      console.log('this.cropVarietList', this.stateList);
    });
  }
}
