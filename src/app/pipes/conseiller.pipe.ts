import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conseiller'
})
export class ConseillerPipe implements PipeTransform {
  transform(items: any, searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    const searchTerms = searchText.toLowerCase().split(' ');
    
    return items.filter((item: any) => {
      let relevanceScore = 0;

      // Vérifiez chaque propriété de l'article pour correspondance avec les mots-clés
      Object.values(item).forEach((value: any) => {
        if (typeof value === 'string') {
          const lowercaseValue = value.toLowerCase();

          // Vérifiez chaque mot-clé
          searchTerms.forEach(term => {
            if (lowercaseValue.includes(term)) {
              // Augmentez le score de pertinence pour chaque correspondance
              relevanceScore++;
            }
          });
        }
      });

      // Gardez les articles ayant un score de pertinence supérieur à 0
      return relevanceScore > 0;
    })
      // Triez les articles en fonction de leur score de pertinence (optionnel)
      .sort((a: any, b: any) => {
        // Trier par ordre décroissant de score de pertinence
        return this.getRelevanceScore(b, searchTerms) - this.getRelevanceScore(a, searchTerms);
      });
  }

  // Méthode pour calculer le score de pertinence d'un article
  private getRelevanceScore(item: any, searchTerms: string[]): number {
    let relevanceScore = 0;

    Object.values(item).forEach((value: any) => {
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
