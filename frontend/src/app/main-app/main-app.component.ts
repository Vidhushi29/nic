import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent implements OnInit {
  title = 'Seeds';
  footerUrl = '';
  footerLink = '';
  showSidebar: boolean = true;
  isOpen: boolean = true;
  isClose: boolean = false;
  url: any;
  constructor(  
  ) {
    let urltemp = window.location.href.split("/");
    let lastElement = urltemp[urltemp.length - 1]
    this.url = lastElement;
   }

  ngOnInit() {
  }

  hideShow(){
    this.showSidebar = !this.showSidebar
  }  
  openNav(){
    document.getElementById("toggleMenu").style.width = "315px";
    this.isOpen = false;
    this.isClose = true;
  }

  closeNav(){
    document.getElementById("toggleMenu").style.width = "100px";
    this.isOpen = true;
    this.isClose = false;
  }
}
