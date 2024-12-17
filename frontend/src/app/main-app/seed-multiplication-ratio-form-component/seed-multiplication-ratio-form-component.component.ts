import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { nucliousbreederSeedSubmissionNodalUIFieldss, seedMultipicationRatioUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import Swal from 'sweetalert2';
import { createCropVarietyData } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import { checkAlpha, checkLength, checkNumber, checkDecimal, errorValidate, checkNumberswithoutDecimal } from 'src/app/_helpers/utility';
import { max } from 'rxjs-compat/operator/max';
import { HttpClient } from '@angular/common/http';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-seed-multiplication-ratio-form-component',
  templateUrl: './seed-multiplication-ratio-form-component.component.html',
  styleUrls: ['./seed-multiplication-ratio-form-component.component.css']
})
export class SeedMultiplicationRatioFormComponentComponent implements OnInit {

  @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  inputsearchsmr;
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
  cropCode: any;
  hideView: boolean = false;
  ngForm!: FormGroup;
  cropData: any;
  submitted: boolean = false;
  CropCodeValue: any;
  cropGroupCodeValue: any;
  NumError: any;
  NumError1: string;
  NumError2: string;
  NumError3: string;
  userId: any;
  dataExist: boolean;
  isActive: number;
  isShowDiv;
  ipAddres: any;

  historyData =
    {
      action: '',
      comment: '',
      formType: ''
    }
  pastedNumber: string;
  cropNameAlreadyRegistered: any;
  cropnameinCropmodel: any;
  cropNameinmcrop: any;
  AllCropData: any;
  finalCropVarietData: any[];
  cropDataa: any[];
  cropDataasecond: any[];
  cropListArr: { name: string; cropCode: number; formGroup: FormGroup; arrayfieldsIIndPartList: Array<SectionFieldType>; }[];
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
    private router: Router,
    private fb: FormBuilder,
    nucliousbreederSeedSubmissionNodalUIFields: nucliousbreederSeedSubmissionNodalUIFieldss,
    private _serviceSeed: SeedDivisionService,
    private route: Router,
    private http: HttpClient,
    private _service: ProductioncenterService

  ) {
    this.createEnrollForm();
    const params: any = activatedRoute.snapshot.params;
    if (params["id"]) {
      this.submissionId = parseInt(params["id"]);
    }

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

    if (this.isEdit) {
      this.hideView = true
      this.btn_name = 'Update';
      this.title = 'Update';
    } else if (this.isView) {
      this.hideView = true
      this.title = 'View';
    } else if (!this.isEdit && !this.isView) {
      this.title = 'Add';
    } else {
      this.btn_name = 'Submit';
    }

    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    this.createFormControlsOfAGroup(nucliousbreederSeedSubmissionNodalUIFields.get, this.IstPartFormGroup);
    this.fieldsList = nucliousbreederSeedSubmissionNodalUIFields.get;
    console.log('    this.fieldsList', this.fieldsList)
    this.filterPaginateSearch.itemListPageSize = 10;
  }
  selected_group;
  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_name: new FormControl(''),
      crop_code: new FormControl(''),
      crop_group_code: new FormControl(''),
      nucleus_breader: new FormControl('', [Validators.minLength(0), Validators.maxLength(500)]),
      breader_to_foundation_1: new FormControl('', [Validators.minLength(0), Validators.maxLength(500)]),
      foundation_1_to_foundation_2: new FormControl('', [Validators.minLength(0), Validators.maxLength(500)]),
      foundation_2_to_certified: new FormControl('', [Validators.minLength(0), Validators.maxLength(500)]),
      status_toggle: [''],
      group_code: [''],
      group_text: [''],
      search: ['']
    });
    this.ngForm.controls["group_code"].valueChanges.subscribe(newValue => {
      // console.log('new daa', newValue);
      if (newValue) {
        // this.checkGroup(newValue)
        // this.checkGroupinCropModels(newValue)
        // this.IstPartFormGroupControls["groupName"].setValue(newValue)
        this.checkGroupinCropModel(newValue);
      }

      // this.loadVarieties();
    });
    this.ngForm.controls["group_text"].valueChanges.subscribe(newValue => {
      // console.log('new daa', newValue);
      if (newValue) {
        this.cropDataa = this.cropDataasecond;
        let response = this.cropDataa.filter(x => x.group_name.toLowerCase().includes((newValue).toLowerCase()))
        this.cropDataa = response
        //     console.log(this.cropDataa.length,'len')
        //     if(this.cropDataa.length<1){

        //       this.cropDataa.push({'group_name':'No data found'})
        //       console.log(this.cropDataa)
        //     }

        // this.fieldsList[0].fieldDataList = this.cropDataa;        
        //   }

        // this.checkGroup(newValue)
        // this.checkGroupinCropModels(newValue)
        // this.IstPartFormGroupControls["groupName"].setValue(newValue)
        // this.checkGroupinCropModel(newValue);
      }
      else {
        this.getCropGroupData()
      }

      // this.loadVarieties();
    });
    // this.ngForm.controls['group_id'].valueChanges.subscribe(newValue => {
    // this.getCropNameList(newValue);
    // });

  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "groupName") && x.inputSearch == "crop_group_smr_text") {
        // newFormControl.disable();

      }
      formGroup.addControl(x.formControlName, newFormControl,);
      formGroup.addControl(x.inputSearch, newFormControl,);
      console.log(newFormControl, 'newFormControl', x.inputSearch)
    });
  }
  // toggleDisplayDiv() {
  //   this.isShowDiv = !this.isShowDiv;
  // }

  ngOnInit(): void {
    this.getIPAddress();



    this.getCropGroupData()
    //get user id from localstorage
    let user = localStorage.getItem('BHTCurrentUser')
    console.log('userDatat',);
    this.userId = JSON.parse(user)

    this.getCropData();
    // this.IstPartFormGroupControls["group_code"].valueChanges.subscribe(newValue => {
    //   // console.log('new daa', newValue);
    //   if (newValue) {
    //     // this.checkGroup(newValue)
    //     // this.checkGroupinCropModels(newValue)
    //     // this.IstPartFormGroupControls["groupName"].setValue(newValue)
    //     this.checkGroupinCropModel(newValue);
    //   }

    //   // this.loadVarieties();
    // });
    // this.IstPartFormGroupControls["crop_group_smr_text"].valueChanges.subscribe(newValue => {
    //   console.log('new dssssssssaa', newValue);
    //   // let 
    //   // data= this.cropGropDataSecond;
    //   // console.log(data,'data')
    //   if (newValue && !newValue.id ) {
    //     // this.getCropData()
    //     this.cropDataa=this.cropDataasecond;
    //    let response= this.cropDataa.filter(x=>x.group_name.toLowerCase().startsWith((newValue).toLowerCase()))      
    //     this.cropDataa=response     
    //     console.log(this.cropDataa.length,'len')
    //     if(this.cropDataa.length<1){

    //       this.cropDataa.push({'group_name':'No data found'})
    //       console.log(this.cropDataa)
    //     }

    // this.fieldsList[0].fieldDataList = this.cropDataa;        
    //   }
    //   else{
    //     this.getCropGroupData()
    //   }

    //   // this.loadVarieties();
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
    if (this.isView) {
      this.ngForm.disable();
    }
    if (this.isEdit || this.isView) {
      this.ngForm.controls['crop_group_code'].disable();
      this.ngForm.controls['crop_name'].disable();
      const data = {
        search: {
          id: this.submissionId
        }
      }
      this._serviceSeed.postRequestCreator("get-seed-multiplication-ratio-data", data).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let allData = data.EncryptedResponse.data.rows;
          this.patchForm(allData);
        }
      });
    }

  }
  async getCropData() {
    this._serviceSeed
      .postRequestCreator("crop-group")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.cropData = apiResponse.EncryptedResponse.data;
        }
      });
  }
  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;
      console.log('ip=======address', this.ipAddres);
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
    //implement isActive toggle
    console.log('data', data);

    if (data[0].is_active == 0) {
      this.ngForm.controls['status_toggle'].patchValue(false);
      this.isShowDiv = true;
      this.isActive = 0;
    }
    if (data[0].is_active == 1) {
      this.isShowDiv = false;
      this.ngForm.controls['status_toggle'].patchValue(true);
      this.isActive = 1;
    }
    //finish isActive toggle
    if (data && data[0]) {
      this.CropCodeValue = data[0].crop_code;

      this.ngForm.controls['crop_group_code'].patchValue(data[0].m_crop.group_code);
      this.cropGroupCodeValue = data[0].croup_group_code;
      this.ngForm.controls['crop_name'].patchValue(data[0].crop_name);
      this.ngForm.controls['nucleus_breader'].patchValue(data[0].nucleus_to_breeder)
      this.ngForm.controls['breader_to_foundation_1'].patchValue(data[0].breeder_to_foundation)
      this.ngForm.controls['foundation_1_to_foundation_2'].patchValue(data[0].foundation_1_to_2)
      this.ngForm.controls['foundation_2_to_certified'].patchValue(data[0].foundation_2_to_cert)
    }

  }


  getDynamicFieldsComponent(id): DynamicFieldsComponent {
    return this.dynamicFieldsComponent.filter(x => x.id == id)[0];
  }
  submitForm(formData) {
    console.log('data exist', this.dataExist);
    if (this.ngForm.invalid) {
      return;
    }
    this.checkAlreadyExistData();
    if (this.dataExist == true) {
      return;
    }
    console.log('form data', formData);

  }

  checkAlreadyExistData() {
    this.dataExist = false
    let route = "check-already-exists-seed-multiplication-ratio-data";
    let data = {
      search: {
        'crop_code': this.ngForm.controls['group_code'].value,
        'user_id': this.userId && this.userId.id ? this.userId.id : ''
      }
    }
    this._serviceSeed.postRequestCreator(route, data).subscribe((data: any) => {
      if (data.EncryptedResponse.status_code == 409) {
        console.log('console-=====data', data.EncryptedResponse.status_code);
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

    // console.log('this.formSuperGroup', formData)
    // if (this.formSuperGroup.invalid) {
    //   alert('fill form correctly')
    //   return;
    // }
    if (this.ngForm.invalid) {
      alert('fill form correctly2')
      return;
    }
    let dataRows = [];
    const cropCode = this.IstPartFormGroupControls["groupName"].value;
    this.filterPaginateSearch.itemListInitial.forEach(element => {

      dataRows.push({
        crop_name: element.formGroup.controls["crop_name"].value,
        group_code: this.ngForm.controls['group_code'].value,
        crop_code: element.cropCode,
        is_active: 1,
        // this.userId && this.userId.id ? this.userId.id : ''
        user_id: this.userId && this.userId.id ? this.userId.id : '',
        nucleus_breader: parseInt(element.formGroup.controls["nucleus_breader"].value),
        breader_to_foundation_1: element.formGroup.controls["breader_to_foundation_1"].value,
        foundation_1_to_foundation_2: element.formGroup.controls["foundation_1_to_foundation_2"].value,
        foundation_2_to_certified: element.formGroup.controls["foundation_2_to_certified"].value,
      });

    });

    this._serviceSeed.postRequestCreator("add-seed-multiplication-ratio-data", { nucleusSeed: dataRows }, null).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.historyData.action = "Add";
        this.historyData.comment = "Add Form successfully";
        this.historyData.formType = "seed-multiplication-ratio";

        this.audtiTrailsHistory(this.historyData);

        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          showCancelButton: false,
          confirmButtonColor: '#E97E15'
        }).then(x => {
          this.router.navigate(['/seed-multiplication-ratio-list']);
        })
      }

    });
  }
  checkGroup(value) {
    const param = {
      search: {
        cropGroupCode: value && value.group_code ? value.group_code : ''
      }
    }
    const result = this._serviceSeed.postRequestCreator('checksmrcropgroupisAlreayexit', param).subscribe(data => {
      console.log('data', data.EncryptedResponse.data.search)
      let search = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows
        ? data.EncryptedResponse.data.rows : '';
      this.cropNameAlreadyRegistered = search
      console.log(search, 'search')
      // if(search.invalid){
      //   Swal.fire({
      //     toast: false,
      //     icon: "error",
      //     title: "Crop is already registered",
      //     position: "center",
      //     showConfirmButton: false,
      //     showCancelButton: false,
      //     timer: 2000,

      //   })
      // }
      // else{
      // this.IstPartFormGroupControls["crop_group_smr_text"].setValue('hii')
      // this.loadVarieties()
      // }

    })
  }
  checkGroupinCropModel(value) {
    if (value.group_code) {
      const param = {
        search: {
          group_code: value && value.group_code ? value.group_code : ''
        }
      }
      const result = this._serviceSeed.postRequestCreator('getCropdatainseedmutiplicationRatio', param).subscribe(data => {
        console.log('data', data.EncryptedResponse.data.search)
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows
          ? data.EncryptedResponse.data.rows : '';
        this.cropnameinCropmodel = res;
        this.loadVarieties()


      })
    }
  }
  checkGroupinCropModels(value) {
    const param = {
      search: {
        group_code: value && value.group_code ? value.group_code : ''
      }
    }
    const result = this._serviceSeed.postRequestCreator('getseedMultRatioSeedUniqueCropDataincropModelsecond', param).subscribe(data => {
      console.log('data', data.EncryptedResponse.data.search)
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows
        ? data.EncryptedResponse.data.rows : '';
      this.cropnameinCropmodel = res;
      // for (let index = 0; this.cropNameAlreadyRegistered.length; index++) {

      //   this.cropNameAlreadyRegistered = this.cropNameAlreadyRegistered.filter((item: any) => item.crop_name == this.cropnameinCropmodel[index].crop_name)
      // }

      // this.cropNameAlreadyRegistered =search
      console.log(this.cropNameAlreadyRegistered, 'res')
      // if(search.invalid){
      //   Swal.fire({
      //     toast: false,
      //     icon: "error",
      //     title: "Crop is already registered",
      //     position: "center",
      //     showConfirmButton: false,
      //     showCancelButton: false,
      //     timer: 2000,

      //   })
      // }
      // else{
      // this.loadVarieties()
      // }

    })
  }

  loadVarieties() {

    if (this.ngForm.controls["group_code"].value) {
      console.log('this.cropnameinCropmodel==>>>>>', this.cropnameinCropmodel)
      let crop_codes = []
      for (let index = 0; index < this.cropnameinCropmodel.length; index++) {
        crop_codes.push(this.cropnameinCropmodel[index].crop_name)
        console.log('this.cropnameinCropmodel[index].crop_code', this.cropnameinCropmodel[index].crop_name)

      }
      console.log(crop_codes, ' console.log(crop_codes)')
      let cropArr = []
      // crop_codes=crop_codes.filter(item=>item!=null)
      //  let  crop_codesArr=crop_codes.forEach(item=>{item!=null})
      //  cropArr.push(crop_codesArr)
      let searchData = {
        search: [
          {
            columnNameInItemList: "crop.value", value: this.ngForm.controls["group_code"].value.group_code,
            smr_crop_code: crop_codes
          }
        ],
        "pageSize": -1
      };
      console.log(crop_codes)

      if (this.isEdit || this.isView) {
        let searchData = {
          search: {
            id: this.submissionId
          }
        };
      }
      this._serviceSeed.postRequestCreator("getseedMultRatioSeedUniqueCropData", searchData).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          console.log(data, 'res')
          let newAlreadyData = []
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
          newAlreadyData.push(response)
          newAlreadyData = newAlreadyData.flat()
          console.log(data.EncryptedResponse.data.rows, 'newAlreadyDatanewAlreadyDatanewAlreadyData')



          let unmatched = this.cropnameinCropmodel.filter(item => !newAlreadyData.some(_item => _item.crop_code == item.crop_code));
          console.log('data=======>', unmatched, 'unmatched', this.cropnameinCropmodel, 'this.cropnameinCropmodel', newAlreadyData)
          if (!data.EncryptedResponse.data.rows.length) {
            Swal.fire({
              title: '<p style="font-size:25px;">Seed multiplication ratio data has already been filled for all crops within this crop group.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'

            })
          }
          let crop_code = [];
          let crop_name_data = [];
          crop_name_data = data.EncryptedResponse.data.rows;

          data.EncryptedResponse.data.rows?.forEach((element: any, index: number) => {
            crop_code.push(element.crop_code)
          })
          const param = {
            // crop_code:crop_code,
            group: this.ngForm.controls["group_code"].value
          }
          this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
          let IIndPartFormArray: {
            name: string,
            cropCode: number,
            formGroup: FormGroup,
            arrayfieldsIIndPartList: Array<SectionFieldType>
          }[] = [];

          data.EncryptedResponse.data.rows.forEach((element: any, index: number) => {
            // console.log(element,'ele')
            createCropVarietyData(element, true);

            if (this.loggedInUserInfoService != undefined)
              element.nodalAddressDesignation = this.loggedInUserInfoService.loginInfo.address + " and "
                + this.loggedInUserInfoService.loginInfo.designation;

            let newFormGroup = new FormGroup<any>([]);
            this.createFormControlsOfAGroup(seedMultipicationRatioUIFields, newFormGroup);
            // console.log("elementelement", element)

            newFormGroup.controls["crop_name"].patchValue(element?.crop_name);
            this.cropCode = element?.crop_code;
            newFormGroup.controls["crop_name"].disable();

            IIndPartFormArray.push({
              name: element.crop_name,
              cropCode: element.crop_code,
              formGroup: newFormGroup,
              arrayfieldsIIndPartList: seedMultipicationRatioUIFields.map(x => {
                if (!["selectBreederName", "availableNucleusSeed", "allocateNucleusSeed"].includes(x.formControlName)) {
                  // newFormGroup.controls[x.formControlName].disable();
                }
                return { ...x };
              })
            });
          });
          console.log(IIndPartFormArray,'IIndPartFormArray')
          this.cropListArr=IIndPartFormArray
          
          this.filterPaginateSearch.Init(IIndPartFormArray, this);

          this.initSearchAndPagination();
        }
      });
    }
  }
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

    this.router.navigate(['/seed-multiplication-ratio-list']);
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  activateVarietyIndexInAccordion(varietyIndexInAccordion: number) {
    if (this.activeVarietyIndexInAccordion == varietyIndexInAccordion) {
      this.activeVarietyIndexInAccordion = -1;
    }
    else {
      this.activeVarietyIndexInAccordion = varietyIndexInAccordion;
    }
  }

  onUpdate() {
    this.submitted = true;
    if (this.ngForm.controls['nucleus_breader'].value > 500 || this.ngForm.controls['nucleus_breader'].value < 1) {
      this.NumError = "Value must be less than or equal to 500 "
      return
    }
    if (this.ngForm.controls['breader_to_foundation_1'].value > 500 || this.ngForm.controls['breader_to_foundation_1'].value < 1) {
      this.NumError1 = "Value must be less than or equal to 500 "
      return
    }
    if (this.ngForm.controls['foundation_1_to_foundation_2'].value > 500 || this.ngForm.controls['foundation_1_to_foundation_2'].value < 1) {
      this.NumError2 = "Value must be less than or equal to 500 "
      return
    }
    if (this.ngForm.controls['foundation_2_to_certified'].value > 500 || this.ngForm.controls['foundation_2_to_certified'].value < 1) {
      this.NumError3 = "Value must be less than or equal to 500 "
      return
    }
    //
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isShowDiv = false;
      this.isActive = 1;
    }
    if (this.ngForm.controls['status_toggle'].value == false) {
      this.isShowDiv = true;
      this.isActive = 0;
    }
    if (this.ngForm.invalid) {

      return;
    }
    let route = "update-seed-multiplication-ratio-data";
    console.log('cropGroupCodeValue', this.cropGroupCodeValue);
    const data = {
      id: this.submissionId ? this.submissionId : '',
      crop_name: this.ngForm.controls['crop_name'].value,
      // group_code: this.cropGroupCodeValue ? this.cropGroupCodeValue : '',
      group_code: this.ngForm.controls['crop_group_code'].value,
      crop_code: this.CropCodeValue ? this.CropCodeValue : '',
      user_id: this.userId && this.userId.id ? this.userId.id : '',
      nucleus_breader: parseInt(this.ngForm.controls['nucleus_breader'].value),
      breader_to_foundation_1: this.ngForm.controls['breader_to_foundation_1'].value,
      foundation_1_to_foundation_2: this.ngForm.controls['foundation_1_to_foundation_2'].value,
      foundation_2_to_certified: this.ngForm.controls['foundation_2_to_certified'].value,
      active: this.isActive
    };
    this._serviceSeed.postRequestCreator(route, data).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.historyData.action = "update";
        this.historyData.comment = "update successfully";
        this.historyData.formType = "seed-multiplication-ratio";

        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })

        this.route.navigateByUrl('/seed-multiplication-ratio-list');
      } else {
      }
    });
  }
  audtiTrailsHistory(historyData) {

    this._serviceSeed.postRequestCreator('audit-trail-history', {
      "action_at": historyData.action,
      "action_by": this.userId.name,
      "application_id": "1234",
      "column_id": this.submissionId ? this.submissionId : '',
      "comment": historyData.comment,
      "form_type": historyData.formType,
      "ip": this.ipAddres,
      "mac_number": "12345678",
      "table_id": this.submissionId ? this.submissionId : ''
    }).subscribe(res => {

    });
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  checkNumber($e) {
    checkNumber($e);
  }
  checkNumberswithoutDecimal($e) {
    if ($e.which == 46) {
      $e.preventDefault();
      return false
    }
    // checkNumberswithoutDecimal($e);
  }
  seedCropName() {
    console.log(' this.IstPartFormGroupControls====>', this.IstPartFormGroupControls["groupName"].value);
    const param = {
      crop_name: this.IstPartFormGroupControls["groupName"].value.group_name

    }

    this._serviceSeed.postRequestCreator('check-crop-name-in-seed-labrotary-already', param).subscribe(data => {
      console.log('dfat======>', data);
      const apiRes = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      // const response = apiRes && apiRes.inValid 
      if (apiRes.inValid) {
        Swal.fire({
          title: '<p style="font-size:25px;">crop Name is Already Registered.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          // this.router.navigate(['/seed-multiplication-ratio-list']);

        })
      }
      else {
        this.loadVarieties();

      }
    })
  }

  onPasteNumber(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = '^[0-9]$';
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    if (this.pastedNumber.match(alphaExp)) {

      if (this.pastedNumber.length > len) {
        const value = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(value.substring(0, len))
      }
      else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value)
      }
      // return true
    }
    else {
      if (field == 'latitude' || field == 'longitude') {
        let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      else {
        event.preventDefault();
        let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.ngForm.get(field).value + fieldName;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      // return false
    }

  }
  getCropGroupData() {
    let cropdata = []
    this._serviceSeed.postRequestCreator("crop-group", {

    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((x: any, index: number) => {
          x["name"] = x.group_name;
          // console.log(x,'this.fieldsList',this.fieldsList)
          x["value"] = x.group_code;
          cropdata.push(x);
        });
      }
    });
    this.fieldsList[0].fieldDataList = cropdata;
    this.cropDataa = cropdata
    this.cropDataasecond = this.cropDataa
  }
  group_select(data) {
    console.log(data, 'data')
    this.selected_group = data.name;
    this.ngForm.controls['group_code'].setValue(data)
    this.cropDataa = this.cropDataasecond;
    this.ngForm.controls['group_text'].setValue('', { emitEvent: false })
  }
  cnClick() {
    document.getElementById('group_code').click();
  }
  getCropList(item){
    console.log('getCropList',item)
    console.log(this.filterPaginateSearch.itemList)
    let data =this.cropListArr;
    this.filterPaginateSearch.itemList=this.cropListArr;
    if(item){
      if(this.filterPaginateSearch && this.filterPaginateSearch.itemList && this.filterPaginateSearch.itemList.length>0){
       let datas= this.filterPaginateSearch.itemList.filter(x=> x.name.toLowerCase().includes(item.toLowerCase()))
       this.filterPaginateSearch.itemList=datas    
      }
    }
    else{
      this.filterPaginateSearch.itemList=data
    }
  }
}
