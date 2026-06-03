import { Component } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent {
  articles: any[] = []; // 🔹 Liste complète
  filteredArticles: any[] = []; // 🔹 Liste filtrée
  searchTextrr = "";
  loading: boolean = false;
  errorMessage: string = "";
  searchTimeout: any; // ⏳ Timer for debounce

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.getAllArticles();
  }

  getAllArticles() {
    this.loading = true;
    this.articleService.getAllArticles().subscribe({
      next: (res: any) => {
        this.articles = res || []; // Ensure it's an array
        this.filteredArticles = [...this.articles]; // Copy initial list
        this.loading = false;
        console.log("✅ Articles loaded:", this.articles); // ✅ Debugging
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "❌ Erreur chargement articles.";
        console.error("Erreur chargement articles:", err);
      }
    });
  }
  filterArticles() {
    console.log("🔎 Valeur actuelle de searchText:", this.searchTextrr);
  
    if (!this.searchTextrr || this.searchTextrr.trim() === "") {
      console.log("✅ Réinitialisation de la liste complète");
      this.filteredArticles = [...this.articles];
      return;
    }
  
    const search = this.searchTextrr.trim().toLowerCase();
    console.log("🔍 Après trim et lowerCase:", search);
  
    this.filteredArticles = this.articles.filter(article => {
      return (
        article.arDesign?.toLowerCase().includes(search) ||
        article.marque?.toLowerCase().includes(search) ||
        article.famille?.toLowerCase().includes(search)
      );
    });
  
    console.log("✅ Articles après filtrage:", this.filteredArticles);
  }
  

  normalizeText(text: string | null | undefined): string {
    return text ? text.toLowerCase().trim() : ""; // Normalize to avoid `null` errors
  }

  RecommanderArticle(article: any) {
    const nouvelleValeur = article.recommande === 'Oui' ? 'Non' : 'Oui';
  
    if (article.source === 'Novopharma') {
      this.articleService.updateRecArticle({ recommande: nouvelleValeur }, article.arRef).subscribe({
        next: () => {
          article.recommande = nouvelleValeur; // Mise à jour locale
          Swal.fire({
            icon: 'success',
            text: `✅ Article mis à jour en ${nouvelleValeur}! (Novopharma)`
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            text: "❌ Une erreur s'est produite pour Novopharma!"
          });
        }
      });
    } else {
      this.articleService.updateRecArticleMedSource({ recommande: nouvelleValeur }, article.arRef).subscribe({
        next: () => {
          article.recommande = nouvelleValeur; // Mise à jour locale
          Swal.fire({
            icon: 'success',
            text: `✅ Article mis à jour en ${nouvelleValeur}! (Medsource)`
          });
        },
        error: (error:any) => {
          Swal.fire({
            icon: 'error',
            text: "❌ Une erreur s'est produite pour Medsource!"
          });
          console.log(error)
        }
      });
    }
  }
  
}