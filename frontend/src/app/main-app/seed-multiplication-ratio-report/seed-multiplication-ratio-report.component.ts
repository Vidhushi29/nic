

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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-seed-multiplication-ratio-report',
  templateUrl: './seed-multiplication-ratio-report.component.html',
  styleUrls: ['./seed-multiplication-ratio-report.component.css']
})

export class SeedMultiplicationRatioReportComponent implements OnInit {
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
  fileName = 'seed-multiplication-ratio-report.xlsx';
  yearOfIndent: any = [
    { name: "2020 - 2021", "value": "2020" }
  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  allData: any;
  exportdata: any[];
  crop_groups: any;
  disabledfieldcropName=true;
  crop_names: any;
  seasonListSecond: any;
  response_crop_group_second: any;
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      season: ['',],
      crop: ['',],
      year: ['',],
      crop_name_text: ['',],
      crop_text: ['',],      
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue=>{
      if(newValue){
        this.seasonList =this.seasonListSecond
        let response= this.seasonList.filter(x=>x.group_name.toLowerCase().startsWith(newValue.toLowerCase()))
      
        this.seasonList=response
      
       
      }
    
    else{
      this.getSeasonData()
    }


    })
    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue=>{
      if(newValue){
        this.response_crop_group =this.response_crop_group_second
        let response= this.response_crop_group.filter(x=>x['m_crop.crop_name'].toLowerCase().startsWith(newValue.toLowerCase()))
      
        this.response_crop_group=response
      
       
      }
    
    else{
      this.onChangeCropGroup(this.ngForm.controls['season'].value)
    }


    })


  }
  ngOnInit(): void {
    localStorage.setItem('logined_user', "Seed");
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      // location.reload()
    } else {
      localStorage.removeItem('foo')
    }

    this.filterPaginateSearch.itemListPageSize = 50;
    this.getPageData();
    this.getSeasonData();
    this.getCroupCroupList();
    this.runExcelApi();

    // this.shortStatename();
    // this.submitindentor();
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service
      .postRequestCreator("view-seed-multiplications", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: searchData
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

  submit(loadPageNumberData: number = 1) {
    if (this.ngForm.controls['season'].value || this.ngForm.controls['crop'].value) {

    
      this.season = this.ngForm.controls['season'].value;
      this.crop = this.ngForm.controls['crop'].value;
      this.isSearch=true;

      var object = {
        isSearch: true,
      }
      this.ngForm.controls['season'].value ? (object['crop_group_code'] = this.ngForm.controls['season'].value) : '';
      this.ngForm.controls['crop'].value ? (object['crop_code'] = this.ngForm.controls['crop'].value) : '';

      this.service
        .postRequestCreator("view-seed-multiplications-by-cropcode", null, {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,
          search: object,
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
            this.runExcelApi();
          }
        });


    } else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Atleast One Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }
  }

  clear() {
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.getPageData();
    this.crop_names='';
    this.crop_groups='';
    this.disabledfieldcropName=true;
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.runExcelApi()
    this.initSearchAndPagination();
  }

  // cropGroup(data: string) { { } }
  // async shortStatename() {
  //   const route = 'get-state-list';
  //   const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
  //     this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';

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

  getSeasonData() {
    this.service.postRequestCreator("get-croup-Group-details", null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
    this.seasonListSecond = this.seasonList
    })
  }

  onChangeCropGroup(formData) {
    this.crop_names='';
    this.disabledfieldcropName=false
    this.ngForm.controls['crop'].patchValue("");
    var object = {
      search:{
        cropGroupCode: formData
      }
    }

    this.service.postRequestCreator("getCropNameofSeedMultiplictionRatioReport", null, object).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
        this.response_crop_group = data.EncryptedResponse.data.rows;
        this.response_crop_group_second  = this.response_crop_group
      }
      else {
        this.response_crop_group = [];
      }
      console.log(this.response_crop_group)
    })

  }
  getCroupCroupList() {
    const route = "crop-group";
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  myFunction1() {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      // if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      // }
    }
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
    var object = {
      isSearch: this.isSearch,
    }
    this.ngForm.controls['season'].value ? (object['crop_group_code'] = this.ngForm.controls['season'].value) : '';
    this.ngForm.controls['crop'].value ? (object['crop_code'] = this.ngForm.controls['crop'].value) : '';

    this.service
    .postRequestCreator("view-seed-multiplications", null, {
      // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: object
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
    XLSX.utils.book_append_sheet(wb, ws, 'sheed_multiplication_reports');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  // download() {
  //   console.log("working")
  //   const name = 'seed-multiplication-ratio-report';
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
       text: 'Crop Group', bold: true }, 
    { text: 'Crop Name', bold: true },
    { text: 'Nucleus to Breeder', bold: true },
     { text: 'Breeder to Foundation I', bold: true },
    { text: 'Foundation I to Foundation II', bold: true },
     { text: 'Foundation II to Certified', bold: true }, 
    
                          ]

    let reportData = this.exportdata.map((element, index) => {   
 
    let reportData =  [
            index+1,                 
            element  && element.m_crop && element.m_crop.m_crop_group && element.m_crop.m_crop_group.group_name ? element.m_crop.m_crop_group.group_name : 'NA',
            element   && element.m_crop && element.m_crop.crop_name ? element.m_crop.crop_name : 'NA',
            element&& element.nucleus_to_breeder ? element.nucleus_to_breeder : 'NA',
            element && element.breeder_to_foundation ? element.breeder_to_foundation : 'NA',          
            element && element.foundation_1_to_2 ? element.foundation_1_to_2 : 'NA',          
            element  && element.foundation_2_to_cert ? element.foundation_2_to_cert : 'NA',          
            
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
        { text: 'Seed Multiplication Ratio', style: 'header' },
        { text: `Crop Group : ${this.crop_groups}   Crop Name : ${this.crop_names}`,  },
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
        indenterTable: {
          
          fontSize: maxFontSize ,
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).download('seed-multiplication-ratio-report.pdf');
  }
  cropGroup(data){
    console.log(data)
    this.crop_groups = data && data.group_name ?  data.group_name  :'';
    this.ngForm.controls['season'].setValue(data && data.group_code ? data.group_code :'')
    this.onChangeCropGroup(this.ngForm.controls['season'].value)
    this.ngForm.controls['crop_text'].setValue('')

  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropNames(data){
    this.ngForm.controls['crop_name_text'].setValue('')
    this.crop_names= data && data['m_crop.crop_name'] ? data['m_crop.crop_name'] :'';
    this.ngForm.controls['crop'].setValue(data && data['m_crop.crop_code'] ? data['m_crop.crop_code'] :'')

  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
}