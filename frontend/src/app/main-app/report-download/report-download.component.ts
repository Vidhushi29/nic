import { Component, OnInit } from '@angular/core';
import * as html2PDF from 'html2pdf.js';
import { BreederService } from 'src/app/services/breeder/breeder.service';
@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css']
})
export class ReportDownloadComponent implements OnInit {
bsp3:any=[
  {
    variety_name:'pusa 2000',
    area_under_variety:'2.00',
    field_location:null,
    report_for_monitoring_team:'Satisfactory',
    no_of_samples:5,
    authority:'seed'
  },
  {
    variety_name:'pusa 2001',
    area_under_variety:'2.00',
    field_location:null,
    report_for_monitoring_team:'Satisfactory',
    no_of_samples:5,
    authority:'seed'
  },
 
]
bsp1:any=[
  {
    variety_name:'pusa 2000',
    area_under_variety:'2.00',
    field_location:null,
    report_for_monitoring_team:'Satisfactory',
    no_of_samples:5,
    authority:'seed'
  },
  {
    variety_name:'bsp 2001',
    area_under_variety:'2.00',
    field_location:null,
    report_for_monitoring_team:'Satisfactory',
    no_of_samples:5,
    authority:'seed'
  },
 
]
tableArray=[]
  constructor(private breederService:BreederService) { }

  ngOnInit(): void {

    this.tableArray.push(this.bsp3,this.bsp1)
    console.log(this.tableArray,'tableArray')
  }
  downloads() {

    const name = 'report';
    const element = document.getElementById('content');
    const options = {
      filename: `${name}.pdf`,
      // margin: [10, 3, 0, 0], //top, left, buttom, right,
      // filename: 'my_file.pdf',
      margin:       [30, 0, 10, 0],
      // image: { type: 'jpeg', quality: 1 },
      image:        { type: 'jpeg', quality: 0.98,crossorigin:"*" ,width:'50px'},
      
      // html2canvas: {dpi: 192, scale: 2, letterRendering: true},
      // pagebreak: {mode: 'avoid-all'},
      letterRendering: true,
      pagebreak: { after: ['#tableContent'], avoid: 'img' },
      // pageBreak: { mode: 'css', after:'.break-page'},
      // pagebreak: { mode: '', before: '#page2el' },
      // pagebreak: { mode: ['avoid-all', '*', 'legacy'] },

      // jsPDF: {unit: 'pt', format: 'a4', orientation: 'portrait'},
      html2canvas: {
        dpi: 300,
        // scale: 1,
        letterRendering: true,
        // useCORS: true,

      },
      // jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
      // jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2PDF().from(element).outputPdf().then(function(pdf) {
      // This logs the right base64
      console.log(btoa(pdf),'bto');
  });
  // html2PDF().set({
  //   pagebreak: { after: ['#tableContent'], avoid: 'img' }
  // }).from(element).toPdf.save();
  
  
    html2PDF().set(options).from(element).toPdf().save();
  }
  download(){
    this.breederService.getRequestCreatorNew('download-pdf').subscribe(data=>{
      console.log(data)
    })
    // this.download-pdf
  }
}
