import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientStats {
  totalReclamations: number;
  enCours: number;
  terminees: number; // sans accent
  articles: number;
}


export interface Reclamation {
  id: number;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  interventionId?: number;
  serialNumber?: string;
  technicienName?: string;
  estSousGarantie?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientDashboardService {

  private apiUrl = 'https://localhost:7091/apigateway';

  constructor(private http: HttpClient) { }

  getClientStats(): Observable<ClientStats> {
    return this.http.get<ClientStats>(`${this.apiUrl}/dashboard/client/stats`);
  }

  getRecentReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/reclamations/my`);
  }
}
