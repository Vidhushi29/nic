import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { formatDate } from '@angular/common';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { bspProformasVUIFields, bspProformasVVarietyUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proformas-v-form',
  templateUrl: './proformas-v-form.component.html',
  styleUrls: ['./proformas-v-form.component.css']
})
export class ProformasVFormComponent implements OnInit {

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
  prdData: any = [];
  bspData: any = [];
  prodCenter: any = [];
  teamMembers: any = [];
  yearOfIndent: any = [];
  seasonData: any = [];
  buttonText = 'Submit'

  dataRow: boolean = false;
  totalIndentQuantity: any;

  dataload: boolean = true;

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
    this.loadBSP4ProformasDetails();
    this.getCropSeason();

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

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
  }

  createYearRange(years): void {
    years.forEach((x: any, index: number) => {
      var temp = this.getFinancialYear(x.value)
      this.yearOfIndent.push({ value: x.value, name: temp })
    })
    // this.fieldsList[0].fieldDataList = this.yearOfIndent.flat();
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


  loadBSP4ProformasDetails() {
    this.breederService.getRequestCreatorNew("get-bsp5a-proforma?userId=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.currentProductionCenter = data.EncryptedResponse.data
        this.createYearRange(this.currentProductionCenter.year)
        this.getCropName(this.currentProductionCenter.crop_code)
        // this.IstPartFormGroup.controls['production_centre_name'].patchValue(this.currentProductionCenter['agency_detail']['agency_name'])
      }
    })
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
      this.dataload = false
    } else {
      this.dataload = true;
    }

    this.breederService.getRequestCreator("getYearDataForBSP5a?user_id=" + this.currentUser.id).subscribe((data: any) => {
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
        this.breederService.getRequestCreator("getSeasonDataForBSP5a?year=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          if (data.EncryptedResponse.data) {
            let seasons = []
            data.EncryptedResponse.data.forEach(element => {
              if (element.season && element['m_season.season'] && element['m_season.season'].length > 0) {
                let temp = {
                  name: element['m_season.season'],
                  value: element['season']
                }
                seasons.push(temp);
              }
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
      if (newValue) {
        let year = this.IstPartFormGroupControls["yearofIndent"].value;
        let season = newValue.value

        this.breederService.getRequestCreator("getCropDataForBSP5a?year=" + year.value + "&season=" + season + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
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
        let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value;
        let season = this.IstPartFormGroupControls["season"].value.value;

        let crop = newValue.value
        this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
        let IIndPartFormArray: {
          bsp_4_id: string,
          variety_id: string,
          name: string,
          formGroup: FormGroup,
          arrayfieldsIIndPartList: Array<SectionFieldType>
        }[] = [];

        this.dataRow = true;
        this.breederService.getRequestCreator("get-bsp5a-variety-list?userId=" + this.currentUser.id + "&cropName=" + crop + "&yearOfIndent=" + yearValue + "&season=" + season, null).subscribe((data: any) => {
          let varieties = this.prdData = data.EncryptedResponse.data;
          if (this.isView || this.isEdit) {
            varieties = this.prdData = this.prdData.filter(x => x.id == this.bspData.bsp_4_id)
          }
          this.totalIndentQuantity = 0;
          varieties?.forEach((element: any, index: number) => {
            let newFormGroup = new FormGroup<any>([]);
            this.createFormControlsOfAGroup(bspProformasVVarietyUIFields, newFormGroup);
            if (element && element?.bsp_3 && element?.bsp_3.bsp_2 && element?.bsp_3.bsp_2.bsp_1) {
              newFormGroup.controls["area_sown"].patchValue(element?.bsp_3.bsp_2.area);
              newFormGroup.controls["field_location"].patchValue(element?.bsp_3.bsp_2.field_location);
              newFormGroup.controls["no_of_sample"].patchValue(element?.number_of_sample);
              newFormGroup.controls["grow_date_of_bsp1"].patchValue(formatDate(element?.bsp_3.bsp_2.bsp_1.created_at, 'dd-MM-yyyy', "en-US"));
              newFormGroup.controls["grow_date_of_bsp2"].patchValue(formatDate(element?.bsp_3.bsp_2.created_at, 'dd-MM-yyyy', "en-US"));
              newFormGroup.controls["grow_date_of_bsp3"].patchValue(formatDate(element?.bsp_3.created_at, 'dd-MM-yyyy', "en-US"));
              newFormGroup.controls["grow_date_of_bsp4"].patchValue(formatDate(element?.created_at, 'dd-MM-yyyy', "en-US"));
              if (this.isView || this.isEdit) {
                newFormGroup.controls["generic_purity"].patchValue(this.bspData.genetic_purity);
              }
              IIndPartFormArray.push({
                bsp_4_id: element.id,
                variety_id: element.variety_id,
                name: (element?.bsp_3?.m_crop_variety?.variety_name || "1"),
                formGroup: newFormGroup,
                arrayfieldsIIndPartList: bspProformasVVarietyUIFields.map(x => {
                  if (!["generic_purity"].includes(x.formControlName)) {
                    newFormGroup.controls[x.formControlName].disable();
                  }
                  return { ...x };
                })
              });
              console.log(element)
              this.totalIndentQuantity = this.totalIndentQuantity + (element.bsp_3.bsp_2.bsp_1.indent_of_breederseed.indent_quantity)
            } else {
              Swal.fire({
                title: 'OOPS',
                text: 'WE ARE SORRY, DATA IS MISSING.',
                imageUrl: 'https://cdn.dribbble.com/users/308895/screenshots/2598725/no-results.gif',
                imageWidth: 400,
                imageHeight: 200,
                showConfirmButton: true
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['breeder/bsp-proformas/proformas-5s-a']);
                }
              })
            }
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
      this.breederService.getRequestCreator('get-bsp5a/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.bspData = dataList.EncryptedResponse.data
          this.buttonText = 'Update'
          this.isDraft = data?.isdraft ? true : false;
          let year = this.yearOfIndent.filter(x => x.value == data.year)[0]
          let crop = this.cropName.filter(x => x.value == data.crop_code)[0]
          let season = this.seasonData.filter(x => x.value == data.season)[0]
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
              this.router.navigate(['breeder/bsp-proformas/proformas-5s-a']);
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

  // getDynamicFieldsComponent(id): DynamicFieldsComponent {
  // return this.dynamicFieldsComponents.filter(x => x.id == id)[0];
  // }
  getQuantityMeasure(crop_code) {
    return crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
  }
  submit() {
  }

  create(params) {
    this.breederService.postRequestCreator("add-bsp5a", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.router.navigate(['breeder/bsp-proformas/proformas-5s-a']);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
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
    this.breederService.postRequestCreator("edit-bsp5a", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.router.navigate(['breeder/bsp-proformas/proformas-5s-a']);
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
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
      if (varietyForm.invalid) {
        invalid = true
        Swal.fire('Error', 'Please Fill Out all Required Fields.', 'error');
      }
      let formGroupcontrol = varietyForm.controls
      params.push({
        crop_code: crop_code,
        year: year,
        season: season,
        bsp_4_id: newValue['cropName'].value.varieties[0][index]['bsp_4_id'],
        variety_id: newValue['cropName'].value.varieties[0][index]['variety_id'],
        genetic_purity: formGroupcontrol['generic_purity'].value,
        production_center_id: this.currentProductionCenter.id,
        is_active: 1,
        id: this.submissionId,
        user_id: this.currentUser.id
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
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
      let formGroupcontrol = varietyForm.controls
      params.push({
        crop_code: crop_code,
        year: year,
        season: season,
        bsp_4_id: newValue['cropName'].value.varieties[0][index]['bsp_4_id'],
        variety_id: newValue['cropName'].value.varieties[0][index]['variety_id'],
        genetic_purity: formGroupcontrol['generic_purity'].value,
        production_center_id: this.currentProductionCenter.id,
        is_active: 1,
        isdraft: 1,
        id: this.submissionId,
        user_id: this.currentUser.id
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
