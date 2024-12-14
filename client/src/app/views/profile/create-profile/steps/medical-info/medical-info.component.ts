import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.prod';
import { BackComponent } from '../../../../../core/components/buttons/back/back.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormService } from '../../../../../core/services/profile/form.service';

@Component({
  selector: 'app-medical-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    BackComponent,
    RouterModule,
  ],
  templateUrl: './medical-info.component.html',
  styleUrls: ['./medical-info.component.css'],
})
export class MedicalInfoComponent implements OnInit {
  apiUrl = environment.API_URL;
  selectedMedications: string[] = [];
  allergies: any[] = [];
  selectedAllergiesIds: string[] = [];
  healthGoals: any[] = [];
  selectedHealthGoalsIds: string[] = [];
  loading = false;
  errorMessage = '';
  personalInfo: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private message: NzMessageService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.fetchAllergies();
    this.fetchHealthGoals();

    // Retrieve stored personal information and medical data from sessionStorage
    const storedData = sessionStorage.getItem('profileData');
    if (storedData) {
      this.personalInfo = JSON.parse(storedData); // Load existing personal info
      this.selectedMedications =
        this.personalInfo.personalized_medications || [];
      this.selectedAllergiesIds = this.personalInfo.allergies || [];
      this.selectedHealthGoalsIds = this.personalInfo.health_goals || [];
    }
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

  onAllergiesChange(event: any): void {
    if (Array.isArray(event)) {
      this.selectedAllergiesIds = event;
      this.storeDataInSession(); // Store data in sessionStorage
      console.log(this.selectedAllergiesIds);
    }
  }

  onHealthGoalsChange(event: any): void {
    if (Array.isArray(event)) {
      this.selectedHealthGoalsIds = event;
      this.storeDataInSession(); // Store data in sessionStorage
      console.log(this.selectedHealthGoalsIds);
    }
  }

  onMedicationsChange(event: any): void {
    this.selectedMedications = event;
    this.storeDataInSession(); // Store data in sessionStorage
  }

  // Method to store data in sessionStorage
  storeDataInSession() {
    const profileData = {
      ...this.personalInfo, // Spread the personal information from ngOnInit
      personalized_medications: this.selectedMedications,
      allergies: this.selectedAllergiesIds,
      health_goals: this.selectedHealthGoalsIds,
    };

    sessionStorage.setItem('profileData', JSON.stringify(profileData));
  }

  setAuthCookie(token: string): void {
    this.authService.setToken(token); // Use AuthService to save token
  }

  // Method to handle the form submission
  onSubmit() {
    const profileData = {
      ...this.personalInfo, // Spread the personal information from step 1
      personalized_medications: this.selectedMedications, // Include selected medications
      allergies: this.selectedAllergiesIds, // Include selected allergies IDs
      health_goals: this.selectedHealthGoalsIds, // Include selected health goals IDs
    };

    const token = this.authService.getToken(); // Retrieve the token from AuthService

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Make the API call to submit the data
    this.loading = true; // Set loading to true before the API call

    this.http
      .post(`${this.apiUrl}/profile`, profileData, { headers })
      .subscribe({
        next: (response: any) => {
          this.setAuthCookie(response.token);
          if (response && response.category_ids) {
            localStorage.setItem(
              'categoryIds',
              JSON.stringify(response.category_ids)
            );
          }
          this.loading = false;
          this.router.navigate(['/profile']);
          sessionStorage.clear();
        },
        error: () => {
          this.message.error('Failed to complete profile');
          this.loading = false;
        },
      });
  }

  // Method to check if all form fields, including those in FormService, are empty
  isFormEmpty(): boolean {
    // Check the fields in the current component
    const storedFormData = this.formService.getFormData('profileData');
    const isMedicationsEmpty =
      !storedFormData?.personalized_medications ||
      storedFormData.personalized_medications.length === 0;
    const isAllergiesEmpty =
      !storedFormData?.allergies || storedFormData.allergies.length === 0;
    const isHealthGoalsEmpty =
      !storedFormData?.health_goals || storedFormData.health_goals.length === 0;

    // Retrieve data from FormService and check if it is empty

    const isStoredDataEmpty =
      !storedFormData ||
      Object.keys(storedFormData).every((key) => {
        const value = storedFormData[key];
        return (
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'object' && Object.keys(value).length === 0)
        );
      });

    // Return true if both the local and stored data are empty
    return (
      isMedicationsEmpty &&
      isAllergiesEmpty &&
      isHealthGoalsEmpty &&
      isStoredDataEmpty
    );
  }

  clearSessionAndNavigate(): void {
    // Clear sessionStorage
    sessionStorage.clear();

    // Navigate to the medicines page
    this.router.navigate(['/medicines']);
  }
}
