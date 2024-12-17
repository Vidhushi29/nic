import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate2'
})
export class CustomDatePipe2 implements PipeTransform {
  transform(value: any): any {
    const datePipe: DatePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'dd-MM-yyyy');
  }
}