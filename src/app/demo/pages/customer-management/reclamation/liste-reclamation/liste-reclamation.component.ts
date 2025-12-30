import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../authentication/AuthService'; // ajuste le chemin
import { ReclamationStatusPipe } from '../reclamation-status.pipe';
import { RouterModule } from '@angular/router'; // <-- Ajouté ici
import { lastValueFrom } from 'rxjs';


export interface Reclamation {
  id: number;
  articleId: number;
  articleNom: string;          // ← AJOUTÉ
  description: string;
  status: number | string;
  createdAt: string;
  resolvedAt?: string;
  serialNumber?: string;
  problemType?: string;
  desiredInterventionDate?: string;
  dateIntervention?: string;
  technicienNom?: string;
  clientId: number;
  customerNom: string;      // ✅ AJOUT
  estSousGarantie: boolean;
}

@Component({
  selector: 'app-liste-reclamation',
  standalone: true,
  imports: [CommonModule,ReclamationStatusPipe,RouterModule],
  templateUrl: './liste-reclamation.component.html',
  styleUrls: ['./liste-reclamation.component.scss']
})
export class ListeReclamationComponent implements OnInit {

  reclamations: Reclamation[] = [];
  private readonly API_URL = 'https://localhost:7091/apigateway/reclamations';

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService,
    //public reclamationStatusPipe: ReclamationStatusPipe
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

async loadReclamations(): Promise<void> {
  const token = this.auth.getToken();
  if (!token) {
    alert('Vous devez être connecté');
    return;
  }

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  try {
    let data: Reclamation[] = [];

    if (this.auth.hasRole('ResponsableSAV')) {
      // Tous les clients
      data = await this.http.get<Reclamation[]>(this.API_URL, { headers }).toPromise() || [];
    } else if (this.auth.hasRole('Client')) {
      // Réclamations de ce client uniquement
      data = await this.http.get<Reclamation[]>(`${this.API_URL}/my`, { headers }).toPromise() || [];
    }

    // 🔹 Pas besoin de getClientName() car le backend renvoie déjà clientNom
    this.reclamations = data;
    console.log('Réclamations récupérées :', this.reclamations);
  } catch (error) {
    console.error('Erreur récupération réclamations', error);
    alert('Impossible de récupérer les réclamations.');
  }
}


  isResponsableSAV(): boolean {
  return this.auth.hasRole('ResponsableSAV');
}


  /** 🔹 trackBy pour optimisation */
  trackByReclamationId(index: number, reclamation: Reclamation): number {
    return reclamation.id;
  }

  /** 🔹 Ouvrir modal édition ou détails (optionnel) */
  openEditModal(reclamation: Reclamation): void {
    this.router.navigate(['/GestionReclamations/edit-reclamation', reclamation.id]);
  }
planifier(rec: Reclamation): void {
  this.router.navigate(
    ['/interventions/add'],
    {
      state: {
        reclamation: rec
      }
    }
  );
}


getStatusClass(status: number | string): string {
  switch (status) {
    case 0:
    case 'En Attente':
      return 'bg-secondary';
    case 1:
    case 'Planifiée':
      return 'bg-warning text-dark';
    case 2:
    case 'En Cours':
      return 'bg-primary';
    case 3:
    case 'Terminée':
      return 'bg-success';
    default:
      return 'bg-dark';
  }
}

/*
private async getClientName(clientId?: number): Promise<string> {
  if (!clientId) return 'N/A';

  try {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const client = await lastValueFrom(this.http.get<any>(`https://localhost:7151/api/customers/${clientId}`, { headers }));
    return client ? `${client.firstName} ${client.lastName}` : '-';
  } catch (error) {
    console.error('Erreur récupération client', error);
    return '-';
  }
}*/



  /** 🔹 Supprimer une réclamation (ResponsableSAV) */
  confirmDelete(id?: number): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer cette réclamation ?')) return;

    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.API_URL}/${id}`, { headers })
      .subscribe({
        next: () => {
          alert('Réclamation supprimée');
          this.loadReclamations();
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          alert('Impossible de supprimer la réclamation');
        }
      });
  }
}
