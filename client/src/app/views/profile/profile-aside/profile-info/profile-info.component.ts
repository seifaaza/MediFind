import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../../environments/environment.prod';
import { Subscription } from 'rxjs';
import { RecommendationsService } from '../../../../core/services/profile/recommendations.service';
@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, NzButtonComponent, NzIconModule, RouterModule],
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileInfoComponent {
  apiUrl = environment.API_URL;
  hasProfile: boolean | null = null;
  loading: boolean = true;
  profileData: any = null; // Store profile data
  username: string | null = null;
  categories: string[] = [];
  activityRecommendations: string[] = [];
  nutritionRecommendations: string[] = [];

  private usernameSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private message: NzMessageService,
    private recommendationsService: RecommendationsService
  ) {}

  ngOnInit(): void {
    this.authService.getHasProfile().subscribe((hasProfile) => {
      this.hasProfile = hasProfile;
      if (this.hasProfile) {
        this.getProfile(); // Fetch profile data if user has a profile
      } else {
        this.loading = false; // No need to load profile if it doesn't exist
      }
      this.usernameSubscription = this.authService
        .getUsername()
        .subscribe((username) => {
          this.username = username;
        });
    });
  }

  getProfile(): void {
    this.loading = true;
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${this.apiUrl}/profile`, { headers }).subscribe({
      next: (data) => {


        this.profileData = data;
        this.loading = false;

        if (this.profileData) {
          // Extract and store relevant data
          this.categories = this.profileData.categories || [];
          this.activityRecommendations =
            this.profileData.activity_recommendations || [];
          this.nutritionRecommendations =
            this.profileData.nutrition_recommendations || [];

          // Pass data to the RecommendationsService
          this.recommendationsService.setRecommendations(
            this.categories,
            this.activityRecommendations,
            this.nutritionRecommendations
          );
        }
      },
      error: () => {
        this.loading = false;
        this.message.create(
          'error',
          'Failed to get profile data. Please try again later!'
        );
      },
    });
  }
}
