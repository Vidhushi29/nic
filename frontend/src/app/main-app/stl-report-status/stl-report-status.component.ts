import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import * as html2PDF from 'html2pdf.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stl-report-status',
  templateUrl: './stl-report-status.component.html',
  styleUrls: ['./stl-report-status.component.css']
})
export class StlReportStatusComponent implements OnInit {
  ngForm!: FormGroup
  stlReportStatusData: any;
  yearDataList: any;
  varietyDataList: any;
  cropDataList: any;
  seasonDataList: any;
  formDivVisibile: boolean = false;
  constructor(private _prodoctionService: ProductioncenterService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.createForm()
  }
  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
    });
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop'].disable();
        this.ngForm.controls['variety'].disable();
        this.getSeasonData()
      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['crop'].enable();
        this.ngForm.controls['variety'].disable();
        this.getCropData()
      }
    });
    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['variety'].enable();
        this.getVarietyData()
      }
    });
    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        // this.getPageData();
      }
    });
  }

  ngOnInit(): void {
    this.getYearData();
    
  }
  getYearData() {
    let route = "get-generate-sample-forwarding-slip-year-data";
    let param = {

    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearDataList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }

    })
  }
  getSeasonData() {
    let route = "get-generate-sample-forwarding-slip-season-data";
    let param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
      }
    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonDataList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }

    })
  }
  getCropData() {
    let route = "get-generate-sample-forwarding-slip-crop-data";
    let param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value
      }
    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.cropDataList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }

    })
  }

  getVarietyData() {
    let route = "get-generate-sample-forwarding-slip-variety-data";
    let param = {
      // "search": {
      //   "year": this.ngForm.controls["year"].value,
      //   "season": this.ngForm.controls["season"].value,
      //   "crop_code": this.ngForm.controls["crop"].value,
      //   "testing_type" :'table1',

      // }
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value,
        "testing_type" :'table1',
    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.varietyDataList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }

    })
  }

  getPageData() {
    let route = "get-stl-report-status-data";
    let param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value,
        "variety_code": this.ngForm.controls["variety"].value,
      }
    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.stlReportStatusData = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }else {
        this.stlReportStatusData = []; // Reset data if unsuccessful
      }
       

    })
  }
  // Confirmation before proceeding
  confirmProceedForPacking(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed for packing?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#E97E15',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveData1(data, 'success');
      }
    });
  }

  saveData1(formData: any, status: string) {
    console.log('foamData', formData);
    let route = "update-stl-report-status-data";
    let param = {
      id: formData.id,
      status: status,
    };

    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        Swal.fire({
          title: `<p style="font-size:25px;">Status updated to ${status}</p>`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });

        // Update button state and appearance
        formData.isProceeded = true;
        formData.status = 'success';  // Ensure the status is set to 'success'
        this.updateButtonState1(formData);

        // Trigger change detection manually to ensure the button updates
        this.cdr.detectChanges();
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Status not updated</p>',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    });
  }

  updateButtonState1(data: any) {
    // Set the state to reflect changes in the view
    data.isProceeded = true;
  }
   // Check if the Discard button should be visible
   isDiscardVisible(data: any): boolean {
    return data.status !== 'success' && data.status !== 're-sample' && (data.status === 'discard' || data.status === null);
  }

  confirmDiscard(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to discard?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, discard it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#E97E15',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveData(data, 'discard');
      }
    });
  }

  saveData(formData: any, status: string) {
    console.log('foamData', formData);
    let route = "update-stl-report-status-data";
    let param = {
      id: formData.id,
      data:formData,
      status: status,
    };

    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        Swal.fire({
          title: `<p style="font-size:25px;">Status updated to ${status}</p>`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });

        // Update button state and appearance
        formData.isDiscarded = true;
        formData.status = 'discard';  // Ensure the status is set to 'discard'
        this.updateButtonState(formData);
        this.getPageData();
        // Trigger change detection manually to ensure the button updates
        this.cdr.detectChanges();
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Status not updated</p>',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    });
  }

  updateButtonState(data: any) {
    // Set the state to reflect changes in the view
    data.isDiscarded = true;
    // This method might be used if there's any additional logic to update button state
  }
  
  
  // saveData(formData, status) {
  //   console.log('foamData',formData);
  //   let route = "update-stl-report-status-data";
  //   let param = {
  //     id: formData.id,
  //     status: status,
  //   }
  //   this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
  //     if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
  //       Swal.fire({
  //         title: '<p style="font-size:25px;">status update to '+status+'</p>',
  //         icon: 'success',
  //         confirmButtonText:
  //           'OK',
  //       confirmButtonColor: '#E97E15'
  //       });
  //       this.getPageData();
  //     }else{
  //       Swal.fire({
  //         title: '<p style="font-size:25px;">status not update</p>',
  //         icon: 'warning',
  //         confirmButtonText:
  //           'OK',
  //       confirmButtonColor: '#E97E15'
  //       });
  //     }
  //   })
  // }


  searchData() {
    this.formDivVisibile = true;
    this.getPageData();
  }
  printContent() {
    let printContents = document.getElementById('printSection').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  generatePdf() {
    let filename = "forwarding letter "
    let elementId = document.getElementById('printSection')
    // pdf-tables
    // pdf-report
    const name = 'bsp-three-report';
    const element = elementId
    var doc = new jsPDF();
    const options = {
      filename: `${filename}.pdf`,
      margin: [10, 0],
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        dpi: 300,
        scale: 1,
        letterRendering: true,
        logging: true,
        useCORS: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a3',
        orientation: 'landscape'
      },
    };
    var pageCount = doc.getNumberOfPages();
    console.log(pageCount, 'pdf', elementId)
    let pdf = html2PDF().set(options).from(element).toPdf().save();
  }

}
