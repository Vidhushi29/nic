import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import { VarietyCharactersticReportsComponent } from '../reports/variety-characterstic-reports/variety-characterstic-reports.component';
interface Variety {
  name: string;
  parentalLine: string;
}

interface LotDetails {
  lotNo: string;
  classOfSeed: string;
  godownNo: string;
  stackNo: string;
  noOfBags: string;
}

interface SampleDetails {
  uniqueCode: string;
  sampleNo: number;
  testingCentre: string;
  testCentre: string;
  consignmentNo: string;
}

interface OtherDetails {
  areaUnderVariety: number;
  noOfSamples: number;
  dateOfBspI: string;
  dateOfBspIII: string;
}

interface Report {
  id: number;
  variety: Variety;
  lotDetails: LotDetails;
  sampleDetails: SampleDetails;
  otherDetails: OtherDetails;
  totalPlantsObserved: number;
  totalSelfPlants: number;
  totalOffTypePlants: number;
  totalTruePlants: number;
  geneticPurity: string;
}
@Component({
  selector: 'app-grow-out-test-report-bspv',
  templateUrl: './grow-out-test-report-bspv.component.html',
  styleUrls: ['./grow-out-test-report-bspv.component.css']
})
export class GrowOutTestReportBspvComponent implements OnInit {
  
  ngForm: any;
  // reports: Report[] = [
  //   {
  //     id: 1,
  //     variety: { name: 'DW147', parentalLine: 'N/A' },
  //     lotDetails: {
  //       lotNo: 'SEP23-0001-001-2 (i)',
  //       classOfSeed: 'Breeder I',
  //       godownNo: '1',
  //       stackNo: 'R/25-26PS/2',
  //       noOfBags: '100 (50Kg)',
  //     },
  //     sampleDetails: {
  //       uniqueCode: 'Ach345d8',
  //       sampleNo: 1,
  //       testingCentre: 'ABC',
  //       consignmentNo: 'R/25-26/0001/11',
  //     },
  //     otherDetails: {
  //       areaUnderVariety: 1,
  //       noOfSamples: 1,
  //       dateOfBspI: '24/01/24',
  //       dateOfBspIII: '14/04/24',
  //     },
  //     totalPlantsObserved: 300,
  //     totalSelfPlants: 2,
  //     totalOffTypePlants: 2,
  //     totalTruePlants: 296,
  //     geneticPurity: '98.67',
  //   },
  
  // ];
  
  // yearOfIndent = [
  //   {
  //     year: '2023'
  //   },
  //   {
  //     year: '2022'
  //   },
  //   {
  //     year: '2021'
  //   },
  // ]

 
  // seasonlist = [
  //   {
  //     season: 'K'
  //   },
  //   {
  //     season: 'R'
  //   },
  // ];
  // cropList = [
  //   {
  //     crop_name: 'Wheat',
  //     crop_code: 'A01012'
  //   },
  //   {
  //     crop_name: 'Paddy (Dhan)',
  //     crop_code: 'A01012'
  //   },
  // ];
  // cropName = [
  //   {
  //     crop_name: 'Wheat',
  //     crop_code: 'A01012'
  //   },
  //   {
  //     crop_name: 'Paddy (Dhan)',
  //     crop_code: 'A01012'
  //   },
  // ];
  // cropNameSecond = [
  //   {
  //     crop_name: 'Wheat',
  //     crop_code: 'A01012'
  //   },
  //   {
  //     crop_name: 'PADDY (Dhan)',
  //     crop_code: 'A01012'
  //   },
  // ];

  // varietyArray = [
  //   {
  //     id: 1,
  //   variety_name: 'A01012'
  //   },
  //   {
  //     id: 'PADDY (Dhan)',
  //     variety_name: 'A01012'
  //   },
  // ];
is_update: any;
showAddMoreInthisVariety: any;
  selectCrop: any;
  selectCrop_crop_code: any;
  crop_name_data: any;
  selectCrop_group: string;
  crop_text_check: string;
  searchClicked: boolean;
  isSearch: boolean;
  showVarietyDetails: boolean;
  selectVariety: string;
  showparental: boolean;
  selectParental: string;
  submitted: boolean;
  yearOfIndent: any;
  seasonlist: any;
  cropName: any;
  reports: Report[];
  varietyArray: any;
  cropNameSecond: any;
  constructor(private service: SeedServiceService, private fb: FormBuilder, private master: MasterService, private elementRef: ElementRef, private formBuilder: FormBuilder, private _productionCenter: ProductioncenterService, private route: Router) {
    this.createForm(); 

     }

  ngOnInit(): void {
    this.growOutTestingReportYearData();
  }

  growOutTestingReportYearData() {
    let route = "get-got-year";
    let param = {
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        // console.log(this.yearOfIndent);
      }
    });
  }
  seedgotReportSeasonData() {
    let route = "get-got-season";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonlist = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }
  seedgotReportVarietyData() {
    let route = "get-got-variety";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
      }
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.varietyArray = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }
    });
  }

  getCrop() {
    let route = "get-got-crop";
    let param = {
      "search": {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
      }
    }
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
        if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
          this.cropName = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
          this.cropNameSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
    
          // console.log(this.yearOfIndent);
        }
      });
    }

  
    getGotDetailsReportdata() {
      let route = "get-got-report-details";
      let param = {
        "search": {
          "year": this.ngForm.controls['year'].value,
          "season": this.ngForm.controls['season'].value,
          "crop_code": this.selectCrop_crop_code,
          "variety_code":this.ngForm.controls['varietyvalue'].value,
          
        }
      }
        this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
          if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
            const apiData= res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
            // = res.EncryptedResponse.data || [];
           this.reports = this.mapApiDataToReports(apiData);
          }
        });
      }

      mapApiDataToReports(apiData: any[]): Report[] {
        return apiData.map((data, index) => {
          const geneticPurity = data.total_plant_observed
            ? ((data.true_plant / data.total_plant_observed) * 100).toFixed(2)
            : "N/A";
      
          return {
            id: index + 1,
            variety: {
              name: data.variety_name || 'Unknown Variety',
              parentalLine: data.variety_line_code || 'N/A'
            },
            lotDetails: {
              lotNo: data.lot_num || 'Unknown Lot',
              classOfSeed:data.class_of_seed, // Placeholder
              godownNo:data.godown_no,          // Placeholder
              stackNo: data.stack_no,           // Placeholder
              noOfBags: data.no_of_bags,           // Placeholder
            },
            sampleDetails: {
              uniqueCode: data.unique_code,
              sampleNo: data.number_sample_taken,
              testingCentre: data.agency_name,     // Placeholder
              testCentre: data.test_no, 
              consignmentNo: data.consignment_no      // Placeholder
            },
            otherDetails: {
              areaUnderVariety: data.area_shown || 0,
              noOfSamples: data.number_sample_taken || 0,
              dateOfBspI: data.date_of_bsp_2 || null,
              dateOfBspIII: data.date_of_bsp_3 || null
            },
            totalPlantsObserved: data.total_plant_observed || 0,
            totalSelfPlants: data.self_plant || 0,
            totalOffTypePlants: data.off_type_plant || 0,
            totalTruePlants: data.true_plant || 0,
            geneticPurity: geneticPurity
          };
        });
      }
  
  // yearOfIndent(yearOfIndent: any) {
  //   throw new Error('Method not implemented.');
  // }

  // getFinancialYear(year) {
  //   let arr = []
  //   arr.push(String(parseInt(year)))
  //   let last2Str = String(parseInt(year)).slice(-2)
  //   let last2StrNew = String(Number(last2Str) + 1);
  //   arr.push(last2StrNew)
  //   return arr.join("-");
  // }
  cropdatatext() {
    this.cropNameSecond;
    console.log('this.cropNameSecond;', this.cropNameSecond);
  }
  
  cropNameValue(item: any) {
    console.log('item====', item);
    this.selectCrop = item.crop_name;
    // this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    this.selectCrop_crop_code = item.crop_code;
    //console.log("this.selectCrop_crop_code",this.selectCrop_crop_code);
    this.crop_name_data = item.crop_name;
    this.selectCrop_group = "";
    this.ngForm.controls['crop_name'].setValue('')
    this.crop_text_check = 'crop_group'
  }
  cgClick() {
    document.getElementById('crop_group').click();

  }

  createForm(){
    this.ngForm = this.fb.group({
      selectteam: ['', Validators.required],
      year: new FormControl('',),
      season: new FormControl('',),
      crop_text: new FormControl('',),
      crop_code:new FormControl('',),
      crop_name:new FormControl('',),
      varietyvalue:new FormControl('',),
     
    });
    this.ngForm.controls['season'].disable();
    // this.ngForm.controls['crop_text'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isSearch = false;
        this.selectCrop = ''
        this.ngForm.controls['season'].enable();
        this.selectVariety = '';
        this.showparental = false;
        this.selectParental = ''
        this.showVarietyDetails = false;
        this.seedgotReportSeasonData();
      }
    })
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isSearch = false;
        this.selectCrop = ''
        this.showVarietyDetails = false;
        this.selectVariety = '';
        this.showparental = false;
        this.selectParental = ''
        this.getCrop()
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.cropName = this.cropNameSecond
        let response = this.cropName.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()))
        this.cropName = response
      }
      else {
        this.cropName = this.cropNameSecond
      }
    });
  }

  
 

  toggleSearch() {
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_code'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    else{
    this.searchClicked = !this.searchClicked;
    this.seedgotReportVarietyData();
    this.getGotDetailsReportdata();
    }
   
  }
  onVarietyChange(event: any) {
  const selectedValue = event.target.value;
  console.log("Selected variety:", selectedValue);

  // Optionally update a form control if needed
  this.ngForm.controls['varietyvalue'].setValue(selectedValue);

  // Call your method to fetch the details based on the selected variety
  this.getGotDetailsReportdata();
}
  cancel() {
    this.ngForm.reset();
    this.submitted = false;
  }

 

}
