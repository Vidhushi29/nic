import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approval-for-reprint-tags',
  templateUrl: './approval-for-reprint-tags.component.html',
  styleUrls: ['./approval-for-reprint-tags.component.css']
})
export class ApprovalForReprintTagsComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  isSearch: boolean = false;
  isCrop: boolean;
  showTab: boolean;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  dropdownSettings: IDropdownSettings;
  selectedItems = [];
  dropdownList = [];
  dropdownList1 = [];
  isDisabled: boolean = true;
  yearOfIndent: any;
  seasonlist: any;
  resionData = [
    { id: 1, reason: "Misprinting of tags" },
    { id: 2, reason: "Misplacement of tags" },
    { id: 3, reason: "Tags damaged" },
    { id: 4, reason: "Exhaustion of cartridge" }
  ];
  reprintData = [
    {
      variety_name: "PBW-119",
      variety_line_name: "H-456",
      lot_details: [
        {
          lot_no: "SEP23-0001-001-3(ii)",
          lot_quantity: "50",
          total_bag_no: "100",
          class_of_seed: "Beeder I"
        }
      ],
      tag_reprinted: [{ tag: "B/23/001/000900" }, { tag: "B/23/001/0000010-12" }, { tag: "B/23/001/000231" }],
      no_of_tag: 4,
      reason_of_reprinting: "Damage due to mishanding",
      requestor_spp: "SPP NAME"
    },
    {
      variety_name: "PBW-119",
      variety_line_name: "H-123",
      lot_details: [
        {
          lot_no: "SEP23-0001-001-3(ii)",
          lot_quantity: "50",
          total_bag_no: "100",
          class_of_seed: "Beeder I"
        }
      ],
      tag_reprinted: [{ tag: "B/23/001/000900" }, { tag: "B/23/001/0000010-12" }, { tag: "B/23/001/000231" }],
      no_of_tag: 4,
      reason_of_reprinting: "Damage due to mishanding",
      requestor_spp: "SPP NAME"
    }
  ]

  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
  dummyData: { variety_id: string; variety_name: string; indent_quantity: number; bsp2Arr: any[]; }[];
  selectCrop: any;
  selectlab: any;
  selectlab1: any;
  selecttreat: any;
  selecttreat1: any;
  selectCrop_group_code: any;
  selectlab_group_code: any;
  selectlab1_group_code: any;
  crop_name_data: any;
  lab_data: any;
  treat_data: any;
  selectCrop_group: string;
  selectlab_group: string;
  selectlab1_group: string;
  selecttreat_group: string;
  selecttreat1_group: string;
  crop_text_check: string;
  lab_text_check: string;
  lab1_text_check: string;
  treat_text_check: string;
  treat1_text_check: string;
  croupGroup: any;
  selectCrop_crop_code: any;
  selectlab_lab_code: any;
  selectlab1_lab_code: any;
  selecttreat_treat_code: any;
  selecttreat1_treat_code: any;
  labs_data: any;
  treats_data: any;
  selectedTable: string;
  cropDataList: any;
  cropDataListSecond: any;
  varietylineList: any;
  getReprintAllDataList: any;
  getReprintTagAllDataList: any;
  spaDataList: any;

  selectTable(table: string) {
    this.selectedTable = table;
  }
  statusData = [
    { id: 1, status: "All" },
    { id: 2, status: "Approved" },
    { id: 3, status: "Rejected" },
    { id: 4, status: "Pending" }
  ]
  constructor(private service: SeedServiceService, private fb: FormBuilder, private _productionCenter: ProductioncenterService) {
    this.createForm();
  }
  selectedTreatment: string = '';
  selectedTreatment1: string = '';
  selectedTreatment2: string = '';
  selectedTreatment3: string = '';
  chemicalName: string = '';
  placeholderText: string = '';

  // updatePlaceholder() {
  //   this.placeholderText = this.chemicalName ? `Chemical Name: ${this.chemicalName}` : 'Enter chemical name';
  // }
  createForm() {
    this.ngForm = this.fb.group({
      year: new FormControl('',),
      season: new FormControl(''),
      BSPC: new FormControl(''),
      cropName: new FormControl(''),
      crop_text: new FormControl(''),
      variety: new FormControl(''),
      crop_code: new FormControl(''),
      variety_filter: new FormControl(''),
      spp_filter: new FormControl(''),
      status_filter: new FormControl(''),
    })
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getReprintSeasonData();
      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getReprintCropData();
      }
    });
    this.ngForm.controls['variety'].valueChanges.subscribe(newValue => {
      if (newValue) {
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropDataList = this.cropDataListSecond
        let response = this.cropDataList.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropDataList = response
      }
      else {
        this.cropDataList = this.cropDataListSecond
      }
    });
  }

  ngOnInit(): void {
    this.getReprintYearData();
    this.getReprintTagAllData();
    this.fetchData();
    this.dropdownList1 = [
      { item_id: 1, item_text: 'DW-147' },
      { item_id: 2, item_text: 'DW-148' },
    ]
    this.dropdownList = [
      { item_id: 1, item_text: 'Germination' },
      { item_id: 2, item_text: 'Purity' },
      { item_id: 3, item_text: 'ODV' },
      { item_id: 4, item_text: 'Moisture' },
      { item_id: 5, item_text: 'Insect Damage' },
      { item_id: 6, item_text: 'Seed Health' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: ' ' },
      { item_id: 4, item_text: ' ' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
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
    this.getPageData();
    this.dummyData = [
      {
        'variety_id': '23112',
        'variety_name': 'PBW-154',
        'indent_quantity': 150,
        bsp2Arr: []
      },
      {
        'variety_id': '23114',
        'variety_name': 'HD-1925 (SHERA)',
        'indent_quantity': 150,
        bsp2Arr: []
      }
    ]
  }
  getReprintYearData() {
    let route = "get-approved-tag-year";
    let param;
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      console.log('year data===', res);
      if (res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }

  getReprintSeasonData() {
    let route = "get-approved-tag-season";
    let param = {
      "search": { "year": this.ngForm.controls['year'].value, }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  getReprintCropData() {
    let route = "get-approved-tag-crop";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.cropDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        this.cropDataListSecond = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  getReprintVarietyData() {
    let route = "get-approved-tag-variety";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.varietyList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  getReprintSPAData() {
    let route = "get-approved-tag-spp-data";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop_code'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.spaDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }

  getReprintAllData() {
    let route = "get-reprint-tag-data";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      'variety_code': this.ngForm.controls['variety_filter'].value,
      'spp_code': this.ngForm.controls['spp_filter'].value,
      // 'tag_no':this.ngForm.controls['tag_no_filter'].value,
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.getReprintAllDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  getReprintTagAllData() {
    let route = "get-reprint-tag-no-list-data";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
    };
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {
        this.getReprintTagAllDataList = res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }
  getReasionData(id) {
    let reasionData = this.resionData.filter(item => item.id == id);
    let resionName = reasionData && reasionData[0] && reasionData[0].reason;
    return resionName;
  }
  // get-reprint-tag-no-list-data
  getAllTag(id) {
    let tagNodata = this.getReprintTagAllDataList.filter(ele => ele.reprint_tag_id == id);
    let tagNoArray = [];
    if (tagNodata && tagNodata.length) {
      tagNodata.forEach(ele => {
        tagNoArray.push(' ' + ele.tag_no)
      });
    }
    return tagNoArray;
  }
  // getCropData() {
  //   this.cropNameSecond
  // }
  search() {
    this.isSearch = true;
    this.getReprintAllData();
    this.getReprintVarietyData();
    this.getReprintSPAData();
    
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service.postRequestCreator("data-characterstics-list", null, {
      page: loadPageNumberData,
      pageSize: 50,
      search: {}
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
  cropNameValue(item: any) {
    // this.getReprintVarietyData();
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_group'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    this.ngForm.controls['crop_code'].setValue(this.selectCrop_crop_code);
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check = 'crop_group'
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  updateStatus(ids, type) {
    let route = 'update-approved-tag';
    let param = {
      "id": ids,
      "type": type
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse.status_code === 200) {

        Swal.fire({
          title: '<p style="font-size:25px;">Data is ' + type + '.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        });
        this.getReprintAllData();
      }
    })
  }
}
