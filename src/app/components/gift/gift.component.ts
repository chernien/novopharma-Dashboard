import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrl: './gift.component.css'
})
export class GiftComponent {
  articles: any[] = []; // 🔹 Liste complète
  filteredArticles: any[] = []; // 🔹 Liste filtrée
  searchText: string = "";
  loading: boolean = false;
  errorMessage: string = "";
  selectedGift: any = null;
  selectedQuantity: number = 1; // ✅ Valeur par défaut
  dermos: any[] = []; // 🔹 Liste complète des dermos
  selectedDermo: number | null = null; // ✅ Correction du type
  assigning: boolean = false; // ✅ Indicateur de chargement

  constructor(private articleService: ArticleService, private authService: AuthService) {}

  ngOnInit() {
    this.getAllArticles();
    this.getAllAuth();
  }

  /** 🔹 Récupérer tous les articles gifts */
  getAllArticles() {
    this.loading = true;
    this.articleService.getArticlesAllGift().subscribe({
      next: (res: any) => {
        this.articles = res;
        this.filteredArticles = [...res]; // ✅ Copie de la liste pour éviter les bugs
        console.log(this.filteredArticles)
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "❌ Une erreur s'est produite lors du chargement des articles.";
        console.error("Erreur chargement articles:", err);
      }
    });
  }

  /** 🔹 Filtrer les articles selon la recherche */
  filterArticles() {
    const searchLower = this.searchText.trim().toLowerCase();
    this.filteredArticles = this.articles.filter(article =>
      article.arDesign?.toLowerCase().includes(searchLower) ||
      article.marque?.toLowerCase().includes(searchLower) ||
      article.famille?.toLowerCase().includes(searchLower)
    );
  }

  /** 🔹 Récupérer la liste des dermos */
  getAllAuth() {
    this.authService.GetAuthClients().subscribe({
      next: (res: any) => {
        this.dermos = res.filter((item: any) => item?.role === "Dermo");
      },
      error: (err) => {
        console.error("❌ Erreur chargement dermos :", err);
      }
    });
  }

  /** 🔹 Ouvrir la modale d'affectation */
  openAssignModal(gift: any) {
    this.selectedGift = gift;
    this.selectedDermo = null;
    this.selectedQuantity = 1; // ✅ Remise à zéro
  }

  /** 🔹 Affecter un gift à un dermo */
  assignGift() {
    if (!this.selectedGift || !this.selectedDermo || this.selectedQuantity <= 0) {
      alert("❌ Veuillez sélectionner un gift, un dermo et une quantité valide !");
      return;
    }

    const requestData = {
      GiftRef: this.selectedGift.arRef,
      DermoId: this.selectedDermo,
      QuantiteAttribuee: this.selectedQuantity
    };

    this.assigning = true; // ✅ Activation du loader
    console.log(requestData)

    this.articleService.assignGift(requestData).subscribe({
      next: () => {
        alert("✅ Gift assigné avec succès !");
        console.log(requestData)
        this.getAllArticles(); // ✅ Mise à jour après l'affectation
        this.assigning = false;
      },
      error: (err) => {
        console.error("❌ Erreur assignation :", err);
        alert("❌ Échec de l'assignation. Vérifiez le stock disponible.");
        this.assigning = false;
      }
    });
  }
  assignGiftMed() {
    if (!this.selectedGift || !this.selectedDermo || this.selectedQuantity <= 0) {
      alert("❌ Veuillez sélectionner un gift, un dermo et une quantité valide !");
      return;
    }

    const requestData = {
      GiftRef: this.selectedGift.arRef,
      DermoId: this.selectedDermo,
      QuantiteAttribuee: this.selectedQuantity
    };

    this.assigning = true; // ✅ Activation du loader
    console.log(requestData)

    this.articleService.assignGiftMedsource(requestData).subscribe({
      next: () => {
        alert("✅ Gift assigné avec succès !");
        console.log(requestData)
        this.getAllArticles(); // ✅ Mise à jour après l'affectation
        this.assigning = false;
      },
      error: (err) => {
        console.error("❌ Erreur assignation :", err);
        alert("❌ Échec de l'assignation. Vérifiez le stock disponible.");
        this.assigning = false;
      }
    });
  }
}