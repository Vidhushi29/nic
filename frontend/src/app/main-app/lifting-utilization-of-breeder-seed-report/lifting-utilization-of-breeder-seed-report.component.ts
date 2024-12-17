
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
  selector: 'app-lifting-utilization-of-breeder-seed-report',
  templateUrl: './lifting-utilization-of-breeder-seed-report.component.html',
  styleUrls: ['./lifting-utilization-of-breeder-seed-report.component.css']
})

export class LiftingUtilizationOfBreederSeedReportComponent implements OnInit {
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
  fileName = 'lifting-utilization-of-breeder-seed-report.xlsx';
  yearOfIndent: any = [
    { name: "2025 - 2026", "value": "2025" },
    { name: "2024 - 2025", "value": "2024" },
    { name: "2023 - 2024", "value": "2023" },
    { name: "2022 - 2023", "value": "2022" },
    { name: "2021 - 2022", "value": "2021" },
    { name: "2020 - 2021", "value": "2020" }
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
      crop_group: [''],

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
    this.shortStatename();
    this.getCroupCroupList();
    this.getSeasonData();
    this.submitindentor();
  }

  submit() {
    // console.log('year',this.ngForm.controls['year'].value);
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['crop_group'].value || !this.ngForm.controls['crop'].value) {
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
      this.season = this.ngForm.controls['crop_group'].value;
      this.crop = this.ngForm.controls['crop'].value;
      this.submitindentor();
    }
  }

  cropGroup(data: string) { { } }
  async shortStatename() {
    const route = 'get-state-list';
    const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
      this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      // console.log('state======>',this.statename);

    })
  }

  async submitindentor(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    const route = 'submit-indents-breeder-seeds-list';
    const result = await this.breederService.postRequestCreator(route, null, {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      pageSize:  50,
      search: {
        year : this.ngForm.controls['year'].value,
        crop_group : this.ngForm.controls['crop_group'].value,
        crop : this.ngForm.controls['crop'].value,
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data.data;
        this.data1 = apiResponse.EncryptedResponse.data;
        this.custom_array = [];
        // console.log('this.identorthis.identor',this.identor);
        // arr = arr.data
        let varietyId = []
        for (let value of this.identor) {
          varietyId.push(value.m_crop_variety.variety_name)
        }
        varietyId = [...new Set(varietyId)]
        let newObj = [];

        for (let value of varietyId) {
          let keyArr = [];
          for (let val of this.identor) {
            if (val.m_crop_variety.variety_name == value) {
              let state = val && val.user && val.user && val.user.agency_detail && val.user.agency_detail.m_state && val.user.agency_detail.m_state.state_short_name ? val.user.agency_detail.m_state.state_short_name : '';
              keyArr.push({ "state": state, 'value': val.indent_quantity });
            }
          }
          let variety_id = (value).toString();
          newObj.push({ "variety_id": value, 'data': keyArr })
        }

        this.finalData = newObj;
        console.log('this.idfinalDatantor', this.finalData);

        this.tableId = [];
        for (let id of this.identor) {
          this.tableId.push(id.id);
        }
        // console.log('this.identorthis.identor', this.tableId);

        const results = this.identor.filter(element => {
          if (Object.keys(element).length !== 0) {
            return true;
          }

          return false;
        });
        // console.log(results, 'resultssssssss');
        if (this.identor === undefined) {
          this.identor = [];
        }
        // let data =[];
        const removeEmpty = (obj) => {
          Object.entries(obj).forEach(([key, val]) =>
            (val && typeof val === 'object') && removeEmpty(val) ||
            (val === null || val === "") && delete obj[key]
          );
          return obj;
        };
        removeEmpty(this.identor)
        this.filterPaginateSearch.Init(results, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count);
        this.initSearchAndPagination();
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
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {

          this.router.navigate(['/lifting-utilization-of-breeder-seed-report']);
        })
      }
      else {

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

  getSeasonData() {
    const route = "get-season-details";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // console.log(this.seasonList);
    })
  }
  getCroupCroupList() {
    const route = "crop-group";
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
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
    const name = 'lifting-utilization-of-breeder-seed-report';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 4,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  clear() {
    this.year = this.ngForm.controls['year'].setValue('');
    this.season = this.ngForm.controls['crop_group'].setValue('');
    this.crop = this.ngForm.controls['crop'].setValue('');
  }
}

