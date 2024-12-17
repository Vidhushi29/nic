import { Component, OnInit } from '@angular/core';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import html2pdf from 'html2pdf.js';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { race } from 'rxjs';


@Component({
  selector: 'app-inspection-report',
  templateUrl: './inspection-report.component.html',
  styleUrls: ['./inspection-report.component.css']
})
export class InspectionReportComponent implements OnInit {
  allData = [];
  id: string | null = null;
  user_id: string | null = null;
  isRemonitoring: boolean | null = null;
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  decryptedData: any = {};
  encryptedData: string;

  constructor(private productioncenter: ProductioncenterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const encryptedData = params['encryptedData'];
      console.log("encryptedData is",encryptedData);
      
      try {
        const decodedEncryptedData = decodeURIComponent(encryptedData);
        const bytes = CryptoJS.AES.decrypt(decodedEncryptedData, 'a-343%^5ds67fg%__%add');
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        const decryptedData = JSON.parse(decryptedString);

        console.log("decryptedData is",decryptedData);
        this.id = decryptedData.id;
        this.user_id = decryptedData.user_id;
        this.isRemonitoring = decryptedData.isRemonitoring;
        this.getReportData();
      } catch (error) {
        console.error("Error decrypting or parsing data:", error);
      }
    });
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
  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  getFormattedSeason(season) {
    switch (season) {
      case 'R':
        return 'Rabi';
      case 'K':
        return 'Kharif';
      default:
        return '--';
    }
  }

  formatDateRange(fromDate: string, toDate: string): string {
    if (!fromDate || !toDate) {
      return 'NA';
    }
    const formattedFromDate = this.formatedDate(fromDate);
    const formattedToDate = this.formatedDate(toDate);
    return `${formattedFromDate} - ${formattedToDate}`;
  }
  getquantityUnit(varietyCode: any) {
    if (varietyCode.slice(0, 1) == "A") {
      return "Qt";
    } else {
      return "Kg";
    }
  }
  getReportData() {
    const route = "get-bsp-proforma3-data-byId";
    const param = {
      "id": this.id,
      "user_id": this.user_id,
      "isRemonitoring": this.isRemonitoring
    }
    this.productioncenter.postRequestCreator(route, param, null).subscribe(data => {
      if (data.status == 200) {
        if (data.data[0].reinspection_data!= undefined) {
          data.data.forEach(item => {
            if (item.reinspection_data && item.reinspection_data.length > 0) {
              item.reinspection_data.forEach(reinspection => {
                item.report = reinspection.report;
                item.crop_condition = reinspection.crop_condition;
                item.date_of_inspection = reinspection.date_of_inspection;
                item.rejected_area = reinspection.rejected_area;
                item.inspected_area = reinspection.inspected_area;
                item.field_img = reinspection.field_img;
                item.field_code = reinspection.field_code;
                item.area_shown = reinspection.area_shown;
                item.date_of_harvesting = reinspection.date_of_harvesting;
                item.date_of_showing = reinspection.date_of_showing;
                item.estimated_production = reinspection.estimated_production;
                item.expected_production = reinspection.expected_production;
                item.harv_to_date = reinspection.harv_to_date;
                item.inspection_date = reinspection.inspection_date;
                item.latitude = reinspection.latitude;
                item.longitude = reinspection.longitude;
                item.reason = reinspection.reason;
                item.report_ref_no = reinspection.report_ref_no;
              });
            }
          });
        }
        this.allData = data.data;
        const user_id = this.user_id;
        const id = this.id;
        const isRemonitoring = this.isRemonitoring;
        this.encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ id, user_id, isRemonitoring}), 'a-343%^5ds67fg%__%add').toString();
        this.encryptedData = encodeURIComponent(this.encryptedData);
        this.allData[0].encryptedDataId = this.encryptedData;
      }
    })
  }
}

