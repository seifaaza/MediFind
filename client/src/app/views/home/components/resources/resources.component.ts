import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent implements AfterViewInit, OnDestroy {
  // Array of image sources
  imageSources: string[] = [
    '/cdc.svg',
    '/who.svg',
    '/fda.svg',
    '/nhs.svg',
    '/medscape.svg',
    '/nih.svg',
  ];

  // Section element for fade-in
  section: HTMLElement | null = null;
  sectionObserver: IntersectionObserver | null = null;
  titleObserver: IntersectionObserver | null = null; // Declare titleObserver

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const section = this.el.nativeElement.querySelectorAll('.fade-in');
    const title = this.el.nativeElement.querySelector('.title-fade-in');
    // Access the section element
    this.section = this.el.nativeElement.querySelector('.section-fade-in');

    if (this.section) {
      // Observer for the section fade-in
      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.section?.classList.add('fade-in-visible');
            }
          });
        },
        { threshold: 0.8 }
      );

      // Observe the section element
      this.sectionObserver.observe(this.section);
    }

    // Initialize the observer for the title
    if (title) {
      this.titleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('fade-in-visible');
              this.titleObserver?.unobserve(entry.target); // Unobserve once visible
            }
          });
        },
        { threshold: 0.8 }
      );

      this.titleObserver.observe(title);
    }
  }

  ngOnDestroy(): void {
    // Disconnect observers
    this.sectionObserver?.disconnect();
    this.titleObserver?.disconnect();
  }
}
