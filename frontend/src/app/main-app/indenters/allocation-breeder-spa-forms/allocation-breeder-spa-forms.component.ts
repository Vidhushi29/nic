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

@Component({
  selector: 'app-allocation-breeder-spa-forms',
  templateUrl: './allocation-breeder-spa-forms.component.html',
  styleUrls: ['./allocation-breeder-spa-forms.component.css']
})
export class AllocationBreederSpaFormsComponent implements OnInit {

  @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: DynamicFieldsComponent | undefined = undefined;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  activeVarietyIndexInAccordion = -1;
  fieldsList: Array<SectionFieldType> = [];
  verietyfieldsList: Array<SectionFieldType> = [];

  formSuperGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  currentUser: any = { id: 10, name: "Hello User" };
  currentProductionCenter: any;
  dropdownSettings: any = {};
  cropName: any = [];
  verietyListDetails: any = {};
  selectedVerietyDetail: any = {}
  prdData: any = [];
  editData: any = [];
  prodCenter: any = [];
  teamMembers: any = [];
  yearOfIndent: any = [];
  cropVarieties: any = [];
  cropVarietyIndentors: any = [];
  producionCentersList: any = []
  productionCenter: any = [];
  totalProductionCount = 0
  newFormGroup = new FormGroup<any>([]);
  setCondition: boolean = true;
  buttonText = 'Submit'
  quantityOfBreederSeedLeft = 0;
  quantityOfBreederSeedLeft1 = 0;
  quantityOfBreederSeedLeft2 = 0;
  quantityOfBreederSeedLeft3 = 0;
  closeDropdownSelection = false;
  indenderProductionCenter = []
  finalDataToBeSaved = []
  pdct: any = {};
  qty: any = 0;
  disableSubmitButton = true;
  editableQuantity = false;
  searhedData = false

  dropdownList = []
  quantityUnit: string;
  mergeArr: any[];
  showAdded = false;

  productionPercentage = 100;
  selectedItem: any;
  prod_center: any;
  new_quantity: any;

  editProdId = undefined;
  editIndex = undefined;
  rowIndex = undefined;

  editbuttonsView: boolean = true;
  VarietyName: any;

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

  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
    private restService: RestService,
    private breederService: BreederService,
    private fb: FormBuilder
  ) {

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'value',
      textField: 'name',
      closeDropDownOnSelection: this.closeDropdownSelection
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
    this.breederService.getRequestCreatorNew("allocation-to-spa-year").subscribe((data: any) => {
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

    this.onValueChanged()
    if (this.isEdit || this.isView) {
      this.searhedData = true;
      this.showAdded = false;
    }

    if (this.isEdit || this.isView) {
      this.breederService.getRequestCreator('allocation-to-spa/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          let data = this.editData = dataList.EncryptedResponse.data
          this.finalDataToBeSaved.push(this.editData)
          this.buttonText = 'Update'
          this.isDraft = data?.isdraft ? true : false;
          
          let tmpyear = this.getFinancialYear(this.editData.year);
          let year = { value: this.editData.year, name: tmpyear }
          this.VarietyName= data && data.m_crop_variety && data.m_crop_variety.variety_name ? data.m_crop_variety.variety_name :'';
          this.IstPartFormGroupControls["yearofIndent"].patchValue(year)
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


  onValueChanged() {
    this.IstPartFormGroupControls["yearofIndent"].valueChanges.subscribe(newValue => {
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

    if (this.isEdit || this.isView) {
      this.IstPartFormGroupControls["cropName"].valueChanges.subscribe(newValue => {
        let year = this.IstPartFormGroupControls["yearofIndent"].value;
        let season = this.IstPartFormGroupControls["season"].value;
        this.breederService.getRequestCreatorNew("allocation-to-spa-varieties?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + newValue.value).subscribe((dataList: any) => {
          if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
            this.verietyListDetails = dataList.EncryptedResponse.data
            let varietyList = []
            this.verietyListDetails.varieties.forEach(element => {
              let temp = { name: element.m_crop_variety.variety_name, value: element.m_crop_variety.variety_code, id: element.m_crop_variety.id }
              varietyList.push(temp);
            });
            this.verietyfieldsList[0].fieldDataList = varietyList;
            if (this.isEdit || this.isView) {
              let variety = varietyList.filter(x => x.id == this.editData.variety_id)[0]
              this.IstPartFormGroupControls["variety"].patchValue(variety);
            }
          }
        })
      });
    }

    this.IstPartFormGroupControls["variety"].valueChanges.subscribe(newValue => {
      this.selectedVerietyDetail = {}
      let year = this.IstPartFormGroupControls["yearofIndent"].value;
      let season = this.IstPartFormGroupControls["season"].value;
      let cropName = this.IstPartFormGroupControls["cropName"].value;
      this.selectedVerietyDetail['year'] = year.value
      this.selectedVerietyDetail['season'] = season.value
      this.selectedVerietyDetail['crop_code'] = cropName.value
      this.selectedVerietyDetail['veriety_id'] = newValue.id
      this.selectedVerietyDetail['user_id'] = this.currentUser.id
      this.selectedVerietyDetail['is_active'] = 1
      this.selectedVerietyDetail['id'] = this.submissionId;

      this.breederService.getRequestCreatorNew("allocation-to-spa-variety?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value + "&cropVariety=" + newValue.id).subscribe((dataList: any) => {
        console.log('dataList', dataList)
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          this.producionCentersList = []
          dataList.EncryptedResponse.data.productionCenters.forEach(element => {
            let temp = { name: element.user.name, value: element.produ, id: element.id }
            this.producionCentersList.push(temp);
          })
          dataList.EncryptedResponse.data.indentors.forEach(element => {
            element['productionsList'] = this.producionCentersList
            element['production_center_list'] = this.producionCentersList
            this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList })
            element['productions'] = []
          })

          this.selectedVerietyDetail['indentors'] = dataList.EncryptedResponse.data.indentors
          this.selectedVerietyDetail['productionCenters'] = dataList.EncryptedResponse.data.productionCenters
          this.selectedVerietyDetail['totalIndentQuantity'] = dataList.EncryptedResponse.data.totalIndentQuantity
          this.selectedVerietyDetail['totalAllocationQuantity'] = dataList.EncryptedResponse.data.totalAllocationQuantity
          if (this.isEdit || this.isView) {
            this.editData.indentors.forEach(element => {
              element['productionsList'] = this.producionCentersList
              element['production_center_list'] = this.producionCentersList
              this.indenderProductionCenter.push({ indenter_id: element.id, producionCentersList: this.producionCentersList })
              let selectProductionIds = element['productions'].map(x => x.productionCenter.id)
              let pdcList = this.producionCentersList
              let ppd = pdcList.filter(p => !selectProductionIds.includes(p.value))
              element.production_center_list = ppd
            })
            this.selectedVerietyDetail['indentors'] = this.editData.indentors
            // this.selectedVerietyDetail['productionCenters'] = this.editData.productionCenters

            this.editData.productionCenters.forEach(element => {
              this.selectedVerietyDetail['productionCenters'].forEach(data => {
                console.log(element)
                console.log(data)
                if (data.produ == element.produ) {
                  data.quantityAllocated += element.qty
                }
              });
            });
          }
        }
      })
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
    this.breederService.getRequestCreatorNew("allocation-to-spa-varieties?user_id=" + this.currentUser.id + "&year=" + year.value + "&season=" + season.value + "&cropCode=" + cropName.value).subscribe((dataList: any) => {
      if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
        Swal.fire({
          icon: 'success',
          text: 'Please Select Variety to Proceed',
          showConfirmButton: false,
          timer: 1000
        })
        this.verietyListDetails = dataList.EncryptedResponse.data
        let varietyList = []
        this.verietyListDetails.varieties.forEach(element => {
          let temp = { name: element.m_crop_variety.variety_name, value: element.m_crop_variety.variety_code, id: element.m_crop_variety.id }
          varietyList.push(temp);
        });
        this.verietyfieldsList[0].fieldDataList = varietyList;
        if (this.isEdit || this.isView) {
          let variety = varietyList.filter(x => x.id == this.editData.variety_id)[0]
          this.IstPartFormGroupControls["variety"].patchValue(variety);
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops',
          text: dataList.EncryptedResponse.message + ": " + dataList.EncryptedResponse.status_code,
        })
      }
    })
  }


  search() {
    let searchParams1 = { "Year of Indent": null, "Season": null, "Crop Name": null, };
    let yearofIndent: null;
    let cropName: null;
    let cropVariety: null;
    let season: null;
    this.searhedData = true;
    if (this.IstPartFormGroupControls["yearofIndent"] && this.IstPartFormGroupControls["yearofIndent"].value) {
      searchParams1['Year of Indent'] = this.IstPartFormGroupControls["yearofIndent"].value["value"]
      // allData = allData.filter(x => (x.year == yearofIndent))
    }

    if (this.IstPartFormGroupControls["season"] && this.IstPartFormGroupControls["season"].value) {
      searchParams1['Season'] = this.IstPartFormGroupControls["season"].value["value"];
      // allData = allData.filter(x => x.season == season)
    }

    if (this.IstPartFormGroupControls["cropName"] && this.IstPartFormGroupControls["cropName"].value) {
      searchParams1['Crop Name'] = this.IstPartFormGroupControls["cropName"].value["value"];
      // allData = allData.filter(x => x.crop_code == cropName)
    }

    let blankData = Object.entries(searchParams1).filter(([, value]) => value == null).flat().filter(n => n).join(", ")
    if (blankData) {
      Swal.fire('Error', "Please Fill " + blankData + " Details Correctly.", 'error');
      return;
    } else {
      this.getCropVerieties()
    }

  }

  clear() {

    const url = this.router.url;


    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/${url}`]).then(() => {
      })
    })

  }

  newQuantity(qty, prodCenter) {
    return { "qty": parseFloat(qty), "productionCenter": prodCenter }
  }


  addQuantity(indentor?: any, pdtc?: any, qty?: any, selectedVerietyDetail?: any) {
    let productionCenterControl = pdtc
    let indentor_id = indentor.id

    let pdcList = this.indenderProductionCenter.filter(x => x.indenter_id == indentor_id)[0]['producionCentersList']
    let quantityControl = qty
    if (parseFloat(quantityControl.value) <= 0) {
      Swal.fire({
        title: '<p style="font-size:25px;">Allocation for Lifting Quantity Should Be Greter Than 0.</p>',
        icon: 'info',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }

    else {
      if ((quantityControl.value != undefined || quantityControl.value != ' ') && productionCenterControl.selectedItems.length > 0) {
        if (indentor['productions'] == undefined) {
          indentor['productions'] = []
          indentor['productions'].push(this.newQuantity(parseFloat(quantityControl.value), productionCenterControl.selectedItems[0]));
          let selectProductionIds = indentor['productions'].map(x => x.productionCenter.id)
          let ppd = pdcList.filter(p => !selectProductionIds.includes(p.value))
          indentor.production_center_list = ppd
          productionCenterControl.selectedItems = []
          quantityControl.value = ''
        } else {
          let quantity = indentor.productions.reduce((acc, val) => acc += val.qty, 0)
          let ttlSum = (parseFloat(quantity) + parseFloat(quantityControl.value))
          if (ttlSum > indentor.indent_quantity) {
            Swal.fire({
              title: '<p style="font-size:25px;">Total Allocation for Lifting Quantity Should Not Be Greter Than Indenting Quanitity.</p>',
              icon: 'info',
              confirmButtonText:
                'OK',
            confirmButtonColor: '#E97E15'
            })
            return
          } else {
            console.log(selectedVerietyDetail)
            let temp = parseFloat(quantityControl.value);
            let prod_quantity;
            this.selectedVerietyDetail['productionCenters'].forEach((element, i) => {
              if (element.produ == this.selectedItem.value) {
                temp += element.quantityAllocated;
                prod_quantity = element.qty
              }
            })

            if (temp > prod_quantity) {
              Swal.fire({
                title: '<p style="font-size:25px;">Allocation Quantity Should Not Be More Than Produced Quantoty.</p>',
                icon: 'info',
                confirmButtonText:
                  'OK',
              confirmButtonColor: '#E97E15'
              })
              return
            } else {
              indentor['productions'].push(this.newQuantity(parseFloat(quantityControl.value), productionCenterControl.selectedItems[0]));
              let selectProductionIds = indentor['productions'].map(x => x.productionCenter.id)

              let ppd = pdcList.filter(p => !selectProductionIds.includes(p.value))
              indentor.production_center_list = ppd
              productionCenterControl.selectedItems = []
              quantityControl.value = ''
            }

          }
        }
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Please Fill Quanitity and Production Center.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
      }
    }
    let arr = [];

    for (let i = 0; i < this.selectedVerietyDetail['indentors'].length; i++) {
      arr.push(this.selectedVerietyDetail['indentors'][i]['productions'])
    }
    let productionFlat = arr.flat()
    let productionCenter = []

    let center = this.selectedVerietyDetail['productionCenters'];

    const mergedArray = []
    productionFlat.forEach((ele, id) => {
      const item2 = center.find((item2) => item2.user.name === ele.productionCenter.text);
      if (item2) {
        mergedArray.push({ ...ele, ...item2 });
      }
    })
    this.mergeArr = mergedArray;

    this.showAdded = true;
    if (indentor['productions'].length > 0) {
      let arrs;
      let production = []
      for (let i in indentor['productions']) {
        arrs = (indentor['productions'][i]['productionCenter'])
        arrs.qty = indentor['productions'][i].qty
        production.push(arrs)

      }
      let prod = production.flat()

      let productionArr = [];

      let productinCent = prod.forEach(ele => {

        productionArr.push({
          user: {
            name: ele.text
          },
          quantityAllocated: ele.qty,


        })
      })

      center.forEach((element, i) => {
        productionArr.forEach(data => {
          if (element.user.name.toString().toLowerCase() === data.user.name.toString().toLowerCase()) {
            if (element.user.name.toString().toLowerCase() === this.selectedItem.name.toString().toLowerCase()) {
              element.quantityAllocated += data.quantityAllocated
            }
          }
        });
      });
    }

    console.log(this.selectedVerietyDetail)

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
      return (indenter['quantity_left_for_allocation'] < 0) ? 0 : indenter['quantity_left_for_allocation'];
    } else {
      indenter['quantity_left_for_allocation'] = (parseFloat(indenter.indent_quantity)).toFixed(2)
      return indenter['quantity_left_for_allocation'];
    }
  }

  onItemSelect(event: any) {
    this.selectedItem = event;
    console.log(this.selectedItem)
  }

  editQuantity(production, index, dataIndex) {
    this.editProdId = production.id;
    this.editIndex = index;
    this.rowIndex = dataIndex;
    this.editbuttonsView = false;
    this.editableQuantity = true;
  }

  cancelEdit() {
    this.editProdId = undefined;
    this.editIndex = undefined;
    this.rowIndex = undefined;
    this.editbuttonsView = true;
    this.editableQuantity = false;
  }

  qtyChanged(e, production, indenter, productionIndex) {

    this.prod_center = production.productionCenter;
    this.new_quantity = e.target.value

  }

  saveQuantity(production, indenter, productionIndex) {

    let value = parseFloat(this.new_quantity)
    if (value == null || value <= 0) {
      production['qty'] = 0;
    } else if ((isNaN(value))) {
      production['qty'] = 0;
    } else if ((value) > parseFloat(indenter.indent_quantity)) {
      production['qty'] = 0;
    } else {
      production['qty'] = value;
    }

    this.getQuantity(indenter)
    this.getLeftQuantity(indenter)

    this.selectedVerietyDetail.productionCenters.forEach(element => {
      if (element.produ == this.prod_center.id) {
        element.quantityAllocated = (parseFloat(element.quantityAllocated) + parseFloat(this.new_quantity)) - parseFloat(this.prod_center.qty);
        element.quantityAllocated = element.quantityAllocated;
      }
    });

    console.log(this.selectedVerietyDetail)
    this.cancelEdit();
  }

  isNumberKey(evt) {
    var input = <HTMLInputElement>evt.srcElement;

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    }
    let value = input.value
    if ((value.indexOf('.') != -1) && (value.substring(value.indexOf('.')).length > 2)) {
      evt.preventDefault();
    }
  }

  removeQuantity(prodCenterIndex, indentor, production) {
    let indentor_id = indentor.id
    if (this.isEdit || this.isView) {

    }
    let pdcList = this.indenderProductionCenter.filter(x => x.indenter_id == indentor_id)[0]['producionCentersList']
    indentor['productions'].splice(prodCenterIndex, 1)
    if (indentor['productions'].length == 0) {
      indentor.production_center_list = pdcList
    } else {
      let selectProductionIds = indentor['productions'].map(x => x.productionCenter.id)
      let ppd = pdcList.filter(p => !selectProductionIds.includes(p.value))
      indentor.production_center_list = ppd
    }

    this.selectedVerietyDetail.productionCenters.forEach(element => {
      if (element.produ == production.productionCenter.id) {
        console.log("inside if")
        element.quantityAllocated = parseFloat(element.quantityAllocated) - parseFloat(production.qty);
      }
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
    this.quantityUnit = crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg';
    return crop_code.split('')[0] == 'A' ? 'Quintal' : 'Kg'
  }

  createFormControlsOfAGroup(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>) {
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "season" || x.formControlName == "variety" || x.formControlName == "yearofIndent" || x.formControlName == "cropName")) {
        newFormControl.disable();
      }
      formGroup.addControl(x.formControlName, newFormControl);
    });
  }

  createFormControlsOfAGroupUI(fieldsToUse: SectionFieldType[], formGroup: FormGroup<any>, element) {
    let crop_code = this.IstPartFormGroupControls['cropName'].value.value
    fieldsToUse.forEach(x => {
      const newFormControl = new FormControl("", x.validations);
      if (this.isEdit && (x.formControlName == "season" || x.formControlName == "variety" || x.formControlName == "yearofIndent" || x.formControlName == "cropName")) {
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
    // this.IstPartFormGroupControls["cropVarieties"].patchValue(data.variety);
    // this.IstPartFormGroupControls["indentorName"].patchValue(data.indentor);
  }


  create(params) {
    this.breederService.postRequestCreator("allocation-to-spa", null, params).subscribe((data: any) => {

      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
        this.router.navigate(['indenters/allocation-of-breeder-seed-to-spa-for-liftings']);
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
    this.breederService.postRequestCreator("allocation-to-spa/edit", null, params).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          icon: 'success',
          confirmButtonText:
            'OK',
        confirmButtonColor: '#E97E15'
        })
        this.router.navigate(['indenters/allocation-of-breeder-seed-to-spa-for-liftings']);
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

  save(selectedVerietyDetail) {
    if (this.finalDataToBeSaved.length == 0) {

      this.finalDataToBeSaved.push(selectedVerietyDetail)
      this.disableSubmitButton = false;
      Swal.fire({
        title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
        icon: 'success',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }
    else if (this.finalDataToBeSaved.some(x => x.veriety_id === selectedVerietyDetail.veriety_id)) {
      let target = this.finalDataToBeSaved.find(x => x.veriety_id === selectedVerietyDetail.veriety_id)
      Object.assign(target, selectedVerietyDetail);
      Swal.fire({
        title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
        icon: 'success',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    } else if (selectedVerietyDetail.veriety_id || (selectedVerietyDetail.veriety_id != undefined || selectedVerietyDetail.veriety_id != null)) {

      this.finalDataToBeSaved.push(selectedVerietyDetail)
      this.disableSubmitButton = false;
      Swal.fire({
        title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
        icon: 'success',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })
    }
    for(let val of this.finalDataToBeSaved){
      for(let value of val.indentors){                
        val.totalProduction = value.productions.length
      }
      
    }

  }

  submitForm(formData) {
    if (this.finalDataToBeSaved.length > 0) {
      let invalid = false;
      this.verietyListDetails.varieties.forEach(element => {
        let tmp = this.finalDataToBeSaved.find(x => x.veriety_id == element.m_crop_variety.variety_code)
        if (tmp == undefined) {
          // invalid = true
        }
      })
      this.finalDataToBeSaved.forEach(element => {
        element.indentors.forEach(indenter => {
          if (indenter.productions.length == 0) {
            Swal.fire('Error', "Select At Least One Production for Indenter: " + indenter['user']['name'] + ".", 'error');
            invalid = true;
            return;
          }
        })
      })
      if (!invalid) {
        this.isEdit ? this.update(this.finalDataToBeSaved[0]) : this.create(this.finalDataToBeSaved)
      }
    } else {
      Swal.fire('Error', 'Please Save all the Details Before Final Submit.', 'error');
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

  getVarietyName(variety_id) {

    let data = this.verietyListDetails.varieties.filter(item => item.m_crop_variety.id == variety_id)
    return data && data[0].m_crop_variety && data[0].m_crop_variety.variety_name ? data[0].m_crop_variety.variety_name : '';
  }

  getQuantityOfSeedProduced(data?: any) {
    let value = data.toString();

    if (value.indexOf(".") == -1) {
      return data;

    } else {
      return data ? Number(data).toFixed(2) : 0;

    }
  }
}
