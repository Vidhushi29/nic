import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { nucliousbreederSeedSubmissionNodalUIFields, selectNucliousBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import Swal from 'sweetalert2';
import { IcarService } from 'src/app/services/icar/icar.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { createCropVarietyData } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-lot-number',
  templateUrl: './lot-number.component.html',
  styleUrls: ['./lot-number.component.css']
})
export class LotNumberComponent implements OnInit {

  @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  editVarietyData: any;
  noRedirectAndIgnoreErrors: boolean = false
  loggedInUserInfoService: any;
  isSearched: boolean = false;
  contactPersonName: any;
  contactPersonDesignation: any;
  btn_name: string;
  title: string;
  yearOfIndent: any = [];
  todayDate = new Date();
  cropName: any;

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
    private icarService: IcarService,
    private router: Router,
    private indenterService: IndenterService,
    private restService: RestService,
    private _service: ProductioncenterService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private nucliousbreederSeedSubmissionNodalUIFields: nucliousbreederSeedSubmissionNodalUIFields) {

    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

    if (this.isEdit) {
      this.btn_name = 'Update';
      this.title = 'Update';
    } else if (this.isView) {
      this.title = 'View';
    } else if (!this.isEdit && !this.isView) {
      this.title = 'Add';
    } else {
      this.btn_name = 'Submit';
    }

    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    // this.createFormControlsOfAGroup(nucliousbreederSeedSubmissionNodalUIFields.get, this.IstPartFormGroup);
    this.fieldsList = nucliousbreederSeedSubmissionNodalUIFields.get;
    this.filterPaginateSearch.itemListPageSize = 10;
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.formSuperGroup = this.fb.group({
      crop_code: new FormControl(''),
      year: new FormControl(''),
      search: new FormControl(''),
    });
  }

  // createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
  //   fieldsToUse.forEach(x => {
  //     const newFormControl = new FormControl("", x.validations);
  //     console.log("x.formControlName-----", x.formControlName)
  //     if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent" || x.formControlName == "Contact_Officer_Address_and_Designation" || x.formControlName == "breader_production_name")) {
  //       newFormControl.disable();
  //     }
  //     formGroup.addControl(x.formControlName, newFormControl);
  //   });
  // }

  ngOnInit(): void {
    this.getCropName();
    // this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
    //   this.loadVarieties();
    // });

    // this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
    //   this.loadVarieties();
    // });

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
      this._service.postRequestCreator("get-nucleus-seed-availabity-data", {
        search: [
          { columnNameInItemList: "id", value: this.submissionId }
        ]
      }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let allData = data.EncryptedResponse.data.rows;
          console.log('alltype===========', allData);
          this.patchForm(allData);
        }
      });
    }
    if (!this.submissionId) {
      this.getUserData();
    }
    this.createYearRange(1990, this.todayDate.getFullYear());

  }

  createYearRange(start: number, end: number): void {
    if (start <= end) {
      this.yearOfIndent.push({ name: start + "", value: start });
      this.yearOfIndent.sort((a, b) => b.value - a.value);
      this.createYearRange(start + 1, end);
    }
  }

  async getCropName() {
    this.masterService.getRequestCreatorNew("get-crop-list").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.cropName = data.EncryptedResponse.data;
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

  patchForm(data: any) {
    console.log("data", data[0].year)
    // if (data && data.length > 0) {
    //   this.IstPartFormGroupControls["yearofIndent"].patchValue(data[0].year);
    //   this.IstPartFormGroupControls["cropName"].patchValue(data[0].crop_code);
    //   this.IstPartFormGroupControls["breader_production_name"].patchValue(data[0].breeder_production_centre_name?data[0].breeder_production_centre_name:"Breeder Production Centre Name");
    //   this.IstPartFormGroupControls["Contact_Officer_Address_and_Designation"].patchValue(data[0].contact_officer_designation?data[0].contact_officer_designation:'Contact Officer Details');
    // }
  }

  getDynamicFieldsComponent(id): DynamicFieldsComponent {
    return this.dynamicFieldsComponent.filter(x => x.id == id)[0];
  }

  submitForm(formData) {
    console.log('form data', formData);
    let dataRows = [];
    // const year = this.IstPartFormGroupControls["yearofIndent"].value;
    // const cropCode = this.IstPartFormGroupControls["cropName"].value;
    // const breaderProductionName = this.IstPartFormGroupControls["breader_production_name"].value;
    // const contactOfficerDesignation = this.IstPartFormGroupControls["Contact_Officer_Address_and_Designation"].value;
    this.filterPaginateSearch.itemListInitial.forEach(element => {
      dataRows.push({
        reference_no_of_office: element.formGroup.controls["reference_no_of_office"].value,
        // crop_code: cropCode,
        // variety_id: element.varietyId,
        // year: year,
        // breader_production_center_name: breaderProductionName,
        // contact_Officer_designation: contactOfficerDesignation,
        // is_active: 1,
        officer_order_date: element.formGroup.controls["date_of_office_order"].value,
        date_of_reference: element.formGroup.controls["date_of_reference"].value,
        refernce_number_moa: element.formGroup.controls["reference_no"].value,
        quantity_of_nucleus_seed: element.formGroup.controls["quantity_of_nucleus_seed"].value,
        contact_person_name: this.contactPersonName ? this.contactPersonName : '',
        // id: this.editVarietyData?.id
      });
    });

    this._service.postRequestCreator("nucleus-seed-availabity-data-submission", { nucleusSeed: dataRows }, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {
          this.router.navigate(['/nucleus-seed-availability-by-breeder']);

        })
      }

    });
  }

  getUserData() {
    // let route = "get-user-data"
    // this._service.postRequestCreator(route, null, null).subscribe((data: any) => {
    //   this.contactPersonName = data.EncryptedResponse.data.agency_detail.contact_person_name;
    //   this.contactPersonDesignation = data.EncryptedResponse.data.agency_detail.contact_person_designation;
    //   this.IstPartFormGroupControls["breader_production_name"].setValue( this.contactPersonName? this.contactPersonName:'Breeder Production Centre');
    //   this.IstPartFormGroupControls["Contact_Officer_Address_and_Designation"].setValue((this.contactPersonDesignation ? this.contactPersonDesignation :'NA'));
    //   this.IstPartFormGroupControls["breader_production_name"].disable();
    //   this.IstPartFormGroupControls["Contact_Officer_Address_and_Designation"].disable();
    // });
  }

  // loadVarieties() {
  //   if (this.IstPartFormGroupControls["yearofIndent"].value &&
  //     this.IstPartFormGroupControls["cropName"].value) {

  //     let searchData = {
  //       search: [
  //         { columnNameInItemList: "year.value", value: this.IstPartFormGroupControls["yearofIndent"].value["value"] },
  //         { columnNameInItemList: "crop.value", value: this.IstPartFormGroupControls["cropName"].value["value"] }
  //       ],
  //       "pageSize": -1
  //     };

  //     if (this.editVarietyData) {
  //       searchData.search.push({ columnNameInItemList: "variety_id", value: this.editVarietyData?.variety_id });
  //     }
  //     this._service.postRequestCreator("get-breeder-seed-variety", null, searchData).subscribe((data: any) => {
  //       if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
  //         this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
  //         let IIndPartFormArray: {
  //           name: string,
  //           varietyId: number,
  //           formGroup: FormGroup,
  //           arrayfieldsIIndPartList: Array<SectionFieldType>
  //         }[] = [];

  //         data.EncryptedResponse.data.rows?.forEach((element: any, index: number) => {
  //           createCropVarietyData(element, true);

  //           if (this.loggedInUserInfoService != undefined)
  //             element.nodalAddressDesignation = this.loggedInUserInfoService.loginInfo.address + " and "
  //               + this.loggedInUserInfoService.loginInfo.designation;

  //           let newFormGroup = new FormGroup<any>([]); 
  //           this.createFormControlsOfAGroup(selectNucliousBreederNameNodalUIFields, newFormGroup);
  //           console.log("elementelement", element)

  //           // newFormGroup.controls["quantity_of_nucleus_seed"].patchValue(element?.agency_details[0].agency_name);
  //           newFormGroup.controls["reference_no"].patchValue(element?.refernce_number_moa);
  //           newFormGroup.controls["reference_no_of_office"].patchValue(element?.reference_number_officer_order);
  //           newFormGroup.controls["date_of_office_order"].patchValue(element?.officer_order_date);
  //           newFormGroup.controls["quantity_of_nucleus_seed"].patchValue(element?.quantity);
  //           newFormGroup.controls["date_of_reference"].patchValue(element?.date_of_reference);

  //           IIndPartFormArray.push({
  //             name: element.m_crop_variety && element.m_crop_variety.variety_name,
  //             varietyId: element.m_crop_variety && element.m_crop_variety.id,
  //             formGroup: newFormGroup,
  //             arrayfieldsIIndPartList: selectNucliousBreederNameNodalUIFields.map(x => {
  //               if (!["selectBreederName", "availableNucleusSeed", "allocateNucleusSeed"].includes(x.formControlName)) {
  //                 // newFormGroup.controls[x.formControlName].disable();
  //               }
  //               return { ...x };
  //             })
  //           });
  //         });

  //         this.filterPaginateSearch.Init(IIndPartFormArray, this);

  //         this.initSearchAndPagination();
  //       }
  //     });
  //   }
  // }
  getBreederData(selectBreederNameFieldInfo: SectionFieldType, breeder_id: any) {
    let breederInfo = selectBreederNameFieldInfo.fieldDataList.filter(x => x.value == breeder_id);
    if (breederInfo && breederInfo.length > 0) {
      return {
        name: breederInfo[0].name,
        value: this.editVarietyData.breeder_id
      };
    }
    else {
      return selectBreederNameFieldInfo.fieldDataList[0];
    }
  }
  saveAndNavigate() {
    if (this.filterPaginateSearch.itemListTotalPage > this.filterPaginateSearch.itemListCurrentPage) {
      this.filterPaginateSearch.navigate("next");
    }
  }

  saveAsDraft() {
    if (this.dynamicFieldsComponent[0] !== undefined) {
      this.dynamicFieldsComponent[0].showError = true;
    }
    if (this.formSuperGroup.invalid) {
      return;
    }

    this.router.navigate(['/nucleus-seed-availability-by-breeder']);
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
