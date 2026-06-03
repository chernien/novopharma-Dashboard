import { Component } from '@angular/core';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-gift-list',
  templateUrl: './gift-list.component.html',
  styleUrl: './gift-list.component.css'
})
export class GiftListComponent {
  giftOrders: any[] = [];
  filteredGiftOrders: any[] = [];
  dermos: any[] = [];
  searchText: string = "";
  selectedDermo: number | null = null;
  selectedPharmacie: string = "";
  loading: boolean = false;
  errorMessage: string = "";

  constructor(private giftOrderService: ArticleService) { }

  ngOnInit() {
    this.getAllGiftOrders();
  }

  /** 🔹 Récupérer toutes les commandes */
  getAllGiftOrders() {
    this.loading = true;
    this.giftOrderService.getAllGiftOrders().subscribe({
      next: (res: any[]) => {
        const sorted = res.sort(
          (a, b) =>
            new Date(b.dateCommande).getTime() -
            new Date(a.dateCommande).getTime()
        );
        
        this.giftOrders = sorted;
        this.filteredGiftOrders = [...sorted];
                this.loading = false;
        console.log(this.giftOrders)
      },
      error: (err) => {
        this.errorMessage = "❌ Erreur lors du chargement des commandes.";
        console.error("Erreur chargement :", err);
        this.loading = false;
      }
    });
  }

  /** 🔹 Filtrer les commandes par dermo */
  filterByDermo() {
    if (!this.selectedDermo) {
      this.getAllGiftOrders();
    } else {
      this.loading = true;
      this.giftOrderService.getGiftOrdersByDermo(this.selectedDermo).subscribe({
        next: (res: any[]) => {
          this.filteredGiftOrders = res;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = "❌ Aucun gift trouvé pour ce dermo.";
          this.loading = false;
        }
      });
    }
  }
  filterSearch() {
    const searchLower = this.searchText.trim().toLowerCase();
    this.filteredGiftOrders = this.giftOrders.filter(order =>
      order.giftName?.toLowerCase().includes(searchLower) ||
      order.marque?.toLowerCase().includes(searchLower) ||
      order.dermoName?.toLowerCase().includes(searchLower) ||
      order.nomPharmacie?.toLowerCase().includes(searchLower) ||
      order.dateCommande?.toLowerCase().includes(searchLower)
    );
  }
  /** 🔹 Filtrer les commandes par pharmacie */
  filterByPharmacie() {
    console.log("🔍 Pharmacie sélectionnée :", this.selectedPharmacie);

    if (!this.selectedPharmacie.trim()) {
      this.getAllGiftOrders();
    } else {
      this.loading = true;
      this.giftOrderService.getGiftOrdersByPharmacie(this.selectedPharmacie).subscribe({
        next: (res: any[]) => {
          console.log("✅ Résultat filtré :", res);
          this.filteredGiftOrders = res;
          this.loading = false;
        },
        error: (err) => {
          console.error("❌ Erreur filtre pharmacie :", err);
          this.errorMessage = `❌ Aucun gift trouvé pour la pharmacie ${this.selectedPharmacie}.`;
          this.loading = false;
        }
      });
    }
  }

  /** 🔹 Réinitialiser les filtres */
  resetFilters() {
    this.selectedDermo = null;
    this.selectedPharmacie = "";
    this.getAllGiftOrders();
  }
}
