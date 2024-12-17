import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master/master.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-bsp-five-b-report',
  templateUrl: './bsp-five-b-report.component.html',
  styleUrls: ['./bsp-five-b-report.component.css']
})

export class BspFiveBReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;
  response_crop_group: any = [];
  data: any;
  data1: any;
  custom_array: any[];
  finalData: any[];
  fileName = 'BSP V (b) xlsx Report.xlsx';
  yearOfIndent: any;
  year: any;
  breeder: any;
  crop: any;
  variety: any;
  bspc: any;
  breederList: any = [];
  cropNameList: any = [];
  varietyNameList: any = [];
  bspcList: any = [];
  breeder_id: any;
  crop_id: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  breederListData: any;
  cropTypeData: any;
  seasonData: any;
  user_type: any;
  season: string;
  CropType: string;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  unitValue: string;
  constructor(private breederService: BreederService, private masterService: MasterService, private fb: FormBuilder, private service: SeedServiceService, private router: Router) {
    this.createEnrollForm();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      breeder: ['',],
      crop: ['',],
      year: ['',],
      variety: ['',],
      bspc: ['',],
      season: ['',],
      crop_type: ['',]
    });

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['breeder'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();

    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop'].setValue('')
        this.ngForm.controls['variety'].setValue('')
        this.getSeasonDataList();
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_type'].enable();
        this.ngForm.controls['crop'].setValue('')
        this.ngForm.controls['variety'].setValue('')
        this.getCropTypeDataList();
      }
    });

    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['breeder'].enable();
        this.ngForm.controls['crop'].enable();
        this.ngForm.controls['crop'].setValue('')
        this.ngForm.controls['variety'].setValue('')
        this.getCropNameList(newValue);
        this.breederProductionData(newValue);
      }
    });

    this.ngForm.controls['breeder'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop'].enable();
        this.getCropNameList(newValue);
      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['variety'].enable();
        this.ngForm.controls['variety'].setValue('')
        this.getVarietyNameList(newValue);
      }
    });
  }
  ngOnInit(): void {
    this.getYearDataList();
    // this.getMasterBspReportData();
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.user_type = data.user_type

    this.dropdownSettings = {
      idField: 'crop_code',
      textField: 'crop_name',
      allowSearchFilter: true
      // enableCheckAll: false,
      // limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'variety_id',
      textField: 'variety_name',
      allowSearchFilter: true
      // enableCheckAll: false,
      // limitSelection: -1,
    };





  }

  getYearDataList() {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    const user_type = data.user_type
    const route = "getbspfivebYearofIndent";
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        user_type: user_type,
        type: 'report_icar',

      }
    }).subscribe((data: any) => {
      this.yearOfIndent = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
    })
  }

  getSeasonDataList() {
    const route = "get-bsp-five-b-filter-data";
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls['year'].value,
        user_type: this.user_type,
        type: 'report_icar'
      }
    }).subscribe((data: any) => {
      this.seasonData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
    })
  }

  getCropTypeDataList() {
    const route = "get-bsp-5b-filter-crop_type";
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        user_type: this.user_type,
        type: 'report_icar'
      }
    }).subscribe((data: any) => {
      this.cropTypeData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data ? data.EncryptedResponse.data : [];
    })
  }


  breederProductionData(newValue) {
    let route = "get-bsp-five-b-filter-data";
    this.masterService.postRequestCreator(route, null, {
      search: {
        crop_type: newValue,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value
      }
    }).subscribe(res => {
      this.breederListData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : ''
    })
  }

  async getCropNameList(newValue) {
    this.masterService
      .postRequestCreator("get-bsp-5b-filter-crop-name", null, {
        search: {
          breeder_id: newValue,
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season'].value,
          crop_type: this.ngForm.controls['crop_type'].value,
          user_type: this.user_type,
          type: 'report_icar'
        }
      })
      .subscribe((res: any) => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code && res.EncryptedResponse.status_code == 200) {
          this.cropNameList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
        }
      });
  }

  async getVarietyNameList(newValue) {
    let route = "get-bsp-5b-filter-variety";
    let cropData1 = [];
    if(this.ngForm.controls['crop'].value && this.ngForm.controls['crop'].value !== undefined && this.ngForm.controls['crop'].value.length > 0){
      let crop = this.ngForm.controls['crop'].value;
      crop.forEach(element => {
        if(element && element.crop_code){
          cropData1.push(element.crop_code);
        }
      });
      if (crop) {
        let cropData = this.cropNameList.filter(item => cropData1.includes(item.crop_code));
        this.crop = cropData && cropData[0] && cropData[0].crop_name;
      }
    }
    this.masterService.postRequestCreator(route, null, {
      search: {
        crop_code: cropData1 ? cropData1 :[],
        breeder_id: this.ngForm.controls['breeder'].value,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        user_type: this.user_type,
        type: 'report_icar'
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse.EncryptedResponse.status_code == 200) {
        this.varietyNameList = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data ? apiResponse.EncryptedResponse.data : [];
      }
    });
  }

  submit() {
    if (
      !this.ngForm.controls['year'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    else if (
      !this.ngForm.controls['season'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    else if (
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    else {
      this.isSearch = true;
      this.year = this.ngForm.controls['year'].value;
      let season = this.ngForm.controls['season'].value;
      if (season == "K") {
        this.season = "Kharif";
      } else {
        this.season = "Rabi";
      }
      // for crop 
      if(this.ngForm.controls['crop'].value && this.ngForm.controls['crop'].value !== undefined && this.ngForm.controls['crop'].value.length > 0){
        let crop = this.ngForm.controls['crop'].value;
        let cropData1 = [];
        crop.forEach(element => {
          if(element && element.crop_code){
            cropData1.push(element.crop_code);
          }
        });
        if (crop) {
          let cropData = this.cropNameList.filter(item => cropData1.includes(item.crop_code));
          this.crop = cropData && cropData[0] && cropData[0].crop_name;
        }
      }
      
      let crop_type = this.ngForm.controls['crop_type'].value;
      if (crop_type == "A") {
        this.CropType = "Agriculture";
        this.unitValue = "Quintal"
      } else {
        this.CropType = "Horticulture";
        this.unitValue = "Kilogram"
      }

      //for variety 
      if(this.ngForm.controls['variety'].value && this.ngForm.controls['variety'].value !== undefined && this.ngForm.controls['variety'].value.length > 0){
        let varietyId = [];
        this.ngForm.controls['variety'].value.forEach(ele=>{
          varietyId.push(ele.variety_id);
        })

        if (varietyId) {
          let varietyData = this.varietyNameList.filter(item => varietyId.includes(item.variety_id))
          this.variety = varietyData && varietyData[0] && varietyData[0].variety_name;
        }
      }
      
      const searchData = {
        year: this.year,
        breeder: this.breeder,
        crop: this.crop,
        variety: this.variety,
        bspc: this.bspc
      }

      this.getMasterBspReportData(1, searchData);
    }
  }

  clear() {
    this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['breeder'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.ngForm.controls['variety'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_type'].patchValue("");

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['breeder'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();
    
    this.year = "";
    this.season = "";
    this.CropType = "";
    this.crop = "";
    this.variety = "";
    this.unitValue = "";
    this.data1=[];
    this.varietyNameList=[];
    this.cropNameList=[];
    // this.getMasterBspReportData();
  }


  async getMasterBspReportData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    const route = 'get-bsp-5b-reports';
    let cropCodeValue = [];
    let varietyCodeValue = [];
    if(this.ngForm.controls['crop'].value && this.ngForm.controls['crop'].value !== undefined && this.ngForm.controls['crop'].value.length >0){
      this.ngForm.controls['crop'].value.forEach(ele=>{
        cropCodeValue.push(ele.crop_code);
      })
    }

    if(this.ngForm.controls['variety'].value && this.ngForm.controls['variety'].value !== undefined && this.ngForm.controls['variety'].value.length >0){
      this.ngForm.controls['variety'].value.forEach(ele=>{
        varietyCodeValue.push(ele.variety_id);
        console.log('varietyCodeValue=====',varietyCodeValue)
      })
    }
    const result = await this.masterService.postRequestCreator(route, null, {
      reportType: 'five-b',
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_type": this.ngForm.controls['crop_type'].value,
        "crop_code":cropCodeValue ? cropCodeValue :[] ,
        "variety_id": varietyCodeValue ? varietyCodeValue :[]
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined &&
        apiResponse.EncryptedResponse !== undefined &&
        apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data.data;
        this.data1 = apiResponse.EncryptedResponse.data;
        for(let item of this.data1){
          let varietyCount=0
          let sum=0
          for(let data of item.variety){
            // sum+=data.bspc.length
          varietyCount+=data.bspc.length
            item.varietyCount =varietyCount
            data.bspcCount= data.bspc.length

            // for(let 

          }
        }
        for(let item of this.data1){
          
          for(let data of item.variety){
          data.bspc=data.bspc.map(item=>({
            ...item,
            diff:parseFloat(item.productionData) - parseFloat(item.total_lifted)
          }))

            // for(let 

          }
        }

console.log(this.data1)
        // for (const dataKey in this.data1) {

        //   this.data1[dataKey]['variety_name'] = this.data1[dataKey]['m_crop_variety.variety_name'];
        //   this.data1[dataKey]['agency_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
        //   this.data1[dataKey]['indent_quantity'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
        //   this.data1[dataKey]['available_nucleus_seeds'] = this.data1[dataKey]['nucleus_seed_availability.quantity'];
        //   this.data1[dataKey]['contact_person_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
        //   this.data1[dataKey]['contact_person_designation'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
        //   this.data1[dataKey]['indent_quantity'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
        //   this.data1[dataKey]['actual_seed_production'] = this.data1[dataKey]['bsp_5_a.bsp_4.actual_seed_production'];
        //   this.data1[dataKey]['quantity'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.allocation_to_indentor_for_lifting_breederseeds.quantity'];
        //   this.data1[dataKey]['allocated_name'] = this.data1[dataKey]['m_crop_variety.indent_of_breederseed.user.name'];

        //   delete this.data1[dataKey]['m_crop_variety.variety_name'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.agency_name'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
        //   delete this.data1[dataKey]['nucleus_seed_availability.quantity'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.id'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.id'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_name'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.agency_detail.co_per_desig'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.indent_quantity'];
        //   delete this.data1[dataKey]['bsp_5_a.bsp_4.actual_seed_production'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.allocation_to_indentor_for_lifting_breederseeds.quantity'];
        //   delete this.data1[dataKey]['m_crop_variety.indent_of_breederseed.user.name'];
        // }
      }

    });
  }

  freeze() {
    const searchFilters = {
      "search": {
        "id": this.tableId
      }
    };
    const route = "freeze-indent-breeder-seed-data";
    this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code &&
        apiResponse.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {

          this.router.navigate(['/bsp-five-b-report']);
        })
      } else {

        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }

    });
  }

  getCroupCroupList() {
    const route = "crop-group";
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }
  initSearchAndPagination() {
    this.paginationUiComponent.Init(this.filterPaginateSearch);
    if (this.paginationUiComponent === undefined) {


      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
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

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'bsp-five-b-report';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        dpi: 192,
        scale: 4,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a3',
        orientation: 'landscape'
      }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  getBreederList() {
    const route = "get-breeder-name-list";

    const result = this.masterService.postRequestCreator(route, null, {
      // search: {
      //   type: 'bsp-one',
      //   year: newValue
      // }
    }).subscribe((data: any) => {
      this.breederList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
    })
  }

  async getBspcList(breeder_id) {
    const route = "get-bspc-list";
    const result = await this.masterService.postRequestCreator(route, null, {
      breeder_id: breeder_id
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined && apiResponse.EncryptedResponse.status_code == 200) {
        this.bspcList = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : [];
        if (!breeder_id) {
          this.bspcList = [];
        }
      }
    });
  }
  getVarietyfrommlist(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.variety_name){
        temp.push(obj.variety_name)
      }
    })
    
    return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();
   
  }
  getCropNameLitst(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name)
      }
    })

    return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();
   
  }
  getCropNameLitstSecond(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name)
      }
    })

    return temp;
   
  }
  parseFloat(item){
    return item ?  parseFloat(item):0
  }
}
