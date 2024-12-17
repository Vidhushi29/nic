import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { NucleusSeedAvailabilityByBreederSearchComponent } from 'src/app/common/nucleus-seed-availability-by-breeder-search/nucleus-seed-availability-by-breeder-search.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { BspProformasSearchUIFields } from 'src/app/common/data/ui-field-data/bsp-performas-search-ui-fields';
import { Router } from '@angular/router';


@Component({
  selector: 'app-proformas-vi-list',
  templateUrl: './proformas-vi-list.component.html',
  styleUrls: ['./proformas-vi-list.component.css']
})
export class ProformasViListComponent implements OnInit {
  @ViewChild(NucleusSeedAvailabilityByBreederSearchComponent) nucleusSeedAvailabilityByBreederSearchComponent: NucleusSeedAvailabilityByBreederSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  nucleusData: any;
  varietyName: any = [];
  cropName: any = [];
  todayDate = new Date();
  ngForm!: FormGroup;
  submitted: boolean = false;
  isActive: boolean = true
  noData: boolean;
  bspAllData: any = [];
  NaN: any = "N/A";
  currentUser: any;
  yearOfIndent = [
    { name: "2020-21", "value": 2020 },
    { name: "2021-22", "value": 2021 },
    { name: "2022-23", "value": 2022 },
    { name: "2023-24", "value": 2023 },
    { name: "2024-25", "value": 2024 },
    // { name: "2025-26", "value": 2025 }
  ]

  @Input() AddCrop: boolean = false;
  searchFormGroup: FormGroup = new FormGroup([]);
  fieldsList: any = [];
  @Input() AddSeedTesingLaboratoryList: boolean = false;
  @Input() MaximumLotSizeList: boolean = false;
  @Input() filters: any;
  @Input() componentName: any;

  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  constructor(private restService: RestService,
    private breederService: BreederService,
    private _service: ProductioncenterService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private bspProformasSearchUIFields: BspProformasSearchUIFields,
    private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_code: new FormControl(''),
      year: new FormControl(''),
      variety_code: new FormControl(''),
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
    this.LoadFilterData();
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

      if (x['formControlName'] == "cropName") {
        this.cropName = x['fieldDataList'];
      }
      delete x["validations"];
      x.gridColClass = "col-12 col-md-4 py-2 py-md-0";
      const newFormControl = new FormControl("");
      this.searchFormGroup.addControl(x.formControlName, newFormControl);

    });

    this.fieldsList = filteredBreederSeedSubmissionUIFields;

    this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.searchFormGroupControls["cropName"].patchValue("");

      this.breederService.getRequestCreator("getSeasonDataForBSP6List?year=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
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
      let year = this.searchFormGroupControls["yearofIndent"].value;

      this.breederService.getRequestCreator("getCropGroupDataForBSP6List?year=" + year.value + "&season=" + newValue.value).subscribe((data: any) => {
        if (data.EncryptedResponse.data) {
          let cropGroups = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['group_name'],
              value: element['crop_group_code']
            }
            cropGroups.push(temp);
          });
          this.fieldsList[2].fieldDataList = cropGroups;
        }
      })
    })

    this.searchFormGroupControls["cropGroup"].valueChanges.subscribe(newValue => {
      this.searchFormGroupControls["cropName"].patchValue("");
      let year = this.searchFormGroupControls["yearofIndent"].value;
      let season = this.searchFormGroupControls["season"].value;

      this.breederService.getRequestCreator("getCropsDataForBSP6List?year=" + year.value + "&season=" + season.value + "&cropGroup=" + newValue.value).subscribe((data: any) => {
        console.log(data)
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
      if (newValue) {
        this.searchFormGroupControls["veriety"].patchValue("");
        let paramsData = this.searchFormGroupControls["cropName"].value["value"]
        let year = this.searchFormGroupControls["yearofIndent"].value["value"]
        let season = this.searchFormGroupControls["season"].value["value"]
        let cropGroup = this.searchFormGroupControls["cropGroup"].value["value"]

        let varieties = []
        this.breederService.getRequestCreator("getVarietiesDataForBSP6List?cropCode=" + paramsData + "&year=" + year + "&season=" + season + "&cropGroup=" + cropGroup + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          data.EncryptedResponse.data?.forEach((element: any, index: number) => {
            varieties.push({ "name": element.m_crop_variety.variety_name, "value": element.m_crop_variety.variety_code, id: element.m_crop_variety.id })
          })
          this.fieldsList[4].fieldDataList = varieties;
        })
      }
    })
  }

  LoadFilterData(): void {
    this.breederService.getRequestCreator("getYearDataForBSP6List?user_id=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        let yrs = []
        years.forEach(x => {
          var temp = this.getFinancialYear(x.year)
          yrs.push({
            value: x.year,
            name: temp
          })
        })
        this.fieldsList[0].fieldDataList = yrs;
      }
    })
  }

  loadDraftBsp(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.isActive = !this.isActive;
    this.breederService.postRequestCreator("get-bsp6-list", null,
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
    ).subscribe(apiResponse => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        console.log("BSP6 Data list:", apiResponse)
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
  }
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.isActive = true
    this.breederService.postRequestCreator("get-bsp6-list", null,
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
    ).subscribe(apiResponse => {
      console.log("BSP6 Data list:", apiResponse)
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        console.log("BSP6 Data list:", apiResponse)
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


  }

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
          .postRequestCreator("delete-bsp6/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.getPageData(this.filterPaginateSearch.itemListCurrentPage);
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
                showCancelButton: false,
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
    this.searchFormGroupControls["cropGroup"].patchValue("");

    this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, allData.count);
    this.filterPaginateSearch.itemListCurrentPage = 1;

    this.initSearchAndPagination();
  }

  onSubmit(formData) {
  }

  search(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    if ((!this.searchFormGroupControls["yearofIndent"].value && !this.searchFormGroupControls["cropName"].value && !this.searchFormGroupControls["veriety"].value && !this.searchFormGroupControls["season"].value)) {
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

      let searchParams1 = [{ "yearOfIndent": null, "cropName": null, "cropVariety": null,"season": null }];
      let yearofIndent: null;
      let cropName: null;
      let cropVariety: null;
      let season: null;
      let cropGroupCode: null;
      // let allData = this.bspAllData;
      if (this.searchFormGroupControls["yearofIndent"] && this.searchFormGroupControls["yearofIndent"].value) {
        yearofIndent = this.searchFormGroupControls["yearofIndent"].value["value"].toString()
        // console.log(this.bspAllData)
        // allData = allData.filter(x => (x.year == yearofIndent))
        // console.log(allData)
      }

      if (this.searchFormGroupControls["cropName"] && this.searchFormGroupControls["cropName"].value) {
        cropName = this.searchFormGroupControls["cropName"].value["value"];
        // allData = allData.filter(x => x.crop_code == cropName)
      }

      if (this.searchFormGroupControls["season"] && this.searchFormGroupControls["season"].value) {
        season = this.searchFormGroupControls["season"].value["value"];
        // allData = allData.filter(x => x.season == season)
      }
      if (this.searchFormGroupControls["cropGroup"] && this.searchFormGroupControls["cropGroup"].value) {
        cropGroupCode = this.searchFormGroupControls["cropGroup"].value["value"];
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
      this.breederService.postRequestCreator("get-bsp6-list", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          "yearOfIndent": yearofIndent,
          "cropName": cropName,
          "cropVariety": cropVariety,
          "season": season,
          "cropGroupCode": cropGroupCode,
          "userId": this.currentUser.id,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,
  
        }
      }
      ).subscribe(apiResponse => {
        console.log("bsp3 list:", apiResponse)
        if (apiResponse !== undefined
          && apiResponse.EncryptedResponse !== undefined
          && apiResponse.EncryptedResponse.status_code == 200) {
            let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows;
          if (allData === undefined) {
            allData = [];
          }
          if (allData.length == 0) {
            this.noData = true;
          }
          else {
            this.bspAllData = allData
          }
          this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
          console.log(this.filterPaginateSearch)
        }
      });

    }
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

}
