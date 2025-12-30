import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Technicien {
  id: number;
  prenom: string;
  nom: string;
  specialite: string;
}

@Component({
  selector: 'app-add-intervention',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-intervention.component.html'
})
export class AddInterventionComponent implements OnInit {

  reclamation: any;

  intervention = {
    reclamationId: 0,
    clientId: 0,
    customerNom: '',
    articleId: 0,
    articleNom: '',
    estSousGarantie: false,
    desiredInterventionDate: '',
    technicienId: 0,  // <-- on stocke l'ID du technicien
    dateIntervention: '',
    TechnicienNom: '', 
    description: '',
    commentaire: ''
  };

  techniciens: Technicien[] = [];

  API_URL = 'https://localhost:7091/apigateway/interventions';
  TECHNICIENS_API_URL = 'https://localhost:7091/apigateway/techniciens';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const state = history.state;

  if (!state?.reclamation) {
    alert('Aucune réclamation sélectionnée. Veuillez sélectionner une réclamation depuis la liste.');
    this.router.navigate(['/reclamations']);
    return;
  }
    this.reclamation = state.reclamation;

 if (this.reclamation) {
  this.intervention.reclamationId = this.reclamation.id;
  this.intervention.clientId = this.reclamation.customerId; // 🔹 CORRIGÉ
  this.intervention.articleId = this.reclamation.articleId;
  this.intervention.articleNom = this.reclamation.articleNom;
  this.intervention.estSousGarantie = this.reclamation.estSousGarantie;
  this.intervention.desiredInterventionDate = this.reclamation.desiredInterventionDate;
}


    this.loadTechniciens();
  }

loadTechniciens(): void {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

 this.http.get<any[]>(this.TECHNICIENS_API_URL, { headers })
  .subscribe({
    next: (data) => {
      this.techniciens = data.map(t => ({
        id: t.Id,
        nom: t.Nom,
        prenom: t.Prenom,
        specialite: t.Specialite
      }));
      console.log('Techniciens récupérés :', this.techniciens);
    },
    error: (err) => console.error('Erreur récupération techniciens', err)
  });

}

save(): void {
  // Validation minimale
  const selectedTech = this.techniciens.find(t => t.id === this.intervention.technicienId);
  if (!selectedTech) {
    alert('Veuillez choisir un technicien');
    return;
  }
  if (!this.intervention.dateIntervention) {
    alert('Veuillez sélectionner une date');
    return;
  }
  if (!this.intervention.description?.trim()) {
    alert('Veuillez saisir une description');
    return;
  }

  // Construire le body exactement comme le backend l'attend
  const body = {
    ReclamationId: this.intervention.reclamationId,
    ClientId: this.intervention.clientId,
    ArticleId: this.intervention.articleId,
    ArticleNom: this.intervention.articleNom,
    EstSousGarantie: this.intervention.estSousGarantie,
    TechnicienNom: `${selectedTech.prenom} ${selectedTech.nom} — ${selectedTech.specialite}`,
    DateIntervention: new Date(this.intervention.dateIntervention).toISOString(),
    Description: this.intervention.description,
    Commentaire: this.intervention.commentaire
  };

  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  this.http.post(this.API_URL, body, { headers })
    .subscribe({
      next: (response: any) => {
        // 1. Création intervention réussie
        console.log('Intervention créée');

        // 2. Mise à jour statut réclamation
        this.updateReclamationStatus(this.intervention.reclamationId, 'Planifiée')
          .then(() => {
            // 3. Navigation seulement après tout est fini
            alert('Intervention créée et réclamation planifiée !');
            this.router.navigate(['/interventions']);
          });
      },
      error: err => {
        console.error('Erreur création intervention', err);
        alert('Erreur lors de la création');
      }
    });
}

// Transforme updateReclamationStatus en Promise pour pouvoir utiliser .then()
// Transforme updateReclamationStatus en Promise
private updateReclamationStatus(reclamationId: number, newStatus: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    if (!token) reject();

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
        console.log(`Réclamation ${reclamationId} → ${newStatus}`);
        resolve();
      },
      error: (err) => {
        console.error('Erreur mise à jour réclamation', err);
        resolve(); // on continue quand même
      }
    });
  });
}
}
