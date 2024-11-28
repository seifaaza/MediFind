import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    RouterModule,
    NzAvatarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  links = [
    { label: 'Medicines', icon: 'medicine-box', route: '/medicines' },
    { label: 'Community', icon: 'message', route: '/community' },
    { label: 'Guides', icon: 'book', route: '/guides' },
    { label: 'Events', icon: 'calendar', route: '/events' },
  ];

  isOpen = false;
  isNotHome = false;

  isAuthenticated = false;
  username: string | null = null;

  private usernameSubscription: Subscription | null = null;
  constructor(private router: Router, private authService: AuthService) {}

  @ViewChild('navbarHeader', { static: true }) navbarHeader!: ElementRef;

  ngOnInit(): void {
    // Subscribe to username updates to track login status
    this.usernameSubscription = this.authService
      .getUsername()
      .subscribe((username) => {
        this.username = username;
        this.isAuthenticated = !!username; // Set authentication status based on username
      });

    // Subscribe to route changes to update `isNotHome`
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isNotHome = event.urlAfterRedirects !== '/';
      });
  }

  updateUsername(): void {
    const user = this.authService.getDecodedToken();
    if (user) {
      this.username = user.username;
    } else {
      this.username = null;
    }
  }

  closeMenu(): void {
    this.isOpen = false;
    this.updateBodyScroll();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (this.isOpen && !this.navbarHeader.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
    this.updateBodyScroll();
  }

  updateBodyScroll(): void {
    if (this.isOpen) {
      document.body.classList.add('overflow-hidden', 'lg:overflow-scroll');
    } else {
      document.body.classList.remove('overflow-hidden', 'lg:overflow-scroll');
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('overflow-hidden', 'lg:overflow-scroll');
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }

  logout(): void {
    this.authService.logout(); // Clear authentication data
    this.isAuthenticated = false; // Update the authentication state
    this.router.navigate(['/']); // Redirect to the home page or sign-in page
    this.closeMenu();
  }

  navigateToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }
}
