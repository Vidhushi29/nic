import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
import { SeedDivisionSerarchUI } from '../data/ui-field-data/seed-division-fields';

@Component({
  selector: 'app-seed-division',
  templateUrl: './seed-division.component.html',
  styleUrls: ['./seed-division.component.css']
})
export class SeedDivisionComponent implements OnInit {

  @Input() isByNodalAgency: boolean = false;
  @Input() AddCrop: boolean = false;
  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  constructor(private router: Router,
     SeedDivisionSerarchUI: SeedDivisionSerarchUI) {
    const filteredBreederSeedSubmissionUIFields = SeedDivisionSerarchUI.get
      .filter(x => x.formControlName == "cropGroup" || x.formControlName == "cropName" || x.formControlName == "varietyName")
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

    if (this.router.url.includes('/add-crop-notified')) {
      this.AddCrop = true
    }
  }

  ngOnInit(): void {
  }

  Init(filterPaginateSearch: FilterPaginateSearch) {
    this.filterPaginateSearch = filterPaginateSearch;
  }

  search() {
    let searchParams = [];
    
    if (this.searchFormGroupControls["cropGroup"].value) {
      // console.log('cropgroup',this.searchFormGroupControls["cropGroup"].value['value']);
      searchParams.push({ columnNameInItemList: "cropgroup.value", value: this.searchFormGroupControls["cropGroup"].value['value'] });
    }

    if (this.searchFormGroupControls["cropName"].value) {
      alert("cropName");
      searchParams.push({ columnNameInItemList: "crop.value", value: this.searchFormGroupControls["cropName"].value["value"] });
    }
    if (this.searchFormGroupControls["varietyName"].value) {
      alert("varietyName");
      searchParams.push({ columnNameInItemList: "variety.value", value: this.searchFormGroupControls["varietyName"].value["value"] });
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
