import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedInUserInfoService } from 'src/app/services/logged-in-user-info.service';

@Component({
  selector: 'app-menu-ui[menuList]',
  templateUrl: './menu-ui.component.html',
  styleUrls: ['./menu-ui.component.css']
})
export class MenuUiComponent implements OnInit {

  @Input() menuList: {
    name: string,
    href: string,
    subMenus: any,
    active: boolean,
    icon: any
  }[] = [];

  activeLink: string[];
  url: string;
  changePassword: any;
  constructor(private loggedInUserInfoService: LoggedInUserInfoService,
    private sanitizer: DomSanitizer,
    private router: Router) {
      
    // let urltemp = window.location.href.split("/");
    // let lastElement = urltemp[urltemp.length - 1]
    // this.url = lastElement;
    // console.log('url==============',this.url);
    // this.router.events.subscribe((val) => {
    //   this.activeLink = this.router.url.split('/')
    //   console.log('active=====link',this.activeLink);
    // })
  }

  ngOnInit(): void {
    this.addTogglePropertyToMenuList(this.menuList);
    let data = localStorage.getItem('BHTCurrentUser')
      let localData = JSON.parse(data)
      this.changePassword=localData.is_change_password
  }
  addTogglePropertyToMenuList(menuList: any) {
    menuList.forEach(element => {
      if (element.subMenus && element.subMenus.length > 0) {
        if (element["toggled"] === undefined) {
          element["toggled"] = false;
        }
        this.addTogglePropertyToMenuList(element.subMenus);
      }
    });
  }

  sanitizeUrl(anyURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(anyURL);

  }

  activateMenu(menu) {
    this.deactivateAllMenu(this.menuList);
    menu.active = true;
  }

  deactivateAllMenu(menu) {
    menu.forEach(element => {
      element.active = false;
      if (element.subMenus && element.subMenus.length > 0) {
        this.deactivateAllMenu(element.subMenus);
      }
    });
  }
}
