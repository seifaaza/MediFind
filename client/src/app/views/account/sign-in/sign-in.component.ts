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
  selector: 'app-sign-in',
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
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  signInForm: FormGroup;
  loading = false;
  errorMessage = '';
  apiUrl = environment.API_URL;
  passwordVisible = false;
  password?: string;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  setAuthCookie(token: string): void {
    this.authService.setToken(token); // Use AuthService to save token
  }

  onSubmit(): void {
    if (this.signInForm.invalid) return;

    const { username, password } = this.signInForm.value;
    this.loading = true;
    this.errorMessage = '';

    this.http
      .post(`${this.apiUrl}/auth/login`, { username, password })
      .subscribe({
        next: (response: any) => {
          this.setAuthCookie(response.token);

          // Navigate to profile or other page
          this.router.navigate(['/profile']);
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || 'Invalid username or password.';
        },
      });
  }

  signInWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google/login`;
  }
}
