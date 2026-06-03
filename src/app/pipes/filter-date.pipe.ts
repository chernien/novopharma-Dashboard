import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDate'
})
export class FilterDatePipe implements PipeTransform {

  transform(items: any[], selectedDate: string): any[] {
    if (!items || !selectedDate) {
      return items;
    }

    return items.filter((item: any) => {
      // Convertir la date de la commande en format ISO pour comparaison
      const commandDate = new Date(item.dateCreated).toISOString().split('T')[0];
      return commandDate === selectedDate;
    });
  }

}
