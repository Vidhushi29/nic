import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
import { nucliousbreederSeedSubmissionNodalUIFieldss } from '../data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { NucliousbreederSeedSubmissionUIFields } from '../data/ui-field-data/nuclious-seed-submission-ui-fields';
import { SectionFieldType } from '../types/sectionFieldType';

@Component({
  selector: 'app-seed-multiplication-ratio-ui-form',
  templateUrl: './seed-multiplication-ratio-ui-form.component.html',
  styleUrls: ['./seed-multiplication-ratio-ui-form.component.css']
})
export class SeedMultiplicationRatioUiFormComponent implements OnInit {

  @Input() isByNodalAgency: boolean = false;
  @Input() AddCrop: boolean = false;
  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  constructor(private router :Router, 
     nucliousbreederSeedSubmissionUIFields:nucliousbreederSeedSubmissionNodalUIFieldss) {
    const filteredBreederSeedSubmissionUIFields = nucliousbreederSeedSubmissionUIFields.get
      .filter(x =>  x.formControlName == "groupName")
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
    
    if(this.router.url.includes('/seed-multiplication-ratio-list')){
      this.AddCrop=true
    }
  }

  ngOnInit(): void {
  }

  Init(filterPaginateSearch: FilterPaginateSearch) {
    this.filterPaginateSearch = filterPaginateSearch;
  }

  search() {
    let searchParams = [];
   

    if (this.searchFormGroupControls["groupName"].value) {
      searchParams.push({ columnNameInItemList: "crop.value", value: this.searchFormGroupControls["cropName"].value["value"] });
    }
   
    if (searchParams.length > 0) {
      this.filterPaginateSearch.search(searchParams);
    }
  }

  clear() {
    this.searchFormGroup.reset();
    this.filterPaginateSearch.search(undefined);
  }

}
