import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthNoProfileGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && !this.authService.hasProfile()) {
      return true; // Allow access if authenticated and has a profile
    } else {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/auth/sign-in']); // Redirect to sign-in if not authenticated
      } else if (!this.authService.hasProfile()) {
        this.router.navigate(['/create-profile/personal-info']);
        // Redirect to create profile if no profile
      } else {
        this.router.navigate(['/profile']);
      }
      return false; // Block access if conditions are not met
    }
  }
}
