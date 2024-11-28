import { Component } from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { FeaturesComponent } from './components/features/features.component';
import { BackHomeComponent } from '../../core/components/back-home/back-home.component';

@Component({
  selector: 'app-learn-more',
  standalone: true,
  imports: [AboutComponent, FeaturesComponent, BackHomeComponent],
  templateUrl: './learn-more.component.html',
  styleUrl: './learn-more.component.css',
})
export class LearnMoreComponent {}
