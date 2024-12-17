import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  ngForm!: FormGroup;
 

  constructor(private fb: FormBuilder,) { 
    this.createEnrollForm();
  }

  createEnrollForm() {
    this.ngForm = this.fb.group({

      pureSeed : [],
    
      
      // category_breeder: ['', Validators.required],
     
    },
    );


  }

  ngOnInit(): void {
  }



  cardData: any = [
    {id: 1, pureSeed: 'Wheat', crop: "New Crop1", inertMatter: "Demo 1" ,Variety:"HSB 73" , germination:"NaN", lableNo: "completed", oilContent:"HSGV2", lotNo: "12526", producingInstitution:"prodiction1",dateOftest : "23-04-2-23", issuingAuthorityname: "NaN", designation:"Admin" },
    {id: 2, pureSeed: 'Rice', crop: "New Crop2", inertMatter: "Demo 2" ,Variety:"H0126" , germination:"NaN", lableNo: "completed", oilContent:"HSGV2", lotNo: "12526", producingInstitution:"prodiction1",dateOftest : "23-04-2-23", issuingAuthorityname: "NaN", designation:"Admin" },
    {id: 3, pureSeed: 'Bajara', crop: "New Crop", inertMatter: "Demo 3" ,Variety:"HSB 15" , germination:"NaN", lableNo: "completed", oilContent:"HSGV2", lotNo: "12526", producingInstitution:"prodiction1",dateOftest : "23-04-2-23", issuingAuthorityname: "NaN", designation:"Admin" },
    {id: 4, pureSeed: 'Wheat', crop: "New Crop2", inertMatter: "Demo 1" ,Variety:"H0113" , germination:"NaN", lableNo: "completed", oilContent:"HSGV2", lotNo: "12526", producingInstitution:"prodiction1",dateOftest : "23-04-2-23", issuingAuthorityname: "NaN", designation:"Admin" },
    {id: 5, pureSeed: 'Sarson', crop: "New Crop4", inertMatter: "Demo 2" ,Variety:"HSB 71" , germination:"NaN", lableNo: "completed", oilContent:"HSGV2", lotNo: "12526", producingInstitution:"prodiction1",dateOftest : "23-04-2-23", issuingAuthorityname: "NaN", designation:"Admin" },
  ] ;







}
