import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth } from 'angular-mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { checkDecimal, checkLength, ConfirmAccountNumberValidator, convertDate, errorValidate, convertDates, convertDatetoDDMMYYYY, convertDatetoDDMMYYYYwithdash} from 'src/app/_helpers/utility';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';

// import {IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth} from 'angular-mydatepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ngbDropdownEvents } from 'src/app/_helpers/ngbDropdownEvents';


@Component({
  selector: 'app-generation-of-breeder-of-certificat',
  templateUrl: './generation-of-breeder-of-certificat.component.html',
  styleUrls: ['./generation-of-breeder-of-certificat.component.css']
})
export class GenerationOfBreederOfCertificatComponent extends ngbDropdownEvents implements OnInit {
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  enrollFormGroup!: FormGroup;
  isAlreadyPresent: boolean = false;
  isPreview: boolean = false;
  fileName = '';
  submitted = false;
  ngForm!: FormGroup;
  stateList: any = [];
  districtList: any = [];
  designationList: any;
  todayDate = new Date();
  agency_name: any;
  indentorsList: any = [];
  submitHide: boolean = true;

  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  isDraft: boolean = false;
  
  lot_numbers: any;

  unit: any;

  viewMode: boolean = false;
  editMode: boolean = false;
  createMode: boolean = true;
  isSubmitted = false;

  disabledfield: boolean = false;
  cancelbtn!: boolean;
  
  indentorData: any;
  selectDistricts;
  breederCategory;
  bank_name;
  select_state;
  updateBtn = false;
  acError: string;
  acDiv: boolean = false;

  currentUser = {id: 10, name: "xyz"}

  submissionid: any;
  response: any;
  public data = [];
  public settings = {};
  dropdownList = []

  title: string;
  cropVarietyData: any = [];
  lablesData: any = [];
  crop_name_list: any;

  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  cities: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};
  indentorDetails:any;
  seedTestingLabData: any;
  ImgError='';
  url='';
  modalRef: any;
  url_upload;
  labelNames:any;
  existingDetailsOfBreederCertificate: any;


  get enrollFormControls() {
    return this.enrollFormGroup.controls;
  }
  todaysDate: Date = new Date();
  parsedDate = Date.parse(this.todaysDate.toString());
  defaultMonth: IMyDefaultMonth = {
    defMonth: this.generateDefaultMonth,
    overrideSelection: false
  };
  get generateDefaultMonth(): string {
    let date = { year: this.todaysDate.getFullYear() , month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }

    console.log(date);
    return date.year + '-'
      + (date.month > 9 ? "" : "0") + date.month + '-'
      + (date.day > 9 ? "" : "0") + date.day;
      
  }

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    // disableSince: {}
    disableUntil: {year: 1930, month: 1, day: null},
    disableSince: { year: this.todaysDate.getFullYear() , month: (this.todaysDate.getMonth() + 1), day: this.todaysDate.getDate() + 1 }
  };
  onDateChanged(event: IMyDateModel): void {
    // date selected
  }
  preventKeyPress(event) {
    event.preventDefault();
  }

  yearofIntroduction!: Boolean;
  
 

yearOfIndent = [
    // { name: "2020-21", value: 2020 },
    // { name: "2021-22", value: 2021 },
    // { name: "2022-23", value: 2022 },
    { name: "2023-24", value: 2023 },
    { name: "2024-25", value: 2024 },
    { name: "2025-26", value: 2025 },
    { name: "2026-27", value: 2026 }
  ]

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private _serviceSeed: SeedServiceService,
    private breederService: BreederService,
    private modalService: BsModalService
  ) {
    super();
    this.createEnrollForm();
    this.loadcertificate();
    ["labelArray", 'netWeight', "leftOverAmount", "leftOverAmount", "season", "yearOfProduction", "date_of_inspection", "Date", "date_of_bill"].forEach(x=> {
      this.ngForm.controls[x].disable()
    })

    this.dropdownSettings = {
      enableCheckAll: false,
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
    };
  }

  // ['netWeight', 'variety_id', 'billNumber',  'date_of_inspection', 'leftOverAmount' 'date_of_bill', 'number_of_bags', 'upload', 'yearOfProduction',  'Date', 'season', 'labelArray', 'crop_code', 'selectedYear', 'indentOfBreederSeedId', 'indentOfBreederSeedId']
  createEnrollForm() {
    this.ngForm = this.fb.group({
      selectedYear: ['', [Validators.required]],
      indentOfBreederSeedId:['', [Validators.required]],
      crop_code: ['', [Validators.required]],
      variety_id: ['', [Validators.required]],
      Date: ['', [Validators.required]],
      season:['', [Validators.required]],
      labelArray: ['', [Validators.required]],
      netWeight: ['', [Validators.required]] ,
      yearOfProduction: ['', [Validators.required]],
      billNumber: ['', [Validators.required]],
      date_of_bill: ['', [Validators.required]],
      upload: [''],
      date_of_inspection: ['', [Validators.required]],
      leftOverAmount: ['', [Validators.required]]
    });

    if (this.router.url.includes('view')) {
      this.viewMode = true;
      this.editMode = false;
      this.createMode = false;
      this.ngForm.disable();

    }
    else if (this.router.url.includes('edit')) {
      this.viewMode = false;
      this.editMode = true;
      this.createMode = false;
    }
    else {
      this.viewMode = false;
      this.editMode = false;
      this.createMode = true;
    }

  }

  loadcertificate(){
    this.breederService.getRequestCreator("get-breeder-certificate").subscribe((data: any) => {
      console.log('certificate:', data)
      if (data.EncryptedResponse.status_code == 200) {
      }
    })
  }

  ngOnInit(): void {

    // localStorage.setItem('logined_user', "productionCenter");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }

    this.disabledfield = false;
    this.yearOfIndent.sort((a, b) => b.value - a.value)

    this.submissionid = this.route.snapshot.paramMap['params'].submissionId;


    this.loadYears();
    

    // ['season', 'netWeight', 'yearOfProduction', 'leftOverAmount', 'labelArray', 'date_of_bill', 'date_of_inspection', 'date'].forEach(x => {
    //   this.ngForm.controls[x].disable()
    // })

    this.ngForm.controls['labelArray'].valueChanges.subscribe(newValue => {

      console.log(this.unit)
      this.labelNames = this.lablesData.map(value => value.name).join(', ')
      console.log('newValue', newValue)
      let weight = 0;
      this.lablesData.forEach(tmp => {
        weight = weight + parseInt(tmp.weight)
      })
      let netWeight = this.unit == 'Quintal' ?  (weight/100) : weight
      this.ngForm.controls['netWeight'].patchValue(netWeight)

    })

    this.ngForm.controls['netWeight'].valueChanges.subscribe(newValue => {
       let value = parseFloat(this.indentorDetails.indent_quantity) - parseFloat(newValue) 
        this.ngForm.controls['leftOverAmount'].patchValue(value)
    })
    this.ngForm.controls['selectedYear'].valueChanges.subscribe(newValue => {
      if(newValue){
        this.ngForm.controls["Date"].setValue('');
        this.ngForm.controls["season"].setValue('');
        this.ngForm.controls["netWeight"].setValue('');
        this.ngForm.controls["yearOfProduction"].setValue('');
        this.ngForm.controls["billNumber"].setValue('');
        this.ngForm.controls["date_of_bill"].setValue('');
        this.ngForm.controls["date_of_inspection"].setValue('');
        this.ngForm.controls["leftOverAmount"].setValue('');
        this.labelNames='';
      }

   })
   this.ngForm.controls['crop_code'].valueChanges.subscribe(newValue => {
    if(newValue){
      this.ngForm.controls["Date"].setValue('');
      this.ngForm.controls["season"].setValue('');
      this.ngForm.controls["netWeight"].setValue('');
      this.ngForm.controls["yearOfProduction"].setValue('');
      this.ngForm.controls["billNumber"].setValue('')
      this.ngForm.controls["date_of_bill"].setValue('');
      this.ngForm.controls["date_of_inspection"].setValue('');
      this.ngForm.controls["leftOverAmount"].setValue('');
      this.labelNames='';
    }

 })
 this.ngForm.controls['variety_id'].valueChanges.subscribe(newValue => {
  if(newValue){
    this.ngForm.controls["Date"].setValue('');
    this.ngForm.controls["season"].setValue('');
    this.ngForm.controls["netWeight"].setValue('');
    this.ngForm.controls["yearOfProduction"].setValue('');
    this.ngForm.controls["billNumber"].setValue('');
    this.ngForm.controls["date_of_bill"].setValue('');
    this.ngForm.controls["date_of_inspection"].setValue('');
    this.ngForm.controls["leftOverAmount"].setValue('');
    this.labelNames='';
  }

})
this.ngForm.controls['indentOfBreederSeedId'].valueChanges.subscribe(newValue => {
  if(newValue){
    this.ngForm.controls["Date"].setValue('');
    this.ngForm.controls["season"].setValue('');
    this.ngForm.controls["netWeight"].setValue('');
    this.ngForm.controls["yearOfProduction"].setValue('');
    this.ngForm.controls["billNumber"].setValue('');
    this.ngForm.controls["date_of_bill"].setValue('');
    this.ngForm.controls["date_of_inspection"].setValue('');
    this.ngForm.controls["leftOverAmount"].setValue('');
    this.labelNames='';
  }

})
  }

  createLablesData(lables) {
    this.lablesData = []
    lables.forEach(x => {
      this.lablesData.push({item_text:x.generated_label_name,  name: x.generated_label_name, weight: x.label_number_for_breederseed.weight, id: x.id, item_id: x.id})
    })
  }

  checkLength($e, length) {
    checkLength($e, length);
  }

  changeLable(e){
    console.log('selected Lable', e)
  }

  isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {

      return false;
    }
    else {

      return true;
    }

  }
  checkDecimal(e) {
    checkDecimal(e)
  }

  createIndentor(indentors){
    indentors.forEach((x: any, index: number) => {
      this.indentorsList.push({name: x.user.name, id: x.id})
    })
  }
  getIndentorDatathruYear(selectYear){
    this.crop_name_list = []
    this.indentorsList = []
    this.cropVarietyData = []
    this.ngForm.controls['indentOfBreederSeedId'].patchValue('')
    this.ngForm.controls['crop_code'].patchValue('')
    this.ngForm.controls['variety_id'].patchValue('')
    this.breederService.getRequestCreator("get-breeder-certificate-crop-list?yearOfIndent=" + selectYear).subscribe((data: any) => {
    // this.breederService.getRequestCreator("get-breeder-certificate-indentors?yearOfIndent=" + selectYear).subscribe((data: any) => {
      console.log('indentorsList', data)
      this.crop_name_list = [];
      if (data && data.EncryptedResponse && data.EncryptedResponse && data.EncryptedResponse.status_code == 200 && data.EncryptedResponse.data && data.EncryptedResponse.data.length > 0) {
        // this.createIndentor(data.EncryptedResponse.data)
        data.EncryptedResponse.data.forEach(x => {
          var object = {
            crop_name: x['m_crop.crop_name'],
            crop_code: x['crop_code']
          }
          this.crop_name_list.push(object);
        });
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Indenter Not Found in Selected Year" 
        })
      }
    })
  }

  loadIndentor(selectedData){
    console.log(selectedData)
    this.indentorsList = []
    this.ngForm.controls['indentOfBreederSeedId'].patchValue('')
    this.breederService.getRequestCreator("get-breeder-certificate-indentors?y&cropName="+selectedData.crop_code+"&yearOfIndent="+selectedData.selectedYear+"&cropVariety="+selectedData.variety_id).subscribe((data: any) => {
      console.log(data)
      if (data && data.EncryptedResponse && data.EncryptedResponse && data.EncryptedResponse.status_code == 200 && data.EncryptedResponse.data && data.EncryptedResponse.data.length > 0) {
        this.createIndentor(data.EncryptedResponse.data)
      }
    })
      
  }

  getCropVarietyData(paramsData) {
    this.indentorsList = []
    this.cropVarietyData = []
    this.ngForm.controls['indentOfBreederSeedId'].patchValue('')
    this.ngForm.controls['variety_id'].patchValue('')
    console.log(paramsData)
    let crop_code = paramsData.crop_code
    this.unit = this.getQuantityMeasure(crop_code)
    this.breederService.getRequestCreator("get-breeder-certificate-variety-name?cropName="+paramsData.crop_code+"&yearOfIndent="+paramsData.selectedYear).subscribe((data: any) => {
      console.log('variety', data)
      if (data && data.EncryptedResponse && data.EncryptedResponse && data.EncryptedResponse.status_code == 200 && data.EncryptedResponse.data && data.EncryptedResponse.data.length > 0) {
        data.EncryptedResponse.data.forEach(x => {
          var object = {
            id: x.m_crop_variety.id,
            variety_name: x.m_crop_variety.variety_name
          }
          this.cropVarietyData.push(object)
        });
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Variety Not Found" 
        })
      }
    })
  }


  downloadPDF(pdf) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "abc.pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  getAllDetail(selectedData){
    this.isAlreadyPresent = false;
    this.isPreview = false;
    this.breederService.getRequestCreatorNew("get-breeder-certificate?indentorId="+selectedData.indentOfBreederSeedId+"&cropName="+selectedData.crop_code+"&yearOfIndent="+selectedData.selectedYear+"&cropVariety="+selectedData.variety_id+"&userId="+this.currentUser.id).subscribe((data: any) => {
    
      this.existingDetailsOfBreederCertificate = data && data.EncryptedResponse && data.EncryptedResponse.data ?  data.EncryptedResponse.data:'';
    
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({icon: 'success',title: 'Great...',text: "Certificate is already present" })
        this.isAlreadyPresent = false;
        this.isPreview = true;
        let allDeatils = data.EncryptedResponse.data
        this.indentorDetails = allDeatils;
        this.ngForm.controls['season'].patchValue(allDeatils.season)
        this.ngForm.controls['billNumber'].patchValue(allDeatils.bill_number)
        this.ngForm.controls['date_of_inspection'].patchValue(convertDatetoDDMMYYYYwithdash(allDeatils.date_of_inspection))
        let dateOne = allDeatils.generation_date;
          let convert_new_generation_date = convertDatetoDDMMYYYYwithdash(dateOne);

        this.ngForm.controls['Date'].patchValue(
          convertDatetoDDMMYYYYwithdash(allDeatils.generation_date)
          // {
          //   dateRange: null,
          //   isRange: false,
          //   singleDate: {
          //     formatted: convert_new_generation_date,
          //     jsDate: new Date(convert_new_generation_date)
          //   }
          // }
        );
        let datetwo = allDeatils.date_of_bill;
          let convert_new_date_of_bill = convertDatetoDDMMYYYYwithdash(datetwo);

        this.ngForm.controls['date_of_bill'].patchValue(convertDatetoDDMMYYYYwithdash(allDeatils.date_of_bill)
          // {
          //   dateRange: null,
          //   isRange: false,
          //   singleDate: {
          //     formatted: convert_new_date_of_bill,
          //     jsDate: new Date(convert_new_date_of_bill)
          //   }
          // }
        );
        let datethree = allDeatils.date_of_inspection;
        let convert_new_date_of_inspection = convertDatetoDDMMYYYY(datethree);

        // this.ngForm.controls['date_of_inspection'].patchValue(
        //   {
        //     dateRange: null,
        //     isRange: false,
        //     singleDate: {
        //       formatted: convert_new_date_of_inspection,
        //       jsDate: new Date(convert_new_date_of_inspection)
        //     }
        //   }
        // );
        // this.ngForm.controls['Date'].patchValue(allDeatils.generation_date)
        // this.ngForm.controls['date_of_bill'].patchValue(allDeatils.date_of_bill)
        
        let lables = allDeatils.label_number? allDeatils.label_number.split(',') : []
        this.labelNames = lables
       
        lables.forEach((l) => {
          this.lablesData.push({name: l, value: l, item_text: l})
        })
        this.ngForm.controls['labelArray'].patchValue(this.lablesData)
        this.ngForm.controls['netWeight'].patchValue(allDeatils.net_weight)
        this.ngForm.controls['leftOverAmount'].patchValue(allDeatils.left_over_amount)
        this.ngForm.controls['yearOfProduction'].patchValue(allDeatils.year_of_production)
      }
      else
      {
        this.breederService.getRequestCreatorNew("get-breeder-certificate-variety-list?indentorId="+selectedData.indentOfBreederSeedId+"&cropName="+selectedData.crop_code+"&yearOfIndent="+selectedData.selectedYear+"&cropVariety="+selectedData.variety_id).subscribe((data: any) => {
       
          this.isAlreadyPresent = true;
          if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
            let allDeatils = data.EncryptedResponse.data[0] 
            this.indentorDetails = allDeatils;
            // this.makeEditableFields()
            this.createLablesData(allDeatils.bsp5bLabels? allDeatils.bsp5bLabels : [])
            let r = (Math.random() + 3).toString(36).substring(7);
            this.ngForm.controls['season'].patchValue(allDeatils.m_crop&& allDeatils.m_crop.season && allDeatils.m_crop.season.season ? allDeatils.m_crop.season.season : 'N/A')
            this.ngForm.controls['billNumber'].patchValue(''+ r.toUpperCase() || (Math.random() + 1).toString(36).substring(7))
            this.ngForm.controls['labelArray'].patchValue(this.lablesData)
            this.ngForm.controls['date_of_bill'].patchValue(convertDatetoDDMMYYYY(new Date()))
            this.ngForm.controls['Date'].patchValue(convertDatetoDDMMYYYY(new Date()))
            this.ngForm.controls['date_of_inspection'].patchValue(convertDatetoDDMMYYYY(allDeatils.dateOfInspection))
            this.ngForm.controls['yearOfProduction'].patchValue(convertDatetoDDMMYYYY( allDeatils.yearOfProduction ? allDeatils.yearOfProduction : new Date()))
          }
        });
      }
    });
  }

  downloadImage(e){

    console.log(this.indentorDetails)
  }

  makeEditableFields(){
    ["labelArray", "date_of_inspection", "Date", "date_of_bill"].forEach(x=> {
      this.ngForm.controls[x].enable()
    })
  }

  loadYears(): void {}


  uploadImage() {
    (document.getElementById('fileInput') as HTMLInputElement).click();
  }

  getQuantityMeasure(crop_code){
    return crop_code.split('')[0] == 'A' ? 'Quintal': 'Kg'
  }


  onSelect(event) {
    const file:File = event.target.files[0];
    if (file) {
      
      this.fileName = file.name;            
      const reader = new FileReader();
      reader.readAsDataURL(file);
      let result = null;
      
      reader.onload = (event) => {
        this.ngForm.value.upload = {name: file.name, photo: reader.result, "extension": "jpeg"}
       
        // console.log(,'this.url');
     this.url_upload=event.target.result;   
      };
      
    }
  }

  create(params){
    Swal.fire({
      title: 'Saving...',
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null)
      }
    });
    this.breederService.postRequestCreator("add-breeder-certificate",null, params).subscribe((data: any) => {
      console.log("after create sub:", data)
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your details has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['production-center/generation-of-breeder-certificate/view/'+ data.EncryptedResponse.data[0]['id']]);
      }else{
        Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
      }
    })
  }

  update(params){
    this.breederService.postRequestCreator("edit-bsp3",null, params).subscribe((data: any) => {    
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
        this.router.navigate(['breeder-seed-certificate']);
      }else{
        Swal.fire('Error', 'Please Fill the All Details Correctly.', 'error');
      }
    })
  }

  onSubmit(){

    if (this.ngForm.invalid){
      Swal.fire('Error', 'Please Fill Out all Required Fields.', 'error');
      return;
    }
    let formData = this.ngForm.controls
    let params = [];
    this.isSubmitted = true;
    params.push({
      "bill_number": formData['billNumber'].value,
      "crop_code": formData['crop_code'].value,
      "date_of_bill": convertDates(formData['date_of_bill'].value),
      "date_of_inspection": convertDates(formData['date_of_inspection'].value),
      "generation_date": convertDates(formData['Date'].value),
      "indent_of_breederseed_id": formData['indentOfBreederSeedId'].value,
      "label_number": '' + [formData['labelArray'].value.map(a => a.item_text)],
      "left_over_amount": formData['leftOverAmount'].value,
      "net_weight": formData['netWeight'].value,
      "year": formData['selectedYear'].value,
      "year_of_production": formData['yearOfProduction'].value,
      "season": formData['season'].value,
      "is_active": 1,
      "upload": 'N/A',
      "user_id": this.currentUser.id,
      "variety_id": formData['variety_id'].value,
      // "serial_number":001,
      "serial_number_update":1
      
      
    })


    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: 'btn btn-danger ml-3',
        confirmButton: 'btn btn-success ml-3',
      },
      buttonsStyling: false
    })
    let unit= this.unit

    var swal_html = '<div class="panel pb-2" style="background:aliceblue;font-weight:bold"><div class="panel-heading panel-info text-center btn-info"> <b>Certificate Data</b> </div> <div class="panel-body"><table style="width: 100%;"><tr><th style="text-align: left;white-space:nowrap">Bill Number</th><th style="text-align: right;">'+params[0]["bill_number"]+'</th></tr><tr><th style="text-align: left;">Season</th><th style="text-align: right;">'+params[0]["season"]+'</th></tr><tr><th style="text-align: left;white-space:nowrap;">Bill Date</th><th style="text-align: right;">'+params[0]["date_of_bill"]+'</th></tr><tr><th style="text-align: left;white-space:nowrap;">Inspection Date</th><th style="text-align: right;">'+params[0]["date_of_inspection"]+'</th></tr><tr><th style="text-align: left;white-space:nowrap;">Generation Date</th><th style="text-align: right;">'+params[0]["generation_date"]+'</th></tr><tr><th style="text-align: left;">Label</th><th style="text-align: right;">'+params[0]["label_number"]+'</th></tr><tr><th style="text-align: left;white-space:nowrap;">Left Over Amount</th><th style="text-align: right;">'+params[0]["left_over_amount"]+ unit +'</th></tr class="pb-3"><tr><th style="text-align: left;" class="pt-2">Net Weight</th><th style="text-align: right;">'+params[0]
    ["net_weight"]+ unit +'</th></tr></table></div></div>';
    
    swalWithBootstrapButtons.fire({
      title: 'Confirm?',
      text: "Confirm the data entered before generating the certificate as it can’t be edited and generated later",
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
          denyButtonText: `Don't Save, Close`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            console.log('params[0]', params)
            this.create(params)
          } else if (result.isDenied) {
            Swal.fire('Changes Are Not Saved', '', 'info')
          }
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary data is safe ',
          'error'
        )
      }
    })

    // this.isEdit ? this.update(params[0]) : 
  }

  togglebtn(){
    // alert('hii')
    var checkList = (document.getElementById('list1'));
(checkList.getElementsByClassName('anchor')[0] as HTMLElement).onclick = function(evt) {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}
  }
  viewUploadedDoc(template: any) {
    // if (this.ImgError == '') {
      if (this.url_upload != '') {

        this.modalRef = this.modalService.show(template, {
          class: 'modal-dialog-centered modal-md'
        });
      }
    // }

    else {
      this.modalService.hide()
    }
  }
  closeModal(){
  //  const data= (document.getElementById('filePreviewModal')as H).ej2_instances[0];
  //  data.destroy()

  }
 
navigate(){
  // /production-center/generation-of-breeder-certificate/view/{{indentorDetails.id}}"
  // get-breeder-certificate-serial-num
  console.log(this.existingDetailsOfBreederCertificate)
  const param = {
                bill_number: this.existingDetailsOfBreederCertificate.bill_number,
                crop_code: this.existingDetailsOfBreederCertificate.crop_code,
                id:this.existingDetailsOfBreederCertificate.id,
                date_of_bill: this.existingDetailsOfBreederCertificate.date_of_bill,
                date_of_inspection: this.existingDetailsOfBreederCertificate.date_of_inspection,
                generation_date: this.existingDetailsOfBreederCertificate.generation_date,
                indent_of_breederseed_id: this.existingDetailsOfBreederCertificate.indent_of_breederseed_id,
                is_active: this.existingDetailsOfBreederCertificate.is_active,
                label_number: this.existingDetailsOfBreederCertificate.label_number,
                left_over_amount: this.existingDetailsOfBreederCertificate.left_over_amount,
                net_weight: this.existingDetailsOfBreederCertificate.net_weight,
                season: this.existingDetailsOfBreederCertificate.season,
                upload: this.existingDetailsOfBreederCertificate.upload,
                user_id: this.existingDetailsOfBreederCertificate.user_id,
                variety_id: this.existingDetailsOfBreederCertificate.variety_id,
                year: this.existingDetailsOfBreederCertificate.year,
                year_of_production: this.existingDetailsOfBreederCertificate.year_of_production,
                serial_number_update:this.existingDetailsOfBreederCertificate.serial_number_update=='' || this.existingDetailsOfBreederCertificate.serial_number_update==null ||
                this.existingDetailsOfBreederCertificate.serial_number_update==undefined ? 0: parseInt(this.existingDetailsOfBreederCertificate.serial_number_update)
  }



  const result = this.breederService.postRequestCreator('get-breeder-certificate-serial-number',null,param).subscribe(apiresponse=>{
    console.log(apiresponse,'api')
    if(apiresponse && apiresponse.EncryptedResponse  && apiresponse.EncryptedResponse.status_code==200){
      this.router.navigate(['production-center/generation-of-breeder-certificate/view/'+ this.indentorDetails.id])
    }
    else{
      return ;
    }
  })

  
  // this.router.navigate(['production-center/generation-of-breeder-certificate/view/'+ this.indentorDetails.id])
}
}
