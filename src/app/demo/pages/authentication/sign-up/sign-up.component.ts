import { Component } from '@angular/core';
import { AuthService } from '../AuthService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    roles: [] as { roleName: string }[]
  };
  selectedRole: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  // Met à jour le rôle choisi
  updateRoles() {
    this.user.roles = this.selectedRole ? [{ roleName: this.selectedRole }] : [];
    console.log('Rôles mis à jour :', this.user.roles);
  }

  // Inscription
  onRegister() {
    const minimalUser = { 
      username: this.user.username, 
      password: this.user.password, 
      roles: this.user.roles 
    };

    if (!minimalUser.username || !minimalUser.password || !minimalUser.roles.length) {
      alert('Veuillez remplir tous les champs et choisir un rôle.');
      return;
    }

    console.log('Données envoyées au register :', minimalUser);

    this.auth.register(minimalUser).subscribe({
      next: () => {
        alert('Inscription réussie');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur inscription:', err);
        alert('Erreur lors de l’inscription : ' + (err.error?.message || err.message));
      }
    });
  }
}
