import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../authentication/AuthService';

interface Article {
  articleId: number;           // ← correspond à ton DTO
  displayName: string;         // ← correspond à ton DTO
  serialNumber?: string;
  estSousGarantie?: boolean;
}
interface CreateReclamationRequest {
  articleId: number;
  problemType?: string;           // nouveau
  description: string;
  desiredInterventionDate?: string; // format YYYY-MM-DD
}

@Component({
  selector: 'app-add-reclamation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.scss']
})
export class AddReclamationComponent implements OnInit {

  articles: Article[] = [];
  selectedArticleId: number | null = null;

  problemTypes: string[] = [
    'Fuite d\'eau',
    'Pas de chauffage',
    'Pas d\'eau chaude',
    'Bruit anormal (sifflement, bang)',
    'Odeur de gaz ou de brûlé',
    'Veilleuse/pilote qui s\'éteint',
    'Erreur / code panne sur l\'affichage',
    'Pression trop basse ou trop haute',
    'Fumée noire ou blanche',
    'Autre'
  ];

  reclamation: CreateReclamationRequest = {
    articleId: 0,
    problemType: '',
    description: '',
    desiredInterventionDate: ''
  };

  today: string = new Date().toISOString().split('T')[0]; // pour min sur le date picker

  private readonly RECLAMATIONS_API = 'https://localhost:7091/apigateway/reclamations';
  private readonly ARTICLES_API = 'https://localhost:7091/apigateway/articles/my'; // à adapter si différent

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMyArticles();
  }

  /** 🔹 Charger les articles appartenant au client connecté */
  private loadMyArticles(): void {
    const token = this.auth.getToken();
    if (!token) {
      alert('Vous devez être connecté.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<Article[]>(this.ARTICLES_API, { headers })
      .subscribe({
        next: (data) => {
          this.articles = data;
          if (data.length === 0) {
            alert('Aucun article trouvé dans votre compte. Contactez le SAV.');
          }
        },
        error: (err) => {
          console.error('Erreur chargement articles', err);
          alert('Impossible de charger vos articles.');
        }
      });
  }

  /** 🔹 Soumission du formulaire */
  onSave(): void {
    if (!this.selectedArticleId) {
      alert('Veuillez sélectionner un article concerné.');
      return;
    }

    if (!this.reclamation.description.trim()) {
      alert('Veuillez saisir une description.');
      return;
    }

    const token = this.auth.getToken();
    if (!token) {
      alert('Session expirée. Veuillez vous reconnecter.');
      return;
    }

    const payload: CreateReclamationRequest = {
      articleId: this.selectedArticleId,
      problemType: this.reclamation.problemType || undefined,
      description: this.reclamation.description.trim(),
      desiredInterventionDate: this.reclamation.desiredInterventionDate || undefined
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post(this.RECLAMATIONS_API, payload, { headers })
      .subscribe({
        next: () => {
          alert('Réclamation créée avec succès !');
          this.router.navigate(['/customer-management/my-reclamations']); // ou ta route de liste
        },
        error: (err) => {
          console.error('Erreur création réclamation', err);
          alert('Erreur lors de la création de la réclamation. Réessayez.');
        }
      });
  }

  /** 🔹 Annuler */
  onCancel(): void {
    this.router.navigate(['/customer-management/my-reclamations']);
  }
}