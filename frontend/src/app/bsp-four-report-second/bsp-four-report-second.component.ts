import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as html2PDF from 'html2pdf.js';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-bsp-four-report-second',
  templateUrl: './bsp-four-report-second.component.html',
  styleUrls: ['./bsp-four-report-second.component.css']
})
export class BspFourReportSecondComponent implements OnInit {

  ngForm!: FormGroup;
  rowspan = 3
  fileName = 'submit-indents-breeder-seeds.xlsx';
  isCropName = false
  productionData = [
    {
      'variety': 'godavari',
      'indent_quantity': 32,
      'name_bspc': 'ABC',
    },
    {
      'variety': 'godavari',
      'indent_quantity': 32,
      'name_bspc': 'XYZ',
    },
    {
      'variety': 'MANJULA (K-329)',
      'indent_quantity': 50,
      'name_bspc': 'XYZ',
    },

  ]
  dropdownSettings: IDropdownSettings = {};

  yearsData: any;
  seasonData: any;
  cropGroupData: any;
  cropData: any;

  varietyData: any;
  totalIndentedQuantity: any;
  totalProduction: any;
  totalSurplus: any;

  selectedYear: any;
  selectedCropGroup: any;
  selectedCropName: any;
  today = new Date();
  authUserId: any;
  cropTypeLoginWise: string;
  crop_groups;
  cropGroupDatasecond: any;
  selectCrop_group: any;
  cropDataSecond: any;
  dataToDisplay: any;
  usertType: any;
  disableBtn: boolean;
  selectedSeason: string;
  quantity: string;
  total_amount_indent_quantitysum: any;
  quantityValue: any;
  sumOftotalProducedQty: any;
  unitValue: string;
  cropType: any;

  constructor(private fb: FormBuilder,
    private productionService: ProductioncenterService,
    private breederService: BreederService) { this.createEnrollForm() }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      year_of_indent: new FormControl(''),
      season: new FormControl(''),
      crop_group: new FormControl(''),
      crop_text: new FormControl('',),
      crop_name: new FormControl('',),
      crop_type: new FormControl('',),
      name_text: new FormControl('',),

    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      // console.log(response)   


      if (newValue && this.cropGroupData && this.cropGroupData.length) {
        // this.getCropData()
        this.cropGroupData = this.cropGroupDatasecond;
        let response = this.cropGroupData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropGroupData = response
      }
      else {
        this.getcropGroup(this.ngForm.controls['season'].value)
      }
    });

  }

  ngOnInit(): void {
    let arr = [];
    for (let i = 0; i < this.productionData.length; i++) {
      arr.push(this.productionData[i].variety)
    }
    this.dropdownSettings = {
      idField: 'value',
      textField: 'display_text',
      enableCheckAll: false,
      allowSearchFilter: true,
      singleSelection: true,
      closeDropDownOnSelection: true,

      // itemsShowLimit: 2,
      limitSelection: -1,
    };

    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    this.authUserId = data.id;
    this.usertType = data && data.user_type ? data.user_type : ''
    if (data.user_type == 'ICAR') {
      this.cropTypeLoginWise = 'A';
    } else if (data.user_type == 'HICAR') {
      this.cropTypeLoginWise = 'H';
    }
    this.yearsData = [];
    this.getYearData()
    const param = {
      user_id: this.authUserId,
      user_type: data && data.user_type ? data.user_type : ''

    }



    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isCropName = false;
        this.selectCrop_group = '';
        this.crop_groups = '';
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['crop_type'].setValue("");

        let object = {
          "year": Number(newValue),
          user_type: data && data.user_type ? data.user_type : ''
        }
        this.dataToDisplay=[];
        this.seasonData = [];
        this.getSeasonData()
      }
    })

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['crop_type'].setValue("");
        this.getcroptype()
        this.isCropName = false;
        this.selectCrop_group = '';
        this.crop_groups = '';
        this.dataToDisplay=[];

        // let object = {
        //   "year": Number(this.ngForm.controls['year_of_indent'].value),
        //   "season": newValue,
        //   "crop_type":this.cropTypeLoginWise
        // }


      }
    })

    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isCropName = true
        this.selectCrop_group = '';

        this.ngForm.controls['crop_name'].patchValue("");




      }
    })
    this.ngForm.controls['crop_type'].valueChanges.subscribe(value => {
      if (value) {
        this.dataToDisplay=[];
        this.getCrop();
      }
    })

  }


  getcropGroup(newValue) {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    let object = {
      "year": Number(this.ngForm.controls['year_of_indent'].value),
      "season": newValue,
      user_type: data && data.user_type ? data.user_type : ''
    }
    this.cropGroupData = []
    this.breederService.postRequestCreator("getCropGroupDataProductionSecond", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        data.EncryptedResponse.data.forEach(element => {
          this.cropGroupData.push({
            value: element['group_code'],
            name: element['m_crop.m_crop_group.group_name']
          })
        });
        this.cropGroupDatasecond = this.cropGroupData
      }
    })
  }
  getYearData() {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    let user_type = data.user_type

    const param={
      search:{
        user_type:user_type
      }

    }
    this.productionService.postRequestCreator("get-year-of-bsp-four-report", param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.yearsData = res ? res : '';
    })
  }
  getSeasonData() {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    let user_type = data.user_type

    const param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        user_type:user_type
      }
    }
    this.productionService.postRequestCreator("get-season-of-bsp-four-report", param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.seasonData = res ? res : '';
    })
  }
  getcroptype() {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    let user_type = data.user_type
    const param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        user_type:user_type
      }
    }
    this.productionService.postRequestCreator("get-crop-type-of-bsp-four-report", param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      let cropType = []
      let outputArray;
      if (res && res.length > 0) {
        outputArray = res.map(item => {
          return { "value": item.value.charAt(0) };
        });
      }
      if(outputArray && outputArray.length>0){
        outputArray = outputArray.filter((arr, index, self) =>
    index === self.findIndex((t) => (t.value === arr.value )))

      }

      this.cropType = outputArray ? outputArray : '';

    })
  }
  getCrop() {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    let user_type = data.user_type
    const param = {
      search: {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        user_type:user_type
      }
    }
    this.productionService.postRequestCreator("get-crop-of-bsp-four-report", param).subscribe((data: any) => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.cropDataSecond = res ? res : '';
    })
  }
  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  getPageData() {
    // let object = {
    //   "year": 
    // }
    // this.breederService.postRequestCreator()
  }

  // onSearch() {
  //   if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value)) {
  //     Swal.fire({
  //       title: '<p style="font-size:25px;">Please Select Something.</p>',
  //       icon: 'error',
  //       confirmButtonText:
  //         'OK',
  //       confirmButtonColor: '#E97E15'
  //     })

  //     return;
  //   }
  //   if ((!this.ngForm.controls["season"].value)) {
  //     Swal.fire({
  //       title: '<p style="font-size:25px;">Please Select Season.</p>',
  //       icon: 'error',
  //       confirmButtonText:
  //         'OK',
  //       confirmButtonColor: '#E97E15'
  //     })

  //     return;
  //   }
  //   if ((!this.ngForm.controls["crop_type"].value)) {
  //     Swal.fire({
  //       title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
  //       icon: 'error',
  //       confirmButtonText:
  //         'OK',
  //       confirmButtonColor: '#E97E15'
  //     })

  //     return;
  //   }
  //   if ((!this.ngForm.controls["crop_name"].value && this.ngForm.controls["crop_name"].value.length < 0)) {
  //     Swal.fire({
  //       title: '<p style="font-size:25px;">Please Select Crop Name.</p>',
  //       icon: 'error',
  //       confirmButtonText:
  //         'OK',
  //       confirmButtonColor: '#E97E15'
  //     })

  //     return;
  //   }

  //   else {
  //     let searchObject = {};
  //     this.selectedYear = 'NA';
  //     this.selectedCropGroup = 'NA';
  //     this.selectedSeason = 'Na'
  //     this.selectedCropName = 'NA';
  //     const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
  //     const data = JSON.parse(BHTCurrentUser);
  //     this.disableBtn = false;
  //     const param = {
  //       search: {
  //         year: this.ngForm.controls['year_of_indent'].value,
  //         season: this.ngForm.controls['season'].value,
  //         crop_type: this.ngForm.controls['crop_type'].value,
  //         crop_code: this.ngForm.controls['crop_name'].value,
  //         user_type:data && data.user_type ? data.user_type:''
  //       }
  //     }
  //     this.productionService.postRequestCreator('get-bsp-four-report', param).subscribe(data => {
  //       let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
  //       let fitlerData = res && res.filterData ? res.filterData : '';
  //       let indentofBreder = res && res.indentofBreder ? res.indentofBreder : '';
  //       if (fitlerData && fitlerData.length > 0) {
  //         if (indentofBreder && indentofBreder.length > 0) {

  //           fitlerData = fitlerData.map(firstItem => {
  //             let filteredData;
  //             if (firstItem.variety_code_line) {
  //               filteredData = indentofBreder
  //                 .filter(secondItem =>
  //                   firstItem.variety_code === secondItem.variety_code && firstItem.variety_code_line === secondItem.variety_code_line)
  //                 .map(secondItem => ({
  //                   indent_quantity: secondItem.indent_quantity,
  //                   quantity: secondItem.quantity
  //                 }));
  //             } else {
  //               filteredData = indentofBreder
  //                 .filter(secondItem =>
  //                   firstItem.variety_code === secondItem.variety_code)
  //                 .map(secondItem => ({
  //                   indent_quantity: secondItem.indent_quantity,
  //                   quantity: secondItem.quantity
  //                 }));
  //             }

  //             return {
  //               ...firstItem,
  //               indent_quantity: filteredData.map(item => item.indent_quantity),
  //               quantity: filteredData.map(item => item.quantity)
  //             };
  //           });


  //         }

  //       }
  //       if (fitlerData && fitlerData.length > 0) {
  //         let sum=0;
  //         let allocate_qty=0;
  //         let indentQty=0
  //         fitlerData.forEach((el) => {
  //           let totalProducedQtySum=0
  //           el.user_data.forEach((val)=>{

  //             sum+=val && val.target_qty_national ? parseFloat(val.target_qty_national):0;
  //             allocate_qty+=val && val.allocate_qty ? parseFloat(val.allocate_qty):0;
  //             totalProducedQtySum+=val && val.allocate_qty  ?  val.allocate_qty:0;
  //             val.totalProducedQty= totalProducedQtySum;
  //             // if(val && val.target_qty_national && val.allocate_qty){                
  //             //   val.totalProducedQty= parseFloat(val.allocate_qty) +  parseFloat(val.target_qty_national)
  //             // }else{
  //             //   val.totalProducedQty=val && val.allocate_qty ? val.allocate_qty: val && val.target_qty_national ? val.target_qty_national:0;
  //             // }

  //             if(el && el.variety_code_line){
  //               el.quantity = el && el.quantity && (el.quantity.length>0) ? this.getSum(el.quantity) :0
  //             }else{
  //               el.quantity = el && el.indent_quantity && (el.indent_quantity.length>0) ? this.getSum(el.indent_quantity) :0
  //             }
  //             if(el && el.quantity && val.totalProducedQty){
  //               val.totalSurplus = parseFloat(val.totalProducedQty) - el.quantity
  //             }else{
  //               val.totalSurplus = val && val.totalProducedQty ? val.totalProducedQty: el && el.quantity ? el.quantity :0
  //             }
  //             this.quantityValue= sum;
  //             indentQty+= el && el.quantity  ? parseFloat(el.quantity):0
  //             // el.quantityValue=su
  //             this.total_amount_indent_quantitysum= indentQty ? indentQty.toFixed(2):0
  //             this.sumOftotalProducedQty=allocate_qty;
  //           })    
  //         })
  //       }
  //       this.dataToDisplay = fitlerData;
  //       console.log('data', this.quantityValue)
  //     })




  //   }
  // }
  onSearch() {
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
  
    if ((!this.ngForm.controls["season"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
  
    if ((!this.ngForm.controls["crop_type"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
  
    if ((!this.ngForm.controls["crop_name"].value && this.ngForm.controls["crop_name"].value.length < 0)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Name.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    } else {
      let searchObject = {};
      this.selectedYear = 'NA';
      this.selectedCropGroup = 'NA';
      this.selectedSeason = 'NA';
      this.selectedCropName = 'NA';
      const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
      const data = JSON.parse(BHTCurrentUser);
      this.disableBtn = false;
  
      const param = {
        search: {
          year: this.ngForm.controls['year_of_indent'].value,
          season: this.ngForm.controls['season'].value,
          crop_type: this.ngForm.controls['crop_type'].value,
          crop_code: this.ngForm.controls['crop_name'].value,
          user_type: data && data.user_type ? data.user_type : ''
        }
      };
  
      this.productionService.postRequestCreator('get-bsp-four-report', param).subscribe(data => {
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        let fitlerData = res && res.filterData ? res.filterData : '';
        let indentofBreder = res && res.indentofBreder ? res.indentofBreder : '';
  
        if (fitlerData && fitlerData.length > 0 && indentofBreder && indentofBreder.length > 0) {
          fitlerData = fitlerData.map(firstItem => {
            let filteredData;
            if (firstItem.variety_code_line) {
              filteredData = indentofBreder
                .filter(secondItem =>
                  firstItem.variety_code === secondItem.variety_code && firstItem.variety_code_line === secondItem.variety_code_line)
                .map(secondItem => ({
                  indent_quantity: secondItem.indent_quantity,
                  quantity: secondItem.quantity
                }));
            } else {
              filteredData = indentofBreder
                .filter(secondItem =>
                  firstItem.variety_code === secondItem.variety_code)
                .map(secondItem => ({
                  indent_quantity: secondItem.indent_quantity,
                  quantity: secondItem.quantity
                }));
            }
  
            return {
              ...firstItem,
              indent_quantity: filteredData.map(item => item.indent_quantity),
              quantity: filteredData.map(item => item.quantity)
            };
          });
        }
  
        if (fitlerData && fitlerData.length > 0) {
          let sum = 0;
          let allocate_qty = 0;
          let indentQty = 0;
        
          fitlerData.forEach((el) => {
            let totalProducedQtySum = 0;
        
            el.user_data.forEach((val) => {
              // Calculate the sum of `target_qty_national`
              sum += val && val.target_qty_national ? parseFloat(val.target_qty_national) : 0;
        
              // Calculate the sum of `allocate_qty`
              allocate_qty += val && val.allocate_qty ? parseFloat(val.allocate_qty) : 0;
        
              // Accumulate `allocate_qty` for totalProducedQtySum
              totalProducedQtySum += val && val.allocate_qty ? parseFloat(val.allocate_qty) : 0;
            });
        
            // Assign the accumulated `totalProducedQtySum` to each BSPC entry
            el.user_data.forEach((val) => {
              val.totalProducedQty = totalProducedQtySum;
        
              if (el && el.variety_code_line) {
                el.quantity = el.quantity && el.quantity.length > 0 ? this.getSum(el.quantity) : 0;
              } else {
                el.quantity = el.indent_quantity && el.indent_quantity.length > 0 ? this.getSum(el.indent_quantity) : 0;
              }
        
              if (el && el.quantity) {
                if (val && val.totalProducedQty && parseFloat(val.totalProducedQty) > 0) {
                  val.totalSurplus = parseFloat(val.totalProducedQty) - el.quantity;
                } else {
                  val.totalSurplus = -el.quantity;
                }
              } else {
                val.totalSurplus = val && val.totalProducedQty ? parseFloat(val.totalProducedQty) : 0;
              }
        
              this.quantityValue = sum;
            });
        
            // Summing indent quantities only once per BSPC entry for each variety
            let uniqueIndentQty = Array.isArray(el.indent_quantity)
              ? el.indent_quantity.reduce((acc, curr) => acc + parseFloat(curr), 0)
              : parseFloat(el.indent_quantity) || 0;
        
            indentQty += uniqueIndentQty;
          });
        
          // Correct the `total_amount_indent_quantitysum` calculation
          this.total_amount_indent_quantitysum = indentQty ? indentQty.toFixed(2) : 0;
          this.sumOftotalProducedQty = allocate_qty;
        }
  
        this.dataToDisplay = fitlerData;
        console.log('data', this.quantityValue);
      });
    }
  }
  
  getSum(item){
   if(item && item.length>0){
    item = item.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return item ? item.toFixed(2):'NA'
   }else{
    return 'NA'
   }
  }

  onClear() {
    this.ngForm.controls['year_of_indent'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_group'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
    this.ngForm.controls['crop_type'].patchValue('')
    this.selectCrop_group = '';
    this.crop_groups = '';
    this.disableBtn = false;
    this.dataToDisplay = []
  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  download() {
    const name = 'submit-indents-breeder-seeds';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 192,
        scale: 1,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  cropGroup(item: any) {
    this.cropGroupData = this.cropGroupDatasecond;
    this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
    this.crop_groups = item && item.name ? item.name : '';
    this.ngForm.controls['crop_group'].setValue(item && item.value ? item.value : '');
  }
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cnClick() {
    document.getElementById('crop_name').click();
  }
  crop_name(item: any) {
    this.selectCrop_group = item && item.display_text ? item.display_text : '';
    this.ngForm.controls["name_text"].setValue("");
    this.ngForm.controls['crop_name'].setValue(item && item.value ? item.value : '')
  }
  cnclick() {
    document.getElementById('crop_name').click();
  }

  mergeArrays(arr1, arr2) {
    const mergedArray = arr1.map(item1 => {
      // Find the corresponding item in the second array based on multiple conditions
      const correspondingItem = arr2.find(item2 => {
        // Add your multiple conditions here for matching
        return item2.variety_id === item1.variety_id && item2.indent_of_breederseed_id === item1.id;
      });

      if (correspondingItem) {
        // Merge properties from both arrays
        return { ...item1, ...correspondingItem };
      } else {
        // If no corresponding item found in array2, return the item from array1 as is
        return { ...item1 };
      }
    });

    // Add items from array2 that don't exist in array1
    arr2.forEach(item2 => {
      const existingItem = arr1.find(item1 => item1.variety_id === item2.variety_id && item1.id === item2.indent_of_breederseed_id);
      if (!existingItem) {
        mergedArray.push({ ...item2 });
      }
    });

    return mergedArray;
  }


  calculateSum(number) {
    let sum = 0;
    let myNums = [];
    myNums.push(number)
    if (myNums && myNums.length > 0) {

      for (let i = 0; i < myNums.length; i++) {
        sum += myNums[i];
      }
      return sum
    } else {
      return number;
    }
    // this.sum = this.jsonData.reduce((total, item) => total + item.value, 0);
  }
  parseFloat(item) {
    return parseFloat(item)
  }
}