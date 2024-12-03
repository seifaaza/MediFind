import { Component } from '@angular/core';
import {
  RouterOutlet,
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { filter } from 'rxjs';
import { ErrorComponent } from './views/error/error.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ErrorComponent,
    NotFoundComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'medifind-client';
  showNavbarAndFooter = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute.root;

        // Traverse the route tree
        while (route.firstChild) {
          route = route.firstChild;
        }

        // Check if we are navigating to 'ErrorComponent' or 'NotFoundComponent'
        const isErrorOrNotFound =
          route.snapshot.component === ErrorComponent ||
          route.snapshot.component === NotFoundComponent;

        // Set navbar and footer visibility accordingly
        this.showNavbarAndFooter = !isErrorOrNotFound;
      });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page
        window.scrollTo(0, 0);
      }
    });
  }
}
