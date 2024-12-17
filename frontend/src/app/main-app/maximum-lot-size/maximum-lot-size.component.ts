import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';
import { SeedDivisionService } from 'src/app/services/seed-division/seed-division.service';
import Swal from 'sweetalert2';
import { checkAlpha, checkLength, checkNumber, checkDecimal, errorValidate } from 'src/app/_helpers/utility';
import { HttpClient } from '@angular/common/http';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';


@Component({
  selector: 'app-maximum-lot-size',
  templateUrl: './maximum-lot-size.component.html',
  styleUrls: ['./maximum-lot-size.component.css']
})
export class MaximumLotSizeComponent extends ngbDropdownEvents implements OnInit {

  ngForm: FormGroup;
  submitted = false;
  formData;
  isEdit: any;
  isView: any;
  submissionId: number;
  cropDataList: any;
  groupCropData: any;
  crop_names;
  cropNameValue: any;
  groupCodeValue: any;
  groupName: any;
  cropCode: any;
  cropType: string;
  maxLotError: string;
  enable = true
  max_lot_size: any;
  crop_name: any;
  crop_name_value: any;
  cropNameError: string;
  userId: any;
  checked: boolean;
  isActive: number = 1;
  ipAddres: any;
  historyData =
  {
    action: '',
    comment: '',
    formType: ''
  }
  cropDataNameList: any;
  cropCodeValue: any;
  selected_crop_group;
  disabledfield: boolean = false;
  groupCropDataSecond: any;
  cropDataListsecond: any;
  lotsizeError: string;
  constructor(
    private fb: FormBuilder,
    private _serviceSeed: SeedDivisionService,
    private route: Router,
    private http:HttpClient,
    activatedRoute: ActivatedRoute,
    private masterService: MasterService,

  ) {
    super();
    this.createForm();
    const params: any = activatedRoute.snapshot.params;
    if (params["id"]) {
      this.submissionId = parseInt(params["id"]);
    }
    this.isEdit = route.url.indexOf("edit") > 0;
    this.isView = route.url.indexOf("view") > 0;
    if (this.route.url.indexOf("edit")) {
      // this.enable = false;
    }

    // this.isDraft = router.url.indexOf("edit/draft") > 0;
  }

  createForm() {
    this.ngForm = this.fb.group({
      crop_group: ['', [Validators.required]],
      crop_name: ['', [Validators.required]],
      maximum_lot_size: ['', Validators.required],
      status_toggle: [''],
      group_text:[''],
      name_text:[''],
      crop_type:['']
    });

  }

  ngOnInit(): void {
    // this.cropData();
    this.getCropData();
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.getIPAddress();

    //get user data from localstorage
    let user = localStorage.getItem('BHTCurrentUser')
    console.log('userDatat',);
    this.userId = JSON.parse(user)


    if (this.isEdit || this.isView) {
      // this.enable = false;
      this._serviceSeed.postRequestCreator("get-crop-max-lot-size-data", {
        search:
          { id: this.submissionId, }

      }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          let allData = data.EncryptedResponse.data.rows;
          this.patchForm(allData);
        }
      });

    }
    this.ngForm.controls['crop_group'].valueChanges.subscribe(newvalue => {
      if(newvalue){
        this.getCropNameList(newvalue)
        console.log(newvalue)         
        this.crop_names='';
        this.ngForm.controls['crop_name'].setValue('')
          if(newvalue.charAt(0)=='H'){
            this.ngForm.controls['crop_type'].setValue('Horticulture')
          }
          else{
            this.ngForm.controls['crop_type'].setValue('Agriculture')
          }
        
      }
      // this.getCropList(newvalue);
    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
       
        if (this.route.url.includes('edit')) {
          if (newvalue == this.max_lot_size) {
            this.enable = false;
          }
          else {
            this.enable = true;
          }
        }
        this.maxLotError = "";
        this.cropNameError = '';
        this.getCropCode(newvalue,null);
      }
    })
    this.ngForm.controls['maximum_lot_size'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.maxLotError = ""
      }
    })
    this.ngForm.controls['group_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // console.log(newValue)
        this.groupCropData =this.groupCropDataSecond
        let response= this.groupCropData.filter(x=>x.group_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.groupCropData=response              
      }
      else{
       this.getCropData()
      }
    });
    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        // console.log(newValue)
        this.cropDataList =this.cropDataListsecond
        let response=  this.cropDataList.filter(x=>x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
      
        this.cropDataList=response              
      }
      else{
       this.getCropList()
      }
    });
  }
  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddres = res.ip;
      console.log('ip=======address', this.ipAddres);
    });
  }
  audtiTrailsHistory(historyData) {

    this._serviceSeed.postRequestCreator('audit-trail-history', {
      "action_at": historyData.action,
      "action_by": this.userId.name,
      "application_id": "1234",
      "column_id": this.submissionId ? this.submissionId : '',
      "comment": historyData.comment,
      "form_type": historyData.formType,
      "ip": this.ipAddres,
      "mac_number": "12345678",
      "table_id": this.submissionId ? this.submissionId : ''
    }).subscribe(res => {

    });
  }
  checkAlpha(event) {
    checkAlpha(event)
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  checkNumber($e) {
    checkNumber($e);
  }
  checkDecimal($e) {
    checkDecimal($e);
  }
  // cropData() {
  //   this._serviceSeed.getRequestCreatorNew("get-crop1").subscribe((data: any) => {
  //     this.cropDataList = data.EncryptedResponse.data.rows;
  //   });
  // }

  getCropList(){
    let cropNameArr=[]
   
    for (let index=0;index<this.cropDataNameList.length;index++){
      console.log(this.cropDataNameList[index]['m_crop.crop_code'])
      cropNameArr.push(this.cropDataNameList[index]['m_crop.crop_name'])
    }
    const filteredArr = cropNameArr.filter(item => item !== null);
console.log('filteredArr-===========>?',filteredArr)
    const searchField = {
      "search":{
        "group_code":this.ngForm.controls['crop_group'].value,
        "crop_code":filteredArr
      }
    }
    this._serviceSeed
      .postRequestCreator("getdistinctMaximumCropNameList",searchField)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          let groupData = apiResponse.EncryptedResponse.data.rows;
          if(groupData && groupData.length > 0){
            this.cropDataList = groupData;
            this.cropDataListsecond= this.cropDataList
            this.ngForm.controls['crop_name'].enable();
          }else{
            this.cropDataList = [];
          }
        }
      });
  } 
  getCropNameList(group_code){
    const searchField = {
      "search":{
        "group_code":group_code,
      }
    }
    this._serviceSeed
      .postRequestCreator("getMaximumCropNameList",searchField)
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          let groupData = apiResponse.EncryptedResponse.data.rows;
          if(groupData && groupData.length > 0){
            this.cropDataNameList = groupData;
            this.cropDataNameList = this.cropDataNameList.filter((item, index) => {
              return index === this.cropDataNameList.findIndex(obj => {
                return obj['m_crop.crop_name'] === item['m_crop.crop_name'];
              });
            });
            this.getCropList()
            // this.ngForm.controls['crop_name'].enable();
          }else{
            this.cropDataNameList = [];
            this.getCropList()
          }
        }
      });
  } 

  patchForm(data: any) {
    if (this.isView) {
      this.ngForm.disable();
    }
    if (this.isEdit) {
      this.ngForm.controls['crop_name'].disable();
      this.ngForm.controls['crop_group'].disable();

    }
    if (data && data.length > 0) {
      if (data && data[0] && data[0].crop_code) {
        if ((data[0].crop_code).slice(0, 1) == 'H') {
          this.cropType = "Kg"
        }
        if ((data[0].crop_code).slice(0, 1) == 'A') {
          this.cropType = "Qt"
        }
      } else {
      }
      //implement isActive toggle
      if (data[0].is_active == 0) {
        this.ngForm.controls['status_toggle'].patchValue(false);
        this.isShowDiv = true ;
        this.isActive = 0;
      }
      if (data[0].is_active == 1) {
        this.isShowDiv = false ;
        this.ngForm.controls['status_toggle'].patchValue(true);
        this.isActive = 1;
      }
      //finish isActive toggle
      // this.crop_names =data && data[0].m_crop && data[0].m_crop.crop_name ? data[0].m_crop.crop_name :'';
      this.ngForm.controls["crop_name"].patchValue(data && data[0] && data[0].crop_code ? data[0].crop_code :'');
      this.ngForm.controls["crop_group"].patchValue(data[0] && data[0].m_crop && data[0].m_crop.m_crop_group && data[0].m_crop.m_crop_group.group_code ? data[0].m_crop.m_crop_group.group_code :'' );
      this.getCropCode(data && data[0].m_crop && data[0].m_crop.crop_name ? data[0].m_crop.crop_name :'',null)
      // this.cropName(data[0].crop)
      this.crop_names = data && data[0].m_crop && data[0].m_crop.crop_name ? data[0].m_crop.crop_name:'';
      this.cropCode = data && data[0] && data[0].crop_code ? data[0].crop_code :'';
      console.log('hhshshsh=====================',data[0].crop_code);
      this.ngForm.controls["name_text"].patchValue(data && data[0] && data[0].crop_code ? data[0].crop_code :'');
      this.groupCodeValue = data && data[0] && data[0].group_code ? data[0].group_code : '';
      this.groupName = data && data[0] && data[0].group_name ? data[0].group_name : '';
      this.ngForm.controls["maximum_lot_size"].patchValue(data[0].max_lot_size);
      this.max_lot_size = data[0].max_lot_size;
      this.crop_name_value = data && data[0].m_crop && data[0].m_crop.crop_name ? data[0].m_crop.crop_name :''
      this.selected_crop_group= data && data[0].m_crop && data[0].m_crop.crop_group ? data[0].m_crop.crop_group : data && data[0].group_name  ? data[0].group_name :''
    }
  }
  cropName(data) {
    console.log("cropNamecropName", data, (data.crop_code).slice(0, 1))
    if (data.crop_code) {
      if ((data.crop_code).slice(0, 1) == 'A') {
        this.cropType = "Qt"
      } else if ((data.crop_code).slice(0, 1) == 'H') {
        this.cropType = "Kg"
      }
    } else {
    }
    this.cropNameValue = data.crop_name;
    this.groupCodeValue = data.group_code;
    this.crop_names = this.cropNameValue;

    this.ngForm.controls['crop_name'].setValue(this.cropNameValue);
    console.log(this.cropNameValue,data)
    this.cropCodeValue=data.crop_code
    let datas = this.groupCropData.filter(x => (x.group_code) == this.groupCodeValue);
    this.groupName = datas && datas[0] && datas[0].group_name ? datas[0].group_name : '';
    this.ngForm.controls['name_text'].setValue('')
  }
  async getCropData() {
    this._serviceSeed
      .postRequestCreator("crop-group")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          let groupData = apiResponse.EncryptedResponse.data;
          if(groupData && groupData.length > 0){
            this.groupCropData = groupData;
            this.groupCropDataSecond = this.groupCropData
          }else{
            this.groupCropData = [];
          }
        }
      });

  }
  async getCropCode(newvalue,id) {
    if (newvalue) {
      const search = {
        "search": {
          "crop_name": newvalue
        }
      };
      this._serviceSeed
        .postRequestCreator("get-crop-code", search)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.cropCode = apiResponse.EncryptedResponse.data[0].crop_code;
          }
        });
    };
  }
  enrollFormSave() {
    let crop = this.ngForm.controls['crop_name'].value;
    this.submitted = true;


    if (this.ngForm.invalid) {
      return;
    }
    let route = "add-crop-max-lot-size-data";
    const data = {
      // crop: this.ngForm.controls['crop_name'].value,
      user_id: this.userId.id ? this.userId.id : '',
      crop: this.cropNameValue ? this.cropNameValue : '',
      max_lot_size: (this.ngForm.controls['maximum_lot_size'].value).toString(),
      group_code: this.groupCodeValue ? this.groupCodeValue : '',
      group_name: this.groupName ? this.groupName : '',
      crop_code: this.cropCode,

    };

    this._serviceSeed.postRequestCreator(route, data).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.historyData.action = "Add";
        this.historyData.comment = "Add Form successfully";
        this.historyData.formType = "maximum lot size";

        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
            showCancelButton: false,
            confirmButtonColor: '#E97E15'
        }).then(x=>{
          this.route.navigateByUrl('/maximum-lot-size-list');
        })
      
      } else {
      }
    });
  }
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  updateFormSave() {
    this.submitted = true;
    if (this.ngForm.controls['status_toggle'].value == true) {
      this.isActive = 1;
    } else {
      this.isActive = 0;
    }
    if(this.isEdit || this.isView){
      this.ngForm.controls['crop_name'].patchValue(this.cropCode);  
    }
    
    if (this.ngForm.invalid) {
      return;
    }
    console.log(this.isActive);
    let route = "update-crop-max-lot-size-data";
    const data = {
      id: this.submissionId ? this.submissionId : '',
      updated_by: this.userId.id ? this.userId.id : '',
      crop: this.cropCode,
      max_lot_size: (this.ngForm.controls['maximum_lot_size'].value).toString(),
      group_code: this.groupCodeValue ? this.groupCodeValue : '',
      group_name: this.groupName ? this.groupName : '',
      crop_code: this.cropCode,
      active: this.isActive,
      // 
    };

    this._serviceSeed.postRequestCreator(route, data).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.historyData.action = "updated";
        this.historyData.comment = "updated Form ";
        this.historyData.formType = "maximum lot size";

        this.audtiTrailsHistory(this.historyData);
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
            confirmButtonColor: '#E97E15'
        }).then(x=>{
          this.route.navigateByUrl('/maximum-lot-size-list'); 
        })
       
      } else {
      }
    });
  }
  isShowDiv = false;


  submitForm(formData) { }
  cgClick() {
    document.getElementById('crop_name').click();
  }

  checkMaxLotname() {
    if(this.ngForm.controls['maximum_lot_size'].value<=0){
      this.lotsizeError="Maximum Lot Size can't be zero"
      return;
    }else{
      this.lotsizeError='';
    }

    // if (this.enable) {
    const param = {
      search: {
        crop: this.ngForm.controls['crop_name'].value,
        // max_lot_size: (this.ngForm.controls['maximum_lot_size'].value).toString(),
      }
    }
    if (this.route.url.includes('edit')) {
      if (this.ngForm.controls['crop_name'].value == this.crop_name_value) {

        // if(this.ngForm.controls["maximum_lot_size"].value==this.max_lot_size){
        this.enable = false
        // }
      }
    }

    if (this.enable) {


      this._serviceSeed.postRequestCreator('check-max-lot-size-already', param, null).subscribe(apiResponse => {


        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data
          && apiResponse.EncryptedResponse.data.inValid) {
          this.cropNameError = 'Crop Name Already Registered.'

          // return;
        }
        else {
          if (this.route.url.includes('edit')) {
            this.updateFormSave();
          }
          else {
            this.enrollFormSave();
          }
          // this.cropNameError=' ';
          // this.enrollFormSave(this.ngForm.value)
        }

      });
    }
    else {
      if (this.route.url.includes('edit')) {
        this.updateFormSave();
      }
      else {
        this.enrollFormSave();
      }

    }
  }

  group(data){
    console.log('dataaa',data)
    this.selected_crop_group=data.group_name
    this.ngForm.controls['crop_group'].setValue(data.group_code)
    this.ngForm.controls['group_text'].setValue('')
  }
  validateInput(event:KeyboardEvent) {
    // Get the current input value
    // console.log(e,'e')e
    // let input = event.value;
    // console.log(input,'input')
    // if (event.keyCode == 8) {
    //   return;
    // }
    // // Check if input is a valid number with at most two decimal places
    // if (/^\d*\.?\d{0,2}$/.test(input)) {
    //   // Input is valid
    // } else {
    //   // Input is invalid, prevent further input
    //   event.preventDefault();
    // }
    const keyCode = event.which ? event.which : event.keyCode;

    // Allow backspace, delete, and decimal point (.)
    if (keyCode === 8 || keyCode === 46 || keyCode === 110 || keyCode === 190) {
      const inputValue = (event.target as HTMLInputElement).value;
      let dotCount = inputValue.split('.').length - 1;
      if(dotCount>0){
        // alert(dotCount)e
        event.preventDefault();
        return false;
      }
      // If a decimal point already exists, prevent adding another
      if (inputValue.includes('.') && (keyCode === 110 || keyCode === 190)) {
        event.preventDefault();
        return false;
      }

      // Allow backspace and delete
      return true;
    }

    // Allow digits (0-9)
    if (keyCode >= 48 && keyCode <= 57) {
      const inputValue = (event.target as HTMLInputElement).value;

      // Check if there's already a decimal point
      if (inputValue.includes('.')) {
        let dotCount = inputValue.split('.').length - 1;
        if(dotCount>1){
          // alert(dotCount)e
          event.preventDefault();
          return false;
        }
        // If a decimal point is present, allow only digits after it
        if (inputValue.split('.')[1].length < 3) {
          return true;
        }
      } else {
        // If there's no decimal point, allow digits
        return true;
      }
    }

    // Prevent any other characters
    event.preventDefault();
    return false;

  }
}

