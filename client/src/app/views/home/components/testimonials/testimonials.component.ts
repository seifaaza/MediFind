import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lordIcon') lordIcon!: ElementRef;

  private fadeInObserver!: IntersectionObserver;
  private lordIconObserver!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Observer for fade-in elements
    this.fadeInObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible'); // Add visibility class
            this.fadeInObserver.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe icon and blockquote
    const fadeElement = this.el.nativeElement.querySelectorAll('.fade-in');
    fadeElement.forEach((el: HTMLElement) => {
      this.fadeInObserver.observe(el);
    });

    // Observer for lord-icon
    this.lordIconObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.lordIcon.nativeElement.setAttribute('trigger', 'in');
        }
      },
      { threshold: 0.2 }
    );

    this.lordIconObserver.observe(this.lordIcon.nativeElement);
  }

  ngOnDestroy(): void {
    this.fadeInObserver?.disconnect();
    this.lordIconObserver?.disconnect();
  }
}
