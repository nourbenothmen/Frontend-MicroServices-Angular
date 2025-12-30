import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../pages/authentication/AuthService';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // 🔐 non connecté
    if (!this.auth.isLoggedIn()) {
      localStorage.setItem('redirectUrl', this.router.url);
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as string[];

    // 🔓 route sans rôle spécifique
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    // 🔒 vérification rôle
    const userRoles = this.auth.getRoles();
    const hasAccess = allowedRoles.some(r => userRoles.includes(r));

    if (!hasAccess) {
      this.router.navigate(['/analytics']); // ou page 403
      return false;
    }

    return true;
  }
}
