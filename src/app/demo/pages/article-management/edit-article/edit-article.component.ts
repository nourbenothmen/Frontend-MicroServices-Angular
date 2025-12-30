import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Article {
  id: string; // ou number selon ton API
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
  selector: 'app-edit-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {

  article: Article = {
    id: '',
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(id);
    }
  }

  loadArticle(id: string): void {
    this.http.get<Article>(`${this.API_URL}/${id}`).subscribe({
      next: (res) => this.article = res,
      error: (err) => {
        console.error('Erreur chargement article', err);
        alert('Impossible de charger l’article.');
        this.router.navigate(['/GestionArticles']);
      }
    });
  }

  onSave(): void {
    if (!this.article.nom || !this.article.reference || !this.article.categorie) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    this.http.put(`${this.API_URL}/${this.article.id}`, this.article, { headers }).subscribe({
      next: () => {
        alert('Article modifié avec succès !');
        this.router.navigate(['/GestionArticles']);
      },
      error: (err) => {
        console.error('Erreur modification article', err);
        alert('Impossible de modifier l’article.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/GestionArticles']);
  }
}
