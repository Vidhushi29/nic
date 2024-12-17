import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master/master.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';

@Component({
  selector: 'app-add-breeder-crop',
  templateUrl: './add-breeder-crop.component.html',
  styleUrls: ['./add-breeder-crop.component.css']
})
export class AddBreederCropComponent extends ngbDropdownEvents implements OnInit {
  form!: FormGroup;
  submitted = false;
  ngForm!: FormGroup;
  selectCrop: any;
  seasontype: any;
  allData: any;
  submissionid = this.route.snapshot.paramMap.get('submissionId');
  response: any;
  respose: any;
  groupCode: any;
  crop_names;
  @ViewChild(IndentBreederSeedAllocationSearchComponent) indentBreederSeedAllocationSearchComponent: IndentBreederSeedAllocationSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  croupGroup: any;
  croupGroupList: any = [];
  datas: any = [];
  result: any = [];
  seasonList: any = [];
  disabledfield: boolean = true;
  cancelbtn!: boolean;
  VarietyName = [];
  isEdit: boolean = false;
  data: any = [];
  isView: boolean = false;
  submitHide: boolean = true;
  variety_name;
  producttio_center;
  croupGroupNameList;
  selectCropName;
  selectVariety;
  breederproductionList ;
  crop_name_list: any = [];
  gpName: any;
  cropCode: any;
  crop_code: any;
  crop_group;
  producttio_center_name: any;
  submitbtn: boolean = true;
  btnFix: boolean = true;
  value_crop_code: any;
  VarietyNameDataList: any;
  enable = true;
  crop_name_id: any;
  title: string;
  verietyId: any;
  verietyName: any;
  verietyCode: any;
  userId: any;
  // cropName: any=[];
  dropdownSettings: IDropdownSettings = {};
  submitBtnDisable: boolean = false;
  // yearOfIndent = [
  //   { name: "2026-27", "value": 2026 },
  //   { name: "2025-26", "value": 2025 },
  //   { name: "2024-25", "value": 2024 },
  //   { name: "2023-24", "value": 2023 },
    // { name: "2022-23", "value": 2022 },
    // { name: "2021-22", "value": 2021 },
  // ]
  dataExist: boolean;
  varietyNameDisbale: boolean = false;
  response_variety: any;
  hiddenVeriey: boolean = true;
  hideUploadBtn: boolean = false;
  public isDropdownDisabled = false;
  seasonListData: any;
  breeder_production_name;
  group_code: any;
  breederproductionListsecond: string | any[];
  crop_name_list_second: any;
  yearOfIndent: any;
  disabledfieldCrop: boolean = true;
  cropNameId: any;
  cropCodeDta: any;
  constructor(private masterService: MasterService
    , private breederService: BreederService
    , private fb: FormBuilder
    , private route: ActivatedRoute
    , private restService: RestService
    , private router: Router
    , private service: SeedServiceService) {
    super();
    this.createEnrollForm();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      // crop_group: new FormControl('', [Validators.required]),
      crop_name: new FormControl('', Validators.required),
      breeder_production_center: new FormControl('', Validators.required),
      variety_name: new FormControl('',),
      // group_code: ['', [Validators.required]],
      crop_code: new FormControl(''),
      season: new FormControl(''),
      year_of_indent: new FormControl(''),
      crop_name_text: new FormControl(''),
      breeder_production_center_text: new FormControl(''),
    });

    if (this.router.url.includes('view')) {
      this.title = 'View Assign Crop/Variety to BSPCs';
      this.disabledfield = true;
      this.cancelbtn = false;
      this.isView = true;
      this.submitHide = false;
      this.disabledfieldCrop = true;
      this.ngForm.disable();
      this.getListData();
      this.isEdit = false
      this.btnFix = false
      this.submitbtn = false;
      // this.ngForm.controls['breeder_production_center_text'].disable();
    }

    if (this.router.url.includes('edit')) {
      this.title = 'Update Assign Crop/Variety';
      this.disabledfield = false;
      this.cancelbtn = true;
      this.isEdit = true;
      this.btnFix = true;
      this.hiddenVeriey = false;
      this.disabledfieldCrop = false;

      // this.getSeasonData();
      this.getListData();
      // this.
      this.enable = false;

    }
    if (this.router.url.includes('view')){
      // this.getSeasonData();
    }

    if (!this.router.url.includes('view') && !this.router.url.includes('edit')) {
      this.title = 'Assign Crop/Variety';
    }

    this.ngForm.controls["year_of_indent"].valueChanges.subscribe(value => {
      if (value) {
        this.getSeasonName(value)
        this.getAgencyName();
      }
    });

    this.ngForm.controls["season"].valueChanges.subscribe(value => {
      this.getCropName(value);
      // this.getAgencyName();
      this.disabledfieldCrop = false ;
      // this.getDynamicCropCode(value)
      this.getAgencyName();
    });

    this.ngForm.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        // this.getCropData()
        this.crop_name_list=this.crop_name_list_second;
       let response= this.crop_name_list.filter(x=>x.crop_name.toLowerCase().startsWith(newValue.toLowerCase()))      
        this.crop_name_list=response     
        this.getAgencyName();         
      }
      else{
       this.getCropName(this.ngForm.controls['season'].value)
      }
    });
    
    this.ngForm.controls['breeder_production_center_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        // this.getCropData()
        this.breederproductionList=this.breederproductionListsecond;
        console.log(this.breederproductionList)
       let response= this.breederproductionList.filter(x=>x.agency_name.toLowerCase().startsWith(newValue.toLowerCase()))      
        this.breederproductionList=response              
      }
      else{
       this.getAgencyName()
      }
    });

    this.ngForm.controls["breeder_production_center"].valueChanges.subscribe(value => {
      if (value) {
        if (!this.router.url.includes('edit')) {

          this.getbreeder_production_center_name(value)
        }
      }

    })
    if (!this.router.url.includes('view') || !this.router.url.includes('edit')) {
      this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
        if (newValue) {
          this.fildata(newValue)
          this.crop_name_id = newValue;
          this.hiddenVeriey = false;
          this.disabledfield = false;
          this.getVarietyName(this.crop_name_id);
          // this.getAgencyName();
          // this.ngForm.controls["variety_name"].setValue("")
        }
        this.getAgencyName();
        // this.getGroupName(newValue);

      });
    }
    if (!this.router.url.includes('view') || this.router.url.includes('edit')) {
      this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
        if (newValue) {
          // this.ngForm.controls['variety_name'].reset()
          this.fildata(newValue)
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.isView) {
      this.isDropdownDisabled = true;
      this.hideUploadBtn = true
    }
    if (this.isView) {
      this.hiddenVeriey = true;
    }

    let user = localStorage.getItem('BHTCurrentUser')
    this.userId = JSON.parse(user)

    this.submissionid = this.route.snapshot.paramMap.get('submissionid');
    this.getAgencyName()
    this.initProcess()
    // this.getSeasonData();
    this.getYearOfIndentData();
    this.dropdownSettings = {
      idField: 'variety_id',
      textField: 'variety_name',
      enableCheckAll: true,
      limitSelection: -1,
      itemsShowLimit: 5,
    };
  }
  
  getYearOfIndentData() {
    const route = "get-year-assign-indenter-data";
    const result = this.breederService.postRequestCreator(route, null).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  getSeasonData() {
    const route = "get-season-assign-indenter-data";
    const result = this.breederService.postRequestCreator(route, null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  fildata(newValue) {
    const data = this.crop_name_list.filter((data) => parseInt(data.m_crop_id) === parseInt(newValue));
    this.value_crop_code = data && data[0] && data[0].crop_code ? data[0].crop_code : '';
    this.crop_code = data && data[0] && data[0].crop_code ? data[0].crop_code : '';
    this.crop_group = data && data[0] && data[0].group_code ? data[0].group_code : '';
  }

  initProcess() {
    this.getPageData();
  }
  selectvarietname(item) {
    this.variety_name = item.variety_name;
    this.ngForm.controls["variety_name"].setValue(this.variety_name)
  }

  getbreeder_production_center_name(value) {
    const data = this.breederproductionList.filter(x => parseInt(x.id) === parseInt(value))
    this.producttio_center_name = data && data[0] && data[0].agency_name ? data[0].agency_name : ''

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getPageData() {
    const route = "crop-group";
    const result = this.breederService.postRequestCreator(route, null).subscribe(data => {
      this.croupGroupList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
    })
  }

  breederproduction(item: any) {
    this.producttio_center = item.agency_name;
    this.ngForm.controls["breeder_production_center"].setValue(this.producttio_center)
  }
  getSeasonName(value) {
   
    const searchFilters = {
      search: {
        year: value

      }
    }
    const result = this.breederService.postRequestCreator('get-assign-crop-season', null, searchFilters).subscribe(data => {
      this.seasonListData = data && data.EncryptedResponse &&
        data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

    })
  }
  getListData() {
    const result = this.breederService.postRequestCreator("get-breeder-crop-submission/" + this.submissionid, null, null).subscribe((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';

      if (response) {
        if (this.isView) {
          this.varietyNameDisbale = true;
        }

        this.ngForm.controls["variety_name"].patchValue(response.veriety_data);
        this.variety_name = response.veriety_data
        this.crop_names= response && response.m_crop  && response.m_crop.crop_name ? response.m_crop.crop_name :''
        
        this.breeder_production_name= response && response.user && response.user.agency_detail && response.user.agency_detail.agency_name ? response.user.agency_detail.agency_name :''

        this.response_variety = response.veriety_data
        this.ngForm.controls["breeder_production_center"].patchValue(response && response.user && response.user && response.user.id ? response.user.id :'');
        this.ngForm.controls["crop_name"].setValue(response.crop_name_id);


        this.crop_name_id = response.crop_name_id
        this.verietyName = response.variety ? response.variety : '';
        // this.ngForm.controls['group_code'].patchValue(response.crop_group_code);
        this.ngForm.controls["crop_code"].patchValue(response.crop_code);
        this.crop_code = response.crop_code;
        this.group_code = response.crop_group_code;

        this.ngForm.controls["season"].patchValue(response.season);
        this.ngForm.controls["year_of_indent"].patchValue(response.year);
        this.producttio_center_name = response.production_center_name;
      }
    });
  }
  varietyData(data) {
    this.verietyId = data.id;
    this.verietyName = data.variety_name;
    this.verietyCode = data.variety_code;
    this.ngForm.controls["variety_name"].setValue(this.verietyName)

  }


  getVarietyName(newValue) {
    let searchFilters;
    let results;
    // if(this.isEdit){
    //   this.crop_code = newValue ;
    // }
    // this.crop_name_id
    // if()
    const res = this.crop_name_list.filter(x => parseInt(x.id) == parseInt(this.crop_name_id));
    searchFilters = {
      "search": {
        'view': this.isView ? this.isView : '',
        "crop_code": this.crop_code ? this.crop_code : newValue,
        "season": this.ngForm.controls["season"].value,
        "year": this.ngForm.controls["year_of_indent"].value,
      }
    };

    // const route = "get-crop-indenting-variety-list";
    const route = "get-assign-indenter-variety-data";

    const result = this.breederService.postRequestCreator(route, null, searchFilters).subscribe(data => {
      this.VarietyNameDataList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

    })
  }

  checkAlreadyExistData() {

    this.dataExist = false
    let route = "check-breeder-submission-data";
    const submissionid = this.route.snapshot.paramMap.get('submissionId');

    let data = {
      search: {
        id: submissionid ? submissionid : '',
        production_center_id: parseInt(this.ngForm.controls['breeder_production_center'].value),
        // variety_id: this.verietyId ? this.verietyId : '',
        variety_data: this.ngForm.controls['variety_name'].value,
        season: this.ngForm.controls['season'].value,
        yearOfIndent: this.ngForm.controls['year_of_indent'].value,
        crop_code: this.crop_code,
      }
    }

    this.breederService.postRequestCreator(route, null, data).subscribe((data: any) => {
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
        if (this.isEdit) {
          this.updateForm();
        } else {
          this.postCropData();
        }


      }

    })
  }
  enrollFormSave() {

    this.submitted = true;
    if (this.isEdit || this.isView) {
      this.restService.getAddCropList().subscribe(dataList => {
        if (dataList && dataList.length > 0) {
          const foundData = dataList.filter((x: any) => x.id == this.submissionid);
          // this.patchForm(foundData);
        }
      }
      );
    } else {
      this.postCropData();
    }
  }

  cropGroup(item: any) {
    this.selectCrop = item.group_name;
    this.groupCode = item.group_code
    this.ngForm.controls['crop_group'].setValue(this.selectCrop);
    this.ngForm.controls['group_code'].setValue(this.selectCrop);

  }

  cropname(item: any) {
    this.selectCropName = item.crop_name;
    this.ngForm.controls['crop_name'].setValue(this.selectCropName)
  }

  cgClick() {
    document.getElementById('crop_name').click();
  }

  cnClick() {
    document.getElementById('breeder_production_center').click();
  }

  cnameClick() {
    document.getElementById('crop_name').click();
  }

  varietyClick() {
    document.getElementById('variety_name').click();
  }

  getCropName(item) {
    // const route = "get-crop-name";
    const route = "get-crop-assign-indenter-data";
    const param = {
      search: {
        season: this.ngForm.controls["season"].value,
        year: this.ngForm.controls["year_of_indent"].value,
        view: this.isView ? this.isView : ''
      }
    }
    const result = this.breederService.postRequestCreator(route, null, param).forEach((data: any) => {
      let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      this.crop_name_list = response;
      this.crop_name_list_second = this.crop_name_list;
      if (this.router.url.includes('edit')) {
        // this.group_code = this.crop_name_list.group_code;

        const res = this.crop_name_list.filter(x => parseInt(x.m_crop_id) == parseInt(this.ngForm.controls["crop_name"].value));

        this.getVarietyName(res[0].crop_code)
      }
    });
  }
  resetFieldYear(){
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['season'].setValue('');
    this.ngForm.controls['crop_name_text'].setValue('');
  }
  resetFieldSeason(){
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['crop_name_text'].setValue('');
  }

   cropNames(data){
      this.ngForm.controls['variety_name'].setValue('');
    this.crop_names= data  && data.crop_name  ? data.crop_name  :'';
    this.ngForm.controls['crop_name_text'].setValue('')
    this.ngForm.controls['crop_name'].setValue(data && data.crop_code ? data.crop_code :'')
    this.cropNameId = data && data.m_crop_id ? data.m_crop_id :'' ;
    this.cropCodeDta = data && data.crop_code ? data.crop_code :'';

  }
  async getAgencyName() {
    const route = 'view-indentor-breeder';
    let data = {
      search: {
        id: this.userId.id ? this.userId.id : '',
        year:this.ngForm.controls['year_of_indent'].value,
        season:this.ngForm.controls['season'].value,
        crop_code:this.ngForm.controls['crop_name'].value,
      }
    }
    const result = await this.breederService.postRequestCreator(route, null, data).forEach((data: any) => {
      const response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      this.breederproductionList = response;
      this.breederproductionListsecond = this.breederproductionList ? this.breederproductionList :''
      // const res = [];
      // const result = this.breederproductionList.filter((thing, index, self) =>
      //   index === self.findIndex((t) => (
      //     t.agency_name === thing.agency_name
      //   ))
      // )
      // this.breederproductionList = result;

    })
  }

  async getGroupName(newValue: any) {
    const searchFilters = {
      "search": {
        "group_code": newValue
      }
    };
    this.service
      .postRequestCreator("crop-group", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            let response = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : '';
            this.crop_name_list = response;
            // if(this.data){
            this.gpName = (this.data.group_name);
            // }
          }
        }
      });
  }

  async getDynamicCropCode(newValue: any) {
    const searchFilters = {
      "search": {
        "group_code": newValue
      }
    };
    this.breederService
      .postRequestCreator("get-dynamic-crop-code", null, searchFilters)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse.EncryptedResponse.data.length > 0) {
            this.data = apiResponse.EncryptedResponse.data[0];


            if (this.data.crop_code) {
              if (this.data.crop_code[1] == 0) {
                this.cropCode = (this.data.crop_code).replace(/(\d+)$/, function (match, n: number) {
                  return ++n;
                });
                this.cropCode = this.cropCode.substring(0, 1) + "0" + this.cropCode.substring(1, this.cropCode.length);
                this.ngForm.controls['crop_code'].setValue(this.cropCode);
              } else {
                this.cropCode = (this.data.crop_code).replace(/(\d+)$/, function (match, n: number) {
                  return ++n;
                });
                this.ngForm.controls['crop_code'].setValue(this.cropCode);
              }
            }
          } else {
            this.cropCode = ((newValue) + '001');
            this.ngForm.controls['crop_code'].setValue(this.cropCode);
            // this.ngForm.controls['crop_code'].patchValue(this.cropCode);
          }
        }
      });
  }
 
  breederProductionsData(data){
    this.breeder_production_name = data  && data.agency_name  ? data.agency_name:'';
    this.ngForm.controls['breeder_production_center'].setValue(data  && data.id  ? data.id:'')
    this.ngForm.controls['breeder_production_center_text'].setValue('',{ emitEvent: false })
  }
  postCropData() {
    if (this.ngForm.invalid) {
      return;
    }
    const route = "get-add-crop-details";
    let crop_id= this.crop_name_list &&  this.crop_name_list[0] &&  this.crop_name_list[0].m_crop_id ?  this.crop_name_list[0].m_crop_id :'';
    let group_code= this.crop_name_list &&  this.crop_name_list[0] &&  this.crop_name_list[0].group_code ?  this.crop_name_list[0].group_code :'';
    const data = {
      crop_name_id:  this.cropNameId,
      // group_code: this.ngForm.controls['crop_group'].value,
      production_center_id: parseInt(this.ngForm.controls['breeder_production_center'].value),
      variety: this.verietyName ? this.verietyName : '',
      crop_code: this.ngForm.controls['crop_name'].value,
      variety_id: this.verietyId ? this.verietyId : '',
      crop_group_code: group_code ? group_code :'' ,
      user_id: this.userId.id ? this.userId.id : '',
      season: this.ngForm.controls['season'].value, 
      yearOfIndent: this.ngForm.controls['year_of_indent'].value,
      // crop_group: this.ngForm.controls["crop_group"].value,
      production_center_name: '',
      variety_data: this.ngForm.controls['variety_name'].value
      //   this.crop_code=data[0].crop_code;
      // this.crop_group
    }

    this.breederService.postRequestCreator(route, null, data).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        // this.submitBtnDisable = true;
        Swal.fire({
          title: '<p style="font-size:25px;">Varieties Have Been Successfully Assigned For Production.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {
          this.router.navigate(['/add-breeder-crop-list']);
        })
      }
      else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 401) {
        // this.submitBtnDisable = true;
        Swal.fire({
          title: '<p style="font-size:25px;">Data Already Exists.</p>',
          icon: 'warning',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {
          // this.router.navigate(['/add-breeder-crop-list']);
          // this.submitBtnDisable = true;
        })
      }
      else {
        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
    });
    // this.router.navigate(['/add-breeder-crop-list']);
  }
  resetField() {
    this.ngForm.controls["variety_name"].setValue("")
    this.variety_name = '';
    this.ngForm.controls["breeder_production_center"].setValue('')
  }

  updateForm() {

    let cropDatadata = this.crop_name_list.filter((data) => parseInt(data.m_crop_id) === parseInt(this.ngForm.controls['crop_name'].value));
    let crop_code_value = cropDatadata && cropDatadata[0] && cropDatadata[0].crop_code ? cropDatadata[0].crop_code : '';

    const submissionid = this.route.snapshot.paramMap.get('submissionId');
    if (this.ngForm.invalid) {
      return;
    }
    // this.cropNameId
    const route = "get-add-crop-details";
    const data = {
      id: this.submissionid,
      crop_name_id:this.cropNameId ? this.cropNameId:  this.ngForm.controls['crop_name'].value,
      production_center_id: parseInt(this.ngForm.controls['breeder_production_center'].value),
      variety: (this.ngForm.controls['variety_name'].value),
      crop_code: this.cropCodeDta ? this.cropCodeDta :crop_code_value,
      crop_group_code: this.crop_group ? this.crop_group : this.group_code,
      variety_data: (this.ngForm.controls['variety_name'].value),
      production_center_name: '',
      season: this.ngForm.controls['season'].value,
      yearOfIndent: this.ngForm.controls['year_of_indent'].value,
    }

    this.breederService.postRequestCreator(route + "/" + submissionid, null, data).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        // this.submitBtnDisable = true;
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {

          this.router.navigate(['/add-breeder-crop-list']);
        })
      }
      else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 401) {
        // this.submitBtnDisable = true;
        Swal.fire({

          title: '<p style="font-size:25px;">Data Already Exists.</p>',
          icon: 'warning',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {
          // this.router.navigate(['/add-breeder-crop-list']);
          // this.submitBtnDisable = true;
        })
      }
      else {

        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }

    });
    // this.router.navigateByUrl('/add-crop-list')
  }
}
