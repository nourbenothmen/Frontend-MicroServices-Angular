import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Ajoute ceci pour ngModel si besoin dans le template

export interface InterventionDTO {
  Id: number;
  ReclamationId: number;
  ClientId: number;
  ClientNom: string;
  ClientAddress: string;
  ClientTelephone: string;
  ArticleId: number;
  ArticleNom: string;
  EstSousGarantie: boolean;
  TechnicienId?: number;
  TechnicienNom: string;
  Statut: string;
  DateIntervention: string;
  DateCreation: string;
  Description?: string;
}

@Component({
  selector: 'app-details-intervention',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // FormsModule ajouté si tu utilises ngModel ailleurs
  templateUrl: './details-intervention.component.html',
})
export class DetailsInterventionComponent implements OnInit {

  intervention!: InterventionDTO;
  API_URL = 'https://localhost:7091/apigateway/interventions'; // À adapter si besoin

  constructor(
    public route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadIntervention(id);
    }
  }

  loadIntervention(id: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<InterventionDTO>(`${this.API_URL}/${id}/details`, { headers })
      .subscribe({
        next: (data) => {
          this.intervention = data;
           console.log("Données récupérées par détails:", data); // ✅ affiche les données dans la console
        },
        error: (err) => {
          console.error('Erreur lors du chargement de l\'intervention :', err);
          alert('Impossible de charger l\'intervention. Vérifiez votre connexion ou vos droits.');
        }
      });
  }

  // Méthode pour changer le statut (utilisée pour "En cours" et "Annulée")
private updateStatut(newStatut: string) {
  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const body = { Statut: newStatut };

  this.http.patch(`${this.API_URL}/${this.intervention.Id}/status`, body, { headers })
    .subscribe({
      next: () => {
        this.intervention.Statut = newStatut;
        this.loadIntervention(this.intervention.Id);

        // Mapping corrigé : envoie les valeurs EXACTES de l'enum backend
    let reclamationStatus = '';
    switch (newStatut) {
      case 'En cours':
        reclamationStatus = 'EnCours';     // ← Sans espace !
        break;
      case 'Terminée':
        reclamationStatus = 'Terminée';    // ← Exactement comme dans l'enum
        break;
      case 'Annulée':
        reclamationStatus = 'Annulée';     // Si tu as cet enum
        break;
      default:
        return;
    }

        if (reclamationStatus) {
          this.updateReclamationStatus(this.intervention.ReclamationId, reclamationStatus);
        }
      },
      error: (err) => {
        console.error('Erreur mise à jour statut :', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
}

// Réutilise la même méthode que dans add-intervention
private updateReclamationStatus(reclamationId: number, newStatus: string) {
  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const body = { Statut: newStatus };

  this.http.patch(
    `https://localhost:7091/apigateway/reclamations/${reclamationId}/status`,
    body,
    { headers }
  ).subscribe({
    next: () => {
      console.log(`Réclamation ${reclamationId} → ${newStatus} (mise à jour réussie)`);

      // SOLUTION : Force le rafraîchissement de la page pour voir le nouveau statut
      window.location.reload();

      // Alternative plus propre (si tu as un service partagé) :
      // this.reclamationService.notifyStatusChanged();
    },
    error: (err) => {
      console.error('Erreur mise à jour statut réclamation', err);
      alert('La réclamation a été mise à jour en base, mais l\'affichage peut être décalé. Rafraîchissez la page.');
    }
  });
}

  marquerEnCours() {
    this.updateStatut('En cours');
    alert('Intervention marquée comme en cours !');
    this.router.navigate(['/interventions']);
  }

  annuler() {
    if (!confirm('Voulez-vous vraiment annuler cette intervention ?')) {
      return;
    }
    this.updateStatut('Annulée');
    alert('Intervention annulée !');
    this.router.navigate(['/interventions']);
  }

  // === LA MÉTHODE IMPORTANTE : Clôturer l'intervention ===
  CloturerIntervention() {
    if (!this.intervention) return;

    if (this.intervention.EstSousGarantie) {
      // Si sous garantie → on clôture directement sans facturation
      this.updateStatut('Terminée');
      alert('Intervention terminée (sous garantie)');
      this.router.navigate(['/interventions']);
    } else {
      // Si hors garantie → on redirige vers le formulaire de clôture/facturation
      this.router.navigate(['/interventions', this.intervention.Id, 'cloture']);
    }
  }
}