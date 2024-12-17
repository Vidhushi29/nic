import { Component, OnInit, ViewChild } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
// import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
// import { BreederSeedSubmissionUIFields } from 'src/app/common/data/ui-field-data/breeder-seed-submission-ui-fields';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import { checkLength, checkNumber, convertDates, onlyNumberKey, checkDecimal, random } from 'src/app/_helpers/utility';
import { MasterService } from 'src/app/services/master/master.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
// import { IConfig } from 'ngx-dropdown-menu-search';

@Component({
  selector: 'app-breeder-seed-submission',
  templateUrl: './breeder-seed-submission.component.html',
  styleUrls: ['./breeder-seed-submission.component.css']
})
export class BreederSeedSubmissionComponent implements OnInit {

  // @ViewChild(DynamicFieldsComponent) dynamicFieldsComponent: DynamicFieldsComponent | undefined = undefined;

  fieldsList: Array<SectionFieldType> = [];
  subFieldsList: Array<Array<SectionFieldType>> = [];
  formGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  varietyNames
  isView: boolean;
  seasonList: any;
  cName: any;
  name: any;
  title: string;
  contactPersonName: any;
  crop_names;
  contactPersonDesignation: any;
  currentUser: any = { id: 10, name: "Hello User" };
  cropData: any;
  disabled = false
  param: { search: { group_code: any; }; };
  cropDataList: any;
  disabledRadio = true

  // public config: IConfig;
  public options: any[];
  public selectedOption: any;
  variety_names;
  // breederForm: FormGroup;
  yearofIndent = [
    { name: "2026-27", "value": "2026" },
    { name: "2025-26", "value": "2025" },
    { name: "2024-25", "value": "2024" },
    { name: "2023-24", "value": "2023" },
    { name: "2022-23", "value": "2022" },
    { name: "2021-22", "value": "2021" },
    { name: "2020-21", "value": "2020" },
    { name: "2019-20", "value": "2019" },
    { name: "2018-19", "value": "2018" },
  ];
  cropGroupData: any;
  varietyList: any;
  group_name: any;
  crop_name: any;
  updatedCropCode: any;
  titleKey: string;
  notificationYearMissing = false;
  pastedNumber: any;
  verietyArray = []

  selectedLangs = new Set<string>();
  langSelects: any;
  indentQntMissing: boolean = false;
  varietyNameMissing: boolean = false;
  indentQntzero = false;
  selected_group: any;
  cropGroupDatasecond: any;
  cropDataListsecond: any;
  varietyId: any;
  verietyArraySecond: any[];
  spaCode: any;
  stateCode: any;
  isAllowed: any;




  get formGroupControls() {
    return this.formGroup.controls;
  }
  constructor(activatedRoute: ActivatedRoute, private router: Router,
    // breederSeedSubmissionUIFields: BreederSeedSubmissionUIFields,
    private masterService: MasterService,
    private indenterService: IndenterService, private service: SeedServiceService,
    private _service: ProductioncenterService,
    private fb: FormBuilder
  ) {
    this.createEnrollForm();
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name
    this.currentUser.agency_id = userData.agency_id
    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }
    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;
    if (this.isView) {
      this.disabled = true
    }

  }
  createEnrollForm() {
    this.formGroup = this.fb.group({
      yearofIndent: ['', Validators.required],
      season: ['', Validators.required],
      cropGroup: ['', Validators.required],
      cropName: ['', Validators.required],
      cropType: ['', Validators.required],
      unitKgQ: ['', Validators.required],
      group_text: [''],
      crop_name_text: [''],

      variety_items: this.fb.array([
        this.varietyItem(),
      ]),
    });
    this.formGroup.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.indentPermissions();
      }
    });
  }


  ngOnInit(): void {
    const userData = localStorage.getItem('BHTCurrentUser');
    const stateCode = localStorage.getItem('state_code');
    this.stateCode = JSON.parse(stateCode);

    const data = JSON.parse(userData);
    this.spaCode = data && data.spa_code;
    this.getCropGroup();
    this.formGroup.controls['cropGroup'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.indentCropName(newValue);
        this.removeSelectedVariety(null);
        // this.formGroup.controls['variety_items']['controls'].array.forEach((element,index) => {
        //   console.log('element index=========',element,index);
        //   // index.controls['varietyName'].setValue("");
        // });
        this.getVarietyList(null);
        this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].setValue("");
        this.formGroup.controls['variety_items']['controls'][0].controls['varietyNotificationYear'].setValue("");
        this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].setValue("");
      }
    });
    this.selectedOption = 'Select Variety Name';
    // this.formGroup.get('variety_items.indentQuantity').patchValue(9876543);
    //   this.config = {
    //     height: '30px',
    //     // lineHeignt: '30px',
    //     searchEnabled: true
    // }
    this.formGroup.controls["cropType"].disable();
    // this.formGroup.controls['variety_items']['controls'][0].controls['varietyNotificationYear'].disable();
    // this.formGroup.controls["unitKgQ"].disable();
    if (this.isEdit) {
      // this.formGroupControls["cropType"].valueChanges.subscribe(newValue => {
      //   console.log('new value', newValue)
      //   this.formGroupControls["unitKgQ"].setValue(newValue);
      // });
      this.title = "Update Indents of Breeder Seeds";
      this.titleKey = 'updated';
    } else if (this.isView) {
      this.title = "View Indents of Breeder Seeds";

    } else if (!this.isView && !this.isView) {
      this.title = "Add Indents of Breeder Seeds";
      this.titleKey = 'added';
    }
    this.getSeasonData();
    this.formGroup.controls['group_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropGroupData = this.cropGroupDatasecond
        let response = this.cropGroupData.filter(x => x.group_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.cropGroupData = response


      }
      else {
        this.getCropGroup()
      }
    });
    this.formGroup.controls['crop_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue, this.cropDataList)
        this.cropDataList = this.cropDataListsecond
        let response = this.cropDataList.filter(x => x.crop_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.cropDataList = response


      }
      else {
        this.indentCropName(this.formGroup.controls['cropGroup'].value)
      }
    });


    this.formGroup.controls['cropName'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.updatedCropCode = newValue;
        this.getVarietyList(newValue);
        if ((newValue).slice(0, 1) == 'A') {
          this.formGroup.controls["cropType"].patchValue('agriculture');
          this.formGroup.controls["unitKgQ"].patchValue('quintal');
        } else if ((newValue).slice(0, 1) == 'H') {
          this.formGroup.controls["cropType"].patchValue('horticulture');
          this.formGroup.controls["unitKgQ"].patchValue('kilogram');
        }
      }
    });



    this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getNoticeYear(newValue.id, 0);
      }
    });
    this.formGroup.controls['variety_items']['controls'][0].controls['variety_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {

        console.log(newValue)
        this.verietyArray = this.verietyArraySecond
        let response = this.verietyArray.filter(x => x.variety_name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.verietyArray = response




      }
      else {

        this.getVarietyList(this.formGroup.controls['cropName'].value)
      }
    });

    // this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].valueChanges.subscribe(newValue => {
    //   if (newValue) {
    //     this.getNoticeYear(newValue, 0);
    //   }
    // });

    this.isEditOrView();
  }

  indentPermissions() {
    let route = "indent-permission";
    if (!this.formGroup.controls['yearofIndent'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Required Field.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        showCancelButton: false,
        confirmButtonColor: '#E97E15'
      })
      return;
    }
    this.masterService.postRequestCreator(route, null, {
      year: this.formGroup.controls['yearofIndent'].value,
      season: this.formGroup.controls['season'].value
    }).subscribe(res => {
      console.log("res=== ", res.EncryptedResponse);
      if (res.EncryptedResponse.status_code === 200) {
        console.log(res.EncryptedResponse.data['is_allowed_new']);
        if (res.EncryptedResponse.data && res.EncryptedResponse.data['is_allowed_new'] === 1) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
          Swal.fire({
            title: '<p style="font-size:25px;">Permission Declined.</p>',
            icon: 'warning',
            confirmButtonText:
              'OK',
            showCancelButton: false,
            confirmButtonColor: '#E97E15'
          })
          return;
        }
      }
      if(res.EncryptedResponse.status_code === 201){
        this.isAllowed = false;
          Swal.fire({
            title: '<p style="font-size:25px;">Permission Declined.</p>',
            icon: 'warning',
            confirmButtonText:
              'OK',
            showCancelButton: false,
            confirmButtonColor: '#E97E15'
          })
          return;
      }
    })
  }

  varietyItem() {
    let temp = this.fb.group({
      varietyName: ['', Validators.required],
      varietyNotificationYear: ['', Validators.required],
      indentQuantity: ['', Validators.required],
      variety_name_text: ['']
    });

    return temp;

  }

  getItems(form) {
    return form.controls.variety_items.controls;
  }


  get itemsArray() {
    return <FormArray>this.formGroup.get('variety_items');
  }

  getSeasonData() {
    const route = "get-season-details";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';

    })
  }

  varietyYears: any;

  getYear(i, event) {


    this.getNoticeYear(event.target.value, i);
    this.varietyItemUnique(event.target.value, i);
    // this.removeSelectedVariety(event.target.value);
  }


  getCropGroup() {
    this.indenterService.getRequestCreatorNew("indetor-crop-group").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.cropGroupData = data.EncryptedResponse.data;
        this.cropGroupDatasecond = this.cropGroupData
      }
    });
  }

  indentCropName(value) {
    console.log('crop name', value);
    if ((this.cropGroupData != undefined) && (!this.isView)) {
      const foundData = this.cropGroupData.filter((x: any) => x.group_code == value);
      this.group_name = foundData[0].group_name;
    }

    const param = {
      search: {
        group_code: value,
        view: this.isView ? this.isView : ''
      }
    }

    this.indenterService.postRequestCreator('indetor-crop-name', null, param).subscribe(data => {
      let result = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.cropDataList = result;

      this.cropDataListsecond = this.cropDataList
      if ((this.cropDataList != undefined) && !this.isView) {
        const foundData = this.cropDataList.filter((x: any) => x.crop_code == this.updatedCropCode);
        this.crop_name = foundData[0].crop_name;
      }
      this.indenterService.putData(result);
    })
  }

  getVarietyList(cropCode) {
    if ((this.cropDataList != undefined) && !this.isView) {
      const foundData = this.cropDataList.filter((x: any) => x.crop_code == this.updatedCropCode);
      this.crop_name = foundData[0].crop_name;
    }
    const param = {
      search: {
        crop_code: cropCode,
        season: this.formGroup.controls['season'].value,
        crop_group: this.formGroup.controls['cropGroup'].value,
        year_of_indent: this.formGroup.controls['yearofIndent'].value
      }
    }
    this._service.postRequestCreator("get-variety-for-indentor-new", param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        let variety = data.EncryptedResponse.data;
        if (variety.length > 0) {
          this.varietyList = variety;
          this.verietyArray = this.varietyList;
          this.verietyArraySecond = this.verietyArray
          this.verietyArray.forEach(ele => {
            ele.is_selected = false;
          });
        }
      }
    });
  }

  varietyItemUnique(value, i) {
    // this.verietyArray = [];
    let array = [];
    // this.varietyList.forEach((ele, index) => {
    // console.log('ele', ele);
    // if (ele.id == value) {
    // console.log('ele',ele);
    // console.log('variety id============', value);
    // console.log('variety id============',ele.id);
    // delete this.varietyList[index];
    // array.push(ele);
    // this.varietyList = this.verietyArray;
    // verietyArray.push(this.varietyList)
    // } else {
    // console.log('ele');
    // this.verietyArray.push(ele);
    // this.varietyList = this.verietyArray;
    //   }
    // })
    // let array = [];
    // this.verietyArray = array;

    // this.verietyArray.forEach(ele => {
    //   this.varietyList.forEach(elem => {
    //     if (ele.id != elem.id) {
    //       array.push(elem);
    //     }
    //   })
    // })

    // console.log('variety=====', array);
    // this.verietyArray = array;
    // if (this.varietyList.id != this.verietyArray['id']) {
    //   this.varietyList.forEach((ele, index) => {
    //     array.push(ele);
    //   });
    // }
    // this.verietyArray = array;
    // this.varietyList =;
    // this.varietyList.forEach(ele => {
    //   if ((ele.id == value) && (i == (i+1))) {
    //     alert('Hiii');
    //     delete verietyArray[ele.id];
    //   }
    // });
    // this.varietyList = verietyArray;
    // console.log('arrayData ===', this.varietyList);
    // console.log('variety value', value);
    // console.log('variety value', i);
  }

  submit() {

    // for(let index =0;index<this.formGroup.value.variety_items.length;index++){
    //   this.formGroup.value.variety_items[index].varietyName 



    // }
    // console.log(data)
    if (!this.isAllowed) {
      Swal.fire({
        title: '<p style="font-size:25px;">Permission Declined.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        showCancelButton: false,
        confirmButtonColor: '#E97E15'
      })
      return;
    }

    let data = this.formGroup.value;

    if (this.formGroup.invalid) {
      Swal.fire({
        toast: true,
        icon: "error",
        title: "All Maindatory ('*') Field is Required",
        position: "center",
        showConfirmButton: false,
        showCancelButton: false,
        timer: 2000
      });
      return;
    }

    this.formGroup.value.variety_items.forEach(element => {
      console.log(typeof (element.indentQuantity), 'ele')
      if (element.varietyName.id == '') {
        this.varietyNameMissing = true;
        return;
      }
      else if (element.varietyNotificationYear == '') {
        this.notificationYearMissing = true;
        return;
      } else if (parseInt(element.indentQuantity) == 0) {
        Swal.fire({
          title: '<p style="font-size:25px;">Indent Quantity Can Not Be 0.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        });

        this.indentQntzero = true;
        return;
      }
      else if (element.indentQuantity == '') {
        this.indentQntMissing = true;
        this.indentQntzero = false;
        return;
      }

      else {
        this.indentQntMissing = false;
        this.notificationYearMissing = false;
        this.varietyNameMissing = false;
        this.indentQntzero = false;
      }
    });

    data.user_id = this.currentUser.id;
    data.agency_id = this.currentUser.agency_id;
    data.group_name = this.group_name;
    data.crop_name = this.crop_name;
    if (!this.notificationYearMissing) {
      let apiRoute = "indent-of-spa-new";
      if (this.submissionId && this.submissionId > 0) {
        apiRoute += "/" + this.submissionId;
      }
      let varietyArrayData = [];
      if (this.formGroup.controls['variety_items'].value) {
        this.formGroup.controls['variety_items'].value.forEach(element => {
          console.log("variety element", element);
          varietyArrayData.push({
            "variety_code": element && element.varietyName && element.varietyName.variety_code,
            "indent_quantity": element.indentQuantity
          })
        });
      }

      let param = {
        "year_of_indent": this.formGroup.controls['yearofIndent'].value,
        "season": this.formGroup.controls['season'].value,
        "crop_group": this.formGroup.controls['cropGroup'].value,
        "crop_code": this.formGroup.controls['cropName'].value,
        "state_code": this.stateCode ? this.stateCode : '',
        "spa_code": this.spaCode,//"SPA123"
        "varieties": varietyArrayData
      }
      console.log('param === request', param);
      this.masterService.postRequestCreator(apiRoute, null, param).subscribe((apiResponse: any) => {

        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200 && !this.indentQntzero) {
          Swal.fire({
            toast: false,
            icon: 'question',
            title: 'Are You Sure To ' + this.titleKey + ' The Indent To Seed Division?',
            position: 'center',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            customClass: {
              title: 'list-action-confirmation-title',
              actions: 'list-confirmation-action',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: '<p style="font-size:25px;">Data Added Successfully.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
                showCancelButton: false,
                confirmButtonColor: '#E97E15'
              }).then(x => {
                this.router.navigate(['/indent-breeder-seed-allocation-list']);
              })
            }
          })
        } else if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 404) {
          Swal.fire({
            title: '<p style="font-size:25px;">Variety Name is Already Registered.</p>',
            icon: 'warning',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
        } else if (apiResponse.EncryptedResponse.status_code == 405) {
          Swal.fire({
            toast: true,
            icon: "warning",
            title: apiResponse.EncryptedResponse.message,
            position: "center",
            showConfirmButton: false,
            showCancelButton: false,
            timer: 2000
          })
        } else if (this.indentQntzero) {
          Swal.fire({
            title: '<p style="font-size:25px;">Indent Quantity Can Not Be 0.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          });
        }
        else {
          Swal.fire({
            title: '<p style="font-size:25px;">An Error Occured.</p>',
            icon: 'error',
            confirmButtonText:
              'OK',
            confirmButtonColor: '#E97E15'
          })
        }
      });
    } else if (this.indentQntMissing) {
      Swal.fire({
        title: '<p style="font-size:25px;">Indent Quantity is Required.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }

    else if (this.varietyNameMissing) {
      Swal.fire({
        title: '<p style="font-size:25px;">Indent Variety Name is Required.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }
    else {
      Swal.fire({
        title: '<p style="font-size:25px;">Variety Notification Year is Required.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }
  }

  addMore(i) {
    i = this.itemsArray.length - 1;
    console.log(i, this.formGroup.value.variety_items[i].varietyName);
    this.itemsArray.push(this.varietyItem());
    for (let index = 0; index < this.verietyArray.length; index++) {
      // const element = array[index];
      if (this.verietyArray[index].id === parseInt(this.formGroup.value.variety_items[i].varietyName)) {
        // this.verietyArray.splice(index, 1);
        this.verietyArray[index].is_selected = true;
        console.log("Hii dost");
        break;
      }

    }
    console.log('abc===', this.verietyArray);
    // this.varietyList.forEach(ele => {
    //   console.log(ele.id);

    // })
    // console.log('qwop=======',this.formGroup.value.variety_items[0].varietyName);
  }

  remove(rowIndex: number) {
    if (this.itemsArray.length <= 1)
      return;
    else
      this.itemsArray.removeAt(rowIndex);
    this.verietyArray[rowIndex].is_selected = false;

  }

  getNoticeYear(varietyId, i) {
    if (varietyId) {
      this.masterService.postRequestCreator("get-crop-variety-year", null, {
        search: {
          variety_id: varietyId
        }
      }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
          let varietyYear = data.EncryptedResponse.data;
          if (varietyYear.length > 0) {
            const notification_date = data && data.EncryptedResponse && data.EncryptedResponse.data[0] && data.EncryptedResponse.data[0].not_date ? data.EncryptedResponse.data[0].not_date : ''
            if (notification_date != '') {
              let not_date = new Date(notification_date)
              let convertNotificationDate = convertDates(not_date)
              let convertNotificationDateSplit = convertNotificationDate.split('-');
              this.formGroup.controls['variety_items']['controls'][i].controls["varietyNotificationYear"].setValue(convertNotificationDateSplit[0]);
            }
          }
        }
      });
    }

  }

  removeSelectedVariety(id) {
    this.varietyList.forEach((ele, index) => {
      if (ele.id == id) {
        delete this.varietyList[index];
      }
    })
  }

  isEditOrView() {
    if (this.isEdit || this.isView) {
      this.masterService
        .postRequestCreator("get-indent-of-spa-new", null, { id: this.submissionId })
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
            let data = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.rows && apiResponse.EncryptedResponse.data.rows[0];
            this.formGroup.controls['yearofIndent'].patchValue(data.year);
            this.formGroup.controls['season'].patchValue(data.season_code);
            console.log("this.cropGroupDatasecond=============", this.cropGroupDatasecond);
            this.formGroup.controls['cropGroup'].patchValue(data.group_code);

            this.crop_names = data && data.crop_name ? data.crop_name : '';
            this.selected_group = data && data.group_name ? data.group_name : '';
            this.varietyNames = data && data.variety_name ? data.variety_name : ''
            // this.indentCropName(data.group_code)

            this.formGroup.controls['cropName'].patchValue(data.crop_code);
            this.formGroup.controls['cropType'].patchValue(data.crop_type);
            this.formGroup.controls['unitKgQ'].patchValue(data.unit);
            this.formGroup.controls['variety_items']['controls'][0].controls['varietyNotificationYear'].patchValue(data.variety_notification_year);
            this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].patchValue(data.variety_code);
            this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].patchValue(data.indent_quantity);
            // this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].value.variety_name =data.variety_id
          }
        });
      if (this.isView) {
        this.formGroup.controls['yearofIndent'].disable();
        this.formGroup.controls['season'].disable();
        this.formGroup.controls['cropGroup'].disable();
        this.formGroup.controls['cropName'].disable();
        this.formGroup.controls['cropType'].disable();
        // this.formGroup.controls['unitKgQ'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['varietyNotificationYear'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].disable();
      }
    }
  }

  // isSelected(varietyList) 
  //   console.log('this.formGroup.get',this.formGroup.value.find(item => varietyList === item.varietyList));
  //   // return this.formGroup.get('rows').value.find(item => varietyList === item.varietyList);
  // }

  // getCropGroupName(groupCode){
  //   console.log('this.cropGroupDatathis.cropGroupData',this.cropGroupData);
  // }
  // getCropName(cropCode){
  //   console.log('this.cropDataListthis.cropDataList',this.cropDataList);
  // }
  checkNumber($e) {
    checkNumber($e);
  }
  onlyNumberKey($e) {
    onlyNumberKey($e);
  }
  checkDecimal($e) {
    checkDecimal($e);
  }
  checkLength($e, length) {
    checkLength($e, length);
  }
  onPasteNumber(event: ClipboardEvent, field: string, length: string) {
    console.log(this.itemsArray.value)
    var alphaExp = '^[0-9]$';
    let len = parseInt(length)
    let clipboardData = event.clipboardData
    this.pastedNumber = clipboardData.getData('text');
    console.log(this.pastedNumber, 'this.pastedNumber')
    for (let i = 0; i < this.itemsArray.value.length; i++) {

      // console.log(this.itemsArray.value)
      if (this.pastedNumber.length > 8) {
        this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].patchValue(this.pastedNumber.slice(0, 8));
        // (document.getElementById(field) as HTMLInputElement).value='hiii'
        // console.log(i,'i')


      }
    }
    // if (this.formGroup.controls['indentQuantity']['controls'].get(field).value.match(alphaExp)) {

    //   if(this.formGroup.controls['indentQuantity']['controls'].get(field).value.length>len){
    //     // this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity']
    //     const value = this.formGroup.controls['indentQuantity']['controls'].get(field).value;
    //     this.formGroup.controls['indentQuantity']['controls'].get(field).setValue(value.substring(0,len))
    //   }
    //   else{
    //     this.formGroup.controls['indentQuantity']['controls'].get(field).setValue(this.formGroup.controls['indentQuantity']['controls'].get(field).value)
    //   }
    //   // return true
    // }
    // else {
    //   if(field=='latitude' || field=='longitude' ){
    //     let fieldName = this.pastedNumber.replace(/[^0-9\.]+/g,"").replace(/^\s+|\s+$/g, '');
    //     let value = parseInt(length)
    //     fieldName = this.formGroup.controls['indentQuantity']['controls'].get(field).value;
    //     this.formGroup.controls['indentQuantity']['controls'].get(field).setValue(fieldName.substring(0,value))
    //   }
    //   else{
    //     event.preventDefault();
    //     let fieldName = this.pastedNumber.replace(/\D/g, "").replace(/^\s+|\s+$/g, '');
    //     let value = parseInt(length)
    //     fieldName = this.formGroup.controls['indentQuantity']['controls'].get(field).value + fieldName;
    //     this.formGroup.controls['indentQuantity']['controls'].get(field).setValue(fieldName.substring(0,value))
    //   }
    //   // return false
    // }

  }
  checkValue(event) {
    // console.log(event.target.value)
    var charCode = (event.which) ? event.which : event.keyCode;
    let decimalValues = (event.target.value.toString()).split('.')[0];
    let decimalAfterValues = (event.target.value.toString()).split('.')[1];
    if (parseInt(charCode) == 17 || parseInt(charCode) == 8) {
      return true;
    }
    if (decimalValues && decimalValues.length > 7) {

      if (parseInt(charCode) == 17 || parseInt(charCode) == 8) {
        return true;
      }
      else {

        event.preventDefault();
        return false;
      }

    }
    if (decimalValues && decimalValues.length < 7) {
      let decimalValue = (event.target.value.toString()).split('.')[1];

      if (decimalValue && decimalValue.length > 1) {
        event.preventDefault();
        return false;
      }
      else {
        // return true
      }
      let res = event.target.value.indexOf(".") == -1;
      console.log((event.target.value.toString()).split('.'), 'event.target.value')
      let result = event.target.value.toString();
      // return true;
    }

  }
  group_select(data) {
    console.log(data, 'data')
    this.selected_group = data.group_name;
    this.formGroup.controls['cropGroup'].setValue(data.group_code)
    this.formGroup.controls['group_text'].setValue('')
  }
  cgClick() {
    document.getElementById('group_code').click();
  }
  cnClick() {
    document.getElementById('crop_name').click();
  }

  cropName(item: any) {
    this.crop_names = item.crop_name;
    // this.cropCode = item.crop_code;

    this.formGroup.controls['crop_name_text'].setValue('')
    this.formGroup.controls['cropName'].setValue(item.crop_code);

  }
  VarieyName(data, index, $event) {
    this.formGroup.controls['variety_items']['controls'][index].controls['varietyName'].setValue(data);
    this.formGroup.controls['variety_items']['controls'][index].controls['variety_name_text'].setValue('');
    this.varietyId = data && data.id ? data.id : ''

    this.getNoticeYear(data.id, index);
  }
  cvClick(i) {
    console.log('variety_name' + i)
    document.getElementById('variety_name' + i).click();
  }
  public onDropdownOptionSelect(option) {
    this.selectedOption = option.variety_name;
  }
  filterVarietyName(e, i) {

    console.log(e.target.value, i, 'inde',
      this.formGroup.controls['variety_items']['controls'][i].controls['variety_name_text'].value)
    if (e.target.value) {

      console.log(e.target.value)
      this.verietyArray = this.verietyArraySecond
      let response = this.verietyArray.filter(x => x.variety_name.toLowerCase().startsWith(e.target.value.toLowerCase()))

      this.verietyArray = response
      console.log(this.verietyArray)




    }
    else {

      this.getVarietyList(this.formGroup.controls['cropName'].value)
    }

  }
}
