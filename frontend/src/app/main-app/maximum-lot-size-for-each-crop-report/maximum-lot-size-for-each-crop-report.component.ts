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
  selector: 'app-maximum-lot-size-for-each-crop-report',
  templateUrl: './maximum-lot-size-for-each-crop-report.component.html',
  styleUrls: ['./maximum-lot-size-for-each-crop-report.component.css']
})

export class MaximumLotSizeForEachCropReportComponent implements OnInit {
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
  fileName = 'Crop-Wise-Maximum-Lot-Size-report.xlsx';
  // yearOfIndent: any = [
  //   { name: "2025 - 2026", "value": "2025" },
  //   { name: "2024 - 2025", "value": "2024" },
  //   { name: "2023 - 2024", "value": "2023" },
  //   { name: "2022 - 2023", "value": "2022" },
  //   { name: "2021 - 2022", "value": "2021" },
  //   { name: "2020 - 2021", "value": "2020" }
  // ];
  year: any;
  group_code: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  allData: any;
  getCropNameListArr: any;
  exportdata: any[];
  selectCrop: any;
  crop_name_data: any;
  selectCrop_group: string;
  selectCrop_group_code: any;
  crop_text_check='crop_group';
  crop_name_check='cropName';
  selectCrop_name;
  isCropName=false;
  seasonListsecond: any;
  getCropNameListArrSecond: any;
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      // year: ['',],
      group_code: ['',],
      crop_name:[''],
      crop_text:[''],
      name_text:['']
    });
    this.ngForm.controls['group_code'].valueChanges.subscribe(newValue=>{
      if(newValue){
        this.getCropName(newValue)
        this.isCropName=true
        this.selectCrop_name='';
        this.ngForm.controls['crop_name'].setValue('')

      }
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.seasonList =this.seasonListsecond
        let response= this.seasonList.filter(x=>x.group_name.toLowerCase().startsWith(newValue.toLowerCase()))      
        this.seasonList=response      
      }
      else{
      this.getGroupCode()
      }
    });

    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.getCropNameListArr =this.getCropNameListArrSecond
        let response= this.getCropNameListArr.filter(x=>x['m_crop.crop_name'].toLowerCase().startsWith(newValue.toLowerCase()))      
        this.getCropNameListArr=response      
      }
      else{
      this.getCropName(this.ngForm.controls['group_code'].value)
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

    this.filterPaginateSearch.itemListPageSize = 50;
    this.getPageData();
    this.getGroupCode();
    this.runExcelApi();

    // this.shortStatename();
    // this.getCroupCroupList();
    // this.getSeasonData();
    // this.submitindentor();
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    searchData = {
      isSearch: false
    }

    this.service
      .postRequestCreator("get-crop-max-lot-size-data", null, {
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
    if ( this.ngForm.controls['group_code'].value || this.ngForm.controls['crop_name'].value) {
      var searchData = {
        isSearch: true
      }
      this.isSearch=true;

      // this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
      this.ngForm.controls['group_code'].value ? (searchData['group_code'] = this.ngForm.controls['group_code'].value) : '';
      this.ngForm.controls['crop_name'].value ? (searchData['crop_name'] = this.ngForm.controls['crop_name'].value) : '';

      this.service
        .postRequestCreator("get-crop-max-lot-size-data", null, {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 10,
          search: searchData
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 10;
            this.allData = apiResponse.EncryptedResponse.data.rows;
            if (this.allData === undefined) {
              this.allData = [];
            }
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
    // this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['group_code'].patchValue("");
    this.selectCrop_name='';
    this.selectCrop='';
    this.ngForm.controls['crop_name'].patchValue("");
    this.getPageData();
    this.isCropName=false;
    this.isSearch=true;
    this.runExcelApi()
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination();
  }

  getGroupCode() {
    this.service
      .postRequestCreator("get-croup-Group-details", null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.seasonList = apiResponse.EncryptedResponse.data;
          this.seasonListsecond = this.seasonList
        }
      });
  }

  getCropName(value) {
    const param ={
      search:{
        cropGroupCode:value
      }
    }
    this.service
      .postRequestCreator("getCropNameforMaxLotSize", null,param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows) {
          this.getCropNameListArr = apiResponse.EncryptedResponse.data.rows;
          this.getCropNameListArrSecond = this.getCropNameListArr
        }
      });
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

  //         this.router.navigate(['/app-maximum-lot-size-for-each-crop-report']);
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
      isSearch: this.isSearch
    }

   

    // this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
    this.ngForm.controls['group_code'].value ? (searchData['group_code'] = this.ngForm.controls['group_code'].value) : '';
    this.ngForm.controls['crop_name'].value ? (searchData['crop_name'] = this.ngForm.controls['crop_name'].value) : '';

    this.service
      .postRequestCreator("get-crop-max-lot-size-data", null, {
        // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        search: searchData
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
  //   const name = 'maximum-lot-size-for-each-crop-report';
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
    { text: 'Maximum LOT Size', bold: true },
    
    
                          ]

    let reportData = this.exportdata.map((element, index) => {   
 
    let reportData =  [
            index+1,                 
            element  && element.m_crop && element.m_crop.m_crop_group && element.m_crop.m_crop_group.group_name ? element.m_crop.m_crop_group.group_name : 'NA',
            element   && element.crop  ? element.crop : 'NA',
            element&& element.max_lot_size ? element.max_lot_size : 'NA' + 
            element.crop_code.split('')[0] == 'H' ? 'Kg':
            'Quintal'
            
            ,
                      
            
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
        { text: 'Crope Wise Maximum Lot Size', style: 'header' },
        { text: ` Crop Group: ${this.selectCrop}  Crop Name: ${this.selectCrop_name}`,  },
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
    pdfMake.createPdf(docDefinition).download('crop-wise-maximum-report.pdf');
  }
  cropGroup(item: any) {
    console.log('item====>', item);

    this.selectCrop = item.group_name;
    
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['group_code'].setValue(item && item.group_code ? item.group_code :"");
    this.selectCrop_group_code = item.group_code;
    this.crop_name_data = item.group_name;
    this.selectCrop_group = "";
    this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check='crop_group'
    // this.getCroupNameList(item.group_code);
  }
  cropdatatext(){
 
    this.crop_text_check='';
  
  }
  cropnametext(){
   
    this.crop_name_check='';
  
  }
  
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cnclick() {
    document.getElementById('crop_name').click();
  }
  crop_name(item: any) {
    this.selectCrop_name =item && item['m_crop.crop_name'] ? item['m_crop.crop_name'] :'';
    console.log("item1", item)
    
    this.crop_name_check=''
    
    this.ngForm.controls["name_text"].setValue("");
    this.ngForm.controls['crop_name'].setValue(item && item['m_crop.crop_code'] ? item['m_crop.crop_code'] :'')
  }

}
