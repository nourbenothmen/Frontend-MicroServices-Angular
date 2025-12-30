import { Component } from '@angular/core';
import { AuthService } from '../AuthService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {

  user = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  onRegister() {
    // Réinitialiser les messages
    this.errorMessage = '';
    this.successMessage = '';

    // Vérification simple des champs
    if (Object.values(this.user).some(v => !v)) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.user.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    console.log('Envoi inscription :', this.user);

    this.auth.register(this.user).subscribe({
      next: (res: any) => {
        console.log('Inscription OK', res);
        this.successMessage = 'Inscription réussie. Redirection vers la connexion...';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        console.error('Erreur inscription', err);
        // Regrouper tous les messages d'erreur
        this.errorMessage = err.error?.errors
          ? Object.values(err.error.errors).flat().join(' ')
          : err.error?.message || 'Erreur lors de l\'inscription. Vérifiez votre mot de passe.';
      }
    });
  }
}
