import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as Highcharts from "highcharts";
import Swal from 'sweetalert2';
import { IndenterService } from '../services/indenter/indenter.service';
import { SeedServiceService } from '../services/seed-service.service';
import { convertDate,removeDuplicateObjectValues } from '../_helpers/utility';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-indentor-dashboard',
  templateUrl: './indentor-dashboard.component.html',
  styleUrls: ['./indentor-dashboard.component.css']
})
export class IndentorDashboardComponent implements OnInit {
  chart: any
  newtodayDate
  todayDate = new Date();
  seasonList: any;
  ngForm!: FormGroup;
  yearOfIndent = []
  cropTypeList: any;
  cropVarietyDataList: any;
  indentData: any;
  count: any;
  chartCrop = [];
  cropname = [];
  authUserId: any;
  allocateStatus: string;
  indentQty = [];
  variety: any;
  submitted: boolean = false;
  lifting: any[];
  notFound: boolean = false;
  filterData: any;
  totalLifted: any;
  unit: string;
  year: any;
  season: any;
  isYear: boolean = false;
  isSeason: boolean = false;
  indentYear: any[];
  isBsp1Completed: any;
  isBsp5Completed: any;
  allCombileData: boolean = false;
  cropDropdown: any[];
  chooseOnlyYear: boolean = false;
  chooseYearCrop: boolean = false;
  cropVariety: any;
  distinctCrop: any[];
  actualLifting: any[];
  crop_name: any;
  isCropName: boolean = false;
  liftingByCrop: any[];
  currentYear: number;
  dropdownSettings: IDropdownSettings = {};
  isSearch: boolean = false
    ;
  graphFilterCrop: any[];
  cropFilterData: any;
  showVariety: boolean;
  graphtitle: string;
  showIndenterVariety: boolean;
  varietyProductionValue: any;
  varietyAllocated: any;
  cropTypeLoginWise: any;
  cropProductionValue: any[];
  cropAllocated: any[];
  units: string;
  // options_variety: {
  //   chart: {
  //     type: string;
  //     // width:'500',
  //     overflow: string;
  //   }; title: { text: string; }; subtitle: {}; xAxis: { categories: any[]; crosshair: boolean; }; yAxis: { tickInterval: number; min: number; title: { text: string; }; scrollbar: { enabled: boolean; showFull: boolean; }; }; scrollbar: { enabled: boolean; }; tooltip: { headerFormat: string; pointFormat: string; footerFormat: string; shared: boolean; useHTML: boolean; }; plotOptions: { column: { pointPadding: number; borderWidth: number; }; }; colors: string[]; label: {
  //     // text: 'Plot line',
  //     align: string;
  //   }; credits: { enabled: boolean; }; legend: { symbolRadius: number; layout: string; align: string; verticalAlign: string; itemMarginTop: number; itemMarginBottom: number; enabled: boolean; }; series: { name: string; data: any; }[];
  // };
  constructor(
    private service: SeedServiceService,
    private fb: FormBuilder,
    private indenterService: IndenterService,
    private router: Router
  ) { this.createform() }
  createform() {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: ['K'],
      crop_name: [''],
      crop_type: ['A'],
      variety: [''],
      crop_name_graph: [''],
      variety_name_graph: ['']
    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getGraphFilterCropData();
      }
    })
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      this.ngForm.controls['season'].setValue('');
      this.ngForm.controls['crop_name'].setValue('');
      this.getCardFilterCropData();
    })
    
    this.ngForm.controls['crop_name_graph'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (newValue == "all_crop") {
          this.graphtitle = "Crop";
          this.showVariety = false;
          this.ngForm.controls['crop_name_graph'].setValue("all_crop");
        } else {
          this.showVariety = true;
          // this.showIndenterVariety = true;
          this.graphtitle = "Variety"
          this.getChartIndentDataVariety(this.ngForm.controls['crop_type'].value)
        }
      }
    })
  
  }

  ngOnInit(): void {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
    this.convertDate();
    //implement current date functionality
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.ngForm.controls['year_of_indent'].setValue(this.currentYear);

    if(this.ngForm.controls['crop_type'].value){
      this.units = (this.ngForm.controls['crop_type'].value == 'A') ? 'Quintal' : 'Kilogram';
    }	
   
    this.ngForm.controls['crop_name_graph'].setValue('all_crop')
    this.ngForm.controls['variety_name_graph'].setValue('all_crop')
    this.type();
 
    this.getGraphFilterCropData();
    // this.ngForm.controls['crop_name_graph'].patchValue('all_crop');
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      this.unit = (newValue == 'A') ? 'Quintal' : 'Kg';
      this.units = (this.ngForm.controls['crop_type'].value == 'A') ? 'Quintal' : 'Kilogram';
      this.ngForm.controls['year_of_indent'].setValue(this.currentYear);
      this.ngForm.controls['crop_name'].setValue('');
      this.ngForm.controls['season'].setValue('');
      this.getChartIndentData(newValue);
      this.getCountData(newValue);
      this.getFilterData(newValue);
      this.getTotalLifted(newValue);
      this.getIndenterDetails(newValue, 'filterData');
    })
   
    this.getGraphFilterCropData();
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_name'].setValue('');
        this.getCardFilterCropData()
      }
    })

    // this.getCropTypeData();
    // this.getCropVarietyData();
    this.chart = Highcharts.chart("container", this.options);
    this.chart = Highcharts.chart("variety-container", this.options_variety);
  }
  getGraphFilterCropData() {
    let cropArray = []
    console.log('this.ngForm.controls.value',this.ngForm.controls['crop_name'].value);
    if (this.ngForm.controls['crop_name'].value ) {
      let cropdataArray = this.ngForm.controls['crop_name'].value;
      cropdataArray.forEach(element => {
        cropArray.push(element);
      });
      this.graphFilterCrop = cropArray;
      console.log("this.graphFilterCrop======",this.graphFilterCrop)
    } else {
      this.graphFilterCrop = this.chartCrop;
      console.log("this.graphFilterCrop======",this.graphFilterCrop)
    }
  }
  type() {
    this.getSeasonData();
    this.getGraphFilterCropData();

    this.dropdownSettings = {
      idField: 'crop_code',
      textField: 'crop_name',
      enableCheckAll: false,
      limitSelection: -1,
    };
    this.ngForm.controls['season'].setValue('K');
    if (this.ngForm.controls['crop_type'].value == 'A') {
      this.unit = 'Quintal';
      this.getChartIndentData('A');
      this.getCountData('A');
      this.getFilterData('A');
      this.getTotalLifted('A');
      this.getIndenterDetails('A', 'filterData');
    } else {
      this.unit = 'Kilogram';
      this.getChartIndentData('H');
      this.getCountData('H');
      this.getFilterData('H');
      this.getTotalLifted('H');
      this.getIndenterDetails('H', 'filterData');
    }
  }

  graphShowHiddenFunctionality($event) { }
  options_sec: any = {}
  options_variety: any = {}
  getChartIndentData(cropType) {
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      return;
    }
    if ((!this.ngForm.controls["year_of_indent"].value)) {
      return;
    }
    if ((!this.ngForm.controls["crop_type"].value)) {
      return;
    }
    if ((!this.ngForm.controls["season"].value)) {
      return;
    }
    if (this.yearOfIndent && this.yearOfIndent.length > 0) {

      let year = this.yearOfIndent.filter(item => item.year == this.ngForm.controls['year_of_indent'].value)
      if ((year && year.length < 1)) {

        return;
      }
    }
    if (this.seasonList && this.seasonList.length > 0) {

      let seaonlist = this.seasonList.filter(item => item.season_code == this.ngForm.controls['season'].value)
      if ((seaonlist && seaonlist.length < 1)) {
        return;
      }
    }

    let param;
    if (cropType && cropType.year) {
      param = {
        search: {
          year: cropType.year,
          season: cropType.season,
          crop_code: cropType.crop_name,
          variety: cropType.variety,
          crop_type: cropType.crop_type
        }
      }
    } else {
      let cropCode = [];
      if (this.ngForm.controls['crop_name'].value) {
        this.ngForm.controls['crop_name'].value.forEach(ele => {
          cropCode.push(ele.crop_code);
        });
      }

      param = {
        search: {
          graphType: "indenter",
          crop_code: cropCode ? cropCode : '',
          crop_type: this.ngForm.controls['crop_type'].value,
          year: this.ngForm.controls['year_of_indent'].value ? this.ngForm.controls['year_of_indent'].value : '',
          season: this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : ''
        }
      }
    }
    const result = this.service.postRequestCreator('get-chart-indent-data', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop = data.EncryptedResponse.data;
        if (this.ngForm.controls['crop_name'].value) {
        } else {
          this.graphFilterCrop = this.chartCrop
        }
        let crop = [];
        let indentQty = [];
        let lifting = [];
        let actualLifting = [];
        let production = [];
        let allocated = [];
        let totalLifting = []
        for (let value of this.chartCrop) {
          crop.push(value.crop_name);
          indentQty.push(parseFloat(value.indent_quantity ? value.indent_quantity : 0));
          lifting.push(parseFloat(value.quantity ? value.quantity : 0));
          actualLifting.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
          production.push(parseFloat(value.production ? value.production : 0));
          allocated.push(parseFloat(value.allocated ? value.allocated : 0));
          totalLifting.push(parseFloat(value.total_lifting ? value.total_lifting : 0));
        }
        this.cropname = crop;
        this.indentQty = indentQty;
        this.lifting = lifting;
        this.actualLifting = actualLifting;
        this.cropProductionValue = production;
        this.cropAllocated = allocated;
        console.log('cropProductionValue====1', this.cropProductionValue);
        this.options = {
          chart: {
            type: 'column',
            // width:'500',
            overflow: 'scroll'

          },
          title: {
            text: ''
          },
          subtitle: {
            // text: 'Source: WorldClimate.com'
          },
          xAxis: {
            categories: this.cropname,
            crosshair: true,
            // categories: ['Foo', 'Bar', 'Foobar'],
            // labels: {
            //     // align: 'left',
            //     // x: 0,
            //     // y: -2
            // }       
          },
          yAxis: {
            tickInterval: 20,
            min: 0,
            title: {
              text: ''
            },
            scrollbar: {
              enabled: true,
              showFull: false
            }
          },
          scrollbar: {
            enabled: true
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} ' + this.unit + '</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.1,
              borderWidth: 0
            }
          },
          colors: [
            '#5F27CD',
            // '#0ABDE3',
            '#FF9F43',
            '#10AC84'
          ],
          label: {
            // text: 'Plot line',
            align: 'top',
            // x: -10
          },
          credits: {
            enabled: false
          },
          legend: {
            symbolRadius: 0,
            layout: 'horizontal',
            align: 'top',
            verticalAlign: 'top',
            itemMarginTop: 10,
            itemMarginBottom: 40,

            enabled: false
            // layout: 'vertical',
            // align: 'top',
            // verticalAlign: 'middle',
            // borderWidth: 0
            // layout: 'vertical',
            // align: 'left',
            // x: 800,
            // verticalAlign: 'top',
            // y: 1200,
            // floating: true,
            // backgroundColor: '#FFFFFF'
          },


          series: [{
            name: 'Indent Quantity',
            data: this.indentQty

          },
          // {
          //   name: 'Produced Quantity',
          //   data: this.cropProductionValue

          // },
          {
            name: 'Allocated Quantity',
            data: this.cropAllocated

          },
          {
            name: 'Lifted Quantity',
            data: totalLifting

          },
          ]
        }
        this.chart = Highcharts.chart("container", this.options);
      }

    })
  }
  getChartIndentDataVariety(cropType) {
    let param;
    param = {
      search: {
        graphType: "indenter",
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_name_graph'].value,
        crop_type: this.ngForm.controls['crop_type'].value
      }
    }

    const result = this.service.postRequestCreator('get-chart-indent-data-variety', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop = data.EncryptedResponse.data;
        let crop = [];
        let indentQty = [];
        let lifting = [];
        let actualLifting = [];
        let production = [];
        let allocated = [];
        let liftedQty = [];
        for (let value of this.chartCrop) {
          crop.push(value.variety_name);
          indentQty.push(parseFloat(value.indent_quantity ? value.indent_quantity : 0));
          lifting.push(parseFloat(value.quantity ? value.quantity : 0));
          actualLifting.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
          production.push(parseFloat(value.production ? value.production : 0));
          allocated.push(parseFloat(value.allocated ? value.allocated : 0));
          liftedQty.push(parseFloat(value.lifting_qty ? value.lifting_qty : 0));
        }
        console.log('production===========', production);
        this.cropname = crop;
        this.indentQty = indentQty;
        this.lifting = lifting;
        this.actualLifting = actualLifting;
        this.varietyProductionValue = production;
        this.varietyAllocated = allocated;
        this.options_variety = {
          chart: {
            type: 'column',
            // width:'500',
            overflow: 'scroll'

          },
          title: {
            text: ''
          },
          subtitle: {
            // text: 'Source: WorldClimate.com'
          },
          xAxis: {
            categories: this.cropname,
            crosshair: true,
            // categories: ['Foo', 'Bar', 'Foobar'],
            // labels: {
            //     // align: 'left',
            //     // x: 0,
            //     // y: -2
            // }       
          },
          yAxis: {
            tickInterval: 20,
            min: 0,
            title: {
              text: ''
            },
            scrollbar: {
              enabled: true,
              showFull: false
            }
          },
          scrollbar: {
            enabled: true
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} ' + this.unit + '</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.1,
              borderWidth: 0
            }
          },
          colors: [
            '#5F27CD',
            // '#0ABDE3',
            '#FF9F43',
            '#10AC84'
          ],
          label: {
            // text: 'Plot line',
            align: 'top',
            // x: -10
          },
          credits: {
            enabled: false
          },
          legend: {
            symbolRadius: 0,
            layout: 'horizontal',
            align: 'top',
            verticalAlign: 'top',
            itemMarginTop: 10,
            itemMarginBottom: 40,

            enabled: false
            // layout: 'vertical',
            // align: 'top',
            // verticalAlign: 'middle',
            // borderWidth: 0
            // layout: 'vertical',
            // align: 'left',
            // x: 800,
            // verticalAlign: 'top',
            // y: 1200,
            // floating: true,
            // backgroundColor: '#FFFFFF'
          },


          series: [{
            name: 'Indent Quantity',
            data: this.indentQty

          },
          // {
          //   name: 'Produced Quantity',
          //   data: this.varietyProductionValue

          // },
          {
            name: 'Allocated Quantity',
            data: this.varietyAllocated

          },
          {
            name: 'Lifted Quantity',
            data: liftedQty

          },
          ]
        }
        this.chart = Highcharts.chart("variety-container", this.options_variety);
      }

    })
  }
  getChartDataByCrop(cropType) {
    if ((cropType.year == '') && (cropType.season == '')) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    let param;
    const cropArr = [];

    for (let item of this.ngForm.controls['crop_name'].value) {
      cropArr.push(item && item.crop_code ? item.crop_code : '')
    }
    param = {
      search: {
        user_id: this.authUserId,
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: cropArr && (cropArr.length > 0) ? cropArr : '',
        variety: cropType.variety,
        crop_type: cropType.crop_type
      }
    }
    if (cropType.year) {
    } else {
      param = {
        search: {
          user_id: this.authUserId,
          crop_type: cropType
        }
      }
    }
    const result = this.indenterService.postRequestCreator('get-chart-data-by-crop', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop = data.EncryptedResponse.data;
        let crop = [];
        let indentQty = [];
        let lifting = [];
        let liftingByCrop = [];
        for (let value of this.chartCrop) {
          crop.push(value.variety_name);
          indentQty.push(parseInt(value.indent_quantity ? value.indent_quantity : 0));
          lifting.push(parseInt(value.quantity ? value.quantity : 0));
          liftingByCrop.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
        }
        this.cropVariety = crop;
        this.indentQty = indentQty;
        this.lifting = lifting;
        this.liftingByCrop = liftingByCrop;
        this.options = {
          chart: {
            type: 'column',
            // width:'500',
            overflow: 'scroll'

          },
          title: {
            text: ''
          },
          subtitle: {
            // text: 'Source: WorldClimate.com'
          },
          xAxis: {
            categories: this.cropVariety,
            crosshair: true,
            // categories: ['Foo', 'Bar', 'Foobar'],
            // labels: {
            //     // align: 'left',
            //     // x: 0,
            //     // y: -2
            // }       
          },
          yAxis: {
            tickInterval: 20,
            min: 0,
            title: {
              text: ''
            },
            scrollbar: {
              enabled: true,
              showFull: false
            }
          },
          scrollbar: {
            enabled: true
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} ' + this.unit + '</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.1,
              borderWidth: 0
            }
          },
          colors: [
            '#5F27CD',
            '#0ABDE3',
            '#FF9F43',

          ],
          label: {
            // text: 'Plot line',
            align: 'top',
            // x: -10
          },
          credits: {
            enabled: false
          },
          legend: {
            symbolRadius: 0,
            layout: 'horizontal',
            align: 'top',
            verticalAlign: 'top',
            itemMarginTop: 10,
            itemMarginBottom: 40,

            enabled: false
            // layout: 'vertical',
            // align: 'top',
            // verticalAlign: 'middle',
            // borderWidth: 0
            // layout: 'vertical',
            // align: 'left',
            // x: 800,
            // verticalAlign: 'top',
            // y: 1200,
            // floating: true,
            // backgroundColor: '#FFFFFF'
          },


          series: [{
            name: 'Indent Quantity',
            data: this.indentQty

          }, {
            name: 'Breeder Seed Allocated for Lifting',
            data: this.lifting

          }, {
            name: 'Breeder Seed Lifting',
            data: this.liftingByCrop

          },
          ]
        }
        this.chart = Highcharts.chart("container", this.options);
        console.log('data.EncryptedResponse.data', this.options);
      }

    })
  }

  options: any = {
  }
  convertDate() {

    this.newtodayDate = convertDate(this.todayDate)
  }
  getSeasonData() {
    const route = "get-season-details";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      delete this.seasonList[2]
      delete this.seasonList[3]
      const results = this.seasonList.filter(element => {
        if (Object.keys(element).length !== 0) {
          return true;
        }
        return false;
      });
      this.seasonList = results
    })
  }
  getCropTypeData() {

    const route = "indetor-dashboard-crop-name";
    const result = this.indenterService.postRequestCreator(route, null).subscribe(data => {
      this.cropTypeList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

    })
  }
  async getCropVarietyData() {



    this.indenterService
      .postRequestCreator("indetor-dashboard-variety-name", null)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          console.log(apiResponse);

          this.cropVarietyDataList = apiResponse.EncryptedResponse.data;
        }
      });


  }
  getIndenterDetails(cropType, data) {
    this.indentData = [];
    this.indentYear = []
    let param;
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
      // Swal.fire({
      //   title: '<p style="font-size:25px;">Please Select Something.</p>',
      //   icon: 'error',
      //   confirmButtonText:
      //     'OK',
      //   confirmButtonColor: '#E97E15'
      // })
      return;
    }
    if ((!this.ngForm.controls["year_of_indent"].value)) {
      // Swal.fire({
      //   title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
      //   icon: 'error',
      //   confirmButtonText:
      //     'OK',
      //   confirmButtonColor: '#E97E15'
      // })
      return
    }
    if ((!this.ngForm.controls["crop_type"].value)) {
      // Swal.fire({
      //   title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
      //   icon: 'error',
      //   confirmButtonText:
      //     'OK',
      //   confirmButtonColor: '#E97E15'
      // })
      return;
    }
    if ((!this.ngForm.controls["season"].value)) {
      // Swal.fire({
      //   title: '<p style="font-size:25px;">Please Select Season.</p>',
      //   icon: 'error',
      //   confirmButtonText:
      //     'OK',
      //   confirmButtonColor: '#E97E15'
      // })
      return;
    }
    if (this.yearOfIndent && this.yearOfIndent.length > 0) {
      let year = this.yearOfIndent.filter(item => item.year == this.ngForm.controls['year_of_indent'].value)
      console.log(year)
      if ((year && year.length < 1 && this.isSearch)) {
        // Swal.fire({
        //   title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
        //   icon: 'error',
        //   confirmButtonText:
        //     'OK',
        //   confirmButtonColor: '#E97E15'
        // })

        return;
      }
    }
    if (this.seasonList && this.seasonList.length > 0) {

      let seaonlist = this.seasonList.filter(item => item.season_code == this.ngForm.controls['season'].value)
      if ((seaonlist && seaonlist.length < 1 && this.isSearch)) {
        // Swal.fire({
        //   title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
        //   icon: 'error',
        //   confirmButtonText:
        //     'OK',
        //   confirmButtonColor: '#E97E15'
        // })

        return;
      }
    }
    if (data.year) {
      if (data.year && !data.crop_name) {
        this.chooseOnlyYear = true;
        this.chooseYearCrop = false;
        this.allCombileData = false;
      } else if (data.year && data.crop_name) {
        this.chooseOnlyYear = false;
        this.chooseYearCrop = true;
        this.allCombileData = false;
      }
      param = {
        search: {
          user_id: this.authUserId,
          year: data.year,
          season: data.season,
          crop_code: data.crop_name,
          variety: data.variety,
          crop_type: cropType
        }
      }
    } else {
      this.allCombileData = true;
      param = {
        search: {
          user_id: this.authUserId,
          crop_type: cropType
        }
      }
    }
    const cropArr = []
    if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value !== undefined && this.ngForm.controls['crop_name'].value.length > 0) {
      for (let item of this.ngForm.controls['crop_name'].value) {
        cropArr.push(item && item.crop_code ? item.crop_code : '')
      }
    }

    param = {
      search: {
        user_id: this.authUserId,
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: cropArr && (cropArr.length > 0) ? cropArr : '',
        // variety:data.variety,
        graphType: "indenter",
        crop_type: cropType
      }
    }

    const result = this.indenterService.postRequestCreator('get-indeter-details', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.indentData = data.EncryptedResponse.data;
        if (this.indentData.length > 0) {
          this.notFound = false;
          let year = [];
          let bsp1 = [];
          let bsp5 = [];
          for (let value of this.indentData) {
            year.push(value.year);
            bsp1.push(value.bsp_1 && value.bsp_1.id ? value.bsp_1.id : 'null');
            bsp5.push(value.bsp_5_b && value.bsp_5_b.id ? value.bsp_5_b.id : 'null');
          }
          year = [...new Set(year)];
          let indentYears = [];
          let newObj = [];
          let i = 0;
          for (let value of year) {
            let keyArr = [];
            let cropName = [];
            for (let val of this.indentData) {
              if (val.year == value) {
                keyArr.push(val.season);
                cropName.push(val.m_crop.crop_name);
              }
            }
            keyArr = [...new Set(keyArr)];
            cropName = [...new Set(cropName)];
            newObj.push({ "year": value, 'season': keyArr, 'crop_name': cropName });
            i++;
          }
          this.indentYear = newObj;
          console.log('this.indentYearthis.indentYear', this.indentYear);
          if ((bsp1.includes('null')) == true) {
            this.isBsp1Completed = 'Pending';
            this.isBsp5Completed = 'Pending';
          } else {
            this.isBsp1Completed = 'Completed';
            this.isBsp5Completed = 'Completed';
          }
        } else {
          this.notFound = true;
        }
      }

    })
  }

  getCountData(cropType) {
    let cropCode = [];
    if (this.ngForm.controls['crop_name'].value) {
      this.ngForm.controls['crop_name'].value.forEach(ele => {
        cropCode.push(ele.crop_code)
      })
    }

    // if (!this.ngForm.controls['season'].value) {
    //   this.ngForm.controls['season'].setValue('R')
    // }
    const param = {
      search: {
        user_id: this.authUserId,
        crop_type: this.ngForm.controls['crop_type'].value,
        year: this.ngForm.controls['year_of_indent'].value ? this.ngForm.controls['year_of_indent'].value : '',
        season: this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : '',
        crop_data: cropCode && (cropCode.length > 0) ? cropCode : ''
      }
    }
    const result = this.indenterService.postRequestCreator('get-count-data', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        // console.log('data.EncryptedResponse.data',data.EncryptedResponse.data);
        this.count = data.EncryptedResponse.data[0];

      }

    })
  }

  getVariety(crop_code) {
    if (crop_code) {
      const param = {
        search: {
          crop_code: crop_code,
          user_id: this.authUserId,
        }
      }
      const result = this.indenterService.postRequestCreator('get-variety', null, param).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
          && data.EncryptedResponse.status_code == 200) {
          let variety = data.EncryptedResponse.data;
          if (variety.length > 0) {
            this.ngForm.controls['variety'].enable();
            this.variety = variety;
          }
        }

      })
    }
  }

  onSubmit(formData) {
    this.isSearch = true;
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
    if ((!this.ngForm.controls["year_of_indent"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return
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
    if ((!this.ngForm.controls["season"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    let year = this.yearOfIndent.filter(item => item.year == this.ngForm.controls['year_of_indent'].value)
    console.log(year)
    if ((year && year.length < 1 && this.isSearch)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    let seaonlist = this.seasonList.filter(item => item.season_code == this.ngForm.controls['season'].value)
    if ((seaonlist && seaonlist.length < 1 && this.isSearch)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {
      // let cropName = []
      // if (formData.crop_name && formData.crop_name !== undefined && formData.crop_name.length > 0) {
      //   formData.crop_name.forEach(ele => {
      //     const foundData = this.filterData.filter((x: any) => x.crop_code == ele.crop_code);
      //     if (foundData && foundData[0] && foundData[0].m_crop && foundData[0].m_crop.crop_name) {
      //       cropName.push(foundData[0].m_crop.crop_name);
      //     }
      //     this.crop_name = cropName;
      //   })

      // }
      this.year = formData.year_of_indent ? formData.year_of_indent : '';
      this.season = formData.season ? formData.season : '';
      this.isYear = true;
      this.isSeason = true;
      this.isCropName = true;
      this.submitted = true;
      if (this.ngForm.invalid) {
        Swal.fire('Error', 'Please Fill the All Details Correctly', 'error');
        return;
      }
      let data = {
        "year": formData.year_of_indent,
        "season": formData.season,
        "crop_name": formData.crop_name,
        "variety": formData.variety,
        "crop_type": formData.crop_type,
      }
      this.getCountData(null);
      if (formData.crop_name == 'cumulative') {
        this.type();
      } else {
        
        
       
        // this.getChartDataByCrop(data);
        // this.getGraphFilterCropData();

      }

      this.getChartIndentData(formData.crop_type);
      this.getCountData(formData.crop_type);
      // this.getFilterData(formData.crop_type);
      this.getTotalLifted(formData.crop_type);
      // this.getChartIndentDataVariety(formData.crop_type);

      this.getIndenterDetails(formData.crop_type, data);
      this.ngForm.controls['crop_name_graph'].setValue("all_crop")
      // this.ngForm.controls['variety_name_graph'].setValue('all_crop')
    }

  }
  getCardFilterCropData() {


    let route = "getIndenterDetailsSecond";
    let param = {
      search: {
        graphType: "indenter",
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        user_id: this.authUserId,
      }
    }
    this.service.postRequestCreator(route, null, param).subscribe(data => {
      this.distinctCrop = data.EncryptedResponse.data;
    })
    // }
  }

  getFilterData(cropType) {
    this.filterData = []
    this.distinctCrop = []

    let param = {
      search: {
        user_id: this.authUserId,
        // crop_type: cropType,
        crop_type: this.ngForm.controls['crop_type'].value,
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year_of_indent'].value
      }
    }
    const result = this.indenterService.postRequestCreator('get-filter-data', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.filterData = data.EncryptedResponse.data;
        if (this.filterData.length > 0) {
          this.notFound = false;
          let year = [];
          for (let value of this.filterData) {
            year.push(value.year);
          }
          year = [...new Set(year)];
          let yearOfIndents = [];
          let newObj = [];
          let i = 0;
          for (let value of year) {
            let distinctCrop = [];
            for (let val of this.filterData) {
              if (val.year == value) {
                distinctCrop.push({ 'crop_code': val.m_crop.crop_code, 'crop_name': val.m_crop.crop_name });
              }
            }
            distinctCrop = removeDuplicateObjectValues(distinctCrop, 'crop_code')
            newObj.push(distinctCrop);
            i++;
            yearOfIndents.push({ "year": value });
          }
          this.yearOfIndent = yearOfIndents;
          let cropArray = [];
          newObj.forEach(ele => {
            cropArray.push(ele);
          })
          cropArray = cropArray.flat()
          let cropArraySecond = removeDuplicateObjectValues(cropArray, 'crop_code')
          console.log(cropArray, 'cropArraycropArray')
          this.distinctCrop = cropArraySecond;
          
        } else {
          this.notFound = true;
        }
      }

    })
    // this.getCardFilterCropData()
    // }
  }

  getTotalLifted(cropType) {
    let cropData1 = [];
    if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value !== undefined && this.ngForm.controls['crop_name'].value.length > 0) {
      let crop = this.ngForm.controls['crop_name'].value;
      crop.forEach(element => {
        if (element && element.crop_code) {
          cropData1.push(element.crop_code);
        }
      });
    }
    let param = {
      search: {
        crop_code: cropData1 ? cropData1 : [],
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        user_id: this.authUserId,
      }
    }

    const result = this.indenterService.postRequestCreator('get-total-lifted-count', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.totalLifted = data.EncryptedResponse.data;
      }

    })
  }

  clear(data) {
    this.isSearch = false
    this.ngForm.controls["year_of_indent"].setValue(this.currentYear);
    // this.ngForm.controls["crop_type"].setValue("A");
    this.ngForm.controls["season"].setValue("K"); 
    this.ngForm.controls["crop_name"].setValue("");
    
    
    this.ngForm.controls['crop_name_graph'].setValue('all_crop')
    this.ngForm.controls['variety_name_graph'].setValue('all_crop')
    this.getCountData(this.ngForm.controls['crop_type'].value);
    this.getChartIndentData(null);
    this.getTotalLifted(null);
    this.getCardFilterCropData();
    // this.getChartDataByCrop(data)
    this.getChartIndentDataVariety(null);
    this.getTotalLifted(null);
    // this.showVariety = false;
    // this.ngForm.controls['crop_name_graph'].setValue('all_crop');
  }
  getCropName(crop) {
    let cropNameArr = []
    for (let val of crop) {
      cropNameArr.push({ crop_name: val && val.crop_name ? val.crop_name : val ? val : '' })
    }
    let temp = []
    cropNameArr.forEach(obj => {
      if (obj.crop_name) {
        temp.push(obj.crop_name)
      }


    })
    const combineStrinfg = temp.join(" ");
    console.log(combineStrinfg.length, 'combineStrinfg')
    // return combineStrinfg.toString().length>10 ? temp.toString().substring(0,10) + '...':temp.toString(); 
    return temp.toString();

  }

  // getFilterCropData() {
  //   let param = {
  //     search: {
  //       crop_type: this.ngForm.controls['crop_type'].value,
  //       season: this.ngForm.controls['season'].value,
  //       year: this.ngForm.controls['year_of_indent'].value
  //     }
  //   }
  //   const result = this.service.postRequestCreator('get-filter-data', null, param).subscribe((data: any) => {
  //     if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
  //       && data.EncryptedResponse.status_code == 200) {
  //       this.filterData = data.EncryptedResponse.data;
  //       if (this.filterData.length > 0) {
  //         // this.notFound = false;
  //         let year = [];
  //         for (let value of this.filterData) {
  //           year.push(value.year);
  //         }
  //         year = [...new Set(year)];
  //         let yearOfIndents = [];
  //         let newObj = [];
  //         let i = 0;
  //         for (let value of year) {
  //           let distinctCrop = [];
  //           for (let val of this.filterData) {
  //             if (val.year == value) {
  //               distinctCrop.push({ 'crop_code': val.m_crop.crop_code, 'crop_name': val.m_crop.crop_name });
  //             }
  //           }
  //           distinctCrop = removeDuplicateObjectValues(distinctCrop, 'crop_code')
  //           newObj.push(distinctCrop);
  //           i++;
  //           yearOfIndents.push({ "year": value });
  //         }
  //         this.yearOfIndent = yearOfIndents;
  //         let cropArray = [];
  //         newObj.forEach(ele=>{
  //           cropArray.push(ele);
  //         })
  //         cropArray = cropArray.flat()
  //         let cropArraySecond =removeDuplicateObjectValues(cropArray, 'crop_code')
  //         console.log(cropArray,'cropArraycropArray')
  //         this.distinctCrop = cropArraySecond;
  //         console.log("this.distinctCrop",this.distinctCrop);
  //         this.dropdownSettings = {
  //           idField: 'crop_code',
  //           textField: 'crop_name',
  //           // enableCheckAll: false,
  //           // limitSelection: -1,
  //         };

  //       } else {
  //         // this.notFound = true;
  //       }
  //     }

  //   })
  // }
 
}
