import { Component, OnInit, ViewChild } from '@angular/core';
import { SectionFieldType } from 'src/app/common/types/sectionFieldType';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
// import { DynamicFieldsComponent } from 'src/app/common/dynamic-fields/dynamic-fields.component';
// import { BreederSeedSubmissionUIFields } from 'src/app/common/data/ui-field-data/breeder-seed-submission-ui-fields';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import Swal from 'sweetalert2';
import { map, take, timer } from 'rxjs';
import { checkLength, checkNumber, convertDates, random } from 'src/app/_helpers/utility';
import { MasterService } from 'src/app/services/master/master.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { SumPipe } from '../pipe/sum.pipe';
import { DatePipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';

@Component({
  selector: 'app-submission-of-indent-of-breeder-seed-by-state-report',
  templateUrl: './submission-of-indent-of-breeder-seed-by-state-report.component.html',
  styleUrls: ['./submission-of-indent-of-breeder-seed-by-state-report.component.css']
})
export class SubmissionOfIndentOfBreederSeedByStateReportComponent implements OnInit {


  fieldsList: Array<SectionFieldType> = [];
  subFieldsList: Array<Array<SectionFieldType>> = [];
  formGroup: FormGroup = new FormGroup([]);
  submissionId: number | undefined;
  isEdit: boolean;
  isView: boolean;
  seasonList: any;
  cName: any;
  name: any;
  title: string = "submission-of-indent-of-breeder-seed-by-state-report works!";
  contactPersonName: any;
  contactPersonDesignation: any;
  currentUser: any = { id: 10, name: "Hello User" };
  cropData: any;
  disabled = false
  param: { search: { group_code: any; }; };
  cropDataList: any;
  disabledRadio = true
  cropGroupData: any;
  varietyList: any;
  group_name: any;
  crop_name: any;
  updatedCropCode: any;
  titleKey: string;
  notificationYearMissing = false;
  pastedNumber: any;
  totalData: any;
  reportData: any;
  totalIndent: any;
  seasonCodeValue: any;
  is_freeze: any;
  yearList: any;

  totalSPA: any;
  indentData: any;
  totalIndentQuantity: any;
  isAgriculture: boolean = true;
  totalStateSPA: any[];
  freezTimeLineData: any;
  setDob: any;
  freezeTimeLine: boolean ;
  cropName: any;
  unit: string;
  exportBtnVisible: boolean = false;
  yearOfIndentValue: any;
  seasonValue: any;
  cropGroupValue: any;
  cropNameValue: any;
  cropTypeValue: any;
  unitValue: any;
  viewheader: boolean = false;
  dummyData22: any;
  dummyData23: any[] =
    [
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Pusa RH-10",
        "not_year": 2022,
        "variety_id": 30561,
        "variety_code": "A0202004",
        "parental_count": 2,
        "total_spa_count": 4,
        "parental": [
          {
            "parental_line": "KHR-1",
            "total_indent": 70.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 40.50
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 30.00
              }
            ]
          },
          {
            "parental_line": "Pusa 1666",
            "total_indent": 145.50,
            "spa_count": 2,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                "spa_code": "1034",

                "indent_qunatity": 80.00
              },
              {
                "name": "Ms Agro Seed Producers Pvt Ltd",
                "spa_code": "1034",
                "indent_qunatity": 65.50
              }
            ]
          }
        ]
      },
      {
        "variety_name": "KHR-1",
        "not_year": 1994,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {

            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 100.50,
            "spa_count": 1,
            "spas": [
              {
                "name": "MS Balaji Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 100.50
              }

            ]
          },
        ]
      },
      {
        "variety_name": "Rajlaxmi (CRHR-5)",
        "not_year": 2006,
        // "variety_id": 30561,
        // "variety_code": "A0202004",
        "parental_count": 1,
        "total_spa_count": 1,
        "parental": [
          {
            "parental_line": "N/A",
            "not_date": "1991-11-22 00:00:00",
            "total_indent": 200.75,
            "spa_count": 1,
            "spas": [
              {
                "name": "Rashtriya Seeds Farms",
                // "spa_code": "1034",
                // "state_code": 8,
                "indent_qunatity": 200.75
              }

            ]
          },
        ]
      }
    ]



  get formGroupControls() {
    return this.formGroup.controls;
  }

  constructor(activatedRoute: ActivatedRoute, private router: Router,
    private masterService: MasterService,
    private indenterService: IndenterService, private service: SeedServiceService,
    private _service: ProductioncenterService,
    private fb: FormBuilder
  ) {
    this.createEnrollForm();
    let userData: any = JSON.parse(localStorage.getItem('BHTCurrentUser'))
    this.currentUser.id = userData.id
    this.currentUser.name = userData.name
    this.currentUser.agency_id = userData.agency_id
    const params: any = activatedRoute.snapshot.params;
    if (params["submissionid"]) {
      this.submissionId = parseInt(params["submissionid"]);
    }
    this.isEdit = router.url.indexOf("edit") > 0;
    this.isView = router.url.indexOf("view") > 0;
    if (this.isView) {
      this.disabled = true
    }
  }

  createEnrollForm() {
    this.formGroup = this.fb.group({
      yearofIndent: [''],
      season: [''],
      cropGroup: [''],
      cropName: [''],
      cropType: [''],
      unitKgQ: [''],
    });
  }

  ngOnInit(): void {

    let currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'))

    let object = {
      loginedUserid: {
        agency_id: currentUser.agency_id
      }
    }

    this.yearList = [];
    this.reportData = [];

    this.indenterService.postRequestCreator("get-indent-of-spa-year", null, object).subscribe(data => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.yearList = data.EncryptedResponse.data.sort((a, b) => b.year - a.year)
      }
    })

    this.formGroup.controls['yearofIndent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.formGroup.controls['season'].setValue('');
        this.formGroup.controls['cropGroup'].setValue('');
        this.formGroup.controls['cropName'].setValue('');
        this.formGroup.controls['cropType'].setValue('');
        this.formGroup.controls['unitKgQ'].setValue('');
        this.exportBtnVisible = false;
        this.seasonList = [];
        this.reportData = [];
        this.cropGroupData = [];
        this.cropDataList = [];

        const seasonObject = {
          loginedUserid: {
            agency_id: currentUser.agency_id
          },
          search: {
            year: this.formGroup.controls['yearofIndent'].value
          }
        }

        this.indenterService.postRequestCreator("get-indent-of-spa-season", null, seasonObject).subscribe(data => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            this.seasonList = data.EncryptedResponse.data;

            this.seasonList = this.seasonList.sort((a, b) => a.season.toLowerCase() > b.season.toLowerCase() ? 1 : -1);
          }

        })

      }
    });

    this.formGroup.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getFreezTimeLineData();
        this.formGroup.controls['cropGroup'].setValue('');
        this.formGroup.controls['cropName'].setValue('');
        this.formGroup.controls['cropType'].setValue('');
        this.formGroup.controls['unitKgQ'].setValue('');

        this.reportData = [];
        this.cropGroupData = [];
        this.cropDataList = [];
        this.exportBtnVisible = false;
        const cropGroupObject = {
          loginedUserid: {
            agency_id: currentUser.agency_id
          },
          search: {
            season: newValue,
            year: this.formGroup.controls['yearofIndent'].value
          }
        }

        this.indenterService.postRequestCreator("get-indent-of-spa-crop-group", null, cropGroupObject).subscribe((data: any) => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            this.cropGroupData = data.EncryptedResponse.data;
          }
        });
      }
    });

    this.formGroup.controls['cropGroup'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.formGroup.controls['cropName'].setValue('');
        this.formGroup.controls['cropType'].setValue('');
        this.formGroup.controls['unitKgQ'].setValue('');
        this.exportBtnVisible = false;
        this.reportData = [];
        this.cropDataList = [];

        const cropNameObject = {
          loginedUserid: {
            agency_id: currentUser.agency_id
          },
          search: {
            group_code: newValue,
            season: this.formGroup.controls['season'].value,
            year: this.formGroup.controls['yearofIndent'].value
          }
        }
        this.exportBtnVisible = false;
        this.indenterService.postRequestCreator('get-indent-of-spa-crop', null, cropNameObject).subscribe(data => {
          if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
            data.EncryptedResponse.data.forEach(element => {
              if (element && element.crop_code) {
                this.cropDataList.push(element);
              }
            });
          }

          if ((this.cropDataList != undefined) && !this.isView) {
            const foundData = this.cropDataList.filter((x: any) => x.crop_code == this.updatedCropCode);
            this.crop_name = foundData && foundData[0].crop_name ? foundData[0].crop_name : '';
          }

          this.indenterService.putData(this.cropDataList);
        })
      }

    });

    this.formGroup.controls["cropType"].disable();

    this.getDashBoardData();

    this.formGroup.controls['cropName'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.exportBtnVisible = true;
        this.yearOfIndentValue = this.formGroup.controls['yearofIndent'].value;
        if (this.formGroup.controls['season'].value == "K") {
          this.seasonValue = "Kharif";
        } else {
          this.seasonValue = "Rabi";
        }

        let cropGroup = this.cropGroupData.filter(item => item.group_code == this.formGroup.controls['cropGroup'].value);
        this.cropGroupValue = cropGroup && cropGroup[0].group_name;

        let cropValue = this.cropDataList.filter(item => item.crop_code == this.formGroup.controls['cropName'].value);
        this.cropNameValue = cropValue && cropValue[0].crop_name;

        this.cropTypeValue = this.formGroup.controls['cropType'].value;
        this.unitValue = this.formGroup.controls['unitKgQ'].value;

        
        let cropData = this.cropDataList.filter(item => item.crop_code == this.formGroup.controls['cropName'].value);
        this.cropName = cropData && cropData[0] && cropData[0].crop_name ? cropData[0].crop_name : '';
        this.formGroup.controls['cropType'].setValue('');
        this.formGroup.controls['unitKgQ'].setValue('');

        this.getTotalNumberOfSPA(currentUser.id)
        // this.getDataFromIndentOfBreederSeed();

        this.getReportsData(newValue, currentUser.agency_id);
        this.updatedCropCode = newValue;

        if ((newValue).slice(0, 1) == 'A') {
          this.isAgriculture = true;
          this.unit = 'Quintal';
          this.formGroup.controls["cropType"].patchValue('agriculture');
          this.formGroup.controls["unitKgQ"].patchValue('quintal');

        } else if ((newValue).slice(0, 1) == 'H') {
          this.isAgriculture = false;
          this.unit = 'Kg';
          this.formGroup.controls["cropType"].patchValue('horticulture');
          this.formGroup.controls["unitKgQ"].patchValue('kilogram');
        }
      }
    });

    this.isEditOrView();
  }
  getFreezTimeLineData() {
    let season;
    if (this.formGroup.controls['season'].value == "K") {
      season = "Kharif";
    } else {
      season = "Rabi";
    }
    const param = {
      search: {
        year_of_indent: parseInt(this.formGroup.controls['yearofIndent'].value),
        season_name: season,
        activitie_id: 2
      }
    }
    let route = "freeze-timeline-filter";
    this.masterService.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.freezTimeLineData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        console.log('this.freezTimeLineData====', this.freezTimeLineData);
      }
      let date = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].end_date;
      let startDate = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].start_date;

      let endDateInput = formatDate(date, 'yyyy-MM-dd', 'en_US')
      let startDateInput = formatDate(startDate, 'yyyy-MM-dd', 'en_US')

      console.log('dateInput=====', endDateInput);

      let date1 = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
      console.log('date1 today', date1);
      if (date) {
        if (startDateInput <= date1 && endDateInput >= date1) {
          // alert('Hii');
          this.freezeTimeLine = true;
        } else {
          // alert('bye');
          this.freezeTimeLine = false;
        }
        console.log('this.freezeTimeLine================',this.freezeTimeLine);
      }
    });
  }
  getTotalNumberOfSPA(id: any) {
    this.totalStateSPA = [];

    this.indenterService.postRequestCreator("getTotalNumberOfSPA?user_id=" + id).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.totalStateSPA = data.EncryptedResponse.data;
      }
    })
  }

  getDataFromIndentOfBreederSeed() {
    const object = {
      year: this.formGroup.controls['yearofIndent'].value,
      season: this.formGroup.controls['season'].value,
      crop_code: this.formGroup.controls['cropName'].value,
      user_id: this.currentUser.id
    }

    this.indentData = {
      total_variety: 0,
      total_indent_quantity: 0
    }

    this.indenterService.postRequestCreator("getIndentOfBreederSeedDataForSPA", null, object).subscribe((data: any) => {
      if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
        this.indentData['total_variety'] = data.EncryptedResponse.data.length;

        let temp = 0;

        data.EncryptedResponse.data.forEach(element => {
          temp += temp + element.indent_quantity;
          temp += temp + element.indent_quantity;
        });

        this.indentData['total_indent_quantity'] = temp;

      }
    })
  }

  getDashBoardData() {
    let route = "get-indent-of-spa-report-count";
    this.indenterService.postRequestCreator(route, null).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.totalData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : '';
      }
    })
  }

  freeze() {
    Swal.fire({
      title: 'Do You Want to Submit the Indent?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {

      if (result.isConfirmed) {
        let data = {
          season: this.formGroup.controls['season'].value,
          crop_code: this.formGroup.controls['cropName'].value,
          year: this.formGroup.controls['yearofIndent'].value,
          group_code: this.formGroup.controls['cropGroup'].value
        };
        const route = "freez-indent-of-spa-data";
        this.indenterService.postRequestCreator(route, null, data).subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code == 200) {

            let freezArray = {
              year: Number(this.formGroup.controls['yearofIndent'].value),
              season: this.formGroup.controls['season'].value,
              crop_code: this.formGroup.controls['cropName'].value,
              variety_id: [],
              user_id: this.currentUser.id
            }
            console.log(this.reportData, 'reportData')
            this.reportData.forEach(variety => {
              freezArray.variety_id.push(variety.variety_id)
            });
            console.log(freezArray, 'freezArray')

            this.indenterService.postRequestCreator("freez-indent-of-breederseed-data-from-spa", null, { "freezArray": freezArray }).subscribe((data: any) => {

              if (data) {
                Swal.fire({
                  title: '<p style="font-size:25px;">Data has been forwarded to Seed Division.</p>',
                  icon: 'success',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#E97E15'
                }).then(x => {
                  let data = {
                    search: {
                      season: this.formGroup.controls['season'].value,
                      crop_code: this.formGroup.controls['cropName'].value,
                      year: parseInt(this.formGroup.controls['yearofIndent'].value),
                      group_code: this.formGroup.controls['cropGroup'].value
                    }
                  };
                  this.getReportsData(data);
                })
              } else {
                Swal.fire({
                  title: 'Oops',
                  text: '<p style="font-size:25px;">Something Went Wrong.</p>',
                  icon: 'error',
                  confirmButtonText:
                    'OK',
                  confirmButtonColor: '#E97E15'
                })
              }

            })

          }
          else {
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
    })
  }

  getReportsData(values: any, agency_id?: any) {

    let data = {
      loginedUserid: {
        agency_id: agency_id
      },
      search: {
        season: this.formGroup.controls['season'].value,
        crop_code: this.formGroup.controls['cropName'].value,
        year: parseInt(this.formGroup.controls['yearofIndent'].value),
        group_code: this.formGroup.controls['cropGroup'].value
      }
    };

    this.reportData = [];
    this.totalSPA = [];

    this.indentData = {
      total_variety: 0,
      total_indent_quantity: 0
    }

    this.indenterService.postRequestCreator("get-indent-of-spa-report", null, data).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.data) {
        console.log(res.EncryptedResponse.data)

        let temp_data = [];
        this.totalIndentQuantity = 0;
        this.dummyData22 = res.EncryptedResponse.data;
        res.EncryptedResponse.data.forEach(data => {
          let totalIndent = 0;
          if (data && data !== undefined && data !== null) {
            this.indentData.total_variety += 1;
            data.parental.forEach(element => {
              let spaIndentHybrid = 0;
              let spaIndentNormal = 0;
              totalIndent += element.total_indent
              element.spas.forEach((spa, i) => {
                if (spa.indent_qunatity) {
                  spaIndentHybrid += parseFloat(spa.indent_qunatity)
                } else {
                  spaIndentNormal += parseFloat(element.total_indent)
                }

                let spaName = spa.name.toString().toLowerCase();
                if (!this.totalSPA.includes(spaName)) {
                  this.totalSPA.push(spaName)
                }
              })
              this.totalIndentQuantity += spaIndentHybrid + spaIndentNormal
            });

            data['totalIndent'] = totalIndent

            temp_data.push(data)

          }
        });



        console.log(this.totalIndentQuantity)
        this.indentData.total_indent_quantity = this.totalIndentQuantity;
        this.reportData = this.dummyData22;
        console.log('this.=====?>', this.reportData)

        let is_freeze = []

        for (let value of this.reportData) {
          console.log('value.is_indenter_freeze==',value.is_indenter_freeze);
          if (value.is_indenter_freeze == 0 || value.is_indenter_freeze == null) {
            is_freeze.push(0);
          }

        }
        this.is_freeze = is_freeze;
        console.log('this.is_freeze===',this.is_freeze)
      }

    })
  }

  getNoticeYear(varietyId, i) {
    if (varietyId) {
      this.masterService.postRequestCreator("get-crop-variety-year", null, {
        search: {
          variety_id: varietyId
        }
      }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
          let varietyYear = data.EncryptedResponse.data;
          if (varietyYear.length > 0) {
            const notification_date = data && data.EncryptedResponse && data.EncryptedResponse.data[0] && data.EncryptedResponse.data[0].not_date ? data.EncryptedResponse.data[0].not_date : ''
            if (notification_date != '') {
              let not_date = new Date(notification_date)
              let convertNotificationDate = convertDates(not_date)
              let convertNotificationDateSplit = convertNotificationDate.split('-');
              this.formGroup.controls['variety_items']['controls'][i].controls["varietyNotificationYear"].setValue(convertNotificationDateSplit[0]);
            }
          }
        }
      });
    }

  }

  removeSelectedVariety(id) {
    this.varietyList.forEach((ele, index) => {
      if (ele.id == id) {
        delete this.varietyList[index];
      }
    })
  }

  isEditOrView() {
    if (this.isEdit || this.isView) {
      this.indenterService
        .postRequestCreator("get-breeder-seeds-submission/" + this.submissionId, null, null)
        .subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
            let data = apiResponse.EncryptedResponse.data;
            this.formGroup.controls['yearofIndent'].patchValue(data.year);
            this.formGroup.controls['season'].patchValue(data.season);
            this.formGroup.controls['cropGroup'].patchValue(data.group_code);
            // this.indentCropName(data.group_code)
            this.formGroup.controls['cropName'].patchValue(data.crop_code);
            this.formGroup.controls['cropType'].patchValue(data.crop_type);
            this.formGroup.controls['unitKgQ'].patchValue(data.unit);
            this.formGroup.controls['variety_items']['controls'][0].controls['varietyNotificationYear'].patchValue(data.variety_notification_year);
            this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].patchValue(data.variety_id);
            this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].patchValue(data.indent_quantity);
          }
        });
      if (this.isView) {
        this.formGroup.controls['yearofIndent'].disable();
        this.formGroup.controls['season'].disable();
        this.formGroup.controls['cropGroup'].disable();
        this.formGroup.controls['cropName'].disable();
        this.formGroup.controls['cropType'].disable();
        // this.formGroup.controls['unitKgQ'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['varietyName'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['varietyNotificationYear'].disable();
        this.formGroup.controls['variety_items']['controls'][0].controls['indentQuantity'].disable();
      }
    }
  }

  checkNumber($e) {
    checkNumber($e);
  }
  checkLength($e, length) {
    checkLength($e, length);
  }

  getQuantityOfSeedProduced(data: any) {
    let value = data.toString();

    if (value.indexOf(".") == -1) {
      return data;

    } else {
      // return data.toFixed(2);
      return data ? Number(data).toFixed(3) : 0;


    }
  }
  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  printPage() {
    //  window.print()
    // window.open('submission-of-indent-of-breeder-seed-by-state-report',"_blank");
    //  var printContents = document.getElementById('excel-table').innerHTML;
    //  var originalContents = document.body.innerHTML;

    //  document.body.innerHTML = printContents;

    //  window.print();

    //  document.body.innerHTML = originalContents;
    const printContent = document.getElementById('excel-table')?.innerHTML;
    const printWindow = window.open('', '_blank');
    //  'width=800,height=600'

    if (printWindow) {
      // List of Indents Submitted by SPA
      printWindow.document.write('<html><head><title></title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }
  openPDF(): void {

    timer(2000).pipe(take(1)).subscribe(() => {
      // The action inside this block will be executed after the delay
      this.viewheader = true;
      let DATA: any = document.getElementById('excel-table');
      console.log("DATA VALUE", DATA)
      html2canvas(DATA).then((canvas) => {

        let var1 = DATA.length
        let fileWidth = 209;

        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        console.log("File Height", fileHeight)
        // let fileHeight = ( (canvas.height * fileWidth) / canvas.width) / 20 * this.dummyData22.length;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('submission_of_indent_of_breeder_seed_by_state_report.pdf');
      });
    });
    this.viewheader = false;
  }
  fileName = 'ExcelSheet.xlsx';

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'Submitted-Indents-of-Breeder-Seed-(SPA Wise)-report';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      margin: [10, 3, 0, 0],

      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 300,
        scale: 1,
        // width:50px,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
  sumValue(parentalData) {
    let totalIndent = 0
    let spaIndentHybrid = 0;
    let spaIndentNormal = 0;
    parentalData.forEach(element => {
      totalIndent += element.total_indent
      element.spas.forEach((spa, i) => {
        if (spa.indent_qunatity) {
          spaIndentHybrid += parseFloat(spa.indent_qunatity)
        } else {
          spaIndentNormal += parseFloat(element.total_indent)
        }
      })
    });
    if (spaIndentHybrid) {
      return spaIndentHybrid;
    } else {
      return spaIndentNormal
    }
  }
}