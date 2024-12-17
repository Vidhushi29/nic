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
import { Router } from '@angular/router';
import { SeedServiceService } from 'src/app/services/seed-service.service';

@Component({
  selector: 'app-allocation-breeder-seed-spa-list',
  templateUrl: './allocation-breeder-seed-spa-list.component.html',
  styleUrls: ['./allocation-breeder-seed-spa-list.component.css']
})
export class AllocationBreederSeedSpaListComponent implements OnInit {

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
  isActive: boolean = true
  bspAllData: any = [];
  currentUser: any;

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
    private service: SeedServiceService) {
    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.createEnrollForm();

  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      cropName: new FormControl(''),
      year: new FormControl(''),
      variety_code: new FormControl(''),
      season: new FormControl(''),

    });

  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  ngOnInit(): void {

    this.filterPaginateSearch.itemListPageSize = 50;
    this.getPageData();
    this.createYearRange();

    let filteredBreederSeedSubmissionUIFields;
    if (this.componentName == "seed_multiplication") {
      filteredBreederSeedSubmissionUIFields = this.bspProformasSearchUIFields.get
        .filter(x => x.formControlName == "cropGroup" || x.formControlName == "cropName" || x.formControlName == "season")
        .map(x => {
          return { ...x };
        });
    } else {
      filteredBreederSeedSubmissionUIFields = this.bspProformasSearchUIFields.get
      .filter(x => x.formControlName == "yearofIndent" || x.formControlName == "season" || x.formControlName == "cropGroup" || x.formControlName == "cropName" || x.formControlName == "veriety")
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

    this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.breederService.getRequestCreatorNew("season-allocation-to-spa?user_id=" + this.currentUser.id + "&year=" + newValue.value).subscribe((dataList: any) => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let seasons = []
          dataList.EncryptedResponse.data.forEach(element => {
            let temp = { name: element['m_season.season'], value: element['season']}
            seasons.push(temp);
          });
          this.fieldsList[1].fieldDataList = seasons;
        }
      })
    });

    this.searchFormGroupControls["season"].valueChanges.subscribe(newValue => {
      let year = this.searchFormGroupControls["yearofIndent"].value.value;
      this.breederService.getRequestCreatorNew("cropgroup-allocation-to-spa?user_id=" + this.currentUser.id + "&year=" + year + "&season="+ newValue.value).subscribe((dataList: any) => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let cropGroups = []
          dataList.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['group_name'],
              value: element['crop_group_code']
            }
            cropGroups.push(temp);
          });
          this.fieldsList[2].fieldDataList = cropGroups;
      }
      })
    });

    this.searchFormGroupControls["cropGroup"].valueChanges.subscribe(newValue => {
      this.searchFormGroupControls["cropName"].patchValue("");

      let year = this.searchFormGroupControls["yearofIndent"].value;
      let season = this.searchFormGroupControls["season"].value;

      this.breederService.getRequestCreator("crop-allocation-to-spa?year=" + year.value + "&season=" + season.value + "&cropGroup=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
        if (data.EncryptedResponse.data) {
          let cropNames = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['m_crop.crop_name'],
              value: element['crop_code']
            }
            cropNames.push(temp);
          });
          this.fieldsList[3].fieldDataList = cropNames;
        }
      })
    })


    this.searchFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      let year = this.searchFormGroupControls["yearofIndent"].value;
      let season = this.searchFormGroupControls["season"].value;
      this.breederService.getRequestCreatorNew("varieties-allocation-to-spa?user_id=" + this.currentUser.id + "&year=" + year.value + "&season="+ season.value + "&cropCode="+ newValue.value).subscribe((dataList: any) => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let varieties = []
          dataList.EncryptedResponse.data.forEach(element => {
            let temp = { name: element.m_crop_variety.variety_name, value: element.m_crop_variety.variety_code, id: element.m_crop_variety.id}
            varieties.push(temp);
          });
          console.log('varieties', varieties)
          this.fieldsList[4].fieldDataList = varieties;
        }
      })
    });
  }

  createYearRange(): void {
    this.breederService.getRequestCreatorNew("year-allocation-to-spa?user_id="+this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        let yrs = []
        years.forEach(x => {
          var temp = this.getFinancialYear(x.year)
          yrs.push({ value: x.year, name: temp })
        })
        this.fieldsList[0].fieldDataList = yrs;
      }
    })
    // this.breederService.getRequestCreator("getYearOfIndentForIndentorLifting").subscribe((data: any) => {
    //   if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
    //     let years = data.EncryptedResponse.data
    //     let yrs = []
    //     years.forEach(x => {
    //       var temp = this.getFinancialYear(x.year)
    //       yrs.push({
    //         value: x.year,
    //         name: temp
    //       })
    //     })
    //     this.fieldsList[0].fieldDataList = yrs;
    //   }
    // })
  }

  loadDraftBsp(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.isActive = !this.isActive;
    this.breederService.postRequestCreator("get-allocation-to-spa-list-second", null,
      {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          "yearOfIndent": null,
          "cropName": null,
          "cropVariety": null,
          "userId": this.currentUser.id,
          "isDraft": 1,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,

        }
      }
    ).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows;
        if (allData.length == 0) {
          this.noData = true;
        } else {
          this.bspAllData = allData
        }
        this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });
  }

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.isActive = true
    this.breederService.postRequestCreator("get-allocation-to-spa-list-second", null,
      {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          "yearOfIndent": null,
          "cropName": null,
          "cropVariety": null,
          "userId": this.currentUser.id,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,

        }
      }
    ).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows;
        if (allData.length == 0) {
          this.noData = true;
        } else {
          this.bspAllData = allData
        }
        this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
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
  // + "'"
  delete(id: number) {
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
          .postRequestCreator("allocation-to-spa/delete/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
            }
            else {
              Swal.fire({
                title: 'Oops',
                text: '<p style="font-size:25px;">Something Went Wrong.</p>',
                icon: 'error',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
            }
          });
      }
    })
  }
  clear() {
    this.ngForm.reset();
    let allData = this.bspAllData;
    if (allData.length == 0) {
      this.noData = true;
    }
    this.searchFormGroupControls["cropName"].patchValue("");
    this.searchFormGroupControls["yearofIndent"].patchValue("");
    this.searchFormGroupControls["veriety"].patchValue("");
    this.searchFormGroupControls["season"].patchValue("");


    this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, allData.count);
    this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    // this.initSearchAndPagination();
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
      "season": formData.season
    }
    this.getPageData(1, data);
  }

  search(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    if ((!this.searchFormGroupControls["yearofIndent"].value && !this.searchFormGroupControls["season"].value && !this.searchFormGroupControls["cropName"].value && !this.searchFormGroupControls["veriety"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }


    let allData = this.bspAllData;

    let searchParams1 = [{ "yearOfIndent": null, "cropName": null, "cropVariety": null, "season": null }];
    let yearofIndent: null;
    let cropName: null;
    let cropVariety: null;
    let season: null;
    if (this.searchFormGroupControls["yearofIndent"] && this.searchFormGroupControls["yearofIndent"].value) {
      yearofIndent = this.searchFormGroupControls["yearofIndent"].value["value"].toString()
      // allData = allData.filter(x => (x.year == yearofIndent))
    }

    if (this.searchFormGroupControls["cropName"] && this.searchFormGroupControls["cropName"].value) {
      cropName = this.searchFormGroupControls["cropName"].value["value"];
      // allData = allData.filter(x => x.crop_code == cropName)
    }

    if (this.searchFormGroupControls["season"] && this.searchFormGroupControls["season"].value) {
      season = this.searchFormGroupControls["season"].value["value"];
      // allData = allData.filter(x => x.season == season)
    }

    if (this.searchFormGroupControls["veriety"] && this.searchFormGroupControls["veriety"].value) {
      cropVariety = this.searchFormGroupControls["veriety"].value["id"];
      // allData = allData.filter(x => x.variety_id == cropVariety)
    }

    if (yearofIndent === null && cropName === null && cropVariety === null) {
      Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
      return;
    }
    this.breederService.postRequestCreator("get-allocation-to-spa-list-second", null, {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize ||50,
      search: {
        "yearOfIndent": yearofIndent,
        "cropName": cropName,
        "cropVariety": cropVariety,
        "userId": this.currentUser.id,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,

      }
    }
    ).subscribe(apiResponse => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows;
        if (allData === undefined) {
          allData = [];
        }
        if (allData.length == 0) {
          this.noData = true;
        } else {
          this.bspAllData = allData
        }
        this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
        this.initSearchAndPagination();
      }
    });

    this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, allData.count);
    this.initSearchAndPagination();

  }
  

}
