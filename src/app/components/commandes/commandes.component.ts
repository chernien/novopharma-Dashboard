import { Component } from '@angular/core';
import { CommandesService } from '../../services/commandes.service';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx'; // 📂 Pour Excel
import jsPDF from 'jspdf'; // 📂 Pour PDF
import autoTable from 'jspdf-autotable'; // 📂 Pour les tableaux PDF
import { ArticleService } from '../../services/article.service';
import { FactureService } from '../../services/facture.service';
import { logoBase64 } from './../../logo-base64'; // adapte le chemin selon ta structure

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrl: './commandes.component.css'
})
export class CommandesComponent {
  searchText: string = "";
  commandes: any[] = [];
  selectedCommandes: any[] = [];
  groupedCommandes: any = {}; // ✅ Stocke les commandes groupées par pharmacie et date
  filteredGroupedCommandes: any = {}; // ✅ Stocke les résultats filtrés
  selectedPharmacie: string = "";
  selectedDate: string = "";
  loading: boolean = false;
  errorMessage: string = "";
  giftOrders: any[] = [];
  filteredGiftOrders: any[] = [];
  factures: any[] = [];
  filteredFactures: any[] = [];

  constructor(private commandeService: CommandesService, private giftOrderService: ArticleService, private factureService: FactureService) { }

  ngOnInit() {
    // 🔹 Par défaut : date d’aujourd’hui
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0]; // format yyyy-MM-dd compatible avec <input type="date">
    
    //this.getAllCommandes();   // ✅ Charge les commandes du jour
    this.getAllGiftOrders();
    this.getAllFactures();

    this.getAllCommandesAndFactures(); // 🔹 Charge commandes + factures à la fois

  }
  

  formatDateForApi(dateString: string): string {
    // Le input type="date" retourne "yyyy-MM-dd"
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`; // Converti en dd/MM/yyyy
  }


  getAllCommandesAndFactures() {
    this.loading = true;
    const dermo = localStorage.getItem('username') || '';
    const dateParam = this.selectedDate ? this.formatDateForApi(this.selectedDate) : undefined;
  
    // 🔹 Récupération des factures
    this.factureService.GetAllFactures().subscribe({
      next: (facturesRes: any[]) => {
        this.factures = facturesRes.slice().reverse();
        this.filteredFactures = [...this.factures];
  
        // 🔹 Récupération des commandes
        this.commandeService.getComFact(dateParam, dermo).subscribe({
          next: (res: any[]) => {
            this.loading = false;
  
            // 🔹 Déduplication et enrichissement
            const uniqueCommandesMap = new Map<number, any>();
            res.reverse().forEach((cmd: any) => {
              if (!uniqueCommandesMap.has(cmd.id)) {
                // 🔹 Enrichissement avec facture
                if (cmd.factureId && this.factures.length > 0) {
                  const factureAssociee = this.factures.find(f => f.id === cmd.factureId);
                  if (factureAssociee) {
                    cmd = {
                      ...cmd,
                      dateArrivee: factureAssociee.dateArrivee || cmd.dateArrivee,
                      dateSortie: factureAssociee.dateSortie || cmd.dateSortie,
                      commentaire: factureAssociee.commentaire || cmd.commentaire
                    };
                  }
                }
                uniqueCommandesMap.set(cmd.id, cmd);
              }
            });
  
            this.commandes = Array.from(uniqueCommandesMap.values());
            this.groupCommandes();
            this.applyFilters();
            console.log("✅ COM_FACT enrichie + dédupliquée :", this.commandes);
          },
          error: err => {
            this.loading = false;
            this.errorMessage = "Erreur lors du chargement des commandes.";
            console.error("❌ Erreur API /comfact :", err);
          }
        });
  
      },
      error: err => {
        this.loading = false;
        this.errorMessage = "Erreur lors du chargement des factures.";
        console.error("❌ Erreur chargement factures :", err);
      }
    });
  }
  
  
  
  


  // 📌 Grouper les commandes par Pharmacie / Date / Dermo
  groupCommandes() {
    this.groupedCommandes = {};
    this.commandes.forEach(commande => {
      const dateKey = commande.dateArrivee
        ? commande.dateArrivee.split('T')[0]
        : commande.dateCreated?.split('T')[0];
  
      const key = `${commande.pharmacy?.ctIntitule} - ${dateKey} - ${commande.createdBy}`;
      if (!this.groupedCommandes[key]) {
        this.groupedCommandes[key] = [];
      }
      this.groupedCommandes[key].push(commande);
    });
    this.applyFilters();
  }
  
  

  // getAllCommandes() {
  //   this.loading = true;
    
  //   const dateParam = this.selectedDate
  //     ? this.formatDateForApi(this.selectedDate) // ✅ conversion yyyy-MM-dd -> dd/MM/yyyy
  //     : undefined;
    
  //   this.commandeService.getCommandeAll(dateParam).subscribe({
  //     next: (res: any[]) => {
  //       this.commandes = res.reverse();
  //       this.groupCommandes();
  //       this.applyFilters();
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       this.errorMessage = "Erreur lors du chargement des commandes.";
  //       console.error(err);
  //     }
  //   });
  // }
  
  

  // 📌 Grouper les commandes par Pharmacie et Date
  // groupCommandes() {
  //   this.groupedCommandes = {};
  //   this.commandes.forEach(commande => {
  //     // ✅ Ajout du Dermo dans la clé
  //     const key = `${commande.pharmacy?.ctIntitule} - ${commande.dateCreated?.split('T')[0]} - ${commande.createdBy}`;

  //     if (!this.groupedCommandes[key]) {
  //       this.groupedCommandes[key] = [];
  //     }
  //     this.groupedCommandes[key].push(commande);
  //   });

  //   this.applyFilters(); // ✅ Mise à jour des données filtrées après regroupement
  // }


  // 📌 Appliquer les Filtres sur les Ventes Groupées
  // applyFilters() {
  //   // ✅ Si tous les filtres sont vides, on affiche tout
  //   if (!this.selectedPharmacie && !this.selectedDate && !this.searchText) {
  //     this.filteredGroupedCommandes = { ...this.groupedCommandes };
  //     return;
  //   }
  
  //   this.filteredGroupedCommandes = {};
  //   Object.keys(this.groupedCommandes).forEach(key => {
  //     const [pharmacie, date, dermo] = key.split(' - ');
  
  //     // 🔹 Filtrage indépendant pour chaque champ
  //     const matchPharmacie = this.selectedPharmacie
  //       ? pharmacie.toLowerCase().includes(this.selectedPharmacie.toLowerCase())
  //       : true;
  
  //     const matchDate = this.selectedDate
  //       ? date.startsWith(this.selectedDate)
  //       : true;
  
  //     // 🔹 Ici, on filtre uniquement par le nom du dermo pour le champ de recherche
  //     const matchDermo = this.searchText
  //       ? dermo.toLowerCase().includes(this.searchText.toLowerCase())
  //       : true;
  
  //     if (matchPharmacie && matchDate && matchDermo) {
  //       this.filteredGroupedCommandes[key] = this.groupedCommandes[key];
  //     }
  //   });
  // }


  applyFilters() {
    if (!this.selectedPharmacie && !this.selectedDate && !this.searchText) {
      this.filteredGroupedCommandes = { ...this.groupedCommandes };
      return;
    }

    this.filteredGroupedCommandes = {};
    Object.keys(this.groupedCommandes).forEach(key => {
      const [pharmacie, date, dermo] = key.split(' - ');

      const matchPharmacie = this.selectedPharmacie
        ? pharmacie.toLowerCase().includes(this.selectedPharmacie.toLowerCase())
        : true;

      const matchDate = this.selectedDate
        ? date.startsWith(this.selectedDate)
        : true;

      const matchDermo = this.searchText
        ? dermo.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      if (matchPharmacie && matchDate && matchDermo) {
        this.filteredGroupedCommandes[key] = this.groupedCommandes[key];
      }
    });
  }


  
  resetFilters() {
    this.selectedPharmacie = "";
    this.selectedDate = "";
    this.searchText = "";
    this.applyFilters(); // ✅ Recharge toutes les commandes
  }

  // ✅ Récupérer les clés filtrées pour *ngFor
  getFilteredGroupedKeys(): string[] {
    return Object.keys(this.filteredGroupedCommandes);
    
  }

  // 📌 Afficher les commandes détaillées dans le modal
  // 📌 Méthode pour afficher les commandes détaillées d'un groupe sélectionné
  // showCommandes(pharmacie: string, date: string, dermo: string) {
  //   const key = `${pharmacie} - ${date} - ${dermo}`;

  //   console.log(`🔎 Clé recherchée :`, key);
  //   console.log(`📂 Données disponibles :`, this.filteredGroupedCommandes);

  //   this.selectedCommandes = this.filteredGroupedCommandes[key] || [];

  //   if (this.selectedCommandes.length === 0) {
  //     console.warn(`❌ Aucune commande trouvée pour ${pharmacie} - ${date} - ${dermo}`);
  //   } else {
  //     console.log(`✅ Commandes trouvées :`, this.selectedCommandes);
  //   }
  // }


  showCommandes(pharmacie: string, date: string, dermo: string) {
    const key = `${pharmacie} - ${date} - ${dermo}`;
    const commandes: any[] = this.filteredGroupedCommandes[key] || [];
  
    // 🔹 Déduplication par id
    const uniqueCommandesMap = new Map<number, any>();
    commandes.forEach((cmd: any) => {   // ✅ ici on précise : cmd: any
      if (!uniqueCommandesMap.has(cmd.id)) {
        uniqueCommandesMap.set(cmd.id, cmd);
      }
    });
  
    this.selectedCommandes = Array.from(uniqueCommandesMap.values());
    console.log(`📦 Détails pour ${key}:`, this.selectedCommandes);
  }
  
  

  



  getGroupedKeys(): string[] {
    return Object.keys(this.groupedCommandes);
  }

  // 📌 EXPORTER EN EXCEL (Filtré par groupe sélectionné)
  exportToExcel(pharmacie: string, date: string) {
    const key = `${pharmacie} - ${date}`;
    const selectedData = this.filteredGroupedCommandes[key] || []; // ✅ Vérifie si les données existent

    if (selectedData.length === 0) {
      alert("❌ Aucune donnée à exporter !");
      return;
    }

    const exportData = selectedData.map((commande: any) => ({
      "Article": commande?.article?.arDesign,
      "Marque": commande?.article?.marque,
      "Dérmo-Conseiller(e)": commande?.createdBy,
      "Quantité Vendue": commande?.quantityVendue,
      "Date de Création": commande?.dateCreated,
      "Pharmacie": commande?.pharmacy?.ctIntitule
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventes");
    XLSX.writeFile(wb, `Ventes_${pharmacie}_${date}.xlsx`);
  }
  // 📌 EXPORTER EN PDF (Filtré par groupe sélectionné)
  exportToPDF(pharmacie: string, date: string) {
    const key = `${pharmacie} - ${date}`;
    const selectedData = this.filteredGroupedCommandes[key] || []; // ✅ Vérifie si les données existent

    if (selectedData.length === 0) {
      alert("❌ Aucune donnée à exporter !");
      return;
    }

    const doc = new jsPDF();
    doc.text(`Statistiques de Ventes - ${pharmacie} (${date})`, 10, 10);

    const tableData = selectedData.map((commande: any) => [
      commande?.article?.arDesign,
      commande?.article?.marque,
      commande?.createdBy,
      commande?.quantityVendue,
      commande?.dateCreated,
      commande?.pharmacy?.ctIntitule
    ]);

    autoTable(doc, {
      head: [["Article", "Marque", "Dérmo", "Quantité", "Date", "Pharmacie"]],
      body: tableData
    });

    doc.save(`Ventes_${pharmacie}_${date}.pdf`);
  }

  formaterDAte(dateString: string | Date): string {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');       // jour à 2 chiffres
    const month = String(d.getMonth() + 1).padStart(2, '0'); // mois à 2 chiffres (0-based)
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  generateInvoice(pharmacie: string, date: string, dermo: string) {
    const key = `${pharmacie} - ${date} - ${dermo}`;
    const selectedData = this.filteredGroupedCommandes[key] || [];

    if (selectedData.length === 0) {
      alert("❌ Aucune donnée pour générer la facture !");
      return;
    }

    const doc = new jsPDF();

    // ✅ Entête de la Facture
    doc.setFontSize(18);
    doc.text(` ${pharmacie}`, 10, 15);
    doc.setFontSize(12);
    doc.text(`Date : ${date}`, 10, 25);
    doc.text(`Dermo-Conseiller : ${dermo}`, 10, 35);
    doc.text("__________________________________________________________", 10, 40);

    // ✅ Table des ventes
    const tableData = selectedData.map((commande: any) => [
      commande?.article?.arDesign,
      commande?.article?.marque,
      commande?.quantity,
      commande?.quantityVendue,
      commande?.dateCreated
    ]);

    // ✅ Générer la table et récupérer la position `finalY`
    const table = autoTable(doc, {
      startY: 50,
      head: [["Article", "Marque", "Stock Pharmacie", "Quantité Vendue", "Date"]],
      body: tableData
    });

    const finalY = (table as any)?.lastAutoTable.finalY || 60; // ✅ Récupération correcte




    // ✅ Sauvegarde du fichier PDF
    doc.save(`Facture_${pharmacie}_${date}.pdf`);
  }
  getAllGiftOrders() {
    this.loading = true;
    this.giftOrderService.getAllGiftOrders().subscribe({
      next: (res: any[]) => {
        this.giftOrders = res;
        this.filteredGiftOrders = [...res];
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
  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous"); // Important pour éviter les problèmes CORS
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  }
 
  
  
  

  async generateInvoice1(pharmacie: string, date: string, dermo: string) {
    const doc = new jsPDF();
  
    // ✅ Normalisation pour comparer les chaînes
    const normalize = (str: string) =>
      str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  
    // ✅ Récupération des commandes locales
    const key = `${pharmacie} - ${date} - ${dermo}`;
    const selectedCommandes = this.filteredGroupedCommandes[key] || [];
  
    // 🔹 Récupération des gifts via API backend
// 🔹 Formatage correct de la date pour le backend
const formattedDate = date.includes("/")
  ? date // si déjà en dd/MM/yyyy
  : (() => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    })();

 // 🔹 On récupère le codePharmacie depuis la première commande filtrée
 const pharmacieId = selectedCommandes.length > 0
 ? selectedCommandes[0].article?.codePharmacie || selectedCommandes[0].codePharmacie || ""
 : "";

if (!pharmacieId) {
 console.warn("⚠️ Impossible de récupérer codePharmacie pour l'API gifts.");
}


    // 🔹 Objet envoyé à l'API
const apiPayload = {
  nomDermo: dermo,
  dateCommande: formattedDate,
  pharmacieId: pharmacieId
};
console.log("🚀 Envoi à l'API gifts :", apiPayload);
    
    let selectedGiftOrders: any[] = [];
    try {
      selectedGiftOrders = await this.giftOrderService.getGiftOrdersByDermo1(apiPayload)
        .toPromise() || [];
      console.log("✅ Réponse API gifts :", selectedGiftOrders);
    } catch (err) {
      console.error("❌ Erreur récupération gifts :", err);
      selectedGiftOrders = [];
    }
  
    console.log("🎁 Nombre de gifting récupérés :", selectedGiftOrders.length);
    console.log("🎁 Détails gifting :", selectedGiftOrders);
  
    // ✅ Recherche de la facture correspondante
    const facture = this.commandes.find((c: any) => {
      const dateArrivee = c.dateArrivee ? c.dateArrivee.split('T')[0] : null;
      const dateSortie = c.dateSortie ? c.dateSortie.split('T')[0] : null;
      const dateCreated = c.dateCreated ? c.dateCreated.split('T')[0] : null;
  
      const formattedDateKey = date.includes('/') ? date.split('/').reverse().join('-') : date;
  
      return (
        normalize(c.pharmacy?.ctIntitule || "") === normalize(pharmacie) &&
        normalize(c.createdBy || "") === normalize(dermo) &&
        (dateArrivee === formattedDateKey || dateSortie === formattedDateKey || dateCreated === formattedDateKey)
      );
    });
  
    // ✅ Vérification si pas de données
    if (selectedCommandes.length === 0 && selectedGiftOrders.length === 0) {
      alert("❌ Aucune donnée pour générer la facture !");
      return;
    }
  
    // 🔹 Fonctions utilitaires pour les dates
    const formatDate = (dateString: string | Date): string => {
      const d = new Date(dateString);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    const formatDateTime = (dateString: any) => {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      }).replace(",", "");
    };
  
    const formatDateTimeDP = (dateString: any) => {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleString("fr-FR", {
        month: "2-digit", year: "numeric"
      }).replace(",", "");
    };
  
    // ✅ En-tête facture
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(` ${pharmacie}`, 10, 15);
    doc.addImage(logoBase64, 'PNG', 150, 5, 40, 40);
  
    doc.setFontSize(12);
    doc.text(`Date : ${formatDate(date)}`, 10, 25);
    doc.text(`Dermo-Conseiller : ${dermo}`, 10, 35);
  
    // ✅ Dates & commentaire
    let currentY = 45;
    if (facture) {
      if (facture.dateArrivee) {
        doc.setFont("helvetica", "normal");
        doc.text(`Date d'entrée : ${formatDateTime(facture.dateArrivee)}`, 10, currentY);
        currentY += 8;
      }
  
      if (facture.dateSortie) {
        doc.text(`Date de sortie : ${formatDateTime(facture.dateSortie)}`, 10, currentY);
        currentY += 10;
      }
  
      if (facture.commentaire && facture.commentaire.trim().length > 0) {

        doc.setFont("helvetica", "bold");
        doc.text("Commentaire :", 10, currentY);
        currentY += 6;
      
        doc.setFont("helvetica", "normal");
      
        autoTable(doc, {
          startY: currentY,
          body: [[facture.commentaire.trim()]],
          theme: "plain",
          styles: {
            fontSize: 11,
            cellPadding: 2,
            valign: "top",
            overflow: "linebreak"
          },
          columnStyles: {
            0: { cellWidth: doc.internal.pageSize.getWidth() - 20 }
          },
          margin: { left: 10, right: 10 }
        });
      
        currentY = (doc as any).lastAutoTable.finalY + 10;
      
      } else {
        doc.setFont("helvetica", "italic");
        doc.text("Commentaire : pas de commentaire saisi !", 10, currentY);
        currentY += 10;
      }
      
    } else {
      doc.setFont("helvetica", "italic");
      doc.text("(Aucune facture trouvée pour cette pharmacie/date/dermo)", 10, currentY);
      currentY += 10;
    }
  
    // ✅ Totaux
    let totalVente = selectedCommandes.reduce((sum: any, c: any) => sum + (c?.quantityVendue || 0), 0);
    let totalGifts = selectedGiftOrders.reduce((sum: any, g: any) => sum + (g?.quantiteCommande || 0), 0);
  
    doc.setFont("helvetica", "bold");
    doc.text(`Total Quantité Vendue : ${totalVente}`, 150, 55);
    doc.text(`Total gifting : ${totalGifts}`, 150, 62);
  
    doc.text("__________________________________________________________", 10, 105);
    let finalY = 120;
  
    // ✅ VENTES : regroupées par marque
    const groupedByBrand = selectedCommandes.reduce((groups: any, item: any) => {
      const brand = item?.article?.marque || "Sans Marque";
      if (!groups[brand]) groups[brand] = [];
      groups[brand].push(item);
      return groups;
    }, {});
  
    if (selectedCommandes.length > 0) {
      doc.setFontSize(14);
      doc.text(`Ventes :`, 10, finalY);
      finalY += 10;
  
      Object.keys(groupedByBrand).forEach(brand => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${brand}`, 10, finalY);
        finalY += 8;
  
        const commandesData = groupedByBrand[brand].map((commande: any) => [
          commande?.article?.arDesign,
          commande?.quantity,
          commande?.quantityVendue,
          commande?.datePeremtion ? formatDateTimeDP(commande?.datePeremtion) : "-",
          commande?.qte1 || "-",
          commande?.datePeremtion1 ? formatDateTimeDP(commande?.datePeremtion1) : "-",
          commande?.qte2 || "-"
        ]);
  
        autoTable(doc, {
          startY: finalY,
          head: [["Article", "Stock", "Vendue", "DP 1", "Qte1", "DP 2", "Qte2"]],
          body: commandesData,
          margin: { left: 10 }
        });
  
        finalY = (doc as any).lastAutoTable.finalY + 10;
      });
    }
  
    // ✅ GIFTING via API
    if (selectedGiftOrders.length > 0) {
      doc.setFontSize(14);
      doc.text(`Gifting :`, 10, finalY);
      finalY += 10;
  
      const giftsData = selectedGiftOrders.map(gift => [
        gift?.giftRef,
        gift?.giftName,
        gift?.marque || "-",
        gift?.quantiteCommande,
        gift?.dateCommande.split('T')[0]
      ]);
  
      autoTable(doc, {
        startY: finalY,
        head: [["Référence", "Nom", "Marque", "Quantité Commandée", "Date"]],
        body: giftsData
      });
    }
  
    doc.save(`Facture_${pharmacie}_${date}.pdf`);
  }
  

  getAllFactures() {
    this.loading = true;
    this.factureService.GetAllFactures().subscribe({
      next: (result: any[]) => {
        // 🔹 Déduplication par ID
        const uniqueFacturesMap = new Map<number, any>();
        result.forEach(f => {
          if (!uniqueFacturesMap.has(f.id)) {
            uniqueFacturesMap.set(f.id, f);
          }
        });
  
        this.factures = Array.from(uniqueFacturesMap.values()).reverse(); // 🔹 du plus récent au plus ancien
        this.filteredFactures = [...this.factures]; 
        this.loading = false;
        console.log(this.factures);
      },
      error: (err) => {
        console.error("❌ Erreur lors du chargement des factures :", err);
        this.errorMessage = "Erreur lors du chargement des factures.";
        this.loading = false;
      }
    });
  }
  

  // getTotalQuantiteVendue(key: string): number {
  //   const commandes = this.filteredGroupedCommandes[key] || [];
  //   return commandes.reduce((total: any, cmd: { quantityVendue: any; }) => total + (cmd.quantityVendue || 0), 0);
  // }


  getTotalQuantiteVendue(key: string): number {
    const commandes = this.filteredGroupedCommandes[key] || [];
    return commandes.reduce((total: any, cmd: any) => total + (cmd.quantityVendue || 0), 0);
  }
}