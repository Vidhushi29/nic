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
  selector: 'app-zsrm-cs-fs-area',
  templateUrl: './zsrm-cs-fs-area.component.html',
  styleUrls: ['./zsrm-cs-fs-area.component.css']
})
export class ZsrmCsFsAreaComponent implements OnInit {

    @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
    ngForm!: FormGroup;
    filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
    allData: any = [];
    is_update: boolean = false;
    dropdownSettings: IDropdownSettings = {};
    varietyList: any[] = [];
    varietyData: any[] = [];
    showOtherInputBox = false;
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
     // this.getPageData();
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
          const route = `delete-zsrm-cs-fs-area/${id}`;
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
      this. isChangeMessage="Enter Registered Area and Quantiy Details"
      this.resetCancelation()
      
    }
   
  
    createForm() {
      this.ngForm = this.fb.group({
        year: ['', [Validators.required]],
        season: ['', [Validators.required]],
        crop: ['', [Validators.required]],
        variety: ['', [Validators.required]],
        category: ['', [Validators.required]],
        cs_area: [0, [Validators.required]],
        cs_quant: [0, [Validators.required]],
        fs_area: [0, [Validators.required]],
        fs_quant: [0, [Validators.required]],
        crop_text: [''],
        variety_text: ['']
  
      });
      this.ngForm.controls['year'].valueChanges.subscribe(() => this.resetSelections());
      this.ngForm.controls['season'].valueChanges.subscribe(() => this.resetSelections());
      this.ngForm.controls['category'].valueChanges.subscribe(() => this.resetSelections());
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
        const { year, season, crop, variety, category} = formValues;
        if (year || season || crop || variety || category) {
          this.getPageData();
          this.isShowTable = true;
      }}) 
      
  
    }
  
    patchDataForUpdate(data: any) {
      this.isAddSelected = true
      this. isChangeMessage="Update:"
      this.isButtonText="Update"
      this.isEditMode=true
      this.is_update = true;
      this.dataId = data.id;
      const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
        if (data) {
        this.selectCrop = cropName;
        this.ngForm.controls['year'].patchValue(data.year);
        this.ngForm.controls['season'].patchValue(data.season);
        this.ngForm.controls['category'].patchValue(data.category);
        this.ngForm.controls['crop'].patchValue(data.crop_code);
        this.getVarietyData(data.variety_code);
        this.ngForm.controls['cs_area'].patchValue(data.cs_area);
        this.ngForm.controls['cs_quant'].patchValue(data.cs_quant);
        this.ngForm.controls['fs_area'].patchValue(data.fs_area);
        this.ngForm.controls['fs_quant'].patchValue(data.fs_quant);
        this.disableUpperSection=true;
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
        if (data.Response.status_code === 200) {
          this.cropData = data && data.Response && data.Response.data ? data.Response.data : '';
          this.croplistSecond = this.cropData;
        }
      })
    }
    revertDataCancelation() {

      this.isAddSelected=false;
      this.ngForm.controls['cs_area'].reset('');
      this.ngForm.controls['cs_quant'].reset('');
      this.ngForm.controls['fs_area'].reset('');
      this.ngForm.controls['fs_quant'].reset('');
      this.is_update = false;
      this.showOtherInputBox = false;
      this.disableUpperSection = false;

    
    }
    resetCancelation() {
      this.ngForm.controls['cs_area'].reset(0);
      this.ngForm.controls['cs_quant'].reset(0);
      this.ngForm.controls['fs_area'].reset(0);
      this.ngForm.controls['fs_quant'].reset(0);
      this.is_update = false;
      this.showOtherInputBox = false;
    }
    
    saveForm() {
      this.submitted = true;
      this.isShowTable = true;
      const route = "add-zsrm-cs-fs-area";
      const cs_area = Number(this.ngForm.controls['cs_area'].value) || 0;
      const cs_quant = Number(this.ngForm.controls['cs_quant'].value) || 0;
      const fs_area = Number(this.ngForm.controls['fs_area'].value) || 0;
      const fs_quant = Number(this.ngForm.controls['fs_quant'].value) || 0;
      const baseParam = {
        "user_id": this.authUserId,
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "category": this.ngForm.controls['category'].value,
        "cs_area": cs_area,
        "cs_quant": cs_quant,
        "fs_area": fs_area,
        "fs_quant": fs_quant
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
            this.ngForm.controls['cs_area'].reset('');
            this.ngForm.controls['cs_quant'].reset('');
            this.ngForm.controls['fs_area'].reset('');
            this.ngForm.controls['fs_quant'].reset('');
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
      if (!this.ngForm.controls["cs_area"].value) {
              Swal.fire({
                title: '<p style="font-size:25px;">CS Area can not be 0</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15'
              })
              return;
            }
        else if(!this.ngForm.controls["cs_quant"].value) {
          Swal.fire({
            title: '<p style="font-size:25px;">CS Quantity can not be 0</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
          return;
        }
        else if(!this.ngForm.controls["fs_area"].value) {
          Swal.fire({
            title: '<p style="font-size:25px;">FS Area can not be 0</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
          return;
        }
        else if(!this.ngForm.controls["fs_quant"].value) {
          Swal.fire({
            title: '<p style="font-size:25px;">FS Quantity can not be 0</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
          return;
        }
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
            this.ngForm.controls['variety'].patchValue(varietyName[0].variety_code);
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
      const category = this.ngForm.controls['category'].value;
      const page= loadPageNumberData;
      const pageSize= this.filterPaginateSearch.itemListPageSize = 10;
     
      const queryParams = [];
      if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
      if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
      if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
      if (variety) queryParams.push(`variety_code=${encodeURIComponent(variety)}`);
      if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
      queryParams.push(`page=${encodeURIComponent(page)}`); // Add page to query params
      queryParams.push(`limit=${encodeURIComponent(pageSize)}`); // Add pageSize (limit) to query params
    
      const apiUrl = `view-zsrm-cs-fs-area-all?${queryParams.join('&')}`;
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
      if (!this.ngForm.controls["cs_area"].value) {
        Swal.fire({
          title: '<p style="font-size:25px;">CS Area can not be 0</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
        return;
      }
  else if(!this.ngForm.controls["cs_quant"].value) {
    Swal.fire({
      title: '<p style="font-size:25px;">CS Quantity can not be 0</p>',
      icon: 'error',
      confirmButtonText:
        'OK',
      confirmButtonColor: '#E97E15'
    })
    return;
  }
  else if(!this.ngForm.controls["fs_area"].value) {
    Swal.fire({
      title: '<p style="font-size:25px;">FS Area can not be 0</p>',
      icon: 'error',
      confirmButtonText:
        'OK',
      confirmButtonColor: '#E97E15'
    })
    return;
  }
  else if(!this.ngForm.controls["fs_quant"].value) {
    Swal.fire({
      title: '<p style="font-size:25px;">FS Quantity can not be 0</p>',
      icon: 'error',
      confirmButtonText:
        'OK',
      confirmButtonColor: '#E97E15'
    })
    return;
  }
      this.submitted = true;
      this.isShowTable = true;
      const route = `update-zsrm-cs-fs-area/${this.dataId}`;
      const cs_area = Number(this.ngForm.controls['cs_area'].value) || 0;
      const cs_quant = Number(this.ngForm.controls['cs_quant'].value) || 0;
      const fs_area = Number(this.ngForm.controls['fs_area'].value) || 0;
      const fs_quant = Number(this.ngForm.controls['fs_quant'].value) || 0;
      const baseParam = {
        "cs_area": cs_area,
        "cs_quant": cs_quant,
        "fs_area": fs_area,
        "fs_quant": fs_quant
      };
  
   
    
      this.zsrmServiceService.putRequestCreator(route,null,baseParam).subscribe(data => {
        if (data.Response.status_code === 200) {
          this.is_update = false;
          Swal.fire({
            title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          }).then(() => {
            this.getPageData();
            this.ngForm.controls['cs_area'].reset('');
            this.ngForm.controls['cs_quant'].reset('');
            this.ngForm.controls['fs_area'].reset('');
            this.ngForm.controls['fs_quant'].reset('');
            this.submitted = false;
            this.isAddSelected=false;
            this.disableUpperSection = false;
          });
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

    validateDecimal(event: any): void {
      const input = event.target as HTMLInputElement;
      const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
    
      const newValue = input.value + event.key;
      if (!regex.test(newValue) || (event.key === '.' && input.value.includes('.'))) {
        event.preventDefault();
      }
    }

  formatNumber(value: number) {
    return value ? value.toFixed(2) : '';
  }
    
    resetForm() {
      this.ngForm.controls['year'].reset('');
      this.ngForm.controls['season'].reset('');
      this.ngForm.controls['category'].reset('');
      this.selectCrop = '';
      this.selectVariety = '';     
      this.ngForm.controls['crop'].reset('');
      this.ngForm.controls['variety'].reset('');
      this.isShowTable = false;
      this.isAddSelected = false;
    }


    
  }
  
  