import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trace-tag',
  templateUrl: './trace-tag.component.html',
  styleUrls: ['./trace-tag.component.css']
})
export class TraceTagComponent implements OnInit {
  tag: any
  constructor(private route: ActivatedRoute) {
    console.log('Called Constructor');
    this.route.queryParams.subscribe(params => {
        this.tag = params['tagNo'];
        // this.param2 = params['param2'];
    });
}

  ngOnInit(): void {
    console.log("this.tag", this.tag)
  
    window.location.href = 'https://seedtrace.gov.in/ms014/tracetagMH?tagNo='+this.tag

  }

}
