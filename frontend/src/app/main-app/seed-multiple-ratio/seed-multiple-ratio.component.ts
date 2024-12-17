import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { RestService } from 'src/app/services/rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seed-multiple-ratio',
  templateUrl: './seed-multiple-ratio.component.html',
  styleUrls: ['./seed-multiple-ratio.component.css']
})
export class SeedMultipleRatioComponent implements OnInit {

  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  constructor(private restService: RestService, private indenterService: IndenterService) {

  }

  ngOnInit(): void {
    localStorage.setItem('logined_user', "Indenter");
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }
    this.filterPaginateSearch.itemListPageSize = 5;
    this.getPageData();
  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.indenterService
      .postRequestCreator("get-breeder-seeds-submission-list", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 10,
        search: searchData
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          let allData = apiResponse.EncryptedResponse.data.rows;
          if (allData === undefined) {
            allData = [];
          }
          if (allData.length > 0 && !allData[0]["variety"]) {
            // until includes are built
            for (let index = 0; index < allData.length; index++) {
              const element = allData[index];
              element["variety"] = {
                name: "Variety-" + element.variety_id,
                value: element.variety_id
              }
              element["year"] = {
                name: element.year,
                value: element.year
              }
              element["crop"] = {
                name: element.crop_code,
                value: element.crop_code,
                cropType: "Crop Type - " + index
              }
            }
            //-------------------
          }
          this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
  }


  initSearchAndPagination() {
    if (this.indentBreederSeedAllocationSearchComponent === undefined || this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }

    this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  delete(id: number, cropName: string) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are you sure to delete Crop '" + cropName + "'",
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
        this.indenterService
          .postRequestCreator("delete-breeder-seeds-submission/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
      }
    })
  }
}

