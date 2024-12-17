import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { formatDate } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { bspProformasIIUIFields, bspProformasIIVarietyUIFields, bspProformasIIVarietyUIFieldsSecond } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common'
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { convertDates, convertDatetoDDMMYYYYwithdash } from 'src/app/_helpers/utility';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-proformas-ii-form',
  templateUrl: './proformas-ii-form.component.html',
  styleUrls: ['./proformas-ii-form.component.css'],
})
export class ProformasIiFormComponent implements OnInit {


  @ViewChildren(DynamicFieldsComponent) dynamicFieldsComponents: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);

  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  yearOfIndent: any = [];
  prodCenter: any = [];
  varietyName: any = [];
  cropName: any = [];
  seasonData: any = [];
  todayDate = new Date();
  prdData: any = [];
  bspData: any = [];
  isAttachmentPresent: boolean = false;
  currentUser: any = { id: 10, name: "Hello User" };
  currentProductionCenter: any = {
    id: '',
    name: ''
  };
  fileData = {};
  buttonText = 'Submit'
  dataRow: boolean = false;
  totalIndentQuantity: any;
  ifNotBeingProduced: any = [
    { name: "Yes", "value": true },
    { name: "No", "value": false },
  ]
  freezTimeLineData: any;
  freezeTimeLine:boolean=true;
  NotBeingProducedData: any;
  expectedError: string;
  expectedInvestionErr: string;

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

  constructor(activatedRoute: ActivatedRoute, private router: Router, private restService: RestService,
    private breederService: BreederService,
    private datePipe: DatePipe,
    private prodService: ProductioncenterService,
    private fb: FormBuilder,
    private seedService: SeedServiceService,
    private masterService: MasterService
  ) {

    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name

    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }

    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;
    this.isDraft = router.url.indexOf("edit/draft") > 0;

    this.formSuperGroup.addControl("IstPartFormGroup", new FormGroup([]));
    this.formSuperGroup.addControl("search", new FormControl(""));

    this.createFormControlsOfAGroup(bspProformasIIUIFields, this.IstPartFormGroup);
    this.fieldsList = bspProformasIIUIFields;
    this.filterPaginateSearch.itemListPageSize = 100;
    activatedRoute.params.subscribe(val => {

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

  async ngOnInit() {
    this.dataRow = false;
    this.dataload = false;
    if (this.isEdit || this.isView) {
      // await this.loadBsp2ProformasData()
      this.breederService.getRequestCreator('get-bsp2/' + this.submissionId).subscribe(dataList => {

        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          this.productionCenter();
          this.getYearDataForBSPForm();
          this.onYearChange();
          this.getCropSeason();
          this.onSeasonChange();
          this.onCropChange();
          this.onSearch();
          this.buttonText = 'Update'
          let data = this.bspData = dataList.EncryptedResponse.data
          this.isAttachmentPresent = false;
          this.isDraft = data?.isdraft ? true : false;
          // let foundData = { year: year, crop: crop, season: season }
          // this.patchForm(foundData);
        }

        this.dataload = true;
      });
    } else {
      this.productionCenter();
      this.getYearDataForBSPForm();
      this.onYearChange();
      this.getCropSeason();
      this.onSeasonChange();
      this.onCropChange();
      this.onSearch();

      this.dataload = true;
    }


  }
  
  onSearch() {
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
  }

  async getYearDataForBSPForm() {
    this.breederService.getRequestCreator("getYearDataForBSPForm").subscribe((data: any) => {
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
        if (this.isEdit || this.isView) {
          let year = yrs.filter(x => x.value == this.bspData.year)[0]
          this.IstPartFormGroupControls["yearofIndent"].patchValue(year);
        }
      }
    })
  }

  async onYearChange() {
    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.breederService.getRequestCreator("getSeasonDataForBSPForm?year=" + newValue.value).subscribe((data: any) => {
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
          if (this.isView || this.isEdit) {
            let season = seasons.filter(x => x.value == this.bspData.season)[0]
            this.IstPartFormGroupControls["season"].patchValue(season);
          }
        }
      })
    })
  }

  async onSeasonChange() {
    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {
      
      let year = this.IstPartFormGroupControls["yearofIndent"].value;
      let season = newValue.value
      this.getFreezTimeLineData(year);
      this.breederService.getRequestCreator("getCropDataForBSPForm?year=" + year.value + "&season=" + season).subscribe((data: any) => {
        if (data.EncryptedResponse.data) {
          let cropGroups = []
          data.EncryptedResponse.data.forEach(element => {
            let temp = {
              name: element['m_crop.crop_name'],
              value: element['crop_code']
            }
            cropGroups.push(temp);
          });
          this.fieldsList[2].fieldDataList = cropGroups;
          if (this.isView || this.isEdit) {
            let crop = cropGroups.filter(x => x.value == this.bspData.crop_code)[0]
            this.IstPartFormGroupControls["cropName"].patchValue(crop);
          }
        }
      })
    })
  }
  getFreezTimeLineData(year){
    let season ;
    if(this.IstPartFormGroupControls["season"].value == "K"){
      season = "Kharif";
    }else{
      season = "Rabi" ;
    }
    const param = {
      search:{
        year_of_indent: parseInt(year.value),
        season_name: season,
        activitie_id : 5
      }
    }
  let route = "freeze-timeline-filter";
  this.masterService.postRequestCreator(route,null,param).subscribe(res=>{
    if(res.EncryptedResponse.status_code == 200){
      this.freezTimeLineData = res && res.EncryptedResponse  && res.EncryptedResponse.data ? res.EncryptedResponse.data:[];
      console.log('this.freezTimeLineData====',this.freezTimeLineData);
    }
    let date = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].end_date;
    let startDate = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].start_date;

    let endDateInput =formatDate(date,'yyyy-MM-dd','en_US')
    let startDateInput =formatDate(startDate,'yyyy-MM-dd','en_US')

   console.log('dateInput=====',endDateInput);
    
   let date1 = formatDate(new Date(),'yyyy-MM-dd','en_US');
    console.log('date1 today',date1);
    if(date){
      if(startDateInput <= date1 && endDateInput >= date1){
        // alert('Hii');
        this.freezeTimeLine = true;
      }else{
        // alert('bye');
        this.freezeTimeLine = false;
      }
    }
  });
  }
  async onCropChange() {
    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      this.IstPartFormGroupControls["cropName"]['value']['varieties'] = []
      let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value;
      let season = this.IstPartFormGroupControls["season"].value.value
      let crop = newValue.value

      let searchparams = { "search": [{ "columnNameInItemList": "year.value", "value": yearValue }, { "columnNameInItemList": "crop.value", "value": crop.crop_code }], "pageSize": -1 }

      let varieties = []
      this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
      let IIndPartFormArray: {
        bsp1ids: string,
        bsp_1_id: string,
        variety_id: string,
        name: string,
        production_center_id: string,
        formGroup: FormGroup,
        arrayfieldsIIndPartList: Array<SectionFieldType>
      }[] = [];

      this.dataRow = true;
      this.breederService.getRequestCreator("get-bsp1-data?cropName=" + crop + "&userId=" + this.currentProductionCenter.id + "&yearOfIndent=" + yearValue +"&season="+season, null).subscribe((data: any) => {
        let varieties = this.prdData = data.EncryptedResponse.data

        if (this.isView || this.isEdit) {
          varieties = this.prdData = this.prdData.filter(x => x.id == this.bspData.bsp_1_id)
          this.prodCenter = this.prodCenter.filter(x => x.id == this.bspData.production_center_id.id)[0]

        }

        this.totalIndentQuantity = 0;

        varieties?.forEach((element: any, index: number) => {
          let newFormGroup = new FormGroup<any>([]);
          this.createFormControlsOfAGroupVariety(bspProformasIIVarietyUIFields, newFormGroup, index);

          let temp = this.getQuantityOfSeedProduced(element?.quantity_of_seed_produced || 0)
          newFormGroup.controls["targeted_quantity"].patchValue(temp);

          this.totalIndentQuantity = this.totalIndentQuantity + (element.quantity_of_seed_produced ? Number(element.quantity_of_seed_produced) : 0);

          // console.log("element.bsp1IDelement.bsp1ID", element.bsp1ID, element.bsp1ID.toString())
          if (this.isEdit || this.isView) {
          
            this.totalIndentQuantity = element.quantity_of_seed_produced ? element.quantity_of_seed_produced : 0;
            let NotBeingProduced = this.ifNotBeingProduced.filter(x => x.value == this.bspData.if_not_being_produced)[0]
            this.NotBeingProducedData=NotBeingProduced
            element = this.bspData
            console.log(NotBeingProduced,'NotBeingProduced')
            newFormGroup.controls["sown_area"].patchValue(this.bspData.area || '');
            newFormGroup.controls["expected_production"].patchValue(this.bspData.expected_production || '');
            newFormGroup.controls["field_location"].patchValue(this.bspData.field_location || '');
            newFormGroup.controls["latitude"].patchValue(this.bspData.lat || '');
            newFormGroup.controls["longitude"].patchValue(this.bspData.long || '');
            newFormGroup.controls["not_being_produced"].patchValue(NotBeingProduced || '');

            if (this.isView) {
              if (NotBeingProduced['value'] !== true) {
                newFormGroup.controls["sowing_date"].patchValue(this.datePipe.transform(this.bspData.date_of_sowing, "dd-MM-yyyy"));
                newFormGroup.controls["expected_inspection_period_from"].patchValue(convertDatetoDDMMYYYYwithdash(this.bspData.expected_inspection_from));
                newFormGroup.controls["expected_inspection_period_to"].patchValue(this.datePipe.transform(this.bspData.expected_inspection_to, "dd-MM-yyyy"));
                newFormGroup.controls["expected_harvest_from"].patchValue(this.datePipe.transform(this.bspData.expected_harvest_from, "dd-MM-yyyy"));
                newFormGroup.controls["expected_harvest_to"].patchValue(this.datePipe.transform(this.bspData.expected_harvest_to, "dd-MM-yyyy"));
                newFormGroup.controls["availability_expected_date"].patchValue(this.datePipe.transform(this.bspData.expected_availbility, "dd-MM-yyyy"));
              }
              else {
                newFormGroup.controls["sowing_date"].patchValue("NA");
                newFormGroup.controls["expected_inspection_period_from"].patchValue("NA");
                newFormGroup.controls["expected_inspection_period_to"].patchValue("NA");
                newFormGroup.controls["expected_harvest_from"].patchValue("NA");
                newFormGroup.controls["expected_harvest_to"].patchValue("NA");
                newFormGroup.controls["availability_expected_date"].patchValue("NA");
              }
              newFormGroup.controls['upload'].patchValue(this.bspData.document)
            }
            else {
              newFormGroup.controls["expected_inspection_period_from"].patchValue(
                {
                  //   dateRange: null,
                  //   isRange: false,
                  //   singleDate: {
                  //     formatted: this.bspData.expected_inspection_from,
                  //     jsDate: new Date(this.bspData.expected_inspection_from)
                  //   }
                  // }
                  // {
                  dateRange: null,
                  isRange: false,
                  singleDate: {
                    formatted: convertDatetoDDMMYYYYwithdash(this.bspData.expected_inspection_from),
                    jsDate: new Date(this.bspData.expected_inspection_from)
                  }

                }
              );

              newFormGroup.controls["sowing_date"].patchValue({
                dateRange: null,
                isRange: false,
                singleDate: {
                  formatted: this.bspData.date_of_sowing,
                  jsDate: new Date(this.bspData.date_of_sowing)
                }
              });

              newFormGroup.controls["expected_inspection_period_to"].patchValue(
                {
                  dateRange: null,
                  isRange: false,
                  singleDate: {
                    formatted: convertDatetoDDMMYYYYwithdash(this.bspData.expected_inspection_to),
                    jsDate: new Date(this.bspData.expected_inspection_to)
                  }
                }
              );
              newFormGroup.controls["expected_harvest_from"].patchValue({
                // this.bspData.expected_harvest_from
                dateRange: null,
                isRange: false,
                singleDate: {
                  formatted: this.bspData.expected_harvest_from,
                  jsDate: new Date(this.bspData.expected_harvest_from)
                }
              });
              newFormGroup.controls["expected_harvest_to"].patchValue({
                // this.bspData.expected_harvest_to

                // this.bspData.expected_harvest_from
                dateRange: null,
                isRange: false,
                singleDate: {
                  formatted: this.bspData.expected_harvest_to,
                  jsDate: new Date(this.bspData.expected_harvest_to)
                }

              });
              newFormGroup.controls["availability_expected_date"].patchValue(
                {
                  // this.bspData.expected_availbility
                  dateRange: null,
                  isRange: false,
                  singleDate: {
                    formatted: this.bspData.expected_availbility,
                    jsDate: new Date(this.bspData.expected_availbility)
                  }
                }
              );


            }
            newFormGroup.controls['upload'].patchValue(this.bspData.document)
            newFormGroup.controls["availability_seed_loaction"].patchValue(this.bspData.location_availbility_seed);


          }
          
          

          IIndPartFormArray.push({
            bsp1ids: element.bsp1ID? element.bsp1ID.toString(): '',
            bsp_1_id: element.id,
            name: (element?.m_crop_variety?.variety_name || index),
            variety_id: element.variety_id,
            production_center_id: element.production_center_id,
            formGroup: newFormGroup,
            arrayfieldsIIndPartList: bspProformasIIVarietyUIFields.map(x => {
              if (["targeted_quantity"].includes(x.formControlName)) {
                newFormGroup.controls[x.formControlName].disable();
              }
              if (["sown_area", "expected_production", "field_location", "sowing_date", "expected_inspection_period_from", "expected_inspection_period_to", "expected_harvest_from", "expected_harvest_to", "availability_expected_date", "if_not_being_produced", "availability_seed_loaction"].includes(x.formControlName)) {
                if (this.isEdit && this.bspData['if_not_being_produced'] == true) {
                  newFormGroup.controls[x.formControlName].disable();

                } else {
                  newFormGroup.controls[x.formControlName].enable();

                }
              }

              return { ...x };
            })
          });
          let IIndPartFormArraySecond = IIndPartFormArray[index].arrayfieldsIIndPartList;
          
          console.log('this.NotBeingProducedData',IIndPartFormArraySecond)
          if(this.NotBeingProducedData && this.NotBeingProducedData.value==true ){
            IIndPartFormArray[index].arrayfieldsIIndPartList=  IIndPartFormArraySecond.filter(x=>x.formControlName=='not_being_produced'  || x.formControlName=='upload')
              
          }
          if(this.NotBeingProducedData && this.NotBeingProducedData.value==false ){
              
            let IIndPartFormArraySeconds = IIndPartFormArraySecond.filter(item=>item.formControlName!='upload')
           
            IIndPartFormArray[index].arrayfieldsIIndPartList=IIndPartFormArraySeconds;
          }
      
          newFormGroup.controls["not_being_produced"].valueChanges.subscribe(data=>{
            if(data.value==true){
              IIndPartFormArray[index].arrayfieldsIIndPartList=  IIndPartFormArraySecond.filter(x=>x.formControlName=='not_being_produced'  || x.formControlName=='upload')
              
              // IIndPartFormArray[index].arrayfieldsIIndPartList.filter(item=>item.formControlName=='not_being_produced')
            }
          
            else{
              let IIndPartFormArraySeconds = IIndPartFormArraySecond.filter(item=>item.formControlName!='upload')
           
              IIndPartFormArray[index].arrayfieldsIIndPartList=IIndPartFormArraySeconds;
            }
          })
          if(this.isView || this.isEdit){
            if(this.NotBeingProducedData && this.NotBeingProducedData.value!=true){

              IIndPartFormArray[index].arrayfieldsIIndPartList[3].fieldDataList = this.prodCenter;
            }

          }
          else{
            IIndPartFormArray[index].arrayfieldsIIndPartList[3].fieldDataList = this.prodCenter;
          }
        })
        this.IstPartFormGroupControls["cropName"].value['varieties'].push(IIndPartFormArray)
        this.filterPaginateSearch.Init(IIndPartFormArray, this);
        this.initSearchAndPagination();
      })

    });
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);

      if (this.isEdit && (x.formControlName == "yearofIndent" || x.formControlName == "cropName" || x.formControlName == "season")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  getCropSeason() {
    this.seedService.postRequestCreator("get-season-details").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((x: any, index: number) => {
          x["name"] = x.season;
          x["value"] = x.season_code;
          this.seasonData.push(x);
        });
        if (this.isEdit || this.isView) {

        }
      }
    });
  }

  createYearRange(years): void {
    this.yearOfIndent = [
      { name: "2020-21", "value": 2020 },
      { name: "2021-22", "value": 2021 },
      { name: "2022-23", "value": 2022 },
      { name: "2023-24", "value": 2023 },
      { name: "2024-25", "value": 2024 },
      // { name: "2025-26", "value": 2025 }
    ]
    let yrs = []
    years.forEach((x: any, index: number) => {
      yrs.push(this.yearOfIndent.filter(y => y.value == x.value))
    })
    this.fieldsList[0].fieldDataList = yrs.flat();
  }

  getCropName(crops) {
    crops.forEach((x: any, index: number) => {
      let crop = x
      if (crop != null) {
        x["name"] = crop['name'];
        x["value"] = crop['value'];
        this.cropName.push(x);
      }
    });
  }



  productionCenter() {
    this.breederService.getRequestCreatorNew("get-bsp1-proforma?userId=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.currentProductionCenter = data.EncryptedResponse.data
        // this.createYearRange(this.currentProductionCenter.year);
        this.getCropName(this.currentProductionCenter.crop_code);

        let nodal_officer_detail = this.currentProductionCenter['agency_detail']['contact_person_name'] + ", " + this.currentProductionCenter['agency_detail']['address']
      }
    })
  }

  add(arr, val, name) {
    const { length } = arr;
    const value = name;
    const found = arr.some(el => el.value === val);
    if (!found) arr.push({ value: val, name: value });
    return arr;
  }



  downoadBills(e) {
    let ImageBase64 = this.bspData.document
    var a = document.createElement("a");
    a.href = "data:image/png;base64," + ImageBase64;
    a.download = "bill.png";
    a.click();
  }

  async loadBsp2ProformasData() {
    this.breederService.getRequestCreator('get-bsp2/' + this.submissionId).subscribe(dataList => {

      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
        this.buttonText = 'Update'
        let data = this.bspData = dataList.EncryptedResponse.data
        this.isAttachmentPresent = false;
        this.isDraft = data?.isdraft ? true : false;
        let year = this.yearOfIndent.filter(x => x.value == data.year)[0]
        let season = this.seasonData.filter(x => x.value == data.season)[0]
        let crop = this.cropName.filter(x => x.value == data.crop_code)[0]
        let foundData = { year: year, crop: crop, season: season }
        this.patchForm(foundData);
      }
      // else {
      //   Swal.fire({   
      //     title: 'Opps!',
      //     text: 'No Record Found',
      //     imageUrl: 'https://cdn.dribbble.com/users/308895/screenshots/2598725/no-results.gif',
      //     imageWidth: 400,
      //     imageHeight: 200,
      //     showConfirmButton: true
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       this.router.navigate(['breeder/bsp-proformas/proformas-2s']);
      //     }
      //   })
      // }
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

  createFormControlsOfAGroupVariety(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>, index: any) {
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "cropName" || x.formControlName == "yearofIndent" || x.formControlName == "production_centre_name" || x.formControlName == "nodal_officer_detail")) {
        newFormControl.disable();
      }
      if (["targeted_quantity", "expected_production"].includes(x.formControlName)) {
        let name = x.fieldName.split("(")[0]
        x.fieldName = name + " (" + this.getQuantityMeasure(crop_code) + ")"
      }
      // x.formControlName = x.id + "_" + index
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  getQuantityMeasure(crop_code) {
    return crop_code.split('')[0] == 'A' ? 'Qt' : 'Kg'
  }

  patchForm(data: any) {
    if (data) {
      // this.IstPartFormGroupControls["yearofIndent"].patchValue(data.year);
      // this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
    }
  }

  submit() {

  }

  create(params) {
    this.breederService.postRequestCreator("add-bsp2", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({

          title: '<p style="font-size:25px;">Data Successfully Save.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
        this.router.navigate(['breeder/bsp-proformas/proformas-2s']);
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.message) {
        Swal.fire({
          title: '<p style="font-size:25px;">BSP Form Has Already Been Filled For This Variety.</p>',
          icon: 'info',
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
    })
  }

  update(params) {
    params[0]['bsp_1_id'] = this.bspData.bsp_1_id
    params[0]['bsp1ids'] = this.bspData && this.bspData.bsp1ids ? this.bspData.bsp1ids : ''

    this.breederService.postRequestCreator("edit-bsp2", null, params[0]).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
        this.router.navigate(['breeder/bsp-proformas/proformas-2s']);
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
    })
  }


  submitForm(formData) {
    let invalid = false;
    let isFormValid = true;

    if (this.formSuperGroup.invalid) {
      invalid = true;
      return;
    }
    // if (this.formSuperGroup.controls['expected_inspection_period_from'].value.singleDate.jsDate > this.formSuperGroup.controls['expected_inspection_period_to'].value.singleDate.jsDate) {
    //   return;
    // }
    const params = []
    
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value
    let not_being_produced = false

    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']

      const expected_inspection_period_from = varietyForm && varietyForm.value && varietyForm.value.expected_inspection_period_from &&
        varietyForm.value.expected_inspection_period_from.singleDate && varietyForm.value.expected_inspection_period_from.singleDate.jsDate ? varietyForm.value.expected_inspection_period_from.singleDate.jsDate : '';

      const expected_inspection_period_to = varietyForm && varietyForm.value && varietyForm.value.expected_inspection_period_to &&
        varietyForm.value.expected_inspection_period_to.singleDate && varietyForm.value.expected_inspection_period_to.singleDate.jsDate ? varietyForm.value.expected_inspection_period_to.singleDate.jsDate : '';

      if (expected_inspection_period_from > expected_inspection_period_to) {

        return;
      }
      const expected_harvest_from = varietyForm && varietyForm.value && varietyForm.value.expected_harvest_from &&
        varietyForm.value.expected_harvest_from.singleDate && varietyForm.value.expected_harvest_from.singleDate.jsDate ? varietyForm.value.expected_harvest_from.singleDate.jsDate : '';

      const expected_harvest_to = varietyForm && varietyForm.value && varietyForm.value.expected_harvest_to &&
        varietyForm.value.expected_harvest_to.singleDate && varietyForm.value.expected_harvest_to.singleDate.jsDate ? varietyForm.value.expected_harvest_to.singleDate.jsDate : '';

      if (expected_harvest_from > expected_harvest_to) {

        return;
      }

      if (varietyForm.value['not_being_produced'].value != true) {
        not_being_produced = false;
        if (!varietyForm.value['sown_area'] || !varietyForm.value['expected_production'] || !varietyForm.value['field_location'] || !varietyForm.value['latitude'] || !varietyForm.value['longitude'] || !varietyForm.value['expected_inspection_period_from'] || !varietyForm.value['expected_inspection_period_to'] || !varietyForm.value['sowing_date'] || !varietyForm.value['expected_harvest_from'] || !varietyForm.value['expected_harvest_to'] || !varietyForm.value['availability_seed_loaction'] || !varietyForm.value['availability_expected_date']) {
          isFormValid = false
        }
      }
      else {
        not_being_produced = true;
      }
      let bspIdArr=[]
      bspIdArr.push(newValue['cropName'].value.varieties[0][index]['bsp1ids']?  newValue['cropName'].value.varieties[0][index]['bsp1ids'] :(this.bspData && this.bspData.bsp1ids? this.bspData.bsp1ids: ''))
      let formGroupcontrol = varietyForm.controls
      params.push({
        crop_code: crop_code,
        year: year,
        season: season,
        area: formGroupcontrol['sown_area'].value,
        date_of_sowing: (formGroupcontrol['sowing_date'].value) && formGroupcontrol['sowing_date'].value.singleDate && formGroupcontrol['sowing_date'].value.singleDate.jsDate
          ? convertDates(formGroupcontrol['sowing_date'].value.singleDate.jsDate) : "undefined",
        expected_production: formGroupcontrol['expected_production'].value,
        field_location: formGroupcontrol['field_location'].value,
        lat: formGroupcontrol['latitude'].value,
        long: formGroupcontrol['longitude'].value,
        expected_inspection_from: (formGroupcontrol['expected_inspection_period_from'].value)
          && (formGroupcontrol['expected_inspection_period_from'].value).singleDate && (formGroupcontrol['expected_inspection_period_from'].value).singleDate.jsDate
          ? convertDates((formGroupcontrol['expected_inspection_period_from'].value).singleDate.jsDate) : "undefined",
        expected_inspection_to: formGroupcontrol['expected_inspection_period_to'].value
          && formGroupcontrol['expected_inspection_period_to'].value.singleDate && formGroupcontrol['expected_inspection_period_to'].value.singleDate && formGroupcontrol['expected_inspection_period_to'].value.singleDate.jsDate
          ? convertDates(formGroupcontrol['expected_inspection_period_to'].value.singleDate.jsDate) : "undefined",
        expected_harvest_from: (formGroupcontrol['expected_harvest_from'].value) &&
          formGroupcontrol['expected_harvest_from'].value.singleDate && formGroupcontrol['expected_harvest_from'].value.singleDate.jsDate ? convertDates(formGroupcontrol['expected_harvest_from'].value.singleDate.jsDate) : "undefined",
        expected_availbility: (formGroupcontrol['availability_expected_date'].value) && formGroupcontrol['availability_expected_date'].value.singleDate &&
          formGroupcontrol['availability_expected_date'].value.singleDate.jsDate ? convertDates(formGroupcontrol['availability_expected_date'].value.singleDate.jsDate) : "undefined",
        location_availbility_seed: formGroupcontrol['availability_seed_loaction'].value,
        expected_harvest_to: formGroupcontrol['expected_harvest_to'].value
          && formGroupcontrol['expected_harvest_to'].value.singleDate && formGroupcontrol['expected_harvest_to'].value.singleDate.jsDate ? convertDates(formGroupcontrol['expected_harvest_to'].value.singleDate.jsDate) : "undefined",
        document: this.dynamicFieldsComponents['last'].downloadUrl,
        if_not_being_produced: formGroupcontrol['not_being_produced'].value.value,
        variety_id: newValue['cropName'].value.varieties[0][index]['variety_id'],
        production_center_id: newValue['cropName'].value.varieties[0][index]['production_center_id'],
        bsp_1_id: newValue['cropName'].value.varieties[0][index]['bsp_1_id'],
        is_active: 1,
        isdraft: 0,
        id: this.submissionId,
        user_id: this.currentUser.id,
        reason: "Availability",
        bsp1ids: newValue['cropName'].value.varieties[0][index]['bsp1ids']?  newValue['cropName'].value.varieties[0][index]['bsp1ids'] :(this.bspData && this.bspData.bsp1ids? this.bspData.bsp1ids: ''),
        bspIdArr:bspIdArr
      })
    }

    let document = this.dynamicFieldsComponents['last'].downloadUrl;
    if (not_being_produced && (document == null || document == undefined)) {
      Swal.fire('Error', 'Please upload supporting document', 'error');
      return;
    } else {
      let data=    this.prodService.getexpected_harvest_to()
      data.subscribe(item=>{
        this.expectedError= item
       if(item!=''){
        Swal.fire({
          toast: false,
          icon: "error",
          title: item,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
          showCancelButton: false,
        });
         return true;
       }
       
      })
      let value = this.prodService.getexpected_investion_to()
      value.subscribe(datas=>{
        this.expectedInvestionErr = datas
        if(datas!=''){
          Swal.fire({
            toast: false,
            icon: "error",
            title: datas,
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            showCancelButton: false,
          });
           return true;
         }
      })
      if (!isFormValid) {
        Swal.fire({
          title: '<p style="font-size:25px;">All Fields Are Required.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
            confirmButtonColor: '#E97E15',
        });
      } else {
        Swal.fire({
          title: 'Saving...',
          html: 'Please Wait...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null)
          }
        });

     
       if(this.expectedError=='' && this.expectedInvestionErr==''){

         this.isEdit ? this.update(params) : this.create(params)
       }else{
        Swal.fire({
          toast: false,
          icon: "error",
          title:this.expectedError,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
          showCancelButton: false,
        });
        return true;
      
       }

         
      
      }

    }

  }

  saveAndNavigate() {
    if (this.filterPaginateSearch.itemListTotalPage > this.filterPaginateSearch.itemListCurrentPage) {
      this.filterPaginateSearch.navigate("next");
    }
  }

  saveAsDraft() {
    const params = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value;
    let data=    this.prodService.getexpected_harvest_to()
   
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
      let formGroupcontrol = varietyForm.controls;
      let bspIdArr=[]
      bspIdArr.push(newValue['cropName'].value.varieties[0][index]['bsp1ids']?  newValue['cropName'].value.varieties[0][index]['bsp1ids'] :(this.bspData && this.bspData.bsp1ids? this.bspData.bsp1ids: ''))
      params.push({
        crop_code: crop_code,
        year: year,
        season: season,
        area: (formGroupcontrol['sown_area'].value),
        date_of_sowing: (formGroupcontrol['sowing_date'].value) && formGroupcontrol['sowing_date'].value.singleDate && formGroupcontrol['sowing_date'].value.singleDate.jsDate
          ? convertDates(formGroupcontrol['sowing_date'].value.singleDate.jsDate) : '',
        expected_production: formGroupcontrol['expected_production'].value,
        field_location: formGroupcontrol['field_location'].value,
        lat: formGroupcontrol['latitude'].value,
        long: formGroupcontrol['longitude'].value,
        expected_inspection_from: (formGroupcontrol['expected_inspection_period_from'].value && formGroupcontrol['expected_inspection_period_from'].value.singleDate && formGroupcontrol['expected_inspection_period_from'].value.singleDate.jsDate ? convertDates(formGroupcontrol['expected_inspection_period_from'].value.singleDate.jsDate) : ''),
        expected_inspection_to: (formGroupcontrol['expected_inspection_period_to'].value && formGroupcontrol['expected_inspection_period_to'].value.singleDate && formGroupcontrol['expected_inspection_period_to'].value.singleDate.jsDate ? convertDates(formGroupcontrol['expected_inspection_period_to'].value.singleDate.jsDate) : ''),
        expected_harvest_from: (formGroupcontrol['expected_harvest_from'].value && formGroupcontrol['expected_harvest_from'].value.singleDate && formGroupcontrol['expected_harvest_from'].value.singleDate.jsDate ? convertDates(formGroupcontrol['expected_harvest_from'].value.singleDate.jsDate) : ''),
        expected_availbility: (formGroupcontrol['availability_expected_date'].value && formGroupcontrol['availability_expected_date'].value.singleDate && formGroupcontrol['availability_expected_date'].value.singleDate.jsDate ? convertDates(formGroupcontrol['availability_expected_date'].value.singleDate.jsDate) : ''),
        location_availbility_seed: formGroupcontrol['availability_seed_loaction'].value,
        expected_harvest_to: (formGroupcontrol['expected_harvest_to'].value && formGroupcontrol['expected_harvest_to'].value.singleDate && formGroupcontrol['expected_harvest_to'].value.singleDate.jsDate
          ? convertDates(formGroupcontrol['expected_harvest_to'].value.singleDate.jsDate) : ''),
        document: this.dynamicFieldsComponents['last'].downloadUrl,
        if_not_being_produced: formGroupcontrol['not_being_produced'].value.value,
        variety_id: newValue['cropName'].value.varieties[0][index]['variety_id'],
        production_center_id: newValue['cropName'].value.varieties[0][index]['production_center_id'],
        bsp_1_id: newValue['cropName'].value.varieties[0][index]['bsp_1_id'],
        is_active: 1,
        isdraft: 1,
        id: this.submissionId,
        user_id: this.currentUser.id,
        reason: "Availability",
        bsp1ids: newValue['cropName'].value.varieties[0][index]['bsp1ids']?newValue['cropName'].value.varieties[0][index]['bsp1ids']: '',
        bspIdArr:bspIdArr
      })
    }
    Swal.fire({
      title: 'Saving...',
      html: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null)
      }
    });
    data.subscribe(item=>{
      this.expectedError= item
      if(item!=''){
        Swal.fire({
          toast: false,
          icon: "error",
          title: item,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
          showCancelButton: false,
        });
        return;
      }
    else{
      this.isEdit ? this.update(params) : this.create(params)
    }
    })

  }

  activateVarietyIndexInAccordion(varietyIndexInAccordion: number) {
    if (this.activeVarietyIndexInAccordion == varietyIndexInAccordion) {
      this.activeVarietyIndexInAccordion = -1;
    }
    else {
      this.activeVarietyIndexInAccordion = varietyIndexInAccordion;
    }
  }

  temp() {
    var fileURL = "https://seeds-documents.s3.amazonaws.com/uploads/5fa27293-0938-47c9-a941-2b3c6c80a2d7-9399ea58-9f03-4561-8cd9-f37f908dd648-breeder-seed-certificate (1) (1).pdf"
    window.open(fileURL, '_blank');
  }

  getQuantityOfSeedProduced(data: any) {
    let value = data.toString();

    if (value.indexOf(".") == -1) {
      return data;

    } else {
      // return data.toFixed(2);
      return data ? Number(data).toFixed(2) : 0;


    }
  }

}
