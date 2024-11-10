import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  links = [
    { label: 'Explore', icon: 'search', route: '/explore' },
    { label: 'Scan', icon: 'scan', route: '/scan' },
    { label: 'Community', icon: 'team', route: '/community' },
    { label: 'Resources', icon: 'export', route: '/resources' },
  ];

  activeLink = '';
  isOpen = false;

  constructor(private router: Router) {}

  @ViewChild('navbarHeader', { static: true }) navbarHeader!: ElementRef;

  ngOnInit(): void {
    this.updateBodyScroll();
  }

  setActiveLink(route: string): void {
    this.activeLink = route;
    this.closeMenu(); // Close the menu when a link is clicked
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

  isActive(route: string): boolean {
    return this.router.url === route || this.activeLink === route;
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
  }
}
