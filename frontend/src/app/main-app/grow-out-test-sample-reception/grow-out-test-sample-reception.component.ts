import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-grow-out-test-sample-reception',
  templateUrl: './grow-out-test-sample-reception.component.html',
  styleUrls: ['./grow-out-test-sample-reception.component.css']
})
export class GrowOutTestSampleReceptionComponent implements OnInit{
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  formGroup: FormGroup;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  sampleReceptionYearList: any;
  sampleReceptionSeasonList: any;
  sampleReceptionCropList: any;
  sampleReceptionCropListSecond: any;
  sampleReceptionConsignmentList: any;
  sampleReceptionReasonList: any;
  sampleReceptionAllList: any;
  selectCrop: any;
  inventoryData = []
  allData: any;
  searchClicked: boolean = false;
  isConsignmentSelected: boolean = false;

  constructor(private fb: FormBuilder, private _productionCenter: ProductioncenterService) {
  }

  ngOnInit(): void {
    this.createForm();
    this.sampleReceptionYear();
    this.sampleReceptionReason();
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: new FormControl('',), 
      season: new FormControl(''),
      consignment: new FormControl('',),
      cropName: new FormControl(''),
      crop_text: new FormControl(''),
      crop_code: new FormControl(''),
    })
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_text'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchClicked = false;
        this.isConsignmentSelected = false;
        this.ngForm.controls['consignment'].setValue('');
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop_text'].disable();
        this.selectCrop = "";
        this.sampleReceptionSeason();    
      }
    });

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchClicked = false;
        this.isConsignmentSelected = false;
        this.ngForm.controls['consignment'].setValue('');
        this.ngForm.controls['crop_text'].enable();
        this.sampleReceptionCrop();
        this.selectCrop = "";
      }
    });

    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchClicked = false;
        this.sampleReceptionCropList = this.sampleReceptionCropListSecond;
        let response = this.sampleReceptionCropList.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()));
        this.sampleReceptionCropList = response;
      }
      else {
        this.sampleReceptionCropList = this.sampleReceptionCropListSecond
      }
    });
  }

  sampleReceptionYear() {
    let route = "get-got-sample-reception-year";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleReceptionYearList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      } else {
        this.sampleReceptionYearList = [];
      }
    });
  }

  sampleReceptionSeason() {
    let route = "get-got-sample-reception-season";
    let param = {
        "year": this.ngForm.controls['year'].value,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleReceptionSeasonList = res.EncryptedResponse.data.map(seasonData => {
          return {
            season: seasonData.season,
            seasonName: seasonData.season === 'R' ? 'Rabi' : seasonData.season === 'K' ? 'Kharif' : seasonData.season
          };
        });
      } else {
        this.sampleReceptionSeasonList= [];
      }
    });
  }

  sampleReceptionCrop() {
    let route = "get-got-sample-reception-crop";
    let param = {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleReceptionCropList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        this.sampleReceptionCropListSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      } else {
        this.sampleReceptionCropList= [];
        this.sampleReceptionCropListSecond= [];
      }
    });
  }

  sampleReceptionConsignment() {
    let route = "get-got-sample-reception-consignment";
      let param = {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
          "crop_code": this.ngForm.controls['crop_code'].value
      }  
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleReceptionConsignmentList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      } else {
        this.sampleReceptionConsignmentList= [];
      }
    });
  }

  sampleReceptionReason() {
    let route = "get-got-sample-reception-reason";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleReceptionReasonList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      } else {
        this.sampleReceptionReasonList= [];
      }
    });
  }

  sampleReceptionList() {
    let route = "get-got-sample-reception-list";
      let param = {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
          "crop_code": this.ngForm.controls['crop_code'].value,
          "consignment_number": this.ngForm.controls['consignment'].value
      }  
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleReceptionAllList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      } else {
         this.sampleReceptionAllList= [];
      }
    });
  }

  getCropData() {
    this.sampleReceptionCropListSecond;
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

  cgClick() {
    document.getElementById('crop_group').click();
  }

  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.isConsignmentSelected = false;
    this.ngForm.controls['consignment'].setValue('');
    this.searchClicked = false;
  }
  cropdatatext() {
    this.sampleReceptionCropListSecond;
  }

  toggleSearch() {
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_code'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    this.searchClicked = true;
    this.isConsignmentSelected = false;
    this.ngForm.controls['consignment'].setValue('');
    this.sampleReceptionConsignment();
  }

  sampleReceptionListUpdate(id:number,status: string, reason_id:number,test_number: any ) {
    let route = "got-sample-reception-update-status";
      let param = {
        "id": id,
        "status": status,
        "reason_id": reason_id,
        "test_number": test_number
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        Swal.fire({
          title: 'Success!',
          text: res.EncryptedResponse.message,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
              confirmButton: 'btn btn-success'
          }
      }).then((result) => {
        if (result.isConfirmed) {
          this.sampleReceptionList();       
         }
      });
      }
    });
  }

  onAccept(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to accept the Sample.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sampleReceptionListUpdate(id,'APPROVED',0,this.generateTestNo());
      }
    });
  }

  onReject(id: number) {
    const reasonOptions = this.sampleReceptionReasonList.reduce((options, reason) => {
      options[reason.id] = reason.comment;
      return options;
  }, {});

  Swal.fire({
        title: 'Are you sure?',
        text: 'Please select a reason for Rejecting the Sample:',
        icon: 'warning',
        input: 'select',
        inputOptions: reasonOptions,
        inputPlaceholder: 'Select Reason',
        showCancelButton: true,
        confirmButtonText: 'Reject & Save',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) {
                return 'You need to select a reason!';
            }
        },
        customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-secondary',
            popup: 'custom-popup',
            input: 'form-control custom-select dropdown-icon ',
        },
        backdrop: true,
        allowOutsideClick: false,
        inputAttributes: {
          style: 'width: 100%; max-width: 300px; box-sizing: border-box; margin: 1.25em auto 0 !important; appearance: auto;'
        }
    }).then((result) => {
        if (result.isConfirmed) {
          this.sampleReceptionListUpdate(id,'REJECTED', result.value,null);
        }
    });
  }

  onConsignmentChange(event:any) {
    const selectedValue = event.target.value;
    if(selectedValue) {
      this.isConsignmentSelected = true;
    }
    this.sampleReceptionList();
  }

  generateTestNo() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const length = 8;
    const randomString = Array.from({ length }, () => {
      return Math.random() < 0.5
        ? letters.charAt(Math.floor(Math.random() * letters.length))
        : numbers.charAt(Math.floor(Math.random() * numbers.length));
    }).join('');
    return randomString;
  }
  getFinancialYear(year:any) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
}