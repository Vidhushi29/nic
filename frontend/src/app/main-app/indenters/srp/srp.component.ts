import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/services/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-srp',
  templateUrl: './srp.component.html',
  styleUrls: ['./srp.component.css']
})

export class SrpComponent implements OnInit {
  // @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm!: FormGroup;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any = [];
  is_update: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  varietyList: any[] = [];
  varietyData: any[] = [];
  showOtherInputBox = false;
  inventoryYearData = [
    { year: '2029-30', value: '2029-30' },
    { year: '2028-29', value: '2028-29' },
    { year: '2027-28', value: '2027-28' },
    { year: '2026-27', value: '2026-27' },



  ];
  inventorySeasonData = ['Kharif', 'Rabi'];
  fileName = 'Crop-wise-srp-report.xlsx';
  cropData: any[] = [];
  enableTable = false;
  districtData: { district_name: string; district_code: string }[] = [];
  allDirectIndentsData: any[] = [];
  allSpaData: any[] = [];
  submitted = false;
  dataId: any;
  today = new Date();
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
  disableUpperSection: boolean;
  notification: any
  dataRow: boolean = false;
  isCertifiedquant: number;
  freezeData: boolean;
  dummyData = [];
  finalData: any[];
  totalData: any;
  isCheck: boolean = false;
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

            this.getPageData();
          }
        });
      }
    });
  }


  finalizeData() {
    const year = this.ngForm.controls['year'].value;
    const season = this.ngForm.controls['season'].value;
    const queryParams = [];
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season) queryParams.push(`season=${encodeURIComponent(season)}`);

    const apiUrl = `finalise-srp?${queryParams.join('&')}`;
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes,Submit it!",
      cancelButtonText: "Cancel",
      icon: "warning",
      title: "Are You Sure?",
      text: "You won't be able to Edit this!",
      position: "center",
      cancelButtonColor: "#DD6B55",
    }).then(x => {

      if (x.isConfirmed) {

        this.zsrmServiceService.putRequestCreator(apiUrl).subscribe(apiResponse => {

          if (apiResponse.Response.status_code === 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Submited Successfully.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            }).then(x => {
              this.getPageData()


            })


          } else {
            Swal.fire({
              title: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          }
        })
      }

    })
  }

  SaveAsData() {
    this.isAddSelected = true;
    this.resetCancelation();
    const variety_code = this.ngForm.controls['variety'].value;
    this.getVarietyDeatil(variety_code);
  }

  createForm() {
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
      notifiedValue: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      SRRTargetbyGOI: ['', [Validators.required]],
      smrfs: [0, [Validators.required]],
      fsreq: [0, [Validators.required]],
      smrbs: [0, [Validators.required]],
      bsreq: [0, [Validators.required]],
      proposedarea: [0, [Validators.required]],
      seedrate: [0, [Validators.required]],
      SRRTargetbySTATE: [0, [Validators.required]],
      certifiedquant: [0, Validators.required],
      qualityquant: [0, [Validators.required]],
      totalreq: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
      shtorsub: [{ value: 0, disabled: true }],
      remarks: [''],
      crop_text: [''],
      variety_text: ['']
    });
  
    this.ngForm.controls['certifiedquant'].valueChanges.subscribe(values => {
      if (values === 0) {
        this.ngForm.controls['smrbs'].setValue(0);
        this.ngForm.controls['fsreq'].setValue(0); this.ngForm.controls['bsreq'].setValue(0); this.ngForm.controls['smrfs'].setValue(0);

      }
    })

    this.ngForm.valueChanges.subscribe(values => {
      const fsReqValue = (values.certifiedquant || 0) / (values.smrfs || 0);
      const bsReqValue = fsReqValue /values.smrbs||0
      if (values.certifiedquant !== undefined) {
        this.isCertifiedquant = values.certifiedquant;

      }
      const totalreq =
        ((values.proposedarea || 0) *
          (values.seedrate || 0) *
          (values.SRRTargetbySTATE || 0)) / 100;
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
      const shtorsub = total - totalreq
      this.ngForm.patchValue(
        { total: this.formatNumber(total) || 0, shtorsub: this.formatNumber(shtorsub) || 0, totalreq: this.formatNumber(totalreq) || 0, fsreq: this.formatNumber(fsReqValue) || 0, bsreq: this.formatNumber(bsReqValue) || 0 },
        { emitEvent: false }
      );

    });
    this.ngForm.valueChanges.subscribe((formValues) => {
      const { year, } = formValues;
      //data seasrch by year 
      if (year) {
        this.getPageData();
        this.isShowTable = true

      }
    });
    this.ngForm.controls['year'].valueChanges.subscribe(() => this.resetSelections());;
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

  srrValidation(event: any) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value + event.key;
    const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
    if (!regex.test(currentValue) || (event.key === '.' && input.value.includes('.'))) {
      event.preventDefault();
    }

    const SRRTargetbySTATE = parseFloat(input.value);

    if (SRRTargetbySTATE > 100) {
      Swal.fire({
        title: '<p style="font-size:25px;">Error: SRR Target must be 100 or less.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      event.preventDefault();
    }
    return;
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
      this.ngForm.controls['notifiedValue'].patchValue(data.developed_by);
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
      this.ngForm.controls['bsreq'].patchValue(data.BSRequiredtomeettargetsofFS);
      this.ngForm.controls['proposedarea'].patchValue(data.proposedAreaUnderVariety);
      this.ngForm.controls['seedrate'].patchValue(data.seedrate);
      this.ngForm.controls['SRRTargetbySTATE'].patchValue(data.SRRTargetbySTATE);
      this.ngForm.controls['SRRTargetbyGOI'].patchValue(data.SRRTargetbyGOI);
      this.ngForm.controls['certifiedquant'].patchValue(data.certifiedquant);
      this.ngForm.controls['qualityquant'].patchValue(data.qualityquant);
      this.disableUpperSection = true;
      this.ngForm.patchValue(
        { total: data.total, shtorsub: data.shtorsur },
        { emitEvent: false }
      );

    }
  }

  variety(item: any) {
    this.selectVariety = item && item.variety_name ? item.variety_name : '',
      this.selectVarietyStatus = item && item.status ? item.status : '',
      this.notificationYear = item.status;

    this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
    this.varietyData = this.varietyListSecond;

    this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
  }

  resetSelections() {
    this.isShowTable = false;
    this.isVarietySelected = false;
  }

  loadAuthUser() {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    if (BHTCurrentUser) {
      const data = JSON.parse(BHTCurrentUser);
      this.authUserId = data.id || null;
    }
  }


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
    this.selectVariety = ''
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
    this.isShowTable = true
    this.is_update = false;
    this.isAddSelected = false;
    this.showOtherInputBox = false;
    this.disableUpperSection = false;
  }
  searchData() {
    this.isShowTable = true;
    this.isAddSelected = false;
    this.getPageData();
  }
  resetCancelation() {

    this.ngForm.controls['doa'].reset(0)
    this.ngForm.controls['nsc'].reset(0)
    this.ngForm.controls['ssf'].reset(0)
    this.ngForm.controls['pvt'].reset(0)
    this.ngForm.controls['sau'].reset(0)
    this.ngForm.controls['remarks'].reset()
    this.ngForm.controls['hub'].reset(0)
    this.ngForm.controls['ssc'].reset(0)
    this.ngForm.controls['coop'].reset(0)
    this.ngForm.controls['others'].reset(0);
    this.ngForm.controls['othersgovt'].reset(0)
    this.ngForm.controls['smrfs'].reset(0)
    this.ngForm.controls['fsreq'].reset(0)
    this.ngForm.controls['smrbs'].reset(0);
    this.ngForm.controls['bsreq'].reset(0)
    this.ngForm.controls['proposedarea'].reset(0)
    this.ngForm.controls['seedrate'].reset(0)
    this.ngForm.controls['SRRTargetbySTATE'].reset(0)
    this.ngForm.controls['SRRTargetbyGOI'].reset(0)
    this.ngForm.controls['certifiedquant'].reset(0)
    this.ngForm.controls['qualityquant'].reset(0)
    this.is_update = false;
    this.showOtherInputBox = false;

  }

  saveForm() {
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
    const seedrate = Number(this.ngForm.controls['seedrate'].value);
    const proposedAreaUnderVariety = Number(this.ngForm.controls['proposedarea'].value);
    const qualityquant = Number(this.ngForm.controls['qualityquant'].value);
    const certifiedquant = Number(this.ngForm.controls['certifiedquant'].value) || 0;
    const SMRKeptBSToFS = Number(this.ngForm.controls['smrbs'].value) || 0
    const SMRKeptFSToCS = Number(this.ngForm.controls['smrfs'].value) || 0
    const FSRequiredtomeettargetsofCS = certifiedquant / SMRKeptBSToFS || 0
    const BSRequiredtomeettargetsofFS = FSRequiredtomeettargetsofCS / SMRKeptFSToCS || 0
    this.isCertifiedquant = certifiedquant;

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
      "seedrate": seedrate,
      "othergovpsu": othersgovt,
      "remarks": this.ngForm.controls['remarks'].value,
      "total": total,
      "shtorsur": shtorsur,
      "SMRKeptBSToFS": SMRKeptBSToFS,
      "SMRKeptFSToCS": SMRKeptFSToCS,
      "FSRequiredtomeettargetsofCS": FSRequiredtomeettargetsofCS,
      "BSRequiredtomeettargetsofFS": BSRequiredtomeettargetsofFS,
      "proposedAreaUnderVariety": proposedAreaUnderVariety,
      "SRRTargetbySTATE": this.ngForm.controls['SRRTargetbySTATE'].value,
      "seedRequired": this.ngForm.controls['totalreq'].value,
      "qualityquant": qualityquant,
      "certifiedquant": certifiedquant,
    };

    if (proposedAreaUnderVariety === 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Proposed area under variety cannot be zero. Please enter the value.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });

      return;
    }
    if (totalreq === 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Seed Requirement cannot be zero. Please enter the value.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });

      return;
    }

    if (seedrate === 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Seed rate cannot be zero. Please enter the value.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });

      return;
    }
    if ((certifiedquant + qualityquant) !== totalreq) {
      Swal.fire({
        title: '<p style="font-size:25px;">Sum of certified quante & quality quant should be equal seed Requiredment. Please enter the value.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });

      return;
    }

    if (certifiedquant) {
      if (SMRKeptBSToFS === 0 || SMRKeptFSToCS === 0 || FSRequiredtomeettargetsofCS === 0 || BSRequiredtomeettargetsofFS === 0) {
        Swal.fire({
          title: '<p style="font-size:25px;">SMR and FS and BS Req can not be zero. Please enter the value.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });

        return;
      }
    }
    this.submitted = true;
    this.isShowTable = true;
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
          this.ngForm.controls['doa'].reset(0)
          this.ngForm.controls['nsc'].reset(0)
          this.ngForm.controls['ssf'].reset(0)
          this.ngForm.controls['pvt'].reset()
          this.ngForm.controls['sau'].reset()
          this.ngForm.controls['remarks'].reset()
          this.ngForm.controls['hub'].reset(0)
          this.ngForm.controls['ssc'].reset(0)
          this.ngForm.controls['coop'].reset(0)
          this.ngForm.controls['others'].reset(0);
          this.ngForm.controls['othersgovt'].reset(0)
          this.ngForm.controls['smrfs'].reset(0)
          this.ngForm.controls['fsreq'].reset(0)
          this.ngForm.controls['smrbs'].reset(0);
          this.ngForm.controls['bsreq'].reset(0)
          this.ngForm.controls['proposedarea'].reset(0)
          this.ngForm.controls['seedrate'].reset(0)
          this.ngForm.controls['SRRTargetbySTATE'].reset(0)
          this.ngForm.controls['SRRTargetbyGOI'].reset(0)
          this.ngForm.controls['certifiedquant'].reset(0)
          this.ngForm.controls['qualityquant'].reset(0)
          this.submitted = false;
          this.isAddSelected = false;
          this.disableUpperSection = false;
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
    this.isShowTable = true
    this.submitted = true;
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

        if (this.isEditMode) {

          const varietyName = this.varietyData.filter(variety => variety.variety_code === varietyCode);

          this.selectVariety = varietyName;
          this.selectVariety = varietyName[0].variety_name;
          this.ngForm.controls['variety'].patchValue(varietyName[0].variety_code);
        }
      }
    })
  }

  getVarietyDeatil(varietyCode: any) {
    const route = `get-variety-data?variety_code=${varietyCode}`;
    this.zsrmServiceService.getRequestCreator(route, null,).subscribe(data => {
      if (data.Response.status_code === 200) {
        const res = data && data.Response && data.Response.data ? data.Response.data : '';
        this.ngForm.controls['hybrid'].patchValue(res.status);
        this.ngForm.controls['notification'].patchValue(res.notification_status);
        this.ngForm.controls['yearN'].patchValue(res.not_date_substring);
        this.ngForm.controls['duration'].patchValue(res.maturity_type);
        this.ngForm.controls['notifiedValue'].patchValue(res.developed_by);
        this.ngForm.controls['SRRTargetbyGOI'].patchValue(res.srr);
      }
    })
  }


  getPageData() {
    this.finalData = [];
    this.totalData = [];
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

    const apiUrl = `view-srp-all?${queryParams.join('&')}`;
    this.zsrmServiceService
      .getRequestCreator(apiUrl)
      .subscribe(
        (apiResponse: any) => {
          if (apiResponse?.Response.status_code === 200) {
            this.allData = apiResponse.Response.data || [];
            this.dummyData = this.allData;
            console.log(this.dummyData, 'data');
            if (this.dummyData && this.dummyData[0]?.is_finalised) {
              this.freezeData = true;
            }
            else {
              this.freezeData = false;
            }
            let totals = {
              AreaUnderVariety: 0.00,
              SeedRequired: 0.00,
              doa: 0.00,
              ssfs: 0.00,
              ssc: 0.00,
              nsc: 0.00,
              saus: 0.00,
              othergovpsu: 0.00,
              coop: 0.00,
              pvt: 0.00,
              seedhub: 0.00,
              others: 0.00,
              total: 0.00,
              shtorsur: 0.00,
              BSRequiredtomeettargetsofFS: 0.00,
              FSRequiredtomeettargetsofCS: 0.00,
            };

            // Iterate through the data and sum up all the fields
            this.dummyData.forEach(item => {
              totals.AreaUnderVariety += parseFloat(item.proposedAreaUnderVariety) || 0.00;
              totals.SeedRequired += parseFloat(item.seedRequired) || 0.00;
              totals.doa += parseFloat(item.doa) || 0.00;
              totals.ssfs += parseFloat(item.ssfs) || 0.00;
              totals.ssc += parseFloat(item.ssc) || 0.00;
              totals.nsc += parseFloat(item.nsc) || 0.00;
              totals.saus += parseFloat(item.saus) || 0.00;
              totals.othergovpsu += parseFloat(item.othergovpsu) || 0.00;
              totals.coop += parseFloat(item.coop) || 0.00;
              totals.pvt += parseFloat(item.pvt) || 0.00;
              totals.seedhub += parseFloat(item.seedhub) || 0.00;
              totals.others += parseFloat(item.others) || 0.00;
              totals.total += parseFloat(item.total) || 0.00;
              totals.shtorsur += parseFloat(item.shtorsur) || 0.00;
              totals.BSRequiredtomeettargetsofFS += parseFloat(item.BSRequiredtomeettargetsofFS) || 0.00;
              totals.FSRequiredtomeettargetsofCS += parseFloat(item.FSRequiredtomeettargetsofCS) || 0.00;
            });

            let filteredData = [];
            this.dummyData.forEach((el) => {
              const seasonIndex = filteredData.findIndex((item) => item.season === el.season);
              if (seasonIndex === -1) {
                filteredData.push({
                  season: el.season,
                  crop_count: 1,
                  season_variety_count: 1,
                  season_area: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                  season_seed_req: parseFloat(el.seedRequired).toFixed(2),
                  season_doa: parseFloat(el.doa).toFixed(2),
                  season_ssfs: parseFloat(el.ssfs).toFixed(2),
                  season_ssc: parseFloat(el.ssc).toFixed(2),
                  season_nsc: parseFloat(el.nsc).toFixed(2),
                  season_saus: parseFloat(el.saus).toFixed(2),
                  season_othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                  season_coop: parseFloat(el.coop).toFixed(2),
                  season_pvt: parseFloat(el.pvt).toFixed(2),
                  season_seedhub: parseFloat(el.seedhub).toFixed(2),
                  season_others: parseFloat(el.others).toFixed(2),
                  season_total: parseFloat(el.total).toFixed(2),
                  season_shtorsur: parseFloat(el.shtorsur).toFixed(2),
                  season_BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                  season_FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                  crop: [
                    {
                      crop_code: el.crop_code,
                      crop_name: el.crop_name,
                      variety_count: 1,
                      crop_area: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                      crop_seed_req: parseFloat(el.seedRequired).toFixed(2),
                      crop_doa: parseFloat(el.doa).toFixed(2),
                      crop_ssfs: parseFloat(el.ssfs).toFixed(2),
                      crop_ssc: parseFloat(el.ssc).toFixed(2),
                      crop_nsc: parseFloat(el.nsc).toFixed(2),
                      crop_saus: parseFloat(el.saus).toFixed(2),
                      crop_othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                      crop_coop: parseFloat(el.coop).toFixed(2),
                      crop_pvt: parseFloat(el.pvt).toFixed(2),
                      crop_seedhub: parseFloat(el.seedhub).toFixed(2),
                      crop_others: parseFloat(el.others).toFixed(2),
                      crop_total: parseFloat(el.total).toFixed(2),
                      crop_shtorsur: parseFloat(el.shtorsur).toFixed(2),
                      crop_BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                      crop_FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                      variety: [
                        {
                          variety_code: el.variety_code,
                          variety_name: el.variety_name,
                          not_year: el.not_year,
                          proposedAreaUnderVariety: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                          seedrate: parseFloat(el.seedrate).toFixed(2),
                          SRRTargetbySTATE: parseFloat(el.SRRTargetbySTATE).toFixed(2),
                          seedRequired: parseFloat(el.seedRequired).toFixed(2),
                          qualityquant: parseFloat(el.qualityquant).toFixed(2),
                          certifiedquant: parseFloat(el.certifiedquant).toFixed(2),
                          doa: parseFloat(el.doa).toFixed(2),
                          ssfs: parseFloat(el.ssfs).toFixed(2),
                          saus: parseFloat(el.saus).toFixed(2),
                          ssc: parseFloat(el.ssc).toFixed(2),
                          nsc: parseFloat(el.nsc).toFixed(2),
                          othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                          coop: parseFloat(el.coop).toFixed(2),
                          seedhub: parseFloat(el.seedhub).toFixed(2),
                          pvt: parseFloat(el.pvt).toFixed(2),
                          others: parseFloat(el.others).toFixed(2),
                          total: parseFloat(el.total).toFixed(2),
                          shtorsur: parseFloat(el.shtorsur).toFixed(2),
                          SMRKeptBSToFS: parseFloat(el.SMRKeptBSToFS).toFixed(2),
                          SMRKeptFSToCS: parseFloat(el.SMRKeptFSToCS).toFixed(2),
                          FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                          BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                        }]
                    },
                  ],
                });
              } else {
                const cropIndex = filteredData[seasonIndex].crop.findIndex((item) => item.crop_code === el.crop_code);
                if (cropIndex === -1) {
                  filteredData[seasonIndex].crop_count += 1;
                  filteredData[seasonIndex].season_variety_count += 1;
                  filteredData[seasonIndex].season_area = (
                    parseFloat(filteredData[seasonIndex].season_area) +
                    parseFloat(el.proposedAreaUnderVariety)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_seed_req = (
                    parseFloat(filteredData[seasonIndex].season_seed_req) +
                    parseFloat(el.seedRequired)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_doa = (
                    parseFloat(filteredData[seasonIndex].season_doa) +
                    parseFloat(el.doa)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_ssfs = (
                    parseFloat(filteredData[seasonIndex].season_ssfs) +
                    parseFloat(el.ssfs)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_ssc = (
                    parseFloat(filteredData[seasonIndex].season_ssc) +
                    parseFloat(el.ssc)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_nsc = (
                    parseFloat(filteredData[seasonIndex].season_nsc) +
                    parseFloat(el.nsc)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_saus = (
                    parseFloat(filteredData[seasonIndex].season_saus) +
                    parseFloat(el.saus)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_othergovpsu = (
                    parseFloat(filteredData[seasonIndex].season_othergovpsu) +
                    parseFloat(el.othergovpsu)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_coop = (
                    parseFloat(filteredData[seasonIndex].season_coop) +
                    parseFloat(el.coop)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_pvt = (
                    parseFloat(filteredData[seasonIndex].season_pvt) +
                    parseFloat(el.pvt)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_seedhub = (
                    parseFloat(filteredData[seasonIndex].season_seedhub) +
                    parseFloat(el.seedhub)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_others = (
                    parseFloat(filteredData[seasonIndex].season_others) +
                    parseFloat(el.others)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_total = (
                    parseFloat(filteredData[seasonIndex].season_total) +
                    parseFloat(el.total)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_shtorsur = (
                    parseFloat(filteredData[seasonIndex].season_shtorsur) +
                    parseFloat(el.shtorsur)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_BSRequiredtomeettargetsofFS = (
                    parseFloat(filteredData[seasonIndex].season_BSRequiredtomeettargetsofFS) +
                    parseFloat(el.BSRequiredtomeettargetsofFS)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_FSRequiredtomeettargetsofCS = (
                    parseFloat(filteredData[seasonIndex].season_FSRequiredtomeettargetsofCS) +
                    parseFloat(el.FSRequiredtomeettargetsofCS)
                  ).toFixed(2);

                  filteredData[seasonIndex].crop.push({
                    crop_code: el.crop_code,
                    crop_name: el.crop_name,
                    variety_count: 1,
                    crop_area: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                    crop_seed_req: parseFloat(el.seedRequired).toFixed(2),
                    crop_doa: parseFloat(el.doa).toFixed(2),
                    crop_ssfs: parseFloat(el.ssfs).toFixed(2),
                    crop_ssc: parseFloat(el.ssc).toFixed(2),
                    crop_nsc: parseFloat(el.nsc).toFixed(2),
                    crop_saus: parseFloat(el.saus).toFixed(2),
                    crop_othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                    crop_coop: parseFloat(el.coop).toFixed(2),
                    crop_pvt: parseFloat(el.pvt).toFixed(2),
                    crop_seedhub: parseFloat(el.seedhub).toFixed(2),
                    crop_others: parseFloat(el.others).toFixed(2),
                    crop_total: parseFloat(el.total).toFixed(2),
                    crop_shtorsur: parseFloat(el.shtorsur).toFixed(2),
                    crop_BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                    crop_FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                    variety: [
                      {
                        variety_code: el.variety_code,
                        variety_name: el.variety_name,
                        not_year: el.not_year,
                        proposedAreaUnderVariety: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                        seedrate: parseFloat(el.seedrate).toFixed(2),
                        SRRTargetbySTATE: parseFloat(el.SRRTargetbySTATE).toFixed(2),
                        seedRequired: parseFloat(el.seedRequired).toFixed(2),
                        qualityquant: parseFloat(el.qualityquant).toFixed(2),
                        certifiedquant: parseFloat(el.certifiedquant).toFixed(2),
                        doa: parseFloat(el.doa).toFixed(2),
                        ssfs: parseFloat(el.ssfs).toFixed(2),
                        saus: parseFloat(el.saus).toFixed(2),
                        ssc: parseFloat(el.ssc).toFixed(2),
                        nsc: parseFloat(el.nsc).toFixed(2),
                        othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                        coop: parseFloat(el.coop).toFixed(2),
                        seedhub: parseFloat(el.seedhub).toFixed(2),
                        pvt: parseFloat(el.pvt).toFixed(2),
                        others: parseFloat(el.others).toFixed(2),
                        total: parseFloat(el.total).toFixed(2),
                        shtorsur: parseFloat(el.shtorsur).toFixed(2),
                        SMRKeptBSToFS: parseFloat(el.SMRKeptBSToFS).toFixed(2),
                        SMRKeptFSToCS: parseFloat(el.SMRKeptFSToCS).toFixed(2),
                        FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                        BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                      }]
                  });


                }
                else {
                  filteredData[seasonIndex].crop[cropIndex].variety_count += 1;
                  filteredData[seasonIndex].crop[cropIndex].crop_area = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_area) +
                    parseFloat(el.proposedAreaUnderVariety)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_seed_req = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_seed_req) +
                    parseFloat(el.seedRequired)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_doa = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_doa) +
                    parseFloat(el.doa)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_ssfs = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_ssfs) +
                    parseFloat(el.ssfs)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_ssc = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_ssc) +
                    parseFloat(el.ssc)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_nsc = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_nsc) +
                    parseFloat(el.nsc)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_saus = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_saus) +
                    parseFloat(el.saus)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_othergovpsu = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_othergovpsu) +
                    parseFloat(el.othergovpsu)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_coop = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_coop) +
                    parseFloat(el.coop)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_pvt = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_pvt) +
                    parseFloat(el.pvt)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_seedhub = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_seedhub) +
                    parseFloat(el.seedhub)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_others = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_others) +
                    parseFloat(el.others)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_total = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_total) +
                    parseFloat(el.total)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_shtorsur = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_shtorsur) +
                    parseFloat(el.shtorsur)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_BSRequiredtomeettargetsofFS = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_BSRequiredtomeettargetsofFS) +
                    parseFloat(el.BSRequiredtomeettargetsofFS)
                  ).toFixed(2);
                  filteredData[seasonIndex].crop[cropIndex].crop_FSRequiredtomeettargetsofCS = (
                    parseFloat(filteredData[seasonIndex].crop[cropIndex].crop_FSRequiredtomeettargetsofCS) +
                    parseFloat(el.FSRequiredtomeettargetsofCS)
                  ).toFixed(2);
                  //usercontent
                  filteredData[seasonIndex].season_variety_count += 1;
                  filteredData[seasonIndex].season_area = (
                    parseFloat(filteredData[seasonIndex].season_area) +
                    parseFloat(el.proposedAreaUnderVariety)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_seed_req = (
                    parseFloat(filteredData[seasonIndex].season_seed_req) +
                    parseFloat(el.seedRequired)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_doa = (
                    parseFloat(filteredData[seasonIndex].season_doa) +
                    parseFloat(el.doa)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_ssfs = (
                    parseFloat(filteredData[seasonIndex].season_ssfs) +
                    parseFloat(el.ssfs)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_ssc = (
                    parseFloat(filteredData[seasonIndex].season_ssc) +
                    parseFloat(el.ssc)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_nsc = (
                    parseFloat(filteredData[seasonIndex].season_nsc) +
                    parseFloat(el.nsc)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_saus = (
                    parseFloat(filteredData[seasonIndex].season_saus) +
                    parseFloat(el.saus)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_othergovpsu = (
                    parseFloat(filteredData[seasonIndex].season_othergovpsu) +
                    parseFloat(el.othergovpsu)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_coop = (
                    parseFloat(filteredData[seasonIndex].season_coop) +
                    parseFloat(el.coop)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_pvt = (
                    parseFloat(filteredData[seasonIndex].season_pvt) +
                    parseFloat(el.pvt)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_seedhub = (
                    parseFloat(filteredData[seasonIndex].season_seedhub) +
                    parseFloat(el.seedhub)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_others = (
                    parseFloat(filteredData[seasonIndex].season_others) +
                    parseFloat(el.others)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_total = (
                    parseFloat(filteredData[seasonIndex].season_total) +
                    parseFloat(el.total)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_shtorsur = (
                    parseFloat(filteredData[seasonIndex].season_shtorsur) +
                    parseFloat(el.shtorsur)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_BSRequiredtomeettargetsofFS = (
                    parseFloat(filteredData[seasonIndex].season_BSRequiredtomeettargetsofFS) +
                    parseFloat(el.BSRequiredtomeettargetsofFS)
                  ).toFixed(2);
                  filteredData[seasonIndex].season_FSRequiredtomeettargetsofCS = (
                    parseFloat(filteredData[seasonIndex].season_FSRequiredtomeettargetsofCS) +
                    parseFloat(el.FSRequiredtomeettargetsofCS)
                  ).toFixed(2);

                  filteredData[seasonIndex].crop[cropIndex].variety.push({
                    variety_code: el.variety_code,
                    variety_name: el.variety_name,
                    not_year: el.not_date,
                    proposedAreaUnderVariety: parseFloat(el.proposedAreaUnderVariety).toFixed(2),
                    seedrate: parseFloat(el.seedrate).toFixed(2),
                    SRRTargetbySTATE: parseFloat(el.SRRTargetbySTATE).toFixed(2),
                    seedRequired: parseFloat(el.seedRequired).toFixed(2),
                    qualityquant: parseFloat(el.qualityquant).toFixed(2),
                    certifiedquant: parseFloat(el.certifiedquant).toFixed(2),
                    doa: parseFloat(el.doa).toFixed(2),
                    ssfs: parseFloat(el.ssfs).toFixed(2),
                    saus: parseFloat(el.saus).toFixed(2),
                    ssc: parseFloat(el.ssc).toFixed(2),
                    nsc: parseFloat(el.nsc).toFixed(2),
                    othergovpsu: parseFloat(el.othergovpsu).toFixed(2),
                    coop: parseFloat(el.coop).toFixed(2),
                    seedhub: parseFloat(el.seedhub).toFixed(2),
                    pvt: parseFloat(el.pvt).toFixed(2),
                    others: parseFloat(el.others).toFixed(2),
                    total: parseFloat(el.total).toFixed(2),
                    shtorsur: parseFloat(el.shtorsur).toFixed(2),
                    SMRKeptBSToFS: parseFloat(el.SMRKeptBSToFS).toFixed(2),
                    SMRKeptFSToCS: parseFloat(el.SMRKeptFSToCS).toFixed(2),
                    FSRequiredtomeettargetsofCS: parseFloat(el.FSRequiredtomeettargetsofCS).toFixed(2),
                    BSRequiredtomeettargetsofFS: parseFloat(el.BSRequiredtomeettargetsofFS).toFixed(2),
                  });



                }
              }


            })


            this.finalData = filteredData;
            this.totalData = totals;

            this.enableTable = true;
          } else {
            console.warn('API returned an unexpected status:', apiResponse?.Response.status_code);
          }
        }, (error) => {
          if (error.status === 404) {
            this.dummyData = [];
            this.freezeData = false;
            this.enableTable = false;
          } else if (error.status === 500) {
            Swal.fire({
              title: 'Oops',
              text: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15'
            })
          } else {
            console.error('Error fetching data:', error);
          }
        }

      );
  }

  isAddMore() {
    this.isCheck = true;
    if (this.dummyData && this.dummyData[0]?.is_finalised) {
      this.freezeData = true;

    } else {
      this.freezeData = false;
    }
  }
  // initSearchAndPagination() {
  //   if (!this.paginationUiComponent) {
  //     setTimeout(() => this.initSearchAndPagination(), 300);
  //     return;
  //   }
  //   this.paginationUiComponent.Init(this.filterPaginateSearch);
  // }

  updateForm() {
    const seedrate = Number(this.ngForm.controls['seedrate'].value);
    const proposedAreaUnderVariety = Number(this.ngForm.controls['proposedarea'].value);
    const qualityquant = Number(this.ngForm.controls['qualityquant'].value);
    const certifiedquant = Number(this.ngForm.controls['certifiedquant'].value);
    const totalreq = Number(this.ngForm.controls['totalreq'].value);
    const SMRKeptBSToFS = Number(this.ngForm.controls['smrbs'].value);
    const SMRKeptFSToCS = Number(this.ngForm.controls['smrfs'].value);
    const FSRequiredtomeettargetsofCS = certifiedquant / SMRKeptBSToFS || 0
    const BSRequiredtomeettargetsofFS = FSRequiredtomeettargetsofCS / SMRKeptFSToCS || 0
    if (proposedAreaUnderVariety === 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Proposed area under variety cannot be zero. Please enter the value.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });

      return;
    }
    if (totalreq === 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Seed Requirement cannot be zero. Please enter the value.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }

    if (seedrate === 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Seed rate cannot be zero. Please enter the value.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    if ((certifiedquant + qualityquant) !== totalreq) {
      Swal.fire({
        title: '<p style="font-size:25px;">Sum of certified quante & quality quant should be equal seed Requiredment. Please enter the value.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });

      return;
    }
    this.submitted = true;
    this.isShowTable = true;

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
      "FSRequiredtomeettargetsofCS": FSRequiredtomeettargetsofCS,
      "BSRequiredtomeettargetsofFS": BSRequiredtomeettargetsofFS,
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

      this.ngForm.patchValue(
        { total: total, shtorsub: shtorsub,fsreq: FSRequiredtomeettargetsofCS || 0, bsreq: BSRequiredtomeettargetsofFS|| 0 },
        { emitEvent: false }
      );
    });
    const route = `update-srp/${this.dataId}`;
    this.zsrmServiceService.putRequestCreator(route, null, baseParam).subscribe(data => {
      if (data.Response.status_code === 200) {
        this.is_update = true;
        this.isShowTable = true;
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        }).then(() => {
          this.getPageData();
          this.ngForm.controls['doa'].reset(0)
          this.ngForm.controls['nsc'].reset(0)
          this.ngForm.controls['ssf'].reset(0)
          this.ngForm.controls['pvt'].reset(0)
          this.ngForm.controls['sau'].reset(0)
          this.ngForm.controls['remarks'].reset('')
          this.ngForm.controls['hub'].reset(0)
          this.ngForm.controls['ssc'].reset(0)
          this.ngForm.controls['coop'].reset(0)
          this.ngForm.controls['others'].reset(0)
          this.ngForm.controls['othersgovt'].reset(0)
          this.ngForm.controls['smrfs'].reset(0)
          this.ngForm.controls['fsreq'].reset(0)
          this.ngForm.controls['smrbs'].reset(0)
          this.ngForm.controls['bsreq'].reset(0)
          this.ngForm.controls['proposedarea'].reset(0)
          this.ngForm.controls['seedrate'].reset(0)
          this.ngForm.controls['SRRTargetbySTATE'].reset(0)
          this.ngForm.controls['SRRTargetbyGOI'].reset(0)
          this.ngForm.controls['certifiedquant'].reset(0)
          this.ngForm.controls['qualityquant'].reset(0)
          this.submitted = false;
          this.isAddSelected = false;
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


  resetForm() {

    this.ngForm.controls['season'].reset('');
    this.selectCrop = '';
    this.selectVariety = '';
    this.ngForm.controls['crop'].reset('');
    this.ngForm.controls['variety'].reset('');
    this.submitted = false;
    this.isAddSelected = false;
    this.disableUpperSection = false;
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

  exportexcel(): void {
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'Crop-wise-srp-report';
    const element = document.getElementById('excel-table');
    const options = {
      margin: 5,
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 100,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
      jsPDF: { unit: 'mm', format: [300, 600], orientation: 'landscape' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

}