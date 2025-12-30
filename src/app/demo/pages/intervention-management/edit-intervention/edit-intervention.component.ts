import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-edit-intervention',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-intervention.component.html'
})
export class EditInterventionComponent implements OnInit {

  intervention: any = {};
  API_URL = 'https://localhost:7091/apigateway/interventions';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${this.API_URL}/${id}`)
      .subscribe(res => this.intervention = res);
  }

  save() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.put(`${this.API_URL}/${this.intervention.id}`, this.intervention, { headers })
      .subscribe(() => this.router.navigate(['/interventions']));
  }
}
