import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import {UnfreezeIndentService} from 'src/app/unfreeze-indent.service'
import { MasterService } from '../services/master/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unfreeze-indent',
  templateUrl: './unfreeze-indent.component.html',
  styleUrls: ['./unfreeze-indent.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UnfreezeIndentComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  dummyData=[]

  ngForm!: FormGroup
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData=[]
  allData: any;
  dropdownSettings: IDropdownSettings = {};
  
  yearOfIndent;

  seasonlist;

  cropName=[];
  // cropName=[
  //   {
  //     crop_name:'Wheat',
  //     crop_code:'A01012'
  //   },
  //   {
  //     crop_name:'PADDY (Dhan)',
  //     crop_code:'E1234'
  //   },
  //   {
  //     crop_name:'PADDY (Dhan)',
  //     crop_code:'E1236'
  //   },
  //   {
  //     crop_name:'PADDY (Dhan)',
  //     crop_code:'E1237'
  //   }

  // ]
  // BSPC=[
  //   {
  //     BSPC:'AAU ARS ANAND',
  //     id:'1234'
  //   },
  //   {
  //     BSPC:'Test BSPC',
  //     id:'3442'
  //   },
  // ]

  stateList;
// stateList=[
//   {
//     state:'Punjab',
//     state_code: 'E1234'
//   },
//   {
//     state:'Bihar',
//     state_code: 'S1235'

//   },
//   {
//     state:'Asam',
//     state_code: 'D1236'

//   },
//   {
//     state:'Pune',
//     state_code: 'C1237'

//   },
//   {
//     state:'Uttar Pradesh',
//     state_code: 'B1238'

//   },
//   {
//     state:'Bihar',
//     state_code: 'S1235'

//   },
//   {
//     state:'Asam',
//     state_code: 'D1236'

//   },
//   {
//     state:'Pune',
//     state_code: 'C1237'

//   },
//   {
//     state:'Uttar Pradesh',
//     state_code: 'B1238'

//   },
// ]


//   tableData: any = [
//     {
//         crop: 'Wheat',
//         Variety: 'DW-190',
//         plot_code: 'p-01',
//         lotNo: 'Li(i)',
//         lotQuantity: '200',
//         processedQuantity: '180',
//         sampleNo: '1234',
//         uniqueCode: 'Sqyu567'
//     },
//     {
//       crop: 'Wheat',
//       Variety: 'DW-190',
//       plot_code: 'p-01',
//       lotNo: 'Li(i)',
//       lotQuantity: '200',
//       processedQuantity: '180',
//       sampleNo: null,
//       uniqueCode: null
//   },
//   //   {
//   //     crop: 'Wheat',
//   //     Variety: 'DW-190',
//   //     plot_code: 'p-02',
//   //     lotNo: 'Li(ii)',
//   //     lotQuantity: '100',
//   //     processedQuantity: '90',
//   //     sampleNo: 'NA',
//   //     uniqueCode: 'NA'
//   // },
// //   {
// //     crop: 'Rice',
// //     Variety: 'Test Variety',
// //     plot_code: 'A2300B',
// //     harvest_date: '2/6/2023',
// //     raw_final_quantity: 'Test',
// //     spp_name: 'NA'
// // },
// // {
// //   crop: 'Dhan',
// //   Variety: 'Test Variety',
// //   plot_code: 'A2300B',
// //   harvest_date: '2/6/2023',
// //   raw_final_quantity: 'Test',
// //   spp_name: 'NA'
// // },
//   ]


  constructor(private service: SeedServiceService, private fb: FormBuilder, private apiService: UnfreezeIndentService, private master: MasterService) {
    this.createForm();

  }
  
  createForm() {
    this.ngForm = this.fb.group({
      year:new FormControl('',),
      season:new FormControl(''),
      crop_name:new FormControl(''),
      state: new FormControl(''),
      bsp2Arr: this.fb.array([
        this.bsp2arr(),
      ]),


    })
    this.ngForm.controls["year"].valueChanges.subscribe(res=> {
      this.loadSeason();
      this.ngForm.controls["crop_name"].setValue(''),
      this.ngForm.controls["state"].setValue('')
    })
    this.ngForm.controls["season"].valueChanges.subscribe(res=> {
      this.loadCrop();
      // this.ngForm.controls["season"].setValue(''),
      this.ngForm.controls["crop_name"].setValue(''),
      this.ngForm.controls["state"].setValue('')
    })
    // this.ngForm.controls["crop_name"].valueChanges.subscribe(res=> {
    //   this.loadState();
    //  alert("hi");
    // })

    this.ngForm.controls["crop_name"].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        // this.ngForm.controls['crop'].enable();
        this.loadState();
        this.ngForm.controls["state"].setValue('')
      }
    });
  }
  // readonly dataOfUnfreeze = this.apiService.getYearOfIndent(this.yearOfIndent);
  



  
  // ngOnInit(): void {
  //   this.fetchData();

  //   this.dropdownSettings = {
  //     idField: 'crop_code',
  //     textField: 'crop_name',
  //     // enableCheckAll: false,
  //     allowSearchFilter: true,
  //     selectAllText: 'Select All',
  //     unSelectAllText: 'Unselect All',
  //     enableCheckAll: true,
  //   };

  //   this.dropdownSettings = {
  //     idField: 'state_code',
  //     textField: 'state',
  //     // enableCheckAll: false,
  //     allowSearchFilter: true,
  //     selectAllText: 'Select All',
  //     unSelectAllText: 'Unselect All',
  //     enableCheckAll: true,
  //   };
  // }

  ngOnInit(): void {
    this.fetchData();
    // this.cropName = this.loadCrop();

      this.dropdownSettings = {
        idField: 'value',
        textField: 'display_text',
        // enableCheckAll: false,
        allowSearchFilter: true,
        selectAllText: 'Select All',
        unSelectAllText: 'Unselect All',
        enableCheckAll: true,
        itemsShowLimit:1
      };
  
      // this.dropdownSettings = {
      //   idField: 'state_code',
      //   textField: 'state',
      //   // enableCheckAll: false,
      //   allowSearchFilter: true,
      //   selectAllText: 'Select All',
      //   unSelectAllText: 'Unselect All',
      //   enableCheckAll: true,
      // };
    // this.ngForm = this.fb.group({
    //   year: '',
    //   season: '',
    //   crop_code: '',
    //   state_code: '',
    // });

    // this.cropName=[
    //   {
    //     crop_name:'Wheat',
    //     crop_code:'A01012'
    //   },
    //   {
    //     crop_name:'PADDY (Dhan)',
    //     crop_code:'E1234'
    //   },
    //   {
    //     crop_name:'PADDY (Dhan)',
    //     crop_code:'E1236'
    //   },
    //   {
    //     crop_name:'PADDY (Dhan)',
    //     crop_code:'E1237'
    //   }
  
    // ]
// this.loadState();
    this.loadYearOfIndent();
    // console.log(this.dataOfUnfreeze);
  }
  

  loadYearOfIndent() {
    this.master.postRequestCreator('get-year-of-indent-spa-second', null).subscribe((response)=> {
      this.yearOfIndent = response.EncryptedResponse.data;
      if( this.yearOfIndent  &&  this.yearOfIndent.length>0){
        this.yearOfIndent.sort(function(a, b) {
          return b.year - a.year;
      });
      this.yearOfIndent= this.yearOfIndent.filter((arr, index, self) =>
    index === self.findIndex((t) => (t.year === arr.year )))

      }

    
    })
  }

  loadSeason() {
    const param = {
      search:{year:this.ngForm.controls["year"].value}
    }
    this.master.postRequestCreator('get-season-of-indent-spa-second', null,param).subscribe((response)=> {
      this.seasonlist = response.EncryptedResponse.data;
      if( this.seasonlist  &&  this.seasonlist.length>0){
        this.seasonlist.sort(function(a, b) {
          return a.season.localeCompare(b.season);
      });
      }
    })
  }

  loadCrop() {
    console.log("kdjfkdjkf",this.ngForm.controls["season"].value)
    const param = {
      search:{
        year:this.ngForm.controls["year"].value,
        season:this.ngForm.controls["season"].value
      }
    }
    this.master.postRequestCreator('get-crop-of-indent-spa-second', null,param).subscribe((response)=> {
      console.log("cropdata response")
      console.log(response)
      this.cropName = response.EncryptedResponse.data;
      if( this.cropName  &&  this.cropName.length>0){
        this.cropName.sort(function(a, b) {
          return a.display_text.localeCompare(b.display_text);
      });
      }
      return response.EncryptedResponse.data;
    })
    
  }

  loadState() {
    let loadState = [];
    console.log("Jfdjfk", this.ngForm.controls["crop_name"].value)
    this.ngForm.controls["crop_name"].value.forEach((el)=>{
      loadState.push(el.value);

    })
    const param = {
      search:{
        year:this.ngForm.controls["year"].value,
        season:this.ngForm.controls["season"].value,
        crop_code:loadState.toString()}
    }
    this.master.postRequestCreator('get-state-of-indent-spa-second', null,param).subscribe((response)=> {
      this.stateList = response.EncryptedResponse.data;
      if( this.stateList  &&  this.stateList.length>0){
        this.stateList.sort(function(a, b) {
          return a.display_text.localeCompare(b.display_text);
      });
      }
    })
  }

  unfreeze() {  
    if ((!this.ngForm.controls["year"].value && !this.ngForm.controls["season"].value && !this.ngForm.controls["crop_name"].value && !this.ngForm.controls["state"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
   else if ((!this.ngForm.controls["year"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Year.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else if ((!this.ngForm.controls["season"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else if ((!this.ngForm.controls["crop_name"].value && this.ngForm.controls["crop_name"].value.length<1 )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Name.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else if ((!this.ngForm.controls["state"].value && this.ngForm.controls["state"].value.length<1 )) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select State.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else{
      let cropCodeArr = [];
      let cropCodeArrName=[];
      if (this.ngForm.controls["crop_name"].value && this.ngForm.controls["crop_name"].value !== undefined && this.ngForm.controls["crop_name"].value.length > 0) {
        this.ngForm.controls["crop_name"].value.forEach(ele => {
          cropCodeArr.push(ele.value);
          cropCodeArrName.push(ele && ele.display_text ? ele.display_text :'');
        })
      }
      let stateCodeArr = [];
      let stateCodeNameArr=[];
      if (this.ngForm.controls["state"].value && this.ngForm.controls["state"].value !== undefined && this.ngForm.controls["state"].value.length > 0) {
        this.ngForm.controls["state"].value.forEach(ele => {
          stateCodeArr.push(ele.value);
          stateCodeNameArr.push(ele && ele.display_text ? ele.display_text :'');
        })
      }
      Swal.fire({
        toast: false,
        icon: "warning",
        title: "Are you sure you want to unfreeze these indents?", 
        position: "center",
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonColor: "#DD6B55",
        confirmButtonText: "Ok!",
        cancelButtonText: "Cancel",
        allowOutsideClick: false
  
      }).then(x=>{
         if(x.isConfirmed){
           this.master.postRequestCreator('un-freeze-data-data', null,{
             "search": {
               "year": this.ngForm.controls["year"].value,
               "season": this.ngForm.controls["season"].value,
               "crop_code": cropCodeArr && cropCodeArr.length>0 ? cropCodeArr.toString():'',
               "state_code": stateCodeArr && stateCodeArr.length>0 ? stateCodeArr.toString():''
           }
        
           }).subscribe((response)=> {
             // this.stateList = response.EncryptedResponse.data;
             if(response.EncryptedResponse.status_code== 200){
              let cropCodeArrs= cropCodeArr ? cropCodeArr.toString() :'';
              console.log(stateCodeNameArr,'cropCodeArrs')
             // alert("Hi");
             Swal.fire({
               title: `<p style="font-size:25px; text-align: center !important;
               vertical-align: top !important;
               white-space: pre-wrap;
               overflow-wrap: break-word !important;
               word-wrap: break-word !important;
               word-break: break-word !important;
               padding-top: 0;">You have successfully unfreezed the indents of  <span > ${cropCodeArrName && cropCodeArrName.length>1 ? cropCodeArrName.join(', ').replace(/,([^,]*)$/, ' and$1'):cropCodeArrName && cropCodeArrName.length>0 ?cropCodeArrName.toString() :'NA' } </span> for <span > ${stateCodeNameArr && stateCodeNameArr.length>1 ? stateCodeNameArr.join(', ').replace(/,([^,]*)$/, ' and$1'):stateCodeNameArr && stateCodeNameArr.length>0 ? stateCodeNameArr.toString():'NA'}</span>.</p>`,
               icon: 'success',
               confirmButtonText:
                 'OK',
               confirmButtonColor: '#B64B1D'
             }).then(x=>{
              this.ngForm.controls["year"].setValue('');
               this.ngForm.controls["season"].setValue('');
               this.ngForm.controls["crop_name"].setValue('');
               this.ngForm.controls["state"].setValue('');
               this.loadYearOfIndent();
             })
             }
             else{
               Swal.fire({
                 title: `<p style="font-size:25px;">Something Went Wrong.</p>`,
                 icon: 'error',
                 confirmButtonText:
                   'OK',
                 confirmButtonColor: '#B64B1D'
               })
             }
           })
         }else{

         }
      })
    }
  }

  fetchData() {
    this.dummyData=[
      {
        'variety_id':'23112',
        'variety_name':'PBW-154',
        'indent_quantity':150,
        bsp2Arr:[]
      },
      {
        'variety_id':'23114',
        'variety_name':'HD-1925 (SHERA)',
        'indent_quantity':150,
        bsp2Arr:[]
      }

    ]
    for(let data of this.dummyData){
      let bsplength = data.bsp2Arr.length;
      data.bsplength=bsplength
    }
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
  bsp2arr() {
    let temp = this.fb.group({
      filed_loc: ['', Validators.required],
      area_sown: ['', Validators.required],
      date_of_sowing: ['', Validators.required],
      quantity_of_sowning: [''],
      quantity_of_breedersown: [''],
      expected_date_inspection: [''],
      expected_date_harvest: [''],
      expected_producton: [''],
      inspected_area: [''],
      est_production: [''],
      harvest_date: [''],
      raw_seed_produced: [''],
      spp_name: [''],



    });      
    return temp;      
  }

  getItems(form) {
    return form.controls.bsp2Arr.controls;
  }

  addMore(i) {       
    this.itemsArray.push(this.bsp2arr());        
  }

  remove(rowIndex: number) {          
      this.itemsArray.removeAt(rowIndex);      
  }

  get itemsArray() {
    return <FormArray>this.ngForm.get('bsp2Arr');
  }

  save(data){
    console.log(data)

  }
  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }

  getFinancialYear(year) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }
}
