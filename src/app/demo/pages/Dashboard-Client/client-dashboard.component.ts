import { Component, OnInit } from '@angular/core';
import { ClientDashboardService, ClientStats, RecentReclamation} from '../../../../app/demo/services/client-dashboard.service';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { ReclamationStatusPipe } from '../../../../app/demo/pages/customer-management/reclamation/reclamation-status.pipe'; // ← Ajoute l'import du pipe
@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule,ReclamationStatusPipe], // <-- ajoute ça pour number, date
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {

  stats: ClientStats = { totalReclamations: 0, enCours: 0, terminees: 0, articles: 0 };

  recentReclamations: RecentReclamation[] = [];
  loadingStats = true;
  loadingReclamations = true;

  constructor(private dashboardService: ClientDashboardService) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentReclamations();
  }

loadStats() {
  this.dashboardService.getClientStats().subscribe({
    next: (res) => {
      this.stats = res;
      this.loadingStats = false;
    }
  });
}

loadRecentReclamations() {
  this.dashboardService.getRecentReclamations().subscribe({
    next: (res) => {
      console.log('Données réclamations récentes :', res); // ← VOILÀ !
      this.recentReclamations = res;
      this.loadingReclamations = false;
    },
    error: (err) => {
      console.error('Erreur API recent', err);
      this.loadingReclamations = false;
    }
  });
}

getStatusClass(status: string): string {
  switch (status) {
    case 'EnAttente': return 'badge en-attente';
    case 'Planifiée': return 'badge planifiee';
    case 'En cours': return 'badge en-cours';
    case 'Terminée': return 'badge terminee';
    default: return 'badge';
  }
}

getStatusLabel(status: string): string {
  switch (status) {
    case 'EnCours':
      return 'En cours';
    case 'Planifiée':
      return 'Planifiée';
    case 'Terminée':
      return 'Terminée';
    case 'EnAttente':
      return 'En attente';
    default:
      return status;
  }
}



}
