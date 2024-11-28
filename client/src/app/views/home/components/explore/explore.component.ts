import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExploreComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver; // Using the '!' to assert it will be initialized
  private titleObserver!: IntersectionObserver; // Same for titleObserver

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const sections = this.el.nativeElement.querySelectorAll('.fade-in');
    const icons = this.el.nativeElement.querySelectorAll('lord-icon');

    let delay = 0;

    // Create the IntersectionObserver for sections
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('fade-in-visible');
              if (icons[index]) {
                const icon = icons[index];
                icon.setAttribute('trigger', 'in');
              }
            }, delay);
            delay += 200;
          }
        });
      },
      { threshold: 0.8 }
    );

    sections.forEach((section: Element) => this.observer.observe(section));

    const title = this.el.nativeElement.querySelector('.title-fade-in');

    // Observer for the title fade-in
    this.titleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            title.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.8 }
    );

    this.titleObserver.observe(title);
  }

  ngOnDestroy(): void {
    // Disconnect observers when component is destroyed to avoid memory leaks
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.titleObserver) {
      this.titleObserver.disconnect();
    }
  }
}
