import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private apiUrl = 'https://localhost:7091/apigateway/dashboard';

  constructor(private http: HttpClient) {}

  // ===== Stats Réclamations =====
  getReclamationsStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reclamations/stats`);
  }

  // ===== Interventions du jour =====
  getInterventionsToday(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/interventions/today`);
  }
}
