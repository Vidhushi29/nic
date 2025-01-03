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
  isEditMode = false;
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
  lineData: any;
  isPatchData: boolean;
  formBuilder: any;
  update_Form: boolean=false;
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
        const route = "delete-req-fs";
        this.zsrmServiceService.postRequestCreator(route, null, { "id": id }).subscribe(data => {
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
    this.isAddSelected = !this.isAddSelected;
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      req: [0, [Validators.required]],
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

  // patchDataForUpdate(data: any) {
  //   this.isEditMode = true
  //   this.is_update = true;
  //   this.isPatchData = true;
  //   this.dataId = data.id;
  //   const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
  //   if (data) {
  //     this.selectCrop = cropName;
  //     this.ngForm.controls['year'].patchValue(data.year, { emitEvent: false });
  //     this.ngForm.controls['season'].patchValue(data.season, { emitEvent: false });
  //     this.ngForm.controls['crop'].patchValue(data.crop_code, { emitEvent: false });
  //     this.getVarietyData(data.variety_code);
  //     this.ngForm.controls['nsc'].patchValue(data.nsc);
  //     this.ngForm.controls['req'].patchValue(data.req);
  //     this.ngForm.controls['pvt'].patchValue(data.pvt);
  //     this.ngForm.controls['others'].patchValue(data.others);
  //     this.ngForm.controls['remarks'].patchValue(data.remarks);
  //     this.ngForm.controls['doa'].patchValue(data.doa);
  //     this.ngForm.controls['sfci'].patchValue(data.sfci);
  //     this.ngForm.controls['sau'].patchValue(data.sau);
  //     this.ngForm.controls['ssc'].patchValue(data.ssc);

  //   }
  // }
  patchDataForUpdate(data: any) {
    console.log("hello gas")
    this.isEditMode = true
    this.is_update = true;
    this.update_Form=true
    this.isPatchData = true;
    this.dataId = data.id;
    const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
       if (data) {
      this.selectCrop = cropName;
      this.ngForm.controls['year'].patchValue(data.year, { emitEvent: false });
      this.ngForm.controls['season'].patchValue(data.season, { emitEvent: false });
      this.ngForm.controls['crop'].patchValue(data.crop_code, { emitEvent: false });
      this.getVarietyData(data.variety_code);
      this.ngForm.controls['nsc'].patchValue(data.nsc);
      this.ngForm.controls['req'].patchValue(data.req);
      this.ngForm.controls['pvt'].patchValue(data.pvt);
      this.ngForm.controls['sau'].patchValue(data.sau);
      this.ngForm.controls['remarks'].patchValue(data.remarks);
      this.ngForm.controls['nsc'].patchValue(data.nsc, { emitEvent: false });
      this.ngForm.controls['ssc'].patchValue(data.ssc);
      this.ngForm.controls['req'].patchValue(data.req);
      this.ngForm.controls['others'].patchValue(data.others);
      this.ngForm.controls['sfci'].patchValue(data.sfci);
   
     
    }
  }
//   patchDataForUpdate(data: any) {
//     console.log("Editing data with ID:", data.id);
//     this.isEditMode = true;
//     this.is_update = true;
//     this.update_Form = true;
//     this.isPatchData = true;
//     this.dataId = data.id;

//     const route=
//     this.zsrmServiceService.getDataById(data.id).subscribe({
//         next: (response: any) => {
//             const cropName = this.cropData.find(crop => crop.crop_code === response.crop_code)?.crop_name;

//             // Patch form controls with API response data
//             this.selectCrop = cropName;
//             this.ngForm.controls['year'].patchValue(response.year, { emitEvent: false });
//             this.ngForm.controls['season'].patchValue(response.season, { emitEvent: false });
//             this.ngForm.controls['crop'].patchValue(response.crop_code, { emitEvent: false });
//             this.getVarietyData(response.variety_code);
//             this.ngForm.controls['nsc'].patchValue(response.nsc, { emitEvent: false });
//             this.ngForm.controls['req'].patchValue(response.req);
//             this.ngForm.controls['pvt'].patchValue(response.pvt);
//             this.ngForm.controls['sau'].patchValue(response.sau);
//             this.ngForm.controls['remarks'].patchValue(response.remarks);
//             this.ngForm.controls['ssc'].patchValue(response.ssc);
//             this.ngForm.controls['others'].patchValue(response.others);
//             this.ngForm.controls['sfci'].patchValue(response.sfci);
//         },
//         error: (err) => {
//             console.error("Error fetching data:", err);
//             // Optionally, handle errors (e.g., display a toast or error message)
//         }
//     });
// }

  getdistrictData(district_code: any) {
    throw new Error('Method not implemented.');
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
    this.isAddSelected = false;
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
   
    this.selectVariety = '';
    this.selectCrop = '';
    this.ngForm.controls['crop'].reset('');
    this.ngForm.controls['season'].reset('');
    this.ngForm.controls['year'].reset('');
    this.ngForm.controls['variety'].reset('');
    this.ngForm.controls['nsc'].reset('');
    this.ngForm.controls['remarks'].reset('');
    this.ngForm.controls['others'].patchValue('');
    this.ngForm.controls['doa'].patchValue('');
    this.ngForm.controls['sau'].patchValue('');
    this.ngForm.controls['sfci'].patchValue('');
    this.ngForm.controls['pvt'].patchValue('');
    this.ngForm.controls['req'].patchValue('');
    this.ngForm.controls['ssc'].patchValue('');
    this.is_update = false;
    this.showOtherInputBox = false;
  
  }
  
  saveForm() {
    this.submitted = true;
    this.isShowTable = true;
    const route = "add-req-fs";
    const req = Number(this.ngForm.controls['req'].value) || 0;
    const ssc = Number(this.ngForm.controls['ssc'].value) || 0;
    const doa = Number(this.ngForm.controls['doa'].value) || 0;
    const sau = Number(this.ngForm.controls['sau'].value) || 0;
    const sfci = Number(this.ngForm.controls['sfci'].value) || 0;
    const pvt = Number(this.ngForm.controls['pvt'].value) || 0;
    const nsc = Number(this.ngForm.controls['nsc'].value) || 0;
    const others = Number(this.ngForm.controls['others'].value) || 0;
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
          confirmButtonText:
            'OK',
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
    console.log('Save button clicked');
    this.submitted = true;
    this.saveForm();
  }
  getVarietyData(varietyCode: any) {
    this.ngForm.controls['variety'].patchValue('');
    const route = "get-all-varieties";
    const param = {
      "crop_code": this.ngForm.controls['crop'].value,
    }
    this.zsrmServiceService.postRequestCreator(route, null, param).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.varietyData = data && data.Response && data.Response.data ? data.Response.data : '';
        this.varietyListSecond = this.varietyData;
        if (this.isEditMode) {
          const varietyName = this.varietyData.filter(variety => variety.variety_code === varietyCode);
          this.selectVariety = varietyName;
          this.selectVariety = varietyName[0].variety_name;
        }
      }
    })
  }

  getPageData() {
    this.filterPaginateSearch.itemList = [];
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const crop = this.ngForm.controls['crop'].value;
    const variety = this.ngForm.controls['variety'].value;
    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
    if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
    if (variety) queryParams.push(`variety_code=${encodeURIComponent(variety)}`);
    
    const apiUrl = `view-req-fs-all-updated?${queryParams.join('&')}`;
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
              apiResponse.Response.data.total,
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
    this.varietyAndQuantity = [];
    if (this.ngForm.invalid) {
      return;
    }
    
      this.submitted = true;
      this.isShowTable = true;
      const route = "update-req-fs";
      const req = Number(this.ngForm.controls['req'].value) || 0;
      const ssc = Number(this.ngForm.controls['ssc'].value) || 0;
      const doa = Number(this.ngForm.controls['doa'].value) || 0;
      const sau = Number(this.ngForm.controls['sau'].value) || 0;
      const sfci = Number(this.ngForm.controls['sfci'].value) || 0;
      const pvt = Number(this.ngForm.controls['pvt'].value) || 0;
      const nsc = Number(this.ngForm.controls['nsc'].value) || 0;
      const others = Number(this.ngForm.controls['others'].value) || 0;
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
    
    this.zsrmServiceService.postRequestCreator(route, baseParam , null).subscribe(data => {
      if (data.status === 200) {
        this.getPageData();
        this.is_update = false;
        this.ngForm.controls['nsc'].reset('');
        this.ngForm.controls['ssc'].reset('');
        this.ngForm.controls[''].reset('');
        this.ngForm.controls['state'].reset('');
        this.ngForm.controls['address'].reset('');
        this.ngForm.controls['mobile_no'].reset('');
        this.ngForm.controls['email'].reset('');
        this.ngForm.controls['district'].reset('');
        this.submitted = false;
        this.showOtherInputBox = false;
        this.ngForm.controls['selectSpa'].markAsUntouched();
        this.ngForm.controls['mobile_no'].markAsUntouched();
        this.ngForm.controls['email'].markAsUntouched();
        this.ngForm.controls['state'].markAsUntouched();
        this.ngForm.controls['indent_qnt'].markAsUntouched();
        this.districtData = null;
        this.allSpaData = null;
        if(this.lineData){
        this.lineData.forEach((line, index) => {
          this.ngForm.controls[`indentQnty_${index}`].reset();
        });
      }
      }
    })
  }
}


