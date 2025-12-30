import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/AuthService'; // ajuste le chemin


export interface Customer {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  createdAt: string;
}

@Component({
  selector: 'app-liste-costumer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-costumer.component.html',
  styleUrls: ['./liste-costumer.component.scss']
})
export class ListeCostumerComponent implements OnInit {

  /** 🔹 Liste des clients (UTILISÉE DANS LE HTML) */
  clients: Customer[] = [];

  /** 🔹 URL API Gateway */
  private readonly API_URL = 'https://localhost:7091/apigateway/customers';

  constructor(
    private http: HttpClient,
    private router: Router,
      private auth: AuthService // ✅ Ajouté ici

  ) {}

ngOnInit(): void {
  const token = this.auth.getToken();
  console.log('JWT actuel :', token);

  const decoded = this.auth.getDecodedToken();
  console.log('Token décodé :', decoded);

  console.log('Connecté ? ', this.auth.isLoggedIn());
  console.log('Rôles :', this.auth.getRoles());

  if (this.auth.isLoggedIn() && this.auth.hasRole('ResponsableSAV')) {
    this.loadCustomers(); // ✅ Charge les clients si autorisé
  }
}

  /** 🔹 Charger tous les clients (ResponsableSAV uniquement) */
  loadCustomers(): void {
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<Customer[]>(this.API_URL, { headers })
      .subscribe({
        next: (data) => {
          this.clients = data;
        },
        error: (err) => {
          console.error('Erreur chargement clients', err);
          alert('Impossible de charger la liste des clients');
        }
      });
  }

  /** 🔹 trackBy pour ngFor (OPTIMISATION + ERREUR FIXÉE) */
  trackByClientId(index: number, client: Customer): number {
    return client.id;
  }

  /** 🔹 Ouvrir modal ajout */
 openAddModal(): void {
  this.router.navigate(['/GestionClients/add']);
}


  /** 🔹 Ouvrir modal édition */
  openEditModal(client: Customer): void {
    this.router.navigate(['/customer-management/edit-customer', client.id]);
  }

  /** 🔹 Suppression client */
  confirmDelete(id?: number): void {
    if (!id) return;

    if (!confirm('Voulez-vous vraiment supprimer ce client ?')) return;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.delete(`${this.API_URL}/${id}`, { headers })
      .subscribe({
        next: () => {
          alert('Client supprimé');
          this.loadCustomers();
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          alert('Suppression impossible');
        }
      });
  }
}
