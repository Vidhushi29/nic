import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
// import { BspSubmissionNodalUIFields } from '../data/ui-field-data/bsp-proformas-ui-field';
import { BspProformasSearchUIFields } from '../data/ui-field-data/bsp-performas-search-ui-fields';
import { SectionFieldType } from '../types/sectionFieldType';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bsp-proformas-search',
  templateUrl: './bsp-proformas-search.component.html',
  styleUrls: ['./bsp-proformas-search.component.css']
})
export class BspProformasSearchComponent implements OnInit {

  @Input() isByNodalAgency: boolean = false;
  @Input() AddCrop: boolean = false;
  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  @Input() AddSeedTesingLaboratoryList: boolean = false;
  @Input() MaximumLotSizeList: boolean = false;
  @Input() filters: any;
  @Input() componentName: any;

  
  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  constructor(private router :Router,
    private bspProformasSearchUIFields: BspProformasSearchUIFields,
    private breederService: BreederService) {
    //  let filteredBreederSeedSubmissionUIFields;
    //  console.log("this.componentNamethis.componentName", this.componentName)
    //  if(this.componentName == "seed_multiplication"){
    //    filteredBreederSeedSubmissionUIFields = breederSeedSubmissionUIFields.get
    //   .filter(x => x.formControlName == "yearofIndent1" || x.formControlName == "cropName")
    //   .map(x => {
    //     return { ...x };
    //   });
    //  }else{
    //    filteredBreederSeedSubmissionUIFields = breederSeedSubmissionUIFields.get
    //   .filter(x => x.formControlName == "yearofIndent1" || x.formControlName == "cropName")
    //   .map(x => {
    //     return { ...x };
    //   });
    //  }
    

    // filteredBreederSeedSubmissionUIFields.forEach(x => {
    //   delete x["validations"];

    //   x.gridColClass = "col-12 col-md-6 py-2 py-md-0";
    //   const newFormControl = new FormControl("");
    //   this.searchFormGroup.addControl(x.formControlName, newFormControl);
    // });
    // this.fieldsList = filteredBreederSeedSubmissionUIFields;
    
    // if(this.router.url.includes('/add-crop')){
    //   this.AddCrop=true
    // }else if(this.router.url.includes('/add-seed-testing-laboratory-list')){
    //   this.AddSeedTesingLaboratoryList=true
    // }
  }

  ngOnInit(): void {
  
  //   let filteredBreederSeedSubmissionUIFields;
  //   if(this.componentName == "seed_multiplication"){
  //     filteredBreederSeedSubmissionUIFields = this.bspProformasSearchUIFields.get
  //    .filter(x => x.formControlName == "cropGroup" || x.formControlName == "cropName")
  //    .map(x => {
  //      return { ...x };
  //    });
  //   }else{
  //     filteredBreederSeedSubmissionUIFields = this.bspProformasSearchUIFields.get
  //    .filter(x => x.formControlName == "yearofIndent" || x.formControlName == "cropName" || x.formControlName == "veriety")
  //    .map(x => {
  //      return { ...x };
  //    });
  //   }
   

  //  filteredBreederSeedSubmissionUIFields.forEach(x => {
  //    delete x["validations"];

  //    x.gridColClass = "col-12 col-md-4 py-2 py-md-0";
  //    const newFormControl = new FormControl("");
  //    this.searchFormGroup.addControl(x.formControlName, newFormControl);
  //  });

  //  console.log(filteredBreederSeedSubmissionUIFields)
  //  this.fieldsList = filteredBreederSeedSubmissionUIFields;
   
  //  if(this.router.url.includes('/add-crop')){
  //    this.AddCrop=true
  //  }else if(this.router.url.includes('/add-seed-testing-laboratory-list')){
  //    this.AddSeedTesingLaboratoryList=true
  //  }

  //  this.searchFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
  //   let paramsData = this.searchFormGroupControls["cropName"].value["value"]
  //   console.log("crop code:", paramsData)
  //   let varieties = []
  //   this.breederService.getRequestCreator("get-breeder-crop-varieties-list?cropCode="+ paramsData).subscribe((data: any) => {
  //     data.EncryptedResponse.data?.forEach((element: any, index: number) => { 
  //       console.log(element)
  //       varieties.push({"name": element.variety_name, "value": element.variety_code, id: element.id})
  //     })
  //     this.fieldsList[2].fieldDataList = varieties;
  //   })
  //  })

  }

  Init(filterPaginateSearch: FilterPaginateSearch) {
    this.filterPaginateSearch = filterPaginateSearch;
  }

  // search() {    
  //   let searchParams1 = [{"yearOfIndent": null, "cropName": null, "cropVariety": null}];
  //   let yearofIndent :any;
  //   let cropName :any;
  //   let cropVariety :any; 
  //   if (this.searchFormGroupControls["yearofIndent"] && this.searchFormGroupControls["yearofIndent"].value) {
  //     yearofIndent = this.searchFormGroupControls["yearofIndent"].value["value"].toString()
  //   }

  //   if (this.searchFormGroupControls["cropName"] && this.searchFormGroupControls["cropName"].value) {
  //     cropName = this.searchFormGroupControls["cropName"].value["value"];
  //   }

  //   if (this.searchFormGroupControls["veriety"] && this.searchFormGroupControls["veriety"].value) {
  //     cropVariety = this.searchFormGroupControls["veriety"].value["id"];
  //   }

  //   if (yearofIndent === null && cropName === null && cropVariety === null){
  //     Swal.fire('Error', 'Please Fill the All Details correctly!', 'error');
  //     return;
  //   }

  //   if (yearofIndent != null && cropName != null && cropVariety != null){
  //     this.breederService.getRequestCreator("get-bsp1-list?yearofIndent="+ yearofIndent + "&cropName="+ cropName +"&cropVariety=8&userId=15").subscribe((data: any) => {
  //       console.log(data)
  //       data.EncryptedResponse.data?.forEach((element: any, index: number) => { 
          
  //       })
  //     })
  //   }else{

  //   }
    
  // }

  clear() {
    this.searchFormGroup.reset();
    this.filterPaginateSearch.search(undefined);
  }
}
