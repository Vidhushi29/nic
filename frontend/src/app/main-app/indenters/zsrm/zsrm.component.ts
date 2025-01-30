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
  selector: 'app-zsrm',
  templateUrl: './zsrm.component.html',
  styleUrls: ['./zsrm.component.css']
})
export class ZsrmComponent implements OnInit {
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
  isAddSelected: boolean = false;
  isPatchData: boolean;
  formBuilder: any;
  update_Form: boolean=false;
  isChangeMessage:string;

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
        const route = `delete-req-fs/${id}`;
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
    this. isChangeMessage="Entre the Source Availability"
    this.resetCancelation()
    
  }
  validate(event: any): void {
    const inputElement = event.target;
    const t = inputElement.value;

    // Allow numbers with up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    // Get cursor position
    const cursorPosition = inputElement.selectionStart;

    // Check if the value matches the regex
    if (regex.test(t)) {
        inputElement.dataset.previousValue = t; // Save valid value
    } else {
        inputElement.value = inputElement.dataset.previousValue || ''; // Revert to the last valid value
    }

    // Restore the cursor position
    const adjustment = inputElement.value.length - t.length;
    inputElement.setSelectionRange(cursorPosition + adjustment, cursorPosition + adjustment);
}

formatNumber(value: number) {
  return value ? value.toFixed(2) : '';
}
  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      req: ['0', [Validators.required]],
      ssc: [0, [Validators.required]],
      doa: [0, [Validators.required]],
      nsc: [0, [Validators.required]],
      sau: [0, [Validators.required]],
      sfci: [0, [Validators.required]],
      pvt: [0, [Validators.required]],
      others: [0, [Validators.required]],
      total: [{ value: 0, disabled: true }],
      shtorsub: [{ value: 0, disabled: true }],
      remarks: [''],
      crop_text: [''],
      variety_text: ['']

    });
    this.ngForm.valueChanges.subscribe(values => {
      const total =
        (values.ssc || 0) +
        (values.doa || 0) +
        (values.sau || 0) +
        (values.sfci || 0) +
        (values.pvt || 0) +
        (values.nsc || 0) +
        (values.others || 0);
      const shtorsub = total - (values.req || 0);

      this.ngForm.patchValue(
        { total: total, shtorsub: shtorsub },
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

  }

  patchDataForUpdate(data: any) {
    this.isAddSelected = true
    this. isChangeMessage="Update the Source Availability"
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
      this.ngForm.controls['nsc'].patchValue(Number(data.nsc));
      this.ngForm.controls['req'].patchValue(Number(data.req));
      this.ngForm.controls['pvt'].patchValue(Number(data.pvt));
      this.ngForm.controls['sau'].patchValue(Number(data.sau));
      this.ngForm.controls['remarks'].patchValue(data.remarks); // Remarks might be a string, no conversion needed
      this.ngForm.controls['ssc'].patchValue(Number(data.ssc));
      this.ngForm.controls['doa'].patchValue(Number(data.doa));
      this.ngForm.controls['others'].patchValue(Number(data.others));
      this.ngForm.controls['sfci'].patchValue(Number(data.sfci));
      this.ngForm.patchValue(
        { total: data.total, shtorsub: data.shtorsur },
        { emitEvent: false }
      );
      
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
    this.isShowTable=true
    this.is_update = false;
    this.isAddSelected=false;
    this.showOtherInputBox = false;
  
  }
  
  resetCancelation() {
    this.ngForm.controls['nsc'].reset(0);
    this.ngForm.controls['remarks'].reset(0);
    this.ngForm.controls['others'].patchValue(0);
    this.ngForm.controls['doa'].patchValue(0);
    this.ngForm.controls['sau'].patchValue(0);
    this.ngForm.controls['sfci'].patchValue(0);
    this.ngForm.controls['pvt'].patchValue(0)
    this.ngForm.controls['req'].patchValue(0);
    this.ngForm.controls['ssc'].patchValue(0);
    this.is_update = false;
    this.showOtherInputBox = false;
  
  }
  
  
  saveForm() {
    this.submitted = true;
    this.isShowTable = true;
    const route = "add-req-fs";
    const req = this.ngForm.controls['req'].value || 0;
    const ssc = this.ngForm.controls['ssc'].value || 0;
    const doa = this.ngForm.controls['doa'].value|| 0;
    const sau = this.ngForm.controls['sau'].value || 0;
    const sfci = this.ngForm.controls['sfci'].value || 0;
    const pvt = this.ngForm.controls['pvt'].value || 0;
    const nsc = this.ngForm.controls['nsc'].value || 0;
    const others = this.ngForm.controls['others'].value || 0;
    const total = ssc + doa + sau + sfci + pvt + nsc + others;
    const shtorsur = total - req;
    const baseParam = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "req": req,
      "ssc": ssc,
      "doa": doa,
      "sau": sau,
      "sfci": sfci,
      "pvt": pvt,
      "nsc": nsc,
      "others": others,
      "remarks": this.ngForm.controls['remarks'].value,
      "total": total,
      "shtorsur": shtorsur
    };

    this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
      if (data.Response.status_code === 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {
          this.getPageData();
          this.ngForm.controls['req'].reset('');
          this.ngForm.controls['doa'].reset('');
          this.ngForm.controls['sau'].reset('');
          this.ngForm.controls['remarks'].patchValue('');
          this.ngForm.controls['others'].reset('');
          this.ngForm.controls['sfci'].reset('');
          this.ngForm.controls['ssc'].reset('');
          this.ngForm.controls['nsc'].reset('');
          this.ngForm.controls['pvt'].reset('');
          this.submitted = false;
        });
      } else if (data.Response.status_code === 409) { // Assuming 409 indicates "Conflict" or "Already Exists"
        Swal.fire({
          title: '<p style="font-size:25px;">Data Already Exists.</p>',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occurred.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    })};

createAndSave() {
  this.isShowTable=true
    this.submitted = true;
    this.saveForm();
  }
  getVarietyData(varietyCode: any) {
    this.ngForm.controls['variety'].patchValue('');
     const crop_code = this.ngForm.controls['crop'].value;
     this.selectVariety = ''; // Reset the selected variety display
    const route = `get-all-varieties?crop_code=${crop_code}`;
    this.zsrmServiceService.getRequestCreator(route, null,).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.varietyData = data && data.Response && data.Response.data ? data.Response.data : '';
        this.varietyListSecond = this.varietyData;
        if (this.isEditMode && varietyCode) {
          // Set the variety based on the code if in edit mode
          const varietyName = this.varietyData.filter(variety => variety.variety_code === varietyCode);
          this.selectVariety = varietyName.length > 0 ? varietyName[0].variety_name : '';
        }
      } else {
        // Handle case where no varieties are available for the selected crop
        this.varietyData = [];
        this.varietyListSecond = [];
      
      }
    })
  }

  logValue(value: any): void {
    console.log('Value:', value, 'Type:', typeof value);
  }
  getPageData(loadPageNumberData: number = 1) {
    this.filterPaginateSearch.itemList = [];
    const year = this.ngForm.controls['year'].value;
    console.log(year,'year');
    const season = this.ngForm.controls['season'].value;
    const crop = this.ngForm.controls['crop'].value;
    const variety = this.ngForm.controls['variety'].value;
    const page= loadPageNumberData;
    const pageSize= this.filterPaginateSearch.itemListPageSize = 5;
   
    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    console.log(year,'2025444')
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
    if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
    if (variety) queryParams.push(`variety_code=${encodeURIComponent(variety)}`);
    queryParams.push(`page=${encodeURIComponent(page)}`); // Add page to query params
    queryParams.push(`limit=${encodeURIComponent(pageSize)}`); // Add pageSize (limit) to query params
  
    const apiUrl = `view-req-fs-all-updated?${queryParams.join('&')}`;
    console.log(apiUrl,'apiUrl');
    this.zsrmServiceService
      .getRequestCreator(apiUrl)
      .subscribe(
        (apiResponse: any) => {
          if (apiResponse?.Response.status_code === 200) {
           
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
    this.submitted = true;
    this.isShowTable=true
    if (this.ngForm.invalid) {
      return;
    }
    const req = this.ngForm.controls['req'].value || 0;
    const ssc = this.ngForm.controls['ssc'].value || 0;
    const doa = this.ngForm.controls['doa'].value || 0;
    const sau = this.ngForm.controls['sau'].value || 0;
    const sfci = this.ngForm.controls['sfci'].value || 0;
    const pvt = this.ngForm.controls['pvt'].value || 0;
    const nsc = this.ngForm.controls['nsc'].value || 0;
    const others = this.ngForm.controls['others'].value || 0;
    const total = (ssc + doa + sau + sfci + pvt + nsc + others);
    const shtorsur = total - req;
    const baseParam = {
      "user_id": this.authUserId,
      "req": req,
      "ssc": ssc,
      "doa": doa,
      "sau": sau,
      "sfci": sfci,
      "pvt": pvt,
      "nsc": nsc,
      "others": others,
      "remarks": this.ngForm.controls['remarks'].value,
      "total": total,
      "shtorsur": shtorsur
    };
    const route = `update-req-fs/${this.dataId}`;
  
    this.zsrmServiceService.putRequestCreator(route,null, baseParam,).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.is_update = true;
        this.isShowTable=true;
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(() => {
          this.getPageData();
          this.ngForm.controls['req'].reset('');
          this.ngForm.controls['doa'].reset('');
          this.ngForm.controls['sau'].reset('');
          this.ngForm.controls['remarks'].patchValue('');
          this.ngForm.controls['others'].reset('');
          this.ngForm.controls['sfci'].reset('');
          this.ngForm.controls['ssc'].reset('');
          this.ngForm.controls['nsc'].reset('');
          this.ngForm.controls['pvt'].reset('');
          this.submitted = false;
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
}


