import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master/master.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';

@Component({
  selector: 'app-bsp-three-report',
  templateUrl: './bsp-three-report.component.html',
  styleUrls: ['./bsp-three-report.component.css']
})

export class BspThreeReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;
  response_crop_group: any = [];
  data: any;
  data1: any;
  custom_array: any[];
  finalData: any[];
  fileName = 'BSP III xlsx Report.xlsx';
  yearOfIndent: any;
  year: any;
  breeder: any;
  crop: any;
  variety: any;
  bspc: any;
  breederList: any = [];
  cropNameList: any = [];
  varietyNameList: any = [];
  bspcList: any = [];
  breeder_id: any;
  crop_id: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  seasonData: any;
  cropTypeData: any;
  breederListData: any;
  exportdata: any;
  is_search: boolean = false;
  isSearchMsg: string;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  cropdropdownHidden:boolean = true;
  varietydropdownHidden:boolean = true;
  season: any;
  crop_type: any;
  constructor(private breederService: BreederService, private masterService: MasterService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) {
    this.createEnrollForm();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      breeder: ['',],
      crop: ['',],
      year: ['',],
      variety: ['',],
      bspc: ['',],
      season: [''],
      crop_type: ['']
    });
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['breeder'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();

    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.getSeasonDataList();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_type'].enable();
        this.getCropTypeDataList();
      }
    });

    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.ngForm.controls['crop'].enable();
        this.cropdropdownHidden = false ;
        this.getCropNameList(newValue);

        // this.ngForm.controls['breeder'].enable();
        // this.breederProductionData(newValue);
      }
    });

    // this.ngForm.controls['breeder'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.ngForm.controls['crop'].enable();
    //     this.getCropNameList(newValue);
    //   }
    // });

    this.ngForm.controls['crop'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.ngForm.controls['variety'].enable();
        this.varietydropdownHidden = false;
        this.getVarietyNameList(newValue);
      }
    });
  }
  ngOnInit(): void {
    if (this.is_search == false) {
      this.isSearchMsg = "Please Select Filter."
    }
    this.getYearDataList();
    // this.getMasterBspReportData();
    this.dropdownSettings = {
      idField: 'crop_code',
      textField: 'crop_name',
      allowSearchFilter:true
      // enableCheckAll: false,
      // limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'variety_code',
      textField: 'variety_name',
      allowSearchFilter:true
      // enableCheckAll: false,
      // limitSelection: -1,
    };
    this.runExcelApi();
  }

  getYearDataList() {
    const route = "getbspthreeYearofIndent";
    const result = this.masterService.getPlansInfo(route,null,null).then((data: any) => {
      this.yearOfIndent = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
    })
  }

  getSeasonDataList() {
    const route = "get-bsp-three-filter-data";
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls['year'].value
      }
    }).subscribe((data: any) => {
      this.seasonData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
    })
  }

  getCropTypeDataList() {
    const route = "get-bsp-three-filter-data";
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value
      }
    }).subscribe((data: any) => {
      this.cropTypeData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
      this.cropTypeData= this.cropTypeData.filter((arr, index, self) =>
      index === self.findIndex((t) => (t.crop_type === arr.crop_type )))
    })
  }

  getCroupCroupList() {
    const route = "crop-group";
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }

  breederProductionData(newValue) {
    let route = "get-bsp-three-filter-data";
    this.masterService.postRequestCreator(route, null, {
      search: {
        crop_type: newValue,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value
      }
    }).subscribe(res => {
      this.breederListData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : ''
      console.log('this.breederListData', this.breederListData);
    })
  }

  async getCropNameList(newValue) {
    this.masterService
      .postRequestCreator("get-bsp-three-filter-data", null, {
        search: {
          // breeder_id: newValue,
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season'].value,
          crop_type: this.ngForm.controls['crop_type'].value
        }
      })
      .subscribe((res: any) => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code && res.EncryptedResponse.status_code == 200) {
          this.cropNameList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
        }
      });
  }

  async getVarietyNameList(newValue) {
    let crop_code = [];
      newValue.forEach(ele => {
      crop_code.push(ele.crop_code)
    });
    // console.log('crop_code', crop_code);
    let route = "get-bsp-three-filter-data";
    this.masterService.postRequestCreator(route, null, {
      search: {
        crop_code: crop_code,
        // breeder_id: this.ngForm.controls['breeder'].value,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.ngForm.controls['crop_type'].value
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse.EncryptedResponse.status_code == 200) {
        this.varietyNameList = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : [];
      }
    });
  }

  submit() {

    if (
      !this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value ||
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
      // this.searchBtn = true;     
    } else {
      this.is_search = true;
      this.isSearch = true;
      this.year = this.ngForm.controls['year'].value;
      this.breeder = this.ngForm.controls['breeder'].value;
      this.crop = this.ngForm.controls['crop'].value;
      this.variety = this.ngForm.controls['variety'].value;
      this.bspc = this.ngForm.controls['bspc'].value;
      this.season = this.ngForm.controls['season'].value;
      this.crop_type = this.ngForm.controls['crop_type'].value;
    
      let crop_code = [];
      if(this.crop != undefined && this.crop.length > 0){
        this.crop.forEach(ele => {
          crop_code.push(ele.crop_code);
        }
        );
      }
     
      // this.variety = [];
      let variety_code = []
      if(this.variety != undefined && this.variety.length > 0)
      this.variety.forEach(ele => {
        variety_code.push(ele.variety_code);
      });
      const searchData = {
        year: this.year,
        breeder: this.breeder,
        crop: crop_code ?crop_code:'',
        variety: variety_code?variety_code:'',
        season: this.ngForm.controls['season'].value,
        crop_type:this.ngForm.controls['crop_type'].value,
      }
      this.masterService.postRequestCreator('getbsp3reportdata',null,searchData).subscribe(data=>{
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data  :'' 
        this.exportdata = data.EncryptedResponse.data;
        let arr=[]
        let arr2= [];
        var arrayResult = []

        for(let index in this.exportdata){
          console.log(this.exportdata[index])
          arr.push(this.exportdata[index])
          // arr2.push({...arr[0],...arr[1]})
          
        }
       
        
        // console.log(arr2)
        // const merged = this.exportdata.reduce((acc, o) => {
        //   acc[o['m_crop.crop_name']] = Object.assign(acc['m_crop.crop_name'] || {}, o)
        //   return acc;
        // }, {})
        // const output = Object.values(merged)

// console.log(output)
        for (const dataKey in this.exportdata) {

          this.exportdata[dataKey]['variety_name'] = this.exportdata[dataKey]['m_crop_variety.variety_name'];
          this.exportdata[dataKey]['agency_name'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
          this.exportdata[dataKey]['indent_quantity'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
          this.exportdata[dataKey]['available_nucleus_seeds'] = this.exportdata[dataKey]['nucleus_seed_availability.quantity'];
          this.exportdata[dataKey]['contact_person_name'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
          this.exportdata[dataKey]['contact_person_designation'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.m_designatio'];
          this.exportdata[dataKey]['contact_person_address'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.address'];
          this.exportdata[dataKey]['quantity_of_seed_produced'] = this.exportdata[dataKey]['bsp_1.quantity_of_seed_produced'];
          this.exportdata[dataKey]['m_crop.crop_name'] = this.exportdata[dataKey]['m_crop.crop_name'];

          if (this.exportdata[dataKey]['expct_harv_frm'] && this.exportdata[dataKey]['expct_harv_to']) {
            this.exportdata[dataKey]['expct_harv_frm_to'] = 'From ' + this.exportdata[dataKey]['expct_harv_frm'] + ' To ' + this.exportdata[dataKey]['expct_harv_to'];
          } else if (this.exportdata[dataKey]['expct_harv_frm']) {
            this.exportdata[dataKey]['expct_harv_frm_to'] = 'From ' + this.exportdata[dataKey]['expct_harv_frm'];
          } else if (this.exportdata[dataKey]['expct_harv_to']) {
            this.exportdata[dataKey]['expct_harv_frm_to'] = 'To ' + this.exportdata[dataKey]['expct_harv_to'];
          } else {
            this.exportdata[dataKey]['expct_harv_frm_to'] = 'NA';
          }

          if (this.exportdata[dataKey]['expct_insp_frm'] && this.exportdata[dataKey]['expct_insp_to']) {
            this.exportdata[dataKey]['expct_insp_frm_to'] = 'From ' + this.exportdata[dataKey]['expct_insp_frm'] + ' To ' + this.exportdata[dataKey]['expct_insp_to'];
          } else if (this.exportdata[dataKey]['expct_insp_frm']) {
            this.exportdata[dataKey]['expct_insp_frm_to'] = 'From ' + this.exportdata[dataKey]['expct_insp_frm'];
          } else if (this.exportdata[dataKey]['expct_insp_to']) {
            this.exportdata[dataKey]['expct_insp_frm_to'] = 'To ' + this.exportdata[dataKey]['expct_insp_to'];
          } else {
            this.exportdata[dataKey]['expct_insp_frm_to'] = 'NA';
          }

          delete this.exportdata[dataKey]['bsp_1.quantity_of_seed_produced'];
          delete this.exportdata[dataKey]['expct_harv_frm'];
          delete this.exportdata[dataKey]['expct_harv_to'];
          delete this.exportdata[dataKey]['expct_insp_frm'];
          delete this.exportdata[dataKey]['expct_insp_to'];
          delete this.exportdata[dataKey]['m_crop_variety.variety_name'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
          delete this.exportdata[dataKey]['nucleus_seed_availability.quantity'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.id'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.id'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.address'];
        }
        // console.log( this.exportdata,' this.exportdata')
      })

      this.getMasterBspReportData(1, searchData);
    }
  }

  clear() {
    this.is_search = false;
    this.data1 = [];
    this.varietydropdownHidden = true;
    this.cropdropdownHidden = true;
    this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['breeder'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.ngForm.controls['variety'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_type'].patchValue("");

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['breeder'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();

    // this.getMasterBspReportData();
  }

  cropGroup(data: string) {
    { }
  }

  async shortStatename() {
    const route = 'get-state-list';
    const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
      this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      // console.log('state======>',this.statename);

    })
  }

  async getMasterBspReportData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    // const route = 'get-master-bsp-report-data';
    const route = 'get-master-bsp-three-report-data';
    const result = await this.masterService.postRequestCreator(route, null, {
      reportType: 'three',
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: searchData
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined &&
        apiResponse.EncryptedResponse !== undefined &&
        apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data.data;
        // this.data1 = apiResponse.EncryptedResponse.data;

        let reportDataArray = [];
        let reportDataArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : '';
        reportDataArr.forEach(ele => {

          if (ele != null || ele != undefined) {
            reportDataArray.push(ele);
          }

        });
        this.data1 = reportDataArray;
        console.log('data=============',this.data1);
        // if ((this.ngForm.controls['season'].value && this.ngForm.controls['year'].value && this.ngForm.controls['crop'].value)) {
        //   this.data1 = reportDataArray.filter(
        //     item => item.season == this.ngForm.controls['season'].value &&
        //       item.year == this.ngForm.controls['year'].value &&
        //       item.crop_code == this.ngForm.controls['crop'].value
        //   )
        // }
        // if (this.ngForm.controls['variety'].value && (this.ngForm.controls['season'].value && this.ngForm.controls['year'].value && this.ngForm.controls['crop'].value)) {
        //   this.data1 = reportDataArray.filter(
        //     item => item.season == this.ngForm.controls['season'].value &&
        //       item.year == this.ngForm.controls['year'].value &&
        //       item.crop_code == this.ngForm.controls['crop'].value &&
        //       item.bspc.filter(ele =>
        //         (ele.variety_code == this.ngForm.controls['variety'].value)
        //       )
        //   )
        // }

        // for (const dataKey in this.data1) {

        //   this.data1[dataKey]['variety_name'] = this.data1[dataKey]['m_crop_variety.variety_name'];
        //   this.data1[dataKey]['agency_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
        //   this.data1[dataKey]['indent_quantity'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
        //   this.data1[dataKey]['available_nucleus_seeds'] = this.data1[dataKey]['nucleus_seed_availability.quantity'];
        //   this.data1[dataKey]['contact_person_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
        //   this.data1[dataKey]['contact_person_designation'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
        //   this.data1[dataKey]['mtr_name'] = this.data1[dataKey]['monitoring_team.mtr_name'];
        //   this.data1[dataKey]['mtr_mobile'] = this.data1[dataKey]['monitoring_team.mtr_mobile'];
        //   this.data1[dataKey]['mtr_desig'] = this.data1[dataKey]['monitoring_team.mtr_desig'];
        //   this.data1[dataKey]['mtr_inst'] = this.data1[dataKey]['monitoring_team.mtr_inst'];
        //   this.data1[dataKey]['mtr_adrs'] = this.data1[dataKey]['monitoring_team.mtr_adrs'];
        //   this.data1[dataKey]['expct_prod'] = this.data1[dataKey]['bsp_2.expct_prod'];
        //   this.data1[dataKey]['field_loc'] = this.data1[dataKey]['bsp_2.field_loc'];
        //   this.data1[dataKey]['quantity_of_seed_produced'] = this.data1[dataKey]['bsp_2.bsp_1.quantity_of_seed_produced'];
        //   this.data1[dataKey]['area'] = this.data1[dataKey]['bsp_2.area'];


        //   if (this.data1[dataKey]['mtr_inst'] && this.data1[dataKey]['mtr_adrs']) {
        //     this.data1[dataKey]['mtr_inst_adrs'] = this.data1[dataKey]['mtr_inst'] + ' (' + this.data1[dataKey]['mtr_adrs'] + ')';
        //   } else if (this.data1[dataKey]['mtr_inst']) {
        //     this.data1[dataKey]['mtr_inst_adrs'] = this.data1[dataKey]['mtr_inst'];
        //   } else if (this.data1[dataKey]['mtr_adrs']) {
        //     this.data1[dataKey]['mtr_inst_adrs'] = this.data1[dataKey]['mtr_adrs'];
        //   } else {
        //     this.data1[dataKey]['mtr_inst_adrs'] = 'NA';
        //   }

        //   delete this.data1[dataKey]['bsp_2.area'];
        //   delete this.data1[dataKey]['bsp_2.bsp_1.quantity_of_seed_produced'];
        //   delete this.data1[dataKey]['bsp_2.expct_prod'];
        //   delete this.data1[dataKey]['bsp_2.field_loc'];
        //   delete this.data1[dataKey]['monitoring_team.mtr_name'];
        //   delete this.data1[dataKey]['monitoring_team.mtr_mobile'];
        //   delete this.data1[dataKey]['monitoring_team.mtr_desig'];
        //   delete this.data1[dataKey]['monitoring_team.mtr_inst'];
        //   delete this.data1[dataKey]['monitoring_team.mtr_adrs'];
        //   delete this.data1[dataKey]['m_crop_variety.variety_name'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
        //   delete this.data1[dataKey]['nucleus_seed_availability.quantity'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.id'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.id'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
        // }
      }

    });
  }

  async runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const route = 'get-master-bsp-report-data';
    const result = await this.masterService.postRequestCreator(route, null, {
      reportType: 'two',

      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: searchData
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined &&
        apiResponse.EncryptedResponse !== undefined &&
        apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data.data;
        this.exportdata = apiResponse.EncryptedResponse.data;

        for (const dataKey in this.exportdata) {

          this.exportdata[dataKey]['variety_name'] = this.exportdata[dataKey]['m_crop_variety.variety_name'];
          this.exportdata[dataKey]['agency_name'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
          this.exportdata[dataKey]['indent_quantity'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
          this.exportdata[dataKey]['available_nucleus_seeds'] = this.exportdata[dataKey]['nucleus_seed_availability.quantity'];
          this.exportdata[dataKey]['contact_person_name'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
          this.exportdata[dataKey]['contact_person_designation'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.m_designatio'];
          this.exportdata[dataKey]['contact_person_address'] = this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.address'];
          this.exportdata[dataKey]['quantity_of_seed_produced'] = this.exportdata[dataKey]['bsp_1.quantity_of_seed_produced'];

          if (this.exportdata[dataKey]['expct_harv_frm'] && this.exportdata[dataKey]['expct_harv_to']) {
            this.exportdata[dataKey]['expct_harv_frm_to'] = 'From ' + this.exportdata[dataKey]['expct_harv_frm'] + ' To ' + this.exportdata[dataKey]['expct_harv_to'];
          } else if (this.exportdata[dataKey]['expct_harv_frm']) {
            this.exportdata[dataKey]['expct_harv_frm_to'] = 'From ' + this.exportdata[dataKey]['expct_harv_frm'];
          } else if (this.exportdata[dataKey]['expct_harv_to']) {
            this.exportdata[dataKey]['expct_harv_frm_to'] = 'To ' + this.exportdata[dataKey]['expct_harv_to'];
          } else {
            this.exportdata[dataKey]['expct_harv_frm_to'] = 'NA';
          }

          if (this.exportdata[dataKey]['expct_insp_frm'] && this.exportdata[dataKey]['expct_insp_to']) {
            this.exportdata[dataKey]['expct_insp_frm_to'] = 'From ' + this.exportdata[dataKey]['expct_insp_frm'] + ' To ' + this.exportdata[dataKey]['expct_insp_to'];
          } else if (this.exportdata[dataKey]['expct_insp_frm']) {
            this.exportdata[dataKey]['expct_insp_frm_to'] = 'From ' + this.exportdata[dataKey]['expct_insp_frm'];
          } else if (this.exportdata[dataKey]['expct_insp_to']) {
            this.exportdata[dataKey]['expct_insp_frm_to'] = 'To ' + this.exportdata[dataKey]['expct_insp_to'];
          } else {
            this.exportdata[dataKey]['expct_insp_frm_to'] = 'NA';
          }

          delete this.exportdata[dataKey]['bsp_1.quantity_of_seed_produced'];
          delete this.exportdata[dataKey]['expct_harv_frm'];
          delete this.exportdata[dataKey]['expct_harv_to'];
          delete this.exportdata[dataKey]['expct_insp_frm'];
          delete this.exportdata[dataKey]['expct_insp_to'];
          delete this.exportdata[dataKey]['m_crop_variety.variety_name'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
          delete this.exportdata[dataKey]['nucleus_seed_availability.quantity'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.id'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.id'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
          delete this.exportdata[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.address'];
        }
      }


    });
  }
  freeze() {
    const searchFilters = {
      "search": {
        "id": this.tableId
      }
    };
    const route = "freeze-indent-breeder-seed-data";
    this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code &&
        apiResponse.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {

          this.router.navigate(['/bsp-three-report']);
        })
      } else {

        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
        })
      }

    });
  }

  initSearchAndPagination() {
    this.paginationUiComponent.Init(this.filterPaginateSearch);
    if (this.paginationUiComponent === undefined) {


      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
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
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'bsp-three-report';
    const element = document.getElementById('pdf-table');
    const options = {
      filename: `${name}.pdf`,
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        dpi: 192,
        scale: 4,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape'
      }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  getBreederList() {
    const route = "get-breeder-name-list";

    const result = this.masterService.postRequestCreator(route, null, {
      // search: {
      //   type: 'bsp-one',
      //   year: newValue
      // }
    }).subscribe((data: any) => {
      console.log('data', data);
      this.breederList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
      console.log('breeder data', this.breederList);
    })
  }

  async getBspcList(breeder_id) {
    const route = "get-bspc-list";
    const result = await this.masterService.postRequestCreator(route, null, {
      breeder_id: breeder_id
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined && apiResponse.EncryptedResponse.status_code == 200) {
        this.bspcList = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : [];
        if (!breeder_id) {
          this.bspcList = [];
        }
      }
    });
  }

}
