import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { convertDate, removeDuplicateObjectValues } from 'src/app/_helpers/utility';
import { SeedServiceService } from '../services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import { BreederService } from '../services/breeder/breeder.service';
import { formatNumber } from '@angular/common';


@Component({
  selector: 'app-nodal-dasboad-second',
  templateUrl: './nodal-dasboad-second.component.html',
  styleUrls: ['./nodal-dasboad-second.component.css']
})
export class NodalDasboadSecondComponent implements OnInit {
  chart: any

  chart_sec: any;
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
  todayDateintoDDMMYYY = convertDate(this.todayDate)
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
  cropDataList: any;
  graphFilterCrop: any;
  freezeDataQantity: any;
  RecievedIndentDataQantity: any;
  cropProductionValue: any[];
  varietyProductionValue: any[];
  cropAllocated: any[];
  varietyAllocated: any[];
  showIndenterVariety: boolean = false
  graphFilterUsers: any;
  indenterCropName: any[];

  dashboardData: Array<any> = []
  dataload: boolean = false;
  isSearch: boolean = false;
  totalLiftingData: any;
  UnliftingData: number;
  productionSum: any;
  units: string;

  constructor(private fb: FormBuilder, private service: SeedServiceService, private breederService: BreederService) {
    // super();
    this.createForm();

  }

  createForm() {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_name: [''],
      crop_type: ['A'],
      crop_name_graph: [''],
      variety_name_graph: ['']
      // variety: [''],
    });


    this.ngForm.controls['crop_name_graph'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (newValue == "all_crop") {
          this.graphtitle = "Crop";
          this.showVariety = false;
          this.ngForm.controls['crop_name_graph'].setValue('all_crop');

        } else {
          this.showVariety = true;
          // this.showIndenterVariety = true;
          this.graphtitle = "Variety"
          this.getChartIndentDataVariety(this.ngForm.controls['crop_type'].value)
        }
      }
    })
    this.ngForm.controls['variety_name_graph'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (newValue == "all_crop") {
          this.graphtitle = "Crop"
          this.showIndenterVariety = false;
          this.ngForm.controls['variety_name_graph'].setValue('all_crop');

        } else {
          this.showIndenterVariety = true;
          this.graphtitle = "Variety"
          this.getCropChartAllIndentor(this.ngForm.controls['crop_type'].value);
        }
      }
    })
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_name'].setValue('')
        this.ngForm.controls['season'].setValue('')
        this.getCardFilterCropData();
        // this.getSecondCardData()
        // this.getToatlRecievedIndentData();
        // this.getToatlFreezeIndentData();
        // this.getChartIndentData(null);
        // this.getChartAllIndentor(null);
        // this.getCropChartAllIndentor(null);
      }
    })

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_name'].setValue('')
        this.getCardFilterCropData();
      }
    })
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.units = (newValue == 'A') ? 'Quintal' : 'Kilogram';
      }
    })

  }

  ngOnInit(): void {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
    if (data.user_type == 'ICAR') {
      this.cropTypeLoginWise = 'A';
    } else if (data.user_type == 'HICAR') {
      this.cropTypeLoginWise = 'H';
    }
    this.ngForm.controls['crop_name_graph'].setValue('all_crop');
    this.ngForm.controls['variety_name_graph'].setValue('all_crop');

    if (this.ngForm.controls['crop_type'].value) {
      this.units = (this.ngForm.controls['crop_type'].value == 'A') ? 'Quintal' : 'Kilogram';
    }
    this.dashboardData = []
    this.breederService.postRequestCreator("dashboardData/fetch").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
        this.dashboardData = data.EncryptedResponse.data.sort((a, b) => b.year - a.year);
        console.log(this.dashboardData, 'nodealdashboardData')

        this.drawChart()
      }

      console.log(this.dashboardData)
    })


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
    this.ngForm.controls['year_of_indent'].setValue(this.currentYear);
    this.ngForm.controls['season'].setValue("K");
    this.ngForm.controls['crop_type'].disable();
    this.type();

    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      this.unit = (newValue == 'A') ? 'Qt' : 'Kg';
      this.getChartIndentData(newValue);
      // this.getCountData(newValue);
      this.getFilterData(newValue);
      this.getTotalLifted(newValue);
      this.getTotalAllocateLifting(newValue);
      this.getIndenterDetails(newValue, 'filterData');
      this.getCardItemCount(newValue);
      this.getSecondCardData()
    })
    this.chart = Highcharts.chart("container", this.options);
    this.chart = Highcharts.chart("variety-container", this.options_variety);

    this.chart_sec = Highcharts.chart("containers", this.options_sec);
    this.chart_sec = Highcharts.chart("crop-containers", this.options_sec);

    this.getSeasonData();
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getVariety(newValue);
        this.getGraphFilterCropData();
        this.getSecondCardData();
        this.getToatlRecievedIndentData();
        this.getToatlFreezeIndentData();
        this.getChartIndentData(null);
      }
    })
    this.getSecondCardData();
    this.getGraphFilterCropData();
  }

  getSecondCardData() {
    let cropCode = [];
    if (this.ngForm.controls['crop_name'].value) {
      let cropdataArray = this.ngForm.controls['crop_name'].value;
      let cropArray = [];
      cropdataArray.forEach(element => {
        cropArray.push(element.crop_code);
      });
      cropCode = cropArray;
    }

    let route = "get-nodal-card-qnt-details";
    let param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.cropTypeLoginWise,
        crop_code: cropCode && (cropCode.length > 0) ? cropCode : '',
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.secondCardData = data.EncryptedResponse.data;
      let totalAllocation = this.secondCardData && this.secondCardData[0] && this.secondCardData[0].total_allocation ? this.secondCardData[0].total_allocation : 0
      this.productionSum = this.secondCardData && this.secondCardData[4] && this.secondCardData[4].productionsum ? this.secondCardData[4].productionsum : '';
      this.totalLiftingData = this.secondCardData && this.secondCardData[6] && this.secondCardData[6].totalLiftingData ? this.secondCardData[6].totalLiftingData : 0
      let UnliftingData = (totalAllocation ? parseFloat(totalAllocation) : 0) - (this.totalLiftingData ? parseFloat(this.totalLiftingData) : 0)
      // console.log(UnliftingData,'UnliftingDataUnliftingData')  
      this.UnliftingData = UnliftingData ? Number(UnliftingData) : 0
    })
  }
  getToatlFreezeIndentData() {
    let cropCode = [];
    if (this.ngForm.controls['crop_name'].value) {
      let cropdataArray = this.ngForm.controls['crop_name'].value;
      let cropArray = [];
      cropdataArray.forEach(element => {
        cropArray.push(element.crop_code);
      });
      cropCode = cropArray;
    }

    let route = "get-freeze-indent-quntity";
    let param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.cropTypeLoginWise,
        crop_code: cropCode ? cropCode : null,
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.freezeDataQantity = data.EncryptedResponse.data;
    })
  }
  getToatlRecievedIndentData() {
    let cropCode = [];
    if (this.ngForm.controls['crop_name'].value) {
      let cropdataArray = this.ngForm.controls['crop_name'].value;
      let cropArray = [];
      cropdataArray.forEach(element => {
        cropArray.push(element.crop_code);
      });
      cropCode = cropArray;
    }

    let route = "get-freeze-recieved-indent-quntity";
    let param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.cropTypeLoginWise,
        crop_code: cropCode && cropCode.length > 0 ? cropCode : null,
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.RecievedIndentDataQantity = data.EncryptedResponse.data;
    })
  }
  getCardFilterCropData() {
    let route = "get-nodal-card-filter-crop-data";
    let param = {
      search: {
        graphType:"nodal",
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.cropTypeLoginWise,
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.cropDataList = data.EncryptedResponse.data;
    })
  }

  getGraphFilterCropData() {
    if (this.ngForm.controls['crop_name'].value) {
      let cropdataArray = this.ngForm.controls['crop_name'].value;

      let cropArray = []
      cropdataArray.forEach(element => {
        cropArray.push(element);
      });
      this.graphFilterCrop = cropArray;
    } else {
      this.graphFilterCrop = this.chartCrop;
      console.log('crop data ===============', this.chartCrop)
    }
  }
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
    this.getSecondCardData();
    this.indentAndLifting(this.cropTypeLoginWise);
    this.getFilterData(this.cropTypeLoginWise);
    this.getTotalLifted(this.cropTypeLoginWise);
    this.getTotalAllocateLifting(this.cropTypeLoginWise);
    this.getChartAllIndentor(this.cropTypeLoginWise);
    this.getIndenterDetails(this.cropTypeLoginWise, 'filterData');
    this.getToatlFreezeIndentData();
    this.getToatlRecievedIndentData();
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
  options_variety: any = {}
  graphShowHiddenFunctionality(event) {

  }
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
          graphType:"nodal",
          crop_code: cropCode ? cropCode : '',
          crop_type: cropType ? cropType : this.cropTypeLoginWise,
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
            '#0ABDE3',
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
          {
            name: 'Produced Quantity',
            data: this.cropProductionValue

          },
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
        graphType:"nodal",
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_name_graph'].value,
        crop_type: this.cropTypeLoginWise
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
            '#0ABDE3',
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
          {
            name: 'Produced Quantity',
            data: this.varietyProductionValue

          },
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


  getChartAllIndentor(cropType) {
    if ((cropType && cropType.year == '') && (cropType && cropType.season == '')) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Something ",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,
      });
      return;
    }
    let param;
    if (cropType && cropType.year) {
      param = {
        search: {
          year: cropType.year,
          season: cropType.season,
          crop_code: cropType.crop_name,
          variety: cropType.variety,
          crop_type: cropType.crop_type ? cropType.crop_type : this.cropTypeLoginWise
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
          graphType:"nodal",
          year: this.ngForm.controls['year_of_indent'].value,
          season: this.ngForm.controls['season'].value,
          crop_code: cropCode && cropCode.length > 0 ? cropCode : '',
          crop_type: this.cropTypeLoginWise
        }
      }
    }
    const result = this.service.postRequestCreator('get-chart-all-indentor', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop_sec = data.EncryptedResponse.data;
        this.graphFilterUsers = data.EncryptedResponse.data;

        let indentLiftingQty = [];
        let indentLiftedQty = [];
        let indentQty = [];
        let username = [];
        let allocated = [];
        for (let value of this.chartCrop_sec) {
          indentLiftingQty.push(value.quantity ? value.quantity : 0);
          indentLiftedQty.push(value.lifting_quantity ? value.lifting_quantity : 0);
          indentQty.push(parseFloat(value.indent_quantity ? value.indent_quantity : 0));
          username.push((value.name ? value.name : 0));
          allocated.push((value.allocated ? value.allocated : 0));
        }
        this.indentLiftingQty = indentLiftingQty;
        this.indentQty = indentQty;
        this.indentLiftedQty = indentLiftedQty;
        this.username = username;
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


          series: [
            {
              name: 'Indent Quantity',
              data: this.indentQty
            },

            {
              name: 'Breeder Seed Allotted for Lifting',
              data: allocated
            },
            {
              name: 'Breeder Seed Lifting',
              data: this.indentLiftedQty

            },
          ]
        }

        this.chart = Highcharts.chart("containers", this.options_sec);
      }

    })
  }

  getCropChartAllIndentor(cropType) {
    if ((cropType && cropType.year == '') && (cropType && cropType.season == '')) {
      Swal.fire({
        toast: false,
        icon: "error",
        title: "Please Select Something ",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,
      });
      return;
    }
    let param;
    if (cropType && cropType.year) {
      param = {
        search: {
          year: cropType.year,
          season: cropType.season,
          crop_code: cropType.crop_name,
          variety: cropType.variety,
          crop_type: cropType.crop_type ? cropType.crop_type : this.cropTypeLoginWise
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
          // graphType:"nodal",
          graphType:"nodal",
          crop_code: cropCode,
          crop_type: this.cropTypeLoginWise,
          year: this.ngForm.controls['year_of_indent'].value ? this.ngForm.controls['year_of_indent'].value : '',
          season: this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : '',
          user_id: this.ngForm.controls['variety_name_graph'].value
        }
      }
    }
    const result = this.service.postRequestCreator('get-chart-all-indentor-variety', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop_sec = data.EncryptedResponse.data;
        console.log('this.chartCrop_sec', this.chartCrop_sec);
        let indentLiftingQty = [];
        let indentLiftedQty = [];
        let indentQty = [];
        let cropName = [];
        let allocated = [];
        let liftingData = [];
        for (let value of this.chartCrop_sec) {
          indentLiftingQty.push(value.quantity ? value.quantity : 0);
          indentLiftedQty.push(value.lifting_quantity ? value.lifting_quantity : 0);
          indentQty.push(parseFloat(value.indent_quantity ? value.indent_quantity : 0));
          liftingData.push(parseFloat(value.lifting_qty ? value.lifting_qty : 0));
          cropName.push(value.crop_name ? value.crop_name : '');
          allocated.push(value.allocated ? value.allocated : '');


        }
        this.indentLiftingQty = indentLiftingQty;
        this.indentQty = indentQty;
        this.indentLiftedQty = indentLiftedQty;
        this.indenterCropName = cropName;
        console.log('cropName=======', cropName);

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


          series: [
            {
              name: 'Indent Quantity',
              data: this.indentQty
            },
            {
              name: 'Allocated Quantity',
              data: allocated
            },
            {
              name: 'Lifted Quantity',
              data: liftingData

            },
          ]
        }

        this.chart = Highcharts.chart("crop-containers", this.options_sec);
        // console.log('data.EncryptedResponse.data',this.options);
      }

    })
  }

  grapohCard(item) {
    if (item == 'bsp') {
      this.bspCard = true;
      // this.showBspCard=false;
      this.totalIndentCard = false;
      this.showBspCard = true;
      this.bspImg = 'assets/images/seeding_white.svg';
      this.totalInd_img = 'assets/images/indent_orange.svg'
    }
    else {
      this.bspCard = false;


      this.totalIndentCard = true;
      this.bspImg = 'assets/images/seeding_dashboard.svg';
      this.totalInd_img = 'assets/images/indent_dashboard.svg'
    }
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

  getIndenterDetails(cropType, data) {
    let param;
    if (data && data.year) {
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
    const result = this.service.postRequestCreator('get-indeter-details', null, param).subscribe((data: any) => {
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

  getCardItemCount(cropType) {
    const param = {
      search: {
        crop_type: cropType
      }
    }
    const route = "get-dashboard-item-count";
    const result = this.service.postRequestCreator(route, null, param).subscribe(data => {
      this.itemCount = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }
  getCardTotalData(cropType) {
    const param = {
      search: {
        crop_type: cropType
      }
    }
    const route = "get-dashboard-item-count";
    const result = this.service.postRequestCreator(route, null, param).subscribe(data => {
      this.itemCount = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  indentAndLifting(cropType) {
    const param = {
      search: {
        crop_type: this.cropTypeLoginWise
      }
    }
    const route = "get-total-indent";
    const result = this.service.postRequestCreator(route, null, param).subscribe(data => {
      this.totalIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  getTotalLifted(cropType) {
    let param = {
      search: {
        crop_type: this.cropTypeLoginWise
      }
    }
    const result = this.service.postRequestCreator('get-total-lifted-count', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.totalLifted = data.EncryptedResponse.data;

      }

    })
  }
  getTotalAllocateLifting(cropType) {
    let param = {
      search: {
        crop_type: this.cropTypeLoginWise
      }
    }
    const result = this.service.postRequestCreator('get-total-allocate-lifting-count', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.totalAllocateLifting = data.EncryptedResponse.data;

      }

    })
  }
  getFilterData(cropType) {
    let param = {
      search: {
        crop_type: this.cropTypeLoginWise
      }
    }
    const result = this.service.postRequestCreator('get-filter-data', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.filterData = data.EncryptedResponse.data;
        if (this.filterData.length > 0) {
          // this.notFound = false;
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
          this.distinctCrop = newObj;
        } else {
          // this.notFound = true;
        }
      }

    })
  }
  getFilterCropData(cropType) {
    let param = {
      search: {
        crop_type: this.cropTypeLoginWise,
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year_of_indent'].value
      }
    }
    const result = this.service.postRequestCreator('get-filter-data', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.filterData = data.EncryptedResponse.data;
        if (this.filterData.length > 0) {
          // this.notFound = false;
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
          this.distinctCrop = newObj;
        } else {
          // this.notFound = true;
        }
      }

    })
  }

  getVariety(crop_code) {
    if (crop_code) {
      const param = {
        search: {
          crop_code: crop_code,
        }
      }
      const result = this.service.postRequestCreator('get-variety', null, param).subscribe((data: any) => {
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
    this.isSearch = true
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

      let cropName = []
      if (formData.crop_name) {
        for (let data of formData.crop_name) {
          cropName.push(data && data.crop_code ? data.crop_code : '')
        }
        // const foundData = this.filterData.filter((x: any) => x.crop_code == );
        // this.crop_name = foundData[0].m_crop.crop_name;
      }
      this.year = formData.year_of_indent ? formData.year_of_indent : '';
      this.season = formData.season ? formData.season : '';
      this.isYear = true;
      this.isSeason = true;
      this.isCropName = true;
      this.submitted = true;
      if (this.ngForm.invalid) {
        Swal.fire('Error', 'Please Fill the All Details correctly!', 'error');
        return;
      }
      let data = {
        "year": formData.year_of_indent,
        "season": formData.season,
        "crop_name": cropName && cropName.length > 0 ? cropName : '',
        "variety": formData.variety,
        "crop_type": formData.crop_type,
      }
      if (formData.crop_name == 'cumulative') {
        this.type();
      } else {
        this.getIndenterDetails(formData.crop_type, data);
        this.getChartAllIndentor(data);

      }
      this.ngForm.controls['crop_name_graph'].setValue('all_crop');
      this.ngForm.controls['variety_name_graph'].setValue('all_crop');
      this.getSecondCardData()
      this.getToatlRecievedIndentData();
      this.getToatlFreezeIndentData();
      this.getChartIndentData(null);
      this.getChartAllIndentor(null);
      this.getCropChartAllIndentor(null);
    }
  }

  clear() {
    this.ngForm.controls["year_of_indent"].setValue(this.currentYear);
    this.ngForm.controls["season"].setValue("K");

    this.ngForm.controls["crop_name"].setValue("");
    this.isSearch = false;
    this.ngForm.controls['crop_name_graph'].setValue('all_crop');
    this.ngForm.controls['variety_name_graph'].setValue('all_crop');
    // // this.ngForm.controls["variety"].setValue("");  
    this.getCardFilterCropData();
    this.getSecondCardData()
    this.getToatlRecievedIndentData();
    this.getToatlFreezeIndentData();
    this.getChartIndentData(null);
    this.getChartAllIndentor(null);
    this.getCropChartAllIndentor(null);
    // this.breederService.getRequestCreator("dashboardData/create").subscribe((data: any) => {
    //   console.log(data)
    // })

  }
  covertintoPositive(item) {
    let data = item ? Math.abs(item) : 0;
    return data ? data.toFixed(2) : 0
  }


  drawChart() {

    this.dashboardData.forEach((row, index) => {

      if (index < 6) {

        this.optionsDashboad.series[1].data = []
        if (Number(row.indent_done) > 0) {

          this.optionsDashboad.series[1].data.push(Number(row.indent_done));
        }
        this.optionsDashboad.series[0].data = []
        if (Number(row.indent_pending) > 0) {
          this.optionsDashboad.series[0].data.push(Number(row.indent_pending))

        }

        Highcharts.chart('row-' + index + '-col-1', this.optionsDashboad);
        this.optionsDashboad.series[1].data = []
        if (Number(row.assigned_pdpc_done) > 0) {

          this.optionsDashboad.series[1].data.push(Number(row.assigned_pdpc_done));
        }

        this.optionsDashboad.series[0].data = []
        if (Number(row.assigned_pdpc_pending) > 0) {

          this.optionsDashboad.series[0].data.push(Number(row.assigned_pdpc_pending))
        }

        Highcharts.chart('row-' + index + '-col-2', this.optionsDashboad);

        this.optionsDashboad.series[1].data = []
        if (Number(row.produced_done) > 0) {

          this.optionsDashboad.series[1].data.push(Number(row.produced_done));
        }

        this.optionsDashboad.series[0].data = []
        if (Number(row.produced_pending) > 0) {

          this.optionsDashboad.series[0].data.push(Number(row.produced_pending))
        }
        Highcharts.chart('row-' + index + '-col-3', this.optionsDashboad);

        this.optionsDashboad.series[1].data = []
        this.optionsDashboad.series[1].data.push(Number(row.allocation_done));


        this.optionsDashboad.series[0].data = []
        if (Number(row.allocation_pending) > 0) {

          this.optionsDashboad.series[0].data.push(Number(row.allocation_pending))
        }
        Highcharts.chart('row-' + index + '-col-4', this.optionsDashboad);

        this.optionsDashboad.series[1].data = []
        if (Number(row.lifted_done) > 0) {

          this.optionsDashboad.series[1].data.push(Number(row.lifted_done));
        }

        this.optionsDashboad.series[0].data = []
        if (Number(row.lifted_pending) > 0) {

          this.optionsDashboad.series[0].data.push(Number(row.lifted_pending))
        }
        Highcharts.chart('row-' + index + '-col-5', this.optionsDashboad);

      }

    });



    // let chart = {
    //   chart: {
    //     type: 'bar',
    //     backgroundColor: null,
    //     margin: [0, 0, 0, 0],
    //     height: 80,
    //     width: 240,
    //     spacingTop: 0,       // Adjust the top spacing
    //     spacingBottom: 0,    // Adjust the bottom spacing
    //     spacingLeft: 0,      // Adjust the left spacing
    //     spacingRight: 0      // Adjust the right spacing

    //   },
    //   title: {
    //     text: '',
    //   },
    //   xAxis: {
    //     categories: [],
    //     enabled: false,
    //     visible: false,
    //   },
    //   credits: {
    //     enabled: false,
    //   },
    //   yAxis: {
    //     title: {
    //       text: 'Values',
    //     },
    //     enabled: false,
    //     visible: false,
    //   },
    //   legend: {
    //     reversed: true,
    //     enabled: false
    //   },
    //   plotOptions: {
    //     series: {
    //       stacking: 'normal',

    //     },
    //     bar: {
    //       dataLabels: {
    //         enabled: true,
    //         color: 'white',
    //         format: '{point.y}' + '%',
    //       },
    //     },
    //     table: {
    //       columnSpacing: 1,
    //     },
    //   },

    //   series: [
    //     {
    //       name: 'Series 1',
    //       data: [20],

    //     },
    //     {
    //       name: 'Series 2',
    //       data: [80],
    //     },


    //   ],
    //   colors: ['#FF0033', '#22DD22']

    // }

    // Highcharts.chart('row-1-col-1', this.optionsDashboad);
    // Highcharts.chart('row-1-col-2', this.optionsDashboad);
    // Highcharts.chart('row-1-col-3', this.optionsDashboad);
    // Highcharts.chart('row-1-col-4', this.optionsDashboad2);
    // Highcharts.chart('row-1-col-5', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata1', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata2', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata3', this.optionsDashboad2);
    // Highcharts.chart('chartContainerdatas', this.optionsDashboad);
    // Highcharts.chart('chartContainerdatas1', this.optionsDashboad);
    // Highcharts.chart('chartContainerdatas2', this.optionsDashboad);
    // Highcharts.chart('chartContainerdatas3', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata20211', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata20212', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata20213', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata20214', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata20211rabi', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata20212rabi', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata20213rabi', this.optionsDashboad);
    // Highcharts.chart('chartContainerdata20214rabi', this.optionsDashboad);



  }
  dataLabelFormatting(val: any): string {
    return formatNumber(val, 'en-US', '1.0-0');
  }

  tooltipText({ series, value }: any): string {
    const label = series.name;
    const formattedValue = this.dataLabelFormatting(value);

    return `${label} : ${formattedValue}`;
  }
  onBarSelect(event: any) {
  }
  getCropName(crop) {
    let cropNameArr = []
    for (let val of crop) {
      cropNameArr.push({ crop_name: val && val.crop_name ? val.crop_name : '' })
    }
    let temp = []
    cropNameArr.forEach(obj => {
      if (obj.crop_name) {
        temp.push(obj.crop_name)
      }


    })
    const combineStrinfg = temp.join(" ");
    // combineStrinfg.toString().length > 10 ? temp.toString().substring(0, 10) + '...' : temp.toString();
    return temp.toString();
  }

  label_number_data = [
    {
      variety_name: 'Aditya',
      lot_number_count: 2,
      lot_number: [
        {
          lot_num: 'Aug-23-0030-01-005',
          LotSize: 100,
          label_2_count: 2,
          label_2: [
            {
              label_range: '0030/23/B000286-136',
              netBag: 100,
              netweight: 50,
              date_of_test: '11-10-2011',
            },
            {
              label_range: '0030/23/B000286-146',
              netBag: 500,
              netweight: 10,
              date_of_test: '14-10-2011',
            },
          ],
        },

        {
          lot_num: "Aug-23-0030-01-006",
          LotSize: 29,
          label_2_count: 2,
          label_2: [
            {
              label_range: '0030/23/B000286-156',
              netBag: 100,
              netweight: 29,
              date_of_test: '13-10-2011',
            },
            {
              label_range: '0030/23/B000286-166',
              netBag: 10,
              netweight: 1000,
              date_of_test: '23-10-2011',
            },
          ],
        },
      ],
    },
  ];


}