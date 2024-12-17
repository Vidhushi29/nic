import { Component, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
import { VerietyAllocationBreederSeedIndentorLiftingFields, AllocationBreederSeedIndentorUIFieldsMultipleProduction, AllocationBreederSeedIndentorLiftingFields, AllocationBreederSeedIndentorUIFields } from 'src/app/common/data/ui-field-data/seed-division-fields';
import { bspIAccordionFormGroupAndFieldList, accordionUIDataTypeBSPI, BreederSeedSubmissionNodalUIFields, createCropVarietyData, selectBreederNameNodalUIFields } from 'src/app/common/data/ui-field-data/breeder-seed-submission-nodal-ui-fields';
import { bspProformasVVarietyUIFields } from 'src/app/common/data/ui-field-data/nuclious-breeder-seed-submission-nodal-ui-field';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-breederseed-allocationreport-second',
  templateUrl: './breederseed-allocationreport-second.component.html',
  styleUrls: ['./breederseed-allocationreport-second.component.css']
})
export class BreederseedAllocationreportSecondComponent implements OnInit {
  @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: DynamicFieldsComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  showUpperRow: boolean = false;
  indentorsubmitted = false
  uniqueArray;
  activeVarietyIndexInAccordion = -1;
  selectedVerietyDetailbtn = false;
  cropWiseVarietyBtn = false;
  fieldsList: Array<SectionFieldType> = [];
  verietyfieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  currentUser: any = { id: 10, name: "Hello User" };
  dropdownSettings: any = {};
  dropdownSettings1: any = {};
  cropName: any = [];
  verietyListDetails: any = {};
  tempVerietyListDetails: Array<any> = [];
  selectedVerietyDetail: any = undefined;
  editData: any = [];
  prodCenter: any = [];
  producionCentersList: any = []
  productionCenter: any = [];
  newFormGroup = new FormGroup<any>([]);
  indentorsOne = [];
  buttonText = 'Submit'

  indenderProductionCenter = []
  finalDataToBeSaved = []
  disableSubmitButton = true;
  editableQuantity = false

  dropdownList = []
  quantity: string;
  searhedData = false;
  finalshowData;

  cropButtonEnable: boolean = false;

  selectedVariety: any;
  varietyDropdownData: Array<any> = [];
  varietyDataload: boolean = false;

  editVarietyDropdown: Array<any> = [];
  editSelectedVariety: any;

  indentors: Array<any> = [];
  editIndentors: Array<any> = [];
  selectedIndentor: any;
  editSelectedIndentor: any;
  selectedIndentorModel = [];
  private submittedData: Array<any> = [];
  private editSubmittedData: Array<any> = [];

  dataToShow: any;

  productionPercentage = 0;
  selectedItem: any;
  prod_center: any;
  new_quantity: any;

  editProdId = undefined;
  editIndex = undefined;
  rowIndex = undefined;

  editbuttonsView: boolean = true;
  VarietyName: any;

  tempForm!: FormGroup;
  editTempForm!: FormGroup;
  indentorLoad: boolean = false;
  editVarietyData = false;
  varietyForm!: FormGroup;
  editVarietyForm!: FormGroup;

  inputForm!: FormGroup;

  editVarietyDataForm: boolean = false;

  editVariety: any

  selectedVarietyForEdit: any;
  dataToShowSecond: any;

  totalData: any;

  upperRowDisplay: boolean = false;
  grandAllocation
  grandIndent
  totalDificit
  grand_total
  grandTotalProduction

  items: any = [];
  items1: any = [
    {
      "variety_code": "A0104111",
      "variety_name": "Rajlaxmi(HP-1731)",
      "notification_year": "2000",
      "surplus_dificit": "-100",
      "indenter": [
        {
          "name": "MP",
          "full_name": "Madhya Pradesh"
        },
        {
          "name": "PB",
          "full_name": "Punjab"
        },
        {
          "name": "BR",
          "full_name": "Bihar"
        }
      ],
      "indent_quantity": [
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 300 //Total of all indents			
        }
      ],
      "allocation": [
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        }

      ],
      "total_allocation": [
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 300 //Total of all indents			
        }

      ]

    },
    {
      "variety_code": "A0104111",
      "variety_name": "Aditya (HD-2781)",
      "notification_year": "2000",
      "surplus_dificit": "-100",
      "indenter": [
        {
          "name": "MP",
          "full_name": "Madhya Pradesh"
        },
        {
          "name": "PB",
          "full_name": "Punjab"
        },
        {
          "name": "BR",
          "full_name": "Bihar"
        }
      ],
      "indent_quantity": [
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 100
        },
        {
          "indent_quantity": 300 //Total of all indents			
        }
      ],
      "allocation": [
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Bheem",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Oja",
          "bspc_produced": 200
        },
        {
          "quantity": [50, 0, 50],
          "total_quantity": 100, //total of allocation
          "bspc_name": "Ojha",
          "bspc_produced": 200
        }

      ],
      "total_allocation": [
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 100
        },
        {
          "total_allocation": 300 //Total of all indents			
        }

      ]

    }
  ]
  fileName = 'allocation report.xlsx';
  cancelProduction: any;
  reportHeader: any = {};


  isCropSubmitted: boolean = false;
  submittedbtnData = false;
  varietyDropdownDatasecond: any[];

  dataToDisplay: Array<any> = []

  selectedVarietyFrom: Number = 0;
  totalAllocationQuantity = 0;
  showeditvariety = false;
  editSelectedVarietys: any;
  varietLineData: any;

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    // XLSX.writeFile(wb, this.fileName);


    ws['!cols'] = [{ width: 8 }, { width: 20 }, { width: 20 }];
    ws['!freeze'] = { xSplit: 1, ySplit: 0, top: 0, left: 1 };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    this.saveExcelFile(excelBuffer, this.fileName);
  }
  saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }
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
    private router: Router,
    private restService: RestService,
    private breederService: BreederService,
    private fb: FormBuilder
  ) {

    this.tempForm = this.fb.group({
      selectedIndentorModel: [''],
    });

    this.editTempForm = this.fb.group({
      selectedIndentorModel: [''],
    });

    this.varietyForm = this.fb.group({
      variety_id: [''],
      variety_line: ['']
    });

    this.editVarietyForm = this.fb.group({
      variety_id: [''],
      variety_line: ['']
    });

    this.inputForm = this.fb.group({
      quantityInputBox: ['']
    })



    this.dropdownSettings = {
      singleSelection: true,
      idField: 'value',
      textField: 'name',
      closeDropDownOnSelection: true,
      allowSearchFilter: true
    };
    this.dropdownSettings1 = {
      singleSelection: true,
      idField: 'variety_line_code',
      textField: 'variety_line_code',
      closeDropDownOnSelection: true,
      allowSearchFilter: true
    };

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
    this.createFormControlsOfAGroup(AllocationBreederSeedIndentorLiftingFields, this.IstPartFormGroup);
    this.createFormControlsOfAGroup(VerietyAllocationBreederSeedIndentorLiftingFields, this.IstPartFormGroup);
    this.verietyfieldsList = VerietyAllocationBreederSeedIndentorLiftingFields
    this.fieldsList = AllocationBreederSeedIndentorLiftingFields;
    this.filterPaginateSearch.itemListPageSize = 10;
  }

  ngOnInit(): void {

    this.submittedData = [];

    this.breederService.getRequestCreatorNew("allocation-to-spa-year").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let years = data.EncryptedResponse.data
        let yrs = []
        years.forEach(x => {
          var temp = this.getFinancialYear(x.year)
          yrs.push({ value: x.year, name: temp })
        })
        // yrs.push(
        //   {
        //     value: '2003', name: '2003-04'
        //   },
        //   {
        //     value: '2006', name: '2006-07'
        //   },
        //   {
        //     value: '2006', name: '2006-07'
        //   }, {
        //   value: '2006', name: '2006-07'
        // }, {
        //   value: '2006', name: '2006-07'
        // },

        // )
        this.fieldsList[0].fieldDataList = yrs;
      }
    })

    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
      this.dataToDisplay = [];
      this.selectedVerietyDetail = {};
      this.varietyDropdownData = [];
      this.selectedVarietyForEdit = ''
      this.varietyForm.controls['variety_id'].setValue('')
      this.breederService.getRequestCreatorNew("allocation-to-spa-season?user_id=" + this.currentUser.id + "&year=" + newValue.value).subscribe((dataList: any) => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let seasons = []
          dataList.EncryptedResponse.data.forEach(element => {
            let temp = { name: element['m_season.season'], value: element['season'] }
            seasons.push(temp);
          });
          this.fieldsList[1].fieldDataList = seasons;

          if (this.isEdit || this.isView) {
            let season = seasons.filter(x => x.value == this.editData.season)[0]
            this.IstPartFormGroupControls["season"].patchValue(season);
          }
        }
      })
    });

    this.IstPartFormGroupControls["season"].valueChanges.subscribe(newValue => {
      this.dataToDisplay = [];
      this.selectedVerietyDetail = {};
      this.varietyDropdownData = [];

      let year = this.IstPartFormGroupControls["yearofIndent"].value.value;
      this.breederService.getRequestCreatorNew("allocation-to-spa-crop?user_id=" + this.currentUser.id + "&year=" + year + "&season=" + newValue.value).subscribe((dataList: any) => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let crops = []
          dataList.EncryptedResponse.data.forEach(element => {
            let temp = { name: element['m_crop.crop_name'], value: element['crop_code'] }
            crops.push(temp);
          });
          this.fieldsList[2].fieldDataList = crops;
          if (this.isEdit || this.isView) {
            let crop = crops.filter(x => x.value == this.editData.crop_code)[0]
            this.IstPartFormGroupControls["cropName"].patchValue(crop);
          }
        }
      })
    });

    this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
      this.dataToDisplay = [];
      this.selectedVerietyDetail = {};
      this.varietyDropdownData = [];
      this.selectedVarietyForEdit = ''
      this.varietyForm.controls['variety_id'].setValue('')
    })

    if (this.isEdit || this.isView) {
      this.searhedData = true;
      this.breederService.getRequestCreator('allocation-to-indentor/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.editData = dataList.EncryptedResponse.data
          this.VarietyName = data && data.m_crop_variety && data.m_crop_variety.variety_name ? data.m_crop_variety.variety_name : '';
          this.finalDataToBeSaved.push(this.editData)
          this.buttonText = 'Update'
          this.isDraft = data?.isdraft ? true : false;
          let tmpyear = this.getFinancialYear(this.editData.year);
          let year = { value: this.editData.year, name: tmpyear }
          this.IstPartFormGroupControls["yearofIndent"].patchValue(year)
          this.disableSubmitButton = false;
        }
      });
    }



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

  search() {
    let searchParams1 = { "Year of Indent": null, "Season": null, "Crop Name": null, };
    let yearofIndent: null;
    let cropName: null;
    let cropVariety: null;
    this.searhedData = true;
    let season: null;
    let reportParam = { "year": null, "season": null, "crop_code": null, };
    if (this.IstPartFormGroupControls["yearofIndent"] && this.IstPartFormGroupControls["yearofIndent"].value) {
      searchParams1['Year of Indent'] = this.IstPartFormGroupControls["yearofIndent"].value["value"]
      reportParam['year'] = (this.IstPartFormGroupControls["yearofIndent"].value["value"]).toString()
    }

    if (this.IstPartFormGroupControls["season"] && this.IstPartFormGroupControls["season"].value) {
      searchParams1['Season'] = this.IstPartFormGroupControls["season"].value["value"];
      reportParam['season'] = this.IstPartFormGroupControls["season"].value["value"]

    }

    if (this.IstPartFormGroupControls["cropName"] && this.IstPartFormGroupControls["cropName"].value) {
      searchParams1['Crop Name'] = this.IstPartFormGroupControls["cropName"].value["value"];
      reportParam['crop_code'] = this.IstPartFormGroupControls["cropName"].value["value"]

    }

    let blankData = Object.entries(searchParams1).filter(([, value]) => value == null).flat().filter(n => n).join(", ")

    if (blankData) {
      Swal.fire('Error', "Please Fill " + blankData + " Details Correctly.", 'error');
      return;
    } else {
      this.isCropSubmitted = false;
      this.dataToDisplay = null
      this.submittedData = [];
      this.dataToShow = [];

      this.selectedVarietyForEdit = undefined;
      this.selectedVerietyDetail = undefined;
      this.editSelectedVariety = undefined;
      this.editIndentors = []
      this.indentors = []

      this.editVarietyForm.controls['variety_id'].reset();
      this.showUpperRow = true;
      this.getCropVerieties()
    }
    this.reportHeader = reportParam;

    if (this.IstPartFormGroupControls['cropName'] && this.IstPartFormGroupControls['cropName'].value) {
      this.reportHeader['crop_name'] = this.IstPartFormGroupControls['cropName'].value['name'];
    }
    this.getReportData(reportParam)

  }

  getReportData(reportParam) {
    this.breederService.postRequestCreator('spa/indentor-report', null, reportParam).subscribe(dataList => {
      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
        let reportData = dataList.EncryptedResponse.data[0]
        this.items = reportData.allocations;

        this.grandAllocation = reportData.grandAllocation
        this.grandIndent = reportData.grandIndent
        this.totalDificit = reportData.totalDificit
        this.grand_total = reportData.totalDificit
        this.grandTotalProduction = reportData.grandTotalProduction


      }
    })
  }

  clear() {

    this.varietyDataload = false;

    if (this.IstPartFormGroupControls["yearofIndent"] && this.IstPartFormGroupControls["yearofIndent"].value) {
      this.IstPartFormGroupControls["yearofIndent"].patchValue('');
    }
    if (this.IstPartFormGroupControls["season"] && this.IstPartFormGroupControls["season"].value) {
      this.IstPartFormGroupControls["season"].patchValue('');;
    }
    if (this.IstPartFormGroupControls["cropName"] && this.IstPartFormGroupControls["cropName"].value) {
      this.IstPartFormGroupControls["cropName"].patchValue('');;
    }
    if (this.IstPartFormGroupControls["veriety"] && this.IstPartFormGroupControls["veriety"].value) {
      this.IstPartFormGroupControls["veriety"].patchValue('');;
    }

    this.isCropSubmitted = false;

    this.selectedVerietyDetail = {}
    this.verietyListDetails = {}
    this.finalDataToBeSaved = []
    this.showUpperRow = false;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['breeder-seed-allocation-spa']);
    });

  }

  getCropVerieties() {
    Swal.fire({
      title: 'Loading Varities',
      html: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null)
      }
    });
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;

    this.varietyDropdownData = [];
    this.tempVerietyListDetails = [];

    let object = {
      formData: {
        year: year.value,
        season: season.value,
        crop_code: cropName.value,
        user_id: this.currentUser.id,
      }
    }
    this.selectedVarietyForEdit = [];

    this.isCropSubmitted = false;
    this.varietyDataload = false;
    this.breederService.getRequestCreatorNew("allocation-to-spa-varieties" + "?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value).subscribe((dataList: any) => {
      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
        this.verietyListDetails = dataList.EncryptedResponse.data;

        if (this.verietyListDetails && this.verietyListDetails.varieties && this.verietyListDetails.varieties.length > 0) {
          if (this.verietyListDetails && this.verietyListDetails.dataspa && this.verietyListDetails.dataspa.length > 0) {
            for (let item of this.verietyListDetails.dataspa) {
              for (let value of this.verietyListDetails.varieties) {
                if (value.m_crop_variety.id == item.m_crop_variety.id) {
                  value.is_variety_submitteds = item.is_variety_submitted
                }

              }
            }
          }
          else {
            this.verietyListDetails.varieties.is_variety_submitteds = 0
          }

        }


        // if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.length > 0) {
        //   data.EncryptedResponse.data.forEach(element => {
        //     if (element.is_active == 1) {
        //       this.isCropSubmitted = true;
        //     }
        //   });
        //   this.selectedVarietyForEdit.push(data.EncryptedResponse.data);

        //   this.getFilledVarietyData(data.EncryptedResponse.data);
        // }

        Swal.fire({
          text: 'Please Select Variety to Proceed.',
        })
        if (this.selectedVarietyForEdit && this.selectedVarietyForEdit.length > 0) {
          this.verietyListDetails.varieties.forEach(element => {
            const index = this.selectedVarietyForEdit[0].findIndex(x => x.variety_id == element.variety_id);
            if (index == -1) {
              if (element) {
                const temp = {
                  name: element.m_crop_variety.variety_name,
                  value: element.m_crop_variety.id
                }
                if (this.verietyListDetails && this.verietyListDetails.dataspa && this.verietyListDetails.dataspa.length > 0) {

                  if (element.is_variety_submitteds == 0 || !element.is_variety_submitteds) {
                    this.tempVerietyListDetails.push(temp)
                    this.varietyDropdownData.push(temp);
                  }
                  else {
                    this.tempVerietyListDetails.push(temp)
                  }
                } else {

                  this.tempVerietyListDetails.push(temp)
                  this.varietyDropdownData.push(temp);
                }
              }
            }
          });
        } else {
          this.verietyListDetails.varieties.forEach(element => {
            if (element) {
              const temp = {
                name: element.m_crop_variety.variety_name,
                value: element.m_crop_variety.id
              }

              if (this.verietyListDetails && this.verietyListDetails.dataspa && this.verietyListDetails.dataspa.length > 0) {

                if (element.is_variety_submitteds == 0) {

                  this.tempVerietyListDetails.push(temp)
                  this.varietyDropdownData.push(temp);
                }
                else {

                  this.tempVerietyListDetails.push(temp)
                  // this.varietyDropdownData.push(temp); 
                }
              } else {
                this.tempVerietyListDetails.push(temp)
                this.varietyDropdownData.push(temp);
              }
            }


          });
        }

        console.log(this.varietyDropdownData, 'varietyDropdownData')

        console.log(this.dataToDisplay, ' this.dataToDisplay')
        if (this.varietyDropdownData.length == 0) {
          this.cropButtonEnable = true;
        }

        this.varietyDataload = true;

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: dataList.EncryptedResponse.message + ": " + dataList.EncryptedResponse.status_code,
        })
      }
    })
    // this.breederService.postRequestCreator('allocationToSPA/getVarietyDataForEdit', null, object).subscribe(data => {

    // })

  }


  onSelectVariety(event: any) {

    this.dataToDisplay = [];
    this.selectedIndentor = [];
    this.selectedVerietyDetailbtn = true;
    this.indentorsOne = []; // Added by Yogesh

    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;

    this.selectedVerietyDetail = {}

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['veriety_id'] = event.value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;

  

    this.getVarietyLine();
    // this.getGridData();
    console.log(this.varietLineData, 'varietLineDatavarietLineData')

  }

  onSelectEditVariety(event: any) {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    this.selectedVerietyDetailbtn = true;

    this.selectedVarietyFrom = 1;
    this.indentorLoad = false;

    this.selectedVerietyDetail = {}
    this.indentors = []
    this.tempForm.controls['selectedIndentorModel'].patchValue(null)
    this.selectedIndentor = null;

    this.varietyForm.reset();

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['variety_id'] = event.value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;

    this.selectedVarietyForEdit = [];

    const filledVariety = this.editSubmittedData.find(x => x.variety_id == event.value);


    if (filledVariety) {

      filledVariety.productionCenters.forEach(prod => {
        prod.quantityAllocated = 0;
        filledVariety.indentors.forEach(inden => {
          inden.productions.forEach(ind_prod => {
            if (prod.production_center_id == ind_prod.id) {
              prod.quantityAllocated += ind_prod.quantity
            }
          });
        })

      });

      this.selectedVerietyDetail = filledVariety;

      if (filledVariety.totalAllocationQuantity >= filledVariety.totalIndentQuantity) {
        this.productionPercentage = 100;
      } else {
        this.productionPercentage = (filledVariety.totalAllocationQuantity / filledVariety.totalIndentQuantity) * 100;
      }

      this.indentors = [];
      this.indentors = filledVariety.indentors;

      this.dataToShow = []
      this.dataToShow.push(JSON.parse(JSON.stringify(filledVariety)));

      this.dataToShow.forEach(variety => {
        variety.indentors.forEach((indentor, i) => {
          const prods = indentor.productions.filter(x => x.quantity > 0)
          indentor.productions = prods
        });
      });

      for (let val of this.dataToShow) {
        let sum = 0;
        for (let value of val.indenter) {
          for (let data of value.productions) {
            value.totalProductionlength = value.productions.length
            val.totalIndentorlength = val.indenter.length
            if (val.totalIndentorlength > 1) {

              val.totalVarietyLength = value.productions.length + val.indenter.length
            } else {
              val.totalVarietyLength = value.productions.length
            }
            sum += value.productions.length;
            val.totalproductioIndentliength = sum

          }
        }
      }


      this.dataToDisplay = [];
      this.dataToDisplay = this.dataToShow;
      console.log(this.dataToDisplay, '999')
      this.indentorLoad = true

    }
    else {
      this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + event.value).subscribe((data: any) => {
        let apiresponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
          let response = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''

          let indentor = response ? response.indentors : ''
          this.indentorLoad = true
          indentor.forEach(element => {
            let temp = {
              name: element.user.name ? element.user.name : 'NA',
              value: element.id,
              allocated_quantity: element.allocated_quantity,
              indent_quantity: element.indent_quantity,
              productions: element.productions,
              quantity_left_for_allocation: element.quantity_left_for_allocation,
              spa_code: element.spa_code,
              state_code: element.state_code

            }
            this.indentors.push(temp)
          });
          this.indentorsOne = this.indentors
        }

        const variety = data.EncryptedResponse.data;
        const producionCentersList = [];
        this.submittedData.forEach(element => {
          if (element.variety_id == event.value) {
            this.editSelectedVariety = element
            this.editSelectedVarietys = element
          }
        });

        if (this.editSelectedVariety.indenter) {

          this.editSelectedVariety.indenter.forEach(element => {

            const object = element;
            this.editIndentors.push(object);

            this.editSelectedVariety.productionCenters.forEach(prodCent => {
              element.productions.forEach(prod => {
                if (prodCent.produ == prod.id) {
                  prodCent.quantityAllocated += prod.quantity
                }
              });
            });

          });
        } else {
          this.editSelectedVariety.indentors.forEach(element => {

            const object = element;
            this.editIndentors.push(object);

            this.editSelectedVariety.productionCenters.forEach(prodCent => {
              element.productions.forEach(prod => {
                if (prodCent.produ == prod.id) {
                  prodCent.quantityAllocated += prod.quantity
                }
              });
            });

          });
        }

        this.dataToDisplay = [];
        const copiedPerson = JSON.parse(JSON.stringify(this.editSelectedVariety));

        copiedPerson.totalproductioIndentliength = 0;
        copiedPerson.totalVarietyLength = 0;
        copiedPerson.totalIndentorlength = 0


        variety.productionCenters.forEach(element => {
          if (element && element.quantityProduced > 0) {
            let temp = {
              name: element.user.name,
              value: element.production_center_id,
              id: element.production_center_id,
              quantity: 0,

            }
            producionCentersList.push(JSON.parse(JSON.stringify(temp)));
          }
        })

        this.indentors = [];
        variety.indentors.forEach(element => {
          element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
          element['productions'] = JSON.parse(JSON.stringify(producionCentersList));
          element['name'] = element.user.name;

          if (this.selectedVarietyForEdit && this.selectedVarietyForEdit.length > 0) {
            const registerVariety = this.selectedVarietyForEdit.find(x => x.value == this.selectedVerietyDetail.variety_id);
            if (registerVariety) {
              const indentorData = registerVariety.indentor.find(y => y.indentor_id == element.user_id);

              if (indentorData) {
                const obj = {
                  name: element.user.name ? element.user.name : 'NA',
                  value: element.id,
                  allocated_quantity: element.allocated_quantity,
                  indent_quantity: element.indent_quantity,
                  productions: element.productions,
                  quantity_left_for_allocation: element.quantity_left_for_allocation
                }

                this.indentors.push(obj);
                variety.productionCenters.forEach(prod => {
                  indentorData.productions.forEach(ind_prod => {
                    if (prod.production_center_id == ind_prod.production_center_id) {
                      prod.quantityAllocated += ind_prod.qty
                    }
                  });
                });

              }

            }
          }

        })

        this.indentorLoad = true
        this.editVarietyData = true


        this.selectedVerietyDetail['indentors'] = variety.indentors
        this.selectedVerietyDetail['productionCenters'] = variety.productionCenters
        this.selectedVerietyDetail['totalIndentQuantity'] = variety.totalIndentQuantity;
        this.selectedVerietyDetail['totalAllocationQuantity'] = variety.totalAllocationQuantity;

        this.selectedVerietyDetail['productionCenters'] = this.selectedVerietyDetail.productionCenters.filter(item => item.quantityProduced > 0)


        if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
          this.productionPercentage = 100;
        } else {
          this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
        }


        this.submittedData = []
        this.submittedData.push(this.selectedVerietyDetail);


        this.dataToShow = this.submittedData;

        this.dataToShow.forEach(variety => {
          variety.indentors.forEach((indentor, i) => {

            const prods = indentor.productions.filter(x => x.quantity > 0)
            indentor.productions = prods
            indentor.productions.forEach((prod, j) => {
              if (prod && prod.quantity <= 0) {
                indentor.productions.splice(j)
              }
            })
          });
        });

        this.dataToDisplay = [];
        // this.dataToShow.forEach(el=>{}) 
        this.dataToDisplay = this.dataToShow;
        console.log(this.dataToDisplay, 'this.dataToDisplay1169')

        let productioncentersecond2 = apiresponse && apiresponse.productioncentersecond2 ? apiresponse.productioncentersecond2 : '';

        let productionData = productioncentersecond2 ? Object.values(productioncentersecond2) : ''
        let productionArr = []
        for (let item of productioncentersecond2) {
          let vals = item && item.allocation_to_spa_for_lifting_seed_production_cnters ? item.allocation_to_spa_for_lifting_seed_production_cnters : '';
          for (let val of vals) {


            productionArr.push({
              allocated_quantity: val && val.allocated_ ? val.allocated_ : '',
              quantity_left: val && val.quantity_l ? val.allocated_ : '',
              name: val && val.user && val.user.name ? val.user.name : '',
              User_idBspc: val && val.user && val.user.id ? val.user.id : '',
              value: val && val.user && val.user.id ? val.user.id : '',
              spacode: val && val.spa_code ? val.spa_code : '',
              quantity: val && val.qty ? val.qty : '',
              id: val && val.id ? val.id : '',
              allocation_id: val && val.allocation ? val.allocation : '',
              state_code: val && val.state_code ? val.state_code : '',

            })
          }
        }
        for (let value of productionArr) {
          for (let item of this.dataToDisplay) {
            for (let vals of item.indentors) {
              if (vals.spa_code == value.spacode && vals.state_code == value.state_code) {
                vals.productions.push(value)
                vals.Allocation_ids = value.allocation_id

              }

            }
          }
        }
        for (let val of this.dataToShow) {
          let sum = 0
          val.prods = []
          for (let data of val.indentors) {
            data.productions.forEach(element => {
              val.prods.push(element)
            });

            val.prodlength = val.prods.length

          }

        }


        const uniqueValues = {};

        this.selectedVerietyDetail.prods.forEach(obj => {
          if (!uniqueValues[obj.User_idBspc]) {
            uniqueValues[obj.User_idBspc] = { ...obj };
          } else {
            uniqueValues[obj.User_idBspc].quantity += obj.quantity;
          }
        });

        const uniqueArray = Object.values(uniqueValues);
        let newArr;
        newArr = uniqueArray;
        for (let data of newArr) {
          for (let item of this.selectedVerietyDetail.productionCenters
          ) {


            if (item.produ == data.User_idBspc) {
              item.quantityAllocated = data.quantity

            }
          }
        }
        for (let value of this.dataToDisplay) {
          for (let item of value.indentors) {
            for (let val of item.productions) {
              item.allocated_quantity = val.allocated_quantity
            }

          }
        }

        this.dataToDisplay.forEach(element => {
          element['indenter'] = element.indentors

        });


        console.log(this.dataToDisplay, '1261')
        for (let val of this.dataToShow) {
          let sum = 0;
          for (let value of val.indenter) {
            for (let data of value.productions) {
              value.totalProductionlength = value.productions.length
              val.totalIndentorlength = val.indenter.length
              if (val.totalIndentorlength > 1) {

                val.totalVarietyLength = value.productions.length + val.indenter.length
              } else {
                val.totalVarietyLength = value.productions.length
              }
              sum += value.productions.length;
              val.totalproductioIndentliength = sum

            }
          }
        }


      })
    }

  }


  onSelectIndentor(event: any) {
    if (this.editVarietyData) {
      this.editSelectedIndentor = []

      this.editSelectedIndentor = this.indentorsOne.find(x => x.value == event.value)
      let datas = this.selectedVerietyDetail && this.selectedVerietyDetail.productionCenters ? this.selectedVerietyDetail.productionCenters : '';

      this.selectedIndentor = this.editSelectedIndentor

      for (let data of this.dataToDisplay) {

        for (let val of data.indentors) {
          if (val && val.productions && val.productions.length > 0) {

            for (let value of val.productions) {
              if (this.selectedIndentor && this.selectedIndentor.productions && this.selectedIndentor.productions.length > 0) {

                for (let item of this.selectedIndentor.productions) {
                  if (val.id == this.selectedIndentor.value && value.User_idBspc == item.id) {
                    item.quantity = value.quantity
                  }

                }
              }
              else {
                for (let val of data.indentors) {
                  if (val && val.productions && val.productions.length > 0) {
                    if (this.selectedIndentor) {

                      if (val.id == this.selectedIndentor.value) {
                        this.selectedIndentor.productions = val.productions
                      }
                    } else {
                      this.editSelectedIndentor = this.editIndentors.find(x => x.value == event.value)
                      this.selectedIndentor = this.editSelectedIndentor
                    }

                  } else {
                    this.editSelectedIndentor = this.editIndentors.find(x => x.value == event.value)
                    this.selectedIndentor = this.editSelectedIndentor
                  }



                }
              }
            }
          }
        }
      }

      let sum = 0
      let diff = 0
      for (let data of this.selectedIndentor.productions) {
        sum += data.quantity
        this.selectedIndentor.allocated_quantity = sum
        this.selectedIndentor.quantity_left_for_allocation = (parseInt(this.selectedIndentor.indent_quantity) - parseInt(this.selectedIndentor.allocated_quantity))
      }


      this.selectedIndentorModel = event;

      this.inputForm.controls['quantityInputBox'].patchValue(0);
      this.inputForm.controls['quantityInputBox'].patchValue(0);

    } else {
      this.selectedIndentor = this.indentors.find(x => x.value == event.value)

      for (let item of this.selectedIndentor.productions) {
        item.quantity = 0;
      }

      this.selectedIndentorModel = event;

      this.inputForm.controls['quantityInputBox'].patchValue(0);
      this.inputForm.controls['quantityInputBox'].patchValue(0);
      this.editVarietyForm.controls['variety_id'].setValue(0);
    }

  }


  newQuantity(qty, prodCenter) {
    return { "qty": parseFloat(qty), "productionCenter": prodCenter }
  }

  onItemSelect(event: any) {
    this.selectedItem = event;

  }


  qtyChanged(e, production) {
    let value;

    if (e.target.value >= 0) {
      value = Number(e.target.value);
    } else {
      value = 0
    }

    production['quantity'] = value;

    let temp1 = 0;
    this.selectedIndentor['productions'].forEach(element => {
      temp1 += ((element.quantity && element.quantity > 0) ? element.quantity : 0);
    });

    this.selectedIndentor['allocated_quantity'] = temp1;
    this.selectedIndentor['quantity_left_for_allocation'] = this.getQuantityOfSeedProduced(this.selectedIndentor.indent_quantity - temp1);

  }

  submitData(indenter?: any) {

    const restQuantity = this.getPercentage(indenter.indent_quantity);

    if (indenter.allocated_quantity > restQuantity) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity Should be Proportional to Total Indent Quantity.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return
    }

    let isAllValueZero = true;

    indenter.productions.forEach(data => {
      if (data.quantity > 0) {
        isAllValueZero = false
      }
    });

    if (isAllValueZero) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity Should Not be 0.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })
      return;
    }

    let checkValid = true;

    this.selectedVerietyDetail.productionCenters.forEach(element => {
      if (this.selectedVarietyFrom == 0) {
        let quantityAllocated = element.quantityAllocated;

        indenter.productions.forEach(prod => {
          if (element.produ == prod.value) {
            quantityAllocated += prod.quantity;
            if (quantityAllocated > element.qty) {
              Swal.fire({
                icon: 'error',
                title: 'Allocation For ' + prod.name + ' Has Already Been Completed',
                showConfirmButton: false,
                timer: 1500
              })

              checkValid = false;
              return;
            }
          }
        });

      } else {
        let quantityAllocated = 0;

        this.selectedVerietyDetail.indentors.forEach(indenter => {
          indenter.productions.forEach(data => {
            if (element.produ == data.value) {
              const tempData = data.quantity;
              quantityAllocated += tempData;

              if (element.qty < quantityAllocated) {
                Swal.fire({
                  icon: 'error',
                  title: 'Allocation For ' + data.name + ' Has Already Been Completed',
                  showConfirmButton: false,
                  timer: 1500
                })

                checkValid = false;
                return;
              }

            }
          });
        })
      }

    });


    if (checkValid) {
      this.selectedVerietyDetail.productionCenters.forEach(element => {
        element.quantityAllocated = 0
        this.selectedVerietyDetail.indentors.forEach(indenter => {
          indenter.productions.forEach(data => {
            if (element.production_center_id == data.value) {
              const tempData = data.quantity;
              if (element.quantityProduced < (element.quantityAllocated + tempData)) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Allocation For BSPC Name Has Already Been Completed.</p>',
                  icon: 'error',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#E97E15'
                })

                checkValid = false;
                return;

              }
              console.log(data, 'dataaa')
              // element.quantityAllocated=0;
              element.quantityAllocated += data.quantity;

            }
          });
        })

      });

    }

 console.log(this.selectedVerietyDetail,'this.selectedVerietyDetailthis.selectedVerietyDetailthis.selectedVerietyDetail')
 console.log(this.varietyForm.controls['variety_line'].value,'variety_line')
 let varietyLine = this.varietyForm.controls['variety_line'].value && this.varietyForm.controls['variety_line'].value[0] &&
 this.varietyForm.controls['variety_line'].value[0].variety_line_code ? this.varietyForm.controls['variety_line'].value[0].variety_line_code:''
    if (checkValid) {
      let varietysdata =this.selectedVerietyDetail && this.selectedVerietyDetail.veriety_id && this.selectedVerietyDetail.veriety_id[0] && this.selectedVerietyDetail.veriety_id[0].value ? this.selectedVerietyDetail.veriety_id[0].value: this.selectedVerietyDetail.veriety_id;
      const varietys = {
        year: this.IstPartFormGroupControls["yearofIndent"].value.value,
        season: this.IstPartFormGroupControls["season"].value.value,
        crop_code: this.IstPartFormGroupControls["cropName"].value.value,
        variety_id: this.editVarietyData ? varietysdata : varietysdata,
        totalIndentQuantity: this.selectedVerietyDetail.totalIndentQuantity,
        totalAllocationQuantity: this.selectedVerietyDetail.totalAllocationQuantity,
        variety_line_code:varietyLine ? varietyLine:'',
        indenter: [{
          name: indenter.name,
          allocation_ids: indenter.productions[0].allocation_id,

          allocated_quantity: indenter.allocated_quantity,
          indent_quantity: indenter.indent_quantity,
          productions: indenter.productions,
          spa_code: indenter.spa_code,
          state_code: indenter.state_code,
          quantity_left_for_allocation: indenter.quantity_left_for_allocation,
          value: indenter.value
        }]
      }
      let card = []
      card.push(varietys)
      let object = {
        formData: card
      }
      this.submittedData.forEach(element => {
        let varietysdata =this.selectedVerietyDetail && this.selectedVerietyDetail.veriety_id && this.selectedVerietyDetail.veriety_id[0] && this.selectedVerietyDetail.veriety_id[0].value ? this.selectedVerietyDetail.veriety_id[0].value: this.selectedVerietyDetail.veriety_id;
        if (element.variety_id == this.editVarietyData ? varietysdata : varietysdata) {
          this.editSelectedVariety = element
          this.editSelectedVarietys = element
        }
      });

      let varietysdata2 =this.selectedVerietyDetail && this.selectedVerietyDetail.veriety_id && this.selectedVerietyDetail.veriety_id[0] && this.selectedVerietyDetail.veriety_id[0].value ? this.selectedVerietyDetail.veriety_id[0].value: this.selectedVerietyDetail.veriety_id
      const variety = {
        variety_id: this.editVarietyData ? varietysdata2 : varietysdata2,
        totalIndentQuantity: this.selectedVerietyDetail.totalIndentQuantity,
        totalAllocationQuantity: this.selectedVerietyDetail.totalAllocationQuantity,
        productionCenters: this.selectedVerietyDetail.productionCenters,
        indenter: []
      }
      console.log(object,'this.selectedVerietyDetail.variety_id')
      this.breederService.postRequestCreator("allocation-to-spa", null, object).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Has Been Successfully Submitted.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })


          if (this.selectedVarietyFrom == 1) {
            this.onSelectEditVariety({
              value: variety.variety_id
            })
          } else {
            this.dataToShow.forEach(element => {
              if (element.variety_id == variety.variety_id) {
                const indentorIndex = element.indenter.findIndex(x => x.id == indenter.value);
                if (indentorIndex > -1) {
                  element.indenter[indentorIndex].productions = JSON.parse(JSON.stringify(indenter.productions));
                }
              }
            });

            this.dataToShow.forEach(variety => {
              variety.indenter.forEach((indentor, i) => {
                const prods = indentor.productions.filter(x => x.quantity > 0)
                indentor.productions = prods

              });

              variety.indenter.forEach(inden => {
                inden.allocated_quantity = 0;
                inden.productions.forEach(prod => {
                  inden.allocated_quantity += prod.quantity
                });

                inden.quantity_left_for_allocation = inden.indent_quantity - inden.allocated_quantity;
              });
              this.selectedVerietyDetail.productionCenters.forEach(prod => {
                // prod.quantityAllocated = 0;
                variety.indenter.forEach(inden => {
                  inden.productions.forEach(prod2 => {
                    prod2.variety_id = prod.variety_id;
                  });
                });
              })
              // console.log(this.selectedVerietyDetail.productionCenters,'this.selectedVerietyDetail.productionCenters')
              this.selectedVerietyDetail.productionCenters.forEach(prod => {

                console.log(prod, 'prod')
                prod.quantityAllocated = 0;
                variety.indenter.forEach(inden => {
                  console.log(inden, 'inden')
                  inden.productions.forEach(prod2 => {
                    console.log(prod2, 'prod2')
                    if (prod.variety_id == prod2.variety_id && prod.production_center_id == prod2.id) {
                      prod.quantityAllocated += prod2.quantity
                    }
                  });
                });
              })

            });

            if (!this.editVarietyData) {

              for (let val of this.dataToShow) {
                let sum = 0;
                for (let value of val.indenter) {
                  value['name'] = value.name;
                  for (let data of value.productions) {

                    value.totalProductionlength = value.productions.length
                    val.totalIndentorlength = val.indenter.length
                    if (val.totalIndentorlength > 1) {

                      val.totalVarietyLength = value.productions.length + val.indenter.length
                    } else {
                      val.totalVarietyLength = value.productions.length
                    }
                    sum += value.productions.length;
                    val.totalproductioIndentliength = sum

                  }
                }

              }
            } else {
              for (let val of this.dataToShow) {
                let sum = 0;
                for (let value of val.indentors) {
                  value['name'] = value.name;
                  for (let data of value.productions) {

                    value.totalProductionlength = value.productions.length
                    val.totalIndentorlength = val.indentors.length
                    if (val.totalIndentorlength > 1) {

                      val.totalVarietyLength = value.productions.length + val.indentors.length
                    } else {
                      val.totalVarietyLength = value.productions.length
                    }
                    sum += value.productions.length;
                    val.totalproductioIndentliength = sum

                  }
                }

              }
            }

            this.dataToDisplay = [];

            this.dataToDisplay = this.dataToShow;
            console.log(this.dataToDisplay, '1164')

            this.selectedIndentor = undefined;
            this.tempForm.patchValue([]);
            this.inputForm.reset();

            const temps = JSON.parse(JSON.stringify(this.indentors));

            this.indentors = [];
            this.indentorsOne = [];

            temps.forEach(element => {
              if (element && element.value != indenter.value) {
                this.indentors.push(element)
                this.indentorsOne.push(element);
              }
            });

            const index = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);

            if (index > -1) {
              const newIndex = this.submittedData[index].indenter.findIndex(y => y.value == indenter.value)
              if (newIndex > -1) {
                this.submittedData[index].indenter.splice(newIndex, 1);
              }
            }

            const temp = {
              name: indenter.name,
              allocated_quantity: indenter.allocated_quantity,
              indent_quantity: indenter.indent_quantity,
              productions: [],
              quantity_left_for_allocation: indenter.quantity_left_for_allocation,
              value: indenter.value,
              spa_code: indenter.spa_code,
              state_code: indenter.state_code
            }

            indenter.productions.forEach(x => {
              const temp2 = {
                id: x.id,
                name: x.name,
                quantity: x.quantity,
                value: x.value
              }

              temp.productions.push(temp2)
            });

            if (index > -1) {
              this.submittedData[index].indenter.push(temp);

            } else {
              variety.indenter.push(temp)
              this.submittedData.push(variety)
            }

            const indenterIndex = this.indentors.findIndex(x => x.value == indenter.value)

            if (indenterIndex > -1) {
              this.indentors.splice(indenterIndex, 1);
              this.selectedIndentor = undefined;
              this.tempForm.reset();
            }

            this.indentors = []

            this.selectedVerietyDetail['indentors'].forEach(element => {
              const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);


              if (varietyIndex > -1) {
                const indenterIndex = this.submittedData[varietyIndex].indenter.findIndex(y => y.value == element.id);

                if (indenterIndex == -1) {
                  const obj = {
                    name: element.user.name ? element.user.name : 'NA',
                    value: element.id,
                    allocated_quantity: element.allocated_quantity,
                    indent_quantity: element.indent_quantity,
                    productions: element.productions,
                    quantity_left_for_allocation: element.quantity_left_for_allocation,
                    spa_code: element.spa_code,
                    state_code: element.state_code
                  }

                  this.indentors.push(obj);
                  this.indentorsOne.push(obj)
                }

              }
            })

            if (this.indentors.length == 0) {
              this.varietyDropdownData = []

              const tempIndex = this.tempVerietyListDetails.findIndex(x => x.value == this.selectedVerietyDetail.veriety_id)

              if (tempIndex > -1) {
                this.tempVerietyListDetails.splice(tempIndex, 1)
              }

              this.verietyListDetails.varieties.forEach(element => {
                const varietIndex = this.submittedData.findIndex(x => x.variety_id == element.m_crop_variety.id);
                if (varietIndex == -1) {
                  let temp = {
                    name: element.m_crop_variety.variety_name,
                    value: element.m_crop_variety.id
                  }

                  this.varietyForm.reset();
                  this.varietyDropdownData.push(temp);
                }

              });

            }

            this.dataToShow = this.submittedData;
            this.dataToShowSecond = this.submittedData;


            for (let val of this.dataToShow) {
              let sum = 0;
              let calculateAllocatyQty = 0;
              for (let value of val.indenter)

                for (let data of value.productions) {
                  value.productions = value.productions.filter(item => item.quantity > 0)

                  calculateAllocatyQty += value.allocated_quantity
                  val.calculateAllocatyQty = calculateAllocatyQty
                  value.totalProductionlength = value.productions.length
                  val.totalIndentorlength = val.indenter.length
                  if (val.totalIndentorlength > 1) {

                    val.totalVarietyLength = value.productions.length + val.indenter.length
                  } else {
                    val.totalVarietyLength = value.productions.length
                  }
                  sum += value.productions.length;
                  val.totalproductioIndentliength = sum

                }
            }
            this.dataToDisplay = this.dataToShow
            console.log(this.dataToDisplay, '1810')


            this.dataToDisplay = [];

            const newTemp = this.submittedData.find(x => x.variety_id == this.selectedVerietyDetail.veriety_id);


            const copiedPerson = JSON.parse(JSON.stringify(newTemp));

            copiedPerson['indenter'].forEach(inden => {
              inden.productions.forEach((prod, i) => {
                if (prod.quantity <= 0) {
                  inden.productions.splice(i, 1);
                }
              });
            });


            copiedPerson.totalproductioIndentliength = 0;
            copiedPerson.totalVarietyLength = 0;
            copiedPerson.totalIndentorlength = 0

            this.dataToDisplay.push(copiedPerson);
            console.log(this.dataToDisplay, '1834')

            for (let val of this.dataToShow) {
              let sum = 0
              val.prods = []
              for (let data of val.indenter) {
                data.productions.forEach(element => {
                  val.prods.push(element)
                });

                val.prodlength = val.prods.length

              }

            }
            const uniqueValues = {};
            this.dataToShow[0].prods.forEach(obj => {
              if (!uniqueValues[obj.value]) {
                uniqueValues[obj.value] = { ...obj };
              } else {
                uniqueValues[obj.value].quantity += obj.quantity;
              }
            });

            const uniqueArray = Object.values(uniqueValues);
            this.uniqueArray = uniqueArray
            for (let item of this.uniqueArray) {
              for (let data of this.selectedVerietyDetail.productionCenters) {
                if (data.produ == item.value) {
                  data.quantityAllocated = item.quantity

                }

              }

            }

            // if (this.indentors.length == 0) {
            //   this.selectedVerietyDetail = null
            // }

            this.inputForm.controls['quantityInputBox'].setValue(0);
            indenter.productions.map(el => {
              el.quantity = 0;
              return el;
            });

          }

          for (let val of this.dataToShow) {
            let sum = 0;
            for (let value of val.indenter) {
              for (let data of value.productions) {
                value.totalProductionlength = value.productions.length
                val.totalIndentorlength = val.indenter.length
                if (val.totalIndentorlength > 1) {

                  val.totalVarietyLength = value.productions.length + val.indenter.length
                } else {
                  val.totalVarietyLength = value.productions.length
                }
                sum += value.productions.length;
                val.totalproductioIndentliength = sum

              }
            }
          }
          console.log(this.dataToDisplay, '1901')
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: data.EncryptedResponse.message,
          })

        }

        return
      }, (error: any) => {
        return
      })

      return
    } else {
      return
    }

  }

  getVarietyName(id: any) {
    let variety_name;

    this.verietyListDetails.varieties.forEach(x => {
      if (x && x.variety_id == id) {
        variety_name = x;
      }
    });

    if (variety_name && variety_name.m_crop_variety && variety_name.m_crop_variety.variety_name) {
      return variety_name.m_crop_variety.variety_name
    }

    return 'NA'


  }


  getFilledVarietyData(variety) {
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;

    this.submittedData = [];

    variety.forEach((varietyElement: any) => {
      this.editVariety = varietyElement;

      this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyElement.variety_id).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
          const variety = data.EncryptedResponse.data;

          const producionCentersList = []

          variety.productionCenters.forEach(element => {
            let temp = {
              name: element.user.name,
              value: element.produ,
              id: element.produ,
              quantity: 0,

            }
            producionCentersList.push(temp);
          })

          const object = {
            id: varietyElement.id,
            variety_id: varietyElement.variety_id,
            totalIndentQuantity: Number(varietyElement.totalIndentQuantity),
            totalAllocationQuantity: Number(varietyElement.productionQuantity),
            indenter: [],
            productionss: [],
            productionCenters: variety.productionCenters
          }

          const indentors = [];
          const prods = [];

          variety.indentors.forEach(element => {
            element.quantity_left_for_allocation = element.indent_quantity - element.allocated_quantity
            element['productions'] = producionCentersList;

            const obj = {
              name: element.user.name ? element.user.name : 'NA',
              value: element.id,
              allocated_quantity: element.allocated_quantity,
              indent_quantity: element.indent_quantity,
              productions: producionCentersList,
              quantity_left_for_allocation: element.quantity_left_for_allocation,
              spa_code: element.spa_code,
              state_code: element.state_code,
              user_id: element.user_id
            }

            indentors.push(obj);

          })

          const tempIndentors = []

          indentors.forEach((indentor, i) => {
            const tempIndentor = {
              name: indentor.name,
              value: indentor.value,
              indent_quantity: indentor.indent_quantity,
              allocated_quantity: indentor.allocated_quantity,
              quantity_left_for_allocation: indentor.quantity_left_for_allocation,
              spa_code: indentor.spa_code,
              state_code: indentor.state_code,
              user_id: indentor.user_id,
              productions: []
            }
            indentor.productions.forEach((producion, j) => {
              const temp = {
                id: producion.id,
                name: producion.name,
                quantity: producion.quantity,
                value: producion.value
              }

              varietyElement.indentor.forEach(editIndentor => {
                editIndentor.productions.forEach(editProducion => {
                  if (indentor.spa_code == editIndentor.spa_code) {
                    if (producion.id == editProducion.production_center_id) {
                      temp.quantity = editProducion.qty;
                      producion = temp
                    }
                  }
                });
              });

              tempIndentor.productions.push(temp)

            });

            tempIndentors.push(tempIndentor)
          });

          object.indenter = tempIndentors;


          object.indenter.forEach(element => {
            element.productions.forEach(prod => {
              element.allocated_quantity += prod.quantity
            });
          });

          this.submittedData.push(object)

          this.submittedData.forEach(element => {
            element.indenter.forEach(ind => {
              ind.quantity_left_for_allocation = ind.indent_quantity - ind.allocated_quantity;
            });
          });

          this.dataToShow = this.submittedData;

          this.dataToShow = this.dataToShow.sort((a, b) => (a.id < b.id ? -1 : 1));

          this.dataToDisplay = [];

          if (this.isCropSubmitted) {
            this.dataToDisplay = this.dataToShow;

            this.totalData = {
              name: 'Grand Total',
              indent_quantity: 0,
              allocated_quantity: 0,
              left_quantity: 0
            }

            this.dataToShow.forEach(variety => {
              variety.indenter.forEach(indentor => {
                this.totalData.indent_quantity += indentor.indent_quantity;
                this.totalData.allocated_quantity += indentor.allocated_quantity;

              });
            });
            this.totalData.indent_quantity = (this.totalData.indent_quantity / 2)
            this.totalData.left_quantity = (this.totalData.indent_quantity - this.totalData.allocated_quantity)
          }

          this.editVarietyData = true;
          for (let data of this.dataToDisplay) {
            data.indentors = data.indenter
            for (let item of data.indentors) {

              item.productions = item.productions.filter(item => item.quantity > 0)
              if (item && item.productions && item.productions.length > 0) {

              }

            }
          }

          const result = this.sumDuplicatesWithMultipleConditions(this.dataToDisplay)

          this.editVarietyDropdown = [];
          this.submittedData.forEach(element => {

            const index = this.editVarietyDropdown.findIndex(x => x.value == element.variety_id);
            if (index == -1) {
              const object = {
                name: this.getVarietyName(element.variety_id),
                value: element.variety_id
              }

              this.editVarietyDropdown.push(object)
            }

          });

          const statusMap = {};

          for (const record of this.dataToDisplay) {
            statusMap[record.variety_id] = record;
          }

          let values1 = Object.values(statusMap);
          let valuestwo = [];
          valuestwo = values1
          // this.dataToDisplay= values1
          for (let data of valuestwo) {
            for (let item of this.dataToDisplay) {
              if (item.variety_id == data.variety_id) {
                item.prodlength = data.prodlength

              }
            }
          }

          if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
            this.productionPercentage = 100;
          } else {
            this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
          }

          for (let val of this.dataToDisplay) {
            let sum = 0;
            for (let value of val.indenter) {
              for (let data of value.productions) {
                value.totalProductionlength = value.productions.length
                val.totalIndentorlength = val.indenter.length
                if (val.totalIndentorlength > 1) {

                  val.totalVarietyLength = value.productions.length + val.indenter.length
                } else {
                  val.totalVarietyLength = value.productions.length
                }
                sum += value.productions.length;
                val.totalproductioIndentliength = sum

              }
            }
          }



          let items = [];
          for (let data of this.dataToDisplay) {
            for (let item of data.indentors) {
              for (let val of item.productions) {
                items.push({
                  'variety_id': data.variety_id,
                  'spa_code': item.spa_code,
                  'state_code': item.state_code,
                  'user_id': item.user_id,
                  ...val
                })
                // val.variety_id = data && data.variety_id ? data.variety_id :''
              }
            }
          }

          const uniqueIndentorDataMap = []
          let uniqueJsonArrays;

          if (items && items.length > 0) {

            for (const item of items) {
              let keys = ['variety_id', 'id']
              const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

              if (!uniqueIndentorDataMap[key]) {
                uniqueIndentorDataMap[key] = { ...item }; // Copy the object
              } else {
                uniqueIndentorDataMap[key].quantity += item.quantity; // Calculate the sum based on the "value" property
              }
            }
            uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
          }

          for (let data of this.dataToDisplay) {
            let sum = 0;
            for (let value of data.indentors) {
              sum += value.productions.length;
              data.totalVarietyLength = sum

            }
          }


        }
      })
    });


  }


  onEditIndentor(event) {
    this.editSelectedIndentor = this.editIndentors.find(x => x.value == event.value)
    let datas = this.selectedVerietyDetail && this.selectedVerietyDetail.productionCenters ? this.selectedVerietyDetail.productionCenters : '';

    const finalArr = this.selectedIndentor.productions.filter(({ id, name }) =>
      datas.some(exclude => exclude.user.name === name)
    );
    this.selectedIndentor['productions'] = finalArr;

  }

  editQtyChanged(e, production, productionIndex) {
    let value;

    if (e.target.value >= 0) {
      value = Number(e.target.value);
    } else {
      value = 0
    }
    this.cancelProduction = production

    production['quantity'] = value;

    let temp1 = 0;
    this.editSelectedIndentor['productions'].forEach(element => {
      temp1 += element.quantity;
    });

    this.editSelectedIndentor['allocated_quantity'] = temp1;
    this.editSelectedIndentor['quantity_left_for_allocation'] = this.getQuantityOfSeedProduced(this.editSelectedIndentor.indent_quantity - temp1);
  }

  updateVarietyData(indenter?: any) {
    const restQuantity = this.getPercentage(indenter.indent_quantity);

    if (indenter.allocated_quantity > restQuantity) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocated Quantity Should be Proportional to Total Indent Quantity.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      indenter['productions'].forEach(element => {
        element.quantity = 0;
      });

      indenter.allocated_quantity = 0;
      indenter.quantity_left_for_allocation = indenter.indent_quantity

      return
    } else {
      var invalid = false;

      this.editSelectedVariety.productionCenters.forEach(prod => {
        prod.quantityAllocated = 0
        this.editSelectedVariety.indenter.forEach(inden => {
          inden.productions.forEach(element => {
            if (prod.production_center_id == element.id) {

              prod.quantityAllocated += element.quantity

              if (prod.quantityAllocated > prod.quantityProduced) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Quantity Allocated Should Not be More Than Quantity Produced.</p>',
                  icon: 'error',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#E97E15'
                })
                prod.quantityAllocated -= element.quantity
                invalid = true;
                return

              }
            }
          });
        })
      })

      this.dataToDisplay = [];
      const copiedPerson = JSON.parse(JSON.stringify(this.editSelectedVariety));
      console.log(this.dataToDisplay, '2264')
      copiedPerson['indenter'].forEach(inden => {
        inden.productions.forEach((prod, i) => {
          if (prod.quantity <= 0) {
            inden.productions.splice(i, 1);
          }
        });
      });


      copiedPerson.totalproductioIndentliength = 0;
      copiedPerson.totalVarietyLength = 0;
      copiedPerson.totalIndentorlength = 0

      this.dataToDisplay.push(copiedPerson);
      console.log(this.dataToDisplay, '2279')
      for (let val of this.dataToDisplay) {
        let sum = 0;
        for (let value of val.indenter)
          for (let data of value.productions) {
            value.totalProductionlength = value.productions.length
            val.totalIndentorlength = val.indenter.length
            if (val.totalIndentorlength > 1) {

              val.totalVarietyLength = value.productions.length + val.indenter.length
            } else {
              val.totalVarietyLength = value.productions.length
            }
            sum += value.productions.length;
            val.totalproductioIndentliength = sum

          }
      }

    }

    if (!invalid) {
      this.editSelectedIndentor = null;
      this.editTempForm.reset()
    }
  }

  cancelVarietyData(indenter?: any) {
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let object = {
      formData: {
        year: year.value,
        season: season.value,
        crop_code: cropName.value,
      }
    }
    this.breederService.postRequestCreator("allocation/getVarietyDataForEdit", null, object).subscribe((data: any) => {
      this.getFilledVarietyData(data.EncryptedResponse.data,);

      this.dataToDisplay = []
      this.editVarietyForm.controls['variety_id'].setValue('')
      this.inputForm.controls['quantityInputBox'].setValue('')
      this.editSelectedVariety = false
    })

  }
  getQuantity(indenter) {
    if (indenter['productions'] != undefined) {
      indenter['allocated_quantity'] = parseFloat(indenter.productions.reduce((acc, val) => acc += val.qty, 0)).toFixed(2)
      return indenter['allocated_quantity']
    } else {
      indenter['allocated_quantity'] = 0
      return indenter['allocated_quantity'];
    }
  }

  getLeftQuantity(indenter) {
    if (indenter['productions'] != undefined) {

      indenter['quantity_left_for_allocation'] = (((parseFloat(indenter.indent_quantity)) - (indenter.productions.reduce((acc, val) => acc += val.qty, 0)))).toFixed(2)
      return indenter['quantity_left_for_allocation'] < 0 ? 0 : indenter['quantity_left_for_allocation'];
    } else {
      indenter['quantity_left_for_allocation'] = (parseFloat(indenter.indent_quantity)).toFixed(2)
      return indenter['quantity_left_for_allocation'];
    }
  }



  isNumberKey(evt) {
    var input = <HTMLInputElement>evt.srcElement;

    let value = input.value;

    if ((value.indexOf('.') != -1) && (value.substring(value.indexOf('.')).length > 3)) {
      evt.preventDefault();
    }

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    }

  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
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
    this.fieldsList[1].fieldDataList = this.cropName
  }

  createProductonCenter(element) {
    let yrs = []
    element.productionCenter.forEach((x: any, index: number) => {
      yrs.push({ name: x.user.agency_detail.agency_name, value: x.user.agency_detail.agency_name, id: x.production_center_id })
    })

    this.productionCenter = yrs;
    return yrs;
  }

  getQuantityMeasure(crop_code) {
    this.quantity = crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
    return crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);

      if (this.isEdit && (x.formControlName == "season" || x.formControlName == "yearofIndent" || x.formControlName == "cropName")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createFormControlsOfAGroupUI(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>, element) {
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "season" || x.formControlName == "yearofIndent" || x.formControlName == "cropName")) {
        newFormControl.disable();
      }
      if (x.formControlName == "productionCenter") {
        x.fieldDataList = this.productionCenter
      }
      if (["indentingQuantity", "actualProduction", "quantityOfBreederSeedAllocated", "addQuantityOfBreederSeedletf", "quantity_of_breeder_seed_lifted", "quantity_of_breeder_seed_balance"].includes(x.formControlName)) {
        let name = x.fieldName.split("(")[0]
        x.fieldName = name + " (" + this.getQuantityMeasure(crop_code) + ")"
      }
      formGroup.addControl(x.formControlName, newFormControl);
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

  patchForm(data: any) {
    this.IstPartFormGroupControls["yearofIndent"].patchValue(data.year);
    this.IstPartFormGroupControls["cropName"].patchValue(data.crop);
  }


  submitForm(formData) {

    const year = formData.IstPartFormGroup.yearofIndent.value;
    const season = formData.IstPartFormGroup.season.value;
    const crop_code = formData.IstPartFormGroup.cropName.value;

    if (year && season && crop_code && this.submittedData && this.submittedData.length > 0) {

      let object = {
        formData: {
          year: year,
          season: season,
          crop_code: crop_code,
          selectedVariety: this.selectedVerietyDetail && this.selectedVerietyDetail.veriety_id ? this.selectedVerietyDetail.veriety_id : this.selectedVerietyDetail && this.selectedVerietyDetail.variety_id ? this.selectedVerietyDetail.variety_id : ''
        }
      }

      if (!this.selectedVerietyDetail) {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: "Please select a variety",
        })
        return
      }

      this.breederService.postRequestCreator("allocation/varietyWiseSubmissionIndentor", null, object).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          Swal.fire({
            title: '<p style="font-size:25px;">Data Has Been Successfully Submitted.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })

          this.varietyDropdownDatasecond = []
          this.selectedVerietyDetail = null

          this.getCropVerieties();
          this.varietyForm.reset();
          this.editVarietyForm.reset();

          if (this.varietyDropdownData.length == 0) {
            this.cropButtonEnable = true;
          }

          if (this.selectedVarietyFrom !== 1) {
            this.submittedData = []
            this.dataToShow = []
            this.dataToDisplay = []
          }

        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            text: data.EncryptedResponse.data.message ?? "Something went wrong",
          })
        }
      })

    } else {
      Swal.fire('Error', 'Please Fill all the Details.', 'error');
    }

  }


  create(params) {
    let object = {
      formData: params
    }
    this.breederService.postRequestCreator("allocation-to-spa", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Submit.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })

        this.submittedData = []
        this.dataToShow = []
        this.dataToDisplay = []

        if (this.tempVerietyListDetails.length == 0) {
          this.cropButtonEnable = true;
        }
      }
      else if (data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.message) {
        Swal.fire({
          icon: 'info',
          title: 'Already Exist',
          text: 'BSP Form Has Already Been Filled For This Variety.',
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
    let object = {
      formData: params
    }
    this.breederService.postRequestCreator("allocation-to-spa/edit", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          icon: 'success',
          title: 'Data Has Been Successfully Updated.',
          showConfirmButton: false,
          timer: 1000
        })
        this.router.navigate(['seed-division/breeder-seed-allocation-lifting']);
      } else {
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


  cropWiseSubmission() {
    const year = this.formSuperGroup.value.IstPartFormGroup.yearofIndent.value;
    const season = this.formSuperGroup.value.IstPartFormGroup.season.value;
    const crop_code = this.formSuperGroup.value.IstPartFormGroup.cropName.value;

    Swal.fire({
      title: 'Are You Sure To Submit Crop Wise Allocation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.breederService.postRequestCreator("allocation/cropWiseSubmissionIndentor?year=" + year + "&season=" + season + "&cropCode=" + crop_code).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Crop Wise Data Submitted',
              showConfirmButton: false,
              timer: 1500
            })

            this.isCropSubmitted = true

            this.selectedVerietyDetail = null;
            this.indentors = null;
            this.selectedIndentor = null;
            this.submittedData = []
            this.dataToShow = []
            this.dataToDisplay = []
            this.varietyDropdownData = []
            this.editVarietyDropdown = []

          } else if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 201) {
            Swal.fire({
              icon: 'info',
              title: 'Crop Wise Data Already Submitted',
              showConfirmButton: false,
              timer: 1500
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops',
              text: data.EncryptedResponse.message,
            })
          }
        })
      }
    })


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
    let indentor = this.IstPartFormGroupControls["indentorName"].value
    let indentForm = indentor.details[0][0].formGroup
    if (indentForm.invalid) {
      Swal.fire('Error', 'Please Fill Out all Required Fields.', 'error');
      return;
    }
    let indentorDetails = indentForm.controls
    params.push({
      "breeder_seed_quantity_left": indentorDetails['addQuantityOfBreederSeedletf'].value,
      "crop_code": crop_code,
      "is_active": 1,
      "production_center_id": indentorDetails['productionCenter'].value.id,
      "quantity": indentorDetails['quantityOfBreederSeedAllocated'].value,
      "user_id": this.currentUser.id,
      "variety_id": newValue['cropVarieties'].value.id,
      "year": year,
      "isdraft": 1,
      "indent_of_breeder_id": indentor.id,
      "id": this.submissionId
    })
    console.log(newValue)
    this.isEdit ? this.update(params[0]) : this.create(params)
  }

  activateVarietyIndexInAccordion(varietyIndexInAccordion: number) {
    if (this.activeVarietyIndexInAccordion == varietyIndexInAccordion) {
      this.activeVarietyIndexInAccordion = -1;
    }
    else {
      this.activeVarietyIndexInAccordion = varietyIndexInAccordion;
    }
  }


  getQuantityOfSeedProduced(data?: any) {
    if (data) {
      let value = data.toString();

      if (value.indexOf(".") == -1) {
        return data;

      } else {
        return data ? Number(data).toFixed(2) : 0;

      }
    } else {
      return 0
    }

  }

  getPercentage(data?: any) {
    let val = (this.productionPercentage * data) / 100;

    let value = val.toString();

    if (value.indexOf(".") == -1) {
      return val;

    } else {
      return val ? Number(val).toFixed(2) : 0;

    }
  }
  sumDuplicatesWithMultipleConditions(data) {
    const groupedData = data.reduce((acc, obj) => {

      const existingObj = acc.find(item => item.variety_id === obj.variety_id && item.value === obj.value);
      if (existingObj) {
        existingObj.value += obj.value;
      } else {
        acc.push({ ...obj });
      }
      return acc;
    }, []);

    return groupedData;
  }
  mergeNestedArraysById(array, idKey) {
    const mergedMap = new Map();

    // Iterate through the array and merge items based on the identifier
    for (const item of array) {
      const id = item[idKey];
      if (!mergedMap.has(id)) {
        // If ID is not in the mergedMap, add it with the item
        mergedMap.set(id, { ...item });
      } else {
        // If ID exists, merge the item properties
        const mergedItem = mergedMap.get(id);
        mergedMap.set(id, { ...mergedItem, ...item });
      }
    }

    return Array.from(mergedMap.values());
  }
  getVarietyLine() {
    console.log(this.varietyForm.controls['variety_id'].value)
    let data = this.varietyForm.controls['variety_id'].value;
    let varietyData = []
    if (data && data.length > 0) {
      data.forEach(el => {
        varietyData.push(el && el.value ? el.value : '')
      })
    }
    const object = {
      search: {
        year: this.IstPartFormGroupControls["yearofIndent"].value.value,
        season: this.IstPartFormGroupControls["season"].value.value,
        crop_code: this.IstPartFormGroupControls["cropName"].value.value,
        variety: varietyData
      }
    }
    this.breederService.postRequestCreator("allocation-to-spa-line", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        // console.log('data===========>',data)
        this.varietLineData = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        this.gridData()
      }

    })
  }
  gridData(){
    console.log( this.varietLineData,' this.varietLineData')
    let datas = this.varietyForm.controls['variety_line'].value;
    let varietyLine = []
    if (datas && datas.length > 0) {
      datas.forEach(el => {
        varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
      })
    }
    // getGridData(){
 if(this.varietLineData && this.varietLineData.length<1){
   
    this.dataToDisplay = [];
    this.selectedIndentor = [];
    this.selectedVerietyDetailbtn = true;
    this.indentorsOne = []; // Added by Yogesh

    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let data = this.varietyForm.controls['variety_id'].value;
    let varietyData = []
    if (data && data.length > 0) {
      data.forEach(el => {
        varietyData.push(el && el.value ? el.value : '')
      })
    }
 
    this.selectedVerietyDetail = {}

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['veriety_id'] =this.varietyForm.controls['variety_id'].value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;

    this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyData[0] ).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

        const variety = data.EncryptedResponse.data;
        this.producionCentersList = []
        data.EncryptedResponse.data.productionCenters.forEach(element => {
          let temp = { name: element.user.name, value: element.produ, id: element.id, quantity: 0 }
          this.producionCentersList.push(temp);
        })
        data.EncryptedResponse.data.indentors.forEach(element => {
          element['productionsList'] = this.producionCentersList
          element['production_center_list'] = this.producionCentersList
          this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList, quantity: 0 })
          element['productions'] = []
        })

        this.indentors = [];

        variety.indentors.forEach(element => {
          element['quantity_left_for_allocation'] = element.indent_quantity - element.allocated_quantity
          element['productions'] = this.producionCentersList;

          if (this.submittedData && this.submittedData.length > 0) {
            const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);
            if (varietyIndex == -1) {

              const obj = {
                name: element.user.name ? element.user.name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation,
                spa_code: element.spa_code,
                state_code: element.state_code
              }

              this.indentors.push(obj);
            }
          } else {
            const obj = {
              name: element.user.name ? element.user.name : 'NA',
              value: element.id,
              allocated_quantity: element.allocated_quantity,
              indent_quantity: element.indent_quantity,
              productions: element.productions,
              quantity_left_for_allocation: element.quantity_left_for_allocation,
              spa_code: element.spa_code,
              state_code: element.state_code
            }

            this.indentors.push(obj);

          }

        })
        this.indentorLoad = true
        // this.selectedVariety['quantityProduced']=
        this.selectedVerietyDetail['indentors'] = data.EncryptedResponse.data.indentors;
        this.selectedVerietyDetail['productionCenters'] = data.EncryptedResponse.data.productionCenters;
        this.selectedVerietyDetail['totalIndentQuantity'] = data.EncryptedResponse.data.totalIndentQuantity;
        this.selectedVerietyDetail['totalAllocationQuantity'] = data.EncryptedResponse.data.totalAllocationQuantity;


        let productioncentersecond2 = variety && variety.productioncentersecond2 ? variety.productioncentersecond2 : '';

        let productionData = productioncentersecond2 ? Object.values(productioncentersecond2) : ''
        let productionArr = []
        if (productioncentersecond2 && productioncentersecond2.length > 0) {
          this.editVarietyData = true;

          // this.selectedVerietyDetail=
          for (let item of productioncentersecond2) {
            let vals = item && item.allocation_to_spa_for_lifting_seed_production_cnters ? item.allocation_to_spa_for_lifting_seed_production_cnters : '';
            for (let val of vals) {


              productionArr.push({
                allocated_quantity: val && val.allocated_ ? val.allocated_ : '',
                quantity_left: val && val.quantity_l ? val.allocated_ : '',
                name: val && val.user && val.user.name ? val.user.name : '',
                User_idBspc: val && val.user && val.user.id ? val.user.id : '',
                value: val && val.user && val.user.id ? val.user.id : '',
                spacode: val && val.spa_code ? val.spa_code : '',
                quantity: val && val.qty ? val.qty : '',
                id: val && val.id ? val.id : '',
                allocation_id: val && val.allocation ? val.allocation : '',
                state_code: val && val.state_code ? val.state_code : '',

              })
            }
          }
          for (let value of productionArr) {
            for (let item of this.dataToShow) {
              for (let vals of item.indenter) {
                // vals.productions=[];
                for (let items of vals.productions) {
                  if (vals.spa_code == value.spacode && vals.state_code == value.state_code && items.id == value.User_idBspc) {
                    items.quantity = value.quantity,
                      items.allocated_quantity = value.allocated_quantity

                    vals.Allocation_ids = value.allocation_id
                  }

                }

              }
            }
          }
          for (let item of this.dataToShow) {
            item.indentors = item.indenter
          }
          // this.dataToDisplay= this.dataToShow

          // this.dataToShow = this.dataToShow.filter((arr, index, self) =>
          //   index === self.findIndex((t) => (t.variety_id === arr.variety_id)))
          this.dataToDisplay = this.dataToShow
          this.dataToDisplay = this.dataToDisplay.filter(item => item.variety_id == this.selectedVerietyDetail.veriety_id)

        } else {
          this.editVarietyData = false;
          this.dataToDisplay = []
        }

        if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
          this.productionPercentage = 100;
        } else {
          this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
        }

      }

    })
  }
  }
  getGridData(){
    let datas = this.varietyForm.controls['variety_line'].value;
    let varietyLine = []
    if (datas && datas.length > 0) {
      datas.forEach(el => {
        varietyLine.push(el && el.variety_line_code ? el.variety_line_code : '')
      })
    }
   
    this.dataToDisplay = [];
    this.selectedIndentor = [];
    this.selectedVerietyDetailbtn = true;
    this.indentorsOne = []; // Added by Yogesh

    let year = this.IstPartFormGroupControls["yearofIndent"].value;
    let season = this.IstPartFormGroupControls["season"].value;
    let cropName = this.IstPartFormGroupControls["cropName"].value;
    let data = this.varietyForm.controls['variety_id'].value;
    let varietyData = []
    if (data && data.length > 0) {
      data.forEach(el => {
        varietyData.push(el && el.value ? el.value : '')
      })
    }
 
    this.selectedVerietyDetail = {}

    this.selectedVerietyDetail['year'] = year.value;
    this.selectedVerietyDetail['season'] = season.value;
    this.selectedVerietyDetail['crop_code'] = cropName.value;
    this.selectedVerietyDetail['veriety_id'] =this.varietyForm.controls['variety_id'].value;
    this.selectedVerietyDetail['user_id'] = this.currentUser.id;
    this.selectedVerietyDetail['is_active'] = 1;
    this.selectedVerietyDetail['id'] = this.submissionId;

    this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + varietyData[0] + "&line_code=" + varietyLine[0]).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

        const variety = data.EncryptedResponse.data;
        this.producionCentersList = []
        data.EncryptedResponse.data.productionCenters.forEach(element => {
          let temp = { name: element.user.name, value: element.produ, id: element.id, quantity: 0 }
          this.producionCentersList.push(temp);
        })
        data.EncryptedResponse.data.indentors.forEach(element => {
          element['productionsList'] = this.producionCentersList
          element['production_center_list'] = this.producionCentersList
          this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList, quantity: 0 })
          element['productions'] = []
        })

        this.indentors = [];

        variety.indentors.forEach(element => {
          element['quantity_left_for_allocation'] = element.indent_quantity - element.allocated_quantity
          element['productions'] = this.producionCentersList;

          if (this.submittedData && this.submittedData.length > 0) {
            const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);
            if (varietyIndex == -1) {

              const obj = {
                name: element.user.name ? element.user.name : 'NA',
                value: element.id,
                allocated_quantity: element.allocated_quantity,
                indent_quantity: element.indent_quantity,
                productions: element.productions,
                quantity_left_for_allocation: element.quantity_left_for_allocation,
                spa_code: element.spa_code,
                state_code: element.state_code
              }

              this.indentors.push(obj);
            }
          } else {
            const obj = {
              name: element.user.name ? element.user.name : 'NA',
              value: element.id,
              allocated_quantity: element.allocated_quantity,
              indent_quantity: element.indent_quantity,
              productions: element.productions,
              quantity_left_for_allocation: element.quantity_left_for_allocation,
              spa_code: element.spa_code,
              state_code: element.state_code
            }

            this.indentors.push(obj);

          }

        })
        this.indentorLoad = true
        // this.selectedVariety['quantityProduced']=
        this.selectedVerietyDetail['indentors'] = data.EncryptedResponse.data.indentors;
        this.selectedVerietyDetail['productionCenters'] = data.EncryptedResponse.data.productionCenters;
        this.selectedVerietyDetail['totalIndentQuantity'] = data.EncryptedResponse.data.totalIndentQuantity;
        this.selectedVerietyDetail['totalAllocationQuantity'] = data.EncryptedResponse.data.totalAllocationQuantity;


        let productioncentersecond2 = variety && variety.productioncentersecond2 ? variety.productioncentersecond2 : '';

        let productionData = productioncentersecond2 ? Object.values(productioncentersecond2) : ''
        let productionArr = []
        if (productioncentersecond2 && productioncentersecond2.length > 0) {
          this.editVarietyData = true;

          // this.selectedVerietyDetail=
          for (let item of productioncentersecond2) {
            let vals = item && item.allocation_to_spa_for_lifting_seed_production_cnters ? item.allocation_to_spa_for_lifting_seed_production_cnters : '';
            for (let val of vals) {


              productionArr.push({
                allocated_quantity: val && val.allocated_ ? val.allocated_ : '',
                quantity_left: val && val.quantity_l ? val.allocated_ : '',
                name: val && val.user && val.user.name ? val.user.name : '',
                User_idBspc: val && val.user && val.user.id ? val.user.id : '',
                value: val && val.user && val.user.id ? val.user.id : '',
                spacode: val && val.spa_code ? val.spa_code : '',
                quantity: val && val.qty ? val.qty : '',
                id: val && val.id ? val.id : '',
                allocation_id: val && val.allocation ? val.allocation : '',
                state_code: val && val.state_code ? val.state_code : '',

              })
            }
          }
          for (let value of productionArr) {
            for (let item of this.dataToShow) {
              for (let vals of item.indenter) {
                // vals.productions=[];
                for (let items of vals.productions) {
                  if (vals.spa_code == value.spacode && vals.state_code == value.state_code && items.id == value.User_idBspc) {
                    items.quantity = value.quantity,
                      items.allocated_quantity = value.allocated_quantity

                    vals.Allocation_ids = value.allocation_id
                  }

                }

              }
            }
          }
          for (let item of this.dataToShow) {
            item.indentors = item.indenter
          }
          // this.dataToDisplay= this.dataToShow

          // this.dataToShow = this.dataToShow.filter((arr, index, self) =>
          //   index === self.findIndex((t) => (t.variety_id === arr.variety_id)))
          this.dataToDisplay = this.dataToShow
          this.dataToDisplay = this.dataToDisplay.filter(item => item.variety_id == this.selectedVerietyDetail.veriety_id)

        } else {
          this.editVarietyData = false;
          this.dataToDisplay = []
        }

        if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
          this.productionPercentage = 100;
        } else {
          this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
        }

      }

    })
  
  }
  // getGridData(){
  //   console.log(this.varietLineData,'varrrr');
  //   this.dataToDisplay = [];
  //   this.selectedIndentor = [];
  //   this.selectedVerietyDetailbtn = true;
  //   this.indentorsOne = []; // Added by Yogesh

  //   let year = this.IstPartFormGroupControls["yearofIndent"].value;
  //   let season = this.IstPartFormGroupControls["season"].value;
  //   let cropName = this.IstPartFormGroupControls["cropName"].value;

  //   this.selectedVerietyDetail = {}

  //   this.selectedVerietyDetail['year'] = year.value;
  //   this.selectedVerietyDetail['season'] = season.value;
  //   this.selectedVerietyDetail['crop_code'] = cropName.value;
  //   this.selectedVerietyDetail['veriety_id'] =this.varietyForm.controls['variety_id'].value;
  //   this.selectedVerietyDetail['user_id'] = this.currentUser.id;
  //   this.selectedVerietyDetail['is_active'] = 1;
  //   this.selectedVerietyDetail['id'] = this.submissionId;

  //   this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + this.varietyForm.controls['variety_id'].value).subscribe((data: any) => {
  //     if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {

  //       const variety = data.EncryptedResponse.data;
  //       this.producionCentersList = []
  //       data.EncryptedResponse.data.productionCenters.forEach(element => {
  //         let temp = { name: element.user.name, value: element.produ, id: element.id, quantity: 0 }
  //         this.producionCentersList.push(temp);
  //       })
  //       data.EncryptedResponse.data.indentors.forEach(element => {
  //         element['productionsList'] = this.producionCentersList
  //         element['production_center_list'] = this.producionCentersList
  //         this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList, quantity: 0 })
  //         element['productions'] = []
  //       })

  //       this.indentors = [];

  //       variety.indentors.forEach(element => {
  //         element['quantity_left_for_allocation'] = element.indent_quantity - element.allocated_quantity
  //         element['productions'] = this.producionCentersList;

  //         if (this.submittedData && this.submittedData.length > 0) {
  //           const varietyIndex = this.submittedData.findIndex(x => x.variety_id == this.selectedVerietyDetail.veriety_id);
  //           if (varietyIndex == -1) {

  //             const obj = {
  //               name: element.user.name ? element.user.name : 'NA',
  //               value: element.id,
  //               allocated_quantity: element.allocated_quantity,
  //               indent_quantity: element.indent_quantity,
  //               productions: element.productions,
  //               quantity_left_for_allocation: element.quantity_left_for_allocation,
  //               spa_code: element.spa_code,
  //               state_code: element.state_code
  //             }

  //             this.indentors.push(obj);
  //           }
  //         } else {
  //           const obj = {
  //             name: element.user.name ? element.user.name : 'NA',
  //             value: element.id,
  //             allocated_quantity: element.allocated_quantity,
  //             indent_quantity: element.indent_quantity,
  //             productions: element.productions,
  //             quantity_left_for_allocation: element.quantity_left_for_allocation,
  //             spa_code: element.spa_code,
  //             state_code: element.state_code
  //           }

  //           this.indentors.push(obj);

  //         }

  //       })
  //       this.indentorLoad = true
  //       // this.selectedVariety['quantityProduced']=
  //       this.selectedVerietyDetail['indentors'] = data.EncryptedResponse.data.indentors;
  //       this.selectedVerietyDetail['productionCenters'] = data.EncryptedResponse.data.productionCenters;
  //       this.selectedVerietyDetail['totalIndentQuantity'] = data.EncryptedResponse.data.totalIndentQuantity;
  //       this.selectedVerietyDetail['totalAllocationQuantity'] = data.EncryptedResponse.data.totalAllocationQuantity;


  //       let productioncentersecond2 = variety && variety.productioncentersecond2 ? variety.productioncentersecond2 : '';

  //       let productionData = productioncentersecond2 ? Object.values(productioncentersecond2) : ''
  //       let productionArr = []
  //       if (productioncentersecond2 && productioncentersecond2.length > 0) {
  //         this.editVarietyData = true;

  //         // this.selectedVerietyDetail=
  //         for (let item of productioncentersecond2) {
  //           let vals = item && item.allocation_to_spa_for_lifting_seed_production_cnters ? item.allocation_to_spa_for_lifting_seed_production_cnters : '';
  //           for (let val of vals) {


  //             productionArr.push({
  //               allocated_quantity: val && val.allocated_ ? val.allocated_ : '',
  //               quantity_left: val && val.quantity_l ? val.allocated_ : '',
  //               name: val && val.user && val.user.name ? val.user.name : '',
  //               User_idBspc: val && val.user && val.user.id ? val.user.id : '',
  //               value: val && val.user && val.user.id ? val.user.id : '',
  //               spacode: val && val.spa_code ? val.spa_code : '',
  //               quantity: val && val.qty ? val.qty : '',
  //               id: val && val.id ? val.id : '',
  //               allocation_id: val && val.allocation ? val.allocation : '',
  //               state_code: val && val.state_code ? val.state_code : '',

  //             })
  //           }
  //         }
  //         for (let value of productionArr) {
  //           for (let item of this.dataToShow) {
  //             for (let vals of item.indenter) {
  //               // vals.productions=[];
  //               for (let items of vals.productions) {
  //                 if (vals.spa_code == value.spacode && vals.state_code == value.state_code && items.id == value.User_idBspc) {
  //                   items.quantity = value.quantity,
  //                     items.allocated_quantity = value.allocated_quantity

  //                   vals.Allocation_ids = value.allocation_id
  //                 }

  //               }

  //             }
  //           }
  //         }
  //         for (let item of this.dataToShow) {
  //           item.indentors = item.indenter
  //         }
  //         // this.dataToDisplay= this.dataToShow

  //         // this.dataToShow = this.dataToShow.filter((arr, index, self) =>
  //         //   index === self.findIndex((t) => (t.variety_id === arr.variety_id)))
  //         this.dataToDisplay = this.dataToShow
  //         this.dataToDisplay = this.dataToDisplay.filter(item => item.variety_id == this.selectedVerietyDetail.veriety_id)

  //       } else {
  //         this.editVarietyData = false;
  //         this.dataToDisplay = []
  //       }

  //       if (variety.totalAllocationQuantity >= variety.totalIndentQuantity) {
  //         this.productionPercentage = 100;
  //       } else {
  //         this.productionPercentage = (variety.totalAllocationQuantity / variety.totalIndentQuantity) * 100;
  //       }

  //     }

  //   })
  // }
}

