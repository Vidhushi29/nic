import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import { MasterService } from 'src/app/services/master/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zsrm-req-qs',
  templateUrl: './zsrm-req-qs.component.html',
  styleUrls: ['./zsrm-req-qs.component.css']
})
export class ZsrmReqQsComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
     ngForm!: FormGroup;
     filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
     allData: any = [];
     allDistrictData: any = [];
     is_update: boolean = false;
     dropdownSettings: IDropdownSettings = {};
     varietyList: any[] = [];
     varietyData: any[] = [];
     showOtherInputBox = false;
     inventoryYearData = [
       { year: '2026-27', value: '2026-27' },
       { year: '2025-26', value: '2025-26' },
       { year: '2024-25', value: '2024-25' },
       { year: '2023-24', value: '2023-24' },
       { year: '2022-23', value: '2022-23' },
       { year: '2021-22', value: '2021-22' },
       { year: '2020-21', value: '2020-21' },
       { year: '2019-20', value: '2019-20' },
       { year: '2018-19', value: '2018-19' },
     ];
     inventorySeasonData = ['Kharif', 'Rabi'];
     cropData: any[] = [];
     districtData: { district_name: string; district_code: string }[] = [];
     allDirectIndentsData: any[] = [];
     allSpaData: any[] = [];
     submitted = false;
     dataId: any;
     authUserId: any;
     isVarietySelected = false;
     isEditMode:boolean= false;
     isShowTable = false;
     varietyAndQuantity: any[] = [];
     unit: string = '';
     showQuantity = false;
     croplistSecond: any[];
     selectCrop: any;
     selectVariety: any;
     selectDistrict: any;
     selectVarietyStatus: any;
     varietyListSecond: any[];
     isLimeSection: boolean;
     isAddSelected: boolean = false;
     isNotShowTable: boolean = false;
     isAddFormOpen: boolean = false; 
     isUpdateFormOpen:boolean=false;
     isPatchData: boolean;
     formBuilder: any;
     update_Form: boolean=false;
     isChangeMessage:string;
     isButtonText: string;
     disableUpperSection:boolean;
      displayStyle: any = 'none'
    districtList: any;
  districtListSecond: any;
  authUserAgencyId: any;
  userState: any;
  totalReq: number =0;
  totalAvl: number = 0;
  totalSoS: number = 0;
 
    constructor(
       private fb: FormBuilder,
       private zsrmServiceService: ZsrmServiceService,
       private masterService: MasterService,
       
     ) {
       this.createForm();
     }
 
    ngOnInit(): void {
       this.getCropData();
       this.loadAuthUser();
      // this.getPageData();
     }
     async getDistrictList(newValue: any) {
      const searchFilters = {
        "search": {
          "state_code": newValue
        }
      };
      this.masterService
        .postRequestCreator("get-district-list", null, searchFilters)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            this.districtList = apiResponse.EncryptedResponse.data;
            this.districtListSecond = this.districtList
          }
  
        });
  
    }
   
     deleteDirectIndent(id: number) {
       Swal.fire({
         title: "Are you sure?",
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!"
       }).then((result) => {
         if (result.isConfirmed) {
           const route = `delete-req-qs/${id}`;
           this.zsrmServiceService.deleteRequestCreator(route, null,).subscribe(data => {
             if (data.Response.status_code === 200) {
               Swal.fire({
                 title: "Deleted!",
                 text: "Your data has been deleted.",
                 icon: "success"
               });
               this.filterPaginateSearch.itemList = this.filterPaginateSearch.itemList.filter(item => item.id !== id);
             }
           });
         }
       });
     }
    deleteDistrictData(data) {
      const zsrmreqfs_id = data.zsrmreqfs_id
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const route = `delete-req-qs-dist/${data.id}`;
          this.zsrmServiceService.deleteRequestCreator(route, null,).subscribe(data => {
            if (data.Response.status_code === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your data has been deleted.",
                icon: "success"
              }).then(x => {
                this.getDistrictWiseData(data.Response.data.zsrmreqfs_id);
              });
      
            }
          });
        }
      });
  
    }
     SaveAsData() {
       this.isAddSelected = true;
       this.isChangeMessage="Enter Registered Area and Quantiy Details"
       this.resetCancelation();
       
     }
     
  getDistrictData(id) {
    this.openpopup();
    this.getDistrictWiseData(id)
    // this.getBspcTeamData(null, data);
  }
     openpopup() {
      this.displayStyle = 'block'
    }
    close() {
      this.displayStyle = 'none'
    }
   
     createForm() {
       this.ngForm = this.fb.group({
         year: ['', [Validators.required]],
         season: ['', [Validators.required]],
         crop: ['', [Validators.required]],
         variety: ['', [Validators.required]],
         category: ['', [Validators.required]],
         district:  ['', [Validators.required]],
         ssc: [0, [Validators.required]],
          doa: [0, [Validators.required]],
         nsc: [0, [Validators.required]],
         sau: [0, [Validators.required]],
         seedhubs: [0, [Validators.required]],
        pvt: [0, [Validators.required]],
        others: [0, [Validators.required]],
        district_req: [0, [Validators.required]],
        district_avl: [0, [Validators.required]],  
         crop_text: [''],
         variety_text: [''],
         district_text:[''],
   
       });
             
       this.ngForm.controls['year'].valueChanges.subscribe(() => this.resetSelections());
       this.ngForm.controls['season'].valueChanges.subscribe(() => this.resetSelections());
       this.ngForm.controls['category'].valueChanges.subscribe(() => this.resetSelections());
       this.ngForm.controls['crop_text'].valueChanges.subscribe(item => {
         if (item) {
           this.cropData = this.croplistSecond
           let response = this.cropData.filter(x =>
             x.crop_name.toLowerCase().includes(item.toLowerCase())
           );
           this.cropData = response
         }
         else {
           this.getCropData()
         }
       })
   
       this.ngForm.controls['variety_text'].valueChanges.subscribe(item => {
         if (item) {
           this.varietyData = this.varietyListSecond;
           let response = this.varietyData.filter(x =>
             x.variety_name.toLowerCase().includes(item.toLowerCase()));
           this.varietyData = response
         }
         else {
           this.getVarietyData(this.ngForm.controls['crop'].value);
         }
       })

       this.ngForm.controls['district_text'].valueChanges.subscribe(item => {
        if (item) {
          this.districtData = this.districtListSecond
          let response = this.districtData.filter(x =>
            x.district_name.toLowerCase().includes(item.toLowerCase())
          );
          this.districtData = response
        }
      })

       
 
       this.ngForm.valueChanges.subscribe((formValues) => {
         const { year, season, crop, variety, category} = formValues;
         if (year || season || crop || variety || category) {
           this.getPageData();
           this.isShowTable = true;
       }}) 
       
   
     }
   
     patchDataForUpdate(data: any) {
       this.isAddSelected = true
       this. isChangeMessage="Update:"
       this.isButtonText="Update"
       this.isEditMode=true
       this.is_update = true;
       this.dataId = data.id;
       const cropName = this.cropData.find(crop => crop.crop_code === data.crop_code)?.crop_name;
         if (data) {
         this.selectCrop = cropName;
         this.ngForm.controls['year'].patchValue(data.year);
         this.ngForm.controls['season'].patchValue(data.season);
         this.ngForm.controls['category'].patchValue(data.seed_type);
         this.ngForm.controls['crop'].patchValue(data.crop_code);
         this.getVarietyData(data.variety_code);
         this.ngForm.controls['doa'].patchValue(data.doa);
         this.ngForm.controls['ssc'].patchValue(data.ssc);
         this.ngForm.controls['nsc'].patchValue(data.nsc);
         this.ngForm.controls['sau'].patchValue(data.sau);
         this.ngForm.controls['seedhubs'].patchValue(data.seedhubs);
         this.ngForm.controls['pvt'].patchValue(data.pvt);
         this.ngForm.controls['others'].patchValue(data.others);       
         this.getDistrictList(data.state_id.toString());
         this.getDistrictWiseData(this.dataId);
         this.disableUpperSection=true;
         }
     }
     variety(item: any) {
       const indentQntControl = this.ngForm.get('indent_qnt');
       this.selectVariety = item && item.variety_name ? item.variety_name : '',
         this.selectVarietyStatus = item && item.status ? item.status : '',
         this.ngForm.controls['variety_text'].setValue('', { emitEvent: false })
       this.varietyData = this.varietyListSecond;
       this.ngForm.controls['variety'].setValue(item && item.variety_code ? item.variety_code : '')
     }
   
     resetSelections() {
       this.isShowTable = false;
       // this.isAddSelected = false;
       this.isVarietySelected = false;
     }
   
     loadAuthUser() {
       const BHTCurrentUser = localStorage.getItem('BHTCurrentUser');
       if (BHTCurrentUser) {
         const data = JSON.parse(BHTCurrentUser);
         console.log(data);
         this.authUserId = data.id || null;
         this.authUserAgencyId = data.agency_id || null;

       }
     }
   
     searchData() {
       this.isShowTable = true;
       this.isAddSelected=false;
       this.getPageData();
     }
     cClick() {
       document.getElementById('crop').click();
     }

     dClick() {
      document.getElementById('district').click();
    }
     vClick() {
       document.getElementById('variety').click();
     }
   
     crop(item: any) {
       this.selectCrop = item && item.crop_name ? item.crop_name : ''
       this.ngForm.controls['crop_text'].setValue('', { emitEvent: false })
       this.cropData = this.croplistSecond;
       this.ngForm.controls['crop'].setValue(item && item.crop_code ? item.crop_code : '')
       this.getVarietyData(item.crop_code);
       this.selectVariety=''
     }
   
     getCropData() {
       const route = "get-all-crops";
       this.zsrmServiceService.getRequestCreator(route, null, null).subscribe(data => {
         if (data.Response.status_code === 200) {
           this.cropData = data && data.Response && data.Response.data ? data.Response.data : '';
           this.croplistSecond = this.cropData;
         }
       })
     }
     revertDataCancelation() {
      if(this.is_update) {

        const total = this.ngForm.controls['doa'].value + this.ngForm.controls['ssc'].value + this.ngForm.controls['nsc'].value
        + this.ngForm.controls['sau'].value + this.ngForm.controls['seedhubs'].value + this.ngForm.controls['pvt'].value + 
        this.ngForm.controls['others'].value ;
        
        if(total != this.totalAvl)
        {
          Swal.fire({
            title: '<p style="font-size:25px;">Total District Requirement should not exceed Total Available.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
          return
        }

      }
       this.isAddSelected=false;
       this.ngForm.controls['doa'].reset('');
       this.ngForm.controls['ssc'].reset('');
       this.ngForm.controls['nsc'].reset('');
       this.ngForm.controls['sau'].reset('');
       this.ngForm.controls['sau'].reset('');
       this.ngForm.controls['sau'].reset('');
       this.ngForm.controls['sau'].reset('');
       this.ngForm.controls['pvt'].reset('');
       this.ngForm.controls['others'].reset('');
       this.ngForm.controls['district_req'].reset('');
       this.ngForm.controls['district_avl'].reset('');
       this.ngForm.controls['district_avl'].reset('');
       this.is_update = false;
       this.showOtherInputBox = false;
       this.disableUpperSection = false;
       this.totalAvl = 0;
       this.totalSoS = 0;
       this.totalReq = 0;
       this.allDistrictData  = []
     }
     resetCancelation() {
       this.ngForm.controls['district_req'].reset('');
       this.ngForm.controls['district_avl'].reset('');
       this.ngForm.controls['doa'].reset('');
       this.ngForm.controls['ssc'].reset('');
       this.ngForm.controls['nsc'].reset('');
       this.ngForm.controls['sau'].reset('');
       this.ngForm.controls['seedhubs'].reset('');
       this.ngForm.controls['pvt'].reset('');
       this.ngForm.controls['others'].reset('')
       this.ngForm.controls['nsc'].reset('');
       this.totalAvl = 0;
       this.totalSoS = 0;
       this.totalReq = 0;
       this.allDistrictData  = []
       this.is_update = false;
       this.showOtherInputBox = false;   
       const route = `get-user-state-code`;
       this.zsrmServiceService.getRequestCreator(route, null,).subscribe(data => {
         if (data.Response.status_code === 200) {
          this.getDistrictList(data.Response.data.state_code);    
         }
       })
    
      
      //  this.getDistrictWiseData(user);
     }
     
     saveForm() {
       this.submitted = true;
       this.isShowTable = true;
       const route = "add-req-qs";
       const req = this.totalReq;
      const total = this.totalAvl;
      const shtorsur = this.totalSoS;
      const doa = Number(this.ngForm.controls['doa'].value) || 0;
      const ssc = Number(this.ngForm.controls['ssc'].value) || 0;
      const seedhubs = Number(this.ngForm.controls['seedhubs'].value) || 0;
      const nsc = Number(this.ngForm.controls['nsc'].value) || 0;
      const sau = Number(this.ngForm.controls['sau'].value) || 0;
      const pvt = Number(this.ngForm.controls['pvt'].value) || 0;
      const others = Number(this.ngForm.controls['others'].value) || 0;
      const baseParam = {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "seed_type": this.ngForm.controls['category'].value,
        "req":req,
        "shtorsur": shtorsur,
        "doa": doa,
        "ssc": ssc,
        "others": others,
        "nsc": nsc,
        "sau": sau,
        "pvt": pvt,
        "total": total,
        "seedhubs":seedhubs
      };
   
       this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
         if (data.Response.status_code === 200) {
           console.log()
           Swal.fire({
             title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
             icon: 'success',
             confirmButtonText:
               'OK',
             confirmButtonColor: '#E97E15'
           }).then(x => {
             this.getPageData();
             this.ngForm.controls['doa'].reset(0);
             this.ngForm.controls['ssc'].reset(0);
             this.ngForm.controls['others'].reset(0);
             this.ngForm.controls['nsc'].reset(0);
             this.ngForm.controls['sau'].reset(0);
             this.ngForm.controls['pvt'].reset(0);
             this.ngForm.controls['seedhubs'].reset(0);
             this.submitted = false;
             this.isAddSelected=false;
             this.totalAvl=0;
             this.totalReq=0;
             this.totalSoS=0;
             this.allDistrictData= []
           })
         } else {
           Swal.fire({
             title: '<p style="font-size:25px;">An Error Occured.</p>',
             icon: 'error',
             confirmButtonText: 'OK',
             confirmButtonColor: '#E97E15'
           })
         }
       })
     }

     saveDistData() {
      if(!this.ngForm.controls['district'].valid) {
        Swal.fire({
          title: '<p style="font-size:25px;">Please select district</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
        return
      }
      if(!this.ngForm.controls['district_req'].value) {
        Swal.fire({
          title: '<p style="font-size:25px;">District Req cannot be empty</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
        return
      } 
      if(!this.ngForm.controls['district_avl'].value) {
        Swal.fire({
          title: '<p style="font-size:25px;">District Avl cannot be empty</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
        return
      } 
      const route = "add-req-qs-dist";
      const req = this.totalReq;
      const total = this.totalAvl;
      const shtorsur = this.totalSoS;
      const doa = Number(this.ngForm.controls['doa'].value) || 0;
      const ssc = Number(this.ngForm.controls['ssc'].value) || 0;
      const seedhubs = Number(this.ngForm.controls['seedhubs'].value) || 0;
      const nsc = Number(this.ngForm.controls['nsc'].value) || 0;
      const sau = Number(this.ngForm.controls['sau'].value) || 0;
      const pvt = Number(this.ngForm.controls['pvt'].value) || 0;
      const others = Number(this.ngForm.controls['others'].value) || 0;
      const district_req= Number(this.ngForm.controls['district_req'].value) || 0;
      const district_avl= Number(this.ngForm.controls['district_avl'].value) || 0;
      const district_shtorsur = Number(district_avl - district_req);
      const baseParam = {
        "user_id": this.authUserId,
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "seed_type": this.ngForm.controls['category'].value,
        "district_id": this.ngForm.controls['district'].value,
        "req":req,
        "shtorsur": shtorsur,
        "doa": doa,
        "ssc": ssc,
        "others": others,
        "nsc": nsc,
        "sau": sau,
        "pvt": pvt,
        "total": total,
        "seedhubs":seedhubs,
        "district_req": district_req,
       "district_shtorsur": district_shtorsur,
        "district_avl": district_avl,
      };
  
      this.zsrmServiceService.postRequestCreator(route, null, baseParam).subscribe(data => {
        if (data.Response.status_code === 200) {
          console.log("Data saved successfully!");
          Swal.fire({
            title: '<p style="font-size:25px;">Data Has Been Successfully Saved.</p>',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          }).then(x => {
            this.getDistrictWiseData(data.Response.data.id);
            this.ngForm.controls['district_req'].reset(0);
            this.ngForm.controls['district_avl'].reset(0);
            this.selectDistrict = '';
            this.ngForm.controls['district'].setValue('');
          });
        } else if (data.Response.status_code === 409) {
          console.log("Record Already Exists - 409 error triggered.");
          Swal.fire({
            title: '<p style="font-size:25px;">Record Already Exists.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          }).then(() => {
            console.log("Swal.fire for 409 executed.");
            // You can add more actions if needed for the 409 error (e.g., reset fields, log details, etc.)
          });
        } else {
          console.log("Error occurred, status code: ", data.Response.status_code);
          Swal.fire({
            title: '<p style="font-size:25px;">An Error Occurred.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
        }
      }, error => {
        // Catch any HTTP or network error
        console.error("Request failed with error:", error);
        Swal.fire({
          title: '<p style="font-size:25px;">Request Failed.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      });
    }
   
     createAndSave() {
      if(!this.totalAvl || !this.totalReq) {

        Swal.fire({
          title: '<p style="font-size:25px;">Total Req and Total Avl cannot be zero</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
        return
      }

      const total = this.ngForm.controls['doa'].value + this.ngForm.controls['ssc'].value + this.ngForm.controls['nsc'].value
      + this.ngForm.controls['sau'].value + this.ngForm.controls['seedhubs'].value + this.ngForm.controls['pvt'].value + 
      this.ngForm.controls['others'].value ;
      
      if(total != this.totalAvl)
      {
        Swal.fire({
          title: '<p style="font-size:25px;">Total District Avl should be equal to Total Available.</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
        return
      }
       this.submitted = true;
       this.isAddFormOpen = true;
       this.saveForm();
     }
     getVarietyData(varietyCode: any) {
      
      
        const crop_code = this.ngForm.controls['crop'].value;
        this.ngForm.controls['variety'].patchValue('');
       const route = `get-all-varieties?crop_code=${crop_code}`;
       this.zsrmServiceService.getRequestCreator(route, null,).subscribe(data => {
         if (data.Response.status_code === 200) {
           this.varietyData = data && data.Response && data.Response.data ? data.Response.data : '';
           this.varietyListSecond = this.varietyData;
           console.log(this.isEditMode,"...................")
           if (this.isEditMode) {
             
             const varietyName = this.varietyData.filter(variety => variety.variety_code === varietyCode);
             console.log(varietyName)
             this.selectVariety = varietyName; 
             this.selectVariety = varietyName[0].variety_name;
             this.ngForm.controls['variety'].patchValue(varietyName[0].variety_code);
           }
         }
       })
     }
   
     getPageData(loadPageNumberData: number = 1) {
       this.filterPaginateSearch.itemList = [];
       const year = this.ngForm.controls['year'].value;
       const season = this.ngForm.controls['season'].value;
       const crop = this.ngForm.controls['crop'].value;
       const variety = this.ngForm.controls['variety'].value;
       const category = this.ngForm.controls['category'].value;
       const page= loadPageNumberData;
       const pageSize= this.filterPaginateSearch.itemListPageSize = 10;
      
       const queryParams = [];
       if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
       if (season) queryParams.push(`season=${encodeURIComponent(season)}`);
       if (crop) queryParams.push(`crop_code=${encodeURIComponent(crop)}`);
       if (variety) queryParams.push(`variety_code=${encodeURIComponent(variety)}`);
       if (category) queryParams.push(`seed_type=${encodeURIComponent(category)}`);
       queryParams.push(`page=${encodeURIComponent(page)}`); // Add page to query params
       queryParams.push(`limit=${encodeURIComponent(pageSize)}`); // Add pageSize (limit) to query params
     
       const apiUrl = `view-req-qs?${queryParams.join('&')}`;
       this.zsrmServiceService
         .getRequestCreator(apiUrl)
         .subscribe(
           (apiResponse: any) => {
             if (apiResponse?.Response.status_code === 200) {
               console.log(apiResponse.Response.data.pagination)
               this.allData = apiResponse.Response.data || [];
               this.filterPaginateSearch.Init(
                 this.allData.data,
                 this,
                 'getPageData',
                 undefined,
                 apiResponse.Response.data.pagination.totalRecords,
                 true
               );
               this.initSearchAndPagination();
             } else {
               console.warn('API returned an unexpected status:', apiResponse?.Response.status_code);
             }
           },
           (error) => {
             console.error('Error fetching data:', error);
           }
         );
     }
     
  district_select(data) {


    this.selectDistrict = data.district_name|| '';
    this.ngForm.controls['district_text'].setValue('',{emitEvent:false})
    this.districtList = this.districtListSecond   
    this.ngForm.controls['district'].setValue(data.district_code)
   
  }
   
     getDistrictWiseData(id) {
      const queryParams = [];
      queryParams.push(`zsrmreqfs_id=${encodeURIComponent(id)}`);
      const apiUrl = `view-req-qs-dist?${queryParams.join('&')}`;
      this.zsrmServiceService
      .getRequestCreator(apiUrl)
      .subscribe(
        (apiResponse: any) => {
          if (apiResponse?.Response.status_code === 200) {
            this.allDistrictData = apiResponse.Response.data.result || [];
            console.log(this.allDistrictData);
            this.totalReq = Number(apiResponse.Response.data.total_req) || 0.0;
            this.totalAvl = Number(apiResponse.Response.data.total_avl) || 0.0;
            this.totalSoS = Number(apiResponse.Response.data.total_shtorsur) || 0.0;
            
          }
          else {
            console.warn('API returned an unexpected status:', apiResponse?.Response.status_code);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }
   
     initSearchAndPagination() {
       if (!this.paginationUiComponent) {
         setTimeout(() => this.initSearchAndPagination(), 300);
         return;
       }
       this.paginationUiComponent.Init(this.filterPaginateSearch);
     }
     updateForm() {

      if(!this.totalAvl || !this.totalReq) {

        Swal.fire({
          title: '<p style="font-size:25px;">Total Req and Total Avl cannot be zero</p>',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
        return
      }

      const total1 = this.ngForm.controls['doa'].value + this.ngForm.controls['ssc'].value + this.ngForm.controls['nsc'].value
      + this.ngForm.controls['sau'].value + this.ngForm.controls['seedhubs'].value + this.ngForm.controls['pvt'].value + 
      this.ngForm.controls['others'].value ;
      
      if(total1 != this.totalAvl)
        {
          Swal.fire({
            title: '<p style="font-size:25px;">Total District Avl should be equal to Total Available.</p>',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15'
          });
          return
        }
       this.submitted = true;
       this.isShowTable = true;
       const route = `update-req-qs/${this.dataId}`;
      
      const req = this.totalReq;
      const total = this.totalAvl;
      const shtorsur = this.totalSoS;
      const doa = Number(this.ngForm.controls['doa'].value) || 0;
      const ssc = Number(this.ngForm.controls['ssc'].value) || 0;
      const seedhubs = Number(this.ngForm.controls['seedhubs'].value) || 0;
      const nsc = Number(this.ngForm.controls['nsc'].value) || 0;
      const sau = Number(this.ngForm.controls['sau'].value) || 0;
      const pvt = Number(this.ngForm.controls['pvt'].value) || 0;
      const others = Number(this.ngForm.controls['others'].value) || 0;
      const baseParam = {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
        "crop_code": this.ngForm.controls['crop'].value,
        "variety_code": this.ngForm.controls['variety'].value,
        "seed_type": this.ngForm.controls['category'].value,
        "req":req,
        "shtorsur": shtorsur,
        "doa": doa,
        "ssc": ssc,
        "others": others,
        "nsc": nsc,
        "sau": sau,
        "pvt": pvt,
        "total": total,
        "seedhubs":seedhubs
      };
     
       this.zsrmServiceService.putRequestCreator(route,null,baseParam).subscribe(data => {
         if (data.Response.status_code === 200) {
           this.is_update = false;
           Swal.fire({
             title: '<p style="font-size:25px;">Data Has Been Successfully Updated.</p>',
             icon: 'success',
             confirmButtonText: 'OK',
             confirmButtonColor: '#E97E15'
           }).then(() => {
             this.getPageData();
             this.ngForm.controls['doa'].reset(0);
             this.ngForm.controls['ssc'].reset(0);
             this.ngForm.controls['others'].reset(0);
             this.ngForm.controls['nsc'].reset(0);
             this.ngForm.controls['sau'].reset(0);
             this.ngForm.controls['pvt'].reset(0);
             this.ngForm.controls['seedhubs'].reset(0);
             this.submitted = false;
             this.isAddSelected=false;
             this.totalAvl=0;
             this.totalReq=0;
             this.totalSoS=0;
             this.allDistrictData= []
             this.disableUpperSection= false;
           });
         } else {
           Swal.fire({
             title: '<p style="font-size:25px;">An Error Occurred.</p>',
             icon: 'error',
             confirmButtonText: 'OK',
             confirmButtonColor: '#E97E15'
           });
         }
       });
     }
 
     validateDecimal(event: any): void {
       const input = event.target as HTMLInputElement;
       const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
     
       const newValue = input.value + event.key;
       if (!regex.test(newValue) || (event.key === '.' && input.value.includes('.'))) {
         event.preventDefault();
       }
     }
 
   formatNumber(value: number) {
     return value ? value.toFixed(2) : '';
   }

   
     
     resetForm() {
       this.ngForm.controls['year'].reset('');
       this.ngForm.controls['season'].reset('');
       this.ngForm.controls['category'].reset('');
       this.selectCrop = '';
       this.selectVariety = '';     
       this.ngForm.controls['crop'].reset('');
       this.ngForm.controls['variety'].reset('');
       this.isShowTable = false; this.isAddSelected = false;
     }

}
