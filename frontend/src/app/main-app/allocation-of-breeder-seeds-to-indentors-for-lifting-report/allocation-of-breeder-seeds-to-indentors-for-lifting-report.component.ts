
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


@Component({
  selector: 'app-allocation-of-breeder-seeds-to-indentors-for-lifting-report',
  templateUrl: './allocation-of-breeder-seeds-to-indentors-for-lifting-report.component.html',
  styleUrls: ['./allocation-of-breeder-seeds-to-indentors-for-lifting-report.component.css']
})

export class AllocationOfBreederSeedsToIndentorsForLiftingReportComponent implements OnInit {
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
  fileName = 'allocation-of-breeder-seeds-to-indentors-for-lifting-report.xlsx';
  allData: any;
  yearOfIndent: any = [
    // {name: "2025 - 2026", "value": "2025"},
    // { name: "2024 - 2025", "value": "2024" },
    // { name: "2023 - 2024", "value": "2023" },
    // { name: "2022 - 2023", "value": "2022" },
    // { name: "2021 - 2022", "value": "2021" },
    // { name: "2020 - 2021", "value": "2020" }
  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) { this.createEnrollForm(); }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      season: ['',],
      crop: ['',],
      year: ['',],

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
    this.getYearOfIndent();

    // this.shortStatename();
    // this.getCroupCroupList();
    // this.getSeasonData();
    // this.submitindentor();
  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.breederService
      .postRequestCreator("getAllocationOfBreederSeedsToIndentorsLifting", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: searchData
      })
      .subscribe((apiResponse: any) => {
        console.log(apiResponse)

        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.EncryptedResponse.data.rows;
          if (this.allData === undefined) {
            this.allData = [];
          }

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

  getYearOfIndent() {
    this.yearOfIndent = []
    this.ngForm.controls['crop'].patchValue("");
    this.ngForm.controls['season'].patchValue("");

    this.breederService
      .getRequestCreator("getYearOfIndentForIndentorLifting", null, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.yearOfIndent = apiResponse.EncryptedResponse.data;
        }
      });
  }
  onChangeYear(year) {
    this.response_crop_group = [];
    this.ngForm.controls['season'].patchValue("");

    if (year && year !== undefined && year !== null && year > 0) {
      this.breederService
        .getRequestCreator("getCropOfIndentorLiftingByYear?year=" + year, null, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.response_crop_group = apiResponse.EncryptedResponse.data;
            console.log(apiResponse.EncryptedResponse.data)

          }
        });
    }
    else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Valid Year.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }

  }

  onChangeCropCode(crop) {
    this.seasonList = []
    if (crop && crop !== undefined && crop !== null) {
      this.breederService
        .getRequestCreator("getVarietyOfIndentorLiftingByYear?crop_code=" + crop, null, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.seasonList = apiResponse.EncryptedResponse.data;

          }
        });
    }
    else {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Valid Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
    }
  }


  submit(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if (this.ngForm.controls['year'].value || this.ngForm.controls['season'].value || this.ngForm.controls['crop'].value) {
      this.isSearch = true;

      var object = {
        isSearch: true
      }

      this.ngForm.controls['year'].value ? (object['year'] = this.ngForm.controls['year'].value) : '';
      this.ngForm.controls['crop'].value ? (object['crop_code'] = this.ngForm.controls['crop'].value) : '';
      this.ngForm.controls['season'].value ? (object['variety_id'] = this.ngForm.controls['season'].value) : '';

      this.breederService
        .postRequestCreator("filterAllocationOfBreederSeedsToIndentorsLifting", null, {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,
          search: object,
        })
        .subscribe((apiResponse: any) => {
          console.log(apiResponse)
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
    this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.getPageData();
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
    const name = 'allocation-of-breeder-seeds-to-indentors-for-lifting-report';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
}