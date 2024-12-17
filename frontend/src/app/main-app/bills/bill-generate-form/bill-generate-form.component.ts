
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { formatDate } from '@angular/common';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { checkDecimal, checkLength, ConfirmAccountNumberValidator, convertDate, errorValidate, convertDates, convertDatetoDDMMYYYY, convertDatetoDDMMYYYYwithdash } from 'src/app/_helpers/utility';
import { bspProformasBillsUIFields, bspProformasBillsDeatilsUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill-generate-form',
  templateUrl: './bill-generate-form.component.html',
  styleUrls: ['./bill-generate-form.component.css']
})
export class BillGenerateFormComponent implements OnInit {

  @ViewChildren(DynamicFieldsComponent) dynamicFieldsComponents: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  currentUser: any = { id: 10, name: "Hello User" };
  currentProductionCenter: any;
  cropName: any = [];
  spaName: any = [];
  prdData: any = [];
  bspData: any = [];
  prodCenter: any = [];
  teamMembers: any = [];
  yearOfIndent: any = [];
  seasonData: any = [];
  buttonText = 'Submit'
  editData: any = [];
  cropVarieties: any = []
  lotNumberList: any = [];
  cropVarietyIndentors: any = []
  lableNumberList: any = [];
  regionData = [
    {
      value: 1,
      name: 'Reason 1'
    },
    {
      value: 2,
      name: 'Reason 2'
    },
    {
      value: 3,
      name: 'Reason 3'
    },
  ]

  dataRow: boolean = false;
  totalIndentQuantity: any;
  stateCode: any;
  available_quantity_value: any;
  allocated_quantity_value: any;
  unit: string;
  spaId: any;

  get formGroupControls() {
    return this.formSuperGroup.controls;
  }

  get IstPartFormGroup(): FormGroup {
    if (this.formGroupControls["IstPartFormGroup"])
      return this.formGroupControls["IstPartFormGroup"] as FormGroup;
    else
      return new FormGroup([]);
  }

  get IstPartFormGroupControls() {
    return this.IstPartFormGroup.controls;
  }

  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
    private restService: RestService,
    private breederService: BreederService,
    private seedService: SeedServiceService
  ) {

    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name

    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }
    this.loadYears()
    this.getCropSeason();

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    this.createFormControlsOfAGroupdup(bspProformasBillsUIFields, this.IstPartFormGroup);
    this.fieldsList = bspProformasBillsUIFields;
    this.filterPaginateSearch.itemListPageSize = 10;
  }

  getCropSeason() {
    this.seedService.postRequestCreator("get-season-details").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((x: any, index: number) => {
          x["name"] = x.season;
          x["value"] = x.season_code;
          this.seasonData.push(x);
        });
      }
    });
  }

  createYearRange(years): void {
    let yrs = []
    years.forEach((x: any, index: number) => {
      var temp = this.getFinancialYear(x.value)
      yrs.push({ value: x.value, name: temp })
    })
    yrs = yrs.flat();
    yrs = yrs.sort((a, b) => b.value - a.value);
    this.fieldsList[0].fieldDataList = yrs
  }

  getCropName(crops) {
    crops.forEach((x: any, index: number) => {
      let crop = x
      if (crop != null) {
        x["name"] = crop['name'];
        x["value"] = crop['value'];
        this.cropName.push(x);
      }
    });
    // this.fieldsList[1].fieldDataList = this.cropName
  }

  getLotNumber(label) {
    let lableNumber = []
    label.forEach((x: any, index: number) => {
      let lbl = x
      if (lbl != null) {
        x["name"] = lbl['lot_number'];
        x["value"] = lbl['id'];
        lableNumber.push(x);
      }
    });
    this.lotNumberList = lableNumber;
    return lableNumber;
  }

  createFormControlsOfAGroupdup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "nodal_officer_detail" || x.formControlName == "yearofIndent" || x.formControlName == "cropName") || x.formControlName == "production_centre_name") {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>, element) {
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    let lables = this.getLotNumber(element.label)
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "yearofIndent" || x.formControlName == "cropName") || x.formControlName == "production_centre_name" || x.formControlName == "breeder_name") {
        newFormControl.disable();
      }
      if (x.formControlName == "lotted_id") {
        x.fieldDataList = lables
      }
      if (x.formControlName == 'lable_name') {
        x.fieldDataList = this.lableNumberList;
      }
      if (x.formControlName == 'region') {
        x.fieldDataList = this.regionData;
      }
      if (["breeder_seed_produced_actual_quantity", 'allocated_quantity', 'available_quantity', 'total_quantity', "allocation_bspI_target", "carry_over_seed_quantity", "total_availability", "prodution_surplus_over_BSPI_target"].includes(x.formControlName)) {
        let name = x.fieldName.split("(")[0]
        x.fieldName = name + " (" + this.getQuantityMeasure(crop_code) + ")"
      }

      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  add(arr, val, name) {
    const { length } = arr;
    const value = name;
    const found = arr.some(el => el.value === val);
    if (!found) arr.push({ value: val, name: value });
    return arr;
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  loadYears() {
    this.breederService.getRequestCreator("get-generate-bill-year?userId=" + this.currentUser.id).subscribe((data: any) => {

      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        this.createYearRange(years.year)
      }
    })
  }


  gettotalSelectedLabelWeight(items) {
    let weight = 0
    items.forEach(a => {
      let tmp = this.lableNumberList.filter(x => x.value == a.value)[0]
      console.log(this.lableNumberList,'lableNumberList')
      if (tmp != undefined) {
        weight = weight + parseInt(tmp['weight'])
      }
    })
    return weight;
  }

  createLables(labelSeeds) {
    let labels = []
    if (labelSeeds.length) {
      labelSeeds.forEach((seedsData: any, index: number) => {
        if (seedsData && seedsData.labels && seedsData.newLabels.length > 0) {
          seedsData.newLabels.forEach(label => {
            labels.push({ name: label.generated_label_name, value: label.id, weight: label.weight, labelSeedId: seedsData.id })
          })
        }
      });
    }
    return labels;
  }

  loadLabelThruLot(newValue, newFormGroup, element) {
    let lotIds = newValue.map(a => a.value).join();
    this.breederService.getRequestCreator("get-generate-bill-label-number?lot_number=" + '' + lotIds + "&variety_id=" + element.variety_id + "&user_id=" + this.currentUser.id + "&bill_id=" + this.submissionId, null, newValue).subscribe((newLable: any) => {
      if (newLable && newLable.EncryptedResponse && newLable.EncryptedResponse.status_code && newLable.EncryptedResponse.status_code == 200 && newLable.EncryptedResponse.data.length > 0) {
        if (this.lableNumberList) {
          this.lableNumberList = this.createLables(newLable.EncryptedResponse.data)
        }

        if (newFormGroup.controls["lable_number"].value) {
          let data = this.lableNumberList.filter(item => newFormGroup.controls["lable_number"].value.some(item2 => item2.name == item.name))
          newFormGroup.controls["lable_number"].setValue(data)
          console.log('dat', data)
        }


        this.dynamicFieldsComponents['last'].fieldsList[3].fieldDataList = this.lableNumberList

        if (this.isEdit || this.isView) {
          let selectLabels = []
          let labels = this.bspData.label_number ? this.bspData.label_number.split(",") : [];
          labels.forEach(a => {
            selectLabels.push(this.lableNumberList.filter(s => s.value == a))
          })

          newFormGroup.controls["lable_number"].patchValue(selectLabels.flat())
          if (this.isView) {

            this.dynamicFieldsComponents['last'].fieldsList[3].fieldDataList = selectLabels.flat()
            this.dynamicFieldsComponents['last'].fieldsList[4].fieldDataList = selectLabels.flat()
          }
        }
      }
      else {
        this.dynamicFieldsComponents['last'].fieldsList[3].fieldDataList = []
      }
    })
  }

  ngOnInit(): void {
    this.dataRow = false;
    localStorage.setItem('logined_user', "productionCenter");
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }

    // this.breederService.getRequestCreator("getYearDataForBSP5a").subscribe((data: any) => {
    //   console.log(data)
    //   if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
    //     let years = data.EncryptedResponse.data
    //     let yrs = []
    //     years.forEach(x => {
    //       var temp = this.getFinancialYear(x.year)
    //       yrs.push({
    //         value: x.year,
    //         name: temp
    //       })
    //     })
    //     this.fieldsList[0].fieldDataList = yrs;
    //   }
    // })

    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      // this.IstPartFormGroupControls["season"].reset()
      this.breederService.getRequestCreator("get-generate-bill-season?userId=" + this.currentUser.id + "&year=" + newValue.value).subscribe((data: any) => {

        if (data.EncryptedResponse.data) {
          let seasons = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['m_season']['season'],
              value: element['season']
            }
            seasons.push(temp);
          });
          this.fieldsList[1].fieldDataList = seasons;
          if (this.isEdit || this.isView) {
            let season = seasons.filter(x => x.value == this.bspData.season)[0]
            this.IstPartFormGroupControls["season"].patchValue(season);
          }
        }
      })
    })

    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {
      // this.IstPartFormGroupControls["cropName"].reset()
      let year = this.IstPartFormGroupControls["yearofIndent"].value;
      let season = newValue.value
      this.breederService.getRequestCreator("get-generate-bill-crop-list?yearOfIndent=" + year.value + "&season=" + season).subscribe((data: any) => {

        if (data.EncryptedResponse.data) {
          let cropGroups = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['m_crop.crop_name'],
              value: element['crop_code']
            }
            cropGroups.push(temp);
          });
          this.fieldsList[2].fieldDataList = cropGroups;

          if (this.isEdit || this.isView) {
            let crop = cropGroups.filter(x => x.value == this.bspData.crop_code)[0]
            this.IstPartFormGroupControls["cropName"].patchValue(crop);
          }
        }
      })
    })

    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      // this.IstPartFormGroupControls["cropVarieties"].reset()
      let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value
      let season = this.IstPartFormGroupControls["season"].value.value
      let crop = newValue.value;
      let user_id = this.currentUser.id;
      this.dataRow = true;
      this.breederService.getRequestCreator("get-generate-bill-variety?cropName=" + crop + "&yearOfIndent=" + yearValue + "&season=" + season + "&user_id=" + user_id).subscribe((data: any) => {

        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

          let varieties = data.EncryptedResponse.data.variety
          let breederdata = data.EncryptedResponse.data.breederData
          breederdata = breederdata ? breederdata.flat() : '';
          let breederArr = [];

          if (breederdata && breederdata.length > 0) {
            for (let data of breederdata) {

              breederArr.push(data && data.veriety_data ? data.veriety_data : '');
            }

          }
          let breederVarietyArr;
          if (breederArr && breederArr.length > 0) {
            breederVarietyArr = breederArr ? breederArr.flat() : '';
          }
          if (breederVarietyArr && breederVarietyArr.length > 0) {
            const commonElements = varieties.filter(item1 =>
              breederVarietyArr.some(item2 => item2.variety_id === item1.value)
            );
            console.log(commonElements, 'commonElements')
            this.fieldsList[3].fieldDataList = commonElements;
          } else {
            this.fieldsList[3].fieldDataList = varieties;
          }


          if (this.isEdit || this.isView) {

            let variety = varieties.filter(x => x.value == this.bspData.variety_id)[0]
            this.IstPartFormGroupControls["cropVarieties"].patchValue(variety);
          }
        }
      })
    })

    this.IstPartFormGroupControls["cropVarieties"].valueChanges.subscribe(newValue => {
      // this.IstPartFormGroupControls["indentorName"].reset()
      let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value
      let cropName = this.IstPartFormGroupControls["cropName"].value.value
      let season = this.IstPartFormGroupControls["season"].value.value
      let varietyID = newValue.value
      let indentors = []
      // this.breederService.getRequestCreator("get-breeder-crop-varieties-list?cropCode="+ crop).subscribe((data: any) => {
      this.breederService.getRequestCreator("get-generate-bill-indentors?cropName=" + cropName + "&yearOfIndent=" + yearValue + "&cropVariety=" + varietyID + "&season=" + season, null).subscribe((data: any) => {

        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          data.EncryptedResponse.data?.forEach((indentor: any, index: number) => {
            indentors.push({ "name": indentor.user.name, "value": indentor.user.name, id: indentor.id, user_id: indentor.user.id })
          })
          this.fieldsList[4].fieldDataList = this.cropVarietyIndentors = indentors;
          if (this.isEdit || this.isView) {

            let indent = indentors.filter(x => x.id == this.bspData.indent_of_breederseed_id)[0]
            this.IstPartFormGroupControls["indentorName"].patchValue(indent);
          }
        } else {
          Swal.fire('Error', 'Nobody Indent of This Variety:' + newValue.name, 'error');
          this.fieldsList[4].fieldDataList = null;
        }
      })
    });
    this.IstPartFormGroupControls["indentorName"].valueChanges.subscribe(newValue => {
      let spa = []
      let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value
      let cropName = this.IstPartFormGroupControls["cropName"].value.value
      let varietyId = this.IstPartFormGroupControls["cropVarieties"].value.value
      let season = this.IstPartFormGroupControls["season"].value.value
      let indentorId = newValue.id;

      this.breederService.getRequestCreator("spa-list?cropCode=" + cropName + "&yearOfIndent=" + yearValue + "&cropVariety=" + varietyId + "&indentorId=" + indentorId + "&user_id=" + this.currentUser.id + "&season=" + season, null).subscribe((data: any) => {

        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          // console.log('data.EncryptedResponse.data========',data.EncryptedResponse.data);
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
           let responseList = response ? response.flat():'';
           console.log(responseList,'responms')
           if( responseList && responseList.length>0){
            responseList = responseList.filter((arr, index, self) =>
      index === self.findIndex((t) => (t.state_code === arr.state_code && t.spa_code === arr.spa_code)))

           }
           if(responseList && responseList.length>0){

             this.fieldsList[5].fieldDataList = []
           }
        
          for (let index = 0; index < responseList.length; index++) {
            const param = {
              yearValue: this.IstPartFormGroupControls["yearofIndent"].value.value,
              cropName: this.IstPartFormGroupControls["cropName"].value.value,
              varietyId: this.IstPartFormGroupControls["cropVarieties"].value.value,
              season: this.IstPartFormGroupControls["season"].value.value,
              indentorId: newValue.id,
              spaId: responseList && responseList[index] && responseList[index].id ? responseList[index].id : '',
              user_id: this.currentUser.id
            }
            this.breederService.postRequestCreator("getGenerateBillData", null, param).subscribe((apiresponse: any) => {
              if (apiresponse && apiresponse.EncryptedResponse && apiresponse.EncryptedResponse.status_code && apiresponse.EncryptedResponse.status_code == 200) { }
              let res = apiresponse && apiresponse.EncryptedResponse && apiresponse.EncryptedResponse.data ? apiresponse.EncryptedResponse.data : '';
              // console.log(res,'resres')
              let generationBillData = res && res.data ? res.data : '';
              let allocationData = res && res.allocationData ? res.allocationData : '';
              if (generationBillData && generationBillData.length > 0 && allocationData && allocationData.length > 0) {

                const uniqueValues = {};
                for (let data of generationBillData) {
                  data.total_quantity = Number(data.total_quantity)
                }

                // Iterate over the array of objects
                generationBillData.forEach(obj => {
                  // Check if the current value of "name" property is already in the uniqueValues object
                  if (!uniqueValues[obj.variety_id]) {
                    // Add the current value to the uniqueValues object
                    uniqueValues[obj.variety_id] = { ...obj };
                  } else {
                    // Sum the "age" property if the value is already present
                    uniqueValues[obj.variety_id].total_quantity += parseInt(obj.total_quantity);
                  }
                });

                // Convert the uniqueValues object back to an array of objects
                const uniqueArray = Object.values(uniqueValues);
                let allocationDatasecond = allocationData;
                let crop_code = this.IstPartFormGroupControls['cropName'].value.value
                let unit = this.getQuantityMeasure(crop_code)
                console.log(unit, 'allocationDatasecond')
                if (unit == 'Quintal') {
                  for (let data of allocationDatasecond) {
                    data.qty = (parseInt(data.qty) * 100)
                  }

                }
                const difference = allocationDatasecond.filter(item1 => !uniqueArray.some(item2 => item1.qty < item2['total_quantity']));
                if (this.isEdit || this.isView) {
                 
                  let tmpSpa = responseList.filter(x => x.spa_code == this.bspData.spa_code)   
                                
                  if (tmpSpa && tmpSpa !== undefined && tmpSpa.length > 0) {
                    
                    let spaNameValue =tmpSpa && tmpSpa[0] &&  tmpSpa[0].agency_detail && tmpSpa[0].agency_detail.agency_name ? tmpSpa[0].agency_detail.agency_name:''
                    
                    this.spaId = tmpSpa && tmpSpa[0] &&  tmpSpa[0].id && tmpSpa[0].id ? tmpSpa[0].id:''
                    this.IstPartFormGroupControls["spaName"].patchValue(spaNameValue);
                  }
                }

                

                const mergedArray = difference.map(item1 => {
                  const matchingItem = responseList.find(item2 => item2.state_code == item1.state_code && item2.spa_code == item1.spa_code);
                  if (matchingItem) {
                    return { ...item1, ...matchingItem };
                  }
                  return item1;
                });
                
                this.stateCode = responseList[0].state_code
                mergedArray?.forEach((element: any, index: number) => {
                  if (element == true) {

                  } else {
                    spa.push({
                      "name": element.agency_detail['agency_name'],
                      "value": element.spa_code, id: element.id
                    })
                  }
                })

                this.fieldsList[5].fieldDataList = this.spaName = spa;
                console.log(spa,'spa')
              }
              else {
                responseList.forEach(el=>{
                  this.stateCode = el && el.state_code ? el.state_code :''

                })
                responseList?.forEach((element: any, index: number) => {
                  if (element == true) {

                  } else {
                    spa.push({
                      "name": element.agency_detail['agency_name'],
                      "value": element.spa_code, id: element.id
                    })
                  }
                })
                  if( spa && spa.length>0){
                    spa = spa.filter((arr, index, self) =>
      index === self.findIndex((t) => (t.value === arr.value && t.id === arr.id)))

           }
                this.fieldsList[5].fieldDataList = this.spaName = spa;
                console.log(spa,'spa565)')
                if (this.isEdit || this.isView) {

                  let tmpSpa = spa.filter(x => x.value == this.bspData.spa_code)[0]
                  console.log("tmpSpa===2", tmpSpa);
                  console.log("this.bspData.spa_code", this.bspData.spa_code);
                  this.IstPartFormGroupControls["spaName"].patchValue(tmpSpa);
                }
              }
            })
          }


        }



      })
    })

    this.IstPartFormGroupControls["spaName"].valueChanges.subscribe(newValue => {
      let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value
      let cropName = this.IstPartFormGroupControls["cropName"].value.value
      let varietyId = this.IstPartFormGroupControls["cropVarieties"].value.value
      let season = this.IstPartFormGroupControls["season"].value.value
      let indentorId = this.IstPartFormGroupControls["indentorName"].value.id
      let spaId = newValue && newValue.id ?newValue.id : this.spaId ? this.spaId :''
      
      let IIndPartFormArray: {
        bsp_1_id: string,
        bsp_4_id: string,
        variety_id: string,
        name: string,
        formGroup: FormGroup,
        arrayfieldsIIndPartList: Array<SectionFieldType>
      }[] = [];
      let indentor = []
      let response = []
      this.breederService.getRequestCreator("get-generate-bill-variety-list?cropName=" + cropName + "&yearOfIndent=" + yearValue + "&cropVariety=" + varietyId + "&indentorId=" + indentorId + "&userId=" + this.currentUser.id + "&season=" + season + "&spaId=" + spaId, null).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

          response.push(data.EncryptedResponse.data)
          let newFormGroup = new FormGroup<any>([]);
          response?.forEach((element: any, index: number) => {
            let sumqty = 0

            console.log(element, 'ele')
            let crop_code = this.IstPartFormGroupControls['cropName'].value.value
            let unit = this.getQuantityMeasure(crop_code)
            this.createFormControlsOfAGroup(bspProformasBillsDeatilsUIFields, newFormGroup, element);
            for (let data of element.allocation_to_spa_for_lifting_seed_production_cnters) {
              sumqty += data.qty;
              element.allocated_quantity = sumqty
            }
            let allocated_quantity = element.allocated_quantity
            this.allocated_quantity_value = allocated_quantity
            // newFormGroup.controls["indented_quantity"].patchValue(element.indent_quantity || 0);
            newFormGroup.controls["allocated_quantity"].patchValue(allocated_quantity || 0);
            let r = (Math.random() + 3).toString(36).substring(7);
            // newFormGroup.controls["bill_number"].patchValue('autogenrate');
            // newFormGroup.controls["bill_date"].patchValue(convertDatetoDDMMYYYYwithdash(new Date()));

            if (this.isEdit || this.isView) {
              let selectedLot = []
              let selectLabels = [];
              let region = this.regionData.filter(item => item.value == this.bspData.region)
              // newFormGroup.controls["bill_number"].patchValue(this.bspData.bill_number);
              // newFormGroup.controls["bill_date"].patchValue(this.bspData.bill_date.split('/').join('-'));
              // console.log('his.bspData.bill_date',(this.bspData.bill_date.split('/').join('-')))
              newFormGroup.controls["amount"].patchValue(this.bspData.amount || 0);
              newFormGroup.controls["available_quantity"].patchValue(this.bspData.available_quantity || '');
              newFormGroup.controls["region"].patchValue(this.bspData && this.bspData.region_name ? this.bspData.region_name : '');

              let lottedId = this.bspData.lot_id ? this.bspData.lot_id.split(",") : [];
              lottedId.forEach(a => {
                selectedLot.push(this.lotNumberList.filter(s => s.value == parseInt(a)))
              })
              newFormGroup.controls["lotted_id"].patchValue(selectedLot.flat());


            }

            newFormGroup.controls["lotted_id"].valueChanges.subscribe(newValue => {

              if (newValue) {

                this.loadLabelThruLot(newValue, newFormGroup, element)
              }
              if (newValue == '') {
                newFormGroup.controls["lable_number"].setValue('')
              }

            });

            newFormGroup.controls["lable_number"].valueChanges.subscribe(lableValue => {
              let totalSelectedLabelWeight = this.gettotalSelectedLabelWeight(lableValue)

              if (unit == 'Quintal') {
                totalSelectedLabelWeight = totalSelectedLabelWeight / 100
              }
              newFormGroup.controls["total_quantity"].patchValue('' + (totalSelectedLabelWeight ? totalSelectedLabelWeight.toFixed(2) : 0));
            })


            newFormGroup.controls["total_quantity"].valueChanges.subscribe(total_quantity => {
              let available_quantity: any = 0.000;

              if (element.available_quantity == null || element.available_quantity == undefined) {
                available_quantity = parseFloat(allocated_quantity) - parseFloat(total_quantity)
              } else {
                available_quantity = parseFloat(allocated_quantity) - parseFloat(total_quantity)
              }




              available_quantity = available_quantity <= 0 ? '0' : (available_quantity.toFixed(2))
              newFormGroup.controls["available_quantity"].patchValue(available_quantity || '0');
            })
            newFormGroup.controls['available_quantity'].valueChanges.subscribe(item=>{
              console.log(item,'item')
              if(parseFloat(item)<=0){
                newFormGroup.controls['region'].clearValidators();
                newFormGroup.controls['region'].updateValueAndValidity();
              }else{
                newFormGroup.controls['region'].setValidators([Validators.required])
                newFormGroup.controls['region'].updateValueAndValidity();
              }
            })

            IIndPartFormArray.push({
              bsp_1_id: element.allocated_quantity.bsp_1_id,
              bsp_4_id: element.bsp_4_id,
              variety_id: element.variety_id,
              name: (element?.bsp_3?.m_crop_variety?.variety_name || "1"),
              formGroup: newFormGroup,
              arrayfieldsIIndPartList: bspProformasBillsDeatilsUIFields.map(x => {
                

                if (!["amount", 'region'].includes(x.formControlName)) {
                  newFormGroup.controls[x.formControlName].disable();
                }
                return { ...x };
              })
            });
          })
          this.IstPartFormGroupControls["indentorName"].value['billDetails'] = []
          this.IstPartFormGroupControls["indentorName"].value['billDetails'].push(IIndPartFormArray)
          this.filterPaginateSearch.Init(IIndPartFormArray, this);
        }
      })
    })

    let isSearched = false;
    this.formGroupControls['search'].valueChanges.subscribe(newValue => {
      let performSearch: any[] | undefined = undefined;
      if (newValue.length > 3) {
        isSearched = true;
        performSearch = [{
          columnNameInItemList: "name",
          value: newValue
        }];
      }
      if (isSearched)
        this.filterPaginateSearch.search(performSearch);
    });

    if (this.isEdit || this.isView) {
      this.breederService.getRequestCreator('get-generate-bill/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.bspData = dataList.EncryptedResponse.data
          this.buttonText = 'Update'
          this.isDraft = data?.isdraft ? true : false;
          let tmp = this.getFinancialYear(data.year)
          let year = { name: tmp, value: data.year }

          // let crop = this.cropName.filter(x => x.value == data.crop_code)[0]
          // let season = this.seasonData.filter(x => x.value == data.season)[0]
          let foundData = { year: year }
          this.patchForm(foundData);
        }
      });
    }

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

  patchForm(data: any) {
    this.IstPartFormGroupControls["yearofIndent"].patchValue(data.year);
    // this.IstPartFormGroupControls["season"].patchValue(data.season);
    // this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
  }

  // getDynamicFieldsComponent(id): DynamicFieldsComponent {
  // return this.dynamicFieldsComponents.filter(x => x.id == id)[0];
  // }
  getQuantityMeasure(crop_code) {
    this.unit = crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
    return crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
  }
  submit() {

  }

  create(params) {
    console.log(this.allocated_quantity_value, 'uniii')
    if (this.unit == 'Quintal') {

    }


    if (this.available_quantity_value && this.available_quantity_value < 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity can not be less than Total Quantity.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return
    }
    this.breederService.postRequestCreator("add-generate-bill", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15',
          allowOutsideClick: false,
        }).then(x => {
          this.router.navigate(['breeder/bsp-proformas/bills']);
        })
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 401) {
        // this.router.navigate(['breeder/bsp-proformas/bills']);
        Swal.fire({
          title: '<p style="font-size:25px;">Lifted Quantity can not be less than Allocated Quantity.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.message) {
        Swal.fire({
          title: '<p style="font-size:25px;">BSP Form Has Already Been Filled For This Variety.</p>',
          icon: 'info',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }
      else {
        Swal.fire({
          title: 'Oops',
          text: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  update(params) {
    this.breederService.postRequestCreator("edit-generate-bill", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.router.navigate(['breeder/bsp-proformas/bills']);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }
      else {
        Swal.fire({
          title: 'Oops',
          text: '<p style="font-size:25px;">Something Went Wrong.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }
    })
  }

  submitForm(formData) {
    let invalid = false;
    const params = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value;
    let indentor = newValue['indentorName'].value;
    let spa_code = newValue['spaName'].value.value;
    let spa_name = newValue['spaName'].value.name;

    for (let index = 0; index < newValue['indentorName'].value.billDetails[0].length; index++) {
      let billDetail = newValue['indentorName'].value.billDetails[0][index]
      let billForm = billDetail['formGroup']
      if (billForm.invalid) {
        invalid = true
        Swal.fire('Error', 'Please fill out all required fields.', 'error');
      }
      let formGroupcontrol = billForm.controls
      let lot_ids = formGroupcontrol['lotted_id'].value.map(item => item.value)
      let label_numbers = formGroupcontrol['lable_number'].value.map(item => item.value)
      if (this.unit == 'Quintal') {
        formGroupcontrol['allocated_quantity'].value = (parseInt(formGroupcontrol['allocated_quantity'].value) * 100)
      }
      params.push({
        year: year,
        season: season,
        crop_code: crop_code,
        spa_code: spa_code,
        indent_of_breederseed_id: indentor.id,
        bsp_1_id: billDetail['bsp_1_id'],
        bsp_4_id: billDetail['bsp_4_id'],
        variety_id: billDetail['variety_id'],
        lot_id: lot_ids.join(", "),
        label_number: label_numbers.join(", "),
        total_quantity: formGroupcontrol['total_quantity'].value,
        available_quantity: formGroupcontrol['available_quantity'].value,
        spa_name: spa_name ? spa_name : '',
        allocated_qunatity: formGroupcontrol['allocated_quantity'].value,
        // bill_number: formGroupcontrol['bill_number'].value,
        // bill_date: (formGroupcontrol['bill_date'].value.split('-').join('/')),
        amount: formGroupcontrol['amount'].value,
        production_center_id: this.currentUser.id,
        user_id: this.currentUser.id,
        is_active: 1,
        id: this.submissionId,
        region: formGroupcontrol['region'].value,
        state_code: this.stateCode ? this.stateCode : ''
      })
    }
    if (invalid) {
      this.dynamicFieldsComponents['last'].showError = true;
      return;
    }

    this.isEdit ? this.update(params[0]) : this.create(params)
  }

  saveAndNavigate() {
    if (this.filterPaginateSearch.itemListTotalPage > this.filterPaginateSearch.itemListCurrentPage) {
      this.filterPaginateSearch.navigate("next");
    }
  }

  saveAsDraft() {
    const params = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value;
    let indentor = newValue['indentorName'].value;

    for (let index = 0; index < newValue['indentorName'].value.billDetails[0].length; index++) {
      let billDetail = newValue['indentorName'].value.billDetails[0][index]
      let billForm = billDetail['formGroup']
      let formGroupcontrol = billForm.controls
      let lot_ids = formGroupcontrol['lotted_id'].value.map(item => item.value)
      let label_numbers = formGroupcontrol['lable_number'].value.map(item => item.value)
      params.push({
        year: year,
        season: season,
        crop_code: crop_code,
        indent_of_breederseed_id: indentor.id,
        bsp_1_id: billDetail['bsp_1_id'],
        bsp_4_id: billDetail['bsp_4_id'],
        variety_id: billDetail['variety_id'],
        lot_id: lot_ids.join(", "),
        label_number: label_numbers.join(", "),
        total_quantity: formGroupcontrol['total_quantity'].value,
        available_quantity: formGroupcontrol['available_quantity'].value,
        spaname: formGroupcontrol['spaName'].value.name,
        // bill_number: formGroupcontrol['bill_number'].value,
        // bill_date: (formGroupcontrol['bill_date'].value.split('-').join('/')),
        amount: formGroupcontrol['amount'].value,
        production_center_id: this.currentUser.id,
        user_id: this.currentUser.id,
        is_active: 1,
        isdraft: 1,
        id: this.submissionId,
      })
    }
    this.isEdit ? this.update(params[0]) : this.create(params)
  }

  activateVarietyIndexInAccordion(varietyIndexInAccordion: number) {
    if (this.activeVarietyIndexInAccordion == varietyIndexInAccordion) {
      this.activeVarietyIndexInAccordion = -1;
    }
    else {
      this.activeVarietyIndexInAccordion = varietyIndexInAccordion;
    }
  }

}
