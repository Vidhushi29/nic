import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master/master.service';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-got-monitoring-team-details',
  templateUrl: './got-monitoring-team-details.component.html',
  styleUrls: ['./got-monitoring-team-details.component.css']
})
export class GotMonitoringTeamDetailsComponent implements OnInit {
  ngForm: any;
  isSearch: boolean;
  is_update= false;
  searchClicked: boolean;
  showTab: boolean;
  submitted: any;
  designationName:any
  FormArray: FormGroup<any>;
  rowOptions: Array<{ name: string , userdesignation:string }> = [];  // Dropdown options
  isTeamSelected= false;
  selectCrop: any;
  monitoringTeamList: any;
  testNumberList: any;
  yearOfIndent:any;
  seasonlist: any;
  cropList: any;
  cropListSecond: any;
  designationList:any;
  selectDestination:any;
  previousTestNumber = '';

  dropdownSettings = {
    idField: 'test_number',
    textField: 'test_number',
    enableCheckAll: true,
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
    itemsShowLimit: 1,
    limitSelection: -1,
  };
  JSON: any;
  deginationValueSecond: any;
  deginationValuename: any;
  user_id: any;

  constructor(private fb: FormBuilder, private master: MasterService, private _productionCenter: ProductioncenterService) {
    this.createForm();
  }

  ngOnInit(): void {
    const user = localStorage.getItem('BHTCurrentUser');
    const user_data = JSON.parse(user);
    this.user_id = user_data.id;
    this.getYear();
  }

  createForm() {
    this.ngForm = this.fb.group({
      year: [''],
      season: [''],
      cropName: new FormControl(''),
      crop_text: new FormControl(''),
      crop_code: new FormControl(''),
      selectedTeam: ['', Validators.required],
      userforInspection: ['', Validators.required],
      selectedTest: new FormControl('',Validators.required),
      rows: this.fb.array([this.createRow()]),
    });

    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop_text'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.isSearch = false;
        this.getSeason();
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop_text'].disable();
        this.selectCrop = "";
        this.isTeamSelected = false;
        this.cancel();
      }
    })
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.ngForm.controls['crop_text'].enable();
        this.selectCrop = '';
        this.getCrop();
        this.isSearch = false;
        this.isTeamSelected = false;
        this.cancel();
      }
    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.searchClicked = false;
        this.cropList = this.cropListSecond;
        let response = this.cropList.filter(x => x.crop_name.toLowerCase().includes(newValue.toLowerCase()));
        this.cropList = response;
      }
      else {
        this.cropList = this.cropListSecond;
      }
    });

    this.ngForm.controls['selectedTeam'].valueChanges.subscribe(async newValue => {
      if (newValue) {
        this.isTeamSelected = true;
        if(newValue == 'new team'){
          this.rows.clear();
          this.addFirstRow();
          const formArray = this.ngForm.get('rows') as FormArray;
          const control = formArray.controls[0]?.['controls']?.designation_id; 
       
          if (control) {
            control.patchValue(this.designationList);
            formArray.controls.forEach(control => {
              control.enable();  // Enable all controls
            });
            control.designationList = [...this.designationList];
            control.designationListSecond = [...this.designationList];
          }
        } else {
        const teamData = this.monitoringTeamList.find(team => team.got_monitoring_team_id == newValue);
        if (teamData) {
          this.patchData(teamData);
  
          // After patching data, disable the entire FormArray
          const formArray = this.ngForm.get('rows') as FormArray;
            console.log(formArray,"formArray**********");
          // Loop through each control in the FormArray and disable them
          // formArray.controls.forEach(control => {
          //   control.disable();  // Disable all controls
          // });
        }
        }
      }
    });
  }

  createRow(): FormGroup {
    const row = this.fb.group({
      designation_id: [''],
      designation_text:[''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      mobile: ['', [Validators.required, (Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/))]],
      email: ['', [Validators.required, (Validators.pattern(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/))]],
      designation: ['', Validators.required],
    });
    row.get('name')?.valueChanges.subscribe(() => {
      setTimeout(() => this.updateDropdownOptions(), 0);
    });
      return row;
  }
  
  get rows(): FormArray {
    return this.ngForm.get('rows') as FormArray;
  }

  getYear() {
  let route = "get-got-monitoring-team-year";
  let param = {
  }
  this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
    if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
      this.yearOfIndent = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
    } else {
      this.yearOfIndent = [];
    }
  });  
  }

  getSeason() {
  let route = "get-got-monitoring-team-season";
  let param = {
      "year": this.ngForm.controls['year'].value,
  }
  this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
    if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
      this.seasonlist = res.EncryptedResponse.data.map(seasonData => {
        return {
          season: seasonData.season,
          seasonName: seasonData.season === 'R' ? 'Rabi' : seasonData.season === 'K' ? 'Kharif' : seasonData.season
        };
      });
    } else {
      this.seasonlist= [];
    }
  });
  }

  getCrop() {
    let route = "get-got-monitoring-team-crop";
    let param = {
        "year": this.ngForm.controls['year'].value,
        "season": this.ngForm.controls['season'].value,
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.cropList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
        this.cropListSecond = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : [];
      } else {
        this.cropList= [];
        this.cropListSecond= [];
      }
    });
  }

  cgClick() {
    document.getElementById('crop_group').click();
  }

  cropNameValue(item: any) {
    this.selectCrop = item.crop_name;
    this.ngForm.controls["crop_text"].setValue("");
    this.ngForm.controls['crop_code'].setValue(item.crop_code);
    // this.ngForm.controls['consignment'].setValue('');
    this.searchClicked = false;
    this.cancel();
    this.isTeamSelected = false;
  }

  cropdatatext() {
    this.cropListSecond;
  }

  patchData(data: any) {
    console.log("data", data);
    const teamLead = data && data.members.find((member: any) => member.is_team_lead == true);
    console.log("teamLead=====",teamLead.name);
    console.log("this.rowOptions=====",this.rowOptions);
    setTimeout(() => {
      this.ngForm.patchValue(
        {
          selectedTeam: data.got_monitoring_team_id,
          userforInspection: teamLead && teamLead.name,
        },
        { emitEvent: false }
      );
    }, 500);
    this.rows.clear();
    data.members.forEach((member: any, index: number) => {
      const row = this.createRow();
      row.patchValue({
        name: member.name,
        mobile: member.mobile_number,
        email: member.email_id,
        designation: member.designation_id,
      });
      this.updateDropdownOptions();
      setTimeout(() => {
        const formArray = this.ngForm.get('rows') as FormArray;
        const control = formArray.controls[index]?.get('designation_id');
        if (control) {
          control['designationList'] = [...this.designationList];
          control['designationListSecond'] = [...this.designationList];
          const currentDesignation = this.designationList.find(
            (item) => item.designation_id === member.designation_id
          );
          row.patchValue({
            designation: currentDesignation || null,
          });
        }
      }, 500);
      this.rows.push(row);
    });
      setTimeout(() => this.updateDropdownOptions(), 600);
  }

  toggleSearch() {
    if (!this.ngForm.controls['year'].value || !this.ngForm.controls['season'].value || !this.ngForm.controls['crop_code'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    this.searchClicked = true;
    this.getMonitoringTeamList();
    this.getTestNumberForTable();
    // this.addRow(0);
    this.getDesignation(0);
    this.rows.clear();
    this.ngForm.controls['selectedTeam'].setValue('',{ emitEvent: false });
    this.isTeamSelected = false;  
  }

  getDesignation(i: any) {
    const route = "get-got-monitoring-team-designation";
    const param = {};
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.designationList = res.EncryptedResponse.data || [];
      } else {
        this.designationList = [];
      }
    });
  }

  save() {
    const formArray = this.ngForm.get('rows').value as FormArray;
    console.log(formArray);
    this.submitted = true;
    if (!this.ngForm.valid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
       let route = 'save-monitoring-team';
       const param = this.transformDataForSave(this.ngForm.value);
       if (param) {
        this._productionCenter.postRequestCreator(route, param, null).subscribe((res) => {
            if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
              const id = res.EncryptedResponse.data.id;
             const gotTestNumbers = JSON.parse(res.EncryptedResponse.data.got_test_number);
              const dataSet= {
                gotMonTeamId : res.EncryptedResponse.data['id'],
                testNumbers:JSON.parse(res.EncryptedResponse.data.got_test_number)
                }
                let route = 'get-got-user-team-data';
                const param = dataSet
                if (param) {
                   this._productionCenter.postRequestCreator(route, param, null).subscribe((res) => {
                    if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
                        console.log(res.EncryptedResponse.status_code,"88888888888888");
                    }
                 })
                } Swal.fire({
                title: 'Success!',
                text: res.EncryptedResponse.message,
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  this.getMonitoringTeamList();
                  this.getTestNumberForTable();
                  this.cancel();
                }
              });
            } else {
              Swal.fire({
                title: `<p style="font-size:25px;">${res.EncryptedResponse.message}</p>`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#E97E15',
              });
            }
          });
        }
       }
    });
  }

  updateMonitoringTeam() {
    this.submitted = true;
    const param = this.transformDataForSave(this.ngForm.value);
    if (!this.ngForm.valid) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select All Required Fields.</p>',
        icon: 'warning',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
       let route = 'update-monitoring-team';
       const param = this.transformDataForSave(this.ngForm.value);
       if (param) {
        this._productionCenter.postRequestCreator(route, param, null).subscribe((res) => {
            if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
                let route = 'get-got-user-team-data';
                const param = {
                  gotMonTeamId : res.EncryptedResponse.data['got_monitoring_team_id'],
                  // testNumbers:JSON.parse(res.EncryptedResponse.data.test_number)
                  testNumbers: [res.EncryptedResponse.data['test_number']]
                  }
                if (param) {
                   this._productionCenter.postRequestCreator(route, param, null).subscribe((res) => {
                    if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
                        console.log(res.EncryptedResponse.status_code,"88888888888888");
                    }
                 })
                } Swal.fire({
                title: 'Success!',
                text: res.EncryptedResponse.message,
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  this.getMonitoringTeamList();
                  this.cancel();
                }
              });
            } else {
              Swal.fire({
                title: `<p style="font-size:25px;">${res.EncryptedResponse.message}</p>`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#E97E15',
              });
            }
          });
        }
       }
    });
  }

  transformDataForSave(formData: any) {
    const userforInspection = formData && formData.userforInspection || '';
    const userNameinspaction = userforInspection.split(',')[0].trim();
    
    const names = formData.rows.map((row: any) => row.name);
    const team = this.monitoringTeamList.find(team => team.got_monitoring_team_id == formData && formData.selectedTeam);
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      Swal.fire({
        title: 'Error',
        text: `Duplicate team name found: ${duplicateNames.join(', ')}`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });
      return null;
    }
    return {
      team_name: userNameinspaction,
      is_active: 1,
      got_test_number:  formData && formData.selectedTest|| [], 
      previous_got_test_number: this.previousTestNumber,
      members: formData.rows.map((row: any) => ({
        name: row.name,
        designation_id: row && row.designation && row.designation.designation_id ,
        mobile_number: row.mobile,
        email_id: row.email,
        pin_code: this.generateNumber(),
        is_team_lead: row.name == userNameinspaction ? 1 : 0
      }))
    };
  }
  
  cancel() {
    this.submitted = false;
    this.isTeamSelected = false;
    this.is_update = false;
    this.rows.clear();
    this.ngForm.controls['selectedTeam'].setValue('',{ emitEvent: false });
    this.ngForm.controls['userforInspection'].setValue('');
    this.ngForm.controls['selectedTest'].setValue('');
    this.getTestNumberForTable();
  }

  getMonitoringTeamList() {
    let route = "get-monitoring-team-list";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "user_id": this.user_id
    }
     this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.monitoringTeamList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
        // console.log(this.monitoringTeamList.got_test_number,"ytureyiu")
      } else {
        this.monitoringTeamList = [];
      }
    });  
  }

  

  getFinancialYear(year:any) {
    let arr = []
    arr.push(String(parseInt(year)))
    let last2Str = String(parseInt(year)).slice(-2)
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew)
    return arr.join("-");
  }

  editMember(teamData: any): void {
    this.is_update = true;
    this.isTeamSelected = true;
    this.previousTestNumber = teamData.got_test_number;
    this.patchData(teamData);
    const testNumbers = teamData.got_test_number ? JSON.parse(teamData.got_test_number) : [];
    this.getTestNumberForTable(true,teamData.got_test_number);
    this.ngForm.patchValue({selectedTest: testNumbers, });
  }

  deleteMember(got_monitoring_team_id: number) {
      let route = "delete-monitoring-team";
      let param = {
        "got_monitoring_team_id": got_monitoring_team_id
      }
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Accept!',
        cancelButtonText: 'No, cancel',
      }).then((result) => { 
        if (result.isConfirmed) {   
      this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
       if ( res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        Swal.fire({
          title: 'Success!',
          text: res.EncryptedResponse.message,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.getTestNumberForTable();
            this.getMonitoringTeamList();
          }
        });
      } else {
        Swal.fire({
          title: `<p style="font-size:25px;">${res.EncryptedResponse.message}</p>`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15',
        });
      }
    });
   }
  });
  }

  addFirstRow() {
    this.rows.push(this.createRow());
    this.updateDropdownOptions();
  }

  addRow(i) {  
    const lastRowIndex = this.rows.length - 1;
    if (this.rows.length > 0 && this.rows.at(lastRowIndex).valid || this.rows.length === 0) {
      const row = this.createRow();
      this.rows.push(row);
      const formArray = this.ngForm.get('rows') as FormArray;
      const control = formArray.controls[i+1]?.['controls']?.designation_id;
      if (control) {
        control.patchValue(this.designationList);
        control.designationList = [...this.designationList];
        control.designationListSecond = [...this.designationList];
      }
      this.updateDropdownOptions();
    } else {
      alert('Please fill out the current row before adding a new one.');
    }
  }

  designation(data, index, $event) {
    this.ngForm.controls['rows']['controls'][index].controls['designation'].setValue(data);
    this.updateDropdownOptions();
  }

  removeRow(index: number) {
   if (this.rows.length > 1) {
    this.rows.removeAt(index);
    this.updateDropdownOptions();
   }
  }

  updateDropdownOptions() {
    this.rowOptions = this.rows.value
      .filter(row => row.name && row.name.trim() !== '')
      .map(row => ({
        name: row.name,
        userdesignation: row.designation?.designation_name || "No Designation"
      }));
  //  this.rowOptions = this.rows.value
  //   .filter(row => row.name && row.name.trim() !== '')
  //   .map(row => ({ name: row.name })); 
  }
  
  getTestNumberForTable(isEdit: boolean = false,test_number: string = '') {
    let route = "get-got-monitoring-team-test-number";
    let param = {
      "year": this.ngForm.controls['year'].value,
      "season": this.ngForm.controls['season'].value,
      "crop_code": this.ngForm.controls['crop_code'].value,
      "isEdit": isEdit,
      "test_number": test_number
    }
    this._productionCenter.postRequestCreator(route, param, null).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.testNumberList = res && res.EncryptedResponse && res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      } else {
        this.testNumberList = [];
      }
    });  
  }

  generateNumber() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const length = 8;
    const randomString = Array.from({ length }, () => {
      return Math.random() < 0.5
        ? letters.charAt(Math.floor(Math.random() * letters.length))
        : numbers.charAt(Math.floor(Math.random() * numbers.length));
    }).join('');
    return randomString;
  }

  filterDesignationName(e: string, i: number) {
    const designationControl = this.ngForm.controls['rows']['controls'][i]?.controls?.designation_id;
    if (!designationControl) return;

    if (e) {
      // Reset to the original list first
      designationControl.designationList = designationControl.designationListSecond;

      // Filter based on the input if designationListSecond is populated
      if (designationControl.designationListSecond?.length > 0) {
        designationControl.designationList = designationControl.designationListSecond.filter(item =>
          item.designation_name.toLowerCase().includes(e.toLowerCase())
        );
      }
    } else {
      // When input is cleared, reset designation list
      this.getDesignation(i);
    }
  }
  
  cdestinationClick(i: number) {
    const dropdownButton = document.getElementById('destination' + i);
    if (dropdownButton) {
      dropdownButton.click();
    }
  }
  
  parseTestNames(gotTestNumber: string | any[]): string {
    if (typeof gotTestNumber === 'string') {
      try {
        const parsedData = JSON.parse(gotTestNumber);
        return Array.isArray(parsedData) ? parsedData.join(', ') : 'NA';
      } catch (error) {
        console.error('Invalid JSON format:', error);
        return 'NA';
      }
    } else if (Array.isArray(gotTestNumber)) {
      return gotTestNumber.join(', ');
    }
    return 'NA';
  }
}
