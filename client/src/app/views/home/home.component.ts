import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { FaqComponent } from './components/faq/faq.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ResourcesComponent } from './components/resources/resources.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    ExploreComponent,
    ResourcesComponent,
    TestimonialsComponent,
    FaqComponent,
    NewsletterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
