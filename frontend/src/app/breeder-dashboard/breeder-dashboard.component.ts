import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Highcharts from "highcharts";
import Swal from 'sweetalert2';
import { BreederService } from '../services/breeder/breeder.service';
import { SeedServiceService } from '../services/seed-service.service';
import { convertDate, removeDuplicateObjectValues } from '../_helpers/utility';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MasterService } from '../services/master/master.service';
@Component({
  selector: 'app-breeder-dashboard',
  templateUrl: './breeder-dashboard.component.html',
  styleUrls: ['./breeder-dashboard.component.css']
})
export class BreederDashboardComponent implements OnInit {
  chart: any

  chart_sec: any;
  newtodayDate;
  isavtive = false
  todayDate = new Date();
  img1 = 'assets/images/wash_white.svg';
  img2 = 'assets/images/wash_red.svg'
  authUserId: any;
  ngForm!: FormGroup;
  unit: string;
  allCombileData: boolean = false;
  indentData: any;
  notFound: boolean = false;
  indentYear: any[];
  isBsp1Completed: string;
  isBsp5Completed: string;
  seasonList: any;
  variety: any;

  yearOfIndent = []
  cropTypeList: any;
  cropVarietyDataList: any;
  count: any;
  chartCrop = [];
  cropname = [];
  allocateStatus: string;
  indentQty = [];
  submitted: boolean = false;
  lifting: any[];
  filterData: any;
  totalLifted: any;
  year: any;
  season: any;
  isYear: boolean = false;
  isSeason: boolean = false;
  cropDropdown: any[];
  chooseOnlyYear: boolean = false;
  chooseYearCrop: boolean = false;
  cropVariety: any;
  distinctCrop: any[];
  actualLifting: any[];
  crop_name: any;
  isCropName: boolean = false;
  liftingByCrop: any[];
  totalBSP: any;
  prodBreederSeed: any;
  breederCount: any;
  pendingSeed: any;
  prodBreederSeedChart: any[];
  pendingProdSeed: any;
  pendingBreederCount: any[];
  currentYear: number;
  cropTypeLoginWise: any;
  graphFilterCrop:any[];
  cropProductionValue: any[];
  cropAllocated: any[];
  varietyProductionValue: any[];
  varietyAllocated: any[];
  chartCrop_sec: any;
  graphFilterUsers: any;
  indentLiftingQty: any[];
  indentLiftedQty: any[];
  username: any[];
  indenterCropName: any[];
  showIndenterVariety: boolean = false
  showVariety: boolean = false;
  graphtitle='Crop';
  cropFilterData: any;
  totalIndentCard = true;

  indenterCropFilterData: any;
  todayDateintoDDMMYYY = convertDate(this.todayDate)
  cropDataList: any;

  dropdownSettings: IDropdownSettings = {};
  secondCardData: any;
  // currentYear: number;
  chartData: any[];
  xAxisLabel: string;
  yAxisLabel: string;
  colorScheme: any;
  RecievedIndentDataQantity: any;
  freezeDataQantity: any;
  actualProduction: any;
  pendingAllotment: number;
  isSearch: boolean=false;
  constructor(
    private breederService: BreederService,
    private service: SeedServiceService,
    private master: MasterService,
    private fb: FormBuilder,
  ) { this.createform() }
  createform() {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_name: [''],
      crop_type: ['A'],
      crop_name_graph: [''],
      variety_name_graph: [''],
      variety: ['']

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
          // this.ngForm.controls['variety_name_graph'].setValue('all_crop');

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
        // this.getCardFilterCropData();
        // this.getSecondCardData(null)
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
        // this.getCardFilterCropData();

      }
    })

  }
  ngOnInit(): void {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    // this.ngForm.controls['year_of_indent'].setValue(this.currentYear);
    // this.ngForm.controls['season'].setValue("K");
    // this.type();
    // this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
    //   this.unit = (newValue == 'A') ? 'Quintal' : 'Kg';
    //   this.ngForm.controls['crop_name'].setValue('')
    //     this.ngForm.controls['season'].setValue('')
    //     this.ngForm.controls['year_of_indent'].setValue('')
    //   // this.getChartIndentData(newValue);
    //   // this.getCountBPC();
    //   // this.getTotalBreederCrop();
    //   // this.getTotalAllocatedProdBreederSeed();
    //   // this.getFilterData(newValue);
    //   // // this.getTotalLifted(newValue);
    //   // this.getIndenterDetails(newValue, 'filterData');
    // })
    // this.chart = Highcharts.chart("container", this.options);
    // this.chart = Highcharts.chart("variety-container", this.options_variety);

    // this.chart_sec = Highcharts.chart("containers", this.options_sec);
    // this.chart_sec = Highcharts.chart("crop-containers", this.options_sec);
    // this.getSeasonData();

    // this.convertDate();
    // this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.getVariety(newValue);
    //     this.getGraphFilterCropData();
    //     this.getToatlFreezeIndentData();
    //     this.getChartIndentData(null);
    //   }
    //   this.getGraphFilterCropData();
    // })
  }

  type() {
    this.dropdownSettings = {
      idField: 'crop_code',
      textField: 'crop_name',
      enableCheckAll: false,
      limitSelection: -1,
    };
    if (this.ngForm.controls['crop_type'].value == 'A') {
      this.unit = 'Quintal';
    }else{
      this.unit = 'Kg';
    }
    this.getChartIndentData(this.ngForm.controls['crop_type'].value);
    this.getCountBPC();
    this.getTotalBreederCrop();
    this.getTotalAllocatedProdBreederSeed();
    this.getFilterData(this.ngForm.controls['crop_type'].value);
    this.getTotalPendingAllocatedProdBreederSeed(this.ngForm.controls['crop_type'].value);
    this.getIndenterDetails(this.ngForm.controls['crop_type'].value, 'filterData');
    this.getChartAllIndentor(this.ngForm.controls['crop_type'].value);
    this.getActualProduction();
  }
  options_sec: any = {};
  options_sec_indentor: any = {};
  options_variety: any = {};

  getGraphFilterCropData() {
    if (this.ngForm.controls['crop_name'].value) {
      let cropdataArray = this.ngForm.controls['crop_name'].value;

      let cropArray = []
      cropdataArray.forEach(element => {
        cropArray.push(element);
      });
     
    } else {
      this.graphFilterCrop = this.chartCrop;
      
    }
  }

  getChartIndentData(cropType) {
    ;
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
      if (this.ngForm.controls['crop_name'].value && (this.ngForm.controls['crop_name'].value.length>0)) {
        this.ngForm.controls['crop_name'].value.forEach(ele => {
          cropCode.push(ele.crop_code);
        });
      }else{
        if(this.cropDataList && this.cropDataList.length>0){
          this.cropDataList.forEach(ele => {
            cropCode.push(ele && ele.crop_code ? ele.crop_code:'')
          })
        }
  
      }
      

      param = {
        search: {
          crop_code: cropCode &&(cropCode.length>0) ? cropCode : '',
          graphType :'pd-pc',
          crop_type: this.ngForm.controls['crop_type'].value ? this.ngForm.controls['crop_type'].value : this.cropTypeLoginWise,
          year: this.ngForm.controls['year_of_indent'].value ? this.ngForm.controls['year_of_indent'].value : '',
          season: this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : ''
        }
      }
    }
    const result = this.service.postRequestCreator('getChartIndentDataSecond', null, param).subscribe((data: any) => {
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
        let liftedQty =[];
        for (let value of this.chartCrop) {
          crop.push(value.crop_name);
          indentQty.push(parseFloat(value.indent_quantity ? value.indent_quantity : 0));
          lifting.push(parseFloat(value.quantity ? value.quantity : 0));
          actualLifting.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
          production.push(parseFloat(value.production ? value.production : 0));
          allocated.push(parseFloat(value.allocated ? value.allocated : 0));
          liftedQty.push(parseFloat(value.total_lifting ? value.total_lifting : 0));
        }
        this.cropname = crop;
          let crops=[];
        if(this.cropDataList  && this.cropDataList.length>0){
        if(this.chartCrop  && this.chartCrop.length>0){
          for(let data of this.chartCrop ){
            crops.push(this.cropDataList.filter(x=>x.crop_code == data.crop_code))
          }
        }
        }
        
        let cropArr=crops && (crops.length>0)? crops.flat():''  
        console.log(cropArr,'getChartIndentDataSecond')      
        console.log(crops,'getChartIndemmmkmkntDataSecond')      
        let cropNameArr =[];        
        if(cropArr && cropArr.length>0){
          this.graphFilterCrop=[]
          // this.ngForm.controls['crop_name_graph'].setValue(cropArr)
          for(let item of cropArr){
            // this.graphFilterCrop.push(cropArr)
            // if (this.ngForm.controls['crop_name'].value && (this.ngForm.controls['crop_name'].value.length>0) ) {
              
            // this.graphFilterCrop.push({crop_name:item && item.crop_name ? item.crop_name :'',crop_code:item && item.crop_code ? item.crop_code:''})
            // }
            // else{
            //   // this.graphFilterCrop=[];
            // }
              this.graphFilterCrop.push({crop_name:item && item.crop_name ? item.crop_name :'',crop_code:item && item.crop_code ? item.crop_code:''})
          }        
        }
        if(cropArr && cropArr.length>0){       
          for(let item of cropArr){           
           cropNameArr.push(item && item.crop_name ? item.crop_name :'')
          }        
        }
        console.log(cropNameArr,'cropNameArrcropNameArr')
        if(this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value.length>0){
          this.graphFilterCrop=[]         
          for(let item of this.ngForm.controls['crop_name'].value){
            this.graphFilterCrop.push({crop_name:item && item.crop_name ? item.crop_name :'',crop_code:item && item.crop_code ? item.crop_code:''})

          }
        }
       
        this.indentQty = indentQty;
        this.lifting = lifting;
        this.actualLifting = actualLifting;
        this.cropProductionValue = production;
        this.cropAllocated = allocated;
        
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
            categories: cropNameArr,
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
            '#FF9F43',
            '#0ABDE3',
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
            name: 'Allotment Quantity',
            data: this.cropAllocated

          },
          {
            name: 'Produced Quantity',
            data: this.cropProductionValue

          },
         
          {
            name: 'Lifted Quantity',
            data: liftedQty

          },
          ]
        }
        this.chart = Highcharts.chart("container", this.options);
      }

    })
  }
  graphShowHiddenFunctionality(event) {

  }
  getChartIndentDataVariety(cropType) {
    let param;
    param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: this.ngForm.controls['crop_name_graph'].value,
        crop_type: this.cropTypeLoginWise
      }
    }

    const result = this.service.postRequestCreator('getChartIndentDataVarietyforpdpc', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop = data.EncryptedResponse.data;
        let crop = [];
        let indentQty = [];
        let lifting = [];
        let actualLifting = [];
        let production = [];
        let allocated = [];
        let liftingQty =[]
        for (let value of this.chartCrop) {
          console.log(value,'chartCrop')
          crop.push(value.variety_name);
          indentQty.push(parseFloat(value.indent_quantity ? value.indent_quantity : 0));
          lifting.push(parseFloat(value.quantity ? value.quantity : 0));
          actualLifting.push(parseFloat(value.lifting_quantity ? value.lifting_quantity : 0));
          production.push(parseFloat(value.production ? value.production : 0));
          allocated.push(parseFloat(value.allocated ? value.allocated : 0));
          liftingQty.push(parseFloat(value.lifting_qty ? value.lifting_qty : 0));
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
            '#FF9F43',
            '#0ABDE3',
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
            name: 'Allotment Quantity',
            data: this.varietyAllocated

          },
          {
            name: 'Produced Quantity',
            data: this.varietyProductionValue

          },
       
          {
            name: 'Lifted Quantity',
            data: liftingQty

          },
          ]
        }
        this.chart = Highcharts.chart("variety-container", this.options_variety);
      }

    })
  }
  getFilterData(cropType) {
    let param = {
      search: {
        // crop_type: cropType,
        year:this.ngForm.controls['year_of_indent'].value,
        crop_type:this.ngForm.controls['crop_type'].value,
        season:this.ngForm.controls['season'].value,
        graphType:'pdpc'
      }
    }
    const result = this.service.postRequestCreator('getChartAllIndentorforpdpc', null, param).subscribe((data: any) => {
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
          console.log(year,'yearr')
          let yearOfIndents = [];
          let newObj = [];
          let i = 0;
          for (let value of year) {
            let distinctCrop = [];
            for (let val of this.filterData) {
              if (val.year == value) {
                distinctCrop.push({ 'crop_code': val.crop_code, 'crop_name': val.crop_name });
              }
            }
            distinctCrop = removeDuplicateObjectValues(distinctCrop, 'crop_code')
            newObj.push(distinctCrop);
            i++;
            yearOfIndents.push({ "year": value });
          }
          this.yearOfIndent = yearOfIndents;
          console.log(yearOfIndents,'yearOfIndentsyearOfIndents')
          this.distinctCrop = newObj;
        } else {
          // this.notFound = true;
        }
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
    let cropCodeArray = [];
    if (this.ngForm.controls['crop_name'].value) {
      this.ngForm.controls['crop_name'].value.forEach(ele => {
        cropCodeArray.push(ele.crop_code);
      })
    }
    else{
      if(this.cropDataList && this.cropDataList.length>0){
        this.cropDataList.forEach(ele => {
          cropCodeArray.push(ele && ele.crop_code ? ele.crop_code:'')
        })
      }

    }
    param = {
      search: {
        crop_type: this.ngForm.controls['crop_type'].value ? this.ngForm.controls['crop_type'].value : '',
        year: this.ngForm.controls['year_of_indent'].value ? this.ngForm.controls['year_of_indent'].value : '',
        season: this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : '',
        crop_code : cropCodeArray && (cropCodeArray.length>0) ?  cropCodeArray :''
      }
    }
    const result = this.service.postRequestCreator('getChartAllIndentorforPdpcSecond', null, param).subscribe((data: any) => {
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
          allocated.push((value.allocatedQtySecond ? value.allocatedQtySecond : 0));
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
              name: 'Breeder Seed Allocatted for Lifting',
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
    let cropCodeArray = [];
    if (this.ngForm.controls['crop_name'].value) {
      this.ngForm.controls['crop_name'].value.forEach(ele => {
        cropCodeArray.push(ele.crop_code);
      })
    }
    else{
      if(this.cropDataList && this.cropDataList.length>0){
        this.cropDataList.forEach(ele => {
          cropCodeArray.push(ele && ele.crop_code ? ele.crop_code:'')
        })
      }

    }
    param = {
      search: {
        crop_code: cropCodeArray && (cropCodeArray.length>0) ?  cropCodeArray:'',
        year: this.ngForm.controls['year_of_indent'].value ? this.ngForm.controls['year_of_indent'].value : '',
        season: this.ngForm.controls['season'].value ? this.ngForm.controls['season'].value : '',
        user_id: this.ngForm.controls['variety_name_graph'].value
      }
    }
    const result = this.service.postRequestCreator('getChartAllIndentorVarietyforpdpc', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
        this.chartCrop_sec = data.EncryptedResponse.data;
        console.log('this.chartCrop_sec', this.chartCrop_sec);
        let indentLiftingQty = [];
        let indentLiftedQty = [];
        let indentQty = [];
        let cropName = [];
        let allocated = [];
        for (let value of this.chartCrop_sec) {
          indentLiftingQty.push(value.quantity ? value.quantity : 0);
          indentLiftedQty.push(value.lifting_quantity ? value.lifting_quantity : 0);
          indentQty.push(parseFloat(value.indent_quantity ? value.indent_quantity : 0));
          cropName.push(value.crop_name ? value.crop_name : '');
          allocated.push(value.allocatedQtySecondcrop ? value.allocatedQtySecondcrop : '');
        }
        this.indentLiftingQty = indentLiftingQty;
        this.indentQty = indentQty;
        this.indentLiftedQty = indentLiftedQty;
        this.indenterCropName = cropName;
        console.log('cropName=======', cropName);
        let crops=[];
        if(this.chartCrop_sec  && this.chartCrop_sec.length>0){
        if(this.cropDataList  && this.cropDataList.length>0){

          for(let data of this.chartCrop_sec ){
            crops.push(this.cropDataList.filter(x=>x.crop_code == data.crop_code))
          }
        }
        }
        
        let cropArr=crops && (crops.length>0)? crops.flat():''
        let cropNameArr =[];
        if(cropArr && cropArr.length>0){
          for(let item of cropArr){
            cropNameArr.push(item && item.crop_name ? item.crop_name :'')
          }
          // cropNameArr.push()

        }

        console.log(crops,'cropscrops')
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
            categories: cropNameArr,
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
              data: this.indentLiftedQty

            },
          ]
        }

        this.chart = Highcharts.chart("crop-containers", this.options_sec);
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
        crop_code: cropCode ? cropCode : null,
      }
    }
    this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.RecievedIndentDataQantity = data.EncryptedResponse.data;
    })
  }
  getCardFilterCropData() {
    let route = "getChartAllIndentorCropFilterforpdpc";
    let param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        graphType:'pdpc'
      }
    }
    this.service.postRequestCreator(route, null, param).subscribe(data => {
      this.cropDataList = data.EncryptedResponse.data;
    })
  }
  // getCropTypeData() {

  //   const route = "indetor-dashboard-crop-name";
  //   const result = this.breederService.postRequestCreator(route, null).subscribe(data => {
  //     this.cropTypeList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

  //   })
  // }
  // async getCropVarietyData() {     
  //     this.breederService.postRequestCreator("indetor-dashboard-variety-name",  null).subscribe((apiResponse: any) => {
  //         if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
  //           && apiResponse.EncryptedResponse.status_code == 200) {
  //           console.log(apiResponse);

  //           this.cropVarietyDataList = apiResponse.EncryptedResponse.data;
  //         }
  //       });


  // }
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
    const result = this.breederService.postRequestCreator('get-indeter-details', null, param).subscribe((data: any) => {
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

  getCountBPC() {
    const result = this.breederService.postRequestCreator('get-breeder-count-bpc', null, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.totalBSP = data.EncryptedResponse.data[0];
      }
    })
  }

  getTotalBreederCrop() {
    let cropCodeArray = [];
    if (this.ngForm.controls['crop_name'].value) {
      this.ngForm.controls['crop_name'].value.forEach(ele => {
        cropCodeArray.push(ele.crop_code);
      })
    }
    else{
      if(this.cropDataList && this.cropDataList.length>0){
        this.cropDataList.forEach(ele => {
          cropCodeArray.push(ele && ele.crop_code ? ele.crop_code:'')
        })
      }

    }
    const param = {
      search: {
        user_id: this.authUserId,
        year: this.ngForm.controls['year_of_indent'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: cropCodeArray && (cropCodeArray.length>0) ? cropCodeArray :0
      }
    }
    const result = this.breederService.postRequestCreator('get-total-breeder-crop', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.breederCount = data.EncryptedResponse.data;
      }
    })
  }
  getTotalAllocatedProdBreederSeed() {
    let cropNameData = [];
    // if(this.ngForm.controls['crop_code'].value){
    //   cropNameData = this.ngForm.controls['crop_code'].value;
    //   cropNameData.forEach(ele=>{
    //     cropCodeArray.push(ele.crop_code)
    //   })

    // }
    let cropCodeArray = [];
    if (this.ngForm.controls['crop_name'].value) {
      this.ngForm.controls['crop_name'].value.forEach(ele => {
        cropCodeArray.push(ele.crop_code);
      })
    }
    else{
      if(this.cropDataList && this.cropDataList.length>0){
        this.cropDataList.forEach(ele => {
          cropCodeArray.push(ele && ele.crop_code ? ele.crop_code:'')
        })
      }

    }
    const param = {
      search: {
        user_id: this.authUserId,
        year: this.ngForm.controls['year_of_indent'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: cropCodeArray && (cropCodeArray.length>0) ? cropCodeArray :0
      }
    }
    const result = this.breederService.postRequestCreator('get-total-allocated-prod-breeder-seed', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.prodBreederSeed = data.EncryptedResponse.data[0];
      }
    })
  }
  getTotalPendingAllocatedProdBreederSeed(cropType) {
    let cropNameData = [];
    let cropCodeArray = [];
    if (this.ngForm.controls['crop_name'].value) {
      cropNameData = this.ngForm.controls['crop_name'].value;
      cropNameData.forEach(ele => {
        cropCodeArray.push(ele.crop_code)
      })

    }
    else{
      if(this.cropDataList && this.cropDataList.length>0){
        this.cropDataList.forEach(ele => {
          cropCodeArray.push(ele && ele.crop_code ? ele.crop_code:'')
        })
      }

    }
    const param = {
      search: {
        user_id: this.authUserId,
        year: this.ngForm.controls['year_of_indent'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        season: this.ngForm.controls['season'].value,
        graphType:'pdpc',
        crop_code: cropCodeArray   && (cropCodeArray.length>0)? cropCodeArray : null
      }
    }
    const result = this.breederService.postRequestCreator('getTotalPendingAllocatedProdBreederSeedSecond', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.pendingSeed = data.EncryptedResponse.data[0];
        this.pendingAllotment = this.pendingSeed && this.pendingSeed['sumofIndendetorData'] && this.pendingSeed['quantity_of_seed_produced'] ? (parseFloat(this.pendingSeed['sumofIndendetorData']) - parseFloat(this.pendingSeed['quantity_of_seed_produced'])):0
      }
    })
  }

  getActualProduction() {
    let cropNameData = [];
    let cropCodeArray = [];
    if (this.ngForm.controls['crop_name'].value) {
      cropNameData = this.ngForm.controls['crop_name'].value;
      cropNameData.forEach(ele => {
        cropCodeArray.push(ele.crop_code)
      })

    }
    const param = {
      search: {
        user_id: this.authUserId,
        year: this.ngForm.controls['year_of_indent'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: cropCodeArray ? cropCodeArray : null
      }
    }
    const result = this.breederService.postRequestCreator('get-actual-production', null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.actualProduction = data.EncryptedResponse.data[0];
      }
    })
  }

  getVariety(crop_code) {
    if (crop_code) {
      let cropCodeArray = [];
      if (this.ngForm.controls['crop_name'].value) {
        this.ngForm.controls['crop_name'].value.forEach(ele => {
          cropCodeArray.push(ele.crop_code);
        })
      }
      const param = {
        search: {
          crop_code: cropCodeArray.toString(),
          user_id: this.authUserId,
        }
      }
      const result = this.breederService.postRequestCreator('get-variety', null, param).subscribe((data: any) => {
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
  // graphShowHiddenFunctionality(event) {

  // }

  onSubmit(formData) {
    // console.log('formData.crop_name', formData.crop_name[0].crop_code);
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
    let year;
    let seaonlist;
    if(this.ngForm.controls['year_of_indent'].value){

     year = this.yearOfIndent.filter(item => item.year == this.ngForm.controls['year_of_indent'].value)
    
  
    }
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
    if(this.ngForm.controls['season'].value){
       seaonlist = this.seasonList.filter(item => item.season_code == this.ngForm.controls['season'].value)
      }
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
   
    else{

      // if (formData && formData.crop_name && formData.crop_name[0] && formData.crop_name[0].crop_code) {
      //   const foundData = this.filterData.filter((x: any) => x.crop_code == formData.crop_name[0].crop_code);
      //   this.crop_name = foundData[0].m_crop.crop_name;
      // }
      // if(this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value !==undefined && this.ngForm.controls['crop_name'].value.length > 0 ){
      //   this.ngForm.controls['crop_name'].value.forEach(obj => {
      //     this.crop_name= obj && obj.crop_name  && obj.crop_name.toString().length>30 ? obj.crop_name.toString().substring(0,30) + '...':obj.crop_name.toString();
      //   });
      // }
      
     
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
      let cropCodeData = [];
      if(this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value !==undefined && this.ngForm.controls['crop_name'].value.length > 0 ){
        this.ngForm.controls['crop_name'].value.forEach(element => {
          cropCodeData.push(element.crop_code)
        });
      }
   
      let data = {
        "year": formData.year_of_indent,
        "season": formData.season,
        "crop_name": cropCodeData ? cropCodeData : [],
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
      // this.getSecondCardData()
      this.getToatlRecievedIndentData();
      this.getToatlFreezeIndentData();
      this.getChartIndentData(null);
      this.getChartAllIndentor(null);
      this.getCropChartAllIndentor(null);
      this.getActualProduction();
      this.getTotalPendingAllocatedProdBreederSeed(null);    
    }

  }

  clear() {
    this.ngForm.controls['year_of_indent'].patchValue(this.currentYear);
    this.ngForm.controls["season"].setValue("K");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls["variety"].setValue("");
    this.isSearch=false;
    this.getActualProduction();
    this.getGraphFilterCropData();
    this.getToatlRecievedIndentData();
    this.getToatlFreezeIndentData();
    this.getChartIndentData(null);
    this.getChartAllIndentor(null);
    this.getCropChartAllIndentor(null);
    this.getTotalPendingAllocatedProdBreederSeed(null);
  }

  allocatedCard(item) {

    if (item == 'card2') {
      this.isavtive = true;
      this.img2 = 'assets/images/wash_white.svg'
      this.img1 = 'assets/images/wash_red.svg'
    }
    else {
      this.isavtive = false;
      this.img1 = 'assets/images/wash_white.svg';

      this.img2 = 'assets/images/wash_red.svg'
    }
  }
  getCropNamefrommlist(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name)
      }


    })
    return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();
   
  }
  getUNit(item){
    let Unit = item && (item == 'A') ? 'Quintal' : (item == 'H') ? 'Kg' : '';
    return Unit;
  }
}
