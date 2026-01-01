import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Intervention, InterventionPart } from '../../../../models/intervention.model';
import { PdfMakeWrapper, Txt, Table, Columns, Cell } from 'pdfmake-wrapper';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cloture-facturation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cloture-facturation.component.html',
  styleUrls: ['./cloture-facturation.component.css', './print.styles.css'] // Ajoute ton fichier print
})
export class ClotureFacturationComponent implements OnInit {
    mode: 'edition' | 'impression' = 'edition';
 intervention: Intervention = {
  Id: 0,
  ReclamationId: 0,
  ClientId: 0,
  ArticleId: 0,                    // ← Ajouté ici
  ArticleNom: '',
  ClientNom: '',
  EstSousGarantie: false,
  TechnicienNom: '',
  DateIntervention: '',
  Description: '',                 // Optionnel, mais recommandé
  Pieces: [],
  DureeIntervention: 2,
  TarifHoraire: 40,
  MontantDeplacement: 15,
  TauxTVA: 0.19,
  ModePaiement: 'Espèces',
  StatutPaiement: 'Payé'
};

  newPart: InterventionPart = {
    Id: 0,
    InterventionId: 0,
    NomPiece: '',
    Quantite: 1,
    PrixUnitaire: 0,
    PrixTotal: 0
  };

  sousTotalPieces = 0;
  montantMainOeuvre = 0;
  totalHT = 0;
  tvaAmount = 0;
  totalTTC = 0;

  API_URL = 'https://localhost:7091/apigateway/interventions';

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private http: HttpClient
  ) {}

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  const modeParam = this.route.snapshot.queryParamMap.get('mode');
  this.mode = modeParam === 'impression' ? 'impression' : 'edition';

  if (id) {
    this.loadIntervention(+id);
  }
}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }


loadIntervention(id: number) {
  this.http.get<Intervention>(`${this.API_URL}/${id}`, { headers: this.getHeaders() })
    .subscribe({
      next: (data) => {
        this.intervention = { ...data };

        // Observables pour récupérer les noms
        const client$ = this.http.get<any>(`https://localhost:7091/apigateway/customers/${data.ClientId}`, { headers: this.getHeaders() });
        const article$ = this.http.get<{nom: string}>(`https://localhost:7091/apigateway/articles/${data.ArticleId}`, { headers: this.getHeaders() });

        forkJoin([client$, article$]).subscribe({
          next: ([clientRes, articleRes]) => {
            // Combine firstName et lastName
            this.intervention.ClientNom = `${clientRes.firstName} ${clientRes.lastName}`;
            this.intervention.ArticleNom = articleRes.nom;

            this.calculateTotals();

            if (this.mode === 'impression') {
              setTimeout(() => this.genererFacturePdf(), 200);
            }
          },
          error: (err) => console.error('Erreur récupération noms:', err)
        });
      },
      error: (err) => console.error('Erreur chargement intervention:', err)
    });
}



  addPart() {
    if (!this.newPart.NomPiece || this.newPart.PrixUnitaire <= 0) {
      alert('Veuillez remplir le nom et le prix de la pièce');
      return;
    }

    this.newPart.PrixTotal = this.newPart.Quantite * this.newPart.PrixUnitaire;
    this.newPart.InterventionId = this.intervention.Id;

    this.http.put<InterventionPart>(
      `${this.API_URL}/${this.intervention.Id}/parts`,
      this.newPart,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (part) => {
        this.intervention.Pieces.push(part);
        this.newPart = { Id: 0, InterventionId: 0, NomPiece: '', Quantite: 1, PrixUnitaire: 0, PrixTotal: 0 };
        this.calculateTotals();
      },
      error: (err) => {
        console.error('Erreur ajout pièce', err);
        alert('Erreur lors de l\'ajout de la pièce');
      }
    });
  }


  deletePart(partId: number) {
    if (!confirm('Supprimer cette pièce ?')) return;

    this.http.delete(`${this.API_URL}/parts/${partId}`, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.intervention.Pieces = this.intervention.Pieces.filter(p => p.Id !== partId);
          this.calculateTotals();
        },
        error: (err) => {
          console.error('Erreur suppression pièce', err);
          alert('Erreur lors de la suppression');
        }
      });
  }

  calculateTotals() {
    this.sousTotalPieces = this.intervention.Pieces.reduce((sum, p) => sum + p.PrixTotal, 0);
    this.montantMainOeuvre = this.intervention.DureeIntervention * this.intervention.TarifHoraire;
    this.totalHT = this.sousTotalPieces + this.montantMainOeuvre + this.intervention.MontantDeplacement;
    this.tvaAmount = this.totalHT * this.intervention.TauxTVA;
    this.totalTTC = this.totalHT + this.tvaAmount;
  }

submitAndGeneratePdf() {
  const body = {
    DureeIntervention: this.intervention.DureeIntervention,
    TarifHoraire: this.intervention.TarifHoraire,
    MontantDeplacement: this.intervention.MontantDeplacement,
    TauxTVA: this.intervention.TauxTVA,
    ModePaiement: this.intervention.ModePaiement,
    StatutPaiement: this.intervention.StatutPaiement
  };

  this.http.put<Intervention>(
    `${this.API_URL}/${this.intervention.Id}/close`,
    body,
    { headers: this.getHeaders() }
  ).subscribe({
    next: (updated) => {
      // 1. Génère le PDF
      this.genererFacturePdf();

      // 2. Met à jour le statut de l'intervention à "Terminée"
      this.updateInterventionStatusToTerminee();

      alert('Intervention clôturée et facture générée avec succès !');
      this.router.navigate(['/interventions']);
    },
    error: (err) => {
      console.error('Erreur clôture', err);
      alert('Erreur lors de la clôture de l\'intervention');
    }
  });
}

// Nouvelle méthode : met à jour le statut intervention + réclamation
private updateInterventionStatusToTerminee() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const body = { Statut: 'Terminée' };

  this.http.patch(`${this.API_URL}/${this.intervention.Id}/status`, body, { headers })
    .subscribe({
      next: () => {
        console.log(`Intervention ${this.intervention.Id} → Terminée`);

        // Synchronisation de la réclamation
        this.updateReclamationStatus(this.intervention.ReclamationId, 'Terminée');
      },
      error: (err) => console.error('Erreur mise à jour statut intervention', err)
    });
}

// Réutilise ta méthode existante
private updateReclamationStatus(reclamationId: number, newStatus: string) {
  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const body = { Statut: newStatus };

  this.http.patch(
    `https://localhost:7091/apigateway/reclamations/${reclamationId}/status`,
    body,
    { headers }
  ).subscribe({
    next: () => {
      console.log(`Réclamation ${reclamationId} → ${newStatus}`);
      // Optionnel : reload pour voir le changement immédiatement
      // window.location.reload();
    },
    error: (err) => {
      console.error('Erreur synchronisation réclamation', err);
    }
  });
}
genererFacturePdf() {
  const factureElement = document.querySelector('.container') as HTMLElement;

  if (!factureElement) {
    alert('Élément facture non trouvé');
    return;
  }

  // Optionnel : masquer temporairement les boutons en mode impression
  const boutons = factureElement.querySelectorAll('button');
  boutons.forEach(b => b.style.display = 'none');

  html2canvas(factureElement, {
    scale: 2, // meilleure qualité
    useCORS: true, // pour les images externes si besoin
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`facture-INT-${String(this.intervention.Id).padStart(3, '0')}.pdf`);

    // Réafficher les boutons
    boutons.forEach(b => b.style.display = '');
  });
}
}