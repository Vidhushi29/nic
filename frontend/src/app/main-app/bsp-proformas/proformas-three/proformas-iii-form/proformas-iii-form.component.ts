import { Component, OnInit, QueryList, ViewChild, ViewChildren, TemplateRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { bspProformasIIIUIFields, bspProformasIIIVarietyUIFields, selectNucliousBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { AddMember } from 'src/app/model/addMember.model';
import { checkLength, checkNumber, convertDatewithdot } from 'src/app/_helpers/utility';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";
import { environment } from 'src/environments/environment';
import * as html2PDF from 'html2pdf.js';
import { MasterService } from 'src/app/services/master/master.service';
// import html2PDF from 'jspdf-html2canvas';

@Component({
  selector: 'app-proformas-iii-form',
  templateUrl: './proformas-iii-form.component.html',
  styleUrls: ['./proformas-iii-form.component.css']
})
export class ProformasIiiFormComponent implements OnInit {

  @ViewChildren(DynamicFieldsComponent) dynamicFieldsComponents: QueryList<DynamicFieldsComponent> | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  bsp3: any = [
    {
      variety_name: 'pusa 2000',
      area_under_variety: '2.00',
      field_location: null,
      report_for_monitoring_team: 'Satisfactory',
      no_of_samples: 5,
      authority: 'seed'
    },
    {
      variety_name: 'pusa 2001',
      area_under_variety: '2.00',
      field_location: null,
      report_for_monitoring_team: 'Satisfactory',
      no_of_samples: 5,
      authority: 'seed'
    },

  ]

  cardData: any = [
    { id: 1, pureSeed: 'Wheat', crop: "New Crop1", inertMatter: "Demo 1", Variety: "HSB 73", germination: "NaN", lableNo: "completed", oilContent: "HSGV2", lotNo: "12526", producingInstitution: "prodiction1", dateOftest: "23-04-2-23", issuingAuthorityname: "NaN", designation: "Admin" },
    { id: 2, pureSeed: 'Rice', crop: "New Crop2", inertMatter: "Demo 2", Variety: "H0126", germination: "NaN", lableNo: "completed", oilContent: "HSGV2", lotNo: "12526", producingInstitution: "prodiction1", dateOftest: "23-04-2-23", issuingAuthorityname: "NaN", designation: "Admin" },
    { id: 3, pureSeed: 'Bajara', crop: "New Crop", inertMatter: "Demo 3", Variety: "HSB 15", germination: "NaN", lableNo: "completed", oilContent: "HSGV2", lotNo: "12526", producingInstitution: "prodiction1", dateOftest: "23-04-2-23", issuingAuthorityname: "NaN", designation: "Admin" },
    { id: 4, pureSeed: 'Wheat', crop: "New Crop2", inertMatter: "Demo 1", Variety: "H0113", germination: "NaN", lableNo: "completed", oilContent: "HSGV2", lotNo: "12526", producingInstitution: "prodiction1", dateOftest: "23-04-2-23", issuingAuthorityname: "NaN", designation: "Admin" },
    { id: 5, pureSeed: 'Sarson', crop: "New Crop4", inertMatter: "Demo 2", Variety: "HSB 71", germination: "NaN", lableNo: "completed", oilContent: "HSGV2", lotNo: "12526", producingInstitution: "prodiction1", dateOftest: "23-04-2-23", issuingAuthorityname: "NaN", designation: "Admin" },
  ];

  bsp1: any = [
    {
      variety_name: 'pusa 2000',
      area_under_variety: '2.00',
      field_location: null,
      report_for_monitoring_team: 'Satisfactory',
      no_of_samples: 5,
      authority: 'seed'
    },
    {
      variety_name: 'bsp 2001',
      area_under_variety: '2.00',
      field_location: null,
      report_for_monitoring_team: 'Satisfactory',
      no_of_samples: 5,
      authority: 'seed'
    },

  ]
  tableArray = []

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  isMemberEdit: boolean = false;
  memberEditIndex: any;
  memberModal: boolean = false;
  newMember: AddMember = new AddMember();
  membersData: Array<any> = [];
  currentUser: any = { id: 10, name: "Hello User" };
  currentProductionCenter: any;
  cropName: any = [];
  prdData: any = [];
  bspData: any = [];
  prodCenter: any = [];
  teamMembers: any = [];
  yearOfIndent: any = [];
  minTeamMembers: any = 1;
  ngForm!: FormGroup;
  institutes: any = []
  designationList: any = []
  seasonData: any = [];
  selectedFiles: File;
  downloadUrl: any;
  fileName: any;
  fileData = new FormData();
  pdfSrc;
  modalRef: BsModalRef;
  buttonText = 'Submit'
  documentType = 'pdf';
  ImgError: any;
  dataRow: boolean = false;
  totalIndentQuantity: any;
  deleteKeys;
  member: any;
  todayDate = new Date()
  newArr = [];
  tab = [];
  VarietisArray: { bsp_1_id: string; bsp_2_id: string; variety_id: string; name: string; formGroup: FormGroup; arrayfieldsIIndPartList: Array<SectionFieldType>; }[];
  varietyFormArray = [];

  pdfDataRow: any;
  todayDates: string;
  seasonName: any;
  cropYear: any;
  crop_nameinreport: any;
  userName;
  freezTimeLineData: any;
  freezeTimeLine: boolean = true;
  dataload: boolean = false;
  pastedNumber: any;
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
    private modalService: BsModalService,
    private masterService: MasterService,
    private fb: FormBuilder, private router: Router, private restService: RestService, private breederService: BreederService, private seedService: SeedServiceService) {

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

    this.createFormControlsOfAGroupSearch(bspProformasIIIUIFields, this.IstPartFormGroup);
    this.fieldsList = bspProformasIIIUIFields;
    this.filterPaginateSearch.itemListPageSize = 100;

    this.productionCenter();
    this.loadDesignationList();
    this.loadInstituteList();
    this.getCropSeason();

    this.ngForm = this.fb.group({
      name: ['', [Validators.required]],
      designation: ['', Validators.required],
      mobile_number: ['', [Validators.required]],
      institute_name: ['', Validators.required],
      address: ['', Validators.required],
    });

    this.loadBsp2ProformasData();
  }

  getCropSeason() {
    this.seedService.postRequestCreator("get-season-details").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((x: any, index: number) => {
          x["name"] = x.season;
          x["value"] = x.season_code;
          this.seasonData.push(x);
        });
      }
    });
  }

  loadTeamMembers() {
    this.teamMembers = [];
    this.breederService.getRequestCreator("get-monitoring-team-list").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach((x: any, index: number) => {
          x["name"] = x.name + (x.m_designation.name ? " - (" + x.m_designation.name + ")" : '')
          x["value"] = x.id;
          this.teamMembers.push(x);
        });
        let crop = this.IstPartFormGroupControls['cropName'].value
        if (crop) {
          this.IstPartFormGroupControls['cropName'].patchValue(crop)
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
    let yrs = [];
    let sortArr = [];
    let sortArrs;
    let val;
    years.forEach((x: any, index: number) => {
      var temp = this.getFinancialYear(x.value)
      yrs.push({ value: x.value, name: temp })
      val = yrs.flat();
      sortArr.push(val.sort((a, b) => b.value - a.value));
      let arr = sortArr.flat()
      // let newArr= [...new Set(arr)]
      var clean = arr.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.name === arr.name && t.value == arr.value)))
      sortArrs = clean.sort((a, b) => b.value - a.value)
    })
    // this.fieldsList[1].fieldDataList = sortArrs;
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
    // this.fieldsList[1].fieldDataList = this.cropName
  }

  productionCenter() {
    this.breederService.getRequestCreatorNew("get-bsp3-proforma?userId=" + this.currentUser.id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.currentProductionCenter = data.EncryptedResponse.data
        this.createYearRange(this.currentProductionCenter.year)
        this.getCropName(this.currentProductionCenter.crop_code)
        // this.IstPartFormGroup.controls['production_centre_name'].patchValue(this.currentProductionCenter['agency_detail']['agency_name'])
      }
    })
  }

  loadDesignationList() {
    this.breederService.getRequestCreatorNew("designation?").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach(x => {
          this.designationList.push({ name: x.name, value: x.id })
        })
        this.designationList = this.designationList.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.name === arr.name)))

      }
    })
  }

  loadInstituteList() {
    this.breederService.getRequestCreatorNew("institute?").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        data.EncryptedResponse.data.forEach(x => {
          this.institutes.push({ name: x.insitution_name, value: x.id })
        })
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

  add(arr, val, name) {
    const { length } = arr;
    const value = name;
    const found = arr.some(el => el.value === val);
    if (!found) arr.push({ value: val, name: value });
    return arr;
  }

  ngOnInit(): void {
    this.loadTeamMembers();
    this.dataRow = false;
    this.todayDates = convertDatewithdot(this.todayDate)
    this.getAgencyData()

    if (this.isView || this.isEdit) { 
      this.dataload = false;
    } else {
      this.dataload = true;
    }

    

    var currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    this.breederService.getRequestCreator("getYearDataForBSP3?user_id=" + currentUser.id).subscribe((data: any) => {
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
        if (this.isView || this.isEdit) {
          let year = yrs.filter(x => x.value == this.bspData.year)[0]
          this.IstPartFormGroupControls["yearofIndent"].patchValue(year);
        }
      }
    })

    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.breederService.getRequestCreator("getSeasonDataForBSP3?year=" + newValue.value + "&user_id=" + currentUser.id).subscribe((data: any) => {
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

    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {
      let year = this.IstPartFormGroupControls["yearofIndent"].value;
      this.cropYear = year.value

      let season = newValue.value
      this.seasonName = newValue.name
      this.getFreezTimeLineData(year);

      this.breederService.getRequestCreator("getCropDataForBSP3?year=" + year.value + "&season=" + season + "&user_id=" + currentUser.id).subscribe((data: any) => {
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

    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      this.crop_nameinreport = newValue.name
      let yearValue = this.IstPartFormGroupControls["yearofIndent"].value.value;
      let season = this.IstPartFormGroupControls["season"].value.value

      let crop = newValue.value
      this.filterPaginateSearch.itemListInitial = this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemListFilter = [];
      let IIndPartFormArray: {
        bsp_1_id: string,
        bsp_2_id: string,
        variety_id: string,
        expected_harvest_from: string,
        crop_name: string,
        name: string,
        formGroup: FormGroup,
        arrayfieldsIIndPartList: Array<SectionFieldType>
      }[] = [];

      this.breederService.getRequestCreator("get-bsp3-variety-list?userId=" + this.currentUser.id + "&cropName=" + crop + "&yearOfIndent=" + yearValue + "&season=" + season, null).subscribe((data: any) => {
        let varieties = this.prdData = data.EncryptedResponse.data;
        if (this.isView || this.isEdit) {
          varieties = this.prdData = this.prdData.filter(x => x.id == this.bspData.bsp_2_id)
        }
        this.totalIndentQuantity = 0;
        varieties?.forEach((element: any, index: number) => {
          let newFormGroup = new FormGroup<any>([]);
          this.createFormControlsOfAGroup(bspProformasIIIVarietyUIFields, newFormGroup, element);
          if (element && element.bsp_1) {
            let selectedMembers = []

            newFormGroup.controls["targeted_quantity"].patchValue(element && element.bsp_1['quantity_of_seed_produced'] ? parseFloat(element?.bsp_1['quantity_of_seed_produced']).toFixed(2) : 0);
            newFormGroup.controls["sown_area"].patchValue(element?.area);
            newFormGroup.controls["expected_production"].patchValue(element?.expected_production);
            newFormGroup.controls["field_location"].patchValue(element?.field_location);
            newFormGroup.controls["proforma_bspI_sent_date"].patchValue(formatDate(element?.bsp_1['created_at'], 'dd-MM-yyyy', "en-US"));
            newFormGroup.controls["proforma_bspII_sent_date"].patchValue(formatDate(element?.created_at, 'dd-MM-yyyy', "en-US"));

            if (this.isView || this.isEdit) {
              newFormGroup.controls["latitude"].patchValue(this.bspData.lat || '');
              newFormGroup.controls["longitude"].patchValue(this.bspData.long || '');
              let teamMemberIds = this.bspData.team_member_ids ? this.bspData.team_member_ids.split(",") : [];

              teamMemberIds.forEach(a => {
                selectedMembers.push(this.teamMembers.filter(s => s.value == parseInt(a)))
              })
              newFormGroup.controls["monitoring_team_report"].patchValue({ name: this.bspData.monitor_report, value: this.bspData.monitor_team_report });

              if (this.isEdit) {
                newFormGroup.controls["team_member_ids"].patchValue(selectedMembers.flat());
              }
            }
            if (this.isView) {
              newFormGroup.controls["date_of_inspection"].patchValue(formatDate(this.bspData.date_of_inspection, 'dd-MM-yyyy', "en-US"));

            }
            else if (this.isEdit) {
              newFormGroup.controls["date_of_inspection"].patchValue(
                {
                  dateRange: null,
                  isRange: false,
                  singleDate: {
                    formatted: this.bspData.date_of_inspection,
                    jsDate: new Date(this.bspData.date_of_inspection)
                  }
                }
              );
            }
            newFormGroup.controls["team_member_ids"].valueChanges.subscribe(newValue => {
              this.generateDocumentData(newFormGroup, element)
            })
            IIndPartFormArray.push({
              bsp_1_id: element.bsp_1_id,
              bsp_2_id: element.id,
              expected_harvest_from: element.expected_harvest_from,
              crop_name: this.IstPartFormGroupControls["cropName"].value.name,
              variety_id: element.variety_id,
              name: (element?.m_crop_variety?.variety_name || index),
              formGroup: newFormGroup,
              arrayfieldsIIndPartList: bspProformasIIIVarietyUIFields.map(x => {
                if (!["monitoring_team_report", "upload", "latitude", 'longitude'].includes(x.formControlName)) {
                  newFormGroup.controls[x.formControlName].disable();
                }

                if (["date_of_inspection",].includes(x.formControlName)) {
                  newFormGroup.controls["date_of_inspection"].enable();
                }
                return { ...x };
              })
            });

          }

          this.totalIndentQuantity = this.totalIndentQuantity + (element.bsp_1.quantity_of_seed_produced ? Number(element.bsp_1.quantity_of_seed_produced) : 0);

        })
        this.IstPartFormGroupControls["cropName"].value['varieties'] = []
        this.IstPartFormGroupControls["cropName"].value['varieties'].push(IIndPartFormArray)
        this.varietyFormArray.push(IIndPartFormArray)
        this.VarietisArray = IIndPartFormArray
        this.filterPaginateSearch.Init(IIndPartFormArray, this);
        this.initSearchAndPagination();

        this.dataload = true;
      })
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


  }
  getFreezTimeLineData(year) {
    let season;
    if (this.IstPartFormGroupControls["season"].value == "K") {
      season = "Kharif";
    } else {
      season = "Rabi";
    }
    const param = {
      search: {
        year_of_indent: parseInt(year.value),
        season_name: season,
        activitie_id: 5
      }
    }
    let route = "freeze-timeline-filter";
    this.masterService.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.freezTimeLineData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        console.log('this.freezTimeLineData====', this.freezTimeLineData);
      }
      let date = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].end_date;
      let startDate = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].start_date;

      let endDateInput = formatDate(date, 'yyyy-MM-dd', 'en_US')
      let startDateInput = formatDate(startDate, 'yyyy-MM-dd', 'en_US')

      console.log('dateInput=====', endDateInput);

      let date1 = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
      console.log('date1 today', date1);
      if (date) {
        if (startDateInput <= date1 && endDateInput >= date1) {
          // alert('Hii');
          this.freezeTimeLine = true;
        } else {
          // alert('bye');
          this.freezeTimeLine = false;
        }
      }
    });
  }

  imgSrc: any;
  showPdf(template: TemplateRef<any>, pdfUrl) {

    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg'
    });
    // this.pdfViewerAutoLoad.pdfSrc = encodeURIComponent(url);

    this.pdfSrc = environment.awsUrl + pdfUrl
  }
  showImage(template: TemplateRef<any>, imgUrl) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg'
    });
    // this.imgSrc = environment.awsUrl + imgUrl

    // this.imgSrc= imgUrl;
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

  createFormControlsOfAGroupSearch(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {

    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "yearofIndent" || x.formControlName == "season" || x.formControlName == "cropName") || x.formControlName == "production_centre_name") {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>, element) {
    let selectedMembers = []
    if (this.isView) {
      let teamMemberIds = this.bspData.team_member_ids ? this.bspData.team_member_ids.split(",") : [];
      teamMemberIds.forEach(a => {
        selectedMembers.push(this.teamMembers.filter(s => s.value == parseInt(a)))
      })
    }
    let crop_code = this.IstPartFormGroupControls["cropName"].value.value
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "yearofIndent" || x.formControlName == "season" || x.formControlName == "cropName") || x.formControlName == "production_centre_name") {
        newFormControl.disable();
      }
      if (["targeted_quantity", "expected_production"].includes(x.formControlName)) {
        let name = x.fieldName.split("(")[0]
        x.fieldName = name + " (" + this.getQuantityMeasure(crop_code) + ")"
      }
      if (this.isView && x.formControlName == 'team_member_ids') {
        x.fieldDataList = selectedMembers.flat();
      } else if (x.formControlName == 'team_member_ids') {
        x.fieldDataList = this.teamMembers;
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  getQuantityMeasure(crop_code) {
    return crop_code.split('')[0] == 'A' ? 'Qt' : 'Kg'
  }
  async loadBsp2ProformasData() {
    if (this.isEdit || this.isView) {
      this.breederService.getRequestCreator('get-bsp3/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.bspData = dataList.EncryptedResponse.data
          this.buttonText = 'Update'
          this.isDraft = data?.isdraft ? true : false;
          // this.teamMembers = this.bspData.monitoring_teams;
          if (this.bspData.document) {
            let documentName = this.bspData.document.split('.');
            this.documentType = documentName[documentName.length - 1] ? documentName[documentName.length - 1].toLowerCase : ''
          }
          this.downloadUrl = this.bspData.document
          this.pdfSrc = environment.awsUrl + this.downloadUrl
          let year = this.yearOfIndent.filter(x => x.value == data.year)[0]
          let crop = this.cropName.filter(x => x.value == data.crop_code)[0]
          let season = this.seasonData.filter(x => x.value == data.season)[0]
          let foundData = { year: year, crop: crop, season: season }
          this.patchForm(foundData);
        }
        else {
          Swal.fire({
            title: 'Opps',
            text: 'No Record Found.',
            imageUrl: 'https://cdn.dribbble.com/users/308895/screenshots/2598725/no-results.gif',
            imageWidth: 400,
            imageHeight: 200,
            showConfirmButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['breeder/bsp-proformas/proformas-3s']);
            }
          })
        }
      });
    }
  }

  patchForm(data: any) {
    this.IstPartFormGroupControls["yearofIndent"].patchValue(data.year);
    this.IstPartFormGroupControls["season"].patchValue(data.season);
    this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  submit() {
  }

  create(params) {
    this.breederService.postRequestCreator("add-bsp3", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        // this.router.navigate(['breeder/bsp-proformas/proformas-3s']);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {

          this.router.navigate(['breeder/bsp-proformas/proformas-3s']);
        })
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
    this.breederService.postRequestCreator("edit-bsp3", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        // this.router.navigate(['breeder/bsp-proformas/proformas-3s']);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        }).then(x => {

          this.router.navigate(['breeder/bsp-proformas/proformas-3s']);
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

  generateDocumentData(newFormGroup, element) {
    // let object = {
    //   variety_data: element['m_crop_variety'],
    //   area: element.area,
    //   field_loaction: element.location_availbility_seed,
    //   bsp1_date: element.bsp_1.created_at ? new Date(element.bsp_1.created_at).toLocaleDateString() : "NA",
    //   bsp2_date: element.created_at ? new Date(element.created_at).toLocaleDateString() : "NA",
    //   monitoring_report: "",
    //   member_data: []
    // }

    // this.pdfData.push(object)
    // let data = {}
    // let arr = []
    // data['crop'] = this.IstPartFormGroupControls["cropName"].value
    // data['season'] = this.IstPartFormGroupControls["season"].value
    // let tmp = {}
    // let newValue = this.IstPartFormGroupControls

    // for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
    //   let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
    //   let name = newValue['cropName'].value.varieties[0][index].name
    //   let formGroupcontrol = varietyForm.controls
    //   let teamMembers = formGroupcontrol['team_member_ids'].value
    //   this.member = teamMembers
    //   tmp[name] = teamMembers

    // }
    // let newvariety = [];



    // data['documentGroup'] = tmp

    // arr.push(data)
    // let tmps
    // let tempArr = []
    // tempArr.push(tmp)

    // const removeEmpty = (obj) => {
    //   Object.entries(obj).forEach(([key, val]) =>
    //     (val && typeof val === 'object') && removeEmpty(val) ||
    //     (val === null || val === "") && delete obj[key]
    //   );
    //   return obj;
    // };
    // removeEmpty(tempArr)
    // for (let i = 0; i < this.varietyFormArray.length; i++) {
    // }
    // let value_data = [];

    // for (let i = 0; i < arr.length; i++) {
    //   let temp = {
    //     document: Object.values(arr[i].documentGroup),
    //     variety_name: Object.keys(arr[i]['documentGroup'])

    //   }
    //   this.tableArray.push(temp)
    // }
    // this.tableArray = this.tableArray.flat();
    // this.tableArray = this.tableArray[0];

    // let varietiesformArr = [];
    // let varietyform;

    // for (let index = 0; index < arr.length; index++) {
    //   varietyform = arr[0].crop.varieties[0].map(v => ({ v, crop_name: arr[0].crop.name }))
    //   varietiesformArr.push(varietyform)
    // }

    // this.tab = [];
    // let newTab = []
    // this.tab.push(this.tableArray['document'])

    // let keysArr = (Object.keys(tmp))
    // let temps = [];
    // temps.push(keysArr)
    // this.tab = this.tab.flat()
    // this.tab = this.tab.filter(x => x != '')
    // let array;
    // let newValues = this.IstPartFormGroupControls
    // let monitoring_report_variety = [];
    // for (let index = 0; index < newValues['cropName'].value.varieties[0].length; index++) {
    //   let varietyForm = newValues['cropName'].value.varieties[0][index]['formGroup']
    //   let formGroupcontrol = varietyForm.controls
    //   monitoring_report_variety.push(formGroupcontrol['monitoring_team_report'].value['name'])
    // }

    // for (let index = 0; index < this.tab.length; index++) {

    //   array = this.tab[index].map(v => ({
    //     ...v, crop_name: this.IstPartFormGroupControls["cropName"].value.name,
    //     season: this.IstPartFormGroupControls["season"].value.name,
    //     variety_name: keysArr[index],
    //     report_team: monitoring_report_variety
    //   }))
    //   newTab.push(array)
    // }
    // this.tab = newTab;

    // let newKey;

    // var keys = Object.keys(data['documentGroup']);

    // let temarr = {}
    // let reportArr = []
    // let name = this.IstPartFormGroupControls["cropName"].value


    // const jsonItems = [];
    // let value_name = []
    // const group = {};
    // for (const [k, v] of Object.entries(jsonItems)) {
    //   const sectionName = k;
    //   if (group[sectionName])
    //     group[sectionName][k] = v;
    //   else
    //     group[sectionName] = { sectionName, [k]: v };
    // }
    // const answer = Object.values(group);
    // let arrss = []
    // let jsonArray = []
    // this.tableArray = [];


    // Object.keys(data['documentGroup']).forEach(function (key) {

    //   jsonItems.push(data['documentGroup'][key])
    // })

  }
  cleanData(data) {
    for (let elem in data[0]) {
      if (this.deleteKeys.includes(elem)) {
        delete data[elem];
      }
    }
    return data;
  }
  findByKey = (obj, key) => {
    const arr = obj['C-1'];
    if (arr.length) {
      const result = arr.filter(el => {
        return el['name'] === key;
      });
      if (result && result.length) {
        return result[0].value;
      }
      else {
        return '';
      }
    }
  }
  submitForm(formData) {
    let invalid = false;
    const params = []
    let errorMsg = []
    let newValue = this.IstPartFormGroupControls
    let year = newValue['yearofIndent'].value.value
    let crop_code = newValue['cropName'].value.value
    let season = newValue['season'].value.value;
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
      if (varietyForm.invalid) {
        Swal.fire('Error', 'Please Fill Out All Required Fields.', 'error');
        invalid = true;
      }
      let formGroupcontrol = varietyForm.controls
      let team_member_ids = []
      console.log("formGroupcontrol['team_member_ids'].value", formGroupcontrol['team_member_ids'])
      if (formGroupcontrol['team_member_ids'].value == "" || formGroupcontrol['team_member_ids'].value.length == 0) {
        errorMsg.push("Select Team Members")
      } else {
        team_member_ids = formGroupcontrol['team_member_ids'].value.map(item => item.value)
      }
      params.push({
        crop_code: crop_code,
        year: year,
        season: season,
        monitor_team_report: formGroupcontrol['monitoring_team_report'].value['value'],
        monitor_report: formGroupcontrol['monitoring_team_report'].value['name'],
        targeted_quantity: formGroupcontrol['targeted_quantity'].value,
        lat: formGroupcontrol['latitude'].value,
        long: formGroupcontrol['longitude'].value,
        bsp_2_id: newValue['cropName'].value.varieties[0][index]['bsp_2_id'],
        variety_id: newValue['cropName'].value.varieties[0][index]['variety_id'],
        production_center_id: this.currentProductionCenter.id,
        team_member_ids: team_member_ids.join(','),
        is_active: 1,
        isdraft: 0,
        document: this.downloadUrl,
        id: this.submissionId,
        user_id: this.currentUser.id,
        date_of_inspection: formGroupcontrol['date_of_inspection'].value && formGroupcontrol['date_of_inspection'].value.singleDate && formGroupcontrol['date_of_inspection'].value.singleDate.jsDate ? (formGroupcontrol['date_of_inspection'].value.singleDate.jsDate) : null
      })

    }
    if (invalid) {
      this.dynamicFieldsComponents['last'].showError = true;
      return;
    }
    if (this.downloadUrl == null) {
      errorMsg.push("Team Member's Report Required")
    }

    if (errorMsg.length > 0) {
      Swal.fire('Error', errorMsg.join(), 'error');
      return;
    } else {
      this.isEdit ? this.update(params) : this.create(params)
    }

  }


  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.selectedFiles = event.target.files[0];
      const file = this.selectedFiles
      this.fileName = file.name
      this.fileData["name"] = file.name;
      this.fileData["extension"] = file.type.split("/")[1];
      this.fileData['file'] = file;
      var allowedExtensions = /(\.pdf)$/i;

      if (!allowedExtensions.exec(file.name)) {
        this.ImgError = 'Please Select Valid File.'
        // fileInput.value = '';
        return;
      }
      Swal.fire({
        title: 'Uploading File...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null)
        }
      });
      this.breederService.upload(this.selectedFiles).subscribe((res: any) => {
        if (typeof (res) === 'object' && res.status == 'success' && res.results) {
          this.downloadUrl = res.results.name;
          if (this.downloadUrl) {
            let documentName = this.downloadUrl.split('.');
            this.documentType = documentName[documentName.length - 1]
          }
          Swal.fire({
            title: '<p style="font-size:25px;">Document Successfully Uploaded.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'
          })
        } else if ((res.status_code && parseInt(res.status_code) == 404) || (res.EncryptedResponse
          && res.EncryptedResponse.status_code && res.EncryptedResponse.status_code == 404)) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'File Size Exceed.',
            showConfirmButton: false,
            timer: 1000
          })
        }



      }
      );
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
    let season = newValue['season'].value.value
    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let varietyForm = newValue['cropName'].value.varieties[0][index]['formGroup']
      let formGroupcontrol = varietyForm.controls
      let team_member_ids = formGroupcontrol['team_member_ids'].value.map(item => item.value)
      params.push({
        crop_code: crop_code,
        year: year,
        season: season,
        monitor_team_report: formGroupcontrol['monitoring_team_report'].value['value'],
        monitor_report: formGroupcontrol['monitoring_team_report'].value['name'],
        targeted_quantity: formGroupcontrol['targeted_quantity'].value,
        lat: formGroupcontrol['latitude'].value,
        long: formGroupcontrol['longitude'].value,
        bsp_2_id: newValue['cropName'].value.varieties[0][index]['bsp_2_id'],
        variety_id: newValue['cropName'].value.varieties[0][index]['variety_id'],
        production_center_id: this.currentProductionCenter.id,
        team_member_ids: team_member_ids.join(','),
        is_active: 1,
        isdraft: 1,
        document: this.downloadUrl,
        id: this.submissionId,
        user_id: this.currentUser.id,
        date_of_inspection: formGroupcontrol['date_of_inspection'].value && formGroupcontrol['date_of_inspection'].value.singleDate && formGroupcontrol['date_of_inspection'].value.singleDate.jsDate ? (formGroupcontrol['date_of_inspection'].value.singleDate.jsDate) : null
      })
    }
    this.isEdit ? this.update(params) : this.create(params)
  }

  activateVarietyIndexInAccordion(varietyIndexInAccordion: number) {
    if (this.activeVarietyIndexInAccordion == varietyIndexInAccordion) {
      this.activeVarietyIndexInAccordion = -1;
    }
    else {
      this.activeVarietyIndexInAccordion = varietyIndexInAccordion;
    }
  }

  closeModal() {
    Swal.showLoading(null)
    this.memberModal = false
    Swal.close()
  }

  openModal() {
    this.ngForm.reset()
    this.memberModal = true
  }

  onSubmitMemberForm(formData) {
    let data = {}
    if (formData.valid) {
      data['name'] = formData.controls['name'].value
      data['address'] = formData.controls['address'].value
      data['designation'] = formData.controls['designation'].value.name
      data['designation_id'] = formData.controls['designation'].value.value
      data['institute_name'] = formData.controls['institute_name'].value.name
      data['mobile_number'] = formData.controls['mobile_number'].value
      // data['crop_code'] = this.IstPartFormGroupControls['cropName'].value.value
      data['user_id'] = this.currentUser.id,
        data['is_active'] = 1,
        formData.reset()
      this.breederService.postRequestCreator("add-monitoring-team", null, data).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          this.ngOnInit();
          this.memberModal = !this.memberModal;
          Swal.fire({
            title: '<p style="font-size:25px;">New Team Member Added Successfully.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'
          })
        }
        else {
          Swal.fire({
            title: '<p style="font-size:25px;">Something Went Wrong.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'
          })
        }
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Please Enter Valid Details.',
      })
    }
  }
  onPasteNumber(event: ClipboardEvent, field: string, length: string) {
    var alphaExp = '^[0-9]$';
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    if (this.ngForm.get(field).value.match(alphaExp)) {

      if (this.ngForm.get(field).value.length > len) {
        const value = this.ngForm.get(field).value;
        this.ngForm.get(field).setValue(value.substring(0, len))
      }
      else {
        this.ngForm.get(field).setValue(this.ngForm.get(field).value)
      }
      // return true
    }
    else {
      event.preventDefault()
      if (field == 'latitude' || field == 'longitude') {
        let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        console.log('this.ngForm.get(field).value.length', this.ngForm.get(field).value.length)
        if (this.ngForm.get(field).value.length > 10) {
          event.preventDefault();
          return false
        }
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      else {
        event.preventDefault();
        let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
        let value = parseInt(length)
        fieldName = this.ngForm.get(field).value + fieldName;
        this.ngForm.get(field).setValue(fieldName.substring(0, value))
      }
      // return false
    }

  }
  
  deleteMember(id: any, index) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure to Delete This Team Member. '",
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
        if (id == undefined) {
          this.teamMembers.splice(index, 1);
        } else {
          this.breederService
            .postRequestCreator("delete-monitoring-team/" + id, null, null)
            .subscribe((apiResponse: any) => {
              if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
                && apiResponse.EncryptedResponse.status_code == 200) {
                this.teamMembers = this.teamMembers.filter(x => x.id != id)
              }
            });
        }
      }
    })
  }

  updateMemberForm(formData) {
    let data = {}
    if (formData.valid && this.memberEditIndex != undefined) {
      this.teamMembers[this.memberEditIndex]['name'] = formData.controls['name'].value
      this.teamMembers[this.memberEditIndex]['address'] = formData.controls['address'].value
      this.teamMembers[this.memberEditIndex]['designation'] = formData.controls['designation'].value.name
      this.teamMembers[this.memberEditIndex]['institute_name'] = formData.controls['institute_name'].value.name
      this.teamMembers[this.memberEditIndex]['mobile_number'] = formData.controls['mobile_number'].value
      this.teamMembers[this.memberEditIndex]['crop_code'] = this.IstPartFormGroupControls['cropName'].value.value
      formData.reset()
      this.memberModal = !this.memberModal;
      this.memberEditIndex = undefined;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Team Member Detail Updated.',
        showConfirmButton: false,
        timer: 1000
      })
    }
  }

  editMember(member: any, index) {
    this.isMemberEdit = true;
    this.memberEditIndex = index;
    this.ngForm.patchValue(member)
    let designation = this.designationList.filter(x => x.name == member.designation)[0]
    let institute_name = this.institutes.filter(x => x.name == member.institute_name)[0]
    this.ngForm.controls['designation'].patchValue(designation)
    this.ngForm.controls['institute_name'].patchValue(institute_name)
    this.memberModal = !this.memberModal
  }

  download() {
    let pdfData = [];
    let newValue = this.IstPartFormGroupControls;

    for (let index = 0; index < newValue['cropName'].value.varieties[0].length; index++) {
      let fetchMemberData = newValue['cropName'].value.varieties[0][index]['formGroup'];
      let variety = newValue['cropName'].value.varieties[0][index]

      const memberData = fetchMemberData.controls.team_member_ids.value;

      let temp = [];
      let temp2 = [];
      if (memberData) {
        memberData.forEach(element => {
          temp.push(element.value)
          temp2.push(element.name)
        });
      }

      let tempObject = {
        variety_name: variety.name || 'NA',
        area: variety['formGroup']['controls']['sown_area']['value'] || '0',
        field_loaction: variety['formGroup']['controls']['field_location']['value'] || 'NA',
        bsp1_date: variety['formGroup']['controls']['proforma_bspI_sent_date']['value'] || 'NA',
        bsp2_date: variety['formGroup']['controls']['proforma_bspII_sent_date']['value'] || 'NA',
        monitoring_report: variety['formGroup']['controls']['monitoring_team_report']['value']['name'] || 'NA',
      }

      let tempArray = []
      tempArray.push(tempObject)

      let object = {
        "data": tempArray,
        "member_data_id": temp,
        "member_data_name": temp2,
      }

      if (pdfData && pdfData.length > 0) {
        var count = 0;

        pdfData.forEach(pdfRow => {
          if (pdfRow.member_data_id.length == object.member_data_id.length) {
            let count2 = 0;
            pdfRow.member_data_id.forEach(member_id_row => {
              if (object.member_data_id.includes(member_id_row)) {
                count2 += 1;
              }
            });

            if (count2 == pdfRow.member_data_id.length) {
              pdfRow['data'].push(tempObject)
            } else {
              count += 1
            }

          } else {
            count += 1;
          }
        });

        if (count == pdfData.length) {
          pdfData.push(object)
        }
      } else {
        pdfData.push(object)
      }

    }

    this.pdfDataRow = pdfData;
    console.log(this.pdfDataRow)

    const name = 'report';
    const element = document.getElementById('content');
    const options = {
      filename: `${name}.pdf`,
      // margin: [10, 3, 0, 0], //top, left, buttom, right,
      // filename: 'my_file.pdf',
      margin: [0, 0, 0, 0],
      // image: { type: 'jpeg', quality: 1 },
      image: { type: 'jpeg', quality: 0.98, crossorigin: "*", },

      // html2canvas: {dpi: 192, scale: 2, letterRendering: true},
      // pagebreak: {mode: 'avoid-all'},
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', pagesplit: true },
      letterRendering: true,
      pagebreak: { after: ['#tableContent'], avoid: 'img' },
      // html2canvas:  { scale: 2 },
      // pageBreak: { mode: 'css', after:'.break-page'},
      // pagebreak: { mode: '', before: '#page2el' },
      // pagebreak: { mode: ['avoid-all', '*', 'legacy'] },

      // jsPDF: {unit: 'pt', format: 'a4', orientation: 'portrait'},
      html2canvas: {
        dpi: 300,
        scale: 2,
        letterRendering: true,
        logging: true
        // useCORS: true,

      },
      // jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
      // jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // var pageCount = doc.getNumberOfPages();
    // console.log(pageCount,'pageCount')
    // doc.deletePage(pageCount)
    html2PDF().from(element).outputPdf().then(function (pdf) {
      // This logs the right base64
    });

    // html2PDF().set({
    //   pagebreak: { after: ['#tableContent'], avoid: 'img' }
    // }).from(element).toPdf.save();


    html2PDF().set(options).from(element).toPdf().save();
  }
  getAgencyData() {
    const data = localStorage.getItem('BHTCurrentUser')
    let userData = JSON.parse(data)
    this.masterService.postRequestCreator('getAgencyUserDataById/' + userData.agency_id).subscribe(data => {
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.userName = apiResponse.agency_name.charAt(0).toUpperCase() + apiResponse.agency_name.slice(1);
    })
  }
}
