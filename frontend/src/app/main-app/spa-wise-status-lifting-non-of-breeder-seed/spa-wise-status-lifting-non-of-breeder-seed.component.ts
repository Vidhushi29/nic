
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
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-spa-wise-status-lifting-non-of-breeder-seed',
  templateUrl: './spa-wise-status-lifting-non-of-breeder-seed.component.html',
  styleUrls: ['./spa-wise-status-lifting-non-of-breeder-seed.component.css']
})
export class SpaWiseStatusLiftingNonOfBreederSeedComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  fileName = 'allocation-of-breeder-seeds-to-indentors-for-lifting-report.xlsx';

  yearsData: any;
  seasonData: any;
  cropGroupData: any;
  cropData: any;
  crop_groups;

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
  cropTypeList: any;
  dataList: any;
  totalIndentedQuantitySum: number;
  allocatedQtySum: number;
  lifted_quantityQty: number;
  itemtotalUnlifitedQty: number;
  // spaWiseData:any;
  spaWiseData: any[] = [
    {
      "spa_name": "Rajendra",
      "spa_code": "1011",
      "state_code": 23,
      "total_indent": 50,
      "total_allocate_quantity": 220,
      "total_lifted_quantity": 132,
      "total_bspc": 6,
      "total_crop": 2,
      "crop": [
        {
          "name": "crop 1",
          "crop_code": "A0101",
          "total_indent": 50,
          "total_allocate_quantity": 220,
          "total_lifted_quantity": 132,
          "total_bspc": 4,
          "total_variety": 2,
          "variety": [{
            "name": "variety 1",
            "variety_id": 102,
            "variety_code": "A01010024",
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
                "district": "Agra",
                "alloaction": 100,
                "lifting": 80,
                "unlifted": 20,
                "reason_for_short_supply": "comment"
              },

            ]
          },
          {
            "name": "variety 2",
            "variety_id": 102,
            "variety_code": "A0101002",
            "indent_quntity": 10,
            "allocate_quantity": 20,
            "lifted_quantity": 12,
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
        {
          "name": "crop 2",
          "crop_code": "A0102",
          "total_indent": 10,
          "total_allocate_quantity": 20,
          "total_lifted_quantity": 12,
          "total_bspc": 4,
          "total_variety": 2,
          "variety": [
            {
              "name": "variety 2",
              "variety_id": 102,
              "variety_code": "A0101002",
              "indent_quntity": 10,
              "allocate_quantity": 20,
              "lifted_quantity": 12,
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



      ]
    },
    {
      "spa_name": "Rajendra",
      "spa_code": "1011",
      "state_code": 23,
      "total_indent": 50,
      "total_allocate_quantity": 220,
      "total_lifted_quantity": 132,
      "total_bspc": 6,
      "total_crop": 2,
      "crop": [
        {
          "name": "crop 1",
          "crop_code": "A0101",
          "total_indent": 50,
          "total_allocate_quantity": 220,
          "total_lifted_quantity": 132,
          "total_bspc": 4,
          "total_variety": 2,
          "variety": [{
            "name": "variety 1",
            "variety_id": 102,
            "variety_code": "A01010024",
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
                "district": "Agra",
                "alloaction": 100,
                "lifting": 80,
                "unlifted": 20,
                "reason_for_short_supply": "comment"
              },

            ]
          },
          {
            "name": "variety 2",
            "variety_id": 102,
            "variety_code": "A0101002",
            "indent_quntity": 10,
            "allocate_quantity": 20,
            "lifted_quantity": 12,
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
        {
          "name": "crop 2",
          "crop_code": "A0102",
          "total_indent": 10,
          "total_allocate_quantity": 20,
          "total_lifted_quantity": 12,
          "total_bspc": 4,
          "total_variety": 2,
          "variety": [
            {
              "name": "variety 2",
              "variety_id": 102,
              "variety_code": "A0101002",
              "indent_quntity": 10,
              "allocate_quantity": 20,
              "lifted_quantity": 12,
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



      ]
    },
  ];

  cropNameArrData: any;
  enableTable: boolean;
  spaWiseData1: any;
  cropGroupList: any;
  state_cultivation: any;
  dropdownSettings: {
    idField: string;
    // idField: 'item_id',
    textField: string; enableCheckAll: boolean; allowSearchFilter: boolean;
    // itemsShowLimit: 2,
    limitSelection: number;
  };
  spaDataList: any;
  // dropdownSettings1 = 
  dropdownSettings1: IDropdownSettings = {};
  // dropdownSettings1: {
  //   idField: string;
  //   // idField: 'item_id',
  //   textField: string; 
  //   enableCheckAll: boolean; 
  //   allowSearchFilter: boolean;
  //   // itemsShowLimit: 2,
  //   limitSelection: number;
  // };
  bspVariable: boolean;

  constructor(
    private breederService: BreederService,
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
      crop_text: [''],
      name_text: [''],
      crop_type: [''],
      spa_name: ['']
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropGroupData = this.cropGroupDataSecond
        let response = this.cropGroupData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropGroupData = response
      }
      else {

      }
    });

    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropData = this.cropDataSecond;
        let response = this.cropData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropData = response
      }
      else {
        this.cropNameList(this.ngForm.controls['crop_group'].value)
      }
    });
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['crop_type'].patchValue("");
        this.seasonData = []
        this.getIndentorSpaSeason(newValue)
      }
    })
  }

  ngOnInit(): void {
    this.yearsData = [];
    this.dropdownSettings = {
      idField: 'crop_code',
      // idField: 'item_id',
      textField: 'crop_name',
      enableCheckAll: false,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'spa_code',
      // idField: 'item_id',
      textField: 'short_name',
      enableCheckAll: false,  
      // enableCheckAll: false,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      // limitSelection: -1,
    };
    this.getIndentorSpaYear()



    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropType(newValue)
        this.ngForm.controls['crop_type'].patchValue("");
        // this.getIndentorCropGroup(newValue)
      }
    })
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropGroup(newValue)
        this.getIndentorSPAsData(newValue);
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['spa_name'].patchValue("");

      }

    });
    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isCropName = true
        this.ngForm.controls['crop_name'].patchValue("");

        this.cropNameList(newValue)

      }
    })
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      // console.log(response)   


      if (newValue) {
        // this.getCropData()
        this.cropGroupData = this.cropGroupDataSecond;
        let response = this.cropGroupData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropGroupData = response

      }
      else {
      }
    });
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
  getIndentorSPAsData(newValue) {
    let cropType;
    if (this.ngForm.controls['crop_type'].value == "agriculture") {
      cropType = "agriculture"
    } else {
      cropType = "horticulture"
    }
    const param = {
      search: {
        crop_type: cropType,
        season:this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        type:"indenter"
      }
    }
    this.indentorService.postRequestCreator('get-all-spa-data', null, param).subscribe(data => {
      let spaDataList = data && data.EncryptedResponse && data.EncryptedResponse.data;
      let spaData = [];
      spaDataList.forEach((ele,i)=>{
        if(ele.short_name == "" || ele.short_name === null){
        delete spaData[i] ;
        }else{
          spaData.push(ele)
        }
      })
      if(spaData && spaData !== undefined && spaData.length >0){
        this.spaDataList = spaData
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
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_group"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please select something.</p>',
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
      this.selectedCropName = 'NA'

      if (this.ngForm.controls["year_of_indent"] && this.ngForm.controls["year_of_indent"].value) {
        searchObject['year'] = Number(this.ngForm.controls["year_of_indent"].value);
        this.selectedYear = this.ngForm.controls["year_of_indent"].value;
      }

      if (this.ngForm.controls["season"] && this.ngForm.controls["season"].value) {
        searchObject['season'] = this.ngForm.controls["season"].value;
      }

      if (this.ngForm.controls["crop_group"] && this.ngForm.controls["crop_group"].value) {
        searchObject['group_code'] = this.ngForm.controls["crop_group"].value;

        this.cropGroupData.forEach(element => {
          if (element.value == this.ngForm.controls["crop_group"].value) {
            this.selectedCropGroup = element['name']
          }
        });
      }


      const data = localStorage.getItem('');

      let cropName = this.ngForm.controls['crop_name'].value;
      let cropNameArr = [];
      this.enableTable = true;
      let cropNameArrData = [];
      for (let i in cropName) {
        cropNameArr.push(cropName && cropName[i] && cropName[i].crop_code ? cropName[i].crop_code : '')
      }
      for (let i in cropName) {
        cropNameArrData.push(cropName && cropName[i] && cropName[i].crop_name ? cropName[i].crop_name : '')
        this.cropNameArrData = cropNameArrData;
      }
      let spaNameArr = [];
      let spasData = this.ngForm.controls['spa_name'].value;
      for (let i in spasData) {
        spaNameArr.push(spasData && spasData[i] && spasData[i].spa_code ? spasData[i].spa_code : '')
      }
      const pageData = [];
      let cropType;
      if (this.ngForm.controls['crop_type'].value == "agriculture") {
        cropType = "Agriculture"
      } else {
        cropType = "Horticulture"
      }


      let route = "lifting-nonlifting-spa-report";
      this.breederService.postRequestCreator(route, null, {
        indent_year: this.ngForm.controls["year_of_indent"].value,
        season: this.ngForm.controls["season"].value,
        crop_type: cropType,
        spa_code: spaNameArr,
        crop_code: cropNameArr
      }).subscribe(res => {
        if (res.EncryptedResponse.status_code == 200) {
          let spaWiseData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
          console.log('spaisedata========', spaWiseData);
          this.bspVariable = true;
          this.spaWiseData1 = spaWiseData;
          // spaWiseData.forEach(element => {
          //   if (element.total_bspc != undefined && element.total_bspc.length != 0 && element.total_bspc != '') {
          //     element.crop.forEach(ele => {
          //       if (ele.total_bspc != undefined && ele.total_bspc.length != 0 && ele.total_bspc != '') {
          //         ele.variety.forEach(item => {
          //           if (item.total_bspc != undefined && item.total_bspc.length != 0 && item.total_bspc != '') {
                    
          //           } else {
          //             this.spaWiseData1 = [];
          //             this.bspVariable = false;
          //           }
          //         })
          //       } else {
          //         this.spaWiseData1 = [];
          //         this.bspVariable = false;
          //       }
          //     });
          //   } else {
          //     this.spaWiseData1 = [];
          //     this.bspVariable = false;
          //   }
          // });
          // if (this.bspVariable) {
          //   this.spaWiseData1 = spaWiseData;
          // }
        } else {
          this.spaWiseData1 = [];
        }
      })
    }
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
    this.ngForm.controls['crop_type'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
    this.ngForm.controls['spa_name'].patchValue("");
    this.isCropName = false;

    this.varietyData = []
    this.selectedYear = '';
    this.selectedCropGroup = '';
    this.selectedCropName = '';
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
    const name = 'allocation-of-breeder-seeds-to-indentors-for-lifting-report';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
}