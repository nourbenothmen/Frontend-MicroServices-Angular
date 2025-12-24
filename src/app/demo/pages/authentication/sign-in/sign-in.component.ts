import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../AuthService';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';

  errorMessage = '';
  infoMessage = '';
  errorType: 'role' | 'credentials' | 'other' | 'ResponsableSAV' | null = null;

  private readonly REQUIRED_ROLE = 'ResponsableSAV';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const redirectUrl = localStorage.getItem('redirectUrl');
    if (redirectUrl) {
      this.infoMessage = 'Veuillez vous connecter pour accéder à cette page.';
      localStorage.removeItem('redirectUrl');
    }
  }

  onLogin() {
    this.errorMessage = '';
    this.errorType = null;
    this.infoMessage = '';

    this.auth.login({ email: this.username, password: this.password }).subscribe({
      next: (res) => {
        try {
          // 🔹 Suppose que ton API renvoie directement un token JWT ou les rôles
          // Par exemple res.token contient le JWT
          const token = res['token']; // <-- adapte selon la clé réelle de ton API
          if (!token) throw new Error('Token non présent dans la réponse');

          const decoded = jwtDecode<any>(token);

// Normaliser roles en tableau
let roles: string[] = [];

if (decoded.roles) {
  roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
} else if (decoded.role) {  // ton champ role
  roles = [decoded.role];
} else if (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
  roles = [decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']];
}
console.log('Roles:', roles);

if (roles.includes(this.REQUIRED_ROLE)) {
  const redirectUrl = localStorage.getItem('redirectUrl') || '/analytics';
  localStorage.removeItem('redirectUrl');
  this.router.navigateByUrl(redirectUrl);
} else {
  this.errorMessage = 'Accès interdit : vous devez être ResponsableSAV.';
  this.errorType = 'role';
}
        } catch (e) {
          console.error('Erreur lors du traitement de la réponse login', e);
          this.errorMessage = 'Réponse invalide du serveur.';
          this.errorType = 'other';
        }
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = 'Accès interdit : vous devez être ResponsableSAV.';
          this.errorType = 'ResponsableSAV';
        } else if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
          this.errorType = 'credentials';
        } else {
          this.errorMessage = 'Erreur de connexion.';
          this.errorType = 'other';
        }
      }
    });
  }
}
