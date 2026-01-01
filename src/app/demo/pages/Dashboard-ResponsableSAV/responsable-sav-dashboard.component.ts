import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../app/demo/services/dashboard.service';

@Component({
  selector: 'app-responsable-sav-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './responsable-sav-dashboard.component.html',
  styleUrls: ['./responsable-sav-dashboard.component.scss']
})
export class ResponsableSavDashboardComponent implements OnInit {

  stats = {
    actives: 0,
    enAttente: 0,
    termineesCeMois: 0
  };

  interventionsDuJour: any[] = [];
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getReclamationsStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Erreur stats', err)
    });

    this.dashboardService.getInterventionsToday().subscribe({
      next: (data) => {
        this.interventionsDuJour = data;
        console.log('Interventions du jour', data);
        this.loading = false;
      },
      error: (err) => console.error('Erreur interventions', err)
    });
  }

  voirDetails(intervention: any) {
    console.log('Détails intervention', intervention);
  }
}
