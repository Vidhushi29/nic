import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-indent-breeder-seed-allocation-draft',
  templateUrl: './indent-breeder-seed-allocation-draft.component.html',
  styleUrls: ['./indent-breeder-seed-allocation-draft.component.css']
})
export class IndentBreederSeedAllocationDraftComponent implements OnInit {

  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  constructor(private restService: RestService) {

  }

  ngOnInit(): void {
    this.getPageData();
  }
  getPageData() {
    this.restService.getIndentBreederSeedAllocationList().subscribe(data => {
      this.filterPaginateSearch.itemListPageSize = 5;
      this.filterPaginateSearch.Init(data, this, "getPageData");
      this.initSearchAndPagination();
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

  delete(id: number) {
    this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemListInitial.filter(x => x.id != id);
    this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemList.filter(x => x.id != id);
    this.filterPaginateSearch.itemListFilter = this.filterPaginateSearch.itemListFilter.filter(x => x.id != id);
    if (this.filterPaginateSearch.lastFormSearchValue !== undefined)
      this.filterPaginateSearch.search(this.filterPaginateSearch.lastFormSearchValue);
    else
      this.filterPaginateSearch.filterItemsList();
  }

}
