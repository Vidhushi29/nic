import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from '../services/master/master.service';


@Component({
  selector: 'app-bsp-one-second',
  templateUrl: './bsp-one-second.component.html',
  styleUrls: ['./bsp-one-second.component.css']
})
export class BspOneSecondComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  varietyNames;
  ngForm: FormGroup = new FormGroup([]);
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  is_developed: boolean;
  is_update: boolean = false;
  selectedCrop;
  isCrop: boolean = false;
  designation;
  agency = [
  ]
  isSearch: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  varietyList = [];
  varietyDisbled: boolean = true;
  isDeveloped: boolean = false;
  inventoryData = [
    { "id": 1, "year": "b", "season": "a", "crop": "b", "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 2, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 3, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 4, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 5, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 6, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 7, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    { "id": 8, "variety_name": "PW-248", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" }
  ];
  inventoryYearData: any;
  inventorySeasonData: any;
  inventoryCropData: any;
  inventoryVarietyData: any;
  datatodisplay = [];
  showTab = false;
  editMode = false;
  bsp1Arr: any;
  inventoryCropDatasecond: any;
  stateList = [];
  selectState;
  stateListSecond: any = [];
  selectDistrict;
  selected_state;
  designationList: any;
  districtList = [];
  districtListsecond;
  stateSecond = [];
  editId: any;
  listofDistrict: any;
  district_id: any;
  agencylist: any;
  searchElement;
  stateListForNestedAraay;
  stateListForNestedAraaySecond;
  currentArray: any;
  stateSelect = false;
  dataToShow: any = [];
  // team_array = [
  //   { "id": 1, "name": "up-001-1" },
  //   { "id": 2, "name": "up-001-2" },
  //   { "id": 3, "name": "up-001-3" },
  // ]
  is_radioBtn: boolean = false;
  isVisible: boolean = false;
  monitoringTeamName: any;
  userData: any;
  isSame: boolean;
  teamNameNew: any;
  uniqueMonitoringTeamName: any;
  isAddModre: boolean = true;
  bsp1Arrs: any;
  stateListData: any;
  selectedCrop2: any;
selectAgency: any;

  constructor(private service: SeedServiceService, private breeder: BreederService, private fb: FormBuilder, private master: MasterService) {
    this.createForm();
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      crop: [''],
      variety: [''],
      team_name: [''],
      state_text: [''],
      state: [''],
      crop_text: [''],
      is_developed: [''],
      district_text: [''],
      state_text_nested: [''],
      
      bsp1Arr: this.fb.array([
        this.bsp2arr(),
      ], Validators.required),
    });

    // this.ngForm.disable();
    // this.ngForm.controls['season'].disable();
    this.ngForm.controls['year'].enable();
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.getSeasonData();
        // this.ngForm.controls['season'].enable();
        // this.ngForm.controls['crop_text'].disable();
        // this.ngForm.controls['state_text'].disable();
        // this.allData = []
        this.ngForm.controls['state'].setValue("",{ emitEvent: false });
        this.ngForm.controls['crop'].setValue('',{ emitEvent: false });
        this.selectedCrop='';    
        this.selectedCrop2="";    
        this.selected_state = '';
        const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
        const controlToKeep = myFormArray.at(0);
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('', { emitEvent: false })
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('', { emitEvent: false })
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('', { emitEvent: false })
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('', { emitEvent: false })
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true, { emitEvent: false })
        this.ngForm.controls['is_developed'].setValue('no',{ emitEvent: false });
        this.isAddModre = true;
        
        this.editMode=false;
        myFormArray.clear();
        myFormArray.push(controlToKeep);
        // this.clearForm();
        // this.ngForm.controls['is_developed'].setValue('');
        this.ngForm.controls['team_name'].setValue('', { emitEvent: false });
       
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.inventoryCropData = this.inventoryCropDatasecond
        let response = this.inventoryCropData.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.inventoryCropData = response;
        this.ngForm.controls['state'].setValue('');
        this.selected_state = ''
      }
      else {
        this.getCropData()
      }
    });
    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()))
        this.stateList = response;
        console.log('state_text', newValue);
      }
      else {
        this.getStatelist()
      }
    });
    this.ngForm.controls['state_text_nested'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('newValue state_text_nested', newValue);
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().includes(newValue.toLowerCase()))
        this.stateList = response;
      }
      else {
        this.getStatelist()
      }
    });

    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.districtList = this.districtListsecond
        let response = this.districtList.filter(x => x.district_name.toLowerCase().includes(newValue.toLowerCase()))
        this.districtListsecond = response;
        console.log('district_text', this.districtListsecond)
      }
      else {
        this.getStatelist()
      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.allData = [];
        // this.ngForm.controls['crop_text'].disable();
        // this.ngForm.controls['state_text'].disable();
        this.ngForm.controls['crop'].setValue('');
        this.selectedCrop = '';
        this.selectedCrop2=""; 
        this.getCropData();

        this.ngForm.controls['state'].setValue('');
        this.selected_state = '';
        // this.selectedCrop='';
        this.ngForm.controls['crop'].enable();
        const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
        const controlToKeep = myFormArray.at(0);
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
        this.ngForm.controls['is_developed'].setValue('no');
        this.ngForm.controls['team_name'].setValue('')
        this.isAddModre = true;
        this.editMode=false;
        myFormArray.clear();
        myFormArray.push(controlToKeep);
        // this.clearForm();
        // this.ngForm.controls['is_developed'].setValue('');
        // this.ngForm.controls['team_name'].setValue('');
       
      }
    });
    this.ngForm.controls['state'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        // this.editMode=false;
        const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
        const controlToKeep = myFormArray.at(0);
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
        this.ngForm.controls['is_developed'].setValue('no');
        this.ngForm.controls['team_name'].setValue('')
        // this.isAddModre = true;
        this.editMode=false;
        myFormArray.clear();
        myFormArray.push(controlToKeep);
        // this.clearForm();
        // this.ngForm.controls['is_developed'].setValue('');
        // this.ngForm.controls['team_name'].setValue('');
        this.is_update=false;
        this.allData = []

      }
    });

    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.isCrop = false;
        this.allData = []
        this.ngForm.controls['state'].setValue('');
        this.selected_state = ''
        this.ngForm.controls['variety'].enable();
      
        // this.clearForm();
        // this.ngForm.controls['is_developed'].setValue('');
        // this.ngForm.controls['team_name'].setValue('');
        this.getVarietyData();
        const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
        const controlToKeep = myFormArray.at(0);
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('')
        this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
        this.ngForm.controls['is_developed'].setValue('no');
        this.ngForm.controls['team_name'].setValue('')
        this.isAddModre = true;
        this.editMode=false;
        myFormArray.clear();
        myFormArray.push(controlToKeep);
      }
    });

    this.ngForm.controls['team_name'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.editMode=false;
        this.is_update=false
        if (newvalue == "other") {
          this.checkMonitoringTeamNameUniqueness();
          const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
          const controlToKeep = myFormArray.at(0);
          this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
          this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
          this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
          this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('')
          this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
          this.ngForm.controls['is_developed'].setValue('no');
          this.isAddModre = true;
          myFormArray.clear();
          myFormArray.push(controlToKeep);
          this.isVisible = true;
          this.is_radioBtn = false;
          // this.ngForm.controls['is_developed'].setValue('');
          // this.ngForm.controls['team_name'].setValue('');
          this.itemsArray.enable();
        } else {
          // console.log("ssss", newvalue);
          // this.notifiedvalue('yes');
          // document.getElementById('isSameTeam').click
          let teaName = this.monitoringTeamName.filter(ele => ele.id == newvalue);
          // console.log('teaName==', teaName);
          this.teamNameNew = teaName && teaName[0] && teaName[0].name ? teaName[0].name : newvalue;
          // this.ngForm.controls['team_name'].patchValue(newvalue);
          this.is_radioBtn = true;
          this.isVisible = false;
          this.ngForm.controls['is_developed'].setValue('yes');
          this.notifiedvalue('yes');
          this.getData((newvalue), 'saveMode');
          // 


        }
      }
    });

  }

  ngOnInit(): void {
    this.fetchData();
    this.itemsArray.disable();
    this.isDeveloped = true;
    this.isSearch = false;
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);

    this.userData = data;
  }

  nsetedStateList(event) {
    console.log('event=====', event);
  }

  fetchData() {
    this.getDesignationList(0)
    this.getStatelist();
    this.getYearData();
    this.getAgency(0);
    // this.getAllMonitoringTeamName();
    // this.getPageData();
    this.dropdownSettings = {
      idField: 'variety_id',
      textField: 'variety_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      itemsShowLimit: 2,
      limitSelection: -1,
    };
  }

  getYearData() {
    const route = "get-year-assign-indenter-data";
    this.breeder.postRequestCreator(route, null, null).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryYearData = data.EncryptedResponse.data
      }
    })
  }

  getSeasonData() {
    const route = "get-season-assign-indentor-data";
    this.master.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventorySeasonData = data.EncryptedResponse.data
      }
    })
  }

  getCropData() {
    const route = "get-crop-indentor-data";
    this.master.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code === 200) {
        this.inventoryCropData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
        this.inventoryCropDatasecond = this.inventoryCropData
      }
    })
  }

  getVarietyData() {
    const route = "get-assign-indenter-variety-data";
    this.breeder.postRequestCreator(route, null, {
      search: {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "user_type": "bspc"
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.inventoryVarietyData = data.EncryptedResponse.data
      }
    })
  }
  getAllMonitoringTeamName() {
    const route = "get-all-monitoring-team-name";
    this.master.postRequestCreator(route, null, {
      search: {
        // "year": this.ngForm.controls['year'].value,
        // "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        'state_code': this.ngForm.controls['state'].value,
        'is_active': 1
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.monitoringTeamName = data.EncryptedResponse.data
      }
    })
  }
  checkMonitoringTeamNameUniqueness() {
    const route = "check-monitoring-team-name-uniqueness";
    this.master.postRequestCreator(route, null, {
      search: {
        // "year": this.ngForm.controls['year'].value,
        // "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        'state_code': this.ngForm.controls['state'].value,
        'is_active': 1
      }
    }).subscribe(data => {
      if (data.EncryptedResponse.status_code === 200) {
        this.uniqueMonitoringTeamName = data.EncryptedResponse.data;
        let stateData = this.stateList.filter(ele => ele.state_code == this.ngForm.controls['state'].value);
        let originalString = this.uniqueMonitoringTeamName && this.uniqueMonitoringTeamName.name ? this.uniqueMonitoringTeamName.name : '';
        const parts = originalString.split('-');
        console.log('parts===', parts);
        let lastValue = parseInt(parts[parts.length - 1]);
        console.log('lastValue===', lastValue);
        let generateTeamName = stateData[0].state_short_name + '-' + (this.userData.code ? this.userData.code : '00') + '-' + ((lastValue ? lastValue : 0) + 1);
        this.teamNameNew = generateTeamName ? generateTeamName : '';
        // this.
        // if (lastValue && (this.userData && this.userData.code)) {
        //   if (generateTeamName) {
        //   }
        // } else {
        //   this.teamNameNew = stateData[0].state_short_name + '-' + (this.userData.code ? this.userData.code : '00') + '-' + 1;
        // }
      }
      console.log('generateTeamName', this.teamNameNew);
    })
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    // if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop'].value) {
    // Swal.fire({
    // toast: false,
    // icon: "warning",
    // title: "Please Select All Required Field",
    // position: "center",
    // showConfirmButton: true,
    // showCancelButton: false,
    // confirmButtonText: "Yes",
    // cancelButtonText: "No",
    // })
    // } else {
    this.isSearch = false;
    this.varietyDisbled = false;

    let varietyCodeArr = [];

    this.master.postRequestCreator("get-team-monitoring-data", null, {
      page: loadPageNumberData,
      // pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      pageSize: 50,
      search: {
        crop_codes: this.ngForm.controls['crop'].value,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        state: this.ngForm.controls['state'].value,
        // idArr:ids && (ids.length>0) ? ids:''
        // user_id: this.userId.id
      }
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        this.allData = this.inventoryData;
        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 2, true);

        // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });
    // }
  }

  notifiedvalue(value) {
    if (value == "yes") {
      this.isSame = true;
      this.isAddModre = false;
      this.isVisible = true;
      this.getDatas();
      this.itemsArray.disable();
      // this.ngForm.controls['bsp1Arr'].disable;
    } else {
      this.checkMonitoringTeamNameUniqueness();
      this.isVisible = true;
      this.is_radioBtn = false;
      this.itemsArray.enable();
      this.editMode = false;
      this.itemsArray.enable();
      this.isVisible = true;
      this.isAddModre = true;
      this.isSame = true;
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

  revertDataCancelation() {
    this.ngForm.controls['year'].patchValue('');
    this.ngForm.controls['season'].patchValue('');
    this.ngForm.controls['crop'].patchValue('');
    this.ngForm.controls['variety'].patchValue('');

    this.ngForm.disable();
    this.ngForm.controls['year'].enable();
    this.isCrop = false;
    this.is_update = false;
    this.isSearch = true;
    this.isDeveloped = false;
  }

  editFunctinality(data) {
    this.is_update = true;
    if (data) {
      console.log("data", data);
      this.ngForm.controls['year'].patchValue(data.year);
      this.ngForm.controls['season'].patchValue(data.year);
      this.ngForm.controls['crop'].patchValue(data.year);
      this.ngForm.controls['variety'].patchValue(data.year);

    }
  }

  saveForm() { }

  updateForm() { }

  finalSubmit() {
    console.log("final submit");
  }
  bsp2arr() {
    let temp = this.fb.group({
      designation: ['', [Validators.required]],
      type_of_agency: ['', [Validators.required]],
      district: [''],
      state: ['', [Validators.required]],
      districtData_text: [''],
      stateData_text: [''],
      district_text: [''],
      district_texts: [''],
      state_text_nested: [''],
      agency_text_nested:[''],
      designation_text_nested:[''],
      showstatus: [true]
    });
    return temp;
    // this.ngForm.controls[]
  }

  getItems(form) {
    return form.controls.bsp1Arr.controls;
  }

  addMore(i) {
    this.ngForm.controls['bsp1Arr']['controls'][i].controls['showstatus'].setValue(false);
    this.itemsArray.push(this.bsp2arr());
    let datas= this.ngForm.value && this.ngForm.value['bsp1Arr'] ?  this.ngForm.value['bsp1Arr'] :'';
    if(datas && datas.length>1){
      datas.forEach((el,i)=>{
        this.getAgency(i);
        this.getDesignationList(i);
      })
    }

    console.log(datas,'daaaaa') 
  }

  remove(rowIndex: number) {
    this.itemsArray.removeAt(rowIndex);
  }

  get itemsArray() {
    return <FormArray>this.ngForm.get('bsp1Arr');
  }
  get items(): FormArray {
    return this.ngForm.get('bsp1Arr') as FormArray;
  }
  Save(item) {
    this.isCrop = false;
    this.is_update = false;
    this.showTab = true;
    this.datatodisplay.push(item)

    for (let item of this.datatodisplay) {
      item.totalbsp1 = item.bsp1Arr.length;
    }
    //     const mergedData = {};

    //     // Combine objects based on 'id' and 'type'
    //     for (const obj of this.datatodisplay) {
    //       const year = obj.year;
    //       const season = obj.season;
    //       const crop = obj.crop;
    //       const key = `${year}-${season}-${crop}`;

    //       if (!mergedData[key]) {
    //         // If the id and type combination doesn't exist in the merged object, create a new entry
    //         mergedData[key] = { ...obj, bsp1Arr: [obj.bsp1Arr] };
    //       } else {
    //         // If the id and type combination exists, merge the 'details' array
    //         mergedData[key].bsp1Arr.push(...obj.bsp1Arr);
    //       }
    //     }

    //     // Convert the merged object back into an array
    //     const mergedArray = Object.values(mergedData);
    //     this.datatodisplay = mergedArray;
    //     if (this.datatodisplay && this.datatodisplay.length > 1) {

    //  for (let item of this.datatodisplay) {
    //       item.totalbsp1 = item.bsp1Arr.flat();
    //     }

    //     }
    // for (let item of this.datatodisplay) {
    //   item.totalbsp1 = item.bsp1Arr.length;
    // }
    const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
    const controlToKeep = myFormArray.at(0);
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
    myFormArray.clear();
    myFormArray.push(controlToKeep);
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  patchValue(item, i) {
    this.editMode = true;
    this.bsp1Arr = item.bsp1Arr

  }
  cClick() {
    document.getElementById('crop').click();
  }
  crop(item) {
    this.selectedCrop = item && item.crop_name ? item.crop_name : '';
    this.selectedCrop2=item && item.crop_name ? item.crop_name : '';
    this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
    this.inventoryCropData = this.inventoryCropDatasecond
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
  }
  getStatelist() {
    const param={
      is_state:1
    }
    // get-state-list-v2
    this.master.postRequestCreator('get-all-state-list-data', null,param).subscribe(data => {
      this.stateList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.stateListSecond = this.stateList

      this.stateListData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.stateListForNestedAraay = this.stateList ? this.stateList : '';
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;

      this.stateListForNestedAraaySecond = this.stateListForNestedAraay ? this.stateListForNestedAraay : ''

    })
  }
  csClick() {
    document.getElementById('state').click();
  }
  state_select(data) {
    this.selected_state = data && data.state_name ? data.state_name : '';
    this.ngForm.controls['state'].setValue(data && data.state_code ? data.state_code : '')
    this.stateList = this.stateListSecond
    this.stateSelect = true;
    this.ngForm.controls['state_text'].setValue('', { emitEvent: false })
  }
  getDesignationList(i) {
    this.master.postRequestCreator('get-designation-of-spp', null, {
      type: "MONITORING_TEAM"
    }).subscribe(data => {
      this.designationList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;
      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls']
      && formArray.controls[i]['controls'].designation

      // && formArray.controls[i]['controls'].total_quantity.controls[skillIndex].controls.stage

    ) {
      formArray.controls[i]['controls'].designation.designationList = this.designationList ? this.designationList : '';
      formArray.controls[i]['controls'].designation.designationListSecond = this.designationList ? this.designationList : ''
      // formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage.stageList = response ? response : []
    }
    })
  }
  agncyData(data,index){
    console.log(data, 'stateData')
    data.agency_name= data && data.name ? data.name  :'';
    data.agency_type_id= data && data.id ? data.id :'';
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['type_of_agency'].setValue(data);

    // this.ngForm.controls['bsp1Arr']['controls'][index].controls['type_of_agency'].setValue(data);
    
    // this.ngForm.controls['bsp1Arr']['controls'][index].controls['stateData_text'].setValue('');
    // this.ngForm.controls['bsp1Arr']['controls'][index].controls['district'].setValue('');
    this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].agency_text_nested.setValue('')
    // let stateId = data && data.state_code ? data.state_code : ''
  }
  desigationData(data,index){
    console.log(data, 'stateData')
    data.designation_name = data && data.name ? data.name :'';
    data.desination_id= data && data.id ? data.id :'';
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['designation'].setValue(data);

    // this.ngForm.controls['bsp1Arr']['controls'][index].controls['type_of_agency'].setValue(data);
    this.getStatelistSecond(index)
    
    // this.ngForm.controls['bsp1Arr']['controls'][index].controls['stateData_text'].setValue('');
    // this.ngForm.controls['bsp1Arr']['controls'][index].controls['district'].setValue('');
    this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].designation_text_nested.setValue('')
    // let stateId = data && data.state_code ? data.state_code : ''
  }
  stateData(data, index, $event) {
    console.log(data, 'stateData')
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['state'].setValue(data);
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['stateData_text'].setValue('');
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['district'].setValue('');
    this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].state_text_nested.setValue('')
    let stateId = data && data.state_code ? data.state_code : ''
    this.getDistrictList(stateId ? stateId : '', index)
    // this.varietyId = data && data.id ? data.id : ''
  }
  district(data, index, $event) {
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['district'].setValue(data);
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['districtData_text'].setValue('');
    // let stateId = data && data.state_code ? data.state_code :''
  }
  csStateClick(i) {
    document.getElementById('states' + i).click();

  }
  csdesignationClick(i){
    document.getElementById('designation' + i).click();

  }
  cdClick(i) {
    document.getElementById('district' + i).click();

  }

  getDistrictList(newValue, i) {
    const param = {
      search: {
        state_code: newValue
      }
    }
    this.master.postRequestCreator('get-district-list', null, param).subscribe(data => {
      this.districtList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.districtListsecond = this.districtList;
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;

      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls']
        && formArray.controls[i]['controls'].district

        // && formArray.controls[i]['controls'].total_quantity.controls[skillIndex].controls.stage

      ) {
        formArray.controls[i]['controls'].district.distictList = this.districtList ? this.districtList : '';
        formArray.controls[i]['controls'].district.distictListSecond = this.districtList ? this.districtList : ''
        // formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage.stageList = response ? response : []
      }


    })
  }
  getDistrictListSecond(newValue) {
    const param = {
      search: {
        state_code: newValue
      }
    }
    this.master.postRequestCreator('get-district-list', null, param).subscribe(data => {
      this.listofDistrict = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
    })
  }
  save(item) {
    let isSubmit = true;

    this.is_update = false;
    if ((!this.ngForm.controls["year"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop"].value
      && !this.ngForm.controls["state"].value && !this.ngForm.controls["team_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["season"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["crop"].value
      && !this.ngForm.controls["state"].value && !this.ngForm.controls["team_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["state"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select State.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })
      return;
    }
    if ((!this.ngForm.controls["team_name"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Enter Team Name.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D'
      })

      return;
    }
    else {

      console.log('item.bsp1Arr=', item.bsp1Arr, this.ngForm.value);
      if (this.bsp1Arrs && this.bsp1Arrs.length > 0 && item && !item.bsp1Arr) {
        let arr = this.bsp1Arrs.map((item, i) => {
          return {
            ...item,
            state: {
              "state_code": item.state_code,
              "state_name": item.state_name
            },
            district: {
              "district_code": item.district_code,

            }



          }
        })
        console.log(arr, 'arr')
        this.bsp1Arrs.forEach((el, i) => {
          // el['state']['state_code']= el.state_code;
          // el.state.state_code= el.state_code;
          el.type_of_agency = el && el.agency_type_id ? el.agency_type_id : '';
          el.designation = el && el.desination_id ? el.desination_id : '';

        })
        item.bsp1Arr = arr ? arr : '';
      }

      item.bsp1Arr.forEach((el, i) => {
        console.log('el', el);
        // || el.district == ''
        if (el.designation == '' || el.state == '' || el.type_of_agency == '') {
          Swal.fire({
            title: '<p style="font-size:25px;">Please Fill the Form Correctly.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          })
          isSubmit = false;
          return;
        }

        if (this.ngForm.controls['bsp1Arr']['controls'][i].status == 'INVALID') {
          Swal.fire({
            title: '<p style="font-size:25px;">Please Fill the Form Correctly.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#B64B1D'
          })
          return 0;
        }
      })

      if (isSubmit) {
        // else {
        let localData = localStorage.getItem('BHTCurrentUser');
        let data = JSON.parse(localData)
        let user_id = data && data.id ? data.id : '';
        item.user_id = user_id ? user_id : '';
        if (this.ngForm.controls['is_developed'].value != 'no') {
          item.id = this.editId ? this.editId : '';
          item.is_same = this.isSame;
        }
        item.team_name_new = this.teamNameNew ? this.teamNameNew : '';
        // this.searchElement = false;
        let value = []

        if (this.editMode) {
          item.id = this.editId ? this.editId : '';
          item.bsp1Arr.forEach((el,i)=>{

            el.designation= el && el.designation && el.designation.desination_id  ?el.designation.desination_id :el && el.designation ? el.designation:'';
            el.type_of_agency= el &&  el.type_of_agency && el.type_of_agency.agency_type_id  ? el.type_of_agency.agency_type_id  : el && el.type_of_agency ? el.type_of_agency:'';
          })
          this.master.postRequestCreator('update-team-monitoring', null, item).subscribe(data => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
              Swal.fire({
                toast: false,
                icon: "success",
                title: "Data Updated Successfully",
                position: "center",
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonColor: '#B64B1D',
                allowOutsideClick: false
              }).then(x => {
                if (x.isConfirmed) {
                  item.district = item && item.district && item.district.district_code ? item.district.district_code : ''
                  item.state = item && item.state && item.state.state_code ? item.state.state_code : ''
                  let val = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
                  // this.datatodisplay = val
                  this.ngForm.controls['is_developed'].setValue('');
                  this.is_radioBtn = false;
                  this.itemsArray.enable();
                  this.isAddModre = true;
                  // console.log(this.ngForm.value)
                  this.showTab = true;
                  if (this.searchElement) {
                    if (!this.stateSelect) {
                      this.ngForm.controls['state'].setValue('');
                      this.selected_state = '';
                    }
                    // this.ngForm.controls['state'].setValue('', { emitEvent: false })

                  } else {
                    this.datatodisplay = val
                  }

                  this.getAllMonitoringTeamName();
                  // this.checkMonitoringTeamNameUniqueness();
                  this.search(null)
                  // if(this.searchElement){

                  // }else{
                  //   this.datatodisplay=this.dataToShow;
                  //   let ids=[]
                  //   this.dataToShow.forEach(el=>{
                  //     ids.push(el && el.id?el.id :'')
                  //   })
                  //   this.search(ids)
                  // }
                  // this.ngForm.controls['year'].setValue('', { emitEvent: false });
                  // this.ngForm.controls['season'].setValue('', { emitEvent: false })
                  // this.ngForm.controls['crop'].setValue('', { emitEvent: false })
                  // this.ngForm.controls['state'].setValue('', { emitEvent: false })
                  this.ngForm.controls['team_name'].setValue('', { emitEvent: false })

                  const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
                  const controlToKeep = myFormArray.at(0);
                  this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
                  this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
                  this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
                  this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('')
                  this.ngForm.controls['bsp1Arr']['controls'][0]['controls']['district_text'].setValue('')
                  this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
                  myFormArray.clear();
                  myFormArray.push(controlToKeep);
                  this.editMode = false;
                  for (let item of this.datatodisplay) {
                    item.totalbsp1 = item.bsp1Arr.length;
                  }
                }


              })
            } else {
              Swal.fire({
                toast: false,
                icon: "error",
                title: "Something Went Wrong",
                position: "center",
                showConfirmButton: true,
                showCancelButton: false,
                allowOutsideClick: false

              })
            }

          })
        } else {
          
          let bsp1Arr = item && item.bsp1Arr ? item.bsp1Arr :'';
          item.bsp1Arr.forEach((el,i)=>{

           
            el.designation= el && el.designation && el.designation.desination_id  ?el.designation.desination_id :el && el.designation ? el.designation:'';
            el.type_of_agency= el &&  el.type_of_agency && el.type_of_agency.agency_type_id  ? el.type_of_agency.agency_type_id  : el && el.type_of_agency ? el.type_of_agency:'';
          })
          console.log(item,'item')
   
          // alert("save mode");
          this.master.postRequestCreator('create-team-monitoring', null, item).subscribe(data => {
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
              Swal.fire({
                toast: false,
                icon: "success",
                title: "Data Saved SuccessFully",
                position: "center",
                showConfirmButton: true,
                showCancelButton: false,
                allowOutsideClick: false,
                confirmButtonColor: '#B64B1D'

              }).then(x => {
                item.district = item && item.district && item.district.district_code ? item.district.district_code : ''
                item.state = item && item.state && item.state.state_code ? item.state.state_code : ''
                let val = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
                this.ngForm.controls['is_developed'].setValue('');
                this.is_radioBtn = false;
                this.itemsArray.enable();
                this.isAddModre = true;
                // this.datatodisplay = val
                // let ids=[];
                // this.dataToShow.push(val)
                // this.dataToShow=this.dataToShow ? this.dataToShow.flat():''
                // console.log(this.dataToShow,'dataToShow')
                // this.datatodisplay = this.dataToShow

                // for combine the data//
                // Combine objects based on 'id' and 'type'
                // for (const obj of datatodisplays) {
                //   const year = obj.year;
                //   const season = obj.season;
                //   const crop = obj.crop;
                //   const key = `${year}-${season}-${crop}`;

                //   if (!mergedData[key]) {
                //     // If the id and type combination doesn't exist in the merged object, create a new entry
                //     mergedData[key] = { ...obj, bsp1Arr: [obj.bsp1Arr] };
                //   } else {
                //     // If the id and type combination exists, merge the 'details' array
                //     mergedData[key].bsp1Arr.push(...obj.bsp1Arr);
                //   }
                // }
                // Convert the merged object back into an array

                // this.datatodisplay=responseData;
                // this.search()
                // console.log(responseData,'responseData',datatodisplays)
                // const mergedArray = Object.values(mergedData);
                // // console.log(mergedArray,)
                // datatodisplays = mergedArray;
                this.getAllMonitoringTeamName();
                this.checkMonitoringTeamNameUniqueness();
                this.search(null)
                this.showTab = true;
                const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
                const controlToKeep = myFormArray.at(0);
                this.ngForm.controls['team_name'].setValue('', { emitEvent: false });
                this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
                this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
                this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
                this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('');
                this.ngForm.controls['bsp1Arr']['controls'][0]['controls']['district_text'].setValue('');
                this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
                myFormArray.clear();
                myFormArray.push(controlToKeep);
                for (let item of this.datatodisplay) {
                  item.totalbsp1 = item.bsp1Arr.length;
                }

              })
            } else {
              Swal.fire({
                toast: false,
                icon: "error",
                title: "Something Went Wrong",
                position: "center",
                showConfirmButton: true,
                showCancelButton: false,
                allowOutsideClick: false

              })
            }

          })
        }
        // }
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Fill the Form Correctly.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#B64B1D'
        })
      }
    }
    // item.user_id


  }
  cancel() {
    const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
    const controlToKeep = myFormArray.at(0);

    this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
    this.is_update=false;
    myFormArray.clear();
    myFormArray.push(controlToKeep);
    if (this.searchElement) {
      if (!this.stateSelect) {
        this.ngForm.controls['state'].setValue('');
        this.selected_state = '';
      }
      this.ngForm.controls['team_name'].setValue('', { emitEvent: false })
      this.search(null)
    }

    if (this.editMode) {
      if (this.datatodisplay && this.datatodisplay.length > 0) {
        this.showTab = true;
        this.editMode = false;
      }
    }
    if (this.datatodisplay && this.datatodisplay.length > 0) {
      this.showTab = true;
    }
    else {
      this.showTab = false;
    }


    // this.ngForm.controls['bsp1Arr']['controls'][i].controls['showstatus'].setValue(false);
  }
  getStateList(item) {
    let state = this.stateListData.filter(x => x.state_code == item);
    // this.selected_state=state && state[0] && state[0].state_name ? state[0].state_name : ''
    return state && state[0] && state[0].state_name ? state[0].state_name : 'NA'
  }
  getDistrict(item) {
    let district = this.districtList.filter(x => x.district_code == item);
    return district && district[0] && district[0].district_name ? district[0].district_name : 'NA'
  }
  getDesignation(item) {
    let data = this.designationList.filter(x => x.id == item);
    return data && data[0] && data[0].name ? data[0].name : 'NA'
  }
  getAgencyData(item) {
    let data = this.agency.filter(x => x.id == item);
    return data && data[0] && data[0].name ? data[0].name : 'NA'
  }
  getCrop(item) {
    let data = this.inventoryCropData.filter(x => x.crop_code == item);
    this.selectedCrop = data && data[0] && data[0].crop_name ? data[0].crop_name : '';
    return data && data[0] && data[0].crop_name ? data[0].crop_name : 'NA'
  }

  patchValueofArray(res) {
    const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
    const controlToKeep = myFormArray.at(0);
    myFormArray.push(controlToKeep)

  }
  getState(code, res) {
    let state = this.stateList.filter(x => x.state_code == code)
    let arr = []
    arr.push(state)
    state.forEach((el, i) => {
      this.ngForm.controls['bsp1Arr']['controls'][1].controls['state'].patchValue(el);
    })
  }
  getDistrictData(code, res, state_code) {
    // this.getDistrictList(state_code)
    let district = this.districtList.filter(x => x.district_code == code)
    district.forEach((el, index) => {
      this.ngForm.controls['bsp1Arr']['controls'][1].controls['district'].setValue(el);
    })
  }
  getData(id, mode) {

    // this.showTab = true;
    if (mode == 'editMode') {
      this.is_update = true;
      this.editMode = true;
      this.isSame = false;
      this.ngForm.controls['team_name'].setValue(id, { emitEvent: false });
      let teaName = this.monitoringTeamName.filter(ele => ele.id == id);
      console.log('teaName==', teaName);
      this.teamNameNew = teaName && teaName[0] && teaName[0].name ? teaName[0].name : id;
      this.ngForm.controls['is_developed'].setValue('no');
      this.is_radioBtn = false;
      this.isVisible = true;
      // this.ngForm.controls['team_name'].setValue(res && res[0] && res[0].id ? res[0].id : "")
    }
    if (mode == 'saveMode') {
      // alert("save mode");
      this.is_update = false;
      this.editMode = false;
      this.isSame = true;
    }
    const param = {
      search: {
        id: id,
        year: this.ngForm.controls['year'].value,
        season: this.ngForm.controls['season'].value,
        crop: this.ngForm.controls['crop'].value,
        state: this.ngForm.controls['state'].value,
        // isSearch: this.searchElement ? this.searchElement : ''
      }
    }
    this.editId = id ? id : ''
    console.log(this.editId)
    
    this.master.postRequestCreator('get-team-monitoring', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
      let result = res && res[0] && res[0].bsp1Arr ? res[0].bsp1Arr : '';
      let response = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.filteredData ? data.EncryptedResponse.data.filteredData : '';
      for (let i = 1; i <= res.length - 1; i++) {
        this.itemsArray.push(this.bsp2arr());
      }

      if (mode == 'saveMode') {
        // this.ngForm.controls['year'].setValue({ emitEvent: false });
        // this.ngForm.controls['season'].setValue({ emitEvent: false })
        // this.ngForm.controls['crop'].setValue({ emitEvent: false })
      } else {
        this.ngForm.controls['year'].setValue(res && res[0] && res[0].year ? res[0].year : "", { emitEvent: false });
        this.ngForm.controls['season'].setValue(res && res[0] && res[0].season ? res[0].season : "", { emitEvent: false })
        this.ngForm.controls['crop'].setValue(res && res[0] && res[0].crop_code ? res[0].crop_code : "",{ emitEvent: false })
      }
      this.getVarietyData()
      // this.ngForm.controls['year'].setValue(res && res[0] && res[0].year ? res[0].year : "", { emitEvent: false });
      // this.ngForm.controls['season'].setValue(res && res[0] && res[0].season ? res[0].season : "", { emitEvent: false })

      // this.ngForm.controls['crop'].setValue(res && res[0] && res[0].crop_code ? res[0].crop_code : "")
      this.getCrop(res && res[0] && res[0].crop_code ? res[0].crop_code : "")
      this.ngForm.controls['state'].setValue(response && response[0] && response[0].state_id ? response[0].state_id : "",{emitEvent:false})
      this.selected_state = response && response[0] && response[0].state_name ? response[0].state_name : ''
      // this.getStateList(res && res[0] && res[0].state_id ? res[0].state_id : "")

      // this.ngForm.controls['state'].setValue(res && res[0] && res[0].name ? res[0].name : "")
      res.forEach((el, i) => {
        this.getAgency(i)
        this.getDesignationList(i)
        this.ngForm.controls['bsp1Arr']['controls'][i].controls['designation'].patchValue(el);
        this.ngForm.controls['bsp1Arr']['controls'][i].controls['type_of_agency'].patchValue(el);
        this.getStatelistSecond(i)
        this.ngForm.controls['bsp1Arr']['controls'][i].controls['state'].patchValue(el,);
        this.getDistrictList(el.state_code, i)
        this.ngForm.controls['bsp1Arr']['controls'][i].controls['district'].patchValue(el);
        this.ngForm.controls['bsp1Arr']['controls'][i].controls['showstatus'].patchValue(false);
        const lastIndex = res.length - 1
        this.ngForm.controls['bsp1Arr']['controls'][lastIndex].controls['showstatus'].patchValue(true);
      })
      let param = this.ngForm.value ? this.ngForm.value : '';
      param.bsp1Arr = response && response[0] && response[0].bsp1Arr ? response[0].bsp1Arr : '';
      this.bsp1Arrs = response && response[0] && response[0].bsp1Arr ? response[0].bsp1Arr : '';
      param.bsp1Arr.forEach((el, index) => {
        el.type_of_agency = el && el.agency_type_id ? el.agency_type_id : '';
        el.designation = el && el.desination_id ? el.desination_id : '';
      })
      console.log(response, 'responseresponse')
      // this.ngForm.value=2
      this.isCrop = true;
    })
  }
  getDatas() {
    let param = this.ngForm.value ? this.ngForm.value : '';
    param.bsp1Arr = this.bsp1Arrs ? this.bsp1Arrs : '';
    console.log(this.bsp1Arrs, 'bsp1Arrs')

  }
  generateFormArrayData(length: number): any[] {
    const formArrayData = [];
    for (let i = 0; i < length; i++) {
      formArrayData.push(this.bsp2arr()); // Default value can be set here
    }
    return formArrayData;
  }

  getYear(i, event) {
    this.ngForm.controls['bsp1Arr']['controls'][i].controls['state'].valueChanges.subscribe(newValue => {
      this.getDistrictList(event.target.value, i);
      if (newValue) {
      }
    });
  }

  search(ids) {
    this.isCrop = true;
    if ((!this.ngForm.controls["year"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop"].value
    )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D',
        allowOutsideClick: false
      })
      return;
    }
    if ((!this.ngForm.controls["season"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D',
        allowOutsideClick: false
      })
      return;
    }
    if ((!this.ngForm.controls["crop"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#B64B1D',
        allowOutsideClick: false
      })
      return;
    }


    else {
      this.showTab = true;
      this.searchElement = true;
      const param = {
        'search': {
          crop_codes: this.ngForm.controls['crop'].value,
          year: this.ngForm.controls['year'].value,
          season: this.ngForm.controls['season'].value,
          state: this.ngForm.controls['state'].value,
          idArr: ids && (ids.length > 0) ? ids : ''

        }
      }
      this.master.postRequestCreator('get-team-monitoring-data', null, param).subscribe(data => {
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.datatodisplay = res;
        for (let item of this.datatodisplay) {
          item.totalbsp1 = item.bsp1Arr.length;
        }
        this.getAllMonitoringTeamName()
        // this.filterPaginateSearch.Init(this.datatodisplay, this, "getPageData", undefined, 2, true);

        // this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        // this.initSearchAndPagination()
      })
    }
  }
  VarieyName(data, index, $event) {
    this.ngForm.controls['bsp1Arr']['controls'][index].controls['district'].setValue(data);
    this.district_id = data && data.id ? data.id : '';
    this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].district_text.setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].district.distictList = this.ngForm.controls['bsp1Arr']['controls'][index]['controls'].district.distictListSecond;

    this.getDistrictListSecond($event.target.value)
  }
  cvClick(i) {
    document.getElementById('variety_name' + i).click();
  }
  getAgencyDataForlist(item) {
    let data = this.agency.filter(x => x.id == item);
    console.log(data)
    return data[0].name

  }
  delete(id) {
    const param = {
      'search': {
        id: id
      }
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        this.master
          .postRequestCreator("delete-team-monitoring", null, param)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              console.log(this.filterPaginateSearch.itemListCurrentPage)
              Swal.fire({
                title: "Deleted!",
                text: "Your data has been deleted.",
                icon: "success"
              }).then(x => {
                this.search(null);
                this.editMode = false;

                // location.reload()
              })
            }
          });
      }
    })
  }
  getAgency(i) {
    this.master.postRequestCreator('get-agency-type').subscribe(data => {
      this.agencylist = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;

      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls']
        && formArray.controls[i]['controls'].type_of_agency

        // && formArray.controls[i]['controls'].total_quantity.controls[skillIndex].controls.stage

      ) {
        formArray.controls[i]['controls'].type_of_agency.agencylist = this.agencylist ? this.agencylist : '';
        formArray.controls[i]['controls'].type_of_agency.agencylistSecond = this.agencylist ? this.agencylist : ''
        // formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage.stageList = response ? response : []
      }
    })
  }
  filterNestedStateName(e, i) {
    if (e) {
      this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateListSecond;
      if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList.length > 0) {
        this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].state.stateList.filter(x => x.state_name.toLowerCase().includes(e.toLowerCase()))
      }
    }
    else {
      this.getStatelistSecond(i)
    }

  }
  filterNestedAgencyName(e, i) {
    if (e) {
      this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].type_of_agency.agencylist = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].type_of_agency.agencylistSecond;
      if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].type_of_agency && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].type_of_agency.agencylist && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].type_of_agency.agencylist.length > 0) {
        this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].type_of_agency.agencylist = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].type_of_agency.agencylist.filter(x => x.name.toLowerCase().includes(e.toLowerCase()))
      }
    }
    else {
      this.getAgency(i)
    }

  }
  filterDistrictName(e, i) {
    if (e) {
      this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictListSecond;
      if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList.length > 0) {
        this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].district.distictList.filter(x => x.district_name.toLowerCase().includes(e.toLowerCase()))
      }
    } else {
      this.getDistrictList(this.ngForm.controls['bsp1Arr']['controls'][i].controls['state'].value.state_code, i)
    }

  }
  filterNestedDesignationName(e, i) {
    if (e) {
      this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation.designationList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation.designationListSecond;
      if (this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation.designationList && this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation.designationList.length > 0) {
        this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation.designationList = this.ngForm.controls['bsp1Arr']['controls'][i]['controls'].designation.designationList.filter(x => x.name.toLowerCase().includes(e.toLowerCase()))
      }
    }
    else {
      this.getDesignationList(i)
    }

  }
  changeArray(i) {
    this.currentArray = this.stateListForNestedAraay ? this.stateListForNestedAraay : this.stateListForNestedAraay + i;
  }
  getStatelistSecond(i) {
    const param={
      is_state:1

    }
    // get-state-list-v2
    this.master.postRequestCreator('get-all-state-list-data', null,param).subscribe(data => {
      this.stateList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.stateListSecond = this.stateList

      // this.stateListData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      // this.stateListForNestedAraay = this.stateList ? this.stateList : '';
      const formArray = this.ngForm.get('bsp1Arr') as FormArray;

      if (formArray && formArray.controls && formArray.controls[i] && formArray.controls[i]['controls']
        && formArray.controls[i]['controls'].state

        // && formArray.controls[i]['controls'].total_quantity.controls[skillIndex].controls.stage

      ) {
        formArray.controls[i]['controls'].state.stateList = this.stateList ? this.stateList : '';
        formArray.controls[i]['controls'].state.stateListSecond = this.stateList ? this.stateList : ''
        // formArray.controls[index]['controls'].total_quantity.controls[skillIndex].controls.stage.stageList = response ? response : []
      }
      // this.stateListForNestedAraaySecond = this.stateListForNestedAraay ? this.stateListForNestedAraay : ''

    })
  }
  clearForm() {
    const myFormArray = this.ngForm.get('bsp1Arr') as FormArray;
    const controlToKeep = myFormArray.at(0);
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['designation'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['type_of_agency'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['district'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['state'].setValue('')
    this.ngForm.controls['bsp1Arr']['controls'][0].controls['showstatus'].setValue(true)
    this.ngForm.controls['is_developed'].setValue('no');
    this.isAddModre = true;
    myFormArray.clear();
    myFormArray.push(controlToKeep);
  }
  csagencyClick(i){
    document.getElementById('agency' + i).click();
  }
}
