import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { formatDate } from '@angular/common';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { bspProformasVUIFields, bspProformasVIVarietyUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { bspAccordionFormGroupAndFieldList, accordionUIDataTypeBSP, BreederSeedSubmissionNodalUIFields, createCropVarietyData, selectBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { LoggedInUserInfoService } from 'src/app/services/logged-in-user-info.service';
import { IcarService } from 'src/app/services/icar/icar.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { convertDate, convertDatetoDDMMYYYYwithdash, random, mergeArraysById } from 'src/app/_helpers/utility';
import Swal from 'sweetalert2';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-proformas-vb-form',
  templateUrl: './proformas-vb-form.component.html',
  styleUrls: ['./proformas-vb-form.component.css']
})
export class ProformasVbFormComponent implements OnInit {

  @ViewChildren(DynamicFieldsComponent) dynamicFieldsComponents: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  editParams: { year: number, cropCode: string, varietyId: number } | undefined = undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  editVarietyData: any;
  currentUser: any = { id: 10, name: "Hello User" };
  currentProductionCenter: any;
  cropName: any = [];
  prdData: any = [];
  bspData: any = [];
  prodCenter: any = [];
  teamMembers: any = [];
  yearOfIndent: any = [];
  lotNumberList: any = [];
  lableNumberList: any = [];
  submissionId: number | undefined;
  selectedItems: any = [];
  seasonData: any = [];
  buttonText = 'Submit'
  selectedLot = [];
  selectLabels = [];

  dataRow: boolean = false;
  totalIndentQuantity: any;
  seasonCode: any;

  dataload: boolean = false;

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

  constructor(activatedRoute: ActivatedRoute,
    private breederService: BreederService,
    private router: Router,
    private seedService: SeedServiceService,
    private restService: RestService,
    private masterService: MasterService,
    private indenterService: IndenterService,
    breederSeedSubmissionNodalUIFields: BreederSeedSubmissionNodalUIFields,
    private loggedInUserInfoService: LoggedInUserInfoService,
    private icarService: IcarService,
    private productioncenterService: ProductioncenterService) {

    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name

    this.loadBSPProformasDetails();
    this.getCropSeason();
    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }
    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;
    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    let fields1List = breederSeedSubmissionNodalUIFields.get;
    this.createFormControlsOfAGroupdup(bspProformasVUIFields, this.IstPartFormGroup);
    this.fieldsList = bspProformasVUIFields;
    this.filterPaginateSearch.itemListPageSize = 100;


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
    console.log('this.seasonData', this.seasonData)
  }

  createYearRange(years): void {
    years.forEach((x: any, index: number) => {
      var temp = this.getFinancialYear(x.value)
      this.yearOfIndent.push({ value: x.value, name: temp })
    })
    // this.fieldsList[0].fieldDataList = yrs.flat();
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


  createLables(labelSeeds) {
    let labels = []
    if (labelSeeds.length) {
      labelSeeds.forEach((seedsData: any, index: number) => {
        if (seedsData && seedsData.labels && seedsData.labels.length > 0) {
          seedsData.labels.forEach(label => {
            labels.push({ name: label.generated_label_name, value: label.id, weight: seedsData.weight, labelSeedId: seedsData.id })
          })
        }
      });
    }
    return labels;
  }

  gettotalSelectedLabelWeight(items) {
    this.sleep(10);
    let weight = 0
    items.forEach(a => {
      let tmp = this.lableNumberList.filter(x => x.value == a.value)[0]
      if (tmp != undefined) {
        weight = weight + parseInt(tmp['weight'])
      }
    })
    return weight;
  }

  gettotalSelectedLabelNumbers(labelIds) {
    this.sleep(10);
    if (labelIds != undefined && labelIds != '') {
      let tmparr = []
      labelIds.forEach(a => {
        let tmp = this.lableNumberList.filter(x => x.value == a.value)[0]
        if (tmp != undefined) {
          tmparr.push(tmp['value'])
        }
      })
      return tmparr.join();
    } else {
      return null;
    }
  }
  getQuantityMeasure(crop_code) {
    return crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
  }

  gettotalSelectedLottedNumbers(lotIds) {
    this.sleep(10);
    if (lotIds != undefined && lotIds != '') {
      let tmparr = []
      lotIds.forEach(a => {
        let tmp = this.lotNumberList.filter(x => x.value == a.value)[0]
        if (tmp != undefined) {
          tmparr.push(tmp['value'])
        }
      })
      return tmparr.join();
    } else {
      return null;
    }
  }

  async loadLabelThruLotOnEdit(currentBspData, newFormGroup, agencyData, element) {
    this.lableNumberList = []
    this.breederService.getRequestCreator("get-bsp5b-label-number?lot_number=" + '' + currentBspData.lot_id + "&variety_id=" + element.variety_id + "&user_id=" + this.currentUser.id, null).subscribe((newLable: any) => {
      console.log('newLable', newLable)
      this.lableNumberList = this.createLables(newLable.EncryptedResponse.data)
      // this.dynamicFieldsComponents['last'].fieldsList[6].fieldDataList = this.lableNumberList;
      this.selectLabels = []
      let labels = currentBspData.label_number ? currentBspData.label_number.split(",") : [];
      labels.forEach(a => {
        this.selectLabels.push(this.lableNumberList.filter(s => s.value == parseInt(a)))
      })
      // console.log('selectLabels', selectLabels)
      // newFormGroup.controls["lable_number"].patchValue(selectLabels.flat())
      // this.dynamicFieldsComponents['last'].fieldsList[4].fieldDataList =  selectLabels.flat()

    })
  }

  async loadLabelThruLot(lot_ids, newFormGroup, agencyData, element, subFormArray) {
    console.log('load Lables on selected Lot')
    let selectedlabels = element.label_number ? element.label_number.split(",") : [];
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    let unit = this.getQuantityMeasure(crop_code)
    this.lableNumberList = []
    let subFormArrayN = subFormArray.filter(s => s.indentOfBreederseedId == agencyData.id)[0]

    let lotIds = lot_ids.join();
    this.breederService.getRequestCreator("get-bsp5b-label-number?lot_number=" + '' + lotIds + "&variety_id=" + element.variety_id + "&user_id=" + this.currentUser.id, null).subscribe((newLable: any) => {
      if (newLable && newLable.EncryptedResponse && newLable.EncryptedResponse.status_code && newLable.EncryptedResponse.status_code == 200 && newLable.EncryptedResponse.data.length > 0) {
        this.lableNumberList = this.createLables(newLable.EncryptedResponse.data)
        this.selectLabels = []
        selectedlabels.forEach(a => {
          this.selectLabels.push(this.lableNumberList.filter(s => s.value == parseInt(a)))
        })
        // subFormArrayN.arrayfieldsIIndPartList[4].fieldDataList = selectLabels.flat()
        // newFormGroup.controls["lable_number"].patchValue(selectLabels.flat())
        let totalSelectedLabelWeight = this.gettotalSelectedLabelWeight(this.selectLabels.flat())
        if (unit == 'Quintal') {
          totalSelectedLabelWeight = totalSelectedLabelWeight / 100
        }
        let actualProduction = newFormGroup.controls["actual_production_as_bsp_iv"].value
        let quantityUnlift = parseFloat(actualProduction) - totalSelectedLabelWeight

        let balance = parseInt(agencyData.indent_quantity) - totalSelectedLabelWeight;
        newFormGroup.controls["quantity_of_breeder_seed_lifted"].patchValue(totalSelectedLabelWeight.toFixed(2) || '');
        newFormGroup.controls["quantity_of_breeder_seed_balance"].patchValue('' + balance.toFixed(2))

      }
    })
  }

  loadBSPProformasDetails() {
    this.breederService.getRequestCreatorNew("get-bsp5b-proforma?userId=" + this.currentUser.id).subscribe((data: any) => {
      console.log(data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.currentProductionCenter = data.EncryptedResponse.data
        console.log(this.currentProductionCenter)
        this.createYearRange(this.currentProductionCenter.year)
        this.getCropName(this.currentProductionCenter.crop_code)
        // this.IstPartFormGroup.controls['production_centre_name'].patchValue(this.currentProductionCenter['agency_detail']['agency_name'])
      }
    })
  }

  // for both Ist part search and IInd part accordion
  createFormControlsOfAGroupdup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent") || x.formControlName == "production_centre_name") {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createFormControlsOfAGrouptwo(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>, element) {
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    let lables = this.getLotNumber(element.label)
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent") || x.formControlName == "production_centre_name") {
        newFormControl.disable();
      }
      if (x.formControlName == "lotted_id") {
        x.fieldDataList = lables
      }

      if (x.formControlName == 'lable_name') {
        x.fieldDataList = this.lableNumberList;
      }
      if (["unlifted_quantity", "indenting_quantity", "actual_production_as_bsp_iv", "quantity_of_breeder_seed_allotted", "quantity_of_breeder_seed_lifted", "quantity_of_breeder_seed_balance"].includes(x.formControlName)) {
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

  ngOnInit(): void {

    this.dataRow = false;
    this.dataload = true;

    this.breederService.getRequestCreator("getYearDataForBSP5b?user_id=" + this.currentUser.id).subscribe((data: any) => {
      console.log(data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        let yrs = []
        years.forEach(x => {
          var temp = this.getFinancialYear(x.year)
          yrs.push({
            value: x.year,
            name: temp
          })
        })
        this.fieldsList[0].fieldDataList = yrs;
      }
    })

    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.breederService.getRequestCreator("getSeasonDataForBSP5b?year=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          if (data.EncryptedResponse.data) {
            let seasons = []
            data.EncryptedResponse.data.forEach(element => {
              let temp = {
                name: element['m_season.season'],
                value: element['season']
              }
              seasons.push(temp);
            });
            this.fieldsList[1].fieldDataList = seasons;
            if (this.isView || this.isEdit) {
              let season = seasons.filter(x => x.value == this.bspData.season)[0];
              this.IstPartFormGroupControls["season"].patchValue(season);
            }
          }
        })
      }

    })


    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {

      if (newValue) {
        let year = this.IstPartFormGroupControls["yearofIndent"].value;
        let season = newValue.value;
        this.seasonCode = newValue.value;

        this.breederService.getRequestCreator("getCropDataForBSP5b?year=" + year.value + "&season=" + season + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            let cropGroups = []
            data.EncryptedResponse.data.forEach(element => {
              let temp = {
                name: element['m_crop.crop_name'],
                value: element['crop_code']
              }
              cropGroups.push(temp);
            });
            this.fieldsList[2].fieldDataList = cropGroups;
          }
        })
      }

    })

    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.loadVarieties();

      }
    });

    if (this.isEdit || this.isView) {
      this.dataload = false;
      this.breederService.getRequestCreator('get-bsp5b/' + this.submissionId).subscribe(dataList => {
        this.selectedItems = []
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.bspData = dataList.EncryptedResponse.data
          this.buttonText = 'Update'
          this.isDraft = data?.isdraft ? true : false;
          let year = this.yearOfIndent.filter(x => x.value == data.year)[0]
          let crop = this.cropName.filter(x => x.value == data.crop_code)[0]
          let season = this.seasonData.filter(x => x.value == data.season)[0]

          this.seasonCode = season && season.value ? season.value : 'K';
          let foundData = { year: year, crop: crop, season: season }

          this.patchForm(foundData);
          if (this.bspData.label_number && this.bspData.label_number.length) {
            let lableIds = this.bspData.label_number.split(',')
            let labls = []
            if (lableIds != undefined) {
              lableIds.forEach(lableId => {
                labls.push(this.lableNumberList.filter(x => x.value == parseInt(lableId))[0])
              })
              this.selectedItems = labls;
            }
          }
        }
        else {
          Swal.fire({
            title: 'Opps',
            text: 'No Record Found.',
            imageUrl: 'https://cdn.dribbble.com/users/308895/screenshots/2598725/no-results.gif',
            imageWidth: 400,
            imageHeight: 200,
            showConfirmButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['breeder/bsp-proformas/proformas-5s-b']);
            }
          })
        }
      });
    }
  }
  patchForm(data: any) {
    this.IstPartFormGroupControls["yearofIndent"].patchValue(data.year);
    this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
    this.IstPartFormGroupControls["season"].patchValue(data.season);

  }
  loadVarieties() {
    if (this.IstPartFormGroupControls["yearofIndent"].value &&
      this.IstPartFormGroupControls["cropName"].value) {

      let yearValue = this.IstPartFormGroupControls["yearofIndent"].value["value"];
      let season;
      if (this.isEdit || this.isView) {
        season = this.seasonCode;
      } else {
        season = this.IstPartFormGroupControls["season"].value["value"];
      }

      let crop = this.IstPartFormGroupControls["cropName"].value["value"]
      let nucleusSeedAvailabilityData = [];
      let searchData = {
        search: [
          { columnNameInItemList: "year.value", value: this.IstPartFormGroupControls["yearofIndent"].value["value"] },
          { columnNameInItemList: "crop.value", value: this.IstPartFormGroupControls["cropName"].value["value"] }
        ],
        "pageSize": -1
      };

      this.dataRow = true;
      this.breederService.getRequestCreator("get-bsp5b-variety-list?userId=" + this.currentUser.id + "&cropName=" + crop + "&yearOfIndent=" + yearValue + "&season=" + season, null).subscribe((data: any) => {
        console.log("bspData:", data)
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
          let IIndPartFormArray: accordionUIDataTypeBSP[] = [];

          let varieties = this.prdData = data.EncryptedResponse.data
          if (this.isView || this.isEdit) {
            varieties = this.prdData = this.prdData.filter(x => x.variety_id == this.bspData.variety_id)
          }

          this.totalIndentQuantity = 0;
          varieties.forEach((element: any, index: number) => {
            console.log('elementelementelement', element);
            let IIndPartForm: accordionUIDataTypeBSP = {
              name: element.m_crop_variety.variety_name,
              varietyId: element.variety_id,
              bsp_5_a_id: element.id,
              formGroupAndFieldList: []
            };
            const totalAgencyDetailCount = element.agency_details !== undefined ? element.agency_details.length : 0;
            createCropVarietyData(element, true);

            let indentors = element.indentors;
            let generatetolalLifting = element.generatetolalLifting;
            console.log('indentors', generatetolalLifting)
            const uniqueValues = {};

            // Iterate over the array of objects
            generatetolalLifting.forEach(obj => {
              // Check if the current value of "name" property is already in the uniqueValues object
              if (!uniqueValues[obj.indent_of_breederseed_id]) {
                // Add the current value to the uniqueValues object
                uniqueValues[obj.indent_of_breederseed_id] = { ...obj };
              } else {
                // Sum the "age" property if the value is already present
                (uniqueValues[obj.indent_of_breederseed_id].total_quantity) += parseInt(obj.total_quantity);
              }
            });
            const uniqueArray = Object.values(uniqueValues);
            //             let arr3 = indentors.map((item, i) => Object.assign({}, item, uniqueValues[i]));

            // console.log(arr3);
            const mergeById = (a1, a2) =>
              a1.map(itm => ({
                ...a2.find((item) => (item.indent_of_breederseed_id == itm.id)),
                ...itm
              }));
            indentors = mergeById(indentors, uniqueArray);




            let producced = element && element.quantity_of_seed_produced ? element.quantity_of_seed_produced : 0
            // if(indentors){

            //   for(let data of indentors){
            //     if(element.quantity_of_seed_produced){
            //       data.differncebalance= parseInt(producced)- parseInt(data.total_quantity)
            //       data.differncebalance2= (parseInt(data.differncebalance)<=0)? 0 : data.differncebalance
            //     }
            //   }
            // }
            const updatedArray = indentors.map(obj => {
              let diff = (parseFloat(producced) - parseFloat(obj.total_quantity))
              return {
                ...obj, // Spread the existing properties of the object
                "difference": (parseFloat(producced) - parseFloat(obj.total_quantity)),
                'diff': (diff <= 0) ? '0' : (diff >= 1) ? (diff.toFixed(2)) : ''
                // Add the new key-value pair
              };
            });
            indentors = updatedArray
            console.log('indentors', indentors)


            if (this.isView || this.isEdit) {
              indentors = indentors.filter(x => x.id == this.bspData.indent_of_breederseed['id'])
            }
            indentors.forEach((agencyData, agencyIndex) => {
              const appDynamicFieldsId = 2 + (index * totalAgencyDetailCount + agencyIndex);
              this.generateAccordionFormGroups(element
                , appDynamicFieldsId
                , IIndPartForm.formGroupAndFieldList
                , agencyData,
                nucleusSeedAvailabilityData);
            });

            IIndPartFormArray.push(IIndPartForm);

            element.indentors.forEach((data: any) => {
              this.totalIndentQuantity = this.totalIndentQuantity + (data.indent_quantity ? Number(data.indent_quantity) : 0);
            });
          });
          this.IstPartFormGroupControls["cropName"].value['varieties'] = []
          this.IstPartFormGroupControls["cropName"].value['varieties'].push(IIndPartFormArray)
          this.filterPaginateSearch.Init(IIndPartFormArray, this);
          this.initSearchAndPagination();

          this.dataload = true;
        }
      });
    }
  }
  generateAccordionFormGroups(element: any, index: number, subFormArray: Array<bspAccordionFormGroupAndFieldList>, agencyData: any,
    nucleusSeedAvailabilityData: any[]) {

    let newFormGroup = new FormGroup<any>([]);
    this.createFormControlsOfAGrouptwo(bspProformasVIVarietyUIFields, newFormGroup, element);

    console.log('element================',element)
    console.log(bspProformasVIVarietyUIFields)
    let varietyFields = bspProformasVIVarietyUIFields
    newFormGroup.controls["indenting_quantity"].patchValue(agencyData?.indent_quantity.toFixed(2));
    newFormGroup.controls["indentor"].patchValue(agencyData?.indent_agency || "ABC");
    newFormGroup.controls["quantity_of_breeder_seed_allotted"].patchValue(element?.quantity_of_seed_produced);
    let lables = this.getLotNumber(element.label)
    let lot_ids = lables.map(item => item.id)
    // newFormGroup.controls["lotted_id"].patchValue(lables)
    newFormGroup.controls["date_of_lifting"].patchValue(convertDatetoDDMMYYYYwithdash(new Date()))
    newFormGroup.controls["actual_production_as_bsp_iv"].patchValue(element?.actual_seed_production);
    console.log(element)
    newFormGroup.controls["quantity_of_breeder_seed_lifted"].patchValue(agencyData && agencyData?.total_quantity ? agencyData?.total_quantity.toFixed(2) : '');

    let quantity_of_breeder_seed_balance = (parseFloat(element?.quantity_of_seed_produced) - parseFloat(element?.lifting_quantity))
    // let diffbal = agencyData && agencyData?.differncebalance2 && (agencyData?.differncebalance2<=0) ? '0' :agencyData?.differncebalance2.toFixed(2)
    newFormGroup.controls["quantity_of_breeder_seed_balance"].patchValue(agencyData && agencyData.diff ? agencyData.diff : '0')
    // newFormGroup.controls["unlifted_quantity"].patchValue("0");

    if (this.isEdit || this.isView) {
      if(this.bspData && this.bspData.indent_of_breederseed_id && this.bspData.indent_of_breederseed_id.id){

        if (this.bspData.indent_of_breederseed_id.id == agencyData.indent_of_breederseed_id) {
          this.selectedLot = []
          let selectLabels = []
          newFormGroup.controls["reason_for_short"].patchValue(this.bspData.reason);
          // newFormGroup.controls["unlifted_quantity"].patchValue('' + this.bspData.unlifting_quantity || 0);
          newFormGroup.controls["quantity_of_breeder_seed_balance"].patchValue(this.bspData.breeder_seed_balance);
          newFormGroup.controls["quantity_of_breeder_seed_lifted"].patchValue(this.bspData.lifting_quantity);
          newFormGroup.controls["date_of_lifting"].patchValue((this.bspData.lifting_date));
          // let lottedId = this.bspData.lot_id ? this.bspData.lot_id.split(",") : [];
          // lottedId.forEach(a => {
          //   this.selectedLot.push(this.lotNumberList.filter(s => s.value == parseInt(a)))
          // })
          // newFormGroup.controls["lotted_id"].patchValue(selectedLot.flat());
          // this.loadLabelThruLotOnEdit(this.bspData, newFormGroup, agencyData, element)
        }
      }else{
        if (this.bspData.indent_of_breederseed_id == agencyData.indent_of_breederseed_id) {
          this.selectedLot = []
          let selectLabels = []
          newFormGroup.controls["reason_for_short"].patchValue(this.bspData.reason);
          // newFormGroup.controls["unlifted_quantity"].patchValue('' + this.bspData.unlifting_quantity || 0);
          newFormGroup.controls["quantity_of_breeder_seed_balance"].patchValue(this.bspData.breeder_seed_balance);
          newFormGroup.controls["quantity_of_breeder_seed_lifted"].patchValue(this.bspData.lifting_quantity);
          newFormGroup.controls["date_of_lifting"].patchValue((this.bspData.lifting_date));
          // let lottedId = this.bspData.lot_id ? this.bspData.lot_id.split(",") : [];
          // lottedId.forEach(a => {
          //   this.selectedLot.push(this.lotNumberList.filter(s => s.value == parseInt(a)))
          // })
          // newFormGroup.controls["lotted_id"].patchValue(selectedLot.flat());
          // this.loadLabelThruLotOnEdit(this.bspData, newFormGroup, agencyData, element)
        }
      }
    }

    // newFormGroup.controls["lotted_id"].valueChanges.subscribe(lot_id => {
    //   console.log('lotted_id', lot_id)
    //   this.loadLabelThruLot(lot_ids, newFormGroup, agencyData, element, subFormArray)
    // });

    const availableQuantity = nucleusSeedAvailabilityData.filter(x => {
      return x.variety_id == element.variety_id;
    });

    subFormArray.push({
      indentOfBreederseedId: agencyData.id,
      dynamicControllerId: index,
      formGroup: newFormGroup,
      arrayfieldsIIndPartList: bspProformasVIVarietyUIFields.map(x => {
        if (["lable_number", "date_of_lifting", "lotted_id", "indentor", "indenting_quantity", "actual_production_as_bsp_iv", "quantity_of_breeder_seed_allotted", "quantity_of_breeder_seed_lifted", "quantity_of_breeder_seed_balance", "unlifted_quantity"].includes(x.formControlName)) {
          newFormGroup.controls[x.formControlName].disable();
        }
        return { ...x };
      })
    });

    this.loadLabelThruLot(lot_ids, newFormGroup, agencyData, element, subFormArray)

  }

  getBreederData(selectBreederNameFieldInfo: SectionFieldType, breeder_id: any) {
    let breederInfo = selectBreederNameFieldInfo.fieldDataList.filter(x => x.id == breeder_id);
    if (breederInfo && breederInfo.length > 0) {
      return { ...breederInfo[0] };
    }
    else {
      return selectBreederNameFieldInfo.fieldDataList[0];
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



  // getDynamicFieldsComponent(id): DynamicFieldsComponent {
  //   return this.dynamicFieldsComponents.filter(x => x.id == id)[0];
  // }

  create(params) {
    this.breederService.postRequestCreator("add-bsp5b", null, params).subscribe((data: any) => {
      console.log("after create sub:", data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        this.router.navigate(['breeder/bsp-proformas/proformas-5s-b']);
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
    console.log("before update", params)
    this.breederService.postRequestCreator("edit-bsp5b", null, params).subscribe((data: any) => {
      console.log("after update sub:", data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        this.router.navigate(['breeder/bsp-proformas/proformas-5s-b']);
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
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  submit(noRedirectAndIgnoreErrors: boolean = false) {
    console.log(this.IstPartFormGroupControls)
    let invalid = false;
    const params = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value;
    let varieties = newValue['cropName'].value.varieties[0]
    varieties.forEach((variety, index) => {
      variety.formGroupAndFieldList.forEach((element) => {
        let form = element.formGroup;
        invalid = form.invalid;
        let formGroupcontrol = form.controls;
        // let lot_ids = formGroupcontrol['lotted_id'].value.map(item => item.value)
        // let label_numbers = formGroupcontrol['lable_number'].value.map(item => item.value)
        params.push({
          "crop_code": crop_code,
          "production_center_id": this.currentProductionCenter.id,
          // "lot_id": lot_ids.join(','),
          // "label_number": label_numbers.join(','),
          "user_id": this.currentUser.id,
          "variety_id": variety.varietyId,
          "year": year,
          "season": season,
          "is_active": 1,
          "lifting_date": formGroupcontrol['date_of_lifting'].value,
          "lifting_quantity": formGroupcontrol['quantity_of_breeder_seed_lifted'].value,
          "reason": formGroupcontrol['reason_for_short'].value,
          "unlifting_quantity": 0,
          "breeder_seed_balance": formGroupcontrol['quantity_of_breeder_seed_balance'].value,
          "bsp_5_a_id": variety.bsp_5_a_id,
          "id": this.submissionId,
          "indent_of_breederseed_id": element.indentOfBreederseedId,
        })
      })
    })
    if (invalid) {
      Swal.fire('Error', 'Please Fill Out All Required Fields.', 'error');
      this.dynamicFieldsComponents['last'].showError = true
      return;
    }
    console.log(params)
    this.isEdit ? this.update(params[0]) : this.create(params)
  }
  getSavedId(agencyId: number) {
    if (this.editVarietyData && this.editVarietyData.length > 0) {
      let savedId = undefined;
      this.editVarietyData.forEach(element => {
        if (element.agency_detail.id == agencyId) {
          savedId = element.id;
        }
      });
      return savedId;
    }
    return undefined;
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
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let variety = newValue['cropName'].value.varieties[0][index]
      console.log("variety", variety)
      newValue['cropName'].value.varieties[0][index].formGroupAndFieldList.forEach((element) => {
        let form = element.formGroup;
        let formGroupcontrol = form.controls;
        params.push({
          // "lot_id": this.gettotalSelectedLottedNumbers(formGroupcontrol['lotted_id'].value),
          // "label_number": this.gettotalSelectedLabelNumbers(formGroupcontrol['lable_number'].value),
          "crop_code": crop_code,
          "production_center_id": this.currentProductionCenter.id,
          "user_id": this.currentUser.id,
          "variety_id": variety.varietyId,
          "year": year,
          "season": season,
          "is_active": 1,
          "lifting_date": formGroupcontrol['date_of_lifting'].value,
          "lifting_quantity": formGroupcontrol['quantity_of_breeder_seed_lifted'].value,
          "reason": formGroupcontrol['reason_for_short'].value,
          "unlifting_quantity": 0,
          "breeder_seed_balance": formGroupcontrol['quantity_of_breeder_seed_balance'].value,
          "bsp_5_a_id": variety.bsp_5_a_id,
          "isdraft": 1,
          "id": this.submissionId,
          "indent_of_breederseed_id": element.indentOfBreederseedId,
        })
      })
    }
    console.log(params)
    this.isEdit ? this.update(params[0]) : this.create(params)
    // this.router.navigate(['/allocation-seed-production-list']);
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
