
// import { Component, OnIsubmit-indents-breeder-seedsnit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { BrowserModule } from '@angular/platform-browser';
import { MaximumLotSizeSearchComponent } from 'src/app/common/maximum-lot-size-search/maximum-lot-size-search.component';
import { MasterService } from 'src/app/services/master/master.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-list-of-indentors-report',
  templateUrl: './list-of-indentors-report.component.html',
  styleUrls: ['./list-of-indentors-report.component.css']
})


export class ListOfIndentorsReportComponent implements OnInit {
  @ViewChild(MaximumLotSizeSearchComponent) indentBreederSeedAllocationSearchComponent: MaximumLotSizeSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;
  seasonList: any = [];
  response_crop_group: any = [];
  data: any;
  data1: any;
  custom_array: any[];
  finalData: any[];
  fileName = 'list-of-indentors-report.xlsx';
  yearOfIndent: any = [
    // {name: "2025 - 2026", "value": "2025"},
    // {name: "2024 - 2025", "value": "2024"},
    // {name: "2023 - 2024", "value": "2023"},
    // {name: "2022 - 2023", "value": "2022"},
    // {name: "2021 - 2022", "value": "2021"},
    { name: "2020 - 2021", "value": "2020" }
  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  allData: any;
  countData: any;
  districtList: any;
  stateList: any;
  exportdata: any;
  selected_state: any;
  stateListSecond: any;
  isSearchData: boolean=false;
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router, private masterService: MasterService) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      season: ['',],
      state_id: [''],
      district_id: [''],
      crop: ['',],
      year: ['',],
      state_text: ['']

    });
    this.ngForm.controls['state_id'].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.getDistrictList(newValue);
      }
    })
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.stateList = response
      }
      else {
        this.getStateList()
      }
    });
  }
  ngOnInit(): void {
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   // location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.getPageData();
    this.getStateList();
    this.runExcelApi();
    // this.shortStatename();
    // this.getCroupCroupList();
    // this.getSeasonData();
    // this.submitindentor();
  }

  async getStateList() {
    this.masterService
      .getRequestCreatorNew("get-state-list")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data;
          this.stateListSecond = this.stateList
        }
      });
  }

  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state_code": newValue
      }
    };
    this.masterService
      .postRequestCreator("get-district-list", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data;
        }
      });
  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let route = "getAllIndentorsList";

    let data = {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      search: { state_code: this.ngForm.controls['state_id'].value, }
    }
    this.service.postRequestCreator(route, null, data).subscribe(data => {
      console.log(data)
      this.filterPaginateSearch.itemListPageSize = 50;
      this.allData = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;

      this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      this.initSearchAndPagination();
      this.runExcelApi()
      // this.filterPaginateSearch.Init(data.EncryptedResponse.data.rows, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      // this.initSearchAndPagination();
    });
  }
search(){
  this.isSearchData=true
  this.getPageData()
}
  initSearchAndPagination() {
    this.paginationUiComponent.Init(this.filterPaginateSearch);

    if (this.indentBreederSeedAllocationSearchComponent === undefined || this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }

    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    // this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  submit() {
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    } else {
      this.isSearch = true;
      this.year = this.ngForm.controls['year'].value;
      this.season = this.ngForm.controls['season'].value;
      this.crop = this.ngForm.controls['crop'].value;
    }
  }

  // cropGroup(data: string) { { } }
  // async shortStatename() {
  //   const route = 'get-state-list';
  //   const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
  //     this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
  //     // console.log('state======>',this.statename);

  //   })
  // }

  // async submitindentor(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

  //   const route = 'submit-indents-breeder-seeds-list';
  //   const result = await this.breederService.postRequestCreator(route, null, {
  //     page: loadPageNumberData,
  //     pageSize: this.filterPaginateSearch.itemListPageSize || 10,
  //     search: searchData
  //   }).subscribe((apiResponse: any) => {
  //     if (apiResponse !== undefined
  //       && apiResponse.EncryptedResponse !== undefined
  //       && apiResponse.EncryptedResponse.status_code == 200) {
  //       this.identor = apiResponse.EncryptedResponse.data.data;
  //       this.data1 = apiResponse.EncryptedResponse.data;
  //       this.custom_array = [];
  //       // console.log('this.identorthis.identor',varietyId);
  //       // arr = arr.data
  //       let varietyId = []
  //       for (let value of this.identor) {
  //         varietyId.push(value.m_crop_variety.variety_name)
  //       }
  //       varietyId = [...new Set(varietyId)]
  //       let newObj = [];

  //       for (let value of varietyId) {
  //         let keyArr = [];
  //         for (let val of this.identor) {
  //           if (val.m_crop_variety.variety_name == value) {
  //             let state = val.user.agency_detail.m_state.state_short_name;
  //             keyArr.push({ "state": state, 'value': val.indent_quantity });
  //           }
  //         }
  //         let variety_id = (value).toString();
  //         newObj.push({ "variety_id": value, 'data': keyArr })
  //       }

  //       this.finalData = newObj;
  //       // console.log('this.identorthis.identor',this.finalData);

  //       this.tableId = [];
  //       for (let id of this.identor) {
  //         this.tableId.push(id.id);
  //       }
  //       console.log('this.identorthis.identor', this.tableId);

  //       const results = this.identor.filter(element => {
  //         if (Object.keys(element).length !== 0) {
  //           return true;
  //         }

  //         return false;
  //       });
  //       // console.log(results, 'resultssssssss');
  //       if (this.identor === undefined) {
  //         this.identor = [];
  //       }
  //       // let data =[];
  //       const removeEmpty = (obj) => {
  //         Object.entries(obj).forEach(([key, val]) =>
  //           (val && typeof val === 'object') && removeEmpty(val) ||
  //           (val === null || val === "") && delete obj[key]
  //         );
  //         return obj;
  //       };
  //       removeEmpty(this.identor)
  //       this.filterPaginateSearch.Init(results, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count);
  //       this.initSearchAndPagination();
  //     }

  //   });
  // }

  // freeze() {
  //   const searchFilters = {
  //     "search": {
  //       "id": this.tableId
  //     }
  //   };
  //   const route = "freeze-indent-breeder-seed-data";
  //   this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
  //     if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
  //       && apiResponse.EncryptedResponse.status_code == 200) {
  //       Swal.fire({
  //         toast: true,
  //         icon: "success",
  //         title: "Data Has Been Successfully Updated",
  //         position: "center",
  //         showConfirmButton: false,
  //         showCancelButton: false,
  //         timer: 2000
  //       }).then(x => {

  //         this.router.navigate(['/submit-indents-breeder-seeds']);
  //       })
  //     }
  //     else {

  //       Swal.fire({
  //         toast: true,
  //         icon: "error",
  //         title: "An error occured",
  //         position: "center",
  //         showConfirmButton: false,
  //         showCancelButton: false,
  //         timer: 2000
  //       })
  //     }

  //   });
  // }

  // getSeasonData() {
  //   const route = "get-season-details";
  //   const result = this.service.postRequestCreator(route, null).subscribe(data => {
  //     this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
  //     // console.log(this.seasonList);
  //   })
  // }
  // getCroupCroupList() {
  //   const route = "crop-group";
  //   const result = this.service.getPlansInfo(route).then((data: any) => {
  //     this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
  //   })
  // }
  // initSearchAndPagination() {
  //   this.paginationUiComponent.Init(this.filterPaginateSearch);
  //   if (this.paginationUiComponent === undefined) {


  //     setTimeout(() => {
  //       this.initSearchAndPagination();
  //     }, 300);
  //     return;
  //   }
  //   // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
  // }

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

  runExcelApi() {

    let route = "getAllIndentorsList";

    let data = {

      search: { state_code: this.ngForm.controls['state_id'].value, }
    }
    this.service.postRequestCreator(route, null, data).subscribe(data => {
      console.log(data)
      // this.filterPaginateSearch.itemListPageSize = 10;
      this.exportdata = data.EncryptedResponse.data.rows;
      console.log('exportdata', this.exportdata)
      this.countData = data.EncryptedResponse.data.count;

      // this.filterPaginateSearch.Init(this.exportdata, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      // this.initSearchAndPagination();
      // this.filterPaginateSearch.Init(data.EncryptedResponse.data.rows, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      // this.initSearchAndPagination();  
    });
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

    // let selectedreportDataHeader = [
    //   { text: 'Selected State Name', bold: true },
    // ]
    // let selectedReportData = this.exportdata.map((element, index) => {
    //   let selectedReportData = [

    //     this.ngForm.controls['state_id'].value ? this.ngForm.controls['state_id'].value : "Na"
    //   ]
    //   return selectedReportData
    // },
    // )

    // selectedReportData = [[...selectedreportDataHeader], ...selectedReportData]


    let reportDataHeader = [{ text: 'S/N', bold: true }, { text: 'Agency Name', bold: true }, { text: 'State', bold: true }, { text: 'District', bold: true },
    { text: 'Address', bold: true },
    { text: 'Contact Person Name', bold: true }, { text: 'Mobile Number', bold: true }, { text: 'Email', bold: true },
    { text: 'Status', bold: true },
    ]

    let reportData = this.exportdata.map((element, index) => {
      let reportData = [
        index + 1,
        element && element.agency_name ? element.agency_name : 'NA',
        element && element.m_state ? element.m_state.state_name : 'NA',
        element && element.m_district && element.m_district.district_name ? element.m_district.district_name : 'NA',
        // element && element && element.latitude ? element.latitude : 'NA',
        // element && element.longitude ? element.longitude : 'NA',
        element && (element.address) ? element.address : 'NA',
        element && (element.contact_person_name) ? element.contact_person_name : 'NA',
        //  element &&(element.agency_detail && element.agency_detail.designation_id) ? element.agency_detail.designation_id : 'NA',
        element && element.mobile_number ? element.mobile_number : 'NA',
        element && (element.email) ? element.email : 'NA',
        element && (element.is_active) &&(element.is_active==1)?'ACTIVE':"ISACTIVE"
      ]
      return reportData;
    })

    reportData = [[...reportDataHeader], ...reportData,]
    let pageWidth = 1700
    let numberOfColumn = 10
    let numberOfCharecter = 30
    const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn
    const maxFontSize = columnWidth / (1 * numberOfCharecter)
    let docDefinition;
    if(this.isSearchData){

       docDefinition = {
        pageOrientation: 'landscape',
        // pageSize: {
        //   width: 1800,
        //   height: 600,
        // },
  
        content: [
          { text: 'List of Indenters', style: 'header' },
          { text: `State Name : ${this.getStateListData(this.ngForm.controls['state_id'].value)}`,  },
          // {
          //   style: 'indenterTable',
          //   table: {
          //     // widths: [5,15,10,10,10,10,10,10,10,10],
          //     body:
          //       // selectedReportData,
  
          //   },
          // },
          {
            style: 'indenterTable',
            table: {
              // widths: [5,15,10,10,10,10,10,10,10,10],
              body:
                reportData,
  
            },
          },
  
  
          // Add more table objects as needed
        ],
        // content: [
        //   { text: 'List of Indenters', style: 'header' },
  
        //   {
        //     style: 'indenterTable',
        //     table: {
        //       // widths: [5,15,10,10,10,10,10,10,10,10],
        //       body: 
        //       reportData,
  
        //     },
        //   },
        // ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
          },
          indenterTable: {
  
            fontSize: maxFontSize,
            margin: [0, 5, 0, 15],
          },
        },
      };
    }
    else{
      docDefinition = {
        pageOrientation: 'landscape',
        // pageSize: {
        //   width: 1800,
        //   height: 600,
        // },
  
        content: [
          { text: 'List of Indenters', style: 'header' },
          // { text: `State Name : ${this.getStateListData(this.ngForm.controls['state_id'].value)}`, style: 'header' },
          // {
          //   style: 'indenterTable',
          //   table: {
          //     // widths: [5,15,10,10,10,10,10,10,10,10],
          //     body:
          //       // selectedReportData,
  
          //   },
          // },
          {
            style: 'indenterTable',
            table: {
              // widths: [5,15,10,10,10,10,10,10,10,10],
              body:
                reportData,
  
            },
          },
  
  
          // Add more table objects as needed
        ],
        // content: [
        //   { text: 'List of Indenters', style: 'header' },
  
        //   {
        //     style: 'indenterTable',
        //     table: {
        //       // widths: [5,15,10,10,10,10,10,10,10,10],
        //       body: 
        //       reportData,
  
        //     },
        //   },
        // ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
          },
          indenterTable: {
  
            fontSize: maxFontSize,
            margin: [0, 5, 0, 15],
          },
        },
      };
    }
    pdfMake.createPdf(docDefinition).download('Indenter_list.pdf');
  }

  click() {
    this.ngForm.controls['state_id'].setValue('');
    this.selected_state = ''
    this.isSearchData=false
    this.getPageData();
  }
  state_select(data) {

    console.log(data)
    this.selected_state = data && data.state_name ? data.state_name : '';
    this.ngForm.controls['state_id'].setValue(data && data.state_code ? data.state_code : '')

    this.ngForm.controls['state_text'].setValue('')
  }
  cnClick() {
    document.getElementById('state').click();
  }
  getStateListData(data) {

    let state_namelist = this.stateList.filter(item => item.state_code == data)
    let stateName = state_namelist && state_namelist[0] && state_namelist[0].state_name ? state_namelist[0].state_name : 'Na'
    return stateName
  }
}
