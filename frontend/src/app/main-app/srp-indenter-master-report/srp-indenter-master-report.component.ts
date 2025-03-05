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
  selector: 'app-srp-indenter-master-report',
  templateUrl: './srp-indenter-master-report.component.html',
  styleUrls: ['./srp-indenter-master-report.component.css']
})
export class SrpIndenterMasterReportComponent implements OnInit {

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
      this.zsrmServiceService.postRequestCreator('view-srp-master-all', null, param).subscribe(data => {

        if (data.Response.status_code === 200) {
          let res = data && data.Response && data.Response.data && data.Response.data ? data.Response.data : '';
          console.log(res, "response");
         let totals = {
            AreaUnderVariety: 0.00,
            SeedRequired: 0.00,
            doa: 0.00,
            ssfs: 0.00,
            ssc: 0.00,
            nsc: 0.00,
            saus: 0.00,
            othergovpsu: 0.00,
            coop: 0.00,
            pvt: 0.00,
            seedhub: 0.00,
            others: 0.00,
            total: 0.00,
            shtorsur: 0.00,
            BSRequiredtomeettargetsofFS: 0.00,
            FSRequiredtomeettargetsofCS: 0.00,
          };

          // Iterate through the data and sum up all the fields
          res.forEach(item => {
            totals.AreaUnderVariety += parseFloat(item.proposedAreaUnderVariety) || 0.00;
            totals.SeedRequired += parseFloat(item.seedRequired) || 0.00;
            totals.doa += parseFloat(item.doa) || 0.00;
            totals.ssfs += parseFloat(item.ssfs) || 0.00;
            totals.ssc += parseFloat(item.ssc) || 0.00;
            totals.nsc += parseFloat(item.nsc) || 0.00;
            totals.saus += parseFloat(item.saus) || 0.00;
            totals.othergovpsu += parseFloat(item.othergovpsu) || 0.00;
            totals.coop += parseFloat(item.coop) || 0.00;
            totals.pvt += parseFloat(item.pvt) || 0.00;
            totals.seedhub += parseFloat(item.seedhub) || 0.00;
            totals.others += parseFloat(item.others) || 0.00;
            totals.total += parseFloat(item.total) || 0.00;
            totals.shtorsur += parseFloat(item.shtorsur) || 0.00;
            totals.BSRequiredtomeettargetsofFS += parseFloat(item.BSRequiredtomeettargetsofFS) || 0.00;
            totals.FSRequiredtomeettargetsofCS += parseFloat(item.FSRequiredtomeettargetsofCS) || 0.00;
          }); 

          let filteredData = [];
          res.forEach((el) => {
            const cropIndex = filteredData.findIndex(
              (item) => item.crop_code === el.crop_code
            );
            if (cropIndex === -1) {
              filteredData.push({
                crop_name: el.crop_name,
                crop_code: el.crop_code,
                variety_count: 1,
                crop_area: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                crop_seed_req: parseFloat(el.seedRequired).toFixed(2),
                crop_doa: parseFloat(el.doa).toFixed(2),
                crop_ssfs: parseFloat(el.ssfs).toFixed(2),
                crop_ssc: parseFloat(el.ssc).toFixed(2),
                crop_nsc: parseFloat(el.nsc).toFixed(2),
                crop_saus: parseFloat(el.saus).toFixed(2),
                crop_othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                crop_coop: parseFloat(el.coop).toFixed(2),
                crop_pvt: parseFloat(el.pvt).toFixed(2),
                crop_seedhub: parseFloat(el.seedhub).toFixed(2),
                crop_others: parseFloat(el.others).toFixed(2),
                crop_total: parseFloat(el.total).toFixed(2),
                crop_shtorsur: parseFloat(el.shtorsur).toFixed(2),
                crop_BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                crop_FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),

                variety: [
                  {
                    variety_code: el.variety_code,
                    variety_name: el.variety_name,
                    not_year: el.not_year,
                    proposedAreaUnderVariety: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                    seedrate: parseFloat(el.seedrate).toFixed(2),
                   
                    SRRTargetbySTATE: parseFloat(el.SRRTargetbySTATE).toFixed(2),
                    seedRequired: parseFloat(el.seedRequired).toFixed(2),
                    qualityquant: parseFloat(el.qualityquant).toFixed(2),
                    certifiedquant: parseFloat(el.certifiedquant).toFixed(2),
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
                    SMRKeptBSToFS: parseFloat(el.SMRKeptBSToFS).toFixed(2),
                    SMRKeptFSToCS: parseFloat(el.SMRKeptFSToCS).toFixed(2),
                    FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                    BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                  },
                ],
              });
            } else {
              filteredData[cropIndex].variety_count += 1;
              filteredData[cropIndex].crop_area = (
                parseFloat(filteredData[cropIndex].crop_area) +
                parseFloat(el.proposedAreaUnderVariety)
              ).toFixed(2);
              filteredData[cropIndex].crop_seed_req = (
                parseFloat(filteredData[cropIndex].crop_seed_req) +
                parseFloat(el.seedRequired)
              ).toFixed(2);
              filteredData[cropIndex].crop_doa = (
                parseFloat(filteredData[cropIndex].crop_doa) +
                parseFloat(el.doa)
              ).toFixed(2);
              filteredData[cropIndex].crop_ssfs = (
                parseFloat(filteredData[cropIndex].crop_ssfs) +
                parseFloat(el.ssfs)
              ).toFixed(2);
              filteredData[cropIndex].crop_ssc = (
                parseFloat(filteredData[cropIndex].crop_ssc) +
                parseFloat(el.ssc)
              ).toFixed(2);
              filteredData[cropIndex].crop_nsc = (
                parseFloat(filteredData[cropIndex].crop_nsc) +
                parseFloat(el.nsc)
              ).toFixed(2);
              filteredData[cropIndex].crop_saus = (
                parseFloat(filteredData[cropIndex].crop_saus) +
                parseFloat(el.saus)
              ).toFixed(2);
              filteredData[cropIndex].crop_othergovpsu = (
                parseFloat(filteredData[cropIndex].crop_othergovpsu) +
                parseFloat(el.othergovpsu)
              ).toFixed(2);
              filteredData[cropIndex].crop_coop = (
                parseFloat(filteredData[cropIndex].crop_coop) +
                parseFloat(el.coop)
              ).toFixed(2);
              filteredData[cropIndex].crop_pvt = (
                parseFloat(filteredData[cropIndex].crop_pvt) +
                parseFloat(el.pvt)
              ).toFixed(2);
              filteredData[cropIndex].crop_seedhub = (
                parseFloat(filteredData[cropIndex].crop_seedhub) +
                parseFloat(el.seedhub)
              ).toFixed(2);
              filteredData[cropIndex].crop_others = (
                parseFloat(filteredData[cropIndex].crop_others) +
                parseFloat(el.others)
              ).toFixed(2);
              filteredData[cropIndex].crop_total = (
                parseFloat(filteredData[cropIndex].crop_total) +
                parseFloat(el.total)
              ).toFixed(2);
              filteredData[cropIndex].crop_shtorsur = (
                parseFloat(filteredData[cropIndex].crop_shtorsur) +
                parseFloat(el.shtorsur)
              ).toFixed(2);
              filteredData[cropIndex].crop_BSRequiredtomeettargetsofFS = (
                parseFloat(filteredData[cropIndex].crop_BSRequiredtomeettargetsofFS) +
                parseFloat(el.BSRequiredtomeettargetsofFS)
              ).toFixed(2);
              filteredData[cropIndex].crop_FSRequiredtomeettargetsofCS = (
                parseFloat(filteredData[cropIndex].crop_FSRequiredtomeettargetsofCS) +
                parseFloat(el.FSRequiredtomeettargetsofCS)
              ).toFixed(2);

              filteredData[cropIndex].variety.push({
                variety_code: el.variety_code,
                variety_name: el.variety_name,
                not_year: el.not_date,
                proposedAreaUnderVariety: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                seedrate: parseFloat(el.seedrate).toFixed(2),
                SRRTargetbySTATE: parseFloat(el.SRRTargetbySTATE).toFixed(2),
                seedRequired: parseFloat(el.seedRequired).toFixed(2),
                qualityquant: parseFloat(el.qualityquant).toFixed(2),
                certifiedquant: parseFloat(el.certifiedquant).toFixed(2),
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
                SMRKeptBSToFS: parseFloat(el.SMRKeptBSToFS).toFixed(2),
                SMRKeptFSToCS: parseFloat(el.SMRKeptFSToCS).toFixed(2),
                FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
          }); }


      })


          this.finalData = filteredData;
          this.totalData = totals;
          console.log(this.totalData, "response total");
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
      margin: 5,
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 100,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
      jsPDF: { unit: 'mm', format: [300,  700], orientation: 'landscape' }
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
        this.yearOfIndent = data && data.Response && data.Response.data ? data.Response.data : '';
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
    this.cropList = []
    this.cropVarietList = [];
    const queryParams = [];
    const year = this.ngForm.controls['year_of_indent'].value;
    const season = this.ngForm.controls['season'].value;
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
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
  }}


