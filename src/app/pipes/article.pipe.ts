import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'article'
})
export class ArticlePipe implements PipeTransform {
  transform(articles: any[], searchText: string): any[] {
    if (!articles || !searchText) {
      return articles; // 🔹 If empty, return full list
    }

    const search = searchText.toLowerCase().trim();

    return articles.filter(article => {
      return (
        article.arDesign?.toLowerCase().includes(search) ||
        article.marque?.toLowerCase().includes(search) ||
        article.famille?.toLowerCase().includes(search)
      );
    });
  }

}
