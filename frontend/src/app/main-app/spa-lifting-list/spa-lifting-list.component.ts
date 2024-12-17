import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { IndentBreederSeedAllocationSearchComponent } from 'src/app/common/indent-breeder-seed-allocation-search/indent-breeder-seed-allocation-search.component';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { RestService } from 'src/app/services/rest.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as html2PDF from 'html2pdf.js';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { BreederService } from 'src/app/services/breeder/breeder.service';

@Component({
  selector: 'app-spa-lifting-list',
  templateUrl: './spa-lifting-list.component.html',
  styleUrls: ['./spa-lifting-list.component.css']
})

export class SpaLiftingListComponent implements OnInit {

  ngForm!: FormGroup;
  currentUser: any;

  stateData: any;
  cropData: any;
  spaData: any;
  varietyData: any;

  pageData: any;

  constructor(
    private fb: FormBuilder,
    private breederService: BreederService,
    private route: ActivatedRoute,
    private router: Router) {

    this.ngForm = this.fb.group({
      state_code: [''],
      spa_code: [''],
      crop_code: [''],
      variety_code: [''],
    });

  }


  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    this.pageData = [];

    this.cropData = [];
    this.stateData = [];
    this.spaData = [];
    this.varietyData = [];

    this.getStateData();
    this.getCropData();

    this.ngForm.controls['state_code'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.spaData = [];

        this.breederService.postRequestCreator("getSPADataForSPALifting?state_id=" + newValue).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            this.spaData = data.EncryptedResponse.data
          }
        })
      }
    });


    this.ngForm.controls['crop_code'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.varietyData = [];

        this.breederService.postRequestCreator("getVarietyDataForSPALifting?crop_code=" + newValue).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            this.varietyData = data.EncryptedResponse.data
          }

          console.log(this.varietyData)
        })
      }
    });
  }


  getStateData() {
    this.stateData = [];

    this.breederService.postRequestCreator("getStateDataForSPALifting").subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.stateData = data.EncryptedResponse.data
      }

    })
  }

  getCropData() {
    this.cropData = [];
    this.breederService.postRequestCreator('getCropDataForSPALifting').subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.cropData = data.EncryptedResponse.data;
      }

    })
  }

  onSubmit() {
    if ((!this.ngForm.controls["state_code"].value && !this.ngForm.controls["spa_code"].value && !this.ngForm.controls["crop_code"].value && !this.ngForm.controls["variety_code"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please select something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
      confirmButtonColor: '#E97E15'
      })

      return;
    } else {
      console.log(this.ngForm.value)
    }
  }

  clear() {
    this.spaData = [];
    this.varietyData = [];

    this.ngForm.controls['state_code'].patchValue("");
    this.ngForm.controls['spa_code'].patchValue("");
    this.ngForm.controls['crop_code'].patchValue("");
    this.ngForm.controls['variety_code'].patchValue("");
  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }


  download() {
    const name = 'spa-lifting-list-report';
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
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "SPA Lifting List xlsx Report.xlsx");

  }

}
