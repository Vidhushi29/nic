import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { IndenterService } from 'src/app/services/indenter/indenter.service';

@Component({
  selector: 'app-status-of-lifting-non-lifting-of-breeder-seed-crop-wise-report',
  templateUrl: './status-of-lifting-non-lifting-of-breeder-seed-crop-wise-report.component.html',
  styleUrls: ['./status-of-lifting-non-lifting-of-breeder-seed-crop-wise-report.component.css']
})
export class StatusOfLiftingNonLiftingOfBreederSeedCropWiseReportComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  fileName = 'submitted-Indents-of-Breeder-Seed-Crop-Wise-report.xlsx';
  socials = [
    {
      name: 'Github',
      icon: 'fa fa-github fa-2x',
      link: 'https://www.github.com/..'
    },
    {
      name: 'Twitter',
      icon: 'fa fa-twitter fa-2x',
      link: 'https://www.twitter.com/..'
    },
    {
      name: 'Keybase',
      icon: '',
      link: 'https://keybase.io/..'
    }
  ];

  yearsData: any;
  seasonData: any;
  cropGroupData: any;
  cropData: any;
  crop_groups;
  dropdownSettings: IDropdownSettings = {};
  varietyData: any;
  totalIndentedQuantity: any;
  totalProduction: any;
  totalSurplus: any;

  selectedYear: any;
  selectedCropGroup: any;
  selectedCropName: any;
  today = new Date();

  indentData: any;
  cropGroupDataSecond: any;
  selectCrop_name: any;
  isCropName = false;
  cropDataSecond: any;
  yearOfIndent: any;
  seasonList: any;
  cropGroupList: any;
  cropTypeList: any;
  cropVarietList: any;
  state_cultivation
  cropGroupListArr = [];
  dataArr = [];
  finalData: any[];
  selectCrop_variety: any;
  outerArray: any[] = [
    { group: 'Group 1', items: ['Item 1', 'Item 2', 'Item 3'] },
    { group: 'Group 2', items: ['Item 4', 'Item 5'] },
    { group: 'Group 3', items: ['Item 6', 'Item 7', 'Item 8'] }
  ];
  variety_names: any;
  enableTable = false;
  cropNameArrData = [];
  cropname;
  cropVarietListsecond: any;
  spaName: any;
  dataList = [
    {
      pname: 'abc',
      numbers: [
        {
          arr: 125,
          key: 237,
        },
      ],
    },
    {
      pname: 'mno',
      numbers: [
        {
          arr: 125,
          key: 237,
        },
      ],
    },
  ];

  reportData: any[];
  dummyData;
  tableData;

  // cropWiseData:any[];
  cropWiseData: any[] = [

    {
      "crop_name": "Wheat",
      "crop_code": "A0101",
      "total_indent": 50,
      "total_allocate_quantity": 220,
      "total_lifted_quantity": 132,
      "total_bspc": 4,
      "total_spa": 4,
      "total_variety": 2,
      "variety": [
        {
          "name": "Variety 1",
          "variety_id": 101,
          "variety_code": "A01010023",
          "total_indent": 50,
          "total_allocate_quantity": 220,
          "total_lifted_quantity": 132,
          "total_spa": 2,
          "total_bspc": 4,
          "spa": [
            {
              "name": "SPA Name",
              "SPA_code": "SPA123",
              "state_code": 23,
              "indent_quntity": 40,
              "allocate_quantity": 200,
              "lifted_quantity": 120,
              "total_bspc": 2,
              "bspcs": [
                {
                  "name": "IRWR Karnal", //Name of prodcition center
                  "code": "0001",
                  "state": "UP",
                  "district": "Agra",
                  "alloaction": 100,
                  "lifting": 80,
                  "unlifted": 20,
                  "reason_for_short_supply": "comment"
                },
                {
                  "name": "IRWR Karnal", //Name of prodcition center
                  "code": "0001",
                  "state": "UP",
                  "distri  ct": "Agra",
                  "alloaction": 100,
                  "lifting": 80,
                  "unlifted": 20,
                  "reason_for_short_supply": "comment"
                },
              ]
            },
            {
              "name": "SPA Name2",
              "SPA_code": "SPA124",
              "state_code": 23,
              "indent_quntity": 10,
              "allocate_quantity": 20,
              "lifted_quantity": 12,
              "total_bspc": 2,
              "bspcs": [
                {
                  "name": "IRWR Karnal",
                  "code": "0001",
                  "state": "UP",
                  "district": "Agra",
                  "alloaction": 100,
                  "lifting": 80,
                  "unlifted": 20,
                  "reason_for_short_supply": "comment"
                },
                {
                  "name": "IRWR Karnal", //Name of prodcition center
                  "code": "0001",
                  "state": "UP",
                  "district": "Agra",
                  "alloaction": 100,
                  "lifting": 80,
                  "unlifted": 20,
                  "reason_for_short_supply": "comment"
                },
              ]
            },
          ]
        },
        // {
        //   "name": "Variety 2",
        //   "variety_id": 102,
        //   "variety_code": "A01010024",
        //   "total_indent": 100,
        //   "total_allocate_quantity": 200,
        //   "total_lifted_quantity": 120,
        //   "total_spa": 2,
        //   "total_bspc": 4,
        //   "spa": [
        //     {
        //       "name": "SPA Name",
        //       "SPA_code": "SPA123",
        //       "state_code": 23,
        //       "indent_quntity": 40,
        //       "allocate_quantity": 200,
        //       "lifted_quantity": 120,
        //       "total_bspc": 2,
        //       "bspcs": [
        //         {
        //           "name": "IRWR Karnal", //Name of prodcition center
        //           "code": "0001",
        //           "state": "UP",
        //           "district": "Agra",
        //           "alloaction": 100,
        //           "lifting": 80,
        //           "unlifted": 20,
        //           "reason_for_short_supply": "comment"
        //         },
        //         {
        //           "name": "IRWR Karnal", //Name of prodcition center
        //           "code": "0001",
        //           "state": "UP",
        //           "district": "Agra",
        //           "alloaction": 100,
        //           "lifting": 80,
        //           "unlifted": 20,
        //           "reason_for_short_supply": "comment"
        //         },
        //       ]
        //     },
        //     {
        //       "name": "SPA Name2",
        //       "SPA_code": "SPA124",
        //       "state_code": 23,
        //       "indent_quntity": 10,
        //       "allocate_quantity": 20,
        //       "lifted_quantity": 12,
        //       "total_bspc": 2,
        //       "bspcs": [
        //         {
        //           "name": "IRWR Karnal",
        //           "code": "0001",
        //           "state": "UP",
        //           "district": "Agra",
        //           "alloaction": 100,
        //           "lifting": 80,
        //           "unlifted": 20,
        //           "reason_for_short_supply": "comment"
        //         },
        //         {
        //           "name": "IRWR Karnal", //Name of prodcition center
        //           "code": "0001",
        //           "state": "UP",
        //           "district": "Agra",
        //           "alloaction": 100,
        //           "lifting": 80,
        //           "unlifted": 20,
        //           "reason_for_short_supply": "comment"
        //         },
        //       ]
        //     },
        //   ]
        // }
      ]
    },
    // {
    //   "crop_name": "Wheat",
    //   "crop_code": "A0101",
    //   "total_indent": 50,
    //   "total_allocate_quantity": 220,
    //   "total_lifted_quantity": 132,
    //   "total_bspc": 8,
    //   "total_variety": 2,
    //   "variety": [
    //     {
    //       "name": "Variety 1",
    //       "variety_id": 101,
    //       "variety_code": "A01010023",
    //       "total_indent": 50,
    //       "total_allocate_quantity": 220,
    //       "total_lifted_quantity": 132,
    //       "toatal_spa": 2,
    //       "total_bspc": 4,
    //       "spa": [
    //         {
    //           "name": "SPA Name",
    //           "SPA_code": "SPA123",
    //           "state_code": 23,
    //           "indent_quntity": 40,
    //           "allocate_quantity": 200,
    //           "lifted_quantity": 120,
    //           "total_bspc": 2,
    //           "bspcs": [
    //             {
    //               "name": "IRWR Karnal", //Name of prodcition center
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //             {
    //               "name": "IRWR Karnal", //Name of prodcition center
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //           ]
    //         },
    //         {
    //           "name": "SPA Name2",
    //           "SPA_code": "SPA124",
    //           "state_code": 23,
    //           "indent_quntity": 10,
    //           "allocate_quantity": 20,
    //           "lifted_quantity": 12,
    //           "total_bspc": 2,
    //           "bspcs": [
    //             {
    //               "name": "IRWR Karnal",
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //             {
    //               "name": "IRWR Karnal", //Name of prodcition center
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //           ]
    //         },
    //       ]
    //     },
    //     {
    //       "name": "Variety 2",
    //       "variety_id": 102,
    //       "variety_code": "A01010024",
    //       "total_indent": 100,
    //       "total_allocate_quantity": 200,
    //       "total_lifted_quantity": 120,
    //       "toatal_spa": 2,
    //       "total_bspc": 4,
    //       "spa": [
    //         {
    //           "name": "SPA Name",
    //           "SPA_code": "SPA123",
    //           "state_code": 23,
    //           "indent_quntity": 40,
    //           "allocate_quantity": 200,
    //           "lifted_quantity": 120,
    //           "total_bspc": 2,
    //           "bspcs": [
    //             {
    //               "name": "IRWR Karnal", //Name of prodcition center
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //             {
    //               "name": "IRWR Karnal", //Name of prodcition center
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //           ]
    //         },
    //         {
    //           "name": "SPA Name2",
    //           "SPA_code": "SPA124",
    //           "state_code": 23,
    //           "indent_quntity": 10,
    //           "allocate_quantity": 20,
    //           "lifted_quantity": 12,
    //           "total_bspc": 2,
    //           "bspcs": [
    //             {
    //               "name": "IRWR Karnal",
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //             {
    //               "name": "IRWR Karnal", //Name of prodcition center
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //           ]
    //         },
    //       ]
    //     }
    //   ]
    // },
    // {
    //   "crop_name": "Wheat",
    //   "crop_code": "A0101",
    //   "total_indent": 50,
    //   "total_allocate_quantity": 220,
    //   "total_lifted_quantity": 132,
    //   "total_bspc": 2,
    //   "total_variety": 2,
    //   "variety": [
    //     {
    //       "name": "Variety 1",
    //       "variety_id": 101,
    //       "variety_code": "A01010023",
    //       "total_indent": 50,
    //       "total_allocate_quantity": 220,
    //       "total_lifted_quantity": 132,
    //       "toatal_spa":1,
    //       "total_bspc": 1,
    //       "spa": [
    //         {
    //           "name": "SPA Name",
    //           "SPA_code": "SPA123",
    //           "state_code": 23,
    //           "indent_quntity": 40,
    //           "allocate_quantity": 200,
    //           "lifted_quantity": 120,
    //           "total_bspc": 1,
    //           "bspcs": [
    //             {
    //               "name": "IRWR Karnal", //Name of prodcition center
    //               "code": "0001",
    //               "state": "UP",
    //               "district": "Agra",
    //               "alloaction": 100,
    //               "lifting": 80,
    //               "unlifted": 20,
    //               "reason_for_short_supply": "comment"
    //             },
    //             // {
    //             //   "name": "IRWR Karnal", //Name of prodcition center
    //             //   "code": "0001",
    //             //   "state": "UP",
    //             //   "district": "Agra",
    //             //   "alloaction": 100,
    //             //   "lifting": 80,
    //             //   "unlifted": 20,
    //             //   "reason_for_short_supply": "comment"
    //             // },
    //           ]
    //         },
    //         {
    //           "name": "SPA Name2",
    //           "SPA_code": "SPA124",
    //           "state_code": 23,
    //           "indent_quntity": 10,
    //           "allocate_quantity": 20,
    //           "lifted_quantity": 12,
    //           "total_bspc": 0,
    //           "bspcs": [
    //             // {
    //             //   "name": "IRWR Karnal",
    //             //   "code": "0001",
    //             //   "state": "UP",
    //             //   "district": "Agra",
    //             //   "alloaction": 100,
    //             //   "lifting": 80,
    //             //   "unlifted": 20,
    //             //   "reason_for_short_supply": "comment"
    //             // },
    //             // {
    //             //   "name": "IRWR Karnal", //Name of prodcition center
    //             //   "code": "0001",
    //             //   "state": "UP",
    //             //   "district": "Agra",
    //             //   "alloaction": 100,
    //             //   "lifting": 80,
    //             //   "unlifted": 20,
    //             //   "reason_for_short_supply": "comment"
    //             // },
    //           ]
    //         },
    //       ]
    //     },
    //     {
    //       "name": "Variety 2",
    //       "variety_id": 102,
    //       "variety_code": "A01010024",
    //       "total_indent": 100,
    //       "total_allocate_quantity": 200,
    //       "total_lifted_quantity": 120,
    //       "toatal_spa": 2,
    //       "total_bspc": 0,
    //       "spa": [
    //         {
    //           "name": "SPA Name",
    //           "SPA_code": "SPA123",
    //           "state_code": 23,
    //           "indent_quntity": 40,
    //           "allocate_quantity": 200,
    //           "lifted_quantity": 120,
    //           "total_bspc": 1,
    //           "bspcs": [
    //             // {
    //             //   "name": "IRWR Karnal", //Name of prodcition center
    //             //   "code": "0001",
    //             //   "state": "UP",
    //             //   "district": "Agra",
    //             //   "alloaction": 100,
    //             //   "lifting": 80,
    //             //   "unlifted": 20,
    //             //   "reason_for_short_supply": "comment"
    //             // },
    //             // {
    //             //   "name": "IRWR Karnal", //Name of prodcition center
    //             //   "code": "0001",
    //             //   "state": "UP",
    //             //   "district": "Agra",
    //             //   "alloaction": 100,
    //             //   "lifting": 80,
    //             //   "unlifted": 20,
    //             //   "reason_for_short_supply": "comment"
    //             // },
    //           ]
    //         },
    //         {
    //           "name": "SPA Name2",
    //           "SPA_code": "SPA124",
    //           "state_code": 23,
    //           "indent_quntity": 10,
    //           "allocate_quantity": 20,
    //           "lifted_quantity": 12,
    //           "total_bspc": 0,
    //           "bspcs": [
    //             // {
    //             //   "name": "IRWR Karnal",
    //             //   "code": "0001",
    //             //   "state": "UP",
    //             //   "district": "Agra",
    //             //   "alloaction": 100,
    //             //   "lifting": 80,
    //             //   "unlifted": 20,
    //             //   "reason_for_short_supply": "comment"
    //             // },
    //             // {
    //             //   "name": "IRWR Karnal", //Name of prodcition center
    //             //   "code": "0001",
    //             //   "state": "UP",
    //             //   "district": "Agra",
    //             //   "alloaction": 100,
    //             //   "lifting": 80,
    //             //   "unlifted": 20,
    //             //   "reason_for_short_supply": "comment"
    //             // },
    //           ]
    //         },
    //       ]
    //     }
    //   ]
    // }
  ];
  cropWiseData2: any[] =
    [
      {
        "crop_name": "WHEAT (GEHON)",
        "crop_code": "A0104",
        "total_indent": 2311.7999999999997,
        "total_allocate_quantity": 535.6,
        "total_lifted_quantity": 24.700000000000003,
        "total_bspc": 2,
        "total_variety": 2,
        "variety": [
          {
            "name": "GW-190",
            "variety_id": 29855,
            "variety_code": "A0104002",
            "total_indent": 410.2,
            "total_allocate_quantity": 535.6,
            "total_lifted_quantity": 2.1,
            "total_spa": 1,
            "total_bspc": 1,
            "spa": [
              {
                "name": "kmsdn",
                "SPA_code": "SPA123",
                "state_code": 9,
                "indent_quntity": 0,
                "allocate_quantity": 0,
                "lifted_quantity": 2.1,
                "total_bspc": 1,
                "bspcs": [
                  {
                    "name": "IRWR Karnal",
                    "code": "0001",
                    "state": "UP",
                    "district": "Agra",
                    "alloaction": 100,
                    "lifting": 80,
                    "unlifted": 20,
                    "reason_for_short_supply": "comment"
                  }
                ],
                "indent_quantity": 210.2
              }
            ]
          },
          {
            "name": "WH-896",
            "variety_id": 29860,
            "variety_code": "A0104007",
            "total_indent": 10.1,
            "total_allocate_quantity": 535.6,
            "total_lifted_quantity": 0,
            "total_spa": 1,
            "total_bspc": 1,
            "spa": [
              {
                "name": "kmsdn",
                "SPA_code": "SPA123",
                "state_code": 9,
                "indent_quntity": 0,
                "allocate_quantity": 0,
                "lifted_quantity": 0,
                "total_bspc": 1,
                "bspcs": [
                  {
                    "name": "IRWR Karnal",
                    "code": "0001",
                    "state": "UP",
                    "district": "Agra",
                    "alloaction": 100,
                    "lifting": 80,
                    "unlifted": 20,
                    "reason_for_short_supply": "comment"
                  },
                ],
                "indent_quantity": 10.1
              }
            ]
          }
        ]
      }
    ];

  cropWiseData1: any;
  bspVariable: boolean;
  dropdownSettings1: IDropdownSettings = {};

  constructor(private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private router: Router,
    private indentorService: IndenterService
  ) {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_group: [''],
      crop_name: [''],
      crop_type: [''],
      crop_text: [''],
      name_text: [''],
      variety_name_text: [''],
      variety_name: [''],


    });

    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorSpaSeason(newValue)
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.ngForm.controls['variety_name_text'].setValue('');
      }

    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropType(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.ngForm.controls['variety_name_text'].setValue('');
      }

    });
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropGroup(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['variety_name_text'].setValue('');
      }

    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorVariety(newValue)
        this.ngForm.controls['variety_name'].setValue('');
        this.variety_names = ''
      }

    });

  }

  ngOnInit(): void {
    this.yearsData = [];
    this.getIndentorSpaYear()
    this.dropdownSettings = {
      idField: 'crop_code',
      // idField: 'item_id',
      textField: 'crop_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'id',
      // idField: 'item_id',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
    // let dataArray = [];
    // this.cropWiseData.forEach(element => {
    //   element.spa.forEach(ele => {

    //     element.bspcs.forEach(eles => {
    //       if(eles === undefined && eles.length == 0 ){
    //         this.cropWiseData1.spa.bspcs.name = "NA";
    //         this.cropWiseData1.spa.bspcs.code = "NA";
    //         this.cropWiseData1.spa.bspcs.state = "NA";
    //         this.cropWiseData1.spa.bspcs.district = "NA";
    //         this.cropWiseData1.spa.bspcs.alloaction = "NA";
    //         this.cropWiseData1.spa.bspcs.lifting = "NA";
    //         this.cropWiseData1.spa.bspcs.unlifted = "NA";
    //         this.cropWiseData1.spa.bspcs.reason_for_short_supply = "NA";
    //       }
    //     })
    //   })
    //   this.cropWiseData.push(this.cropWiseData1);
    // });
  }
  getCropGroupList(newValue) {
    let object = {
      "year": Number(this.ngForm.controls['year_of_indent'].value),
      "season": newValue
    }

    this.cropGroupData = []
    this.breederService.postRequestCreator("getCropGroupDataForProducedBreederSeedDetails", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        data.EncryptedResponse.data.forEach(element => {
          this.cropGroupData.push({
            value: element['group_code'],
            name: element['m_crop_group.group_name']
          })
        });
        this.cropGroupDataSecond = this.cropGroupData
      }
    })
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }


  async onSearch() {
    this.tableData = [
      [
        { content: 'Row 1, Column 1', colspan: 2, rowspan: 2 },
        { content: 'Row 1, Column 3' },
        { content: 'Row 1, Column 4' }
      ],
      [
        { content: 'Row 2, Column 3', colspan: 2 },
        { content: 'Row 2, Column 4' }
      ],
      [
        { content: 'Row 3, Column 1', rowspan: 2 },
        { content: 'Row 3, Column 2' },
        { content: 'Row 4, Column 2' }
      ],
      [
        { content: 'Row 4, Column 1' },
        { content: 'Row 5, Column 1' },
        { content: 'Row 6, Column 1' }
      ]
    ];
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please select something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please select Crop Type.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {
      let searchObject = {};
      this.selectedYear = 'NA';
      this.selectedCropGroup = 'NA';
      this.selectedCropName = 'NA';
      let varietyDataName = this.ngForm.controls['variety_name_text'].value;
      let cropName = this.ngForm.controls['crop_name'].value;
      let cropNameArr = [];
      let varietyNameArr = [];
      this.enableTable = true;
      for (let i in cropName) {
        cropNameArr.push(cropName && cropName[i] && cropName[i].crop_code ? cropName[i].crop_code : '')
      }
      for (let i in varietyDataName) {
        varietyNameArr.push(varietyDataName && varietyDataName[i] && varietyDataName[i].id ? varietyDataName[i].id : '')
      }
      for (let i in cropName) {
        this.cropNameArrData.push(cropName && cropName[i] && cropName[i].crop_name ? cropName[i].crop_name : '')
      }
      this.cropname = this.cropNameArrData.toString();
      let cropType;
      if (this.ngForm.controls['crop_type'].value == "agriculture") {
        cropType = "Agriculture"
      } else {
        cropType = "Horticulture"
      }
      const param = {
        // search: {
        indent_year: this.ngForm.controls["year_of_indent"].value,
        season: this.ngForm.controls["season"].value,
        crop_type: cropType,
        varierty_id:varietyNameArr,
        crop_code: cropNameArr
      }
      let route = "report-lifting";

      this.breederService.postRequestCreator(route, null, param).subscribe(res => {
        if (res.EncryptedResponse.status_code == 200) {
          let cropDataclone = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
          // let cropDataclone = this.cropWiseData;
            this.cropWiseData1 = cropDataclone;
            console.log(this.cropWiseData1,'this.cropWiseData1')
          this.bspVariable = true;
          // cropDataclone.forEach(element => {
          //   if (element.total_bspc != undefined && element.total_bspc.length != 0 && element.total_bspc != '') {
          //     element.variety.forEach(ele => {
          //       if (ele.total_bspc != undefined && ele.total_bspc != 0 && ele.total_bspc != '') {
          //         ele.spa.forEach(item => {
          //           if (item.total_bspc != undefined && item.total_bspc != 0 && item.total_bspc != '') {
          //           } else {
          //             this.cropWiseData1 = [];
          //             this.bspVariable = false;
          //           }
          //         })
          console.log(this.cropWiseData1,'cropWiseData1cropWiseData1')
          //       } else {
          //         this.cropWiseData1 = [];
          //         this.bspVariable = false;
          //       }
          //     });
          //   } else {
          //     this.cropWiseData1 = [];
          //     this.bspVariable = false;

          //   }
          // });
          // if (this.bspVariable) {
          //   this.cropWiseData1 = cropDataclone;
          // }
         
        } else {
          this.cropWiseData1 = [];
        }
      });
    }
  }

  sumArray(a, b) {
    var c = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      c.push((a[i] || 0) + (b[i] || 0));
    }
    return c;
  }
  cropNameList(newValue) {
    let object = {
      "year": Number(this.ngForm.controls['year_of_indent'].value),
      "season": this.ngForm.controls['season'].value,
      // "group_code": newValue
    }

    this.cropData = []
    this.breederService.postRequestCreator("getCropDataForProducedBreederSeedDetails", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        data.EncryptedResponse.data.forEach(element => {
          this.cropData.push({
            value: element['crop_code'],
            name: element['m_crop.crop_name']
          })
          this.cropDataSecond = this.cropData
        });
      }
    })
  }

  clear() {
    this.ngForm.controls['year_of_indent'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_group'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['crop_type'].setValue('');
    this.ngForm.controls['variety_name_text'].patchValue('');
    this.cropNameArrData = []
    this.variety_names = '';
    this.enableTable = false;
    this.seasonList = [];
    this.cropGroupList = [];
    this.cropTypeList = [];

    this.isCropName = false;

    this.varietyData = []
    this.selectedYear = '';
    this.selectedCropGroup = '';
    this.selectedCropName = '';
    this.finalData = []
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
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'submitted-Indents-of-Breeder-Seed-Crop-Wise-report';
    const element = document.getElementById('pdf-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropGroup(item: any) {
    this.ngForm.controls['crop_text'].setValue('')
    this.crop_groups = item && item.name ? item.name : '';

    this.ngForm.controls['crop_group'].setValue(item && item.value ? item.value : '');

  }
  cnclick() {
    document.getElementById('crop_name').click();
  }
  crop_name(item: any) {
    this.selectCrop_name = item && item.name ? item.name : '';
    this.ngForm.controls["name_text"].setValue("");
    this.ngForm.controls['crop_name'].setValue(item && item.value ? item.value : '')
  }
  getIndentorSpaYear() {
    this.indentorService.postRequestCreator('get-indentor-year-list', null, {
      search:{
        type:"indenter"
      }
    }).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorSpaSeason(newValue) {
    const param = {
      search: {
        year: newValue,
        type:"indenter"
      }
    }
    this.indentorService.postRequestCreator('get-indentor-season-list', null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorCropGroup(newValue) {
    const param = {
      // search:{
      //   season:newValue,
      //   year:this.ngForm.controls['year_of_indent'].value
      // }
      search: {
        crop_type: newValue,
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        type:"indenter"
      }
    }
    this.indentorService.postRequestCreator('get-indentor-cropGroup-list', null, param).subscribe(data => {
      this.cropGroupList = data && data.EncryptedResponse && data.EncryptedResponse.data;



    })
  }
  getIndentorCropType(newValue) {
    const param = {
      search: {
        season: newValue,
        year: this.ngForm.controls['year_of_indent'].value,
        type:"indenter"
      }
    }
    this.indentorService.postRequestCreator('getindentorCropTypelist', null, param).subscribe(data => {
      this.cropTypeList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorVariety(newValue) {
    let crop_codeArr = []
    for (let i in newValue) {
      crop_codeArr.push(newValue[i].crop_code)
    }
    const param = {
      search: {
        crop_type: this.ngForm.controls['crop_type'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: crop_codeArr,
        type:"indenter"
      }
    }
    this.indentorService.postRequestCreator('getindentorVarietylistNew', null, param).subscribe(data => {
      this.cropVarietList = data && data.EncryptedResponse && data.EncryptedResponse.data;
      console.log('this.cropVarietList====', this.cropVarietList);
      // this.cropVarietListsecond = this.cropVarietList;
      // let varietyData = [];
      // this.cropVarietList.forEach(element => {
      //   varietyData.push(element.m_crop_variety);
      // });
      this.cropVarietListsecond = this.cropVarietList;
      console.log('variety data===', this.cropVarietListsecond);
    })
  }
  varietyNames(data) {
    this.variety_names = data && data.variety_name ? data.variety_name : '';
    this.ngForm.controls['variety_name'].setValue(data && data.variety_code ? data.variety_code : '')
  }
  cvClick() {
    document.getElementById('variety_name').click();
  }

  mergeJsonDataByIdAndName(jsonArray1, jsonArray2) {
    const mergedData = {};
    let results = []

    jsonArray1.forEach(obj => {
      const id = obj.crop_name;
      const name = obj.variety_name;

      if (!mergedData[id]) {
        mergedData[id] = {};
      }

      if (!mergedData[id][name]) {
        mergedData[id][name] = obj;
      }
    });

    jsonArray2.forEach(obj => {
      const id = obj.crop_name;
      const name = obj.variety_name;

      if (!mergedData[id]) {
        mergedData[id] = {};
      }

      if (!mergedData[id][name]) {
        mergedData[id][name] = obj;
      }
    });

    return Object.values(mergedData).reduce((result, obj) => {
      results.push(...Object.values(obj));
      return results;
    }, []);
  }

  mapDuplicateData(jsonArray, uniqueKey) {
    const duplicateDataMap = new Map();

    jsonArray.forEach(obj => {
      const key = obj[uniqueKey];

      if (duplicateDataMap.has(key)) {
        duplicateDataMap.get(key).push(obj);
      } else {
        duplicateDataMap.set(key, [obj]);
      }
    });

    return Array.from(duplicateDataMap.values()).filter(data => data.length > 0);
  }
  mapArraysById(array1, array2) {
    const mappedArray = array1.reduce((result, item) => {
      result[item.crop_name] = {
        ...result[item.crop_name],
        ...item,
      };
      return result;
    }, {});

    return array2.map(item => ({
      ...item,
      ...mappedArray[item.crop_name],
    }));
  }

  mapArraysByIdAndKey(array1, array2,) {
    const mappedArray = array1.reduce((result, item) => {
      result[item] = {
        ...result[item],
        ...item,
      };
      return result;
    }, {});

    return array2.map(item => ({
      ...item,
      ...mappedArray[item.variety_name],
    }));
  }
  createNestedJSONById(mainArray, nestedArray, idKey, nestedKey) {
    return mainArray.varities.reduce((result, item) => {
      const nestedItems = nestedArray.varities.spaname.filter(nestedItem => nestedItem[idKey] === item[idKey]);
      if (nestedItems.length > 0) {
        item[nestedKey] = nestedItems;
      }
      result.push(item);
      return result;
    }, []);
  }
  getVariety(data) {
    let cropName = []
    for (let i in data) {
      cropName.push(data[i].name)
    }
    console.log('da', cropName)
    return cropName
  }
  getRowspan(dataArray: any[], index: number) {
    // let rowspan = 1;
    // const currentItem = dataArray[index].item;

    // for (let i = index - 1; i >= 0; i--) {
    //   if (dataArray[i].item === currentItem) {
    //     rowspan++;
    //   } else {
    //     break;
    //   }
    // }

    // return rowspan;
  }

  getUniqueData(item) {
    let arr = []
    for (let itemi in item) {
      arr.push(item[itemi])
    }
    let newData = [...new Set(arr)];
    console.log('.newData', newData)
    // let arr=[]
    // arr.push(item)
    // let newArr = [...new Set(arr)]
    // console.log('newArr',newArr) 
    // return [...new Set(arr)];
  }

}
