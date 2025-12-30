import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

/* ===== Interface ===== */
interface Technicien {
  Id: number;
  Nom: string;
  Prenom: string;
  Telephone: string;
  Specialite: string;
}

@Component({
  selector: 'app-liste-technicien',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './liste-technicien.component.html',
  styleUrls: ['./liste-technicien.component.scss']
})
export class ListeTechnicienComponent implements OnInit {

  techniciens: Technicien[] = [];
  apiUrl = 'https://localhost:7091/apigateway/techniciens';
  token = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTechniciens();
  }

  getTechniciens(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.get<Technicien[]>(this.apiUrl, { headers })
      .subscribe({
        next: data => {
          console.log('Techniciens récupérés :', data);
          this.techniciens = data;
        },
        error: err => console.error('Erreur lors de la récupération', err)
      });
  }

  deleteTechnicien(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce technicien ?')) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.delete(`${this.apiUrl}/${id}`, { headers })
      .subscribe({
        next: () => {
          this.techniciens = this.techniciens.filter(t => t.Id !== id);
        },
        error: err => console.error('Erreur lors de la suppression', err)
      });
  }

  editTechnicien(id: number): void {
    this.router.navigate(['/techniciens/edit', id]);
  }

  viewTechnicien(id: number): void {
    this.router.navigate(['/techniciens/view', id]);
  }
}
