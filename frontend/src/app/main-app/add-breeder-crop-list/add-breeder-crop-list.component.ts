import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AddCropSearchComponent } from 'src/app/common/add-crop-search/add-crop-search.component';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import Swal from 'sweetalert2';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
@Component({
  selector: 'app-add-breeder-crop-list',
  templateUrl: './add-breeder-crop-list.component.html',
  styleUrls: ['./add-breeder-crop-list.component.css']
})
export class AddBreederCropListComponent extends ngbDropdownEvents implements OnInit {

  @ViewChild(AddCropSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  disablefield: boolean = false;
  deletedId: any;
  ngForm!: FormGroup;
  croupGroup: any;
  selectCrop: any;
  crop_names
  croupGroupList: any = [];
  datas: any = [];
  item: any;
  response: any = [];
  response_crop_group: any = [];
  selectCrop_group: any;
  fieldsList: SectionFieldType[];
  formGroup: FormGroup<any>;
  crop_name_list: any;
  seasonList: any;
  currentUser: any = { id: 10, name: "Hello User" };
  yearofIndent: any;
  deletebtn=false;
  crop_name_list_second: any;
  disabledfieldcropName=true;
  // 

  constructor(private masterService: MasterService, private breederService: BreederService, private restService: RestService, private router: Router, private fb: FormBuilder, private service: SeedServiceService) {
    super();
    if (this.router.url.includes('view')) {
      this.disablefield = true;
    }
    if (this.router.url.includes('edit')) {
      this.disablefield = false;
    }
    this.createEnrollForm();
  }

  ngOnInit(): void {
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    // console.log('userData=======',userData);
    this.currentUser.id = userData.id ;
    this.currentUser.name = userData.name ;

    console.log(' this.currentUser.id',this.currentUser.id);
    // localStorage.setItem('logined_user', "Breeder");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.getPageData();
    this.initProcess();
    this.getCroupCroupList();
    this.ngForm.controls["crop_name"].disable();

    // this.delete(this.deletedId)
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: new FormControl(''),
      crop_name: new FormControl('',),
      
      year_of_indent: new FormControl(''),
      season: new FormControl(''),
      crop_name_text: new FormControl(''),

    });
    this.ngForm.controls["year_of_indent"].valueChanges.subscribe(value => {
      if (value) {
        this.getSeasonList(value)
        // this.ngForm.controls["crop_name"].enable();
      }

    })
    this.ngForm.controls["season"].valueChanges.subscribe(value => {
      if (value) {
        this.getCropNameList(value)
        this.disabledfieldcropName=false;
        this.ngForm.controls["crop_name"].enable();
      }

    })
    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue &&  this.crop_name_list &&  this.crop_name_list.length) {
        console.log(newValue)
        this.crop_name_list =this.crop_name_list_second
        let response= this.crop_name_list.filter(x=>x['m_crop.crop_name'].toLowerCase().startsWith(newValue.toLowerCase()))
      
        this.crop_name_list=response
      
       
      }
      else{
      
        this.getCropNameList(this.ngForm.controls['crop_group'].value)
      }
    });
  }

  initProcess() {
    // this.getCropName();
 
    this.getYearofIndent();
  }
  

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    console.log(' this.currentUser.id', this.currentUser);
    this.breederService
      .postRequestCreator("breeder-crop-new-list", null, {
        // get-breeder-crop-data
        page: loadPageNumberData,
        // pageSize: this.filterPaginateSearch.itemListPageSize || 5,
        pageSize:  50,
        search: {
      
            year_of_indent: this.ngForm.controls['year_of_indent'].value,
            season: this.ngForm.controls['season'].value,
            crop_code: (this.ngForm.controls['crop_name'].value),
         
        },
        id: this.currentUser.id
      })
      .subscribe((apiResponse: any) => {
        console.log(apiResponse)
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          this.allData = apiResponse.EncryptedResponse.data.data;


          if (this.allData === undefined) {
            this.allData = [];
          }
          console.log(this.filterPaginateSearch.itemList,'this.filterPaginateSearch.itemList',this.filterPaginateSearch.itemListCurrentPage)
          if(this.deletebtn && this.allData.length<1 && (this.filterPaginateSearch.itemListCurrentPage)>1){
            this.filterPaginateSearch.itemListCurrentPage= this.filterPaginateSearch.itemListCurrentPage-1
            this.getPageData(this.filterPaginateSearch.itemListCurrentPage)

          }
          this.initSearchAndPagination();
      let  res =    this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          console.log('apiResponse.EncryptedResponse.data.count',  this.allData)
          // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count);
          // this.initSearchAndPagination();
        }
      });
  }
  crop_name(item: any) {
    this.selectCrop_group = item.crop_name;
    this.ngForm.controls['crop_name'].setValue(item.id)
  }
  cropGroup(item: any) {

    this.selectCrop = item.m_crop.crop_group;
    this.ngForm.controls['crop_group'].setValue(item.m_crop.group_code)
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
    console.log('this.paginationUiComponent.Init(this.filterPaginateSearch);',this.filterPaginateSearch)
  }

  delete(id: number, cropName: string) {
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
        this.breederService
          .postRequestCreator("delete-breeder-crop-details/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
                this.deletebtn=true;
              

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


  getCroupCroupList() {
    const route = "get-breeder-crop-data-filter";
    const result = this.breederService.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }

  

  clear() {
  
    this.ngForm.controls["year_of_indent"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls["season"].setValue("");
    this.disabledfieldcropName=true;
    this.crop_names=''
    this.getPageData();

    // this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.initSearchAndPagination()
  }
  search() {
    if (((!this.ngForm.controls["season"].value) && ((!this.ngForm.controls["year_of_indent"].value) && (!this.ngForm.controls["crop_name"].value)))) {
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
      this.filterPaginateSearch.itemListPageSize = 50;

      // this.filterPaginateSearch.Init(response, this, "getPageData", undefined, response.EncryptedResponse.data.count, true);
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.getPageData()
    }
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cnclick() {
    document.getElementById('crop_name').click();
  }
  
  getYearofIndent(){
    const route= 'breeder-crop-new-year';
    const param={
      id: this.currentUser.id
    }
    this.breederService.postRequestCreator(route,null,param).subscribe((data)=>{
      // console.log(data,'data')
      this.yearofIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data:"";
      this.yearofIndent =  this.yearofIndent.sort((a, b) => b.year - a.year)

    })
  }
  getSeasonList(newValue){
    const route= 'breeder-crop-new-season';
    const param={
      search:{
        year:newValue
      },
      id: this.currentUser.id
    }
    this.breederService.postRequestCreator(route,null,param).subscribe((data)=>{
      // console.log(data,'data')
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data:"";
      // this.yearofIndent =  this.yearofIndent.sort((a, b) => b.year - a.year)
    })
  }

  getCropNameList(newValue){
    const route= 'breeder-crop-new-crop-name';
    const param={
      search:{
        year:this.ngForm.controls['year_of_indent'].value,
        season:newValue
      },
      id: this.currentUser.id
    }
    this.breederService.postRequestCreator(route,null,param).subscribe((data)=>{
      // console.log(data,'data')
      this.crop_name_list = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data:"";
      this.crop_name_list_second= this.crop_name_list
      // this.yearofIndent =  this.yearofIndent.sort((a, b) => b.year - a.year)
    })
  }


  getFinancialYear(year){
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  cropNames(data){

    this.crop_names= data && data['m_crop.crop_name'] ? data['m_crop.crop_name'] :'';
    this.ngForm.controls['crop_name_text'].setValue('')
    this.ngForm.controls['crop_name'].setValue(data && data['m_crop.crop_code'] ? data['m_crop.crop_code'] :'')

  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
}