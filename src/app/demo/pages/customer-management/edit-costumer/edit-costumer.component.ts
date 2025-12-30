import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../authentication/AuthService';

export interface UpdateCustomerRequest {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-edit-costumer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-costumer.component.html',
  styleUrls: ['./edit-costumer.component.scss']
})
export class EditCostumerComponent implements OnInit {

  customerId!: number;
  isLoading = true;

  customer: UpdateCustomerRequest = {
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  };

  private readonly API_URL = 'https://localhost:7091/apigateway/customers';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.customerId) {
      alert('ID client invalide');
      this.router.navigate(['/customer-management/liste-costumer']);
      return;
    }

    this.loadCustomer();
  }

  /** 🔹 Charger le client à modifier */
  loadCustomer(): void {
    const token = this.auth.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`${this.API_URL}/${this.customerId}`, { headers })
      .subscribe({
        next: (data) => {
          this.customer = {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            address: data.address
          };
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur chargement client', err);
          alert('Impossible de charger le client');
          this.router.navigate(['/customer-management/liste-costumer']);
        }
      });
  }

  /** 🔹 Enregistrer les modifications */
  onSave(): void {
    const token = this.auth.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.put(
      `${this.API_URL}/${this.customerId}`,
      this.customer,
      { headers }
    ).subscribe({
      next: () => {
        alert('Client modifié avec succès');
        this.router.navigate(['/customer-management/liste-costumer']);
      },
      error: (err) => {
        console.error('Erreur modification client', err);
        alert('Modification impossible');
      }
    });
  }

  /** 🔹 Annuler */
  onCancel(): void {
    this.router.navigate(['/customer-management/liste-costumer']);
  }
}
