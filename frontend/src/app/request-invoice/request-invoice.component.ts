import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-request-invoice',
  templateUrl: './request-invoice.component.html',
  styleUrls: ['./request-invoice.component.css']
})
export class RequestInvoiceComponent implements OnInit {
[x: string]: any;
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  isSearch: boolean;
  isCrop: boolean;
  showTab: boolean;
  private _productionCenter: any;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any;
  dropdownSettings: IDropdownSettings;
  selectedItems = [];
  dropdownList = [];
  dropdownList1 = [];
  isDisabled: boolean = true;
  visibleForm: boolean = false;
  visibleMouCharges: boolean = false;
  visibleLicenceCharges: boolean = false;
  visibleCgstCharges: boolean = false;
  visibleSgstCharges: boolean = false;
  visibleIgstCharges: boolean = false;
  yearOfIndent = [
    {
      'year': '2026-2027',
      'value': '2026'
    },
    {
      'year': '2025-2026',
      'value': '2025'
    },
    {
      'year': '2024-2025',
      'value': '2024'
    },
    {
      'year': '2023-2024',
      'value': '2023'
    },
    {
      'year': '2022-2023',
      'value': '2022'
    },
    {
      'year': '2021-2022',
      'value': '2021'
    }
  ]
  seasonlist = [
    {
      season: 'KHARIF',
      season_code: 'K'
    },
    {
      season: 'RABI',
      season_code: 'R'
    },
  ];
  cropName = [
    {
      crop_name: 'Wheat',
      crop_code: 'A01012'
    },
    {
      crop_name: 'PADDY (Dhan)',
      crop_code: 'A01012'
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

  variety = [
    {
      variety: 'DW-147'
    },
    {
      variety: 'DW-147'
    },

  ];
  lab1 = [
    {
      lab: 'ABC LAB',
      lab_code: 'A01012'
    },
    {
      lab: 'ABCD LAB',
      lab_code: 'A010121'
    }
  ];
  labSecond = [
    {
      lab: 'ABC LAB',
      lab_code: 'A01012'
    },
    {
      lab: 'ABCD LAB',
      lab_code: 'A010121'
    }
  ];
  lab2 = [
    {
      labs: 'ABC LAB',
      lab1_code: 'A01012'
    },
    {
      labs: 'ABCD LAB',
      lab1_code: 'A010121'
    }
  ];
  labSecond1 = [
    {
      labs: 'ABC LAB',
      lab1_code: 'A0101211'
    },
    {
      labs: 'ABCD LAB',
      lab1_code: 'A0101212'
    }
  ];
  treat1 = [
    {
      treat: 'BSPC name',
      treat_code: 'A01012'
    },
    {
      treat: 'BSPC name1',
      treat_code: 'A010121'
    }
  ];
  treatSecond = [
    {
      treat: 'BSPC name',
      treat_code: 'A01012'
    },
    {
      treat: 'BSPC name1',
      treat_code: 'A010121'
    }
  ];
  treat2 = [
    {
      treats: 'BSPC name',
      treat1_code: 'A01012'
    },
    {
      treats: 'BSPC name1',
      treat1_code: 'A010121'
    }
  ];
  treatSecond1 = [
    {
      treats: 'BSPC name',
      treat1_code: 'A0101211'
    },
    {
      treats: 'BSPC name1',
      treat1_code: 'A0101212'
    }
  ]
  treatment = [
    {
      treatment: 'Yes'
    },
    {
      treatment: 'No'
    }
  ]
  treatmentSecond = [
    {
      treatment: 'Yes'
    },
    {
      treatment: 'No'
    }
  ]
  treatment1 = [
    {
      treatment1: 'Yes'
    },
    {
      treatment1: 'No'
    }
  ]
  treatmentSecond1 = [
    {
      treatment1: 'Yes'
    },
    {
      treatment1: 'No'
    }
  ]
  filterData = [
    {
      variety: "DW-147",
      parental_line: "",
      indeter: "Madhya Pradesh",
      count: 2,
      spas: [
        {
          spa_name: "SPA 1",
          quantity_qt: "45.00",
          payment_status: 1,
          amount_paid:100,
          payment_method:2,
          transaction:'1223'
        },
        {
          spa_name: "SPA 2",
          quantity_qt: "20.00",
          payment_status: 1,
          amount_paid:100,
          payment_method:2,
          transaction:'1223'
        }
      ],
      stock_kept_for_spa: {
        total_no_of_bags: [{ bag_size: 80 }, { bag_size: 50 }, { bag_size: 20 }],
        total_quantity: 45,
       
      },
      invoice_amount: 9000,
    
    },
    {
      variety: "PBW-119",
      parental_line: "H-456",
      indeter: "Madhya Pradesh",
      count: 2,
      spas: [
        {
          spa_name: "SPA 1",
          payment_status: 2,
          quantity_qt: "45.00",
          amount_paid:100,
          payment_method:1,
          transaction:'1223'
        },
        {
          spa_name: "SPA 2",
          payment_status: 2,
          quantity_qt: "20.00",
          amount_paid:100,
          payment_method:1,
          transaction:'1223'
        }
      ],
      stock_kept_for_spa: {
        total_no_of_bags: [{ bag_size: 80 }, { bag_size: 50 }, { bag_size: 20 }],
        total_quantity: 45,
        
      },
      invoice_amount: '',
      // payment_status: 2,
      
    }
  ]
  varietyPrice = [
    {
      crop_name: "Barley(JAU)",
      variety_name: "REKHA (BCU-73)",
      parental_line: "N/A",
      valid_form: "Mar 13, 2024, 3:21:41 PM",
      per_quintal: "500"
    },
    {
      crop_name: "Barley(JAU)",
      variety_name: "REKHA (BCU-73)",
      parental_line: "N/A",
      valid_form: "Mar 13, 2024, 3:21:41 PM",
      per_quintal: "500"
    },
    {
      crop_name: "Barley(JAU)",
      variety_name: "REKHA (BCU-73)",
      parental_line: "N/A",
      valid_form: "Mar 13, 2024, 3:21:41 PM",
      per_quintal: "500"
    },
    {
      crop_name: "Barley(JAU)",
      variety_name: "REKHA (BCU-73)",
      parental_line: "N/A",
      valid_form: "Mar 13, 2024, 3:21:41 PM",
      per_quintal: "500"
    }
  ]
  additionalCharges = [
    { id: 1, charges: "Mou charges" },
    { id: 2, charges: "License fee" },
    { id: 3, charges: "CGST" },
    { id: 4, charges: "SGST" },
    { id: 5, charges: "IGST" },
  ];
  generateInvoice = [
    {
      bag_weight: 50,
      nog_of_bag: 300,
      qnt_of_breeder_seed: 150.00,
      no_of_bag: '',
      total_qnt_of_breeder_seed_spa: 20.00,
      per_unit_mrp: 100,
      total_amount: 0
    },
    {
      bag_weight: 40,
      nog_of_bag: 125,
      qnt_of_breeder_seed: 50.00,
      no_of_bag: '',
      total_qnt_of_breeder_seed_spa: 0,
      per_unit_mrp: 80,
      total_amount: 0
    },
    {
      bag_weight: 20,
      nog_of_bag: 100,
      qnt_of_breeder_seed: 20.00,
      no_of_bag: '',
      total_qnt_of_breeder_seed_spa: 0,
      per_unit_mrp: 40.00,
      total_amount: 0.00
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

  selectTable(table: string) {
    this.selectedTable = table;
  }
  constructor(private service: SeedServiceService, private fb: FormBuilder) {
    this.createForm();
  }
  selectedTreatment: string = '';
  selectedTreatment1: string = '';
  selectedTreatment2: string = '';
  selectedTreatment3: string = '';
  chemicalName: string = '';
  placeholderText: string = '';

  createForm() {
    this.ngForm = this.fb.group({
      year: new FormControl('',),
      season: new FormControl('',),
      crop_name: new FormControl('',),
      mou_amt: new FormControl('',),
      licence_amt: new FormControl('',),
      cgst_amt: new FormControl('',),
      sgst_amt: new FormControl('',),
      igst_amt: new FormControl('',),
      total_amt: new FormControl('',),
      grand_total_amt: new FormControl('',),
      bspc: this.fb.array([
        // this.bsp2arr(),
      ]),
      selectedCharges: new FormControl(''),
    })

  }
  get bspc(): FormArray {
    return this.ngForm.get('bspc') as FormArray;
  }
  ngOnInit(): void {
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
      idField: 'id',
      textField: 'charges',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      // maxHeight: 70,
    };
  }
  calculateCharges() {
    this.ngForm.controls['total_amt'].setValue(parseInt(this.ngForm.controls['mou_amt'].value ? this.ngForm.controls['mou_amt'].value:0) +
      parseInt(this.ngForm.controls['licence_amt'].value ? this.ngForm.controls['licence_amt'].value:0) +
      parseInt(this.ngForm.controls['cgst_amt'].value ? this.ngForm.controls['cgst_amt'].value:0) +
      parseInt(this.ngForm.controls['sgst_amt'].value ? this.ngForm.controls['sgst_amt'].value:0) +
      parseInt(this.ngForm.controls['igst_amt'].value ? this.ngForm.controls['igst_amt'].value:0) +
      parseInt(this.ngForm.controls['grand_total_amt'].value ? this.ngForm.controls['grand_total_amt'].value:0));
      console.log('this.ngForm.controls[total_amt].value',this.ngForm.controls['total_amt'].value);
  }

  onItemSelect(item: any) {

    switch (item.id) {
      case 1:
        this.visibleMouCharges = true
        break;
      case 2:
        this.visibleLicenceCharges = true;
        break;
      case 3:
        this.visibleCgstCharges = true;
        break;
      case 4:
        this.visibleSgstCharges = true;
        break;
      case 5:
        this.visibleIgstCharges = true;
        break;
      default:
        this.visibleMouCharges = false
        this.visibleLicenceCharges = false;
        this.visibleCgstCharges = false;
        this.visibleSgstCharges = false;
        this.visibleIgstCharges = false;
    }
  }
  onSelectAll(items: any) {
    switch (items.id) {
      case 1:
        this.visibleMouCharges = true
        break;
      case 2:
        this.visibleLicenceCharges = true;
        break;
      case 3:
        this.visibleCgstCharges = true;
        break;
      case 4:
        this.visibleSgstCharges = true;
        break;
      case 5:
        this.visibleIgstCharges = true;
        break;
      default:
        this.visibleMouCharges = false
        this.visibleLicenceCharges = false;
        this.visibleCgstCharges = false;
        this.visibleSgstCharges = false;
        this.visibleIgstCharges = false;
    }
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
  fetchInviceData() {
    if (this.generateInvoice) {

      for (let i = 0; i < this.generateInvoice.length; i++) {
        if (this.ngForm.controls['bspc'].value.length > 1) {
          this.remove(i);
        }
        this.addMore(i);
        this.ngForm.controls['bspc']['controls'][i].patchValue({
          bag_weight: [this.generateInvoice[i].bag_weight ? this.generateInvoice[i].bag_weight : 0],
          nog_of_bag: [this.generateInvoice[i].nog_of_bag ? this.generateInvoice[i].nog_of_bag : 0],
          qnt_of_breeder_seed: [this.generateInvoice[i].qnt_of_breeder_seed ? this.generateInvoice[i].qnt_of_breeder_seed : 0],
          no_of_bag: [this.generateInvoice[i].no_of_bag ? this.generateInvoice[i].no_of_bag : 0],
          total_qnt_of_breeder_seed_spa: [this.generateInvoice[i].total_qnt_of_breeder_seed_spa ? this.generateInvoice[i].total_qnt_of_breeder_seed_spa : 0],
          per_unit_mrp: [this.generateInvoice[i].per_unit_mrp ? this.generateInvoice[i].per_unit_mrp : 0],
          total_amount: [this.generateInvoice[i].total_amount ? this.generateInvoice[i].total_amount : 0]

        });
      }

    }
  }

  sumValue(event, i) {
    console.log('password', this.ngForm.controls['bspc']['controls'][i].controls['no_of_bag'].value);
    this.ngForm.controls['bspc']['controls'][i].controls['total_amount'].setValue((event.target.value) * (this.ngForm.controls['bspc']['controls'][i].controls['per_unit_mrp'].value));
    let sumOfTotal = 0;
    this.generateInvoice.forEach((ele, i) => {
      sumOfTotal += parseInt(this.ngForm.controls['bspc']['controls'][i].controls['total_amount'].value);
    });
    this.ngForm.controls['grand_total_amt'].setValue(sumOfTotal);
  }

  getCropData() {
    this.cropNameSecond
  }
  cropdatatext() { }
  cropNameValue(data) { }
  cgClick() { }
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
  bsp2arr() {
    let temp = this.fb.group({
      bag_weight: ['',],
      nog_of_bag: ['',],
      qnt_of_breeder_seed: ['',],
      no_of_bag: ['',],
      total_qnt_of_breeder_seed_spa: ['',],
      per_unit_mrp: ['',],
      total_amount: ['',]
    });
    return temp;
  }

  getItems(form) {
    return form.controls.bsp2Arr.controls;
  }

  addMore(i) {
    this.bspc.push(this.bsp2arr());
  }

  remove(rowIndex: number) {
    this.bspc.removeAt(rowIndex);
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

  createInvoice() {
    this.visibleForm = true;
    this.fetchInviceData();
  }
  cancel() {
    this.visibleForm = false;
  }
}
