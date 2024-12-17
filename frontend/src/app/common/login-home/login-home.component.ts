import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.css']
})
export class LoginHomeComponent implements OnInit {

  constructor(
    private route:Router,
    private activateRute:ActivatedRoute
  ) {
   }

  ngOnInit(): void {
  }
  redirecion(url){
    this.route.navigateByUrl(url);
  }
}
