import { Injectable } from '@angular/core';
import { NavigationItems, NavigationItem } from './navigation';
import { AuthService } from 'src/app/demo/pages/authentication/AuthService';

@Injectable({ providedIn: 'root' })
export class NavigationService {

  constructor(private auth: AuthService) {}

  getMenu(): NavigationItem[] {
    const userRoles = this.auth.getRoles();

    return NavigationItems.map(group => ({
      ...group,
      children: group.children?.filter(item =>
        !item.roles || item.roles.some(role => userRoles.includes(role))
      )
    })).filter(group => group.children && group.children.length > 0);
  }
}
