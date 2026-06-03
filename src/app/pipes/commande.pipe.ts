import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commande'
})
export class CommandePipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    const searchTerms = searchText.toLowerCase().split(' ');

    return items.filter((item: any) => {
      let relevanceScore = 0;

      // Calcul du score de pertinence pour les propriétés de l'article
      Object.values(item.article).forEach((value: any) => {
        if (typeof value === 'string') {
          const lowercaseValue = value.toLowerCase();

          searchTerms.forEach(term => {
            if (lowercaseValue.includes(term)) {
              relevanceScore++;
            }
          });
        }
      });

      // Calcul du score de pertinence pour les propriétés de la pharmacie
      Object.values(item.pharmacy).forEach((value: any) => {
        if (typeof value === 'string') {
          const lowercaseValue = value.toLowerCase();

          searchTerms.forEach(term => {
            if (lowercaseValue.includes(term)) {
              relevanceScore++;
            }
          });
        }
      });

      // Gardez les éléments ayant un score de pertinence supérieur à 0
      return relevanceScore > 0;
    })
      // Triez les éléments en fonction de leur score de pertinence (optionnel)
      .sort((a: any, b: any) => {
        // Trier par ordre décroissant de score de pertinence
        return this.getRelevanceScore(b, searchTerms) - this.getRelevanceScore(a, searchTerms);
      });
  }

  // Méthode pour calculer le score de pertinence d'un élément
  private getRelevanceScore(item: any, searchTerms: string[]): number {
    let relevanceScore = 0;

    Object.values(item.article).forEach((value: any) => {
      if (typeof value === 'string') {
        const lowercaseValue = value.toLowerCase();
        searchTerms.forEach(term => {
          if (lowercaseValue.includes(term)) {
            relevanceScore++;
          }
        });
      }
    });

    Object.values(item.pharmacy).forEach((value: any) => {
      if (typeof value === 'string') {
        const lowercaseValue = value.toLowerCase();
        searchTerms.forEach(term => {
          if (lowercaseValue.includes(term)) {
            relevanceScore++;
          }
        });
      }
    });

    return relevanceScore;
  }

}
