import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
import { BreederSeedSubmissionUIFields } from '../data/ui-field-data/breeder-seed-submission-ui-fields';
import { SectionFieldType } from '../types/sectionFieldType';
import Swal from 'sweetalert2';
import { IcarService } from 'src/app/services/icar/icar.service';
@Component({
  selector: 'app-indent-breeder-seed-allocation-search',
  templateUrl: './indent-breeder-seed-allocation-search.component.html',
  styleUrls: ['./indent-breeder-seed-allocation-search.component.css']
})
export class IndentBreederSeedAllocationSearchComponent implements OnInit {

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
    private breederSeedSubmissionUIFields: BreederSeedSubmissionUIFields,private service:IcarService) {
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
    // this.searchFormGroup.controls["yearofIndent"].valueChanges.subscribe(newValue=>{
    //   this.getCropName(newValue)
    // })
    if(this.searchFormGroupControls["yearofIndent"] ){
      this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(data=>{
        console.log(data);
        
      })
    
      }
  }

  ngOnInit(): void {
    console.log("filtersaaaaaaa", this.filters)
    console.log("this.componentNamethis.componentName", this.componentName)
  

    let filteredBreederSeedSubmissionUIFields;
    console.log("this.componentNamethis.componentName", this.componentName)
    if(this.componentName == "seed_multiplication"){
      filteredBreederSeedSubmissionUIFields = this.breederSeedSubmissionUIFields.get
     .filter(x => x.formControlName == "cropGroup" || x.formControlName == "cropName")
     .map(x => {
       return { ...x };
     });
    }else{
      filteredBreederSeedSubmissionUIFields = this.breederSeedSubmissionUIFields.get
     .filter(x => x.formControlName == "yearofIndent" || x.formControlName == "cropName")
     .map(x => {
       return { ...x };
     });
    }
   

   filteredBreederSeedSubmissionUIFields.forEach(x => {
     delete x["validations"];

     x.gridColClass = "col-12 col-md-6 py-2 py-md-0";
     const newFormControl = new FormControl("");
     this.searchFormGroup.addControl(x.formControlName, newFormControl);
   });
   this.fieldsList = filteredBreederSeedSubmissionUIFields;
   
   if(this.router.url.includes('/add-crop')){
     this.AddCrop=true
   }else if(this.router.url.includes('/add-seed-testing-laboratory-list')){
     this.AddSeedTesingLaboratoryList=true
   }

   this.searchFormGroupControls["cropName"].disable();
   this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
console.log(newValue);
const param={
  search:{
    year:newValue.value
  }
}
this.service.postRequestCreator('get-crop-name-data',null,param).subscribe(data=>{
  console.log('data==.',data);
  
  if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
    if (data.EncryptedResponse.data.rows.length > 0) {
      // const v_year = new Date(data.EncryptedResponse.data[0].created_at);
      this.searchFormGroupControls["cropName"].patchValue(data.m_crop.crop_name);
      // this.formGroupControls["varietyNotificationYear"].disable();
    } else {

    }

  }
})
this.searchFormGroupControls["cropName"].enable();

   })

  
  

  }

  Init(filterPaginateSearch: FilterPaginateSearch) {
    this.filterPaginateSearch = filterPaginateSearch;
  }

  search() {
    let searchParams = [];

    if (this.searchFormGroupControls["yearofIndent"] && this.searchFormGroupControls["yearofIndent"].value) {
      searchParams.push({ columnNameInItemList: "year.value", value: this.searchFormGroupControls["yearofIndent"].value["value"].toString() });
    }

    if (this.searchFormGroupControls["cropName"] && this.searchFormGroupControls["cropName"].value) {
      searchParams.push({ columnNameInItemList: "crop.value", value: this.searchFormGroupControls["cropName"].value["value"] });
    }

    if (this.searchFormGroupControls["cropGroup"] && this.searchFormGroupControls["cropGroup"].value) {
      searchParams.push({ columnNameInItemList: "cropGroup.value", value: this.searchFormGroupControls["cropGroup"].value["value"] });
    }
    console.log("searchParams1111", searchParams)
    if (searchParams.length > 0) {
      this.filterPaginateSearch.search(searchParams);
    }
    else{
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
      
      return ;
    }
  }

  clear() {
    this.searchFormGroup.reset();
    this.filterPaginateSearch.search(undefined);
  }

  
}
