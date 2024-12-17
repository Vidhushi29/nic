import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-form-nucleus-seed-availability-by-breeder',
  templateUrl: './add-form-nucleus-seed-availability-by-breeder.component.html',
  styleUrls: ['./add-form-nucleus-seed-availability-by-breeder.component.css']
})
export class AddFormNucleusSeedAvailabilityByBreederComponent implements OnInit {

  form!: FormGroup;
  submitted= false;
  ngForm!: FormGroup;
  

  constructor(private fb: FormBuilder) {  this.createEnrollForm();}
  createEnrollForm() {
    this.ngForm = this.fb.group({
      crop_group: new FormControl('',[Validators.required]),
      season: new FormControl('', Validators.required),
      crop_name: new FormControl('', Validators.required),
      botanical_name: new FormControl('', Validators.required),
      seed_ratio: new FormControl('', Validators.required),
      
    });
  }
  
  ngOnInit(): void {
  }
  notified(item:any){

  }
  selectType(value:any){

  }
  developedBy(item:any){

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  // get enrollFormControl(): { [key: string]: AbstractControl } {
  //   return this.enrollFormGroup.controls;
  // }

  enrollFormSave(){
   
    this.submitted = true;
  }
  onSubmit(){
    

  }

}
