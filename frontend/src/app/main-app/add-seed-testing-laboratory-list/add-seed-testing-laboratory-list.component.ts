
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';

import { RestService } from 'src/app/services/rest.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/services/master/master.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-add-seed-testing-laboratory-list',
  templateUrl: './add-seed-testing-laboratory-list.component.html',
  styleUrls: ['./add-seed-testing-laboratory-list.component.css']
})
export class AddSeedTestingLaboratoryListComponent implements OnInit {


  @ViewChild(AddSeedTestingLaboratorySearchComponent) indentBreederSeedAllocationSearchComponent: AddSeedTestingLaboratorySearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  disablefield: boolean = false;
  deletedId: any;
  stateList: any;
  districtList: any;
  ngForm!: FormGroup;
  agencyName: any;
  countData: any;
  selected_state;
  LabData: any;
  userId: any;
  searchFilterData=false;
  stateListSecond: any;
  selected_district: any;
  disabledfieldDist=true;
  selected_agency;
  disabledfieldAgency=true;
  districtListSecond: any;
  LabDatasecond: any;
  isState=false;
  constructor(private restService: RestService,
    private router: Router,
    private fb: FormBuilder,
    private _serviceSeed: SeedDivisionService,
    private masterService: MasterService,

  ) {
    if (this.router.url.includes('view')) {
      this.disablefield = true;
    }
    if (this.router.url.includes('edit')) {
      this.disablefield = false;
    }
    this.createEnrollForm();

  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      state_id: new FormControl(''),
      district_id: new FormControl(''),
      lab_name: new FormControl(''),
      state_text: new FormControl(''),
      district_text: new FormControl(''),
      agency_text: new FormControl(''),
      
    });
    this.ngForm.controls['state_id'].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.ngForm.controls['district_id'].enable();
        this.ngForm.controls['lab_name'].disable();
        this.ngForm.controls['district_id'].setValue('')
        this.searchFilterData=false;
        this.selected_district ='';
        this.disabledfieldDist=false;
        // this.getDistrictList(newValue);
      }
    });

    this.ngForm.controls['district_id'].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.ngForm.controls['lab_name'].enable();
        this.selected_agency='';
        this.ngForm.controls['lab_name'].setValue('');
        this.searchFilterData=false;
        this.disabledfieldAgency=false
        this.getLabNameData()
      }
    });
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.stateList =this.stateListSecond
        let response= this.stateList.filter(x=>x.state_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.stateList=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getStateList()
       
      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.districtList =this.districtListSecond
        let response= this.districtList.filter(x=>x.district_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.districtList=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        // this.getDistrictList(this.ngForm.controls['state_id'].value)
       
      }
    });
    this.ngForm.controls['agency_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        
        this.LabData =this.LabDatasecond
        let response= this.LabData.filter(x=>x.lab_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.LabData=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getLabNameData()
       
      }
    });

  }
  ngOnInit(): void {
    let user = localStorage.getItem('BHTCurrentUser')
    console.log('userDatat',);
    this.userId = JSON.parse(user)
    
    this.getStateList();
    this.getPageData();
    // this.getLabData();
    this.ngForm.controls['district_id'].disable();
    this.ngForm.controls['lab_name'].disable();
  }
  async getStateList() {
    this._serviceSeed
      .postRequestCreator("getSeedTestingStateList")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          this.stateListSecond= this.stateList;
        }
      });

  }


  // async getDistrictList(newValue: any) {
  //   const searchFilters = {
  //     "search": {
  //       "state_code": newValue
  //     }
  //   };
  //   this._serviceSeed
  //     .postRequestCreator("get-seed-testing-crop-name", searchFilters)
  //     .subscribe((apiResponse: any) => {
  //       if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
  //         && apiResponse.EncryptedResponse.status_code == 200) {
  //         this.districtList =  apiResponse && apiResponse.EncryptedResponse  && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows :'';
  //         this.districtListSecond=  this.districtList
  //       }
  //     });

  // }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
  if(this.searchFilterData){
    let route = "get-lab-test-data";
    let data = {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      pageSize: 50,
      search: {
        state_code:this.ngForm.controls["state_id"].value,
        // district_id: this.ngForm.controls["district_id"].value,
        // lab_name: this.ngForm.controls["lab_name"].value
      }
    }


    this._serviceSeed.postRequestCreator(route, data).subscribe(data => {
      this.filterPaginateSearch.itemListPageSize = 50;
      this.allData = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;
      this.isState = true;

      this.filterPaginateSearch.Init(data.EncryptedResponse.data.rows, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      this.initSearchAndPagination();
    });
  }
  else{
    let route = "get-lab-test-data";
    let data = {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      pageSize: 50,
      search: searchData
    }


    this._serviceSeed.postRequestCreator(route, data).subscribe(data => {
      this.filterPaginateSearch.itemListPageSize = 50;
      this.allData = data.EncryptedResponse.data.rows;
      this.countData = data.EncryptedResponse.data.count;

      this.filterPaginateSearch.Init(data.EncryptedResponse.data.rows, this, "getPageData", undefined, data.EncryptedResponse.data.count, true);
      this.initSearchAndPagination();
    });
  }
  }

  getLabData() {
    let route = "get-lab-test-data";
    let data = {
      search:
      {
        state_id: this.ngForm.controls['state_id'].value,
        district_id: this.ngForm.controls['district_id'].value,
        // lab_name: this.ngForm.controls['lab_name'].value
      }
    }
    this._serviceSeed.postRequestCreator(route, data).subscribe(data => {

      this.countData = data.EncryptedResponse.data.count;

      // this.filterPaginateSearch.itemListPageSize = 10;
      this.filterPaginateSearch.Init(data.EncryptedResponse.data.rows, this, "getPageData");
      this.initSearchAndPagination();
    });
  }

  getLabNameData() {
    let route = "get-lab-test-name-data";
    let data = {
      search:
      {
        state_id: this.ngForm.controls['state_id'].value,
        district_id: this.ngForm.controls['district_id'].value,
        // lab_name: this.ngForm.controls['lab_name'].value
      }
    }
    this._serviceSeed.postRequestCreator(route, data).subscribe(data => {
      console.log('data==>', data);
      this.LabData = data.EncryptedResponse.data.rows;
      this.LabDatasecond= this.LabData


      // this.LabData = data.EncryptedResponse.data.rows;
      // this.countData = data.EncryptedResponse.data.count;

      // this.filterPaginateSearch.itemListPageSize = 10;
      // this.filterPaginateSearch.Init(data.EncryptedResponse.data.rows, this, "getPageData");
      // this.initSearchAndPagination();
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
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Delete?",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action'
      }
    }).then(result => {
      if (result.isConfirmed) {
        let data ={
          id:id,
          user_id: this.userId && this.userId.id ?  this.userId.id:''
        }
        this._serviceSeed
          .postRequestCreator("deleteLabtestlistdata", data)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData();
              // this.getLabData();
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
            showCancelButton: false,
            confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  clear() {
    this.isState = false;
    this.ngForm.controls['state_id'].setValue('');
    this.ngForm.controls['district_id'].setValue('');
    this.ngForm.controls['lab_name'].setValue('');
   // this.getPageData();
    this.ngForm.controls['district_id'].disable();
    this.disabledfieldDist=true;
    this.disabledfieldAgency=true;
    this.selected_state='';
    this.selected_district='';
    this.selected_agency=''

    this.ngForm.controls['lab_name'].disable();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    this.initSearchAndPagination();
  }
  search() {
    if ((!this.ngForm.controls["state_id"].value && !this.ngForm.controls["district_id"].value && !this.ngForm.controls["lab_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
  }

  onChangeState() {
    this.ngForm.controls['district_id'].patchValue("");
    this.ngForm.controls['lab_name'].patchValue("");
  }
  onChangeDistrict() {
    this.ngForm.controls['lab_name'].patchValue("");

  }
  onSubmit(formData) {
   
    // this.submitted = true;

    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the All Details correctly.', 'error');
      return;
    }
    if ((!this.ngForm.controls["state_id"].value && !this.ngForm.controls["district_id"].value && !this.ngForm.controls["lab_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {

      // let data = {

      //   state_id: formData.state_id,
      //   district_id: formData.district_id,
      //   lab_name: formData.lab_name
      // }
      // this.filterPaginateSearch.itemListCurrentPage = 1;
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.searchFilterData=true;
      this.getPageData();
    }
  }
  cnClick() {
    document.getElementById('state').click();
  }
  cdClick() {
    document.getElementById('district').click();
  }
  caClick() {
    document.getElementById('agency').click();
  }
  state_select(data){
    this.selected_state = data && data['state_name'] ? data['state_name'] :'';
    this.ngForm.controls['state_id'].setValue(data && data['state_code'] ? data['state_code'] :'')  
    this.ngForm.controls['state_text'].setValue('',{ emitEvent: false })
    this.stateList =this.stateListSecond
  }

  district_select(data){
    this.ngForm.controls['district_text'].setValue('',{ emitEvent: false });
    this.districtList =this.districtListSecond
    this.selected_district = data && data['district_name'] ? data['district_name'] :'';
    this.ngForm.controls['district_id'].setValue(data && data['district_code'] ? data['district_code'] :'')
  }

  agency_select(data){  
    this.LabData =this.LabDatasecond;
    this.ngForm.controls['agency_text'].setValue('',{ emitEvent: false })
    this.selected_agency = data && data.lab_name ? data.lab_name  :'';
    this.ngForm.controls['lab_name'].setValue( data && data.lab_name ? data.lab_name  :'')

  }
}
