import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { formatDate } from '@angular/common';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { bspProformasIVUIFields, bspProformasIVVarietyUIFields, selectNucliousBreederNameNodalUIFields, NoProformasDataFound } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { convertDatetoDDMMYYYYwithdash } from 'src/app/_helpers/utility';

@Component({
  selector: 'app-proformas-iv-form',
  templateUrl: './proformas-iv-form.component.html',
  styleUrls: ['./proformas-iv-form.component.css']
})
export class ProformasIvFormComponent implements OnInit {


  @ViewChildren(DynamicFieldsComponent) dynamicFieldsComponents: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  plantForm!: FormGroup;

  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  isAttachmentPresent: boolean = false;
  currentUser: any = { id: 10, name: "Hello User" };
  currentProductionCenter: any;
  cropName: any = [];
  prdData: any = [];
  bspData: any = [];
  prodCenter: any = [];
  teamMembers: any = [];
  yearOfIndent: any = [];
  seasonData: any = [];
  buttonText = 'Submit'
  dataRow: boolean = false;
  totalIndentQuantity: any;
  disabled = false;

  displayStyle = "none";
  plantData: any;
  actual_quantity: any;
  selected_variety: any;
  selected_formData: any;
  addedPlantData: any;
  isPlantEdit: boolean = false;
  isPlantNew: boolean = true;

  tempPlantObject: any;
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

  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
    private restService: RestService,
    private breederService: BreederService,
    private seedService: SeedServiceService,
    private fb: FormBuilder
  ) {

    this.plantForm = this.fb.group({
      plant_id: ['', [Validators.required]],
      quantity: ['', [Validators.required]]
    });

    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name
    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }
    this.loadProformasDetails();
    this.getCropSeason();
    this.getPlantData();

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    this.createFormControlsOfAGroupSearch(bspProformasIVUIFields, this.IstPartFormGroup);
    this.fieldsList = bspProformasIVUIFields;
    this.filterPaginateSearch.itemListPageSize = 100;
  }

  getPlantData() {

    let object = {
      user_id: this.currentUser.id
    }

    this.plantData = []
    this.breederService.postRequestCreator('get_plants_data_for_bsp4', null, object).subscribe(async (data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach(element => {
          this.plantData.push(element.plant_detail)
        });
      }
    })

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
    years.forEach((x: any, index: number) => {
      var temp = this.getFinancialYear(x.value)
      this.yearOfIndent.push({ value: x.value, name: temp })
    })
    const yearData = this.yearOfIndent.flat();
    // this.fieldsList[0].fieldDataList = yearData.sort((a, b) => b.year - a.year);
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
    this.fieldsList[1].fieldDataList = this.cropName
  }


  loadProformasDetails() {
    this.breederService.getRequestCreatorNew("get-bsp4-proforma?userId=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.currentProductionCenter = data.EncryptedResponse.data
        this.createYearRange(this.currentProductionCenter.year)
        this.getCropName(this.currentProductionCenter.crop_code)
      }
    })
  }

  createFormControlsOfAGroupSearch(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "yearofIndent" || x.formControlName == "cropName")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "yearofIndent" || x.formControlName == "cropName") || x.formControlName == "production_centre_name" || x.formControlName == "breeder_name") {
        newFormControl.disable();
      }
      if (["breeder_seed_produced_actual_quantity", "allocation_bspI_target", "carry_over_seed_quantity", "total_availability", "prodution_surplus_over_BSPI_target"].includes(x.formControlName)) {
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

    if (this.isView || this.isEdit) {
      this.dataload = false;
    } else {
      this.dataload = true;
    }


    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));

    this.breederService.getRequestCreator("getYearDataForBSP4?user_id=" + currentUser.id).subscribe((data: any) => {
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
        this.fieldsList[0].fieldDataList = yrs.sort((a, b) => b.year - a.year);
      }
    })

    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.breederService.getRequestCreator("getSeasonDataForBSP4?year=" + newValue.value + "&user_id=" + currentUser.id).subscribe((data: any) => {
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
              let season = seasons.filter(x => x.value == this.bspData.season)[0]
              this.IstPartFormGroupControls["season"].patchValue(season);
            }
          }
        })
      }

    })

    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {
      if (newValue && newValue.value) {
        let year = this.IstPartFormGroupControls["yearofIndent"].value;
        let season = newValue.value
        console.log(season)
        this.breederService.getRequestCreator("getCropDataForBSP4?year=" + year.value + "&season=" + season + "&user_id=" + currentUser.id).subscribe((data: any) => {
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
            if (this.isView || this.isEdit) {
              let crop = cropGroups.filter(x => x.value == this.bspData.crop_code)[0]
              this.IstPartFormGroupControls["cropName"].patchValue(crop);
            }
          }
        })
      }

    })

    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {

      if (newValue) {
        console.log(newValue)
        this.addedPlantData = [];
        let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value;
        let season = this.IstPartFormGroupControls["season"].value.value

        let crop = newValue.value
        this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
        let IIndPartFormArray: {
          bsp_3_id: string,
          variety_id: string,
          name: string,
          formGroup: FormGroup,
          arrayfieldsIIndPartList: Array<SectionFieldType>
        }[] = [];

        this.dataRow = true;
        this.breederService.getRequestCreator("get-bsp4-variety-list?userId=" + this.currentUser.id + "&cropName=" + crop + "&yearOfIndent=" + yearValue + "&season=" + season, null).subscribe((data: any) => {
          let varieties = this.prdData = data.EncryptedResponse.data;

          if (this.isView || this.isEdit) {
            varieties = this.prdData = this.prdData.filter(x => x.id == this.bspData.bsp_3_id)
          }

          this.totalIndentQuantity = 0;
          varieties?.forEach((element: any, index: number) => {
            let newFormGroup = new FormGroup<any>([]);
            if (element && element?.bsp_2 && element?.bsp_2.bsp_1) {
              this.createFormControlsOfAGroup(bspProformasIVVarietyUIFields, newFormGroup);

              newFormGroup.controls["allocation_bspI_target"].patchValue(element && element.bsp_2 && element.bsp_2.bsp_1.quantity_of_seed_produced ? parseFloat(element?.bsp_2.bsp_1.quantity_of_seed_produced).toFixed(2) : 0);
              newFormGroup.controls["proformaBSPI_sent_date"].patchValue(formatDate(element?.bsp_2.bsp_1.created_at, 'dd-MM-yyyy', "en-US"));
              newFormGroup.controls["proformaBSPII_sent_date"].patchValue(formatDate(element?.bsp_2.created_at, 'dd-MM-yyyy', "en-US"));
              newFormGroup.controls["proformaBSPIII_sent_date"].patchValue(formatDate(element?.created_at, 'dd-MM-yyyy', "en-US"));
              newFormGroup.controls["breeder_seed_produced_actual_quantity"].disable();

              newFormGroup.controls['add_production_center'].valueChanges.subscribe(newValue => {
                if (newValue == 1) {
                  this.openPopup(newFormGroup, element);
                }

              })

              let total_avlty = 0
              newFormGroup.controls["carry_over_seed_quantity"].valueChanges.subscribe(carryAmt => {
                total_avlty = 0;
                total_avlty = parseFloat(newFormGroup.controls["breeder_seed_produced_actual_quantity"].value) + parseFloat(carryAmt);
                console.log(total_avlty)
                total_avlty = Number(total_avlty.toFixed(2));
                console.log(total_avlty)
                newFormGroup.controls["total_availability"].patchValue('' + total_avlty);
              })
              newFormGroup.controls["breeder_seed_produced_actual_quantity"].valueChanges.subscribe(breederAmt => {
                total_avlty = 0;
                total_avlty = (newFormGroup.controls["carry_over_seed_quantity"].value ? parseFloat(newFormGroup.controls["carry_over_seed_quantity"].value) : 0) + parseInt(breederAmt);
                newFormGroup.controls["total_availability"].patchValue('' + total_avlty);
              })

              newFormGroup.controls["total_availability"].valueChanges.subscribe(total => {
                let actualAllocation = element?.bsp_2.bsp_1.quantity_of_seed_produced
                let sufplus = parseFloat(total) - parseFloat(actualAllocation)
                let newsufplus = sufplus > 0 ? sufplus : 0;
                newFormGroup.controls["prodution_surplus_over_BSPI_target"].patchValue(sufplus.toFixed(2) || '');
              })

              newFormGroup.controls["prodution_surplus_over_BSPI_target"].valueChanges.subscribe(value => {
                if (parseFloat(value) > 0) {
                  newFormGroup.controls['deficit_reason'].disable();
                  newFormGroup.controls["deficit_reason"].patchValue('N/A');
                  newFormGroup.controls['document'].disable();
                } else {
                  newFormGroup.controls['deficit_reason'].enable();
                  newFormGroup.controls['document'].enable();
                }
              })

              // newFormGroup.controls["sample_taken_for_seed_testing"].patchValue(element?.bsp_2.bsp_1.quantity_of_seed_produced);
              if (this.isView || this.isEdit) {
                newFormGroup.controls["pd_pc_letter_no"].patchValue(this.bspData.pd_letter_number);
                newFormGroup.controls["breeder_seed_produced_actual_quantity"].patchValue(this.bspData.actual_seed_production);
                newFormGroup.controls["carry_over_seed_quantity"].patchValue(this.bspData.carry_over_seed_amount);
                newFormGroup.controls["carry_over_seed_previous_year_germination"].patchValue(this.bspData.carry_over_last_year_germination);
                newFormGroup.controls["carry_over_seed_current_year_germination"].patchValue(this.bspData.carry_over_current_year_germination);
                newFormGroup.controls["deficit_reason"].patchValue(this.bspData.reason_for_dificit);
                newFormGroup.controls["total_availability"].patchValue(this.bspData.total_availability || 0);
                newFormGroup.controls["sample_taken_for_seed_testing"].patchValue(this.bspData.number_of_sample);

                let object = {
                  year: this.bspData.year,
                  season: this.bspData.season,
                  crop_code: this.bspData.crop_code,
                  bsp4_id: this.bspData.id,
                  variety_id: this.bspData.variety_id,
                  user_id: this.currentUser.id
                }

                this.tempPlantObject = []
                this.breederService.postRequestCreator('plants/getPlantsData', null, object).subscribe((data: any) => {
                  if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
                    this.addedPlantData = data.EncryptedResponse.data
                    this.addedPlantData.forEach(element => {
                      this.tempPlantObject.push(element.id);
                    });
                  }
                })


                if (!this.isView) {

                  newFormGroup.controls["carry_over_breeder_seed_year"].patchValue(
                    {
                      dateRange: null,
                      isRange: false,
                      singleDate: {
                        formatted: this.bspData.production_year,
                        jsDate: new Date(this.bspData.production_year)
                      }
                      // ormatDate(this.bspData.production_year, 'dd-MM-yyyy', "en-US"
                    }
                  );

                  newFormGroup.controls["harvest_date"].patchValue(
                    {
                      dateRange: null,
                      isRange: false,
                      singleDate: {
                        formatted: this.bspData.harvest_date,
                        jsDate: new Date(this.bspData.harvest_date)
                      }
                      // ormatDate(this.bspData.production_year, 'dd-MM-yyyy', "en-US"
                    }
                  );
                }
                else {
                  newFormGroup.controls["carry_over_breeder_seed_year"].patchValue(convertDatetoDDMMYYYYwithdash(this.bspData.production_year));
                  newFormGroup.controls["harvest_date"].patchValue(convertDatetoDDMMYYYYwithdash(this.bspData.harvest_date))

                }
                newFormGroup.controls['document'].patchValue(this.bspData.document)
              }
              IIndPartFormArray.push({
                bsp_3_id: element.id,
                variety_id: element.variety_id,
                name: (element?.m_crop_variety?.variety_name || "ANC"),
                formGroup: newFormGroup,
                arrayfieldsIIndPartList: bspProformasIVVarietyUIFields.map(x => {
                  if (!["sample_taken_for_seed_testing", "deficit_reason", "carry_over_seed_current_year_germination", "carry_over_seed_quantity", "pd_pc_letter_no", "carry_over_breeder_seed_year", "breeder_seed_produced_actual_quantity", "carry_over_seed_previous_year_germination", "document", "harvest_date"].includes(x.formControlName)) {
                    newFormGroup.controls[x.formControlName].disable();
                  }
                  return { ...x };
                })
              });
            } else {
              Swal.fire({
                title: 'OOPS',
                text: 'WE ARE SORRY, SOME DATA IS MISSING..',
                imageUrl: 'https://cdn.dribbble.com/users/308895/screenshots/2598725/no-results.gif',
                showConfirmButton: true
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['breeder/bsp-proformas/proformas-4s']);
                }
              })
            }

            this.totalIndentQuantity = this.totalIndentQuantity + (element.bsp_2.bsp_1.quantity_of_seed_produced ? Number(element.bsp_2.bsp_1.quantity_of_seed_produced) : 0);

          })
          this.IstPartFormGroupControls["cropName"].value['varieties'] = []
          this.IstPartFormGroupControls["cropName"].value['varieties'].push(IIndPartFormArray)
          this.filterPaginateSearch.Init(IIndPartFormArray, this);
          this.initSearchAndPagination();

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
      this.breederService.getRequestCreator('get-bsp4/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.bspData = dataList.EncryptedResponse.data
          this.buttonText = 'Update'
          this.isDraft = data?.isdraft ? true : false;
          this.isAttachmentPresent = dataList.EncryptedResponse.data && dataList.EncryptedResponse.data.document ? true : false;
          let year = this.yearOfIndent.filter(x => x.value == data.year)[0]
          let season = this.seasonData.filter(x => x.value == data.season)[0]
          let crop = this.cropName.filter(x => x.value == data.crop_code)[0]
          let foundData = { year: year, crop: crop, season: season }
          this.patchForm(foundData);
        }
        else {
          Swal.fire({
            title: 'Opps!',
            text: 'No Record Found.',
            imageUrl: 'https://cdn.dribbble.com/users/308895/screenshots/2598725/no-results.gif',
            imageWidth: 400,
            imageHeight: 200,
            showConfirmButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['breeder/bsp-proformas/proformas-4s']);
            }
          })
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
    this.IstPartFormGroupControls["season"].patchValue(data.season);
    this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
  }

  submit() {
  }

  getQuantityMeasure(crop_code) {
    return crop_code.split('')[0] == 'A' ? 'Qt' : 'Kg'
  }

  create(params) {
    this.breederService.postRequestCreator("add-bsp4", null, params).subscribe((data: any) => {
      console.log(data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

        var plant_object = [];
        if (this.addedPlantData) {
          this.addedPlantData.forEach(element => {
            data.EncryptedResponse.data.forEach(data => {
              if (element.variety_id == data.variety_id) {
                let object = element;

                let newValue = this.IstPartFormGroupControls

                object['year'] = Number(newValue['yearofIndent'].value.value);
                object['season'] = String(newValue['season'].value.value);
                object['crop_code'] = String(newValue['cropName'].value.value)
                object['bsp4_id'] = data.id;
                object['quantity'] = parseFloat(element.quantity);
                object['user_id'] = this.currentUser.id

                plant_object.push(object)
              }
            });
          });

          this.breederService.postRequestCreator("create_bsp4_to_plants", null, plant_object).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: data.EncryptedResponse.message,
              })
            }
            this.router.navigate(['breeder/bsp-proformas/proformas-4s']);
          })
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: data.EncryptedResponse.message,
          })
          this.router.navigate(['breeder/bsp-proformas/proformas-4s']);
        }



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

    this.breederService.postRequestCreator("edit-bsp4", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {

        var plant_object = {
          plant_id: this.tempPlantObject,
          plantData: []
        }
        if (this.addedPlantData) {
          this.addedPlantData.forEach(element => {
            if (element.variety_id == this.bspData.variety_id) {

              plant_object.plant_id.push(element.id)
              let object = {}
              let newValue = this.IstPartFormGroupControls

              object['year'] = Number(newValue['yearofIndent'].value.value);
              object['season'] = String(newValue['season'].value.value);
              object['crop_code'] = String(newValue['cropName'].value.value)
              object['bsp4_id'] = this.bspData.id;
              object['plant_id'] = Number(element.plant_id);
              object['quantity'] = String(element.quantity);
              object['variety_id'] = element.variety_id;
              object['user_id'] = this.currentUser.id;

              plant_object['plantData'].push(object)
            }
          });


          this.breederService.postRequestCreator("update_bsp4_to_plants", null, plant_object).subscribe((data: any) => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: data.EncryptedResponse.message,
              })
            }
          })
        }

        this.router.navigate(['breeder/bsp-proformas/proformas-4s']);

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
  get_plant_name(plant) {
    let plt = this.plantData.filter(x => x.id == plant.plant_id)[0]
    return plt.plant_name
  }
  submitForm(formData) {
    let invalid = false;
    const params = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value;
    console.log("adsadsad")
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup'];
      if (varietyForm.invalid) {
        if (varietyForm.value.document == null || varietyForm.value.document == "") {
          invalid = false
        }
        else {
          Swal.fire('Error', 'Please Fill Out all Required Fields.', 'error');
          invalid = true
        }

      }
      let formGroupcontrol = varietyForm.controls
      console.log("formGroupcontrol['breeder_seed_produced_actual_quantity'].value", formGroupcontrol['breeder_seed_produced_actual_quantity'].value)
      if (!formGroupcontrol['breeder_seed_produced_actual_quantity'].value) {
        Swal.fire('Error', 'Please fill out all required fields!', 'error');
        return;
      } else if (!formGroupcontrol['pd_pc_letter_no'].value || !formGroupcontrol['allocation_bspI_target'].value || !formGroupcontrol['breeder_seed_produced_actual_quantity'].value || !formGroupcontrol['carry_over_breeder_seed_year'].value || !formGroupcontrol['carry_over_seed_quantity'].value || !formGroupcontrol['pd_pc_letter_no'].value || !formGroupcontrol['carry_over_seed_previous_year_germination'].value || !formGroupcontrol['carry_over_seed_current_year_germination'].value || !formGroupcontrol['sample_taken_for_seed_testing'].value) {
        this.dynamicFieldsComponents['last'].showError = true;
        
          Swal.fire('Error', 'Please Fill Out all Required Fields.', 'error');
          // invalid = true
        
        return;
      }

      params.push({
        crop_code: crop_code,
        year: year,
        season: season,
        bsp_3_id: newValue['cropName'].value.varieties[0][index]['bsp_3_id'],
        variety_id: newValue['cropName'].value.varieties[0][index]['variety_id'],
        actual_seed_production: formGroupcontrol['breeder_seed_produced_actual_quantity'].value,
        carry_over_current_year_germination: formGroupcontrol['carry_over_seed_current_year_germination'].value,
        carry_over_last_year_germination: formGroupcontrol['carry_over_seed_previous_year_germination'].value,
        carry_over_seed_amount: formGroupcontrol['carry_over_seed_quantity'].value,
        number_of_sample: formGroupcontrol['sample_taken_for_seed_testing'].value,
        pd_letter_number: formGroupcontrol['pd_pc_letter_no'].value,
        production_year: (formGroupcontrol['carry_over_breeder_seed_year'].value.singleDate.jsDate),
        reason_for_dificit: formGroupcontrol['deficit_reason'].value,
        total_availability: formGroupcontrol['total_availability'].value,
        production_surplus: formGroupcontrol['prodution_surplus_over_BSPI_target'].value,
        shor_fall_reason: "N/A",
        short_fall_document: "N/A",
        document: formGroupcontrol['prodution_surplus_over_BSPI_target'].value < 0 ? this.dynamicFieldsComponents['last'].downloadUrl : '',
        production_center_id: this.currentProductionCenter.id,
        is_active: 1,
        isdraft: 0,
        id: this.submissionId,
        user_id: this.currentUser.id,
        harvest_date: (formGroupcontrol['harvest_date'].value.singleDate.jsDate),
      })


    }

    if (invalid) {
      this.dynamicFieldsComponents['last'].showError = true;
      return;
    }
    Swal.fire({
      title: 'Saving...',
      html: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null)
      }
    });
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
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
      let formGroupcontrol = varietyForm.controls
      // let formGroupcontrol = newValue['cropName'].value.varieties[0][index]['formGroup'].controls
      params.push({
        crop_code: crop_code,
        year: year,
        season: season,
        bsp_3_id: newValue['cropName'].value.varieties[0][index]['bsp_3_id'],
        variety_id: newValue['cropName'].value.varieties[0][index]['variety_id'],
        actual_seed_production: formGroupcontrol['breeder_seed_produced_actual_quantity'].value,
        carry_over_current_year_germination: formGroupcontrol['carry_over_seed_current_year_germination'].value,
        carry_over_last_year_germination: formGroupcontrol['carry_over_seed_previous_year_germination'].value,
        carry_over_seed_amount: formGroupcontrol['carry_over_seed_quantity'].value,
        number_of_sample: formGroupcontrol['sample_taken_for_seed_testing'].value,
        pd_letter_number: formGroupcontrol['pd_pc_letter_no'].value,
        production_year: (formGroupcontrol['carry_over_breeder_seed_year'].value.singleDate.jsDate),
        reason_for_dificit: formGroupcontrol['deficit_reason'].value,
        total_availability: formGroupcontrol['total_availability'].value,
        production_surplus: formGroupcontrol['prodution_surplus_over_BSPI_target'].value,
        shor_fall_reason: "N/A",
        short_fall_document: "N/A",
        document: this.dynamicFieldsComponents['last'].downloadUrl,
        production_center_id: this.currentProductionCenter.id,
        is_active: 1,
        isdraft: 1,
        id: this.submissionId,
        user_id: this.currentUser.id
      })
    }

    Swal.fire({
      title: 'Saving...',
      html: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null)
      }
    });
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

  openPopup(newFormGroup: any, element: any) {
    this.selected_formData = newFormGroup;
    this.selected_variety = element;
    this.isPlantNew = true;
    this.isPlantEdit = false;
    this.plantForm.controls['plant_id'].patchValue("");
    this.plantForm.controls['quantity'].reset();
    this.displayStyle = "block";
  }
  closePopup() {
    this.selected_variety = null;
    this.selected_formData = null;

    this.isPlantNew = true;
    this.isPlantEdit = false;

    this.plantForm.controls['plant_id'].patchValue("");
    this.plantForm.controls['quantity'].reset();
    this.displayStyle = "none";
  }

  onSubmitPlantQuantity(formData: any) {
    if (formData.valid) {
      if (this.isPlantNew) {
        let display_quantity = Number(this.selected_formData.controls['breeder_seed_produced_actual_quantity'].value);
        display_quantity = display_quantity + Number(formData.value.quantity);
        this.selected_formData.controls["breeder_seed_produced_actual_quantity"].patchValue(display_quantity);

        let object = {
          variety_id: this.selected_variety.variety_id,
          quantity: Number(formData.value.quantity),
          plant_id: Number(formData.value.plant_id)
        }

        if (this.addedPlantData && this.addedPlantData.length > 0) {
          let found = false;
          this.addedPlantData.forEach(element => {
            if (element.variety_id == this.selected_variety.variety_id && element.plant_id == Number(formData.value.plant_id)) {
              found = true;
              element.quantity = element.quantity + formData.value.quantity;
            }
          });

          if (found == false) {
            this.addedPlantData.push(object)
          }
        } else {
          this.addedPlantData.push(object);
        }
      }
      else if (this.isPlantEdit) {
        let displayQuantity = 0;
        this.addedPlantData.forEach(element => {
          if (this.selected_variety.variety_id == element.variety_id && element.plant_id == formData.value.plant_id) {
            element.quantity = formData.value.quantity;
          }

          if (this.selected_variety.variety_id == element.variety_id) {
            displayQuantity = displayQuantity + element.quantity;
          }
        });

        this.selected_formData.controls["breeder_seed_produced_actual_quantity"].patchValue(displayQuantity);
      }
      this.closePopup();
    }
  }

  onEditPlantData(formGroup: any, element: any, plant: any) {
    this.displayStyle = "block";
    this.selected_formData = formGroup;
    this.selected_variety = element;

    this.isPlantNew = false;
    this.isPlantEdit = true;

    this.plantForm.controls['plant_id'].patchValue(plant.plant_id);
    this.plantForm.controls['quantity'].patchValue(plant.quantity);

  }

  onRemovePlantData(formGroup: any, element: any, index: any) {
    this.addedPlantData.splice(index, 1);
    this.selected_formData = formGroup;
    this.selected_variety = element;

    let displayQuantity = 0;
    this.addedPlantData.forEach(data => {
      if (data.variety_id == this.selected_variety.variety_id) {
        displayQuantity = displayQuantity + data.quantity
      }
    });
    this.selected_formData.controls["breeder_seed_produced_actual_quantity"].patchValue(displayQuantity);
  }

  isEnterQuantity(e: any) {
    if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 45 && e.keyCode < 58) || e.keyCode == 8)) {
      return false;
    }

    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = e.target.value + String.fromCharCode(e.charCode);

    if (!reg.test(input)) {
      e.preventDefault();
    }

  }


}
