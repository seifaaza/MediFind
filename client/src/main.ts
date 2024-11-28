import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; // Import router
import { provideHttpClient } from '@angular/common/http'; // If you're using HTTP client
import { provideAnimations } from '@angular/platform-browser/animations'; // Import animations provider
import { AppComponent } from './app/app.component'; // Your main app component
import { routes } from './app/app.routes'; // Your routing configuration
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Router setup
    provideHttpClient(), // HTTP client setup
    provideAnimations(), // Enable animations
    importProvidersFrom(BrowserAnimationsModule), // Include BrowserAnimationsModule explicitly if needed
  ],
}).catch((err) => console.error(err));
