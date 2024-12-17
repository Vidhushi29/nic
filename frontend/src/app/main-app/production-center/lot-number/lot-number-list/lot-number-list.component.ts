import { Component, OnInit, Query, QueryList, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedDivisionComponent } from 'src/app/common/seed-division/seed-division.component';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lot-number-list',
  templateUrl: './lot-number-list.component.html',
  styleUrls: ['./lot-number-list.component.css']
})
export class LotNumberListComponent implements OnInit {

  @ViewChild(SeedDivisionComponent) SeedDivisionComponent: SeedDivisionComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) pagitationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  selectCrop: any;
  ngForm!: FormGroup;
  croupGroupList: any = [];
  countData: any;
  cropData: any;
  cropVarietyData: any;
  cropName: any;
  used_lot_number: any;
  yearOfIndent: any = [
    // { name: "2025-26", "value": "2025" },
    // { name: "2024-25", "value": "2024" },
    // { name: "2023-24", "value": "2023" },
    // { name: "2022-23", "value": "2022" },
    // { name: "2021-22", "value": "2021" },
    // { name: "2020-21", "value": "2020" },
  ];
  todayDate = new Date();
  setYear: any;
  seasonList: any;
  currentUser: any = {
    id: '',
    name: ''
  };
  selectYear: any;

  constructor(private restService: RestService, private fb: FormBuilder,
    private _service: SeedDivisionService,
    private service: ProductioncenterService,
    private _masterService: MasterService) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      year: new FormControl('',),
      crop_code: new FormControl('',),
      variety_id: new FormControl('',),
      season: new FormControl('',),

    });
  }
  ngOnInit(): void {
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.currentUser.id = userData.id;
    this.currentUser.name = userData.name;

    this.filterPaginateSearch.itemListPageSize = 50;

    this.getAllYear();
    this.getPageData();
    this.usedLotNumber();

    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_code'].patchValue("");
        this.ngForm.controls['variety_id'].patchValue("");

        this.seasonList = [];
        this.cropName = [];
        this.cropVarietyData = [];

        this.service.getRequestCreatorNew("getLotNumberSeasons?year=" + newValue + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
            data.EncryptedResponse.data.forEach(x => {
              if (x['season'] && x['m_season.season']) {
                var object = {
                  season: x['m_season.season'],
                  season_code: x['season']
                }
                this.seasonList.push(object);
              }
            });
          }

        })
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      let year = this.ngForm.value.year
      if (newValue) {
        this.ngForm.controls['crop_code'].patchValue("");
        this.ngForm.controls['variety_id'].patchValue("");

        this.cropName = [];
        this.cropVarietyData = [];

        this.service.getRequestCreatorNew("getLotNumberCrops?season=" + newValue + "&year=" + year + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
            data.EncryptedResponse.data.forEach(x => {
              var object = {
                crop_name: x['m_crop.crop_name'],
                crop_code: x['crop_code']
              }
              this.cropName.push(object);

            });
          }

        })
      }
    });

    this.ngForm.controls['crop_code'].valueChanges.subscribe(newValue => {
      let year = this.ngForm.value.year;
      let season = this.ngForm.value.season;

      if (newValue) {
        this.ngForm.controls['variety_id'].patchValue("");
        this.cropVarietyData = [];

        this.service.getRequestCreatorNew("getLotNumberVarieties?crop_code=" + newValue + "&season=" + season + "&year=" + year + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
            data.EncryptedResponse.data.forEach(x => {
              var object = {
                id: x['variety_id'],
                variety_name: x['m_crop_variety.variety_name'],
                variety_code: x['m_crop_variety.variety_code'],
              }
              this.cropVarietyData.push(object);

            });
          }

        })
      }
    });

  }

  getAllYear() {
    this.yearOfIndent = [];

    this.service.getRequestCreatorNew("getLotNumberYears?user_id=" + this.currentUser.id).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.setYear = apiResponse.EncryptedResponse.data;
        let yrs = []

        this.setYear.forEach(x => {
          var temp = this.getFinancialYear(x.year)
          yrs.push({
            value: x.year,
            name: temp
          })
        })
        this.yearOfIndent = yrs;
      }
    });
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    console.log(searchData)
    this.service
      .postRequestCreator("get-lot-number", {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: searchData,
        id: this.currentUser.id
      })
      .subscribe((apiResponse: any) => {
        console.log(apiResponse)
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          let allData = apiResponse.EncryptedResponse.data.rows;
          if (allData === undefined) {
            allData = [];
          }

          this.countData = apiResponse.EncryptedResponse.data.count;
          this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
  }

  initSearchAndPagination() {
    if (this.pagitationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.pagitationUiComponent.Init(this.filterPaginateSearch);
  }

  delete(id: number) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Delete?",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.service
          .postRequestCreator("delete-lot-number/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
            }
          });
      }
    })
  }

  search() {
    if ((!this.ngForm.controls['year'].value && !this.ngForm.controls['crop_code'].value && !this.ngForm.controls['variety_id'].value && !this.ngForm.controls['season'].value)) {
      Swal.fire({

        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {
      let data = {}

      if (this.ngForm.controls['year'] && this.ngForm.controls['year'].value) {
        data['year'] = Number(this.ngForm.controls['year'].value)
      }

      if (this.ngForm.controls['crop_code'] && this.ngForm.controls['crop_code'].value) {
        data['crop_code'] = this.ngForm.controls['crop_code'].value
      }

      if (this.ngForm.controls['variety_id'] && this.ngForm.controls['variety_id'].value) {
        data['variety_id'] = Number(this.ngForm.controls['variety_id'].value)
      }

      if (this.ngForm.controls['season'] && this.ngForm.controls['season'].value) {
        data['season'] = this.ngForm.controls['season'].value
      }


      // this.filterPaginateSearch.itemListCurrentPage = 1;
      // this.initSearchAndPagination();
      // this.getPageData(1, data);

      this.getPageData(1, data);
      // this.getCropVarietyData('ew324');
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
    }
  }

  clear() {
    this.ngForm.controls["year"].setValue("");
    this.ngForm.controls["crop_code"].setValue("");
    this.ngForm.controls["variety_id"].setValue("");
    this.ngForm.controls["season"].setValue("");

    this.seasonList = [];
    this.cropName = [];
    this.cropVarietyData = [];

    this.getPageData();
    this.getCropVarietyData('ew324');
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination();
  }


  async getCrop(newValue) {
    const searchFilters = {
      "search": {
        "year": this.selectYear,
        "season": newValue
      }
    };
    this.service.postRequestCreator("get-indent-crop", searchFilters, null).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
        this.cropName = apiResponse.EncryptedResponse.data;
      }
    });

  }

  async getCropVarietyData(newValue) {
    const searchFilters = {
      "search": {
        "crop_code": newValue
      }
    };
    this._service
      .postRequestCreator("get-crop-veriety-list", searchFilters, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
        }
      });

  }

  onSubmit(formData) {

  }

  usedLotNumber() {
    this.service.getRequestCreatorNew("used-lot-number").subscribe((apiResponse: any) => {
      if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        let allData = apiResponse.EncryptedResponse.data;
        this.used_lot_number = allData ? allData : 0;
      }
    });
  }

}

