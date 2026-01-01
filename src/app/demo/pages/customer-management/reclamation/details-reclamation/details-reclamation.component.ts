// details-reclamation.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReclamationService } from '../../../../services/reclamation.service';
import { DecimalPipe, DatePipe, CommonModule } from '@angular/common'; // <-- Ajouté ici
import { AuthService } from '../../../../../demo/pages/authentication/AuthService';

@Component({
  selector: 'app-details-reclamation',
  templateUrl: './details-reclamation.component.html',
  standalone: true,              // si votre composant est standalone
  imports: [CommonModule, DecimalPipe, DatePipe] // <-- Ajouté ici
})
export class DetailsReclamationComponent implements OnInit {
  reclamation: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private reclamationService: ReclamationService,
    public authService: AuthService 
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.reclamationService.getReclamationById(id).subscribe({
      next: (data) => {
        this.reclamation = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement réclamation', err);
        this.loading = false;
      }
    });
  }
}
