import { Component, OnInit } from '@angular/core';
import { ClientDashboardService, ClientStats, Reclamation } from '../../../../app/demo/services/client-dashboard.service';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule], // <-- ajoute ça pour number, date
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {

  stats: ClientStats = { totalReclamations: 0, enCours: 0, terminees: 0, articles: 0 };

  recentReclamations: Reclamation[] = [];
  loadingStats = true;
  loadingReclamations = true;

  constructor(private dashboardService: ClientDashboardService) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentReclamations();
  }

  loadStats() {
    this.dashboardService.getClientStats().subscribe({
      next: (res) => { this.stats = res; this.loadingStats = false; },
      error: (err) => { console.error(err); this.loadingStats = false; }
    });
  }


  getStatusClass(status: string): string {
  switch (status) {
    case 'EnCours':
      return 'badge-warning';
    case 'Planifiée':
      return 'badge-info';
    case 'Terminée':
      return 'badge-success';
    case 'EnAttente':
      return 'badge-secondary';
    default:
      return 'badge-dark';
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


  loadRecentReclamations() {
    this.dashboardService.getRecentReclamations().subscribe({
      next: (res) => { this.recentReclamations = res; this.loadingReclamations = false; },
      error: (err) => { console.error(err); this.loadingReclamations = false; }
    });
  }
}
