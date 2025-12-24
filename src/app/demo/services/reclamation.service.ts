import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export enum ReclamationStatus {
  EnAttente = 0,
  EnCours = 1,
  Resolue = 2
}

export interface Reclamation {
  id: number;
  articleId: number;
  description: string;
  status: ReclamationStatus;
  createdAt: string;
  resolvedAt?: string;
}

export interface CreateReclamationRequest {
  articleId: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private readonly API_URL = 'https://localhost:7091/apigateway/reclamations';

  constructor(private http: HttpClient) {}

  // 🔐 JWT Header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ============================
  // CREATE RECLAMATION (Client)
  // ============================
  createReclamation(data: CreateReclamationRequest): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.API_URL, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // GET MY RECLAMATIONS (Client)
  // ============================
  getMyReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.API_URL}/my`, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // GET ALL RECLAMATIONS (ResponsableSAV)
  // ============================
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.API_URL, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // GET RECLAMATION BY ID
  // ============================
  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.API_URL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // UPDATE STATUS (ResponsableSAV)
  // ============================
  updateStatus(id: number, status: ReclamationStatus): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/${id}`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }
}
