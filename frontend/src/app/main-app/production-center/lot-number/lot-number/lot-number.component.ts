import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { ControlContainer, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { lotNumberUIFields, selectLotNumberUIFieldsUIFields } from 'src/app/common/data/ui-field-data/lot-number-ui-fields';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import Swal from 'sweetalert2';
import { IcarService } from 'src/app/services/icar/icar.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { createCropVarietyData } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
import { randomLotNo, customPaginate } from 'src/app/_helpers/utility';
import { BreederService } from 'src/app/services/breeder/breeder.service';

@Component({
  selector: 'app-lot-number',
  templateUrl: './lot-number.component.html',
  styleUrls: ['./lot-number.component.css']
})
export class LotNumberComponent implements OnInit {
  currentUser: any;

  @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  editVarietyData: any;
  noRedirectAndIgnoreErrors: boolean = false
  loggedInUserInfoService: any;
  isSearched: boolean = false;
  contactPersonName: any;
  contactPersonDesignation: any;
  btn_name: string;
  title: string;
  crop_lot_size: any;
  numberOfLots: number;
  randNo: any;
  seedProduced: any;
  lotNumber: any;
  lotNumbers: {};
  setUsername: any;
  createdBy: any;
  createdByUser: any;
  runningNum = 0;
  tableId: any;
  shortName: any;
  year_wise_crop: any;
  yearName: any;
  lotNoInView: any;
  maxLotSize: any;
  actualQty: any;
  counter: any;
  lot_num_size: any = [];
  lotSize: any;
  viewQty: any = [];
  productionQty: any;
  lotNoPerPage: number = 10;
  page_number: number;
  generatedLotNumber = [];
  pageNumberCount: number;
  list = [];
  allLotNumbers: string[];
  incement: number = 1;
  sspData: any;
  currentUserCode = "000"

  dataload: boolean = false;

  get formGroupControls() {
    return this.formSuperGroup.controls;
  }

  get IstPartFormGroup(): FormGroup {
    if (this.formGroupControls["IstPartFormGroup"])
      return this.formGroupControls["IstPartFormGroup"] as FormGroup;
    else
      return new FormGroup([]);
  }

  get IstPartFormGroupControls() {
    return this.IstPartFormGroup.controls;
  }


  constructor(activatedRoute: ActivatedRoute,
    private icarService: IcarService,
    private router: Router,
    private indenterService: IndenterService,
    private restService: RestService,
    private _service: ProductioncenterService,
    private lotNumberUIFields: lotNumberUIFields,
    private breederService: BreederService,) {

    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.setUsername = this.currentUser ? this.currentUser.name : '--';
    this.createdBy = this.currentUser ? this.currentUser.created_by : 1;
    this.tableId = this.currentUser ? this.currentUser.id : 1;
    this.currentUser.id = this.currentUser.id;

    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

    if (this.isEdit) {
      this.btn_name = 'Update';
      this.title = 'Update';
    } else if (this.isView) {
      this.title = 'View';
    } else if (!this.isEdit && !this.isView) {
      this.title = 'Creation of';
      this.btn_name = 'Submit';
    }

    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    this.createFormControlsOfAGroup(lotNumberUIFields.get, this.IstPartFormGroup);
    this.fieldsList = lotNumberUIFields.get;
    this.filterPaginateSearch.itemListPageSize = 10;
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      const newFormGroup = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "season" || x.formControlName == "yearofIndent")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  ngOnInit(): void {
    this.getCreatedByName();
    this.getUserShortName();

    if(this.isEdit || this.isView) {
      this.dataload = false
    } else {
      this.dataload = true;
    }

    this.breederService.postRequestCreator("getUserCodeForLotNumber?id=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data['code']) {
        this.currentUserCode = data.EncryptedResponse.data['code']
      }
    })

    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {

      if (newValue) {
        this.filterPaginateSearch = new FilterPaginateSearch();
        this.IstPartFormGroupControls["season"].patchValue("");
        this.IstPartFormGroupControls["cropName"].patchValue("");
        this.IstPartFormGroupControls["spp_id"].patchValue("");

        this.fieldsList[1].fieldDataList = [];
        this.fieldsList[2].fieldDataList = [];
        this.fieldsList[3].fieldDataList = [];


        this._service.postRequestCreator("get-season-for-lotNumber?year=" + newValue.value).subscribe((data: any) => {

          if (!this.isView) {
            this.IstPartFormGroupControls["cropName"].patchValue("");
          }

          if (data.EncryptedResponse.data) {
            let seasons = []
            data.EncryptedResponse.data.forEach(element => {
              let temp = {
                name: element['m_season.season'],
                value: element['m_season.season_code']
              }
              seasons.push(temp);
            });
            this.fieldsList[1].fieldDataList = seasons;
          }
        })
      }

    });

    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.filterPaginateSearch = new FilterPaginateSearch();
        this.IstPartFormGroupControls["cropName"].patchValue("");
        this.IstPartFormGroupControls["spp_id"].patchValue("");

        this.fieldsList[2].fieldDataList = [];
        this.fieldsList[3].fieldDataList = [];

        let crop = [];
        this._service.postRequestCreator("get-indent-cropformNumber", {
          search: {
            "year": this.IstPartFormGroupControls["yearofIndent"].value["value"],
            "season": this.IstPartFormGroupControls["season"].value["value"]
          }
        }).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            data.EncryptedResponse.data?.forEach((element: any, index: number) => {
              crop.push({ "name": element['m_crop.crop_name'], "value": element['m_crop.crop_code'] })
            })
            this.fieldsList[2].fieldDataList = crop;
          }
        });
      }

    });

    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.fieldsList[3].fieldDataList = [];

        this.IstPartFormGroupControls["spp_id"].patchValue("");
        this.filterPaginateSearch = new FilterPaginateSearch();

        let object = {
          "year": this.IstPartFormGroupControls["yearofIndent"].value["value"],
          "season": this.IstPartFormGroupControls["season"].value["value"],
          "crop_code": this.IstPartFormGroupControls["cropName"].value["value"],
          "user_id": this.currentUser.id
        }
        let objects = {
          search:{

            "year": this.IstPartFormGroupControls["yearofIndent"].value["value"],
            "season": this.IstPartFormGroupControls["season"].value["value"],
            "crop_code": this.IstPartFormGroupControls["cropName"].value["value"],
            "user_id": this.currentUser.id
          }
        }
        console.log(object)
        this.sspData = [];
        let datas;
        this.breederService.postRequestCreator("getSPPDataForLotNumber", null, object).subscribe((data: any) => {
         this._service.postRequestCreator('getNucleusSeedseed',objects).subscribe(apies=>{

           if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.length > 0) {
             datas= apies && apies.EncryptedResponse && apies.EncryptedResponse.data &&apies.EncryptedResponse.data.rows ? apies.EncryptedResponse.data.rows:'';
               data.EncryptedResponse.data.forEach(element => {
                 if (element) {
                   let object = {
                     name: element[0].plant_name ? element[0].plant_name : 'NA',
                     value: element[0].id ? element[0].id : 0
                   }
                   this.sspData.push(object)
                 }
               });
           if (apies && apies.EncryptedResponse && apies.EncryptedResponse.data &&apies.EncryptedResponse.data.rows && apies.EncryptedResponse.data.rows.length > 0) {
             let arr = this.filterUncommonArrays(this.sspData,datas);
           
             this.fieldsList[3].fieldDataList = arr;
           }
           else{
              this.fieldsList[3].fieldDataList = this.sspData;

           }
        //    let arr =data.EncryptedResponse.data.filter((element) => !datas.includes(element)).concat(datas.filter((element) => !data.EncryptedResponse.data.includes(element)));
         
           }
         }) 
        });
      }
    });

    this.IstPartFormGroupControls["spp_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.filterPaginateSearch = new FilterPaginateSearch();
        let object = {
          year: this.IstPartFormGroupControls['yearofIndent'].value['value'],
          season: this.IstPartFormGroupControls['season'].value['value'],
          crop_code: this.IstPartFormGroupControls['cropName'].value['value'],
          plant_id: newValue['value']
        }

        if (!this.isView) {
          this.breederService.postRequestCreator("getVarietyDataForLotNumberFromPlantData", null, object).subscribe((data: any) => {

            if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
              // this.cropMaxLotSize();
              let breederData = data.EncryptedResponse.data;

              if (this.IstPartFormGroupControls["cropName"].value) {
                let searchData = {
                  search: [
                    { columnNameInItemList: "crop.value", value: this.IstPartFormGroupControls["cropName"].value["value"] }
                  ],
                  "pageSize": -1
                };

                this._service.postRequestCreator("get-max-lot-size", searchData, null).subscribe((data: any) => {
                  console.log(data)
                  if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows && data.EncryptedResponse.data.rows.length > 0) {
                    let alldata = data.EncryptedResponse.data.rows[0];
                    this.crop_lot_size = 0;
                    if (alldata && alldata.max_lot_size) {
                      this.crop_lot_size = alldata.max_lot_size;
                    }

                    let object = {
                      year: this.IstPartFormGroupControls['yearofIndent'].value['value'],
                      season: this.IstPartFormGroupControls['season'].value['value'],
                      crop_code: this.IstPartFormGroupControls['cropName'].value['value'],
                      bsp4_id: [],
                      variety_id: []
                    }

                    breederData.forEach(element => {
                      object['bsp4_id'].push(element.bsp4_id);
                      object['variety_id'].push(element.variety_id);
                    });


                    this.breederService.postRequestCreator("getVarietyDataForLotNumberFromBSP4", null, object).subscribe((variety_data: any) => {
                      if (variety_data && variety_data.EncryptedResponse && variety_data.EncryptedResponse.data) {

                        const varieties = variety_data.EncryptedResponse.data;

                        this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];

                        let IIndPartFormArray: {
                          name: string,
                          varietyId: number,
                          varietyLotNumber: Array<string>,
                          formGroup: FormGroup,
                          actualQty: number,
                          spp_code: string,
                          harvest_date: Date,
                          arrayfieldsIIndPartList: Array<SectionFieldType>
                        }[] = [];

                        let lotNumberCounter = 1;
                        let cnt;

                        this.numberOfLots = 0;
                        varieties?.forEach(async (element: any, index: number) => {
                          createCropVarietyData(element, true);

                          if (this.loggedInUserInfoService != undefined)
                            element.nodalAddressDesignation = this.loggedInUserInfoService.loginInfo.address + " and "
                              + this.loggedInUserInfoService.loginInfo.designation;

                          let newFormGroup = new FormGroup<any>([]);
                          this.createFormControlsOfAGroup(selectLotNumberUIFieldsUIFields, newFormGroup);
                          newFormGroup.controls['breeder_seed_production_id'].disable();
                          newFormGroup.controls['max_lot_size'].disable();
                          newFormGroup.controls['lot_number'].disable();
                          newFormGroup.controls["lot_number"].patchValue(element?.refernce_number_moa);
                          newFormGroup.controls["max_lot_size"].patchValue(this.crop_lot_size);

                          let object = {
                            "year": this.IstPartFormGroupControls["yearofIndent"].value["value"],
                            "season": this.IstPartFormGroupControls["season"].value["value"],
                            "crop_code": this.IstPartFormGroupControls["cropName"].value["value"],
                            "plant_id": this.IstPartFormGroupControls["spp_id"].value["value"],
                            "bsp4_id": element.id,
                            "variety_id": element.variety_id,
                            "user_id": this.currentUser.id
                          }

                          this.breederService.postRequestCreator("getQuantityOfSPPDataForLotNumber", null, object).subscribe((data: any) => {
                            if (data && data.EncryptedResponse && data.EncryptedResponse.data) {

                              let tempData = data.EncryptedResponse.data[0]
                              this.actualQty = element.actual_seed_production;
                              let quantity_of_seed_produced = tempData && tempData.quantity ? Number(tempData.quantity) : 0;



                              this.breederService.postRequestCreator("get_plants_data_for_lot_number?id=" + object['plant_id']).subscribe((plant: any) => {
                                let code = '000'

                                if (plant && plant.EncryptedResponse && plant.EncryptedResponse.data) {
                                  code = plant.EncryptedResponse.data['code']
                                }

                                let currentDate = new Date();
                                console.log('this.currentUser===',this.currentUser.code);
                                console.log('code',code);
                                const tempDate = new Date(element.harvest_date);
                                let object = {
                                  "year": Number(currentDate.getFullYear()),
                                  "month": Number(tempDate.getMonth()),
                                  "bspc_code": this.currentUser && this.currentUser.code ? this.currentUser.code.toString():'',
                                  "spp_code": code.toString()
                                }


                                this.breederService.postRequestCreator("lotNumberCreation/getLotNumberData", null, object).subscribe((data: any) => {
                                  if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
                                    let allData = data.EncryptedResponse.data;
                                    this.counter = ((allData.length) > 0) ? allData[0].running_number : 0;

                                    if (index == 0) {
                                      this.runningNum = this.counter + this.runningNum + this.numberOfLots;

                                    } else {
                                      this.runningNum = this.runningNum + this.numberOfLots;

                                    }

                                    if (element.actual_seed_production && this.crop_lot_size) {
                                      this.numberOfLots = Math.ceil((quantity_of_seed_produced) / (this.crop_lot_size));
                                      this.randNo = randomLotNo(this.numberOfLots, code, this.currentUser.code, this.runningNum, element.harvest_date);
                                      // this.runningNum = this.runningNum + this.numberOfLots;
                                    }

                                    IIndPartFormArray.push({
                                      name: element.m_crop_variety && element.m_crop_variety.variety_name,
                                      varietyId: element.m_crop_variety && element.m_crop_variety.id,
                                      varietyLotNumber: this.randNo,
                                      formGroup: newFormGroup,
                                      actualQty: element.actual_seed_production,
                                      spp_code: code,
                                      harvest_date: new Date(element.harvest_date),
                                      arrayfieldsIIndPartList: selectLotNumberUIFieldsUIFields.map(x => {
                                        if (!["selectBreederName", "availableNucleusSeed", "allocateNucleusSeed"].includes(x.formControlName)) {
                                          let bsp4_seed_quantity = quantity_of_seed_produced;

                                          newFormGroup.controls['breeder_seed_production_id'].patchValue(bsp4_seed_quantity);

                                          if (this.randNo) {
                                            this.lotNumbers = this.randNo.toString().split(",");
                                            newFormGroup.controls['lot_number'].patchValue(this.randNo);
                                          }
                                        }
                                        return { ...x };
                                      })
                                    });

                                    this.filterPaginateSearch.Init(IIndPartFormArray, this);
                                    this.initSearchAndPagination();
                                  }
                                })
                              })

                            }

                          });
                        });

                      }
                    })
                  } else {
                    Swal.fire({
                      title: '<p style="font-size:25px;">Its Lot Size Is Not Defined. Please Contact Seed Division.</p>',
                      icon: 'error',
                      confirmButtonText:
                        'OK',
                    confirmButtonColor: '#E97E15'
                    })
                  }

                  this.dataload = true;
                });
              }

            }
          })

        } else {
          this.cropMaxLotSize();
          this.onlyView();

          this.dataload = true;
        }


      }

    });

    let isSearched = false;
    this.formGroupControls['search'].valueChanges.subscribe(newValue => {
      let performSearch: any[] | undefined = undefined;
      if (newValue.length > 3) {
        isSearched = true;
        performSearch = [{
          columnNameInItemList: "name",
          value: newValue
        }];
      }
      if (isSearched)
        this.filterPaginateSearch.search(performSearch);
    });

    if (this.isEdit || this.isView) {
      this._service.postRequestCreator("get-lot-number", {
        search: [
          { columnNameInItemList: "id", value: this.submissionId }
        ]
      }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let allData = data.EncryptedResponse.data.rows;
          let cropName = data.EncryptedResponse.data.rows && data.EncryptedResponse.data.rows[0] && data.EncryptedResponse.data.rows[0].m_crop && data.EncryptedResponse.data.rows[0].m_crop.crop_name;
          let season = (data.EncryptedResponse.data.rows[0].season && data.EncryptedResponse.data.rows[0].season !== null) ? data.EncryptedResponse.data.rows[0].season : 'R';
          let spp_id = data.EncryptedResponse.data.rows[0].spp_id ? data.EncryptedResponse.data.rows[0].spp_id : 1;

          this.patchForm(allData, cropName, season, spp_id);
        }
      });
    }
    if (!this.submissionId) {
      this.getUserData();
    }

  }

  getCreatedByName() {
    this._service.postRequestCreator("get-created-by-name", {
      search: {
        "created_by": this.createdBy
      }
    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let allData = data.EncryptedResponse.data[0];
        this.createdByUser = allData ? allData.short_name : '';
      }
    });
  }
  getUserShortName() {
    this._service.postRequestCreator("get-user-short-name", {
      search: {
        "user_id": this.tableId
      }
    }).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let allData = data.EncryptedResponse.data[0];
        this.shortName = allData ? allData.short_name : '';
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

  patchForm(data: any, cropName, season, spp_id) {
    if (data && data.length > 0) {
      this.yearName = (data[0].year).toString() + '-' + (((data[0].year) + 1) - 2000).toString();
      this.IstPartFormGroupControls["yearofIndent"].patchValue({
        name: this.yearName,
        value: data[0].year
      });

      this.IstPartFormGroupControls["season"].patchValue({
        name: (data[0].m_season && data[0].m_season.season) ? data[0].m_season.season : 'Rabi',
        value: season ? season : 'R'
      });

      this.IstPartFormGroupControls["cropName"].patchValue({
        name: cropName,
        value: data[0].crop_code
      });

      this.IstPartFormGroupControls["spp_id"].patchValue({
        name: data[0].plant_detail.plant_name ? data[0].plant_detail.plant_name : 'NA',
        value: data[0].spp_id
      });
      this.loadVarieties();
    }
  }

  getDynamicFieldsComponent(id): DynamicFieldsComponent {
    return this.dynamicFieldsComponent.filter(x => x.id == id)[0];
  }

  submitForm(formData) {
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        let dataRows = [];
        const year = this.IstPartFormGroupControls["yearofIndent"].value;
        const season = this.IstPartFormGroupControls["season"].value["value"];
        const cropCode = this.IstPartFormGroupControls["cropName"].value;
        const spp_id = this.IstPartFormGroupControls["spp_id"].value["value"];

        let cnt = 1;


        this.filterPaginateSearch.itemListInitial.forEach(element => {
          let currentDate = new Date(element.harvest_date);

          dataRows.push({
            crop_code: cropCode,
            variety_id: element.varietyId,
            year: year,
            spp_id: spp_id,
            season: season,
            is_active: 1,
            lot_number: element.formGroup.controls["lot_number"].value,
            actualQty: parseFloat(element.formGroup.controls["breeder_seed_production_id"].value),
            breeder_seed_production_id: this.currentUser.id,
            user_id: this.currentUser.id,
            running_number: this.counter,
            current_year: Number(currentDate.getFullYear()),
            current_month: Number(currentDate.getMonth()),
            bspc_code: this.currentUser && this.currentUser.code ? this.currentUser.code.toString():'',
            spp_code: element.spp_code,
            max_lot_size: this.crop_lot_size ? parseInt(this.crop_lot_size) : parseInt(element.formGroup.controls["max_lot_size"].value),
          });
          cnt++;
        });

        this._service.postRequestCreator("add-lot-number", { nucleusSeed: dataRows }, null).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
            }).then(x => {
              this.router.navigate(['/lot-number-list']);

            })
          } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 404) {
            Swal.fire({
              title: '<p style="font-size:25px;">Data Already Exists. Please! Choose a Diffent Crop Name or Year.</p>',
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

  getUserData() {
    let route = "get-user-data"
    this._service.postRequestCreator(route, null, null).subscribe((data: any) => {
      // this.contactPersonName = data.EncryptedResponse.data.agency_detail.contact_person_name;
      // this.contactPersonDesignation = data.EncryptedResponse.data.agency_detail.contact_person_designation;
      // this.IstPartFormGroupControls["breader_production_name"].setValue( this.contactPersonName? this.contactPersonName:'Breeder Production Centre');
      // this.IstPartFormGroupControls["Contact_Officer_Address_and_Designation"].setValue((this.contactPersonDesignation ? this.contactPersonDesignation :'NA'));
      // this.IstPartFormGroupControls["breader_production_name"].disable();
      // this.IstPartFormGroupControls["Contact_Officer_Address_and_Designation"].disable();
    });
  }


  cropMaxLotSize() {
    if (this.IstPartFormGroupControls["cropName"].value) {
      let searchData = {
        search: [
          { columnNameInItemList: "crop.value", value: this.IstPartFormGroupControls["cropName"].value["value"] }
        ],
        "pageSize": -1
      };

      this._service.postRequestCreator("get-max-lot-size", searchData, null).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          if (data.EncryptedResponse.data && data.EncryptedResponse.data.rows && data.EncryptedResponse.data.rows.length > 0) {
            let alldata = data.EncryptedResponse.data.rows[0];
            if (alldata && alldata.max_lot_size) {
              this.crop_lot_size = alldata.max_lot_size;
            }

          } else {
            Swal.fire({
              title: '<p style="font-size:25px;">Its Lot Size Is Not Defined. Please Contact Seed Division.</p>',
              icon: 'error',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
          }
        }
      });
    }
  }

  loadVarieties() {
    if (this.IstPartFormGroupControls["yearofIndent"].value &&
      this.IstPartFormGroupControls["cropName"].value && !this.isView) {
      let searchData = {
        search: [
          { columnNameInItemList: "year.value", value: this.IstPartFormGroupControls["yearofIndent"].value["value"] },
          { columnNameInItemList: "crop.value", value: this.IstPartFormGroupControls["cropName"].value["value"] },
          { columnNameInItemList: "spp_id.value", value: this.IstPartFormGroupControls["spp_id"].value["value"] }
        ],
        "pageSize": -1
      };

      if (this.editVarietyData) {
        searchData.search.push({ columnNameInItemList: "variety_id", value: this.editVarietyData?.variety_id });
      }


      this._service.postRequestCreator("get-actual-seed-production", searchData, null).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
          let IIndPartFormArray: {
            name: string,
            varietyId: number,
            varietyLotNumber: Array<string>,
            formGroup: FormGroup,
            actualQty: number,
            arrayfieldsIIndPartList: Array<SectionFieldType>
          }[] = [];

          let lotNumberCounter = 1;
          let cnt;

          data.EncryptedResponse.data.rows?.forEach(async (element: any, index: number) => {

            createCropVarietyData(element, true);

            if (this.loggedInUserInfoService != undefined)
              element.nodalAddressDesignation = this.loggedInUserInfoService.loginInfo.address + " and "
                + this.loggedInUserInfoService.loginInfo.designation;

            let newFormGroup = new FormGroup<any>([]);
            this.createFormControlsOfAGroup(selectLotNumberUIFieldsUIFields, newFormGroup);
            newFormGroup.controls['breeder_seed_production_id'].disable();
            newFormGroup.controls['max_lot_size'].disable();
            newFormGroup.controls['lot_number'].disable();
            newFormGroup.controls["lot_number"].patchValue(element?.refernce_number_moa);
            newFormGroup.controls["max_lot_size"].patchValue(this.crop_lot_size);

            let object = {
              "year": this.IstPartFormGroupControls["yearofIndent"].value["value"],
              "season": this.IstPartFormGroupControls["season"].value["value"],
              "crop_code": this.IstPartFormGroupControls["cropName"].value["value"],
              "plant_id": this.IstPartFormGroupControls["spp_id"].value["value"],
              "bsp4_id": element.bsp_2.bsp_3.bsp_4.id,
              "variety_id": element.variety_id,
              "user_id": this.currentUser.id
            }

            this.breederService.postRequestCreator("getQuantityOfSPPDataForLotNumber", null, object).subscribe((data: any) => {

              if (data && data.EncryptedResponse && data.EncryptedResponse.data) {

                let tempData = data.EncryptedResponse.data[0]
                this.actualQty = element.quantity_of_seed_produced;
                let quantity_of_seed_produced = tempData && tempData.quantity ? Number(tempData.quantity) : 0;

                if (element.quantity_of_seed_produced && this.crop_lot_size) {
                  this.numberOfLots = Math.ceil((quantity_of_seed_produced) / (this.crop_lot_size));

                  this.randNo = randomLotNo(this.numberOfLots, this.createdByUser, this.shortName, this.runningNum, element.harvest_date);
                  this.runningNum = this.runningNum + this.numberOfLots;
                }

                IIndPartFormArray.push({
                  name: element.m_crop_variety && element.m_crop_variety.variety_name,
                  varietyId: element.m_crop_variety && element.m_crop_variety.id,
                  varietyLotNumber: this.randNo,
                  formGroup: newFormGroup,
                  actualQty: element.quantity_of_seed_produced,
                  arrayfieldsIIndPartList: selectLotNumberUIFieldsUIFields.map(x => {
                    if (!["selectBreederName", "availableNucleusSeed", "allocateNucleusSeed"].includes(x.formControlName)) {
                      let bsp4_seed_quantity = quantity_of_seed_produced;

                      newFormGroup.controls['breeder_seed_production_id'].patchValue(bsp4_seed_quantity);

                      if (this.randNo) {
                        this.lotNumbers = this.randNo.toString().split(",");
                        newFormGroup.controls['lot_number'].patchValue(this.randNo);
                      }
                    }
                    return { ...x };
                  })
                });
              }
              IIndPartFormArray.forEach(elem => {
                console.log(elem, 'el')
              })
              this.filterPaginateSearch.Init(IIndPartFormArray, this);
              this.initSearchAndPagination();
            });
          });

        }
      });
    }
  }


  onlyView() {
    if (this.IstPartFormGroupControls["yearofIndent"].value &&
      this.IstPartFormGroupControls["cropName"].value) {
      let searchData = {
        search: [
          { columnNameInItemList: "id", value: this.submissionId }
        ],
        "pageSize": -1
      };
      let searchFilter = {
        search: [
          { columnNameInItemList: "year.value", value: this.IstPartFormGroupControls["yearofIndent"].value["value"] },
          { columnNameInItemList: "crop.value", value: this.IstPartFormGroupControls["cropName"].value["value"] }
        ],
        "pageSize": -1
      };
      if (this.editVarietyData) {
        searchData.search.push({ columnNameInItemList: "variety_id", value: this.editVarietyData?.variety_id });
      }
      this._service.postRequestCreator("get-lot-number", searchData, null).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
          let IIndPartFormArray: {
            name: string,
            varietyId: number,
            varietyLotNumber: Array<string>,
            actualQty: number,
            formGroup: FormGroup,
            arrayfieldsIIndPartList: Array<SectionFieldType>
          }[] = [];
          data.EncryptedResponse.data.rows?.forEach((element: any, index: number) => {
            this.lotSize = element.lot_number_size;
            createCropVarietyData(element, true);
            this.getProducedSeed(element.m_crop_variety.id);
            if (this.loggedInUserInfoService != undefined)
              element.nodalAddressDesignation = this.loggedInUserInfoService.loginInfo.address + " and "
                + this.loggedInUserInfoService.loginInfo.designation;

            let newFormGroup = new FormGroup<any>([]);
            this.createFormControlsOfAGroup(selectLotNumberUIFieldsUIFields, newFormGroup);
            newFormGroup.controls["breeder_seed_production_id"].disable();
            newFormGroup.controls['max_lot_size'].disable();
            newFormGroup.controls["lot_number"].disable();
            newFormGroup.controls["lot_number"].patchValue(element?.refernce_number_moa);
            newFormGroup.controls["max_lot_size"].patchValue(this.crop_lot_size ? this.crop_lot_size : element.lot_number_size);

            IIndPartFormArray.push({
              name: element.m_crop_variety && element.m_crop_variety.variety_name,
              varietyId: element.m_crop_variety && element.m_crop_variety.id,
              varietyLotNumber: [],
              actualQty: element.actualQty,
              formGroup: newFormGroup,
              arrayfieldsIIndPartList: selectLotNumberUIFieldsUIFields.map(x => {
                if (1) { }
                if (!["selectBreederName", "availableNucleusSeed", "allocateNucleusSeed"].includes(x.formControlName)) {
                  // if (element.quantity_of_seed_produced && this.crop_lot_size) {
                  //   this.numberOfLots = (element.quantity_of_seed_produced) / (this.crop_lot_size);
                  //   this.randNo = randomLotNo(this.numberOfLots, this.createdByUser, this.shortName, this.runningNum);
                  // }
                  newFormGroup.controls['breeder_seed_production_id'].patchValue(this.productionQty);
                  newFormGroup.controls['lot_number'].patchValue(element.lot_number);
                  this.lotNoInView = element.lot_number;
                }
                return { ...x };
              })
            });
          });
          if (this.isView) {

            IIndPartFormArray.forEach(item => {
              item.arrayfieldsIIndPartList.forEach(elem => {
                if (elem.formControlName == 'breeder_seed_production_id') {
                  item.arrayfieldsIIndPartList.splice(1, 1)
                }

              })
              console.log(IIndPartFormArray, 'item')

            })
          }
          this.filterPaginateSearch.Init(IIndPartFormArray, this);

          this.initSearchAndPagination();
        }
      });
    }
  }

  getProducedSeed(varietyId) {
    if (this.IstPartFormGroupControls["yearofIndent"].value && this.IstPartFormGroupControls["cropName"].value) {
      let searchFilter = {
        search: [
          { columnNameInItemList: "year.value", value: this.IstPartFormGroupControls["yearofIndent"].value["value"] },
          { columnNameInItemList: "crop.value", value: this.IstPartFormGroupControls["cropName"].value["value"] },
          { columnNameInItemList: "variety.value", value: varietyId },
        ],
        "pageSize": -1
      };
      this._service.postRequestCreator("get-actual-seed-production", searchFilter, null).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let resp = data.EncryptedResponse.data.rows[0];
          this.productionQty = resp && resp.bsp_2 && resp.bsp_2.bsp_3 && resp.bsp_2.bsp_3.bsp_4 && resp.bsp_2.bsp_3.bsp_4.actual_seed_production ? resp.bsp_2.bsp_3.bsp_4.actual_seed_production : 0;
          while (this.incement <= 1) {
            this.onlyView();
            ++this.incement;
          }
          // newFormGroup.controls['breeder_seed_production_id'].patchValue(this.productionQty);
          // data.EncryptedResponse.data.rows?.forEach((element: any, index: number) => {
          //   this.viewQty.push(element.quantity_of_seed_produced);
          // });
        }
      });
    }
  }

  getBreederData(selectBreederNameFieldInfo: SectionFieldType, breeder_id: any) {
    let breederInfo = selectBreederNameFieldInfo.fieldDataList.filter(x => x.value == breeder_id);
    if (breederInfo && breederInfo.length > 0) {
      return {
        name: breederInfo[0].name,
        value: this.editVarietyData.breeder_id
      };
    }
    else {
      return selectBreederNameFieldInfo.fieldDataList[0];
    }
  }
  saveAndNavigate() {
    if (this.filterPaginateSearch.itemListTotalPage > this.filterPaginateSearch.itemListCurrentPage) {
      this.filterPaginateSearch.navigate("next");
    }
  }

  saveAsDraft() {
    if (this.dynamicFieldsComponent[0] !== undefined) {
      this.dynamicFieldsComponent[0].showError = true;
    }
    if (this.formSuperGroup.invalid) {
      return;
    }

    this.router.navigate(['/nucleus-seed-availability-by-breeder']);
  }

  activateVarietyIndexInAccordion(varietyIndexInAccordion: number) {
    if (this.activeVarietyIndexInAccordion == varietyIndexInAccordion) {
      this.activeVarietyIndexInAccordion = -1;
    }
    else {
      this.activeVarietyIndexInAccordion = varietyIndexInAccordion;
    }
  }

  // changePerPage(event:number){

  // }

  // pageNumbers():number[]{
  //   return Array(this.numberOfLots)
  //   .fill(0).map((x,i)=>i+1);
  // }
  filterUncommonArrays(jsonArray1, jsonArray2) {
    return jsonArray1
      .filter((obj1) => !jsonArray2.some((obj2) => obj1.value == obj2.spp_id))
      .concat(
        jsonArray2.filter((obj2) => !jsonArray1.some((obj1) => obj2.value === obj1.spp_id))
      );
  }
}
