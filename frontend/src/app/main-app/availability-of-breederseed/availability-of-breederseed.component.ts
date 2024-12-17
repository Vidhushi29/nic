import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as html2PDF from 'html2pdf.js';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-availability-of-breederseed',
  templateUrl: './availability-of-breederseed.component.html',
  styleUrls: ['./availability-of-breederseed.component.css']
})
export class AvailabilityOfBreederseedComponent implements OnInit {
  ngForm!: FormGroup;
  rowspan = 3
  fileName = 'availability-of-breeder-seeds.xlsx';
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
  reportData = [
    {
      variety_name:"DW-147",
      variety_code:"ABC123",
      line_variety:"",
      indent_quantity:"180",
      count:1,
      bspc:[
        {
          bspc_name:"BSPC 1",
          target_quantity:"80",
          breeder_quantity:"80"
        }
      ],
      total_production:"120",
      surplus:"-59.85"
    },
    {
      variety_name:"PBW-119",
      variety_code:"ABC123",
      indent_quantity:"5.75",
      line_variety:"H-456",
      count:2,
      bspc:[
        {
          bspc_name:"BSPC 1",
          target_quantity:"3.00",
          breeder_quantity:"3.80"
        },
        {
          bspc_name:"BSPC 2",
          target_quantity:"2.75",
          breeder_quantity:"3.33"
        }
      ],
      total_production:"7.13",
      surplus:"+1.38"
    },
    {
      variety_name:"PBW-119",
      variety_code:"ABC123",
      indent_quantity:"12.00",
      line_variety:"H-123",
      count:2,
      bspc:[
        {
          bspc_name:"BSPC 1",
          target_quantity:"5",
          breeder_quantity:"4.98"
        },
        {
          bspc_name:"BSPC 2",
          target_quantity:"7.00",
          breeder_quantity:"6.30"
        }
      ],
      total_production:"11.28",
      surplus:"-0.72"
    }
  ]
  constructor(private fb: FormBuilder,
    private breederService: BreederService) { this.createEnrollForm() }

  createEnrollForm() {
    this.ngForm = this.fb.group({
      year_of_indent: new FormControl(''),
      season: new FormControl(''),
      crop_group: new FormControl(''),
      crop_text: new FormControl('',),
      crop_name: new FormControl('',),
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
    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropData = this.cropDataSecond
        let response = this.cropData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))

        this.cropData = response
        // this.croupGroupListsecond=this.croupGroupList
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        this.getCropNameData(this.ngForm.controls['crop_group'].value)
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
      textField: 'name',
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

    const param = {
      user_id: this.authUserId,
      user_type: data && data.user_type ? data.user_type : ''

    }
    this.breederService.postRequestCreator("getYearDataForProducedBreederSeedDetailsSecond", null, param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        data.EncryptedResponse.data.forEach(element => {
          let yearString = this.getFinancialYear(element.year);
          this.yearsData.push({
            value: element.year,
            name: yearString
          })
        });
      }
    })

    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isCropName = false;
        this.selectCrop_group = '';
        this.crop_groups = '';
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");

        let object = {
          "year": Number(newValue),
          user_type: data && data.user_type ? data.user_type : ''
        }

        this.seasonData = []
        this.breederService.postRequestCreator("getSeasonDataproductionSecond", null, object).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            data.EncryptedResponse.data.forEach(element => {
              this.seasonData.push({
                value: element['m_season.season_code'],
                name: element['m_season.season']
              })
            });
          }
        })
      }
    })

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.getcropGroup(newValue)
        this.isCropName = false;
        this.selectCrop_group = '';
        this.crop_groups = '';

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
        this.getCropNameData(newValue)



      }
    })

  }

  getCropNameData(newValue) {
    const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(BHTCurrentUser);
    let object = {
      "year": Number(this.ngForm.controls['year_of_indent'].value),
      "season": this.ngForm.controls['season'].value,
      "group_code": newValue,
      user_type: data && data.user_type ? data.user_type : ''
    }

    this.cropData = []
    this.breederService.postRequestCreator("getCropDataProductionseedSecond", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        data.EncryptedResponse.data.forEach(element => {
          this.cropData.push({
            value: element['crop_code'],
            name: element['m_crop.crop_name']
          })
          this.cropDataSecond = this.cropData
        });
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

  onSearch() {
    if ((!this.ngForm.controls["year_of_indent"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_group"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["season"].value && !this.ngForm.controls["crop_group"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["crop_group"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Group.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["crop_name"].value && this.ngForm.controls["crop_name"].value.length < 0)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Name.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }

    else {
      let searchObject = {};
      this.selectedYear = 'NA';
      this.selectedCropGroup = 'NA';
      this.selectedSeason = 'Na'
      this.selectedCropName = 'NA';
      this.disableBtn = false;

      if (this.ngForm.controls["year_of_indent"] && this.ngForm.controls["year_of_indent"].value) {
        searchObject['year'] = Number(this.ngForm.controls["year_of_indent"].value);
        this.selectedYear = this.ngForm.controls["year_of_indent"].value;
      }

      if (this.ngForm.controls["season"] && this.ngForm.controls["season"].value) {
        searchObject['season'] = this.ngForm.controls["season"].value;
        this.selectedSeason = this.ngForm.controls["season"].value;
      }

      if (this.ngForm.controls["crop_group"] && this.ngForm.controls["crop_group"].value) {
        searchObject['group_code'] = this.ngForm.controls["crop_group"].value;

        this.cropGroupData.forEach(element => {
          if (element.value == this.ngForm.controls["crop_group"].value) {
            this.selectedCropGroup = element['name']
          }
        });
      }
      let cropNameData = []
      if (this.ngForm.controls["crop_name"] && this.ngForm.controls["crop_name"].value) {
        searchObject['crop_code'] = this.ngForm.controls["crop_name"].value;
        this.ngForm.controls["crop_name"].value.forEach(element=>{
          cropNameData.push(element.name);
        })
        // this.quantity =this.ngForm.controls["crop_name"].value && this.ngForm.controls["crop_name"].value.split('')[0] == 'A' ? 'Quintal' : 'Kg'
        this.cropData.forEach(element => {
          console.log('element====',element);
          // if (element.value == this.ngForm.controls["crop_name"].value) {
            // cropNameData.push(element.name);
            if(element && element.value.slice(0,1) =="A" ) {
              // Quintal
              this.unitValue = "Quintal"
            }else{
              this.unitValue = "Kg"
            }
          // }
        });
      }
      this.selectedCropName = cropNameData ? cropNameData.toString():'';



      this.varietyData = [];
      let pageData = [];
      let cropName = []

      if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value.length > 0) {
        for (let item of this.ngForm.controls['crop_name'].value) {
          cropName.push(item && item.value ? item.value : '')
        }
      }
      const param = {
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        group_code: this.ngForm.controls['crop_group'].value,
        crop_code: cropName && cropName.length > 0 ? cropName : '',
      }

      this.breederService.postRequestCreator('getproductionSeedData', null, param).subscribe(data => {

        let apires = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        let filteredData = apires && apires.filteredData ? apires.filteredData : '';
        let indentordata = apires && apires.indentordata ? apires.indentordata : '';
        let allocateddata = apires && apires.allocateddata ? apires.allocateddata : '';
        let allocateddatas = allocateddata ? allocateddata.flat() : '';

        const uniqueIndentorDataMap = []
        for (const item of indentordata) {
          let keys = ['variety_id', 'id']
          const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

          if (!uniqueIndentorDataMap[key]) {
            uniqueIndentorDataMap[key] = { ...item }; // Copy the object
          } else {
            uniqueIndentorDataMap[key].total_amount_indent_quantity += item.total_amount_indent_quantity; // Calculate the sum based on the "value" property
          }
        }
        const uniqueJsonArrays = Object.values(uniqueIndentorDataMap);
        for (let data of uniqueJsonArrays) {
          for (let val of filteredData) {
            for (let item of val.variety) {

              if (val.variety_id == data.variety_id) {
                val.total_amount_indent_quantity = (data.total_amount_indent_quantity || 0)
                val.indent_id = (data.id || 'NA')
                item.indent_id = (data.id || 'NA')
              }
            }
          }

        }


        const uniqueDataMap = {}
        for (const item of allocateddatas) {
          let keys = ['variety_id', 'production_center_id']
          const key = keys.map(k => item[k]).join('_'); // Generate a unique key based on the specified keys

          if (!uniqueDataMap[key]) {
            uniqueDataMap[key] = { ...item }; // Copy the object
          } else {
            uniqueDataMap[key].quantity_of_seed_produced += item.quantity_of_seed_produced; // Calculate the sum based on the "value" property
          }
        }
        const uniqueAllocationJsonArray = Object.values(uniqueDataMap);

        const unquiAllocationArr = [];
        unquiAllocationArr.push(uniqueAllocationJsonArray)
        let unquiAllocationArrs = unquiAllocationArr && unquiAllocationArr[0] ? unquiAllocationArr[0] : ''
        let abc;
        abc = this.mergeArrays(uniqueJsonArrays, unquiAllocationArrs)

        let result = [];
        abc.forEach(element => {
          if (element.quantity_of_seed_produced) {
            result.push(element)
          }

        });
        const mergedData = indentordata.reduce((result, item) => {
          if (!result[item.variety_id]) {
            result[item.variety_id] = { ...item };
          } else {
            result[item.variety_id].total_amount_indent_quantity += item.total_amount_indent_quantity;
          }
          return result;
        }, {});
        let arrr = Object.values(mergedData)
        let allocationarr = [];
        allocationarr.push(arrr)
        let allocationarr2 = allocationarr ? allocationarr[0] : ''




        for (let data of unquiAllocationArrs) {
          for (let item of filteredData) {
            for (let val of item.variety) {
              if (data.variety_id == val.variety_id && data.production_center_id == val.userId) {
                val.qty = data.quantity_of_seed_produced
              }
            }
          }
        }
        for (let data of allocationarr2) {
          for (let val of filteredData) {
            if (data.variety_id == val.variety_id) {
              val.total_amount_indent_quantity = (data.total_amount_indent_quantity || 0)
            }

          }

        }
        let total_amount_indent_quantitysum = 0;
        for (let val of filteredData) {
          val.totalvarieylength = val.variety.length;
          let sum = 0;
          let diff = 0
          total_amount_indent_quantitysum += val.total_amount_indent_quantity
          val.total_amount_indent_quantitysum = total_amount_indent_quantitysum
          for (let data of val.variety) {
           

              sum += data && data.total_indent ? parseFloat(data.total_indent) : 0
              val.totalProducedQty = sum
  
              diff = parseFloat(val.total_amount_indent_quantity) - parseFloat(data.produced_qty)
              data.totalDiff = diff
            

          }
        }

        this.dataToDisplay = filteredData
        if (this.dataToDisplay && this.dataToDisplay.length > 0) {

          this.total_amount_indent_quantitysum = this.dataToDisplay.reduce((total, item) => total + item.total_amount_indent_quantity, 0);
          this.sumOftotalProducedQty = this.dataToDisplay.reduce((total, item) => total + item.totalProducedQty, 0);
          this.quantityValue = this.dataToDisplay.reduce((totalSum, item) => {
            const valuesSum = item.variety.reduce((acc, value) => acc + value.qty, 0);
            return totalSum + valuesSum;
          }, 0);
        }
        let forward_by_icar = [];
        let forward_by_pdpc = [];

        for (let val of filteredData) {

          if (this.usertType == 'ICAR' || this.usertType == 'HICAR') {
            // forward_by_icar.push(val.forward_by_icar)
            if (val.forward_by_icar == 1) {
              this.disableBtn = true
            } else {
              this.disableBtn = false
            }
          }
          else
            if (val.forward_by_pdpc == 1) {
              this.disableBtn = true
            } else {
              this.disableBtn = false
            }

        }

      })
    }
  }

  onClear() {
    this.ngForm.controls['year_of_indent'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_group'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
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
        scale: 4,
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
    this.ngForm.controls['crop_text'].setValue('',{emitEvent:false})
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
    this.selectCrop_group = item && item.name ? item.name : '';
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

  forward() {
    if(this.usertType=='ICAR' || this.usertType=='HICAR'){
      
        Swal.fire({
        toast: false,
        icon: "question",
        title: "Are You Sure To Forward to Seed Division ?",
        position: "center",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        customClass: {
          title: 'list-action-confirmation-title',
          actions: 'list-confirmation-action'
        }
      }).then(result => {
        if (result.isConfirmed) {
          let VarietId = []
          for (let data of this.dataToDisplay) {
            VarietId.push(data.variety_id)
      
          }
          let cropname = [];
      
          if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value.length > 0) {
      
            for (let data of this.ngForm.controls['crop_name'].value) {
      
              cropname.push(data && data.value ? data.value : '')
            }
          }
          const param = {
            VarietId: VarietId,
            user_type: this.usertType,
            year: this.ngForm.controls['year_of_indent'].value,
            season: this.ngForm.controls['season'].value,
            group_code: this.ngForm.controls['crop_group'].value,
            crop_code: cropname && cropname.length > 0 ? cropname : '',
            user_id: this.authUserId ? this.authUserId : ''
      
          }
          this.breederService.postRequestCreator('forward', null, param).subscribe(apiResponse => {
            if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
              this.disableBtn = true
              Swal.fire({
                // toast: true,
                title: '<p style="font-size:25px;">Data Has Been Successfully Forwarded.</p>',
                icon: 'success',
                confirmButtonText:
                  'OK',
                confirmButtonColor: '#E97E15',
      
              })
            }
      
          })
        }

    })
  
  }
  else{
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Forward to ICAR ?",
      position: "center",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        title: 'list-action-confirmation-title',
        actions: 'list-confirmation-action'
      }
    }).then(result => {
      if (result.isConfirmed) {
        let VarietId = []
        for (let data of this.dataToDisplay) {
          VarietId.push(data.variety_id)
    
        }
        let cropname = [];
    
        if (this.ngForm.controls['crop_name'].value && this.ngForm.controls['crop_name'].value.length > 0) {
    
          for (let data of this.ngForm.controls['crop_name'].value) {
    
            cropname.push(data && data.value ? data.value : '')
          }
        }
        const param = {
          VarietId: VarietId,
          user_type: this.usertType,
          year: this.ngForm.controls['year_of_indent'].value,
          season: this.ngForm.controls['season'].value,
          group_code: this.ngForm.controls['crop_group'].value,
          crop_code: cropname && cropname.length > 0 ? cropname : '',
          user_id: this.authUserId ? this.authUserId : ''
    
        }
        this.breederService.postRequestCreator('forward', null, param).subscribe(apiResponse => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
            this.disableBtn = true
            Swal.fire({
              // toast: true,
              title: '<p style="font-size:25px;">Data Has Been Successfully Forwarded.</p>',
              icon: 'success',
              confirmButtonText:
                'OK',
              confirmButtonColor: '#E97E15',
    
            })
          }
    
        })
      }

  })
  }

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
  parseFloat(item){
    return parseFloat(item)
  }

}
