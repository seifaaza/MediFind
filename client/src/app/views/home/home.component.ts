import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { StatsComponent } from './components/stats/stats.component';
import { ClientsComponent } from './components/clients/clients.component';
import { FaqComponent } from './components/faq/faq.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    ClientsComponent,
    TestimonialsComponent,
    StatsComponent,
    FaqComponent,
    NewsletterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
