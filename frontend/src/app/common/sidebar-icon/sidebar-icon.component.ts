import { Component, OnInit } from '@angular/core';
import { LoggedInUserInfoService } from 'src/app/services/logged-in-user-info.service';
import { MasterService } from 'src/app/services/master/master.service';

@Component({
  selector: 'app-sidebar-icon',
  templateUrl: './sidebar-icon.component.html',
  styleUrls: ['./sidebar-icon.component.css']
})
export class SidebarIconComponent implements OnInit {

  enabledRoleMenu: any = {};
  userName;
  constructor(loggedInUserInfoService: LoggedInUserInfoService,private masterService:MasterService,) {
    this.enabledRoleMenu = loggedInUserInfoService.getMenuAsPerRole();
  }

  ngOnInit(): void {
     this.initProcess()
  }
  async initProcess(){
    this.getAgencyData()
  }
  getAgencyData(){
    const data= localStorage.getItem('BHTCurrentUser')
    let userData= JSON.parse(data)
    this.masterService.postRequestCreator('getAgencyUserDataById/'+userData.agency_id).subscribe(data=>{
      let apiResponse = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data :''
      if(apiResponse.agency_name)
        this.userName = apiResponse.agency_name.charAt(0).toUpperCase() +  apiResponse.agency_name.slice(1);
    })
  }

}
