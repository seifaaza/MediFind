import { Injectable, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(error: any): void {
    console.error('An error occurred:', error);

    // Navigate to the error page
    this.router.navigate(['/error']);
  }
}
