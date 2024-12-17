import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { convertDate, removeDuplicateObjectValues } from 'src/app/_helpers/utility';
import { SeedServiceService } from '../services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';
import { BreederService } from '../services/breeder/breeder.service';

@Component({
  selector: 'app-nodal-dashboard',
  templateUrl: './nodal-dashboard.component.html',
  styleUrls: ['./nodal-dashboard.component.css']
})
export class NodalDashboardComponent extends ngbDropdownEvents implements OnInit {
  chart: any
  chart_sec: any;
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
  distinctCrop: any[];
  indentLiftingQty: any[];
  indentLiftedQty: any[];
  isCropName: boolean = false;
  crop_name: any;
  cropTypeLoginWise: string;
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
  showVariety: boolean = false;
  cropFilterData: any;
  graphtitle: string = "Crop";
  cropDataList: any;
  graphFilterCrop: any;
  freezeDataQantity: any;
  RecievedIndentDataQantity: any;

  constructor(private fb: FormBuilder, private service: SeedServiceService, private breederService: BreederService) {
    super();
    this.createForm();

  }

  createForm() {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_name: [''],
      crop_type: ['A'],
      crop_name_graph: ['']
      // variety: [''],
    });


    this.ngForm.controls['crop_name_graph'].valueChanges.subscribe(newValue => {
      if (newValue) {
        if (newValue == "all_crop") {
          this.graphtitle = "Crop"
          this.showVariety = false;
          this.ngForm.controls['crop_name_graph'].value.setValue('');

        } else {
          this.showVariety = true;
          this.graphtitle = "Variety"
          this.getChartIndentDataVariety(this.cropTypeLoginWise)
        }
        console.log('graph filter value====', newValue);
      }
    })

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_name'].setValue('')
        this.getCardFilterCropData();
        this.getSecondCardData()
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
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    console.log('this.currentYear=========', this.currentYear);
    this.ngForm.controls['year_of_indent'].setValue(this.currentYear + 1);
    this.ngForm.controls['crop_type'].disable();
    this.type();
    


    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      this.unit = (newValue == 'A') ? 'Qunital' : 'Kg';
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
    this.getSeasonData();
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getVariety(newValue);
        this.getGraphFilterCropData();
        this.getSecondCardData();
      }
    })
    this.getSecondCardData();
    this.getGraphFilterCropData();
    // this.indentAndLifting();
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
        crop_code: cropCode ? cropCode : null,
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      console.log('card data==========', data);
      this.secondCardData = data.EncryptedResponse.data;
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
      console.log('card data==========', data);
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
        crop_code: cropCode ? cropCode : null,
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      console.log('card data==========', data);
      this.RecievedIndentDataQantity = data.EncryptedResponse.data;
    })
  }
  getCardFilterCropData() {
    let route = "get-nodal-card-filter-crop-data";
    let param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.cropTypeLoginWise,
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      console.log('card data==========', data);
      this.cropDataList = data.EncryptedResponse.data;
    })
  }

  getGraphFilterCropData() {
    if (this.ngForm.controls['crop_name'].value) {
      let cropdataArray = this.ngForm.controls['crop_name'].value;

      let cropArray = []
      cropdataArray.forEach(element => {
        // console.log('element====',element);
        cropArray.push(element);
      });
      this.graphFilterCrop = cropArray;
      console.log('graphFilterCrop==========', this.graphFilterCrop);
    } else {
      // api side data based on total indent
      // alert("hiii man");
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
    this.unit = this.cropTypeLoginWise && (this.cropTypeLoginWise == 'A') ? 'Quintal' : (this.cropTypeLoginWise == 'H') ? 'Kg' : '';
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
  options_sec: any = {}
  options_variety: any = {}
  graphShowHiddenFunctionality(event) {
    // console.log('event',event);
    // console.log('crop filter data=======',this.cropFilterData);
    // this.showVariety = true
  }
  getChartIndentData(cropType) {
    let param;
    if (cropType.year) {
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
      param = {
        search: {
          crop_type: cropType
        }
      }
    }
    const result = this.service.postRequestCreator('get-chart-indent-data', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop = data.EncryptedResponse.data;
        console.log('chart-crop====', this.chartCrop);
        let crop = [];
        let indentQty = [];
        let lifting = [];
        let actualLifting = [];
        for (let value of this.chartCrop) {
          crop.push(value.crop_name);
          indentQty.push(parseInt(value.indent_quantity ? value.indent_quantity : 0));
          lifting.push(parseInt(value.quantity ? value.quantity : 0));
          actualLifting.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
        }
        this.cropname = crop;
        this.indentQty = indentQty;
        this.lifting = lifting;
        this.actualLifting = actualLifting;
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
            '#B64B1D',
            '#DC8B3A',
            '#5B1E03'
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
            name: 'Breeder Seed Allotted for Lifting',
            data: this.lifting

          },
          {
            name: 'Breeder Seed Lifting',
            data: this.actualLifting

          },
          ]
        }
        this.chart = Highcharts.chart("container", this.options);
        console.log('data.EncryptedResponse.data', this.options);
      }

    })
  }
  getChartIndentDataVariety(cropType) {
    let param;
    // if(cropType.year){
    param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_name_graph'].value,
        crop_type: this.cropTypeLoginWise
      }
    }
    // }else{
    //   param = {
    //     search:{
    //       crop_type:cropType
    //     }
    //   }
    // }
    const result = this.service.postRequestCreator('get-chart-indent-data-variety', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop = data.EncryptedResponse.data;
        console.log('variety-crop====', this.chartCrop);
        let crop = [];
        let indentQty = [];
        let lifting = [];
        let actualLifting = [];
        for (let value of this.chartCrop) {
          crop.push(value.variety_name);
          indentQty.push(parseInt(value.indent_quantity ? value.indent_quantity : 0));
          lifting.push(parseInt(value.quantity ? value.quantity : 0));
          actualLifting.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
        }
        this.cropname = crop;
        this.indentQty = indentQty;
        this.lifting = lifting;
        this.actualLifting = actualLifting;
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
            '#B64B1D',
            '#DC8B3A',
            '#5B1E03'
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
            name: 'Breeder Seed Allotted for Lifting',
            data: this.lifting

          },
          {
            name: 'Breeder Seed Lifting',
            data: this.actualLifting

          },
          ]
        }
        this.chart = Highcharts.chart("variety-container", this.options_variety);
        // console.log('data.EncryptedResponse.data',this.options);
      }

    })
  }

  // options_sec: any = {
  //   chart_sec: {
  //     type: 'column',
  //     // width: 500
  //   },
  //   title: {
  //     text: ''
  //   },
  //   subtitle: {
  //     // text: 'Source: WorldClimate.com'
  //   },
  //   xAxis: {
  //     categories: [
  //       'Cereals',
  //       'Dry Beans',
  //       'Lentil',
  //       'Rajma',
  //       'Cotton',
  //       'Soya Bean',
  //       'Corn',
  //       'Wheat',
  //       'Paddy',
  //       'Oct',
  //       'Nov',
  //       'Green gram'
  //     ],
  //     crosshair: true,
  //     // categories: ['Foo', 'Bar', 'Foobar'],
  //             // labels: {
  //             //     // align: 'left',
  //             //     // x: 0,
  //             //     // y: -2
  //             // }       
  //   },
  //   yAxis: {
  //     tickInterval: 20,
  //     min: 0,
  //     title: {
  //       text: ''
  //     }
  //   },
  //   scrollbar: {
  //     enabled: true
  // },
  //   tooltip: {
  //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  //     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //       '<td style="padding:0"><b>{point.y:.1f} cm</b></td></tr>',
  //     footerFormat: '</table>',
  //     shared: true,
  //     useHTML: true
  //   },
  //   plotOptions: {
  //     column: {
  //       pointPadding: 0.1,
  //       borderWidth: 0
  //     }
  //   },
  //   colors: [
  //     '#B64B1D',
  //     '#DC8B3A',
  //     '#5B1E03'
  // ],
  // label: {
  //   // text: 'Plot line',
  //   align: 'top',
  //   // x: -10
  // },
  // credits: {
  //   enabled: false
  // },
  // legend: {
  //   symbolRadius: 0,
  //   layout: 'horizontal',
  //   align: 'top',
  //   verticalAlign: 'top',
  //   itemMarginTop: 10,
  //   itemMarginBottom: 40,

  //   enabled: false
  //   // layout: 'vertical',
  //   // align: 'top',
  //   // verticalAlign: 'middle',
  //   // borderWidth: 0
  //   // layout: 'vertical',
  //   // align: 'left',
  //   // x: 800,
  //   // verticalAlign: 'top',
  //   // y: 1200,
  //   // floating: true,
  //   // backgroundColor: '#FFFFFF'
  // },


  //   series: [{
  //     name: 'Crop',
  //     data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
  //       194.1, 95.6, 54.4]

  //   }, {
  //     name: 'Seaon',
  //     data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5,
  //       106.6, 92.3]

  //   }, {
  //     name: 'cropType',
  //     data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
  //       51.2]

  //   }, 
  // ]
  // }

  getChartAllIndentor(cropType) {
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
    if (cropType.year) {
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
      param = {
        search: {
          crop_type: cropType
        }
      }
    }
    const result = this.service.postRequestCreator('get-chart-all-indentor', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop_sec = data.EncryptedResponse.data;
        let indentLiftingQty = [];
        let indentLiftedQty = [];
        let indentQty = [];
        let username = [];
        for (let value of this.chartCrop_sec) {
          indentLiftingQty.push(value.quantity ? value.quantity : 0);
          indentLiftedQty.push(value.lifting_quantity ? value.lifting_quantity : 0);
          indentQty.push(parseInt(value.indent_quantity ? value.indent_quantity : 0));
          username.push((value.name ? value.name : 0));
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
            '#B64B1D',
            '#DC8B3A',
            '#5B1E03'
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
              data: this.indentLiftingQty
            },
            {
              name: 'Breeder Seed Lifting',
              data: this.indentLiftedQty

            },
          ]
        }

        this.chart = Highcharts.chart("containers", this.options_sec);
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
          // console.log('this.indentYearthis.indentYear', this.indentYear);
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
      // console.log('this.itemCountthis.itemCount',this.itemCount.total_crop);
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
      // console.log('this.itemCountthis.itemCount',this.itemCount.total_crop);
    })
  }

  indentAndLifting(cropType) {
    const param = {
      search: {
        crop_type: cropType
      }
    }
    const route = "get-total-indent";
    const result = this.service.postRequestCreator(route, null, param).subscribe(data => {
      this.totalIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // console.log('this.itemCountthis.itemCount',this.itemCount.total_crop);
    })
  }

  getTotalLifted(cropType) {
    let param = {
      search: {
        crop_type: cropType
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
        crop_type: cropType
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
        crop_type: cropType
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
    if (formData.crop_name) {
      const foundData = this.filterData.filter((x: any) => x.crop_code == formData.crop_name);
      this.crop_name = foundData[0].m_crop.crop_name;
    }
    this.year = formData.year_of_indent ? formData.year_of_indent : '';
    this.season = formData.season ? formData.season : '';
    this.isYear = true;
    this.isSeason = true;
    this.isCropName = true;
    this.submitted = true;
    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
      return;
    }
    let data = {
      "year": formData.year_of_indent,
      "season": formData.season,
      "crop_name": formData.crop_name,
      "variety": formData.variety,
      "crop_type": formData.crop_type,
    }

    if (formData.crop_name == 'cumulative') {
      this.type();
    } else {
      this.getIndenterDetails(formData.crop_type, data);
      this.getChartAllIndentor(data);
    }
  }

  clear() {
    this.ngForm.controls["year_of_indent"].setValue("");
    this.ngForm.controls["season"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    // this.ngForm.controls["variety"].setValue("");
  }
  covertintoPositive(item){
    let data = item ? Math.abs(item) :0;
    return data ? data.toFixed(2) :0
  }
}