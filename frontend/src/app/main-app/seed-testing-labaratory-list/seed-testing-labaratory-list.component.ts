import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { BspProformasSearchComponent } from 'src/app/common/bsp-proformas-search/bsp-proformas-search.component';
import { BspProformasSearchUIFields } from 'src/app/common/data/ui-field-data/bsp-performas-search-ui-fields';
import { NucleusSeedAvailabilityByBreederSearchComponent } from 'src/app/common/nucleus-seed-availability-by-breeder-search/nucleus-seed-availability-by-breeder-search.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seed-testing-labaratory-list',
  templateUrl: './seed-testing-labaratory-list.component.html',
  styleUrls: ['./seed-testing-labaratory-list.component.css']
})
export class SeedTestingLabaratoryListComponent implements OnInit {
  @ViewChild(BspProformasSearchComponent) BspProformasSearchComponent: BspProformasSearchComponent | undefined = undefined;
  @ViewChild(NucleusSeedAvailabilityByBreederSearchComponent) nucleusSeedAvailabilityByBreederSearchComponent: NucleusSeedAvailabilityByBreederSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  nucleusData: any;
  yearOfIndent: any = [];
  varietyName: any = [];
  cropName: any = [];
  todayDate = new Date();
  ngForm!: FormGroup;
  formSuperGroup: FormGroup = new FormGroup([]);
  submitted: boolean = false;
  noData: boolean;
  NaN: any = "N/A"
  testingList: any = [];
  currentUser: any = { id: 15, name: "Hello Breeder" };

  @Input() AddCrop: boolean = false;
  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  @Input() AddSeedTesingLaboratoryList: boolean = false;
  @Input() MaximumLotSizeList: boolean = false;
  @Input() filters: any;
  @Input() componentName: any;

  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  constructor(private restService: RestService,
    private breederService: BreederService,
    private bspProformasSearchUIFields: BspProformasSearchUIFields,
    private _service: ProductioncenterService,
    private fb: FormBuilder,
    private router: Router,
    private masterService: MasterService,) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_code: new FormControl(''),
      year: new FormControl(''),
      variety_code: new FormControl(''),
    });

  }

  ngOnInit(): void {
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name
    // localStorage.setItem('logined_user', "productionCenter");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    this.filterPaginateSearch.itemListPageSize = 5;

    this.getYearsData();
    this.getPageData();

    this.createYearRange(1990, this.todayDate.getFullYear());

    let filteredBreederSeedSubmissionUIFields;
    if (this.componentName == "seed_multiplication") {
      filteredBreederSeedSubmissionUIFields = this.bspProformasSearchUIFields.get
        .filter(x => x.formControlName == "cropGroup" || x.formControlName == "cropName" || x.formControlName == "season")
        .map(x => {
          return { ...x };
        });
    } else {
      filteredBreederSeedSubmissionUIFields = this.bspProformasSearchUIFields.get
        .filter(x => x.formControlName == "yearofIndent" || x.formControlName == "cropName" || x.formControlName == "veriety" || x.formControlName == "season" || x.formControlName == "reportStatus")
        .map(x => {
          return { ...x };
        });
    }


    filteredBreederSeedSubmissionUIFields.forEach(x => {
      delete x["validations"];

      x.gridColClass = "col-12 col-md-4 py-2 py-md-0";
      const newFormControl = new FormControl("");
      this.searchFormGroup.addControl(x.formControlName, newFormControl);

    });

    this.fieldsList = filteredBreederSeedSubmissionUIFields;

    if (this.router.url.includes('/add-crop')) {
      this.AddCrop = true
    } else if (this.router.url.includes('/add-seed-testing-laboratory-list')) {
      this.AddSeedTesingLaboratoryList = true
    }

    this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.searchFormGroupControls["cropName"].patchValue("");

      this.breederService.getRequestCreator("getSeasonDataForSeedTestingReports?year_of_indent=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
        if (data.EncryptedResponse.data) {
          let seasons = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['m_season.season'],
              value: element['season']
            }
            seasons.push(temp);
          });
          this.fieldsList[1].fieldDataList = seasons;
        }
      })
    })

    this.searchFormGroupControls["season"].valueChanges.subscribe(newValue => {
      let year = this.searchFormGroupControls["yearofIndent"].value['value'];

      this.breederService.getRequestCreator("getCropsDataForSeedTestingReports?year_of_indent=" + year + "&season=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
        this.cropName = [];

        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          var crops = []
          data.EncryptedResponse.data.forEach(x => {
            var object = {
              name: x['m_crop.crop_name'],
              value: x['crop_code']
            }
            crops.push(object);
          });
          this.fieldsList[2].fieldDataList = crops;
        }
      })
    })

    this.searchFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchFormGroupControls["veriety"].patchValue("");

        let year = this.searchFormGroupControls["yearofIndent"].value['value'];
        let season = this.searchFormGroupControls["season"].value['value'];

        let varieties = []

        this.breederService.getRequestCreator("getVarietiesDataForSeedTestingReports?year_of_indent=" + year + "&season=" + season + "&crop_code=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          data.EncryptedResponse.data?.forEach((element: any, index: number) => {
            varieties.push({ "name": element['m_crop_variety.variety_name'], "value": element['m_crop_variety.variety_code'], id: element.variety_id })
          })
          this.fieldsList[3].fieldDataList = varieties;
        })
      }

    })

    this.searchFormGroupControls["veriety"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchFormGroupControls["reportStatus"].patchValue("");

        let year = this.searchFormGroupControls["yearofIndent"].value['value'];
        let season = this.searchFormGroupControls["season"].value['value'];
        let crop_code = this.searchFormGroupControls["cropName"].value['value'];

        let object = {
          year_of_indent: year,
          season: season,
          crop_code: crop_code,
          user_id: this.currentUser.id,
          variety_id: newValue.id
        }

        let reportStatus = []
        this.breederService.postRequestCreator("getReportDataForSeedTestingReports", null, object).subscribe((data: any) => {
          if(data && data.EncryptedResponse && data.EncryptedResponse.data) {
            data.EncryptedResponse.data.forEach(element => {
              if(element) {
                let tempObject = {
                  "name": element.is_report_pass ? "Pass" : "Fail",
                  "value": element.is_report_pass
                }

                reportStatus.push(tempObject)
              }
            });

            this.fieldsList[4].fieldDataList = reportStatus;
          }
        })
      }

    })

  }

  createYearRange(start: number, end: number): void {
    if (start <= end) {
      this.yearOfIndent.push({ name: start + "", value: start });
      this.createYearRange(start + 1, end);
    }
  }

  getYearsData(): void {
    this.breederService.getRequestCreator("getYearDataForSeedTestingReports?user_id=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        let yrs = []
        years.forEach(x => {
          var temp = this.getFinancialYear(x.year_of_indent)
          yrs.push({
            value: x.year_of_indent,
            name: temp
          })
        })
        this.fieldsList[0].fieldDataList = yrs;
      }
    })
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }


  getPageData() {
    this.breederService.getRequestCreator("getAllSeedTestingReports/" + this.currentUser.id).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.testingList = apiResponse.EncryptedResponse.data.sort(
          (objA, objB) => Number(objB.id) - Number(objA.id),
        );

        console.log(this.testingList)
      }
    });
  }

  initSearchAndPagination() {
    if (this.nucleusSeedAvailabilityByBreederSearchComponent === undefined || this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }

    this.nucleusSeedAvailabilityByBreederSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }

  delete(data: any) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Delete?",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.breederService
          .postRequestCreator("deleteSeedTestingReports/" + data.id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this._service
                .postRequestCreator("get-lot-number", {
                  search: {
                    year: data.year_of_indent,
                    crop_code: data.crop_code,
                    variety_id: data.variety_id,
                    id: data.lot_number
                  }
                })
                .subscribe((apiResponse: any) => {
                  if (apiResponse !== undefined
                    && apiResponse.EncryptedResponse !== undefined
                    && apiResponse.EncryptedResponse.status_code == 200 && apiResponse.EncryptedResponse.data.rows.length > 0) {
                    var lot_data = apiResponse.EncryptedResponse.data.rows[0];
                    lot_data.reserved_lot_number = false;

                    this._service.postRequestCreator("update-lot-number", lot_data).subscribe((apiResponse: any) => {
                      if (apiResponse) {
                        this.getPageData();
                      }
                    });

                  }
                });

            }
          });
      }
    })
  }

  clear() {
    this.searchFormGroup.reset();
    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    this.initSearchAndPagination();
  }

  onSubmit(formData) {
    this.submitted = true;
    if (this.ngForm.invalid) {
      Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
      return;
    }
    let data = {
      "year": formData.year,
      "crop_code": formData.crop_code,
      "variety_code": formData.variety_code,
      "id": this.currentUser.id
    }
    this.getPageData();
  }

  search() {
    if ((!this.searchFormGroupControls["yearofIndent"].value && !this.searchFormGroupControls["season"].value && !this.searchFormGroupControls["cropName"].value && !this.searchFormGroupControls["veriety"].value && !this.searchFormGroupControls["reportStatus"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {
      let yearofIndent: any;
      let season: any;
      let cropName: any;
      let cropVariety: any;
      let reportStatus: any;

      this.breederService.getRequestCreator("getAllSeedTestingReports/" + this.currentUser.id).subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.testingList = apiResponse.EncryptedResponse.data;

          let allData = this.testingList;


          if (this.searchFormGroupControls["yearofIndent"] && this.searchFormGroupControls["yearofIndent"].value) {
            yearofIndent = this.searchFormGroupControls["yearofIndent"].value["value"]
            allData = allData.filter(x => (x.year_of_indent == yearofIndent))
          }

          if (this.searchFormGroupControls["season"] && this.searchFormGroupControls["season"].value) {
            season = this.searchFormGroupControls["season"].value["value"];
            allData = allData.filter(x => x.season == season)
          }

          if (this.searchFormGroupControls["cropName"] && this.searchFormGroupControls["cropName"].value) {
            cropName = this.searchFormGroupControls["cropName"].value["value"];
            allData = allData.filter(x => x.crop_code == cropName)
          }

          if (this.searchFormGroupControls["veriety"] && this.searchFormGroupControls["veriety"].value) {
            cropVariety = this.searchFormGroupControls["veriety"].value["id"];
            allData = allData.filter(x => x.variety_id == cropVariety)
          }

          if (this.searchFormGroupControls["reportStatus"] && this.searchFormGroupControls["reportStatus"].value) {
            reportStatus = this.searchFormGroupControls["reportStatus"].value["value"];
            allData = allData.filter(x => x.is_report_pass == reportStatus)
          }

          if (yearofIndent === null && cropName === null && cropVariety === null) {
            Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
            return;
          }
          this.testingList = allData;

          this.filterPaginateSearch.itemListCurrentPage = 1;
          this.initSearchAndPagination();
        }
      });

    }
  }
}
