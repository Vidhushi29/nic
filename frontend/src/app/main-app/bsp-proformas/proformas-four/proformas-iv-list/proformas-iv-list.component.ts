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
  selector: 'app-proformas-iv-list',
  templateUrl: './proformas-iv-list.component.html',
  styleUrls: ['./proformas-iv-list.component.css']
})
export class ProformasIvListComponent implements OnInit {

  @ViewChild(NucleusSeedAvailabilityByBreederSearchComponent) nucleusSeedAvailabilityByBreederSearchComponent: NucleusSeedAvailabilityByBreederSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  nucleusData: any;
  varietyName: any = [];
  cropName: any = [];
  todayDate = new Date();
  ngForm!: FormGroup;
  submitted: boolean = false;
  isActive: boolean = true;
  noData: boolean;
  bspAllData: any = [];
  yearOfIndent = [
    { name: "2020-21", "value": 2020 },
    { name: "2021-22", "value": 2021 },
    { name: "2022-23", "value": 2022 },
    { name: "2023-24", "value": 2023 },
    { name: "2024-25", "value": 2024 },
    // { name: "2025-26", "value": 2025 }
  ]
  currentUser: any = { id: 10, name: "Production center User" };

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
    private bspProformasSearchUIFields: BspProformasSearchUIFields,
    private masterService: MasterService,
    private router: Router
  ) {
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name
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
    // localStorage.setItem('logined_user', "productionCenter");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    this.filterPaginateSearch.itemListPageSize = 50;
    this.getPageData();
    this.getYearsData();

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

    if (this.router.url.includes('/breeder/bsp-proformas/proformas-2s')) {
      this.AddCrop = true
    } else if (this.router.url.includes('/breeder/bsp-proformas/proformas-2s')) {
      this.AddSeedTesingLaboratoryList = true
    }

    this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.searchFormGroupControls["cropName"].patchValue("");

      this.breederService.getRequestCreator("getSeasonDataForBSP4List?year=" + newValue.value + "&user_id=" + currentUser.id).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
          let seasons = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['m_season.season'],
              value: element['season']
            }
            seasons.push(temp);
          });
          this.fieldsList[1].fieldDataList = seasons.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        }
      })
    })

    this.searchFormGroupControls["season"].valueChanges.subscribe(newValue => {
      let year = this.searchFormGroupControls["yearofIndent"].value;

      this.breederService.getRequestCreator("getCropGroupDataForBSP4List?year=" + year.value + "&season=" + newValue.value).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
          let cropGroups = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['group_name'],
              value: element['crop_group_code']
            }
            cropGroups.push(temp);
          });
          this.fieldsList[2].fieldDataList = cropGroups.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        }
      })
    })

    this.searchFormGroupControls["cropGroup"].valueChanges.subscribe(newValue => {
      this.searchFormGroupControls["cropName"].patchValue("");
      let year = this.searchFormGroupControls["yearofIndent"].value;
      let season = this.searchFormGroupControls["season"].value;

      this.breederService.getRequestCreator("getCropsDataForBSP4List?year=" + year.value + "&season=" + season.value + "&cropGroup=" + newValue.value + "&user_id=" + currentUser.id).subscribe((data: any) => {
        console.log(data)
        if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
          let cropNames = []
          data.EncryptedResponse.data.forEach(element => {
            if (element) {
              let temp = {
                name: element['m_crop.crop_name'],
                value: element['crop_code']
              }
              cropNames.push(temp);
            }
          });
          console.log(cropNames)
          this.fieldsList[3].fieldDataList = cropNames.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
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
        this.breederService.getRequestCreator("getVarietiesDataForBSP4List?cropCode=" + paramsData + "&year=" + year + "&season=" + season + "&cropGroup=" + cropGroup + "&user_id=" + currentUser.id).subscribe((data: any) => {
          data.EncryptedResponse.data?.forEach((element: any, index: number) => {
            varieties.push({ "name": element.m_crop_variety.variety_name, "value": element.m_crop_variety.variety_code, id: element.m_crop_variety.id })
          })
          this.fieldsList[4].fieldDataList = varieties.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        })
      }
    })
  }

  getYearsData(): void {
    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.breederService.getRequestCreator("getYearDataForBSP4List?user_id=" + currentUser.id).subscribe((data: any) => {
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
    this.isActive = false;
    this.breederService.postRequestCreator("get-bsp4-list", null,
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
      console.log("BSP2 Data list:", apiResponse)
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

  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.isActive = true;
    this.breederService.postRequestCreator("get-bsp4-list", null,
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
      console.log("BSP2 Data list:", apiResponse)
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

  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
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
          .postRequestCreator("delete-bsp4/" + id, null, null)
          .subscribe((apiResponse: any) => {
            console.log(apiResponse)
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
    this.getPageData();
    this.searchFormGroupControls["cropName"].patchValue("");
    this.searchFormGroupControls["yearofIndent"].patchValue("");
    this.searchFormGroupControls["veriety"].patchValue("");
    this.searchFormGroupControls["season"].patchValue("");
    this.searchFormGroupControls["cropGroup"].patchValue("");
    // this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, allData.count);
    // this.initSearchAndPagination();
  }

  onSubmit(formData) {
    // this.submitted = true;
    // if (this.ngForm.invalid) {
    //   Swal.fire('Error', 'Please Fill the All Details correctly!', 'error');
    //   return;
    // }
    // let data = {
    //   "year": formData.year,
    //   "crop_code": formData.crop_code,
    //   "variety_code": formData.variety_code
    // }
    // this.getPageData(1, data);
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

      let searchParams1 = [{ "yearOfIndent": null, "cropName": null, "cropVariety": null, "season": null }];
      let yearofIndent = null;
      let cropName = null;
      let cropVariety = null;
      let season = null;
      let cropGroupCode = null;
      if (this.searchFormGroupControls["yearofIndent"] && this.searchFormGroupControls["yearofIndent"].value) {
        yearofIndent = this.searchFormGroupControls["yearofIndent"].value["value"].toString()
        // allData = allData.filter(x => (x.year == yearofIndent))
      }

      if (this.searchFormGroupControls["season"] && this.searchFormGroupControls["season"].value) {
        season = this.searchFormGroupControls["season"].value["value"];
        // allData = allData.filter(x => x.season == season)
      }

      if (this.searchFormGroupControls["cropName"] && this.searchFormGroupControls["cropName"].value) {
        cropName = this.searchFormGroupControls["cropName"].value["value"];
        // allData = allData.filter(x => x.crop_code == cropName)
      }

      if (this.searchFormGroupControls["veriety"] && this.searchFormGroupControls["veriety"].value) {
        cropVariety = this.searchFormGroupControls["veriety"].value["id"];
        // allData = allData.filter(x => x.variety_id == cropVariety)
      }
      if (this.searchFormGroupControls["cropGroup"] && this.searchFormGroupControls["cropGroup"].value) {
        cropGroupCode = this.searchFormGroupControls["cropGroup"].value["value"];
        // allData = allData.filter(x => x.season == season)
      }

      if (yearofIndent === null && cropName === null && cropVariety === null) {
        Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
        return;
      }
      this.breederService.postRequestCreator("get-bsp4-list", null,
        {
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
        console.log("BSP2 Data list:", apiResponse)
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
          this.filterPaginateSearch.itemListCurrentPage = 1;
          this.initSearchAndPagination();
        }
      });
    }
  }

  getQuantityOfSeedProduced(data: any) {
    let value = data.toString();

    if (value.indexOf(".") == -1) {
      return data;

    } else {

      return data ? Number(data).toFixed(2) : 0;

    }
  }


}
