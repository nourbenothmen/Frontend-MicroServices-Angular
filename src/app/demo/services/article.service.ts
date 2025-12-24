import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { CustomerArticle } from '../models/customer-article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'http://localhost:5000/api/articles';

  constructor(private http: HttpClient) {}

  /* ============================
     Gestion des Articles
     ============================ */

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  getArticleByReference(reference: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/reference/${reference}`);
  }

  getArticlesByCategorie(categorie: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/categorie/${categorie}`);
  }

  getArticlesByType(type: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/type/${type}`);
  }

  getArticlesByMarque(marque: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/marque/${marque}`);
  }

  searchArticles(searchTerm: string): Observable<Article[]> {
    const params = new HttpParams().set('q', searchTerm);
    return this.http.get<Article[]>(`${this.apiUrl}/search`, { params });
  }

  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  updateArticle(id: number, article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, article);
  }

  deleteArticle(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  updateStock(id: number, quantity: number): Observable<boolean> {
    const params = new HttpParams().set('quantity', quantity);
    return this.http.put<boolean>(`${this.apiUrl}/${id}/stock`, null, { params });
  }

  /* ============================
     Gestion des Articles Clients
     ============================ */

  getAllCustomerArticles(): Observable<CustomerArticle[]> {
    return this.http.get<CustomerArticle[]>(`${this.apiUrl}/customers`);
  }

  getCustomerArticleById(id: number): Observable<CustomerArticle> {
    return this.http.get<CustomerArticle>(`${this.apiUrl}/customers/${id}`);
  }

  getCustomerArticlesByClientId(clientId: number): Observable<CustomerArticle[]> {
    return this.http.get<CustomerArticle[]>(`${this.apiUrl}/customers/client/${clientId}`);
  }

  getCustomerArticlesByArticleId(articleId: number): Observable<CustomerArticle[]> {
    return this.http.get<CustomerArticle[]>(`${this.apiUrl}/customers/article/${articleId}`);
  }

  getCustomerArticleBySerialNumber(numeroSerie: string): Observable<CustomerArticle> {
    return this.http.get<CustomerArticle>(
      `${this.apiUrl}/customers/serial/${numeroSerie}`
    );
  }

  getCustomerArticlesSousGarantie(clientId: number): Observable<CustomerArticle[]> {
    return this.http.get<CustomerArticle[]>(
      `${this.apiUrl}/customers/client/${clientId}/garantie`
    );
  }

  createCustomerArticle(customerArticle: CustomerArticle): Observable<CustomerArticle> {
    return this.http.post<CustomerArticle>(
      `${this.apiUrl}/customers`,
      customerArticle
    );
  }

  updateCustomerArticle(
    id: number,
    customerArticle: CustomerArticle
  ): Observable<CustomerArticle> {
    return this.http.put<CustomerArticle>(
      `${this.apiUrl}/customers/${id}`,
      customerArticle
    );
  }

  deleteCustomerArticle(id: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.apiUrl}/customers/${id}`
    );
  }

  verifierGarantie(customerArticleId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/customers/${customerArticleId}/verifier-garantie`
    );
  }
}
