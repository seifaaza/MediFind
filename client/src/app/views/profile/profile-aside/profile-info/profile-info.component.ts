import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, NzButtonComponent, NzIconModule, RouterModule],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileInfoComponent {
  apiUrl = environment.API_URL;
  hasProfile: boolean | null = null;
  loading: boolean = true;
  profileData: any = null; // Store profile data here

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.authService.getHasProfile().subscribe((hasProfile) => {
      this.hasProfile = hasProfile;
      if (this.hasProfile) {
        this.getProfile(); // Fetch profile data if user has a profile
      } else {
        this.loading = false; // No need to load profile if it doesn't exist
      }
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
