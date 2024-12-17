import { Component, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { AllocationBreederSeedIndentorLiftingFields, AllocationBreederSeedIndentorUIFields } from 'src/app/common/data/ui-field-data/seed-division-fields';
import { bspProformasVVarietyUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { bspProformasVIFields, bspProformasViVarietyUIFields, selectNucliousBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proformas-vi-form',
  templateUrl: './proformas-vi-form.component.html',
  styleUrls: ['./proformas-vi-form.component.css']
})
export class ProformasViFormComponent implements OnInit {

  @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: DynamicFieldsComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;

  memberModal: boolean = false;
  membersData: Array<any> = [];
  currentUser: any;
  currentProductionCenter: any;
  cropName: any = [];
  prdData: any = [];
  bspData: any = [];
  prodCenter: any = [];
  teamMembers: any = [];
  yearOfIndent: any = [];
  minTeamMembers: any = 1;
  seasonData: any = [];
  buttonText = 'Submit'
  

  dataRow: boolean = false;
  totalIndentQuantity: any;
  seasonList;

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

  constructor(activatedRoute: ActivatedRoute, private router: Router, private restService: RestService, private breederService: BreederService,) {

    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));

    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    this.createFormControlsOfAGroupDup(bspProformasVIFields, this.IstPartFormGroup);
    this.fieldsList = bspProformasVIFields;
    this.filterPaginateSearch.itemListPageSize = 100;

    this.loadPerforma();

  }

  createFormControlsOfAGroupDup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "production_centre_name" || x.formControlName == "yearofIndent" || x.formControlName == "cropName")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent") || x.formControlName == "production_centre_name") {
        newFormControl.disable();
      }
      if (["TargetOfFoundationSeedProduction", "indentingQuantity", "allocationOfBreederSeedToIndentoeForLifting", "ActualProductionOnAsPerBSP4", "QuantityOfBreederSeedAllotted", "QuantityOfBreederSeedLifted", "QuantityOfBreederSeedBalance"].includes(x.formControlName)) {
        let name = x.fieldName.split("(")[0]
        x.fieldName = name + " (" + this.getQuantityMeasure(crop_code) + ")"
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createYearRange(years): void {
    this.yearOfIndent = [
      { name: "2020-21", "value": 2020 },
      { name: "2021-22", "value": 2021 },
      { name: "2022-23", "value": 2022 },
      { name: "2023-24", "value": 2023 },
      { name: "2024-25", "value": 2024 },
      { name: "2025-26", "value": 2025 },
      { name: "2026-27", "value": 2026 }
    ]
    let yrs = []
    years.forEach((x: any, index: number) => {
      yrs.push(this.yearOfIndent.filter(y => y.value == x.value))
    })
    // this.fieldsList[0].fieldDataList = yrs.flat();
  }

  getCropName(crops) {
    crops.forEach((x: any, index: number) => {
      let crop = x
      // console.log(crop['name'])
      // console.log(crop['value'])
      if (crop != null) {
        x["name"] = crop['name'];
        x["value"] = crop['value'];
        this.cropName.push(x);
        
        this.cropName = this.cropName.sort((a, b) => a.m_crop.crop_name.localeCompare(b.m_crop.crop_name ))
      }
      
    });
    // this.fieldsList[1].fieldDataList = this.cropName
  }

  loadPerforma() {
    this.breederService.getRequestCreatorNew("get-bsp6-proforma?userId=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.currentProductionCenter = data.EncryptedResponse.data
        console.log(this.currentProductionCenter)
        this.createYearRange(this.currentProductionCenter.year)
        this.getCropName(this.currentProductionCenter.crop_code)
      }
    })
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

    this.breederService.getRequestCreator("getYearDataForBSP6").subscribe((data: any) => {
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
      this.breederService.getRequestCreator("getSeasonDataForBSP6?year=" + newValue.value).subscribe((data: any) => {
        if (data.EncryptedResponse.data) {
          let seasons = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['m_season.season'],
              value: element['season']
            }
            seasons.push(temp);
            this.seasonList = seasons
          });
          
          this.fieldsList[1].fieldDataList = seasons;
        }
      })
    })

    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {

      let year = this.IstPartFormGroupControls["yearofIndent"].value;
      let season = newValue.value

      this.breederService.getRequestCreator("getCropDataForBSP6?year=" + year.value + "&season=" + season).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data !== undefined && data.EncryptedResponse.data.length > 0) {
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
    })

    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value;
      let season = this.IstPartFormGroupControls["season"].value.value

      let crop = newValue.value
      this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
      let IIndPartFormArray: {
        allocation_to_indentor_id: string,
        variety_id: string,
        name: string,
        formGroup: FormGroup,
        arrayfieldsIIndPartList: Array<SectionFieldType>
      }[] = [];

      this.dataRow = true;
      this.totalIndentQuantity = 0;
      this.breederService.getRequestCreator("get-bsp6-variety-list?userId=" + this.currentUser.id + "&cropName=" + crop + "&yearOfIndent=" + yearValue+"&season="+season, null).subscribe((data: any) => {
        let varieties = this.prdData = data.EncryptedResponse.data;
        console.log('varieties===',varieties);
        console.log("BSP6 form varieties:", data)
        if (this.isView || this.isEdit) {
          varieties = this.prdData = this.prdData.filter(x => x.id == this.bspData.allocation_to_indentor_id)
        }
        varieties?.forEach((element: any, index: number) => {
          let newFormGroup = new FormGroup<any>([]);
          this.createFormControlsOfAGroup(bspProformasViVarietyUIFields, newFormGroup);

          newFormGroup.controls["indentingQuantity"].patchValue( (element?.totalIndentQuantity==0)? '0':element?.totalIndentQuantity.toFixed(2) );
          newFormGroup.controls["allocationOfBreederSeedToIndentoeForLifting"].patchValue(element && element?.quantity ? element?.quantity.toFixed(2) :'0');
          newFormGroup.controls["ActualProductionOnAsPerBSP4"].patchValue((element?.actualProduction==0)? '0':element?.actualProduction);
          newFormGroup.controls["QuantityOfBreederSeedAllotted"].patchValue(element?.quantityAlloted);
          newFormGroup.controls["QuantityOfBreederSeedLifted"].patchValue('' + element?.quantityBreederLifted.toFixed(2));
          newFormGroup.controls["QuantityOfBreederSeedBalance"].patchValue((element?.quantityBreederBalance==0)? '0':element?.quantityBreederBalance.toFixed(2));
          
          if (this.isView || this.isEdit) {
            newFormGroup.controls["TargetOfFoundationSeedProduction"].patchValue('' + this.bspData.target.toFixed(2));
            newFormGroup.controls["NameAndAddressOfFoundationSeedProducer"].patchValue(this.bspData.address);
          }

          this.totalIndentQuantity = this.totalIndentQuantity + (element.totalIndentQuantity ? parseFloat(element.totalIndentQuantity.toFixed(2)) : 0);

          IIndPartFormArray.push({
            allocation_to_indentor_id: element.id,
            variety_id: element.variety_id,
            name: element.m_crop_variety.variety_name,
            formGroup: newFormGroup,
            arrayfieldsIIndPartList: bspProformasViVarietyUIFields.map(x => {
              if (!["TargetOfFoundationSeedProduction", "NameAndAddressOfFoundationSeedProducer"].includes(x.formControlName)) {
                newFormGroup.controls[x.formControlName].disable();
              }
              return { ...x };
            })
          });
          console.log("form", this.IstPartFormGroupControls)
        })
        this.IstPartFormGroupControls["cropName"].value['varieties'] = []
        this.IstPartFormGroupControls["cropName"].value['varieties'].push(IIndPartFormArray)
        this.filterPaginateSearch.Init(IIndPartFormArray, this);
        this.initSearchAndPagination();
        console.log(this.IstPartFormGroup)
      })
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
      this.breederService.getRequestCreator('get-bsp6/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.bspData = dataList.EncryptedResponse.data
          this.isDraft = data?.isdraft ? true : false;
          this.buttonText = 'Update'
          console.log("view data:", dataList.EncryptedResponse.data)
          this.teamMembers = this.bspData.monitoring_teams;
          let year = this.yearOfIndent.filter(x => x.value == data.year)[0]
          console.log('year======================>',year)
          let crop = this.cropName.filter(x => x.value == data.crop_code)[0]
          this.IstPartFormGroupControls["season"].patchValue(
            {
              name:data.season=='K'?'Kharif':data.season=='R'?'Rabi':'Other',
              value:data.season
            
            }
          );
          let foundData = { year: year, crop: crop }
        
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
    console.log('data',data)
    this.IstPartFormGroupControls["yearofIndent"].patchValue(data.year);
    this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
  }

  submit() {
  }

  getQuantityMeasure(crop_code) {
    return crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
  }

  create(params) {
    this.breederService.postRequestCreator("add-bsp6", null, params).subscribe((data: any) => {
      console.log("after create sub:", data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
                showCancelButton: false,
                confirmButtonColor: '#E97E15'
        })
        this.router.navigate(['seed-division/bsp-proformas-6s']);
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
    this.breederService.postRequestCreator("edit-bsp6", null, params).subscribe((data: any) => {
      console.log("after update sub:", data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
            confirmButtonColor:'#E97E15',
        })
        this.router.navigate(['seed-division/bsp-proformas-6s']);
      } else {
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
    console.log(this.IstPartFormGroupControls)
    const params = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      // let formGroupcontrol = newValue['cropName'].value.varieties[0][index]['formGroup'].controls
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
      if (varietyForm.invalid) {
        Swal.fire('Error', 'Please fill out all required fields!', 'error');
        return;
      }
      let formGroupcontrol = varietyForm.controls
      params.push({
        "address": formGroupcontrol['NameAndAddressOfFoundationSeedProducer'].value,
        "target": formGroupcontrol['TargetOfFoundationSeedProduction'].value,
        "allocation_to_indentor_id": newValue['cropName'].value.varieties[0][index]['allocation_to_indentor_id'],
        "variety_id": newValue['cropName'].value.varieties[0][index]['variety_id'],
        "id": this.submissionId,
        "year": year,
        "season": season,
        "crop_code": crop_code,
        "is_active": 1,
        "user_id": this.currentUser.id
      })
    }
    this.isEdit ? this.update(params[0]) : this.create(params)
  }



  saveAndNavigate() {
    if (this.filterPaginateSearch.itemListTotalPage > this.filterPaginateSearch.itemListCurrentPage) {
      this.filterPaginateSearch.navigate("next");
    }
  }

  saveAsDraft() {
    console.log(this.IstPartFormGroupControls)
    const params = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      // let formGroupcontrol = newValue['cropName'].value.varieties[0][index]['formGroup'].controls
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
      let formGroupcontrol = varietyForm.controls
      params.push({
        "address": formGroupcontrol['NameAndAddressOfFoundationSeedProducer'].value,
        "target": formGroupcontrol['TargetOfFoundationSeedProduction'].value,
        "allocation_to_indentor_id": newValue['cropName'].value.varieties[0][index]['allocation_to_indentor_id'],
        "variety_id": newValue['cropName'].value.varieties[0][index]['variety_id'],
        "id": this.submissionId,
        "year": year,
        "season": season,
        "crop_code": crop_code,
        "is_active": 1,
        "isdraft": 1,
        "user_id": this.currentUser.id
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

  onAddMember() {
    this.memberModal = !this.memberModal
  }

  submitMemberForm(formData: NgForm) {
    formData.value['crop_code'] = this.IstPartFormGroupControls['cropName'].value.value
    formData.value['user_id'] = 10,
      formData.value['is_active'] = 1,
      this.teamMembers.push(formData.value)
    formData['form'].reset()
    this.memberModal = !this.memberModal
  }

  deleteMember(id: any) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure to Delete This Team Member? '",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.breederService
          .postRequestCreator("delete-monitoring-team/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.teamMembers = this.teamMembers.filter(x => x.id != id)
            }
          });
      }
    })
  }

  editMember() {

  }

}
