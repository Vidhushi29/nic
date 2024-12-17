import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
import { AddCropListUI } from '../data/indentor-ui-field/indentor-ui-fields';
import {  BreederSeedSubmissionUIFields } from '../data/ui-field-data/breeder-seed-submission-ui-fields';
// import { AddCropListUI } from '../data/ui-field-data/indentor-ui-fields';

@Component({
  selector: 'app-add-crop-search',
  templateUrl: './add-crop-search.component.html',
  styleUrls: ['./add-crop-search.component.css']
})
export class AddCropSearchComponent implements OnInit {
  @Input() isByNodalAgency: boolean = false;
  @Input() AddCrop: boolean = false;
  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  searchparams: any;
  searchParams: any[];
  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  constructor(private router :Router,
    breederSeedSubmissionUIFields: AddCropListUI) {
    const filteredBreederSeedSubmissionUIFields = breederSeedSubmissionUIFields.get
      .filter(x => x.formControlName == "croupGroup" || x.formControlName == "cropName")
      .map(x => {
        return { ...x };
      });
      console.log(filteredBreederSeedSubmissionUIFields);
      

    filteredBreederSeedSubmissionUIFields.forEach(x => {
      delete x["validations"];

      x.gridColClass = "col-12 col-md-6 py-2 py-md-0";
      const newFormControl = new FormControl("");
      this.searchFormGroup.addControl(x.formControlName, newFormControl);
    });
    this.fieldsList = filteredBreederSeedSubmissionUIFields;
    
    if(this.router.url.includes('/add-crop')){
      this.AddCrop=true
    }
  }

  ngOnInit(): void {
  }

  Init(filterPaginateSearch: FilterPaginateSearch) {
    this.filterPaginateSearch = filterPaginateSearch;
  }

  search() {   
    this.searchParams = [];

    if (this.searchFormGroupControls["croupGroup"] && this.searchFormGroupControls["croupGroup"].value) {
      this.searchParams.push({ columnNameInItemList: "croupGroup.value", value: this.searchFormGroupControls["croupGroup"].value["value"].toString() });
    }
    if (this.searchFormGroupControls["cropName"] && this.searchFormGroupControls["cropName"].value) {
      this.searchParams.push({ columnNameInItemList: "cropName.value", value: this.searchFormGroupControls["cropName"].value["value"] });
    }
console.log(this.searchParams);

    // console.log(this.searchFormGroupControls["cropName"].value,' console.log(this.searchFormGroupControls["cropGroup"].value);');
    if (this.searchParams.length > 0) {
      this.filterPaginateSearch.search(this.searchParams);
    }
  }

  clear() {
    this.searchFormGroup.reset();
    this.filterPaginateSearch.search(undefined);
  }
}
