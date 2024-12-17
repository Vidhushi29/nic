

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { MasterService } from 'src/app/services/master/master.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-seed-testing-laboratory-report',
  templateUrl: './seed-testing-laboratory-report.component.html',
  styleUrls: ['./seed-testing-laboratory-report.component.css']
})

export class SeedTestingLaboratoryReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
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
  fileName = 'seed-testing-laboratory-report.xlsx';
  allData: any;

  stateData: any;

  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  DistrictData: any[];
  exportdata: any[];
  selected_state: any;
  selected_district: any;
  disabledfield=true;
  stateDataSecond: any;
  DistrictDataSecond: any[];
  constructor(private masterService: MasterService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      state: ['',],
      district: ['',],
      state_text:[''],
      district_text:[''],
    });
    this.ngForm.controls['state'].valueChanges.subscribe(newValue=>{
      if(newValue){
        this.getDistrict(newValue)
        this.disabledfield=false
        this.ngForm.controls['district'].setValue('')
        this.selected_district =''
      }

    })
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateData =this.stateDataSecond
        let response= this.stateData.filter(x=>x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))      
        this.stateData=response;  
      }
      else{
        this.getState()       
      }
    });
    
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        this.DistrictData =this.DistrictDataSecond
        let response= this.DistrictData.filter(x=>x['m_district.district_name'].toLowerCase().startsWith(newValue.toLowerCase()))    
        this.DistrictData=response
      }
      else{
        this.getDistrict(this.ngForm.controls['state'].value)       
      }
    });
  }
  ngOnInit(): void {
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    this.getPageData();
    this.getState();
    this.runExcelApi();
    // this.shortStatename();
    // this.getCroupCroupList();
    // this.getSeasonData();
    // this.submitindentor();
  }

  getState() {
    this.stateData = [];
    this.service.postRequestCreator('getSeedTestingStateList').subscribe((apiResponse: any) => {
      if(apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows) {
        this.stateData = apiResponse.EncryptedResponse.data.rows;
        this.stateDataSecond= this.stateData
      }
    })
  }
  getDistrict(newValue) {
   
    const param ={
      search:{
        state_id:newValue

      }
    }
    this.service.postRequestCreator('getDistrictSeedTestingReport',null,param).subscribe((apiResponse: any) => {
      if(apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data  && apiResponse.EncryptedResponse.data.rows) {
        this.DistrictData = apiResponse.EncryptedResponse.data.rows;
        this.DistrictDataSecond = this.DistrictData 
      }
    })
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    searchData = {
      isSearch: true,
    }
    this.ngForm.controls['state'].value ? (searchData['state_id'] = this.ngForm.controls['state'].value) : '';
    this.ngForm.controls['district'].value ? (searchData['district'] = this.ngForm.controls['district'].value) : '';

    this.service
      .postRequestCreator("getSeedTestingLabDataforReports", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        searchData: {
          state_id:this.ngForm.controls['state'].value,
          district:this.ngForm.controls['district'].value,
          isSearch: true,
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.EncryptedResponse.data.rows;
          if (this.allData === undefined) {
            this.allData = [];
          }
          console.log(this.allData)
          this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
  }


  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }

    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  submit(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if (this.ngForm.controls['state'].value || this.ngForm.controls['district'].value) {
      this.isSearch = true;

      searchData = {
        isSearch: true,
      }
      this.ngForm.controls['state'].value ? (searchData['state_id'] = this.ngForm.controls['state'].value) : '';
      this.ngForm.controls['district'].value ? (searchData['district'] = this.ngForm.controls['district'].value) : '';


      this.service
        .postRequestCreator("getSeedTestingLabDataforReports", null, {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,
          searchData: searchData
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 50;
            this.allData = apiResponse.EncryptedResponse.data.rows;
            if (this.allData === undefined) {
              this.allData = [];
            }
            console.log(this.allData)
            this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            this.initSearchAndPagination();
            // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            // this.initSearchAndPagination();
            this.runExcelApi()
          }
        });
        

    } else {

      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Atleast one Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }
  }

  clear() {
    this.ngForm.controls['state'].patchValue("");
    this.ngForm.controls['district'].patchValue("");
    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.disabledfield=true;
    this.selected_district=''
    this.selected_state=''
    this.runExcelApi();
    this.isSearch=false
    this.initSearchAndPagination();
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
  //       // console.log('this.identorthis.identor',this.identor);
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
  //       console.log('this.idfinalDatantor', this.finalData);

  //       this.tableId = [];
  //       for (let id of this.identor) {
  //         this.tableId.push(id.id);
  //       }
  //       // console.log('this.identorthis.identor', this.tableId);

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

  //         this.router.navigate(['/seed-testing-laboratory-report']);
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

  runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined){
    searchData = {
      isSearch: this.isSearch,
    }
    this.ngForm.controls['state'].value ? (searchData['state_id'] = this.ngForm.controls['state'].value) : '';
      this.ngForm.controls['district'].value ? (searchData['district'] = this.ngForm.controls['district'].value) : '';


    this.service
      .postRequestCreator("getSeedTestingLabDataforReports", null, {
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
  //   const name = 'seed-testing-laboratory-report';
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
       text: 'Name of Seed Testing Laboratory', bold: true }, 
    { text: 'Short Name', bold: true },
    { text: 'State', bold: true },
     { text: 'District', bold: true },   
     { text: 'Address', bold: true },
    { text: 'Contact Person Name', bold: true },
    { text: 'Contact Person Designation', bold: true },
    { text: 'Mobile Number', bold: true },
     { text: 'Email Address', bold: true },
     { text: 'Status', bold: true },
                          ]

    let reportData = this.exportdata.map((element, index) => {   
 
    let reportData =  [
            index+1,
            element &&  element.lab_name ? element.lab_name : 'NA',
            element &&  element.short_name ? element.short_name : 'NA',        
            element  && element.m_district.state_name ? element.m_district.state_name : 'NA',
            element   && element.m_district.district_name ? element.m_district.district_name : 'NA',           
            element && element.address && (element.address.length>30) ? (element.address.substring(0,30)+'...'):element && element.address ? element.address :'NA',          
            element && element.contact_person_name && (element.contact_person_name.length>30) ? (element.contact_person_name.substring(0,30)+'...'):element && element.contact_person_name ? element.contact_person_name :'NA',                   
             element &&(  element.m_designation) && element.m_designation.name ? element.m_designation.name : 'NA',
            element && element.mobile_number ? element.mobile_number : 'NA',
            element && element.email && ( element.email) ? element.email : 'NA',
            element  && element.is_active && element.is_active==1 ? 'ACTIVE' :'INACTIVE'
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
        { text: 'List of Seed Testing Laboratory', style: 'header' },
        { text: `State :  ${this.selected_state}       District:   ${this.selected_district}`, style: 'custom' },
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
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        custom: {
          fontSize: 16,
          // bold: true,
          background:'#DC8B3A',
          color:'white',
          width :800
          // fillColor: '#555555',
          // alignment: 'center',
        },
      
        indenterTable: {
          
          fontSize: maxFontSize ,
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).download('list-of-breeders-report.pdf');
  }
  state_select(data){
    this.selected_state = data && data.state_name ? data.state_name :'';
    this.ngForm.controls['state'].setValue(data && data.state_code ? data.state_code :'');
    this.ngForm.controls['state_text'].setValue("");
  }

  cnClick() {
    document.getElementById('state').click();
  }
  district_select(data){
    this.selected_district = data && data['m_district.district_name'] ? data['m_district.district_name']:'';
    this.ngForm.controls['district'].setValue(data && data['m_district.district_code'] ? data['m_district.district_code'] :'')

    this.ngForm.controls['district_text'].setValue("");
    
  }
  cdClick() {
    document.getElementById('district').click();
  }
}