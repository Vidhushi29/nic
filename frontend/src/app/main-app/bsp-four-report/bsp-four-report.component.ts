import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
// import { AddSeedTestingLaboratorySearchComponent } from 'src/app/common/add-seed-testing-laboratory-search/add-seed-testing-laboratory-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { MasterService } from 'src/app/services/master/master.service';
// import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
// import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

@Component({
  selector: 'app-bsp-four-report',
  templateUrl: './bsp-four-report.component.html',
  styleUrls: ['./bsp-four-report.component.css']
})

export class BspFourReportComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;
  response_crop_group: any = [];
  data: any;
  data1: any;
  custom_array: any[];
  finalData: any[];
  fileName = 'BSP IV xlsx Report.xlsx';
  yearOfIndent: any = [

  ];
  year: any;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  breeder: any;
  crop: any;
  variety: any;
  bspc: any;
  breederList: any = [];
  cropNameList: any = [];
  varietyNameList: any = [];
  bspcList: any = [];
  breeder_id: any;
  crop_id: any;
  isSearch: boolean = false;
  todayData = new Date();
  tableId: any[];
  seasonData: any;
  crop_type: any;
  pcpdArr: any;
  cropnameArr: any;
  varietylist2: any;
  user_type: any;
  dataToDisplay: any;
  cropdropdownHidden: boolean = true;
  varietydropdownHidden: boolean = true;

  constructor(private breederService: BreederService, private masterService: MasterService, private fb: FormBuilder, private service: SeedServiceService, private router: Router, private productionService: ProductioncenterService) {
    this.createEnrollForm();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      breeder: ['',],
      season: [''],
      crop_type: [''],
      crop: ['',],
      year: ['',],
      variety: ['',],
      bspc: ['',],
    });
    this.ngForm.controls['breeder'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('breeder id', newValue);
        this.getCropNameList(newValue);
        this.getBspcList(newValue);
      }
    });
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('breeder id', newValue);
        this.getSeason(newValue);
        this.ngForm.controls['breeder'].patchValue("");
        this.ngForm.controls['crop'].patchValue("");
        this.ngForm.controls['variety'].patchValue("");
        this.ngForm.controls['bspc'].patchValue("");
        this.ngForm.controls['crop_type'].patchValue("");
        this.ngForm.controls['season'].patchValue("");

      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('breeder id', newValue);
        this.getCropType(newValue)
        this.ngForm.controls['breeder'].patchValue("");
        this.ngForm.controls['crop'].patchValue("");
        this.ngForm.controls['variety'].patchValue("");
        this.ngForm.controls['bspc'].patchValue("");
        this.ngForm.controls['crop_type'].patchValue("");
        // this.getSeason(newValue);

      }
    });
    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('breeder id', newValue);
        // this.getbsppcpd(newValue)
        this.cropdropdownHidden = false;
        this.getbsp4CropName(newValue)
        this.ngForm.controls['breeder'].patchValue("");
        this.ngForm.controls['crop'].patchValue("");
        this.ngForm.controls['variety'].patchValue("");
        this.ngForm.controls['bspc'].patchValue("");
        // this.getSeason(newValue);

      }
    });
    this.ngForm.controls['bspc'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('breeder id', newValue);

        // this.getSeason(newValue);

        this.ngForm.controls['breeder'].patchValue("");
        this.ngForm.controls['crop'].patchValue("");
        this.ngForm.controls['variety'].patchValue("");

      }
    });
    this.ngForm.controls['crop'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log('breeder id', newValue);
        this.varietydropdownHidden = false;
        this.getbsp4VarietName(newValue)

        this.ngForm.controls['breeder'].patchValue("");
        this.ngForm.controls['variety'].patchValue("");
        // this.getSeason(newValue);

      }
    });
  }
  ngOnInit(): void {
    // localStorage.setItem('logined_user', "Seed");
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.dropdownSettings = {
      idField: 'crop_code',
      // idField: 'item_id',
      textField: 'crop_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };
    this.dropdownSettings1 = {
      idField: 'variety_id',
      textField: 'variety_name',
      allowSearchFilter: true
      // enableCheckAll: false,
      // limitSelection: -1,
    };
    this.getYearDataList();
    this.getBreederList();
    // this.getCropNameList();
    // this.getMasterBspReportData();
    this.initProcess()
    const userData = localStorage.getItem('BHTCurrentUser');
    const data = JSON.parse(userData);
    this.user_type = data.user_type
  }
  initProcess() {
    this.getyearOfIndent()
  }

  submit() {
    if (
      !this.ngForm.controls['year'].value && !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all  Mandatory Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }
    if (
      !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select  Season Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }
    if (

      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Type Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }
    else {

      this.isSearch = true;
      this.year = this.ngForm.controls['year'].value;
      this.breeder = this.ngForm.controls['breeder'].value;
      this.crop = this.ngForm.controls['crop'].value;
      this.variety = this.ngForm.controls['variety'].value;
      this.bspc = this.ngForm.controls['bspc'].value;

      const searchData = {
        year: this.year,
        breeder: this.breeder,
        crop: this.crop,
        variety: this.variety,
        bspc: this.bspc
      }

      this.getMasterBspReportData(1, searchData);
    }
  }

  clear() {
    this.ngForm.controls['year'].patchValue("");
    this.ngForm.controls['breeder'].patchValue("");
    this.ngForm.controls['crop'].patchValue("");
    this.ngForm.controls['variety'].patchValue("");
    this.ngForm.controls['bspc'].patchValue("");
    this.ngForm.controls['crop_type'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.dataToDisplay = []
    this.getMasterBspReportData();
  }

  getYearDataList() {
    const route = "get-bsp-four-filter-data";
    const result = this.masterService.postRequestCreator(route, null, {
      search: {
        user_type: this.user_type,
        type: 'report_icar'
      }
    }).subscribe((data: any) => {
      console.log('year data', data);
      this.yearOfIndent = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
    })
  }

  cropGroup(data: string) {
    { }
  }
  async shortStatename() {
    const route = 'get-state-list';
    const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
      this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
      // console.log('state======>',this.statename);

    })
  }

  async getMasterBspReportData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {

    const route = 'getBsp4ReportData';
    const result = await this.masterService.postRequestCreator(route, null, {
      reportType: 'four',
      page: loadPageNumberData,
      pageSize: this.filterPaginateSearch.itemListPageSize || 10,
      search: searchData
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined &&
        apiResponse.EncryptedResponse !== undefined &&
        apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data.data;
        this.data1 = apiResponse.EncryptedResponse.data;

      }

    });
  }

  freeze() {
    const searchFilters = {
      "search": {
        "id": this.tableId
      }
    };
    const route = "freeze-indent-breeder-seed-data";
    this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
      if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code &&
        apiResponse.EncryptedResponse.status_code == 200) {
        Swal.fire({
          title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
          icon: 'success',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        }).then(x => {

          this.router.navigate(['/bsp-four-report']);
        })
      } else {

        Swal.fire({
          title: '<p style="font-size:25px;">An Error Occured.</p>',
          icon: 'error',
          confirmButtonText:
            'OK',
          confirmButtonColor: '#E97E15'
        })
      }

    });
  }

  getCroupCroupList() {
    const route = "crop-group";
    const result = this.service.getPlansInfo(route).then((data: any) => {
      this.response_crop_group = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }
  initSearchAndPagination() {
    this.paginationUiComponent.Init(this.filterPaginateSearch);
    if (this.paginationUiComponent === undefined) {


      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    // this.indentBreederSeedAllocationSearchComponent.Init(this.filterPaginateSearch);
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
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'bsp-four-report';
    const element = document.getElementById('pdf-table');
    const options = {
      filename: `${name}.pdf`,
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        dpi: 192,
        scale: 4,
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

  getBreederList() {
    const route = "get-breeder-name-list";

    const result = this.masterService.postRequestCreator(route, null, {
      // search: {
      //   type: 'bsp-one',
      //   year: newValue
      // }
    }).subscribe((data: any) => {
      console.log('data', data);
      this.breederList = data && data['EncryptedResponse'] && data['EncryptedResponse'].data && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : [];
      console.log('breeder data', this.breederList);
    })
  }

  async getCropNameList(newValue) {
    this.masterService
      .postRequestCreator("get-crop-list", null, {
        search: {
          breeder_id: newValue,
          year: this.ngForm.controls['year'].value
        }
      })
      .subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code && data.EncryptedResponse.status_code == 200) {
          data.EncryptedResponse.data.forEach((x: any, index: number) => {
            this.cropNameList.push(x);
          });
        }
      });
  }

  async getVarietyNameList(crop_id) {
    const route = "get-variety-name-list";
    const result = await this.masterService.postRequestCreator(route, null, {
      crop_id: crop_id
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined && apiResponse.EncryptedResponse.status_code == 200) {
        this.varietyNameList = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : [];
        if (!crop_id) {
          this.varietyNameList = [];
        }
      }
    });
  }

  async getBspcList(breeder_id) {
    const route = "get-bspc-list";
    const result = await this.masterService.postRequestCreator(route, null, {
      breeder_id: breeder_id
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined && apiResponse.EncryptedResponse !== undefined && apiResponse.EncryptedResponse.status_code == 200) {
        this.bspcList = apiResponse && apiResponse['EncryptedResponse'] && apiResponse['EncryptedResponse'].data && apiResponse['EncryptedResponse'].data ? apiResponse['EncryptedResponse'].data : [];
        if (!breeder_id) {
          this.bspcList = [];
        }
      }
    });
  }
  getyearOfIndent() {
    this.productionService.postRequestCreator('getbsp4ryearofindentreport').subscribe(data => {
      console.log(data)
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.yearOfIndent = res
      console.log(this.yearOfIndent, 'year', res)
    })

  }
  getSeason(newValue) {
    const param = {
      search: {
        year: newValue,
        user_type: this.user_type,
        type: 'report_icar'
      }
    }
    this.productionService.postRequestCreator('getbsp4seasonreport', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      console.log(res, 'resss')
      this.seasonData = res;
      // this.yearOfIndent= res
      // console.log(this.yearOfIndent,'year',res)
    })

  }
  getCropType(newValue) {
    const param = {
      search: {
        season: newValue,
        year: this.ngForm.controls['year'].value,
        user_type: this.user_type,
        type: 'report_icar'
      }
    }
    this.productionService.postRequestCreator('getbsp4cropTypereport', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      res = res.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.crop_type === arr.crop_type)))
      this.crop_type = res
      // this.seasonData = res;
      // this.yearOfIndent= res
      // console.log(this.yearOfIndent,'year',res)
    })

  }
  getbsppcpd(newValue) {
    const param = {
      search: {
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year'].value,
        crop_tpye: newValue
      }
    }
    this.productionService.postRequestCreator('getbsp4pdpc', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      console.log(res, 'resss')
      this.pcpdArr = res
      // this.crop_type=res
      // this.seasonData = res;
      // this.yearOfIndent= res
      // console.log(this.yearOfIndent,'year',res)
    })

  }
  getbsp4CropName(newValue) {
    const param = {
      search: {
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year'].value,
        crop_type: this.ngForm.controls['crop_type'].value,
        // pcpd:newValue
      }
    }
    this.masterService.postRequestCreator('getbsp4CropName', null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      console.log(res, 'resss')
      this.cropnameArr = res
      // this.crop_type=res
      // this.seasonData = res;
      // this.yearOfIndent= res
      // console.log(this.yearOfIndent,'year',res)
    })

  }
  getbsp4VarietName(newValue) {
    const crop_codeArr = []
    if (this.ngForm.controls['crop'].value && this.ngForm.controls['crop'].value.length > 0) {
      for (let data of this.ngForm.controls['crop'].value) {
        crop_codeArr.push(data && data.crop_code ? data.crop_code : '')

      }
    }
    const param = {
      search: {
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year'].value,
        crop_tpye: this.ngForm.controls['crop_type'].value,
        pcpd: this.ngForm.controls['bspc'].value,
        crop_code: crop_codeArr && crop_codeArr.length > 0 ? crop_codeArr : '',
      }
    }
    this.productionService.postRequestCreator('getbsp4VarietyNameSecond', param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      console.log(res, 'resss')
      this.varietylist2 = res
      // this.cropnameArr = res
      // this.crop_type=res
      // this.seasonData = res;
      // this.yearOfIndent= res
      // console.log(this.yearOfIndent,'year',res)
    })

  }
  getReportData() {
    if (
      !this.ngForm.controls['year'].value && !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select all  Mandatory Fields.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }
    else if (
      !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select  Season Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }
    else if (

      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Type Field.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
    }
    else {
      const crop_codeArr = [];
      const variety_codeArr = [];
      if (this.ngForm.controls['crop'].value && this.ngForm.controls['crop'].value.length > 0) {
        for (let data of this.ngForm.controls['crop'].value) {
          crop_codeArr.push(data && data.crop_code ? data.crop_code : '')

        }
      }
      if (this.ngForm.controls['variety'].value && this.ngForm.controls['variety'].value.length > 0) {
        for (let data of this.ngForm.controls['variety'].value) {
          variety_codeArr.push(data && data.variety_id ? parseInt(data.variety_id) : '')
        }
      }
      const param = {
        search: {
          season: this.ngForm.controls['season'].value,
          year: this.ngForm.controls['year'].value,
          crop_type: this.ngForm.controls['crop_type'].value,
          variety_id: variety_codeArr,
          crop_code: crop_codeArr && crop_codeArr.length > 0 ? crop_codeArr : '',
          // variety_id:this.ngForm.controls['variety_id'].value
        }
      }
      this.masterService.postRequestCreator('getbsp4reportData', null, param).subscribe(data => {
        let res = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
        let allocationData = res && res[0] && res[0].allocationData ? res[0].allocationData : '';
        let filterData = res && res[0] && res[0].filterData ? res[0].filterData : '';
        let plantData = res && res[0] && res[0].plantData ? res[0].plantData : '';
        let cropPlantDetails = []
        for (let data of plantData) {
          cropPlantDetails.push({
            crop_code: data.bsp4_to_plant.crop_code, variety_id: data.bsp4_to_plant.variety_id,
            plant_name: data.bsp4_to_plant.plant_detail.plant_name,

            User_id: data.bsp4_to_plant.user_id,
            quantity: data.bsp4_to_plant.quantity,
          })
          // console.log(data.bsp4_to_plant.crop_code,'bsp4_to_plantbsp4_to_plant')
        }
        console.log('cropPlantDetails', cropPlantDetails)
        // let allocationDatasecond=[] 
        if (allocationData && allocationData.length > 0) {
          for (let values of allocationData) {
            for (let items of values.bsp1_production_centers) {
              for (let item of filterData) {
                for (let data of item.variety) {
                  for (let val of data.bspc) {
                    if (item.crop_code == values.crop_code && data.variety_id == values.variety_id && val.userIdbspc == items.production_center_id) {                      
                      val.quantitys.push(
                        {
                          quant: items.quantity_of_seed_produced
                        }
                      )
                    }
                  }
                }
              }
            }

          }

          // const mergedArray = allocationData.map(item1 => {
          //   const matchingItem = array2.find(item2 => item2.id === item1.id);
          //   if (matchingItem) {
          //     // Merge the two objects using the spread operator
          //     return { ...item1, ...matchingItem };
          //   } else {
          //     return item1;
          //   }
          // });

        }
        if (cropPlantDetails && cropPlantDetails.length > 0) {

          for (let values of cropPlantDetails) {

            for (let item of filterData) {
              for (let data of item.variety) {

                for (let val of data.bspc) {
                  if (item.crop_code == values.crop_code && data.variety_id == values.variety_id && val.userIdbspc == values.User_id) {
                    //  val.plant=[]
                    val.plant.push(
                      {
                        plantName: values.plant_name,
                        quantity: values.quantity
                      }
                    )
                  }


                }
              }
            }
          }
        }

        for (let item of filterData) {
          for (let data of item.variety) {
            let total_availabilitySum = 0
            for (let val of data.bspc) {
              let sum = 0;
              let avaialableqty = 0;
              total_availabilitySum += val.total_availability
              data.total_available = total_availabilitySum
              for (let items of val.plant) {

                sum += items.quantity;
                val.total_quantity = sum;
                avaialableqty += val.carry_over_seed_amount;
                val.carry_over_seed_amount_total = avaialableqty;

                val.total_availabilty_of_breeder_seed = parseFloat(val.carry_over_seed_amount_total) + parseFloat(val.total_quantity)
              }

            }
          }
        }
        for (let item of filterData) {
          for (let data of item.variety) {
            for (let val of data.bspc) {
              let quant = 0
              let sumOfallocatedQty = 0;
              for (let items of val.quantitys) {
                quant += items.quant;
                val.allocatedquantity = quant;
                sumOfallocatedQty += val.allocatedquantity;
                data.sumOfallocatedQty = sumOfallocatedQty;

              }
            }
          }
        }
        for (let item of filterData) {
          for (let data of item.variety) {
            let sum = 0
            for (let val of data.bspc) {
              sum += val.allocatedquantity
              data.allocatedSum = sum

            }

          }
        }
        console.log('dat',filterData)
        for (let item of filterData) {
          for (let data of item.variety) {
            // data.surplus = data.total_available - data.sumOfallocatedQty

          }
        }
        filterData.forEach(element => {
          let sum = 0;
          element.variety.forEach(item => {
            let arr = []



            item.bspc.forEach(elm => {

              // element.crop_count = element.crops.length + item.varieties.length + elm.bspc.length;
              // sum += element.crop_count;
              // element.crop_counts = sum;
              element.totalLength = item.bspc.length + element.variety.length + elm.plant.length
              sum += element.totalLength
              element.totalLengths = sum
              elm.plantLength = elm.plant.length
              item.bspclength = item.bspc.length
              arr.push(...elm.plant)
              item.ar = arr.flat()

              // sum+=item.totalLength
              item.totallengthofvariety = item.ar.length;
              // item.totallengthofvariety = item.bspc.length + elm.plant.length
              // elm.totalcountofPlant= elm.plant.length
              // item.variety_count = item.varieties.length + elm.bspc.length
              // elm.bspc_count = elm.bspc.length
            })
          })

        })
        filterData.forEach(element => {
          let sum = 0;
          element.variety.forEach(item => {
            sum += item.ar.length;
            element.totalCrop = sum
            // item.bspc.forEach(elm=>{

            // })
          })

        })
        console.log(filterData, 'filterDatafilterData')
        this.dataToDisplay = filterData
      })
    }

  }
  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
  getCropNamefrommlist(crop) {
    let temp;
    temp = this.cropnameArr.filter(item => item.crop_code == crop)

    return temp && temp[0] && temp[0].crop_name ? temp[0].crop_name : ''

  }
  getVarietyNamefrommlist(id) {
    let temp;
    temp = this.varietylist2.filter(item => item['m_crop_variety.id'] == id)

    return temp && temp[0] && temp[0]['m_crop_variety.variety_name'] ? temp[0]['m_crop_variety.variety_name'] : ''

  }
  getCropNameLitstSecond(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.crop_name){
        temp.push(obj.crop_name)
      }
    })

    return temp;
   
  }
  getVarietyListtSecond(crop){
    let temp=[]
    crop.forEach(obj=>{
      if(obj.variety_name){
        temp.push(obj.variety_name)
      }
    })

    return temp;
   
  }
  parseFloat(item){
    return item ? parseFloat(item):0
  }
}
