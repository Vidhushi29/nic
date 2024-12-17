import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-app',
  templateUrl: './mobile-app.component.html',
  styleUrls: ['./mobile-app.component.css']
})
export class MobileAppComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href = 'https://seedtrace.gov.in/ms014/bspcInspection/#!/inspection'

  }

}
