

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-submission-for-indents-of-breeder-seed-report',
  templateUrl: './submission-for-indents-of-breeder-seed-report.component.html',
  styleUrls: ['./submission-for-indents-of-breeder-seed-report.component.css']
})
export class SubmissionForIndentsOfBreederSeedReportComponent implements OnInit {

  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  yearOfIndent: any = [];
  cropName: any = [];
  todayDate = new Date();
  ngForm!: FormGroup;
  submitted: boolean = false;
  cropVarietyData: any;
  crop_variety_data: any;
  seasonList: any;
  dataSeason: any=[];
  userId: any;
  fileName = 'submission-for-indents-of-breeder-seed-report.xlsx';
  exportdata: any[];
  constructor(private restService: RestService,
    private indenterService: IndenterService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private _service: SeedDivisionService,
    private router: Router,
  ) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_code: new FormControl(''),
      year: new FormControl(''),
      variety_name: new FormControl(''),
      season: new FormControl(''),
    });
    this.ngForm.controls['crop_code'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getCropVarietyData(newValue);
        this.ngForm.controls['variety_name'].enable();
        this.ngForm.controls['variety_name'].setValue('');
      }
    });
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.getCropVarietyData(newValue);
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['season'].setValue('');
        this.ngForm.controls['crop_code'].disable();
        this.ngForm.controls['crop_code'].setValue('');
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['variety_name'].disable();
        this.getSeasonIndentList(newValue)
      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.getCropVarietyData(newValue);
        // 
        this.ngForm.controls['crop_code'].setValue('');
        this.ngForm.controls['crop_code'].enable();
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['variety_name'].disable();
        this.getCropNameIndentList(newValue)
      }
      // this.getCropNameIndentList(newValue)
      
    });
  }

  ngOnInit(): void {

    
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.userId = currentUser.id ;
    this.getYearIndentList();
    this.runExcelApi();
    // if (!currentUser) {
    //   this.router.navigate(['/web-login']);
    // }
    this.getSeasonData();
    // localStorage.setItem('logined_user', "Indenter");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.filterPaginateSearch.itemListPageSize = 50;
    this.getPageData();
    // this.getCropName();
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_code'].disable();
    this.ngForm.controls['variety_name'].disable();

    this.createYearRange(1990, this.todayDate.getFullYear());
  }

  createYearRange(start: number, end: number): void {
    // if (start <= end) {
    // this.yearOfIndent.push({ name: start + "", value: start });
    this.yearOfIndent.sort((a, b) => b.value - a.value);
    // this.createYearRange(start + 1, end);
    // }
  }
  getSeasonData() {
    const route = "get-season-details";
    const result = this._service.postRequestCreator(route, null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      console.log('season data',this.seasonList);
    })
  }


  clear() {
    this.ngForm.controls["year"].setValue("");
    this.ngForm.controls["crop_code"].setValue("");
    this.ngForm.controls["season"].setValue("");
    this.ngForm.controls["variety_name"].setValue("");
    this.ngForm.controls["crop_code"].disable();
    this.ngForm.controls["variety_name"].disable();

    this.getPageData();
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.indenterService
      .postRequestCreator("get-breeder-seeds-submission-list", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          "crop_code":this.ngForm.controls['crop_code'].value ,
          season:this.ngForm.controls['season'].value,
          year:this.ngForm.controls["year"].value,
          variety_name:this.ngForm.controls["variety_name"].value,
          id:this.userId
        }
      })
      .subscribe((apiResponse: any) => {
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListPageSize = 50;
          let allData = apiResponse.EncryptedResponse.data.rows;
          if (allData === undefined) {
            allData = [];
          }
          if (allData.count > 0 && !allData &&!allData[0]["variety"]) {
            // until includes are built
            for (let index = 0; index < allData.count; index++) {
              const element = allData[index];
              element["variety"] = {
                name: "Variety-" + element.variety_id,
                value: element.variety_id
              }
              element["year"] = {
                name: element.year,
                value: element.year
              }
              element["crop"] = {
                name: element.crop_code,
                value: element.crop_code,
                cropType: "Crop Type - " + index
              }
            }
            //-------------------
          }
          // console.log("allDataallData", allData.rows)
          this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
        }
      });
  }

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
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
        this.indenterService
          .postRequestCreator("delete-breeder-seeds-submission/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  onSubmit(formData) {
    this.submitted = true;
    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
      return;
    }
    let data = {
      "year": formData.year,
      "season":formData.season,
      "crop_code": formData.crop_code,
      "variety_name": formData.variety_name,
    }
    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.initSearchAndPagination();
    this.getPageData(1, data);
  }

  async getCropVarietyData(newValue) {
    const searchFilters = {
      "search": {
        "crop_code": newValue,
        season:this.ngForm.controls['season'].value,
        year:this.ngForm.controls["year"].value
      }
    };
    this.indenterService
      .postRequestCreator("indetor-variety-name-list",  null,searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropVarietyData = apiResponse.EncryptedResponse.data.rows;
    //       var clean = this.cropVarietyData.filter((arr, index, self) =>
    // index === self.findIndex((t) => (t.save === arr.save && t.State === arr.State)))

        
         this.crop_variety_data= this.cropVarietyData.sort((a, b) => {
            // data.m_crop_variety.variety_name
            return  a.m_crop_variety.variety_name.localeCompare(b.m_crop_variety.variety_name);
          }
          );
       console.log(this.crop_variety_data);
       
          
        }
      });

  }
  getYearIndentList(){
    this.indenterService
    .postRequestCreator("indetor-year-list")
    .subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
          let yers= apiResponse.EncryptedResponse.data.rows
          // this.yearOfIndent= 
      for(let i=0 ; i<yers.length;i++){
        this.yearOfIndent.push({
          name:yers[i].year + '-' +( (parseInt(yers[i].year )+1)-2000),
          value:yers[i].year
  
         })
      }
      //  console.log('this.yearOfInden',this.yearOfIndent);
    this.yearOfIndent=  this.yearOfIndent.sort((a, b) => b.value - a.value);
       
    
      }
    });

  }
  getSeasonIndentList(newValue){
    this.dataSeason = []
    const param={
      search:{
        user_id:this.userId,
        year:newValue
      }
    }
    this.indenterService
    .postRequestCreator("indetor-season-list",null,param)
    .subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
          let season= apiResponse.EncryptedResponse.data.rows
         
          season.forEach((x:any,index:number)=>{
            x['name']= x && x.season =='R' ?'Rabi':'Kharif',
            x['season']=x.season
            this.dataSeason.push(x)
          })
        

       
    
      }
    });

  }
  getCropNameIndentList(newValue){
    // this.dataSeason = []
    const param={
      search:{

        season:newValue,
        year:this.ngForm.controls["year"].value
      }
    }
    this.indenterService
    .postRequestCreator("indetor-crop-name-list",null,param)
    .subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
          let response= apiResponse.EncryptedResponse.data.rows
          let datas;
          for (let index = 0; index < response.length; index++) {
        if (response[index].m_crop != null) {
          const result = response.filter((thing, index, self) =>
            thing.m_crop != null
          )
          datas = result;
        }
      }
         for (let index = 0; index < datas.length; index++) {

        let abc = datas.filter(x => x.m_crop != null);
        const resultData = abc.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.m_crop.crop_name === thing.m_crop.crop_name
          ))
        )
        // console.log(resultData)
        this.cropName=resultData;
          }
          this.cropName = this.cropName.sort((a, b) => a.m_crop.crop_name.localeCompare(b.m_crop.crop_name))
      //   datasValue = resultData;
      //   sortcropName = datasValue.sort((a, b) => a.m_crop.crop_name.localeCompare(b.m_crop.crop_name))


          // season.forEach((x:any,index:number)=>{
          //   x['name']= x && x.season =='R' ?'Rabi':'Kharif',
          //   x['season']=x.season
          //   this.dataSeason.push(x)
          // })
        

       
    
      }
    });

  }


  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  runExcelApi(){
    this.indenterService
    .postRequestCreator("get-breeder-seeds-submission-list", null, {
      search: {
        "crop_code":this.ngForm.controls['crop_code'].value ,
        season:this.ngForm.controls['season'].value,
        year:this.ngForm.controls["year"].value,
        variety_name:this.ngForm.controls["variety_name"].value,
        id:this.userId
      }
    })
    .subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 10;
         this.exportdata = apiResponse.EncryptedResponse.data.rows;
        if (this.exportdata === undefined) {
          this.exportdata = [];
        }
        
      }
    });

  }

  exportexcel(): void{
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    // console.log('elementelementelementelement',element);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}

