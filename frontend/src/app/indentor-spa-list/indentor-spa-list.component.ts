import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indentor-spa-list',
  templateUrl: './indentor-spa-list.component.html',
  styleUrls: ['./indentor-spa-list.component.css']
})
export class IndentorSpaListComponent implements OnInit {
  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  submissionid = this.route.snapshot.paramMap.get('submissionid'); response: any;
  selectCrop: any;
  ngForm!: FormGroup;
  agency_name: any;
  disabledfield: boolean = true;
  cancelbtn!: boolean;
  isView: boolean = false;
  stateList: any;
  submitted: boolean = false;
  agencyName: any;
  selected_agency;
  noData: boolean = false;
  agencyNameList: any;
  resultAgencyData: any;
  searchFilterData=false;
  userId: any;
  districtList: any;
  selected_state;
  stateListSecond: any;
  selected_district;
  disabledfieldList=true;
  disabledfieldAgency=true
  districtListSecond: any;
  resultAgencyDataSecond: any;
  state_id: any;
  constructor(
    private restService: RestService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private route: ActivatedRoute,
    private router: Router,
    private service: SeedServiceService) {
    this.createEnrollForm();

  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      state_id: new FormControl(''),
      agency_id: new FormControl(''),
      district_id: new FormControl(''),
      state_text: new FormControl(''),
      district_text: new FormControl(''),
      agency_text: new FormControl(''),
    });

    this.ngForm.controls["state_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['district_id'].enable();
        this.ngForm.controls['district_id'].patchValue('');
        this.disabledfield=false;

        this.getdistrictList(newValue)
        this.searchFilterData=false
      }
    })
    this.ngForm.controls["district_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['agency_id'].enable();
        this.ngForm.controls['agency_id'].patchValue('');
        this.disabledfieldAgency=false;
        this.getAgencyNameList(newValue)
        this.searchFilterData=false
      }
    })
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.stateList =this.stateListSecond
        let response= this.stateList.filter(x=>x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))
      
        this.stateList=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getStateList()
       
      }
    });
   
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.districtList =this.districtListSecond
        let response= this.districtList.filter(x=>x.district_name.toLowerCase().startsWith(newValue.toLowerCase()))
      
        this.districtList=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getdistrictList(this.ngForm.controls['state_id'].value)
       
      }
    });
    this.ngForm.controls['agency_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.resultAgencyData =this.resultAgencyDataSecond
        let response= this.resultAgencyData.filter(x=>x.agency_name.toLowerCase().startsWith(newValue.toLowerCase()))
      
        this.resultAgencyData=response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)
       
      }
      else{
        this.getAgencyNameList(this.ngForm.controls['district_id'].value)
       
      }
    });

  }



  ngOnInit(): void {
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   // location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    //get user id from localstorage
    let user = localStorage.getItem('BHTCurrentUser')
    console.log('userDatat',);
    this.userId = JSON.parse(user)
    this.getAgencyData()

    this.submissionid = this.route.snapshot.paramMap.get('submissionid');
   
    this.getStateList();
    this.getAgencyName();

    this.ngForm.controls['agency_id'].disable();
    this.ngForm.controls['district_id'].disable();
  }

  async getStateList() {
    this.service
      .postRequestCreator("getIndentorStateSppDetails")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          this.stateList = this.stateList.filter((arr, index, self) =>
    index === self.findIndex((t) => (t['m_state.state_name'] === arr['m_state.state_name'] )))
    this.stateListSecond =this.stateList
        }
      });

  }
  async getdistrictList(newValue) {
    const param={
      search:{
        state: this.ngForm.controls["state_id"].value
      }
    }
    this.service
      .postRequestCreator("getIndentorDistrictSppList",null,param)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.districtList = apiResponse.EncryptedResponse.data.rows;
    //       this.districtList = this.districtList.filter((arr, index, self) =>
    // index === self.findIndex((t) => (t['m_district.district_name'] === arr['m_district.district_name'] )))
    this.districtListSecond =  this.districtList

        }
      });

  }
  async getAgencyName() {
    this.masterService
      .postRequestCreator("view-indentor", null, null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.agencyName = apiResponse.EncryptedResponse.data;
        }
      });

  }

  async getAgencyNameList(newValue) {

    if (newValue) {
      const searchFilters = {
        "search": {
          "state_id":this.ngForm.controls['state_id'].value,
          "district_id": newValue,
          
          "created_by": this.userId.id,
         

        }
      };
      this.service
        .postRequestCreator("getAgencyDetailsIndentorSppName", null, searchFilters)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.agencyNameList = apiResponse.EncryptedResponse.data.rows;
            console.log(this.agencyNameList);

            for (let i = 0; i < this.agencyNameList.length; i++) {
              if (!(this.agencyName && this.agencyNameList && this.agencyNameList[i].user ? this.agencyNameList[i].user : ''))
                delete this.agencyNameList[i]
            }
            const results = this.agencyNameList.filter(element => {
              if (Object.keys(element).length !== 0) {
                return true;
              }
              return false;
            });
            const agencyData = [];
            for (let i = 0; i < results.length; i++) {
              console.log(results[i].user.user_type == 'SPA');
              if (!(results && results[i] && results[i].user && results[i] && results[i].user.user_type == 'SPA')) {
                delete results[i]
              }
            }
            this.resultAgencyData = results.filter(element => {
              if (Object.keys(element).length !== 0) {
                return true;
              }

              return false;
            });

            console.log('agencyData:=>', this.resultAgencyData);
            this.resultAgencyData= this.resultAgencyData.sort((a, b) => a.agency_name.localeCompare(b.agency_name))
            // console.log(results,'this.agencyNameList');
            this.resultAgencyData = this.resultAgencyData.filter((arr, index, self) =>
    index === self.findIndex((t) => (t.agency_name === arr.agency_name )))
    this.resultAgencyDataSecond=this.resultAgencyData




          }
        });
    }

  }


  cropGroup(item: any) {
    this.selectCrop = item.name;
    this.ngForm.controls['crop_group'].setValue(this.selectCrop.name)
  }

  // if((!this.ngForm.controls["state_id"].value &&  !this.ngForm.controls["agency_id"].value)){
  //   Swal.fire({
  //     toast: false,
  //     icon: "error",
  //     title: "Please Select Something ",
  //     position: "center",
  //     showConfirmButton: false,
  //     timer:3000,
  //     showCancelButton: false,

  //     customClass: {
  //       title: 'list-action-confirmation-title',
  //       actions: 'list-confirmation-action'
  //     }
  //   })

  //   return ;
  // }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
  
    this.masterService
    .postRequestCreator("addSpaIndentorList", null, {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      pageSize: 50,
      search: {
        // "created_by": this.userId.id,
        "state_id":(this.ngForm.controls["state_id"].value),
        "district_id":this.ngForm.controls["district_id"].value,
        "agency_id":this.ngForm.controls["agency_id"].value,
        
      }
    })
    .subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : "";
        console.log(allData, 'allData');


        if (allData === undefined) {
          allData = [];
        }
        if (allData.count == 0) {
          this.noData = true;
        }
        this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });
   
  //  else{
  //   this.masterService
  //   .postRequestCreator("addSpaIndentorList", null, {
  //     page: loadPageNumberData,
  //     // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
  //     pageSize: 10,
  //     search: searchData
  //   })
  //   .subscribe((apiResponse: any) => {
  //     if (apiResponse !== undefined
  //       && apiResponse.EncryptedResponse !== undefined
  //       && apiResponse.EncryptedResponse.status_code == 200) {
  //         this.filterPaginateSearch.itemListPageSize = 10;
  //       let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : "";
  //       console.log(allData, 'allData');


  //       if (allData === undefined) {
  //         allData = [];
  //       }
  //       if (allData.count == 0) {
  //         this.noData = true;
  //       }
  //       this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
  //       this.initSearchAndPagination();
  //     }
  //   });
  //  }
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

  delete(id: number, agency: string) {
    if (id) {
      let data = {
        id: id,
        user_id: this.userId && this.userId.id ? this.userId.id : '',
      }
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
          this.masterService.postRequestCreator("deleteSPPIndentorAgencyData", null, data).subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {

              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
          });
        }
      })

    }


  }
  search() {


  }

  clear() {
   
    this.ngForm.controls["agency_id"].setValue("");
    this.ngForm.controls["district_id"].setValue("");
    this.disabledfieldList=true;
    // this.resultAgencyData=[];
    this.ngForm.controls['district_id'].disable();
    this.ngForm.controls['agency_id'].disable();
    this.selected_agency='';
    this.selected_district='';
   
    this.disabledfieldAgency=true;
    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    this.initSearchAndPagination();
  }

  agency(item: any) {
    this.agency_name = item.name
  }

  onSubmit(formData) {
    this.submitted = true;

    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the All Details Correctly', 'error');
      return;
    }
    if ((!this.ngForm.controls["district_id"].value && !this.ngForm.controls["agency_id"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something .</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {

      let data = {
        "state_id": formData.state_id,
        "agency_id": formData.agency_id,
      }
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.searchFilterData=true;
      this.getPageData();
    }
  }
  state_select(data){

    console.log(data)
    this.selected_state = data && data['m_state.state_name'] ? data['m_state.state_name'] :'';
    this.ngForm.controls['state_id'].setValue(data && data['m_state.state_code'] ? data['m_state.state_code'] :'')

    this.ngForm.controls['state_text'].setValue('')
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
  district_select(data){
    console.log('daata====>',data)
    this.selected_district = data && data['m_district.district_name'] ? data['m_district.district_name'] :'';
    this.ngForm.controls['district_id'].setValue(data && data['m_district.district_code'] ? data['m_district.district_code'] :'')
  
this.ngForm.controls['district_text'].setValue('')
  }
  agency_select(data){
    console.log(data)
    this.selected_agency = data && data.agency_name ? data.agency_name  :'';
    this.ngForm.controls['agency_id'].setValue( data && data.id ? data.id  :'')

    this.ngForm.controls['agency_text'].setValue('')
  }
  getAgencyData(){
    const userData = localStorage.getItem('BHTCurrentUser')
    const data = JSON.parse(userData)
    console.log(data,'<=========data')
    
    const param={
      search:{
        agency_id :data.agency_id

      }
    }
    this.masterService.postRequestCreator('getAgencyUserIndentorDataById/'+ data.agency_id ,null,param).subscribe(data=>{
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data :''
      this.selected_state = res && res.m_state  && res.m_state.state_name ? res.m_state.state_name :'';        
      this.ngForm.controls['state_id'].setValue(res && res.m_state  && res.m_state.state_code ? res.m_state.state_code :'')
      this.state_id=res && res.m_state  && res.m_state.state_code ? res.m_state.state_code :''
      this.getPageData();
      // this.getdistrictList(res && res.m_state  && res.m_state.state_code ? res.m_state.state_code :'')
    })
  }
}
