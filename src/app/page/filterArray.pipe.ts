import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray',
  pure: false
})
export class FilterArrayPipe implements PipeTransform {
  transform(items: any, filter: Object): any {
    if (items.length <= 0) {
      return items;
    }
    return items.filter(x => x.detail_group_id === filter);
  }

}
