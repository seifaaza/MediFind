import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzAlertModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  apiUrl = environment.API_URL;
  signUpForm: FormGroup;
  loading = false;
  errorMessage = '';
  passwordVisible = false;
  password?: string;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]], // Email field with validation
      password: ['', [Validators.required]],
    });
  }

  setAuthCookie(token: string): void {
    this.authService.setToken(token); // Use AuthService to save token
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) return;

    const { username, email, password } = this.signUpForm.value; // Include email
    this.loading = true;
    this.errorMessage = '';

    this.http
      .post(`${this.apiUrl}/auth/register`, { username, email, password })
      // Include email in the payload
      .subscribe({
        next: (response: any) => {
          console.log('Register successful', response);
          this.setAuthCookie(response.token);

          // Navigate to profile or other page
          this.router.navigate(['/profile']);
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.message || 'Invalid username, email, or password.';
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  signUpWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google/login`;
  }
}
