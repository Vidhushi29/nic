import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/services/master/master.service';
import { convertDate, convertDates } from '../_helpers/utility';
import { AbstractControl } from '@angular/forms';
// import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-add-freeze-timeline-form',
  templateUrl: './add-freeze-timeline-form.component.html',
  styleUrls: ['./add-freeze-timeline-form.component.css'],
})
export class AddFreezeTimelineFormComponent implements OnInit {
  @ViewChild(IndentBreederSeedAllocationSearchComponent)
  indentBreederSeedAllocationSearchComponent:
    | IndentBreederSeedAllocationSearchComponent
    | undefined = undefined;
  @ViewChild(PaginationUiComponent)
  paginationUiComponent!: PaginationUiComponent;
  isActive = 1;
  isShowDiv: boolean = true;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  allData: any;
  seasonList: any;
  selectCrop: any;
  ngForm!: FormGroup;
  croupGroupList: any = [];
  croupGroup: any;
  submissionid: any;
  crop_name_list: any;
  selectCrop_group: any;
  season: any;
  submissionId: any;
  start_date: any;
  end_date: any;
  cropVarietyData: any;
  selectvariety_name: any;
  submitted: boolean = false;
  maturity_type: any;
  maturity_type_id: string;
  router: any;
  isView = false;
  error: { isError: boolean; errorMessage: string };
  DateValidator: boolean;
  dateValues: Date;
  maxDate: any;
  todayDate = new Date();
  year ;
  start_date_second=null;
  parsedDate = Date.parse(this.todayDate.toString());
  date;
  endDate = new Date();
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  dates = new Date();
  inValidDate = '';
  yaerOfIndent: any = [
    { 'year': '2026-2027', 'value': 2026 },
    { 'year': '2025-2026', 'value': 2025 },
    { 'year': '2024-2025', 'value': 2024 },
    { 'year': '2023-2024', 'value': 2023 },
  ]
  activitiesList: any;
  isEdit: boolean;
  title: string;
  minDate = new Date();
  day: number;
  days: number;
  months: any;
  days2: any;

  years=2000;

  constructor(
    private restService: RestService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private activeroute: ActivatedRoute,
    private service: SeedServiceService,
    private route: Router
  ) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group(
      {
        year_of_indent: new FormControl('', [Validators.required]),
        activites: new FormControl('', [Validators.required]),
        start_date: new FormControl('', [Validators.required]),
        end_date: new FormControl('', [Validators.required]),
        season: new FormControl('', [Validators.required]),
        status_toggle: new FormControl('')
      },
      // [ this.compareTwoDates]
      // { validator: this.dateRangeValidator() }
      // this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
      [Validators.required, this.dateRangeValidator]
    );
    this.ngForm.controls['start_date'].valueChanges.subscribe((newValue) => {
      this.start_date_second = (newValue.singleDate.jsDate).getFullYear()
      console.log(this.start_date_second,'this.start_date_second')
    });
    this.year=this.ngForm.controls['start_date'].value
    // this.start_date_second=this.year.singleDate.jsDate
    console.log(this.year,'this.year')

    if (this.route.url.includes('view')) {
      this.getListData();
      this.isView = true;
      this.isEdit = false;
      this.ngForm.controls['year_of_indent'].disable();
      this.ngForm.controls['season'].disable();
      this.ngForm.controls['status_toggle'].disable();
      this.ngForm.controls['activites'].disable();
      this.title = "View Freeze Timeline";
    }

    else if (this.route.url.includes('edit')) {
      this.getListData();
      this.isView = false;
      this.isEdit = true;
      this.ngForm.controls['season'].enable();
      this.ngForm.controls['activites'].enable();
      this.title = "Edit Freeze Timeline";

    } else {
      // this.ngForm.controls['season'].disable();
      this.ngForm.controls['activites'].disable();
      this.title = "Add Freeze Timeline";
    }

  }
  private dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const from = this.ngForm && this.ngForm.controls['start_date'].value;
    const to = this.ngForm && this.ngForm.controls['end_date'].value;
    if (from && to) {
      invalid = new Date(from).valueOf() > new Date(to).valueOf();
    }
    return invalid ? { invalidRange: { from, to } } : null;
  };
  myDate = new Date();
  m = new Date().getMonth().toString();
  y = new Date().getFullYear().toString();
  d = new Date().getDay().toString();
  ngOnInit(): void {
    // console.log('today date',this.m,this.y,this.d);
    this.getSeasonData();
    this.getActivitiesList();
    this.submissionId = this.activeroute.snapshot.paramMap.get('submissionid');
    this.dateValues = new Date();
    this.futureDate();
    this.date = new Date().toISOString().slice(0, 10);
    this.m = new Date(this.date).getMonth().toString();
    this.y = new Date(this.date).getFullYear().toString();
    this.d = new Date(this.date).getDate().toString();
    // console.log('new date', this.date);
    // this.days = parseInt(this.d)-1;
    // console.log('today date', parseInt(this.m)+1, this.y, parseInt(this.d)-1);

    if (!this.isEdit && !this.isView) {
      // this.ngForm.controls['season'].disable();
      // this.ngForm.controls['activites'].disable();
      this.ngForm.controls['year_of_indent'].valueChanges.subscribe((newValue) => {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['activites'].disable();
      });
      this.ngForm.controls['season'].valueChanges.subscribe((newValue) => {
        this.ngForm.controls['activites'].enable();
      });
      
    }
    console.log(this.start_date_second,'start_date_second')

  }
  get generateDefaultMonth(): string {
    let date = { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }

    //consolelog(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;

  }

  onDateChanged(event: any): void {
    console.log('event========?>', event)
    // date selected
    if (this.ngForm.controls['start_date'].value.singleDate.jsDate > event.singleDate.jsDate) {
      this.inValidDate = "End Date is not less than start Date"

    }
    else {
      this.inValidDate = "";
    }

  }
  onDateChangedStart(event: any): void {
    console.log('event',event)
     this.years = event && event.singleDate && event.singleDate.date && event.singleDate.date.year ? event.singleDate.date.year:'';
     this.months = event && event.singleDate && event.singleDate.date && event.singleDate.date.month ? event.singleDate.date.month:'';
    this.days2 = event && event.singleDate && event.singleDate.date && event.singleDate.date.day ? event.singleDate.date.day:'';
    this.myDpOptions1
//  console.log(year,month,day,'yar,month')

    if (this.ngForm.controls['end_date'].value.singleDate.jsDate < event.singleDate.jsDate) {
      this.inValidDate = "End Date is not less than start Date"

    }
    else {
      this.inValidDate = "";
    }
    // date selected

  }
  preventKeyPress(event) {
    event.preventDefault();
  }

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    disableUntil: { year: parseInt(this.y), month: parseInt(this.m)+1, day: this.todayDate.getDate() -1 },
    // disableSince: { year: this.todayDate.getFullYear(), month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() + 1 }
  };
  myDpOptions1: IAngularMyDpOptions = {
    
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableDates:[{year: 2023, month: 4, day: 7},{year: 2023, month: 4, day: 21}]
    // disableDates:[{year: 2023, month: 4, day: 7}]
    // disableSince: {}
    disableUntil: { year: parseInt(this.y), month: parseInt(this.m)+1, day: this.todayDate.getDate() -1 },
    // disableUntil: { year:  month: parseInt(this.m)+1, day: this.todayDate.getDate() -1 },

    // disableUntil: { year: (this.years), month: parsInt(this.months), day: parseInt(this.days2) },
    // disableUntil: { year: 2023, month: (this.todayDate.getMonth() + 1), day: this.todayDate.getDate() - 1 }
  };
  dateEndChange(){
    
  }
  futureDate() {
    let date: any = new Date();
    let todayDate: any = date.getDate();
    let month: any = date.getMonth();
    let year: any = date.getFullYear();
    if (todayDate < 10) {
      todayDate = '0' + todayDate;
    }
    if (month < 10) {
      month = '0' + month;
    }
    this.maxDate = year + '-' + '-' + month + '-' + todayDate;
  }
  getPageData(
    loadPageNumberData: number = 1,
    searchData: any | undefined = undefined
  ) {
    this.service
      .postRequestCreator('add-freeze-timelines-list', null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 5,
        search: {
          season_id: this.ngForm.controls['season'].value,
          // start_date: formData.start_date,
          // end_date_id: formData.end_date},
        },
      })
      .subscribe((apiResponse: any) => {
        console.log(apiResponse);
        if (
          apiResponse !== undefined &&
          apiResponse.EncryptedResponse !== undefined &&
          apiResponse.EncryptedResponse.status_code == 200
        ) {
          this.filterPaginateSearch.itemListPageSize = 10;
          console.log(apiResponse);

          this.allData = apiResponse.EncryptedResponse.data.season;
          console.log(this.allData);

          if (this.allData === undefined) {
            this.allData = [];
          }
          for (let i = 0; i < this.allData.length; i++) {
            this.maturity_type = this.allData[i].matuarity_type_id;
            this.maturity_type_id = this.maturity_type
              ? this.maturity_type == 1
                ? 'Early'
                : this.maturity_type == 2
                  ? 'Medium'
                  : this.maturity_type == 3
                    ? 'Late'
                    : 'NA'
              : '';
          }

          this.filterPaginateSearch.Init(
            this.allData,
            this,
            'getPageData',
            undefined,
            apiResponse.EncryptedResponse.data.season,
            true
          );
          this.initSearchAndPagination();
        }
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

  // async getCropNameList(newValue) {
  //   const res = this.croupGroupList.filter((x) => x.group_code == newValue);
  //   console.log(res);

  //   if (newValue) {
  //     const searchFilters = {
  //       search: {
  //         group_code: newValue,
  //       },
  //     };
  //     this.service
  //       .postRequestCreator('get-distrinct-season', null, searchFilters)
  //       .subscribe((apiResponse: any) => {
  //         if (
  //           apiResponse &&
  //           apiResponse.EncryptedResponse &&
  //           apiResponse.EncryptedResponse.status_code &&
  //           apiResponse.EncryptedResponse.status_code == 200
  //         ) {
  //           this.crop_name_list = apiResponse.EncryptedResponse.seasonList;
  //         } else {
  //           this.crop_name_list = [];
  //         }
  //       });
  //   }
  // }

  getCroupCroupList() {
    const route = 'season';
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.croupGroupList =
        data &&
          data['EncryptedResponse'] &&
          data['EncryptedResponse'].data &&
          data['EncryptedResponse'].data
          ? data['EncryptedResponse'].data
          : '';
    });
  }

  getActivitiesList() {
    const route = "activitiesListSecond";
    const result = this.service.postRequestCreator(route, null, null).subscribe((data: any) => {
      this.activitiesList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      console.log('activities data', this.activitiesList);
    })
  }

  delete(id: number, season: string) {
    Swal.fire({
      toast: false,
      icon: 'question',
      title: 'Are You Sure To Delete?',
      position: 'center',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.service
          .postRequestCreator('add-freeze-timelines-data/' + id)
          .subscribe((apiResponse: any) => {
            if (
              apiResponse &&
              apiResponse.EncryptedResponse &&
              apiResponse.EncryptedResponse.status_code &&
              apiResponse.EncryptedResponse.status_code == 200
            ) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
            }
          });
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        });
      }
    });
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {

      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value && t.value && f.value > t.value) {
        this.DateValidator = false;
        //  return {
        //    dates: "Date from should be less than Date to",

        //  };
        Swal.fire({
          title: '<p style="font-size:25px;">Date from should be less than Date to.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        });
      }
      else {
        this.DateValidator = true;
      }
      return {};
    };
  }
  enrollFormSave() {
    let season = this.ngForm.controls['season'].value;
    this.submitted = true;

    
    if(this.isEdit){
     
    }else{
      if (this.ngForm.invalid) {
        return;
      }

      if (this.inValidDate != '') {
        return;
      }
      if (this.DateValidator == false) {
        // alert("hiii")
        return;
      }
    }
    
    if (this.route.url.includes('edit')) {
      const submission_id =
        this.activeroute.snapshot.paramMap.get('submissionid');
      if (this.ngForm.controls['status_toggle'].value == true) {
        this.isActive = 1;
      }
      if (this.ngForm.controls['status_toggle'].value === false) {
        this.isActive = 0;
      }
      const data = {
        // crop: this.ngForm.controls['crop_name'].value,
        id: this.submissionId,
        season_name: this.ngForm.controls['season'].value,
        year_of_indent: this.ngForm.controls['year_of_indent'].value,
        activities: this.ngForm.controls['activites'].value,
        start_date: convertDates(this.ngForm.controls['start_date'].value.singleDate.jsDate),
        end_date: convertDates(this.ngForm.controls['end_date'].value.singleDate.jsDate),
        created_by: '209',
        active: this.isActive,
      };

      this.masterService
        .postRequestCreator(
          'add-freeze-timelines-data',
          null,
          data
        )
        .subscribe((res) => {
          console.log('successfully done', res);
          if (res.EncryptedResponse.status_code == 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
                confirmButtonColor: '#E97E15'
            }).then((x) => {
              this.route.navigate(['/add-freeze-timeline-list']);
            });
          }
          else {
            Swal.fire({
              title: 'Oops',
              text: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            });
          }
        });
    } else {
      let route = 'add-freeze-timelines-data';
      if (this.ngForm.controls['status_toggle'].value == true) {
        this.isActive = 1;
      }
      if (this.ngForm.controls['status_toggle'].value === false) {
        this.isActive = 0;
      }

      const data = {
        // crop: this.ngForm.controls['crop_name'].value,
        year_of_indent: this.ngForm.controls['year_of_indent'].value,
        activities: this.ngForm.controls['activites'].value,
        season_name: this.ngForm.controls['season'].value,
        start_date: convertDates(this.ngForm.controls['start_date'].value.singleDate.jsDate),
        end_date: convertDates(this.ngForm.controls['end_date'].value.singleDate.jsDate),
        active: this.isActive,
        // created_by: '209',
      };

      this.masterService
        .postRequestCreator(route, null, data)
        .subscribe((res) => {
          console.log('successfully done', res);
          if (res.EncryptedResponse.status_code == 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
            showCancelButton: false,
          confirmButtonColor: '#E97E15'
            }).then((x) => {
              this.route.navigate(['/add-freeze-timeline-list']);
            });
          }
          else if (res.EncryptedResponse.status_code == 401) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Already Exists.</p>',
              icon: 'warning',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            }).then((x) => {
            });
          } else {
            Swal.fire({
              title: 'Oops',
              text: '<p style="font-size:25px;">Something Went Wrong.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            });
          }
        });
    }
  }

  onSubmit(formData) {
    this.submitted = true;
    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the All Details correctly!', 'error');
      return;
    }
    let data = {
      season_id: formData.season,
      start_date: formData.start_date,
      end_date_id: formData.end_date,
    };
    console.log('successfully', data);
    this.getPageData();
  }

  clear() {
    this.ngForm.controls['season'].setValue('');
    this.ngForm.controls['start_date'].setValue('');
    this.ngForm.controls['end_date'].setValue('');
    // this.crop_name_list=[];
    // this.cropVarietyData=[];

    this.ngForm.controls['start_date'].disable();
    this.ngForm.controls['end_date'].disable();
    // this.filterPaginateSearch.itemListCurrentPage = 1;
    this.getPageData();
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    // this.initSearchAndPagination();
  }
  // searches(){
  //   const searchFilters = {
  //     search: {
  //       crop_group:(this.ngForm.controls["crop_group"].value),
  //       // crop_name:(this.ngForm.controls["crop_name"].value),
  //       // agencyName:this.ngForm.controls["agencyName"].value
  //     }
  //   };
  //   const result = this.service.postRequestCreator("", null,searchFilters).subscribe((data: any) => {
  //     let response = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data.data ? data['EncryptedResponse'].data.data : '';
  //     this.filterPaginateSearch.itemListPageSize = 10;

  //     this.filterPaginateSearch.Init(response, this, "getPageData");
  //     this.initSearchAndPagination();
  //   })

  // }
  search() {
    if (
      !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['start_date'].value &&
      !this.ngForm.controls['end_date'].value
    ) {
      Swal.fire({
        toast: false,
        icon: 'error',
        title: 'Please Select Something. ',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        showCancelButton: false,

        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action',
        },
      });

      return;
    } else {
      const route = 'filter-add-freeze-timeline-form';
      const param = {
        search: {
          crop_group: this.ngForm.controls['crop_group'].value,
          crop_name: this.ngForm.controls['crop_name'].value,
          variety_name: this.ngForm.controls['variety_name'].value,
          season: this.ngForm.controls['season'].value,
          start_date: this.ngForm.controls['start_date'].value,
          end_date: this.ngForm.controls['end_date'].value,
        },
      };

      const result = this.service
        .getPlansInfo(route, param)
        .then((data: any) => {
          let response =
            data &&
              data['EncryptedResponse'] &&
              data['EncryptedResponse'].data.season &&
              data['EncryptedResponse'].data.start_date
              ? data['EncryptedResponse'].data.end_date
              : '';

          this.filterPaginateSearch.itemListPageSize = 10;
          this.filterPaginateSearch.itemListCurrentPage = 1;
          this.initSearchAndPagination();
          this.filterPaginateSearch.Init(response, this, 'getPageData');
        });
    }
  }
  // async getCropVarietyData(newValue) {
  //   const searchFilters = {
  //     search: {
  //       crop_code: newValue,
  //       cropGroup: this.ngForm.controls['crop_group'].value,
  //     },
  //   };
  //   this.service
  //     .postRequestCreator(
  //       'get-distrinct-season-characterstics',
  //       null,
  //       searchFilters
  //     )
  //     .subscribe((apiResponse: any) => {
  //       if (
  //         apiResponse &&
  //         apiResponse.EncryptedResponse &&
  //         apiResponse.EncryptedResponse.status_code &&
  //         apiResponse.EncryptedResponse.status_code == 200
  //       ) {
  //         this.seasonList = apiResponse.EncryptedResponse.seasonList;
  //       } else {
  //         this.cropVarietyData = [];
  //         this.ngForm.controls['end_date'].setValue('');
  //         this.ngForm.controls['end_date'].disable();
  //       }
  //     });
  // }
  getSeasonData() {
    const route = 'get-season-details';
    const result = this.service
      .postRequestCreator(route, this.seasonList)
      .subscribe((data) => {
        this.seasonList =
          data && data.EncryptedResponse && data.EncryptedResponse.data
            ? data.EncryptedResponse.data
            : 'season';
        console.log('finish', this.seasonList);
      });
  }
  getListData() {
    // this.getSeasonData();
    const param = {
      search: {
        submissionid: this.activeroute.snapshot.paramMap.get('submissionid'),
      },
    };
    console.log('this.submissionid');

    const result = this.masterService
      .postRequestCreator('get-freeze-timelines-data-by-id', null, param)
      .subscribe((data: any) => {
        let response =
          data &&
            data['EncryptedResponse'] &&
            data['EncryptedResponse'].data &&
            data['EncryptedResponse'].data
            ? data['EncryptedResponse'].data
            : '';
        // let datas = this.seasonList.filter((x: { season_code: any; }) => (x.season_code) == response.season);
        // this.crop_code_value = response.crop_code;
        if (response) {
          //   start_date: new FormControl(''),
          // end_date: new FormControl(''),
          // season: new FormControl(''),
          // });

          this.ngForm.controls['season'].patchValue(response[0].season_name);
          this.ngForm.controls['year_of_indent'].patchValue(response[0].year_of_indent);
          this.ngForm.controls['activites'].patchValue(response[0].activitie_id);
          const new_start_date = response[0].start_date;

          const start_date_response = convertDates(new_start_date);
          this.ngForm.controls['start_date'].patchValue({
            // response[0].start_date
            dateRange: null,
            isRange: false,
            singleDate: {
              formatted: response[0].start_date,
              jsDate: new Date(response[0].start_date)
            }
          });
          const new_end_date = response[0].end_date;

          const end_date_response = convertDates(new_end_date);
          this.ngForm.controls['end_date'].patchValue({
            // response[0].end_date
            dateRange: null,
            isRange: false,
            singleDate: {
              formatted: response[0].end_date,
              jsDate: new Date(response[0].end_date)
            }
          });
          if (response && response[0].is_active == 0) {
            this.ngForm.controls['status_toggle'].patchValue(false);
            this.isShowDiv = true;
            this.isActive = 0;
          }
          if (response && response[0].is_active == 1) {
            this.ngForm.controls['status_toggle'].patchValue(true);
            this.isShowDiv = false;
            this.isActive = 1;
          }

        }
      });

  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
    if (this.isShowDiv) {
      this.isActive = 1
    }
    else {
      this.isActive = 0
    }

  }

}
