import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchTerm:any ) {
    // console.log(value,'pipe')
   
      return  value.filter(function(search){
        console.log('searchTerm',searchTerm)
        return search.group_name.startsWith(searchTerm)
      });
    
  }

}
