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
import { MasterService } from 'src/app/services/master/master.service';
// import { I } from 'node_mod/@angular/cdk/keycodes';

@Component({
  selector: 'app-list-of-indent-report',
  templateUrl: './list-of-indent-report.component.html',
  styleUrls: ['./list-of-indent-report.component.css']
})
export class ListOfIndentReportComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  currentUser: any;
  spaData: any;
  agencyData: any;
  fileName= "selection-of-spa-for-submission-indent.xlsx";
  distData: any[];
  selectspaData: any;
  selected_state;
  stateList: any;
  stateListSecond: any;
  selected_district: any;
  selected_name_of_spa
  type: any;
  distDataSecond: any[];
  selectspaDatasecond: void;
  submitted = false;
  enableDistrict = false;
  enableSpaname = false;
  completeData = [];
  selectStatusData: any[];
  selectStatusDatasecond: any[];
  sectorData: any = [
    { 'name': 'NSC', 'state_code': 201 },
    { 'name': 'DADF', 'state_code': 202 },
    { 'name': 'HIL', 'state_code': 203 },
    { 'name': 'IFFDC', 'state_code': 204 },
    { 'name': 'IFFCO', 'state_code': 205 },
    { 'name': 'KRIBHCO', 'state_code': 206 },
    { 'name': 'KVSSL', 'state_code': 207 },
    { 'name': 'NAFED', 'state_code': 208 },
    { 'name': 'NDDB', 'state_code': 209 },
    { 'name': 'NFL', 'state_code': 210 },
    { 'name': 'NHRDF', 'state_code': 211 },
    { 'name': 'SOPA', 'state_code': 212 },
    { 'name': 'NSAI', 'state_code': 213 },
    { 'name': 'PRIVATE', 'state_code': 213 },
    { 'name': 'Private Company', 'state_code': 213 },
    { 'name': 'BBSSL', 'state_code': 214 }
  ];
  sectorName: any;
  spaDistrictData: any;

  constructor(private masterService: MasterService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private breederService: BreederService,
    private router: Router) {

    this.ngForm = this.fb.group({
      district: [''],
      spa: [''],
      status: [''],
      state_text: [''],
      district_text: [''],
      spa_name_text: [''],
      state_id: [''],

    });



    this.ngForm.controls["state_id"].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(this.type, 'type')
        if (this.type && this.type != 'state') {

          this.ngForm.controls["status"].setValue('')
          this.ngForm.controls["district"].setValue('')
          this.selected_district = ''
          this.selected_name_of_spa = '';
          this.ngForm.controls["spa"].setValue('')
          
          this.statusList();
        }
        this.ngForm.controls['district_text'].enable();
        this.enableDistrict = true
        this.ngForm.controls["district"].setValue('')
        this.selected_district = ''
        this.districtData();
      }
    })
    this.ngForm.controls["status"].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.enableDistrict = true
        this.ngForm.controls["district"].setValue('')
        this.selected_district = ''
        this.districtData()

      }
    })

    this.ngForm.controls["district"].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.selspaData();
        this.ngForm.controls['spa'].enable();
        this.enableSpaname = true

      }
    })

    this.ngForm.controls['state_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.stateList = this.stateListSecond
        let response = this.stateList.filter(x => x.state_name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.stateList = response
        this.enableDistrict = true
        this.ngForm.controls["district"].setValue('')
        this.selected_district = ''
        this.districtData();
      }
      else {
        this.getStateList()


      }
    });
    this.ngForm.controls['district_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.distData = this.distDataSecond
        let response = this.distData.filter(x => x.districtName.toLowerCase().startsWith(newValue.toLowerCase()))

        this.distData = response
        // console.log('this.cropNameDataSecond',this.category_agency_data,this.cropNameData)

      }
      else {
        console.log(this.type, 'this.sss')
        // if(this.type && this.type!='state'){

        this.districtData()
        // }

      }
    });
    this.ngForm.controls['spa_name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.selectspaData = this.selectspaDatasecond
        let response = this.selectspaData.filter(x => x.spaName.toLowerCase().startsWith(newValue.toLowerCase()))
        this.selectspaData = response
      }
      else {
        this.selspaData()
      }
    });


    // this.ngForm = this.fb.group({
    //   state: ['',],
    // });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    this.ngForm.controls['spa'].disable();
    this.getStateList()
    this.getUserAgencyData();
    // if (this.type && this.type == 'state') {
    this.statusList()
    // }
    // this.districtData();
  }

  districtData() {
    this.breederService.postRequestCreator("spaToIndentor/getAgencyData?id=" + this.currentUser.agency_id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.agencyData = data.EncryptedResponse.data;
        console.log(this.agencyData)
        let object = {}
        if (this.type == 'state') {

          object = {
            stateCode: data.EncryptedResponse.data['state_id']
            // stateCode: 3

          }
        } else {
          object = {
            stateCode: this.ngForm.controls['state_id'].value
            // stateCode: 3

          }

        }

        this.distData = [];
        this.breederService.postRequestCreator("spaToIndentor/getAllIndentor", null, object).subscribe((data: any) => {
          // console.log("distataaa", this.ngForm.controls['district'].value);
          if (data.EncryptedResponse.data == 'No data available' || data.EncryptedResponse.data == 'State not found') {
            this.distData = [];
          }
          else {
            if (this.ngForm.controls['status'].value) {
              this.distData = data.EncryptedResponse.data;
              let statusData = []
              console.log("this.ngForm.controls['status'].value", this.ngForm.controls['status'].value)
              if (this.ngForm.controls['status'].value == 'Active') {
                statusData = this.distData.filter(
                  item => (item.indentor == true),
                );
                this.distData = statusData;

                if (this.distData) {
                  // for (let prop in this.distData) {
                  //   if (this.distData[prop] === null) {
                  //     delete this.distData[prop];
                  //   }
                  // }
                  this.distData = Array.from(new Set(this.distData.map(a => a.districtName)))
                    .map(districtName => {
                      return this.distData.find(a => (a.districtName.toLowerCase()) === districtName.toLowerCase())
                    })


                  this.distData = this.distData.filter((arr, index, self) =>
                    index === self.findIndex((t) => (t.districtName === arr.districtName)))

                  this.distData = this.distData.sort((a, b) => a && a.districtName ? a.districtName.localeCompare(b.districtName) : '')
                  this.distDataSecond = this.distData
                }
                // this.distData = this.distData.filter((arr, index, self) =>
                //   index === self.findIndex((t) => ((t.districtName.toLowerCase()) === arr.districtName.toLowerCase())))
              }

              else {
                statusData = this.distData.filter(
                  item => (item.indentor == false) || !item.indentor,
                );
                this.distData = statusData;
                if (this.distData) {

                  this.distData = Array.from(new Set(this.distData.map(a => a.districtName)))
                    .map(districtName => {
                      return this.distData.find(a => (a.districtName.toLowerCase()) === districtName.toLowerCase())
                    })


                  this.distData = this.distData.filter((arr, index, self) =>
                    index === self.findIndex((t) => (t.districtName === arr.districtName)))
                  this.distData = this.distData.sort((a, b) => a.districtName.localeCompare(b.districtName))
                  this.distDataSecond = this.distData
                }

              }


            } else {
              this.distData = data.EncryptedResponse.data;
              this.distData = this.distData.filter((arr, index, self) =>
                index === self.findIndex((t) => (t.districtName === arr.districtName)))
              if (this.distData && this.distData.length > 0) {

                // this.distData = this.distData.sort((a, b) => a.districtName.localeCompare(b.districtName))
              }

              this.distDataSecond = this.distData

            }


          }

        })
      }
      this.agencyData = data.EncryptedResponse.data;
      if (this.type == 'state') {

        this.selected_state = this.agencyData && this.agencyData.m_state && this.agencyData.m_state && this.agencyData.m_state.state_name ? this.agencyData.m_state.state_name : ''
      }
      console.log(this.selected_state, 'this.selected_state')
    })

  }
  statusList() {
    console.log(this.ngForm.controls['state_id'].value, 'this.ngForm.controlse')
    if (this.ngForm.controls['state_id'].value) {

      this.selectStatusData = this.completeData.filter(x => x.state_name == this.ngForm.controls['state_id'].value)
      // this.selectspaData = this.selectspaData.filter(x =>  this.ngForm.controls['status'].value=='Active'?
      // x.indentor==true :x.indentor==false || !x.indentor )

      // this.selectspaData = this.distData.filter(
      //   x =>x.spaName==this.ngForm.controls['district'].value
      //   );
      console.log(' this.selectspaData', this.selectStatusData)
      this.selectStatusDatasecond = this.selectStatusData
    }
  }
  async getStateList() {
    this.service
      .postRequestCreator("getIndentorStateList")
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
          && apiResponse.EncryptedResponse.status_code == 200) {
          this.stateList = apiResponse.EncryptedResponse.data.rows;
          this.stateList = this.stateList.filter((arr, index, self) =>
            index === self.findIndex((t) => (t['m_state.state_name'] === arr['m_state.state_name'])))
          this.stateListSecond = this.stateList
        }
      });

  }


  selspaData() {
    if (this.ngForm.controls['district'].value) {

      this.selectspaData = this.completeData.filter(x => x.districtName == this.ngForm.controls['district'].value)
      this.selectspaData = this.selectspaData.filter(x => this.ngForm.controls['status'].value == 'Active' ?
        x.indentor == true : x.indentor == false || !x.indentor)

      // this.selectspaData = this.distData.filter(
      //   x =>x.spaName==this.ngForm.controls['district'].value
      //   );
      console.log(' this.selectspaData', this.selectspaData)
      this.selectspaDatasecond = this.selectspaData
    }
    // this.breederService.postRequestCreator("spaToIndentor/getAgencyData?id=" + this.currentUser.agency_id).subscribe((data: any) => {
    //   if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
    //     this.agencyData = data.EncryptedResponse.data;
    //     let object = {
    //       stateCode: data.EncryptedResponse.data['state_id']


    //     }

    //     this.selectspaData = [];
    //     this.breederService.postRequestCreator("spaToIndentor/getAllIndentor", null, object).subscribe((data: any) => {

    //       if (data.EncryptedResponse.data == 'No data available') {
    //         this.selectspaData = [];
    //       }
    //        else {

    //         if(this.ngForm.controls['district'].value) 
    //         {
    //           this.selectspaData = data.EncryptedResponse.data.filter(
    //             x =>x.selectspaData=this.ngForm.controls['district'].value
    //             );
    //         }
    //       }
    //       console.log("spaDataaa", this.spaData);


    //       console.log(this.spaData)
    //     })
    //   }

    // })

  }


  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.breederService.postRequestCreator("spaToIndentor/getAgencyData?id=" + this.currentUser.agency_id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.agencyData = data.EncryptedResponse.data;
        let object;
        if (this.type == 'state') {

          object = {
            stateCode: data.EncryptedResponse.data['state_id']
            // stateCode: 3

          }
          this.ngForm.controls['state_id'].setValue(data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data['state_id'] ? data.EncryptedResponse.data['state_id'] : '')
        } 
        else {
          object = {
            stateCode: this.ngForm.controls['state_id'].value
            // stateCode: 3
          }
        }
        this.distData = [];
        this.spaData = [];
        if (this.ngForm.controls['state_id'].value) {
          this.breederService.postRequestCreator("spaToIndentor/getAllIndentor", null, object).subscribe((data: any) => {
            if (data.EncryptedResponse.data == 'No data available') {
              this.distData = [];
              this.spaData = [];
            }
            else if (data.EncryptedResponse.data == 'State not found') {
              this.distData = [];
              this.spaData = [];
            }
            else {
              let sectorDataValue;
              if (this.agencyData && this.agencyData['m_state'] && this.agencyData['m_state'].state_code) {
                sectorDataValue = this.sectorData.filter(ele => ele.state_code == this.agencyData['m_state'].state_code)
                console.log('sector data ==', sectorDataValue);
              }

              if (this.type) {
                if (this.type == "central") {
                  if (sectorDataValue) {
                    this.completeData = data.EncryptedResponse.data.filter(ele => ele.sector == sectorDataValue[0].name)
                    console.log('this.completeData============', this.distData);
                    this.distData = data.EncryptedResponse.data.filter(ele => ele.sector == sectorDataValue[0].name);
                  }
                }
                else if (this.type == "state") {
                  this.completeData = data.EncryptedResponse.data.filter(ele =>  ele.sector == '' || ele.sector == null || ele.sector == undefined)
                  this.distData = data.EncryptedResponse.data.filter(ele =>  ele.sector == '' || ele.sector == null || ele.sector == undefined);
                  console.log('this.completeData============', this.distData);
                }
              }
              else {
                this.completeData = data.EncryptedResponse.data
                this.distData = data.EncryptedResponse.data;
              }

              if (this.ngForm.controls['district'].value || this.ngForm.controls['spa'].value || this.ngForm.controls['status'].value) {
                this.spaData = data.EncryptedResponse.data.filter(
                  item => item.districtName == this.ngForm.controls['district'].value,
                )
              }
              else {
                this.spaData = this.completeData;
                this.spaDistrictData= this.spaData;
                this.spaDistrictData =this.spaDistrictData.filter((arr, index, self) =>
                index === self.findIndex((t) => (t.districtName.toLowerCase() === arr.districtName.toLowerCase())))
                this.spaDistrictData= this.spaDistrictData.sort((a, b) =>  a.districtName.localeCompare(b.districtName));
                console.log( this.spaDistrictData)
                 this.distData = data.EncryptedResponse.data;
              }
            }
            // console.log("spaDataaa", this.spaData);
            // console.log(this.spaData)
          })
        }
      }
    })
  }


  clear() {
    this.selected_district = '';
    if (this.type == 'central') {

      this.ngForm.controls["state_id"].setValue("");
      this.selected_state = ''
    }
    this.selected_name_of_spa = ''
    this.ngForm.controls["district"].setValue("");
    this.ngForm.controls["spa"].setValue("");
    this.ngForm.controls["status"].setValue("");
    this.selected_district = ''
    this.submitted = false
    this.enableDistrict = false
    this.enableSpaname = false

    this.ngForm.controls['spa'].disable();


    // this.ngForm.controls['variety_name'].disable();
    // this.filterPaginateSearch.itemListCurrentPage = 1;

    this.ngForm.controls['spa'].patchValue("");

    this.getPageData();
  }

  search() {
    if ((!this.ngForm.controls["state_id"].value && !this.ngForm.controls["district"].value && !this.ngForm.controls["spa"].value
      && !this.ngForm.controls["status"].value
    )) {

      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    }
    else {
      this.submitted = true

      // const route = "filter-add-characterstics-list";
      // const param = {43
      //   search: {
      //     distData: (this.ngForm.controls["district"].value),
      //     spaData: this.ngForm.controls["spa"].value,


      //   }

      // }

      // this.filterPaginateSearch.itemListCurrentPage = 1;
      // this.initSearchAndPagination();
      // this.getPageData();
      this.spaData = this.completeData;

      if (this.ngForm.controls['district'].value) {
        // alert()

        const districtdata = this.spaData.filter(
          item => item.districtName == this.ngForm.controls['district'].value


        );
        console.log("DissssssData", districtdata)
        this.spaData = districtdata;
      }
      if (this.ngForm.controls['district'].value && this.ngForm.controls['spa'].value) {

        const districtdata = this.spaData.filter(
          item => item.districtName == this.ngForm.controls['district'].value &&
            item.spaName == this.ngForm.controls['spa'].value,
          // console.log("spaaaaaaData",item.spaName,this.ngForm.controls['spa'].value)

        );
        this.spaData = districtdata;
      }

      if (this.ngForm.controls['status'].value) {
        let statusData = []
        console.log("this.ngForm.controls['status'].value", this.ngForm.controls['status'].value)
        if (this.ngForm.controls['status'].value == 'Active') {
          statusData = this.spaData.filter(
            item => (item.indentor == true),


          );
          this.spaData = statusData;
          console.log(this.spaData, 'spa')
        }
        else {
          // if(this.ngForm.controls['status'].value == true){
          statusData = this.spaData.filter(

            item => !(item.hasOwnProperty("indentor")) || !item.indentor || (item.indentor != true),


          );
          //  }
          this.spaData = statusData;
          console.log(this.spaData, 'spa')
        }


      }
      else {
        if (this.type && this.type != 'state' && this.ngForm.controls['state_id'].value) {
          if (this.submitted) {
            this.getPageData();
          }
        }
      }

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


  setAsIndentor(spaCode: number) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Allow?",
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
        const object = {
          stateCode: this.agencyData.state_id.toString(),
          spaCode: spaCode.toString()
        }
        this.breederService.postRequestCreator("spaToIndentor/updateAsIndentor", null, object).subscribe((data: any) => {
          Swal.fire({
            title: '<p style="font-size:25px;">SPA Has Been Successfully Allowed For Indent Submission.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'


          }).then(x => location.reload())

        })
      }
    })
  }

  removeIndentor(spaCode: any) {
    Swal.fire({
      toast: false,
      icon: "question",
      title: "Are You Sure To Remove SPA From the List of Allowed SPAs? ",
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
        const object = {
          stateCode: this.agencyData.state_id.toString(),
          spaCode: spaCode.toString()
        }

        this.breederService.postRequestCreator("spaToIndentor/removeAsIndentor", null, object).subscribe((data: any) => {
          Swal.fire({
            title: '<p style="font-size:25px;">SPA Has Been Successfully Removed.</p>',
            icon: 'success',
            confirmButtonText:
              'OK',
          confirmButtonColor: '#E97E15'

          }).then(x => location.reload())
        })
      }
    })
  }

  // clear() {
  //   this.ngForm.controls['state'].patchValue("");
  //   this.getPageData();
  //   this.filterPaginateSearch.itemListCurrentPage = 1;
  //   this.initSearchAndPagination();
  // }

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

  download() {
    console.log("working")
    const name = 'selection-of-spa-for-submission-indent';
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
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    console.log("element", element)
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    console.log("exelWs", XLSX.utils.table_to_sheet(element));
    console.log("exelWB", XLSX.utils.book_new());
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  
  state_select(data) {
    this.selected_state = data && data['state_name'] ? data['state_name'] : '';
    this.ngForm.controls['state_id'].setValue(data && data['state_code'] ? data['state_code'] : '')
    this.ngForm.controls['state_text'].setValue('',{ emitEvent: false })
  }

  cnClick() {
    document.getElementById('state').click();
  }
  cdClick() {
    document.getElementById('district').click();
  }
  caClick() {
    document.getElementById('agency').click();
  }

  cnamespaClick() {
    document.getElementById('spa').click();
  }

  district_select(data) {
    this.selected_district = data && data.districtName ? data.districtName : '';
    this.ngForm.controls['district'].setValue(data && data.districtName ? data.districtName : '')
    this.ngForm.controls['district_text'].setValue('')
  }
  getUserAgencyData() {
    const userData = localStorage.getItem('BHTCurrentUser')
    const data = JSON.parse(userData)
    const param = {
      search: {
        agency_id: data.agency_id
      }
    }
    this.masterService.postRequestCreator('getUserDataInIndentor/' + data.agency_id, null, param).subscribe(data => {
      let res = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.rows ? data.EncryptedResponse.data.rows : '';
      this.type = res && res[0] && res[0].user && res[0].user.type ? res[0].user.type : '';
      console.log('this.type', this.type)
      this.getPageData();
    })
  }
  spa_select(data) {
    this.ngForm.controls['spa'].setValue(data && data.spaName ? data.spaName : '');
    this.selected_name_of_spa = data && data.spaName ? data.spaName : '';
    this.ngForm.controls['spa_name_text'].setValue('')
  }
  checkIndentor(inden, spacode) {
    if (inden == 'Allowed') {
      this.removeIndentor(spacode)
    } else {
      this.setAsIndentor(spacode)
    }
  }

}
