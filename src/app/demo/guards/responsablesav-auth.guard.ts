import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../pages/authentication/AuthService';

@Injectable({
  providedIn: 'root'
})
export class ResponsableSAVAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Vérifie si l'utilisateur est connecté via le service Auth
    if (this.auth.isLoggedIn() && this.auth.getRoles().includes('ResponsableSAV')) {
      return true;
    }

    // Sauvegarde l'URL demandée pour redirection après login
    localStorage.setItem('redirectUrl', state.url);

    // Redirige vers la page login
    return this.router.parseUrl('/login');
  }
}
