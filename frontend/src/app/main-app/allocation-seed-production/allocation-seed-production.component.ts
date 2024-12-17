import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { accordionFormGroupAndFieldList, accordionUIDataType, BreederSeedSubmissionNodalUIFields, createCropVarietyData, selectBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { MasterService } from 'src/app/services/master/master.service';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { LoggedInUserInfoService } from 'src/app/services/logged-in-user-info.service';
import { IcarService } from 'src/app/services/icar/icar.service';
import { random } from 'src/app/_helpers/utility';
import Swal from 'sweetalert2';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-allocation-seed-production',
  templateUrl: './allocation-seed-production.component.html',
  styleUrls: ['./allocation-seed-production.component.css']
})
export class AllocationSeedProductionComponent implements OnInit {

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
  submission: boolean;

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

  constructor(activatedRoute: ActivatedRoute, private router: Router, private restService: RestService,
    private masterService: MasterService,
    private indenterService: IndenterService,
    breederSeedSubmissionNodalUIFields: BreederSeedSubmissionNodalUIFields,
    private loggedInUserInfoService: LoggedInUserInfoService,
    private icarService: IcarService,
    private productioncenterService: ProductioncenterService) {

    const params: any = activatedRoute.snapshot.params;
    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;
    this.submission = router.url.indexOf("submission") > 0;
    console.log('submission==', this.submission);
    this.isDraft = router.url.indexOf("edit/draft") > 0;
    if ((this.isEdit || this.isView || this.isDraft)) {
      if (params["year"] === undefined || params["cropcode"] === undefined || params["varietyid"] === undefined) {
        Swal.fire({
          title: '<p style="font-size:25px;">Incomplete parameters received.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {
          this.router.navigate(['/allocation-seed-production-list']);
        })
        return;
      }
      this.editParams = {
        year: parseInt(params["year"]),
        cropCode: params["cropcode"],
        varietyId: parseInt(params["varietyid"])
      }
    }

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    let fields1List = breederSeedSubmissionNodalUIFields.get;
    this.createFormControlsOfAGroup(fields1List, this.IstPartFormGroup);
    this.fieldsList = fields1List;
    this.filterPaginateSearch.itemListPageSize = 10;
  }

  // for both Ist part search and IInd part accordion
  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  ngOnInit(): void {

    if (!this.isEdit && !this.isView) {
      this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
        this.loadVarieties();
      });

      this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
        this.loadVarieties();
      });
    }

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
      this.icarService.postRequestCreator("allocation-seed-production-breeder-list", null, {
        pageSize: -1,
        search: [
          { columnNameInItemList: "year.value", value: this.editParams.year },
          { columnNameInItemList: "crop.value", value: this.editParams.cropCode },
          { columnNameInItemList: "crop_variety.id", value: this.editParams.varietyId }
        ]
      }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          if (data.EncryptedResponse.data.rows.length > 0) {
            let allData = data.EncryptedResponse.data.rows;
            this.patchForm(allData);
          } else {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Not Found.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            }).then(x => {
              this.router.navigate(['/allocation-seed-production-list']);
            })
          }
        }
      });
    }

    // #region debug env
    // if (!this.isEdit || !this.isView) {
    //   setTimeout(() => {
    //     this.IstPartFormGroupControls["yearofIndent"].patchValue({ name: "2022", value: 2022 });
    //     setTimeout(() => {
    //       this.IstPartFormGroupControls["cropName"].patchValue({ name: " BARLEY (JAU) ", value: "A0101" });
    //       this.activeVarietyIndexInAccordion = 0;
    //     }, 300);
    //   }, 500);
    // }
    // #endregion
  }

  loadVarieties() {
    if (this.IstPartFormGroupControls["yearofIndent"].value &&
      this.IstPartFormGroupControls["cropName"].value) {

      this.productioncenterService.postRequestCreator("get-nucleus-seed-availabity-data", {
        search: {
          year: this.IstPartFormGroupControls["yearofIndent"].value["value"],
          crop_code: this.IstPartFormGroupControls["cropName"].value["value"]
        }
      }, null).subscribe((data: any) => {
        let nucleusSeedAvailabilityData = [];
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          nucleusSeedAvailabilityData = data.EncryptedResponse.data.rows;
        }
        let searchData = {
          search: [
            { columnNameInItemList: "year.value", value: this.IstPartFormGroupControls["yearofIndent"].value["value"] },
            { columnNameInItemList: "crop.value", value: this.IstPartFormGroupControls["cropName"].value["value"] }
          ],
          "pageSize": -1
        };

        if (this.editVarietyData && this.editVarietyData.length > 0) {
          searchData.search.push({ columnNameInItemList: "variety_id", value: this.editVarietyData[0].variety_id });
          if (this.isView) {
            let allAgenciesId = this.editVarietyData.map(x => x.agency_id);
            searchData.search.push({ columnNameInItemList: "agencies_id", value: allAgenciesId });
          }
        }

        this.indenterService.postRequestCreator("get-breeder-seeds-submission-list", null, searchData).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
            let IIndPartFormArray: accordionUIDataType[] = [];

            data.EncryptedResponse.data.rows?.forEach((element: any, index: number) => {
              let IIndPartForm: accordionUIDataType = {
                name: element.m_crop_variety && element.m_crop_variety.variety_name,
                varietyId: element.m_crop_variety && element.m_crop_variety.id,
                formGroupAndFieldList: []
              };
              const totalAgencyDetailCount = element.agency_details !== undefined ? element.agency_details.length : 0;
              createCropVarietyData(element, true);

              // if (this.loggedInUserInfoService != undefined)
              //   element.nodalAddressDesignation = this.loggedInUserInfoService.loginInfo.address + " and "
              //     + this.loggedInUserInfoService.loginInfo.designation;

              element.agency_details?.forEach((agencyData, agencyIndex) => {
                // generate app-dynamic-fields id:- generate after index 2 due to static IstPartFormGroup 
                const appDynamicFieldsId = 2 + (index * totalAgencyDetailCount + agencyIndex);
                this.generateAccordionFormGroups(element
                  , appDynamicFieldsId
                  , IIndPartForm.formGroupAndFieldList
                  , agencyData,
                  nucleusSeedAvailabilityData);
              });

              IIndPartFormArray.push(IIndPartForm);
            });

            this.filterPaginateSearch.Init(IIndPartFormArray, this);
            this.initSearchAndPagination();
          }
        });
      });
    }
  }
  generateAccordionFormGroups(element: any, index: number, subFormArray: Array<accordionFormGroupAndFieldList>, agencyData: any,
    nucleusSeedAvailabilityData: any[]) {

    let newFormGroup = new FormGroup<any>([]);
    this.createFormControlsOfAGroup(selectBreederNameNodalUIFields, newFormGroup);

    newFormGroup.controls["indentingAgency"].patchValue(agencyData.agency_name);
    // newFormGroup.controls["indentingQuantity"].patchValue(element?.indent_quantity);
    console.log("agencyData",agencyData)
    console.log("element",element.indent_quantity)
    newFormGroup.controls["indentingQuantity"].patchValue(element?.indent_quantity);

    // newFormGroup.controls["nodalAddressDesignation"].patchValue(element?.nodalAddressDesignation);

    newFormGroup.controls["selectBreederName"].valueChanges.subscribe(newValue => {
      console.log('details=============',newValue);
      newFormGroup.controls["nodalAddressDesignation"].patchValue(newValue.agency_detail?.contact_person_name + (newValue && newValue.agency_detail && newValue.agency_detail.contact_person_designation ? (" and " +newValue.agency_detail.contact_person_designation):'') );
      newFormGroup.controls["address"].patchValue(newValue && newValue.agency_detail && newValue.agency_detail.address ? newValue.agency_detail.address:'' );
    });

    const availableQuantity = nucleusSeedAvailabilityData.filter(x => {
      return x.variety_id == element.variety_id;
    });

    if (availableQuantity && availableQuantity.length > 0)
      newFormGroup.controls["availableNucleusSeed"].patchValue(availableQuantity[0].quantity);
    else
      newFormGroup.controls["availableNucleusSeed"].patchValue("0");

    if ((this.isEdit || this.isView) && this.editVarietyData && this.editVarietyData.length > 0) {
      this.activeVarietyIndexInAccordion = 0;

      this.editVarietyData.forEach(element => {
        if (element.agency_id == agencyData.id) {
          let breederData = this.getBreederData(selectBreederNameNodalUIFields
            .filter(x => x.formControlName == "selectBreederName")[0], element.breeder_id);

          newFormGroup.controls["selectBreederName"].patchValue(breederData);
          newFormGroup.controls["allocateNucleusSeed"].patchValue(element.allocate_nucleus_seed);
        }
      });
    }

    subFormArray.push({
      agencyId: agencyData.id,
      dynamicControllerId: index,
      formGroup: newFormGroup,
      arrayfieldsIIndPartList: selectBreederNameNodalUIFields.map(x => {
        if (!["selectBreederName", "allocateNucleusSeed"].includes(x.formControlName)) {
          newFormGroup.controls[x.formControlName].disable();
        }
        return { ...x };
      })
    });
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

  patchForm(data: any) {
    if (data && data.length > 0) {
      this.editVarietyData = data;
      this.IstPartFormGroupControls["yearofIndent"].patchValue({
        name: data[0].year,
        value: data[0].year
      });
      // data[0].crop["variety"] = [data[0].variety];
      const cropData = {
        name: data[0].m_crop.crop_name,
        value: data[0].crop_code
      };
      this.IstPartFormGroupControls["cropName"].patchValue(cropData);
      this.loadVarieties();
    }
  }

  getDynamicFieldsComponent(id): DynamicFieldsComponent {
    return this.dynamicFieldsComponents.filter(x => x.id == id)[0];
  }

  submit(noRedirectAndIgnoreErrors: boolean = false) {
    this.getDynamicFieldsComponent(1).showError = true;

    if (this.formSuperGroup.invalid) {
      return;
    }
    // const anyInvalidSubFormGroup: Array<accordionFormGroupAndFieldList> = [];
    let filledAccordion: {
      varietyId: number,
      formGroupData: accordionFormGroupAndFieldList
    }[] = [];
    let anyAccordionInvalid = false;
    for (let index = 0; index < this.filterPaginateSearch.itemListInitial.length; index++) {
      const varietyWiseAccordionData: accordionUIDataType = this.filterPaginateSearch.itemListInitial[index];
      for (let subIndex = 0; subIndex < varietyWiseAccordionData.formGroupAndFieldList.length; subIndex++) {
        const formGroupData: accordionFormGroupAndFieldList = varietyWiseAccordionData.formGroupAndFieldList[subIndex];
        if (formGroupData.formGroup.controls["selectBreederName"].value
          // || formGroupData.formGroup.controls["availableNucleusSeed"].value
          || formGroupData.formGroup.controls["allocateNucleusSeed"].value) {
          filledAccordion.push({
            varietyId: varietyWiseAccordionData.varietyId,
            formGroupData: formGroupData
          });
          if (formGroupData.formGroup.invalid) {
            // anyInvalidSubFormGroup.push(formGroupData);
            this.getDynamicFieldsComponent(formGroupData.dynamicControllerId).showError = true;
            anyAccordionInvalid = true;
          }
        }
      }
    }

    if (filledAccordion === undefined || filledAccordion.length < 1 || anyAccordionInvalid) {
      // no accordion is filled so return
      // OR one of the accordion is invalid
      return;
    }

    // if (anyInvalidSubFormGroup !== undefined && anyInvalidSubFormGroup.length > 0) {
    //   anyInvalidSubFormGroup.forEach(x => {
    //     this.getDynamicFieldsComponent(x.dynamicControllerId).showError = true;
    //   })
    //   return;
    // }

    let dataRows = [];
    const year = this.IstPartFormGroupControls["yearofIndent"].value.value;
    const cropCode = this.IstPartFormGroupControls["cropName"].value.value;

    filledAccordion.forEach((element) => {
      console.log('elementelement324',element);
      dataRows.push({
        breeder_id: element.formGroupData.formGroup.controls["selectBreederName"].value.id,
        available_nucleus_seed: parseInt(element.formGroupData.formGroup.controls["availableNucleusSeed"].value),
        crop_code: cropCode,
        variety_id: element.varietyId,
        user_id: 1,
        year: year,
        allocate_nucleus_seed: parseInt(element.formGroupData.formGroup.controls["allocateNucleusSeed"].value),
        id: this.getSavedId(element.formGroupData.agencyId),
        agency_id: element.formGroupData.agencyId
      });
    });

    this.icarService.postRequestCreator("allocation-seed-production-breeder-submission", null, { allocatedVarieties: dataRows }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {
          if (!noRedirectAndIgnoreErrors) {
            this.router.navigate(['/allocation-seed-production-list']);
          }
        })
      }
      else {
        if (!noRedirectAndIgnoreErrors)
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
    if (this.dynamicFieldsComponents[0] !== undefined) {
      this.dynamicFieldsComponents[0].showError = true;
    }
    if (this.formSuperGroup.invalid) {
      return;
    }

    this.router.navigate(['/allocation-seed-production-list']);
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
