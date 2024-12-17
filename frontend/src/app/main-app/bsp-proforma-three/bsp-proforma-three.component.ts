import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';

@Component({
  selector: 'app-bsp-proforma-three',
  templateUrl: './bsp-proforma-three.component.html',
  styleUrls: ['./bsp-proforma-three.component.css']
})
export class BspProformaThreeComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData=[]

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData=[]
  allData: any;
  yearOfIndent =[
    {
      'year':'2023-2024',
      'value':'2023'
    },
    {
      'year':'2022-2023',
      'value':'2022'
    },
    {
      'year':'2021-2022',
      'value':'2021'
    }
  ]
  seasonlist=[
    {
      season:'Kharif',
      season_code:'K'
    },
    {
      season:'Rabi',
      season_code:'R'
    },
  ];
  cropList=[
    {
      crop_name:'Wheat',
      crop_code:'A01012'
    },
    {
      crop_name:'Paddy (Dhan)',
      crop_code:'A01012'
    },
  ]
  Variety=[
    {
      variety_name:'PW (250)',
      id:'1234'
    },
    {
      variety_name:'HD-1925 (SHERA)',
      id:'3442'
    },
  ]

  tableData: any = [
    {
        crop: 'Wheat',
        Variety: 'HD-1925',
        location: 'plot 01',
        area_sown: 'lorem',
        Inspected_area: 'Test',
        expected_production: 'NA',
        estimated_production: 'NA',
        crop_condition: 'NA',
        tentative_date_harvesting: '20/9/23',
        report_monitoring_team: 'NA',
        reason_for_unsatisfactory: 'NA',
        monitoring_team: 'NA',
        status: 'Complete',
        download: 'Report'
    },
    {
      crop: 'Wheat',
      Variety: 'PW-247',
      location: 'plot 02',
      area_sown: 'lorem',
      Inspected_area: 'Test',
      expected_production: 'NA',
      estimated_production: 'NA',
      crop_condition: 'NA',
      tentative_date_harvesting: '20/9/23',
      report_monitoring_team: 'NA',
      reason_for_unsatisfactory: 'NA',
      monitoring_team: 'NA',
      status: 'Pending',
      download: 'Report'
  },
  {
    crop: 'Wheat',
    Variety: 'HD-1925',
    location: 'plot 03',
    area_sown: 'lorem',
    Inspected_area: 'Test',
    expected_production: 'NA',
    estimated_production: 'NA',
    crop_condition: 'NA',
    tentative_date_harvesting: '20/9/23',
    report_monitoring_team: 'NA',
    reason_for_unsatisfactory: 'NA',
    monitoring_team: 'NA',
    status: 'complete',
    download: 'Report'
},
{
  crop: 'Wheat',
  Variety: 'PW-247',
  location: 'plot 04',
  area_sown: 'lorem',
  Inspected_area: 'Test',
  expected_production: 'NA',
  estimated_production: 'NA',
  crop_condition: 'NA',
  tentative_date_harvesting: '20/9/23',
  report_monitoring_team: 'NA',
  reason_for_unsatisfactory: 'NA',
  monitoring_team: 'NA',
  status: 'Pending',
  download: 'Report'
},
  ]

  constructor(private service: SeedServiceService, private fb: FormBuilder) {
    this.createForm();
  }
  createForm() {
    this.ngForm = this.fb.group({
      year:new FormControl('',),
      season:new FormControl(''),
      crop:new FormControl(''),
      bsp2Arr: this.fb.array([
        this.bsp2arr(),
      ]),


    })
  }
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.getPageData();
   
    for(let data of this.dummyData){
      let bsplength = data.bsp2Arr.length;
      data.bsplength=bsplength
    }
  }

 

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service.postRequestCreator("data-characterstics-list", null, {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      pageSize: 50,
      search: {
        // crop_group: (this.ngForm.controls["crop_group"].value),
        // crop_name: this.ngForm.controls["crop_name"].value,
        // variety_name: this.ngForm.controls["variety_name"].value,
        // variety_name_filter: this.ngForm.controls['variety_name_filter'].value ? this.ngForm.controls['variety_name_filter'].value : '',
        // user_id: this.userId.id
      }
    }).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        console.log(apiResponse);

        // this.allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows ? apiResponse.EncryptedResponse.data.rows : '';
        // console.log(this.allData[0].m_crop);
        this.allData = this.inventoryData

        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);

        // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
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
  }
  bsp2arr() {
    let temp = this.fb.group({
      filed_loc: ['', Validators.required],
      area_sown: ['', Validators.required],
      date_of_sowing: ['', Validators.required],
      quantity_of_sowning: [''],
      quantity_of_breedersown: [''],
      expected_date_inspection: [''],
      expected_date_harvest: [''],
      expected_producton: [''],
    });      
    return temp;      
  }

  getItems(form) {
    return form.controls.bsp2Arr.controls;
  }

  addMore(i) {       
    this.itemsArray.push(this.bsp2arr());        
  }

  remove(rowIndex: number) {          
      this.itemsArray.removeAt(rowIndex);      
  }

  get itemsArray() {
    return <FormArray>this.ngForm.get('bsp2Arr');
  }

  save(data){
    console.log(data)

  }
  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
}
