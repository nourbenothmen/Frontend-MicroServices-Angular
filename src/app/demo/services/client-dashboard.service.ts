import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientStats {
  totalReclamations: number;
  enCours: number;
  terminees: number;
  articles: number;
}

export interface RecentReclamation {
  id: number;
  articleNom: string;
  description: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  problemType?: string;
  desiredInterventionDate?: string;
  estSousGarantie: boolean;
  technicienNom?: string;
  montantTotal?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientDashboardService {
  private apiUrl = 'https://localhost:7091/apigateway/dashboard/client';

  constructor(private http: HttpClient) {}

  getClientStats(): Observable<ClientStats> {
    return this.http.get<ClientStats>(`${this.apiUrl}/stats`);
  }

  getRecentReclamations(): Observable<RecentReclamation[]> {
    return this.http.get<RecentReclamation[]>(`${this.apiUrl}/recent`);
  }
}