import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'src/app/services/master/master.service';
import { DatePipe } from '@angular/common';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-sample-slip',
  templateUrl: './sample-slip.component.html',
  styleUrls: ['./sample-slip.component.css']
})
export class SampleSlipComponent implements OnInit {

  sampleSlipData:any;
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
  userId: any;
  unit:any;
  bspcName: any;
  bspcstateName: any;
  bspcdistrictName: any;
  testingtype: void;
  firstEntryData: any;
  submissionid = this.route.snapshot.paramMap.get('submissionId');
  unit2: string;
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
  constructor(private _productionCenter: ProductioncenterService,private  _master: MasterService,private datePipe: DatePipe,private route: ActivatedRoute,private router: Router) { 
    this.generateSampleData = this._productionCenter && this._productionCenter.generateSampleData ? this._productionCenter.generateSampleData:"";
  
    if (this.generateSampleData && this.generateSampleData.crop_code.slice(0, 1) == "A") {
      this.unit = "Qt";
    } else {
      this.unit = "Kg";
    }
  }
  formattedDate(): string {
    return this.datePipe.transform(this.currentDate, 'short');
  }
  ngOnInit(): void {
    this.getGenerateSlipData();
    this.getGenerateSlipTestData();
    this.getSeedTestingLaboratoryData();
    let user = localStorage.getItem('BHTCurrentUser')
    console.log('userDatat',user);
    this.userId = JSON.parse(user)
   
    console.log("jriul",this.submissionid);
  }
  getAgencyData(bspc_id) {
    this._master.postRequestCreator('getAgencyUserDataByIdReport1/' + this.userId.id ).subscribe(data => {
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

  getBspcNameData(bspc_id) {
    this._master.postRequestCreator('getAgencyUserDataByIdReport1/' + bspc_id ).subscribe(data => {
      // let res = 2
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : ''
      this.profileData = apiResponse ? apiResponse : '';
      // contact_person_name
      if (apiResponse && apiResponse.agency_name) {
        this.bspcName = apiResponse.agency_name.charAt(0).toUpperCase() + apiResponse.agency_name.slice(1);
      }
      
      console.log(this.profileData);
      // console.log(this.bspcName,"bspcName************");
      // console.log(bspc_id,"bspcNameid************");
      return this.profileData;
      // pdpcImageUrl ? pdpcImageUrl
    })
  }
  getSeedTestingLaboratoryData(){
    let route = "seed-testing-laboratory-list";
    let param = {
    }
    this._productionCenter.postRequestCreator(route,param, null ).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seedTestingLaboratoryData = res.EncryptedResponse.data ? res.EncryptedResponse.data:[]
      }
    })
  }
  getGenerateSlipTestData() {
    let route = "get-generate-sample-slip-test-data";
    let param = {
    }
    this._productionCenter.postRequestCreator(route,param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleSlipTestsData = res.EncryptedResponse.data ? res.EncryptedResponse.data:[];
      }
    })
  }
  getGenerateSlipData() {
    console.log("nfehruifhri");
    let route = "get-generate-sample-slip-data";
    let param = {
      "year": this.generateSampleData && this.generateSampleData.year ? this.generateSampleData.year:"",
      "season": this.generateSampleData && this.generateSampleData.season ? this.generateSampleData.season:"",
      "crop_code":this.generateSampleData && this.generateSampleData.crop_code ? this.generateSampleData.crop_code:"",
      "get_caary_over":this.generateSampleData && this.generateSampleData.carry_over_status ?this.generateSampleData.carry_over_status:1,
      "lot_no_array":this.generateSampleData && this.generateSampleData.lot_no_array ? this.generateSampleData.lot_no_array:[],
      "tabletype":this.submissionid,
      "re_sample":this.generateSampleData && this.generateSampleData.re_sample ? this.generateSampleData.re_sample:'',
    }
    this._productionCenter.postRequestCreator(route, param,null ).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.sampleSlipData = res.EncryptedResponse.data ? res.EncryptedResponse.data:[],
console.log("kfjeio",this.sampleSlipData);
         this.testingtype=this.sampleSlipData && this.sampleSlipData[0] && this.sampleSlipData[0].testing_type ? this.sampleSlipData[0].testing_type:null;
          //  if(this.sampleSlipData[0].testing_type === 'STL')
          //  {
          //   console.log();
          //   this.sampleSlipData;
          //  }
          //  else{
          //   this.sampleSlipData;
          //  }
          console.log("this.sampleSlipData[0].crop_code.slice(0, 1)",this.sampleSlipData[0].crop_code.slice(0, 1));
          if (this.sampleSlipData && this.sampleSlipData[0].crop_code.slice(0, 1) == "A") {
            this.unit2 = "Qt";
          } else {
            this.unit2 = "Kg";
          }
          //  console.log("this.sampleSlipData",this.sampleSlipData);
          this.firstEntryData = this.sampleSlipData[0]; // You can return this if needed
          // console.log(this.firstEntryData,"dfghjkl;kjhghjk"); 
        this.getAgencyData(this.sampleSlipData && this.sampleSlipData[0] && this.sampleSlipData[0].bspc_id ? this.sampleSlipData[0].bspc_id:null)
        this.getBspcNameData(this.sampleSlipData && this.sampleSlipData[0] && this.sampleSlipData[0].got_bspc_id ? this.sampleSlipData[0].got_bspc_id:null)
       
        
      }
    })
  }

  getSapleTestData(data){
   let generateSampleSlip = this.sampleSlipTestsData.filter(item=> item.generate_sample_slip_id === data);
   let generateSampleValue = [];
   generateSampleSlip.forEach(ele=>{
    console.log(ele);
    generateSampleValue.push(' '+ele.test_name);
   })
   let dataName = (generateSampleValue)
   return dataName;
  }
  getTestingLabData(lab_id){
    let data = this.seedTestingLaboratoryData.filter(item=> item.id === lab_id);
    let testLabName = data && data[0] && data[0].lab_name ? data[0].lab_name:"";
    return testLabName
  }
  printContent() {
    let printContents = document.getElementById('printSection').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    console.log('originalContents',originalContents)
    window.print();
    document.body.innerHTML = originalContents;
  }

}
