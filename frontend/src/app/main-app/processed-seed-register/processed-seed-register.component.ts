import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-processed-seed-register',
  templateUrl: './processed-seed-register.component.html',
  styleUrls: ['./processed-seed-register.component.css']
})
export class ProcessedSeedRegisterComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData=[]

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData=[]
  allData: any;
  isDeveloped: boolean = false;
  is_developed: boolean;
  isCrop: boolean = false;
  isSearch: boolean = true;
  varietyDisbled: boolean = true;

  dropdownSettings: IDropdownSettings = {};
  yearOfIndent =[
    {
      'year':'2023-24',
      'value':'2023'
    },
    {
      'year':'2022-23',
      'value':'2022'
    },
    {
      'year':'2021-22',
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
  cropName=[
    {
      crop_name:'Wheat',
      crop_code:'A01012'
    },
    {
      crop_name:'PADDY (Dhan)',
      crop_code:'A01012'
    },

  ]
  BSPC=[
    {
      BSPC:'AAU ARS ANAND',
      id:'1234'
    },
    {
      BSPC:'Test BSPC',
      id:'3442'
    },
  ]
Variety=[
  {
    Variety:'A01012',
    Variety_code: 'E1234'
  },
  {
    Variety:'Test Variety',
    Variety_code: 'S1235'

  },
 
]

plotCode=[
  {
    plotCode: 'p-01',
    plot_code: 'Test'
  },
  {
    plotCode: 'p-02',
    plot_code: 'Test'
  },
]


  tableData: any = [
    {
        crop: 'Wheat',
        Variety: 'DW-147',
        plot_code: 'p-01',
        lotNo: 'Li(i)',
        lotQuantity: '109',
        processedQuantity: null,
        quantityReject: null,
        rejectionPercent: null
    },
    {
      crop: 'Wheat',
      Variety: 'DW-147',
      plot_code: 'p-01',
      lotNo: 'Li(ii)',
      lotQuantity: '100',
      processedQuantity: '90',
      quantityReject: '10',
      rejectionPercent: '10'
  },
  //   {
  //     crop: 'Wheat',
  //     Variety: 'DW-190',
  //     plot_code: 'p-02',
  //     lotNo: 'Li(ii)',
  //     lotQuantity: '100',
  //     processedQuantity: '90',
  //     sampleNo: 'NA',
  //     uniqueCode: 'NA'
  // },
//   {
//     crop: 'Rice',
//     Variety: 'Test Variety',
//     plot_code: 'A2300B',
//     harvest_date: '2/6/2023',
//     raw_final_quantity: 'Test',
//     spp_name: 'NA'
// },
// {
//   crop: 'Dhan',
//   Variety: 'Test Variety',
//   plot_code: 'A2300B',
//   harvest_date: '2/6/2023',
//   raw_final_quantity: 'Test',
//   spp_name: 'NA'
// },
  ]


  constructor(private service: SeedServiceService, private fb: FormBuilder) {
    this.createForm();
  }
  createForm() {
    this.ngForm = this.fb.group({
      year:new FormControl('',),
      season:new FormControl(''),
      BSPC:new FormControl(''),
      cropName:new FormControl(''),
      Variety: new FormControl(''),
      plotCode: new FormControl(''),
      lotNo: ['0'],
      lotQuantity: ['0'],
      processedQuantity: new FormControl(''),
      quantityReject: ['0'],
      rejectionPercent: ['0'],
      bsp2Arr: this.fb.array([
        this.bsp2arr(),
      ]),
    })
    this.ngForm.controls['lotNo'].disable();
    this.ngForm.controls['lotQuantity'].disable();
    this.ngForm.controls['processedQuantity'].enable();
    this.ngForm.controls['quantityReject'].disable();
    this.ngForm.controls['rejectionPercent'].disable();

    
  }



  
  ngOnInit(): void {
    this.fetchData();

    // this.dropdownSettings = {
    //   idField: 'crop_code',
    //   textField: 'crop_name',
    //   // enableCheckAll: false,
    //   allowSearchFilter: true,
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'Unselect All',
    //   enableCheckAll: true,
    // };

    // this.dropdownSettings = {
    //   idField: 'state_code',
    //   textField: 'state',
    //   // enableCheckAll: false,
    //   allowSearchFilter: true,
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'Unselect All',
    //   enableCheckAll: true,
    // };
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    // this.getFiterVarietyData();
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['BSPC'].value || !this.ngForm.controls['cropName'].value || !this.ngForm.controls['variety'].value || !this.ngForm.controls['plotCode'].value) {
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Please Select All Required Field",
        position: "center",
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      return;
    } else {
      this.isSearch = false;
      this.varietyDisbled = false;
      this.ngForm.controls['lotNo'].enable();
      let varietyCodeArr = [];
      if (this.ngForm.controls["lotNo"].value && this.ngForm.controls["lotNo"].value !== undefined && this.ngForm.controls["lotNo"].value.length > 0) {
        this.ngForm.controls["lotNo"].value.forEach(ele => {
          varietyCodeArr.push(ele.variety_code);
        })
      }
    }
  }

  fetchData() {
    this.getPageData();
    this.dummyData=[
      {
        'variety_id':'23112',
        'variety_name':'PBW-154',
        'indent_quantity':150,
        bsp2Arr:[]
      },
      {
        'variety_id':'23114',
        'variety_name':'HD-1925 (SHERA)',
        'indent_quantity':150,
        bsp2Arr:[]
      }

    ]
    for(let data of this.dummyData){
      let bsplength = data.bsp2Arr.length;
      data.bsplength=bsplength
    }
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
      inspected_area: [''],
      est_production: [''],
      harvest_date: [''],
      raw_seed_produced: [''],
      spp_name: [''],



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
