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
// import { T } from 'node_mod/@angular/cdk/keycodes';

@Component({
  selector: 'app-spa-allocation-report',
  templateUrl: './spa-allocation-report.component.html',
  styleUrls: ['./spa-allocation-report.component.css']
})
export class SpaAllocationReportComponent implements OnInit {

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
  items1: any = [];
  items: any = [];
  grandAllocation: any = [
    {
      "total_allocation": 100
    },
    {
      "total_allocation": 100
    },
    {
      "total_allocation": 100
    },
    {
      "total_allocation": 300 //Total of all indents			
    }

  ]
  grandTotalProduction: any = 300
  totalDificit: any = 300
  grand_total: any = 300;
  grandIndent: any = []
  reportParam = { "year": null, "season": null, "crop_code": null, };

  item3: any = {
    "EncryptedResponse": {
      "status_code": 200,
      "message": "Data found successfully",
      "data": [
        {
          "grandTotalProduction": 130,
          "totalDificit": "0.33",
          "grandAllocation": [
            {
              "total_allocation": 43
            },
            {
              "total_allocation": 86.67
            },
            {
              "total_allocation": 16.67
            },
            {
              "total_allocation": 129.67000000000002
            }
          ],
          "grandIndent": [
            {
              "indent_quantity": 60
            },
            {
              "indent_quantity": 86.67
            },
            {
              "indent_quantity": 120
            },
            {
              "indent_quantity": 180
            }
          ],
          "allocations": [
            {
              "variety_code": "A0104111",
              "variety_name": "Rajlaxmi(HP-1731)",
              "notification_year": "2000",
              "surplus_dificit": "-100",
              "indenter": [
                {
                  "name": "ABB",
                  "full_name": "AGGARWAL BEEJ BHANDAR, RAMA "
                },
                {
                  "name": "ASF",
                  "full_name": "AKAL SEED FARM, SADDA SINGH WALA "
                },
                {
                  "name": "YSA",
                  "full_name": "Yamuna seee Agency"
                }
              ],
              "indent_quantity": [
                {
                  "indent_quantity": 100
                },
                {
                  "indent_quantity": 100
                },
                {
                  "indent_quantity": 100
                },
                {
                  "indent_quantity": 300 //Total of all indents			
                }
              ],
              "allocation": [
                {
                  "quantity": [50, 0, 50],
                  "total_quantity": 100, //total of allocation
                  "bspc_name": "Bheem",
                  "bspc_produced": 200
                },
                {
                  "quantity": [50, 0, 50],
                  "total_quantity": 100, //total of allocation
                  "bspc_name": "Bheem",
                  "bspc_produced": 200
                },
                {
                  "quantity": [50, 0, 50],
                  "total_quantity": 100, //total of allocation
                  "bspc_name": "Bheem",
                  "bspc_produced": 200
                }

              ],
              "total_allocation": [
                {
                  "total_allocation": 100
                },
                {
                  "total_allocation": 100
                },
                {
                  "total_allocation": 100
                },
                {
                  "total_allocation": 300 //Total of all indents			
                }

              ]

            },
            {
              "variety_code": "A0104111",
              "variety_name": "Aditya (HD-2781)",
              "notification_year": "2000",
              "surplus_dificit": "-100",
              "indenter": [
                {
                  "name": "ABB",
                  "full_name": "AGGARWAL BEEJ BHANDAR, RAMA "
                },
                {
                  "name": "ASF",
                  "full_name": "AKAL SEED FARM, SADDA SINGH WALA "
                },
                {
                  "name": "YSA",
                  "full_name": "Yamuna seee Agency"
                }
              ],
              "indent_quantity": [
                {
                  "indent_quantity": 100
                },
                {
                  "indent_quantity": 100
                },
                {
                  "indent_quantity": 100
                },
                {
                  "indent_quantity": 300 //Total of all indents			
                }
              ],
              "allocation": [
                {
                  "quantity": [50, 0, 50],
                  "total_quantity": 100, //total of allocation
                  "bspc_name": "Bheem",
                  "bspc_produced": 200
                },
                {
                  "quantity": [50, 0, 50],
                  "total_quantity": 100, //total of allocation
                  "bspc_name": "Oja",
                  "bspc_produced": 200
                },
                {
                  "quantity": [50, 0, 50],
                  "total_quantity": 100, //total of allocation
                  "bspc_name": "Ojha",
                  "bspc_produced": 200
                }

              ],
              "total_allocation": [
                {
                  "total_allocation": 100
                },
                {
                  "total_allocation": 100
                },
                {
                  "total_allocation": 100
                },
                {
                  "total_allocation": 300 //Total of all indents			
                }

              ]

            }

          ]
        }
      ]
    }
  }
  items2: any = [
    {
      grandTotalProduction: 300,
      totalDificit: 300,
      grandAllocation: [
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 300 //over all Total of all allocation			
        }

      ],
      grandIndent: [
        {
          "total_indent": 100
        },
        {
          "total_indent": 100
        },
        {
          "total_indent": 100
        },
        {
          "total_indent": 300 //over all Total of all indents			
        }

      ],

      "allocations": [
        {
          "variety_code": "A0104111",
          "variety_name": "Rajlaxmi(HP-1731)",
          "notification_year": "2000",
          "surplus_dificit": "-100",
          "indenter": [
            {
              "name": "ABB",
              "full_name": "AGGARWAL BEEJ BHANDAR, RAMA "
            },
            {
              "name": "ASF",
              "full_name": "AKAL SEED FARM, SADDA SINGH WALA "
            },
            {
              "name": "YSA",
              "full_name": "Yamuna seee Agency"
            }
          ],
          "indent_quantity": [
            {
              "indent_quantity": 100
            },
            {
              "indent_quantity": 100
            },
            {
              "indent_quantity": 100
            },
            {
              "indent_quantity": 300 //Total of all indents			
            }
          ],
          "allocation": [
            {
              "quantity": [50, 0, 50],
              "total_quantity": 100, //total of allocation
              "bspc_name": "Bheem",
              "bspc_produced": 200
            },
            {
              "quantity": [50, 0, 50],
              "total_quantity": 100, //total of allocation
              "bspc_name": "Bheem",
              "bspc_produced": 200
            },
            {
              "quantity": [50, 0, 50],
              "total_quantity": 100, //total of allocation
              "bspc_name": "Bheem",
              "bspc_produced": 200
            }

          ],
          "total_allocation": [
            {
              "total_allocation": 100
            },
            {
              "total_allocation": 100
            },
            {
              "total_allocation": 100
            },
            {
              "total_allocation": 300 //Total of all indents			
            }

          ]

        },
        {
          "variety_code": "A0104111",
          "variety_name": "Aditya (HD-2781)",
          "notification_year": "2000",
          "surplus_dificit": "-100",
          "indenter": [
            {
              "name": "ABB",
              "full_name": "AGGARWAL BEEJ BHANDAR, RAMA "
            },
            {
              "name": "ASF",
              "full_name": "AKAL SEED FARM, SADDA SINGH WALA "
            },
            {
              "name": "YSA",
              "full_name": "Yamuna seee Agency"
            }
          ],
          "indent_quantity": [
            {
              "indent_quantity": 100
            },
            {
              "indent_quantity": 100
            },
            {
              "indent_quantity": 100
            },
            {
              "indent_quantity": 300 //Total of all indents			
            }
          ],
          "allocation": [
            {
              "quantity": [50, 0, 50],
              "total_quantity": 100, //total of allocation
              "bspc_name": "Bheem",
              "bspc_produced": 200
            },
            {
              "quantity": [50, 0, 50],
              "total_quantity": 100, //total of allocation
              "bspc_name": "Oja",
              "bspc_produced": 200
            },
            {
              "quantity": [50, 0, 50],
              "total_quantity": 100, //total of allocation
              "bspc_name": "Ojha",
              "bspc_produced": 200
            }

          ],
          "total_allocation": [
            {
              "total_allocation": 100
            },
            {
              "total_allocation": 100
            },
            {
              "total_allocation": 100
            },
            {
              "total_allocation": 300 //Total of all indents			
            }

          ]

        }

      ]

    }

  ]

  items4: any = [
    {
      "variety_code": "A0104111",
      "variety_name": "Rajlaxmi(HP-1731)",
      "notification_year": "2000",
      "surplus_dificit": "-100",
      "indenter": [
        {
          "name": "ABB",
          "full_name": "AGGARWAL BEEJ BHANDAR, RAMA "
        },
        {
          "name": "ASF",
          "full_name": "AKAL SEED FARM, SADDA SINGH WALA "
        },
        {
          "name": "YSA",
          "full_name": "Yamuna seee Agency"
        }
      ],
      "indent_quantity": [
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 300 //Total of all indents			
        }
      ],
      "allocation": [
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        }

      ],
      "total_allocation": [
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 300 //Total of all indents			
        }

      ]

    },
    {
      "variety_code": "A0104111",
      "variety_name": "Aditya (HD-2781)",
      "notification_year": "2000",
      "surplus_dificit": "-100",
      "indenter": [
        {
          "name": "ABB",
          "full_name": "AGGARWAL BEEJ BHANDAR, RAMA "
        },
        {
          "name": "ASF",
          "full_name": "AKAL SEED FARM, SADDA SINGH WALA "
        },
        {
          "name": "YSA",
          "full_name": "Yamuna seee Agency"
        }
      ],
      "indent_quantity": [
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 300 //Total of all indents			
        }
      ],
      "allocation": [
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Oja",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Ojha",
          "bspc_produced": 200
        }

      ],
      "total_allocation": [
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 300 //Total of all indents			
        }

      ]

    }

  ]
  // fileName = 'allocation report.xlsx';
  reportData: any[];
  dummyData;
  tableData;
  dropdownSettings1: {
 
  };

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


    this.ngForm.controls['variety_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropVarietList = this.cropVarietListsecond;
        let response = this.cropVarietList.filter(x => x.m_crop_variety.variety_name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropVarietList = response
      }
      else {
        this.getIndentorVariety(this.ngForm.controls['crop_name'].value)
      }
    });
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorSpaSeason(newValue)
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
      }

    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropType(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
      }

    });
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropGroup(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
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

    // this.getReportData(null)
    this.yearsData = [];
    this.getIndentorSpaYear()
    this.dropdownSettings = {
      singleSelection: true,

      idField: 'crop_code',
      // idField: 'item_id',
      textField: 'crop_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,

    };
    this.dropdownSettings1 = {
      idField: 'id',
      // idField: 'item_id',
      textField: 'variety_name',
      enableCheckAll: false,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
    };
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


  onSearch() {

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
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season And Crop Type.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
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
      let cropName = this.ngForm.controls['crop_name'].value;
      let varietyDataName = this.ngForm.controls['variety_name'].value
      let cropNameArr = [];
      this.enableTable = true;
      let varietyNameArr = [];
      for (let i in cropName) {
        cropNameArr.push(cropName && cropName[i] && cropName[i].crop_code ? cropName[i].crop_code : '')
      }
      for (let i in cropName) {
        this.cropNameArrData.push(cropName && cropName[i] && cropName[i].crop_name ? cropName[i].crop_name : '')
      }
      for (let i in varietyDataName) {
        varietyNameArr.push(varietyDataName && varietyDataName[i] && varietyDataName[i].variety_code ? varietyDataName[i].variety_code : '')
      }
      this.cropname = this.cropNameArrData.toString();
      const param = {
        search: {
          year: this.ngForm.controls["year_of_indent"].value,
          season: this.ngForm.controls["season"].value,
          crop_type: this.ngForm.controls['crop_type'].value,
          variety_code: varietyNameArr,
          crop_code: cropNameArr,
          type: "indenter"
        }
      }
      this.reportParam = { "year": this.ngForm.controls["year_of_indent"].value.toString(), "crop_code": cropNameArr[0], "season": this.ngForm.controls["season"].value }

      this.getReportData(this.reportParam)

      // this.indentorService.postRequestCreator('getAllocatedSpanName', null, param).subscribe(data => {
      //   this.spaName = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      // })
      this.indentorService.postRequestCreator('getIndentorCropWiseBreederSeed', null, param).subscribe(data => {
        let cropNameArr = []
        let arr = [];
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.dummyData = res;
        console.log("his.dummyDatahis.dummyData", this.dummyData)
        let varietyNameArr = [];


        this.reportData = res
        this.finalData = res;

        console.log('this.spaNassme', this.reportData,


        )



      })


      this.varietyData = [];
      const pageData = []
    }
    // this.reportHeader = reportParam;

    // if(this.IstPartFormGroupControls['cropName'] && this.IstPartFormGroupControls['cropName'].value){
    //   this.reportHeader['crop_name'] = this.IstPartFormGroupControls['cropName'].value['name'];
    // }

  }



  getReportData(reportParam) {
    // reportParam = {"year": "2024", "crop_code": "A0104", "season":"R"}
    this.breederService.postRequestCreator('allocation/indentor-report', null, reportParam).subscribe(dataList => {
      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.data && dataList.EncryptedResponse.data[0] && dataList.EncryptedResponse.status_code == 200) {
        // this.items = dataList.EncryptedResponse.data[0];
        // console.log("this.item3.data", this.item3.data)
        this.item3 = dataList.EncryptedResponse.data[0]
        console.log("this.item3.data22222", this.item3)

        this.items = this.item3.allocations
        this.grandAllocation = this.item3.grandAllocation
        this.grandIndent = this.item3.grandIndent
        console.log("grandIndentgrandIndent", this.grandIndent)
        this.totalDificit = this.item3.totalDificit
        this.grand_total = this.item3.totalDificit
        console.log("itemsitems", this.items)
        this.grandTotalProduction = this.item3.grandTotalProduction
      }
    })
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
      "group_code": newValue
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
    // ws['!freeze'] = {
    //   xSplit: 1,
    //   ySplit: 2,
    //   // top: 6,
    //   // left: 0,
    //   // activePane: 'bottomRight',
    // };

    // ws['!rows'] = [
    //   { hpt: 1 }, // Row 1
    //   { hpt: 1 }, // Row 2
    //   // Add more rows as needed
    // ];

    ws['!cols'] = [{ width: 8 }, { width: 20 }, { width: 20 }];
    ws['!freeze'] = { xSplit: 1, ySplit: 0, top: 0, left: 1 };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // XLSX.writeFile(wb, this.fileName);
    // utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    this.saveExcelFile(excelBuffer, 'frozen_rows_example.xlsx');


    // const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    // const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
    //   // Your data goes here
    //   ['Header 1', 'Header 2'],
    //   ['Data 1', 'Data 2'],
    //   ['Data 3', 'Data 4'],
    //   ['Data 5', 'Data 6'],
    // ]);

    // // Freeze the first two rows (rows 0 and 1)
    // worksheet['!freeze'] = {
    //   xSplit: 0,
    //   ySplit: 2,
    //   top: 2,
    //   left: 0,
    //   activePane: 'bottomRight',
    // };

    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    // this.saveExcelFile(excelBuffer, 'frozen_rows_example.xlsx');


  }

  saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  // download() {
  //   const name = 'submitted-Indents-of-Breeder-Seed-Crop-Wise-report';
  //   const element = document.getElementById('excel-table');
  //   const options = {
  //     filename: `${name}.pdf`,
  //     image: { type: 'jpeg', quality: 1 },
  //     html2canvas: {
  //       dpi: 192,
  //       scale: 4,
  //       letterRendering: true,
  //       useCORS: true
  //     },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //   };
  //   html2PDF().set(options).from(element).toPdf().save();
  // }
  download() {
    console.log("working")
    const name = 'selection-of-spa-for-submission-indent';
    const element = document.getElementById('pdf-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      margin: [10, 10, 10, 10],
      html2canvas: {
        dpi: 192,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait', width: 200 }
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
    const data = localStorage.getItem('BHTCurrentUser');
    const userData = JSON.parse(data)
    const param = {
      user_id: userData.id,
      search: {
        type: 'indenter'
      }
    }
    this.indentorService.postRequestCreator('get-indentor-year-list', null, param).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorSpaSeason(newValue) {
    const param = {
      search: {
        year: newValue,
        type: "indenter"
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
        type: "indenter"
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
        type: "indenter"
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
        type: "indenter"
      }
    }
    this.indentorService.postRequestCreator('getindentorVarietylistNew', null, param).subscribe(data => {
      this.cropVarietList = data && data.EncryptedResponse && data.EncryptedResponse.data;
      this.cropVarietListsecond = this.cropVarietList;
    })
  }
  varietyNames(data) {
    this.variety_names = data && data.variety_name ? data.variety_name : '';
    this.ngForm.controls['variety_name'].setValue(data && data.variety_code ? data.variety_code : '')
  } sss
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
    return item;
  }
  getCropType(crop_type) {
    let unit = crop_type.toLowerCase() === 'agriculture' ? 'Quintal' : 'Kg';
    return unit;
  }

}
