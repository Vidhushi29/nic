import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { environment } from 'src/environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-g-invoice-test',
  templateUrl: './g-invoice-test.component.html',
  styleUrls: ['./g-invoice-test.component.css']
})
export class GInvoiceTestComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  baseUrl: string = environment.baseUrl;
  AESKey: string = environment.AESKey;

  private _productionCenter: any;

  inventoryData = []

  decryptedId: any;
  decryptedUserId: any;
  decryptedUserspaCode: any;

  indenterinvoiceData: any;
  spainvoiceData: any;

  spaDetails: any[] = [];
  grandTotal: any;
  encryptedData: string;
  gst: any;
  constructor(private service: SeedServiceService, private router: Router, private productionCenterService: ProductioncenterService, private fb: FormBuilder, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    // Retrieve encryptedId from route params
    this.route.params.subscribe(params => {
      const encryptedId = params['submissionid'];

      console.log("From URL", encryptedId)

      if (encryptedId) {
        // Decrypt the encryptedId
        const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), this.AESKey);
        this.decryptedId = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;
        const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ encryptedId }), this.AESKey).toString();
        this.encryptedData = encodeURIComponent(decodeURIComponent(encryptedId));
      }
    });
    this.getInvoceData(this.decryptedId);
  }


  getInvoceData(id: any) {
    const param = {
      id: this.decryptedId,
    };

    this.productionCenterService.postRequestCreator("spa-generate-invoice", param).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.status_code === 200) {
        console.log("Encrypted Response Data:", data.EncryptedResponse.data); 

        try {
          // Decrypt the EncryptedResponse
          const decryptedBytes = CryptoJS.AES.decrypt(
            decodeURIComponent(data.EncryptedResponse.data), // Decrypt encrypted data
            this.AESKey
          );

          const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

          if (!decryptedString) {
            throw new Error('Decryption failed. Empty response.');
          }

          // Parse the decrypted JSON
          const decryptedResponse = JSON.parse(decryptedString);
          console.log("Decrypted String:", decryptedString);
          console.log("Decrypted Response Object:", decryptedResponse);

          // Extract necessary data
          this.indenterinvoiceData = decryptedResponse[0]?.indenter_details[0];
          this.spainvoiceData = this.indenterinvoiceData?.spa_details[0];

          if (this.indenterinvoiceData?.spa_details?.length > 0) {
            this.indenterinvoiceData.spa_details.forEach((spaDetail: any) => {
              this.spaDetails.push(spaDetail);
            });

            // Calculate GST and Grand Total
            this.grandTotal = 0;
            this.gst = 0;
            this.spaDetails.forEach((spa: any) => {
              this.gst += (spa.grand_total * spa.seed_amount_gst) / 100; 
            });
 
          }
        } catch (error) {
          console.error('Decryption Error:', error);
          Swal.fire({
            title: 'Oops',
            text: 'Failed to process invoice data. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#E97E15',
          });
        }
      } else {
        Swal.fire({
          title: 'Oops',
          text: 'Invoice Not Found.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15',
        });
      }
    });
  }

  // getInvoceData(id:any)
  // {
  //   const param = {
  //     id: this.decryptedId,
  //   }
  //   this.productionCenterService.postRequestCreator("spa-generate-invoice", param).subscribe((data: any) => {
  //       if(data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200)
  //       {


  //           this.indenterinvoiceData =data.EncryptedResponse.data[0].indenter_details[0]
  //           this.spainvoiceData =data.EncryptedResponse.data[0].indenter_details[0].spa_details[0]        
  //           if (this.indenterinvoiceData && this.indenterinvoiceData.spa_details && this.indenterinvoiceData.spa_details.length > 0) {
  //             this.indenterinvoiceData.spa_details.forEach((spaDetail: any) => {
  //               // Process each spa_detail here
  //               this.spaDetails.push(spaDetail);
  //             });
  //             this.grandTotal = 0;
  //             this.gst = 0 ;
  //             this.spaDetails.forEach((spa: any) => {

  //               this.gst = spa.grand_total * spa.seed_amount_gst / 100
  //               console.log("spa.grand_total",spa.grand_total)
  //               console.log("spa.seed_amount_gst",spa.seed_amount_gst)

  //             });
  //           }
  //       }
  //       else 
  //       {
  //         Swal.fire({
  //           title: 'Oops',
  //           text: 'Invoice Not Found.',
  //           icon: 'error',
  //           confirmButtonText:
  //             'OK',
  //           confirmButtonColor: '#E97E15'
  //         })
  //         // this.router.navigate(['generate-invoices']);
  //       }
  //     // }
  //   })
  // }

  downloadPDF() {
    const element = document.getElementById('yourPdfContentId');
    if (element) {
      const opt = {
        margin: [5, 0],
        filename: 'generateInvoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
        pagebreak: { after: ['#page-break1'], avoid: 'img' },
      };
      html2PDF().from(element).set(opt).save();
    }
  }

}

