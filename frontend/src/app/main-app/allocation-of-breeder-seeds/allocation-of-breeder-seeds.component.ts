
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-allocation-of-breeder-seeds',
  templateUrl: './allocation-of-breeder-seeds.component.html',
  styleUrls: ['./allocation-of-breeder-seeds.component.css']
})
export class AllocationOfBreederSeedsComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  fileName = 'allocation-of-breeder-seeds-to-indentors-for-lifting-report.xlsx';

  yearsData: any;
  seasonData: any;
  cropGroupData: any;
  cropData: any;
  crop_groups;

  varietyData: any;
  totalIndentedQuantity: any;
  totalProduction: any;
  totalSurplus: any;

  selectedYear: any;
  selectedCropGroup: any;
  selectedCropName: any;
  today = new Date();

  indentData: any;
  cropGroupDataSecond: any;
  selectCrop_name: any;
  isCropName=false;
  cropDataSecond: any;
  dropdownSettings: IDropdownSettings = {};
  
  constructor(private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private router: Router
  ) {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_group: [''],
      crop_name: [''],
      crop_text: [''],
      name_text: [''],


    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.cropGroupData =this.cropGroupDataSecond
        let response= this.cropGroupData.filter(x=>x.name.toLowerCase().startsWith(newValue.toLowerCase()))      
        this.cropGroupData=response      
      }
      else{
      this.getCropGroupList(this.ngForm.controls['season'].value)
      }
    });

    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue ) {
        console.log(newValue)
        this.cropData =this.cropDataSecond;
        let response= this.cropData.filter(x=>x.name.toLowerCase().startsWith(newValue.toLowerCase()))      
        this.cropData=response      
      }
      else{
      this.cropNameList(this.ngForm.controls['crop_group'].value)
      }
    });
  }

  ngOnInit(): void {
    this.yearsData = [];
    this.dropdownSettings = {
      idField: 'value',
      textField: 'name',
      allowSearchFilter:true
      // enableCheckAll: false,
      // limitSelection: -1,
    };
    this.breederService.getRequestCreatorNew("getYearDataForProducedBreederSeedDetails").subscribe((data: any) => {
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
        this.ngForm.controls['season'].patchValue("");
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");

        let object = {
          "year": Number(newValue)
        }

        this.seasonData = []
        this.breederService.postRequestCreator("getSeasonDataForProducedBreederSeedDetails", null, object).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            data.EncryptedResponse.data.forEach(element => {
              this.seasonData.push({
                value: element['season'],
                name: element['m_season.season']
              })
            });
            // this.seasonData;
          }
        })

      }
    })

    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.getCropGroupList(newValue)

      
      }
    })

    this.ngForm.controls['crop_group'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isCropName=true
        this.ngForm.controls['crop_name'].patchValue("");

       this.cropNameList(newValue)

      }
    })
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      // console.log(response)   
 

      if (newValue) {
        // this.getCropData()
        this.cropGroupData=this.cropGroupDataSecond;
       let response= this.cropGroupData.filter(x=>x.name.toLowerCase().startsWith(newValue.toLowerCase()))      
        this.cropGroupData=response      

      }
      else{
       this.getCropGroupList(this.ngForm.controls['season'].value)
      }
    });
  }
  getCropGroupList(newValue){
    let object = {
      "year": Number(this.ngForm.controls['year_of_indent'].value),
      "season": newValue
    }

    this.cropGroupData = []
    this.breederService.postRequestCreator("getCropGroupDataForProducedBreederSeedDetails", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        data.EncryptedResponse.data.forEach(element => {
          this.cropGroupData.push({
            value: element['group_code'],
            name: element['m_crop_group.group_name']
          })
        });
        this.cropGroupDataSecond = this.cropGroupData
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


  onSearch() {
    if ((!this.ngForm.controls["year_of_indent"].value || !this.ngForm.controls["season"].value || !this.ngForm.controls["crop_group"].value )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Mandatory Fields.</p>',
        icon: 'warning',
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
      this.selectedCropName = 'NA'

      if (this.ngForm.controls["year_of_indent"] && this.ngForm.controls["year_of_indent"].value) {
        searchObject['year'] = Number(this.ngForm.controls["year_of_indent"].value);
        this.selectedYear = this.ngForm.controls["year_of_indent"].value;
      }

      if (this.ngForm.controls["season"] && this.ngForm.controls["season"].value) {
        searchObject['season'] = this.ngForm.controls["season"].value;
      }

      if (this.ngForm.controls["crop_group"] && this.ngForm.controls["crop_group"].value) {
        searchObject['group_code'] = this.ngForm.controls["crop_group"].value;

        this.cropGroupData.forEach(element => {
          if (element.value == this.ngForm.controls["crop_group"].value) {
            this.selectedCropGroup = element['name']
          }
        });
      }

      if (this.ngForm.controls["crop_name"] && this.ngForm.controls["crop_name"].value) {
        if(this.ngForm.controls["crop_name"].value && this.ngForm.controls["crop_name"].value !== undefined && this.ngForm.controls["crop_name"].value.length > 0){
         let cropValueData =[];
         this.ngForm.controls["crop_name"].value.forEach(ele=>{
          cropValueData.push(ele.value);
        })
          searchObject['crop_code1'] = cropValueData && cropValueData.length >0 ? cropValueData :[]
        }
        
        if(this.ngForm.controls["crop_name"].value && this.ngForm.controls["crop_name"].value !== undefined && this.ngForm.controls["crop_name"].value.length > 0){
          let cropNameValue = [];
          this.ngForm.controls["crop_name"].value.forEach(element => {
            console.log("element==========1",element);
          cropNameValue.push(element.name)
          });
          if(cropNameValue && cropNameValue !== undefined && cropNameValue.length>0){
            this.selectedCropName  = cropNameValue.toString();
          }
        }
      }

      this.varietyData = [];
      const pageData = []

      // this.breederService.postRequestCreator("AllocationOfBreederSeedsToIndentorsLifting/getIndentData", null, searchObject).subscribe((data: any) => {
      //   console.log(data)
      // })

      this.breederService.postRequestCreator("AllocationOfBreederSeedsToIndentorsLifting/getPageData", null, searchObject).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
          data.EncryptedResponse.data.forEach(row => {
            let object = {
              year: row['year'],
              season: row['season'],
              crop_code: row['crop_code'],
              variety_id: row['variety_id'],
              variety_name: row['m_crop_variety.variety_name'],
              notification_year: row['variety_notification_year'],
              indent_data: [],
              quantity_produced_data: [],
              total_indent: 0,
              surplus: 0
            }

            if (pageData.length == 0) {
              pageData.push(object)
            }
            else {
              var count = false;
              pageData.forEach(element => {
                if (element.year == row.year && element.season == row.season && element.crop_code == row.crop_code && element.variety_id == row.variety_id) {
                  count = true;

                }
              });

              if (!count) {
                pageData.push(object)
              }
            }
          });


          data.EncryptedResponse.data.forEach(element => {
            this.breederService.postRequestCreator("AllocationOfBreederSeedsToIndentorsLifting/getLiftingData?id=" + element.id).subscribe((liftingData: any) => {

              this.indentData = [];
              pageData.forEach(row => {
                if (element.year == row.year && element.season == row.season && element.crop_code == row.crop_code && element.variety_id == row.variety_id) {
                  let object = {
                    "year": row.year,
                    "season": row.season,
                    "crop_code": row.crop_code,
                    "variety_id": row.variety_id
                  }

                  this.breederService.postRequestCreator('getLabelNumberDataForProducedBreederSeedDetails', null, object).subscribe((labelData: any) => {

                    var temp_allocated_quantity = [];
                    var temp_allocated_quantities = [];
                    var temp_quantity_produced = [];

                    let tempSum = 0;

                    liftingData.EncryptedResponse.data.forEach(record => {
                      temp_allocated_quantity.push({
                        quantity: record.qty,
                        bspc_name: record['user.name']
                      })
                      temp_allocated_quantities.push(record.qty)
                      tempSum += Number(record.qty)
                    });

                    labelData.EncryptedResponse.data.forEach(record2 => {
                      temp_quantity_produced.push(record2.quantity)
                    });

                    row['indent_data'].push({
                      indent_qunatity: element['indent_quantity'],
                      indentor_name: element['user.name'],
                      allocation_quantity: temp_allocated_quantity,
                      allocation_quantities: temp_allocated_quantities,
                      produced_quantity_data: temp_quantity_produced,
                      sum_of_allocation_quantity: tempSum
                    })

                    row['total_indent'] = row['total_indent'] + element['indent_quantity'];
                    row['quantity_produced_data'] = temp_quantity_produced;

                    if (row.indent_data.length > this.indentData.length) {
                      this.indentData = row.indent_data;
                    }

                    let temp_array = []
                    row['indent_data'].forEach(indent => {
                      temp_array = this.sumArray(temp_array, indent.allocation_quantities)
                    });
                    row['total'] = temp_array;

                    let sum_of_total = 0;
                    let sum_of_quantity_produced = 0;
                    temp_array.forEach(element => {
                      sum_of_total += Number(element)
                    });

                    row['quantity_produced_data'].forEach(element => {
                      sum_of_quantity_produced += Number(element)
                    });

                    row['surplus'] = sum_of_quantity_produced - sum_of_total;

                  })
                }
              });

            })
          });

          this.varietyData = pageData;
          console.log(this.varietyData)

        }


      })
    }
  }

  sumArray(a, b) {
    var c = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      c.push((a[i] || 0) + (b[i] || 0));
    }
    return c;
  }
cropNameList(newValue){
  let object = {
    "year": Number(this.ngForm.controls['year_of_indent'].value),
    "season": this.ngForm.controls['season'].value,
    "group_code": newValue
  }

  this.cropData = []
  this.breederService.postRequestCreator("getCropDataForProducedBreederSeedDetails", null, object).subscribe((data: any) => {
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

  clear() {
    this.ngForm.controls['year_of_indent'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_group'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
    this.isCropName=false;

    this.varietyData = []
    this.selectedYear = '';
    this.selectedCropGroup = '';
    this.selectedCropName = '';
  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  exportexcel(): void {
    let element = document.getElementById('excel-table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'allocation-of-breeder-seeds-to-indentors-for-lifting-report';
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
  cgClick() {
    document.getElementById('crop_group').click();
  }
  cropGroup(item: any) {
    this.ngForm.controls['crop_text'].setValue('')
    this.crop_groups = item && item.name ? item.name:'';
  
    this.ngForm.controls['crop_group'].setValue(item && item.value ? item.value:'');
   
  }
  cnclick() {
    document.getElementById('crop_name').click();
  }
  crop_name(item: any) {
    this.selectCrop_name = item && item.name ? item.name : '';   
    this.ngForm.controls["name_text"].setValue("");
    this.ngForm.controls['crop_name'].setValue(item && item.value ? item.value :'')
  }
  getCropNamefrommlist(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.name){
        temp.push(obj.name)
      }
    })
    return temp.toString().length>30 ? temp.toString().substring(0,30) + '...':temp.toString();
   
  }
}