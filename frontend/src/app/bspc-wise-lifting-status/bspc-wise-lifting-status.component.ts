import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';

import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-bspc-wise-lifting-status',
  templateUrl: './bspc-wise-lifting-status.component.html',
  styleUrls: ['./bspc-wise-lifting-status.component.css']
})
export class BspcWiseLiftingStatusComponent implements OnInit {

  


    // data:any;
    bspcwiseList: any = [
      { variety: 'V1', totalindentedquantity: 150, totalavailabilityofbreederseed: 285, agenciessupplied: "SPA 1", allocatedforlifting: "60", quantitylifted: "50", reason: "NA", breederseedbalance: "" },
      { variety: 'V1', totalindentedquantity: 150, totalavailabilityofbreederseed: 285, agenciessupplied: "SPA 1", allocatedforlifting: "60", quantitylifted: "50", reason: "NA", breederseedbalance: "" },
      { variety: 'V1', totalindentedquantity: 150, totalavailabilityofbreederseed: 285, agenciessupplied: "SPA 1", allocatedforlifting: "60", quantitylifted: "50", reason: "NA", breederseedbalance: "" },
      { variety: 'V1', totalindentedquantity: 150, totalavailabilityofbreederseed: 285, agenciessupplied: "SPA 1", allocatedforlifting: "60", quantitylifted: "50", reason: "NA", breederseedbalance: "" },
      // {id: 3, name: 'User 3', phoneNumber: "111234444", email: "ab8y54c@gmail.com" },
      // {id: 4, name: 'User 4', phoneNumber: "133243553", email: "abc@gmail.com" },
      // {id: 5, name: 'User 5', phoneNumber: "024982742", email: "abc@gmail.com" },
      // {id: 6, name: 'User 6', phoneNumber: "024982742", email: "abc@gmail.com" },
      // {id: 7, name: 'User 7 ', phoneNumber: "6456787645", email: "abc@gmail.com" },
      // {id: 8, name: 'User 8', phoneNumber: "7637473434", email: "hjdvs@gmail.com" },
      // {id: 9, name: 'User 9', phoneNumber: "111234444", email: "ab8y54c@gmail.com" },
      // {id: 10, name: 'User 10', phoneNumber: "133243553", email: "abc@gmail.com" },
      // {id: 11, name: 'User 11', phoneNumber: "024982742", email: "abc@gmail.com" },
      // {id: 12, name: 'User 12', phoneNumber: "024982742", email: "abc@gmail.com" },
    ];
  
  
    cropwiseList: any = [
      { variety: 'V1', totalindentedquantity: 150, totalavailabilityofbreederseed: 285, agenciessupplied: "SPA 1", allocatedforlifting: "60", quantitylifted: "50", reason: "NA", breederseedbalance: "" },
      { variety: 'V1', totalindentedquantity: 150, totalavailabilityofbreederseed: 285, agenciessupplied: "SPA 1", allocatedforlifting: "60", quantitylifted: "50", reason: "NA", breederseedbalance: "" },
      { variety: 'V1', totalindentedquantity: 150, totalavailabilityofbreederseed: 285, agenciessupplied: "SPA 1", allocatedforlifting: "60", quantitylifted: "50", reason: "NA", breederseedbalance: "" },
      { variety: 'V1', totalindentedquantity: 150, totalavailabilityofbreederseed: 285, agenciessupplied: "SPA 1", allocatedforlifting: "60", quantitylifted: "50", reason: "NA", breederseedbalance: "" },
  
      // {id: 5, name: 'User 5', phoneNumber: "024982742", email: "abc@gmail.com" },
      // {id: 6, name: 'User 6', phoneNumber: "024982742", email: "abc@gmail.com" },
      // {id: 7, name: 'User 7 ', phoneNumber: "6456787645", email: "abc@gmail.com" },
      // {id: 8, name: 'User 8', phoneNumber: "7637473434", email: "hjdvs@gmail.com" },
      // {id: 9, name: 'User 9', phoneNumber: "111234444", email: "ab8y54c@gmail.com" },
      // {id: 10, name: 'User 10', phoneNumber: "133243553", email: "abc@gmail.com" },
      // {id: 11, name: 'User 11', phoneNumber: "024982742", email: "abc@gmail.com" },
      // {id: 12, name: 'User 12', phoneNumber: "024982742", email: "abc@gmail.com" },
    ];
  
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
    custom_array: any[];
    finalData: any[];
    fileName = 'status-of-lifting/non-lifting/supply-position-for-crops.xlsx';
    yearOfIndent: any = [];
    cropData: any = [];
    year: any;
    season: any;
    crop: any;
    isSearch: boolean = false;
    todayData = new Date();
    tableId: any[];
    allData: any;
    seasonData: any;
    cropName: any;
    bspcNameData: any;
    bspcVarietData: any;
    nucleusCropData: any;
    exportdata: any[];
    bspc: any;
    variety: any;
    breeder: any;
    userData: any;
    nucleusCropType: any;
    dummyData: any;
    cropDataList: any;
    varietyDataList: any;
    submitted: boolean;
  
    constructor(private breederService: BreederService,
      private fb: FormBuilder,
      private service: SeedServiceService,
      private router: Router,
      private productionCenterService: ProductioncenterService,
      private masterService: MasterService,
  
    ) {
      this.createEnrollForm();
  
    }
  
    createEnrollForm() {
      this.ngForm = this.fb.group({
        crop: [''],
        crop_name: [''],
        crop_type: [''],
        year: [''],
        unitKgQ: ['2'],
        season_value: [''],
        bspcName: [''],
        variety: [''],
        variety_id: [''],
  
      });
      this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
        if (newValue) {
          if (this.ngForm.controls['unitKgQ'].value == 1) {
  
            this.getSeason()
          }
  
        }
      })
      this.ngForm.controls['season_value'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.getCropType()
  
        }
      })
      this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.getCropData()
  
        }
      })
      this.ngForm.controls['unitKgQ'].valueChanges.subscribe(newValue => {
        if (newValue == '2') {
          this.getSeason()
  
        }
      })
      this.ngForm.controls['crop'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.getVarietyName(newValue)
  
        }
      })
      this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.getVarietyNameData()
  
        }
      })
      this.ngForm.controls['bspcName'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.getNucleusCropName(newValue)
  
        }
      })
  
    }
    ngOnInit(): void {
      // localStorage.setItem('logined_user', "Seed");
      // if (!localStorage.getItem('foo')) {
      //   localStorage.setItem('foo', 'no reload')
      //   location.reload()
      // } else {
      //   localStorage.removeItem('foo')
      // }
  
      this.getYear();
      // this.getPageData();
      this.runExcelApi();
      if (this.ngForm.controls['unitKgQ'].value == 2) {
  
        this.getSeason()
      }
    }
  
    getYear() {
      this.masterService.postRequestCreator("getStatusofLiftingyear").subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
          this.yearOfIndent = data.EncryptedResponse.data;        
          this.yearOfIndent = this.yearOfIndent.sort((a, b) => b.year - a.year)
        }
      })
    }
  
    getSeason() {
      const param = {
        search: {
          year: this.ngForm.controls['year'].value
  
        }
      }
      this.masterService.postRequestCreator("getStatusofLiftingSeason", null, param).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data) {
          this.seasonData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';        
        }
      })
    }
    getCropType() {
      const param = {
        search: {
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season_value'].value,
  
        }
      }
      this.masterService.postRequestCreator("getStatusofLiftingCropType", null, param).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data) {
          this.nucleusCropType = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
  
  
        }
      })
    }
    // getStatusofLiftingCrop
  
    getCropData() {
      const param = {
        search: {
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season_value'].value,
          crop_type: this.ngForm.controls['crop_type'].value
  
        }
      }
      this.masterService.postRequestCreator("getStatusofLiftingCrop", null, param).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data) {
          this.cropDataList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        }
      })
    }
    getNucleusName(newValue) {
      const param = {
        search: {
          season: newValue,
          year: this.ngForm.controls['year'].value
        }
      }
      this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityforReportsName", param).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
          this.bspcNameData = data.EncryptedResponse.data.rows;
          this.bspcNameData = this.bspcNameData.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.breeder_production_centre_name === arr.breeder_production_centre_name)))
        }
      })
    }
    getNucleusCropName(newValue) {
      const param = {
        search: {
          breeder_name: newValue,
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season_value'].value
        }
      }
      this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityforReportsCroptName", param).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
          // this.nucleusCropData = data.EncryptedResponse.data.rows
        }
      })
    }
    getVarietyName(newValue) {
      const param = {
        search: {
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season_value'].value,
  
          crop_code: this.ngForm.controls['crop'].value
        }
      }
      this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityforReportsVarieytName", param).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows) {
          this.bspcVarietData = data.EncryptedResponse.data.rows
        }
      })
    }
    getVarietyNameData() {
      const param = {
        search: {
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season_value'].value,
          crop_type: this.ngForm.controls['crop_type'].value,
  
          crop_code: this.ngForm.controls['crop_name'].value
        }
      }
      this.masterService.postRequestCreator("getStatusofLiftingVariety", null,param).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data) {
          this.varietyDataList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data :''
        
        }
      })
    }
    getCrop(year: any) {
      this.ngForm.controls['crop'].patchValue("");
      if (year && year.length > 0) {
        this.cropData = [];
        var object = {
          year: year
        }
        this.productionCenterService.postRequestCreator("getNucleusSeedAvailabilityCropforReports", object).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            this.cropData = data.EncryptedResponse.data;
          }
        })
      }
      else {
        this.cropData = []
      }
    }
  
    getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
  
      searchData = {
        isSearch: false
      }
  
      this.productionCenterService
        .postRequestCreator("getNucleusSeedAvailabilityforReports", {
          page: loadPageNumberData,
          pageSize: this.filterPaginateSearch.itemListPageSize || 10,
          searchData: searchData
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 10;
            this.allData = apiResponse.EncryptedResponse.data.rows;
            if (this.allData === undefined) {
              this.allData = [];
            }
            this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            this.initSearchAndPagination();
          }
        });
    }
  
    initSearchAndPagination() {
      if (this.paginationUiComponent === undefined) {
        setTimeout(() => {
          this.initSearchAndPagination();
        }, 300);
        return;
      }
  
      this.paginationUiComponent.Init(this.filterPaginateSearch);
    }
  
    submit(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
      if (this.ngForm.controls['year'].value || this.ngForm.controls['crop_type'].value || this.ngForm.controls['season_value'].value) {
        this.submitted=true
        searchData = {
          isSearch: true
        }
  
        this.ngForm.controls['year'].value ? (searchData['year'] = this.ngForm.controls['year'].value) : '';
        this.ngForm.controls['crop_type'].value ? (searchData['crop_type'] = this.ngForm.controls['crop_type'].value) : '';
        this.ngForm.controls['season_value'].value ? (searchData['season'] = this.ngForm.controls['season_value'].value) : '';
        this.ngForm.controls['crop_name'].value ? (searchData['crop_name'] = this.ngForm.controls['crop_name'].value) : '';
        this.ngForm.controls['variety_id'].value ? (searchData['variety_id'] = this.ngForm.controls['variety_id'].value) : '';
  
        this.masterService
          .postRequestCreator("getStatusofLiftingNonLiftingData", null, {
            page: loadPageNumberData,
            pageSize: this.filterPaginateSearch.itemListPageSize || 10,
            searchData: searchData
          })
          .subscribe((apiResponse: any) => {
            if (apiResponse !== undefined
              && apiResponse.EncryptedResponse !== undefined
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.filterPaginateSearch.itemListPageSize = 10;
              this.allData = apiResponse.EncryptedResponse.data;
              if (this.allData === undefined) {
                this.allData = [];
              }
              let totalAvailabilityArr = []
              for (let value of this.allData.totalVarietyData) {
                for (let data of value) {
                  let sum = 0;
                  for (let val of data) {
                    sum += parseInt(val.generated_label_number.weight)
                    value.totalAvailabilty = sum
                  }
                  totalAvailabilityArr.push({ sum: sum, variety_name: data && data[0] && data[0].variety_id ?data[0].variety_id :'' ,
                   crop_name: data && data[0] && data[0].crop_code ? data[0].crop_code :'' })
                }
              }
  
              let totalindentData = this.allData.totalIndentData.flat()
              totalindentData = totalindentData.flat()
              let quantityLifttedData = this.allData.quantityLifttedData.flat()
              quantityLifttedData = quantityLifttedData.flat()
              let quantityLifttedDatasecond = quantityLifttedData;
              
               // Create an object to store the unique values and their sums
               var uniqueValuesSPA = {};
  
  
               // Iterate through the data
            
              // Create an object to store the unique values and their sums
              var uniqueValues = {};
  
  
              // Iterate through the data
              totalindentData.forEach(function (obj) {
                var crop_code = obj.crop_code;
                var variety_id = obj.variety_id;
                var indent_quantity = obj.indent_quantity;
  
                var key = crop_code + '_' + variety_id; // Create a composite key
  
                if (uniqueValues.hasOwnProperty(key)) {
                  // If the composite key already exists, add the value to the existing key
                  uniqueValues[key] += indent_quantity;
                } else {
                  // If the composite key doesn't exist, set it to the current value
                  uniqueValues[key] = indent_quantity;
                }
              });
  
              // Convert the unique values object to an array
              var uniqueData = Object.entries(uniqueValues).map(([key, value]) => {
                var [crop_code, variety_id] = key.split('_');
                return { crop_code, variety_id, value };
              });
  
              // ---------------------//
              var uniqueQuntityLiftted = {};
              // Iterate through the data
              quantityLifttedData.forEach(function (obj) {
                var crop_code = obj.crop_code;
                var variety_id = obj.variety_id;
                var total_quantity = obj && obj.total_quantity ? parseInt(obj.total_quantity) : 0;
                var user_id = obj.spa_generbillId;
                var agency_id = obj.agency_id
  
                var key = crop_code + '_' + variety_id + '_' + user_id + '_'+ agency_id; // Create a composite key
  
                if (uniqueQuntityLiftted.hasOwnProperty(key)) {
                  // If the composite key already exists, add the value to the existing key
                  uniqueQuntityLiftted[key] += total_quantity;
                } else {
                  // If the composite key doesn't exist, set it to the current value
                  uniqueQuntityLiftted[key] = total_quantity;
                }
              });
              var uniqueDataLifted = Object.entries(uniqueQuntityLiftted).map(([key, value]) => {
                var [crop_code, variety_id, user_id,agency_id] = key.split('_');
                return { crop_code, variety_id, value, user_id ,agency_id};
              });
  
              for (let value of totalAvailabilityArr) {
                for (let data of this.allData.filteredData) {
                  for (let val of data.variety) {
                    if (data.crop_code == value.crop_name && val.variety_id == value.variety_name) {
                      val.totalAvalibilitydData = value.sum
                    }
                  }
                }
              }
              for (let value of uniqueData) {
                for (let data of this.allData.filteredData) {
                  for (let val of data.variety) {
                    if (data.crop_code == value.crop_code && val.variety_id == value.variety_id) {
                      val.totalIndentQty = value.value
  
                    }
                  }
                }
              }
  
              let res;
              this.masterService.postRequestCreator("getStatusofLiftingNonLiftingDataSecond", null, searchData).subscribe(item => {
  
                res = item && item.EncryptedResponse && item.EncryptedResponse.data ? item.EncryptedResponse.data : ''
                var spaListData = {};
  
                // Iterate through the data
                res.forEach(function (obj) {
                  var crop_code = obj.crop_code;
                  var variety_id = obj.variety_id;
                  var name = obj.name;
                  var agency_detailsID = obj.agency_detailsID
                  var total_quantity = obj && obj.qty ? parseInt(obj.qty) : 0;
                  var id = obj.id
  
                  var key = crop_code + '_' + variety_id + '_' + name + '_'+ agency_detailsID + '_' +id; // Create a composite key
  
                  if (spaListData.hasOwnProperty(key)) {
                    // If the composite key already exists, add the value to the existing key
                    spaListData[key] += total_quantity;
                  } else {
                    // If the composite key doesn't exist, set it to the current value
                    spaListData[key] = total_quantity;
                  }
                });
                var uniqueDataLiftedSpa = Object.entries(spaListData).map(([key, value]) => {
                  var [crop_code, variety_id, name,agency_detailsID,id] = key.split('_');
                  return { crop_code, variety_id, value, name,agency_detailsID,id  };
                })            
                for (let value of uniqueDataLiftedSpa) {
                  for (let data of this.allData.filteredData) {
                    for (let val of data.variety) {
                      for (let datas of val.spas) {
                        if (data.crop_code == value.crop_code && val.variety_id == value.variety_id) {
                          if(datas.id == value.agency_detailsID){
                            datas.indentor.push({
                              name: value.name,
                              allocatedQty: value.value,
                              spaId:value.id,
                              // agency_id:value.agency_detailsID
  
                            })
                          }
  
                        }
                       
                      }
                    }
                  }
                }
                for (let value of uniqueDataLifted) {
                  for (let data of this.allData.filteredData) {
                    for (let val of data.variety) {
                      for (let datas of val.spas) {
                        for (let values of datas.indentor) {                 
                          if (data.crop_code == value.crop_code && val.variety_id == value.variety_id
                            && datas.id == value.agency_id && values.spaId == value.user_id
                          ) {
  
                            datas.indentor.push({
                              liftedqty: value.value,
                              spaId:value.user_id,
                              spaIdValue:datas.id,
                              agencyId:value.agency_id
  
                            })
  
                          // ---------------/
                          const mergedData = {};
  
                          datas.indentor.forEach(item => {
                            const { spaId, ...rest } = item;
                          
                            if (!mergedData.hasOwnProperty(spaId)) {
                              mergedData[spaId] = item;
                            } else {
                              mergedData[spaId] = { ...mergedData[spaId], ...rest };
                            }
                          }); 
                          let newData = Object.values(mergedData)
                          datas.indentor=newData                                                
                        }
                      }
                      }
                    }
                  }
                }     
                
               
                this.dummyData = this.allData.filteredData;    
                for (let index of this.dummyData) {
                  let sum = 0
                  let indentorsum = 0;
                  for (let j of index.variety) {
                    let indentorsumtotal = 0;
                    sum += j.spas.length
                    index.spa_count = sum
                    for (let value of j.spas) {
                      if(value.indentor<1){
                        value.indentor.push(
                          {
                            name: null,
                              allocatedQty: null,
                              spaId:null,
                              agency_id:null,
                              spaIdValue:null,
                              agencyId:null
                          }
                        )
                      }
                      let allocatedQty=0;
                      indentorsum += value.indentor.length                   
                      indentorsumtotal += value.indentor.length
                      j.indentortotalLength=indentorsumtotal
  
                      j.spa_countlength = j.spas.length
                      value.indentorLength = value.indentor.length
                     
                     for(let values of value.indentor){
                      let allocated = values && values.allocatedQty? parseInt(values.allocatedQty) :0
                       let lifted = values && values.liftedqty ? parseInt(values.liftedqty) :0
                      values.balance=Number(allocated)- Number(lifted);
                      allocatedQty+=values.allocatedQty
                      value.totalAllocated=allocatedQty
                     }
                    }
                    index.spa_count = sum
                    index.inentorCount = indentorsum
                  
  
                  }
                }
                console.log(this.dummyData)
              })
              // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
              // this.initSearchAndPagination();
            }
          });
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Select Atleast One Field.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        });
      }
    }
  
    clear() {
      this.ngForm.controls['year'].patchValue("");
      this.ngForm.controls['season_value'].patchValue("");
      this.ngForm.controls['bspcName'].patchValue("");
      this.ngForm.controls['crop'].patchValue("");
      this.ngForm.controls['variety'].patchValue("");
      this.ngForm.controls['crop_name'].patchValue("");
      this.ngForm.controls['variety_id'].patchValue("");
      this.submitted=false;
  
  
      // this.getPageData();
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
    }
  
    // cropGroup(data: string) { { } }
    // async shortStatename() {
    //   const route = 'get-state-list';
    //   const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
    //     this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    //     // console.log('state======>',this.statename);
  
    //   })
    // }
  
    // async submitindentor(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
  
    //   const route = 'submit-indents-breeder-seeds-list';
    //   const result = await this.breederService.postRequestCreator(route, null, {
    //     page: loadPageNumberData,
    //     pageSize: this.filterPaginateSearch.itemListPageSize || 10,
    //     search: searchData
    //   }).subscribe((apiResponse: any) => {
    //     if (apiResponse !== undefined
    //       && apiResponse.EncryptedResponse !== undefined
    //       && apiResponse.EncryptedResponse.status_code == 200) {
    //       this.identor = apiResponse.EncryptedResponse.data.data;
    //       this.data1 = apiResponse.EncryptedResponse.data;
    //       this.custom_array = [];
    //       // console.log('this.identorthis.identor',this.identor);
    //       // arr = arr.data
    //       let varietyId = []
    //       for (let value of this.identor) {
    //         varietyId.push(value.m_crop_variety.variety_name)
    //       }
    //       varietyId = [...new Set(varietyId)]
    //       let newObj = [];
  
    //       for (let value of varietyId) {
    //         let keyArr = [];
    //         for (let val of this.identor) {
    //           if (val.m_crop_variety.variety_name == value) {
    //             let state = val.user.agency_detail.m_state.state_short_name;
    //             keyArr.push({ "state": state, 'value': val.indent_quantity });
    //           }
    //         }
    //         let variety_id = (value).toString();
    //         newObj.push({ "variety_id": value, 'data': keyArr })
    //       }
  
    //       this.finalData = newObj;
    //       console.log('this.idfinalDatantor', this.finalData);
  
    //       this.tableId = [];
    //       for (let id of this.identor) {
    //         this.tableId.push(id.id);
    //       }
    //       // console.log('this.identorthis.identor', this.tableId);
  
    //       const results = this.identor.filter(element => {
    //         if (Object.keys(element).length !== 0) {
    //           return true;
    //         }
  
    //         return false;
    //       });
    //       // console.log(results, 'resultssssssss');
    //       if (this.identor === undefined) {
    //         this.identor = [];
    //       }
    //       // let data =[];
    //       const removeEmpty = (obj) => {
    //         Object.entries(obj).forEach(([key, val]) =>
    //           (val && typeof val === 'object') && removeEmpty(val) ||
    //           (val === null || val === "") && delete obj[key]
    //         );
    //         return obj;
    //       };
    //       removeEmpty(this.identor)
    //       this.filterPaginateSearch.Init(results, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count);
    //       this.initSearchAndPagination();
    //     }
  
    //   });
    // }
  
    // freeze() {
    //   const searchFilters = {
    //     "search": {
    //       "id": this.tableId
    //     }
    //   };
    //   const route = "freeze-indent-breeder-seed-data";
    //   this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
    //     if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
    //       && apiResponse.EncryptedResponse.status_code == 200) {
    //       Swal.fire({
    //         toast: true,
    //         icon: "success",
    //         title: "Data Has Been Successfully Updated",
    //         position: "center",
    //         showConfirmButton: false,
    //         showCancelButton: false,
    //         timer: 2000
    //       }).then(x => {
  
    //         this.router.navigate(['/nucleus-seed-availability-report']);
    //       })
    //     }
    //     else {
  
    //       Swal.fire({
    //         toast: true,
    //         icon: "error",
    //         title: "An error occured",
    //         position: "center",
    //         showConfirmButton: false,
    //         showCancelButton: false,
    //         timer: 2000
    //       })
    //     }
  
    //   });
    // }
  
    // getSeasonData() {
    //   const route = "get-season-details";
    //   const result = this.service.postRequestCreator(route, null).subscribe(data => {
    //     this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    //     // console.log(this.seasonList);
    //   })
    // }
    // getCroupCroupList() {
    //   const route = "crop-group";
    //   const result = this.service.getPlansInfo(route).then((data: any) => {
    //     this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    //   })
    // }
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
    runExcelApi(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
      searchData = {
        isSearch: false
      }
  
      this.productionCenterService
        .postRequestCreator("getNucleusSeedAvailabilityforReports", {
  
          pageSize: this.filterPaginateSearch.itemListPageSize || 10,
          searchData: searchData
        })
        .subscribe((apiResponse: any) => {
          if (apiResponse !== undefined
            && apiResponse.EncryptedResponse !== undefined
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListPageSize = 10;
            this.exportdata = apiResponse.EncryptedResponse.data.rows;
            if (this.exportdata === undefined) {
              this.exportdata = [];
            }
            this.filterPaginateSearch.Init(this.exportdata, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
            this.initSearchAndPagination();
          }
        });
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
      const name = 'status-of-lifting/non-lifting/supply-position-for-crops-report';
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
        jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
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
    mergeJsonDataByIdAndName(jsonArray1, jsonArray2) {
      const mergedData = {};
      let results = []
  
      jsonArray1.forEach(obj => {
        const id = obj.crop_code;
        const name = obj.variety_name;
        const user_id = obj.user_id;
  
        if (!mergedData[id]) {
          mergedData[id] = {};
        }
  
        if (!mergedData[id][name][user_id]) {
          mergedData[id][name][user_id] = obj;
        }
      });
  
      jsonArray2.forEach(obj => {
        const id = obj.crop_name;
        const name = obj.variety_name;
        const user_id = obj.user_id;
  
        if (!mergedData[id]) {
          mergedData[id] = {};
        }
  
        if (!mergedData[id][name][user_id]) {
          mergedData[id][name][user_id] = obj;
        }
      });
  
      return Object.values(mergedData).reduce((result, obj) => {
        results.push(...Object.values(obj));
        return results;
      }, []);
    }
  }
  

