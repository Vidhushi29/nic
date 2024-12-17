
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
  selector: 'app-plant-detail-report',
  templateUrl: './plant-detail-report.component.html',
  styleUrls: ['./plant-detail-report.component.css']
})
export class PlantDetailReportComponent implements OnInit {
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
  disabledfield=true;
  finalData: any[];
  fileName = 'list-of-SPP-report.xlsx';
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
  selected_state: any;
  selected_district: any;
  stateListSecond: any;
  districtListSecond: any;
  exportdata: any;
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router, private masterService: MasterService) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      season: ['',],
      state_id: [''],
      district_id: [''],
      state_text:[''],
      district_text:[''],
      

    });
    this.ngForm.controls['state_id'].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.getDistrictList(newValue);
        this.disabledfield=false
        this.ngForm.controls['district_id'].setValue('');
        this.selected_district=''
      }
    })
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.stateList =this.stateListSecond
        let response= this.stateList.filter(x=>x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))      
        this.stateList=response;  
      }
      else{
        this.getStateList()       
      }
    });
    
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.districtList =this.districtListSecond
        let response= this.districtList.filter(x=>x['m_district.district_name'].toLowerCase().startsWith(newValue.toLowerCase()))    
        this.districtList=response
      }
      else{
        this.getDistrictList(this.ngForm.controls['state_id'].value)       
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
    // this.shortStatename();
    // this.getCroupCroupList();
    // this.getSeasonData();
    // this.submitindentor();
  }

  async getStateList() {
    this.service
      .postRequestCreator("getPlantDeatilsState")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows :'';
          this.stateListSecond = this.stateList
        }
      });
  }

  async getDistrictList(newValue: any) {
    const searchFilters = {
      "search": {
        "state": newValue
      }
    };
    this.service
      .postRequestCreator("get-plant-district-details", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data.rows;
          this.districtListSecond=  this.districtList
        }
      });
  }

  runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined){

    searchData = {
      isSearch: this.isSearch
    }
  
   

    // this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
    this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
    this.ngForm.controls['season'].value ? (searchData['season'] = this.ngForm.controls['season'].value) : '';
    this.ngForm.controls['crop'].value ? (searchData['crop'] = this.ngForm.controls['crop'].value) : '';

    this.service
      .postRequestCreator("get-plant-details", null, {
        // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        searchData: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this.filterPaginateSearch.itemListPageSize = 10;
          this.exportdata = apiResponse.EncryptedResponse.data.rows;
          if (this.exportdata === undefined) {
            this.exportdata = [];
          }
          console.log(this.exportdata)
          this.filterPaginateSearch.Init(this.exportdata, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }


 
    });
  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    let route = "get-plant-details";

    let data = {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      search: { state_code: this.ngForm.controls['state_id'].value, district_code: this.ngForm.controls['district_id'].value,}
    }
    this.service.postRequestCreator(route, null, data).subscribe(data => {
      console.log(data)
      this.filterPaginateSearch.itemListPageSize = 50;
      this.allData = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;
      this.filterPaginateSearch.Init(data.EncryptedResponse.data.rows, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      this.initSearchAndPagination();
    });
  }

  initSearchAndPagination() {


    if (this.indentBreederSeedAllocationSearchComponent === undefined || this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
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

  // download() {
  //   const name = 'list-of-indentors-report';
  //   const element = document.getElementById('excel-table');
  //   const options = {
  //     filename: `${name}.pdf`,
  //     image: { type: 'jpeg', quality: 1 },
  //     html2canvas: {
  //       dpi: 192,
  //       scale: 4,
  //       letterRendering: true,
  //       useCORS: true
  //     },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //   };
  //   html2PDF().set(options).from(element).toPdf().save();
  // }
  download() {  
    let reportDataHeader = [
      { text: 'S/N', bold: true },
    {
       text: 'Name of SPP', bold: true }, 
       {text: ' SPP Code', bold: true }, 
       { text: 'State', bold: true },
       { text: 'District', bold: true },
       { text: 'Address', bold: true },
    { text: 'Name of SPP In-charge', bold: true },
    { text: 'Designation', bold: true },
    { text: 'Mobile Number', bold: true },
     { text: 'Email ID', bold: true },
     { text: 'Status', bold: true },
                          ]

    let reportData = this.allData.map((element, index) => {   
 
    let reportData =  [
            index+1,
            element &&  element.plant_name ? element.plant_name : 'NA',           
            element &&  element.code ? element.code : 'NA',           
            element  && element.m_state.state_name ? element.m_state.state_name : 'NA',
            element   && element.m_district.district_name ? element.m_district.district_name : 'NA',                      
            element && element.address ? element.address : 'NA',          
            element  && element.contact_person_name ? element.contact_person_name : 'NA',          
             element &&(element.m_designation) && element.m_designation.name ? element.m_designation.name : 'NA',
            element && element.agency_detail &&  element.agency_detail.mobile_number ? element.agency_detail.mobile_number: 'NA',
            element  && (element.email) ? element.email : 'NA',
            element &&( element.is_active) &&  (element.is_active==1)?'ACTIVE' : 'ISACTIVE'
          ]
          return reportData;      
    })

    reportData = [[...reportDataHeader], ...reportData]
    let pageWidth = 1800
    let numberOfColumn = 10
    let numberOfCharecter = 30
    const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn
    const maxFontSize = columnWidth / (1 * numberOfCharecter)
 
    const docDefinition = {
      pageOrientation: 'landscape',
      // pageSize: {
      //   width: 1800,
      //   height: 600,
      // },

      content: [
        { text: 'List of SPP Report', style: 'header' },
        { text: `State Name : ${this.selected_state}  District Name : ${this.selected_district}`, style: 'custom' },
        {
          style: 'indenterTable',
          table: {
            // widths: [5,15,10,10,10,10,10,10,10,10],
            body: 
              reportData,
          },
        },
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        custom:{
          margin: [0, 0, 0, 10], // Set the margin if needed
          width: 400, // Set the width of the header
          // background:'#DC8B3A',
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        indenterTable: {
          
          fontSize: maxFontSize ,
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).download('spp-report.pdf');
  }

  click(){
    if(!this.ngForm.controls['state_id'].value&&
    !this.ngForm.controls['district_id'].value){
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
      return;
    }
    else{
      this.ngForm.controls['state_id'].setValue('');
    this.ngForm.controls['district_id'].setValue('');
    this.selected_district='';
    this.selected_state=''
    this.disabledfield=true;
    this.getPageData();
    }
    
    
  }
  state_select(data){
    this.selected_state = data && data.state_name ? data.state_name :'';
    this.ngForm.controls['state_id'].setValue(data && data.state_code ? data.state_code :'');
    this.ngForm.controls['state_text'].setValue("");
  }

  cnClick() {
    document.getElementById('state').click();
  }
  district_select(data){
    this.selected_district = data && data['m_district.district_name'] ? data['m_district.district_name']:'';
    this.ngForm.controls['district_id'].setValue(data && data['m_district.district_code'] ? data['m_district.district_code'] :'')

    this.ngForm.controls['district_text'].setValue("");
    
  }
  cdClick() {
    document.getElementById('district').click();
  }
}
