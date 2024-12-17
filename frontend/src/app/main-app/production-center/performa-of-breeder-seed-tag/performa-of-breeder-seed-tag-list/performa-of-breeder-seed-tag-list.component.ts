import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-performa-of-breeder-seed-tag-list',
  templateUrl: './performa-of-breeder-seed-tag-list.component.html',
  styleUrls: ['./performa-of-breeder-seed-tag-list.component.css']
})
export class PerformaOfBreederSeedTagListComponent implements OnInit {
  ngForm!: FormGroup;
  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  crop_name_list: any;
  cropVarietyData: any;
  todayDate = new Date();
  yearOfIndent = [];

  // { name: "2025-26", "value": "2025" },
  // { name: "2024-25", "value": "2024" },
  // { name: "2023-24", "value": "2023" },
  // { name: "2022-23", "value": "2022" },
  // { name: "2021-22", "value": "2021" },
  // { name: "2020-21", "value": "2020" },

  testingList: any;
  seasonList: any;

  currentUser: any;

  constructor(
    private restService: RestService,
    private router: Router,
    private _service: ProductioncenterService,
    private fb: FormBuilder,
    private service: SeedServiceService


  ) {
    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_name: new FormControl('',),
      variety_name: new FormControl('',),
      year_of_indent: new FormControl('',),
      season: new FormControl('',),

    });

    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].patchValue("");
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].patchValue("");

        this._service.getRequestCreatorNew("getCropsForTagProforma?user_id=" + this.currentUser.id).subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code == 200) {
            var crops = []
            apiResponse.EncryptedResponse.data.forEach(x => {
              var object = {
                crop_name: x['m_crop.crop_name'],
                crop_code: x['crop_code']
              }
              crops.push(object);
            });
            this.crop_name_list = crops;
          }
        });
      }
    });

    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['variety_name'].patchValue("");

        this._service.getRequestCreatorNew("getVarietiesForTagProforma?crop_code=" + newValue + "&user_id=" + this.currentUser.id).subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code == 200) {
            var crops = [];
            console.log(apiResponse)
            apiResponse.EncryptedResponse.data.forEach(x => {
              var object = {
                id: x['variety_id'],
                variety_name: x['m_crop_variety.variety_name'],
                variety_code: x['m_crop_variety.variety_code']
              }
              crops.push(object);
            });
            this.cropVarietyData = crops;
          }
        });
      }
    });

  }
  ngOnInit(): void {

    this.getYear();
    this.getPageData();
    this.getSeasonData();

  }
  getSeasonData() {
    const route = "get-season-details";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

    })
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this._service
      .postRequestCreator("get-performa-breeder-seed-list", {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        search: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : "";

          if (allData === undefined) {
            allData = [];
          }
          if (allData.count == 0) {
            // this.noData = true;
          }
          this.testingList = apiResponse.EncryptedResponse.data;
          this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
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

  getYear() {
    this._service.postRequestCreator("get-performa-breeder-seed-list-year",null ,null).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        let year = apiResponse.EncryptedResponse.data.rows;

        if (year && year.length > 0) {
          this.yearOfIndent = year;
          console.log(this.yearOfIndent[0].year_of_indent)
        } else {
          this.yearOfIndent = [];
        }
      }
    });
  }

  addFormRedirection() {
    this.router.navigateByUrl('performa-Of-breeder-seed-tag');
  }
  delete(id: number,) {
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

        this._service
          .postRequestCreator("delete-perform-submission/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
    })
  }
  search() {
    if ((!this.ngForm.controls["crop_name"].value && !this.ngForm.controls["variety_name"].value && !this.ngForm.controls["year_of_indent"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Something ",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,

        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
      })

      return;
    }
    else {
      let data = {
        crop_code: this.ngForm.controls["crop_name"].value,
        variety_id: this.ngForm.controls["variety_name"].value,
        year_of_indent: this.ngForm.controls["year_of_indent"].value,
        season: this.ngForm.controls["season"].value

      }
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.getPageData(1, data);
    }
  }

  clear() {
    this.ngForm.controls["year_of_indent"].patchValue("");
    this.ngForm.controls["crop_name"].patchValue("");
    this.ngForm.controls["variety_name"].patchValue("");
    this.ngForm.controls["season"].patchValue("");

    this.ngOnInit();
  }


  getCroupNameList() {
    // this.selectCrop_group = "";
    const route = "get-crop-name";
    // const search = {
    //   'search':{
    //     'group_code':newValue
    //   }
    // }
    this._service
      .postRequestCreator(route, null, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          // this.isCropName = true;
          this.crop_name_list = apiResponse.EncryptedResponse.data;
        }
      });
    // const result = this.service.getPlansInfo(route).then((data: any) => {
    //   this.crop_name_list = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    // })
  }

}
