import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { checkNumber } from 'src/app/_helpers/utility';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';

@Component({
  selector: 'app-pagination-ui',
  templateUrl: './pagination-ui.component.html',
  styleUrls: ['./pagination-ui.component.css']
})
export class PaginationUiComponent implements OnInit {
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  isInitialized = false;
  formGroup: FormGroup = new FormGroup([]);
  totalPage: number;
  get formGroupControls(){
    return this.formGroup.controls;
  }

  constructor() {
    this.formGroup.addControl("enterPage", new FormControl())
  }

  ngOnInit(): void {
  }

  Init(filterPaginateSearch: FilterPaginateSearch) {
    // const lastItem = filterPaginateSearch[filterPaginateSearch.paginationArray - 1];
    // console.log('lastItem',filterPaginateSearch.paginationArray[filterPaginateSearch.paginationArray.length-1]);
    // console.log('filterPaginateSearch',filterPaginateSearch.itemListNextBtnDisable);
    
    this.filterPaginateSearch = filterPaginateSearch;
    this.totalPage = filterPaginateSearch.itemListTotalPage;
    this.isInitialized = true;
  }


  checkNumber(event: any) {
    checkNumber(event)
  }
  paginate(){
   
    if(parseInt(this.formGroupControls['enterPage'].value)<1){
     this.formGroupControls['enterPage'].setValue(1)
      this.filterPaginateSearch.navigate('previous', this.formGroupControls['enterPage'].value)
    }
    if(parseInt(this.formGroupControls['enterPage'].value)>this.totalPage){
      this.formGroupControls['enterPage'].setValue(this.totalPage)
      this.filterPaginateSearch.navigate('next', this.formGroupControls['enterPage'].value)
    }
    else{
      this.filterPaginateSearch.navigate('previous', this.formGroupControls['enterPage'].value)
     
    }
  }
}
