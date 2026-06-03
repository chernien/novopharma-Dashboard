import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-conseiller',
  templateUrl: './conseiller.component.html',
  styleUrl: './conseiller.component.css'
})
export class ConseillerComponent {
  conseillers: any
  conseiller: any
  searchText = ""
  EditForm: FormGroup
  AddForm: FormGroup
  selectedDermo: any = null;
  assignedGifts: any[] = [];
  loadingGifts: boolean = false;
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private articleService: ArticleService) {

    this.getAllAuth()

    this.AddForm = this.formBuilder.group({
      intitule: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],

    })

    this.EditForm = this.formBuilder.group({
      intitule: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],

    })
  }

  getAllAuth() {
    this.authService.GetAuthClients().subscribe(
      (res: any) => {
        this.conseillers = res.filter((item: any) => item?.role == "Dermo")
        console.log(this.conseillers)
      }
    )
  }


  changeDermoStatus(conseiller: any, newStatus: boolean, event: Event) {
    event.preventDefault(); // 🚫 Empêche navigation vers /home
  
    // ✅ Évite d’appeler l’API inutilement
    if (conseiller.enabled === newStatus) return;
  
    this.authService.UpdateEnabledAuthClient(conseiller.id, newStatus).subscribe({
      next: (res: any) => {
        // Mise à jour locale du statut sans rechargement
        conseiller.enabled = newStatus;
      },
      error: (err) => {
        console.error('Erreur mise à jour statut:', err);
      }
    });
  }
  

  
  /** 🔹 Ouvrir le modal et charger les gifts du dermo */
  openGiftModal(conseiller: any) {
    this.selectedDermo = conseiller;
    this.loadingGifts = true;
    this.assignedGifts = []; // ✅ Réinitialisation
    this.articleService.getGiftsByDermo(conseiller.id).subscribe({
      next: (res: any[]) => {
        this.assignedGifts = res.sort(
          (a, b) =>
            new Date(b.dateAttribution).getTime() -
            new Date(a.dateAttribution).getTime()
        );
      
        this.loadingGifts = false;
      },
      error: (err) => {
        console.warn("⚠ Aucun gift trouvé :", err);
        this.loadingGifts = false;
      }
    });
  }
  deleteGift(assignmentId: number) {
    if (!confirm("❌ Voulez-vous vraiment supprimer cette affectation de gift ?")) return;

    this.articleService.deleteGiftAssignment(assignmentId).subscribe({
        next: () => {
            alert("✅ Affectation supprimée avec succès !");
            this.openGiftModal(this.selectedDermo); // ✅ Recharge les gifts après suppression
        },
        error: (err) => {
            console.error("❌ Erreur suppression :", err);
            alert("❌ Erreur lors de la suppression.");
        }
    });
}

  obtenirInitiales(nomComplet: string): string {
    const parties = nomComplet.split(' ');
    const initialePrenom = parties[0].charAt(0).toUpperCase();
    const initialeNom = parties[parties.length - 1].charAt(0).toUpperCase();
    return initialePrenom + initialeNom;
  }

  getDermoById(id: any) {
    this.authService.GetAuthClient(id).subscribe(
      (res: any) => {
        this.conseiller = res
        this.EditForm.patchValue({
          intitule: this.conseiller?.intitule,
          username: this.conseiller?.username,
          password: this.conseiller?.password
        })
        console.log(this.conseiller)
      }
    )
  }
  SaveDermo() {
    this.authService.AddAuthClient(this.AddForm.value).subscribe(
      (res: any) => {
        this.getAllAuth()
        Swal.fire({
          icon: 'success',
          text: 'Dérmo-Conseiller(e) Ajouté(e) avec succés !'
        })
        console.log(res)
      }, err => {
        Swal.fire({
          icon: 'error',
          text: "Erreur lors de l'ajout d'un Dérmo-Conseiller(e)"
        })
      }
    )
  }
  EnabledDisableDermo(id: any) {
    let x: any
    this.authService.UpdateEnabledAuthClient(id, x).subscribe(
      (res: any) => {
        this.getAllAuth()
        Swal.fire({
          icon: 'success',
          text: 'Dérmo-Conseiller(e) mis(e) à jour avec succés !'

        })
      }, err => {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du Dérmo-Conseiller(e)'
        })
      }
    )
  }

  UpadteDermo(id: any) {
    this.authService.UpdatePassAuthClient(id, this.EditForm.value).subscribe(
      (res: any) => {
        this.getAllAuth()
        Swal.fire({
          icon: 'success',
          text: 'Dérmo-Conseiller(e) mis(e) à jour avec succés !'
        })
        console.log(res)
      }, err => {
        Swal.fire({
          icon: 'error',
          text: 'Erreur lors de la mise à jour du Dérmo-Conseiller(e)'
        })
      }
    )
  }
}
