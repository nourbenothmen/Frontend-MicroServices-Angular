import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common'; // <-- Importé pour ngClass et date
import { AuthService } from '../../../pages/authentication/AuthService';
import { Router } from '@angular/router';


interface Article {
  id: number;
  nom: string;
  numeroSerie: string;
  dateAchat: string;
  dateFinGarantie: string;
  estSousGarantie: boolean;
}

@Component({
  selector: 'app-mesarticles',
  templateUrl: './mesarticles.component.html',
  styleUrls: ['./mesarticles.component.scss'],
  standalone: true,                    // <-- Si ton composant est standalone
  imports: [CommonModule, DatePipe]    // <-- Ajouté ici
})
export class MesArticlesComponent implements OnInit {

  articles: Article[] = [];
  loading: boolean = true;
  error: string = '';
    private readonly ARTICLES_API = 'https://localhost:7091/apigateway/articles/my'; // à adapter si différent

  constructor(private http: HttpClient,
    private router: Router,
    private auth: AuthService) {}

  ngOnInit(): void {
    this.loadMyArticles();
  }

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

this.http.get<any[]>(this.ARTICLES_API, { headers })
  .subscribe({
    next: (data) => {
      console.log('Articles reçus :', data);
      // Mapper les propriétés de l'API vers notre interface
      this.articles = data.map(a => ({
        id: a.articleId,
        nom: a.displayName,
        numeroSerie: a.serialNumber,
        dateAchat: '', // pas fourni par l'API
        dateFinGarantie: a.dateFinGarantie,
        estSousGarantie: a.estSousGarantie
      }));
      this.loading = false;
      if (this.articles.length === 0) {
        alert('Aucun article trouvé dans votre compte.');
      }
    },
    error: (err) => {
      console.error('Erreur chargement articles', err);
      this.error = 'Impossible de charger vos articles.';
      this.loading = false;
    }
  });
    }

}
