import { Component, ElementRef, OnInit, ViewChild,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { SumPipe } from '../pipe/sum.pipe';
import { jsPDF } from "jspdf";
import { IcarService } from 'src/app/services/icar/icar.service';
import { formatDate } from '@angular/common';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-nodal-officer-report',
  templateUrl: './nodal-officer-report.component.html',
  styleUrls: ['./nodal-officer-report.component.css']
})

export class NodalOfficerReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;
  seasonList: any = [];
  response_crop_group: any = [];
  data: any;
  data1: any;
  search = true;
  custom_array: any[];
  finalData: any[];
  fileName = 'submit-indents-breeder-seeds.xlsx';
  yearOfIndent: any = [
    // {name: "2025 - 2026", "value": "2025"},
    // {name: "2024-25", "value": "2024"},
    // {name: "2023-24", "value": "2023"},
    // {name: "2022-23", "value": "2022"},
    // {name: "2021-22", "value": "2021"},
    // { name: "2020 - 2021", "value": "2020" }
  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  @ViewChild('content') content: ElementRef;
  todayData = new Date();
  tableId: any[];
  vals: any;
  cropName: any;
  crop_group: any;
  crop_name: any;
  filterSeason:any;

  defaultValue1;
  // values2 = ['A0401'];
  // defaultValue2 = this.values2[0];
  // defYear = [(new Date()).getFullYear()];
  // values2 = ['A0107'];
  values2 = [];

  defaultValue2;
  defYear = [2024];
  // defualtSeason = 'K'
  defualtSeason = ''

  coordinator_name: any;

  defaultYear = this.defYear[0];
  submitted: boolean = false;
  filterCropGroup: any;
  filterCropName: any;
  unit: string;
  name = "ghg";
  studentArray = [
    { id: 1, fees: 5000 },
    { id: 2, fees: 2000 },
    { id: 3, fees: 2000 },
    { id: 4, fees: 100 }
  ];
  indentername: any;
  is_freeze: any[];
  searchValue = true;
  cropNameList: any;
  noOneRemaining: boolean = false;
  selectedYear;
  is_search: boolean = false;
  isSearchMsg: any;
  searchBtn: boolean = false;
  is_freezeIndenter: any;

  tempPageData: any;
  pageData: any;
  checkFreeze: any;
  totalIndentor: any;
  totalIndentorQunatity: any;
  freezTimeLineData: any;
  freezeTimeLine: boolean = true;
  seasonHeaderData: any;
  checkFreeze1;
  icarFreeze: boolean = false;
  totalRowofIndentor: { short_name: string; sum: unknown; }[];
  totalSum: number;
  checkFreezeData: boolean;

  constructor(private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private icarService: IcarService,
    private router: Router,
    private masterService: MasterService
    ) {
    this.createEnrollForm();
    // document.getElementById('searchData').click();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: ['', [Validators.required]],
      crop_name: ['', [Validators.required]],
      year: ['', [Validators.required]],
      season: ['', [Validators.required]]

    });
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['crop_group'].disable();
    this.ngForm.controls['season'].disable();

    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.getSeasonData(newValue);
        this.ngForm.controls['season'].enable()
        this.ngForm.controls['crop_group'].setValue('')
        this.ngForm.controls['crop_name'].setValue('')

      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getCroupCroupList(newValue)
        this.getFreezTimeLineData();
        if(newValue == "K"){
          this.seasonHeaderData = "Kharif";
        }else{
          this.seasonHeaderData = "Rabi";
        }
        this.ngForm.controls['crop_group'].enable()
        this.ngForm.controls['crop_name'].setValue('')
        this.searchValue = false;
      }
    });

    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.search = false

        this.getCropNameList(newValue);
        this.ngForm.controls['crop_name'].enable()
        this.defaultValue2 = ''

        this.searchValue = false

      }
    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getBreederProductionName(newValue)
        this.search = true
        // this.searchValue = false
      }
    });
  }
  ngOnInit(): void {
    // window.onload = function () {
    //   document.getElementById('searchData').click();
    // };
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    // this.Submit(this.ngForm);

    // this.submitindentor();
    if (this.is_search == false) {
      this.isSearchMsg = "Please Select Filter & Show Result"
    }
    // this.shortStatename();
    // this.shortIndenterame();

    // const searchFilters = {
    //   "year":this.defaultYear,
    //   "group_code":this.defaultValue1,
    //   "crop_code":this.defaultValue2
    // };
    // this.submitindentor(1, searchFilters);

    this.getYearOfIndent();

  }

  getBreederProductionName(crop_code) {
    const searchFilters = {
      "search": {
        "crop_code": crop_code
      }
    };
    // const route = "get-coordination-name";
    const route = "get-coordination-name-crop-model";

    this.icarService.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {

        let data = apiResponse.EncryptedResponse.data;

        if (data && data.count > 0) {
          this.coordinator_name = data.rows[0].name;
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">Name of Cordinating Institute not found.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'
          })
        }
      } else {

        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
        })
      }
    })

  }

  getFreezTimeLineData(){
    let season ;
    if(this.ngForm.controls['season'].value == "K"){
      season = "Kharif";
    }else{
      season = "Rabi" ;
    }
    const param = {
      search:{
        year_of_indent: parseInt(this.ngForm.controls['year'].value),
        season_name: season,
        activitie_id : 4
      }
    }
  let route = "freeze-timeline-filter";
  this.masterService.postRequestCreator(route,null,param).subscribe(res=>{
    if(res.EncryptedResponse.status_code == 200){
      this.freezTimeLineData = res && res.EncryptedResponse  && res.EncryptedResponse.data ? res.EncryptedResponse.data:[];     
    }
    let date = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].end_date;
    let startDate = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].start_date;

    let endDateInput =formatDate(date,'yyyy-MM-dd','en_US')
    let startDateInput =formatDate(startDate,'yyyy-MM-dd','en_US')    
   let date1 = formatDate(new Date(),'yyyy-MM-dd','en_US');    
    if(date){
      if(startDateInput <= date1 && endDateInput >= date1){
        // alert('Hii');
        this.freezeTimeLine = true;
      }else{
        // alert('bye');
        this.freezeTimeLine = false;
      }
    }
  });
  }
  freeze(){}

  async getCropNameList(newValue) {


    if (newValue) {
      const searchFilters = {
        "search": {
          "type": "nodal",
          "is_freez": 0,
          "group_code": newValue,
          "year": this.ngForm.controls["year"].value,
          "season": this.ngForm.controls["season"].value,
          
        }
      };
      this.breederService.postRequestCreator("get-received-indents-of-breeder-seeds-crop-name", null, searchFilters).subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data.length > 0) {
            this.cropName = apiResponse.EncryptedResponse.data.data;
            this.cropNameList = apiResponse.EncryptedResponse.data.data;

            this.defaultValue2 = this.cropName[0].crop_code;
            if (this.searchValue) {

              this.ngForm.controls["crop_name"].patchValue(this.cropName[0].crop_code)
            }


            if (this.searchValue) {
              const searchFilters = {
                "year": this.yearOfIndent && this.yearOfIndent[0] && this.yearOfIndent[0].year ? this.yearOfIndent[0].year : '',
                "group_code": this.response_crop_group && this.response_crop_group[0] && this.response_crop_group[0]['m_crop_group.group_code'] ? this.response_crop_group[0]['m_crop_group.group_code'] : '',
                "crop_code": this.cropName && this.cropName[0] && this.cropName[0].crop_code ? this.cropName[0].crop_code : "",
                "season": this.seasonList && this.seasonList[0] && this.seasonList[0].season ? this.seasonList[0].season : ''
              };

              this.submitindentor(1, searchFilters);
            }


            // this.ngForm.controls["crop_name"].setValue(this.cropName[0].crop_code)
            //  if(this.searchValue){

            //  }

          } else {
            this.cropName = []
          }
        } else {
          this.cropName = []
        }
      });
    }

  }

  Submit(formData) {
    if (formData && formData.valid) {
      const object = {
        "year": Number(formData.value.year),
        "season": formData.value.season,
        "crop_code": formData.value.crop_name,
        "group_code": formData.value.crop_group,
        "user_type":"nodal"
      };

      this.selectedYear = parseInt(this.ngForm.controls['year'].value);

      const groupName = this.response_crop_group.filter(x => {
        return x['m_crop_group.group_code'] == this.ngForm.controls['crop_group'].value;
      });
      this.filterCropGroup = groupName[0].group_name;
      console.log('formData.value.season',formData.value.season);
      if( formData.value.season== "R"){
        this.filterSeason="Rabi";
       
      }
      else{
        this.filterSeason="Kharif";
      }

      const cropName = this.cropName.filter(x => {
        return x.crop_code == this.ngForm.controls['crop_name'].value;
      });
      this.filterCropName = cropName[0]['m_crop.crop_name'];

      let displayData = [];
      this.checkFreeze = [];
      this.checkFreeze1 = [];

      this.tableId = []
//       this.breederService.postRequestCreator("getUniqueIndentorOfBreederSeeds", null, { 'filters': object }).subscribe((data: any) => {
//         if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
//           this.totalIndentor = data.EncryptedResponse.data.sort((a, b) => a['user.agency_detail.short_name'].toLowerCase() > b['user.agency_detail.short_name'].toLowerCase() ? 1 : -1);
//           console.log(this.totalIndentor)
//           this.breederService.postRequestCreator("getDataForReceivedIndentsOfBreederSeeds", null, { 'filters': object }).subscribe((data: any) => {
//             this.is_search = true;
//             if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
//               this.tempPageData = data.EncryptedResponse.data;
//               if (this.tempPageData && this.tempPageData.length > 0) {
//                 // console.log(this.tempPageData)
//                 this.tempPageData.forEach(element => {

//                   if (element.icar_freeze != 1) {
//                     this.icarFreeze = false;
//                     this.tableId.push(element.id)
//                     this.checkFreeze.push(element)
//                   }
//                   console.log(' this.checkFreeze==',this.checkFreeze)

//                   if (element.icar_freeze == 1) {
//                     this.icarFreeze = true;
//                     this.tableId.push(element.id)
//                     this.checkFreeze1.push(element)
//                   }
//                   console.log(' this.checkFreeze1',this.checkFreeze1)
//                   let object = {
//                     "variety_name": element.m_crop_variety.variety_name,
//                     "variety_code": element.m_crop_variety.variety_code,
//                     "variety_id": element.variety_id,
//                     "not_date": element.m_crop_variety.not_date,
//                     "breeder_data": []
//                   }

//                   let breeder_data = {
//                     "indent_quantity": element.indent_quantity,
//                     "breeder_name": element.user.agency_detail.short_name ? element.user.agency_detail.short_name : 'NA',
//                   }


//                   if (displayData.length > 0) {
//                     let index = displayData.findIndex(x => x.variety_id == element.variety_id);
//                     if (index == -1) {
//                       object.breeder_data.push(breeder_data);
//                       displayData.push(object);
//                     } else {
//                       displayData[index].breeder_data.push(breeder_data);
//                     }
//                   } else {
//                     object.breeder_data.push(breeder_data);
//                     displayData.push(object);
//                   }

//                 });
//               }

//               displayData.forEach(variety => {
//                 this.totalIndentor.forEach(breeder => {
//                   const isExist = variety.breeder_data.findIndex((x) => x.breeder_name.toLowerCase() == breeder["user.agency_detail.short_name"].toLowerCase())
//                   if (isExist == -1) {
//                     variety.breeder_data.push({
//                       "indent_quantity": 0,
//                       "breeder_name": breeder["user.agency_detail.short_name"]
//                     })
//                   }
//                 });
//               });

//               this.totalIndentorQunatity = {
//                 "name": "Total",
//                 "indentor": []
//               }

//               this.totalIndentor.forEach(breeder => {
//                 let tempObject = {
//                   "indentor_name": breeder["user.agency_detail.short_name"],
//                   "quantity": 0
//                 }
//                 this.totalIndentorQunatity.indentor.push(tempObject)
//               })


//               displayData = displayData.sort((a, b) => a.variety_name.toLowerCase() > b.variety_name.toLowerCase() ? 1 : -1);

//               let tempTotal = 0;
//               displayData.forEach(variety => {
//                 let total = 0;
//                 variety.breeder_data.forEach(element => {
//                   total += element.indent_quantity;

//                   const isExist = this.totalIndentorQunatity.indentor.findIndex((x) => x.indentor_name.toLowerCase() == element.breeder_name.toLowerCase())

//                   if (isExist > -1) {
//                     this.totalIndentorQunatity.indentor[isExist].quantity += element.indent_quantity
//                   }

//                 });

//                 variety['total_indent_quantity'] = total;
//                 tempTotal += total;

//                 variety.breeder_data = variety.breeder_data.sort((a, b) => a.breeder_name.toLowerCase() > b.breeder_name.toLowerCase() ? 1 : -1);
//               });

//               let tempObject = {
//                 "indentor_name": "total",
//                 "quantity": tempTotal
//               }
//               this.totalIndentorQunatity.indentor.push(tempObject)

//               this.pageData = displayData;
// console.log(';this.pageData',this.pageData)
//             }
//           })
//         }
//       })

this.breederService.postRequestCreator("getUniqueIndentorOfBreederSeeds", null, { 'filters': object }).subscribe((data: any) => {
  if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
    this.totalIndentor = data.EncryptedResponse.data.sort((a, b) => a['user.agency_detail.short_name'].toLowerCase() > b['user.agency_detail.short_name'].toLowerCase() ? 1 : -1);
    // this.printPageArea('excel-table')
    

    this.breederService.postRequestCreator("get-data-for-recieved-indent-second", null, { 'filters': object }).subscribe((data: any) => {
      this.is_search = true;
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
        this.tempPageData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
        let items = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
        const transformedData = items.map(item => {
          const allEmpty = item.variety.every(varietyItem => varietyItem.line_variety_code === "");
          if (allEmpty) {
              const mergedBspc = [];
              item.variety.forEach(varietyItem => {
                  mergedBspc.push(...varietyItem.bspc);
              });
              return {
                  ...item,
                  variety: [{
                      line_variety_name: "",
                      line_variety_code: "",
                      bspc: mergedBspc
                  }]
              };
          } else {
              return item;
          }
      });
      this.tempPageData=transformedData;        
        for (let item of this.totalIndentor) {
          item['short_name'] = item['user.agency_detail.short_name']
        }
        if (this.tempPageData && this.tempPageData.length > 0) {
          this.tempPageData.forEach((el, i) => {
            el.allData = [];
            el.allData2 = []
          })
          this.tempPageData.forEach((obj1, i) => {
             
            obj1.variety.forEach((el,index)=>{
              this.totalIndentor.forEach(obj2 => {
                if (!el.bspc.some(bspc => bspc.short_name === obj2['user.agency_detail.short_name'])) {
                  el.bspc.push({
                  "indent_quantity": null,
                "short_name": obj2 && obj2.short_name ? obj2.short_name :"NA",
                "qty": null,
                "variety_code_line": null
                  })
                }
              })
            
            })


          });
          this.tempPageData.forEach((el, i) => {
            el.variety.forEach((item) => {
              if (item && !item.line_variety_code && item.line_variety_code == '') {
                let sum = 0
                item.bspc.forEach((val) => {
                  sum += val && val.indent_quantity ? parseFloat(val.indent_quantity) : 0
                  item.total_qty = sum
                })
              } else {
                let sum = 0
                item.bspc.forEach((val) => {
                  sum += val && val.qty ? parseFloat(val.qty) : 0;
                  item.total_qty = sum;
                })
              }

            })
          });
          this.tempPageData.forEach((el, i) => {
            el.variety.forEach((item) => {
              el.allData2.push(...item.bspc)
              item.bspc = item.bspc.sort((a, b) => a.short_name.localeCompare(b.short_name));
            })
          });
          this.tempPageData.forEach((el, i) => {
            el.totalLength = el.allData.length;
            el.totalLength2 = el.allData2.length;
          })
        }
        this.pageData = this.tempPageData;
       
        
        let allData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.allData ? data.EncryptedResponse.data.allData : '';
        if (allData && allData.length > 0) {
          allData.forEach(obj => {
            this.tableId.push(obj.id)
            // Check if is_freeze column is 0
            if (obj.icar_freeze === 0) {
              // Update isFreeze to true
              this.checkFreezeData = true;
            } else if (obj.icar_freeze === 1) {
              // Update isFreeze to false
              this.checkFreezeData = false;
            }
           
          });
          let sumMap = {};
          allData.forEach(item => {
            if (item.line_variety_code === null || item.line_variety_code === "") {
              sumMap[item.short_name] = (sumMap[item.short_name] || 0) + item.indent_quantity;
            } else {
              sumMap[item.short_name] = (sumMap[item.short_name] || 0) + item.qty;
            }
          });
          const sumArray2 = Object.entries(sumMap).map(([key, value]) => ({ short_name: key, sum: value }));
          sumArray2.sort((a, b) => a.short_name.localeCompare(b.short_name));
          this.totalRowofIndentor = sumArray2;
          const totalSum = sumArray2.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.sum), 0);
          this.totalSum = totalSum;
        }

      }
    })
  }
})
    } else {
      Swal.fire('Error', 'Please Select all Fields.', 'error');
      return;
    }
  }

  getTotalIndentQuantity() {
    if (this.pageData && this.pageData.length > 0) {
      let quantity = 0;
      this.pageData.forEach(element => {
        quantity += element.total_indent_quantity;
      });

      return quantity;

    } else {
      return 0
    }
  }

  getUnit() {
    const crop_code = this.ngForm.controls['crop_name'].value;

    if (crop_code[0] == 'A') {
      return 'Quintal'
    } else {
      return 'Kg'
    }

  }

  // calc() {
  //   return this.finalData.reduce((accum, curr) => accum + curr.goals, 0);
  // }

  // Submit(formData) {
  //   this.submitted = true;
  //   this.searchValue = true;
  //   // console.log(this.cropName)

  //   if (this.ngForm.invalid) {
  //     Swal.fire('Error', 'Please Select all Fields.', 'error');
  //     return;
  //   }
  //   if (
  //     this.ngForm.controls['year'].value &&
  //     this.ngForm.controls['season'].value &&
  //     this.ngForm.controls['crop_group'].value &&
  //     this.ngForm.controls['crop_name'].value
  //   ) {
  //     this.is_search = true;
  //     this.searchBtn = true;
  //   } else {
  //     Swal.fire('Error', 'Please Select all Fields.', 'error');
  //   }



  //   if (this.response_crop_group.length > 0) {


  //   }

  //   if (this.cropName != null &&
  //     this.cropName != '' && this.cropName != undefined &&
  //     this.cropName.length > 0) {
  //     const cropName = this.cropName.filter(x => {
  //       // console.log('23423423423424',x.group_code);
  //       return x.crop_code == this.ngForm.controls['crop_name'].value;
  //     });
  //     this.filterCropName = cropName[0]['m_crop.crop_name'];

  //   }
  //   // console.log(this.ngForm.controls['crop_group'].value, 'this.ngForm.controls')
  //   if ((this.ngForm.controls['crop_group'].value).slice(0, 1) ? ((this.ngForm.controls['crop_group'].value).slice(0, 1) == 'A') : this.defaultValue1 == 'A') {
  //     this.unit = 'Qunital';
  //   } else if ((this.ngForm.controls['crop_group'].value).slice(0, 1) ? ((this.ngForm.controls['crop_group'].value).slice(0, 1) == 'H') : this.defaultValue1 == 'H') {
  //     this.unit = 'Kg'
  //   }
  //   // console.log('hii')

  //   this.isSearch = true;
  //   this.year = parseInt(this.ngForm.controls['year'].value);
  //   this.selectedYear = parseInt(this.ngForm.controls['year'].value);
  //   this.crop_group = this.ngForm.controls['crop_group'].value ? this.ngForm.controls['crop_group'].value : this.defaultValue1;
  //   this.crop_name = this.ngForm.controls['crop_name'].value ? this.ngForm.controls['crop_name'].value : this.defaultValue2;
  //   const searchFilters = {
  //     "year": this.year,
  //     "group_code": this.crop_group,
  //     "crop_code": this.crop_name,
  //     "season": this.ngForm.controls['season'].value

  //   };
  //   // console.log('submitted')
  //   this.submitindentor(1, searchFilters);

  //   this.shortStatename();
  //   this.shortIndenterame(searchFilters);
  // }

  cropGroup(data: string) { { } }
  async shortStatename() {
    const route = 'get-state-list';
    const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
      this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';


    })
  }
  async shortIndenterame(searchData: any | undefined = undefined) {
    const route = 'get-short-indenter-name';
    const result = await this.breederService.postRequestCreator(route, null, {
      search: searchData,
      is_freeze: 0,
      icar_freeze: 0
    }).subscribe((data: any) => {
      this.indentername = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }

  async submitindentor(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const route = 'submit-indents-breeder-seeds-list';
    const result = await this.breederService.postRequestCreator(route, null, {
      search: searchData,
      is_freeze: 0,
      type: "nodal"
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data;      
        this.data1 = apiResponse.EncryptedResponse.data;
        if (this.identor.length <= 0) {
          this.noOneRemaining = true;
        } else {
          this.noOneRemaining = false;
        }
        this.custom_array = [];

        // arr = arr.data
        let varietyId = [];
        let is_freeze = [];

        let is_freezeIndenter = [];
        // let units = [];
        for (let value of this.identor) {
          varietyId.push(value && value.m_crop_variety && value.m_crop_variety.variety_name ? value.m_crop_variety.variety_name : '');
          if (value.is_freeze == 0) {
            is_freeze.push(0);
          }
          if (1 || value.user.agency_detail.indent_of_spa.is_freeze == 1) {
            is_freezeIndenter.push(1);
          }
        }
        this.is_freeze = is_freeze;
        this.is_freezeIndenter = is_freezeIndenter;
        varietyId = [...new Set(varietyId)]
        let newObj = [];
        let i = 0;
        for (let value of varietyId) {
          let keyArr = [];
          let unit = [];
          for (let val of this.identor) {
            if (val.m_crop_variety.variety_name == value) {
              let state = val.user.agency_detail.short_name;
              keyArr.push({ "indent_short_name": state, 'value': parseFloat(val.indent_quantity).toFixed(2) });
              // keyArr.push({ state: state });
            }
            if (val.m_crop_variety && val.m_crop_variety.variety_code && (val.m_crop_variety.variety_code).slice(0, 1) == 'A') {
              unit.push('Quintal');
            } else if (val.m_crop_variety && val.m_crop_variety.variety_code && (val.m_crop_variety.variety_code).slice(0, 1) == 'H') {
              unit.push('Kg');
            }
          }
          let variety_id = (value).toString();
          newObj.push({ "variety_id": value, 'data': keyArr, "unit": unit[i] });
          i++;
        }
        this.finalData = newObj;
        this.tableId = [];
        for (let id of this.identor) {
          this.tableId.push(id.id);
        }
        const results = this.identor.filter(element => {
          if (Object.keys(element).length !== 0) {
            return true;
          }
          return false;
        });
        if (this.identor === undefined) {
          this.identor = [];
        }
        // let data =[];
        const removeEmpty = (obj) => {
          Object.entries(obj).forEach(([key, val]) =>
            (val && typeof val === 'object') && removeEmpty(val) ||
            (val === null || val === "") && delete obj[key]
          );
          return obj;
        };
        removeEmpty(this.identor)
        this.filterPaginateSearch.Init(results, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count);
        // this.initSearchAndPagination();
      }

    });
  }

  icar_freeze(crop_name, coordinator_name) {
    if (coordinator_name == undefined) {
      Swal.fire({
        title: '<p style="font-size:25px;">Name of Co-ordinating Institute not Found.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      });
      return;
    }
    Swal.fire({
      title: 'Do You Want To Allocate Indenting Quantity For Seed Production.',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Indented Quantity For ' + crop_name + ' Has Been Allocated To ' + coordinator_name + ' For Production.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            const searchFilters = {
              "search": {
                "id": this.tableId
              }
            };
            const route = "update-icar-freeze-data";
            this.icarService.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
              if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
                && apiResponse.EncryptedResponse.status_code == 200) {
                  this.icarFreeze = true;
                  location.reload();
                // Swal.fire({
                //   toast: true,
                //   icon: "success",
                //   title: "Data Has Been Successfully Updated",
                //   position: "center",
                //   showConfirmButton: false,
                //   showCancelButton: false,
                //   timer: 2000
                // }).then(x => {
                //   document.getElementById('searchData').click();
                // })
              } else {

                Swal.fire({
                  title: '<p style="font-size:25px;">An Error Occured.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
                })
              }

            });
          }
        })
      }
    });
  }

  getSeasonData(value) {
    const route = "get-received-indents-of-breeder-seeds-season";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "type": "nodal",
        "is_freeze": 0,
      }
    }
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
    })
  }
  getYearOfIndent() {
    const route = "get-received-indents-of-breeder-seeds-year";
    const result = this.breederService.postRequestCreator(route, null, {
      search: {
        "type": "nodal",
        "is_freeze": 0,
      }
    }).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
      this.yearOfIndent = this.yearOfIndent.sort((a, b) => b.year - a.year)
    })
  }
  getCroupCroupList(value) {
    const route = "get-received-indents-of-breeder-seeds-crop-group";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "type": "nodal",
        "is_freeze": 0,
      }
    }
    const result = this.breederService.postRequestCreator(route, null, param).subscribe((data: any) => {
      this.response_crop_group = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
      // this.defaultValue1 = this.response_crop_group[0]['m_crop_group.group_code'];
      // this.ngForm.controls["crop_group"].setValue(this.response_crop_group[0]['m_crop_group.group_code'], { emitEvent: false });
      // this.getCropNameList(this.response_crop_group[0]['m_crop_group.group_code'])
    });
  }
  // initSearchAndPagination() {
  //   this.paginationUiComponent.Init(this.filterPaginateSearch);
  //   if (this.paginationUiComponent === undefined) {


  //     setTimeout(() => {
  //       this.initSearchAndPagination();
  //     }, 300);
  //     return;
  //   }
  //   // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
  // }

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
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'submit-indents-breeder-seeds';
    const element = document.getElementById('excel-tables');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 4,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  submoitData() {

  }

  clear() {
    this.is_search = false;
    this.ngForm.controls["year"].setValue("");
    this.ngForm.controls["crop_group"].setValue("");
    this.ngForm.controls["season"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['crop_group'].disable();
    this.ngForm.controls['season'].disable();
    this.finalData = [];
  }

  getFixedData(data) {
    let value = data.toString();

    if (value.indexOf(".") == -1) {
      return data;

    } else {

      return data ? Number(data).toFixed(2) : 0;

    }
  }
  @HostListener('document:click', ['$event'])

handleDocumentClick(event: Event) {
  // Check if the clicked element has a specific ID that you want to exclude
  const target = event.target as HTMLElement;

  let element = document.getElementById('myDropdown');
  if (target && target.id !== 'exportTo') {
      if(element.classList.contains('show')){
    element.classList.remove('show')
  }
    // Do something here when the click event occurs except
  }
}
formatNumber(num) {
  // Check if the input is a number
  if (typeof num === 'number' && !isNaN(num)) {
      // If it's a number, use the toFixed() method to format it with 2 decimal places
      return num.toFixed(2);
  } else {
      // If it's not a number, return an error message or handle it as needed
      return 'Invalid input';
  }
}
}
