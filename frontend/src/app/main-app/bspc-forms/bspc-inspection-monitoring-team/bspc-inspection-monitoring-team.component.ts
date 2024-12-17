import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';

@Component({
  selector: 'app-bspc-inspection-monitoring-team',
  templateUrl: './bspc-inspection-monitoring-team.component.html',
  styleUrls: ['./bspc-inspection-monitoring-team.component.css']
})
export class BspcInspectionMonitoringTeamComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  is_developed: boolean;
  is_update: boolean = false;
  isCrop: boolean = false;
  isSearch: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  varietyList = [];
  varietyDisbled: boolean = true;
  isDeveloped: boolean = false;
  inventoryData = [
    { "id": 1, "year": "b", "season": "a", "crop": "b", "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 2, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 3, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 4, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 5, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 6, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 7, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 8, "variety_name": "PW-248", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" }
  ];
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  inventoryVarietyData: any;
  isOnboard: boolean = false;

  constructor(private service: SeedServiceService, private breeder: BreederService, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      crop: [''],
      variety: [''],
      variety_filter: [''],
      is_developed: [''],
      reason: [''],
      nucleus_avail_qnt: [''],
      breeder_avail_qnt: [''],
      date_of_moa: [''],
      date_of_memo: [''],
      refrence_no_memo: [''],
      refrence_no_auth: [''],
      variety_not: [''],
      spa_name: [''],
      spa_code: [''],
      indent_qnt: ['']
    });

    // this.ngForm.disable();
    this.ngForm.controls['year'].enable();
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.getSeasonData();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['crop'].enable();
        this.getCropData();
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.isCrop = true;
        this.ngForm.controls['variety'].enable();
        this.getVarietyData();
      }
    });

    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.isDeveloped = true;
        this.ngForm.controls['is_developed'].enable();
        this.ngForm.controls['is_developed'].patchValue("non-notified");
        this.ngForm.controls['reason'].enable();
        this.ngForm.controls['nucleus_avail_qnt'].enable();
        this.ngForm.controls['breeder_avail_qnt'].enable();
        this.ngForm.controls['date_of_moa'].enable();
        this.ngForm.controls['date_of_memo'].enable();
        this.ngForm.controls['refrence_no_memo'].enable();
        this.ngForm.controls['refrence_no_auth'].enable();
      }
    });
  }

  ngOnInit(): void {
    this.fetchData();
    this.isCrop = true;
    this.isDeveloped = true;
    this.isSearch = false;
    this.ngForm.controls['is_developed'].enable();
    // this.isOnboard = true;
  }


  fetchData() {
    this.getYearData();
    this.getPageData();
    this.dropdownSettings = {
      idField: 'variety_id',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      itemsShowLimit: 2,
      limitSelection: -1,
    };
  }

  getYearData() {
    const route = "get-year-assign-indenter-data";
    this.breeder.postRequestCreator(route, null, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryYearData = data.EncryptedResponse.data
      }
    })
  }

  getSeasonData() {
    const route = "get-season-assign-indenter-data";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventorySeasonData = data.EncryptedResponse.data
      }
    })
  }

  getCropData() {
    const route = "get-crop-assign-indenter-data";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      console.log("season data vale", data);
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryCropData = data.EncryptedResponse.data
      }
    })
  }

  getVarietyData() {
    const route = "get-assign-indenter-variety-data";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = data.EncryptedResponse.data
      }
    })
  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    // if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop'].value) {
    //   Swal.fire({
    //     toast: false,
    //     icon: "warning",
    //     title: "Please Select All Required Field",
    //     position: "center",
    //     showConfirmButton: true,
    //     showCancelButton: false,
    //     confirmButtonText: "Yes",
    //     cancelButtonText: "No",
    //   })
    // } else {
    this.isSearch = false;
    this.varietyDisbled = false;
    this.ngForm.controls['variety_filter'].enable();
    let varietyCodeArr = [];
    if (this.ngForm.controls["variety_filter"].value && this.ngForm.controls["variety_filter"].value !== undefined && this.ngForm.controls["variety_filter"].value.length > 0) {
      this.ngForm.controls["variety_filter"].value.forEach(ele => {
        varietyCodeArr.push(ele.variety_code);
      })
    }
    this.service.postRequestCreator("data-characterstics-list", null, {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      pageSize: 50,
      search: {
        yaer: this.ngForm.controls["year"].value,
        season: this.ngForm.controls["season"].value,
        crop_code: this.ngForm.controls["crop"].value,
        variety_code: varietyCodeArr && (varietyCodeArr.length > 0) ? varietyCodeArr : null,
        // user_id: this.userId.id
      }
    }).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        console.log(apiResponse);

        // this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
        // console.log(this.allData[0].m_crop);
        this.allData = this.inventoryData

        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);

        // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });
    // }
  }

  notifiedvalue(value) {
    if (value == "yes") {
      this.is_developed = false;
    } else {
      this.is_developed = true;
    }
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

  revertDataCancelation() {
    this.ngForm.controls['year'].patchValue('');
    this.ngForm.controls['season'].patchValue('');
    this.ngForm.controls['crop'].patchValue('');
    this.ngForm.controls['variety'].patchValue('');
    this.ngForm.controls['is_developed'].patchValue('')
    this.ngForm.controls['reason'].patchValue('')
    this.ngForm.controls['nucleus_avail_qnt'].patchValue('')
    this.ngForm.controls['breeder_avail_qnt'].patchValue('')
    this.ngForm.controls['date_of_moa'].patchValue('')
    this.ngForm.controls['date_of_memo'].patchValue('')
    this.ngForm.controls['refrence_no_memo'].patchValue('')
    this.ngForm.controls['refrence_no_auth'].patchValue('')
    this.ngForm.controls['variety_filter'].patchValue('');
    this.ngForm.disable();
    this.ngForm.controls['year'].enable();
    this.isCrop = false;
    this.is_update = false;
    this.isSearch = true;
    this.isDeveloped = false;
  }

  editFunctinality(data) {
    this.is_update = true;
    if (data) {
      console.log("data", data);
      this.ngForm.controls['year'].patchValue(data.year);
      this.ngForm.controls['season'].patchValue(data.year);
      this.ngForm.controls['crop'].patchValue(data.year);
      this.ngForm.controls['variety'].patchValue(data.year);
      this.ngForm.controls['is_developed'].patchValue(data.bspc_developed_by);
      this.ngForm.controls['reason'].patchValue(data.year);
      this.ngForm.controls['nucleus_avail_qnt'].patchValue(data.year);
      this.ngForm.controls['breeder_avail_qnt'].patchValue(data.year);
      this.ngForm.controls['date_of_moa'].patchValue(data.year);
      this.ngForm.controls['date_of_memo'].patchValue(data.year);
      this.ngForm.controls['refrence_no_memo'].patchValue(data.year);
      this.ngForm.controls['refrence_no_auth'].patchValue(data.year);
    }
  }

  saveForm() { }

  updateForm() { }

  finalSubmit() {
    console.log("final submit");
  }


}
