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
  private hasProfileSubject = new BehaviorSubject<boolean | null>(null);

  constructor(private cookieService: CookieService) {
    const decodedToken = this.getDecodedToken();
    this.usernameSubject.next(decodedToken ? decodedToken.username : null);
    this.idSubject.next(decodedToken ? decodedToken.id : null);
    this.hasProfileSubject.next(decodedToken ? decodedToken.has_profile : null);
  }

  // Save token to cookies
  setToken(token: string): void {
    this.cookieService.set(this.tokenKey, token, {
      path: '/',
      secure: true,
      sameSite: 'Lax',
      expires: 90 * 24 * 60 * 60, // 90 days
    });

    const decodedToken = this.getDecodedToken();
    this.usernameSubject.next(decodedToken ? decodedToken.username : null);
    this.idSubject.next(decodedToken ? decodedToken.id : null);
    this.hasProfileSubject.next(decodedToken ? decodedToken.has_profile : null);
  }

  // Retrieve token from cookies
  getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }

  // Decode token and extract user data
  getDecodedToken(): {
    id: string;
    username: string;
    has_profile: boolean;
  } | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<{
          id: string;
          username: string;
          has_profile: boolean;
        }>(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  // Observable for username
  getUsername(): BehaviorSubject<string | null> {
    return this.usernameSubject;
  }

  // Observable for user ID
  getId(): BehaviorSubject<string | null> {
    return this.idSubject;
  }

  // Observable for hasProfile
  getHasProfile(): BehaviorSubject<boolean | null> {
    return this.hasProfileSubject;
  }

  // Check if user has profile
  hasProfile(): boolean {
    const hasProfileValue = this.hasProfileSubject.getValue();
    return hasProfileValue === true;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Logout user by deleting the token
  logout(): void {
    this.cookieService.delete(this.tokenKey, '/'); // Remove the token cookie
    this.usernameSubject.next(null); // Reset the username observable
    this.idSubject.next(null); // Reset the ID observable
    this.hasProfileSubject.next(null); // Reset the hasProfile observable
  }
}
