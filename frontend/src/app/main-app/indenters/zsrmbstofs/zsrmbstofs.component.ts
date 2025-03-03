
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zsrmbstofs',
  templateUrl: './zsrmbstofs.component.html',
  styleUrls: ['./zsrmbstofs.component.css']
})
export class ZsrmbstofsComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
    ngForm!: FormGroup;
    filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
    allData: any = [];
    is_update: boolean = false;
    dropdownSettings: IDropdownSettings = {};
    varietyList: any[] = [];
    varietyData: any[] = [];
    //showOtherInputBox = false;
    inventoryYearData = [
      { year: '2026-27', value: '2026-27' },
      { year: '2025-26', value: '2025-26' },
      { year: '2024-25', value: '2024-25' },
      { year: '2023-24', value: '2023-24' },
      { year: '2022-23', value: '2022-23' },
      { year: '2021-22', value: '2021-22' },
      { year: '2020-21', value: '2020-21' },
      { year: '2019-20', value: '2019-20' },
      { year: '2018-19', value: '2018-19' },
    ];
    inventorySeasonData = ['Kharif', 'Rabi'];
    cropData: any[] = [];
    districtData: { district_name: string; district_code: string }[] = [];
    allDirectIndentsData: any[] = [];
    allSpaData: any[] = [];
    submitted = false;
    dataId: any;
    authUserId: any;
    isVarietySelected = false;
    isEditMode:boolean= false;
    isShowTable = false;
    varietyAndQuantity: any[] = [];
    unit: string = '';
    showQuantity = false;
    croplistSecond: any[];
    selectCrop: any;
    selectVariety: any;
    selectVarietyStatus: any;
    varietyListSecond: any[];
    isLimeSection: boolean;
    isAddSelected: boolean = false;
    isNotShowTable: boolean = false;
    isAddFormOpen: boolean = false; 
    isUpdateFormOpen:boolean=false;
    isPatchData: boolean;
    formBuilder: any;
    update_Form: boolean=false;
    isChangeMessage:string;
    isButtonText: string;
    disableUpperSection:boolean;


    constructor(
      private fb: FormBuilder,
      private zsrmServiceService: ZsrmServiceService
    ) {
      this.createForm();
    }
  
    ngOnInit(): void {
      this.getCropData();
      this.loadAuthUser();
      this.getPageData();
    }
  
  
    deleteDirectIndent(id: number) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const route = `delete-zsrm-bs-to-fs/${id}`;
          this.zsrmServiceService.deleteRequestCreator(route, null,).subscribe(data => {
            if (data.Response.status_code === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your data has been deleted.",
                icon: "success"
              });
              this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemList.filter(item => item.id !== id);
            }
          });
        }
      });
    }
  
    SaveAsData() {
      this.isAddSelected = true;
      this. isChangeMessage="SMR BS Lifted/Used"
      this.resetCancelation()
      
    }
   
  
    createForm() {
      this.ngForm = this.fb.group({
        year: ['', [Validators.required]],
        season: ['', [Validators.required]],
        crop: ['', [Validators.required]],
        variety: ['', [Validators.required]],
        norms: [0, [Validators.required]],
        bsLiftedIcar: [0, [Validators.required]],
        bsUsedIcar: [0, [Validators.required]],
        bsUsedSau: [0, [Validators.required]],
        bsLiftedSau: [0, [Validators.required]],
        bsUsedOthers: [0, [Validators.required]],       
        bsLiftedOthers: [0, [Validators.required]],
        bsLiftedTotal: [{ value: 0, disabled: true }],
        bsUsedTotal: [{ value: 0, disabled: true }],
        fsProdFromBs: [0, [Validators.required]],
        fsProdOutOfFs: [0, [Validators.required]],
        carryOverFs: [0, [Validators.required]],
        smrAchieved: [{ value: 0, disabled: true }],
        percentAchievement: [{ value: 0, disabled: true }],
        totalFsAvl: [{ value: 0, disabled: true }],
        //remarks: [''],
        crop_text: [''],
        variety_text: ['']
  
      });
      this.ngForm.valueChanges.subscribe(values => {
        const bsLiftedTotal =
          (values.norms || 0) +
          (values.bsLiftedIcar || 0) +
          (values.bsLiftedSau || 0) +
          (values.bsLiftedOthers || 0);
        

        const bsUsedTotal =         
          (values.bsUsedIcar || 0) +          
          (values.bsUsedOthers || 0) +         
          (values.bsUsedSau || 0) ;
          
        //const bsUsedTotal = bsLiftedTotal - (values.norms || 0);
  
        const totalFsAvl =         
        (values.fsProdFromBs || 0) +          
        (values.fsProdOutOfFs || 0) +         
        (values.carryOverFs || 0) ;

        const smrAchieved=(values.fsProdFromBs || 0) /bsUsedTotal;
        const percentAchievement=(values.fsProdFromBs || 0) /(smrAchieved*bsUsedTotal) * 1000;

        this.ngForm.patchValue(
          { bsLiftedTotal: bsLiftedTotal, bsUsedTotal: bsUsedTotal, smrAchieved:smrAchieved ,percentAchievement:percentAchievement , totalFsAvl:totalFsAvl},
          { emitEvent: false }
        );
      });
      this.ngForm.controls['year'].valueChanges.subscribe(() => this.resetSelections());
      this.ngForm.controls['season'].valueChanges.subscribe(() => this.resetSelections());
      this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
        if (item) {
          this.cropData = this.croplistSecond
          let response = this.cropData.filter(x =>
            x.crop_name.toLowerCase().includes(item.toLowerCase())
          );
          this.cropData = response
        }
        else {
          this.getCropData()
        }
      })
  
      this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
        if (item) {
          this.varietyData = this.varietyListSecond;
          let response = this.varietyData.filter(x =>
            x.variety_name.toLowerCase().includes(item.toLowerCase()));
          this.varietyData = response
        }
        else {
          this.getVarietyData(this.ngForm.controls['crop'].value);
        }
      })

      this.ngForm.valueChanges.subscribe((formValues) => {
        const { year, season, crop, variety} = formValues;
        if (year || season || crop || variety ) {
          this.getPageData();
          this.isShowTable = true;
      }}) 
  
    }
  
    patchDataForUpdate(data: any) {
      this.isAddSelected = true
      this. isChangeMessage="Update the BS to FS"
      this.isButtonText="Update"
      this.isEditMode=true
      this.is_update = true;
      this.dataId = data.id;
      const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
        if (data) {
        this.selectCrop = cropName;
        this.ngForm.controls['year'].patchValue(data.year);
        this.ngForm.controls['season'].patchValue(data.season);
        this.ngForm.controls['crop'].patchValue(data.crop_code);
        
        const firstChar = (data?.crop_code || '').substring(0, 1);
        if (firstChar == 'H') {
          this.showQuantity = true;
        } else {
          this.showQuantity = false;
        }
  
        this.getVarietyData(data.variety_code);
        this.ngForm.controls['variety'].patchValue(data.variety_code);
        this.ngForm.controls['norms'].patchValue(data.norms);
        this.ngForm.controls['bsLiftedOthers'].patchValue(data.bsLiftedOthers);        
        this.ngForm.controls['bsLiftedSau'].patchValue(data.bsLiftedSau);
        this.ngForm.controls['bsLiftedIcar'].patchValue(data.bsLiftedIcar);        
        this.ngForm.controls['bsUsedIcar'].patchValue(data.bsUsedIcar);                    
        this.ngForm.controls['bsUsedSau'].patchValue(data.bsUsedSau);
        this.ngForm.controls['bsUsedOthers'].patchValue(data.bsUsedOthers);
        this.ngForm.controls['fsProdFromBs'].patchValue(data.fsProdFromBs);
        this.ngForm.controls['fsProdOutOfFs'].patchValue(data.fsProdOutOfFs); 
        this.ngForm.controls['carryOverFs'].patchValue(data.carryOverFs); 
        //smrAchieved: [{ value: 0, disabled: true }],
        //percentAchievement: [{ value: 0, disabled: true }],
        //totalFsAvl: [{ value: 0, disabled: true }],
        this.ngForm.patchValue(
          { bsLiftedTotal: data.bsLiftedTotal, bsUsedTotal: data.bsUsedTotal, smrAchieved:data.smrAchieved ,percentAchievement:data.percentAchievement , totalFsAvl:data.totalFsAvl},
          { emitEvent: false }
        );
         this.disableUpperSection=true;
         this.isShowTable=true;
        }
    }
    variety(item: any) {
      const indentQntControl = this.ngForm.get('indent_qnt');
      this.selectVariety = item && item.variety_name ? item.variety_name : '',
        this.selectVarietyStatus = item && item.status ? item.status : '',
        this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
      this.varietyData = this.varietyListSecond;
      this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
    }
  
    resetSelections() {
      this.isShowTable = false;
      // this.isAddSelected = false;
      this.isVarietySelected = false;
    }
  
    loadAuthUser() {
      const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
      if (BHTCurrentUser) {
        const data = JSON.parse(BHTCurrentUser);
        this.authUserId = data.id || null;
      }
    }
  
    searchData() {
      this.isShowTable = true;
      this.isAddSelected=false;
      this.getPageData();
    }
    cClick() {
      document.getElementById('crop').click();
    }
    vClick() {
      document.getElementById('variety').click();
    }
  
    crop(item: any) {
      this.selectCrop = item && item.crop_name ? item.crop_name : ''
      this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
      this.cropData = this.croplistSecond;
      this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
      this.getVarietyData(item.crop_code);
      this.selectVariety = '';
    }
  
    getCropData() {
      const route = "get-all-crops";
      this.zsrmServiceService.getRequestCreator(route, null, null).subscribe(data => {
        console.log(data,'data')
        if (data.Response.status_code === 200) {
          this.cropData = data && data.Response && data.Response.data ? data.Response.data : '';
          this.croplistSecond = this.cropData;
        }
      })
    }
    revertDataCancelation() {
     
      //this.selectVariety = '';
      //this.selectCrop = '';
      this.isAddSelected=false;
      //this.ngForm.controls['crop'].reset('');
      //this.ngForm.controls['season'].reset('');
      //this.ngForm.controls['year'].reset('');
      //this.ngForm.controls['variety'].reset('');   
      //this.ngForm.controls['remarks'].reset('');
      this.ngForm.controls['bsUsedSau'].reset('');
      this.ngForm.controls['bsLiftedOthers'].patchValue('');
      this.ngForm.controls['bsUsedIcar'].patchValue('');
      this.ngForm.controls['bsLiftedSau'].patchValue('');
      this.ngForm.controls['bsUsedOthers'].patchValue('');      
      this.ngForm.controls['norms'].patchValue('');
      this.ngForm.controls['bsLiftedIcar'].patchValue('');
      this.ngForm.controls['bsLiftedTotal'].patchValue('');
      this.ngForm.controls['bsUsedTotal'].patchValue('');
      this.ngForm.controls['fsProdFromBs'].patchValue('');
      this.ngForm.controls['fsProdOutOfFs'].patchValue('');
      this.ngForm.controls['carryOverFs'].patchValue('');
      this.ngForm.controls['smrAchieved'].patchValue('');
      this.ngForm.controls['percentAchievement'].patchValue('');
      this.ngForm.controls['totalFsAvl'].patchValue('');
      this.is_update = false;
      //this.showOtherInputBox = false;
      this.disableUpperSection=false;
      this.isShowTable=true;
    
    }
    resetCancelation() {
      this.ngForm.controls['bsUsedSau'].reset('');
      //this.ngForm.controls['remarks'].reset('');
      this.ngForm.controls['bsLiftedOthers'].patchValue('');
      this.ngForm.controls['bsUsedIcar'].patchValue('');
      this.ngForm.controls['bsLiftedSau'].patchValue('');
      this.ngForm.controls['bsUsedOthers'].patchValue('');
      //this.ngForm.controls['fsProdFromBs'].patchValue('');
      this.ngForm.controls['norms'].patchValue('');
      this.ngForm.controls['bsLiftedIcar'].patchValue('');
      this.ngForm.controls['fsProdFromBs'].patchValue('');
      this.ngForm.controls['fsProdOutOfFs'].patchValue('');
      this.ngForm.controls['carryOverFs'].patchValue('');
      
      this.is_update = false;
     // this.showOtherInputBox = false;
    
    }
    
    saveForm() {
      this.submitted = true;
      this.isShowTable = true;
      const route = "add-zsrm-bs-to-fs";
      const norms = Number(this.ngForm.controls['norms'].value) || 0;
      const bsLiftedIcar = Number(this.ngForm.controls['bsLiftedIcar'].value) || 0;
      const bsUsedIcar = Number(this.ngForm.controls['bsUsedIcar'].value) || 0;
      const bsLiftedSau = Number(this.ngForm.controls['bsLiftedSau'].value) || 0;
      const bsUsedOthers = Number(this.ngForm.controls['bsUsedOthers'].value) || 0;
      //const fsProdFromBs = Number(this.ngForm.controls['fsProdFromBs'].value) || 0;
      const bsUsedSau = Number(this.ngForm.controls['bsUsedSau'].value) || 0;
      const bsLiftedOthers = Number(this.ngForm.controls['bsLiftedOthers'].value) || 0;
      const bsLiftedTotal = norms + bsLiftedIcar  + bsLiftedSau +  bsLiftedOthers;
      //const shtorsur = bsLiftedTotal - norms;

      const bsUsedTotal = bsUsedIcar  + bsUsedSau +  bsUsedOthers;

      const fsProdFromBs=Number(this.ngForm.controls['fsProdFromBs'].value) || 0;
      const fsProdOutOfFs= Number(this.ngForm.controls['fsProdOutOfFs'].value) || 0;
      const carryOverFs= Number(this.ngForm.controls['carryOverFs'].value) || 0;
      //const smrAchieved= Number(this.ngForm.controls['fsProdFromBs'].value) || 0;
      //const percentAchievement= Number(this.ngForm.controls['fsProdFromBs'].value) || 0;
      
      const totalFsAvl= fsProdFromBs + fsProdOutOfFs + carryOverFs;

      const baseParam = {
        "user_id": this.authUserId,
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "norms": norms,
        "bsLiftedIcar": bsLiftedIcar,
        "bsUsedIcar": bsUsedIcar,
        "bsLiftedSau": bsLiftedSau,
        "bsUsedOthers": bsUsedOthers,
        "fsProdFromBs": fsProdFromBs,
        "bsUsedSau": bsUsedSau,
        "bsLiftedOthers": bsLiftedOthers,
        "fsProdOutOfFs": fsProdOutOfFs,
        "carryOverFs": carryOverFs,
        "smrAchieved" : 4, //Number(this.ngForm.controls['smrAchieved'].value),
        "percentAchievement" : 100,// Number(this.ngForm.controls['percentAchievement'].value),
        "bsLiftedTotal": bsLiftedTotal,
        "bsUsedTotal" : bsUsedTotal,
        "totalFsAvl": totalFsAvl
      };
  
      this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
        if (data.Response.status_code === 200) {
          console.log()
          Swal.fire({
            title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          }).then(x => {
            this.getPageData();
            this.ngForm.controls['norms'].reset('');
            this.ngForm.controls['bsUsedIcar'].reset('');
            this.ngForm.controls['bsLiftedSau'].reset('');
            //this.ngForm.controls['remarks'].patchValue('');
            this.ngForm.controls['bsLiftedOthers'].reset('');
            this.ngForm.controls['bsUsedOthers'].reset('');
            this.ngForm.controls['bsLiftedIcar'].reset('');
            this.ngForm.controls['bsUsedSau'].reset('');
            //this.ngForm.controls['fsProdFromBs'].reset('');
            this.ngForm.controls['fsProdFromBs'].reset('');
            this.ngForm.controls['fsProdOutOfFs'].reset('');
            this.ngForm.controls['carryOverFs'].reset('');
      
            this.submitted = false;
            this.isAddSelected=false;
          })
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">An Error Occured.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          })
        }
      })
    }
  
    createAndSave() {
      this.submitted = true;
      this.isAddFormOpen = true;
      this.saveForm();
    }
    getVarietyData(varietyCode: any) {
     
     
       const crop_code = this.ngForm.controls['crop'].value;
       this.ngForm.controls['variety'].patchValue('');
      const route = `get-all-varieties?crop_code=${crop_code}`;
      this.zsrmServiceService.getRequestCreator(route, null,).subscribe(data => {
        if (data.Response.status_code === 200) {
          this.varietyData = data && data.Response && data.Response.data ? data.Response.data : '';
          this.varietyListSecond = this.varietyData;
          console.log(this.isEditMode,"...................")
          if (this.isEditMode) {
            
            const varietyName = this.varietyData.filter(variety => variety.variety_code === varietyCode);
            console.log(varietyName)
            this.selectVariety = varietyName; 
            this.selectVariety = varietyName[0].variety_name;
          }
        }
      })
    }
  
    getPageData(loadPageNumberData: number = 1) {
      this.filterPaginateSearch.itemList = [];
      const year = this.ngForm.controls['year'].value;
      const season = this.ngForm.controls['season'].value;
      const crop = this.ngForm.controls['crop'].value;
      const variety = this.ngForm.controls['variety'].value;
      const page= loadPageNumberData;
      const pageSize= this.filterPaginateSearch.itemListPageSize = 5;
     
      const queryParams = [];
      if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
      if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
      if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
      if (variety) queryParams.push(`variety_code=${encodeURIComponent(variety)}`);
      queryParams.push(`page=${encodeURIComponent(page)}`); // Add page to query params
      queryParams.push(`limit=${encodeURIComponent(pageSize)}`); // Add pageSize (limit) to query params
    
      const apiUrl = `view-zsrm-bs-to-fs-all?${queryParams.join('&')}`;
      this.zsrmServiceService
        .getRequestCreator(apiUrl)
        .subscribe(
          (apiResponse: any) => {
            if (apiResponse?.Response.status_code === 200) {
              console.log(apiResponse.Response.data.pagination)
              this.allData = apiResponse.Response.data || [];
              this.filterPaginateSearch.Init(
                this.allData.data,
                this,
                'getPageData',
                undefined,
                apiResponse.Response.data.pagination.totalRecords,
                true
              );
              this.initSearchAndPagination();
            } else {
              console.warn('API returned an unexpected status:', apiResponse?.Response.status_code);
            }
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
    }
  
  
    initSearchAndPagination() {
      if (!this.paginationUiComponent) {
        setTimeout(() => this.initSearchAndPagination(), 300);
        return;
      }
      this.paginationUiComponent.Init(this.filterPaginateSearch);
    }
    updateForm() {
      //this.isShowTable=true;
      this.submitted = true;
      if (this.ngForm.invalid) {
        return;
      }
      const values = this.ngForm.value;  
      const norms = Number(this.ngForm.controls['norms'].value) || 0;
      const bsLiftedIcar = Number(this.ngForm.controls['bsLiftedIcar'].value) || 0;
      const bsUsedIcar = Number(this.ngForm.controls['bsUsedIcar'].value) || 0;
      const bsLiftedSau = Number(this.ngForm.controls['bsLiftedSau'].value) || 0;
      const bsUsedOthers = Number(this.ngForm.controls['bsUsedOthers'].value) || 0;
      //const fsProdFromBs = Number(this.ngForm.controls['fsProdFromBs'].value) || 0;
      const bsUsedSau = Number(this.ngForm.controls['bsUsedSau'].value) || 0;
      const bsLiftedOthers = Number(this.ngForm.controls['bsLiftedOthers'].value) || 0;
      const bsLiftedTotal = norms + bsLiftedIcar  + bsLiftedSau +  bsLiftedOthers;
      //const shtorsur = bsLiftedTotal - norms;

      const bsUsedTotal = bsUsedIcar  + bsUsedSau +  bsUsedOthers;

      const fsProdFromBs=Number(this.ngForm.controls['fsProdFromBs'].value) || 0;
      const fsProdOutOfFs= Number(this.ngForm.controls['fsProdOutOfFs'].value) || 0;
      const carryOverFs= Number(this.ngForm.controls['carryOverFs'].value) || 0;
      //const smrAchieved= Number(this.ngForm.controls['fsProdFromBs'].value) || 0;
      //const percentAchievement= Number(this.ngForm.controls['fsProdFromBs'].value) || 0;
      
      const totalFsAvl= fsProdFromBs + fsProdOutOfFs + carryOverFs;
      const baseParam = {
        "norms": norms,
        "bsLiftedIcar": bsLiftedIcar,
        "bsUsedIcar": bsUsedIcar,
        "bsLiftedSau": bsLiftedSau,
        "bsUsedOthers": bsUsedOthers,
        "fsProdFromBs": fsProdFromBs,
        "bsUsedSau": bsUsedSau,
        "bsLiftedOthers": bsLiftedOthers,
        "fsProdOutOfFs": fsProdOutOfFs,
        "carryOverFs": carryOverFs,
        "smrAchieved" : 4, //Number(this.ngForm.controls['smrAchieved'].value),
        "percentAchievement" : 100,// Number(this.ngForm.controls['percentAchievement'].value),
        "bsLiftedTotal": bsLiftedTotal,
        "bsUsedTotal" : bsUsedTotal,
        "totalFsAvl": totalFsAvl,
        user_id: this.authUserId,
      };
      
    
      const route = `update-zsrm-bs-to-fs/${this.dataId}`;
    
      this.zsrmServiceService.putRequestCreator(route, null,baseParam).subscribe(data => {
        if (data.Response.status_code === 200) {
          this.is_update = false;
          Swal.fire({
            title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          }).then(() => {
            this.getPageData();
            this.ngForm.controls['norms'].reset('');
            this.ngForm.controls['bsLiftedIcar'].reset('');
            this.ngForm.controls['bsUsedIcar'].reset('');
            this.ngForm.controls['bsLiftedSau'].patchValue('');
            this.ngForm.controls['bsUsedOthers'].reset('');
            this.ngForm.controls['fsProdFromBs'].reset('');
            this.ngForm.controls['bsUsedSau'].reset('');
            this.ngForm.controls['bsLiftedOthers'].reset('');
            this.ngForm.controls['fsProdOutOfFs'].reset('');
            this.ngForm.controls['carryOverFs'].reset('');
            this.ngForm.controls['smrAchieved'].reset('');
            this.ngForm.controls['percentAchievement'].reset('');
            this.ngForm.controls['bsLiftedTotal'].reset('');
            this.ngForm.controls['bsUsedTotal'].reset('');
            this.ngForm.controls['totalFsAvl'].reset('');
            this.submitted = false;
            this.isAddSelected=false;
            this.disableUpperSection=false;
          })
        } else {
          Swal.fire({
            title: '<p style="font-size:25px;">An Error Occurred.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      });

      
    }
    
    resetForm() {
      this.ngForm.controls['year'].reset('');
      this.ngForm.controls['season'].reset('');
      this.selectCrop = '';
      this.selectVariety = '';     
      this.ngForm.controls['crop'].reset('');
      this.ngForm.controls['variety'].reset('');
      this.isShowTable = false;
    }
    
  }
  
  