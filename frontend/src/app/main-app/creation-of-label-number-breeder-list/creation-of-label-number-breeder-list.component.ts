import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { BspProformasSearchComponent } from 'src/app/common/bsp-proformas-search/bsp-proformas-search.component';
import { BspProformasSearchUIFields } from 'src/app/common/data/ui-field-data/bsp-performas-search-ui-fields';
import { NucleusSeedAvailabilityByBreederSearchComponent } from 'src/app/common/nucleus-seed-availability-by-breeder-search/nucleus-seed-availability-by-breeder-search.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { convertDatetoDDMMYYYYwithdash } from 'src/app/_helpers/utility';
import * as html2PDF from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-creation-of-label-number-breeder-list',
  templateUrl: './creation-of-label-number-breeder-list.component.html',
  styleUrls: ['./creation-of-label-number-breeder-list.component.css']
})
export class CreationOfLabelNumberBreederListComponent implements OnInit {
  // @ViewChild('content_card') content_card: ElementRef;
  @ViewChild(BspProformasSearchComponent) BspProformasSearchComponent: BspProformasSearchComponent | undefined = undefined;
  @ViewChild(NucleusSeedAvailabilityByBreederSearchComponent) nucleusSeedAvailabilityByBreederSearchComponent: NucleusSeedAvailabilityByBreederSearchComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  value = "hii";
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
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

  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  data: any[];
  carddata: any[];
  apiResponse: any;
  productiuon_name: any;
  contactPersonName: any;
  designationname: any;
  breederaddress: any;

  get searchFormGroupControls() {
    return this.searchFormGroup.controls;
  }

  constructor(
    private breederService: BreederService,
    private bspProformasSearchUIFields: BspProformasSearchUIFields,
    private _service: ProductioncenterService,
    private fb: FormBuilder) {
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_code: new FormControl(''),
      year: new FormControl(''),
    });

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

    this.getAgencyData()



    this.getYearsData();
    this.getPageData();

    // this.createYearRange(1990, this.todayDate.getFullYear());

    let filteredBreederSeedSubmissionUIFields;

    filteredBreederSeedSubmissionUIFields = this.bspProformasSearchUIFields.getforLabelNumber
      .filter(x => x.formControlName == "yearofIndent" || x.formControlName == "cropName" || x.formControlName == "veriety" || x.formControlName == "season")
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
    this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchFormGroupControls["season"].patchValue("");
        this.searchFormGroupControls["cropName"].patchValue("");
        this.searchFormGroupControls["veriety"].patchValue("");

        this.fieldsList[1].fieldDataList = [];
        this.fieldsList[2].fieldDataList = [];
        this.fieldsList[3].fieldDataList = [];

        this.breederService.getRequestCreator("getSeasonDataForLabelNumber?year_of_indent=" + newValue.value + "&user_id=" + currentUser.id).subscribe((data: any) => {
          console.log(data)
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
      }

    })

    this.searchFormGroupControls["season"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchFormGroupControls["cropName"].patchValue("");
        this.searchFormGroupControls["veriety"].patchValue("");

        let year = this.searchFormGroupControls["yearofIndent"].value['value'];
        this.fieldsList[2].fieldDataList = [];
        this.fieldsList[3].fieldDataList = [];

        this.breederService.getRequestCreator("getCropsDataForLabelNumber?year_of_indent=" + year + "&season=" + newValue.value + "&user_id=" + currentUser.id).subscribe((data: any) => {
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
      }

    })

    this.searchFormGroupControls["cropName"].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.fieldsList[3].fieldDataList = [];

        this.searchFormGroupControls["veriety"].patchValue("");

        let year = this.searchFormGroupControls["yearofIndent"].value['value'];
        let season = this.searchFormGroupControls["season"].value['value'];

        let varieties = []
        this.breederService.getRequestCreator("getVarietiesDataForLabelNumber?year_of_indent=" + year + "&season=" + season + "&crop_code=" + newValue.value + "&user_id=" + currentUser.id).subscribe((data: any) => {
          data.EncryptedResponse.data?.forEach((element: any, index: number) => {
            varieties.push({ "name": element['m_crop_variety.variety_name'], "value": element['m_crop_variety.variety_code'], id: element.variety_id })
          })
          this.fieldsList[3].fieldDataList = varieties;
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
    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    this.breederService.getRequestCreator("getYearDataForLabelNumber?user_id=" + currentUser.id).subscribe((data: any) => {
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


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    this.breederService.postRequestCreator("getAllLabelNumberForBreederSeed", null, {
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 50,
      search: searchData,
      user_id: currentUser.id
    }).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
        && apiResponse.EncryptedResponse.status_code == 200) {
        console.log(apiResponse.EncryptedResponse.data)
        this.testingList = (apiResponse.EncryptedResponse.data.rows).sort(
          (objA, objB) => Number(objB.id) - Number(objA.id),
        );
        this.testingList.forEach(element => {
          this.breederService.getRequestCreator('getGeneratedLabelNumberByLabelNumberForBreederseedId?label_number_for_breeder_seeds=' + element.id).subscribe((apiResponse: any) => {
            console.log(apiResponse)
            let allGeneratedLabelNumber = [];
            if (apiResponse && apiResponse.EncryptedResponse
              && apiResponse.EncryptedResponse.status_code == 200) {
              allGeneratedLabelNumber = apiResponse.EncryptedResponse.data
            }

            const tempLength = allGeneratedLabelNumber.length;

            if (tempLength <= 0) {
              element['generated_label_number'] = "";
            } else if (tempLength == 1) {
              element['generated_label_number'] = allGeneratedLabelNumber[0].generated_label_name
            } else {
              element['generated_label_number'] = allGeneratedLabelNumber[0].generated_label_name + "-" + allGeneratedLabelNumber[tempLength - 1].unique_label_number;
            }
          })
        });

        this.filterPaginateSearch.Init(this.testingList, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
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
          .postRequestCreator("deleteLabelNumberForBreederSeed/" + id, null, null)
          .subscribe((apiResponse: any) => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
              && apiResponse.EncryptedResponse.status_code == 200) {
              this.ngOnInit();
              Swal.fire({
                title: '<p style="font-size:25px;">Data Has Been Successfully Deleted.</p>',
          icon: 'success',
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
    this.searchFormGroup.reset();
    this.fieldsList[1].fieldDataList = [];
    this.fieldsList[2].fieldDataList = [];
    this.fieldsList[3].fieldDataList = [];
    this.getPageData();
    this.filterPaginateSearch.itemListCurrentPage = 1;
    // this.filterPaginateSearch.Init(response, this, "getPageData");
    this.initSearchAndPagination();
  }
 
  search() {
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
    else {
      let year: any;
      let cropName: any;
      let cropVariety: any;
      let season: any;
      var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))

      this.breederService.postRequestCreator("getAllLabelNumberForBreederSeed", null, {
        page: 1,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          "year": this.searchFormGroupControls["yearofIndent"].value.value,
          "crop_code": this.searchFormGroupControls["cropName"].value.value,
          "variety_code": this.searchFormGroupControls['veriety'].value.id,
          "season": this.searchFormGroupControls['season'].value.value,
        },
        user_id: currentUser.id
      }).subscribe((apiResponse: any) => {
        console.log(apiResponse)
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          let allData = apiResponse.EncryptedResponse.data.rows;

          allData.forEach(element => {
            this.breederService.getRequestCreator('getGeneratedLabelNumberByLabelNumberForBreederseedId?label_number_for_breeder_seeds=' + element.id).subscribe((apiResponse: any) => {
              let allGeneratedLabelNumber = [];
              if (apiResponse && apiResponse.EncryptedResponse
                && apiResponse.EncryptedResponse.status_code == 200) {
                allGeneratedLabelNumber = apiResponse.EncryptedResponse.data
              }

              const tempLength = allGeneratedLabelNumber.length;

              if (tempLength <= 0) {
                element['generated_label_number'] = "";
              } else if (tempLength == 1) {
                element['generated_label_number'] = allGeneratedLabelNumber[0].generated_label_name
              } else {
                element['generated_label_number'] = allGeneratedLabelNumber[0].generated_label_name + "-" + allGeneratedLabelNumber[tempLength - 1].unique_label_number;
              }

            })
          });

          if (this.searchFormGroupControls["yearofIndent"] && this.searchFormGroupControls["yearofIndent"].value) {
            year = this.searchFormGroupControls["yearofIndent"].value["value"];
            allData = allData.filter(x => x.year_of_indent == year)
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

          if (cropName === null && cropVariety === null) {
            Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
            return;
          }
          this.testingList = allData;
          this.filterPaginateSearch.itemListCurrentPage = 1;
          this.filterPaginateSearch.Init(this.testingList, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count, true);
          this.initSearchAndPagination();
          // this.initSearchAndPagination();
        }
      });
    }

  }
  download(data, id) {



    let cardData = []
    let labelNumber = data && data.generated_label_number ? data.generated_label_number.split(' ') : ''

    cardData.push(labelNumber,)
    // cardData.push()

    this.carddata = cardData[0]
    let labelNumbercard = []
    for (let index = 0; index < this.carddata.length; index++) {

      labelNumbercard.push({
        Label_Number: this.carddata[index], crop_name: data && data.m_crop && data.m_crop.crop_name ? data.m_crop.crop_name : ''
        , germination: data && data.germination ? data.germination : '', inert_matter: data && data.inert_matter ? data.inert_matter : '',
        varietyName: data && data.m_crop_variety && data.m_crop_variety.variety_name ? data.m_crop_variety.variety_name : '',
        date_of_test: data && data.date_of_test ? convertDatetoDDMMYYYYwithdash(data.date_of_test) : '',
        purt_seed: data && data.pure_seed ? (data.pure_seed) : '', id: index % 2 == 0 ? "page-break0" : "page-break1",
        lot_number: data && data.lot_number_creation && data.lot_number_creation.lot_number ? data.lot_number_creation.lot_number : '',


      })





    }

    this.carddata = labelNumbercard
    const element = document.getElementById('content_card');
    // console.log('data', this.carddata,'apiResponse')
    console.log(this.carddata, 'card')
    const name = 'report';
    const options = {
      filename: `${name}.pdf`,
      margin: [0, 0, 0, 0],
      image: { type: 'jpeg', quality: 0.98, crossorigin: "*", },

      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', pagesplit: true },
      letterRendering: true,
      pagebreak: { after: ['#page-break1'], avoid: 'img' },
      // pagebreak: {after: '.test-item--page-break'},
      html2canvas: {
        dpi: 300,
        scale: 2,
        letterRendering: true,
        logging: true
        // useCORS: true,

      },
    };





    html2PDF().set(options).from(element).toPdf().save();
  }

  click(data) {
    console.log(data, 'daa')
  }
  getAgencyData() {
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.productiuon_name = data && data.name ? data.name : ''
    console.log(data.agency_id, 'agency_id')
    const param = {
      search: {
        id: data.agency_id
      }
    }
    this._service.postRequestCreator('getAgencyDetailLabelData', param).subscribe(data => {
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.contactPersonName = apiResponse && apiResponse[0] && apiResponse[0].contact_person_name ? apiResponse[0].contact_person_name : '';
      console.log(this.contactPersonName,'this.contactPersonName')
      this.designationname = apiResponse && apiResponse[0] && apiResponse[0].m_designation && apiResponse[0].m_designation.name ? apiResponse[0].m_designation.name : ""
      this.breederaddress = apiResponse && apiResponse[0] && apiResponse[0].address ? apiResponse[0].address : '';
      console.log(apiResponse, 'apiResponse')
    })
  }
}
