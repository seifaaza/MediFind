import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  Router,
  RouterModule,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { Subscription } from 'rxjs';

// Interfaces for type safety
interface Link {
  label: string;
  icon: string;
  route: string;
  dropdownItems?: DropdownItem[];
}

interface DropdownItem {
  label: string;
  icon: string;
  route: string;
  fragment?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    RouterModule,
    NzAvatarModule,
    NzDropDownModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  links: Link[] = [
    { label: 'Medicines', icon: 'medicine-box', route: '/medicines' },
    { label: 'Community', icon: 'message', route: '/community' },
    {
      label: 'Topics',
      icon: 'book',
      route: '/topics',
      dropdownItems: [
        {
          label: 'Health Essentials',
          icon: 'heart',
          route: '/topics/health-essentials',
        },
        {
          label: 'Preventive Care',
          icon: 'safety',
          route: '/topics/preventive-care',
        },
        {
          label: 'Nutrition & Healthy Eating',
          icon: 'coffee',
          route: '/topics/nutrition',
        },
        {
          label: 'Fitness & Physical Health',
          icon: 'thunderbolt',
          route: '/topics/fitness',
        },
        {
          label: 'Mental Well-being',
          icon: 'smile',
          route: '/topics/mental-well-being',
        },
        {
          label: 'Addiction Recovery & Support',
          icon: 'sync',
          route: '/topics/addiction',
        },
      ],
    },
    {
      label: 'Events',
      icon: 'calendar',
      route: '/events',
      dropdownItems: [
        {
          label: 'Blood Donation',
          route: '/events',
          icon: 'arrow-right',
          fragment: 'blood-donation',
        },
        {
          label: 'Awareness Camps',
          route: '/events',
          icon: 'arrow-right',
          fragment: 'awareness',
        },
        {
          label: 'Vaccination Campaigns',
          route: '/events',
          icon: 'arrow-right',
          fragment: 'vaccination',
        },
      ],
    },
  ];

  isOpen = false;
  isNotHome = false;

  isAuthenticated = false;
  username: string | null = null;

  private usernameSubscription: Subscription | null = null;
  private navigationSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  @ViewChild('navbarHeader', { static: true }) navbarHeader!: ElementRef;
  @ViewChild('eventsMenu', { static: false }) eventsMenu!: ElementRef;

  ngOnInit(): void {
    this.usernameSubscription = this.authService
      .getUsername()
      .subscribe((username) => {
        this.username = username;
        this.isAuthenticated = !!username;
      });

    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.activatedRoute.snapshot.fragment;
        if (fragment) {
          this.scrollToFragment(fragment);
        }
      });
    // Subscribe to route changes to update `isNotHome`
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isNotHome = event.urlAfterRedirects !== '/';
      });
  }

  scrollToFragment(fragment: string): void {
    setTimeout(() => {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100); // Delay to ensure DOM is ready
  }

  navigateWithFragment(route: string, fragment: string): void {
    this.router.navigate([route], { fragment }).then(() => {
      this.scrollToFragment(fragment);
    });
  }

  navigateWithoutFragment(route: string): void {
    this.router.navigate([route]);
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

  logout(): void {
    this.authService.logout(); // Clear authentication data
    this.isAuthenticated = false; // Update the authentication state
    this.router.navigate(['/']); // Redirect to the home page or sign-in page
    this.closeMenu();
  }

  navigateToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('overflow-hidden', 'lg:overflow-scroll');
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
