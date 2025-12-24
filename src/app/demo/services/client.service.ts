import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly API_URL = 'https://localhost:7091/apigateway/customers';

  constructor(private http: HttpClient) {}

  // 🔐 Header avec JWT
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ============================
  // GET ALL CUSTOMERS (Admin)
  // ============================
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.API_URL, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // GET CUSTOMER BY ID
  // ============================
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.API_URL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // GET MY PROFILE (Client)
  // ============================
  getMyProfile(): Observable<Customer> {
    return this.http.get<Customer>(`${this.API_URL}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // CREATE CUSTOMER
  // ============================
  createCustomer(data: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(this.API_URL, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // UPDATE CUSTOMER
  // ============================
  updateCustomer(id: number, data: Partial<Customer>): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================
  // DELETE CUSTOMER
  // ============================
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
