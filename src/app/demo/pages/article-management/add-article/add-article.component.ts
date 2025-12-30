import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface CreateArticleRequest {
  nom: string;
  reference: string;
  description?: string;
  categorie: string;
  type?: string;
  marque?: string;
  modele?: string;
  prix: number;
  dureeGarantie: number;
  estDisponible: boolean;
  stock: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-add-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {

  article: CreateArticleRequest = {
    nom: '',
    reference: '',
    description: '',
    categorie: '',
    type: '',
    marque: '',
    modele: '',
    prix: 0,
    dureeGarantie: 0,
    estDisponible: true,
    stock: 0,
    imageUrl: ''
  };

  private readonly API_URL = 'https://localhost:7091/apigateway/articles';

  constructor(
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Ici tu peux gérer le cas édition si nécessaire
  }

  submit(): void {
    // Validation simple avant envoi
    if (!this.article.nom || !this.article.reference || !this.article.categorie || this.article.prix < 0 || this.article.dureeGarantie < 0 || this.article.stock < 0) {
      alert('Veuillez remplir tous les champs obligatoires correctement.');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    this.http.post(this.API_URL, this.article, { headers })
      .subscribe({
        next: () => {
          alert('Article ajouté avec succès !');
          this.router.navigate(['/GestionArticles']);
        },
        error: (err) => {
          console.error('Erreur ajout article', err);
          alert('Impossible d’ajouter l’article. Vérifie les informations.');
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/GestionArticles']);
  }
}
