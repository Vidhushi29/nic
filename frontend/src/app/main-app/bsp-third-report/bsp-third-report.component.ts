import { Component, OnInit } from '@angular/core';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import html2pdf from 'html2pdf.js';
import { bottom } from '@popperjs/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-bsp-third-report',
    templateUrl: './bsp-third-report.component.html',
    styleUrls: ['./bsp-third-report.component.css']
})
export class BspThirdReportComponent implements OnInit {

    allData = [];
    baseUrl: string = environment.ms_nb_01_master.baseUrl;
    encryptedData: string = '';
    
    constructor(private service: SeedServiceService) { }

    ngOnInit(): void {
        this.allData = this.service.bsp3rdReportData.flat();
        console.log("this.allData===",this.allData);
        const id = this.allData[0].id;
        const user_id = this.allData[0].bspProforma2.user_id;
        // this.encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ id, user_id }), 'a-343%^5ds67fg%__%add').toString();
        const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ id, user_id }), 'a-343%^5ds67fg%__%add').toString();
         this.encryptedData = encodeURIComponent(encryptedForm);
        
        this.downloadPDF();
    }

    formatedDate(dateString: string): string {
        if (!dateString) return 'NA';
        const date = new Date(dateString);
        const year = date.getFullYear() % 100;
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        const formattedDay = day < 10 ? `0${day}` : `${day}`;
        return `${formattedDay}/${formattedMonth}/${year}`;
    }

     getFormattedSeason(season) {
        switch (season) {
          case 'R':
            return 'Ravi';
          case 'K':
            return 'Kharif';
          default:
            return '--';
        }
      }
    formatDateRange(fromDate: string, toDate: string): string {
        const formattedFromDate = this.formatedDate(fromDate);
        const formattedToDate = this.formatedDate(toDate);
        return `${formattedFromDate} - ${formattedToDate}`;
    }

    downloadPDF() {
        const element = document.getElementById('yourPdfContentId');
        if (element) {
            const opt = {
                margin: 5,
                filename: 'bsp3Report.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
                pagebreak: { after: ['#page-break'], avoid: 'img' },
            };
            html2pdf().from(element).set(opt).save();
        }
    }
    getquantityUnit(varietyCode: any) {
        if (varietyCode.slice(0, 1) == "A") {
          return "Qt";
        } else {
          return "Kg";
        }
      }
      capitalizeFirstLetter(value: string): string {
        if (!value) return '';
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
}
