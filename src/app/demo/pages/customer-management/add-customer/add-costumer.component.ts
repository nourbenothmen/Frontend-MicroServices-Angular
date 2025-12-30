import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface CreateCustomerRequest {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-costumer.component.html',
  styleUrls: ['./add-costumer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  client: CreateCustomerRequest = {
    userId: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  };

  isEdit = false;

  private readonly API_URL = 'https://localhost:7091/apigateway/customers';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ici tu peux gérer le cas édition si nécessaire
  }

  onSave(): void {
    this.http.post(this.API_URL, this.client)
      .subscribe({
        next: (res) => {
          alert('Client ajouté avec succès !');
          this.router.navigate(['/customer-management/liste-costumer']);
        },
        error: (err) => {
          console.error('Erreur ajout client', err);
          alert('Impossible d’ajouter le client. Vérifie les informations.');
        }
      });
  }

  onClose(): void {
    this.router.navigate(['/customer-management/liste-costumer']);
  }
}