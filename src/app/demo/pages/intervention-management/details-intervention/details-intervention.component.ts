import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-details-intervention',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-intervention.component.html'
})
export class DetailsInterventionComponent implements OnInit {

  intervention: any;
  API_URL = 'https://localhost:7091/apigateway/interventions';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.load(id);
  }

  load(id: string | null) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get(`${this.API_URL}/${id}`, { headers })
      .subscribe(res => this.intervention = res);
  }
}
