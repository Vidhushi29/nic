import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { convertDate } from 'src/app/_helpers/utility';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import * as html2PDF from 'html2pdf.js';
import jspdf from 'jspdf';
import { environment } from 'src/environments/environment';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-breeder-seed-certificate-download',
  templateUrl: './breeder-seed-certificate-download.component.html',
  styleUrls: ['./breeder-seed-certificate-download.component.css']
})
export class BreederSeedCertificateDownloadComponent implements OnInit {
  toadyDate = new Date()
  toadyNewDate: string;
  menuData = 'Nischal'

  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  pdfdata: any;
  years: string;
  @ViewChild('content') content: ElementRef;
  @ViewChild('content_section', { static: true }) el!: ElementRef<HTMLImageElement>;
  user_table: any;
  agency_id: any;
  certificate_name: any;
  imageIconName: string;
  unit: string;
  serialNumber: any;
  spaName: any;
  certificate_names: any;
  certificate_address: any;
  agenyName: any;
  agencyAddress: any;
  state_name: any;
  district_name: any;
  code:any;
  dataToShow: any;
  designation_name: any;
  contact_person_name: any;
  currentDate = new Date();
  baseUrl: string = environment.ms_nb_06_production_center.baseUrl;
  decryptedId: any;
  submissionDecryptedId:any;
  submitedEncryptedData:any;
  AESKey:string = environment.AESKey;
  encryptedData: any;
  yearnew: any;
  constructor(activatedRoute: ActivatedRoute, private router: Router,
    private route: ActivatedRoute,
    // private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService, private breederService: BreederService,
    private productionService: ProductioncenterService,
    ) {

    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }
    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;

  }

  ngOnInit(): void {
    this.getName();
    this.getAgencyData();
    this.getCertificateData();
    this.getSerialNumber();


    // if (this.isEdit || this.isView) {
    //   this.breederService.getRequestCreator('get-breeder-certificate/' + this.submissionId).subscribe(dataList => {
    //     console.log("dataList", dataList)
    //     if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
    //       this.pdfdata = dataList.EncryptedResponse.data
    //     }
    //   });
    // }.getRequestCreator("certificate-generated/" + billId, null, null)

    if (this.isEdit || this.isView) {
      this.breederService.getRequestCreator('certificate-generated/' + this.submissionId).subscribe(dataList => {
        if (dataList && dataList.EncryptedResponse && dataList.EncryptedResponse.status_code && dataList.EncryptedResponse.status_code == 200) {
          this.pdfdata = dataList.EncryptedResponse.data;
          console.log(this.pdfdata.crop_code)
          this.getCertificateNameByUser(this.pdfdata.crop_code)
          this.getSpaNameList(this.pdfdata.spa_code)
         
          // this.pdfdata.date_of_inspection = convertDate(this.pdfdata.date_of_inspection)
          this.pdfdata.date_of_inspection = this.pdfdata.date_of_inspection
          this.pdfdata.generation_date = convertDate(this.pdfdata.generation_date)
          if ((this.pdfdata.crop_code).slice(0,1)  == 'A') {
            this.unit = 'Quintal';
          } else if ((this.pdfdata[0].crop_code).slice(0,1) == 'H') {
            this.unit = 'Kg'
          }
          let data = parseInt(this.pdfdata.year)

          this.years = data + '-' + (data + 1 - 2000)

        }
      });
    
    }

  }

  downloadImage(e) {
    let image64 = this.pdfdata
  }


  patchForm(data) {

  }

  async downloadFile(fileHtmlElement: HTMLElement) {
    const element = document.getElementById('content');
    console.log('fileHtmlElement',element)
    this.ngxService.start();
    const options = {
      background: 'white',
      scale: 3,
      height: 2000,
      width: 300,
      letterRendering: false,

      // hyphens: none
    };
    await html2canvas(element, options).then(canvas => {



      const FILEURI = canvas.toDataURL('image/png');
      console.log('FILEURI',FILEURI)
      var imageData = new Image();
      imageData.src = FILEURI;
      imageData.onload = function () {
        // let fileWidth = 208;

        // let fileHeight = (canvas.height * fileWidth) / canvas.width;
        // const FILEURI = canvas.toDataURL('image/png');
        // let PDF = new jsPDF('p', 'mm', 'a4');
        // let position = 10;

        let fileWidth = 400;
        let fileHeight = 600;

        // console.log('fileHeight=====>',fileHeight);

        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 10;



        PDF.addImage(FILEURI, 'PNG',  0, 600, fileHeight,fileWidth);
        PDF.save('breeder-seed-certificate');
      };

    });
    this.ngxService.stop();
  }
  public openPDFs(e): void {
    let DATA: any = document.getElementById('htmlData');

    html2canvas(DATA).then((canvas) => {


      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;


      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('breeder-seed-certificate.pdf');
    });
  }

  download() {

    const name = 'breeder-seed-certificate';
    const element = document.getElementById('content');
    const options = {
      filename: `${name}.pdf`,
      // margin: [10, 3, 0, 0], //top, left, buttom, right,
      // filename: 'my_file.pdf',
      margin:       [0, 0, 10, 0],
      // image: { type: 'jpeg', quality: 1 },
      image:        { type: 'jpeg', quality: 0.98,crossorigin:"*" ,width:'50px'},
      
      // html2canvas: {dpi: 192, scale: 2, letterRendering: true},
      // pagebreak: {mode: 'avoid-all'},
      letterRendering: true,
      pagebreak: { mode: 'avoid-all' },
      // pagebreak: { mode: ['avoid-all', '*', 'legacy'] },

      // jsPDF: {unit: 'pt', format: 'a4', orientation: 'portrait'},
      html2canvas: {
        dpi: 300,
        // scale: 1,
        letterRendering: true,
        // useCORS: true,

      },
      // jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
      // jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2PDF().from(element).outputPdf().then(function(pdf) {
      // This logs the right base64
      console.log(btoa(pdf),'bto');
  });
   
    html2PDF().set(options).from(element).toPdf().save();
  }

  convertDatecertificate(val) {
    convertDate(val)
  }
  openPDF(): void {
    // let DATA: any = document.getElementById('content');
    const source = document.getElementById("content");
    html2canvas(source).then((canvas) => {
      let fileWidth = 400;
      let fileHeight = 15000
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 10;

      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }
  onExport() {
    const doc = new jsPDF("p", "pt", "a4");
    const source = document.getElementById("content");
    doc.text("Test", 40, 20);
    doc.setFontSize(5)
    doc.html(source, {
      callback: function (pdf) {
        doc.output("dataurlnewwindow"); // preview pdf file when exported
      }
    });
    // autotable(doc, {
    //   html: '#content',
    //   useCss: true
    // })
  }
  makePdf() {
    let pdf = new jsPDF('p', 'mm', [200, 200])
    pdf.html(this.content.nativeElement, {
      callback: (pdf) => {

        // const imageProps = pdf.getImageProperties(imgData)
        // pdf.addImage(imgData, 'PNG', 0, 0, 208, 500) 
        // pdf.addImage( 'PNG', 0, 0, 208, 500)
        pdf.save("demo.pdf")
      }
    })

    // html2canvas(element).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/jpeg")

    //   const pdf = new jsPDF({
    //     orientation:"portrait"
    //   })

    //   const imageProps = pdf.getImageProperties(imgData)

    //   const pdfw = pdf.internal.pageSize.getWidth()

    //   const pdfh = (imageProps.height * pdfw) / imageProps.width

    //   pdf.addImage(imgData, 'PNG', 0, 0, 208, 500)

    //   pdf.save("output.pdf")
    // })
  }
  exportPDF() {
    const element = document.getElementById('content-section');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg")

      const pdf = new jsPDF({
        orientation: "portrait"
      })

      const imageProps = pdf.getImageProperties(imgData)

      const pdfw = pdf.internal.pageSize.getWidth()

      const pdfh = (imageProps.height * pdfw) / imageProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, 208, 500)

      pdf.save("output.pdf")
    })
  }
  convetToPDF() {
    var data = document.getElementById('content');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 500;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }
  getName() {
    // this.selectCrop_group = "";
    const route = "get-name-certificate-of-breeeder";
    let data = localStorage.getItem('BHTCurrentUser');
    let localdata = JSON.parse(data)


    // const created_by = data.created_by

    const param = {
      search: {

        created_by: localdata.created_by,
        user_id: localdata.id
      }


    }
    this.breederService
      .postRequestCreator(route, null, param)
      .subscribe((apiResponse: any) => {
        console.log(apiResponse);

        console.log(apiResponse.EncryptedResponse.status_code, 'this.user_table')
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.user_table = apiResponse.EncryptedResponse.data.data[0].created_by;
          this.getNameByUser()
          console.log(apiResponse.EncryptedResponse.data.data[0].created_by, 'apiResponse.EncryptedResponse.data.data.created_by')
          // this.isCropName = true;
          // this.crop_name_list = apiResponse.EncryptedResponse.data.rows;
        }
      });
    // const result = this.service.getPlansInfo(route).then((data: any) => {
    //   this.crop_name_list = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    // })
  }

  getNameByUser() {
    // this.selectCrop_group = "";
    const route = "get-name-certificate-of-breeeder-by-created-by";



    // const created_by = data.created_by
console.log(this.user_table,'this.user_table')
    const param = {
      search: {
        user_id: this.user_table
      }
    }
    this.breederService
      .postRequestCreator(route, null, param)
      .subscribe((apiResponse: any) => {


        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
            this.agency_id= apiResponse.EncryptedResponse.data.data[0].agency_id;
            this.certificate_name = apiResponse.EncryptedResponse.data.data[0].name,
            this.getNameByUserByAgencyTable()

            // this.getNameByUserByAgencyTable()
          // this.isCropName = true;
          // this.crop_name_list = apiResponse.EncryptedResponse.data.rows;
        }
      });
    // const result = this.service.getPlansInfo(route).then((data: any) => {
    //   this.crop_name_list = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    // })
  }
  getCertificateNameByUser(newValue) {
    // this.selectCrop_group = "";
    const route = "getCeritificateName";



    // const created_by = data.created_by
console.log(this.user_table,'this.user_table')
    const param = {
      search: {
        crop_code:newValue
      }
    }
    this.breederService
      .postRequestCreator(route, null, param)
      .subscribe((apiResponse: any) => {


        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
            this.agency_id= apiResponse.EncryptedResponse.data.data[0].agency_id;
            this.certificate_names = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data &&
            apiResponse.EncryptedResponse.data.data[0] && apiResponse.EncryptedResponse.data.data[0].m_crop && apiResponse.EncryptedResponse.data.data[0].m_crop.agency_detail
            && apiResponse.EncryptedResponse.data.data[0].m_crop.agency_detail.agency_name ? apiResponse.EncryptedResponse.data.data[0].m_crop.agency_detail.agency_name:'';
           
            this.certificate_address = apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data &&
            apiResponse.EncryptedResponse.data.data[0] && apiResponse.EncryptedResponse.data.data[0].m_crop && apiResponse.EncryptedResponse.data.data[0].m_crop.agency_detail
            && apiResponse.EncryptedResponse.data.data[0].m_crop.agency_detail.address ? apiResponse.EncryptedResponse.data.data[0].m_crop.agency_detail.address:'';
           
            // this.getNameByUserByAgencyTable()

            // this.getNameByUserByAgencyTable()
          // this.isCropName = true;
          // this.crop_name_list = apiResponse.EncryptedResponse.data.rows;
        }
      });
    // const result = this.service.getPlansInfo(route).then((data: any) => {
    //   this.crop_name_list = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    // })
  }

  getNameByUserByAgencyTable() {
    // this.selectCrop_group = "";
    const route = "get-name-certificate-of-breeeder-by-agenct-table";
    const param = {
      search: {
        agency_id: this.agency_id
      }
    }
    this.breederService
      .postRequestCreator(route, null, param)
      .subscribe((apiResponse: any) => {


        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
            // this.imageIconName = environment.awsUrl + 
            // apiResponse.EncryptedResponse.data.data[0].image_url;
            console.log('this.imageIconName',this.imageIconName)
            // this.certificate_name=  apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data 
            // && apiResponse.EncryptedResponse.data.data &&  apiResponse.EncryptedResponse.data.data[0] &&
            // apiResponse.EncryptedResponse.data.data[0].agency_name
          // this.isCropName = true;
          // this.crop_name_list = apiResponse.EncryptedResponse.data.rows;
        }
      });
    // const result = this.service.getPlansInfo(route).then((data: any) => {
    //   this.crop_name_list = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    // })
  }
  exportAsPDF(div_id)
  {
    let data = document.getElementById(div_id);  
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      console.log('contentDataURL',canvas)
      var doc = new jsPDF("p", "mm", "a4");

var width = doc.internal.pageSize.getWidth();
var height = doc.internal.pageSize.getHeight();
var imgData = contentDataURL;
doc.addImage(imgData, 'JPEG', 0, 0, width, height);

      // let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      // pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
      doc.save('Filename.pdf');   
    }); 
  }
  generatePDF() {
    var data = document.getElementById("content");
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jsPDF("p", "mm", "a4");
      var position = 0;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 211, 298);
      // pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("newPDF.pdf");
    });
  }
  public downloadAsPDF() {
    const doc = new jsPDF();

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.content.nativeElement;

    doc.html(pdfTable.innerHTML,   {
      width: 190,
      // 'elementHandlers': specialElementHandlers
    });

    doc.save('tableToPdf.pdf');
  }
 
  downloadGraphPDF(){  
    var data = document.getElementById('content');
    html2canvas(data).then(canvas => {  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
    
      const contentDataURL = canvas.toDataURL('image/jpg')  
      console.log(contentDataURL)
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'JPG', 0, position, imgWidth, imgHeight)  
      pdf.save('document.pdf')
    })
  }
  getSerialNumber(){
   // get encrypted data from url and decrypted start
    this.route.params.subscribe(params => {
      const encryptedId = params['submissionid'];

      if (encryptedId) {
        // Decrypt the encryptedId
        const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), this.AESKey);
        this.submissionDecryptedId = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;

        const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ encryptedId }), this.AESKey).toString();
        this.submitedEncryptedData = encryptedId;
      }
   
    });
 // get encrypted data from url and decrypted end
 
    const param={
      id:this.submissionDecryptedId
    }
    this.breederService.postRequestCreator('get-serial-number',null , param).subscribe(data=>{
      this.serialNumber = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data[0] && data.EncryptedResponse.data[0].serial_number  ? data.EncryptedResponse.data[0].serial_number :'';
      this.yearnew = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data[0] && data.EncryptedResponse.data[0].year  ? data.EncryptedResponse.data[0].year :'';
   
    })
  }
  convertDatewithDash(data){}
  getSpaNameList(spacode){
    this.breederService.postRequestCreator('getSpaUserList?spacode='+ spacode ,null).subscribe(data=>{
      console.log(data)
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data  ? data.EncryptedResponse.data :
      '';
      this.spaName = res && res.user && res.user.agency_detail && res.user.agency_detail.agency_name ?  res.user.agency_detail.agency_name :''

    })
  }
  getAgencyData(){
    // get-agency-data
    let data = localStorage.getItem('BHTCurrentUser');
    let localdata = JSON.parse(data)
    let userId= localdata.id;
    const param={
      search:{
        user_id:userId
      }
    }
    this.productionService.postRequestCreator('get-agency-data',param).subscribe(data=>{
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data :'';
      this.agenyName= res && res[0] && res[0].agency_name ? res[0].agency_name:'';
      this.state_name=res && res[0] && res[0].state_name ? res[0].state_name:'';
      this.district_name=res && res[0] && res[0].district_name ? res[0].district_name:'';
      this.contact_person_name=res && res[0] && res[0].contact_person_name ? res[0].contact_person_name:'';
      this.designation_name=res && res[0] && res[0].designation_name ? res[0].designation_name:'';
      this.code=res && res[0] && res[0].code ? res[0].code:'';


    })
  }
  getCertificateData() {
    this.route.params.subscribe(params => {
      const encryptedId = params['submissionid'];
      console.log("From URL QR", encryptedId);

      if (encryptedId) {
        // Decrypt the encryptedId
        const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), this.AESKey);
        this.decryptedId = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;

        const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ encryptedId }), this.AESKey).toString();
        this.encryptedData = encryptedId;
      }
    });
    console.log(this.decryptedId, ' this.decryptedId');
    const param = {
      search: {
        submissionId: this.decryptedId
      }
    };
    this.productionService.postRequestCreator('get-lifting-data-bill-cerificate', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.dataToShow = res && res[0] ? res[0] : '';
      if (this.dataToShow && this.dataToShow.indentor && this.dataToShow.indentor.length > 0) {
        this.dataToShow.indentor.forEach(el => {
          el.tagsNo = this.convertToArray(el.tags.map(val => val && val.tag_no ? val.tag_no : ''));
        });
      }
    });
    console.log(this.submissionId, ' this.submissionId');
  }

  convertToArray(tagsArray: string[]): string {
    if (!tagsArray || tagsArray.length === 0) return '';

    const seriesMap: { [key: string]: number[] } = {};

    // Separate tags by their series prefix
    tagsArray.forEach(tag => {
      const prefix = tag.split('/').slice(0, -1).join('/');
      const num = parseInt(tag.split('/').slice(-1)[0], 10);
      if (!seriesMap[prefix]) {
        seriesMap[prefix] = [];
      }
      seriesMap[prefix].push(num);
    });

    // Process each series to find continuous ranges
    const resultArray: string[] = [];

    Object.keys(seriesMap).forEach(prefix => {
      const numbers = seriesMap[prefix].sort((a, b) => a - b);
      let start = numbers[0];
      let end = numbers[0];

      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] === end + 1) {
          end = numbers[i];
        } else {
          if (start === end) {
            resultArray.push(`${prefix}/${start.toString().padStart(6, '0')}`);
          } else {
            resultArray.push(`${prefix}/${start.toString().padStart(6, '0')}-${end.toString().padStart(6, '0')}`);
          }
          start = numbers[i];
          end = numbers[i];
        }
      }

      if (start === end) {
        resultArray.push(`${prefix}/${start.toString().padStart(6, '0')}`);
      } else {
        resultArray.push(`${prefix}/${start.toString().padStart(6, '0')}-${end.toString().padStart(6, '0')}`);
      }
    });

    return resultArray.join(',');
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  converttoArray(arr){
    if(arr && arr.length>0){
      let item = arr  && arr.length>0 ?arr.toString():'';
      return item
    }else{
      return 'NA'
    }
  }
}
