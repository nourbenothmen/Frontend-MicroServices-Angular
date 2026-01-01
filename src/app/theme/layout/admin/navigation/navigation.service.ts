import { Injectable } from '@angular/core';
import { NavigationItems, NavigationItem } from './navigation';
import { AuthService } from '../../../../../app/demo/pages/authentication/AuthService';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private authService: AuthService) {}

  getMenu(): NavigationItem[] {
    const isLoggedIn = this.authService.isLoggedIn();
    const roles = this.authService.getRoles();

    return NavigationItems
      .map(group => {

        // 🔐 CACHER Connexion / Inscription SI CONNECTÉ
        if (group.id === 'authentication' && isLoggedIn) {
          return null;
        }

        // 🎭 Filtrage par rôles
        if (group.children) {
          group.children = group.children.filter(item => {
            if (!item.roles) return true;
            return item.roles.some(role => roles.includes(role));
          });
        }

        return group;
      })
      .filter(Boolean) as NavigationItem[];
  }
}
