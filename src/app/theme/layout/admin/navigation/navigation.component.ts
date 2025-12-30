// Angular Import
import { Component, output, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavContentComponent } from './nav-content/nav-content.component';
import { NavigationItem } from './navigation';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [SharedModule, NavContentComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  // public props
  windowWidth: number;
  NavMobCollapse = output();

  navigationItems: NavigationItem[] = []; // ✅ MENU FILTRÉ

  constructor(private navService: NavigationService) {
    this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    // 🔐 menu filtré selon les rôles
    this.navigationItems = this.navService.getMenu();
  }

  // public method
  navMobCollapse() {
    if (this.windowWidth < 992) {
      this.NavMobCollapse.emit();
    }
  }
}
