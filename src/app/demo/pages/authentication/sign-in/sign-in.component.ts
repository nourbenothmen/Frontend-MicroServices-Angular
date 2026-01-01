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

  //private readonly REQUIRED_ROLE = 'ResponsableSAV';

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

  this.auth.login({ email: this.username, password: this.password }).subscribe({
    next: (res) => {
      const token = res.token;
      this.auth.saveToken(token);

      const roles = this.auth.getRoles();
      console.log('Roles:', roles);

      // 🔀 REDIRECTION SELON RÔLE
      if (roles.includes('ResponsableSAV')) {
        this.router.navigate(['/analytics']);
      } 
      else if (roles.includes('Client')) {
        this.router.navigate(['/client-dashboard']);
      } 
      else {
        this.errorMessage = 'Rôle inconnu.';
      }
    },
    error: () => {
      this.errorMessage = 'Email ou mot de passe incorrect.';
    }
  });
}

}
