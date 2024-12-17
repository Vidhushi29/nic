import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from '../data/data-among-components/filter-paginate-search';
import { NucliousbreederSeedSubmissionUIFields } from '../data/ui-field-data/nuclious-seed-submission-ui-fields';
import { SectionFieldType } from '../types/sectionFieldType';
import Swal from 'sweetalert2';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { PaginationUiComponent } from '../pagination-ui/pagination-ui.component';

@Component({
  selector: 'app-nucleus-seed-availability-by-breeder-search',
  templateUrl: './nucleus-seed-availability-by-breeder-search.component.html',
  styleUrls: ['./nucleus-seed-availability-by-breeder-search.component.css']
})
export class NucleusSeedAvailabilityByBreederSearchComponent implements OnInit {


  @Input() isByNodalAgency: boolean = false;
  @Input() AddCrop: boolean = false;
  @Input() breederProduction: boolean = false
  fieldsList: any = [];

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;

  searchFormGroup: FormGroup = new FormGroup([]);
  cropNameListData: any = [];
  cropVarietyListData: any;
  seasonList: any;
  seasonData: any = [];
  yearCropValue: any;
  cropData: any = [];
  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  constructor(private router: Router,
    nucliousbreederSeedSubmissionUIFields: NucliousbreederSeedSubmissionUIFields,
    private breederService: BreederService,
    private productionService: ProductioncenterService
  ) {
    const filteredBreederSeedSubmissionUIFields = nucliousbreederSeedSubmissionUIFields.get
      .filter(x => x.formControlName == "yearofIndent" || x.formControlName == "cropName" || x.formControlName == "varietyName" || x.formControlName == "season")
      .map(x => {
        return { ...x };
      });

    filteredBreederSeedSubmissionUIFields.forEach(x => {

      delete x["validations"];

      x.gridColClass = "col-12 col-md-4 py-2 py-md-0";
      const newFormControl = new FormControl("");
      this.searchFormGroup.addControl(x.formControlName, newFormControl);
    });
    this.fieldsList = filteredBreederSeedSubmissionUIFields;
    console.log('this.fieldsList', this.fieldsList)

    if (this.router.url.includes('/nucleus-seed-availability-by-breeder')) {
      this.breederProduction = true
    }
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    if (!currentUser) {
      this.router.navigate(['/web-login']);
    }
    this.searchFormGroupControls["varietyName"].disable();
    this.searchFormGroupControls["cropName"].valueChanges.subscribe(newValue => {

      let paramsData = this.searchFormGroupControls["cropName"].value["value"] ? this.searchFormGroupControls["cropName"].value["value"] : ''
      let varieties = []
      this.searchFormGroupControls["varietyName"].reset();
      if (!paramsData) {
        this.searchFormGroupControls["varietyName"].reset();
      }

      if (paramsData) {
        this.searchFormGroupControls["varietyName"].enable();
        const param = {
          year: this.searchFormGroupControls["yearofIndent"].value.year,
          crop_code: paramsData,
        }
        // this.breederService.getRequestCreator("get-breeder-crop-varieties-list?cropCode=" + paramsData).subscribe((data: any) => {
        //   data.EncryptedResponse.data?.forEach((element: any, index: number) => {
        //     varieties.push({ "name": element.variety_name, "value": element.variety_code, id: element.id })
        //   })
        // varieties = varieties.sort((a,b)=>{
        //   return a.name.localeCompare(b.name)
        // })

        //   this.fieldsList[2].fieldDataList = varieties;
        // })
        this.productionService.postRequestCreator("get-nucleus-seed-availabity-variety-name-data", param).subscribe((data: any) => {
          data.EncryptedResponse.data?.forEach((element: any, index: number) => {

            varieties.push({ "name": element.m_crop_variety.variety_name, "value": element.m_crop_variety.variety_code, id: element.m_crop_variety.id })
          })

          var clean = varieties.filter((arr, index, self) =>
            index === self.findIndex((t) => (t.name === arr.name)))

          // let  sortcropName=resa.sort((a,b)=>a.m_crop.crop_name -b.m_crop.crop_name)

          varieties = clean.sort((a, b) => {
            return a.name.localeCompare(b.name)
          })

          this.fieldsList[3].fieldDataList = varieties;
        })
      }


    })
    this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.cropNameList(newValue)
        this.yearCropValue = newValue;
        this.seasonData = [];
        this.cropData = []
        this.yearCropValue = newValue
        this.searchFormGroupControls["season"].setValue('');
        this.searchFormGroupControls["cropName"].setValue('');
        this.searchFormGroupControls["varietyName"].setValue('')
        this.getSeason(newValue);
      }

    })
    this.searchFormGroupControls["season"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.seasonData = [];
        this.cropData = [];
        this.yearCropValue = this.yearCropValue;
        this.searchFormGroupControls["cropName"].setValue('');
        this.searchFormGroupControls["varietyName"].setValue('')
        this.cropNameList(newValue);
      }

    })
    this.searchFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.seasonData = [];
        this.cropData = []
        this.yearCropValue = this.yearCropValue;
        this.searchFormGroupControls["varietyName"].setValue('')
        this.searchFormGroupControls["varietyName"].setValue('')
        this.cropVarity(newValue);
      }

    })

    let yearOfIndent = []
    //  currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const param = {
      userd_id: currentUser.id

    }
    this.productionService.postRequestCreator("getNucleusSeedAvailabityYearListData", param).subscribe((data: any) => {
      data.EncryptedResponse.data?.forEach((element: any, index: number) => {

        element["name"] = (element.year) + '-' + (parseInt(element.year) + 1 - 2000);
        element["value"] = element.year;
        // x["cropType"] = "Crop Type - " + '0' + index;
        yearOfIndent.push(element);
        //   varieties.push({ "name": element.m_crop_variety.variety_name, "value": element.m_crop_variety.variety_code, id: element.m_crop_variety.id })
      })
      this.fieldsList[0].fieldDataList = yearOfIndent;

    })
  }

  Init(filterPaginateSearch: FilterPaginateSearch) {
    this.filterPaginateSearch = filterPaginateSearch;
  }

  search() {
    let searchParams = [];
    if (this.searchFormGroupControls["yearofIndent"].value) {
      searchParams.push({ columnNameInItemList: "year.value", value: this.searchFormGroupControls["yearofIndent"].value["value"] });
    }
    if (this.searchFormGroupControls["season"].value) {
      searchParams.push({ columnNameInItemList: "season.value", value: this.searchFormGroupControls["season"].value["value"] });
    }
    if (this.searchFormGroupControls["cropName"].value) {
      searchParams.push({ columnNameInItemList: "crop.value", value: this.searchFormGroupControls["cropName"].value["value"] });
    }
    if (this.searchFormGroupControls["varietyName"].value) {
      searchParams.push({ columnNameInItemList: "variety.value", value: this.searchFormGroupControls["varietyName"].value["id"] });
    }
    if (searchParams.length > 0) {
      this.filterPaginateSearch.itemListCurrentPage = 1;
      this.initSearchAndPagination();
      this.filterPaginateSearch.search(searchParams);
    }
    else {
      Swal.fire({

        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
  }

  clear() {
    this.searchFormGroup.reset();

    this.filterPaginateSearch.itemListCurrentPage = 1;
    this.filterPaginateSearch.search(undefined);
  }
  getSeason(newValue) {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const route = 'getProductionSeasonFilterListData';
    this.productionService.postRequestCreator(route, {
      search: {
        year: newValue.value,
        user_id: currentUser.id
      }
    }).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.rows.forEach((x: any, index: number) => {
          x["name"] = x['season']
          x["value"] = x['season_code'];
          this.seasonData.push(x);
        });
        //     this.seasonData = this.stateList.filter((arr, index, self) =>
        // index === self.findIndex((t) => (t['m_state.state_name'] === arr['m_state.state_name'] )))

        this.fieldsList[1].fieldDataList = this.seasonData;
      }
    });
  }

  cropNameList(mewValue) {
    console.log('season code =======',mewValue.value);
    console.log('year=====', this.yearCropValue.year);
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const route = 'getProductionCropNameFilterListData';
    this.productionService.postRequestCreator(route, {
      search: {
        year: this.yearCropValue.year,
        season: mewValue.value,
        user_id: currentUser.id
      }
    }).subscribe(data => {
      // let cropData = [];
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.rows.forEach((x: any, index: number) => {
          // console.log('crop name', x.crop_name);
          x["name"] = x['m_crop.crop_name'];
          x["value"] = x['m_crop.crop_code'];
          this.cropData.push(x);
        });
      }
      this.fieldsList[2].fieldDataList = this.cropData;
    })
  }

  cropVarity(newValue) {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const route = 'getNucleusSeedAvailabityVarietyNameListData';
    console.log(this.searchFormGroupControls["cropName"].value,'crop')
    const param={
      'search':{
        year:this.searchFormGroupControls["yearofIndent"].value.year,
        season:this.searchFormGroupControls["season"].value.value,
        cropName:this.searchFormGroupControls["cropName"].value.value,
        user_id:currentUser.id

      }
    }

    this.productionService.postRequestCreator(route, param).subscribe(data => {
      this.cropVarietyListData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : "";
      // const newdata = this.cropNameListData
      // this.fieldsList[3].fieldDataList= this.cropVarietyListData
      const removeEmptycropVarietyListData = (obj) => {
        Object.entries(obj).forEach(([key, val]) =>
          (val && typeof val === 'object') && removeEmptycropVarietyListData(val) ||
          (val === null || val === "") && delete obj[key]
        );
        return obj;
      };
      removeEmptycropVarietyListData(this.cropVarietyListData);
      // const newData =  this.cropNameListData  && this.cropNameListData.m_crop ? this.cropNameListData.m_crop
      this.productionService.putVarietyData(this.cropVarietyListData)


    })
  }
  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    // if (this.indentBreederSeedAllocationSearchComponent === undefined || this.paginationUiComponent === undefined) {
    //   setTimeout(() => {
    //     this.initSearchAndPagination();
    //   }, 300);
    //   return;
    // }

    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }


  getNucleusYearListData() {

  }
}
