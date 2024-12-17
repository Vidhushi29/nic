import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
import { AddSeedTestingLaboratoryUIFields } from '../data/ui-field-data/add-seed-testing-laboratory-ui-fields';
import { SectionFieldType } from '../types/sectionFieldType';

@Component({
  selector: 'app-add-seed-testing-laboratory-search',
  templateUrl: './add-seed-testing-laboratory-search.component.html',
  styleUrls: ['./add-seed-testing-laboratory-search.component.css']
})
export class AddSeedTestingLaboratorySearchComponent implements OnInit {

  
  @Input() isByNodalAgency: boolean = false;
  @Input() AddCrop: boolean = false;
  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  constructor(private router :Router) {
    const filteredBreederSeedSubmissionUIFields = AddSeedTestingLaboratoryUIFields
      .filter(x => x.formControlName == "state_id" || x.formControlName == "district_id"||x.formControlName == "lab_name")
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
    
    if(this.router.url.includes('/add-form-nucleus-seed-availability-by-breeder')){
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
    if (this.searchFormGroupControls["state_id"].value) {
      searchParams.push({ columnNameInItemList: "year.value", value: this.searchFormGroupControls["state_id"].value["value"].toString() });
    }

    if (this.searchFormGroupControls["district_id"].value) {
      searchParams.push({ columnNameInItemList: "crop.value", value: this.searchFormGroupControls["district_id"].value["value"] });
    }
    if (this.searchFormGroupControls["lab_name"].value) {
      searchParams.push({ columnNameInItemList: "variety.value", value: this.searchFormGroupControls["lab_name"].value["value"] });
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

