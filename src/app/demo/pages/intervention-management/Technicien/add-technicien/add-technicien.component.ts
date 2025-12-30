import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-technicien',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './add-technicien.component.html',
  styleUrls: ['./add-technicien.component.scss']
})
export class AddTechnicienComponent {

  technicien = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: ''
  };

  apiUrl = 'https://localhost:7091/apigateway/techniciens';
  token = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  submit(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(this.apiUrl, this.technicien, { headers })
      .subscribe({
        next: () => {
          alert('Technicien ajouté avec succès ✅');
          this.router.navigate(['/techniciens']);
        },
        error: err => {
          console.error(err);
          alert('Erreur lors de l’ajout ❌');
        }
      });
  }
}
