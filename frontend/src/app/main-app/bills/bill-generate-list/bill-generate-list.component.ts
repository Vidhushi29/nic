
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { checkDecimal, checkLength, ConfirmAccountNumberValidator, convertDate, errorValidate, convertDates, convertDatetoDDMMYYYY } from 'src/app/_helpers/utility';
import { BspProformasSearchComponent } from 'src/app/common/bsp-proformas-search/bsp-proformas-search.component';
import { BspProformasSearchUIFields } from 'src/app/common/data/ui-field-data/bsp-performas-search-ui-fields';
import { NucleusSeedAvailabilityByBreederSearchComponent } from 'src/app/common/nucleus-seed-availability-by-breeder-search/nucleus-seed-availability-by-breeder-search.component';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SeedServiceService } from 'src/app/services/seed-service.service';

@Component({
  selector: 'app-bill-generate-list',
  templateUrl: './bill-generate-list.component.html',
  styleUrls: ['./bill-generate-list.component.css']
})
export class BillGenerateListComponent implements OnInit {
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
  currentUser: any = { id: 10, name: "Hello Co-ordinator" };

  @Input() AddCrop: boolean = false;
  fieldsList: any = [];
  searchFormGroup: FormGroup = new FormGroup([]);
  @Input() AddSeedTesingLaboratoryList: boolean = false;
  @Input() MaximumLotSizeList: boolean = false;
  @Input() filters: any;
  @Input() componentName: any;
  spaName: any;

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
        .filter(x => x.formControlName == "yearofIndent" || x.formControlName == "cropName" || x.formControlName == "cropGroup" || x.formControlName == "veriety" || x.formControlName == "season")
        .map(x => {
          return { ...x };
        });
    }


    filteredBreederSeedSubmissionUIFields.forEach(x => {
      delete x["validations"];

      x.gridColClass = "col-12 col-md-4 py-2 py-md-0";
      const newFormControl = new FormControl("");
      this.searchFormGroup.addControl(x.formControlName, newFormControl);

      console.log(this.searchFormGroup)
    });

    console.log(filteredBreederSeedSubmissionUIFields)
    this.fieldsList = filteredBreederSeedSubmissionUIFields;

    this.searchFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      console.log('newValue', newValue)
      // this.searchFormGroupControls["cropName"].patchValue("");

      this.breederService.getRequestCreator("season-generate-bill?year=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
        console.log(data)
        if (data.EncryptedResponse.data) {
          let seasons = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['m_season.season'],
              value: element.season
            }
            seasons.push(temp);
          });
          this.fieldsList[1].fieldDataList = seasons;
        }
      })
    })

    this.searchFormGroupControls["season"].valueChanges.subscribe(newValue => {
      if(newValue) {
        let year = this.searchFormGroupControls["yearofIndent"].value;
        this.breederService.getRequestCreator("cropgroup-generate-bill?user_id=" + this.currentUser.id + "&season=" + newValue.value + "&year=" + year.value).subscribe((data: any) => {
          console.log('data', data)
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
      }
     
    })

    this.searchFormGroupControls["cropGroup"].valueChanges.subscribe(newValue => {
      this.searchFormGroupControls["cropName"].patchValue("");
      let year = this.searchFormGroupControls["yearofIndent"].value;
      let season = this.searchFormGroupControls["season"].value;

      this.breederService.getRequestCreator("crop-generate-bill?year=" + year.value + "&season=" + season.value + "&cropGroup=" + newValue.value + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
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
      let paramsData = this.searchFormGroupControls["cropName"].value["value"]
      let year = this.searchFormGroupControls["yearofIndent"].value["value"]
      let season = this.searchFormGroupControls["season"].value["value"]
      let cropGroup = this.searchFormGroupControls["cropGroup"].value["value"]
      console.log("crop code:", paramsData)
      let varieties = []
      if (newValue) {
        this.breederService.getRequestCreator("varieties-generate-bill?cropCode=" + paramsData + "&year=" + year + "&season=" + season + "&cropGroup=" + cropGroup + "&user_id=" + this.currentUser.id).subscribe((data: any) => {
          data.EncryptedResponse.data?.forEach((element: any, index: number) => {
            console.log(element)
            varieties.push({ "name": element.m_crop_variety.variety_name, "value": element.m_crop_variety.variety_code, id: element.m_crop_variety.id })

          })
          this.fieldsList[4].fieldDataList = varieties;
        })
      }
    })

  }

  getYearsData(): void {
    this.breederService.getRequestCreator("year-generate-bill?user_id=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        let yrs = []
        years.forEach(x => {
          var temp = this.getFinancialYear(x.year)
          console.log('temp', temp)
          yrs.push({
            value: x.year,
            name: temp
          })
        })
        this.fieldsList[0].fieldDataList = yrs;
      }
    })
  }

  createYearRange(start: number, end: number): void {
    if (start <= end) {
      this.yearOfIndent.push({ name: start + "", value: start });
      this.createYearRange(start + 1, end);
    }
  }

  loadDraftBsp(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.isActive = !this.isActive;
    this.breederService.postRequestCreator("get-generate-bill-list", null,
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
      console.log("allocation-indentor", apiResponse)
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows;
        console.log("", allData)
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
    this.breederService.postRequestCreator("get-generate-bill-list", null,
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
      console.log("all bills list", apiResponse)
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        let allData = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows;
        console.log("", allData)
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
          .postRequestCreator("delete-generate-bill/" + id, null, null)
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
    this.getPageData();

    this.searchFormGroupControls["cropName"].patchValue("");
    this.searchFormGroupControls["yearofIndent"].patchValue("");
    this.searchFormGroupControls["veriety"].patchValue("");
    this.searchFormGroupControls["season"].patchValue("");


    // this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, allData.count);
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

  getQuantityMeasure(crop_code) {
    return crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
  }

  updateBill(billId: any) {
    let data = { "id": billId, "isCertificateGenerated": true }
    console.log('data', data)
    this.breederService
      .postRequestCreator("certificate-generated", null, data)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.ngOnInit()
        }
      })
  }

  viewCertificate(bill: any) {
    let billId = bill.id
    if (billId) {
      this.router.navigate(['production-center/generation-of-breeder-certificate/view/' + billId]);
    }
  }

  generateCertificate(bill: any) {
    let billId = bill.id
    let unit = this.getQuantityMeasure(bill.crop_code)
    this.breederService
      .getRequestCreator("certificate-generated/" + billId, null, null)
      .subscribe((apiResponse: any) => {
        console.log('apiResponse', apiResponse)
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
            let certificateData = apiResponse.EncryptedResponse.data
            // this.generateCertificate(certificateData.spa_code)
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              cancelButton: 'btn btn-danger ml-3',
              confirmButton: 'btn btn-success ml-3',
            },
            buttonsStyling: false
          })

          var swal_html = '<div class="panel pb-2" style="background:aliceblue;font-weight:bold"><div class="panel-heading panel-info text-center btn-info"> <b>Certificate Data</b> </div> <div class="panel-body"><table style="width: 100%;"><tr><th style="text-align: left;white-space:nowrap">Bill Number</th><th style="text-align: right;">'
           + certificateData["bill_number"] 
           + '</th></tr><tr><th style="text-align: left;">Season</th><th style="text-align: right;">' + certificateData["season"] + '</th></tr><tr><th style="text-align: left;white-space:nowrap;">Bill Date</th><th style="text-align: right;">' +  (convertDate(certificateData["date_of_bill"])) + '</th></tr><tr><th style="text-align: left;white-space:nowrap;">Inspection Date</th><th style="text-align: right;">' + (certificateData["date_of_inspection"]) + '</th></tr><tr><th style="text-align: left;white-space:nowrap;">Generation Date</th><th style="text-align: right;">' + convertDate(certificateData["generation_date"]) + '</th></tr><tr><th style="text-align: left;">Label</th><th style="text-align: right;">' + certificateData["label_numbers"] + '</th></tr><tr><th style="text-align: left;white-space:nowrap;">SPA Name</th><th style="text-align: right;">' + certificateData["SpaName2"] + '</th></tr class="pb-3"><tr><th style="text-align: left;" class="pt-2"> '
           +
            '</th></tr></table></div></div>';

          swalWithBootstrapButtons.fire({
            title: 'Confirm?',
            text: "Confirm the data entered before generating the certificate as it can’t be edited and generated later.",
            icon: 'warning',
            html: swal_html,

            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
            // reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                icon: 'warning',
                title: 'Confirm?',
                text: 'Are You Sure to Generate the Certificate With Entered Data? Confirm the Data Entered Before Generating the Certificate as It Can’t be Edited and Generated Later.',
                showDenyButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save, Close`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  this.updateBill(billId)
                } else if (result.isDenied) {
                  Swal.fire('Changes Are Not Saved.', '', 'info')
                }
              })
            } 
            // else if (
            //   /* Read more about handling dismissals below */
            //   result.dismiss === Swal.DismissReason.cancel
            // ) {
            //   swalWithBootstrapButtons.fire(
            //     'Cancelled',
            //     'Your Imaginary Data is Safe. ',
            //     'error'
            //   )
            // }
          })
        }
      })
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
      this.breederService.postRequestCreator("get-generate-bill-list", null, {
        page: loadPageNumberData,
        pageSize: this.filterPaginateSearch.itemListPageSize || 50,
        search: {
          "yearOfIndent": yearofIndent,
          "cropName": cropName,
          "cropVariety": cropVariety,
          "userId": this.currentUser.id,
          pageSize: this.filterPaginateSearch.itemListPageSize || 50,

        }
      }
      ).subscribe(apiResponse => {
        console.log("all bills list", apiResponse)
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
    }

  }

  // search(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

  //   if ((!this.searchFormGroupControls["cropName"].value && !this.searchFormGroupControls["veriety"].value && !this.searchFormGroupControls["yearofIndent"].value)) {
  //     Swal.fire({
  //       toast: false,
  //       icon: "error",
  //       title: "Please Select Something ",
  //       position: "center",
  //       showConfirmButton: false,
  //       timer: 3000,
  //       showCancelButton: false,

  //       customClass: {
  //         title: 'list-action-confirmation-title',
  //         actions: 'list-confirmation-action'
  //       }
  //     })

  //     return;
  //   }
  //   let searchParams1 = [{ "yearOfIndent": null, "cropName": null, "cropVariety": null,"season":null }];
  //   let yearofIndent: any;
  //   let cropName: any;
  //   let cropVariety: any;
  //   let season :any ;
  //   let allData = this.bspAllData
  //   if (this.searchFormGroupControls["yearofIndent"] && this.searchFormGroupControls["yearofIndent"].value) {
  //     yearofIndent = this.searchFormGroupControls["yearofIndent"].value["value"].toString()
  //     console.log(this.bspAllData)
  //     allData = allData.filter(x => (x.year == yearofIndent))
  //     console.log(allData)
  //   }

  //   if (this.searchFormGroupControls["season"] && this.searchFormGroupControls["cropName"].value) {
  //     season = this.searchFormGroupControls["season"].value["value"];
  //     console.log(this.bspAllData)
  //     allData = allData.filter(x => x.season_code == season)
  //     console.log(allData)
  //   }

  //   if (this.searchFormGroupControls["cropName"] && this.searchFormGroupControls["cropName"].value) {
  //     cropName = this.searchFormGroupControls["cropName"].value["value"];
  //     console.log(this.bspAllData)
  //     allData = allData.filter(x => x.crop_code == cropName)
  //     console.log(allData)
  //   }

  //   if (this.searchFormGroupControls["veriety"] && this.searchFormGroupControls["veriety"].value) {
  //     cropVariety = this.searchFormGroupControls["veriety"].value["id"];
  //     allData = allData.filter(x => x.variety_id == cropVariety)
  //     console.log(allData)
  //   }




  //   if (yearofIndent === null && cropName === null && cropVariety === null) {
  //     Swal.fire({
  //       toast: false,
  //       icon: "error",
  //       title: "Please Select Something ",
  //       position: "center",
  //       showConfirmButton: false,
  //       timer: 3000,
  //       showCancelButton: false,

  //       customClass: {
  //         title: 'list-action-confirmation-title',
  //         actions: 'list-confirmation-action'
  //       }
  //     })

  //     return;
  //   }
  //   this.filterPaginateSearch.Init(allData, this, "getPageData", undefined, allData.count);
  //   this.initSearchAndPagination();
  //   // const param = {
  //   //   page: loadPageNumberData,
  //   //   pageSize: this.filterPaginateSearch.itemListPageSize || 5,
  //   //   search: searchData
  //   // }
  // }
  getSpaNameList(spacode){
    this.breederService.postRequestCreator('getSpaUserList?spacode='+ spacode ,null).subscribe(data=>{
      console.log(data)
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data  ? data.EncryptedResponse.data :
      '';
      this.spaName = res && res.user && res.user.name ? res.user.name :''

    })
  }

  paymentPopup(id){
    Swal.fire({
      title: 'Is Payment Done?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        if(id){
          this.breederService.postRequestCreator("update-bill-payment-status", null,
          {
            search: {
              "bill_id": id,
            }
          }).subscribe((apiResponse: any) => {
            if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined && apiResponse.EncryptedResponse.status_code == 200) {
              if(apiResponse){
                Swal.fire('Saved!', '', 'success')
                window.location.reload();
              }
            }
          });
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
}
