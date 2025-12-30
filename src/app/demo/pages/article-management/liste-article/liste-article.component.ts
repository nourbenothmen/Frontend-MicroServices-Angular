import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/AuthService'; // Ajuster le chemin

export interface Article {
  id: number;
  nom: string;
  reference: string;
  categorie: string;
  type: string;
  marque: string;
  modele: string;
  prix: number;
  stock: number;
  estDisponible: boolean;
  dateCreation: string;
  dateMiseAJour?: string;
}

@Component({
  selector: 'app-liste-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-article.component.html',
  styleUrls: ['./liste-article.component.scss']
})
export class ListeArticleComponent implements OnInit {

  articles: Article[] = [];
  private readonly API_URL = 'https://localhost:7091/apigateway/articles';

  constructor(
    private http: HttpClient,
    public router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  /** 🔹 Charger tous les articles */
  loadArticles(): void {
    const token = this.auth.getToken();
    if (!token) {
      alert('Vous devez être connecté');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Article[]>(this.API_URL, { headers })
      .subscribe({
        next: (data) => this.articles = data,
        error: (err) => console.error('Erreur chargement articles', err)
      });
  }

  /** 🔹 trackBy pour optimisation */
  trackByArticleId(index: number, article: Article): number {
    return article.id;
  }

  /** 🔹 Ouvrir modal édition ou détails */
  openEditModal(article: Article): void {
    this.router.navigate(['/GestionArticles/edit-article', article.id]);
  }

  /** 🔹 Supprimer un article */
  confirmDelete(id?: number): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;

    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.API_URL}/${id}`, { headers })
      .subscribe({
        next: () => {
          alert('Article supprimé');
          this.loadArticles();
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          alert('Impossible de supprimer cet article');
        }
      });
  }
}
