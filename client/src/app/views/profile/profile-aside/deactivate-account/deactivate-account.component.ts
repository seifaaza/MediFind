import { Component } from '@angular/core';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router'; // Import Router for redirection
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-deactivate-account',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzModalModule],
  templateUrl: './deactivate-account.component.html',
  styleUrls: ['./deactivate-account.component.css'],
})
export class DeactivateAccountComponent {
  isVisible = false;
  loading = false;

  constructor(
    private modal: NzModalService,
    private http: HttpClient, // Inject HttpClient
    private authService: AuthService, // Inject AuthService
    private router: Router // Inject Router for redirection
  ) {}

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.loading = true;

    const token = this.authService.getToken(); // Get the current token from AuthService
    const headers = { Authorization: `Bearer ${token}` }; // Set the authorization header

    // Make the API call to deactivate the account
    this.http.delete('http://localhost:8000/profile', { headers }).subscribe({
      next: () => {
        // On success, log out the user and redirect to home
        this.authService.logout();
        this.router.navigate(['/']); // Redirect to the home page
        this.isVisible = false; // Close the modal
        this.loading = false; // Hide loading icon
      },
      error: (error) => {
        // Handle any errors that occur during the API request
        console.error('Error deactivating account:', error);
        this.loading = false; // Hide loading icon
        this.isVisible = false; // Close the modal
      },
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
