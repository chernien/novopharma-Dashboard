import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.css']
})
export class SuiviComponent implements OnInit {
  
  dermos: any[] = [];
  filteredDermos: any[] = [];
  searchText: string = "";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadDermos();
  }

  // 🔹 Charger les dermos + trier par dateCheckIn décroissante
  loadDermos() {
    this.authService.GetDermos().subscribe({
      next: (res) => {
        // 🔸 Tri du plus récent au plus ancien
        this.dermos = res.sort((a: any, b: any) => 
          new Date(b.dateCheckIn).getTime() - new Date(a.dateCheckIn).getTime()
        );

        this.filteredDermos = [...this.dermos]; // garder le tri
      },
      error: (err) => {
        console.error("Erreur API dermos :", err);
      }
    });
  }

  // 🔹 Filtrer + garder le tri par dateCheckIn
  filterDermos() {
    const text = this.searchText.toLowerCase();

    this.filteredDermos = this.dermos
      .filter(d =>
        d.username.toLowerCase().includes(text) ||
        d.intitule.toLowerCase().includes(text)
      )
      .sort((a: any, b: any) => 
        new Date(b.dateCheckIn).getTime() - new Date(a.dateCheckIn).getTime()
      );
  }
}
