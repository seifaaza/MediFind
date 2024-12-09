import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  private usernameSubject = new BehaviorSubject<string | null>(null);
  private idSubject = new BehaviorSubject<string | null>(null);

  constructor(private cookieService: CookieService) {
    const decodedToken = this.getDecodedToken();
    this.usernameSubject.next(decodedToken ? decodedToken.username : null); // Initialize usernameSubject
    this.idSubject.next(decodedToken ? decodedToken.id : null); // Initialize idSubject
  }

  // Save token to cookies
  setToken(token: string): void {
    this.cookieService.set(this.tokenKey, token, {
      path: '/',
      secure: true,
      sameSite: 'Lax',
      expires: 90 * 24 * 60 * 60, // 90 days
    });

    // Extract username from token and update subject
    const decodedToken = this.getDecodedToken();
    this.usernameSubject.next(decodedToken ? decodedToken.username : null);
    this.idSubject.next(decodedToken ? decodedToken.id : null);
  }

  // Retrieve token from cookies
  getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }

  // Decode token and extract user data
  getDecodedToken(): { id: string; username: string } | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string; username: string }>(token);
        return decoded;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Observable for username
  getUsername(): BehaviorSubject<string | null> {
    return this.usernameSubject;
  }

  getId(): BehaviorSubject<string | null> {
    return this.idSubject;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Logout user by deleting the token
  logout(): void {
    this.cookieService.delete(this.tokenKey, '/'); // Remove the token cookie
    this.usernameSubject.next(null); // Reset the username observable
    this.idSubject.next(null); // Reset the username observable
  }
}
