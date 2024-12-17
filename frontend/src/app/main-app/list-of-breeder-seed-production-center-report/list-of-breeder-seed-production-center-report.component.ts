
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import pdfMake from 'pdfmake/build/pdfmake';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { timer } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MasterService } from 'src/app/services/master/master.service';
// import { saveAs } from 'file-saver';



@Component({
  selector: 'app-list-of-breeder-seed-production-center-report',
  templateUrl: './list-of-breeder-seed-production-center-report.component.html',
  styleUrls: ['./list-of-breeder-seed-production-center-report.component.css']
})

export class ListOfBreederSeedProductionCenterReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  cropGroupData;
  ngForm!: FormGroup;
  seasonList: any = [];
  response_crop_group: any = [];
  data: any;
  data1: any;
  custom_array: any[];
  finalData: any[];
  fileName = 'list-of-breeder-seed-production-center-report.xlsx';
  // fileName = 'list-of-breeder-seed-production-center-report.xlsx';
  yearOfIndent: any = [

  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];

  allData: any;

  state_data: any;
  breeder_data: any;
  breeder_data_district: any;
  breeder_data_name: any;
  exportdata: any;
  selected_state: any;
  selected_district: any;
  selected_agency: any;
  state_data_second: any;
  breeder_data_district_second;
  disabledfieldDist = true
  breeder_data_name_second: any;
  disabledfieldAgency = true;
  submited = false;

  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router, private masterService: MasterService) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      state: [''],
      district: [''],
      production_name: [''],
      state_text: [''],
      district_text: [''],
      agency_text: [''],

    });
    this.ngForm.controls['state'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getBspcReportDistrict(newValue)
        this.selected_district = ''
        this.selected_agency = '';
        this.disabledfieldDist = false;
        this.disabledfieldAgency = true;
        this.ngForm.controls['district'].setValue('')
      }
    })

    this.ngForm.controls['district'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getBspcReportName(newValue)
        this.ngForm.controls['production_name'].setValue('')
        this.selected_agency = '';
        this.disabledfieldAgency = false

      }
    })
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.state_data = this.state_data_second
        let response = this.state_data.filter(x => x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.state_data = response
      }
      else {
        this.getState()
      }
    });
    this.ngForm.controls['agency_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.breeder_data_name = this.breeder_data_name_second
        let response = this.breeder_data_name.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.breeder_data_name = response

      }
      else {
        this.getBspcReportName(this.ngForm.controls['district'].value)

      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.breeder_data_district = this.breeder_data_district_second
        let response = this.breeder_data_district.filter(x => x.agency_detail.m_district.district_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.breeder_data_district = response

      }
      else {
        this.getBspcReportDistrict(this.ngForm.controls['state'].value)

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

    this.getState();
    this.getBreeder();
    this.getPageData();

    this.runExcelApi();

  }

  getState() {
    this.state_data = [];
    this.service
      .postRequestCreator("getBspcStateList")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows) {
          this.state_data = apiResponse.EncryptedResponse.data.rows
          this.state_data_second = this.state_data
        }
      });
  }

  getBreeder() {
    this.breeder_data = []
    this.masterService
      .postRequestCreator("get-breeder-name-list")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.breeder_data = apiResponse.EncryptedResponse.data
        }
      });
  }
  getBspcReportDistrict(newValue) {
    // this.breeder_data = []
    const param = {
      search: {
        state_id: newValue,
        // state_id:this.ngForm.controls['dis']
      }
    }
    this.service
      .postRequestCreator("getBspcReportDistrict", null, param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.breeder_data_district = apiResponse.EncryptedResponse.data.rows;
          this.breeder_data_district = this.breeder_data_district.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.agency_detail.m_district.district_name === arr.agency_detail.m_district.district_name)))
          this.breeder_data_district_second = this.breeder_data_district
        }
      });
  }
  getBspcReportName(newValue) {
    // this.breeder_data = []
    const param = {
      search: {
        district_id: newValue,
        state_id: this.ngForm.controls['state'].value
      }
    }
    this.service
      .postRequestCreator("getBspcReportName", null, param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data) {
          this.breeder_data_name = apiResponse.EncryptedResponse.data.rows;
          this.breeder_data_name_second = this.breeder_data_name

          // this.breeder_data_district =  this.breeder_data_district.filter((arr, index, self) =>
          // index === self.findIndex((t) => (t.agency_detail.m_district.district_name === arr.agency_detail.m_district.district_name )))
        }
      });
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    searchData = {
      isSearch: false,
    }

    this.masterService
      .postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BPC", null, {
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
    this.submited = true;
    if (this.ngForm.controls['state'].value || this.ngForm.controls['breeder'].value) {

      searchData = {
        isSearch: true
      }

      this.ngForm.controls['state'].value ? (searchData['state_code'] = this.ngForm.controls['state'].value) : '';
      this.ngForm.controls['district'].value ? (searchData['district_code'] = this.ngForm.controls['district'].value) : '';
      this.ngForm.controls['production_name'].value ? (searchData['production_name'] = this.ngForm.controls['production_name'].value) : '';

      this.masterService
        .postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BPC", null, {
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
          }
        });
      this.runExcelApi();
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
    this.ngForm.controls['state'].patchValue("");
    this.ngForm.controls['district'].patchValue("");
    this.ngForm.controls['production_name'].patchValue("");
    this.selected_district = ''
    this.selected_agency = ''
    this.selected_state = '';
    this.disabledfieldDist = true;
    this.disabledfieldAgency = true;
    // district: [''],
    // production_name:['']

    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination();
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

  runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    searchData = {
      isSearch: this.submited,
    }
    this.ngForm.controls['state'].value ? (searchData['state_code'] = this.ngForm.controls['state'].value) : '';
    this.ngForm.controls['district'].value ? (searchData['district_code'] = this.ngForm.controls['district'].value) : '';
    this.ngForm.controls['production_name'].value ? (searchData['production_name'] = this.ngForm.controls['production_name'].value) : '';

    this.masterService
      .postRequestCreator("getListOfBreederSeedProductionforReports?usertype=BPC", null, {
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
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'list_of_breeder_seed_production_center');

    // let element = document.getElementById('excel-table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

    // /* save to file */
    // XLSX.writeFile(wb, this.fileName);
    // let arrResponse = []
    // let response = this.exportdata.forEach((element, index) => {
    //   const temp = {

    //     'S/N': index + 1,
    //     'Name of Bspc': element && element.agency_detail && element.agency_detail.agency_name ? element.agency_detail.agency_name : 'NA',
    //     'Short Name': element && element.name ? element.name : 'NA',
    //     'BSPC Code': element && element.code ? element.code : 'NA',
    //     'State': element && element.agency_detail && element.agency_detail.m_state && element.agency_detail.m_state.state_name ? element.agency_detail.m_state.state_name : "NA",
    //     'District': element && element.agency_detail && element.agency_detail.m_district && element.agency_detail.m_district.district_name ? element.agency_detail.m_district.district_name : "NA",
    //     'Longitude': element && element.agency_detail && element.agency_detail.longitude ? element.agency_detail.longitude : 'NA',
    //     'Latitude': element && element.agency_detail && element.agency_detail.latitude ? element.agency_detail.latitude : "NA",
    //     'Address': element && element.agency_detail && element.agency_detail.address ? element.agency_detail.address : "NA",
    //     'Contact Person Name': element && element.agency_detail && element.agency_detail.contact_person_name ? element.agency_detail.contact_person_name : 'NA',
    //     'Mobile Number': element && element.mobile_number ? element.mobile_number : 'NA',
    //     Email: element && element.email_id ? element.email_id : "NA",
    //     'Contact Person Designation': element && element.agency_detail && element.agency_detail.m_designation && element.agency_detail.m_designation.name ? element.agency_detail.m_designation.name : 'NA',
    //     Status: element && element.agency_detail &&
    //       element.agency_detail.is_active && element.agency_detail.is_active == 1 ? 'ACTIVE' : 'INACTIVE'
    //   }
    //   arrResponse.push(temp)

    // });

    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(arrResponse);
    // const titleRow = XLSX.utils.sheet_add_aoa(worksheet, [['reportTitle']], { origin: 'A1' });
    // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });


    // // Save the file with the desired name
    // const fileName = 'data.xlsx';
    // const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // //  saveAs(file, fileName);

    // XLSX.writeFile(workbook, fileName)

  }

  download() {

    const name = 'list-of-breeder-seed-production-center-report';
    const element = document.getElementById('excel-table');
    const content = `
    
    `
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 4,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
  downloadPdf(): void {
    let reportDataHeader1 = [
      "List of Breeder Seed Production Center"
    ];

    let reportDataHeader =
      [
        'S/N',
        'Name of Bspc',
        'Short Name',
        'BSPC Code',
        'State',
        'District',
        // 'Longitude',
        // 'Latitude',
        'Address',
        'Contact Person Name',
        'Contact Person Designation',
        'Mobile Number',
        'Email',
        'Status'
      ];

    let arrResponse = []
      let response = this.exportdata.forEach((element, index) => {
        const temp = {

          'S/N': index + 1,
          'Name of Bspc': element && element.agency_detail && element.agency_detail.agency_name ? element.agency_detail.agency_name : 'NA',
          'Short Name': element && element.name ? element.name : 'NA',
          'BSPC Code': element && element.code ? element.code : 'NA',
          'State': element && element.agency_detail && element.agency_detail.m_state && element.agency_detail.m_state.state_name ? element.agency_detail.m_state.state_name : "NA",
          'District': element && element.agency_detail && element.agency_detail.m_district && element.agency_detail.m_district.district_name ? element.agency_detail.m_district.district_name : "NA",
          // 'Longitude':element && element.agency_detail && element.agency_detail.longitude ? element.agency_detail.longitude :'NA' ,
          // 'Latitude':element && element.agency_detail && element.agency_detail.latitude ? element.agency_detail.latitude :"NA" ,
          'Address': element && element.agency_detail && element.agency_detail.address ? element.agency_detail.address : "NA",
          'Contact Person Name': element && element.agency_detail && element.agency_detail.contact_person_name ? element.agency_detail.contact_person_name : 'NA',
          'Mobile Number': element && element.mobile_number ? element.mobile_number : 'NA',
          Email: element && element.email_id ? element.email_id : "NA",
          'Contact Person Designation': element && element.agency_detail && element.agency_detail.m_designation && element.agency_detail.m_designation.name ? element.agency_detail.m_designation.name : 'NA',
          Status: element && element.agency_detail &&
            element.agency_detail.is_active && element.agency_detail.is_active == 1 ? 'ACTIVE' : 'INACTIVE'
        }
        arrResponse.push(temp)

      });

    let reportData = arrResponse.map((element, index) => {
      let reportData = reportDataHeader.map((el, index) => {
        return element[el]
      })
      return reportData;
    })
    reportData = [[...reportDataHeader], ...reportData]
    console.log("reportDataHeader.length", reportData)
    let pageWidth = 1800
    let numberOfColumn = 14
    let numberOfCharecter = 30
    const columnWidth = (pageWidth - (2 * 2) - (1 * numberOfColumn)) / numberOfColumn
    const maxFontSize = columnWidth / (1 * numberOfCharecter)

    const docDefinition = {
      pageOrientation: 'landscape',
      // pageSize: {
      //   width: 1800,
      //   height: 600,
      // },
      text: [
        { text: 'Text 1', fontSize: 18, bold: true, color: 'blue' },
        { text: ' Text 2', fontSize: 14, italic: true, color: 'green' },
        { text: ' Text 3', fontSize: 12, decoration: 'underline', color: 'red' }
      ],
      content: [
        { text: 'List of Breeder Seed Production Center', style: 'header' },

        { text: `State:${this.selected_state ? this.selected_state : ''}     District:${this.selected_district ? this.selected_district : ''}    Name of Production Centre:${this.selected_agency ? this.selected_agency : ''}`, fontSize: 14 },
        // { text: `District:${this.selected_state ? this.selected_state :''} `,alignment: '', fontSize: 14  },
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

          fontSize: maxFontSize,
          margin: [0, 5, 0, 20],
        },
      },
    }; pdfMake.createPdf(docDefinition).download('list-of-breeder-seed-production-center-report.pdf');

    //Pdf code end
  }

  state_select(data) {
    this.selected_state = data && data.state_name ? data.state_name : '';
    this.ngForm.controls['state'].setValue(data && data.state_code ? data.state_code : '')
    // this.ngForm.controls['state_text'].setValue('',{eventEmitter:false})
    if (this.ngForm.controls['state_text'].value) {
      this.ngForm.controls['state_text'].setValue('', { eventEmitter: false })
    }
  }

  cnClick() {
    document.getElementById('state').click();
  }

  district_select(data) {
    console.log('daata====>', data)
    this.selected_district = data && data.agency_detail && data.agency_detail.m_district && data.agency_detail.m_district.district_name ?
      data.agency_detail.m_district.district_name : '';
    if (this.ngForm.controls['district_text'].value) {
      this.ngForm.controls['district_text'].setValue('')

    }
    this.ngForm.controls['district'].setValue(data && data.agency_detail && data.agency_detail.m_district && data.agency_detail.m_district.district_code ?
      data.agency_detail.m_district.district_code : '')
  }

  cdClick() {
    document.getElementById('district').click();
  }

  agency_select(data) {
    console.log(data)
    this.selected_agency = data && data.agency_name ? data.agency_name : '';
    this.ngForm.controls['production_name'].setValue(data && data.agency_name ? data.agency_name : '')
    if (this.ngForm.controls['agency_text'].value) {
      this.ngForm.controls['agency_text'].setValue('')

    }
  }
  caClick() {
    document.getElementById('agency').click();
  }





}
