import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/services/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-srp',
  templateUrl: './srp.component.html',
  styleUrls: ['./srp.component.css']
})

export class SrpComponent implements OnInit {
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
  isEditMode: boolean = false;
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
  isUpdateFormOpen: boolean = false;
  isPatchData: boolean;
  formBuilder: any;
  update_Form: boolean = false;
  isChangeMessage: string;
  isButtonText: string;
  productionType: any;
  isDisableNormal: boolean;
  isDisableNormalReallocate: boolean;
  isDisableDelay: boolean;
  notificationYear: string
  selectvarietycode: string
  notificationStatus: any;
  status: any;
  selectedVariety: any;

  notification:any

  dataRow: boolean = false;


  constructor(private service: SeedServiceService, private master: MasterService, private elementRef: ElementRef,
    private productionService: ProductioncenterService,
    private breeder: BreederService,
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
        const route = `delete-srp/${id}`;
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
    this.isChangeMessage = "Entre the Source Availability"
    this.selectvarietycode = String(this.ngForm.controls['variety'].value);
    const route = `get-variety-data?variety_code=${this.selectvarietycode}`;
    // this.zsrmServiceService.getRequestCreator(route, null,null).subscribe((apiResponse:any) => {
    //   if (apiResponse.Response.status_code === 200) {
    //     this.varietyData =apiResponse.Response.data
    //   const yearn=apiResponse.Response.data.status;
    //  this.ngForm.controls['hybrid'].setValue(yearn)
        
    //   }
    // })

  }


 


  createForm() {

    //this.notificationYear=  String(this.ngForm.controls['crop'].value); //this.selectVarietyStatus;
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      coop: [0, [Validators.required]],
      ssc: [0, [Validators.required]],
      doa: [0, [Validators.required]],
      nsc: [0, [Validators.required]],
      sau: [0, [Validators.required]],
      ssf: [0, [Validators.required]],
      pvt: [0, [Validators.required]],
      hub: [0, [Validators.required]],
      others: [0, [Validators.required]],
      othersgovt: [0, [Validators.required]],
      hybrid: [''],
      notification: ['', [Validators.required]],
      yearN: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      smrfs: [0, [Validators.required]],
      fsreq: [0, [Validators.required]],
      smrbs: [0, [Validators.required]],
      bsreq: [0, [Validators.required]],
      proposedarea: [0, [Validators.required]],
      seedrate: [0, [Validators.required]],
      SRRTargetbySTATE: [0, [Validators.required]],
      certifiedquant: [0, [Validators.required]],
      qualityquant: [0, [Validators.required]],
      totalreq: [{ value: 0, disabled: true }],
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
        (values.ssf || 0) +
        (values.pvt || 0) +
        (values.nsc || 0) +
        (values.coop || 0) +
        (values.hub || 0) +
        (values.othersgovt || 0) +
        (values.others || 0);
      const shtorsub = total - (values.coop || 0);


      const { year } = values;

      if (year) {
        this.getPageData();
        this.isShowTable = true
      }


      const totalreq =
        (values.proposedarea || 0) +
        (values.seedrate || 0) +
        (values.SRRTargetbySTATE || 0);
      //const shtorsub = total - (values.coop || 0);

      this.ngForm.patchValue(
        { total: total, shtorsub: shtorsub, totalreq: totalreq },
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
    this.isChangeMessage = "Update the Source Availability"
    this.isButtonText = "Update"
    this.isEditMode = true
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
      this.ngForm.controls['hybrid'].patchValue(data.status);
      this.ngForm.controls['notification'].patchValue(data.notification_status);
      this.ngForm.controls['yearN'].patchValue(data.not_year);
      this.ngForm.controls['duration'].patchValue(data.maturity_type);
      //this.ngForm.controls['duration'].patchValue(data.developed_by);

      this.ngForm.controls['doa'].patchValue(data.doa);
      this.ngForm.controls['nsc'].patchValue(data.nsc);
      this.ngForm.controls['ssf'].patchValue(data.ssfs);
      this.ngForm.controls['pvt'].patchValue(data.pvt);
      this.ngForm.controls['sau'].patchValue(data.saus);
      this.ngForm.controls['remarks'].patchValue(data.remarks);
      this.ngForm.controls['hub'].patchValue(data.seedhub);
      this.ngForm.controls['ssc'].patchValue(data.ssc);
      this.ngForm.controls['coop'].patchValue(data.coop);
      this.ngForm.controls['others'].patchValue(data.others);
      this.ngForm.controls['othersgovt'].patchValue(data.othergovpsu);
      
      this.ngForm.controls['smrfs'].patchValue(data.SMRKeptFSToCS);
      this.ngForm.controls['fsreq'].patchValue(data.FSRequiredtomeettargetsofCS);
      this.ngForm.controls['smrbs'].patchValue(data.SMRKeptBSToFS);
      this.ngForm.controls['bsreq'].patchValue(data.BSRequiredBSRequiredtomeettargetsofFS);
      this.ngForm.controls['proposedarea'].patchValue(data.proposedAreaUnderVariety);
      this.ngForm.controls['seedrate'].patchValue(data.seedrate);
      this.ngForm.controls['SRRTargetbySTATE'].patchValue(data.SRRTargetbySTATE);
      this.ngForm.controls['SRRTargetbyGOI'].patchValue(data.SRRTargetbyGOI);
      this.ngForm.controls['certifiedquant'].patchValue(data.certifiedquant);
      this.ngForm.controls['qualityquant'].patchValue(data.qualityquant);
      //this.ngForm.controls['totalreq'].patchValue(data.seedRequired);
      //this.ngForm.controls['total'].patchValue(data.total);
      
     
      this.ngForm.patchValue(
        { total: data.total, shtorsub: data.shtorsur },
        { emitEvent: false }
      );
      console.log(data.sau, 'hello: ');
    }
  }
  variety(item: any) {
    // const indentQntControl = this.ngForm.get('indent_qnt');
    this.selectVariety = item && item.variety_name ? item.variety_name : '',
      this.selectVarietyStatus = item && item.status ? item.status : '',
      this.notificationYear = item.status;

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

  // searchData() {
  //   this.isShowTable = true;
  //   this.isAddSelected=false;
  //   this.getPageData();
  // }
  cClick() {
    document.getElementById('crop').click();
  }
  vClick() {

    document.getElementById('variety').click(

    );

  }

  getvariety() {
    document.getElementById('variety');
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
      console.log(data, 'data')
      if (data.Response.status_code === 200) {
        this.cropData = data && data.Response && data.Response.data ? data.Response.data : '';
        this.croplistSecond = this.cropData;
      }
    })
  }
  revertDataCancelation() {

    this.isShowTable=true;
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
    this.ngForm.controls['pvt'].patchValue('');    
    this.ngForm.controls['ssc'].patchValue('');
    this.ngForm.controls['total'].patchValue('');
    this.ngForm.controls['shtorsub'].patchValue('');
    this.ngForm.controls['ssf'].patchValue('');   
    this.ngForm.controls['hub'].patchValue('');    
    this.ngForm.controls['coop'].patchValue('');    
    this.ngForm.controls['othersgovt'].patchValue('');

    this.ngForm.controls['hybrid'].patchValue('');
    this.ngForm.controls['notification'].patchValue('');
    this.ngForm.controls['yearN'].patchValue('');   

          
    this.ngForm.controls['smrfs'].patchValue('');
    this.ngForm.controls['fsreq'].patchValue('');
    this.ngForm.controls['smrbs'].patchValue('');
    this.ngForm.controls['bsreq'].patchValue('');
    this.ngForm.controls['proposedarea'].patchValue('');
    this.ngForm.controls['seedrate'].patchValue('');
    this.ngForm.controls['SRRTargetbySTATE'].patchValue('');
    this.ngForm.controls['SRRTargetbyGOI'].patchValue('');
    this.ngForm.controls['certifiedquant'].patchValue('');
    this.ngForm.controls['qualityquant'].patchValue('');



    this.is_update = false;
    this.showOtherInputBox = false;

  }
   resetCancelation() {
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
    const route = "add-srp";
    const ssf = Number(this.ngForm.controls['ssf'].value) || 0;
    const ssc = Number(this.ngForm.controls['ssc'].value) || 0;
    const doa = Number(this.ngForm.controls['doa'].value) || 0;
    const sau = Number(this.ngForm.controls['sau'].value) || 0;
    const hub = Number(this.ngForm.controls['hub'].value) || 0;
    const pvt = Number(this.ngForm.controls['pvt'].value) || 0;
    const nsc = Number(this.ngForm.controls['nsc'].value) || 0;
    const coop = Number(this.ngForm.controls['coop'].value) || 0;
    const others = Number(this.ngForm.controls['others'].value) || 0;
    const othersgovt = Number(this.ngForm.controls['othersgovt'].value) || 0;
    const totalreq = Number(this.ngForm.controls['totalreq'].value) || 0;
    const total = ssf + ssc + doa + sau + hub + pvt + nsc + coop + others + othersgovt;
    const shtorsur = total - totalreq;
    const baseParam = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "ssfs": ssf,
      "ssc": ssc,
      "doa": doa,
      "saus": sau,
      "sfci": hub,
      "pvt": pvt,
      "nsc": nsc,
      "coop": coop,
      "seedhub": hub,
      "others": others,
      "othergovpsu": othersgovt,
      "remarks": this.ngForm.controls['remarks'].value,
      "total": total,
      "shtorsur": shtorsur,
      "SMRKeptBSToFS": this.ngForm.controls['smrbs'].value,
      "SMRKeptFSToCS": this.ngForm.controls['smrfs'].value,
      "FSRequiredtomeettargetsofCS": this.ngForm.controls['fsreq'].value,
      "BSRequiredBSRequiredtomeettargetsofFS": this.ngForm.controls['bsreq'].value,
      "proposedAreaUnderVariety": this.ngForm.controls['proposedarea'].value,
      "seedrate": this.ngForm.controls['seedrate'].value,
      "SRRTargetbySTATE": this.ngForm.controls['SRRTargetbySTATE'].value,
      "seedRequired": this.ngForm.controls['totalreq'].value,
      "qualityquant": this.ngForm.controls['qualityquant'].value,
      "certifiedquant": this.ngForm.controls['certifiedquant'].value,



    };
    console.log(baseParam);

    this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
      console.log(data, 'data')
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
        console.log(this.isEditMode, "...................")
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
    const page = loadPageNumberData;
    const pageSize = this.filterPaginateSearch.itemListPageSize = 5;

    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
    if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
    if (variety) queryParams.push(`variety_code=${encodeURIComponent(variety)}`);
    queryParams.push(`page=${encodeURIComponent(page)}`); // Add page to query params
    queryParams.push(`limit=${encodeURIComponent(pageSize)}`); // Add pageSize (limit) to query params

    const apiUrl = `view-srp-all?${queryParams.join('&')}`;
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
    this.submitted = true;

    // if (this.ngForm.invalid) {
      
    //   return;
    // }

    const values = this.ngForm.value;
    // const baseParam = {
    //   ...values,
    //   user_id: this.authUserId,
    // };



    const baseParam = {
      "user_id": this.authUserId,
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop'].value,
      "variety_code": this.ngForm.controls['variety'].value,
      "ssfs": Number(this.ngForm.controls['ssf'].value),
      "ssc": Number(this.ngForm.controls['ssc'].value),
      "doa": Number(this.ngForm.controls['doa'].value),
      "saus": Number(this.ngForm.controls['sau'].value),      
      "pvt": Number(this.ngForm.controls['pvt'].value),
      "nsc": Number(this.ngForm.controls['nsc'].value),
      "coop": Number(this.ngForm.controls['coop'].value),
      "seedhub": Number(this.ngForm.controls['hub'].value),
      "others": Number(this.ngForm.controls['others'].value),
      "othergovpsu": Number(this.ngForm.controls['othersgovt'].value),
      "remarks": this.ngForm.controls['remarks'].value,
      "total": Number(this.ngForm.controls['total'].value),
      "shtorsur": Number(this.ngForm.controls['shtorsub'].value),
      "SMRKeptBSToFS": this.ngForm.controls['smrbs'].value,
      "SMRKeptFSToCS": this.ngForm.controls['smrfs'].value,
      "FSRequiredtomeettargetsofCS": this.ngForm.controls['fsreq'].value,
      "BSRequiredBSRequiredtomeettargetsofFS": this.ngForm.controls['bsreq'].value,
      "proposedAreaUnderVariety": this.ngForm.controls['proposedarea'].value,
      "seedrate": this.ngForm.controls['seedrate'].value,
      "SRRTargetbySTATE": this.ngForm.controls['SRRTargetbySTATE'].value,
      "seedRequired": this.ngForm.controls['totalreq'].value,
      "qualityquant": this.ngForm.controls['qualityquant'].value,
      "certifiedquant": this.ngForm.controls['certifiedquant'].value,
     };



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
console.log(total,'total')
      this.ngForm.patchValue(
        { total: total, shtorsub: shtorsub },
        { emitEvent: false }
      );
    });
    const route = `update-srp/${this.dataId}`;
console.log(route,'route')
    this.zsrmServiceService.putRequestCreator(route, baseParam, null).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.is_update = false;
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(() => this.resetForm());
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
    this.isAddFormOpen = true;
    this.isUpdateFormOpen = false;
    this.submitted = false;
    this.ngForm.reset();
    this.getPageData
  }

  getYear() {
    //this.master.postRequestCreator('get-bsp-performa1-year', null,{search:{production_type:this.productionType}}).subscribe(data => {
    //this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
    //})
  }
  productionTypeValue(value) {
    if (value) {
      this.productionType = value;
      if (this.productionType == "NORMAL") {
        this.isDisableNormal = false;
        this.isDisableDelay = true;
        this.isDisableNormalReallocate = true;
      } else if (this.productionType == "DELAY") {
        this.isDisableNormal = true;
        this.isDisableDelay = false;
        this.isDisableNormalReallocate = true;
      } else if (this.productionType == "REALLOCATION") {
        this.isDisableNormal = true;
        this.isDisableDelay = true;
        this.isDisableNormalReallocate = false;
      }
      else {
        // this.isDisableNormal= false;
        // this.isDisableDelay= false;
        // this.isDisableNormalReallocate= true;
      }
    }
    this.getYear();
  }
  resetRadioBtn() {
    window.location.reload();
    this.productionType = ""
  }
}