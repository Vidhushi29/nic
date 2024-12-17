import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import * as html2PDF from 'html2pdf.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { MasterService } from 'src/app/services/master/master.service';
import { DatePipe } from '@angular/common';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forwarding-letter',
  templateUrl: './forwarding-letter.component.html',
  styleUrls: ['./forwarding-letter.component.css']
})
export class ForwardingLetterComponent implements OnInit {
  sampleSlipData = {
    spp_name: "ABC Test ",
    district_name: "Agra",
    state_name: "Uttar Pradesh",
    crop_name: "Wheat",
    variety_name: "DW-147",
    lot_qnt: "200",
    class: "Breeder 1",
    unique_code: "wtY45Abn4",
    date: "30/04/2024",
    stl: "ABC Testing Lab",
    test_required: "Germination, Purity, ODv, Seed Health",
    chemical_treatment: "Yes (name of checmical)"
  }
  forwarderTestingData:any;
  // forwarderTestingData = [
  //   {
  //     crop_name: "Wheat",
  //     variety_name: "DBW-303",
  //     class: "Breeder 1",
  //     uniqueCode: "2fuvnVkZe"
  //   },
  // ];
  generateSampleData: any;
  sampleSlipTestsData: any;
  seedTestingLaboratoryData: any;
  currentDate: Date = new Date();
  profileData: any;
  userName: any;
  pdpcAdrress: any;
  stateName: any;
  districtName: any;
  pdpcImageUrl: any;
  pdpcDesignation: any;
  cropName: any;
  cropNameSecond: any;
  userId: any;
  testing_type: any;
  bspcuserName: any;
  submissionid = this.route.snapshot.paramMap.get('submissionId');
  // sampleSlipData = [
  //   {
  //     spp_name: "ABC Test ",
  //     district_name: "Agra",
  //     state_name: "Uttar Pradesh",
  //     crop_name: "Wheat",
  //     variety_name: "DW-147",
  //     lot_qnt: "200",
  //     class: "Breeder 1",
  //     unique_code: "wtY45Abn4",
  //     date: "30/04/2024",
  //     stl: "ABC Testing Lab",
  //     test_required: "Germination, Purity, ODv, Seed Health",
  //     chemical_treatment: "Yes (name of checmical)",
  //     lot_no: "SEP23-0001-001-1"
  //   },
  // ]
  constructor(private _productionCenter: ProductioncenterService, private _master: MasterService, private datePipe: DatePipe,private route: ActivatedRoute,private router: Router) {
    this.generateSampleData = this._productionCenter && this._productionCenter.generateSampleData ? this._productionCenter.generateSampleData : "";
  }
  formattedDate(): string {
    return this.datePipe.transform(this.currentDate, 'short');
  }
  ngOnInit(): void {
    this.getGenerateSlipData();
    this.seedProcessRegisterCropData()
    this.getGenerateSlipTestData();
    this.getSeedTestingLaboratoryData();
    let user = localStorage.getItem('BHTCurrentUser')
    console.log('userDatat',user);
    this.userId = JSON.parse(user)
    console.log("fhjhj",this.submissionid);
  }
  seedProcessRegisterCropData() {
    let route = "get-generate-sample-forwarding-slip-crop-data";
    let param = {
      "search": {
        "year": this.generateSampleData && this.generateSampleData.year ? this.generateSampleData.year : "",
        "season": this.generateSampleData && this.generateSampleData.season ? this.generateSampleData.season : "",
        // "crop_code": "A0120"
      }
    }
    this._productionCenter.postRequestCreator(route,param, null ).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.cropName = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        this.cropNameSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    });
  }

  cropNameConvert(item){
    console.log(item);
    let cropNameData = this.cropName.filter(ele=> ele.crop_code == item);
    // console.log('cropNameValue====',cropNameValue);
    let cropNameValue = cropNameData && cropNameData[0] && cropNameData[0].crop_name ? cropNameData[0].crop_name:''
    return cropNameValue;
  }

  getAgencyData(bspc_id) {
    
    this._master.postRequestCreator('getAgencyUserDataByIdReport1/' + this.userId.id).subscribe(data => {
      // let res = 2
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.profileData = apiResponse ? apiResponse : '';
      // contact_person_name
      if (apiResponse && apiResponse.agency_name) {
        this.userName = apiResponse.agency_name.charAt(0).toUpperCase() + apiResponse.agency_name.slice(1);
      }
      if (apiResponse && apiResponse.address) {
        this.pdpcAdrress = apiResponse.address.charAt(0).toUpperCase() + apiResponse.address.slice(1);
      }
      if (apiResponse && apiResponse.state_name) {
        this.stateName = apiResponse.state_name.charAt(0).toUpperCase() + apiResponse.state_name.slice(1);
      }
      if (apiResponse && apiResponse.district_name) {
        this.districtName = apiResponse.district_name.charAt(0).toUpperCase() + apiResponse.district_name.slice(1);
      }
      if (apiResponse && apiResponse.image_url2) {
        this.pdpcImageUrl = apiResponse.image_url2.charAt(0).toUpperCase() + apiResponse.image_url2.slice(1);
      }
      if (apiResponse && apiResponse['m_designation'] && apiResponse['m_designation.name']) {
        this.pdpcDesignation = apiResponse['m_designation.name'].charAt(0).toUpperCase() + apiResponse['m_designation.name'].slice(1);
      }
      console.log(this.profileData);
      return this.profileData;
      // pdpcImageUrl ? pdpcImageUrl
    })
  }


  
  getbspcAgencyData(bspc_id) {
    
    this._master.postRequestCreator('getAgencyUserDataByIdReport1/' + bspc_id).subscribe(data => {
      // let res = 2
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.profileData = apiResponse ? apiResponse : '';
      // contact_person_name
      if (apiResponse && apiResponse.agency_name) {
        this.bspcuserName = apiResponse.agency_name.charAt(0).toUpperCase() + apiResponse.agency_name.slice(1);
      }
      // if (apiResponse && apiResponse.address) {
      //   this.pdpcAdrress = apiResponse.address.charAt(0).toUpperCase() + apiResponse.address.slice(1);
      // }
      // if (apiResponse && apiResponse.state_name) {
      //   this.stateName = apiResponse.state_name.charAt(0).toUpperCase() + apiResponse.state_name.slice(1);
      // }
      // if (apiResponse && apiResponse.district_name) {
      //   this.districtName = apiResponse.district_name.charAt(0).toUpperCase() + apiResponse.district_name.slice(1);
      // }
      // if (apiResponse && apiResponse.image_url2) {
      //   this.pdpcImageUrl = apiResponse.image_url2.charAt(0).toUpperCase() + apiResponse.image_url2.slice(1);
      // }
      // if (apiResponse && apiResponse['m_designation'] && apiResponse['m_designation.name']) {
      //   this.pdpcDesignation = apiResponse['m_designation.name'].charAt(0).toUpperCase() + apiResponse['m_designation.name'].slice(1);
      // }
      console.log(this.profileData);
      // console.log( this.bspcuserName);
      return this.profileData;
      // pdpcImageUrl ? pdpcImageUrl
    })
  }

  getSeedTestingLaboratoryData() {
    let route = "seed-testing-laboratory-list";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seedTestingLaboratoryData = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    })
  }

  getGenerateSlipTestData() {
    let route = "get-generate-sample-slip-test-data";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleSlipTestsData = res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
    })
  }

  getGenerateSlipData() {
    console.log("this.generateSampleData",this.generateSampleData);
    let route = "get-generate-sample-forwarding-slip-data-second";
    let param = {
      "search":{"year": this.generateSampleData && this.generateSampleData.year ? this.generateSampleData.year : "",
        "tabletype":this.submissionid,
      "season": this.generateSampleData && this.generateSampleData.season ? this.generateSampleData.season : "",
      "crop_code": this.generateSampleData && this.generateSampleData.crop_code ? this.generateSampleData.crop_code : "",
      "get_caary_over": this.generateSampleData && this.generateSampleData.carry_over_status ? this.generateSampleData.carry_over_status : 1,
      // "lot_no_array": this.generateSampleData && this.generateSampleData.lot_no_array ? this.generateSampleData.lot_no_array : [],
      "consignment_no":this.generateSampleData && this.generateSampleData.consignment_no ? this.generateSampleData.consignment_no : "",}
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.forwarderTestingData = res.EncryptedResponse.data ? res.EncryptedResponse.data : [],
        this.testing_type = this.forwarderTestingData[0].testing_type,
        // console.log("this.testing_type**************",this.testing_type);
          this.getAgencyData(this.forwarderTestingData && this.forwarderTestingData[0] && this.forwarderTestingData[0].bspc_id ? this.forwarderTestingData[0].bspc_id : null)
          
          this.getbspcAgencyData(this.forwarderTestingData && this.forwarderTestingData[0] && this.forwarderTestingData[0].got_bspc_id ? this.forwarderTestingData[0].got_bspc_id : null)
      }
    })
  }

  getSapleTestData(data) {
    let generateSampleSlip = this.sampleSlipTestsData.filter(item => item.generate_sample_slip_id === data);
    let generateSampleValue = [];
    generateSampleSlip.forEach(ele => {
      console.log(ele);
      generateSampleValue.push(ele.test_name);
    })
    let dataName = generateSampleValue.toString()
    return dataName;
  }

  getTestingLabData(lab_id) {
    let data = this.seedTestingLaboratoryData.filter(item => item.id === lab_id);
    let testLabName = data && data[0] && data[0].lab_name ? data[0].lab_name : "";
    return testLabName
  }

  printContent() {
    let printContents = document.getElementById('printSection').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  generatePdf() {
    let filename = "forwarding letter "
    let elementId = document.getElementById('printSection')
    // pdf-tables
    // pdf-report
    const name = 'bsp-three-report';
    const element = elementId
    var doc = new jsPDF();
    const options = {
      filename: `${filename}.pdf`,
      margin: [10, 0],
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        dpi: 300,
        scale: 2,
        letterRendering: true,
        logging: true,
        useCORS: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a3',
        orientation: 'landscape'
      },
    };
    var pageCount = doc.getNumberOfPages();
    console.log(pageCount, 'pdf', elementId)
    let pdf = html2PDF().set(options).from(element).toPdf().save();
  }
}
