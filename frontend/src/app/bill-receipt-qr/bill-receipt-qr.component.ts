import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2'; 
import * as XLSX from 'xlsx';
import * as html2pdf from 'html2pdf.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as html2PDF from 'html2pdf.js';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import * as CryptoJS from 'crypto-js';



@Component({
  selector: 'app-bill-receipt-qr',
  templateUrl: './bill-receipt-qr.component.html',
  styleUrls: ['./bill-receipt-qr.component.css']
})
export class BillReceiptQrComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any; 
  inventoryVarietyData: any;
  datatodisplay = [];
  isSearch: boolean;
  isCrop: boolean;
  showTab: boolean;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any; 
  selectedItems = []; 
  isDisabled: boolean = true; 
  
  yearOfIndent = [
    {
      'year': '2024-2025',
      'value': '2024'
    },
    {
      'year': '2023-2024',
      'value': '2023'
    },
    {
      'year': '2022-2023',
      'value': '2022'
    },
    {
      'year': '2021-2022',
      'value': '2021'
    }
  ]
  Buyer = {
    value1: ' 2024-25/R/001/1',
    value2: ' Adarsh Seeds Ltd.',
    value3: ' C-2/45, M.G. Road, Sector-17A, Fariabad, Hariyana',
    value4: ' 9988998899' 
  };
  Seller= {
    value1: ' 14/04/2024      7:10:45 PM', 
    value2: ' ICAR IARI NEW DELHI',
    value3: ' Seed Production Unit, ICAR-IARI, Pusa Campus, New Delhi-110012',
    value4: ' 9997776667' 
  }; 
  Payment = {
    value1: ' UPI (Reference No.: 1111-2222-3333)',
    value2: ' Demand Draft (No.: DD123123)' 
  };
  
  Quantity={
    value1: '45.00',
    value2: '19.60',
    value3: '12.50',
    value4: '6.00',
    value5: '2.00'

  };
  Billno = {
    value1: '2024-25/R/001/1',
    value2: '2024-25/R/001/7',
    value3: '2024-25/R/001/10',
    value4: '2024-25/R/001/4', 
    value5: '2024-25/R/001/2'
  }; 
  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
  dummyData: { variety_id: string; variety_name: string; indent_quantity: number; bsp2Arr: any[]; }[]; 
  selectedTable: string;
  liftingRecieptData:any;
  liftingDataValue: any;
  liftingAdditionalChargesValue: any;
  AESKey:string = environment.AESKey;
  decryptedId: any;
  encryptedData: any;
  billNo: any;
  liftingbspcData: any;
  spaDetails: any;
  year: any;
  season: any;
  crop_code: any;
  user_id: any;
  payment_method_no: any;
  selectTable(table: string) {
    this.selectedTable = table;
  }
  additionalCharges = [
    { id: 1, charges: "Mou charges" },
    { id: 2, charges: "License fee" },
    { id: 3, charges: "PPV fee" },
    { id: 4, charges: "Royalty" },
    { id: 5, charges: "Other" },
  ];
  constructor(private service: SeedServiceService, private fb: FormBuilder, private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router ,private _productionCenter:ProductioncenterService) {
    this.liftingRecieptData = this._productionCenter && this._productionCenter.liftingData ? this._productionCenter.liftingData : "";
    console.log('liftingRecieptData====',this.liftingRecieptData)
    
    this.createForm(); 
  } 
  openPrintBillDialog(): void { 
    this.router.navigate(['/lifting']);
  }


  // download() {
  //   const name = 'submit-indents-breeder-seeds';
  //   const element = document.getElementById('excel-table');
  //   const options = {
  //     filename: `${name}.pdf`,
  //     image: { type: 'jpeg', quality: 1 },
  //     html2canvas: {
  //       dpi: 192,
  //       scale: 4,
  //       letterRendering: true,
  //       useCORS: true
  //     },
  //     jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
  //   };
  //   html2PDF().set(options).from(element).toPdf().save();
  // }
  // exportexcel(): void {
  //   /* pass here the table id */
  //   let element = document.getElementById('excel-table-data');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, this.fileName);

  // }
  // fileName(wb: XLSX.WorkBook, fileName: any) {
  //   throw new Error('Method not implemented.');
  // }

  // generateReceiptContent(): string {
  //   // Logic to generate the content of the receipt (e.g., format data)
  //   return `
  //     <html>
  //     <head><title>Bill Receipt</title></head>
  //     <body>
  //       <!-- Receipt content goes here -->
  //     </body>
  //     </html>
  //   `;
  // }
  
  placeholderText: string = ''; 
  createForm() {
    this.ngForm = this.fb.group({ 
      BSPC: new FormControl(''),  
      variety: new FormControl(''),
    }) 
  }

  ngOnInit(): void {
    this.fetchData();

    // const id = this.route.snapshot.paramMap.get('id');
    this.route.params.subscribe(params => {
      const encryptedId = params['id'];
      console.log("From URL QR", encryptedId)
      
      if (encryptedId) {
        // Decrypt the encryptedId
        const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), this.AESKey);
        this.decryptedId = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;
        this.year = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).year;
        this.season = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).season;
        this.crop_code = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).crop_code;
        this.user_id = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).user_id;
        console.log(this.year,'this.year',decryptedBytes)
        const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ encryptedId }), this.AESKey).toString();
        this.encryptedData = encryptedId;
        }
    });
    console.log( this.decryptedId,' this.decryptedId');
    this.getRecieptLiftingData();
    this.getBillPrintData(this.decryptedId)
  } 
  getBillPrintData(id){
    const param={
      search:{
        id:id
      }
    }
    this._productionCenter.postRequestCreator('get-bill-print-data',param).subscribe(data=>{
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ?  data.EncryptedResponse.data:'';
      let val = res && res.data ? res.data :'';
      this.liftingbspcData = res && res.liftingbspcData ? res.liftingbspcData[0] :'';
      this.spaDetails = res && res.spaDetails ? res.spaDetails[0] :'';
      if(val && val.length>0){
        this.billNo= val && val[0] && val[0].lifting_bill_no ? val[0].lifting_bill_no:'';
        this.payment_method_no=val && val[0] && val[0].payment_method_no ? val[0].payment_method_no:'';
      }
      console.log('dataaa',data)
    })
  }
  getRecieptLiftingData(){
    let route = 'get-lifting-data';
    let user = localStorage.getItem('BHTCurrentUser');
    let userData =  JSON.parse(user);
    let userId = userData && userData.id  ? userData.id:'';
    let param ={
      year:this.liftingRecieptData.year ? this.liftingRecieptData.year:this.year ? this.year:'',
      season:this.season ? this.season :'',
      crop_code:this.crop_code ? this.crop_code :'',
      variety_code:this.liftingRecieptData.variety_code ? this.liftingRecieptData.variety_code:'',
      id:this.decryptedId,
      user_id:userId
    }
    this._productionCenter.postRequestCreator(route,param,null).subscribe(res=>{
      console.log('res==',res);
      if(res.EncryptedResponse.status_code === 200){
        this.liftingDataValue = res.EncryptedResponse.data ? res.EncryptedResponse.data:[];
        this.getRecieptAdditionalCharge(this.liftingDataValue[0].id);
      }
    })
  }

  getRecieptAdditionalCharge(id){
    let route = 'get-lifting-additional-charges-data';
    let param ={
      lifting_details_id:id
      // year:this.liftingRecieptData.year ? this.liftingRecieptData.year:'',
      // season:this.liftingRecieptData && this.liftingRecieptData.season ? (this.liftingRecieptData.season=="Kharif"?"K":"R"):'',
      // crop_code:this.liftingRecieptData.crop_code ? this.liftingRecieptData.crop_code:'',
      // variety_code:this.liftingRecieptData.variety_code ? this.liftingRecieptData.variety_code:'',
    }
    this._productionCenter.postRequestCreator(route,param,null).subscribe(res=>{
      console.log('res11==',);
      if(res.EncryptedResponse.status_code === 200){
        // this.liftingAdditionalChargesValue = res.EncryptedResponse.data ? res.EncryptedResponse.data:[]
        let additionalCharges =  res.EncryptedResponse.data.filter(item=>item.lifting_details_id == id)
        console.log('additionalCharges===',additionalCharges);
        this.liftingAdditionalChargesValue = additionalCharges
      }
    })
  }

  
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  fetchData() {
    this.dummyData = [
      {
        'variety_id': '23112',
        'variety_name': 'PBW-154',
        'indent_quantity': 150,
        bsp2Arr: []
      },
      {
        'variety_id': '23114',
        'variety_name': 'HD-1925 (SHERA)',
        'indent_quantity': 150,
        bsp2Arr: []
      } 
    ] 
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

  getChargesName(id){
    let chargesValue =  this.additionalCharges.filter(ele=>ele.id == id)
    let chargesName = chargesValue && chargesValue[0] && chargesValue[0].charges
    return chargesName;
  }

  calculateData(a,b){
    let sumValue = parseInt(a)+parseInt(b);
    return sumValue;
  }

  getItems(form) {
    return form.controls.bsp2Arr.controls;
  }

  get itemsArray() {
    return <FormArray>this.ngForm.get('bsp2Arr');
  }

  save(data) {
    console.log(data)

  }
  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }
   
  printPage(): void {
    let printContents = document.getElementById('printSection').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    // window.print();
  }
  download() {
    const name = 'bill-reciept';
    const element = document.getElementById('printSection');
    const options = {
      filename: `${name}.pdf`,
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        dpi: 192,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a3',
        orientation: 'landscape'
      }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
}

