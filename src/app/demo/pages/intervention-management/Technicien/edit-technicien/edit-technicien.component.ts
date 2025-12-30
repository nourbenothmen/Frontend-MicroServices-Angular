import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-edit-technicien',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './edit-technicien.component.html',
  styleUrls: ['./edit-technicien.component.scss']
})
export class EditTechnicienComponent implements OnInit {

  technicienId!: number;

  technicien = {
    nom: '',
    prenom: '',
    //email: '',
    telephone: '',
    specialite: ''
  };

  apiUrl = 'https://localhost:7091/apigateway/techniciens';
  token = localStorage.getItem('token');

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.technicienId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTechnicien();
  }

  loadTechnicien(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.get<any>(`${this.apiUrl}/${this.technicienId}`, { headers })
      .subscribe({
        next: data => {
          this.technicien = {
            nom: data.Nom,
            prenom: data.Prenom,
            //email: data.Email,
            telephone: data.Telephone,
            specialite: data.Specialite
          };
        },
        error: err => {
          console.error(err);
          alert('Erreur lors du chargement du technicien ❌');
        }
      });
  }

submit(): void {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json'
  });

  const body = {
    id: this.technicienId,           // ⚠️ Obligatoire
    nom: this.technicien.nom,
    prenom: this.technicien.prenom,
    //email: this.technicien.email,
    telephone: this.technicien.telephone,
    specialite: this.technicien.specialite
  };

  this.http.put(`${this.apiUrl}/${this.technicienId}`, body, { headers })
    .subscribe({
      next: () => {
        alert('Technicien modifié avec succès ✅');
        this.router.navigate(['/techniciens']);
      },
      error: err => {
        console.error(err);
        alert('Erreur lors de la modification ❌');
      }
    });
}

}
