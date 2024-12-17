import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import {
  nucliousbreederSeedSubmissionNodalUIFields,
  selectNucliousBreederNameNodalUIFields,
} from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import Swal from 'sweetalert2';
import { IcarService } from 'src/app/services/icar/icar.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { createCropVarietyData } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';

import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import {
  checkAlpha,
  checkLength,
  checkNumber,
  checkDecimal,
  errorValidate,
  convertDates,
  convertDatetoDDMMYYYYwithdash,
} from 'src/app/_helpers/utility';
import { DatePipe } from '@angular/common';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';

@Component({
  selector: 'app-nucleus-seed-availabiltilty-form',
  templateUrl: './nucleus-seed-availabiltilty-form.component.html',
  styleUrls: ['./nucleus-seed-availabiltilty-form.component.css'],
})
export class NucleusSeedAvailabiltiltyFormComponent implements OnInit {
  @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  currentItem = 'Television';
  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];
  hideView: boolean = false;

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  editVarietyData: any;
  noRedirectAndIgnoreErrors: boolean = false;
  loggedInUserInfoService: any;
  isSearched: boolean = false;
  contactPersonName: any;
  contactPersonDesignation: any;
  btn_name: string;
  title: string;
  NumError: any;
  cropData: any;
  ngForm!: FormGroup;
  submitted: boolean;
  cropNameData: any = [];
  m_crop: any;
  dataExist: boolean = false;
  userId: any;
  verietyName: any;
  yearOfIndent: any = [
    { name: "2020-21", "value": "2020" },
    { name: "2021-22", "value": "2021" },
    { name: "2022-23", "value": "2022" },
    { name: "2023-24", "value": "2023" },
    { name: "2024-25", "value": "2024" },
    { name: "2025-26", "value": "2025" },
    { name: "2026-27", "value": "2026" },
    { name: "2025-26", "value": "202" },
  ];
  cropType: any = "";
  currentProductionCenter: any;
  productionCenterName: any;
  contactOfficerName: string;
  seasonData: any = [];
  seasonNameValue: any;
  yearNameValue: any;
  cropDataValue: any = [];
  cropCodeValue: any;
  cropCode: any;
  todaysDate = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  get formGroupControls() {
    return this.formSuperGroup.controls;
  }

  get IstPartFormGroup(): FormGroup {
    if (this.formGroupControls['IstPartFormGroup'])
      return this.formGroupControls['IstPartFormGroup'] as FormGroup;
    else return new FormGroup([]);
  }

  get IstPartFormGroupControls() {
    return this.IstPartFormGroup.controls;
  }
  currentUser: any = { id: 10, name: "Hello User" };

  constructor(
    activatedRoute: ActivatedRoute,
    private icarService: IcarService,
    private router: Router,
    private fb: FormBuilder,
    private indenterService: IndenterService,
    private restService: RestService,
    private _service: ProductioncenterService,
    private datePipe: DatePipe,
    private breederService: BreederService,
    private seedService: SeedServiceService,
    private nucliousbreederSeedSubmissionNodalUIFields: nucliousbreederSeedSubmissionNodalUIFields
  ) {
    const params: any = activatedRoute.snapshot.params;
    if (params['submissionid']) {
      this.submissionId = parseInt(params['submissionid']);
    }

    this.isEdit = router.url.indexOf('edit') > 0;
    this.isView = router.url.indexOf('view') > 0;

    if (this.isEdit) {
      this.hideView = true
      this.btn_name = 'Update';
      this.title = 'Update';
    } else if (this.isView) {
      this.hideView = true

      this.title = 'View';
    } else if (!this.isEdit && !this.isView) {
      this.title = 'Add';
      this.hideView = false

      this.btn_name = 'Submit';
    } else {
      this.hideView = false

      this.btn_name = 'Submit';
    }

    this.isDraft = router.url.indexOf('edit/draft') > 0;

    this.formSuperGroup.addControl('IstPartFormGroup', new FormGroup([]));
    this.formSuperGroup.addControl('search', new FormControl(''));

    this.createFormControlsOfAGroup(
      nucliousbreederSeedSubmissionNodalUIFields.get,
      this.IstPartFormGroup
    );
    this.fieldsList = nucliousbreederSeedSubmissionNodalUIFields.get;
    this.filterPaginateSearch.itemListPageSize = 10;
    this.createEnrollForm();
    // this.getCropSeason();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      breader_production_name: new FormControl(''),
      Contact_Officer_Address_and_Designation: new FormControl(''),
      yearofIndent: new FormControl(''),
      cropName: new FormControl(''),
      quantity_of_nucleus_seed: new FormControl(''),
      reference_no: new FormControl(''),
      date_of_reference: new FormControl(''),
      reference_no_of_office: new FormControl(''),
      date_of_office_order: new FormControl(''),
      season: new FormControl(''),
    });
    // this.IstPartFormGroupControls['yearofIndent'].valueChanges.subscribe(
    //   (newValue) => {
    //     this.loadVarieties();
    //   }
    // );

    // this.IstPartFormGroupControls['cropName'].valueChanges.subscribe(
    //   (newValue) => {
    //     this.loadVarieties();
    //   }
    // );
    // this.ngForm.controls['group_id'].valueChanges.subscribe(newValue => {
    // this.getCropNameList(newValue);
    // });
  }


  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent" || x.formControlName == "season")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  ngOnInit(): void {
    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user)
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name
    this.getProductionYearData();
    if (this.isView) {
      // this.ngForm.disable();
      this.getCropNameData();
    }
    if (this.isEdit) {
      this.getCropNameData();
      this.ngForm.controls['yearofIndent'].disable();
      this.ngForm.controls['cropName'].disable();
      this.ngForm.controls['season'].disable();

    }

    this.IstPartFormGroupControls['season'].disable();
    this.IstPartFormGroupControls['cropName'].disable();
    this.IstPartFormGroupControls['yearofIndent'].valueChanges.subscribe(
      (newValue) => {
        this.yearNameValue = newValue.value;
        this.cropDataValue = [];
        this.seasonData = [];
        if (
          this.IstPartFormGroupControls['yearofIndent'].value &&
          this.IstPartFormGroupControls['cropName'].value && this.IstPartFormGroupControls['season'].value
        ) {
          // this.yearNameValue = "";/
          this.cropDataValue = [];
          this.seasonData = [];
          this.IstPartFormGroupControls['cropName'].setValue('');
          this.IstPartFormGroupControls['season'].setValue('');
          this.loadVarieties();
        }
        this.IstPartFormGroupControls['season'].enable();
        this.IstPartFormGroupControls['cropName'].disable();
        this.IstPartFormGroupControls['season'].setValue('');
        this.IstPartFormGroupControls['cropName'].setValue('');
        this.getCropSeason(newValue);
      }
    );
    this.IstPartFormGroupControls['season'].valueChanges.subscribe(
      (newValue) => {
        this.seasonNameValue = newValue.value;
        this.cropDataValue = [];
        this.seasonData = [];
        if (
          this.IstPartFormGroupControls['yearofIndent'].value &&
          this.IstPartFormGroupControls['cropName'].value && this.IstPartFormGroupControls['season'].value
        ) {
          this.cropDataValue = [];
          this.seasonData = [];
          // this.yearNameValue = "";
          // this.seasonNameValue = "";
          this.IstPartFormGroupControls['cropName'].setValue('');
          this.loadVarieties();

        }
        this.IstPartFormGroupControls['cropName'].enable();
        this.IstPartFormGroupControls['cropName'].setValue('');
        this.getCropName(newValue);
      }
    );
    //  {
    this.IstPartFormGroupControls['cropName'].valueChanges.subscribe(
      (newValue) => {
        this.cropCodeValue = newValue
        this.loadVarieties();
      }
    );
    // }
    let isSearched = false;
    this.formGroupControls['search'].valueChanges.subscribe((newValue) => {
      let performSearch: any[] | undefined = undefined;
      if (newValue.length > 3) {
        isSearched = true;
        performSearch = [
          {
            columnNameInItemList: 'name',
            value: newValue,
          },
        ];
      }
      if (isSearched) this.filterPaginateSearch.search(performSearch);
    });
    if (this.isEdit || this.isView) {
      this._service
        .postRequestCreator('get-nucleus-seed-availabity-data', {
          search: [{ columnNameInItemList: 'id', value: this.submissionId }],
        })
        .subscribe((data: any) => {
          if (
            data &&
            data.EncryptedResponse &&
            data.EncryptedResponse.status_code &&
            data.EncryptedResponse.status_code == 200
          ) {
            let allData = data.EncryptedResponse.data.rows;
            this.patchForm(allData);
          }
        });
    }
    this.productionCenter();
  }

  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };

  get generateDefaultMonth(): string {
    let date = { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }

    //consolelog(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    disableUntil: { year: 1930, month: 1, day: null },
    disableSince: { year: this.todaysDate.getFullYear(), month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
  };
  onDateChanged(event: IMyDateModel): void {
    // date selected
  }
  preventKeyPress(event) {
    event.preventDefault();
  }

  productionCenter() {
    this.breederService.getRequestCreatorNew("get-bsp1-proforma?userId=" + this.userId.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.currentProductionCenter = data.EncryptedResponse.data
        let nodal_officer_detail = this.currentProductionCenter['agency_detail']['contact_person_name'] + ", " + this.currentProductionCenter['agency_detail']['address']
        this.productionCenterName = this.currentProductionCenter['agency_detail']['agency_name'];
        this.contactOfficerName = nodal_officer_detail;

      }
    })
  }

  getCropSeason(newValue) {
    this._service.postRequestCreator("get-production-season-filter-data", {
      search: {
        year: this.yearNameValue
      }
    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.rows.forEach((x: any, index: number) => {
          x["name"] = x.season;
          x["value"] = x.season_code;
          this.seasonData.push(x);
        });
      }
    });
    this.fieldsList[1].fieldDataList = this.seasonData;
  }

  getCropName(newValue) {
    let searchData = {};
    if (this.yearNameValue && this.seasonNameValue) {
      searchData = {
        search: {
          year: this.yearNameValue,
          season: this.seasonNameValue
        }
      }
    } else {
      return;
    }

    this._service.postRequestCreator("get-production-crop-name-filter-data", searchData).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.rows.forEach((x: any, index: number) => {
          x["name"] = x.crop_name;
          x["value"] = x.crop_code;
          this.cropDataValue.push(x);
        });
      }
    });
    this.fieldsList[2].fieldDataList = this.cropDataValue;
  }
  getCropNameData() {
    this._service.postRequestCreator("get-production-crop-name-filter-data", {
      search: {
        year: this.yearNameValue,
        season: this.seasonNameValue
      }
    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.cropNameData = data.EncryptedResponse.data.rows
        // .forEach((x: any, index: number) => {
        // x["name"] = x.crop_name;
        // x["value"] = x.crop_code;
        // this.cropNameData.push(x);
        // });
      }
    });
    this.fieldsList[2].fieldDataList = this.cropDataValue;
  }
  getProductionYearData() {
    let object = {
      loginedUserid: {
        id: this.currentUser.id
      }
    }
    let yearData = [];
    this._service.postRequestCreator("get-nucleus-seed-availabity-breeder-crop-year-data", object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((x: any, index: number) => {
          let year = x && x.year && x.year ? (x.year + '-' + ((x.year - 2000) + 1)) : '';
          x["name"] = year;
          x["value"] = x.year;
          yearData.push(x);
        });
      }
    });
    this.fieldsList[0].fieldDataList = yearData;
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
      if (data[0] && data[0].crop_code) {
        if ((data[0].crop_code).slice(0, 1) == 'H') {
          this.cropType = "Kg";
        }
        if ((data[0].crop_code).slice(0, 1) == 'A') {
          this.cropType = "Quintal";
        }
      }
      this.verietyName = data && data[0] && data[0].m_crop_variety && data[0].m_crop_variety.variety_name ? data[0].m_crop_variety.variety_name : '';
      this.ngForm.controls['cropName'].patchValue(data && data[0] && data[0].crop_code ? data[0].crop_code : '');
      this.ngForm.controls['yearofIndent'].patchValue(data[0].year ? data[0].year : '');
      this.ngForm.controls['reference_no_of_office'].patchValue(data[0].reference_number_officer_order ? data[0].reference_number_officer_order : '');
      if (data && data[0].season) {
        if (data[0].season == "K") {
          this.ngForm.controls['season'].setValue('Kharif');
        } else {
          this.ngForm.controls['season'].setValue('Rabi');
        }
      } else {
        this.ngForm.controls['season'].setValue(data && data[0] && data[0].m_crop && data[0].m_crop.m_season && data[0].m_crop.m_season.season ? data[0].m_crop.m_season.season : '');
      } 
      let dateOfRef = this.datePipe.transform((data[0].date_of_reference ? data[0].date_of_reference : ''), 'yyyy-MM-dd');
      this.ngForm.controls["date_of_reference"].patchValue(
        {
          dateRange: null,
          isRange: false,
          singleDate: {
            formatted: data[0].date_of_reference,
            jsDate: new Date(data[0].date_of_reference)
          }
        }
      );
      this.ngForm.controls["date_of_office_order"].patchValue(
        {
          dateRange: null,
          isRange: false,
          singleDate: {
            formatted: data[0].officer_order_date,
            jsDate: new Date(data[0].officer_order_date)
          }
        }
      );
      this.ngForm.controls["reference_no"].patchValue(data[0].refernce_number_moa ? data[0].refernce_number_moa : ''
      );
      this.ngForm.controls["quantity_of_nucleus_seed"].patchValue(data[0].quantity ? data[0].quantity : '');
    }
    if (this.isView) {

      this.ngForm.disable();
    }
    // else{
    //   this.ngForm.controls["date_of_reference"].patchValue(
    //     // dateOfRef
    //     {
    //     dateRange: null,
    //     isRange: false,
    //     singleDate: {
    //       formatted: data[0].date_of_reference,
    //       jsDate: new Date(data[0].date_of_reference)
    //     }
    //   }
    //   );
    //   this.ngForm.controls["date_of_office_order"].patchValue(
    //     {
    //       dateRange: null,
    //       isRange: false,
    //       singleDate: {
    //         formatted: data[0].officer_order_date,
    //         jsDate: new Date(data[0].officer_order_date)
    //       }
    //     }
    //   );
    // }
  }

  getDynamicFieldsComponent(id): DynamicFieldsComponent {
    return this.dynamicFieldsComponent.filter((x) => x.id == id)[0];
  }

  submitForm(formData) {
    if (this.ngForm.invalid) {
      return;
    }
    this.checkAlreadyExistData();
    if (this.dataExist == true) {
      return;
    }
  }

  checkAlreadyExistData() {
    this.dataExist = false
    let route = "check-already-exists-production-data";
    let data = {
      search: {
        'year': this.IstPartFormGroupControls['yearofIndent'].value['value'],
        'crop_code': this.IstPartFormGroupControls['cropName'].value['value'],
        'user_id': this.userId && this.userId.id ? this.userId.id : '',
        'season':this.IstPartFormGroupControls['season'].value['value'],
      }
    }
    this._service.postRequestCreator(route, data).subscribe((data: any) => {
      if (data.EncryptedResponse.status_code == 409) {
        this.dataExist = true;
        Swal.fire({
          title: '<p style="font-size:25px;">Data Already Exist.</p>',
          icon: 'warning',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then((x) => { });

        return;
      } else {
        this.dataExist = false;
        this.saveFormData();
      }

    })
  }

  saveFormData() {
    let dataRows = [];
    const year = this.IstPartFormGroupControls['yearofIndent'].value;
    const cropCode = this.IstPartFormGroupControls['cropName'].value;
    const breaderProductionName = this.productionCenterName;
    const contactOfficerDesignation = this.contactOfficerName;
    this.filterPaginateSearch.itemListInitial.forEach((element) => {
      dataRows.push({
        reference_no_of_office: element.formGroup.controls['reference_no_of_office'].value,
        crop_code: cropCode,
        variety_id: element.varietyId,
        year: year,
        breader_production_center_name: breaderProductionName,
        contact_Officer_designation: contactOfficerDesignation,
        is_active: 1,
        officer_order_date: element.formGroup.controls["date_of_office_order"].value && (element.formGroup.controls["date_of_office_order"].value.singleDate) && (element.formGroup.controls["date_of_office_order"].value.singleDate.jsDate) ? convertDates(element.formGroup.controls["date_of_office_order"].value.singleDate.jsDate) : '',
        date_of_reference: element.formGroup.controls["date_of_reference"].value && (element.formGroup.controls["date_of_reference"].value.singleDate) && (element.formGroup.controls["date_of_reference"].value.singleDate.jsDate) ? convertDates(element.formGroup.controls["date_of_reference"].value.singleDate.jsDate) : '',
        refernce_number_moa: element.formGroup.controls["reference_no"].value,
        quantity_of_nucleus_seed: element.formGroup.controls["quantity_of_nucleus_seed"].value,
        contact_person_name: this.contactPersonName ? this.contactPersonName : '',
        user_id: this.userId && this.userId.id ? this.userId.id : '',
        season: this.IstPartFormGroupControls['season'].value,
        variety_code: element.varietyCode
      });
    });
    this._service
      .postRequestCreator(
        'nucleus-seed-availabity-data-submission',
        { nucleusSeed: dataRows },
        null
      )
      .subscribe((data: any) => {
        if (
          data &&
          data.EncryptedResponse &&
          data.EncryptedResponse.status_code &&
          data.EncryptedResponse.status_code == 200
        ) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15',
          }).then((x) => {
            this.router.navigate(['/nucleus-seed-availability-by-breeder']);
          });
        }
      });
  }

  loadVarieties() {
    if (
      this.IstPartFormGroupControls['yearofIndent'].value ||
      this.IstPartFormGroupControls['cropName'].value || this.IstPartFormGroupControls['season'].value
    ) {
      let searchData = {
        search: [
          {
            columnNameInItemList: 'year.value',
            value: this.IstPartFormGroupControls['yearofIndent'].value['value'],
          },
          {
            columnNameInItemList: 'season.value',
            value: this.seasonNameValue
          },
          {
            columnNameInItemList: 'crop.value',
            value: this.IstPartFormGroupControls['cropName'].value['value'],
          },
          {
            columnNameInItemList: 'user_id.value',
            value: this.userId && this.userId.id ? this.userId.id : '',
          },
          {
            columnNameInItemList: 'view',
            value: this.isView ? this.isView : '',
          },
          // {
          //   view:this.isView? this.isView:''
          // }
        ],
        pageSize: -1,
      };

      if (this.editVarietyData) {
        searchData.search.push({
          columnNameInItemList: 'variety_id',
          value: this.editVarietyData?.variety_id,
        });
      }
      this._service.postRequestCreator("get-breeder-seed-variety-production-data", searchData,).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];

          let IIndPartFormArray: {
            name: string,
            varietyId: number,
            formGroup: FormGroup,
            varietyCode:string,
            arrayfieldsIIndPartList: Array<SectionFieldType>
          }[] = [];
          data.EncryptedResponse.data.rows?.forEach((element: any, index: number) => {
            createCropVarietyData(element, true);
            if (this.loggedInUserInfoService != undefined)
              element.nodalAddressDesignation = this.loggedInUserInfoService.loginInfo.address + " and "
                + this.loggedInUserInfoService.loginInfo.designation;

            let newFormGroup = new FormGroup<any>([]);
            this.createFormControlsOfAGroup(selectNucliousBreederNameNodalUIFields, newFormGroup);
            //crop type logic implement // .ts
            if (element && element.crop_code) {
              if ((element.crop_code).slice(0, 1) == 'H') {
                this.cropType = "Kg"
              }
              if ((element.crop_code).slice(0, 1) == 'A') {
                this.cropType = "Quintal"
              }
            } else {
            }
            IIndPartFormArray.push({
              name: element.breeder_crops_veriety && element.breeder_crops_veriety.m_crop_variety && element.breeder_crops_veriety.m_crop_variety.variety_name ? element.breeder_crops_veriety.m_crop_variety.variety_name : null,
              varietyId: element.breeder_crops_veriety && element.breeder_crops_veriety.m_crop_variety && element.breeder_crops_veriety.m_crop_variety.id ? element.breeder_crops_veriety.m_crop_variety.id : null,
              formGroup: newFormGroup,
              varietyCode: element.breeder_crops_veriety && element.breeder_crops_veriety.m_crop_variety && element.breeder_crops_veriety.m_crop_variety.variety_code ? element.breeder_crops_veriety.m_crop_variety.variety_code : null,

              arrayfieldsIIndPartList: selectNucliousBreederNameNodalUIFields.map(x => {
                return { ...x };
              })
            });
          });

          for (let i = 0; i < IIndPartFormArray.length; i++) {
            if (IIndPartFormArray[i].name == null || IIndPartFormArray[i].name === '') {
              delete IIndPartFormArray[i];
            }
          }

          const results = IIndPartFormArray.filter(element => {
            if (Object.keys(element).length !== 0) {
              return true;
            }
            return false;
          });
          this.filterPaginateSearch.Init(results, this);
          this.initSearchAndPagination();
        }
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 404) {
          this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
          let IIndPartFormArray: {
            name: string,
            varietyId: number,
            formGroup: FormGroup,
            arrayfieldsIIndPartList: Array<SectionFieldType>
          }[] = [];
        }
      });
    }
  }

  getBreederData(
    selectBreederNameFieldInfo: SectionFieldType,
    breeder_id: any
  ) {
    let breederInfo = selectBreederNameFieldInfo.fieldDataList.filter(
      (x) => x.value == breeder_id
    );
    if (breederInfo && breederInfo.length > 0) {
      return {
        name: breederInfo[0].name,
        value: this.editVarietyData.breeder_id,
      };
    } else {
      return selectBreederNameFieldInfo.fieldDataList[0];
    }
  }

  saveAndNavigate() {
    if (
      this.filterPaginateSearch.itemListTotalPage >
      this.filterPaginateSearch.itemListCurrentPage
    ) {
      this.filterPaginateSearch.navigate('next');
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
    } else {
      this.activeVarietyIndexInAccordion = varietyIndexInAccordion;
    }
  }

  onUpdate() {
    this.submitted = true;
    if (this.ngForm.invalid) {
      return;
    }
    let route = "update-nucleus-seed-availabity-submission";
    const data = {
      id: this.submissionId ? this.submissionId : '',
      breader_production_center_name: this.productionCenterName,
      contact_Officer_designation: this.contactOfficerName,
      year: this.ngForm.controls['yearofIndent'].value,
      crop_code: this.ngForm.controls['cropName'].value,
      reference_no_of_office: this.ngForm.controls['reference_no_of_office'].value,
      is_active: 1,
      officer_order_date: this.ngForm.controls["date_of_office_order"].value && this.ngForm.controls["date_of_office_order"].value.singleDate
        && this.ngForm.controls["date_of_office_order"].value.singleDate.jsDate ? convertDates(this.ngForm.controls["date_of_office_order"].value.singleDate.jsDate) : "",
      date_of_reference: (this.ngForm.controls["date_of_reference"].value) && this.ngForm.controls["date_of_reference"].value.singleDate && this.ngForm.controls["date_of_reference"].value.singleDate.jsDate
        ? convertDates(this.ngForm.controls["date_of_reference"].value.singleDate.jsDate) : '',
      refernce_number_moa: this.ngForm.controls["reference_no"].value,
      quantity_of_nucleus_seed: this.ngForm.controls["quantity_of_nucleus_seed"].value,
      contact_person_name: this.ngForm.controls['reference_no_of_office'].value,
      user_id: this.userId && this.userId.id ? this.userId.id : ''
    };
    this._service.postRequestCreator(route, data).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {

          this.router.navigateByUrl('/nucleus-seed-availability-by-breeder');
        })
      } else {
      }
    });
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  checkNumber($e) {
    checkNumber($e);
  }
}
