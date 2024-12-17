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


@Component({
  selector: 'app-bsp-six-report',
  templateUrl: './bsp-six-report.component.html',
  styleUrls: ['./bsp-six-report.component.css']
})

export class BspSixReportComponent implements OnInit {
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
  fileName = 'BSP VI xlsx Report.xlsx';
  yearOfIndent: any = [{
    "name": "2025 - 2026",
    "value": "2025"
  },
  {
    "name": "2024 - 2025",
    "value": "2024"
  },
  {
    "name": "2023 - 2024",
    "value": "2023"
  },
  {
    "name": "2022 - 2023",
    "value": "2022"
  },
  {
    "name": "2021 - 2022",
    "value": "2021"
  },
  {
    "name": "2020 - 2021",
    "value": "2020"
  }
  ];
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
  cropTypeList: any;
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
      crop_type:['']
    });
    this.ngForm.controls['breeder'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('breeder id', newValue);
        this.getCropNameList(newValue);
        this.getBspcList(newValue);
      }
    });
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // console.log('breeder id', newValue);
        this.getCropTypeDataList(newValue);
        // this.getBspcList(newValue);
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
    this.getYearDataList();
    this.getBreederList();
    // this.getCropNameList();
    this.getMasterBspReportData();
  }

  getYearDataList() {
    const route = "get-bsp-six-filter-data";
    const result = this.masterService.getPlansInfo(route).then((data: any) => {
      console.log('year data', data);
      this.yearOfIndent = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
    })
  }
  getCropTypeDataList(newValue) {
    const route = "get-bsp-six-crop-type-filter-data";
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls['year'].value
      }
    }).subscribe((data: any) => {
      console.log('year data', data);
      this.cropTypeList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
    })
  }
  submit() {
    if (
      !this.ngForm.controls['year'].value  ||
      !this.ngForm.controls['season'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Mandatory Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    } else {

      this.isSearch = true;
      this.year = this.ngForm.controls['year'].value;
      this.breeder = this.ngForm.controls['breeder'].value;
      this.crop = this.ngForm.controls['crop'].value;
      this.variety = this.ngForm.controls['variety'].value;
      this.bspc = this.ngForm.controls['bspc'].value;

      const searchData = {
        year: this.year,
        breeder: this.breeder,
        crop: this.crop,
        variety: this.variety,
        bspc: this.bspc
      }

      this.getMasterBspReportData(1, searchData);
    }
  }

  clear() {
    this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['breeder'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.ngForm.controls['variety'].patchValue("");
    this.ngForm.controls['bspc'].patchValue("");
    this.getMasterBspReportData();
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

    const route = 'get-master-bsp-report-data';
    const result = await this.masterService.postRequestCreator(route, null, {
      reportType: 'six',
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: searchData
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined &&
        apiResponse.EncryptedResponse !== undefined &&
        apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data.data;
        this.data1 = apiResponse.EncryptedResponse.data;

        for (const dataKey in this.data1) {

          this.data1[dataKey]['variety_name'] = this.data1[dataKey]['m_crop_variety.variety_name'];
          this.data1[dataKey]['agency_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
          this.data1[dataKey]['indent_quantity'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
          this.data1[dataKey]['available_nucleus_seeds'] = this.data1[dataKey]['nucleus_seed_availability.quantity'];
          this.data1[dataKey]['contact_person_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
          this.data1[dataKey]['contact_person_designation'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];

          delete this.data1[dataKey]['m_crop_variety.variety_name'];
          delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
          delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
          delete this.data1[dataKey]['nucleus_seed_availability.quantity'];
          delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.id'];
          delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.id'];
          delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
          delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
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

          this.router.navigate(['/bsp-six-report']);
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
    const name = 'bsp-six-report';
    const element = document.getElementById('excel-table');
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
        orientation: 'portrait'
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

  async getCropNameList(newValue) {
    this.masterService
      .postRequestCreator("get-crop-list", null, {
        search: {
          breeder_id: newValue,
          year: this.ngForm.controls['year'].value
        }
      })
      .subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          data.EncryptedResponse.data.forEach((x: any, index: number) => {
            this.cropNameList.push(x);
          });
        }
      });
  }

  async getVarietyNameList(crop_id) {
    const route = "get-variety-name-list";
    const result = await this.masterService.postRequestCreator(route, null, {
      crop_id: crop_id
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined && apiResponse.EncryptedResponse.status_code == 200) {
        this.varietyNameList = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : [];
        if (!crop_id) {
          this.varietyNameList = [];
        }
      }
    });
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
