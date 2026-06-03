import { Component } from '@angular/core';
import { CommandesService } from '../../services/commandes.service';
import { AuthService } from '../../services/auth.service';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  searchText = ""
  commandes: any[] = [];
  totalCommandes: number = 0;
  totalCommandesMois: number = 0;
  totalConseiller: number = 0;

  commandesDuMois: any[] = [];
  conseillers: any
  articles:any
  selectedDate: any
  constructor(private commandeService: CommandesService, private authService: AuthService, private articleService: ArticleService) { }

  ngOnInit() {
    this.getAllCommandes()
    this.getAllAuth()
    this.getAllArticles()
  }

  getAllCommandes() {
    this.commandeService.getCommandeAll().subscribe(
      (res: any) => {
        this.commandes = res;
        console.log(this.commandes);

        // Calculer le nombre total des commandes
        this.totalCommandes = this.commandes.length;

        // Filtrer les commandes du mois
        const dateActuelle = new Date();
        const moisActuel = dateActuelle.getMonth();
        const anneeActuelle = dateActuelle.getFullYear();

        this.commandesDuMois = this.commandes.filter((commande: any) => {
          const dateCommande = new Date(commande.dateCreated);
          return dateCommande.getMonth() === moisActuel && dateCommande.getFullYear() === anneeActuelle;
        });
        this.totalCommandesMois = this.commandesDuMois?.length
        console.log("Nombre total des commandes : ", this.totalCommandes);
        console.log("Nombre Commandes du mois : ", this.totalCommandesMois);
      }
    );
  }

  getAllAuth() {
    this.authService.GetAuthClients().subscribe(
      (res: any) => {
        this.conseillers = res.filter((item: any) => item?.password == "P@ssw0rd")
        console.log(this.conseillers)
        this.totalConseiller = this.conseillers?.length
      }
    )
  }
  getAllArticles() {
    this.articleService.getArticles().subscribe(
      (res: any) => {
        this.articles = res.slice(0,7)
        console.log(this.articles)
      }
    )
  }
}
