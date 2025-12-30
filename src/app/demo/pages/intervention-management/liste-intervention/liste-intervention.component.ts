import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

export interface InterventionListDTO {
  Id: number;
  ReclamationId: number;       // ✅ Ajouter
  ClientId: number;
  ClientNom: string;
  ArticleId: number;
  ArticleNom: string;
  EstSousGarantie: boolean;    // ✅ Ajouter
  TechnicienNom: string;
  Statut: string;
  DateCreation: string;
}



@Component({
  selector: 'app-liste-intervention',
  standalone: true,
  imports: [CommonModule,RouterModule ],
  templateUrl: './liste-intervention.component.html'
})
export class ListeInterventionComponent implements OnInit {

  interventions: InterventionListDTO[] = [];
  API_URL = 'https://localhost:7091/apigateway/interventions';

  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    this.loadInterventions();
  }

loadInterventions(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.get<InterventionListDTO[]>(this.API_URL, { headers })
    .subscribe({
      next: (data) => {
        this.interventions = data;
        console.log("Données récupérées :", data); // ✅ affiche les données dans la console
      },
      error: (err) => {
        console.error("Erreur lors de la récupération :", err); // ✅ affiche l'erreur si elle survient
      }
    });
}
imprimerFacture(interventionId: number) {
  // Redirige vers le composant de clôture en mode "impression uniquement"
  this.router.navigate(['/interventions', interventionId, 'cloture'], {
    queryParams: { mode: 'impression' }
  });
}
getBadgeClass(statut: string): string {
  switch (statut) {
    case 'Planifiée': return 'bg-secondary';
    case 'En attente': return 'bg-secondary';
    case 'En cours': return 'bg-warning text-dark';
    case 'Terminé': return 'bg-success';
    default: return 'bg-light text-dark';
  }
}



  edit(id: number) {
    this.router.navigate(['/interventions/edit', id]);
  }

  details(id: number) {
    this.router.navigate(['/interventions/details', id]);
  }
}
