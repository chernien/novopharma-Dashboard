import { Component } from '@angular/core';
import { FactureService } from '../../services/facture.service';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.css'
})
export class FactureComponent {
  factures: any[] = [];
  filteredFactures: any[] = [];
  searchText: string = "";
  selectedPharmacie: string = "";
  selectedDermo: string = "";
  selectedDate: string = "";
  loading: boolean = false;
  errorMessage: string = "";

  constructor(private factureService: FactureService) {}

  ngOnInit() {
    this.getAllFactures();
  }

  getAllFactures() {
    this.loading = true;
    this.factureService.GetAllFactures().subscribe({
      next: (result: any[]) => {
        this.factures = result.slice().reverse();
        this.filteredFactures = [...this.factures]; // ✅ On copie les données pour éviter de les écraser
        this.loading = false;
        console.log(this.factures)
      },
      error: (err) => {
        console.error("❌ Erreur lors du chargement des factures :", err);
        this.errorMessage = "Erreur lors du chargement des factures.";
        this.loading = false;
      }
    });
  }

  filterFactures() {
    this.filteredFactures = this.factures.filter(facture => {
      const matchPharmacie = this.selectedPharmacie ? facture.nomPharmacie.toLowerCase().includes(this.selectedPharmacie.toLowerCase()) : true;
      const matchDermo = this.selectedDermo ? facture.nomDermo.toLowerCase().includes(this.selectedDermo.toLowerCase()) : true;
      const matchDate = this.selectedDate ? facture.dateArrivee.startsWith(this.selectedDate) : true;
      const matchSearchText = this.searchText ? 
        (facture.nomPharmacie.toLowerCase().includes(this.searchText.toLowerCase()) ||
         facture.nomDermo.toLowerCase().includes(this.searchText.toLowerCase()) ||
         facture.comment.toLowerCase().includes(this.searchText.toLowerCase())) : true;
      return matchPharmacie && matchDermo && matchDate && matchSearchText;
    });
  }

  resetFilters() {
    this.selectedPharmacie = "";
    this.selectedDermo = "";
    this.selectedDate = "";
    this.searchText = "";
    this.filterFactures(); // ✅ Remet toutes les factures visibles
  }

  openFacture(url: string) {
    if (url) {
      window.open(url, "_blank"); // ✅ Ouvre la facture dans un nouvel onglet
    }
  }
}