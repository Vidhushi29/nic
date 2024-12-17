import { Component, OnInit, ElementRef } from '@angular/core';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-bsp-two-second-report',
  templateUrl: './bsp-two-second-report.component.html',
  styleUrls: ['./bsp-two-second-report.component.css']
})
export class BspTwoSecondReportComponent implements OnInit {

  ngForm!: FormGroup;
  runningNumber: any;
  runningNumber2: number;
  agencyName: any;
  bspcAddress: any;
  contact_person_name: any;
  designation: any;
  todayData = new Date();
  cropNameofReport: any;
  units: string;
  data1: any;
  user_id: any;
  year: any;
  season: any;
  // user_id= 310;
  // year= 2023;
  // season= 'K';
  crop_code: any;
  seasonlist: any;
  cropList: any;
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  decryptedData: any = {};
  districtName: any;
  stateName: any;


  constructor(private master: MasterService, private elementRef: ElementRef, private fb: FormBuilder, private route: ActivatedRoute,
    private productionService: ProductioncenterService,
    private breeder: BreederService) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      crop: [''],
      crop_text: [''],
      variety: [''],
      vaiety_text: [''],
      type_of_class: [''],
      total_necluesseed: [''],
      total_breederseed: [''],
      variety_level_2: [''],
      parental_text: [''],
      line_variety_code: [''],
      variety_line_code: [''],
      vaiety_text_level_2: [''],
      bsp2Arr: this.fb.array([
        // this.bsp2arr(), 
      ]),
    })
  }

  ngOnInit(): void {
    this.checkReferenceData();
    this.route.params.subscribe(params => {
      const encryptedData = params['encryptedData'];
      try {
        const decodedEncryptedData = decodeURIComponent(encryptedData);
        const bytes = CryptoJS.AES.decrypt(decodedEncryptedData, 'a-343%^5ds67fg%__%add');
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        const decryptedData = JSON.parse(decryptedString);
        this.year = decryptedData.year;
        this.user_id = decryptedData.user_id;
        this.crop_code = decryptedData.crop_code;
        this.season = decryptedData.season;    
        this.getUserData();
        this.getMasterBspReportData();
        this.getUnit();
      } catch (error) {
        console.error("Error decrypting or parsing data:", error);
      }
    });
  }

  getUserData() {
    let userId = this.user_id;
    this.master.postRequestCreator('get-user-data-details-report', null, {
      search: {
        user_id: userId ? userId.toString() : ''
      }
    }).subscribe(apiresponse => {
      let res = apiresponse && apiresponse.EncryptedResponse && apiresponse.EncryptedResponse.data ? apiresponse.EncryptedResponse.data : '';
      this.agencyName = res && res[0] && res[0].agency_name ? res[0].agency_name : '';
      this.bspcAddress = res && res[0] && res[0].address ? res[0].address : '';
      this.contact_person_name = res && res[0] && res[0].contact_person_name ? res[0].contact_person_name : '';
      this.designation = res && res[0] && res[0].designation ? res[0].designation : '';
      this.stateName = res && res[0] && res[0].state_name ? res[0].state_name : '';
      this.districtName = res && res[0] && res[0].district_name ? res[0].district_name : '';
    })
  }

  checkReferenceData() {
    const param = {
      report_type: 'bsp2'
    }
    this.breeder.postRequestCreator('check-report-runing-number', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.runningNumber = res && (res.running_number) ? (res.running_number) : 0;
      this.runningNumber2 = (parseInt(this.runningNumber) + 1)
    })
  }

  getFinancialYear2(year) {
    let arr = []
    let last2Str = String(parseInt(year)).slice(-2)
    arr.push(String(parseInt(last2Str)))
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  capitalizeWords(str) {
    if (str) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }
  }

  // async getMasterBspReportData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

  //   const route = 'get-bsp2-data-list-report';
  //   const result = await this.master.postRequestCreator(route, null, {
  //     search: {
  //       year: this.year.toString(),
  //       season: this.season,
  //       crop_code: this.crop_code,
  //       user_id: this.user_id
  //     }
  //   }).subscribe((apiResponse: any) => {
  //     if (apiResponse !== undefined &&
  //       apiResponse.EncryptedResponse !== undefined &&
  //       apiResponse.EncryptedResponse.status_code == 200) {
  //       let reportDataArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data ? (apiResponse.EncryptedResponse.data.data) : '';
  //       let bsp1VarietyListArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.bsp1VarietyListArr ? (apiResponse.EncryptedResponse.data.bsp1VarietyListArr) : '';
  //       let directIndentVarietyListTotalArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.directIndentVarietyListTotalArr ? (apiResponse.EncryptedResponse.data.directIndentVarietyListTotalArr) : '';
  //       bsp1VarietyListArr = bsp1VarietyListArr ? bsp1VarietyListArr.flat() : '';
  //       let combineArrays;
  //       this.cropNameofReport = reportDataArr && reportDataArr[0] ? reportDataArr[0].crop_name : ''
  //       directIndentVarietyListTotalArr = directIndentVarietyListTotalArr ? directIndentVarietyListTotalArr.flat() : '';
  //       if (bsp1VarietyListArr && bsp1VarietyListArr.length > 0 && directIndentVarietyListTotalArr && directIndentVarietyListTotalArr.length > 0) {
  //         combineArrays = this.combineArrays3(bsp1VarietyListArr, directIndentVarietyListTotalArr)
  //       }
  //       else if (bsp1VarietyListArr && bsp1VarietyListArr.length > 0 && directIndentVarietyListTotalArr.length < 1) {
  //         bsp1VarietyListArr = bsp1VarietyListArr.filter((arr, index, self) =>
  //           index === self.findIndex((t) => (t.id === arr.id && t.variety_code === arr.variety_code)))
  //         bsp1VarietyListArr.forEach((el, i) => {
  //           el['total_targeted_qty'] = el && el.total_quantity ? el.total_quantity : 0
  //         })
  //         combineArrays = bsp1VarietyListArr
  //       }
  //       else if (directIndentVarietyListTotalArr && directIndentVarietyListTotalArr.length > 0 && bsp1VarietyListArr.length < 1) {
  //       }

  //       if (combineArrays && combineArrays.length > 0) {
  //         combineArrays.forEach((el, i) => {
  //           el['quantity'] = el && el['quantity'] ? el['quantity'] : 0            
  //           if (el && el.variety_line_code != '' && el.variety_line_code != null && el.variety_line_code != undefined && el.variety_line_code != ' ' && el.variety_line_code != 'NULL' && el.variety_line_code != 'N/A') {
  //             el.total_targeted_qty = el && el.target_quantity ? (el.target_quantity + el.quantity) : '';
  //           } else {
  //             el.total_targeted_qty = el && el.target_quantity ? (el.target_quantity + el.quantity) : el && el.total_qty ? (el.total_qty +el.quantity) :'';
  //           }
  //         })
  //       }
  //       if (combineArrays && combineArrays.length > 0) {
  //         if (reportDataArr && reportDataArr.length > 0) {
  //           const filteredData = reportDataArr.map(item => {
  //             item.line_variety_code_details.forEach(lineVarietyDetail => {
  //               const matchedItem = combineArrays.find(data => data.variety_code === item.variety_code && data.variety_line_code === lineVarietyDetail.variety_line_code);
  //               if (matchedItem) {
  //                 lineVarietyDetail.total_targeted_qty = matchedItem.total_targeted_qty;
  //               }
  //             });

  //             const matchedItem = combineArrays.find(data => data.variety_code === item.variety_code && !data.variety_line_code);
  //             if (matchedItem) {
  //               item.total_targeted_qty = matchedItem.total_targeted_qty;
  //             }
  //             return item;
  //           });

  //           this.data1 = filteredData;
  //         } else {
  //           this.data1 = reportDataArr
  //         }
  //       } else {
  //         this.data1 = reportDataArr
  //       }
  //       if (this.data1 && this.data1.length > 0) {
  //         const bsp2DetailsLength = this.data1.map(item => {
  //           const lineVarietyDetails = item.line_variety_code_details;
  //           let totalLength = 0;
  //           lineVarietyDetails.forEach(details => {
  //             totalLength += details.bsp2_Deteials.length;
  //           });
  //           return totalLength;
  //         });

  //         const sumofbsp2_Deteials = bsp2DetailsLength.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  //         let sums = 0
  //         this.data1.forEach((el, i) => {
  //           let sum = 0
  //           el.bsp2Data = []
  //           sums += el.line_variety_code_details.length
  //           el.toalDataLengths = el.line_variety_code_details.length;
  //           el.line_variety_code_details.forEach((item, index) => {
  //             item.toalDataLengths2 = el.line_variety_code_details.length;
  //             item.totalbsp2_Deteialslength = item.bsp2_Deteials.length
  //             sum += item.bsp2_Deteials.length + el.line_variety_code_details.length
  //             el.toalDataLength = sum;
  //             el.sumofbsp2_Deteials = sumofbsp2_Deteials
  //             el.toalDataLengths = item.bsp2_Deteials.length + el.line_variety_code_details.length
  //           })
  //         })
  //         this.data1.forEach((el, i) => {
  //           el.line_variety_code_details.forEach((item, index) => {
  //             el.bsp2Data.push(...item.bsp2_Deteials)
  //           })
  //         })
  //         this.data1.forEach((el, i) => {
  //           el.bsp2DatalengthArr = el.bsp2Data.length;
  //         })
  //       }
  //     }
  //   });
  // }
  async getMasterBspReportData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    const route = 'get-bsp2-data-list-report';
    // const getLocalData = localStorage.getItem('BHTCurrentUser');
    // let data = JSON.parse(getLocalData)
    let UserId = this.user_id
    const result = await this.master.postRequestCreator(route, null, {

      // page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: {
        year: this.year.toString(),
        season: this.season,
        crop_code: this.crop_code,
        user_id: this.user_id

      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined &&
        apiResponse.EncryptedResponse !== undefined &&
        apiResponse.EncryptedResponse.status_code == 200) {
        // let reportDataArray = [];
        let reportDataArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data ? (apiResponse.EncryptedResponse.data.data) : '';
        let bsp1VarietyListArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.bsp1VarietyListArr ? (apiResponse.EncryptedResponse.data.bsp1VarietyListArr) : '';
        let directIndentVarietyListTotalArr = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.directIndentVarietyListTotalArr ? (apiResponse.EncryptedResponse.data.directIndentVarietyListTotalArr) : '';
        bsp1VarietyListArr = bsp1VarietyListArr ? bsp1VarietyListArr.flat() : '';
        let carryOverData= apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.carryOverData ? (apiResponse.EncryptedResponse.data.carryOverData) : '';
        carryOverData= carryOverData ? carryOverData.flat():'';
      
        let combineArrays;
        let combineArrays2;
        this.cropNameofReport = reportDataArr && reportDataArr[0] ? reportDataArr[0].crop_name : ''
        directIndentVarietyListTotalArr = directIndentVarietyListTotalArr ? directIndentVarietyListTotalArr.flat() : '';       
        if (bsp1VarietyListArr && bsp1VarietyListArr.length > 0 && directIndentVarietyListTotalArr && directIndentVarietyListTotalArr.length > 0) {
          // if (directIndentVarietyListTotalArr && directIndentVarietyListTotalArr.length > 0) {
          combineArrays = this.combineArrays3(bsp1VarietyListArr, directIndentVarietyListTotalArr)
          combineArrays2 = this.combineArrays3(bsp1VarietyListArr, directIndentVarietyListTotalArr)
          // }
        }
        else if (bsp1VarietyListArr && bsp1VarietyListArr.length > 0 && directIndentVarietyListTotalArr.length < 1) {
          bsp1VarietyListArr = bsp1VarietyListArr.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.id === arr.id && t.variety_code === arr.variety_code)))
          bsp1VarietyListArr.forEach((el, i) => {
            el['total_targeted_qty'] = el && el.total_quantity ? el.total_quantity : 0
          })
          combineArrays = bsp1VarietyListArr
        }
        if (combineArrays && combineArrays.length > 0) {
          combineArrays.forEach((el, i) => {
            el['quantity'] = el && el['quantity'] ? el['quantity'] : 0
            console.log(el,'')
            if (el && el.variety_line_code != '' && el.variety_line_code != null && el.variety_line_code != undefined && el.variety_line_code != ' ' && el.variety_line_code != 'NULL' && el.variety_line_code != 'N/A') {
              el.total_targeted_qty = el && el.target_quantity ? (el.target_quantity + el.quantity) : '';
            } else {
              el.total_targeted_qty = el && el.target_quantity ? (el.target_quantity + el.quantity) : el && el.total_qty ? (el.total_qty +el.quantity) :'';
            }
          })
        }
        if (combineArrays && combineArrays.length > 0) {
          if (reportDataArr && reportDataArr.length > 0) {
            let reportDataArrsss;


            const filteredData = reportDataArr.map(item => {
              item.line_variety_code_details.forEach(lineVarietyDetail => {

                const matchedItem = combineArrays.find(data => data.variety_code === item.variety_code && data.variety_line_code === lineVarietyDetail.variety_line_code);
                if (matchedItem) {
                  lineVarietyDetail.total_targeted_qty = matchedItem.total_targeted_qty;
                }
              });

              const matchedItem = combineArrays.find(data => data.variety_code === item.variety_code && !data.variety_line_code);
              if (matchedItem) {
                item.total_targeted_qty = matchedItem.total_targeted_qty;
              }

              return item;
            });

            this.data1 = filteredData;
          } else {
            this.data1 = reportDataArr
          }
        } else {
          this.data1 = reportDataArr

        }
        if (this.data1 && this.data1.length > 0) {
          const bsp2DetailsLength = this.data1.map(item => {
            const lineVarietyDetails = item.line_variety_code_details;
            let totalLength = 0;
            lineVarietyDetails.forEach(details => {
              totalLength += details.bsp2_Deteials.length;
            });
            return totalLength;
          });

          const sumofbsp2_Deteials = bsp2DetailsLength.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          let sums = 0
          this.data1.forEach((el, i) => {
            let sum = 0
            let sum2 = 0

            // this.data1[0].toalDataLengths=2
            // this.data1[1].toalDataLengths=2
            el.bsp2Data = []
            sums += el.line_variety_code_details.length
            el.toalDataLengths = el.line_variety_code_details.length;
            el.line_variety_code_details.forEach((item, index) => {
              item.toalDataLengths2 = el.line_variety_code_details.length;
              // sum2

              item.totalbsp2_Deteialslength = item.bsp2_Deteials.length
              sum += item.bsp2_Deteials.length + el.line_variety_code_details.length
              el.toalDataLength = sum;
              el.sumofbsp2_Deteials = sumofbsp2_Deteials
              el.toalDataLengths = item.bsp2_Deteials.length + el.line_variety_code_details.length
              // item.bsp2_Deteials.forEach((val,j)=>{
              //   if ((j + 1) % 4 === 0) {
              //     val.ids = "page-break1";
              //   }else{
              //     val.ids = "page-break2";
              //   }
              // })
            })
          })
          this.data1.forEach((el, i) => {
            el.line_variety_code_details.forEach((item, index) => {
              el.bsp2Data.push(...item.bsp2_Deteials)

            })
          })
          this.data1.forEach((el, i) => {
            el.bsp2DatalengthArr = el.bsp2Data.length;
          })
        }    
        if(this.data1 && this.data1.length>0){
          if(carryOverData && carryOverData.length>0){
            this.data1.forEach(item1 => {
              if (item1.variety_line_code === "NA" || item1.variety_line_code === null) {
                  carryOverData.forEach(item2 => {
                      if (item1.variety_code === item2.variety_code) {
                        if(item2 && item2.meet_target && item2.meet_target==2){
                          item1.carry_total_qty = item2.carry_total_qty;
                          item1.meet_target= item2.meet_target;
                        }else{
                          item1.carry_total_qty=0;
                          item1.meet_target= item2.meet_target;
                        }
                      }
                  });
              }else{
                carryOverData.forEach(item2 => {
                  if (item1.variety_code === item2.variety_code && item1.variety_line_code == item2.variety_code_line) {
                    if(item2 && item2.meet_target && item2.meet_target==2){
                      item1.carry_total_qty = item2.carry_total_qty;
                      item1.meet_target= item2.meet_target;
                    }else{
                      item1.carry_total_qty=0;
                      item1.meet_target= item2.meet_target;
                    }
                  }
              });
              }
          });
          }
         }   
      }    
      
    });
  }

  combineArrays(array1, array2) {
    let combinedArray = [];
    array1.forEach(item1 => {
      let matchingItem = array2.find(item2 => {
        if (item1.variety_line_code) {
          return item2.variety_code === item1.variety_code && item2.variety_code_line === item1.variety_line_code;
        } else {
          return item2.variety_code === item1.variety_code;
        }
      });

      if (matchingItem) {
        combinedArray.push({
          id: item1.id,
          variety_code: item1.variety_code,
          variety_line_code: item1.variety_line_code,
          target_quantity: item1.target_quantity,
          quantity: matchingItem.quantity
        });
      } else {
        combinedArray.push({
          id: item1.id,
          variety_code: item1.variety_code,
          variety_line_code: item1 && item1.variety_line_code ? item1.variety_line_code : matchingItem && matchingItem.variety_code_line ? matchingItem.variety_code_line : '',
          target_quantity: item1.target_quantity
        });
      }
    });

    return combinedArray;
  }
  combineArrays3(array1, array2) {    
    // Create a new array to store the combined data
    let combinedArray = [];
    // Iterate over the first array
    array1.forEach(item1 => {
        // Find the corresponding item in the second array based on variety_code and variety_line_code
        let matchingItem = array2.find(item2 => {   
            if (item1.variety_line_code) {
                return item2.variety_code === item1.variety_code && item2.variety_code_line === item1.variety_line_code;
            } else if (item1.variety_code === item2.variety_code && !item1.variety_line_code && !item2.variety_code_line) {
                return true;
            }
            return false;
        });
   
        // If a matching item is found, combine the data
        if (matchingItem) {
            combinedArray.push({
                id: item1.id,
                variety_code: item1.variety_code,
                variety_line_code: item1.variety_line_code,
                target_quantity: item1.target_quantity,
                quantity: matchingItem.quantity || 0,
                total_qty: matchingItem.total_qty || 0
            });
        } else {
            // If no matching item is found, push only the item from array1 into combinedArray
            combinedArray.push({
                id: item1.id,
                variety_code: item1.variety_code,
                variety_line_code: item1.variety_line_code || '',
                target_quantity: item1.target_quantity,
                total_qty: 0 // Since no match found, total_qty defaults to 0
            });
        }
    });

    // Iterate over the second array to find any unmatched items
    array2.forEach(item2 => {
        let matchingItem = combinedArray.find(item => item.variety_code === item2.variety_code);
        if (!matchingItem) {
            combinedArray.push({
                id: null, // You can decide how to handle this or set it to a specific value
                variety_code: item2.variety_code,
                variety_line_code: item2.variety_code_line || '',
                target_quantity: 0, // Since no match found, target_quantity defaults to 0
                total_qty: item2.total_qty || 0
            });
        }
    });

    return combinedArray;
}

  getUnit() {
    let value = this.crop_code && (this.crop_code.slice(0, 1)) == 'A' ? 'Qt' : 'Kg';
    this.units = value;
    return value;
  }
  checkValue(a) {
    if (!isNaN(a)) {
      // Convert 'a' to a number
      let aNumber = parseFloat(a);
      // Format it to display two decimal places
      let aFormatted = aNumber.toFixed(2);
      return aFormatted
      // console.log(aFormatted);
    } else {
      return a

    }
  }
}
