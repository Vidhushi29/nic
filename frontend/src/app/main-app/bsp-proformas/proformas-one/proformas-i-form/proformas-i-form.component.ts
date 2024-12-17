import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { bspProformasIUIFields, bspProformasIVarietyUIFields, bspProformasIProductionCenterUIFields } from 'src/app/common/data/ui-field-data/bsp-proformas-ui-field';
import { bspIAccordionFormGroupAndFieldList, accordionUIDataTypeBSPI, BreederSeedSubmissionNodalUIFields, createCropVarietyData, selectBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
// import { bspProformasIUIFields, bspProformasIVarietyUIFields, selectNucliousBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import Swal from 'sweetalert2';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { NucleusSeedAvailabilityByBreederSearchComponent } from 'src/app/common/nucleus-seed-availability-by-breeder-search/nucleus-seed-availability-by-breeder-search.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';


@Component({
  selector: 'app-proformas-i-form',
  templateUrl: './proformas-i-form.component.html',
  styleUrls: ['./proformas-i-form.component.css']
})
export class ProformasIFormComponent implements OnInit {

  @ViewChildren(DynamicFieldsComponent) dynamicFieldsComponents: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  bspData: any = [];
  isDraft: boolean = false;
  yearOfIndent: any = [];
  prodCenter: any = [];
  varietyName: any = [];
  cropName: any = [];
  seasonList: any = [];
  todayDate = new Date();
  prdData: any = [];
  selectedProductionCenter: any = [];
  leftQuantity = 0
  productionCenters: any = []
  currentUser: any = { id: 10, name: "Hello Breeder" };
  seasonData: any = [];
  buttonText = 'Submit'

  dataRow: boolean = false;
  totalIndentQuantity: any;
  disableBtn: boolean;

  dataload: boolean = false;
  value: any;
  varietyData: any;

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

  constructor(activatedRoute: ActivatedRoute, private router: Router, private restService: RestService, private breederService: BreederService, private seedService: SeedServiceService, private productioncenterService: ProductioncenterService) {

    const params: any = activatedRoute.snapshot.params;
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name

    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));
    this.getCropName();
    this.getCropSeason();
    this.productionCenter()
    this.createYearRange(1990, this.todayDate.getFullYear());

    this.createFormControlsOfAGroup(bspProformasIUIFields, this.IstPartFormGroup);
    this.fieldsList = bspProformasIUIFields;

    // this.fieldsList.forEach(x => {
    //   delete x["validations"];

    //   x.gridColClass = "col-12 col-md-4 py-2 py-md-0";
    //   const newFormControl = new FormControl("");
    //   this.formSuperGroup.addControl(x.formControlName, newFormControl);
    // });
    this.filterPaginateSearch.itemListPageSize = 100;

  }
  createYearRange(start: number, end: number): void {
    this.yearOfIndent = [
      // { name: "2020-21", "value": 2020 },
      { name: "2021-22", "value": 2021 },
      { name: "2022-23", "value": 2022 },
      { name: "2023-24", "value": 2023 },
      { name: "2024-25", "value": 2024 },
      { name: "2025-26", "value": 2025 },
      { name: "2026-27", "value": 2026 }
    ]
    this.yearOfIndent = this.yearOfIndent.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
  }

  productionCenter() {
    this.breederService.getRequestCreatorNew("get-production-center-name?userId=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.prodCenter = data.EncryptedResponse.data
      }
    })
  }

  async getCropName() {
    this.breederService.getRequestCreatorNew("get-breeder-crop-list").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((x: any, index: number) => {
          let crop = x
          if (crop != null) {
            x["name"] = crop['m_crop.crop_name'];
            x["value"] = crop['crop_code'];
            this.cropName.push(x);
          }
        });
        this.cropName.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      }
    });
  }

  getCropSeason() {
    this.seedService.postRequestCreator("get-season-details").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((x: any, index: number) => {
          x["name"] = x.season;
          x["value"] = x.season_code;
          this.seasonList.push(x);
        });
      }
    });
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent" || x.formControlName == "contact_officer" || x.formControlName == "breader_production_name")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createProductionCenter(prodCenters) {
    let prodCenter = []
    prodCenters.forEach((x: any, index: number) => {
      let prod = x
      if (prod != null) {
        x["name"] = prod['user.name'];
        x["value"] = prod['production_center_id'];
        this.cropName.push(x);
      }
    })
    return prodCenter
  }

  createFormControlsOfAGroupVariety(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>, index: any, element) {
    let temp = []
    // element.productionCenters.forEach((x: any, index: number) => {
    //   temp.push({name: x.name, value: x.production_center_id, id: x.production_center_id})
    // })
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent" || x.formControlName == "contact_officer" || x.formControlName == "breader_production_name")) {
        newFormControl.disable();
      }
      if (["indent_quantity", "available_nucleus_seed", "breeder_seed_quantity"].includes(x.formControlName)) {
        let name = x.fieldName && x.fieldName.split("(")[0] ? x.fieldName.split("(")[0] : ''
        x.fieldName = name + " (" + this.getQuantityMeasure(crop_code) + ")"
      }
      let temp = [];
      if (x.formControlName == 'production_centre_id') {
        let temp = [];
        // x.fieldDataList = element.productionCenters; 
        element.productionCenters.forEach(x => {

          x['name'] = x.agency_detail.agency_name
          x['value'] = x.agency_detail.user_id
          temp.push(x)

        });
        // temp= temp.filter(x=>x.id!=675)
        // console.log('temptemp',x.formControlName)
        x.fieldDataList = temp;
      }

      formGroup.addControl(x.formControlName, newFormControl);
    });
  }
  getQuantityMeasure(crop_code) {
    return crop_code && crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
  }

  add(arr, val, name) {
    const { length } = arr;
    const value = name;
    const found = arr.some(el => el.value === val);
    if (!found) arr.push({ value: val, name: value });
    return arr;
  }

  ngOnInit(): void {
    this.dataRow = false;

    if (this.isEdit || this.isView) {
      this.dataload = false;
    } else {
      this.dataload = true;
    }

    this.breederService.getRequestCreator("get-breeder-crop-year").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        let yrs = []
        years.forEach((x, index, array) => {
          var temp = this.getFinancialYear(x.year)
          yrs.push({
            value: x.year,
            name: temp
          })
        });
        this.fieldsList[0].fieldDataList = yrs;
      }
    })

    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.IstPartFormGroupControls["season"].setValue('');
        this.IstPartFormGroupControls["cropName"].setValue('');
        this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
        this.filterPaginateSearch.initialized = false

        this.breederService.getRequestCreator("fetchSeasonByCrop?year=" + newValue.value).subscribe((data: any) => {
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
              let season = this.seasonList.filter(x => x.value == this.bspData.season)[0]
              this.IstPartFormGroupControls["season"].patchValue(season);
            }
          }
        })
      }

    })

    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.IstPartFormGroupControls["cropName"].setValue('');
        this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
        this.filterPaginateSearch.initialized = false
        let year = this.IstPartFormGroupControls["yearofIndent"].value;
        let season = newValue.value;

        this.breederService.getRequestCreator("bsp/fetchCropNameByYearAndSeason?year=" + year.value + "&season=" + season + "&icar_freeze=" + 1).subscribe((data: any) => {
          if (data.EncryptedResponse.data) {
            let cropGroups = []
            data.EncryptedResponse.data.forEach(element => {
              let temp = {
                name: element['crop_name'],
                value: element['crop_code']
              }
              cropGroups.push(temp);
            });

            this.fieldsList[2].fieldDataList = cropGroups.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

            if (this.isView || this.isEdit) {
              let crop = this.cropName.filter(x => x.value == this.bspData.crop_code)[0]
              this.IstPartFormGroupControls["cropName"].patchValue(crop);
            }
          }
        })
      }

    })



    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.IstPartFormGroupControls["cropName"].value['varieties'] = []
        let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value;
        let crop = newValue.value;
        let season: any;
        if (this.isView || this.isEdit) {
          season = this.IstPartFormGroupControls["season"].value.value;
        } else {
          season = this.IstPartFormGroupControls["season"].value.value;
        }
        let nucleusSeedAvailabilityData = [];
        let searchparams = { "search": [{ "columnNameInItemList": "year.value", "value": yearValue }, { "columnNameInItemList": "crop.value", "value": crop }, { "columnNameInItemList": "season.value", "value": season }], "pageSize": -1, userId: this.currentUser.id }

        let varieties = []
        this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
        let IIndPartFormArray: {
          id: string,
          indent_of_breederseed_id: string,
          agency_detail_id: string,
          formGroup: FormGroup,
          name: string,
          arrayfieldsIIndPartList: Array<SectionFieldType>
        }[] = [];

        this.dataRow = true;
        this.breederService.postRequestCreator("get-breeder-seeds-submission-list", null, searchparams).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows && data.EncryptedResponse.data.rows.length > 0) {
            let IIndPartFormArray: accordionUIDataTypeBSPI[] = [];
            let varieties = this.prdData = data.EncryptedResponse.data.rows;

            if (this.isView || this.isEdit) {
              varieties = this.prdData = this.prdData.filter(x => x.variety_id == this.bspData.variety_id)
              this.selectedProductionCenter = this.prodCenter.filter(x => x.id == this.bspData.production_center_id.id)[0]
            }

            // if (this.isView || this.isEdit) {
            //   this.IstPartFormGroupControls["season"].patchValue(this.seasonData[0]);
            // }
            this.totalIndentQuantity = 0;
            varieties.forEach((element: any, index: number) => {
              let IIndPartForm: accordionUIDataTypeBSPI = {
                name: element.m_crop_variety.variety_name,
                varietyId: element.variety_id,
                formGroupAndFieldList: []
              };

              const totalAgencyDetailCount = element.agency_details !== undefined ? element.agency_details.length : 0;
              createCropVarietyData(element, true);
              let indentors = element.indentors
              if (this.isView || this.isEdit) {
                indentors = indentors.filter(x => x.id == this.bspData.indent_of_breederseed['id'])
              }
              indentors.forEach((indentorData, agencyIndex) => {
                const appDynamicFieldsId = 2 + (index * totalAgencyDetailCount + agencyIndex);
                this.generateAccordionFormGroups(element
                  , appDynamicFieldsId
                  , IIndPartForm.formGroupAndFieldList
                  , indentorData
                  , nucleusSeedAvailabilityData
                  , IIndPartFormArray);
              });

              IIndPartFormArray.push(IIndPartForm);


              element.indentors.forEach((data: any) => {
                this.totalIndentQuantity = this.totalIndentQuantity + (data.indent_quantity ? Number(data.indent_quantity) : 0);
              });
            });

            this.IstPartFormGroupControls["cropName"].value['varieties'].push(IIndPartFormArray)
            this.varietyData = this.IstPartFormGroupControls["cropName"].value['varieties'];
            console.log("this.IstPartFormGroupControls['cropName']==",this.IstPartFormGroupControls["cropName"].value['varieties']);
            this.filterPaginateSearch.Init(IIndPartFormArray, this);
            this.initSearchAndPagination();
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: 'No Data Found.',
            })
          }

          this.dataload = true;
        })

      }

    });


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
      this.breederService.getRequestCreator('get-bsp1/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          this.buttonText = 'Update'
          let data = this.bspData = dataList.EncryptedResponse.data
          this.productionCenters = data.production_center_id
          this.isDraft = data?.isdraft ? true : false;
          let year = this.yearOfIndent.filter(x => x.value == data.year)[0]
          let season = this.seasonList.filter(x => x.season_code == data.season)[0]
          let crop = this.cropName.filter(x => x.crop_code == data.crop_code)[0]
          let foundData = { year: year, crop: crop, season: season }
          this.patchForm(foundData);
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
              this.router.navigate(['breeder/bsp-proformas/proformas-1s']);
            }
          })
        }
      });
    }
  }


  generateAccordionFormGroupsForProduction(IIIndPartForm, element: any, index: number, subFormArray: Array<bspIAccordionFormGroupAndFieldList>, indentorData: any, parentSubArray: any[], productCenter: any, productionValue) {
    let newFormGroupSub = new FormGroup<any>([]);
    let value = this.prodCenter.filter(item => element.productionCenters.some(x => item.id == x.id));

    let production = element.productionCenters;
    newFormGroupSub.value["index"] = ''
    this.createFormControlsOfAGroupVariety(bspProformasIProductionCenterUIFields, newFormGroupSub, element, element);
    if ((this.isView || this.isEdit) && productCenter != null) {
      let newValue = this.selectedProductionCenter = this.prodCenter.filter(x => x.id == productCenter.production_center_id)[0]
      newFormGroupSub.controls["production_centre_id"].patchValue(this.selectedProductionCenter);
      newFormGroupSub.controls['contact_officer_info'].patchValue(newValue.agency_detail.contact_person_name + ", " + newValue.agency_detail.m_designation.name)
      newFormGroupSub.controls['officer_address_info'].patchValue(newValue.agency_detail.address || "N/A")
      newFormGroupSub.controls['available_nucleus_seed'].patchValue('' + productCenter.available_nucleus_seed)
      newFormGroupSub.controls['breeder_seed_quantity'].patchValue('' + productCenter.quantity_of_seed_produced)
      newFormGroupSub.controls['monitoring_team_memebers_count'].patchValue('' + productCenter.members)

    }

    newFormGroupSub.controls['production_centre_id'].valueChanges.subscribe(newValue => {

      let production = element.productionCenters;

      // let prod = element.productionCenters.filter(item => item.id != newValue.id);
      let IIIndPartForm: accordionUIDataTypeBSPI = {
        name: null,
        varietyId: null,
        formGroupAndFieldList: []
      };
      // element.productionCenters = prod
      let addProductionCenterIndex = 0;
      this.generateAccordionFormGroupsForProduction(IIIndPartForm, element, addProductionCenterIndex, IIIndPartForm.formGroupAndFieldList, indentorData, subFormArray, null, element.productionCenters)
      this.checkNucleusAvailabilityForm(newValue, element.variety_id);
      let prod = element.productionCenters.filter(item => item.id != newValue.id)
      element.productionCenters = prod
      if (newValue) {
        this.IstPartFormGroupControls["cropName"].value['varieties'] = []
        let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value;
        let crop = this.IstPartFormGroupControls["cropName"].value.value;
        let season: any;
        if (this.isView || this.isEdit) {
          season = this.IstPartFormGroupControls["season"].value.value;
        } else {
          season = this.IstPartFormGroupControls["season"].value.value;
        }
        let searchparams = { "search": [{ "columnNameInItemList": "year.value", "value": yearValue }, { "columnNameInItemList": "crop.value", "value": crop }, { "columnNameInItemList": "season.value", "value": season }], "pageSize": -1, userId: this.currentUser.id }



        this.breederService.postRequestCreator("get-breeder-seeds-submission-list", null, searchparams).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows && data.EncryptedResponse.data.rows.length > 0) {
            let varieties = this.prdData = data.EncryptedResponse.data.rows;
            let varietyData = varieties.filter(item => item.variety_id == element.variety_id);
            let production = varietyData && varietyData[0].productionCenters ? varietyData[0].productionCenters : '';
            if (production && production.length > 0) {
              for (let data in subFormArray) {
                for (let val in subFormArray[data].formGroup) {
                  let productions = production.filter(x => x.id != subFormArray[data].formGroup.value.production_centre_id.id)
                  let prod = production.filter(item => item.id != newValue.id)

                  element.productionCenters = prod


                }

              }
            }


            // this.IstPartFormGroupControls["cropName"].value['varieties'].push(IIndPartFormArray)
            // this.filterPaginateSearch.Init(IIndPartFormArray, this);
            // this.initSearchAndPagination();
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: 'No Data Found.',
            })
          }

          this.dataload = true;
        })

      }

      // let prod = element.productionCenters.filter(item => item.id != newValue.id)      
      // element.productionCenters = prod
      this.breederService.getRequestCreator("get-nucleus-seed?userId=" + newValue.id + "&varietyId=" + element.variety_id).subscribe((nucleusSeed: any) => {
        if (nucleusSeed && nucleusSeed.EncryptedResponse && nucleusSeed.EncryptedResponse.status_code && nucleusSeed.EncryptedResponse.status_code == 200) {
          let seedData = nucleusSeed.EncryptedResponse.data
          newFormGroupSub.controls['contact_officer_info'].patchValue(newValue.agency_detail.contact_person_name + ", " + newValue.agency_detail.m_designation.name)
          newFormGroupSub.controls['officer_address_info'].patchValue(newValue.agency_detail.address || "N/A")
          newFormGroupSub.controls['available_nucleus_seed'].patchValue('' + seedData.quantity)
        }
      })
    })
    subFormArray.push({
      indentOfBreederseedId: indentorData?.id,
      agencyDetailId: productCenter ? productCenter.id : null,
      dynamicControllerId: index,
      formGroup: newFormGroupSub,
      productionCenters: [],
      arrayfieldsIIndPartList: bspProformasIProductionCenterUIFields.map(x => {
        if (!["breeder_seed_quantity", "production_centre_id", "monitoring_team_memebers_count"].includes(x.formControlName)) {
          newFormGroupSub.controls[x.formControlName].disable();
        }
        return { ...x };
      })
    });



    newFormGroupSub.controls['remove_production_center'].valueChanges.subscribe(newValue => {
      if (newFormGroupSub.controls['production_centre_id'].value) {

        element.productionCenters.push(newFormGroupSub.controls['production_centre_id'].value);
      }


      for (let data of element.productionCenters) {
        data.name = data && data.agency_detail && data.agency_detail.agency_name ? data.agency_detail.agency_name : ''
      }
      element.productionCenters = element.productionCenters.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.id === arr.id)))
      element.productionCenters = productionValue


      index = index - 1;
      let currentIndentorForm = parentSubArray.filter((item) => item.indentOfBreederseedId == indentorData?.id)[0]
      let filteredIndendorForm = currentIndentorForm.productionCenters.filter((pc) => pc.dynamicControllerId !== (index + 1))
      currentIndentorForm.productionCenters = filteredIndendorForm;
      subFormArray = subFormArray.filter((item) => item.dynamicControllerId !== (index + 1));
      for (let data in subFormArray) {
        for (let val in subFormArray[data].arrayfieldsIIndPartList) {
          //  if(subFormArray[data].arrayfieldsIIndPartList[val].formControlName=='production_centre_id'){

          subFormArray[data].arrayfieldsIIndPartList[val].fieldDataList = element.productionCenters

        }
      }
      console.log(subFormArray, '')
      IIIndPartForm.formGroupAndFieldList = subFormArray;
    })

    newFormGroupSub.controls['breeder_seed_quantity'].valueChanges.subscribe(newValue => {
      let currentIndentorForm = parentSubArray.filter((item) => item.indentOfBreederseedId == indentorData?.id)[0]
      let indentingQuantity = currentIndentorForm.formGroup.value["indent_quantity"]

      // if ((newValue < 0) || newValue > parseInt(indentingQuantity)){
      //   newFormGroupSub.controls['breeder_seed_quantity'].patchValue(0)
      // }
    })
  }

  checkNucleusAvailabilityForm(newValue, variety_id) {
    let route = "check-nuleus-production-form-fill-by-production";
    this.productioncenterService.postRequestCreator(route, {
      search: {
        year: this.IstPartFormGroup.controls['yearofIndent'].value,
        crop_code: this.IstPartFormGroup.controls['cropName'].value,
        production_center_id: newValue.id,
        season: this.IstPartFormGroup.controls['season'].value,
        varirty_id: variety_id
      }
    },).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code == 200) {
        this.disableBtn = false;
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Nucleus Seed Availabilty is Not Filled.</p>',
          icon: 'warning',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        this.disableBtn = true;
        return;
      }

    })
  }

  generateAccordionFormGroups(element: any, index: number, subFormArray: Array<bspIAccordionFormGroupAndFieldList>, indentorData: any, nucleusSeedAvailabilityData: any[], IIndPartFormArray) {
    let newFormGroup = new FormGroup<any>([]);
    this.createFormControlsOfAGroupVariety(bspProformasIVarietyUIFields, newFormGroup, element, element);
    let varietyFields = bspProformasIVarietyUIFields
    let releaseDate = ''
    if (element?.m_crop_variety?.introduce_year)
      releaseDate = element?.m_crop_variety?.introduce_year.split('-').pop() || "";
    newFormGroup.controls["year_of_release"].patchValue(releaseDate);
    newFormGroup.controls["indenting_agency"].patchValue(indentorData?.user?.agency_detail?.agency_name);
    newFormGroup.controls["indent_quantity"].patchValue(indentorData?.indent_quantity.toFixed(2));
    let IIIndPartForm: accordionUIDataTypeBSPI = {
      name: null,
      varietyId: null,
      formGroupAndFieldList: []
    };
    let addProductionCenterIndex = 0;
    if (this.isView || this.isEdit) {
      let producntion = element.productionCenters
      this.bspData.production_center_id.forEach((productCenter: any, index: number) => {
        this.generateAccordionFormGroupsForProduction(IIIndPartForm, element, index, IIIndPartForm.formGroupAndFieldList, indentorData, subFormArray, productCenter, producntion)
      })
    } else {
      let producntion = element.productionCenters
      this.generateAccordionFormGroupsForProduction(IIIndPartForm, element, addProductionCenterIndex, IIIndPartForm.formGroupAndFieldList, indentorData, subFormArray, null, producntion)
    }

    subFormArray.push({
      indentOfBreederseedId: indentorData?.id,
      agencyDetailId: indentorData?.user?.agency_detail.id,
      dynamicControllerId: index,
      formGroup: newFormGroup,
      productionCenters: IIIndPartForm.formGroupAndFieldList,
      arrayfieldsIIndPartList: bspProformasIVarietyUIFields.map(x => {
        if (!["breeder_seed_quantity", "production_centre_id", "monitoring_team_memebers_count"].includes(x.formControlName)) {
          newFormGroup.controls[x.formControlName].disable();
        }
        return { ...x };
      })
    });

    newFormGroup.controls['add_production_center'].valueChanges.subscribe(newValue => {
      addProductionCenterIndex = addProductionCenterIndex + 1;
      this.generateAccordionFormGroupsForProduction(IIIndPartForm, element, addProductionCenterIndex, IIIndPartForm.formGroupAndFieldList, indentorData, subFormArray, null, element.productionCenters)
      let currentIndentorForm = subFormArray.filter((item) => item.indentOfBreederseedId == indentorData?.id)[0]

      // console.log(productinV,'productionCenters')
      // if (newValue) {
      //   this.IstPartFormGroupControls["cropName"].value['varieties'] = []
      //   let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value;
      //   let crop =this.IstPartFormGroupControls["cropName"].value.value;
      //   let season: any;
      //   if (this.isView || this.isEdit) {
      //     season = this.IstPartFormGroupControls["season"].value.value;
      //   } else {
      //     season = this.IstPartFormGroupControls["season"].value.value;
      //   }
      //   let searchparams = { "search": [{ "columnNameInItemList": "year.value", "value": yearValue }, { "columnNameInItemList": "crop.value", "value": crop }, { "columnNameInItemList": "season.value", "value": season }], "pageSize": -1, userId: this.currentUser.id }



      //   this.breederService.postRequestCreator("get-breeder-seeds-submission-list", null, searchparams).subscribe((data: any) => {
      //     if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows && data.EncryptedResponse.data.rows.length > 0) {

      //       let varieties = this.prdData = data.EncryptedResponse.data.rows;
      //       console.log('varieties', varieties)
      //       let varietyData = varieties.filter(item=>item.variety_id == element.variety_id);
      //       console.log('varietyDatavarietyData',varietyData)
      //       console.log('subFormArray',subFormArray)

      //       let production = varietyData && varietyData[0].productionCenters ? varietyData[0].productionCenters :'';
      //       console.log(production,'productionproduction')
      //       if(production && production.length>0 ){
      //         for (let data in subFormArray) {
      //           for (let item in subFormArray[data].productionCenters) {
      //             for (let val in subFormArray[data].productionCenters[item].formGroup) {
      //               // console.log('val', subFormArray[data].productionCenters[item].formGroup.value.production_centre_id
      //               // )
      //               for (let pals in subFormArray[data].productionCenters[item].arrayfieldsIIndPartList) {
      //                 if (subFormArray[data].productionCenters[item].formGroup.value.production_centre_id && subFormArray[data].productionCenters[item].formGroup.value.production_centre_id.id) {
      //                   if (subFormArray[data].productionCenters[item].arrayfieldsIIndPartList[pals].formControlName == 'production_centre_id') {
      //                     let pal = subFormArray[data].productionCenters[item].arrayfieldsIIndPartList[0].fieldDataList
      //                     console.log(pal)
      //                     if(pal && pal.length>0){

      //                       let productions = pal.filter(x => x.id != subFormArray[data].productionCenters[item].formGroup.value.production_centre_id.id)
      //                       subFormArray[data].productionCenters[item].arrayfieldsIIndPartList[item].fieldDataList = productions
      //                     }else{
      //                       let productions = production.filter(x => x.id != subFormArray[data].productionCenters[item].formGroup.value.production_centre_id.id)
      //                       subFormArray[data].productionCenters[item].arrayfieldsIIndPartList[item].fieldDataList = productions
      //                     }
      //                     // console.log(production, 'productionCenters')

      //                   }

      //                 }


      //               }

      //             }

      //           }
      //         }
      //       }


      //     }
      //     else {
      //       Swal.fire({
      //         icon: 'error',
      //         title: 'Oops',
      //         text: 'No Data Found.',
      //       })
      //     }

      //     this.dataload = true;
      //   })

      // }
      // for (let item in subFormArray[0].productionCenters) {
      //   for (let val in subFormArray[0].productionCenters[item].formGroup) {
      //     // console.log('val', subFormArray[data].productionCenters[item].formGroup.value.production_centre_id
      //     // )
      //     for (let pals in subFormArray[0].productionCenters[item].arrayfieldsIIndPartList) {
      //       if (subFormArray[0].productionCenters[item].formGroup.value.production_centre_id && subFormArray[0].productionCenters[item].formGroup.value.production_centre_id.id) {
      //         if (subFormArray[0].productionCenters[item].arrayfieldsIIndPartList[pals].formControlName == 'production_centre_id') {
      //           let pal = subFormArray[0].productionCenters[item].arrayfieldsIIndPartList[0].fieldDataList
      //           // console.log(pal)
      //           let production = pal.filter(x => x.id != subFormArray[0].productionCenters[item].formGroup.value.production_centre_id.id)
      //           subFormArray[0].productionCenters[item].arrayfieldsIIndPartList[pals].fieldDataList = production
      //           // console.log(production, 'productionCenters')
      //           break;
      //         }

      //       }


      //     }

      //   }

      // }
      // console.log(subFormArray,'subFormArray')
      // console.log(element.productionCenters,'subFormArray')
      currentIndentorForm.productionCenters = IIIndPartForm.formGroupAndFieldList;
      for (let data in currentIndentorForm.productionCenters) {
        for (let pals in subFormArray[0].productionCenters[data].arrayfieldsIIndPartList) {

          if (subFormArray[0].productionCenters[data].arrayfieldsIIndPartList[pals].fieldDataList) {


            if (subFormArray[0].productionCenters[pals].formGroup && subFormArray[0].productionCenters[pals].formGroup.value && subFormArray[0].productionCenters[pals].formGroup.value.production_centre_id && subFormArray[0].productionCenters[pals].formGroup.value.production_centre_id.id) {
              subFormArray[0].productionCenters[data].arrayfieldsIIndPartList[pals].fieldDataList = subFormArray[0].productionCenters[data].arrayfieldsIIndPartList[pals].fieldDataList.filter(item => item.id != subFormArray[0].productionCenters[pals].formGroup.value.production_centre_id.id)
              break;
            }

          }
        }
      }


    })

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
    this.IstPartFormGroupControls["season"].patchValue(data.season);
    this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
  }
  submit() {
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  back() {
    this.router.navigate(['breeder/bsp-proformas/proformas-1s']);
  }

  compare(a, b) {
    if (a.last_nom > b.last_nom) {
      return 1;
    }
    return 0;
  }

  create(params) {
 
    this.breederService.postRequestCreator("add-bsp1", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.router.navigate(['breeder/bsp-proformas/proformas-1s']);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Successfully Save.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.message) {
        Swal.fire({
          title: '<p style="font-size:25px;">BSP Form Has Already Been Filled For This Variety</p>',
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
    this.breederService.postRequestCreator("edit-bsp1", null, params[0]).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.router.navigate(['breeder/bsp-proformas/proformas-1s']);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
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
    let errorMsg = []
    const params = []

    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let season = newValue['season'].value.value
    let crop_code = newValue['cropName'].value.value
    console.log("newValue['cropName'].value",this.varietyData);
    if (this.varietyData && this.varietyData !== undefined && this.varietyData.length > 0) {
      for (let index = 0; index < (this.varietyData[0].length); index++) {
        let variety = this.varietyData[0][index];
        this.varietyData[0][index].formGroupAndFieldList.forEach((element, i) => {

          let indentingQuantity = element.formGroup.controls['indent_quantity'].value
          let form = element.formGroup;
          invalid = form.invalid;
          let formGroupcontrol = form.controls;
          let productionCenter = []

          element.productionCenters.forEach((subElement, j) => {

            let productionData = formData[index].formGroupAndFieldList[i].productionCenters[j].formGroup.value.breeder_seed_quantity;

            invalid = subElement.formGroup.invalid
            let subFormControl = subElement.formGroup.controls;
            let id = this.isEdit ? subElement.agencyDetailId : null;
            if (subFormControl['production_centre_id'].value.id == null || subFormControl['production_centre_id'].value.id == "") {
              errorMsg.push("Production center can't be blank: " + variety['name'])
            }
            if (subFormControl['breeder_seed_quantity'].value == "" || subFormControl['breeder_seed_quantity'].value == null) {
              errorMsg.push("Quantity of breeder seed can't be blank: " + variety['name'])
            }
            if (subFormControl['monitoring_team_memebers_count'].value == null || subFormControl['monitoring_team_memebers_count'].value == "") {
              errorMsg.push("Monitoring team members count can't be blank: " + variety['name'])
            }
            productionCenter.push({
              breeder_seed_quantity: this.isEdit ? productionData : subFormControl['breeder_seed_quantity'].value,
              monitoring_team_memebers_count: subFormControl['monitoring_team_memebers_count'].value,
              production_center_id: subFormControl['production_centre_id'].value.id,
              id: id
            })
          })

          params.push({
            crop_code: crop_code,
            year_of_indent: year,
            season: season,
            agency_detail_id: element.agencyDetailId,
            indent_of_breederseed_id: element.indentOfBreederseedId,
            production_center_details: productionCenter,
            year_of_release: formGroupcontrol['year_of_release'].value,
            variety_id: variety['varietyId'],
            is_active: 1,
            isdraft: 0,
            id: this.submissionId,
            user_id: this.currentUser.id
          });
          let totalproduceQuanity: number = productionCenter.map(a => a.breeder_seed_quantity).reduce(function (a, b) {
            return parseInt(a) + parseInt(b);
          });
          // if (totalproduceQuanity > indentingQuantity){
          //   errorMsg.push(["Total production quantity is more the indenting quantity for variety - " + variety.name])
          // } 
        });
      }
    }

    if (invalid && errorMsg.length > 0) {
      this.dynamicFieldsComponents['last'].showError = true;
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fill all the Required Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    if (errorMsg.length > 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Fill all the Required Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
    } else {
      this.isEdit ? this.update(params) : this.create(params)
    }


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
    let season = newValue['season'].value.value
    let crop_code = newValue['cropName'].value.value
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let variety = newValue['cropName'].value.varieties[0][index]
      newValue['cropName'].value.varieties[0][index].formGroupAndFieldList.forEach((element) => {
        let form = element.formGroup;
        let formGroupcontrol = form.controls;
        let productionCenter = []
        element.productionCenters.forEach((subElement) => {
          let subFormControl = subElement.formGroup.controls;
          let id = this.isEdit ? subElement.agencyDetailId : null;
          productionCenter.push({
            breeder_seed_quantity: subFormControl['breeder_seed_quantity'].value,
            monitoring_team_memebers_count: subFormControl['monitoring_team_memebers_count'].value,
            production_center_id: subFormControl['production_centre_id'].value.id,
            id: id
          })
        })
        params.push({
          crop_code: crop_code,
          year_of_indent: year,
          season: season,
          agency_detail_id: element.agencyDetailId,
          indent_of_breederseed_id: element.indentOfBreederseedId,
          production_center_details: productionCenter,
          year_of_release: formGroupcontrol['year_of_release'].value,
          variety_id: variety['varietyId'],
          is_active: 1,
          isdraft: 1,
          id: this.submissionId ? this.submissionId : null,
          user_id: this.currentUser && this.currentUser.id ? this.currentUser.id : null
        });
      });
    }
    this.isEdit ? this.update(params) : this.create(params)

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
