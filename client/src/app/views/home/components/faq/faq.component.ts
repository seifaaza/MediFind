import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements AfterViewInit, OnDestroy {
  faqs = [
    {
      question: 'How does MediFind recommend medicines?',
      answer:
        'MediFind personalizes medicine recommendations using your medical history, preferences, and symptoms.',
    },
    {
      question: 'Can I track my health and medication usage?',
      answer:
        'Yes, you can track your health, medication, and set dose reminders with MediFind.',
    },
    {
      question: 'What community features are available?',
      answer:
        'MediFind offers forums and a review system for sharing medicine experiences.',
    },
    {
      question: 'How does MediFind educate users?',
      answer:
        'MediFind provides articles, guides, and videos on health, treatments, and wellness tips.',
    },
  ];

  private observer!: IntersectionObserver;
  private titleObserver!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const sections = this.el.nativeElement.querySelectorAll('.fade-in');
    const title = this.el.nativeElement.querySelector('.title-fade-in');

    // Initialize the observer for FAQ sections
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            this.observer.unobserve(entry.target); // Stop observing once it’s visible
          }
        });
      },
      { threshold: 0.8 }
    );

    sections.forEach((section: Element) => this.observer.observe(section));

    // Initialize the observer for the title
    if (title) {
      this.titleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('fade-in-visible');
              this.titleObserver.unobserve(entry.target); // Unobserve once visible
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
    this.observer?.disconnect();
    this.titleObserver?.disconnect();
  }
}
