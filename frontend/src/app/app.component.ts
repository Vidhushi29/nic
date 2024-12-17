import { Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoggedInUserInfoService } from './services/logged-in-user-info.service';
import {
  NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  ActivatedRoute
} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Seeds';
  footerUrl = '';
  footerLink = '';
  showSidebar: boolean = false;
  url: any;
  
  


  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private loggedInUserInfoService: LoggedInUserInfoService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {

    let urltemp = window.location.href.split("/");
    let lastElement = urltemp[urltemp.length - 1]
    this.url = lastElement;

    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    })
  }
  
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationEnd) {
      let enabledRoleMenu = this.loggedInUserInfoService.getMenuAsPerRole();
      let currentURL = event['url'].toLowerCase();
      if (currentURL.indexOf("/") == 0) {
        currentURL = currentURL.replace("/", "");
      }
      this.checkIfActive(enabledRoleMenu.menus, currentURL);
    }
  }

  checkIfActive(enabledRoleMenu: any, currentURL: string): boolean {
    let ifAnyChildMenuActive = false;
    for (let menuIndex = 0; menuIndex < enabledRoleMenu.length; menuIndex++) {
      const menu = enabledRoleMenu[menuIndex];
      menu["active"] = false;

      let menuHref = menu.href.toLowerCase();
      if (menuHref.indexOf("/") == 0) {
        menuHref = menuHref.replace("/", "");
      }
      if (currentURL == menuHref) {
        ifAnyChildMenuActive = true;
        menu["active"] = true;
        break;
      }
      else if (menu.subMenus && menu.subMenus.length > 0) {
        ifAnyChildMenuActive = menu["active"] = this.checkIfActive(menu.subMenus, currentURL);
      }
    }
    return ifAnyChildMenuActive;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const navMain = document.getElementById('navbarCollapse');
      if (navMain) {
        navMain.onclick = function onClick() {
          if (navMain) {
            navMain.classList.remove("show");
          }
        }
      }
    }
  
  }
  
}