import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.prod';
import { BackComponent } from '../../../../../core/components/buttons/back/back.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-medical-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    BackComponent,
  ],
  templateUrl: './medical-info.component.html',
  styleUrls: ['./medical-info.component.css'],
})
export class MedicalInfoComponent implements OnInit {
  apiUrl = environment.API_URL;
  allergies: any[] = [];
  selectedAllergiesIds: string[] = [];
  healthGoals: any[] = [];
  selectedHealthGoalsIds: string[] = [];
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {
    this.fetchAllergies();
    this.fetchHealthGoals();
  }

  fetchAllergies(): void {
    this.http.get<any[]>(`${this.apiUrl}/initial-data/allergies`).subscribe({
      next: (response) => {
        this.allergies = response;
      },
      error: () => {
        this.message.error('Failed to load allergies data');
      },
    });
  }

  onAllergiesChange(event: any): void {
    if (Array.isArray(event)) {
      this.selectedAllergiesIds = event;
    } else {
      console.error('Unexpected event type for ngModelChange:', event);
    }
  }

  fetchHealthGoals(): void {
    this.http.get<any[]>(`${this.apiUrl}/initial-data/health-goals`).subscribe({
      next: (response) => {
        this.healthGoals = response;
      },
      error: () => {
        this.message.error('Failed to load health goals data');
      },
    });
  }

  onHealthGoalsChange(event: any): void {
    if (Array.isArray(event)) {
      this.selectedHealthGoalsIds = event;
    } else {
      console.error('Unexpected event type for ngModelChange:', event);
    }
  }
}
