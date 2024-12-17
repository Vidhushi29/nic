import { Component, OnInit } from '@angular/core';
import { convertDate, removeDuplicateObjectValues } from '../_helpers/utility';
import * as Highcharts from "highcharts";
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeedServiceService } from '../services/seed-service.service';
import { Router } from '@angular/router';
import { ProductioncenterService } from '../services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-production-dashboard',
  templateUrl: './production-dashboard.component.html',
  styleUrls: ['./production-dashboard.component.css']
})
export class ProductionDashboardComponent implements OnInit {
  chart:any
  newtodayDate
  todayDate=new Date();
  seasonList: any;
  ngForm!: FormGroup;
  yearOfIndent = []
  cropTypeList: any;
  cropVarietyDataList: any;
  indentData: any;
  count: any;
  chartCrop=[];
  cropname=[];
  authUserId: any;
  allocateStatus: string;
  indentQty=[];
  variety: any;
  submitted: boolean = false;
  lifting: any[];
  notFound: boolean=false;
  filterData: any;
  totalLifted: any;
  unit: string;
  year: any;
  season: any;
  isYear: boolean=false;
  isSeason: boolean=false;
  indentYear: any[];
  isBsp1Completed: any;
  isBsp5Completed: any;
  allCombileData: boolean=false;
  cropDropdown: any[];
  chooseOnlyYear: boolean=false;
  chooseYearCrop: boolean=false;
  cropVariety: any;
  distinctCrop: any[];
  actualLifting: any[];
  crop_name: any;
  isCropName: boolean=false;
  liftingByCrop: any[];
  availSeed: any;
  bsp2Count: any;
  bsp5bCount: any;
  bsp4Count: any;
  countItem: any;
  countLabelItem: any;
  actualProduction: any[];
  actualProd: any[];
  isBsp2Completed: string;
  isBsp3Completed: string;
  isBsp4Completed: string;
  isBsp5aCompleted: string;
  targetedQty: any[];
  notFoundData: boolean;
  constructor(
    private service: SeedServiceService,
    private fb: FormBuilder,
    private productionCenterService: ProductioncenterService,
    private router: Router
    ) {this.createform() }
  createform(){
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_name: [''],
      crop_type: ['A'],
      variety: [''],

    });
  }

   ngOnInit(): void {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
    // this.type();
    // this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue=>{
    //   this.unit = (newValue == 'A')?'Quintal':'Kg';
    //   this.getChartIndentData(newValue);
    //   this.countItems(newValue);
    //   this.countLabelItems(newValue);
    //   this.getAvailNucleusSeed(newValue);
    //   this.getFilterData(newValue);
    //   this.getTotalLifted(newValue);
    //   this.getIndenterDetails(newValue,'filterData');
    // })
    // this.getSeasonData();
    // this.getCropTypeData();
    // this.getCropVarietyData();
    this.chart = Highcharts.chart("container", this.options);
    // this.convertDate();
    // this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue=>{
    //   if(newValue){
    //     this.getVariety(newValue);
    //   }
    // })
  }

  type(){
    if(this.ngForm.controls['crop_type'].value == 'A'){
        this.unit = 'Quintal';
        this.getChartIndentData('A');
        this.countItems('A');
        this.countLabelItems('A');
        this.getAvailNucleusSeed('A');
        this.getFilterData('A');
        this.getTotalLifted('A');
        this.getIndenterDetails('A','filterData');
    }
  }

  getChartIndentData(cropType){
    let param;
    if(cropType.year){
      param = {
        search:{
          user_id: this.authUserId,
          year:cropType.year,
          season:cropType.season,
          crop_code:cropType.crop_name,
          variety:cropType.variety,
          crop_type:cropType.crop_type
        }
      }
    }else{
      param = {
        search:{
          user_id: this.authUserId,
          crop_type:cropType
        }
      }
    }
    const result = this.productionCenterService.postRequestCreator('get-chart-indent-data', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          this.chartCrop = data.EncryptedResponse.data;
          let crop = [];
          let targetedQty = [];
          let actualProduction = [];
          let actualLifting = [];
          for(let value of this.chartCrop){
            crop.push(value['m_crop.crop_name']);
            targetedQty.push(parseInt(value['bsp_1.bsp1_production_centers.quantity_targeted']?value['bsp_1.bsp1_production_centers.quantity_targeted']:0));
            actualProduction.push(parseInt(value.actual_seed_production?value.actual_seed_production:0));
            actualLifting.push(parseFloat(value.lifting_quantity?value.lifting_quantity:0));
          }
          this.cropname = crop; 
          this.targetedQty = targetedQty; 
          this.actualProduction = actualProduction; 
          this.actualLifting = actualLifting; 
            this.options = {
              chart: {
                type: 'column',
                // width:'500',
                overflow:'scroll'
              
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
                  '<td style="padding:0"><b>{point.y:.1f} '+this.unit+'</b></td></tr>',
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
                  name: 'Quantity Targeted',
                  data: this.targetedQty
              
                }, {
                  name: 'Actual Production',
                  data: this.actualProduction
              
                }, {
                  name: 'Lifting',
                  data: this.actualLifting
              
                }, 
              ]
            }  
            this.chart = Highcharts.chart("container", this.options);       
            console.log('data.EncryptedResponse.data',this.options);
      }
    
    })
  }
  getChartDataByCrop(cropType){
    if((cropType.year == '') && (cropType.season == '')){
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
    if(cropType.year){
      param = {
        search:{
          user_id: this.authUserId,
          year:cropType.year,
          season:cropType.season,
          crop_code:cropType.crop_name,
          variety:cropType.variety,
          crop_type:cropType.crop_type
        }
      }
    }else{
      param = {
        search:{
          user_id: this.authUserId,
          crop_type:cropType
        }
      }
    }
    const result = this.productionCenterService.postRequestCreator('get-chart-data-by-crop', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          this.chartCrop = data.EncryptedResponse.data;
          let crop = [];
          let indentQty = [];
          let actualProd = [];
          let liftingByCrop = [];
          for(let value of this.chartCrop){
            crop.push(value.variety_name);
            // indentQty.push(parseInt(value.indent_quantity?value.indent_quantity:0));
            actualProd.push(parseInt(value.actual_seed_production?value.actual_seed_production:0));
            liftingByCrop.push(parseFloat(value.lifting_quantity?value.lifting_quantity:0));
          }
          this.cropVariety = crop; 
          this.indentQty = indentQty; 
          this.actualProd = actualProd; 
          this.liftingByCrop = liftingByCrop; 
            this.options = {
              chart: {
                type: 'column',
                // width:'500',
                overflow:'scroll'
              
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
                  '<td style="padding:0"><b>{point.y:.1f} '+this.unit+'</b></td></tr>',
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
                  name: 'Quantity Targeted',
                  data: this.indentQty
              
                }, {
                  name: 'Actual Production',
                  data: this.actualProd
              
                }, {
                name: 'Lifting',
                data: this.liftingByCrop
            
              }, 
              ]
            }  
            this.chart = Highcharts.chart("container", this.options);       
            console.log('data.EncryptedResponse.data',this.options);
      }
    
    })
  }

  options: any = {
  }
  convertDate(){
    
    this.newtodayDate=convertDate(this.todayDate)
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
    const result = this.productionCenterService.postRequestCreator(route, null).subscribe(data => {
      this.cropTypeList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      
    })
  }
  async getCropVarietyData() {

  
     
      this.productionCenterService
        .postRequestCreator("indetor-dashboard-variety-name",  null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            console.log(apiResponse);

            this.cropVarietyDataList = apiResponse.EncryptedResponse.data;
          }
        });
    

  }
  getIndenterDetails(cropType,data){
    let param;
    if(data.year){
      if(data.year && !data.crop_name){
        this.chooseOnlyYear = true;
        this.chooseYearCrop = false;
        this.allCombileData = false;
      }else if(data.year && data.crop_name){
        this.chooseOnlyYear = false;
        this.chooseYearCrop = true;
        this.allCombileData = false;
      }
      param = {
        search:{
          user_id: this.authUserId,
          year:data.year,
          season:data.season,
          crop_code:data.crop_name,
          variety:data.variety,
          crop_type:cropType
        }
      }
    }else{
      this.allCombileData = true;
      param = {
        search:{
          user_id: this.authUserId,
          crop_type:cropType
        }
      }
    }
    const result = this.productionCenterService.postRequestCreator('get-indeter-details', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          this.indentData = data.EncryptedResponse.data;
          if(this.indentData.length > 0){
            this.notFoundData = false;
            let year = [];
            let bsp1 = [];
            let bsp2 = [];
            let bsp3 = [];
            let bsp4 = [];
            let bsp5a = [];
            let bsp5 = [];
            for (let value of this.indentData) {
              year.push(value.year);
              bsp1.push(value.bsp_1 && value.bsp_1.id?value.bsp_1.id:'null');
              bsp2.push(value.bsp_2 && value.bsp_2.id?value.bsp_2.id:'null');
              bsp3.push(value.bsp_3 && value.bsp_3.id?value.bsp_3.id:'null');
              bsp4.push(value.bsp_4 && value.bsp_4.id?value.bsp_4.id:'null');
              bsp5a.push(value.bsp_5_a && value.bsp_5_a.id?value.bsp_5_a.id:'null');
              bsp5.push(value.bsp_5_b && value.bsp_5_b.id?value.bsp_5_b.id:'null');
            }
            year = [...new Set(year)];
            let indentYears = [];
            let newObj = [];
            let i = 0;
            for(let value of year){
              let keyArr = [];
              let cropName=[];
              for (let val of this.indentData) {
                if (val.year == value) {
                  keyArr.push(val.season);
                  cropName.push(val['m_crop.crop_name']);
                }
              }
              keyArr = [...new Set(keyArr)];
              cropName = [...new Set(cropName)];
              newObj.push({"year":value, 'season': keyArr, 'crop_name':cropName});
              i++;
            }
            this.indentYear = newObj;
            // console.log('this.indentYearthis.indentYear', this.indentYear);
            this.isBsp1Completed = ((bsp1.includes('null')) == true)?'Pending':'Completed';
            this.isBsp2Completed = ((bsp2.includes('null')) == true)?'Pending':'Completed';
            this.isBsp3Completed = ((bsp3.includes('null')) == true)?'Pending':'Completed';
            this.isBsp4Completed = ((bsp4.includes('null')) == true)?'Pending':'Completed';
            this.isBsp5aCompleted = ((bsp5a.includes('null')) == true)?'Pending':'Completed';
            this.isBsp5Completed = ((bsp5.includes('null')) == true)?'Pending':'Completed';
          }else{
            this.notFoundData = true;
          }
      }
    
    })
  }

  countItems(cropType){
    const param = {
      search:{
        user_id: this.authUserId,
        crop_type:cropType
      }
    }
    const result = this.productionCenterService.postRequestCreator('count-card-items', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          this.countItem = data.EncryptedResponse.data[0];
          
      }
    
    })
  }
  countLabelItems(cropType){
    const param = {
      search:{
        user_id: this.authUserId,
        crop_type:cropType
      }
    }
    const result = this.productionCenterService.postRequestCreator('count-label-items', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          this.countLabelItem = data.EncryptedResponse.data[0];
          
      }
    
    })
  }

  getAvailNucleusSeed(cropType){
    const param = {
      search:{
        user_id: this.authUserId,
        crop_type:cropType,
        year:(new Date).getFullYear()
      }
    }
    const result = this.productionCenterService.postRequestCreator('get-avail-nucleus-seed', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          // console.log('data.EncryptedResponse.data',data.EncryptedResponse.data);
          this.availSeed = data.EncryptedResponse.data[0];
          
      }
    
    })
  }

  getbsp2Card(cropType){
    const param = {
      search:{
        user_id: this.authUserId,
        crop_type:cropType,
      }
    }
    const result = this.productionCenterService.postRequestCreator('bsp2-card', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          // console.log('data.EncryptedResponse.data',data.EncryptedResponse.data);
          this.bsp2Count = data.EncryptedResponse.data[0];
          
      }
    
    })
  }

  getbsp4Card(cropType){
    const param = {
      search:{
        user_id: this.authUserId,
        crop_type:cropType,
      }
    }
    const result = this.productionCenterService.postRequestCreator('bsp4-card', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          // console.log('data.EncryptedResponse.data',data.EncryptedResponse.data);
          this.bsp4Count = data.EncryptedResponse.data[0];
          
      }
    
    })
  }

  getbsp5bCard(cropType){
    const param = {
      search:{
        user_id: this.authUserId,
        crop_type:cropType,
      }
    }
    const result = this.productionCenterService.postRequestCreator('bsp5b-card', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          // console.log('data.EncryptedResponse.data',data.EncryptedResponse.data);
          this.bsp5bCount = data.EncryptedResponse.data[0];
          
      }
    
    })
  }

  getVariety(crop_code){
    if(crop_code){
      const param ={
        search:{
          crop_code:crop_code,
          user_id:this.authUserId,
        }
      }
      const result = this.productionCenterService.postRequestCreator('get-variety', param, null).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
          && data.EncryptedResponse.status_code == 200) {
            let variety = data.EncryptedResponse.data;
            if(variety.length > 0){
              this.ngForm.controls['variety'].enable();
              this.variety = variety;
            }
        }
      
      })
    }
  }

  onSubmit(formData) {
    if(formData.crop_name){
      const foundData = this.filterData.filter((x: any) => x.crop_code == formData.crop_name);
      this.crop_name = foundData[0]['m_crop.crop_name'];
    }
    this.year = formData.year_of_indent?formData.year_of_indent:'';
    this.season = formData.season?formData.season:'';
    this.isYear=true;
    this.isSeason=true;
    this.isCropName=true;
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

    if(formData.crop_name=='cumulative'){
      this.type();
    }else{
      this.getIndenterDetails(formData.crop_type,data);
      if(formData.crop_name){
        this.getChartDataByCrop(data);
      }
    }
  }

  getFilterData(cropType){
    let param = {
      search:{
        user_id: this.authUserId,
        crop_type:cropType
      }
    }
    const result = this.productionCenterService.postRequestCreator('get-filter-data', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          this.filterData = data.EncryptedResponse.data;
          if(this.filterData.length > 0){
            this.notFound = false;
            let year = [];
            for (let value of this.filterData) {
              year.push(value.year);
            }
            year = [...new Set(year)];
            let yearOfIndents = [];
            let newObj = [];
            let i = 0;
            for(let value of year){
              let distinctCrop = [];
              for (let val of this.filterData) {
                if (val.year == value) {
                  distinctCrop.push({'crop_code':val['m_crop.crop_code'], 'crop_name':val['m_crop.crop_name']});
                }
              }
              distinctCrop = removeDuplicateObjectValues(distinctCrop, 'crop_code')
              newObj.push(distinctCrop);
              i++;
              yearOfIndents.push({"year":value});
            }
            this.yearOfIndent = yearOfIndents;
            this.distinctCrop = newObj;
          }else{
            this.notFound = true;
          }
      }
    
    })
  }

  getTotalLifted(cropType){
    let param = {
      search:{
        user_id: this.authUserId,
        crop_type:cropType
      }
    }
    const result = this.productionCenterService.postRequestCreator('get-total-lifted-count', param, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code
        && data.EncryptedResponse.status_code == 200) {
          this.totalLifted = data.EncryptedResponse.data;
          
      }
    
    })
  }

  clear() {
    this.ngForm.controls["year_of_indent"].setValue("");
    this.ngForm.controls["season"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls["variety"].setValue("");
  }

}
