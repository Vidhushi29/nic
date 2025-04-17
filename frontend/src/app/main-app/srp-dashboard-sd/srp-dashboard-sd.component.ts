import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { convertDate, removeDuplicateObjectValues } from 'src/app/_helpers/utility';
import { SeedServiceService } from '../../services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import { BreederService } from '../../services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import { DatePipe, formatNumber } from '@angular/common';

@Component({
  selector: 'app-srp-dashboard-sd',
  templateUrl: './srp-dashboard-sd.component.html',
  styleUrls: ['./srp-dashboard-sd.component.css']
})
export class SrpDashboardSdComponent implements OnInit {

    chart: any
    chart_sec: any;
    chart_pie: any;
    chartDatas = [
      {
        name: 'Series 1',
        series: [
          {
            name: 'Category 1',
            value: 10
          },
          {
            name: 'Category 2',
            value: 20
          },
          // Add more categories and values...
        ]
      },
      {
        name: 'Series 2',
        series: [
          {
            name: 'Category 1',
            value: 15
          },
          {
            name: 'Category 2',
            value: 25
          },
          // Add more categories and values...
        ]
      },
      // Add more series...
    ];
  
  
    stackedBarChart: any;
  
    ngForm!: FormGroup;
    bspCard = false;
    bspImg = 'assets/images/seeding_dashboard.svg'
    totalInd_img = 'assets/images/indent_dashboard.svg'
    todayDate = new Date();
    showBspCard = false;
    totalIndentCard = true
    todayDateintoDDMMYYY;
    yearOfIndent = [];
    seasonList: any;
    authUserId: any;
    itemCount: any;
    unit: string;
    filterData: any;
    totalLifted: any;
    allCombileData: boolean = false;
    indentData: any;
    notFound: boolean = false;
    indentYear: any[];
    isBsp1Completed: string;
    isBsp5Completed: string;
    totalIndent: any;
    submitted: boolean = false;
    year: any;
    season: any;
    isYear: boolean = false;
    isSeason: boolean = false;
    variety: any;
    chartCrop: any;
    cropname: any[];
    indentQty: any[];
    lifting: any[];
    chartCrop_sec: any;
    chooseOnlyYear: boolean = false;
    chooseYearCrop: boolean = false;
    actualLifting: any[];
    username: any[];
    indentorCropName: any[];
    totalAllocateLifting: any;
    public primaryXAxis: Object;
    public primaryYAxis: Object;
    // public chartData: Object[];
    distinctCrop: any[];
    indentLiftingQty: any[];
    indentLiftedQty: any[];
    isCropName: boolean = false;
    indenterCropFilterData: any;
    indenterPieFilterData: any;
    title = "GFG";
    basicData = {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      datasets: [
        {
          label: "Orders on Swiggy",
          backgroundColor: "lightgreen",
          data: [66, 49, 81, 71, 26, 65, 60]
        },
        {
          label: "Orders on Zomato",
          backgroundColor: "pink",
          data: [56, 69, 89, 61, 36, 75, 50]
        },
        {
          label: "Orders on Uber Eats",
          backgroundColor: "gold",
          data: [52, 59, 99, 71, 46, 85, 30]
        },
        {
          label: "Orders on Licious",
          backgroundColor: "skyblue",
          data: [56, 52, 69, 81, 43, 55, 40]
        }
      ]
    };
  
    StackedOptions = {
      indexAxis: "y",
      plugins: {
        legend: {
          labels: {
            color: "#black"
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: "#black"
          },
          grid: {
            color: "rgba(255,255,255,0.2)"
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: "#black"
          },
          grid: {
            color: "rgba(255,255,255,0.2)"
          }
        }
      }
    };
    crop_name: any;
    cropTypeLoginWise: string;
    Highcharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options = {};
  
    tableArray = [
      {
        year: '2023-24',
        data_table: [
          {
            season: 'Rabi',
            crop: 'Wheat',
            Variety: 'All Indent Variety',
            Indent: '35',
            allocation: 33,
            lifting: 0
          },
          {
            season: 'Karif',
            crop: 'Wheat',
            Variety: 'All Indent Variety',
            Indent: '35',
            allocation: 33,
            lifting: 0
          }
        ]
      },
      {
        year: '2022-23',
        data_table: [
          {
            season: 'Rabi',
            crop: 'Wheat',
            Variety: 'All Indent Variety',
            Indent: '35',
            allocation: 33,
            lifting: 0
          },
          {
            season: 'Karif',
            crop: 'Wheat',
            Variety: 'All Indent Variety',
            Indent: '35',
            allocation: 33,
            lifting: 0
          }
        ]
      },
      {
        year: '2021-22',
        data_table: [
          {
            season: 'Rabi',
            crop: 'Wheat',
            Variety: 'All Indent Variety',
            Indent: '35',
            allocation: 33,
            lifting: 0
          },
          {
            season: 'Karif',
            crop: 'Wheat',
            Variety: 'All Indent Variety',
            Indent: '35',
            allocation: 33,
            lifting: 0
          }
        ]
      },
  
    ]
    dropdownSettings: IDropdownSettings = {};
    secondCardData: any;
    currentYear: number;
    chartData: any[];
    xAxisLabel: string;
    yAxisLabel: string;
    colorScheme: any;
    showVariety: boolean = false;
    cropFilterData: any;
    graphtitle: string = "Crop";
    graphtitle1: string = "State/UT";
    cropDataList: any;
    graphFilterCrop: any;
    freezeDataQantity: any;
    RecievedIndentDataQantity: any;
    cropProductionValue: any[];
    varietyProductionValue: any[];
    cropAllocated: any[];
    varietyAllocated: any[];
    showIndenterVariety: boolean = false;
    showStatePie: boolean = false;
    graphFilterUsers: any;
    indenterCropName: any[];
  
    dashboardData: Array<any> = []
    dasboarboardyear = {};
    dataload: boolean = false;
    clearbtn = false;
    isSearch: boolean = false;
    productionSum: any;
    totalLiftedQty: any;
    totalLiftingData: any;
    UnliftingData: number;
    units: string;
  
    constructor(private fb: FormBuilder, private service: SeedServiceService, private zsrmServiceService: ZsrmServiceService,private breederService: BreederService, private datePipe: DatePipe) {
      // super();
      
      this.createForm();
  
    }
  
    createForm() {
      this.ngForm = this.fb.group({
        year_of_indent: [''],
        season: [''],
        crop_name: [''],
        crop_type: [''],
        crop_name_graph: [''],
        variety_name_graph: [''],
        variety_name_graph1: [''],
        variety: [''],
      });
  
  
      this.ngForm.controls['crop_name_graph'].valueChanges.subscribe(newValue => {
        if (newValue) {
          if (newValue == "all_crop") {
            this.graphtitle = "Crop";
            this.showVariety = false;
            this.isSearch = false;
            // this.ngForm.controls['crop_name_graph'].setValue('');
  
            // this.ngForm.controls['crop_name_graph'].setValue('all_crop');
  
          } else {
            this.showVariety = true;
            this.isSearch = false;
            // this.showIndenterVariety = true;
            this.graphtitle = "Variety"
            this.getChartIndentDataVariety(this.cropTypeLoginWise)
          }
        }
      })
      this.ngForm.controls['variety_name_graph'].valueChanges.subscribe(newValue => {
        if (newValue) {
          if (newValue == "all_crop") {
            this.graphtitle1 = "State/UT"
            this.showIndenterVariety = false;
            this.isSearch = false;
            // this.ngForm.controls['variety_name_graph'].setValue('all_crop');
  
          } else {
            this.showIndenterVariety = true;
            this.graphtitle1 = "Crop";
            this.isSearch = false;
            this.getCropChartAllIndentor(this.cropTypeLoginWise)
          }
        }
      })
      this.ngForm.controls['variety_name_graph1'].valueChanges.subscribe(newValue => {
        if (newValue) {
          if (newValue == "all_crop") {
            this.graphtitle = "Crop"
            this.showStatePie = false;
            this.isSearch = false;
            // this.ngForm.controls['variety_name_graph'].setValue('all_crop');
  
          } else {
          
            this.graphtitle = "Variety";
            this.isSearch = false;
            this.getChartAllPieState(this.cropTypeLoginWise)
            this.showStatePie = true;
          }
        }
      })
      this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
        if (newValue) {
          // this.ngForm.controls['season'].setValue("");
          // this.ngForm.controls['crop_name'].setValue('');
          this.isSearch = false;
          // this.getCardFilterCropData();
          // this.getSecondCardData()
          // this.cropDataList = []
          // this.ngForm.controls['crop_name'].setValue('');
          this.ngForm.controls['crop_name_graph'].setValue('all_crop')
          this.ngForm.controls['variety_name_graph'].setValue('all_crop')
          this.ngForm.controls['variety_name_graph1'].setValue('all_crop')
          this.type();
      //    this.getToatlRecievedIndentData();
     //     this.getToatlFreezeIndentData();
          // this.getChartIndentData(null);
          // this.getChartAllIndentor(null);
          // this.getCropChartAllIndentor(null);
        }
      })
  
      // this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      //   if (newValue) {
      //     // this.ngForm.controls['crop_name'].setValue('');
      //     // this.cropDataList=[]
      //     this.isSearch = false;
      //     this.cropDataList = [];
      //     this.ngForm.controls['crop_name'].setValue('')
      //     this.ngForm.controls['crop_name_graph'].setValue('all_crop')
      //     this.ngForm.controls['variety_name_graph'].setValue('all_crop')
      //     this.ngForm.controls['variety_name_graph1'].setValue('all_crop')
      //     this.getCardFilterCropData();
  
      //   }
      // })
    }
  
    ngOnInit(): void {
      this.ngForm.controls['crop_type'].setValue("A");
      this.getIndentorSpaYear();
      const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
      const data = JSON.parse(BHTCurrentUser);
      this.authUserId = data.id;
      if (data.user_type == 'ICAR') {
        this.cropTypeLoginWise = 'A';
      } else if (data.user_type == 'HICAR') {
        this.cropTypeLoginWise = 'H';
      }
      this.ngForm.controls['crop_name_graph'].setValue('all_crop')
      this.ngForm.controls['variety_name_graph'].setValue('all_crop')
      this.ngForm.controls['variety_name_graph1'].setValue('all_crop')
      this.todayDateintoDDMMYYY = this.datePipe.transform(new Date(), 'dd-MM-yy')
      this.dashboardData = []
    
      this.chartData = [
        {
          name: 'Series 1',
          series: [
            {
              name: 'Category A',
              value: 80
            },
            {
              name: 'Category B',
              value: 20
            },
  
          ]
        },
  
      ];
  
      this.xAxisLabel = 'X Axis Label';
      this.yAxisLabel = 'Y Axis Label';
  
      this.colorScheme = {
        domain: ['#5AA454', '#E44D25']
      };
  
      const currentDate = new Date();
      this.currentYear = currentDate.getFullYear();
     // this.getSeasonData()
     console.log(this.currentYear);
      // this.ngForm.controls['year_of_indent'].setValue(this.yearOfIndent[0].year);
      this.ngForm.controls['season'].setValue("K");
      // this.ngForm.controls['crop_type'].setValue("A");
  
      this.type();
      if(this.ngForm.controls['crop_type'].value){
        this.units = (this.ngForm.controls['crop_type'].value == 'A') ? 'Quintal' : 'Kilogram';
      }
  
      this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
        this.unit = (newValue == 'A') ? 'Qt' : 'Kg';
        this.units = (newValue == 'A') ? 'Quintal' : 'Kilogram';
        this.ngForm.controls['year_of_indent'].setValue('');
        this.ngForm.controls['season'].setValue('');
        this.getChartIndentData(newValue);
        // this.getCountData(newValue);
        // this.getSeasonData();
        this.isSearch = false;
       // this.getFilterData(newValue);
      //  this.getTotalLifted(newValue);
      //  this.getTotalAllocateLifting(newValue);
    //    this.getIndenterDetails(newValue, 'filterData');
        this.getCardItemCount(newValue);
    //    this.getSecondCardData()
      })
      this.chart = Highcharts.chart("container", this.options);
      this.chart = Highcharts.chart("variety-container", this.options_variety);
  
      this.chart_sec = Highcharts.chart("containers", this.options_sec);
      this.chart_sec = Highcharts.chart("crop-containers", this.options_variety_second);

      this.chart_pie = Highcharts.chart("containerspie", this.options_pie);
      this.chart_pie = Highcharts.chart("crop-containerspie1", this.options_pie1);
  
  
    //   this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
    //     if (newValue) {
    //       this.getVariety(newValue);
    //       this.getGraphFilterCropData();
    //   //    this.getSecondCardData();
    //   //    this.getToatlRecievedIndentData();
    // //      this.getToatlFreezeIndentData();
    //       this.getChartIndentData(null);
    //     }
    //   })
     // this.getSecondCardData();
      // this.getGraphFilterCropData();
    }
  
    // getSecondCardData() {
    //   if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_type"].value)) {
  
  
    //     return;
    //   }
    //   if ((!this.ngForm.controls["year_of_indent"].value)) {
  
  
    //     return;
    //   }
    //   if ((!this.ngForm.controls["crop_type"].value)) {
  
  
    //     return;
    //   }
    //   if ((!this.ngForm.controls["season"].value)) {
    //     // Swal.fire({
    //     //   title: '<p style="font-size:25px;">Please Select Season.</p>',
    //     //   icon: 'error',
    //     //   confirmButtonText:
    //     //     'OK',
    //     //   confirmButtonColor: '#E97E15'
    //     // })
  
    //     return;
    //   }
    //   else {
  
    //     let cropCode = [];
    //     if (this.ngForm.controls['crop_name'].value) {
    //       let cropdataArray = this.ngForm.controls['crop_name'].value;
    //       let cropArray = [];
    //       cropdataArray.forEach(element => {
    //         cropArray.push(element.crop_code);
    //       });
    //       cropCode = cropArray;
    //     }
  
    //     let route = "get-nodal-card-qnt-details";
    //     let param = {
    //       search: {
    //         graphType:"seed-division",
    //         year: this.ngForm.controls['year_of_indent'].value,
    //         season: this.ngForm.controls['season'].value,
    //         crop_type: this.ngForm.controls['crop_type'].value,
    //         crop_code: cropCode && (cropCode.length > 0) ? cropCode : [],
    //       }
    //     }
    //     this.breederService.postRequestCreator(route, null, param).subscribe(data => {
    //       this.secondCardData = data.EncryptedResponse.data;
    //       this.totalLiftingData = this.secondCardData && this.secondCardData[6] && this.secondCardData[6].totalLiftingData ? this.secondCardData[6].totalLiftingData : 0
    //       this.productionSum = this.secondCardData && this.secondCardData[4] && this.secondCardData[4].productionsum ? this.secondCardData[4].productionsum : '';
    //       this.totalLiftedQty = this.secondCardData && this.secondCardData[5] && this.secondCardData[5].totalLifting ? this.secondCardData[5].totalLifting : '';
    //       this.totalLiftingData = this.secondCardData && this.secondCardData[6] && this.secondCardData[6].totalLiftingData ? this.secondCardData[6].totalLiftingData : 0
    //       let totalAllocation = this.secondCardData && this.secondCardData[0] && this.secondCardData[0].total_allocation ? this.secondCardData[0].total_allocation : 0
    //       let UnliftingData = (totalAllocation ? parseFloat(totalAllocation) : 0) - (this.totalLiftingData ? parseFloat(this.totalLiftingData) : 0)
  
    //       this.UnliftingData = UnliftingData ? Number(UnliftingData) : 0
    //     })
    //   }
    // }
    // getToatlFreezeIndentData() {
    //   let cropCode = [];
    //   if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value !== undefined && this.ngForm.controls['crop_name'].value.length > 0) {
    //     let cropdataArray = this.ngForm.controls['crop_name'].value;
    //     let cropArray = [];
    //     cropdataArray.forEach(element => {
    //       cropArray.push(element.crop_code);
    //     });
    //     cropCode = cropArray;
    //   }
    //   // let year = this.yearOfIndent.filter(item=>item.year == this.ngForm.controls['year_of_indent'].value)
    //   // console.log(year)
    //   // if (( year && year.length<1 && this.isSearch)) {
    //   //   Swal.fire({
    //   //     title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
    //   //     icon: 'error',
    //   //     confirmButtonText:
    //   //       'OK',
    //   //     confirmButtonColor: '#E97E15'
    //   //   })
  
    //   //   return;
    //   // }
    //   // let seaonlist = this.seasonList.filter(item=>item.season_code == this.ngForm.controls['season'].value)
    //   // if (( seaonlist && seaonlist.length<1 && this.isSearch)) {
    //   //   Swal.fire({
    //   //     title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
    //   //     icon: 'error',
    //   //     confirmButtonText:
    //   //       'OK',
    //   //     confirmButtonColor: '#E97E15'
    //   //   })
  
    //   //   return;
    //   // }
    //   // else{
  
    //   let route = "get-freeze-indent-quntity";
    //   let param = {
    //     search: {
    //       graphType:"seed-division",
    //       year: this.ngForm.controls['year_of_indent'].value,
    //       season: this.ngForm.controls['season'].value,
    //       crop_type: this.ngForm.controls['crop_type'].value,
    //       crop_code: cropCode && cropCode.length > 0 ? cropCode : [],
    //     }
    //   }
    //   this.breederService.postRequestCreator(route, null, param).subscribe(data => {
    //     this.freezeDataQantity = data.EncryptedResponse.data;
    //   })
    //   // }
    // }
    // getToatlRecievedIndentData() {
    //   let cropCode = [];
    //   if (this.ngForm.controls['crop_name'].value) {
    //     let cropdataArray = this.ngForm.controls['crop_name'].value;
    //     let cropArray = [];
    //     cropdataArray.forEach(element => {
    //       cropArray.push(element.crop_code);
    //     });
    //     cropCode = cropArray;
    //   }
  
    //   let route = "get-freeze-recieved-indent-quntity";
    //   let param = {
    //     search: {
    //       graphType:"seed-division",
    //       year: this.ngForm.controls['year_of_indent'].value,
    //       season: this.ngForm.controls['season'].value,
    //       crop_type: this.ngForm.controls['crop_type'].value,
    //       crop_code: cropCode && cropCode.length > 0 ? cropCode : null,
    //     }
    //   }
    //   this.breederService.postRequestCreator(route, null, param).subscribe(data => {
    //     this.RecievedIndentDataQantity = data.EncryptedResponse.data;
    //   })
    // }
    // getCardFilterCropData() {
    //   console.log(this.yearOfIndent, 'get-nodal-card-filter-crop-data')
  
    //   // let year = this.yearOfIndent.filter(item=>item.year == this.ngForm.controls['year_of_indent'].value)
    //   // console.log(year)
    //   // if (( year && year.length<1 && this.isSearch)) {
    //   //   Swal.fire({
    //   //     title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
    //   //     icon: 'error',
    //   //     confirmButtonText:
    //   //       'OK',
    //   //     confirmButtonColor: '#E97E15'
    //   //   })
  
    //   //   return;
    //   // }
    //   // let seaonlist = this.seasonList.filter(item=>item.season_code == this.ngForm.controls['season'].value)
    //   // if (( seaonlist && seaonlist.length<1 && this.isSearch)) {
    //   //   Swal.fire({
    //   //     title: '<p style="font-size:25px;">Please Select Year Of Indent.</p>',
    //   //     icon: 'error',
    //   //     confirmButtonText:
    //   //       'OK',
    //   //     confirmButtonColor: '#E97E15'
    //   //   })
  
    //   //   return;
    //   // }
    //   // else{
    //     let cropCode = [];
    //     if (this.ngForm.controls['crop_name'].value) {
    //       let cropdataArray = this.ngForm.controls['crop_name'].value;
    //       let cropArray = [];
    //       cropdataArray.forEach(element => {
    //         cropArray.push(element.crop_code);
    //       });
    //       cropCode = cropArray;
    //     }
    //   let route = "get-nodal-card-filter-crop-data";
    //   let param = {
    //     search: {
    //       graphType:"seed-division",
    //       year: this.ngForm.controls['year_of_indent'].value,
    //       season: this.ngForm.controls['season'].value,
    //       crop_type: this.ngForm.controls['crop_type'].value,
    //       crop_code:cropCode && cropCode.length > 0 ? cropCode:[]
    //     }
    //   }
    //   this.breederService.postRequestCreator(route, null, param).subscribe(data => {
    //     this.cropDataList = data.EncryptedResponse.data;
    //   })
    //   // }
    // }
  
    // getGraphFilterCropData() {
    //   if (this.ngForm.controls['crop_name'].value) {
    //     let cropdataArray = this.ngForm.controls['crop_name'].value;
  
    //     let cropArray = []
    //     cropdataArray.forEach(element => {
    //       cropArray.push(element);
    //     });
    //     this.graphFilterCrop = cropArray;
    //   } else {
    //     this.graphFilterCrop = this.chartCrop;
    //     console.log('crop data ===============', this.chartCrop)
    //   }
    // }
  
    type() {
      this.dropdownSettings = {
        idField: 'crop_code',
        textField: 'crop_name',
        enableCheckAll: false,
        limitSelection: -1,
      };
      // if(this.ngForm.controls['crop_type'].value == 'A'){
      this.unit = this.cropTypeLoginWise && (this.cropTypeLoginWise == 'A') ? 'Qt' : (this.cropTypeLoginWise == 'H') ? 'Kg' : '';
      this.getCardItemCount(this.cropTypeLoginWise);
      this.getChartIndentData(this.cropTypeLoginWise);
     // this.getSecondCardData();
    //  this.indentAndLifting(this.cropTypeLoginWise);
   //   this.getFilterData(this.cropTypeLoginWise);
      //this.getTotalLifted(this.cropTypeLoginWise);
     // this.getTotalAllocateLifting(this.cropTypeLoginWise);
      this.getChartAllIndentor(this.cropTypeLoginWise);
      this.getChartAllPie(this.cropTypeLoginWise);
    //  this.getIndenterDetails(this.cropTypeLoginWise, 'filterData');
    //  this.getToatlFreezeIndentData();
    //  this.getToatlRecievedIndentData();
      // }
    }
  
    options: any = {}
    optionsDashboad: any = {
      chart: {
        type: 'bar',
        backgroundColor: null,
        margin: [0, 0, 0, 0],
        height: 80,
        width: 240,
        spacingTop: 0,       // Adjust the top spacing
        spacingBottom: 0,    // Adjust the bottom spacing
        spacingLeft: 0,      // Adjust the left spacing
        spacingRight: 0      // Adjust the right spacing
  
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: [],
        enabled: false,
        visible: false,
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: 'Values',
        },
        enabled: false,
        visible: false,
      },
      legend: {
        reversed: true,
        enabled: false
      },
      plotOptions: {
        series: {
          stacking: 'normal',
  
        },
        bar: {
          dataLabels: {
            enabled: true,
            color: 'white',
            format: '{point.y}' + '%', // Display the y-value as the data label
          },
        },
        table: {
          columnSpacing: 1, // Adjust the value to reduce or increase the spacing
        },
      },
  
      series: [
        {
          name: 'Series 1',
          data: [20],
  
        },
        {
          name: 'Series 2',
          data: [80],
        },
  
  
      ],
      colors: ['#FF0033', '#22DD22']
  
    }
  
    optionsDashboad2: any = {
  
      chart: {
        type: 'bar',
        height: 100,
        width: 230,
        backgroundColor: null,
        // spacing: [0, 0, 0, 0],
        // margin: [0, 0, 0, 0] // [top, right, bottom, left]
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: [],
        enabled: false,
        visible: false,
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: 'Values',
        },
        enabled: false,
        visible: false,
      },
      legend: {
        reversed: true,
        enabled: false
      },
      plotOptions: {
        series: {
          stacking: 'normal',
        },
        bar: {
          dataLabels: {
            enabled: true,
            color: 'white',
            format: '{point.y}' + '%', // Display the y-value as the data label
          },
        },
      },
  
      series: [
        // {
        //   name: 'Series 1',
        //   data: [],
        // },
        {
          name: 'Series 2',
          data: [100],
        },
  
  
      ],
      colors: ['#FF0033']
  
    }
  
    options_sec: any = {}
    options_pie: any = {}
    options_pie1: any = {}
    options_variety: any = {}
    options_variety_second: any = {}
    graphShowHiddenFunctionality(event) {
  
    }
    getChartIndentData(cropType) {
        let param;
          param = {
            search: {    
            year: this.ngForm.controls['year_of_indent'].value,
           // year: '2026-27'
            }
          }
        
        this.zsrmServiceService.postRequestCreator('get-srp-dashboard-crop-wise-data', null, param).subscribe((data: any) => {
          if (data && data.Response && data.Response.data && data.Response.status_code
            && data.Response.status_code == 200) {
            this.chartCrop = data.Response.data;
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
              indentQty.push(parseFloat(value.req ? value.req : 0));
              lifting.push(parseFloat(value.quantity ? value.quantity : 0));
              actualLifting.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
              production.push(parseFloat(value.production ? value.production : 0));
              allocated.push(parseFloat(value.total ? value.total : 0));
              totalLifting.push(parseFloat(value.shtorsur ? value.shtorsur : 0));
            }
            this.cropname = crop;
            this.indentQty = indentQty;
            this.lifting = lifting;
            this.actualLifting = actualLifting;
            this.cropProductionValue = production;
            this.cropAllocated = allocated;
            console.log('cropProductionValue====1', this.cropProductionValue);
            let liftedQtyWithColors = totalLifting.map((value, index) => {
              // If the value is negative (shortfall), set red, else green (surplus)
              return {
                y: Math.abs(value), // Display the absolute value
                color: value < 0 ? 'rgb(244, 79, 79)' : '#10AC84', // Red for shortfall, green for surplus
                originalValue: value // Store the original value to keep track of it
            
              };
            });
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
             //   '#0ABDE3',
                '#FF9F43',
            //    '#10AC84'
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
                name: 'Requirement',
                data: this.indentQty
  
              },
              {
                name: 'Availability',
                data: this.cropAllocated
  
              },
              {
                name: 'Shortfall/Surplus',
                data: liftedQtyWithColors
  
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
          
        //  year: this.ngForm.controls['year_of_indent'].value,
          year:this.ngForm.controls['year_of_indent'].value,
          crop_code: this.ngForm.controls['crop_name_graph'].value,
         
        }
      }
  
      this.zsrmServiceService.postRequestCreator('get-srp-dashboard-crop-variety-wise-data', null, param).subscribe((data: any) => {
        if (data && data.Response && data.Response.data && data.Response.status_code
          && data.Response.status_code == 200) {
          this.chartCrop = data.Response.data;
          let crop = [];
          let indentQty = [];
          let lifting = [];
          let actualLifting = [];
          let production = [];
          let allocated = [];
          let liftedQty = [];
          for (let value of this.chartCrop) {
            crop.push(value.variety_name);
            indentQty.push(parseFloat(value.req ? value.req : 0));
            lifting.push(parseFloat(value.quantity ? value.quantity : 0));
            actualLifting.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
            production.push(parseFloat(value.production ? value.production : 0));
            allocated.push(parseFloat(value.total ? value.total : 0));
            liftedQty.push(parseFloat(value.shtorsur ? value.shtorsur : 0));
          }
          console.log('production===========', production);
          let liftedQtyWithColors = liftedQty.map((value, index) => {
            // If the value is negative (shortfall), set red, else green (surplus)
            return {
              y: Math.abs(value), // Display the absolute value
              color: value < 0 ? 'rgb(244, 79, 79)' : '#10AC84', // Red for shortfall, green for surplus
              originalValue: value // Store the original value to keep track of it
          
            };
          });
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
             //   '#0ABDE3',
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
              name: 'Requirement',
              data: this.indentQty
  
            },
            {
              name: 'Availability',
              data: this.varietyAllocated
  
            },
            {
              name: 'Shortfall/Surplus',
              data: liftedQtyWithColors
  
            },
            ]
          }
          this.chart = Highcharts.chart("variety-container", this.options_variety);
        }
  
      })
    }
  
  
    getChartAllIndentor(cropType) {
      let param;
  
        param = {
          search: {
          year: this.ngForm.controls['year_of_indent'].value,
          // year:'2026-27'
          }
        }
      
  
      this.zsrmServiceService.postRequestCreator('get-srp-dashboard-user-wise-data', null, param).subscribe((data: any) => {
        if (data && data.Response && data.Response.data && data.Response.status_code
          && data.Response.status_code == 200) {
          this.chartCrop_sec = data.Response.data;
          this.graphFilterUsers = data.Response.data;
  
          let indentLiftingQty = [];
          let indentLiftedQty = [];
          let indentQty = [];
          let username = [];
          let allocated = [];
          for (let value of this.chartCrop_sec) {
            username.push((value.name ? value.name : 0));
            indentQty.push(parseFloat(value.req ? value.req : 0));
            allocated.push(parseFloat(value.total ? value.total : 0));
            indentLiftedQty.push(parseFloat(value.shtorsur ? value.shtorsur : 0));
          }
          this.indentQty = indentQty;
          this.indentLiftedQty = indentLiftedQty;
          this.username = username;
          let liftedQtyWithColors = indentLiftedQty.map((value, index) => {
            // If the value is negative (shortfall), set red, else green (surplus)
            return {
              y: Math.abs(value), // Display the absolute value
              color: value < 0 ? 'rgb(244, 79, 79)' : '#10AC84', // Red for shortfall, green for surplus
              originalValue: value // Store the original value to keep track of it
          
            };
          });
          this.options_sec = {
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
              categories: this.username,
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
             // '#10AC84'
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
  
  
            series: [
              {
                name: 'Requirement',
                data: this.indentQty
              },
  
              {
                name: 'Availability',
                data: allocated
              },
              {
                name: 'Shortfall/Surplus',
                data: liftedQtyWithColors
  
              },
            ]
          }
  
  
          this.chart = Highcharts.chart("containers", this.options_sec);
        }
  
      })
    }

    getChartAllPie(cropType) {
 
      let param;
  
        param = {
          search: {
          year: this.ngForm.controls['year_of_indent'].value
        //  year:'2026-27'
          }
        }
      
  
      this.zsrmServiceService.postRequestCreator('get-srp-dashboard-pie-chart', null, param).subscribe((data: any) => {
        if (data && data.Response && data.Response.data && data.Response.status_code
          && data.Response.status_code == 200) {
            let res = data.Response.data;
            let doa = res.doa; 
          // this.chartCrop_sec = data.Response.data;
          // this.graphFilterUsers = data.Response.data;
  
          // let indentLiftingQty = [];
          // let indentLiftedQty = [];
          // let indentQty = [];
          // let username = [];
          // let allocated = [];
          // for (let value of this.chartCrop_sec) {
          //   username.push((value.name ? value.name : 0));
          //   indentQty.push(parseFloat(value.req ? value.req : 0));
          //   allocated.push(parseFloat(value.total ? value.total : 0));
          //   indentLiftedQty.push(parseFloat(value.shtorsur ? value.shtorsur : 0));
          // }
          // this.indentQty = indentQty;
          // this.indentLiftedQty = indentLiftedQty;
          // this.username = username;
          // let liftedQtyWithColors = indentLiftedQty.map((value, index) => {
          //   // If the value is negative (shortfall), set red, else green (surplus)
          //   return {
          //     y: Math.abs(value), // Display the absolute value
          //     color: value < 0 ? 'rgb(244, 79, 79)' : '#10AC84', // Red for shortfall, green for surplus
          //     originalValue: value // Store the original value to keep track of it
          
          //   };
          // });
          
          this.options_pie = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: 'Seed Availability (%)'
          },
          credits:{
            enabled: false
          },
          colors: Highcharts.getOptions().colors.map(function (color) {
            return {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.3,
                    r: 0.7
                },
                stops: [
                    [0, color],
                    [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        }),
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<span style="font-size: 1.2em"><b>{point.name}</b>' +
                          '</span><br>' +
                          '<span style="opacity: 0.6">{point.percentage:.1f} ' +
                          '%</span>',
                      connectorColor: 'rgba(128,128,128,0.5)'
                  }
              }
          },
          series: [{
              name: 'Share',
              data: [
                {
                                      name: 'DOA',
                                      y: parseFloat(res.doa)
                                  },
                                  {
                                      name: 'SSFS',
                                      //  sliced: true,
                                      // selected: true,
                                      y: parseFloat(res.ssfs)
                                  },
                                  {
                                    name: 'SSC',
                                    // sliced: true,
                                    // selected: true,
                                    y: parseFloat(res.ssc)
                                },
                                {
                                  name: 'NSC',
                                  // sliced: true,
                                  // selected: true,
                                  y: parseFloat(res.nsc)
                              },
                              {
                                name: 'SAUs',
                                // sliced: true,
                                // selected: true,
                                y: parseFloat(res.saus)
                            },
                            {
                              name: 'Other Gov PSUs',
                              // sliced: true,
                              // selected: true,
                              y: parseFloat(res.othergovpsu)
                          },
                          {
                            name: 'COOP',
                            // sliced: true,
                            // selected: true,
                            y: parseFloat(res.coop)
                        },
                        {
                          name: 'PVT',
                          // sliced: true,
                          // selected: true,
                          y: parseFloat(res.pvt)
                      },
                      {
                        name: 'Seedhub',
                        // sliced: true,
                        // selected: true,
                        y: parseFloat(res.seedhub)
                    },
                    {
                      name: 'Others',
                      // sliced: true,
                      // selected: true,
                      y: parseFloat(res.others)
                  },
                 
              ]
          }]

          }
 
  
      this.options_pie.series[0].data.sort((a, b) => b.y - a.y);

      // Define the colors for each slice (ordered by their size)
      const colorPalette = [
        '#FF5733', // First largest slice (Red)
        '#FFCC00', // Second largest slice (Yellow)
        '#33CC33', // Third largest slice (Green)
        '#3399FF', // Fourth largest slice (Blue)
        '#2005a8', // Fifth largest slice (Purple)
        '#FF6600', // Sixth largest slice (Orange)
        '#33FFCC', // Seventh largest slice (Turquoise)
        '#FFD700', // Eighth largest slice (Gold)
        '#9933FF', // Ninth largest slice (Violet)
        '#FF1493'  // Tenth largest slice (Deep Pink)
      ];
      
      // Loop through the data and assign colors based on the sorted order
      this.options_pie.series[0].data.forEach((point, index) => {
        point.color = {
          radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
          stops: [
            [0, colorPalette[index]], // Center color (based on the index)
            [1, Highcharts.color(colorPalette[index]).brighten(-0.3).get('rgb')] // Darker version of the same color at the outer edge
          ]
        };
        if (index === 0) {
          point.sliced = true;  // Make the slice "pulled out"
          point.selected = true; // Highlight the slice as selected
        }
      });
      
 
          this.chart = Highcharts.chart("containerspie", this.options_pie);
        
        }
  
      })
    }

    getChartAllPieState(cropType) {
      let param;  
        param = {
          search: {
          year: this.ngForm.controls['year_of_indent'].value,
         // year:'2026-27',
          userid: this.ngForm.controls['variety_name_graph1'].value,
          }
        }
      
  
      this.zsrmServiceService.postRequestCreator('get-srp-dashboard-pie-chart', null, param).subscribe((data: any) => {
        if (data && data.Response && data.Response.data && data.Response.status_code
          && data.Response.status_code == 200) {
            let res = data.Response.data;
            let doa = res.doa; 
          // this.chartCrop_sec = data.Response.data;
          // this.graphFilterUsers = data.Response.data;
  
          // let indentLiftingQty = [];
          // let indentLiftedQty = [];
          // let indentQty = [];
          // let username = [];
          // let allocated = [];
          // for (let value of this.chartCrop_sec) {
          //   username.push((value.name ? value.name : 0));
          //   indentQty.push(parseFloat(value.req ? value.req : 0));
          //   allocated.push(parseFloat(value.total ? value.total : 0));
          //   indentLiftedQty.push(parseFloat(value.shtorsur ? value.shtorsur : 0));
          // }
          // this.indentQty = indentQty;
          // this.indentLiftedQty = indentLiftedQty;
          // this.username = username;
          // let liftedQtyWithColors = indentLiftedQty.map((value, index) => {
          //   // If the value is negative (shortfall), set red, else green (surplus)
          //   return {
          //     y: Math.abs(value), // Display the absolute value
          //     color: value < 0 ? 'rgb(244, 79, 79)' : '#10AC84', // Red for shortfall, green for surplus
          //     originalValue: value // Store the original value to keep track of it
          
          //   };
          // });
          
          this.options_pie1 = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: 'Seed Availability (%)'
          },
          credits:{
            enabled: false
          },
          colors: Highcharts.getOptions().colors.map(function (color) {
            return {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.3,
                    r: 0.7
                },
                stops: [
                    [0, color],
                    [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        }),
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<span style="font-size: 1.2em"><b>{point.name}</b>' +
                          '</span><br>' +
                          '<span style="opacity: 0.6">{point.percentage:.1f} ' +
                          '%</span>',
                      connectorColor: 'rgba(128,128,128,0.5)'
                  }
              }
          },
          series: [{
              name: 'Share',
              data: [
                {
                                      name: 'DOA',
                                      y: parseFloat(res.doa)
                                  },
                                  {
                                      name: 'SSFS',
                                      //  sliced: true,
                                      // selected: true,
                                      y: parseFloat(res.ssfs)
                                  },
                                  {
                                    name: 'SSC',
                                    // sliced: true,
                                    // selected: true,
                                    y: parseFloat(res.ssc)
                                },
                                {
                                  name: 'NSC',
                                  // sliced: true,
                                  // selected: true,
                                  y: parseFloat(res.nsc)
                              },
                              {
                                name: 'SAUs',
                                // sliced: true,
                                // selected: true,
                                y: parseFloat(res.saus)
                            },
                            {
                              name: 'Other Gov PSUs',
                              // sliced: true,
                              // selected: true,
                              y: parseFloat(res.othergovpsu)
                          },
                          {
                            name: 'COOP',
                            // sliced: true,
                            // selected: true,
                            y: parseFloat(res.coop)
                        },
                        {
                          name: 'PVT',
                          // sliced: true,
                          // selected: true,
                          y: parseFloat(res.pvt)
                      },
                      {
                        name: 'Seedhub',
                        // sliced: true,
                        // selected: true,
                        y: parseFloat(res.seedhub)
                    },
                    {
                      name: 'Others',
                      // sliced: true,
                      // selected: true,
                      y: parseFloat(res.others)
                  },
                 
              ]
          }]

          }
 
  
      this.options_pie1.series[0].data.sort((a, b) => b.y - a.y);

      // Define the colors for each slice (ordered by their size)
      const colorPalette = [
        '#FF5733', // First largest slice (Red)
        '#FFCC00', // Second largest slice (Yellow)
        '#33CC33', // Third largest slice (Green)
        '#3399FF', // Fourth largest slice (Blue)
        '#2005a8', // Fifth largest slice (Purple)
        '#FF6600', // Sixth largest slice (Orange)
        '#33FFCC', // Seventh largest slice (Turquoise)
        '#FFD700', // Eighth largest slice (Gold)
        '#9933FF', // Ninth largest slice (Violet)
        '#FF1493'  // Tenth largest slice (Deep Pink)
      ];
      
      // Loop through the data and assign colors based on the sorted order
      this.options_pie1.series[0].data.forEach((point, index) => {
        point.color = {
          radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
          stops: [
            [0, colorPalette[index]], // Center color (based on the index)
            [1, Highcharts.color(colorPalette[index]).brighten(-0.3).get('rgb')] // Darker version of the same color at the outer edge
          ]
        };
        if (index === 0) {
          point.sliced = true;  // Make the slice "pulled out"
          point.selected = true; // Highlight the slice as selected
        }
      });
      
 
          this.chart = Highcharts.chart("containerspie1", this.options_pie1);
        
        }
  
      })
    }

    
  
    getCropChartAllIndentor(cropType) {
        let param = {
          search: {
            // year: this.ngForm.controls['year_of_indent'].value ? this.ngForm.controls['year_of_indent'].value : '',
            year: this.ngForm.controls['year_of_indent'].value,
            userid: this.ngForm.controls['variety_name_graph'].value,
          }
        }
      // }
      this.zsrmServiceService.postRequestCreator('get-srp-dashboard-user-crop-wise-data', null, param).subscribe((data: any) => {
        if (data && data.Response && data.Response.data && data.Response.status_code
          && data.Response.status_code == 200) {
          this.chartCrop_sec = data.Response.data;
          console.log('this.chartCrop_sec', this.chartCrop_sec);
          let indentLiftingQty = [];
          let indentLiftedQty = [];
          let indentQty = [];
          let cropName = [];
          let allocated = [];
          let liftedQty = [];
          for (let value of this.chartCrop_sec) {
            cropName.push(value.crop_name ? value.crop_name : '');
            indentQty.push(parseFloat(value.req ? value.req : 0));
            allocated.push(parseFloat(value.total ? value.total : 0));
            indentLiftedQty.push(value.shtorsur ? value.shtorsur : 0);
          }
        
          this.indentQty = indentQty;
          this.indentLiftedQty = indentLiftedQty;
          this.indenterCropName = cropName;
          console.log('cropName=======', cropName);   
          let liftedQtyWithColors = indentLiftedQty.map((value, index) => {
            // If the value is negative (shortfall), set red, else green (surplus)
            return {
              y: Math.abs(value), // Display the absolute value
              color: value < 0 ? 'rgb(244, 79, 79)' : '#10AC84', // Red for shortfall, green for surplus
              originalValue: value // Store the original value to keep track of it
          
            };
          });
  
          this.options_variety_second = {
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
              categories: this.indenterCropName,
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
              
              
            //  '#10AC84'
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
  
  
            series: [
              {
                name: 'Requirement',
                data: this.indentQty
              },
              {
                name: 'Availability',
                data: allocated
              },
              {
                name: 'Shortfall/Surplus',
                data: liftedQtyWithColors
  
              },
            ]
          }
  
          //         this.ngForm.controls['crop_name_graph'].valueChanges.subscribe(data=>{
          // if(data){
  
          //   this.chart = Highcharts.chart("crop-containers", this.options_sec);
          // }
          //         })
  
  
          this.chart = Highcharts.chart("crop-containers", this.options_variety_second);
          // console.log('data.EncryptedResponse.data',this.options);
        }
  
      })
    }

    
    //  getIndenterDetails(cropType, data) {
    //   let param;
    //   if (data.year) {
    //     if (data.year && !data.crop_name) {
    //       this.chooseOnlyYear = true;
    //       this.chooseYearCrop = false;
    //       this.allCombileData = false;
    //     } else if (data.year && data.crop_name) {
    //       this.chooseOnlyYear = false;
    //       this.chooseYearCrop = true;
    //       this.allCombileData = false;
    //     }
    //     param = {
    //       search: {
    //         user_id: this.authUserId,
    //         year: data.year,
    //         season: data.season,
    //         crop_code: data.crop_name,
    //         variety: data.variety,
    //         crop_type: cropType
    //       }
    //     }
    //   } else {
    //     this.allCombileData = true;
    //     param = {
    //       search: {
    //         user_id: this.authUserId,
    //         crop_type: cropType
    //       }
    //     }
    //   }
    //   const result = this.service.postRequestCreator('get-indeter-details', null, param).subscribe((data: any) => {
    //     if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
    //       && data.EncryptedResponse.status_code == 200) {
    //       this.indentData = data.EncryptedResponse.data;
    //       if (this.indentData.length > 0) {
    //         this.notFound = false;
    //         let year = [];
    //         let bsp1 = [];
    //         let bsp5 = [];
    //         for (let value of this.indentData) {
    //           year.push(value.year);
    //           bsp1.push(value.bsp_1 && value.bsp_1.id ? value.bsp_1.id : 'null');
    //           bsp5.push(value.bsp_5_b && value.bsp_5_b.id ? value.bsp_5_b.id : 'null');
    //         }
    //         year = [...new Set(year)];
    //         let indentYears = [];
    //         let newObj = [];
    //         let i = 0;
    //         for (let value of year) {
    //           let keyArr = [];
    //           let cropName = [];
    //           for (let val of this.indentData) {
    //             if (val.year == value) {
    //               keyArr.push(val.season);
    //               cropName.push(val.m_crop.crop_name);
    //             }
    //           }
    //           keyArr = [...new Set(keyArr)];
    //           cropName = [...new Set(cropName)];
    //           newObj.push({ "year": value, 'season': keyArr, 'crop_name': cropName });
    //           i++;
    //         }
    //         this.indentYear = newObj;
    //         if ((bsp1.includes('null')) == true) {
    //           this.isBsp1Completed = 'Pending';
    //           this.isBsp5Completed = 'Pending';
    //         } else {
    //           this.isBsp1Completed = 'Completed';
    //           this.isBsp5Completed = 'Completed';
    //         }
    //       } else {
    //         this.notFound = true;
    //       }
    //     }
  
    //   })
    // }
    getIndentorSpaYear() {
      const route = "get-srp-year-sd";
       this.zsrmServiceService.getRequestCreator(route, null, null).subscribe(data => {
        if (data.Response.status_code === 200) {
          console.log(data.Response.status_code,'data')
          this.yearOfIndent = (data && data.Response && data.Response.data) ? data.Response.data : '';
          console.log(this.yearOfIndent[0].year,'hello')
          this.ngForm.controls['year_of_indent'].setValue(this.yearOfIndent[0].year);
        } 
       });
     }
    getCardItemCount(cropType) {
      const param = {
        search: {
          year: this.ngForm.controls['year_of_indent'].value
                }
      }
      const route = "get-srp-dashboard-item-count";
      this.zsrmServiceService.postRequestCreator(route, null, param).subscribe(data => {
        this.itemCount = (data && data.Response && data.Response.data && data.Response.data) ? data.Response.data : '';
      })
    }
    
  }
  
