import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../models/intervention.model';
import { InterventionPart } from '../models/intervention-part.model';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  private apiUrl = 'http://localhost:5000/api/interventions';

  constructor(private http: HttpClient) {}

  /* ============================
     Gestion des interventions
     ============================ */

  getAllInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(this.apiUrl);
  }

  getInterventionById(id: number): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiUrl}/${id}`);
  }

  getInterventionsByClientId(clientId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(
      `${this.apiUrl}/client/${clientId}`
    );
  }

  getInterventionsByReclamationId(reclamationId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(
      `${this.apiUrl}/reclamation/${reclamationId}`
    );
  }

  createIntervention(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(
      this.apiUrl,
      intervention
    );
  }

  updateIntervention(id: number, intervention: Intervention): Observable<Intervention> {
    return this.http.put<Intervention>(
      `${this.apiUrl}/${id}`,
      intervention
    );
  }

  deleteIntervention(id: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.apiUrl}/${id}`
    );
  }

  /* ============================
     Gestion des pièces
     ============================ */

  addPartToIntervention(
    interventionId: number,
    part: InterventionPart
  ): Observable<InterventionPart> {
    return this.http.post<InterventionPart>(
      `${this.apiUrl}/${interventionId}/parts`,
      part
    );
  }

  removePartFromIntervention(
    interventionId: number,
    partId: number
  ): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.apiUrl}/${interventionId}/parts/${partId}`
    );
  }

  /* ============================
     Calculs
     ============================ */

  calculateTotalCost(interventionId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/${interventionId}/total-cost`
    );
  }
}
