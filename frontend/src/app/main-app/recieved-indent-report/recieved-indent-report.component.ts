import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { SumPipe } from '../pipe/sum.pipe';
import { jsPDF } from "jspdf";
import { MasterService } from 'src/app/services/master/master.service';
import { formatDate } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-recieved-indent-report',
  templateUrl: './recieved-indent-report.component.html',
  styleUrls: ['./recieved-indent-report.component.css']
})
export class RecievedIndentReportComponent implements OnInit {
  @ViewChild('tableToExport') tableToExport: ElementRef;
  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  cropGroupData;
  statename = [];
  identor = [];
  ngForm!: FormGroup;
  seasonList: any = [];

  response_crop_group: any = [];
  data: any;
  data1: any;
  search = true;
  custom_array: any[];
  finalData: any[];
  fileName = 'submit-indents-breeder-seeds.xlsx';
  data2 = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Doe', age: 25 },
    { id: 2, name: 'Jane', age: 35 }
  ];

  yearOfIndent: any = [
    // {name: "2025 - 2026", "value": "2025"},
    // {name: "2024-25", "value": "2024"},
    // {name: "2023-24", "value": "2023"},
    // {name: "2022-23", "value": "2022"},
    // {name: "2021-22", "value": "2021"},
    // { name: "2020 - 2021", "value": "2020" }
  ];
  year: any;
  season: any;
  crop: any;
  isSearch: boolean = false;
  @ViewChild('content') content: ElementRef;
  todayData = new Date();
  tableId: any[];
  vals: any;
  cropName: any;
  crop_group: any;
  crop_name: any;
  filterSeason: any;

  defaultValue1;
  // values2 = ['A0401'];
  // defaultValue2 = this.values2[0];
  // defYear = [(new Date()).getFullYear()];
  // values2 = ['A0107'];
  values2 = [];

  defaultValue2;
  defYear = [2024];
  // defualtSeason = 'K'
  defualtSeason = ''

  defaultYear = this.defYear[0];
  submitted: boolean = false;
  filterCropGroup: any;
  filterCropName: any;
  unit: string;
  name = "ghg";
  studentArray = [
    { id: 1, fees: 5000 },
    { id: 2, fees: 2000 },
    { id: 3, fees: 2000 },
    { id: 4, fees: 100 }
  ];
  indentername: any;
  is_freeze: any[];
  searchValue = true;
  cropNameList: any;
  noOneRemaining: boolean = false;
  selectedYear;
  is_search: boolean = false;
  isSearchMsg: any;
  searchBtn: boolean = false;
  is_freezeIndenter: any;

  tempPageData: any;
  pageData: any;
  checkFreeze: any;
  totalIndentor: any;
  totalIndentorQunatity: any;
  freezeTimeLine: boolean = true;
  freezTimeLineData: any;
  // filterSeason: any;
  customWidth = 510
  customHeight = 600
  totalRowofIndentor: { short_name: string; sum: unknown; }[];
  totalSum: number;
  is_freezeData = false;
  dropdownSettings: IDropdownSettings = {};
  tableData;
  SummaryDetails;
  arr2: { instructions: string; }[];
  arr: { name: string; role: string; }[];
  constructor(private breederService: BreederService, private fb: FormBuilder, private service: SeedServiceService, private router: Router, private masterService: MasterService) {
    this.createEnrollForm();
    // document.getElementById('searchData').click();
  }
  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: ['', ],
      crop_name: ['', [Validators.required]],
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop_type:['',[Validators.required]]

    });
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['season'].disable();

    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {

        this.getSeasonData(newValue);
        this.ngForm.controls['season'].enable()
        this.ngForm.controls['crop_type'].setValue('')
        this.ngForm.controls['season'].setValue('')
        this.ngForm.controls['crop_name'].setValue('')

      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getCroupCroupList(newValue)

        this.ngForm.controls['crop_type'].enable()
        this.ngForm.controls['crop_name'].setValue('')
        this.searchValue = false;
      }
    });

    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.search = false

        this.getCropNameList(newValue);
        this.ngForm.controls['crop_name'].enable()
        this.ngForm.controls['crop_name'].setValue('')
        this.defaultValue2 = '';
        this.searchValue = false

      }
    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.search = true
        // this.searchValue = false
      }
    });
  }
  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'crop_code',
      textField: 'm_crop.crop_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      itemsShowLimit: 2,
      // itemsShowLimit: 2,
      // limitSelection: -1,
    };

    if (this.is_search == false) {
      this.isSearchMsg = "Please Select Filter."
    }
    this.arr = [
      { name: 'Moran', role: 'back' },
      { name: 'Alain', role: 'front' },
      { name: 'Tony', role: 'back' },
      { name: 'Mike', role: 'back' },
      { name: 'Abo', role: 'back' },
      { name: 'Toni', role: 'back' },
    ];
    this.arr2 = [
      { instructions: `1. Use the "Template" sheet to fill.` },
      { instructions: `2. Use the "Template" sheet to fill 2.` }
    ];
    this.getYearOfIndent();
    // this.SummaryDetails = {
    //   'Current Week': [
    //     {
    //       'Big Item': 'Technical Debt from last week: TAC Sea Prio 0 changes',
    //       Tasks: 'Fix Mobile view',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Prio 0 changes on the webapp',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       'Big Item':
    //         'UC#12: TAC-Sea in Teacher Corner: Ms Anju accesses TAC-sea-> clicks on more TACs - and lands in Teacher Corner.',
    //       Tasks:
    //         'Replicate the current tAC Sea in Teacher Corner, later it will be required in myUnalb as well. Can it be a component?',
    //       Who: 'Shreya',
    //       'Functionality agreed': 'yes',
    //     },
    //     {
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'yes',
    //     },
    //     {
    //       Tasks: 'Firebase entry for the 28 NCERT TACs: Grade 10',
    //       'Planned Effort': '3 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'yes',
    //       Tested: 'yes',
    //     },
    //     {
    //       Tasks: 'Firebase entry for the 28 NCERT TACs: Grade 9',
    //       'Planned Effort': '30 mins',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'yes',
    //       Comments: 'Waiting on youtube links',
    //     },
    //     {
    //       Tasks: 'Test, test, test',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       'Big Item': 'UC#14: Ms. Anju edits the Internal Assessment',
    //       Tasks: 'Make the student clickable to see detailed view',
    //       'Planned Effort': '3 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Teacher corner student table UI',
    //       'Planned Effort': '2 hours',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       Tasks: 'Actually read the marks',
    //       'Planned Effort': '1 hours',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       Tasks: 'Store the edited marks',
    //       'Planned Effort': '1 hours',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       Tasks: 'Download as xls',
    //     },
    //     {
    //       'Big Item': 'Teacher Corner: demonstration of end to end flow',
    //       Tasks: 'UI improvement',
    //     },
    //     {
    //       Tasks: 'Demonstration',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       'Big Item': 'myUnlab: Lab Record',
    //       Tasks: 'Implement snipping',
    //       Who: 'Prajakta',
    //     },
    //     {
    //       Tasks: 'Implement pdf generation and storage for one TAC',
    //       Who: 'Prajakta',
    //     },
    //     {
    //       Tasks:
    //         'Implement "Download pdf" functionality of downloading and storing a stitched pdf made up of multiple pdfs',
    //       Who: 'Prajakta',
    //     },
    //     {
    //       'Big Item': 'Gupshup Integration',
    //       Tasks:
    //         'Ensure media attached on WhatsApp messages is visible on the Insider app',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       'Big Item':
    //         'UC#11: Ms Anju accesses her Rewards and Points - and redeems the Free gift!',
    //     },
    //     {
    //       Tasks: 'Add reward card and notice board ',
    //       'Planned Effort': '5 Hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Add a hyperlink to Product from the Gift Coupon Card.',
    //     },
    //     {
    //       Tasks: 'Rewards Functionality for teacher corner',
    //       'Planned Effort': '5 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Test and Fix rewards UI flow',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       'Big Item': 'TAC-Sea enhancements',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       'Big Item': 'Teacher Corner: Community',
    //     },
    //     {
    //       'Big Item': 'Teacher Corner: Ask',
    //     },
    //     {
    //       'Big Item': 'Thin LMS - myUnlab',
    //     },
    //     {
    //       'Big Item': 'Thin LMS - Teacher Corner',
    //     },
    //   ],
    //   '28th Sept-2nd Oct': [
    //     {
    //       'Big Item': 'Technical Debt from last week',
    //       Tasks: 'Fix defects',
    //       'Planned Effort': '3 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Fix defects',
    //       'Planned Effort': '3 hours',
    //       Who: 'Shreya',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       'Big Item':
    //         'UC#12: TAC-Sea in Teacher Corner: Ms Anju accesses TAC-sea-> clicks on more TACs - and lands in Teacher Corner.',
    //       Tasks: 'Build TACSea app and host it',
    //       'Planned Effort': '1 Day',
    //       Who: 'Shreya',
    //       'Functionality agreed': 'yes',
    //     },
    //     {
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'yes',
    //     },
    //     {
    //       Tasks: 'Firebase entry for the 28 NCERT TACs: Grade 10',
    //       'Planned Effort': '3 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'yes',
    //       Tested: 'yes',
    //     },
    //     {
    //       Tasks: 'Firebase entry for the 28 NCERT TACs: Grade 9',
    //       'Planned Effort': '30 mins',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'yes',
    //       Comments: 'Waiting on youtube links',
    //     },
    //     {
    //       Tasks: 'Remove dummy "Ask" button and publish',
    //       'Planned Effort': '15 mins',
    //       Who: 'Shreya',
    //       'Functionality agreed': 'yes',
    //       Tested: 'yes',
    //       Done: 'yes',
    //     },
    //     {
    //       Tasks: 'Test, test, test',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       Tasks: 'Tactivity UI -> change to have proper links',
    //     },
    //     {
    //       Tasks: 'TAC - Sea Functionality',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Use Topics for ease of fltering',
    //     },
    //     {
    //       'Big Item': 'TAC-Sea Tactivity UI revamp',
    //       Tasks: 'UI Mockup',
    //       'Planned Effort': '1 day',
    //       Who: 'Shreya/Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Feedback Implementation',
    //       'Planned Effort': '1 hour',
    //       Who: 'Shreya/Jeevan',
    //     },
    //     {
    //       'Big Item': 'Topic Manager',
    //       Tasks:
    //         'Create a cloud function to update topics tags and associations',
    //       'Planned Effort': '2 days',
    //       Who: 'Manzoor',
    //       'Functionality agreed': 'Yes',
    //       Comments: 'Uploaded the Topic-Master for ICSE',
    //       Tested: 'yes',
    //     },
    //     {
    //       'Big Item': 'UC#13: Ms. Anju uses the Community Tab',
    //       Who: 'Shreya',
    //       'Functionality agreed': 'No',
    //     },
    //     {
    //       'Big Item':
    //         'UC#9: Ms. Anju adds a new course to herself using “+” in My Courses tab',
    //       Tasks: 'school, grades can be selected from a drop down',
    //       'Planned Effort': '3 hours',
    //       Who: 'Shreya/Jeevan',
    //       'Functionality agreed': 'Yes',
    //       'Actual Effort': '6 hours',
    //     },
    //     {
    //       'Big Item': 'UC#10: Ms. Anju updates her profile',
    //       Tasks: 'Just the address, phone number',
    //     },
    //     {
    //       Tasks: '-UI',
    //       'Planned Effort': '1 hour',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: '-Functionality',
    //       'Planned Effort': '5 Hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       'Big Item':
    //         'UC#11: Ms Anju accesses her Rewards and Points - and redeems the Free gift!',
    //       Tasks:
    //         'An initial "Marketing Banner" as soon as you login. Useful for both Teacher corner as well as myUnlab',
    //       'Functionality agreed': 'No',
    //     },
    //     {
    //       Tasks: 'Add reward card and notice board ',
    //       'Planned Effort': '5 Hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Add a hyperlink to Product from the Gift Coupon Card.',
    //     },
    //     {
    //       Tasks: 'Rewards Functionality for teacher corner',
    //       'Planned Effort': '5 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Test and Fix rewards UI flow',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       'Big Item': 'UC#14: Ms. Anju edits the Internal Assessment',
    //       Tasks: 'Make the student clickable to see detailed view',
    //       'Planned Effort': '3 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Teacher corner student table UI',
    //       'Planned Effort': '2 hours',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       Tasks: 'Actually read the marks',
    //       'Planned Effort': '1 hours',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       Tasks: 'Store the edited marks',
    //       'Planned Effort': '1 hours',
    //       Who: 'Manzoor',
    //     },
    //   ],
    //   'Lab Record Generation': [
    //     {
    //       'Big Item': 'Lab Record Generation',
    //       Tasks: 'Merging PDF Snipping code and PDF Generator Code',
    //       'Sub Tasks': 'Adding button to open the dialog/modal box.',
    //       Who: 'Prajakta',
    //       'Functionality agreed': 'Yes',
    //       'Actual Effort': 'done',
    //     },
    //     {
    //       'Sub Tasks': 'Passing image from modal to app component',
    //       'Actual Effort': 'done',
    //     },
    //     {
    //       Who: 'Prajakta',
    //     },
    //     {
    //       Who: 'Prajakta',
    //     },
    //     {
    //       Tasks: 'Generating PDF with multiple snipped images',
    //       Who: 'Prajakta',
    //     },
    //     {
    //       Tasks: 'Integration with unlab UI',
    //       Who: 'Prajakta',
    //     },
    //     {
    //       Tasks: 'Storing PDF in firebase',
    //       Who: 'Prajakta',
    //     },
    //     {
    //       Tasks: 'Fetching PDFs from Firebase and merging them (POC)',
    //       Who: 'Prajakta',
    //     },
    //   ],
    //   'Sept 21-26': [
    //     {
    //       'Big Item': 'Technical Debt from last week',
    //       Tasks: 'Jeevan to finish the trigger function',
    //       'Planned Effort': '1 day',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Shreya to finish testing',
    //       'Planned Effort': '30 mins',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       'Big Item': 'Lab Record Generation',
    //       Tasks: 'POC using HTML->PDF',
    //       'Planned Effort': '2 days',
    //       Who: 'Prajakta',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'POC using Firebase->Google Doc -> PDF',
    //       'Planned Effort': '2 days',
    //       Who: 'Prajakta',
    //       'Functionality agreed': 'No',
    //     },
    //     {
    //       Tasks: 'Actual production code',
    //       'Planned Effort': '3 days',
    //       Who: 'Prajakta',
    //       'Functionality agreed': 'No',
    //     },
    //     {
    //       'Big Item': 'UC#6:Show students from ThinkTac Classroom',
    //       Tasks:
    //         'Remove hard coded names and marks - and show studnets from ThinkTac Classroom. Do not show marks',
    //       'Planned Effort': '3 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks:
    //         'Remove hard coded data from Child-details page and only show header-row',
    //       'Planned Effort': '1 hour',
    //       Who: 'Shreya',
    //     },
    //     {
    //       'Big Item': 'UC#10: Ms. Anju updates her profile',
    //       Tasks: 'Just the address, phone number',
    //     },
    //     {
    //       Tasks: '-UI',
    //       'Planned Effort': '1 hour',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: '-Functionality',
    //       'Planned Effort': '5 Hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       'Big Item':
    //         'UC#11: Ms Anju accesses her Rewards and Points - and redeems the Free gift!',
    //       Tasks:
    //         'An initial "Marketing Banner" as soon as you login. Useful for both Teacher corner as well as myUnlab',
    //     },
    //     {
    //       Tasks: 'Add reward card and notice board ',
    //       'Planned Effort': '5 Hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Add a hyperlink to Product from the Gift Coupon Card.',
    //     },
    //     {
    //       Tasks: 'Rewards Functionality for teacher corner',
    //       'Planned Effort': '5 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Test and Fix rewards UI flow',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       'Big Item':
    //         'UC#12: TAC-Sea in Teacher Corner: Ms Anju accesses TAC-sea-> clicks on more TACs - and lands in Teacher Corner.',
    //       Tasks: 'Tactivity UI',
    //       'Planned Effort': '4 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Functionality',
    //       'Planned Effort': '8 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       'Big Item': 'UC#13: Ms. Anju uses the Community Tab',
    //     },
    //     {
    //       'Big Item':
    //         'UC#9: Ms. Anju adds a new course to herself using “+” in profile tab',
    //       Tasks: 'school, grades can be selected from a drop down',
    //     },
    //     {
    //       'Big Item': 'UC#14: Ms. Anju edits the Internal Assessment',
    //       Tasks: 'Make the student clickable to see detailed view',
    //     },
    //     {
    //       Tasks: 'Actually read the marks',
    //     },
    //     {
    //       Tasks: 'Store the edited marks',
    //     },
    //   ],
    //   'August24-August 31': [
    //     {
    //       'Big Item': 'Teacher WhatsApp',
    //       Tasks: 'Dialogflow training',
    //     },
    //     {
    //       Tasks: 'Improve the UI',
    //       'Planned Effort': '3 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       'Big Item': 'BiG query and Data Studio Report',
    //       Tasks: 'Configure and write the query',
    //       'Planned Effort': '15 min',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       Tasks: 'Generate Report',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       'Big Item': 'CBSE Teacher primer',
    //       Tasks: 'Landing page',
    //     },
    //     {
    //       Tasks: 'Everwebinar',
    //     },
    //     {
    //       Tasks: 'Teacher attendance form',
    //     },
    //     {
    //       'Big Item': 'Teacher bulk registration:',
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Wireframe-UI',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Firebase design',
    //       Who: 'Vibhor/Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Use the csv bulk upload',
    //       'Planned Effort': '8 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Fn: Update School Collection',
    //     },
    //     {
    //       Tasks: 'Send email',
    //       'Planned Effort': '4 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       'Big Item': 'Teacher Login',
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       Tasks: 'Low level design',
    //     },
    //     {
    //       Tasks: 'Wireframe UI',
    //     },
    //     {
    //       Tasks: 'fn: Left Nav Bar',
    //     },
    //     {
    //       'Big Item': 'Teacher Training Classroom',
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       Tasks: 'Fn: Show TACTivity content',
    //     },
    //     {
    //       Tasks: 'Fn: Allow submission',
    //     },
    //     {
    //       'Big Item': 'Teacher Classrooms',
    //     },
    //     {
    //       'Big Item': 'Student Lab Record: Make a PDF during export',
    //       Tasks: 'POC: Snip PDF',
    //       'Planned Effort': 'no clue',
    //     },
    //     {
    //       Tasks: 'Generate PDF from fields',
    //       'Planned Effort': 'Design ',
    //     },
    //     {
    //       Tasks: 'Implement snip picture',
    //       'Planned Effort': '1 hours',
    //       Who: 'Manzoor',
    //     },
    //   ],
    //   'Sept7-12': [
    //     {
    //       'Big Item': 'TACquotient Doon school',
    //       Tasks: 'If user not existing, add user',
    //       'Planned Effort': '4 hours',
    //       Who: 'Jeevan',
    //       Demonstrated: 'Yes',
    //       Done: 'Yes',
    //     },
    //     {
    //       Tasks: 'Slight change to Bookwidgets format',
    //       'Planned Effort': '45 Mins',
    //       Who: 'Jeevan',
    //       Demonstrated: 'Yes',
    //       Done: 'Yes',
    //     },
    //     {
    //       Tasks: 'TACCompleteness to be added to evaluation doc',
    //       'Planned Effort': '0',
    //       'Functionality agreed': 'Yes',
    //       Demonstrated: 'Yes',
    //       Done: 'Yes',
    //     },
    //     {
    //       Tasks: 'Test with Grade 8, 9',
    //       'Planned Effort': '2 hours',
    //       Who: 'Jeevan',
    //       Demonstrated: 'Yes',
    //       Done: 'Yes',
    //     },
    //     {
    //       Tasks: 'Create a TACQuotient report',
    //       'Planned Effort': '15 minutes',
    //       Who: 'Vibhor',
    //       Demonstrated: 'No',
    //     },
    //     {
    //       'Big Item': 'Teacher self registration form',
    //       Tasks: 'Make Grade, section, subject come in single row',
    //       'Planned Effort': 'done',
    //       Who: 'Shreya',
    //       Demonstrated: 'Yes',
    //       Done: 'IP',
    //     },
    //     {
    //       Tasks: 'Add delete row',
    //       'Planned Effort': '30 min',
    //       Who: 'Shreya',
    //       Demonstrated: 'Yes',
    //     },
    //     {
    //       Tasks: 'Validation for the fields',
    //       'Planned Effort': '30 min',
    //       Who: 'Shreya',
    //       Demonstrated: 'Yes',
    //       Done: 'IP',
    //     },
    //     {
    //       Tasks: 'Integration with Jeevan and Host and Test',
    //       'Planned Effort': '3 hour',
    //       Who: 'Jeevan, Shreya',
    //     },
    //     {
    //       Tasks: 'Routing to be fixed',
    //       'Planned Effort': 'tricky: 2 hours',
    //       Who: 'Jeevan',
    //       Demonstrated: 'Yes',
    //       Done: 'IP',
    //     },
    //     {
    //       Tasks: 'Making the school searchable: School name',
    //       'Planned Effort': 'done',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //       Demonstrated: 'Yes',
    //       Done: 'Done',
    //     },
    //     {
    //       Tasks: 'Minor updates to Index algo and usage',
    //       'Planned Effort': '1 hour',
    //       Who: 'Jeevan',
    //       Demonstrated: 'Yes',
    //     },
    //     {
    //       Tasks: 'Pre-populating email and name in registration form',
    //       'Planned Effort': '1 hour',
    //       Who: 'Jeevan',
    //       Demonstrated: 'Yes',
    //     },
    //     {
    //       Tasks: 'Make it responsive',
    //       'Planned Effort': '1 hour',
    //       Who: 'Shreya',
    //     },
    //     {
    //       'Big Item': 'Teacher - Corner landing page',
    //       Tasks: 'Skeletal UI',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya',
    //       Demonstrated: 'Yes',
    //     },
    //     {
    //       Tasks:
    //         'On click on Dashboard-> Invoke the dashboard component: Pass classroomID',
    //       'Planned Effort': '4 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'On Click of LMS -> Invoke classroom.google.com',
    //       'Planned Effort': '30 minute',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'In classroom card show School Name',
    //       'Planned Effort': '1 hour',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Firebase design: add school name, change the display name; ',
    //       'Planned Effort': '4 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Integrate and Test the Cards',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya and Jeevan',
    //     },
    //     {
    //       'Big Item': 'Teacher -Corner : Student Import',
    //       Tasks: 'Add tool tab and first tool card for student import',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks:
    //         'Context based drop down - show all courses (grade+subject+section)',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'CSV template download',
    //       'Planned Effort': '2 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'CSV browse and upload',
    //       'Planned Effort': '1 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Firebase: Update Schools and Thinktac classroom collections',
    //       'Planned Effort': '5 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks:
    //         'GC Sync: update joureny docs corresponding with LMS Identifiers',
    //       'Planned Effort': '4 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       'Big Item': 'Teacher-Corner : Class Summary',
    //       Tasks: 'Design the database to store summary Assesments',
    //       'Planned Effort': '5 hours',
    //       Who: 'Jeevan',
    //       Done: 'yes',
    //     },
    //     {
    //       Tasks:
    //         'Modify Thinktac Insider, PDF Analyzer, book widgets code to populate courseData ',
    //       'Planned Effort': '4 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Fn: Cloud trigger function to analyse courseData',
    //       'Planned Effort': '5 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       'Big Item': 'TAC Sea',
    //       Tasks: 'UI ',
    //       'Planned Effort': '6 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Functionality and DB Queries',
    //       'Planned Effort': '5 hours',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       'Big Item': 'Issues',
    //       Tasks: 'email sender id',
    //       'Planned Effort': '-',
    //       Who: 'Jeevan',
    //       Done: 'IP',
    //     },
    //     {
    //       Tasks: 'URL to have ThinkTac',
    //       'Planned Effort': '-',
    //       Who: 'Jeevan',
    //       Done: 'IP',
    //     },
    //     {
    //       Tasks: 'Add logo in School corner',
    //       'Planned Effort': '10 mins',
    //       Who: 'Jeevan',
    //       Done: 'Done',
    //     },
    //     {
    //       Tasks: 'Teacher Name is not coming for email sign-in',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Science -> e is cut on our registration page',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Validations in login form and agree terms checkbox',
    //       'Planned Effort': '1 hour',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Login via link Issue',
    //       'Planned Effort': '30 mins',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Signup Isuue',
    //       'Planned Effort': '30 mins',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       Tasks: 'Hosting the Teacher Assignment App',
    //     },
    //     {
    //       'Big Item': 'Diksha Integration',
    //       Tasks: 'Wireframe UI: Register new + Sign in',
    //     },
    //     {
    //       Tasks: 'Wireframe for Teacher Assignment App',
    //     },
    //     {
    //       Tasks: 'Fn: Upload picture',
    //     },
    //     {
    //       Tasks: 'Fn: Upload Obs sheet',
    //     },
    //     {
    //       Tasks: 'Fn: Conditionally Enable Webinar link',
    //     },
    //     {
    //       Tasks: 'Fn: Webinar link will depend on the TAC',
    //     },
    //     {
    //       'Big Item': 'Teacher WhatsApp',
    //       Tasks: 'Dialogflow training',
    //     },
    //     {
    //       Tasks: 'Improve the UI',
    //       'Planned Effort': 'done',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Default value for "Retail View"',
    //       'Planned Effort': 'done',
    //       Who: 'Shreya',
    //     },
    //     {
    //       'Big Item': 'BiG query and Data Studio Report',
    //       Tasks: 'Configure and write the query',
    //       'Planned Effort': '15 min',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       'Big Item': 'CBSE Teacher primer',
    //       Tasks: 'Landing page',
    //     },
    //     {
    //       Tasks: 'Teacher attendance form',
    //     },
    //     {
    //       'Big Item': 'School-corner',
    //       Tasks: 'Wireframe',
    //       'Planned Effort': 'done',
    //       Who: 'Vibhor',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Wireframe-UI',
    //       'Planned Effort': 'done',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Firebase design',
    //       'Planned Effort': 'done',
    //       Who: 'Vibhor/Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Use the csv bulk upload',
    //       'Planned Effort': 'done',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Fn: Update School Collection',
    //       'Planned Effort': 'done',
    //     },
    //     {
    //       Tasks: 'Send email',
    //       'Planned Effort': 'done',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Integration and Functional testing',
    //       Who: 'Jeevan',
    //     },
    //     {
    //       'Big Item': 'Teacher-Corner',
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       Tasks: 'Retail teacher-handling',
    //     },
    //     {
    //       Tasks: 'Low level design',
    //     },
    //     {
    //       Tasks: 'Wireframe UI',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Teacher Registration Form UI & Validation',
    //       Who: 'Shreya',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Form Fn and Integration with firebase',
    //       'Planned Effort': '5 hrs',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'fn: Left Nav Bar',
    //     },
    //     {
    //       'Big Item': 'Teacher Training Classroom',
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       Tasks: 'Fn: Show TACTivity content',
    //     },
    //     {
    //       Tasks: 'Fn: Allow submission',
    //     },
    //     {
    //       'Big Item': 'Teacher Classrooms',
    //     },
    //     {
    //       'Big Item': 'Student Lab Record: Make a PDF during export',
    //       Tasks: 'POC: Snip PDF',
    //       'Planned Effort': ' 6 hours',
    //       Who: 'Shreya and Prajakta',
    //     },
    //     {
    //       Tasks: 'Implement cropperJS with PDF file',
    //       'Planned Effort': '6 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Generate PDF from fields',
    //       'Planned Effort': 'Design ',
    //     },
    //     {
    //       Tasks: 'Implement snip picture',
    //       'Planned Effort': '1 hours',
    //       Who: 'Manzoor',
    //     },
    //     {
    //       Tasks:
    //         'Implementing and executing npmjs.com/package/image-clipper and npmjs.com/package/angular-screenshot apis',
    //       Who: 'Prajakta',
    //     },
    //     {
    //       'Big Item': 'Integrating Badge and Points',
    //     },
    //   ],
    //   Roles: [
    //     {
    //       'Technical Leader': 'UI Engineer',
    //       Jeevan: 'Shreya',
    //     },
    //     {
    //       'Technical Leader': 'Full stack engineer',
    //       Jeevan: 'Manzoor',
    //     },
    //   ],
    //   'Backlog-August': [
    //     {
    //       'Big Item': 'Testing end to end use case',
    //       Tasks: 'Bookwidgets',
    //       Effort: '2 hours',
    //       Who: 'Manzoor',
    //       'Functionality agreed': 'Yes',
    //       Tested: 'Yes',
    //     },
    //     {
    //       Tasks: 'Google Classroom',
    //       Effort: '4 hours',
    //       Who: 'Manzoor',
    //       'Functionality agreed': 'Yes',
    //       Tested: 'Yes',
    //     },
    //     {
    //       Tasks: 'Observation Sheet',
    //       Effort: '2 hours',
    //       Who: 'Manzoor',
    //       'Functionality agreed': 'Yes',
    //       Tested: 'Yes',
    //     },
    //     {
    //       'Big Item': 'BiG query and Data Studio Report',
    //       Tasks: 'Configure and write the query',
    //       Effort: '15 min',
    //       Who: 'Manzoor',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Generate Report',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       'Big Item': 'School onboarding',
    //       Tasks: 'POC: email authentication',
    //       Effort: '5 hours',
    //       Who: 'Shreya',
    //       'Functionality agreed': 'Yes',
    //       Done: 'Yes',
    //     },
    //     {
    //       Tasks: 'POC: link based authentication',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //       Done: 'Yes',
    //     },
    //     {
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //       'Functionality agreed': 'Yes',
    //       Done: 'Yes',
    //     },
    //     {
    //       Tasks: 'Wireframe-UI',
    //       Effort: '15 min',
    //       Who: 'Manzoor',
    //       'Functionality agreed': 'Yes',
    //       Done: 'Yes',
    //     },
    //     {
    //       Tasks: 'Fn: Csv bulk upload',
    //       Effort: '8 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Fn: emails to be sent',
    //       Effort: '4 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'yes',
    //       References: '/Configuration/SchoolsConfiguration',
    //     },
    //     {
    //       'Big Item': 'Teacher bulk registration:',
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Wireframe-UI',
    //       Effort: '2 hours',
    //       Who: 'Shreya',
    //     },
    //     {
    //       Tasks: 'Firebase design',
    //       Who: 'Vibhor/Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Use the csv bulk upload',
    //       Effort: '8 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       Tasks: 'Send email',
    //       Effort: '4 hours',
    //       Who: 'Jeevan',
    //       'Functionality agreed': 'Yes',
    //     },
    //     {
    //       'Big Item': 'Teacher Login',
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       'Big Item': 'Teacher Training Classroom',
    //       Tasks: 'Wireframe',
    //       Who: 'Vibhor',
    //     },
    //     {
    //       Tasks: 'Fn: Show TACTivity content',
    //     },
    //     {
    //       Tasks: 'Fn: Allow submission',
    //     },
    //     {
    //       'Big Item': 'Teacher GC Overview',
    //     },
    //     {
    //       'Big Item': 'Student Lab Record: Make a PDF during export',
    //       Tasks: 'POC: Snip PDF',
    //       Effort: 'no clue',
    //     },
    //     {
    //       Tasks: 'Generate PDF from fields',
    //       Effort: 'Design ',
    //     },
    //     {
    //       Tasks: 'Implement snip picture',
    //       Effort: '1 hours',
    //       Who: 'Manzoor',
    //     },
    //   ],
    // };
  }

  printPageArea(areaID) {
    var printContent = document.getElementById(areaID).innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }

  getFreezTimeLineData() {
    let season;
    if (this.ngForm.controls['season'].value == "K") {
      season = "Kharif";
    } else {
      season = "Rabi";
    }
    const param = {
      search: {
        year_of_indent: parseInt(this.ngForm.controls['year'].value),
        season_name: season,
        activitie_id: 3
      }
    }
    let route = "freeze-timeline-filter";
    // this.Submit(this.ngForm.value)
    this.masterService.postRequestCreator(route, null, param).subscribe(res => {
      if (res.EncryptedResponse.status_code == 200) {
        this.freezTimeLineData = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      }
      let date = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].end_date;
      let startDate = this.freezTimeLineData && this.freezTimeLineData[0] && this.freezTimeLineData[0].start_date;

      let endDateInput = formatDate(date, 'yyyy-MM-dd', 'en_US')
      let startDateInput = formatDate(startDate, 'yyyy-MM-dd', 'en_US')
      let date1 = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
      if (date) {
        if (startDateInput <= date1 && endDateInput >= date1) {
          // alert('Hii');
          this.freezeTimeLine = true;
        } else {
          // alert('bye');
          this.freezeTimeLine = false;
        }
      }
    });
  }

  async getCropNameList(newValue) {
    if (newValue) {
      const searchFilters = {
        "search": {
          "type": "seed",
          "is_freez": 0,
          "crop_type": newValue,
          "year": this.ngForm.controls["year"].value,
          "season": this.ngForm.controls["season"].value,
        }
      };
      this.breederService.postRequestCreator("get-received-indents-of-breeder-seeds-crop-name", null, searchFilters).subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code && apiResponse.EncryptedResponse.status_code == 200) {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.data && apiResponse.EncryptedResponse.data.data.length > 0) {
            this.cropName = apiResponse.EncryptedResponse.data.data;
            this.cropNameList = apiResponse.EncryptedResponse.data.data;

            this.defaultValue2 = this.cropName[0].crop_code;
            if (this.searchValue) {
              this.ngForm.controls["crop_name"].patchValue(this.cropName[0].crop_code)
            }
            if (this.searchValue) {
              const searchFilters = {
                "year": this.yearOfIndent && this.yearOfIndent[0] && this.yearOfIndent[0].year ? this.yearOfIndent[0].year : '',
                "group_code": this.response_crop_group && this.response_crop_group[0] && this.response_crop_group[0]['m_crop_group.group_code'] ? this.response_crop_group[0]['m_crop_group.group_code'] : '',
                "crop_code": this.cropName && this.cropName[0] && this.cropName[0].crop_code ? this.cropName[0].crop_code : "",
                "season": this.seasonList && this.seasonList[0] && this.seasonList[0].season ? this.seasonList[0].season : ''
              };

              this.submitindentor(1, searchFilters);
            }
          } else {
            this.cropName = []
          }
        } else {
          this.cropName = []
        }
      });
    }
  }

  Submit(formData) {
    if (formData && formData.valid) {
      let cropValueArray = [];
      formData.value.crop_name.forEach(element => {
        cropValueArray.push(element.crop_code);
      });
      const object = {
        "year": Number(formData.value.year),
        "season": formData.value.season,
        "crop_code_array": cropValueArray && cropValueArray.length ? cropValueArray : [],
        "crop_type": formData.value.crop_type,
        'user_type': "seed-division"
      };

      this.selectedYear = parseInt(this.ngForm.controls['year'].value);

      const groupName = this.response_crop_group.filter(x => {
        return x['m_crop_group.group_code'] == this.ngForm.controls['crop_group'].value;
      });
      // this.filterCropGroup = groupName[0].group_name;
      this.filterSeason = formData.value.season

      let displayData = [];
      this.checkFreeze = [];
      this.tableId = []
      this.breederService.postRequestCreator("getUniqueIndentorOfBreederSeeds", null, { 'filters': object }).subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
          this.totalIndentor = data.EncryptedResponse.data.sort((a, b) => a['user.agency_detail.short_name'].toLowerCase() > b['user.agency_detail.short_name'].toLowerCase() ? 1 : -1);
          // this.printPageArea('excel-table')

          this.breederService.postRequestCreator("get-data-for-recieved-indent-second", null, { 'filters': object }).subscribe((data: any) => {
            this.is_search = true;
            if (data && data.EncryptedResponse && data.EncryptedResponse.status_code == 200) {
              this.tempPageData = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
              let items = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
             console.log(items,'items')
              const transformedData = items.map(item => {
                const allEmpty = item.variety.every(varietyItem => varietyItem.line_variety_code === "");
                if (allEmpty) {
                  const mergedBspc = [];
                  item.variety.forEach(varietyItem => {
                    mergedBspc.push(...varietyItem.bspc);
                  });
                  return {
                    ...item,
                    variety: [{
                      line_variety_name: "",
                      line_variety_code: "",
                      bspc: mergedBspc
                    }]
                  };
                } else {
                  return item;
                }
              });
              this.tempPageData = transformedData;
              for (let item of this.totalIndentor) {
                item['short_name'] = item['user.agency_detail.short_name']
              }

              if (this.tempPageData && this.tempPageData.length > 0) {
                this.tempPageData.forEach((el, i) => {
                  el.allData = [];
                  el.allData2 = []
                })
                this.tempPageData.forEach((el, i) => {
                  el.variety.forEach((item, index) => {
                    let shorName = []
                    item.bspc.forEach((val, j) => {
                      shorName.push(val && val.short_name ? val.short_name : '');
                    })
                    shorName = [...new Set(shorName)]
                    el.short_nameArr = shorName;
                  })
                })
                this.tempPageData.forEach((obj1, i) => {
                  obj1.variety.forEach((el, index) => {
                    // if(el.line_variety_code){
                    this.totalIndentor.forEach(obj2 => {
                      if (!el.bspc.some(bspc => bspc.short_name === obj2['user.agency_detail.short_name'])) {
                        el.bspc.push({
                          "indent_quantity": null,
                          "short_name": obj2.short_name,
                          "qty": null,
                          "variety_code_line": null
                        })
                      }
                    })
                    // }

                  })


                });
                // Iterate through array1             
                this.tempPageData.forEach((el, i) => {
                  el.variety.forEach((item) => {
                    if (item && !item.line_variety_code && item.line_variety_code == '') {
                      let sum = 0
                      item.bspc.forEach((val) => {
                        sum += val && val.indent_quantity ? parseFloat(val.indent_quantity) : 0
                        val.total_qty = sum;
                        item.total_qty = sum
                      })
                    } else {
                      let sum = 0
                      item.bspc.forEach((val) => {
                        sum += val && val.qty ? (parseFloat(val.qty)) : 0;
                        val.total_qty = sum;
                        item.total_qty = sum
                      })
                    }

                  })
                });
                this.tempPageData.forEach((el, i) => {
                  el.variety.forEach((item) => {
                    el.allData2.push(...item.bspc)
                    item.bspc = item.bspc.sort((a, b) => a.short_name.localeCompare(b.short_name));
                  })
                });
                this.tempPageData.forEach((el, i) => {
                  el.totalLength = el.allData.length;
                  el.totalLength2 = el.allData2.length;
                })
              }
              console.log(this.tempPageData,'this.tempPageData')
              this.pageData = this.tempPageData;
              let allDataValue = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.allData ? data.EncryptedResponse.data.allData : '';

              if (allDataValue && allDataValue.length > 0) {
                allDataValue.forEach(obj => {
                  this.tableId.push(obj.id)
                  // Check if is_freeze column is 0
                  if (obj.is_freeze === 0) {
                    // Update isFreeze to true
                    this.is_freezeData = true;
                  } else if (obj.is_freeze === 1) {
                    // Update isFreeze to false
                    this.is_freezeData = false;
                  }
                  // Remove the original is_freeze field
                  // delete obj.is_freeze;
                });
                let sumMap = {};
                allDataValue.forEach(item => {
                  if (item.line_variety_code === null || item.line_variety_code === "") {
                    sumMap[item.short_name] = (sumMap[item.short_name] || 0) + item.indent_quantity;
                  } else {
                    sumMap[item.short_name] = (sumMap[item.short_name] || 0) + item.qty;
                  }
                });
                const sumArray2 = Object.entries(sumMap).map(([key, value]) => ({ short_name: key, sum: value }));
                sumArray2.sort((a, b) => a.short_name.localeCompare(b.short_name));                
                this.totalRowofIndentor = sumArray2;
                const totalSum = sumArray2.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.sum), 0);
                this.totalSum = totalSum;
              }

              function splitArrayByCropCode(data, cropCode) {
                return data.filter(item => item.crop_code === cropCode);
              }
              let splitData = {};

              // // Iterate through each object in the data array
              this.pageData.forEach(item => {
                // Extract crop_code
                let cropCode = item.crop_code;
                // Check if cropCode exists in splitData object, if not, create an empty array
                if (!splitData[cropCode]) {
                  splitData[cropCode] = [];
                }
                item.crop_code = cropCode;
                // Push the item into the corresponding cropCode array
                splitData[cropCode].push(item);
              });

              for (let cropCode in splitData) {
                if (splitData.hasOwnProperty(cropCode)) {
                  let cropName = splitData[cropCode][0].crop_name; // Get the crop_name value from the first object of each crop's array
                  splitData[cropCode].forEach(item => {
                    item["crop_name"] = cropName; // Add crop_name key to each object
                  });
                }
              }

              function convertData(originalData) {
                let convertedData = {};

                // Loop through each key in the original data
                for (let key in originalData) {
                  if (originalData.hasOwnProperty(key)) {
                    convertedData[key] = originalData[key].map(item => {
                      let newItem = {
                        variety_name: item.variety_name,
                        not_date: item.not_date,
                        line_variety_name: ""
                      };

                      // Loop through the bspc array to get GJ and WB values
                      item.variety[0].bspc.forEach(entry => {
                        newItem[entry.short_name] = entry.indent_quantity || 0;
                      });

                      return newItem;
                    });
                  }
                }

                return convertedData;
              }
              this.SummaryDetails = convertData(splitData);
              const nestedResult = {};

              this.pageData.forEach(item => {
                const { crop_code, crop_name } = item;
                const key = crop_code + '_' + crop_name;

                if (!nestedResult[crop_code]) {
                  nestedResult[crop_code] = {
                    crop_name: crop_name,
                    crop_code: crop_code,
                    items: [],
                    indentorName: []
                  };
                }

                nestedResult[crop_code].items.push(item);
              });

              const nestedArray = Object.values(nestedResult);
              nestedArray.forEach((el, i) => {
                el['items'].forEach((item, j) => {
                  item.short_nameArr.forEach((val, index) => {
                    el['indentorName'].push(val)
                  });
                  el['indentorName'] = [...new Set(el['indentorName'])]
                  el['indentorName'].sort()
                })
              })

              if (nestedArray && nestedArray.length > 0) {
                nestedArray.forEach(entry => {
                  // Iterate over the 'items' array of each entry
                  entry['items'].forEach(item => {
                    // Filter 'bspc' array based on 'indentorName'
                    item.variety.forEach(varietyItem => {
                      varietyItem.bspc = varietyItem.bspc.filter(bspcItem => entry['indentorName'].includes(bspcItem.short_name));
                    });
                    item.allData2 = item.allData2.filter(allDataItem => entry['indentorName'].includes(allDataItem.short_name));
                  });
                });
              }

              if (allDataValue && allDataValue.length > 0) {
                let sums = {};

                allDataValue.forEach(entry => {
                  let key = entry.crop_code + '-' + entry.short_name;
                  if (sums.hasOwnProperty(key)) {
                    sums[key] += entry && entry.qty ? entry.qty :entry && entry.indent_quantity ? entry.indent_quantity :0;
                  } else {
                    sums[key] = entry && entry.qty ? entry.qty :entry && entry.indent_quantity ? entry.indent_quantity :0;
                  }
                });

                let result = [];

                for (let key in sums) {
                  if (sums.hasOwnProperty(key)) {
                    let [cropCode, shortName] = key.split('-');
                    result.push({
                      crop_code: cropCode,
                      short_name: shortName,
                      sum: sums[key]
                    });
                  }
                }

                if (nestedArray && nestedArray.length > 0) {
                  if (result && result.length > 0) {
                    nestedArray.forEach((items) => {
                      items['totalQty'] = [];

                    })

                    nestedArray.forEach(crop => {                      
                        result.forEach(summary => {
                          if (crop['crop_code'] === summary.crop_code) {
                            crop['totalQty'].push(summary);
                          }
                          crop['totalQty'].sort((a, b) => {
                            let nameA = a.short_name.toUpperCase(); // Convert names to uppercase for case-insensitive comparison
                            let nameB = b.short_name.toUpperCase();                            
                            if (nameA < nameB) {
                                return -1; // Name A comes before name B
                            }
                            if (nameA > nameB) {
                                return 1; // Name A comes after name B
                            }
                            return 0; // Names are equal
                        });                        
                      });
                    });
                    nestedArray.forEach((el)=>{
                      let totalSum=0;
                      el['totalQty'].forEach((item,i)=>{
                        totalSum+=item.sum
                        el['totalSumQty']=totalSum
                      })
                    })
                  }
                }
              }

              this.tableData = nestedArray;
              
            }
          })
        }
      })


    } else {
      Swal.fire('Error', 'Please Select all Fields', 'error');
      return;
    }
  }

  getTotalIndentQuantity() {
    if (this.pageData && this.pageData.length > 0) {
      let quantity = 0;
      this.pageData.forEach(element => {
        quantity += element.total_indent_quantity;
      });

      return quantity;

    } else {
      return 0
    }
  }

  getUnit() {
    const crop_code = this.ngForm.controls['crop_type'].value;

    if (crop_code[0] == 'A') {
      return 'Qt'
    } else {
      return 'Kg'
    }

  }

  cropGroup(data: string) { { } }
  async shortStatename() {
    const route = 'get-state-list';
    const result = await this.breederService.getRequestCreatorNew(route).subscribe((data: any) => {
      this.statename = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';


    })
  }
  async shortIndenterame(searchData: any | undefined = undefined) {
    const route = 'get-short-indenter-name';
    const result = await this.breederService.postRequestCreator(route, null, {
      search: searchData,
      is_freeze: 0,
      icar_freeze: 0
    }).subscribe((data: any) => {
      this.indentername = data && data['EncryptedResponse'] && data['EncryptedResponse'].data ? data['EncryptedResponse'].data : '';
    })
  }

  async submitindentor(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    const route = 'submit-indents-breeder-seeds-list';
    const result = await this.breederService.postRequestCreator(route, null, {
      search: searchData,
      is_freeze: 0,
      type: "seed"
    }).subscribe((apiResponse: any) => {
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.identor = apiResponse.EncryptedResponse.data;
        this.data1 = apiResponse.EncryptedResponse.data;
        if (this.identor.length <= 0) {
          this.noOneRemaining = true;
        } else {
          this.noOneRemaining = false;
        }
        this.custom_array = [];

        // arr = arr.data
        let varietyId = [];
        let is_freeze = [];

        let is_freezeIndenter = [];
        // let units = [];
        for (let value of this.identor) {
          varietyId.push(value && value.m_crop_variety && value.m_crop_variety.variety_name ? value.m_crop_variety.variety_name : '');
          if (value.is_freeze == 0) {
            is_freeze.push(0);
          }
          if (1 || value.user.agency_detail.indent_of_spa.is_freeze == 1) {
            is_freezeIndenter.push(1);
          }
        }
        this.is_freeze = is_freeze;
        this.is_freezeIndenter = is_freezeIndenter;
        varietyId = [...new Set(varietyId)]
        let newObj = [];
        let i = 0;
        for (let value of varietyId) {
          let keyArr = [];
          let unit = [];
          for (let val of this.identor) {
            if (val.m_crop_variety.variety_name == value) {
              let state = val.user.agency_detail.short_name;
              keyArr.push({ "indent_short_name": state, 'value': parseFloat(val.indent_quantity).toFixed(2) });
              // keyArr.push({ state: state });
            }
            if (val.m_crop_variety && val.m_crop_variety.variety_code && (val.m_crop_variety.variety_code).slice(0, 1) == 'A') {
              unit.push('Quintal');
            } else if (val.m_crop_variety && val.m_crop_variety.variety_code && (val.m_crop_variety.variety_code).slice(0, 1) == 'H') {
              unit.push('Kg');
            }
          }
          let variety_id = (value).toString();
          newObj.push({ "variety_id": value, 'data': keyArr, "unit": unit[i] });
          i++;
        }
        this.finalData = newObj;
        this.tableId = [];
        for (let id of this.identor) {
          this.tableId.push(id.id);
        }
        const results = this.identor.filter(element => {
          if (Object.keys(element).length !== 0) {
            return true;
          }
          return false;
        });
        if (this.identor === undefined) {
          this.identor = [];
        }
        // let data =[];
        const removeEmpty = (obj) => {
          Object.entries(obj).forEach(([key, val]) =>
            (val && typeof val === 'object') && removeEmpty(val) ||
            (val === null || val === "") && delete obj[key]
          );
          return obj;
        };
        removeEmpty(this.identor)
        this.filterPaginateSearch.Init(results, this, "getPageData", undefined, apiResponse.EncryptedResponse.data.count);
        // this.initSearchAndPagination();
      }

    });
  }

  freeze() {
    Swal.fire({
      title: 'Are You Sure to Freeze And Send the Indent to ICAR/Nodal Agency?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const searchFilters = {
          "search": {
            "id": this.tableId
          }
        };
        const route = "freeze-indent-breeder-seed-data";
        this.service.postRequestCreator(route, null, searchFilters).subscribe((apiResponse: any) => {
          if (apiResponse && apiResponse.EncryptedResponse && apiResponse.EncryptedResponse.status_code
            && apiResponse.EncryptedResponse.status_code == 200) {
            Swal.fire({
              icon: "success",
              title: "Indented Quantity For " + this.filterCropName + " Has Been Forwarded To Nodal Officer (ICAR).",
              position: "center",
              // width: "10% 10%",
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000
            }).then(x => {
              location.reload();
              document.getElementById('searchData').click();
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

  getSeasonData(value) {
    const route = "get-received-indents-of-breeder-seeds-season";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "type": "seed",
        "is_freeze": 0,
      }
    }
    const result = this.breederService.postRequestCreator(route, null, param).subscribe(data => {
      this.seasonList = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
    })
  }
  getYearOfIndent() {
    const route = "get-received-indents-of-breeder-seeds-year";
    const result = this.breederService.postRequestCreator(route, null, {
      search: {
        "type": "seed",
        "is_freeze": 0,
      }
    }).subscribe(data => {
      this.yearOfIndent = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
      this.yearOfIndent = this.yearOfIndent.sort((a, b) => b.year - a.year)
    })
  }
  getCroupCroupList(value) {
    const route = "get-received-indents-of-breeder-seeds-crop-group";
    const param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "type": "seed",
        "is_freeze": 0,
      }
    }
    const result = this.breederService.postRequestCreator(route, null, param).subscribe((data: any) => {
      this.response_crop_group = data && data.EncryptedResponse && data.EncryptedResponse.data && data.EncryptedResponse.data.data ? data.EncryptedResponse.data.data : '';
      // this.defaultValue1 = this.response_crop_group[0]['m_crop_group.group_code'];
      // this.ngForm.controls["crop_group"].setValue(this.response_crop_group[0]['m_crop_group.group_code'], { emitEvent: false });
      // this.getCropNameList(this.response_crop_group[0]['m_crop_group.group_code'])
    });
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
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'submit-indents-breeder-seeds';
    const element = document.getElementById('excel-tables');
    let countIndenter = this.totalIndentor.length;
    if (countIndenter <= 5) {
      // pageSize = 'a2';
      // customWidth , customHeight
      const options = {
        margin: 10,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 4,
          letterRendering: true,
          useCORS: true
        },
        // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        // jsPDF: {
        //   unit: 'mm',
        //   format: 'a3',
        //   orientation: 'landscape'
        // },
        jsPDF: { unit: 'mm', format: [450, 1600], orientation: 'portrait' }
      };
      html2PDF().set(options).from(element).toPdf().save();
    } else
      if (countIndenter > 5 && countIndenter <= 10) {
        // pageSize = 'a2';
        // customWidth , customHeight
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 4,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [550, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();
      } else if (countIndenter > 10 && countIndenter <= 15) {
        // pageSize = 'a1';
        this.customWidth = 750
        this.customHeight = 600
        alert("sadsd")
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 4,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [750, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();
      } else if (countIndenter > 15 && countIndenter <= 25) {
        // pageSize = 'a0';     
        // this.customWidth = 1400
        // this.customHeight = 600
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 4,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [1200, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();
      } else if (countIndenter > 25 && countIndenter <= 35) {
        // this.customWidth = 1600
        // this.customHeight = 600
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 4,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [1600, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();

      } else {
        // this.customWidth = 2000
        // this.customHeight = 600
        const options = {
          margin: 10,
          filename: `${name}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            dpi: 192,
            scale: 4,
            letterRendering: true,
            useCORS: true
          },
          // jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
          jsPDF: { unit: 'mm', format: [2600, 1600], orientation: 'portrait' }
        };
        html2PDF().set(options).from(element).toPdf().save();

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

  submoitData() {

  }

  clear() {
    this.is_search = false;
    this.ngForm.controls["year"].setValue("");
    this.ngForm.controls["crop_type"].setValue("");
    this.ngForm.controls["season"].setValue("");
    this.ngForm.controls["crop_name"].setValue("");
    this.ngForm.controls['crop_name'].disable();
    this.ngForm.controls['crop_type'].disable();
    this.ngForm.controls['season'].disable();
    this.finalData = [];
  }

  getFixedData(data) {
    let value = data.toString();

    if (value.indexOf(".") == -1) {
      return data;

    } else {

      return data ? Number(data).toFixed(2) : 0;

    }
  }
  getNotificationYear(year) {
    let not_year = year ? year.getYear() : 'Na'
    return not_year ? not_year : 'Na'
  }
  getMergeData(data) {
    const mergedData = {};

    data.forEach(obj => {
      if (!mergedData[obj.variety_code]) {
        mergedData[obj.variety_code] = { ...obj };
        mergedData[obj.variety_code].parental_data = [];
      }

      if (obj.parental_data.length > 0) {
        mergedData[obj.variety_code].parental_data.push(...obj.parental_data);
      }
    });

    const result = Object.values(mergedData);
    return result
  }
  getQty(item) {
  }
  formatNumber(num) {
    // Check if the input is a number
    if (typeof num === 'number' && !isNaN(num)) {
      // If it's a number, use the toFixed() method to format it with 2 decimal places
      return num.toFixed(2);
    } else {
      // If it's not a number, return an error message or handle it as needed
      return 'Invalid input';
    }
  }

  exportToExcel(): void {
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

    const sheet1Data: any[][] = [
      ['Sheet 1 - Row 1', 'Sheet 1 - Row 2', 'Sheet 1 - Row 3'],
      ['Sheet 1 - Row 4', 'Sheet 1 - Row 5', 'Sheet 1 - Row 6']
    ];
  }

  exportToExcel2(item) {
    const element = document.getElementById('excel-table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'exported_data');
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const blob: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }
  exportToExcelData(): void {
    const container = document.getElementById('tableToExport');
    // Get all the tables within the container
    const tables = container.querySelectorAll('table');
    console.log(this.tableData,'tableData')
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    let data = this.ngForm.controls['crop_name'].value;
 //  console.log("bjhbjg",data);
    let cropName=[];
    if(this.tableData && this.tableData.length>0){
      this.tableData.forEach((el)=>{
        cropName.push(el && el.crop_name ? el.crop_name:'')
      })
    }
   // console.log("cropname***********",cropName);
    //cropName.sort();
    for (let i = 0; i < cropName.length; i++) {
      if (cropName[i].length > 30) {
        cropName[i] = cropName[i].substring(0, 30);
      }
  }
    function removeSpecificCharacters(array) {
      for (let i = 0; i < array.length; i++) {
          array[i] = array[i].replace(/[\(\)\/]/g, ''); // Replace '(', ')', and '/'
      }
      return array;
  }
   // console.log("cropName",cropName);
  let cropsWithoutSpecificChars = removeSpecificCharacters(cropName);
    console.log("cropsWithoutSpecificCharsjjj",cropsWithoutSpecificChars);

  let countMap = {};

for (let i = 0; i < cropsWithoutSpecificChars.length; i++) {
    let currentItem = cropsWithoutSpecificChars[i];
    if (countMap[currentItem]) {
        countMap[currentItem]++;
        cropsWithoutSpecificChars[i] = `${currentItem}${countMap[currentItem]}`;
    } else {
        countMap[currentItem] = 1;
    }
}

// console.log(cropsWithoutSpecificChars,'cropsWithoutSpecificChars');
    
    // Iterate over each table and add it to a separate sheet in the workbook
    tables.forEach((table, index) => {
      // Convert the table to a worksheet
      const ws = XLSX.utils.table_to_sheet(table);

      // Add the worksheet to the workbook with a unique sheet name
      XLSX.utils.book_append_sheet(wb, ws, cropsWithoutSpecificChars[index]);
    });

    XLSX.writeFile(wb, 'Received-Indents-of-Breeder-Seed.xlsx');

  }



  groupDataById(data: any[]): { [id: string]: any[] } {
    const groupedData: { [id: string]: any[] } = {};

    data.forEach(item => {
      const id = item.id.toString(); // Convert ID to string
      if (!groupedData[id]) {
        groupedData[id] = [];
      }
      groupedData[id].push({ Name: item.name, Age: item.age }); // Adjust fields according to your data structure
    });

    return groupedData;
  }
  exportToExcel4(event): void {
    // Data from multiple sources
    const sheet1Data: any[][] = [
      ['Header 1', 'Header 2', 'Header 3'],
      [1, 2, 3],
      [4, 5, 6],
      // Add more data as needed
    ];

    const sheet2Data: any[][] = [
      ['Name', 'Age', 'Country'],
      ['John', 30, 'USA'],
      ['Alice', 25, 'Canada'],
      // Add more data as needed
    ];

    // Concatenate data into a single array
    const combinedData: any[][] = [...sheet1Data, [], ...sheet2Data];

    // Create a workbook and add a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(combinedData);
    XLSX.utils.book_append_sheet(wb, ws, 'CombinedSheet');

    // Convert the workbook to a binary string
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the binary string and save it as a file
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = 'combined_data.xlsx';
    this.saveAs(blob, fileName);
  }

  // saveAs(blob: Blob, fileName: string): void {
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }
  mergeExcel(files: FileList): void {
    const workbooks: XLSX.WorkBook[] = [];

    // Function to read each file and extract its data
    const readFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        workbooks.push(workbook);
      };
      reader.readAsArrayBuffer(file);
    };

    // Read each file
    for (let i = 0; i < files.length; i++) {
      readFile(files[i]);
    }

    // Merge workbooks
    const mergedWorkbook = XLSX.utils.book_new();
    workbooks.forEach(workbook => {
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        XLSX.utils.book_append_sheet(mergedWorkbook, worksheet, sheetName);
      });
    });

    // Convert merged workbook to a binary string
    const wbout: ArrayBuffer = XLSX.write(mergedWorkbook, { bookType: 'xlsx', type: 'array' });

    // Save merged workbook as a file
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = 'merged_file.xlsx';
    this.saveAs(blob, fileName);
  }

  saveAs(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

convertToDecmial(item){
  if(item){
    item= item + '.00';
    
    return item;
  }
}
}
