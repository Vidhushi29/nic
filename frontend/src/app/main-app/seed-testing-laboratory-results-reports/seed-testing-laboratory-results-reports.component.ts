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
import { MasterService } from '../../services/master/master.service';
// import { T } from 'node_mod/@angular/cdk/keycodes';
@Component({
  selector: 'app-seed-testing-laboratory-results-reports',
  templateUrl: './seed-testing-laboratory-results-reports.component.html',
  styleUrls: ['./seed-testing-laboratory-results-reports.component.css']
})
export class SeedTestingLaboratoryResultsReportsComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  fileName = 'seed-testing-laboratory-results-reports.xlsx';
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
  lotNumberList;
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
  reportStatuslift;
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
  dropdownSettings1: {
    idField: string;
    // idField: 'item_id',
    textField: string; enableCheckAll: boolean; allowSearchFilter: boolean;
    // itemsShowLimit: 2,
    limitSelection: number;
  };
  grandTotal;
  customWidth: number;
  customHeight: number;
  constructor(private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private master: MasterService,
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
      lot_numbers: [''],
      report_status: ['']


    });



    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorSpaSeason(newValue)
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.cropVarietListsecond = [];
        this.cropGroupList = [];
        this.cropTypeList = []
      }

    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropType(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.cropVarietListsecond = [];
        this.cropGroupList = [];
      }

    });
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCropGroup(newValue)
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['lot_numbers'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.cropVarietListsecond = [];

      }

    });
    this.ngForm.controls['variety_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorLotNumber(newValue)
        this.ngForm.controls['lot_numbers'].patchValue("");
        this.ngForm.controls['report_status'].patchValue("");


      }

    });
    this.ngForm.controls['lot_numbers'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getReportStatus(newValue)
        this.ngForm.controls['report_status'].patchValue("");


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
      textField: 'm_crop.crop_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'variety_id',
      // idField: 'item_id',
      textField: 'm_crop_variety.variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,

      // itemsShowLimit: 2,
      limitSelection: -1,
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



    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value && !this.ngForm.controls["crop_name"].value && !this.ngForm.controls["variety_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value && !this.ngForm.controls["crop_name"].value && !this.ngForm.controls["variety_name"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Season, Crop Type, Crop Name and Variety",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,

        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
      })

      return;
    }
    if ((!this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Crop Type",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,

        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
      })

      return;
    }
    if ((!this.ngForm.controls["crop_name"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Crop Name",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,

        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
      })

      return;
    }
    if ((!this.ngForm.controls["variety_name"].value)) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Variery",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,

        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
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
      console.log('varietyDataName', varietyDataName)
      for (let i in varietyDataName) {
        varietyNameArr.push(varietyDataName && varietyDataName[i] && varietyDataName[i].variety_id ? varietyDataName[i].variety_id : '')
      }
      this.cropname = this.cropNameArrData.toString();
      const param = {
        search: {
          year: this.ngForm.controls["year_of_indent"].value,
          season: this.ngForm.controls["season"].value,
          crop_type_bill_report: this.ngForm.controls['crop_type'].value == 'agriculture' ? 'A' : this.ngForm.controls['crop_type'].value == 'horticulture' ? 'H' : '',
          // crop_code: [this.ngForm.controls["crop_name"].value],
          // variety_id: [this.ngForm.controls["variety_name"].value],
          report_status: this.ngForm.controls["report_status"].value,
          lot_id: this.ngForm.controls["lot_numbers"].value,
          // lot_id: 222
          variety_id: varietyNameArr,
          crop_code: cropNameArr,

          // type:"seeddivision"
        }
      }
      this.breederService.postRequestCreator('seedtestingreportingapi', null, param).subscribe(data => {
        let cropNameArr = []
        let arr = [];
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.dummyData = res;

        console.log("Real API Data", this.dummyData)
        let varietyNameArr = [];


      })


      this.varietyData = [];
      const pageData = []
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
    this.ngForm.controls['lot_numbers'].setValue('');
    this.ngForm.controls['report_status'].setValue('');
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
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

  }

  // download() {
  //   const name = 'seed-testing-laboratory-results-reports';
  //   const element = document.getElementById('excel-table');
  //   const options = {
  //     filename: `${name}.pdf`,
  //     image: { type: 'jpeg', quality: 1 },
  //     margin: [10, 5, 5, 5],
  //     html2canvas: {
  //       dpi: 192,
  //       scale: 4,
  //       // width:288,
  //       letterRendering: true,
  //       useCORS: true
  //     },
  //     jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
  //   };
  //   html2PDF().set(options).from(element).toPdf().save();
  // }
  download() {
    const name = 'seed-testing-laboratory-results-reports';
    const element = document.getElementById('excel-table');
    // console.log("this.customHeight, this.customWidth", this.customHeight, this.customWidth)
    // console.log("this.1111111111111", customWidth, customHeight)

    // console.log("total ind", this.totalIndentor)
    let countIndenter = 10;
    // console.log("total ind", countIndenter)          
    // countIndenter = 25
    // let pageSize = 'a6'
    // 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6': ISO paper sizes.
    if(countIndenter <= 5){
      // pageSize = 'a2';
      // customWidth , customHeight
      const options = {
        margin: 10,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 4,
          letterRendering: true,
          useCORS: true
        },
        // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        jsPDF: { unit: 'mm',  format: [450, 1600] , orientation: 'portrait' }
      };
      html2PDF().set(options).from(element).toPdf().save();
    }else
    if(countIndenter > 5 && countIndenter <= 10){
      // pageSize = 'a2';
      // customWidth , customHeight
      const options = {
        margin: 10,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 4,
          letterRendering: true,
          useCORS: true
        },
        // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        jsPDF: { unit: 'mm',  format: [550, 1600] , orientation: 'portrait' }
      };
      html2PDF().set(options).from(element).toPdf().save();
    }else if(countIndenter > 10 && countIndenter <= 15){
      // pageSize = 'a1';
      this.customWidth = 750
      this.customHeight = 600
      alert("sadsd")
      const options = {
        margin: 10,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 4,
          letterRendering: true,
          useCORS: true
        },
        // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        jsPDF: { unit: 'mm',  format: [750, 1600] , orientation: 'portrait' }
      };
      html2PDF().set(options).from(element).toPdf().save();
    }else if(countIndenter > 15 && countIndenter <= 25){
      // pageSize = 'a0';     
      // this.customWidth = 1400
      // this.customHeight = 600
      const options = {
        margin: 10,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 4,
          letterRendering: true,
          useCORS: true
        },
        // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        jsPDF: { unit: 'mm',  format: [1200, 1600] , orientation: 'portrait' }
      };
      html2PDF().set(options).from(element).toPdf().save();
    }else if(countIndenter > 25 && countIndenter <= 35){
      // this.customWidth = 1600
      // this.customHeight = 600
      const options = {
        margin: 10,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 4,
          letterRendering: true,
          useCORS: true
        },
        // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        jsPDF: { unit: 'mm',  format: [1600, 1600] , orientation: 'portrait' }
      };
      html2PDF().set(options).from(element).toPdf().save();
  
    } else{
      // this.customWidth = 2000
      // this.customHeight = 600
      const options = {
        margin: 10,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 1,
          letterRendering: true,
          useCORS: true
        },
        // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        jsPDF: { unit: 'mm',  format: [2600, 1600] , orientation: 'portrait' }
      };
      html2PDF().set(options).from(element).toPdf().save();
  
    }
    // element.style.width = `${this.customWidth}px`;
    // element.style.width = `2000px`;


    // const options = {
    //   margin: 10,
    //   filename: `${name}.pdf`,
    //   image: { type: 'jpeg', quality: 1 },
    //   html2canvas: {
    //     dpi: 192,
    //     scale: 4,
    //     letterRendering: true,
    //     useCORS: true
    //   },
    //   // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
    //   jsPDF: { unit: 'mm',  format: [customHeight, 1600] , orientation: 'portrait' }
    // };
    // html2PDF().set(options).from(element).toPdf().save();

    // const options = {
    //   margin: 10,
    //   filename: 'your-page.pdf',
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    // };

    //  html2PDF().set(options).from(element).toPdf().save();
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
        type: 'seeddivision'
      }
    }
    this.master.postRequestCreator('getlotNumberyear', null, param).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorSpaSeason(newValue) {
    const param = {
      search: {
        year: newValue,
        type: "seeddivision"
      }
    }
    this.master.postRequestCreator('getlotNumberSeason', null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data
    })
  }
  getIndentorCropType(newValue) {
    const param = {
      search: {
        season: newValue,
        year: this.ngForm.controls['year_of_indent'].value,
        type: "seedDivision"
      }
    }
    this.master.postRequestCreator('getlotNumberCropType', null, param).subscribe(data => {
      this.cropTypeList = data && data.EncryptedResponse && data.EncryptedResponse.data;
      this.cropTypeList = this.cropTypeList.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.crop_Value === arr.crop_Value)))

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
        type: "seeddivision"
      }
    }
    this.master.postRequestCreator('getlotNumberCropName', null, param).subscribe(data => {
      this.cropGroupList = data && data.EncryptedResponse && data.EncryptedResponse.data;



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
        // crop_code: [],
        type: "indenter"
      }
    }
    this.master.postRequestCreator('getlotNumberVarietyName', null, param).subscribe(data => {
      this.cropVarietList = data && data.EncryptedResponse && data.EncryptedResponse.data;
      this.cropVarietListsecond = this.cropVarietList;
    })
  }

  getIndentorLotNumber(newValue) {

    let cropCodeValue = [];
    let varietyIdValue = [];
    if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value !== undefined && this.ngForm.controls['crop_name'].value.length > 0) {
      this.ngForm.controls['crop_name'].value.forEach(ele => {
        cropCodeValue.push(ele && ele.crop_code);
      })
    }
    if (this.ngForm.controls['variety_name'].value && this.ngForm.controls['variety_name'].value !== undefined && this.ngForm.controls['variety_name'].value.length > 0) {
      this.ngForm.controls['variety_name'].value.forEach(ele => {
        varietyIdValue.push(ele && ele.variety_id);
      })
    }
    const param = {
      // search:{
      //   season:newValue,
      //   year:this.ngForm.controls['year_of_indent'].value
      // }
      search: {
        crop_type: this.ngForm.controls['crop_type'].value,
        crop_code: cropCodeValue,
        variety_id: varietyIdValue,
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        type: "seeddivision"
      }
    }
    this.master.postRequestCreator('getlotNumberforseedtestingreport', null, param).subscribe(data => {
      this.lotNumberList = data && data.EncryptedResponse && data.EncryptedResponse.data;



    })
  }
  getReportStatus(newValue) {
    let cropCodeValue = [];
    let varietyIdValue = [];
    if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value !== undefined && this.ngForm.controls['crop_name'].value.length > 0) {
      this.ngForm.controls['crop_name'].value.forEach(ele => {
        cropCodeValue.push(ele && ele.crop_code);
      })
    }
    if (this.ngForm.controls['variety_name'].value && this.ngForm.controls['variety_name'].value !== undefined && this.ngForm.controls['variety_name'].value.length > 0) {
      this.ngForm.controls['variety_name'].value.forEach(ele => {
        varietyIdValue.push(ele && ele.variety_id);
      })
    }
    const param = {

      search: {
        crop_type: this.ngForm.controls['crop_type'].value,
        crop_code: cropCodeValue,
        variety_id: varietyIdValue,
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        lot_id: this.ngForm.controls['lot_numbers'].value,
        type: "seeddivision"
      }
    }
    this.master.postRequestCreator('getReportstatusforseedtestingreport', null, param).subscribe(data => {
      this.reportStatuslift = data && data.EncryptedResponse && data.EncryptedResponse.data;



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
    return item;
  }
  getCropType(crop_type) {
    let unit = crop_type.toLowerCase() === 'a' ? 'Quintal' : 'Kg';
    return unit;
  }
  getCropNamefrommlist(crop) {
    if (crop && crop !== undefined && crop.length > 0) {
      let cropNameArray = [];
      crop.forEach(element => {
        let temp = this.cropGroupList.filter(cn => cn.crop_code == element.crop_code)
        cropNameArray = [temp[0]['m_crop.crop_name']];
      });
      return cropNameArray.toString();
      // return temp && temp[0] && temp[0]['m_crop.crop_name'] && temp[0]['m_crop.crop_name'].length>30 ? temp[0]['m_crop.crop_name'].substring(0,30) + '...':temp[0]['m_crop.crop_name']; 
    }
  }

  getVarietyfrommlist(variety) {
    let varietyNameArray = [];
    if(variety && variety !== undefined && variety.length > 0){
      variety.forEach(ele=>{
        let temp = this.cropVarietListsecond.filter(vn => vn.variety_id == ele.variety_id)
        varietyNameArray.push(temp[0]['m_crop_variety.variety_name']);
      })
      return varietyNameArray.toString();
      // return temp && temp[0] && temp[0]['m_crop_variety.variety_name'] && temp[0]['m_crop_variety.variety_name'].length > 30 ? temp[0]['m_crop_variety.variety_name'].substring(0, 30) + '...' : temp[0]['m_crop_variety.variety_name'];
    }
  }
}




