import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
import { MaximumLotSizeUIFields } from '../data/ui-field-data/maximum-lot-size-ui-fields';
import { PaginationUiComponent } from '../pagination-ui/pagination-ui.component';
import { SectionFieldType } from '../types/sectionFieldType';

@Component({
  selector: 'app-maximum-lot-size-search',
  templateUrl: './maximum-lot-size-search.component.html',
  styleUrls: ['./maximum-lot-size-search.component.css']
})
export class MaximumLotSizeSearchComponent implements OnInit {

  
  @Input() isByNodalAgency: boolean = false;
  @Input() AddCrop: boolean = false;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  constructor(private router :Router) {
    const filteredBreederSeedSubmissionUIFields = MaximumLotSizeUIFields
      .filter(x => x.formControlName == "crop_group" || x.formControlName == "crop_name")
      .map(x => {
        return { ...x };
      });

    filteredBreederSeedSubmissionUIFields.forEach(x => {
      delete x["validations"];

      x.gridColClass = "col-12 col-md-4 py-2 py-md-0";
      const newFormControl = new FormControl("");
      this.searchFormGroup.addControl(x.formControlName, newFormControl);
    });
    this.fieldsList = filteredBreederSeedSubmissionUIFields;
    
    // if(this.router.url.includes('/add-form-nucleus-seed-availability-by-breeder')){
    //   this.AddCrop=true
    // }
  }

  ngOnInit(): void {
  }

  Init(filterPaginateSearch: FilterPaginateSearch) {
    this.filterPaginateSearch = filterPaginateSearch;
  }

  search() {
    let searchParams = [];
    if (this.searchFormGroupControls["crop_group"].value) {
      searchParams.push({ columnNameInItemList: "crop_group.value", value: this.searchFormGroupControls["crop_group"].value["value"].toString() });
    }

    if (this.searchFormGroupControls["crop_name"].value) {
      searchParams.push({ columnNameInItemList: "crop_name.value", value: this.searchFormGroupControls["crop_name"].value["value"] });
    }
    // if (this.searchFormGroupControls["lab_name"].value) {
    //   searchParams.push({ columnNameInItemList: "lab_name.value", value: this.searchFormGroupControls["lab_name"].value["value"] });
    // }
    if (searchParams.length > 0) {
      
   
      this.filterPaginateSearch.search(searchParams);
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination()
      console.log(this.filterPaginateSearch,'this.filterPaginateSearch')
    }

  }

  clear() {
    this.searchFormGroup.reset();
    this.filterPaginateSearch.search(undefined);
  }
  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

}


