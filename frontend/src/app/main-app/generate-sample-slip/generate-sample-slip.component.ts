import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';

interface DummyDataItem {
  variety_id: string;
  variety_name: string;
  indent_quantity: number;
  bsp2Arr: any[];
  bsplength?: number;  
}

@Component({
  selector: 'app-generate-sample-slip',
  templateUrl: './generate-sample-slip.component.html',
  styleUrls: ['./generate-sample-slip.component.css']
})
export class GenerateSampleSlipComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData=[];
  allData: any; 
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  isSearch: boolean;
  isCrop: boolean;
  showTab: boolean;
  private _productionCenter: any; 
  dropdownSettings: IDropdownSettings;
  selectedItems = [];
  dropdownList1 = [];
   
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
  ];
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
  ];
  cropNameSecond = [
    {
      crop_name: 'Wheat',
      crop_code: 'A01012'
    },
    {
      crop_name: 'PADDY (Dhan)',
      crop_code: 'A01012'
    },
  ];

  variety=[
    {
      variety:'DW-147'
    },
    {
      variety:'DW-148'
    },
  ];
  
  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
  dummyData: DummyDataItem[] = [];
  selectCrop: any;
  selectCrop_group_code: any;
  crop_name_data: any;
  selectCrop_group: string;
  crop_text_check: string;
  croupGroup: any;
  selectCrop_crop_code: any;


  constructor(private service: SeedServiceService, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this.fetchData();
    this.dropdownList1= [
      { item_id: 1, item_text: 'DW-147' },
      { item_id: 2, item_text: 'DW-148' },
    ] 
    this.selectedItems = [
      { item_id: 3, item_text: ' ' },
      { item_id: 4, item_text: ' ' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All1',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      maxHeight: 70,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  fetchData() {
    // this.getPageData();
    this.dummyData = [
      {
        'variety_id': '23112',
        'variety_name': 'PBW-154',
        'indent_quantity': 150,
        'bsp2Arr': []
      },
      {
        'variety_id': '23114',
        'variety_name': 'HD-1925 (SHERA)',
        'indent_quantity': 150,
        'bsp2Arr': []
      }
    ];

    for (let data of this.dummyData) {
      data.bsplength = data.bsp2Arr.length;
    }
  } 

  createForm() {
    this.ngForm = this.fb.group({
      year: new FormControl('',),
      season: new FormControl(''),
      BSPC: new FormControl(''),
      cropName: new FormControl(''),
      crop_text: new FormControl(''),
      variety: new FormControl(''),
      bsp2Arr: this.fb.array([
        this.bsp2arr(),
      ]),
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropName = this.cropNameSecond
        let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropName = response
      }
      else {
       this.cropName = this.cropNameSecond
      }
    });
  }

  ageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service.postRequestCreator("data-characterstics-list", null, {
      page: loadPageNumberData,
      pageSize: 50,
      search: {
      }
    }).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        console.log(apiResponse);

        this.allData = this.inventoryData

        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true);
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
    return this.fb.group({
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

  save(data) {
    console.log(data)
  }

  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }

  cgClick() {
    document.getElementById('crop_group').click();
  }

  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;

    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_group'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    this.selectCrop_group = '';
    this.crop_text_check = 'crop_group';
  }

  cropdatatext() {
    console.log('this.cropNameSecond;', this.cropNameSecond);
  }
}

 