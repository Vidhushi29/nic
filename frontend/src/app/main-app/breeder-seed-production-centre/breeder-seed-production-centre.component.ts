import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-breeder-seed-production-centre',
  templateUrl: './breeder-seed-production-centre.component.html',
  styleUrls: ['./breeder-seed-production-centre.component.css']
})
export class BreederSeedProductionCentreComponent implements OnInit {

  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  constructor(
    private restService: RestService,
    private route: Router
  ) {

  }

  ngOnInit(): void {
    // localStorage.setItem('logined_user', "productionCenter");
    // if (!localStorage.getItem('foo')) { 
    //   localStorage.setItem('foo', 'no reload') 
    //   location.reload() 
    // } else {
    //   localStorage.removeItem('foo') 
    // }
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

  search() { }

  clear() { }
  addFormRedirection() {
    this.route.navigateByUrl('add-form-nucleus-seed-availability-by-breeder/submission');
  }
}
